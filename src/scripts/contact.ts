// DOM-logica voor /contact-opnemen: onderwerp-chips met extra velden, voorvullen uit de URL,
// validatie (valideerContact), Turnstile pas laden bij de eerste interactie, verzenden naar /api/contact.
import {
    API_BASE,
    TURNSTILE_SITE_KEY,
    CONTACT_ACTION,
    ONDERWERPEN,
    leegContact,
    valideerContact,
    bouwContactPayload,
    verstuurContact,
    maakNonce,
    ApiFout,
    type ContactState,
    type Fouten,
} from "../lib/intake"
import { site } from "../data/site"

const form = document.querySelector<HTMLFormElement>("[data-contact]")
if (form) init(form)

function init(form: HTMLFormElement) {
    const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => root.querySelector<T>(sel)
    const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => [...root.querySelectorAll<T>(sel)]

    const state: ContactState = leegContact()
    const nonce = maakNonce()
    let bezig = false
    let geprobeerd = false
    let turnstileId: string | null = null
    let turnstileToken = ""

    type Sleutel = keyof ContactState
    const velden = () => $$<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[data-bind]")

    // ---------- voorvullen uit ?onderwerp=&pakket= ----------
    const params = new URLSearchParams(location.search)
    const onderwerp = params.get("onderwerp")
    if (onderwerp && ONDERWERPEN.some((o) => o.key === onderwerp)) state.onderwerp = onderwerp as ContactState["onderwerp"]
    const pakket = params.get("pakket")
    if (pakket && /^(start|groei|zakelijk|advies)$/.test(pakket)) {
        state.pakket = pakket
        if (!state.onderwerp) state.onderwerp = "debiteurenbeheer"
    }

    function schrijf() {
        for (const el of velden()) {
            const k = el.dataset.bind as Sleutel
            if (el instanceof HTMLInputElement && el.type === "radio") el.checked = state[k] === el.value
            else el.value = String(state[k] ?? "")
        }
        toonExtra()
    }

    function toonExtra() {
        for (const blok of $$("[data-alleen]")) blok.hidden = blok.dataset.alleen !== state.onderwerp
        const telVerplicht = state.voorkeur !== "email" || state.onderwerp === "terugbelverzoek"
        const telLabel = $<HTMLLabelElement>('label[for="c-telefoon"]')
        if (telLabel) {
            let opt = telLabel.querySelector(".veld-opt")
            if (!telVerplicht && !opt) {
                opt = document.createElement("span")
                opt.className = "veld-opt"
                opt.textContent = "optioneel"
                telLabel.append(" ", opt)
            } else if (telVerplicht && opt) opt.remove()
        }
    }

    form.addEventListener("input", (e) => {
        const el = e.target as HTMLInputElement
        const k = el.dataset?.bind as Sleutel | undefined
        if (!k) return
        if (el.type === "radio" && !el.checked) return
        ;(state as unknown as Record<string, string>)[k] = el.value
        if (k === "onderwerp" || k === "voorkeur") toonExtra()
        if (geprobeerd) toonFouten(valideerContact(state), false)
    })
    // eerste interactie: beveiligingscheck alvast klaarzetten
    form.addEventListener("focusin", laadTurnstile, { once: true })

    // ---------- fouten ----------
    function toonFouten(f: Fouten, focus: boolean) {
        let eerste: HTMLElement | null = null
        for (const p of $$("[data-fout]")) {
            const k = p.dataset.fout!
            p.textContent = f[k] ?? ""
            const veld = k === "onderwerp" ? null : $<HTMLElement>(`[data-bind="${k}"]`)
            if (veld) {
                if (f[k]) veld.setAttribute("aria-invalid", "true")
                else veld.removeAttribute("aria-invalid")
            }
            if (f[k] && !eerste) eerste = veld ?? $<HTMLElement>('[data-bind="onderwerp"]')
        }
        if (focus && eerste) eerste.focus()
        return !eerste
    }

    // ---------- Turnstile (optioneel bij de worker, maar wel meegestuurd als hij laadt) ----------
    function laadTurnstile() {
        const el = $("[data-turnstile]")
        if (!el || turnstileId !== null) return
        const render = () => {
            if (!window.turnstile || turnstileId !== null) return
            turnstileId = window.turnstile.render(el, {
                sitekey: TURNSTILE_SITE_KEY,
                action: CONTACT_ACTION,
                language: "nl",
                appearance: "interaction-only",
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
        document.head.appendChild(s)
    }
    async function wachtOpToken(ms = 5000) {
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
    const knop = $<HTMLButtonElement>("[data-verstuur]")!
    const knopTekst = $("[data-verstuur-tekst]")!

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        if (bezig) return
        geprobeerd = true
        meld("")
        if (!toonFouten(valideerContact(state), true)) return
        bezig = true
        knop.setAttribute("aria-busy", "true")
        knopTekst.textContent = "Bezig met versturen"
        laadTurnstile()
        try {
            const token = await wachtOpToken()
            const payload = bouwContactPayload(state, {
                nonce,
                turnstileToken: token,
                pagina: location.pathname,
                referrer: document.referrer,
                utm: params,
            })
            const { requestId } = await verstuurContact(API_BASE, payload)
            klaar(requestId)
        } catch (err) {
            if (err instanceof ApiFout && err.dossierId) {
                klaar(err.dossierId, true)
                return
            }
            const tekst =
                err instanceof ApiFout && err.status === 429
                    ? "U heeft al een paar berichten verstuurd. Probeer het over een paar minuten opnieuw of bel ons."
                    : `Versturen lukte niet. Probeer het opnieuw, of bel ons op ${site.phone}.`
            meld(tekst)
            turnstileToken = ""
            if (turnstileId !== null) window.turnstile?.reset(turnstileId)
        } finally {
            bezig = false
            knop.removeAttribute("aria-busy")
            knopTekst.textContent = "Bericht versturen"
        }
    })

    function klaar(ref: string, nietGemeld = false) {
        const paneel = document.querySelector<HTMLElement>("[data-verzonden]")!
        paneel.querySelector("[data-verzonden-ref]")!.textContent = ref
        const noot = paneel.querySelector<HTMLElement>("[data-verzonden-noot]")!
        if (nietGemeld) {
            noot.hidden = false
            noot.textContent = `Uw bericht staat veilig bij ons, maar ons team kreeg nog geen melding. Bel gerust ${site.phone} als het spoed heeft.`
        }
        form.hidden = true
        paneel.hidden = false
        paneel.querySelector<HTMLElement>("[data-verzonden-kop]")!.focus()
        paneel.scrollIntoView({ block: "start", behavior: "smooth" })
    }

    schrijf()
}
