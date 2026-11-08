// Uptimecontrole voor geldgarant.com (draait elk kwartier in .github/workflows/uptime.yml, kan ook lokaal).
// Controleert de pagina's, de doorverwijzingen, de betaalkoppeling met CaseControl, de QR-route van de brieven en de
// intake-worker (formulieren). Elke controle krijgt bij een fout nog één kans na 20 seconden, zodat een korte hapering
// geen melding geeft. Uitkomst: tabel op stdout, Markdown in $GITHUB_STEP_SUMMARY en uptime-uitkomst.md, exitcode 1
// als er iets stuk is.
//
//   node scripts/uptime.mjs                 productie
//   BASIS=https://website.geldgarant.workers.dev node scripts/uptime.mjs   staging (zonder www/http-controles)

import { appendFileSync, writeFileSync } from "node:fs"

const BASIS = (process.env.BASIS || "https://geldgarant.com").replace(/\/$/, "")
const PRODUCTIE = BASIS === "https://geldgarant.com"
const API = process.env.API || "https://api.geldgarant.com"
const UA = "GeldGarant-uptimecontrole/1.0 (+https://geldgarant.com)"
const TIMEOUT = 15_000

async function haal(url, opties = {}) {
    const start = Date.now()
    const r = await fetch(url, {
        redirect: "manual",
        headers: { "User-Agent": UA, ...(opties.headers || {}) },
        signal: AbortSignal.timeout(TIMEOUT),
    })
    return { r, ms: Date.now() - start }
}

const pagina = (pad, tekst = "GeldGarant") => ({
    naam: `Pagina ${pad}`,
    async test() {
        const { r, ms } = await haal(BASIS + pad)
        if (r.status !== 200) return { ok: false, ms, info: `status ${r.status}` }
        const html = await r.text()
        if (!html.includes(tekst)) return { ok: false, ms, info: `tekst "${tekst}" ontbreekt` }
        return { ok: true, ms, info: "200" }
    },
})

const doorverwijzing = (naam, van, naar) => ({
    naam,
    async test() {
        const { r, ms } = await haal(van)
        const plek = r.headers.get("location") || ""
        const ok = r.status === 301 && plek.replace(/\/$/, "") === naar.replace(/\/$/, "")
        return { ok, ms, info: `${r.status} → ${plek || "(geen)"}` }
    },
})

export const controles = [
    pagina("/", "Wij halen uw geld"),
    pagina("/vordering-indienen"),
    pagina("/contact-opnemen"),
    pagina("/brief-ontvangen"),
    pagina("/tarieven"),
    {
        naam: "Sitemap",
        async test() {
            const { r, ms } = await haal(`${BASIS}/sitemap-index.xml`)
            return { ok: r.status === 200, ms, info: `status ${r.status}` }
        },
    },
    {
        naam: "Betalen via iDEAL (koppeling CaseControl)",
        async test() {
            const { r, ms } = await haal(`${BASIS}/api/betalen`, { headers: { Accept: "application/json" } })
            const d = await r.json().catch(() => ({}))
            return { ok: r.status === 200 && d.ok === true, ms, info: `status ${r.status} ${JSON.stringify(d).slice(0, 160)}` }
        },
    },
    {
        naam: "QR-code in brieven (/api/qr)",
        async test() {
            const data = encodeURIComponent(`${BASIS}/betalen`)
            const { r, ms } = await haal(`${BASIS}/api/qr?d=00-0000&data=${data}`)
            const type = r.headers.get("content-type") || ""
            return { ok: r.status === 200 && type.startsWith("image/png"), ms, info: `status ${r.status} ${type}` }
        },
    },
    {
        naam: "Formulieren (intake-worker)",
        async test() {
            const { r, ms } = await haal(`${API}/api/health`, { headers: { Accept: "application/json" } })
            const d = await r.json().catch(() => ({}))
            return { ok: r.status === 200 && d.ok === true, ms, info: `status ${r.status}` }
        },
    },
    ...(PRODUCTIE
        ? [
              doorverwijzing("www naar geldgarant.com", "https://www.geldgarant.com/", "https://geldgarant.com/"),
              doorverwijzing("http naar https", "http://geldgarant.com/", "https://geldgarant.com/"),
          ]
        : []),
]

async function voerUit(c) {
    try {
        return await c.test()
    } catch (e) {
        return {
            ok: false,
            ms: TIMEOUT,
            info: e?.name === "TimeoutError" ? "geen antwoord binnen 15 s" : String(e?.cause?.code || e?.message || e),
        }
    }
}

const wacht = (ms) => new Promise((klaar) => setTimeout(klaar, ms))

const uitkomsten = []
for (const c of controles) {
    let u = await voerUit(c)
    if (!u.ok) {
        await wacht(20_000)
        const tweede = await voerUit(c)
        u = tweede.ok ? { ...tweede, info: `${tweede.info} (eerste poging: ${u.info})` } : tweede
    }
    uitkomsten.push({ naam: c.naam, ...u })
    console.log(`${u.ok ? "OK  " : "FOUT"}  ${c.naam.padEnd(44)} ${String(u.ms).padStart(6)} ms  ${u.info}`)
}

const fouten = uitkomsten.filter((u) => !u.ok)
const tijd = new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })
const md = [
    `${fouten.length ? "**Storing**" : "**Alles werkt**"} (${tijd}, ${BASIS})`,
    "",
    "| Controle | Uitkomst | Tijd | Details |",
    "| --- | --- | ---: | --- |",
    ...uitkomsten.map((u) => `| ${u.naam} | ${u.ok ? "OK" : "**FOUT**"} | ${u.ms} ms | ${u.info.replace(/\|/g, "/")} |`),
    "",
].join("\n")

writeFileSync("uptime-uitkomst.md", md)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md)
process.exit(fouten.length ? 1 : 0)
