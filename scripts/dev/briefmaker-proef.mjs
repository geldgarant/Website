// Proef van de briefmaker: vult het formulier, maakt screenshots (1440 en 390) en downloadt het Word-bestand.
// Gebruik: CHROME_PATH=/usr/bin/google-chrome node scripts/dev/briefmaker-proef.mjs [route]  (preview op 4399)
// Uitvoer in /tmp: bm-<naam>-desk.png, bm-<naam>-mob.png, bm-<naam>.docx
import { chromium } from "@playwright/test"
const route = process.argv[2] || "/voorbeeldbrieven/sommatie"
const naam = route.split("/").pop().split("#")[0] || "brief"
const invoer = {
    klant: "Voorbeeldklant Bouw",
    aanhef: "heer De Vries",
    klantAdres: "Markt 2, 8011 AA Zwolle",
    factuur: "2026-118",
    bedrag: "1.250,00",
    factuurdatum: "2026-10-02",
    vervaldatum: "2026-11-01",
    afzender: "Voorbeeldbedrijf",
    plaats: "Deventer",
    iban: "NL00BANK0123456789",
    ondertekenaar: "P. Jansen",
    termijnen: "6",
    eerste: "2026-12-01",
}
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const [soort, w, h] of [
    ["desk", 1440, 900],
    ["mob", 390, 844],
]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, acceptDownloads: true, reducedMotion: "reduce" })
    await p.goto(`http://localhost:4399${route}`, { waitUntil: "networkidle" })
    for (const [k, v] of Object.entries(invoer)) {
        const el = p.locator(`[data-briefmaker] input[name="${k}"]`)
        if (await el.count()) await el.fill(v)
    }
    await p.locator("#briefmaker").scrollIntoViewIfNeeded()
    await p.evaluate(() => document.querySelector("#briefmaker").scrollIntoView({ block: "start" }))
    await p.waitForTimeout(400)
    await p.screenshot({ path: `/tmp/bm-${naam}-${soort}.png` })
    if (soort === "desk") {
        console.log("status:", await p.locator("[data-bm-status]").textContent())
        console.log("open plaatshouders:", await p.locator("[data-papier] .ph").count())
        const [dl] = await Promise.all([p.waitForEvent("download"), p.click('[data-bm="word"]')])
        await dl.saveAs(`/tmp/bm-${naam}.docx`)
        console.log("download:", dl.suggestedFilename())
    }
    await p.close()
}
await b.close()
