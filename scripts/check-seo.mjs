// Controleert de gebouwde site (dist) op technische SEO: unieke titles en descriptions,
// canonical, één h1, eigen og:image die bestaat, lang-attribuut, geldige JSON-LD met verplichte velden, sitemap en robots.txt.
// Gebruik: npm run build && node scripts/check-seo.mjs
import fs from "node:fs"
import path from "node:path"

const dist = path.resolve("dist")
const files = []
const walk = (d) =>
    fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
        const p = path.join(d, e.name)
        if (e.isDirectory()) walk(p)
        else if (e.name.endsWith(".html")) files.push(p)
    })
walk(dist)

const problems = []
const titles = new Map()
const descs = new Map()
const req = {
    FAQPage: ["mainEntity"],
    ProfessionalService: ["name", "address", "telephone", "url"],
    LocalBusiness: ["name", "address", "telephone", "url"],
    Article: ["headline", "datePublished", "author"],
    BreadcrumbList: ["itemListElement"],
}

for (const f of files) {
    const rel =
        "/" +
        path
            .relative(dist, f)
            .replace(/index\.html$/, "")
            .replace(/\\/g, "/")
    if (rel.startsWith("/404")) continue
    const html = fs.readFileSync(f, "utf8")
    const get = (re) => (html.match(re) || [])[1]
    const title = get(/<title>([^<]*)<\/title>/)
    const desc = get(/<meta name="description" content="([^"]*)"/)
    if (!title) problems.push(`${rel}: geen <title>`)
    if (!desc) problems.push(`${rel}: geen meta description`)
    if (!/<link rel="canonical"/.test(html)) problems.push(`${rel}: geen canonical`)
    if (!/<html lang="nl"/.test(html)) problems.push(`${rel}: lang="nl" ontbreekt`)
    const h1 = (html.match(/<h1[\s>]/g) || []).length
    if (h1 !== 1) problems.push(`${rel}: ${h1} h1-koppen (verwacht 1)`)
    const og = get(/<meta property="og:image" content="([^"]*)"/)
    if (!og) problems.push(`${rel}: geen og:image`)
    else if (!fs.existsSync(path.join(dist, new URL(og).pathname)))
        problems.push(`${rel}: og:image ${new URL(og).pathname} bestaat niet`)
    if (title) titles.set(title, [...(titles.get(title) || []), rel])
    if (desc) descs.set(desc, [...(descs.get(desc) || []), rel])
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
            const data = JSON.parse(m[1])
            for (const veld of req[data["@type"]] || [])
                if (data[veld] == null) problems.push(`${rel}: JSON-LD ${data["@type"]} mist "${veld}"`)
        } catch {
            problems.push(`${rel}: ongeldige JSON-LD`)
        }
    }
}
for (const [t, r] of titles) if (r.length > 1) problems.push(`dubbele title "${t}" op ${r.join(", ")}`)
for (const r of descs.values()) if (r.length > 1) problems.push(`dubbele description op ${r.join(", ")}`)
if (!fs.existsSync(path.join(dist, "robots.txt"))) problems.push("robots.txt ontbreekt")
if (!fs.readdirSync(dist).some((f) => f.startsWith("sitemap"))) problems.push("sitemap ontbreekt")

console.log(`${files.length} pagina's gecontroleerd`)
if (problems.length) {
    console.error(problems.map((p) => "  ✗ " + p).join("\n"))
    process.exit(1)
}
console.log("  ✓ geen SEO-problemen gevonden")
