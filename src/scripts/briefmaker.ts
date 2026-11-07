// DOM-kant van de briefmaker (src/components/Briefmaker.astro). Leest het formulier, tekent de brief opnieuw
// en regelt Word, afdrukken en kopiëren. Er gaat niets over het netwerk.
import { BRIEF_SLUGS, LEEG, briefAlsTekst, maakBrief, plaatshouders, type BriefSlug, type Invoer } from "../lib/briefmaker"
import { briefHtml } from "../lib/briefHtml"
import { DOCX_MIME, maakDocx } from "../lib/docx"

const vandaag = () => {
    const d = new Date()
    return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

// Het formulier is bewust geen <form>: er wordt niets verstuurd (en dus geen verzendknop).
function leesInvoer(form: HTMLElement): Invoer {
    const veld = (k: string) => form.querySelector<HTMLInputElement>(`input[name="${k}"]:not([type="radio"])`)
    const tekst = (k: keyof Invoer) => veld(k)?.value ?? ""
    const vink = (k: keyof Invoer, standaard: boolean) => {
        const el = veld(k)
        return el ? el.checked : standaard
    }
    return {
        ...LEEG,
        afzender: tekst("afzender"),
        afzenderAdres: tekst("afzenderAdres"),
        plaats: tekst("plaats"),
        ondertekenaar: tekst("ondertekenaar"),
        klant: tekst("klant"),
        klantAdres: tekst("klantAdres"),
        aanhef: tekst("aanhef"),
        factuur: tekst("factuur"),
        factuurdatum: tekst("factuurdatum"),
        vervaldatum: tekst("vervaldatum"),
        bedrag: tekst("bedrag"),
        iban: tekst("iban"),
        termijn: tekst("termijn"),
        datum: tekst("datum"),
        soort:
            form.querySelector<HTMLInputElement>('input[name="soort"]:checked')?.value === "particulier"
                ? "particulier"
                : "zakelijk",
        herinnering: vink("herinnering", true),
        btw: vink("btw", false),
        wikVerstuurd: vink("wikVerstuurd", false),
        termijnen: tekst("termijnen"),
        eerste: tekst("eerste"),
    }
}

const bestandsnaam = (slug: string, factuur: string) =>
    `${slug}-${
        factuur
            .trim()
            .replace(/[^\w.-]+/g, "-")
            .replace(/^-+|-+$/g, "") || "voorbeeld"
    }`

function download(data: Uint8Array, naam: string) {
    const blob = new Blob([data as BlobPart], { type: DOCX_MIME })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement("a"), { href: url, download: naam })
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

async function kopieer(tekst: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(tekst)
        return true
    } catch {
        const ta = Object.assign(document.createElement("textarea"), { value: tekst })
        ta.setAttribute("readonly", "")
        ta.style.position = "fixed"
        ta.style.opacity = "0"
        document.body.append(ta)
        ta.select()
        const ok = document.execCommand("copy")
        ta.remove()
        return ok
    }
}

function drukAf(html: string) {
    document.getElementById("bm-print")?.remove()
    const root = Object.assign(document.createElement("div"), { id: "bm-print", innerHTML: html })
    document.body.append(root)
    document.documentElement.classList.add("bm-print")
    const klaar = () => {
        document.documentElement.classList.remove("bm-print")
        root.remove()
        window.removeEventListener("afterprint", klaar)
    }
    window.addEventListener("afterprint", klaar)
    window.print()
}

export function startBriefmaker(root: HTMLElement) {
    const slug = root.dataset.briefmaker as BriefSlug
    if (!BRIEF_SLUGS.includes(slug)) return
    const form = root.querySelector<HTMLElement>("[data-bm-form]")!
    const papier = root.querySelector<HTMLElement>("[data-papier]")!
    const status = root.querySelector<HTMLElement>("[data-bm-status]")!

    const datum = form.querySelector<HTMLInputElement>('input[name="datum"]')
    if (datum && !datum.value) datum.value = vandaag()

    const huidig = () => maakBrief(slug, leesInvoer(form))
    let melding = 0
    const zeg = (tekst: string, klaar = false) => {
        status.textContent = tekst
        status.classList.toggle("klaar", klaar)
    }
    const render = () => {
        const brief = huidig()
        papier.innerHTML = briefHtml(brief)
        if (Date.now() < melding) return
        const open = plaatshouders(brief).length
        zeg(
            open
                ? `Nog ${open} ${open === 1 ? "gegeven" : "gegevens"} in te vullen. Ze staan gemarkeerd in de brief.`
                : "Alles ingevuld. Lees de brief nog even na voordat u hem verstuurt.",
            !open,
        )
    }

    form.addEventListener("input", render)
    form.addEventListener("change", render)

    root.querySelector('[data-bm="word"]')?.addEventListener("click", () => {
        const v = leesInvoer(form)
        download(maakDocx(maakBrief(slug, v)), `${bestandsnaam(slug, v.factuur)}.docx`)
        melding = Date.now() + 4000
        zeg("Word-bestand gedownload. U kunt het verder aanpassen in Word, Pages of Google Docs.", true)
    })
    root.querySelector('[data-bm="pdf"]')?.addEventListener("click", () => {
        drukAf(briefHtml(huidig()))
    })
    root.querySelector('[data-bm="kopieer"]')?.addEventListener("click", async () => {
        const ok = await kopieer(briefAlsTekst(huidig()))
        melding = Date.now() + 4000
        zeg(ok ? "Tekst gekopieerd. Plak hem in uw e-mail of tekstverwerker." : "Kopiëren lukte niet. Gebruik Word of pdf.", ok)
    })

    render()
}
