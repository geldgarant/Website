// DOM-logica voor /brief-ontvangen:
// 1. Betaalkaart: voorinvullen uit ?dossier=&bedrag= (link of QR-code in brief/e-mail), valideren, en dan
//    - met site.betaalLinkApi: betaallink opvragen via onze worker en direct doorsturen naar de betaalpagina;
//    - zonder (nu): de stap naar het CaseControl-portaal tonen met de gegevens om over te nemen.
// 2. Rekenhulp regeling en "Neem dit voorstel over".
// 3. Reactieformulier (regeling, al betaald, niet eens, anders) naar /api/contact.
// 4. Snelkeuzes die het formulier op de juiste reden zetten, en de mobiele actiebalk.
import { API_BASE, TURNSTILE_SITE_KEY, CONTACT_ACTION, maakNonce, ApiFout, parseBedrag, type Fouten } from "../lib/intake"
import {
    leesVoorinvulling,
    valideerBetaling,
    vraagBetaallink,
    normDossier,
    bedragVeld,
    termijnen,
    isReden,
    leegReactie,
    valideerReactie,
    bouwReactiePayload,
    type Betaling,
    type Reactie,
    type Reden,
} from "../lib/debiteur"
import { euro } from "../lib/wik"
import { site } from "../data/site"

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)]

function toonFouten(root: ParentNode, f: Fouten, focus: boolean) {
    let eerste: HTMLElement | null = null
    for (const p of $$("[data-fout]", root)) {
        const k = p.dataset.fout!
        p.textContent = f[k] ?? ""
        const veld = $<HTMLElement>(`[data-bind="${k}"]:not([type="radio"])`, root)
        if (veld) {
            if (f[k]) veld.setAttribute("aria-invalid", "true")
            else veld.removeAttribute("aria-invalid")
        }
        if (f[k] && !eerste) eerste = veld ?? $<HTMLElement>(`[data-bind="${k}"]`, root)
    }
    if (focus && eerste) eerste.focus()
    return !eerste
}

// ---------- 1. betalen ----------
const betaalForm = $<HTMLFormElement>("[data-betaal]")
if (betaalForm) initBetalen(betaalForm)

function initBetalen(form: HTMLFormElement) {
    const kaart = form.closest<HTMLElement>(".betaal")!
    const state: Betaling = leesVoorinvulling(location.search)
    const dossierEl = $<HTMLInputElement>('[data-bind="dossier"]', form)!
    const bedragEl = $<HTMLInputElement>('[data-bind="bedrag"]', form)!
    dossierEl.value = state.dossier
    bedragEl.value = state.bedrag
    let geprobeerd = false
    let bezig = false

    form.addEventListener("input", () => {
        state.dossier = dossierEl.value
        state.bedrag = bedragEl.value
        if (geprobeerd) toonFouten(form, valideerBetaling(state), false)
    })
    // netjes maken bij verlaten: "245,6" → "245,60", " gg 123 " → "GG123"
    dossierEl.addEventListener("blur", () => {
        if (dossierEl.value) dossierEl.value = state.dossier = normDossier(dossierEl.value)
    })
    bedragEl.addEventListener("blur", () => {
        const n = parseBedrag(bedragEl.value)
        if (n) bedragEl.value = state.bedrag = bedragVeld(n)
    })

    const melding = $<HTMLElement>("[data-betaal-melding]", form)!
    const meld = (t: string) => {
        melding.hidden = !t
        melding.textContent = t
    }
    const knop = $<HTMLButtonElement>("[data-betaal-knop]", form)!
    const knopTekst = $("[data-betaal-tekst]", form)!

    const portaal = $<HTMLElement>("[data-portaal]", kaart)!
    function toonPortaal() {
        $("[data-portaal-waarde='dossier']", portaal)!.textContent = normDossier(state.dossier)
        $("[data-portaal-waarde='bedrag']", portaal)!.textContent = euro(parseBedrag(state.bedrag))
        form.hidden = true
        portaal.hidden = false
        $<HTMLElement>("[data-portaal-kop]", portaal)!.focus()
    }
    $("[data-terug]", portaal)!.addEventListener("click", () => {
        portaal.hidden = true
        form.hidden = false
        dossierEl.focus()
    })
    const status = $<HTMLElement>("[data-kopieer-status]", portaal)!
    for (const b of $$<HTMLButtonElement>("[data-kopieer]", portaal)) {
        b.addEventListener("click", async () => {
            const wat = b.dataset.kopieer === "dossier" ? normDossier(state.dossier) : bedragVeld(parseBedrag(state.bedrag))
            try {
                await navigator.clipboard.writeText(wat)
                b.firstChild!.textContent = "Gekopieerd"
                status.textContent = `${b.dataset.kopieer === "dossier" ? "Dossiernummer" : "Bedrag"} gekopieerd`
                setTimeout(() => (b.firstChild!.textContent = "Kopieer"), 2000)
            } catch {
                status.textContent = "Kopiëren lukte niet. Neem het nummer over."
            }
        })
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        if (bezig) return
        geprobeerd = true
        meld("")
        state.dossier = dossierEl.value
        state.bedrag = bedragEl.value
        if (!toonFouten(form, valideerBetaling(state), true)) return
        if (!site.betaalLinkApi) return toonPortaal()

        bezig = true
        knop.setAttribute("aria-busy", "true")
        knopTekst.textContent = "Betaalpagina openen"
        try {
            const url = await vraagBetaallink(site.betaalLinkApi, state)
            location.assign(url)
        } catch (err) {
            if (err instanceof ApiFout && err.status === 404) {
                meld(`We vinden dit dossiernummer niet. Controleer het nummer in de brief, of bel ons op ${site.phone}.`)
                dossierEl.setAttribute("aria-invalid", "true")
                dossierEl.focus()
            } else {
                // koppeling even niet bereikbaar: de bezoeker kan altijd nog via het portaal betalen
                toonPortaal()
            }
        } finally {
            bezig = false
            knop.removeAttribute("aria-busy")
            knopTekst.textContent = "Nu betalen"
        }
    })

    // knoppen elders op de pagina ("Direct betalen") brengen de focus naar het eerste lege veld
    for (const a of $$<HTMLAnchorElement>("[data-naar-betalen]")) {
        a.addEventListener("click", () => {
            setTimeout(() => {
                if (!form.hidden) (dossierEl.value ? bedragEl : dossierEl).focus({ preventScroll: true })
            }, 350)
        })
    }
}

// ---------- 2. rekenhulp ----------
const reken = $<HTMLElement>("[data-reken]")
if (reken) {
    const open = $<HTMLInputElement>("[data-reken-open]", reken)!
    const per = $<HTMLInputElement>("[data-reken-per]", reken)!
    const uit = $<HTMLElement>("[data-reken-uit]", reken)!
    const neem = $<HTMLButtonElement>("[data-reken-neem]", reken)!
    const update = () => {
        const t = termijnen(parseBedrag(open.value), parseBedrag(per.value))
        neem.disabled = !t
        if (!t) {
            uit.textContent = "Vul twee bedragen in."
            return
        }
        const maanden = t.aantal === 1 ? "1 maand" : `${t.aantal} maanden`
        uit.innerHTML =
            t.aantal === 1
                ? `Dan betaalt u alles in <strong>1 keer</strong>.`
                : `Dan betaalt u in <strong>${maanden}</strong> af. De laatste termijn is <strong>${euro(t.laatste)}</strong>.`
    }
    reken.addEventListener("input", update)
    update()
    neem.addEventListener("click", () => kiesReden("regeling", { per_maand: bedragVeld(parseBedrag(per.value)) }))
}

// ---------- 3. reactieformulier ----------
const reactieForm = $<HTMLFormElement>("[data-reactie]")
let kiesReden: (r: Reden, extra?: Partial<Reactie>) => void = () => {}
if (reactieForm) initReactie(reactieForm)

function initReactie(form: HTMLFormElement) {
    const state: Reactie = leegReactie()
    // het dossiernummer uit de betaallink alvast overnemen
    state.dossier = leesVoorinvulling(location.search).dossier
    const nonce = maakNonce()
    const params = new URLSearchParams(location.search)
    let bezig = false
    let geprobeerd = false
    let turnstileId: string | null = null
    let turnstileToken = ""

    const velden = () => $$<HTMLInputElement | HTMLTextAreaElement>("[data-bind]", form)
    function schrijf() {
        for (const el of velden()) {
            const k = el.dataset.bind as keyof Reactie
            if (el instanceof HTMLInputElement && el.type === "radio") el.checked = state[k] === el.value
            else if (el instanceof HTMLInputElement && el.type === "checkbox") el.checked = Boolean(state[k])
            else el.value = String(state[k] ?? "")
        }
        toonExtra()
    }
    function toonExtra() {
        for (const blok of $$("[data-alleen]", form)) blok.hidden = !(blok.dataset.alleen ?? "").split(" ").includes(state.reden)
        const label = state.reden === "oneens" || state.reden === "anders" ? state.reden : "standaard"
        for (const s of $$("[data-label-voor]", form)) s.hidden = s.dataset.labelVoor !== label
        const tel = $<HTMLLabelElement>('label[for="r-telefoon"]', form)
        const opt = tel?.querySelector(".veld-opt")
        if (opt) opt.toggleAttribute("hidden", state.voorkeur !== "email")
    }

    form.addEventListener("input", (e) => {
        const el = e.target as HTMLInputElement
        const k = el.dataset?.bind as keyof Reactie | undefined
        if (!k) return
        if (el.type === "radio" && !el.checked) return
        ;(state as unknown as Record<string, unknown>)[k] = el.type === "checkbox" ? el.checked : el.value
        if (k === "reden" || k === "voorkeur") toonExtra()
        if (geprobeerd) toonFouten(form, valideerReactie(state), false)
    })
    form.addEventListener("focusin", laadTurnstile, { once: true })

    kiesReden = (r, extra = {}) => {
        Object.assign(state, extra, { reden: r })
        schrijf()
        if (geprobeerd) toonFouten(form, valideerReactie(state), false)
        if (!form.hidden) {
            form.scrollIntoView({
                block: "start",
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            })
            $<HTMLElement>("#reactie-kop", form)?.focus({ preventScroll: true })
        }
    }

    function laadTurnstile() {
        const el = $("[data-turnstile]", form)
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

    const melding = $<HTMLElement>("[data-melding]", form)!
    const meld = (t: string) => {
        melding.hidden = !t
        melding.textContent = t
    }
    const knop = $<HTMLButtonElement>("[data-verstuur]", form)!
    const knopTekst = $("[data-verstuur-tekst]", form)!

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        if (bezig) return
        geprobeerd = true
        meld("")
        if (!toonFouten(form, valideerReactie(state), true)) return
        bezig = true
        knop.setAttribute("aria-busy", "true")
        knopTekst.textContent = "Bezig met versturen"
        laadTurnstile()
        try {
            const token = await wachtOpToken()
            const payload = bouwReactiePayload(state, {
                nonce,
                turnstileToken: token,
                pagina: location.pathname,
                referrer: document.referrer,
                utm: params,
            })
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Request-Nonce": payload.nonce },
                body: JSON.stringify(payload),
            })
            const d = ((await res.json().catch(() => null)) as Record<string, unknown> | null) ?? {}
            if (res.ok && d.ok && d.accepted !== false) return klaar(String(d.requestId || ""))
            if (d.accepted === false && d.requestId) return klaar(String(d.requestId), true)
            throw new ApiFout(String(d.error || "Versturen is mislukt."), res.status)
        } catch (err) {
            meld(
                err instanceof ApiFout && err.status === 429
                    ? "U heeft al een paar berichten verstuurd. Probeer het over een paar minuten opnieuw of bel ons."
                    : `Versturen lukte niet. Probeer het opnieuw, of bel ons op ${site.phone}.`,
            )
            turnstileToken = ""
            if (turnstileId !== null) window.turnstile?.reset(turnstileId)
        } finally {
            bezig = false
            knop.removeAttribute("aria-busy")
            knopTekst.textContent = "Versturen"
        }
    })

    function klaar(ref: string, nietGemeld = false) {
        const paneel = $<HTMLElement>("[data-verzonden]")!
        $("[data-verzonden-ref]", paneel)!.textContent = ref
        if (nietGemeld) {
            const noot = $<HTMLElement>("[data-verzonden-noot]", paneel)!
            noot.hidden = false
            noot.textContent = `Uw bericht staat veilig bij ons, maar ons team kreeg nog geen melding. Bel gerust ${site.phone} als het spoed heeft.`
        }
        form.hidden = true
        paneel.hidden = false
        $<HTMLElement>("[data-verzonden-kop]", paneel)!.focus()
        paneel.scrollIntoView({ block: "start", behavior: "smooth" })
    }

    // ?reden=regeling in een link zet het formulier meteen goed
    const r = params.get("reden") ?? ""
    if (isReden(r)) state.reden = r
    schrijf()
}

// ---------- 4. snelkeuzes en actiebalk ----------
for (const a of $$<HTMLAnchorElement>("[data-kies-reden]")) {
    a.addEventListener("click", (e) => {
        const r = a.dataset.kiesReden ?? ""
        if (!isReden(r)) return
        e.preventDefault()
        history.replaceState(null, "", "#regelen")
        kiesReden(r)
    })
}

const balk = $<HTMLElement>("[data-actiebalk]")
const betaalKaart = $<HTMLElement>("#betalen")
if (balk && betaalKaart && "IntersectionObserver" in window) {
    // zichtbaar zodra de betaalkaart uit beeld is (en we er voorbij zijn), niet bij het formulier of de afsluiter
    let voorbij = false
    let bijFormulier = false
    const zet = () => {
        const toon = voorbij && !bijFormulier
        balk.classList.toggle("is-visible", toon)
        balk.inert = !toon // buiten beeld: niet bereikbaar met het toetsenbord
    }
    new IntersectionObserver(([e]) => {
        voorbij = !e.isIntersecting && e.boundingClientRect.top < 0
        zet()
    }).observe(betaalKaart)
    const stil = $$<HTMLElement>("[data-reactie], [data-verzonden], .cta-wrap")
    const zichtbaar = new Set<Element>()
    const io = new IntersectionObserver((items) => {
        for (const i of items) {
            if (i.isIntersecting) zichtbaar.add(i.target)
            else zichtbaar.delete(i.target)
        }
        bijFormulier = zichtbaar.size > 0
        zet()
    })
    stil.forEach((el) => io.observe(el))
}
