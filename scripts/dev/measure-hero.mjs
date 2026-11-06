// Meet hero-verhoudingen: kaart binnen navy vlak, verticale balans links/rechts
import { chromium } from "@playwright/test"
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const [w, h] of [
    [1920, 1080],
    [1536, 864],
    [1440, 900],
    [1280, 800],
    [1024, 768],
    [390, 844],
]) {
    const p = await b.newPage({ viewport: { width: w, height: h } })
    await p.goto("http://localhost:4399/", { waitUntil: "networkidle" })
    const r = await p.evaluate(() => {
        const box = (s) => document.querySelector(s).getBoundingClientRect()
        const c = box(".hero-copy"),
            v = box(".hero-visual"),
            k = box(".hero-card")
        return {
            copyH: Math.round(c.height),
            visH: Math.round(v.height),
            copyTop: Math.round(c.top - v.top),
            copyBottomGap: Math.round(v.bottom - c.bottom),
            kaartL: Math.round(k.left - v.left),
            kaartR: Math.round(v.right - k.right),
            kaartB: Math.round(v.bottom - k.bottom),
        }
    })
    console.log(`${w}x${h}`, JSON.stringify(r))
    if (w === 1536 || w === 390) await p.screenshot({ path: `/tmp/hero-${w}.png` })
}
await b.close()
