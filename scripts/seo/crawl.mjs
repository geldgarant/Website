// SEO-nulmeting: crawlt de sitemap van een omgeving en schrijft per URL de kerneigenschappen weg.
// Gebruik: NODE_USE_ENV_PROXY=1 node scripts/seo/crawl.mjs [basis] [uitvoer.csv]
//   basis   standaard https://geldgarant.com (ook http://localhost:4399 voor de lokale preview)
//   uitvoer standaard docs/seo/crawl-<datum>.csv
// Geen afhankelijkheden; regex-parsing is genoeg voor onze eigen, voorspelbare HTML (Astro, statisch).
// Meet niet: gerenderde DOM na JavaScript (onze kerninhoud is servergerenderd), Core Web Vitals, backlinks.
import { writeFileSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"

const BASIS = (process.argv[2] || "https://geldgarant.com").replace(/\/$/, "")
const DATUM = new Date().toISOString().slice(0, 10)
const UIT = process.argv[3] || `docs/seo/crawl-${DATUM}.csv`
const UA = "GeldGarant-SEO-crawl/1.0 (+https://geldgarant.com)"

const haal = async (url, opts = {}) => {
    const r = await fetch(url, { redirect: "manual", headers: { "user-agent": UA }, ...opts })
    return { status: r.status, location: r.headers.get("location"), robots: r.headers.get("x-robots-tag"), tekst: await r.text() }
}
const eerste = (re, s) => (s.match(re) || [])[1] || ""
const ontsnap = (s) =>
    s
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")

async function sitemapUrls() {
    const index = await haal(`${BASIS}/sitemap-index.xml`)
    const kaarten = [...index.tekst.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    const urls = []
    for (const k of kaarten) {
        const pad = new URL(k).pathname
        const s = await haal(`${BASIS}${pad}`)
        urls.push(...[...s.tekst.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))
    }
    return [...new Set(urls)]
}

function analyseer(pad, html) {
    const main = eerste(/<main[^>]*>([\s\S]*?)<\/main>/i, html) || html
    const tekst = main
        .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
        try {
            const j = JSON.parse(m[1])
            return [j].flat().map((x) => x["@type"])
        } catch {
            return ["ONGELDIG"]
        }
    })
    const links = [...main.matchAll(/<a\s[^>]*href="([^"#?]*)[^"]*"/gi)]
        .map((m) => m[1])
        .filter((h) => h.startsWith("/") && !h.startsWith("//"))
        .map((h) => h.replace(/\/$/, "") || "/")
    return {
        pad,
        title: ontsnap(eerste(/<title>([^<]*)<\/title>/, html)),
        description: ontsnap(eerste(/<meta name="description" content="([^"]*)"/, html)),
        canonical: eerste(/<link rel="canonical" href="([^"]*)"/, html),
        robots: eerste(/<meta name="robots" content="([^"]*)"/, html),
        h1: [...html.matchAll(/<h1[\s>]/g)].length,
        h1tekst: ontsnap(
            eerste(/<h1[^>]*>([\s\S]*?)<\/h1>/, html)
                .replace(/<[^>]+>/g, "")
                .replace(/\s+/g, " ")
                .trim(),
        ),
        woorden: tekst ? tekst.split(" ").length : 0,
        ld: [...new Set(ld)].join("+"),
        imgZonderAlt: [...html.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)].length,
        links: [...new Set(links)],
    }
}

const urls = await sitemapUrls()
const rijen = []
for (let i = 0; i < urls.length; i += 6) {
    const batch = await Promise.all(
        urls.slice(i, i + 6).map(async (pad) => {
            const r = await haal(`${BASIS}${pad}`)
            return { status: r.status, xrobots: r.robots || "", ...analyseer(pad, r.tekst) }
        }),
    )
    rijen.push(...batch)
}
// inkomende interne links (alleen vanuit <main>, dus zonder header/footer)
const inlinks = Object.fromEntries(rijen.map((r) => [r.pad.replace(/\/$/, "") || "/", 0]))
for (const r of rijen) for (const l of r.links) if (l in inlinks && l !== (r.pad.replace(/\/$/, "") || "/")) inlinks[l]++

const kol = [
    "pad",
    "status",
    "title",
    "titleLen",
    "description",
    "descLen",
    "canonical",
    "canonicalOk",
    "robots",
    "xrobots",
    "h1",
    "h1tekst",
    "woorden",
    "ld",
    "imgZonderAlt",
    "inlinksMain",
]
const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`
const regels = [kol.join(",")]
for (const r of rijen) {
    const sleutel = r.pad.replace(/\/$/, "") || "/"
    const verwacht = `https://geldgarant.com${sleutel === "/" ? "/" : sleutel}`
    regels.push(
        [
            r.pad,
            r.status,
            r.title,
            r.title.length,
            r.description,
            r.description.length,
            r.canonical,
            r.canonical === verwacht,
            r.robots,
            r.xrobots,
            r.h1,
            r.h1tekst,
            r.woorden,
            r.ld,
            r.imgZonderAlt,
            inlinks[sleutel],
        ]
            .map(csv)
            .join(","),
    )
}
mkdirSync(dirname(UIT), { recursive: true })
writeFileSync(UIT, regels.join("\n") + "\n")

// redirects van varianten
const varianten = {}
for (const v of ["http://geldgarant.com/", "https://www.geldgarant.com/", "http://www.geldgarant.com/"]) {
    try {
        const r = await haal(v)
        varianten[v] = `${r.status} → ${r.location}`
    } catch (e) {
        varianten[v] = `fout: ${e.message}`
    }
}
const samenvatting = {
    basis: BASIS,
    datum: DATUM,
    urls: rijen.length,
    niet200: rijen.filter((r) => r.status !== 200).map((r) => `${r.pad} ${r.status}`),
    canonicalFout: rijen
        .filter((r) => r.canonical !== `https://geldgarant.com${r.pad.replace(/\/$/, "") || "/"}`)
        .map((r) => r.pad),
    noindex: rijen.filter((r) => /noindex/.test(r.robots + r.xrobots)).map((r) => r.pad),
    h1Niet1: rijen.filter((r) => r.h1 !== 1).map((r) => `${r.pad} (${r.h1})`),
    titleLang: rijen.filter((r) => r.title.length > 65).map((r) => `${r.pad} (${r.title.length})`),
    descBuiten: rijen
        .filter((r) => r.description.length < 110 || r.description.length > 165)
        .map((r) => `${r.pad} (${r.description.length})`),
    zonderLd: rijen.filter((r) => !r.ld).map((r) => r.pad),
    dun: rijen.filter((r) => r.woorden < 400).map((r) => `${r.pad} (${r.woorden})`),
    weinigInlinks: Object.entries(inlinks)
        .filter(([, n]) => n < 2)
        .map(([p, n]) => `${p} (${n})`),
    imgZonderAlt: rijen.filter((r) => r.imgZonderAlt).map((r) => `${r.pad} (${r.imgZonderAlt})`),
    varianten,
    uitvoer: UIT,
}
console.log(JSON.stringify(samenvatting, null, 2))
