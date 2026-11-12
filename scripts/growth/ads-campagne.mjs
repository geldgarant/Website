// Google Ads-test (pilot) als importbestand voor Google Ads Editor (Account → Importeren → Uit bestand).
// Controleert de tekenlimieten (kop 30, beschrijving 90, pad 15) en schrijft docs/growth/ads-import.csv.
// Gebruik: node scripts/growth/ads-campagne.mjs
// Inhoud volgt de site en de AV: geen garanties op inning, geen uitroeptekens, "Geregistreerd bij Justis".
import { writeFileSync } from "node:fs"

const CAMPAGNE = "Zoeken | Incasso pilot"
const BUDGET = 15 // euro per dag; maandplafond ±€ 450 bij 30 dagen
const MAX_CPC = 4.0 // startbod; Google kan bij "Klikken maximaliseren" lager uitkomen. Bijsturen na week 1.
const BASIS = "https://geldgarant.com"

const GEDEELD = {
    koppen: [
        "Incassobureau voor ondernemers",
        "Alles betaald: u betaalt niets",
        "Geregistreerd bij Justis 00273",
        "Binnen het uur in behandeling",
        "In 3 minuten online ingediend",
        "Vaste dossierbehandelaar",
        "Wekelijks uw geld uitbetaald",
    ],
    beschrijvingen: [
        "Betaalt uw klant de volledige vordering, dan betaalt u niets. Niets binnen? Ook € 0.",
        "Dien uw vordering online in. Op werkdagen binnen het uur in behandeling.",
    ],
}

const GROEPEN = [
    {
        naam: "Incassobureau inschakelen",
        url: "/incasso/incassobureau-inschakelen",
        pad: ["incasso", "inschakelen"],
        zoekwoorden: [
            "[incassobureau inschakelen]",
            "[incasso uit handen geven]",
            '"incassobureau inschakelen zzp"',
            "[zakelijk incassobureau]",
            "[incassobureau zakelijk]",
            "[incassobureau voor bedrijven]",
        ],
        koppen: ["Incassobureau inschakelen", "Incasso uit handen geven", "Zakelijke incasso, heel NL"],
        beschrijvingen: ["Wanneer schakelt u een incassobureau in? Wij nemen het direct van u over."],
    },
    {
        naam: "Kosten en no cure no pay",
        url: "/tarieven",
        pad: ["tarieven", "kosten"],
        zoekwoorden: [
            "[no cure no pay incasso]",
            "[incassobureau no cure no pay]",
            "[kosten incassobureau]",
            "[wat kost een incassobureau]",
            "[incassobureau kosten]",
        ],
        koppen: ["Incasso zonder kosten vooraf", "Heldere tarieven per situatie", "Wat kost incasso? Reken het na"],
        beschrijvingen: ["Deels betaald? Eerst de incassokosten, nooit meer dan er binnenkwam. Alles staat online."],
    },
    {
        naam: "Huurachterstand",
        url: "/branches/incasso-verhuur",
        pad: ["incasso", "verhuur"],
        zoekwoorden: [
            "[incasso huurachterstand]",
            "[incassobureau huurachterstand]",
            '"huurachterstand innen"',
            "[incasso verhuurder]",
            "[incassobureau verhuurder]",
        ],
        koppen: ["Huurachterstand laten innen", "Incasso voor verhuurders", "Snel actie bij huurachterstand"],
        beschrijvingen: ["Van herinnering tot betalingsregeling: wij pakken huurachterstand voor u aan."],
    },
    {
        naam: "Onbetaalde factuur",
        url: "/vordering-indienen",
        pad: ["vordering", "indienen"],
        zoekwoorden: [
            "[onbetaalde factuur innen]",
            '"openstaande factuur innen"',
            "[factuur laten innen]",
            "[klant betaalt factuur niet]",
            "[incasso zzp]",
        ],
        koppen: ["Onbetaalde factuur innen", "Klant betaalt niet? Wij innen", "Vordering direct indienen"],
        beschrijvingen: ["Stuur uw onbetaalde factuur in drie minuten in. U volgt uw dossier online."],
    },
]

// Uitsluiten op campagneniveau (debiteuren, vacatures, consumentenschulden, doe-het-zelf zonder dienstintentie)
const NEGATIEF = [
    "betalen",
    "betaling regelen",
    "brief ontvangen",
    "bezwaar",
    "klacht",
    "schuldhulp",
    "schulden",
    "schuldsanering",
    "vacature",
    "vacatures",
    "werken bij",
    "opleiding",
    "cursus",
    "stage",
    "cjib",
    "belastingdienst",
    "intrum",
    "flanderijn",
    "ggn",
]

const fouten = []
const check = (tekst, max, wat) => {
    if (tekst.length > max) fouten.push(`${wat} te lang (${tekst.length}/${max}): ${tekst}`)
    if (/[!—–]/.test(tekst)) fouten.push(`${wat} bevat uitroepteken of streepje: ${tekst}`)
}

const kop = [
    "Campaign",
    "Campaign Daily Budget",
    "Campaign Type",
    "Networks",
    "Ad Group",
    "Max CPC",
    "Keyword",
    "Criterion Type",
    "Ad type",
    "Final URL",
    "Path 1",
    "Path 2",
    ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
]
const rijen = []
const rij = (o) => rijen.push(kop.map((k) => o[k] ?? ""))

rij({ Campaign: CAMPAGNE, "Campaign Daily Budget": BUDGET, "Campaign Type": "Search", Networks: "Google search" })

for (const g of GROEPEN) {
    rij({ Campaign: CAMPAGNE, "Ad Group": g.naam, "Max CPC": MAX_CPC.toFixed(2) })
    for (const z of g.zoekwoorden) {
        const type = z.startsWith("[") ? "Exact" : z.startsWith('"') ? "Phrase" : "Broad"
        rij({ Campaign: CAMPAGNE, "Ad Group": g.naam, Keyword: z.replace(/^[["]|[\]"]$/g, ""), "Criterion Type": type })
    }
    const koppen = [...g.koppen, ...GEDEELD.koppen]
    const beschrijvingen = [...g.beschrijvingen, ...GEDEELD.beschrijvingen].slice(0, 4)
    koppen.forEach((k) => check(k, 30, "Kop"))
    beschrijvingen.forEach((b) => check(b, 90, "Beschrijving"))
    g.pad.forEach((p) => check(p, 15, "Pad"))
    if (koppen.length < 3 || koppen.length > 15) fouten.push(`${g.naam}: ${koppen.length} koppen`)
    const ad = {
        Campaign: CAMPAGNE,
        "Ad Group": g.naam,
        "Ad type": "Responsive search ad",
        "Final URL": BASIS + g.url,
        "Path 1": g.pad[0],
        "Path 2": g.pad[1],
    }
    koppen.forEach((k, i) => (ad[`Headline ${i + 1}`] = k))
    beschrijvingen.forEach((b, i) => (ad[`Description ${i + 1}`] = b))
    rij(ad)
}
for (const n of NEGATIEF) rij({ Campaign: CAMPAGNE, Keyword: n, "Criterion Type": "Campaign Negative Phrase" })

if (fouten.length) {
    console.error(fouten.join("\n"))
    process.exit(1)
}
const csv = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))
writeFileSync("docs/growth/ads-import.csv", [kop, ...rijen].map((r) => r.map(csv).join(",")).join("\n") + "\n")
console.log(
    `ok: ${GROEPEN.length} advertentiegroepen, ${GROEPEN.reduce((n, g) => n + g.zoekwoorden.length, 0)} zoekwoorden, ${NEGATIEF.length} uitsluitingen`,
)
