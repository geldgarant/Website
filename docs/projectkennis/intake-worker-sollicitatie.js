// ─────────────────────────────────────────────────────────────────────────────
// Sollicitatie met cv (nieuw 7 nov 2026). Multipart: functie, naam, email, telefoon, motivatie, akkoord,
// nonce, bron_pagina, turnstile_token, cv. Turnstile is hier verplicht (upload = spamrisico).
// Gegevens en cv worden 28 dagen bewaard (de site belooft: binnen vier weken na afloop verwijderd).
// ─────────────────────────────────────────────────────────────────────────────

const SOLLICITATIE_TTL_SEC = 60 * 60 * 24 * 28
const CV_MAGIC = {
    pdf: { type: "application/pdf", sig: [[0x25, 0x50, 0x44, 0x46]] },
    docx: { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", sig: [[0x50, 0x4b, 0x03, 0x04]] },
    doc: { type: "application/msword", sig: [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]] },
}

async function handleSollicitatie(request, env, ctx) {
    let form
    try {
        form = await request.formData()
    } catch {
        return json({ ok: false, error: "Ongeldige aanvraag." }, 400)
    }
    const nonce = cleanNonce(form.get("nonce"))
    if (!nonce || nonce !== cleanNonce(request.headers.get("X-Request-Nonce"))) {
        return json({ ok: false, error: "De beveiligingscontrole van het formulier is mislukt. Vernieuw de pagina en probeer het opnieuw." }, 400)
    }
    const check = await verifyTurnstile(String(form.get("turnstile_token") || ""), request, env, "sollicitatie_submit")
    if (!check.ok) return json({ ok: false, error: "De beveiligingscheck is mislukt." }, 403)

    const s = {
        functie: str(form.get("functie")).slice(0, 120) || "Sollicitatie",
        naam: str(form.get("naam")).slice(0, 120),
        email: str(form.get("email")).toLowerCase().slice(0, 200),
        telefoon: str(form.get("telefoon")).replace(/[^0-9+\s()\-]/g, "").slice(0, 30),
        motivatie: str(form.get("motivatie")).slice(0, 2000),
        akkoord: str(form.get("akkoord")) === "ja",
        bron_pagina: str(form.get("bron_pagina")).slice(0, 255),
    }
    if (s.naam.length < 2) return json({ ok: false, error: "Vul uw naam in." }, 400)
    if (!isEmail(s.email)) return json({ ok: false, error: "Vul een geldig e-mailadres in." }, 400)
    if (s.telefoon.replace(/\D/g, "").length < 9) return json({ ok: false, error: "Vul een geldig telefoonnummer in." }, 400)
    if (!s.akkoord) return json({ ok: false, error: "Toestemming voor het gebruik van uw gegevens ontbreekt." }, 400)

    const cv = form.get("cv")
    if (!cv || typeof cv !== "object" || !("arrayBuffer" in cv)) return json({ ok: false, error: "Voeg uw cv toe." }, 400)
    if (cv.size > MAX_FILE_BYTES) return json({ ok: false, error: "Uw cv is groter dan 10 MB." }, 400)
    const buf = await cv.arrayBuffer()
    const bytes = new Uint8Array(buf)
    const soort = Object.entries(CV_MAGIC).find(([, m]) => m.sig.some((sig) => sig.every((b, i) => bytes[i] === b)))
    if (!soort) return json({ ok: false, error: "Uw cv moet een PDF- of Word-bestand zijn." }, 400)
    const [ext, meta] = soort

    const requestId = `GG-SOL-${new Date().getFullYear()}-${String(crypto.getRandomValues(new Uint32Array(1))[0] % 100000).padStart(5, "0")}`
    const naam = sanitizeFilename(`cv-${s.naam.replace(/\s+/g, "-")}.${ext}`)
    const key = `upload/sollicitatie/${requestId}/${naam}`
    const record = { requestId, ontvangen: new Date().toISOString(), ...s, cv: { naam, type: meta.type, grootte: buf.byteLength, key } }
    if (env.INTAKE) {
        await env.INTAKE.put(key, buf, { expirationTtl: SOLLICITATIE_TTL_SEC, metadata: { naam, type: meta.type, grootte: buf.byteLength } })
        await env.INTAKE.put(`sollicitatie/${requestId}`, JSON.stringify(record), { expirationTtl: SOLLICITATIE_TTL_SEC })
    }
    const link = env.INTAKE ? await signedFileUrl(env, request, key) : ""

    const klantMail = await sendMail(env, {
        to: [s.email],
        reply_to: env.MAIL_REPLY_TO || env.CONTACT_EMAIL,
        subject: `Wij hebben uw sollicitatie ontvangen (${requestId})`,
        html: layout(
            `<p>Beste ${esc(s.naam)},</p>
<p>Bedankt voor uw sollicitatie voor <strong>${esc(s.functie)}</strong>. Wij hebben uw cv ontvangen onder referentie <strong style="color:${BLAUW}">${esc(requestId)}</strong>.</p>
<p>We lezen uw sollicitatie zelf en nemen contact met u op over de volgende stap. Uw gegevens gebruiken we alleen voor deze sollicitatie. Na afloop verwijderen we ze binnen vier weken, tenzij u ons toestemming geeft om ze langer te bewaren.</p>
<p style="margin:18px 0 0">Met vriendelijke groet,<br>Team GeldGarant</p>`,
            env
        ),
        text: `Beste ${s.naam},\n\nBedankt voor uw sollicitatie voor ${s.functie}. Wij hebben uw cv ontvangen onder referentie ${requestId}.\n\nWe lezen uw sollicitatie zelf en nemen contact met u op over de volgende stap. Na afloop verwijderen we uw gegevens binnen vier weken, tenzij u toestemming geeft om ze langer te bewaren.\n\nMet vriendelijke groet,\nTeam GeldGarant`,
    })
    const internMail = await sendMail(env, {
        to: splitList(env.MAIL_TO_INTERNAL),
        reply_to: s.email,
        subject: `Sollicitatie ${requestId} | ${s.functie} | ${s.naam}`,
        html: layout(
            `<p style="margin:0 0 6px;font-size:18px;font-weight:bold">Nieuwe sollicitatie ${esc(requestId)}</p>
<p style="margin:0 0 6px;color:#64748b">Ontvangen ${esc(datumTijd(record.ontvangen))}. Beantwoorden gaat direct naar de kandidaat. Gegevens en cv worden na 28 dagen automatisch verwijderd.</p>
${klantMail.ok ? "" : `<p style="margin:10px 0;padding:10px 12px;background:#fee2e2;color:#991b1b;border-radius:8px">Let op: de bevestigingsmail naar de kandidaat is NIET verstuurd.</p>`}
${h("Kandidaat")}
${rows([["Functie", s.functie], ["Naam", s.naam], ["E-mail", s.email], ["Telefoon", s.telefoon], ["Pagina", s.bron_pagina]])}
${h("Motivatie")}
<p style="margin:4px 0 18px">${s.motivatie ? esc(s.motivatie).replace(/\n/g, "<br>") : "Geen motivatie meegestuurd."}</p>
${h("Cv")}
<p style="margin:4px 0 18px"><a href="${esc(link)}" style="color:${BLAUW}">${esc(naam)}</a> (${kb(buf.byteLength)}), ook als bijlage</p>`,
            {}
        ),
        text: `Sollicitatie ${requestId}\n${s.functie}\n${s.naam} | ${s.email} | ${s.telefoon}\n\n${s.motivatie}\n\nCv: ${link}`,
        attachments: buf.byteLength <= MAX_ATTACH_TOTAL_BYTES ? [{ filename: naam, content: toBase64(buf) }] : undefined,
    })
    const tg = await sendTelegram(env, `Nieuwe sollicitatie ${requestId}\n${s.functie}\n${s.naam}\n${s.telefoon} | ${s.email}`)

    if (!internMail.ok && !tg.ok) {
        console.error("Sollicitatie: interne melding mislukt", requestId, internMail.error)
        return json({ ok: false, accepted: false, requestId, error: `Uw sollicitatie is ontvangen onder referentie ${requestId}, maar nog niet volledig verwerkt.` }, 202)
    }
    return json({ ok: true, accepted: true, requestId })
}
