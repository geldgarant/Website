// Vult een gebouwde e-mail met voorbeeldwaarden en maakt screenshots op 640 px (desktop) en 375 px (mobiel).
// Gebruik: CHROME_PATH=/usr/bin/google-chrome node mails/tools/voorbeeld.mjs [naam ...]   → $UIT (standaard tijdelijke map)/mail-<naam>-<breedte>.png
// Velden zonder voorbeeldwaarde blijven als {{veld}} staan en worden gemeld.
import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { chromium } from "@playwright/test"
import { tmpdir } from "node:os"
import { join } from "node:path"
const UIT = process.env.UIT || tmpdir()
const namen = process.argv.slice(2).length
    ? process.argv.slice(2)
    : readdirSync("mails")
          .filter((f) => f.endsWith(".html"))
          .map((f) => f.slice(0, -5))
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
for (const naam of namen) {
    const waarden = JSON.parse(readFileSync(`mails/voorbeeld/${naam}.json`, "utf8"))
    const missend = new Set()
    const html = readFileSync(`mails/${naam}.html`, "utf8")
        .replace(/\{\{([\w.]+)\}\}/g, (m, k) => (k in waarden ? waarden[k] : (missend.add(k), m)))
        // logo staat pas na de deploy op geldgarant.com; voor het voorbeeld de lokale kopie
        .replace(/https:\/\/geldgarant\.com\/mail\/([\w-]+\.png)/g, (m, f) =>
            `data:image/png;base64,${readFileSync(`public/mail/${f}`).toString("base64")}`,
        )
    writeFileSync(join(UIT, `mail-${naam}.html`), html)
    if (missend.size) console.log(`${naam}: geen voorbeeld voor ${[...missend].join(", ")}`)
    for (const w of [640, 375]) {
        const p = await b.newPage({ viewport: { width: w, height: 900 } })
        await p.setContent(html, { waitUntil: "networkidle" })
        await p.screenshot({ path: join(UIT, `mail-${naam}-${w}.png`), fullPage: true })
        await p.close()
    }
    console.log(join(UIT, `mail-${naam}-640.png`) + " en -375.png")
}
await b.close()
