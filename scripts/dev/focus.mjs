// Toetsenbordcontrole (preview op 4399): tabt door een pagina en controleert per element
// 1) dat de focus zichtbaar is (outline of box-shadow verandert ten opzichte van zonder focus),
// 2) dat het element in beeld is als het focus heeft,
// 3) dat de eerste tab de skiplink "Naar de inhoud" is.
// Gebruik: CHROME_PATH=/usr/bin/google-chrome node scripts/dev/focus.mjs [route ...]
import { chromium } from "playwright"

const routes = process.argv.slice(2).length
    ? process.argv.slice(2)
    : [
          "/",
          "/incasso",
          "/tarieven",
          "/vordering-indienen",
          "/contact-opnemen",
          "/werken-bij/incasso-medewerker",
          "/juridisch/algemene-voorwaarden",
          "/klachtenregelement",
          "/hulp-nodig-bij-geldproblemen",
          "/kennisbank/griffierechten-2026",
      ]
const MAX = 90
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
let totaal = 0
for (const w of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" })
    for (const r of routes) {
        await page.goto(`http://localhost:4399${r}`, { waitUntil: "load" })
        await page.evaluate(() => document.fonts.ready)
        const problemen = []
        for (let i = 0; i < MAX; i++) {
            await page.keyboard.press("Tab")
            const info = await page.evaluate(() => {
                const el = document.activeElement
                if (!el || el === document.body) return null
                const cs = getComputedStyle(el)
                const zichtbaar =
                    (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
                    (cs.boxShadow && cs.boxShadow !== "none") ||
                    el.matches(":focus-visible") === false
                const b = el.getBoundingClientRect()
                const inBeeld = b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth
                const naam = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("name") || el.tagName)
                    .replace(/\s+/g, " ")
                    .trim()
                    .slice(0, 40)
                return { naam, tag: el.tagName.toLowerCase(), zichtbaar, inBeeld, w: b.width, h: b.height }
            })
            if (!info) break
            if (i === 0 && !/naar de inhoud/i.test(info.naam))
                problemen.push(`eerste tab is niet de skiplink maar "${info.naam}"`)
            if (!info.zichtbaar) problemen.push(`geen zichtbare focus: ${info.tag} "${info.naam}"`)
            if (!info.inBeeld && info.w > 0 && info.h > 0) problemen.push(`focus buiten beeld: ${info.tag} "${info.naam}"`)
        }
        const uniek = [...new Set(problemen)]
        totaal += uniek.length
        if (uniek.length) console.log(`${w}px ${r}\n  ` + uniek.slice(0, 8).join("\n  "))
    }
    await page.close()
}
await browser.close()
console.log(`${totaal} focusproblemen`)
