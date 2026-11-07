// Zoekt kleine onevenheden op alle pagina's (preview op 4399), op 390, 768 en 1440 px:
// - knoppen waarvan de inhoud niet in het midden staat (links meer wit dan rechts of andersom), pijlbol-knoppen uitgezonderd;
// - icoonknoppen (alleen een icoon) waarvan het icoon niet gecentreerd is;
// - tekst die over de rand van een knop loopt.
// Gebruik: CHROME_PATH=/usr/bin/google-chrome node scripts/dev/uitlijning.mjs [route ...]
import { chromium } from "playwright"
import { routes as alleRoutes } from "../../tests/e2e/pages.ts"

const routes = process.argv.slice(2).length ? process.argv.slice(2) : alleRoutes
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const fouten = []
for (const w of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" })
    for (const r of routes) {
        await page.goto(`http://localhost:4399${r}`, { waitUntil: "load" })
        await page.evaluate(() => document.fonts.ready)
        const res = await page.evaluate(() => {
            const out = []
            const zichtbaar = (el) => {
                const b = el.getBoundingClientRect()
                return b.width > 0 && b.height > 0 && getComputedStyle(el).visibility !== "hidden"
            }
            // zichtbare inhoud: tekst en iconen, zonder visueel verborgen tekst (.sr-only)
            const inhoudRect = (el) => {
                const rects = []
                const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
                for (let n = walker.nextNode(); n; n = walker.nextNode()) {
                    const ouder = n.nodeType === 3 ? n.parentElement : n
                    if (!ouder || ouder.closest(".sr-only, [hidden]")) continue
                    if (n.nodeType === 3) {
                        if (!n.textContent.trim()) continue
                        const range = document.createRange()
                        range.selectNodeContents(n)
                        rects.push(...range.getClientRects())
                    } else if (n.tagName === "svg" || n.tagName === "IMG") rects.push(n.getBoundingClientRect())
                }
                const r = rects.filter((x) => x.width > 0.5 && x.height > 0.5)
                if (!r.length) return null
                return {
                    left: Math.min(...r.map((x) => x.left)),
                    right: Math.max(...r.map((x) => x.right)),
                    top: Math.min(...r.map((x) => x.top)),
                    bottom: Math.max(...r.map((x) => x.bottom)),
                }
            }
            const naam = (el) => (el.textContent || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 40)
            for (const el of document.querySelectorAll(".btn, button, [role=button]")) {
                if (!zichtbaar(el) || el.closest("[hidden]")) continue
                if (el.querySelector(".btn-dot")) continue
                const b = el.getBoundingClientRect()
                const c = inhoudRect(el)
                if (!c) continue
                const links = c.left - b.left
                const rechts = b.right - c.right
                const boven = c.top - b.top
                const onder = b.bottom - c.bottom
                const cs = getComputedStyle(el)
                // alleen knoppen met gecentreerde inhoud beoordelen
                const gecentreerd = cs.justifyContent === "center" || cs.textAlign === "center"
                if (gecentreerd && Math.abs(links - rechts) > 3 && b.width < 700)
                    out.push({ soort: "horizontaal", naam: naam(el), links: Math.round(links), rechts: Math.round(rechts) })
                if (cs.alignItems === "center" && Math.abs(boven - onder) > 3 && b.height < 120)
                    out.push({ soort: "verticaal", naam: naam(el), boven: Math.round(boven), onder: Math.round(onder) })
                if (c.right > b.right + 1 || c.left < b.left - 1) out.push({ soort: "loopt-over", naam: naam(el) })
            }
            return out
        })
        for (const f of res) fouten.push({ breedte: w, route: r, ...f })
    }
    await page.close()
}
await browser.close()
// samenvatten per knop en soort: op hoeveel pagina's en breedtes
const uniek = new Map()
for (const f of fouten) {
    const k = `${f.soort}|${f.naam}`
    const u = uniek.get(k) ?? { ...f, routes: new Set(), breedtes: new Set() }
    u.routes.add(f.route)
    u.breedtes.add(f.breedte)
    uniek.set(k, u)
}
console.log(`${uniek.size} onevenheden`)
for (const f of uniek.values())
    console.log(JSON.stringify({ ...f, routes: [...f.routes].slice(0, 4), aantal: f.routes.size, breedtes: [...f.breedtes] }))
