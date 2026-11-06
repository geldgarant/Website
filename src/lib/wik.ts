// Buitengerechtelijke incassokosten volgens het Besluit vergoeding voor
// buitengerechtelijke incassokosten (WIK-staffel), zoals in de AV van GeldGarant.
export const WIK_STAFFEL = [
    { tot: 2500, pct: 0.15 },
    { tot: 5000, pct: 0.1 },
    { tot: 10000, pct: 0.05 },
    { tot: 200000, pct: 0.01 },
    { tot: Infinity, pct: 0.005 },
] as const

export const WIK_MIN = 40
export const WIK_MAX = 6775

export function wikKosten(hoofdsom: number): number {
    if (!Number.isFinite(hoofdsom) || hoofdsom <= 0) return 0
    let rest = hoofdsom
    let vorige = 0
    let kosten = 0
    for (const trede of WIK_STAFFEL) {
        const breedte = trede.tot - vorige
        const deel = Math.min(rest, breedte)
        kosten += deel * trede.pct
        rest -= deel
        vorige = trede.tot
        if (rest <= 0) break
    }
    return Math.round(Math.min(Math.max(kosten, WIK_MIN), WIK_MAX) * 100) / 100
}

export const euro = (n: number, decimals = 2) =>
    new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(n)
