/**
 * GeldGarant Intake API (Cloudflare Worker)
 * =========================================
 * Vervangt de oude backend op api.geldgarant.com. Zelfde API-contract als
 * het Framer IncassoForm verwacht, dus de formuliercode hoeft niet te wijzigen.
 *
 * Endpoints
 *   POST   /api/incasso-session     Turnstile check, geeft dossierId + sessionToken
 *   POST   /api/incasso-upload      Bijlagen opslaan (multipart, veld "bestanden")
 *   DELETE /api/incasso-upload      Bijlagen opruimen na mislukte indiening
 *   POST   /api/incasso-aanvragen   Aanvraag indienen, mailt klant + GeldGarant
 *   POST   /api/contact             Contactformulier, mailt klant + GeldGarant
 *   GET    /api/location/search     Adres zoeken via PDOK (Kadaster), gratis
 *   GET    /api/bestand             Ondertekende downloadlink voor bijlagen (intern)
 *   GET    /health, /api/health     Configuratiecheck (toont geen geheimen)
 *
 * Bindings / variabelen (zie README.md)
 *   KV namespace     INTAKE
 *   Secrets          TURNSTILE_SECRET (oude naam TURNSTILE_SECRET_KEY werkt ook),
 *                    SESSION_SECRET (oude naam INTAKE_SESSION_SECRET werkt ook), RESEND_API_KEY,
 *                    optioneel TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
 *   Vars             MAIL_FROM, MAIL_TO_INTERNAL, MAIL_REPLY_TO, ALLOWED_ORIGINS,
 *                    ALLOW_FRAMER_PREVIEW, CONTACT_PHONE, CONTACT_EMAIL, PUBLIC_BASE_URL
 */

const SESSION_TTL_SEC = 60 * 60 // 1 uur om het formulier af te ronden
const UPLOAD_TTL_SEC = 60 * 60 * 24 * 30 // bijlagen 30 dagen bewaren
const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_ATTACH_TOTAL_BYTES = 20 * 1024 * 1024 // groter wordt alleen als link meegestuurd
const TURNSTILE_ACTIONS = { intake: "incasso_submit", contact: "contact_submit" }

const CONTACT_TOPIC_LABELS = {
    debiteurenbeheer: "Debiteurenbeheer",
    incasso: "Incasso starten",
    buitenland: "Buitenlandse vordering / incasso",
    wik_brief: "WIK-brief / 14-dagenbrief",
    bestaand_dossier: "Bestaand dossier",
    klacht_geschil: "Klacht of geschil",
    privacy_avg: "Privacy / AVG",
    werkwijze_wki_nowid: "Werkwijze / Wki / NowID",
    algemene_vraag: "Algemene vraag",
    terugbelverzoek: "Terugbelverzoek",
}

const MAGIC_BYTES = {
    "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]],
}

const BLAUW = "#3f68f5"

export default {
    async fetch(request, rawEnv, ctx) {
        const env = normalizeEnv(rawEnv)
        const url = new URL(request.url)
        const origin = request.headers.get("Origin") || ""
        const cors = corsHeaders(origin, env)

        if (request.method === "OPTIONS") {
            return new Response(null, { status: cors ? 204 : 403, headers: cors || {} })
        }

        // Schrijfacties alleen vanaf de eigen site (en Framer preview indien aan)
        if (request.method !== "GET" && !cors) {
            return json({ ok: false, error: "Niet toegestaan vanaf dit domein." }, 403)
        }

        try {
            const route = `${request.method} ${url.pathname.replace(/\/+$/, "")}`
            let res
            switch (route) {
                case "POST /api/incasso-session":
                    res = await handleSession(request, env)
                    break
                case "POST /api/incasso-upload":
                    res = await handleUpload(request, env)
                    break
                case "DELETE /api/incasso-upload":
                    res = await handleCleanup(request, env)
                    break
                case "POST /api/incasso-aanvragen":
                    res = await handleSubmit(request, env, ctx)
                    break
                case "POST /api/contact":
                    res = await handleContact(request, env, ctx)
                    break
                case "GET /api/location/search":
                    res = await handleLocationSearch(url, ctx)
                    break
                case "GET /api/bestand":
                    res = await handleDownload(url, env)
                    break
                case "GET /health":
                case "GET /api/health":
                case "GET ":
                    res = handleHealth(env)
                    break
                default:
                    res = json({ ok: false, error: "Niet gevonden." }, 404)
            }
            return withHeaders(res, cors)
        } catch (err) {
            console.error("Onverwachte fout", err && err.stack ? err.stack : err)
            return withHeaders(
                json({ ok: false, error: "Uw aanvraag kon op dit moment niet worden verwerkt. Probeer het opnieuw of neem contact met ons op." }, 500),
                cors
            )
        }
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// Session: Turnstile check + dossiernummer + ondertekend sessietoken
// ─────────────────────────────────────────────────────────────────────────────

async function handleSession(request, env) {
    const body = await readJson(request)
    const nonce = cleanNonce(body && body.nonce)
    const token = String((body && body.turnstile_token) || "")
    if (!nonce) return json({ ok: false, error: "Ongeldige aanvraag. Vernieuw de pagina en probeer het opnieuw." }, 400)

    const check = await verifyTurnstile(token, request, env, TURNSTILE_ACTIONS.intake)
    if (!check.ok) {
        return json({ ok: false, error: "De beveiligingscheck is verlopen of mislukt. Voer de beveiligingscheck opnieuw uit." }, 403)
    }

    const dossierId = await makeDossierId(env)
    const sessionToken = await signToken(env, { d: dossierId, n: nonce, e: nowSec() + SESSION_TTL_SEC })
    return json({ ok: true, dossierId, sessionToken })
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload
// ─────────────────────────────────────────────────────────────────────────────

async function handleUpload(request, env) {
    if (!env.INTAKE) return json({ ok: false, error: "Upload opslag is niet geconfigureerd." }, 500)

    let form
    try {
        form = await request.formData()
    } catch {
        return json({ ok: false, error: "Ongeldige upload." }, 400)
    }
    const dossierId = String(form.get("dossier_id") || "")
    const nonce = cleanNonce(form.get("nonce"))
    const session = await verifyToken(env, String(form.get("session_token") || ""))
    if (!session || session.d !== dossierId || session.n !== nonce) {
        return json({ ok: false, error: "Sessie verlopen. Vernieuw de pagina en probeer het opnieuw." }, 401)
    }

    const files = form.getAll("bestanden").filter((f) => f && typeof f === "object" && "arrayBuffer" in f)
    if (!files.length) return json({ ok: true, bestanden: [] })
    if (files.length > MAX_FILES) return json({ ok: false, error: `Maximaal ${MAX_FILES} bestanden toegestaan.` }, 400)

    const opgeslagen = []
    for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const type = String(f.type || "").toLowerCase()
        if (!MAGIC_BYTES[type]) return json({ ok: false, error: "Alleen PDF, JPG, PNG of WEBP bestanden toegestaan." }, 400)
        if (f.size > MAX_FILE_BYTES) return json({ ok: false, error: "Een bestand is groter dan 10 MB." }, 400)
        const buf = await f.arrayBuffer()
        if (!matchesMagic(new Uint8Array(buf), type)) {
            return json({ ok: false, error: "Een bestand komt niet overeen met het opgegeven type." }, 400)
        }
        const naam = sanitizeFilename(f.name || `bijlage-${i + 1}`)
        const key = `upload/${dossierId}/${i + 1}-${naam}`
        await env.INTAKE.put(key, buf, {
            expirationTtl: UPLOAD_TTL_SEC,
            metadata: { naam, type, grootte: buf.byteLength },
        })
        opgeslagen.push({ naam, grootte: buf.byteLength, type, storage_bucket: "kv", storage_path: key })
    }
    return json({ ok: true, bestanden: opgeslagen })
}

async function handleCleanup(request, env) {
    const body = await readJson(request)
    const dossierId = String((body && body.dossier_id) || "")
    const session = await verifyToken(env, String((body && body.session_token) || ""))
    if (!session || session.d !== dossierId) return json({ ok: false }, 401)
    // Niet opruimen als de aanvraag al is ingediend
    if (env.INTAKE && (await env.INTAKE.get(`used/${dossierId}`))) return json({ ok: true, removed: 0 })

    const paths = Array.isArray(body.storage_paths) ? body.storage_paths : []
    let removed = 0
    for (const p of paths.slice(0, MAX_FILES)) {
        const key = String(p || "")
        if (key.startsWith(`upload/${dossierId}/`)) {
            await env.INTAKE.delete(key)
            removed++
        }
    }
    return json({ ok: true, removed })
}

// ─────────────────────────────────────────────────────────────────────────────
// Aanvraag indienen
// ─────────────────────────────────────────────────────────────────────────────

async function handleSubmit(request, env, ctx) {
    const p = await readJson(request)
    if (!p || p.type !== "incasso_aanvraag") return json({ ok: false, error: "Ongeldige aanvraag." }, 400)

    // 1. Beveiliging: sessietoken (normale route) of direct Turnstile token
    let dossierId = ""
    const nonce = cleanNonce(p.nonce)
    if (p.session_token) {
        const s = await verifyToken(env, String(p.session_token))
        if (!s || s.n !== nonce || (p.dossier_id && s.d !== p.dossier_id)) {
            return json({ ok: false, error: "Sessie verlopen. Vernieuw de pagina en probeer het opnieuw." }, 401)
        }
        dossierId = s.d
    } else {
        const check = await verifyTurnstile(String(p.turnstile_token || ""), request, env, TURNSTILE_ACTIONS.intake)
        if (!check.ok) return json({ ok: false, error: "De beveiligingscheck is mislukt. Voer de beveiligingscheck opnieuw uit." }, 403)
        dossierId = await makeDossierId(env)
    }

    // Dubbel indienen voorkomen (zelfde sessie)
    if (env.INTAKE && (await env.INTAKE.get(`used/${dossierId}`))) {
        return json({ ok: true, accepted: true, dossierId, duplicate: true })
    }

    // 2. Validatie
    const v = validatePayload(p)
    if (v) return json({ ok: false, error: v }, 400)

    const a = p.aanvrager
    const b = p.bedrijf
    const vord = p.vordering
    const d = vord.debiteur

    // 3. Bijlagen ophalen (alleen eigen dossier)
    const docs = Array.isArray(vord.documenten) ? vord.documenten.slice(0, MAX_FILES) : []
    const bijlagen = []
    let attachBytes = 0
    for (const doc of docs) {
        const key = String((doc && doc.storage_path) || "")
        if (!key.startsWith(`upload/${dossierId}/`) || !env.INTAKE) continue
        const { value, metadata } = await env.INTAKE.getWithMetadata(key, { type: "arrayBuffer" })
        if (!value) continue
        const meta = metadata || {}
        const link = await signedFileUrl(env, request, key)
        const item = { naam: meta.naam || doc.naam || "bijlage", type: meta.type || doc.type, grootte: value.byteLength, link }
        if (attachBytes + value.byteLength <= MAX_ATTACH_TOTAL_BYTES) {
            attachBytes += value.byteLength
            item.content = toBase64(value)
        }
        bijlagen.push(item)
    }

    // 4. Backup opslaan VOOR het mailen, zodat er nooit een aanvraag verloren gaat
    const ontvangen = new Date().toISOString()
    const record = {
        dossierId,
        ontvangen,
        aanvrager: a,
        bedrijf: b,
        vordering: { ...vord, documenten: bijlagen.map(({ content, ...rest }) => rest) },
        toestemmingen: p.toestemmingen,
        metadata: {
            ...(p.metadata || {}),
            ip_land: (request.cf && request.cf.country) || "",
            user_agent: (request.headers.get("User-Agent") || "").slice(0, 200),
        },
        // Wachtwoord wordt bewust NIET opgeslagen of gemaild
        portaal_wachtwoord_gekozen: Boolean(p.account && p.account.wachtwoord),
    }
    if (env.INTAKE) {
        await env.INTAKE.put(`aanvraag/${dossierId}`, JSON.stringify(record))
        await env.INTAKE.put(`used/${dossierId}`, ontvangen, { expirationTtl: UPLOAD_TTL_SEC })
    }

    // 5. Bevestiging naar klant
    const klantMail = await sendMail(env, {
        to: [a.email],
        reply_to: env.MAIL_REPLY_TO || env.CONTACT_EMAIL,
        subject: `Bevestiging incasso-aanvraag ${dossierId}`,
        html: klantHtml(record, env),
        text: klantText(record, env),
    })

    // 6. Melding naar GeldGarant
    const internMail = await sendMail(env, {
        to: splitList(env.MAIL_TO_INTERNAL),
        reply_to: a.email,
        subject: `Nieuwe incasso-aanvraag ${dossierId} | ${b.naam} | ${euro(vord.bedrag)}`,
        html: internHtml(record, klantMail, bijlagen),
        text: internText(record, klantMail, bijlagen),
        attachments: bijlagen
            .filter((x) => x.content)
            .map((x) => ({ filename: x.naam, content: x.content })),
    })

    const tg = await sendTelegram(
        env,
        `Nieuwe incasso-aanvraag ${dossierId}\n${b.naam}\nDebiteur: ${d.naam}\nBedrag: ${euro(vord.bedrag)}\nContact: ${a.voornaam} ${a.achternaam}, ${a.telefoon || a.email}${internMail.ok ? "" : "\nLET OP: interne mail mislukt, aanvraag staat in backup"}`
    )

    if (env.INTAKE) {
        record.mail = { klant: klantMail.ok, intern: internMail.ok, telegram: tg.ok }
        ctx.waitUntil(env.INTAKE.put(`aanvraag/${dossierId}`, JSON.stringify(record)))
    }

    if (!internMail.ok && !tg.ok) {
        // Aanvraag staat veilig in de backup, maar het team is niet gemaild.
        // accepted:false laat het formulier de bijlagen bewaren en een referentie tonen.
        console.error("Interne mail mislukt", dossierId, internMail.error)
        return json({ ok: false, accepted: false, dossierId })
    }
    return json({ ok: true, accepted: true, dossierId })
}

function validatePayload(p) {
    const a = p.aanvrager || {}
    const b = p.bedrijf || {}
    const v = p.vordering || {}
    const d = v.debiteur || {}
    const t = p.toestemmingen || {}
    if (!str(a.voornaam) || !str(a.achternaam)) return "Vul uw voor- en achternaam in."
    if (!isEmail(a.email)) return "Vul een geldig e-mailadres in."
    if (!str(b.naam)) return "Vul uw bedrijfsnaam in."
    if (!str(d.naam)) return "Vul de naam van de debiteur in."
    const bedrag = Number(v.bedrag)
    if (!Number.isFinite(bedrag) || bedrag <= 0 || bedrag > 10_000_000) return "Voer een geldig bedrag in."
    if (t.akkoord_av !== true || t.akkoord_avg !== true) return "Ga akkoord met de voorwaarden en het privacybeleid."
    // lengtelimieten tegen misbruik
    const totaal = JSON.stringify(p).length
    if (totaal > 50_000) return "De aanvraag is te groot."
    return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Adres zoeken via PDOK Locatieserver (gratis, geen sleutel nodig)
// ─────────────────────────────────────────────────────────────────────────────

async function handleLocationSearch(url, ctx) {
    const q = String(url.searchParams.get("q") || "").trim().slice(0, 100)
    const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "5", 10) || 5, 1), 10)
    if (q.length < 2) return json([])

    const pdok = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/free")
    pdok.searchParams.set("q", q)
    pdok.searchParams.set("fq", "type:adres")
    pdok.searchParams.set("rows", String(limit))
    pdok.searchParams.set("fl", "id,weergavenaam,straatnaam,huisnummer,huisletter,huisnummertoevoeging,postcode,woonplaatsnaam")

    const cache = typeof caches !== "undefined" ? caches.default : null
    const cacheKey = new Request(pdok.toString())
    let res = cache ? await cache.match(cacheKey) : null
    if (!res) {
        res = await fetch(pdok.toString(), { headers: { Accept: "application/json" } })
        if (res.ok && cache) {
            const copy = new Response(res.clone().body, res)
            copy.headers.set("Cache-Control", "public, max-age=86400")
            ctx.waitUntil(cache.put(cacheKey, copy))
        }
    }
    if (!res.ok) return json([], 200)
    const data = await res.json().catch(() => ({}))
    const docs = (data.response && data.response.docs) || []
    const out = docs.map((x) => ({
        id: String(x.id || ""),
        label: String(x.weergavenaam || ""),
        street: String(x.straatnaam || ""),
        houseNumber: [x.huisnummer, x.huisletter].filter(Boolean).join("") + (x.huisnummertoevoeging ? `-${x.huisnummertoevoeging}` : ""),
        postcode: String(x.postcode || ""),
        city: String(x.woonplaatsnaam || ""),
    }))
    return json(out)
}

// ─────────────────────────────────────────────────────────────────────────────
// Contactformulier (zelfde contract als de oude backend)
// ─────────────────────────────────────────────────────────────────────────────

async function handleContact(request, env, ctx) {
    const raw = await readJson(request)
    if (!raw) return json({ ok: false, error: "Ongeldige aanvraag." }, 400)
    const headerNonce = cleanNonce(request.headers.get("X-Request-Nonce"))
    if (!headerNonce || headerNonce !== cleanNonce(raw.nonce)) {
        return json({ ok: false, error: "De beveiligingscontrole van het formulier is mislukt. Vernieuw de pagina en probeer het opnieuw." }, 400)
    }
    // Turnstile is optioneel bij contact (zoals voorheen), maar als er een token is moet hij kloppen
    const tsToken = String(raw.turnstile_token || raw.turnstileToken || "")
    if (tsToken) {
        const check = await verifyTurnstile(tsToken, request, env, TURNSTILE_ACTIONS.contact)
        if (!check.ok) return json({ ok: false, error: "De beveiligingscheck is mislukt. Voer de beveiligingscheck opnieuw uit." }, 400)
    }

    const onderwerp = raw.onderwerp || {}
    const c = raw.contact || {}
    const det = raw.details || {}
    const meta = raw.metadata || {}
    const topicKey = normalizeTopic(onderwerp.key || onderwerp.label)
    const voorkeur = str(c.voorkeur_contact || c.voorkeurContact).toLowerCase()
    const tel = str(c.telefoon).replace(/[^0-9+\s()\-]/g, "").slice(0, 30)

    if (!topicKey) return json({ ok: false, error: "Onderwerp ontbreekt." }, 400)
    if (!str(c.naam)) return json({ ok: false, error: "Naam ontbreekt." }, 400)
    if (!str(c.bedrijfsnaam)) return json({ ok: false, error: "Bedrijfsnaam ontbreekt." }, 400)
    if (!isEmail(c.email)) return json({ ok: false, error: "E-mailadres ontbreekt of is ongeldig." }, 400)
    if (!["email", "telefoon", "whatsapp"].includes(voorkeur)) return json({ ok: false, error: "Voorkeur voor contact ontbreekt." }, 400)
    if ((voorkeur === "telefoon" || voorkeur === "whatsapp") && tel.replace(/\D/g, "").length < 9) {
        return json({ ok: false, error: "Telefoonnummer ontbreekt voor de gekozen contactvoorkeur." }, 400)
    }
    const toelichting = str(det.toelichting).slice(0, 2000)
    if (toelichting.length < 10) return json({ ok: false, error: "Toelichting ontbreekt of is te kort." }, 400)
    if (JSON.stringify(raw).length > 30_000) return json({ ok: false, error: "Het bericht is te groot." }, 400)

    const requestId = `GG-CONT-${new Date().getFullYear()}-${String(crypto.getRandomValues(new Uint32Array(1))[0] % 100000).padStart(5, "0")}`
    const record = {
        requestId,
        ontvangen: new Date().toISOString(),
        onderwerp: CONTACT_TOPIC_LABELS[topicKey],
        contact: { naam: str(c.naam).slice(0, 120), bedrijfsnaam: str(c.bedrijfsnaam).slice(0, 200), email: str(c.email).toLowerCase(), telefoon: tel, voorkeur },
        details: {
            toelichting,
            dossiernummer: str(det.dossiernummer).slice(0, 80),
            land: str(det.land).slice(0, 120),
            openstaand_bedrag: num(det.openstaand_bedrag ?? det.openstaandBedrag),
            debiteur_type: str(det.debiteur_type ?? det.debiteurType).slice(0, 40),
            factuur_vervallen: str(det.factuur_vervallen ?? det.factuurVervallen).slice(0, 40),
            aantal_facturen: str(det.aantal_facturen ?? det.aantalFacturen).slice(0, 80),
            gemiddelde_factuurwaarde: num(det.gemiddelde_factuurwaarde ?? det.gemiddeldeFactuurwaarde),
            communicatie_in_naam: Boolean(det.communicatie_in_naam ?? det.communicatieInNaam),
            terugbel_moment: str(det.terugbel_moment ?? det.terugbelMoment).slice(0, 160),
        },
        metadata: {
            bron_pagina: str(meta.bron_pagina ?? meta.bronPagina).slice(0, 255),
            referrer: str(meta.referrer).slice(0, 255),
            utm: [meta.utm_source ?? meta.utmSource, meta.utm_medium ?? meta.utmMedium, meta.utm_campaign ?? meta.utmCampaign].filter(Boolean).join(" / ").slice(0, 300),
            cta: str(meta.cta).slice(0, 160),
        },
    }
    if (env.INTAKE) await env.INTAKE.put(`contact/${requestId}`, JSON.stringify(record))

    const r = record
    const klantMail = await sendMail(env, {
        to: [r.contact.email],
        reply_to: env.MAIL_REPLY_TO || env.CONTACT_EMAIL,
        subject: `Wij hebben uw bericht ontvangen (${requestId})`,
        html: layout(
            `<p>Beste ${esc(r.contact.naam)},</p>
<p>Bedankt voor uw bericht over <strong>${esc(r.onderwerp)}</strong>. Wij hebben het ontvangen onder referentie <strong style="color:${BLAUW}">${esc(requestId)}</strong> en nemen zo snel mogelijk contact met u op via ${esc(voorkeurLabel(voorkeur))}.</p>
<p style="margin:18px 0 0">Met vriendelijke groet,<br>Team GeldGarant</p>`,
            env
        ),
        text: `Beste ${r.contact.naam},\n\nBedankt voor uw bericht over ${r.onderwerp}. Wij hebben het ontvangen onder referentie ${requestId} en nemen zo snel mogelijk contact met u op via ${voorkeurLabel(voorkeur)}.\n\nMet vriendelijke groet,\nTeam GeldGarant`,
    })
    const d = r.details
    const internMail = await sendMail(env, {
        to: splitList(env.MAIL_TO_INTERNAL),
        reply_to: r.contact.email,
        subject: `Contactaanvraag ${requestId} | ${r.onderwerp} | ${r.contact.bedrijfsnaam}`,
        html: layout(
            `<p style="margin:0 0 6px;font-size:18px;font-weight:bold">Nieuwe contactaanvraag ${esc(requestId)}</p>
<p style="margin:0 0 6px;color:#64748b">Ontvangen ${esc(datumTijd(r.ontvangen))}. Beantwoorden gaat direct naar de afzender.</p>
${klantMail.ok ? "" : `<p style="margin:10px 0;padding:10px 12px;background:#fee2e2;color:#991b1b;border-radius:8px">Let op: de bevestigingsmail naar de afzender is NIET verstuurd.</p>`}
${h("Contact")}
${rows([["Onderwerp", r.onderwerp], ["Naam", r.contact.naam], ["Bedrijf", r.contact.bedrijfsnaam], ["E-mail", r.contact.email], ["Telefoon", r.contact.telefoon], ["Voorkeur", voorkeurLabel(voorkeur)], ["Terugbelmoment", d.terugbel_moment]])}
${h("Details")}
${rows([["Toelichting", d.toelichting], ["Dossiernummer", d.dossiernummer], ["Land", d.land], ["Openstaand bedrag", d.openstaand_bedrag != null ? euro(d.openstaand_bedrag) : ""], ["Type debiteur", d.debiteur_type], ["Factuur vervallen", d.factuur_vervallen], ["Aantal facturen", d.aantal_facturen], ["Gem. factuurwaarde", d.gemiddelde_factuurwaarde != null ? euro(d.gemiddelde_factuurwaarde) : ""], ["Communicatie in eigen naam", d.communicatie_in_naam ? "Ja" : ""]])}
${h("Herkomst")}
${rows([["Pagina", r.metadata.bron_pagina], ["Referrer", r.metadata.referrer], ["UTM", r.metadata.utm], ["CTA", r.metadata.cta]])}`,
            {}
        ),
        text: `Contactaanvraag ${requestId}\n${r.onderwerp}\n${r.contact.naam} | ${r.contact.bedrijfsnaam} | ${r.contact.email} | ${r.contact.telefoon}\nVoorkeur: ${voorkeur}\n\n${d.toelichting}`,
    })
    const tg = await sendTelegram(
        env,
        `Nieuwe contactaanvraag ${requestId}\n${r.onderwerp}\n${r.contact.naam} (${r.contact.bedrijfsnaam})\n${r.contact.telefoon || r.contact.email}, voorkeur ${voorkeur}\n\n${d.toelichting.slice(0, 500)}`
    )
    if (!internMail.ok && !tg.ok) {
        console.error("Contact: interne melding mislukt", requestId, internMail.error)
        return json({ ok: false, accepted: false, requestId, error: `Uw aanvraag is ontvangen onder referentie ${requestId}, maar nog niet volledig verwerkt. Verstuur het bericht niet opnieuw en neem direct contact op met GeldGarant.` }, 202)
    }
    return json({ ok: true, accepted: true, requestId })
}

function normalizeTopic(v) {
    const s = str(v).toLowerCase()
    if (!s) return ""
    if (CONTACT_TOPIC_LABELS[s]) return s
    const hit = Object.entries(CONTACT_TOPIC_LABELS).find(([, label]) => label.toLowerCase() === s)
    return hit ? hit[0] : "algemene_vraag"
}

function voorkeurLabel(v) {
    return v === "telefoon" ? "telefoon" : v === "whatsapp" ? "WhatsApp" : "e-mail"
}

function num(v) {
    if (v === null || v === undefined || v === "") return null
    const n = Number(String(v).replace(/\./g, "").replace(",", "."))
    return Number.isFinite(n) ? n : null
}

// Telegram melding (optioneel): TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
async function sendTelegram(env, message) {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return { ok: false, skipped: true }
    try {
        const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message.slice(0, 4000), disable_web_page_preview: true }),
        })
        if (!r.ok) console.error("Telegram fout", r.status, await r.text().catch(() => ""))
        return { ok: r.ok }
    } catch (e) {
        console.error("Telegram onbereikbaar", e)
        return { ok: false }
    }
}

// Oude variabelenamen van de vorige backend ook accepteren
function normalizeEnv(e) {
    return {
        ...e,
        INTAKE: e.INTAKE,
        TURNSTILE_SECRET: e.TURNSTILE_SECRET || e.TURNSTILE_SECRET_KEY,
        SESSION_SECRET: e.SESSION_SECRET || e.INTAKE_SESSION_SECRET,
        ALLOWED_ORIGINS: e.ALLOWED_ORIGINS || e.INTAKE_ALLOWED_ORIGINS,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Ondertekende download van bijlagen (link staat in de interne mail)
// ─────────────────────────────────────────────────────────────────────────────

async function signedFileUrl(env, request, key) {
    const exp = nowSec() + UPLOAD_TTL_SEC
    const sig = await hmac(env, `file:${key}:${exp}`)
    const base = (env.PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/+$/, "")
    return `${base}/api/bestand?k=${encodeURIComponent(key)}&e=${exp}&s=${sig}`
}

async function handleDownload(url, env) {
    const key = String(url.searchParams.get("k") || "")
    const exp = parseInt(url.searchParams.get("e") || "0", 10)
    const sig = String(url.searchParams.get("s") || "")
    if (!key.startsWith("upload/") || !exp || exp < nowSec()) return text("Link verlopen of ongeldig.", 403)
    const expected = await hmac(env, `file:${key}:${exp}`)
    if (!timingSafeEqual(sig, expected)) return text("Link verlopen of ongeldig.", 403)
    const { value, metadata } = await env.INTAKE.getWithMetadata(key, { type: "arrayBuffer" })
    if (!value) return text("Bestand niet meer beschikbaar.", 404)
    const meta = metadata || {}
    return new Response(value, {
        headers: {
            "Content-Type": meta.type || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${sanitizeFilename(meta.naam || "bijlage")}"`,
            "Cache-Control": "private, no-store",
        },
    })
}

function handleHealth(env) {
    return json({
        ok: true,
        service: "geldgarant-intake",
        config: {
            kv_intake: Boolean(env.INTAKE),
            turnstile_secret: Boolean(env.TURNSTILE_SECRET),
            session_secret: Boolean(env.SESSION_SECRET),
            resend_api_key: Boolean(env.RESEND_API_KEY),
            telegram: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
            mail_from: env.MAIL_FROM || null,
            mail_to_internal: splitList(env.MAIL_TO_INTERNAL).length,
            allowed_origins: splitList(env.ALLOWED_ORIGINS),
        },
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Diensten: Turnstile + Resend
// ─────────────────────────────────────────────────────────────────────────────

async function verifyTurnstile(token, request, env, expectedAction) {
    if (!token || !env.TURNSTILE_SECRET) return { ok: false }
    const fd = new FormData()
    fd.append("secret", env.TURNSTILE_SECRET)
    fd.append("response", token)
    const ip = request.headers.get("CF-Connecting-IP")
    if (ip) fd.append("remoteip", ip)
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: fd })
    const data = await r.json().catch(() => ({}))
    if (!data.success) {
        console.warn("Turnstile afgewezen", JSON.stringify(data["error-codes"] || []))
        return { ok: false }
    }
    if (expectedAction && data.action && data.action !== expectedAction) return { ok: false }
    return { ok: true }
}

async function sendMail(env, { to, reply_to, subject, html, text, attachments }) {
    const recipients = (to || []).filter(Boolean)
    if (!env.RESEND_API_KEY || !recipients.length) return { ok: false, error: "mail niet geconfigureerd" }
    const body = {
        from: env.MAIL_FROM || "GeldGarant <noreply@geldgarant.com>",
        to: recipients,
        subject,
        html,
        text,
    }
    if (reply_to) body.reply_to = reply_to
    if (attachments && attachments.length) body.attachments = attachments
    try {
        const r = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) {
            console.error("Resend fout", r.status, JSON.stringify(data))
            return { ok: false, error: `${r.status} ${data.message || ""}`.trim() }
        }
        return { ok: true, id: data.id }
    } catch (e) {
        console.error("Resend onbereikbaar", e)
        return { ok: false, error: "onbereikbaar" }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// E-mails (huisstijl: #3f68f5, geen em-dashes, geen uitroeptekens, geen emoji)
// ─────────────────────────────────────────────────────────────────────────────

function aanhef(a) {
    const titel = str(a.aanspreektitel).toLowerCase()
    if (titel.startsWith("dhr") || titel.startsWith("heer")) return `Geachte heer ${a.achternaam}`
    if (titel.startsWith("mevr") || titel.startsWith("mw") || titel.startsWith("vrouw")) return `Geachte mevrouw ${a.achternaam}`
    return `Beste ${a.voornaam} ${a.achternaam}`
}

function layout(inner, env) {
    const tel = env.CONTACT_PHONE ? ` | ${esc(env.CONTACT_PHONE)}` : ""
    const mail = env.CONTACT_EMAIL ? ` | ${esc(env.CONTACT_EMAIL)}` : ""
    return `<div style="background:#f4f6ff;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f1623">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
<tr><td style="background:${BLAUW};padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold">GeldGarant</td></tr>
<tr><td style="padding:28px;font-size:14px;line-height:1.6">${inner}</td></tr>
<tr><td style="padding:16px 28px;background:#f8fafc;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0">GeldGarant | Keulenstraat 1, 7418 ET Deventer${tel}${mail}</td></tr>
</table></div>`
}

function rows(pairs) {
    return `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:8px 0 18px">${pairs
        .filter(([, v]) => v !== undefined && v !== null && String(v) !== "")
        .map(
            ([k, v]) =>
                `<tr><td style="padding:6px 10px 6px 0;color:#64748b;width:40%;vertical-align:top;border-bottom:1px solid #f1f5f9">${esc(k)}</td><td style="padding:6px 0;vertical-align:top;border-bottom:1px solid #f1f5f9">${esc(String(v)).replace(/\n/g, "<br>")}</td></tr>`
        )
        .join("")}</table>`
}

function h(t) {
    return `<p style="margin:18px 0 4px;font-weight:bold;color:${BLAUW};font-size:13px;letter-spacing:.04em;text-transform:uppercase">${esc(t)}</p>`
}

function adres(x) {
    if (!x) return ""
    const l1 = [x.straat, x.huisnummer].filter(Boolean).join(" ")
    const l2 = [x.postcode, x.plaats].filter(Boolean).join(" ")
    return [l1, l2].filter(Boolean).join(", ")
}

function klantHtml(r, env) {
    const a = r.aanvrager
    const v = r.vordering
    const inner = `<p>${esc(aanhef(a))},</p>
<p>Bedankt voor uw incasso-aanvraag. Wij hebben deze in goede orde ontvangen onder dossiernummer <strong style="color:${BLAUW}">${esc(r.dossierId)}</strong>.</p>
${h("Uw vordering")}
${rows([
    ["Debiteur", v.debiteur.naam],
    ["Factuurnummer", v.factuurnummer],
    ["Bedrag", euro(v.bedrag)],
    ["Vervaldatum", datum(v.vervaldatum)],
    ["Bijlagen", v.documenten.length ? `${v.documenten.length} ontvangen` : "Geen"],
])}
${h("Wat gebeurt er nu")}
<p style="margin:0 0 8px">Wij beoordelen uw aanvraag en nemen zo snel mogelijk contact met u op. U ontvangt van ons de opdrachtbevestiging en uw inloggegevens voor het klantportaal, waarin u de voortgang van uw dossier kunt volgen.</p>
<p style="margin:0 0 8px">Heeft u aanvullende stukken, zoals facturen, correspondentie of afspraken met de debiteur? Beantwoord dan deze e-mail en vermeld uw dossiernummer.</p>
<p style="margin:18px 0 0">Met vriendelijke groet,<br>Team GeldGarant</p>`
    return layout(inner, env)
}

function klantText(r, env) {
    const a = r.aanvrager
    const v = r.vordering
    return `${aanhef(a)},

Bedankt voor uw incasso-aanvraag. Wij hebben deze in goede orde ontvangen onder dossiernummer ${r.dossierId}.

Debiteur: ${v.debiteur.naam}
Factuurnummer: ${v.factuurnummer || ""}
Bedrag: ${euro(v.bedrag)}
Vervaldatum: ${datum(v.vervaldatum)}

Wij beoordelen uw aanvraag en nemen zo snel mogelijk contact met u op. U ontvangt van ons de opdrachtbevestiging en uw inloggegevens voor het klantportaal.

Aanvullende stukken? Beantwoord deze e-mail en vermeld uw dossiernummer.

Met vriendelijke groet,
Team GeldGarant
Keulenstraat 1, 7418 ET Deventer${env.CONTACT_PHONE ? " | " + env.CONTACT_PHONE : ""}`
}

function internHtml(r, klantMail, bijlagen) {
    const a = r.aanvrager
    const b = r.bedrijf
    const v = r.vordering
    const d = v.debiteur
    const docs = bijlagen.length
        ? `<ul style="margin:4px 0 18px;padding-left:18px">${bijlagen
              .map(
                  (x) =>
                      `<li><a href="${esc(x.link)}" style="color:${BLAUW}">${esc(x.naam)}</a> (${kb(x.grootte)})${x.content ? " bijgevoegd" : " alleen via link"}</li>`
              )
              .join("")}</ul>`
        : `<p style="margin:4px 0 18px">Geen bijlagen</p>`
    const inner = `<p style="margin:0 0 6px;font-size:18px;font-weight:bold">Nieuwe incasso-aanvraag ${esc(r.dossierId)}</p>
<p style="margin:0 0 6px;color:#64748b">Ontvangen ${esc(datumTijd(r.ontvangen))} via website. Beantwoorden gaat direct naar de aanvrager.</p>
${klantMail.ok ? "" : `<p style="margin:10px 0;padding:10px 12px;background:#fee2e2;color:#991b1b;border-radius:8px">Let op: de bevestigingsmail naar de klant is NIET verstuurd (${esc(klantMail.error || "onbekend")}). Neem zelf contact op.</p>`}
${h("Aanvrager")}
${rows([
    ["Naam", [a.aanspreektitel, a.voornaam, a.achternaam].filter(Boolean).join(" ")],
    ["E-mail", a.email],
    ["Telefoon", a.telefoon],
])}
${h("Opdrachtgever")}
${rows([
    ["Bedrijfsnaam", b.naam],
    ["KvK", b.kvk],
    ["Btw-plichtig", b.btw_plichtig ? "Ja" : "Nee"],
    ["IBAN", b.iban],
    ["Adres", adres(b.adres)],
])}
${h("Debiteur")}
${rows([
    ["Naam", d.naam],
    ["E-mail", d.email],
    ["Telefoon", d.telefoon],
    ["Adres", adres(d.adres)],
])}
${h("Vordering")}
${rows([
    ["Factuurnummer", v.factuurnummer],
    ["Bedrag", euro(v.bedrag)],
    ["Vervaldatum", datum(v.vervaldatum)],
    ["Omschrijving", v.omschrijving],
])}
${h("Bijlagen")}
${docs}
${h("Overig")}
${rows([
    ["Akkoord AV", r.toestemmingen && r.toestemmingen.akkoord_av ? "Ja" : "Nee"],
    ["Akkoord privacy", r.toestemmingen && r.toestemmingen.akkoord_avg ? "Ja" : "Nee"],
    ["Portaalaccount", r.portaal_wachtwoord_gekozen ? "Klant heeft een wachtwoord gekozen (niet opgeslagen). Account handmatig aanmaken en inloggegevens sturen." : "Geen"],
    ["Invulduur", r.metadata.formulier_duur_sec ? `${r.metadata.formulier_duur_sec} sec` : ""],
    ["Land (IP)", r.metadata.ip_land],
])}`
    return layout(inner, {})
}

function internText(r, klantMail, bijlagen) {
    const a = r.aanvrager
    const b = r.bedrijf
    const v = r.vordering
    const d = v.debiteur
    return `Nieuwe incasso-aanvraag ${r.dossierId} (${datumTijd(r.ontvangen)})
${klantMail.ok ? "" : "\nLET OP: bevestigingsmail naar klant NIET verstuurd.\n"}
AANVRAGER
${[a.aanspreektitel, a.voornaam, a.achternaam].filter(Boolean).join(" ")} | ${a.email} | ${a.telefoon || ""}

OPDRACHTGEVER
${b.naam} | KvK ${b.kvk || ""} | Btw-plichtig: ${b.btw_plichtig ? "Ja" : "Nee"} | IBAN ${b.iban || ""}
${adres(b.adres)}

DEBITEUR
${d.naam} | ${d.email || ""} | ${d.telefoon || ""}
${adres(d.adres)}

VORDERING
Factuur ${v.factuurnummer || ""} | ${euro(v.bedrag)} | vervaldatum ${datum(v.vervaldatum)}
${v.omschrijving || ""}

BIJLAGEN
${bijlagen.length ? bijlagen.map((x) => `${x.naam}: ${x.link}`).join("\n") : "Geen"}
`
}

// ─────────────────────────────────────────────────────────────────────────────
// Tokens / crypto
// ─────────────────────────────────────────────────────────────────────────────

async function hmacKey(env) {
    if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET ontbreekt")
    return crypto.subtle.importKey("raw", new TextEncoder().encode(env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
}

async function hmac(env, data) {
    const key = await hmacKey(env)
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
    return b64url(new Uint8Array(sig))
}

async function signToken(env, payload) {
    const body = b64url(new TextEncoder().encode(JSON.stringify(payload)))
    return `${body}.${await hmac(env, body)}`
}

async function verifyToken(env, token) {
    const [body, sig] = String(token || "").split(".")
    if (!body || !sig) return null
    const expected = await hmac(env, body)
    if (!timingSafeEqual(sig, expected)) return null
    try {
        const payload = JSON.parse(new TextDecoder().decode(fromB64url(body)))
        if (!payload.e || payload.e < nowSec()) return null
        return payload
    } catch {
        return null
    }
}

function timingSafeEqual(a, b) {
    if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    return diff === 0
}

async function makeDossierId(env) {
    // Zelfde formaat als de oude backend: GG-2026-01234
    for (let i = 0; i < 5; i++) {
        const n = new Uint32Array(1)
        crypto.getRandomValues(n)
        const id = `GG-${new Date().getFullYear()}-${String(n[0] % 100000).padStart(5, "0")}`
        if (!env.INTAKE || !(await env.INTAKE.get(`aanvraag/${id}`))) return id
    }
    throw new Error("Geen vrij dossiernummer gevonden")
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function corsHeaders(origin, env) {
    if (!origin) return null
    const allowed = splitList(env.ALLOWED_ORIGINS || "https://geldgarant.com,https://www.geldgarant.com,https://geldgarantpush3.framer.website,https://framer.com,https://www.framer.com")
    let ok = allowed.includes(origin)
    if (!ok && String(env.ALLOW_FRAMER_PREVIEW || "").toLowerCase() === "true") {
        ok =
            origin === "https://framer.com" ||
            /^https:\/\/[a-z0-9-]+\.(framer\.app|framer\.website|framercanvas\.com|framer\.com)$/i.test(origin)
    }
    if (!ok) return null
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Request-Nonce",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
    }
}

function withHeaders(res, extra) {
    if (!extra) return res
    const r = new Response(res.body, res)
    for (const [k, v] of Object.entries(extra)) r.headers.set(k, v)
    return r
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    })
}

function text(t, status = 200) {
    return new Response(t, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } })
}

async function readJson(request) {
    try {
        return await request.json()
    } catch {
        return null
    }
}

function cleanNonce(v) {
    const s = String(v || "")
    return /^[a-f0-9]{16,64}$/i.test(s) ? s.toLowerCase() : ""
}

function str(v) {
    return String(v == null ? "" : v).trim()
}

function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str(v))
}

function splitList(v) {
    return String(v || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
}

function sanitizeFilename(n) {
    return String(n)
        .replace(/[^a-zA-Z0-9.\-_]/g, "_")
        .replace(/\.{2,}/g, ".")
        .replace(/^\./, "_")
        .slice(0, 100)
}

function matchesMagic(bytes, type) {
    return (MAGIC_BYTES[type] || []).some((sig) => sig.every((b, i) => bytes[i] === b))
}

function esc(s) {
    return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

function euro(n) {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(n) || 0)
}

function datum(v) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ""))
    return m ? `${m[3]}-${m[2]}-${m[1]}` : String(v || "")
}

function datumTijd(iso) {
    try {
        return new Intl.DateTimeFormat("nl-NL", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Amsterdam" }).format(new Date(iso))
    } catch {
        return iso
    }
}

function kb(n) {
    return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`
}

function nowSec() {
    return Math.floor(Date.now() / 1000)
}

function b64url(bytes) {
    let s = ""
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromB64url(s) {
    const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4))
    return Uint8Array.from(b, (c) => c.charCodeAt(0))
}

function toBase64(buf) {
    const bytes = new Uint8Array(buf)
    let s = ""
    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
    return btoa(s)
}
