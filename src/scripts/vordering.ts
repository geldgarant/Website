// DOM-logica voor /vordering-indienen: stappen, binding, validatie, adreszoeker, bestanden, Turnstile en verzenden.
// Validatie en API-aanroepen: src/lib/intake.ts. Testen: tests/e2e/vordering.spec.ts (met nagebootste API).
import {
    API_BASE,
    TURNSTILE_SITE_KEY,
    TURNSTILE_ACTION,
    MAX_FILES,
    leegFormulier,
    valideerStap,
    valideerBestand,
    bouwPayload,
    maakNonce,
    parseBedrag,
    normPostcode,
    startSessie,
    uploadBestanden,
    ruimBestandenOp,
    verstuur,
    zoekAdres,
    ApiFout,
    type FormState,
    type Fouten,
    type AdresSuggestie,
} from "../lib/intake"
import { wikKosten, euro } from "../lib/wik"
import { site } from "../data/site"

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, opts: Record<string, unknown>) => string
            reset: (id?: string) => void
        }
    }
}

const OPSLAG = "gg-vordering-v1"
const STAP_NAMEN = ["Uw factuur", "Wie moet betalen", "Uw gegevens", "Versturen"]

const form = document.querySelector<HTMLFormElement>("[data-vordering]")
if (form) init(form)

function init(form: HTMLFormElement) {
    const base = API_BASE
    const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => root.querySelector<T>(sel)
    const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => [...root.querySelectorAll<T>(sel)]

    const state: FormState = herstel()
    let stap = 1
    const bestanden: File[] = []
    let start = 0
    let bezig = false
    let turnstileId: string | null = null
    let turnstileToken = ""

    // ---------- status <-> velden ----------
    const krijg = (pad: string): unknown => pad.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], state)
    const zet = (pad: string, v: unknown) => {
        const delen = pad.split(".")
        let o = state as unknown as Record<string, unknown>
        delen.slice(0, -1).forEach((k) => (o = o[k] as Record<string, unknown>))
        o[delen[delen.length - 1]] = v
    }
    const vulVelden = () => {
        $$<HTMLInputElement>("[data-bind]").forEach((el) => {
            const v = krijg(el.dataset.bind!)
            if (el.type === "radio") el.checked = el.value === v
            else if (el.type === "checkbox") el.checked = Boolean(v)
            else el.value = v == null ? "" : String(v)
        })
    }
    form.addEventListener("input", (e) => {
        const el = e.target as HTMLInputElement
        if (!el.dataset?.bind) return
        if (!start) start = Date.now()
        zet(el.dataset.bind, el.type === "checkbox" ? el.checked : el.value)
        if (el.getAttribute("aria-invalid") === "true") toonFout(el.dataset.bind, "")
        bewaar()
        bijwerken()
    })
    form.addEventListener("change", (e) => {
        const el = e.target as HTMLInputElement
        if (el.dataset?.bind && (el.type === "radio" || el.tagName === "SELECT")) {
            zet(el.dataset.bind, el.value)
            bewaar()
            bijwerken()
        }
    })
    // nette notatie bij verlaten van het veld
    form.addEventListener(
        "blur",
        (e) => {
            const el = e.target as HTMLInputElement
            const pad = el.dataset?.bind
            if (!pad) return
            if (pad === "bedrag" && parseBedrag(el.value) > 0) {
                el.value = new Intl.NumberFormat("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                    parseBedrag(el.value),
                )
                zet(pad, el.value)
            }
            if (pad.endsWith(".postcode")) {
                el.value = normPostcode(el.value)
                zet(pad, el.value)
            }
            bewaar()
        },
        true,
    )

    function bewaar() {
        try {
            sessionStorage.setItem(OPSLAG, JSON.stringify({ ...state, akkoord: false }))
        } catch {
            /* privémodus: geen opslag, formulier werkt gewoon */
        }
    }
    function herstel(): FormState {
        const leeg = leegFormulier()
        try {
            const raw = sessionStorage.getItem(OPSLAG)
            if (!raw) return leeg
            const d = JSON.parse(raw)
            return {
                ...leeg,
                ...d,
                debiteur_adres: { ...leeg.debiteur_adres, ...d.debiteur_adres },
                bedrijf_adres: { ...leeg.bedrijf_adres, ...d.bedrijf_adres },
                akkoord: false,
            }
        } catch {
            return leeg
        }
    }

    // ---------- live samenvatting ----------
    const uitleg = $("[data-bedrag-uitleg]")
    const samBedrag = document.querySelector<HTMLElement>('[data-sam="bedrag"]')
    const samKosten = document.querySelector<HTMLElement>('[data-sam="kosten"]')
    const samDeb = document.querySelector<HTMLElement>('[data-sam="debiteur"]')
    const particulierInfo = $("[data-alleen-particulier]")
    function bijwerken() {
        const b = parseBedrag(state.bedrag)
        const k = wikKosten(b)
        if (uitleg)
            uitleg.innerHTML =
                b > 0
                    ? `De debiteur betaalt daarnaast <strong>${euro(k)}</strong> wettelijke incassokosten. U betaalt <strong>${euro(0)}</strong> bij volledige betaling.`
                    : "De debiteur betaalt de wettelijke incassokosten. U betaalt € 0 bij volledige betaling."
        if (samBedrag) samBedrag.textContent = euro(b)
        if (samKosten) samKosten.textContent = euro(k)
        if (samDeb) {
            const naam = state.debiteur_naam.trim()
            samDeb.hidden = !naam
            samDeb.textContent = naam ? `Debiteur: ${naam}` : ""
        }
        if (particulierInfo) particulierInfo.hidden = state.debiteur_soort !== "particulier"
    }

    // ---------- fouten ----------
    function toonFout(pad: string, tekst: string) {
        const p = form.querySelector<HTMLElement>(`[data-fout="${pad}"]`)
        if (p) p.textContent = tekst
        form.querySelectorAll<HTMLInputElement>(`[data-bind="${pad}"]`).forEach((el) => {
            if (el.type === "radio" || el.type === "checkbox") {
                if (el.type === "checkbox") el.setAttribute("aria-invalid", tekst ? "true" : "false")
                return
            }
            if (tekst) el.setAttribute("aria-invalid", "true")
            else el.removeAttribute("aria-invalid")
        })
    }
    function toonFouten(f: Fouten): boolean {
        $$("[data-fout]").forEach((p) => {
            const pad = p.dataset.fout!
            if (pad === "bestanden") return
            if (p.closest<HTMLElement>("[data-stap]")?.dataset.stap === String(stap)) toonFout(pad, f[pad] ?? "")
        })
        const eerste = Object.keys(f)[0]
        if (!eerste) return true
        const veld =
            form.querySelector<HTMLElement>(`[data-bind="${eerste}"]`) ??
            (eerste === "debiteur_contact" ? form.querySelector<HTMLElement>('[data-bind="debiteur_email"]') : null)
        veld?.focus()
        return false
    }

    // ---------- stappen ----------
    const stapStatus = $("[data-stap-status]")
    const terug = $<HTMLButtonElement>("[data-terug]")!
    const verder = $<HTMLButtonElement>("[data-verder]")!
    const verderTekst = $("[data-verder-tekst]")!
    function naarStap(n: number, focus = true) {
        stap = n
        $$<HTMLFieldSetElement>("[data-stap]").forEach((fs) => (fs.hidden = fs.dataset.stap !== String(n)))
        $$("[data-stap-label]").forEach((li) => {
            const i = Number(li.dataset.stapLabel)
            if (i === n) li.setAttribute("aria-current", "step")
            else li.removeAttribute("aria-current")
            li.classList.toggle("klaar-stap", i < n)
        })
        terug.hidden = n === 1
        verderTekst.textContent = n === 4 ? "Vordering versturen" : "Volgende stap"
        if (stapStatus) stapStatus.textContent = `Stap ${n} van 4: ${STAP_NAMEN[n - 1]}`
        meld("")
        if (n === 4) {
            renderOverzicht()
            laadTurnstile()
        }
        if (focus) {
            const kop = $(`[data-stap="${n}"] .stap-kop`)
            const top = form.getBoundingClientRect().top + window.scrollY - 100
            if (form.getBoundingClientRect().top < 0)
                window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
            kop?.focus({ preventScroll: true })
        }
    }
    terug.addEventListener("click", () => naarStap(Math.max(1, stap - 1)))
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        if (bezig) return
        if (!toonFouten(valideerStap(stap, state))) return
        if (stap < 4) return naarStap(stap + 1)
        await verzenden()
    })

    // ---------- overzicht (stap 4) ----------
    const esc = (s: string) =>
        s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
    const adresTekst = (a: FormState["debiteur_adres"]) =>
        [[a.straat, a.huisnummer].filter(Boolean).join(" "), [a.postcode, a.plaats].filter(Boolean).join(" ")]
            .filter(Boolean)
            .join(", ")
    function renderOverzicht() {
        const el = $("[data-overzicht]")
        if (!el) return
        const b = parseBedrag(state.bedrag)
        const blok = (titel: string, n: number, rijen: [string, string][]) =>
            `<section><div class="ov-kop"><h3>${titel}</h3><button type="button" class="ov-wijzig" data-wijzig="${n}">Wijzigen<span class="sr-only"> ${titel.toLowerCase()}</span></button></div><dl>${rijen
                .filter(([, v]) => v)
                .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
                .join("")}</dl></section>`
        el.innerHTML = [
            blok("Factuur", 1, [
                ["Bedrag", euro(b)],
                ["Incassokosten debiteur", euro(wikKosten(b))],
                ["Factuurnummer", state.factuurnummer],
                ["Vervaldatum", state.vervaldatum ? state.vervaldatum.split("-").reverse().join("-") : ""],
                ["Bijlagen", bestanden.length ? `${bestanden.length} bestand${bestanden.length > 1 ? "en" : ""}` : "Geen"],
            ]),
            blok("Uw klant", 2, [
                ["Soort", state.debiteur_soort === "particulier" ? "Particulier" : "Bedrijf"],
                ["Naam", state.debiteur_naam],
                ["E-mail", state.debiteur_email],
                ["Telefoon", state.debiteur_telefoon],
                ["Adres", adresTekst(state.debiteur_adres)],
            ]),
            blok("Uw gegevens", 3, [
                ["Bedrijf", state.bedrijfsnaam],
                ["KvK", state.kvk],
                ["IBAN", state.iban],
                ["Contact", [state.voornaam, state.achternaam].filter(Boolean).join(" ")],
                ["E-mail", state.email],
                ["Telefoon", state.telefoon],
            ]),
        ].join("")
    }
    form.addEventListener("click", (e) => {
        const knop = (e.target as HTMLElement).closest<HTMLElement>("[data-wijzig]")
        if (knop) naarStap(Number(knop.dataset.wijzig))
    })

    // ---------- bestanden ----------
    const fileInput = $<HTMLInputElement>("[data-bestanden]")!
    const lijst = $("[data-bestandlijst]")!
    const drop = $("[data-drop]")!
    const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`)
    function voegToe(files: FileList | File[]) {
        const fouten: string[] = []
        for (const f of [...files]) {
            const fout = valideerBestand(f)
            if (fout) fouten.push(fout)
            else if (bestanden.length >= MAX_FILES) fouten.push(`Maximaal ${MAX_FILES} bestanden.`)
            else if (!bestanden.some((b) => b.name === f.name && b.size === f.size)) bestanden.push(f)
        }
        toonFout("bestanden", [...new Set(fouten)].join(" "))
        renderBestanden()
    }
    function renderBestanden() {
        lijst.innerHTML = bestanden
            .map(
                (f, i) =>
                    `<li><span class="bestand-naam">${esc(f.name)}</span><span class="bestand-maat">${kb(f.size)}</span><button type="button" data-verwijder="${i}" aria-label="${esc(f.name)} verwijderen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></li>`,
            )
            .join("")
    }
    fileInput.addEventListener("change", () => {
        if (fileInput.files) voegToe(fileInput.files)
        fileInput.value = ""
    })
    lijst.addEventListener("click", (e) => {
        const k = (e.target as HTMLElement).closest<HTMLElement>("[data-verwijder]")
        if (!k) return
        bestanden.splice(Number(k.dataset.verwijder), 1)
        renderBestanden()
        fileInput.focus()
    })
    ;["dragenter", "dragover"].forEach((t) =>
        drop.addEventListener(t, (e) => {
            e.preventDefault()
            drop.classList.add("is-over")
        }),
    )
    ;["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")))
    drop.addEventListener("drop", (e) => {
        e.preventDefault()
        const files = (e as DragEvent).dataTransfer?.files
        if (files) voegToe(files)
    })

    // ---------- adreszoeker (combobox) ----------
    $$("[data-adres]").forEach((fs) => {
        const prefix = fs.dataset.adres!
        const zoek = $<HTMLInputElement>("[data-adres-zoek]", fs)!
        const ul = $("[data-adres-lijst]", fs)!
        let res: AdresSuggestie[] = []
        let actief = -1
        let timer = 0
        let ctrl: AbortController | null = null
        const sluit = () => {
            ul.hidden = true
            zoek.setAttribute("aria-expanded", "false")
            zoek.removeAttribute("aria-activedescendant")
            actief = -1
        }
        const kies = (a: AdresSuggestie) => {
            const vul = (k: string, v: string) => {
                zet(`${prefix}.${k}`, v)
                const el = form.querySelector<HTMLInputElement>(`[data-bind="${prefix}.${k}"]`)
                if (el) el.value = v
            }
            vul("straat", a.street)
            vul("huisnummer", a.houseNumber)
            vul("postcode", normPostcode(a.postcode))
            vul("plaats", a.city)
            zoek.value = a.label
            sluit()
            bewaar()
            if (prefix === "debiteur_adres") toonFout("debiteur_contact", "")
        }
        const render = () => {
            ul.innerHTML = res
                .map(
                    (a, i) =>
                        `<li role="option" id="${prefix}-opt-${i}" aria-selected="${i === actief}" data-i="${i}">${esc(a.label)}</li>`,
                )
                .join("")
            ul.hidden = !res.length
            zoek.setAttribute("aria-expanded", String(res.length > 0))
            if (actief >= 0) zoek.setAttribute("aria-activedescendant", `${prefix}-opt-${actief}`)
            else zoek.removeAttribute("aria-activedescendant")
        }
        zoek.addEventListener("input", () => {
            clearTimeout(timer)
            timer = window.setTimeout(async () => {
                ctrl?.abort()
                ctrl = new AbortController()
                try {
                    res = await zoekAdres(base, zoek.value, ctrl.signal)
                } catch {
                    res = []
                }
                actief = -1
                render()
            }, 220)
        })
        zoek.addEventListener("keydown", (e) => {
            if (ul.hidden) return
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault()
                actief = (actief + (e.key === "ArrowDown" ? 1 : -1) + res.length) % res.length
                render()
            } else if (e.key === "Enter" && actief >= 0) {
                e.preventDefault()
                kies(res[actief])
            } else if (e.key === "Escape") sluit()
        })
        ul.addEventListener("mousedown", (e) => {
            const li = (e.target as HTMLElement).closest<HTMLElement>("[data-i]")
            if (li) {
                e.preventDefault()
                kies(res[Number(li.dataset.i)])
            }
        })
        zoek.addEventListener("blur", () => setTimeout(sluit, 120))
    })

    // ---------- Turnstile (pas laden in stap 4) ----------
    function laadTurnstile() {
        const el = $("[data-turnstile]")
        if (!el || turnstileId !== null) return
        const render = () => {
            if (!window.turnstile || turnstileId !== null) return
            turnstileId = window.turnstile.render(el, {
                sitekey: TURNSTILE_SITE_KEY,
                action: TURNSTILE_ACTION,
                language: "nl",
                callback: (t: string) => (turnstileToken = t),
                "expired-callback": () => (turnstileToken = ""),
                "error-callback": () => (turnstileToken = ""),
            })
        }
        if (window.turnstile) return render()
        const s = document.createElement("script")
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        s.async = true
        s.onload = render
        s.onerror = () => meld("De beveiligingscheck kon niet laden. Controleer uw verbinding of bel ons.", "fout")
        document.head.appendChild(s)
    }
    async function wachtOpToken(ms = 8000) {
        const eind = Date.now() + ms
        while (!turnstileToken && Date.now() < eind) await new Promise((r) => setTimeout(r, 200))
        return turnstileToken
    }

    // ---------- verzenden ----------
    const melding = $("[data-melding]")!
    function meld(tekst: string, soort: "fout" | "let-op" = "fout") {
        melding.hidden = !tekst
        melding.textContent = tekst
        melding.dataset.soort = soort
    }
    async function verzenden() {
        bezig = true
        verder.setAttribute("aria-busy", "true")
        verderTekst.textContent = "Bezig met versturen..."
        meld("")
        const nonce = maakNonce()
        let ctx: { nonce: string; sessionToken: string; dossierId: string } | null = null
        let paden: string[] = []
        try {
            const token = await wachtOpToken()
            if (!token) throw new ApiFout("Even geduld: de beveiligingscheck is nog niet klaar. Probeer het zo opnieuw.", 0)
            const sessie = await startSessie(base, nonce, token)
            ctx = { nonce, ...sessie }
            const documenten = await uploadBestanden(base, bestanden, ctx)
            paden = documenten.map((d) => d.storage_path)
            const payload = bouwPayload(state, { ...ctx, documenten, duurSec: start ? (Date.now() - start) / 1000 : 0 })
            const { dossierId } = await verstuur(base, payload)
            klaar(dossierId)
        } catch (err) {
            const f = err instanceof ApiFout ? err : new ApiFout("", 0)
            if (f.message === "ontvangen-niet-gemeld" && f.dossierId) {
                klaar(f.dossierId)
                meldKlaar(
                    `Uw aanvraag is opgeslagen onder ${f.dossierId}, maar ons team is nog niet automatisch gewaarschuwd. Verstuur hem niet opnieuw; bel ons even op ${site.phone.replace(/\u00a0/g, " ")}.`,
                )
                return
            }
            if (ctx && paden.length) await ruimBestandenOp(base, ctx, paden)
            const tekst =
                f.message && f.status
                    ? f.message
                    : `Versturen lukte niet. Controleer uw verbinding en probeer het opnieuw, of mail naar ${site.email}.`
            meld(tekst, "fout")
            turnstileToken = ""
            if (turnstileId !== null) window.turnstile?.reset(turnstileId)
        } finally {
            bezig = false
            verder.removeAttribute("aria-busy")
            if (stap === 4) verderTekst.textContent = "Vordering versturen"
        }
    }
    function klaar(dossierId: string) {
        try {
            sessionStorage.removeItem(OPSLAG)
        } catch {
            /* geen opslag */
        }
        form.hidden = true
        const k = document.querySelector<HTMLElement>("[data-klaar]")!
        k.hidden = false
        const nr = k.querySelector<HTMLElement>("[data-klaar-dossier]")
        if (nr) nr.textContent = dossierId
        k.querySelector<HTMLElement>("[data-klaar-kop]")?.focus()
        window.scrollTo({ top: Math.max(0, k.getBoundingClientRect().top + window.scrollY - 120) })
    }
    function meldKlaar(tekst: string) {
        const k = document.querySelector<HTMLElement>("[data-klaar]")!
        const p = document.createElement("p")
        p.className = "melding"
        p.dataset.soort = "let-op"
        p.setAttribute("role", "alert")
        p.textContent = tekst
        k.querySelector("[data-klaar-dossier]")?.parentElement?.after(p)
    }

    // ---------- start ----------
    vulVelden()
    bijwerken()
    naarStap(1, false)
}
