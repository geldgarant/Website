// Controle na de livegang (of vooraf op staging): bestaat elke oude Framer-URL nog, werken de redirects,
// en zijn de belangrijkste headers en bestanden er? Geen afhankelijkheden, alleen fetch.
//
// Gebruik: node scripts/livegang-check.mjs                      (controleert https://geldgarant.com)
//          BASIS=https://website.geldgarant.workers.dev node scripts/livegang-check.mjs
const BASIS = (process.env.BASIS ?? "https://geldgarant.com").replace(/\/$/, "")

// Alle URL's uit de sitemap van de Framer-site (7 nov 2026) plus de pagina's die alleen in de footer stonden.
const KENNISBANK = [
    "wettelijke-rente-2026",
    "eisen-correcte-factuur",
    "betalingsherinnering-aanmaning-wik-brief",
    "wat-kost-incasso-uitbesteden",
    "verjaringstermijnen-vorderingen",
    "debiteur-failliet-vordering-beschermen",
    "betalingsregeling-treffen",
    "debiteur-betwist-factuur",
    "algemene-voorwaarden-incasso",
    "wki-proof-werken-2026",
    "internationale-vordering-de-moeite-waard",
    "creditmanagement-openstaande-facturen-voorkomen",
    "loonbeslag-hoe-werkt-het",
    "beslagvrije-voet-2026",
    "incasso-zzp",
    "gerechtelijke-procedure-kantonrechter",
    "selectief-betalen-debiteur-rechten",
    "avg-en-incasso",
    "incasso-bouwsector",
    "griffierechten-2026",
    "conservatoir-beslag",
    "openstaande-factuur-stappenplan",
    "hoger-beroep-vonnis",
    "herincasso-afgeschreven-facturen",
    "geleend-geld-terugvorderen",
    "huurachterstand-incasseren",
    "bv-uitgeschreven-schulden",
]
const BRANCHES = [
    "bouw",
    "automotive",
    "dienstverlening",
    "ecommerce",
    "groothandel",
    "mkb",
    "transport",
    "verhuur",
    "zorg",
    "zzp",
]
const PAGINAS = [
    "/",
    "/incasso",
    "/incasso/incassobureau-inschakelen",
    "/incasso/incasso-in-het-buitenland",
    "/incasso/incassokosten-berekenen",
    "/incasso/wik-brief",
    "/nowid",
    "/wki",
    "/debiteurenbeheer",
    "/hulp-nodig-bij-geldproblemen",
    "/hoe-werkt-het",
    "/werken-bij",
    "/over-ons",
    "/vordering-indienen",
    "/contact-opnemen",
    "/kennisbank",
    "/branches",
    "/tarieven",
    "/klachtenregelement",
    "/brief-ontvangen", // stond in header en footer van de Framer-site
    "/juridisch",
    "/juridisch/algemene-voorwaarden",
    "/juridisch/privacy-beleid",
    "/juridisch/cookie-beleid",
    "/werken-bij/incasso-medewerker",
    "/werken-bij/call-center-medewerker",
    "/werken-bij/stage",
    ...KENNISBANK.map((s) => `/kennisbank/${s}`),
    ...BRANCHES.map((s) => `/branches/incasso-${s}`),
]
// bron → [status, doel]
const REDIRECTS = {
    "/faq": [301, "/#veelgestelde-vragen"],
    "/sitemap.xml": [301, "/sitemap-index.xml"],
    "/privacy": [301, "/juridisch/privacy-beleid"],
    "/klachtenregeling": [301, "/klachtenregelement"],
    "/incasso/": [307, "/incasso"], // drop-trailing-slash van Workers (status kan 307 of 308 zijn)
}
const BESTANDEN = ["/robots.txt", "/sitemap-index.xml", "/juridisch/algemene-voorwaarden.pdf", "/og/index.png", "/favicon.svg"]

let fout = 0
const meld = (ok, tekst) => {
    if (!ok) fout++
    console.log(`${ok ? "✓" : "✗"} ${tekst}`)
}

async function haal(pad, redirect = "follow") {
    try {
        return await fetch(BASIS + pad, { redirect, headers: { "user-agent": "GeldGarant-livegangcheck" } })
    } catch (e) {
        return { status: 0, headers: new Headers(), text: async () => String(e) }
    }
}

console.log(`Controle van ${BASIS}\n`)
for (const p of PAGINAS) {
    const r = await haal(p, "manual")
    meld(r.status === 200, `${r.status} ${p}`)
}
for (const [bron, [status, doel]] of Object.entries(REDIRECTS)) {
    const r = await haal(bron, "manual")
    const naar = (r.headers.get("location") ?? "").replace(BASIS, "")
    const statusOk = bron.endsWith("/") ? [301, 307, 308].includes(r.status) : r.status === status
    meld(statusOk && naar === doel, `${r.status} ${bron} → ${naar || "(geen)"}`)
}
for (const p of BESTANDEN) {
    const r = await haal(p)
    meld(r.status === 200, `${r.status} ${p}`)
}
const home = await haal("/")
for (const h of ["content-security-policy", "strict-transport-security", "x-content-type-options", "referrer-policy"])
    meld(!!home.headers.get(h), `header ${h}`)
const html = await home.text()
meld(/<link rel="canonical" href="https:\/\/geldgarant\.com\/?"/.test(html), "canonical wijst naar https://geldgarant.com")
meld(html.includes("tel:+31852127388"), "telefoonnummer 085 212 73 88 op de homepage")

console.log(`\n${fout === 0 ? "Alles in orde" : `${fout} probleem/problemen`}`)
process.exit(fout ? 1 : 0)
