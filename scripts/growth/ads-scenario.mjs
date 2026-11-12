// Rekenmodel Google Ads voor GeldGarant: budget → klikken → aanvragen → opdrachtgevers → dossiers → incassokosten.
// Alle invoer is AANNAME tot er eigen data is (zie docs/growth/google-ads.md). Omzet volgt de AV: GeldGarant
// verdient de WIK-incassokosten als de debiteur betaalt (geen succesfee); rente en deelbetalingen laten we weg
// (voorzichtig). Gebruik: node scripts/growth/ads-scenario.mjs [--csv]
import { wikKosten } from "../../src/lib/wik.ts"

const UURWAARDE = 45 // AANNAME, zelfde als het callcenter-model (GeldGarant-Callcenter/09)

const SCENARIOS = {
    pessimistisch: { cpc: 20, cvr: 0.03, kwal: 0.5, close: 0.6, dossiers: 1.3, hoofdsom: 1500, inning: 0.4, uren: 2.5 },
    basis: { cpc: 15, cvr: 0.06, kwal: 0.65, close: 0.75, dossiers: 2.5, hoofdsom: 3000, inning: 0.55, uren: 2 },
    optimistisch: { cpc: 10, cvr: 0.1, kwal: 0.8, close: 0.9, dossiers: 5, hoofdsom: 6000, inning: 0.7, uren: 1.5 },
}
const BUDGETTEN = [300, 750, 1500]

const r0 = (n) => Math.round(n)
const r1 = (n) => Math.round(n * 10) / 10
const r2 = (n) => Math.round(n * 100) / 100

export function reken(s, budget) {
    const klikken = budget / s.cpc
    const aanvragen = klikken * s.cvr
    const gekwalificeerd = aanvragen * s.kwal
    const klanten = gekwalificeerd * s.close
    const feePerDossier = wikKosten(s.hoofdsom) * s.inning
    const kostenPerDossier = s.uren * UURWAARDE
    const margePerDossier = feePerDossier - kostenPerDossier
    const margePerKlant = margePerDossier * s.dossiers // eerste 12 maanden
    const cac = klanten > 0 ? budget / klanten : Infinity
    const nettoMaand = klanten * margePerKlant - budget
    const breakEvenCpc = margePerKlant * s.cvr * s.kwal * s.close
    return {
        budget,
        klikken: r0(klikken),
        aanvragen: r1(aanvragen),
        gekwalificeerd: r1(gekwalificeerd),
        klanten: r2(klanten),
        dossiers12m: r1(klanten * s.dossiers),
        feePerDossier: r0(feePerDossier),
        margePerDossier: r0(margePerDossier),
        margePerKlant12m: r0(margePerKlant),
        cac: r0(cac),
        nettoPerMaandBudget12m: r0(nettoMaand),
        breakEvenCpc: r2(breakEvenCpc),
    }
}

const rijen = []
for (const [naam, s] of Object.entries(SCENARIOS)) for (const b of BUDGETTEN) rijen.push({ scenario: naam, ...reken(s, b) })

if (process.argv.includes("--csv")) {
    const kop = Object.keys(rijen[0])
    console.log(kop.join(","))
    for (const r of rijen) console.log(kop.map((k) => r[k]).join(","))
} else {
    console.table(rijen)
    console.log("Invoer (AANNAMES):", SCENARIOS)
}
