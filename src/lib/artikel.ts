// Nabewerking van de HTML die uit een kennisbankartikel (Markdown) komt.
// Bewust als simpele stringbewerking: de Markdown-uitvoer is voorspelbaar en zo blijft de pijplijn
// onafhankelijk van de Markdown-processor van Astro.

export const KADERS = {
    "Let op": "letop",
    Voorbeeld: "voorbeeld",
    Rekenvoorbeeld: "voorbeeld",
    Tip: "tip",
    "Goed om te weten": "tip",
} as const

/**
 * 1. Tabellen krijgen een scrollbare, toetsenbordbereikbare omhulling (smalle schermen).
 * 2. Een blockquote die begint met **Let op:**, **Voorbeeld:**, **Tip:** enz. wordt een kader (<div role="note">); de vette aanhef is het label.
 * 3. Externe links openen in hetzelfde venster maar krijgen rel="noopener".
 */
export function bewerkArtikelHtml(html: string): string {
    let n = 0
    let uit = html.replace(/<table>/g, () => {
        n += 1
        return `<section class="tabel" tabindex="0" aria-label="Tabel ${n}" data-scroller><table>`
    })
    uit = uit.replace(/<\/table>/g, "</table></section>")

    // Kaders: blockquotes zijn in onze artikelen nooit genest, dus paren openen/sluiten op volgorde
    uit = uit.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (heel, binnen: string) => {
        const m = binnen.match(/^\s*<p><strong>([^<:]+):?<\/strong>:?/)
        const soort = m ? KADERS[m[1].trim() as keyof typeof KADERS] : undefined
        if (!soort || !m) return heel
        return `<div class="kader kader-${soort}" role="note">${binnen}</div>`
    })

    uit = uit.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" rel="noopener"')
    return uit
}

/** Platte tekst voor leestijd en zoekindex */
export const platteTekst = (html: string) =>
    html
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z#0-9]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim()

export interface Kop {
    depth: number
    slug: string
    text: string
}

/** Kopjes uit de gerenderde Markdown (metadata is in de types van Astro niet getypeerd) */
export function koppenVan(entry: { rendered?: { metadata?: Record<string, unknown> } }): Kop[] {
    const h = entry.rendered?.metadata?.headings
    return Array.isArray(h) ? (h as Kop[]) : []
}
