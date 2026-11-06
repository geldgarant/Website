import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const [name, w, h] of [
    ["desk", 1440, 900],
    ["mob", 390, 844],
]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
    await p.goto("http://localhost:4399/", { waitUntil: "networkidle" })
    await p.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")))
    await p.waitForTimeout(800)
    await p.screenshot({ path: `/tmp/home-${name}-fold.png` })
    await p.screenshot({ path: `/tmp/home-${name}-full.png`, fullPage: true })
}
await b.close()
