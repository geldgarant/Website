// Controle op veel schermbreedtes: horizontale overloop, header-hoogte, kleine tikdoelen; plus header-screenshots
import { chromium } from "@playwright/test"
// Gebruik: node scripts/dev/resoluties.mjs [route]  (standaard "/")
const route = process.argv[2] || "/"
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
for (const w of [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, isMobile: w < 1024, hasTouch: w < 1024 })
    await p.goto(`http://localhost:4399${route}`, { waitUntil: "networkidle" })
    const r = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const over = [...document.querySelectorAll("body *")]
            .filter((el) => {
                if (el.closest("[data-scroller]") && !el.matches("[data-scroller]")) return false
                const x = el.getBoundingClientRect()
                return x.width > 0 && (x.right > vw + 1 || x.left < -1)
            })
            .slice(0, 3)
            .map((el) => el.tagName + "." + String(el.className).slice(0, 30))
        const small = [...document.querySelectorAll("a, button, summary, label")]
            .filter((el) => {
                const x = el.getBoundingClientRect()
                return x.width > 0 && x.height > 0 && x.height < 24 && !el.closest("p, dd, td, li.footer-legal")
            })
            .slice(0, 3)
            .map((el) => el.textContent.trim().slice(0, 25))
        return {
            sw: document.documentElement.scrollWidth,
            over,
            small,
            bar: Math.round(document.querySelector(".bar").getBoundingClientRect().height),
        }
    })
    console.log(w, JSON.stringify(r))
    if (w === 390 || w === 1440) {
        await p.screenshot({ path: `/tmp/hdr-${w}-top.png`, clip: { x: 0, y: 0, width: w, height: 260 } })
        await p.evaluate(() => window.scrollTo(0, 1400))
        await p.waitForTimeout(400)
        await p.screenshot({ path: `/tmp/hdr-${w}-scroll.png`, clip: { x: 0, y: 0, width: w, height: 160 } })
        if (w === 390) {
            await p.evaluate(() => window.scrollTo(0, 0))
            await p.click("[data-menu-toggle]")
            await p.waitForTimeout(300)
            await p.screenshot({ path: `/tmp/hdr-390-menu.png` })
        }
    }
}
await b.close()
