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

// Afrekening volgens de AV (art. 6.3 en 6.4): volledig betaald = incassokosten voor GeldGarant, hoofdsom voor u;
// deels betaald = eerst de incassokosten, minimaal € 45 maar nooit meer dan er binnenkwam, de rest voor u.
// Rente laten we in het voorbeeld buiten beschouwing.
export const DEEL_MIN = 45

export interface Afrekening {
    kosten: number
    debiteurBetaalt: number
    naarGeldGarant: number
    naarU: number
}

/** pct = deel van het totaal (hoofdsom + incassokosten) dat de debiteur betaalt, 0 tot 1. */
export function afrekening(hoofdsom: number, pct: number): Afrekening {
    const kosten = wikKosten(hoofdsom)
    if (!(hoofdsom > 0)) return { kosten: 0, debiteurBetaalt: 0, naarGeldGarant: 0, naarU: 0 }
    const p = Math.min(Math.max(pct, 0), 1)
    const rond = (n: number) => Math.round(n * 100) / 100
    const betaald = rond((hoofdsom + kosten) * p)
    if (p >= 1) return { kosten, debiteurBetaalt: betaald, naarGeldGarant: kosten, naarU: hoofdsom }
    const naarGeldGarant = rond(Math.min(betaald, Math.max(kosten, DEEL_MIN)))
    return { kosten, debiteurBetaalt: betaald, naarGeldGarant, naarU: rond(betaald - naarGeldGarant) }
}
