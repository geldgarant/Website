// IndexNow: meldt URL's direct bij Bing, Yandex, Seznam en andere deelnemende zoekmachines (geen account nodig).
// Gebruik (na een geslaagde Workers Build, zodat het sleutelbestand live staat):
//   node scripts/seo/indexnow.mjs              alle URL's uit dist/sitemap-0.xml (eerst npm run build)
//   node scripts/seo/indexnow.mjs /pad /pad2   alleen deze paden
// Het sleutelbestand staat in public/<sleutel>.txt; de sleutel is geen geheim (moet publiek leesbaar zijn).
import { readFileSync, existsSync } from "node:fs"

const HOST = "geldgarant.com"
const KEY = "5a95a251ff2a96453f3636db6038652f"
const keyLocation = `https://${HOST}/${KEY}.txt`

let urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : `https://${HOST}${p.startsWith("/") ? p : "/" + p}`))
if (urls.length === 0) {
    const sitemap = "dist/sitemap-0.xml"
    if (!existsSync(sitemap)) {
        console.error(`${sitemap} ontbreekt: draai eerst npm run build, of geef paden mee.`)
        process.exit(1)
    }
    urls = [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}
if (urls.some((u) => new URL(u).host !== HOST)) {
    console.error("Alle URL's moeten op " + HOST + " staan.")
    process.exit(1)
}

// api.indexnow.org en bing.com/indexnow geven sinds 8 nov 2026 403 "UserForbiddedToAccessSite"; yandex.com accepteert
// wel en deelt de melding met de andere IndexNow-zoekmachines (Bing Webmaster Tools toont ze als ontvangen, E28).
// Daarom: eerst de gedeelde endpoint, bij een fout Yandex.
const body = JSON.stringify({ host: HOST, key: KEY, keyLocation, urlList: urls })
let ok = false
for (const endpoint of ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow"]) {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
    })
    // 200 = ontvangen, 202 = ontvangen (sleutel wordt nog gecontroleerd), 4xx = fout (zie tekst)
    console.log(`IndexNow ${new URL(endpoint).host}: ${res.status} ${res.statusText} voor ${urls.length} URL('s)`)
    const tekst = await res.text()
    if (tekst && !res.ok) console.log(tekst.slice(0, 300))
    if (res.ok) {
        ok = true
        break
    }
}
process.exit(ok ? 0 : 1)
