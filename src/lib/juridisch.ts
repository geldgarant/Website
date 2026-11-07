// Nabewerking van de juridische documenten (src/content/juridisch/*.md) na het renderen van de Markdown.
// 1. Plaatshouders ({{telefoon}}, {{adres}}, ...) worden ingevuld uit src/data/site.ts: één bron voor bedrijfsgegevens.
// 2. {{wikStaffel}} wordt een tabel uit src/lib/wik.ts, zodat de staffel in de AV altijd gelijk is aan de rekenmodules.
// 3. Elk lid ("6.4 Tekst") krijgt een eigen anker (#lid-6-4) en elk artikel een vast anker (#artikel-6), zodat andere
//    pagina's er rechtstreeks naar kunnen linken.
// 4. Tabellen krijgen dezelfde scrollbare omhulling als in de kennisbank; € en het bedrag blijven bij elkaar.
import { site } from "../data/site"
import { WIK_MAX, WIK_MIN, WIK_STAFFEL, euro } from "./wik"
import { bewerkArtikelHtml } from "./artikel"

const pct = (n: number) => `${String(Math.round(n * 1000) / 10).replace(".", ",")}%`
const bedrag = (n: number) => euro(n, 0).replace(/\s/g, "\u00a0")

function staffelTabel(): string {
    let vorige = 0
    const rijen = WIK_STAFFEL.map((t, i) => {
        const deel =
            t.tot === Infinity
                ? `over het meerdere boven ${bedrag(vorige)}`
                : i === 0
                  ? `over de eerste ${bedrag(t.tot)}`
                  : `over de volgende ${bedrag(t.tot - vorige)}`
        vorige = t.tot
        return `<tr><td>${pct(t.pct)}</td><td>${deel} van de hoofdsom</td></tr>`
    }).join("")
    return (
        `<table><thead><tr><th>Percentage</th><th>Over welk deel</th></tr></thead><tbody>${rijen}</tbody></table>` +
        `<p>Met een minimum van ${bedrag(WIK_MIN)} en een maximum van ${bedrag(WIK_MAX)}. Bij een consument rekenen we de incassokosten pas als de termijn uit de 14-dagenbrief is verstreken.</p>`
    )
}

const PLAATS: Record<string, () => string> = {
    telefoon: () => `<a href="${site.phoneHref}">${site.phone}</a>`,
    email: () => `<a href="mailto:${site.email}">${site.email}</a>`,
    klachtenEmail: () => `<a href="mailto:${site.klachtenEmail}">${site.klachtenEmail}</a>`,
    adres: () => `${site.street}, ${site.postcode}\u00a0${site.city}`,
    kvk: () => site.kvk ?? "",
    register: () => site.incassoRegister,
    uren: () => site.hours,
    wikStaffel: () => staffelTabel(),
}

export interface JuridischKop {
    id: string
    tekst: string
}

export function bewerkJuridischHtml(html: string): { html: string; koppen: JuridischKop[] } {
    // plaatshouder als eigen alinea (zoals {{wikStaffel}}) vervangt de hele <p>
    let uit = html.replace(/<p>\{\{(\w+)\}\}<\/p>/g, (heel, k: string) => (PLAATS[k] ? PLAATS[k]() : heel))
    uit = uit.replace(/\{\{(\w+)\}\}/g, (heel, k: string) => {
        if (!PLAATS[k]) throw new Error(`Onbekende plaatshouder ${heel} in juridisch document`)
        return PLAATS[k]()
    })

    // Artikelkoppen: "Artikel 6 Kosten" → id artikel-6, nummer apart te stylen
    uit = uit.replace(/<h2 id="[^"]*">Artikel (\d+) ([^<]+)<\/h2>/g, (_, n: string, t: string) => {
        return `<h2 id="artikel-${n}"><span class="art-nr">Artikel ${n}</span> ${t}</h2>`
    })

    // Leden: "<p>6.4 Tekst" → anker en klikbaar nummer
    uit = uit.replace(/<p>(\d+)\.(\d+) /g, (_, a: string, b: string) => {
        const id = `lid-${a}-${b}`
        return `<p class="lid" id="${id}"><a class="lid-nr" href="#${id}" aria-label="Artikel ${a}.${b}">${a}.${b}</a> `
    })

    // € en bedrag niet van elkaar scheiden; e-mail en KvK-nummer niet op het streepje afbreken
    uit = uit.replace(/€ (\d)/g, "€\u00a0$1")
    uit = uit.replace(/\b([Ee])-mail/g, "$1\u2011mail").replace(/KvK-nummer/g, "KvK\u2011nummer")
    uit = uit.replace(/IP-adres/g, "IP\u2011adres").replace(/gg-vordering-v1/g, "gg\u2011vordering\u2011v1")

    // eerst de omhulling (bewerkArtikelHtml zoekt <table> zonder attributen), daarna de kaarttabellen
    uit = bewerkArtikelHtml(uit)

    // Tabellen: elke cel krijgt het label van haar kolom, zodat een rij op mobiel als kaart kan worden getoond
    uit = uit.replace(/<table>([\s\S]*?)<\/table>/g, (heel, binnen: string) => {
        const labels = [...(binnen.match(/<thead>([\s\S]*?)<\/thead>/)?.[1] ?? "").matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(
            (m) =>
                m[1]
                    .replace(/<[^>]+>/g, "")
                    .replace(/"/g, "&quot;")
                    .trim(),
        )
        if (labels.length < 3) return heel // smalle tabellen (zoals de staffel) blijven een gewone tabel
        const body = binnen.replace(/<tr>([\s\S]*?)<\/tr>/g, (_rij, cellen: string) => {
            let i = 0
            return `<tr>${cellen.replace(/<td([^>]*)>/g, (_, attr: string) => `<td${attr} data-label="${labels[i++] ?? ""}">`)}</tr>`
        })
        return `<table class="kaarttabel">${body}</table>`
    })

    const koppen = [...uit.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({
        id: m[1],
        tekst: m[2]
            .replace(/<span class="art-nr">Artikel \d+<\/span>\s*/, "")
            .replace(/<[^>]+>/g, "")
            .trim(),
    }))
    return { html: uit, koppen }
}
