// DOM-logica voor het sollicitatieformulier (Sollicitatie.astro): cv kiezen of slepen, valideren,
// Turnstile pas laden bij de eerste interactie, multipart versturen naar /api/sollicitatie.
import { API_BASE, TURNSTILE_SITE_KEY, ApiFout, maakNonce, type Fouten } from "../lib/intake"
import {
    SOLLICITATIE_ACTION,
    leegSollicitatie,
    valideerCv,
    valideerSollicitatie,
    verstuurSollicitatie,
} from "../lib/sollicitatie"
import { site } from "../data/site"

for (const root of document.querySelectorAll<HTMLElement>("[data-sollicitatie]")) init(root)

function init(root: HTMLElement) {
    const form = root.querySelector<HTMLFormElement>("form")!
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)
    const functie = root.dataset.functie ?? "Sollicitatie"
    const state = leegSollicitatie()
    const nonce = maakNonce()
    let cv: File | null = null
    let bezig = false
    let geprobeerd = false
    let turnstileId: string | null = null
    let turnstileToken = ""

    const drop = $<HTMLLabelElement>("[data-drop]")!
    const cvInput = $<HTMLInputElement>("[data-cv]")!
    const cvTekst = $("[data-cv-tekst]")!
    const cvStandaard = cvTekst.innerHTML

    function kies(file: File | null) {
        cv = file
        drop.classList.toggle("is-gekozen", !!file && !valideerCv(file))
        if (file) {
            const kb =
                file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(file.size / 1024)} KB`
            cvTekst.textContent = ""
            const naam = document.createElement("strong")
            naam.textContent = file.name
            const hint = document.createElement("span")
            hint.className = "drop-hint"
            hint.textContent = `${kb}. Klik om een ander bestand te kiezen.`
            cvTekst.append(naam, hint)
        } else cvTekst.innerHTML = cvStandaard
        if (geprobeerd) toonFouten(valideerSollicitatie(state, cv), false)
    }
    cvInput.addEventListener("change", () => kies(cvInput.files?.[0] ?? null))
    for (const ev of ["dragenter", "dragover"])
        drop.addEventListener(ev, (e) => {
            e.preventDefault()
            drop.classList.add("is-over")
        })
    for (const ev of ["dragleave", "drop"]) drop.addEventListener(ev, () => drop.classList.remove("is-over"))
    drop.addEventListener("drop", (e) => {
        e.preventDefault()
        const f = (e as DragEvent).dataTransfer?.files?.[0]
        if (f) kies(f)
    })

    form.addEventListener("input", (e) => {
        const el = e.target as HTMLInputElement | HTMLTextAreaElement
        if (el === cvInput) return
        const k = el.name as keyof typeof state
        if (k === "akkoord") state.akkoord = (el as HTMLInputElement).checked
        else if (k in state) (state as unknown as Record<string, string>)[k] = el.value
        if (geprobeerd) toonFouten(valideerSollicitatie(state, cv), false)
    })
    form.addEventListener("focusin", laadTurnstile, { once: true })

    function toonFouten(f: Fouten, focus: boolean) {
        let eerste: HTMLElement | null = null
        for (const p of root.querySelectorAll<HTMLElement>("[data-fout]")) {
            const k = p.dataset.fout!
            p.textContent = f[k] ?? ""
            const veld = k === "cv" ? cvInput : root.querySelector<HTMLElement>(`[name="${k}"]`)
            if (veld) {
                if (f[k]) veld.setAttribute("aria-invalid", "true")
                else veld.removeAttribute("aria-invalid")
            }
            if (k === "cv") drop.classList.toggle("is-fout", !!f[k])
            if (f[k] && !eerste) eerste = veld
        }
        if (focus && eerste) eerste.focus()
        return !eerste
    }

    function laadTurnstile() {
        const el = $("[data-turnstile]")
        if (!el || turnstileId !== null) return
        const render = () => {
            if (!window.turnstile || turnstileId !== null) return
            turnstileId = window.turnstile.render(el, {
                sitekey: TURNSTILE_SITE_KEY,
                action: SOLLICITATIE_ACTION,
                language: "nl",
                appearance: "interaction-only",
                callback: (t: string) => (turnstileToken = t),
                "expired-callback": () => (turnstileToken = ""),
                "error-callback": () => (turnstileToken = ""),
            })
        }
        if (window.turnstile) return render()
        const bestaand = document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile"]')
        if (bestaand) return bestaand.addEventListener("load", render)
        const s = document.createElement("script")
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        s.async = true
        s.onload = render
        document.head.appendChild(s)
    }
    async function wachtOpToken(ms = 8000) {
        const eind = Date.now() + ms
        while (!turnstileToken && Date.now() < eind) await new Promise((r) => setTimeout(r, 200))
        return turnstileToken
    }

    const melding = $("[data-melding]")!
    const knop = $<HTMLButtonElement>("[data-verstuur]")!
    const knopTekst = $("[data-verstuur-tekst]")!

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        if (bezig) return
        geprobeerd = true
        melding.hidden = true
        if (!toonFouten(valideerSollicitatie(state, cv), true) || !cv) return
        bezig = true
        knop.setAttribute("aria-busy", "true")
        knopTekst.textContent = "Bezig met versturen"
        laadTurnstile()
        try {
            const token = await wachtOpToken()
            const { requestId } = await verstuurSollicitatie(API_BASE, state, cv, {
                functie,
                nonce,
                turnstileToken: token,
                pagina: location.pathname,
            })
            klaar(requestId)
        } catch (err) {
            if (err instanceof ApiFout && err.dossierId) return klaar(err.dossierId, true)
            const fout = err instanceof ApiFout && err.status === 400 && err.message ? `${err.message} ` : ""
            melding.textContent = `${fout}Versturen lukte niet. Probeer het opnieuw, mail uw cv naar ${site.email} of bel ${site.phone}.`
            melding.hidden = false
            turnstileToken = ""
            if (turnstileId !== null) window.turnstile?.reset(turnstileId)
        } finally {
            bezig = false
            knop.removeAttribute("aria-busy")
            knopTekst.textContent = "Verstuur sollicitatie"
        }
    })

    function klaar(ref: string, nietGemeld = false) {
        const paneel = $("[data-klaar]")!
        $("[data-klaar-ref]")!.textContent = ref
        if (nietGemeld) {
            const noot = $("[data-klaar-noot]")!
            noot.hidden = false
            noot.textContent = `Uw sollicitatie staat veilig bij ons, maar ons team kreeg nog geen melding. Bel gerust ${site.phone}.`
        }
        form.hidden = true
        paneel.hidden = false
        $("[data-klaar-kop]")!.focus()
    }
}
