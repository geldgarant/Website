// Onderwerpen van de kennisbank. Volgorde = volgorde op /kennisbank en in de onderwerpknoppen.
// De artikelen zelf staan in src/content/kennisbank/*.md; daar verwijst `onderwerp` naar een id hieronder.

export const ONDERWERP_IDS = ["factuur", "kosten", "lastig", "rechter", "regels", "situatie"] as const
export type OnderwerpId = (typeof ONDERWERP_IDS)[number]

export interface Onderwerp {
    id: OnderwerpId
    label: string
    icon: "doc" | "euro" | "chat" | "scale" | "shield" | "briefcase"
    // één zin: welke vraag beantwoordt dit onderwerp
    vraag: string
}

export const onderwerpen: readonly Onderwerp[] = [
    {
        id: "factuur",
        label: "Factuur en betaling",
        icon: "doc",
        vraag: "Van een correcte factuur tot de laatste aanmaning: zo zorgt u dat u betaald krijgt.",
    },
    {
        id: "kosten",
        label: "Kosten en rente",
        icon: "euro",
        vraag: "Wat u mag doorberekenen, wat incasso kost en wat een rechtszaak kost.",
    },
    {
        id: "lastig",
        label: "Als de klant niet betaalt",
        icon: "chat",
        vraag: "Betwisting, faillissement, een opgeheven bv of een oude vordering: uw opties.",
    },
    {
        id: "rechter",
        label: "Rechter en beslag",
        icon: "scale",
        vraag: "Hoe een procedure verloopt en hoe een vonnis geld wordt.",
    },
    {
        id: "regels",
        label: "Regels voor incasso",
        icon: "shield",
        vraag: "De Wki, de AVG en wat u van een incassobureau mag verwachten.",
    },
    {
        id: "situatie",
        label: "Per situatie",
        icon: "briefcase",
        vraag: "Zzp, bouw, verhuur, buitenland of een persoonlijke lening.",
    },
]

export const onderwerpById = Object.fromEntries(onderwerpen.map((o) => [o.id, o])) as Record<OnderwerpId, Onderwerp>

// Leestijd op basis van ~200 woorden per minuut (zakelijke Nederlandse tekst)
export function leestijd(tekst: string): number {
    const woorden = tekst
        .replace(/<[^>]+>/g, " ")
        .split(/\s+/)
        .filter(Boolean).length
    return Math.max(2, Math.round(woorden / 200))
}

export const datumNl = (d: Date) =>
    new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Amsterdam" }).format(d)
