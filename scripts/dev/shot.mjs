import { chromium } from "@playwright/test"
// Gebruik: node scripts/dev/shot.mjs [route]  (standaard "/"; bestandsnaam volgt de route, bv. /tmp/incasso-mob-full.png)
const route = process.argv[2] || "/"
const naam = route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-")
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const [name, w, h] of [
    ["desk", 1440, 900],
    ["mob", 390, 844],
]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
    await p.goto(`http://localhost:4399${route}`, { waitUntil: "networkidle" })
    await p.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")))
    await p.waitForTimeout(800)
    await p.screenshot({ path: `/tmp/${naam}-${name}-fold.png` })
    await p.screenshot({ path: `/tmp/${naam}-${name}-full.png`, fullPage: true })
}
await b.close()
