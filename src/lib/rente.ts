// Wettelijke rente (art. 6:119 BW, niet-handelstransacties) en wettelijke handelsrente (art. 6:119a BW).
// Bronnen (nov 2026): rijksoverheid.nl "Hoogte wettelijke rente" (4% sinds 1-1-2026, 10,4% sinds 1-7-2026),
// KCBR-informatieblad jan/jul 2026, Staatsblad-besluiten. Nieuw percentage? Voeg een regel toe en pas
// RENTE_BIJGEWERKT aan; de unit-test in tests/unit/rente.test.ts controleert de volgorde.
// Rekenwijze: per dag (werkelijke dagen / 365), gesplitst bij elke tariefwijziging, en na elk vol jaar
// wordt de opgebouwde rente bij de hoofdsom opgeteld (rente op rente, art. 6:119 lid 2 BW).

export type Soort = "handel" | "consument"

export const RENTE: Record<Soort, readonly (readonly [string, number])[]> = {
    handel: [
        ["2015-01-01", 8.05],
        ["2016-07-01", 8],
        ["2023-01-01", 10.5],
        ["2023-07-01", 12],
        ["2024-01-01", 12.5],
        ["2024-07-01", 12.25],
        ["2025-01-01", 11.15],
        ["2025-07-01", 10.15],
        ["2026-07-01", 10.4],
    ],
    consument: [
        ["2015-01-01", 2],
        ["2023-01-01", 4],
        ["2023-07-01", 6],
        ["2024-01-01", 7],
        ["2025-01-01", 6],
        ["2026-01-01", 4],
    ],
}
export const RENTE_BIJGEWERKT = "1 juli 2026"
export const RENTE_VANAF = "2015-01-01"

const DAG = 86_400_000
/** "2026-03-15" → UTC-tijdstempel om middernacht; ongeldig → NaN */
export const dag = (iso: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return Number.NaN
    const t = Date.parse(`${iso}T00:00:00Z`)
    return Number.isFinite(t) ? t : Number.NaN
}
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const plusJaar = (t: number) => {
    const d = new Date(t)
    d.setUTCFullYear(d.getUTCFullYear() + 1)
    return d.getTime()
}

export function huidigPercentage(soort: Soort, op: string): number {
    const t = dag(op)
    let pct = RENTE[soort][0][1]
    for (const [van, p] of RENTE[soort]) if (dag(van) <= t) pct = p
    return pct
}

export interface Periode {
    van: string
    tot: string // exclusief
    dagen: number
    pct: number
    grondslag: number
    rente: number
}

/**
 * Rente over `hoofdsom` vanaf `vanaf` (eerste rentedag) tot `tot` (exclusief; dus t/m de dag ervoor).
 * Geeft 0 bij een ongeldig bedrag of een periode van 0 dagen of minder.
 */
export function wettelijkeRente(
    hoofdsom: number,
    soort: Soort,
    vanaf: string,
    tot: string,
): { rente: number; perioden: Periode[] } {
    let start = dag(vanaf)
    const eind = dag(tot)
    if (!(hoofdsom > 0) || !Number.isFinite(start) || !Number.isFinite(eind) || eind <= start) return { rente: 0, perioden: [] }
    start = Math.max(start, dag(RENTE_VANAF))

    const wissels = RENTE[soort].map(([d]) => dag(d))
    const perioden: Periode[] = []
    let grondslag = hoofdsom
    let opgebouwdDitJaar = 0
    let totaal = 0
    let jaargrens = plusJaar(dag(vanaf))
    while (jaargrens <= start) jaargrens = plusJaar(jaargrens)
    let t = start

    while (t < eind) {
        const volgendeWissel = wissels.find((w) => w > t) ?? Infinity
        const segEind = Math.min(eind, jaargrens, volgendeWissel)
        const dagen = Math.round((segEind - t) / DAG)
        const pct = huidigPercentage(soort, iso(t))
        const r = (grondslag * (pct / 100) * dagen) / 365
        perioden.push({
            van: iso(t),
            tot: iso(segEind),
            dagen,
            pct,
            grondslag: Math.round(grondslag * 100) / 100,
            rente: Math.round(r * 100) / 100,
        })
        opgebouwdDitJaar += r
        totaal += r
        t = segEind
        if (t === jaargrens) {
            grondslag += opgebouwdDitJaar // rente op rente na elk vol jaar
            opgebouwdDitJaar = 0
            jaargrens = plusJaar(jaargrens)
        }
    }
    return { rente: Math.round(totaal * 100) / 100, perioden }
}

/** Btw over incassokosten mag alleen als de schuldeiser de btw niet kan verrekenen. */
export const BTW = 0.21
