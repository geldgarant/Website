// Responsiviteitsscan: alle pagina's uit de sitemap op 10 breedtes in Chromium en 3 iPhones in WebKit (Safari).
// Vindt wat de e2e-tests missen: tekst die in een te smalle kolom staat (breedte < 6,5 x de lettergrootte, 3+ regels),
// elementen die buiten beeld vallen zonder scrollcontainer, en horizontale overloop.
//
//   npm run build && npx astro preview --port 4399 --ignore-lock   (in een tweede terminal)
//   npx playwright install webkit                                  (eenmalig)
//   node scripts/dev/responsief.mjs [pad ...]                      (zonder paden: alle pagina's)

import { readFileSync } from "node:fs"
import { chromium, webkit, devices } from "playwright"

const BASIS = process.env.BASIS || "http://localhost:4399"
const paden = process.argv.slice(2).length
    ? process.argv.slice(2)
    : [...readFileSync("dist/sitemap-0.xml", "utf8").matchAll(/<loc>https:\/\/geldgarant\.com([^<]*)<\/loc>/g)].map(
          (m) => m[1] || "/",
      )

const CHROMIUM = [320, 360, 390, 414, 768, 820, 1024, 1280, 1440, 1920]
const IPHONES = ["iPhone SE", "iPhone 13", "iPhone 14 Pro Max"]

function scan() {
    const vw = window.innerWidth
    const uit = []
    const naam = (el) => {
        const k = typeof el.className === "string" ? el.className.split(" ").filter(Boolean).slice(0, 2).join(".") : ""
        return `${el.tagName.toLowerCase()}${k ? "." + k : ""} "${(el.textContent || "").trim().slice(0, 40)}"`
    }
    const clipt = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const s = getComputedStyle(p)
            if (/(auto|scroll|hidden|clip)/.test(s.overflowX) || p.hasAttribute("data-scroller")) return true
        }
        return false
    }
    if (document.documentElement.scrollWidth > vw + 1)
        uit.push(["overloop", `scrollWidth ${document.documentElement.scrollWidth}`])
    for (const el of document.querySelectorAll("h1,h2,h3,h4,p,li,dt,dd,a,span,label,button,summary,td,th,strong")) {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height) continue
        const s = getComputedStyle(el)
        if (s.visibility === "hidden" || s.display === "none") continue
        const eigen = [...el.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent)
            .join(" ")
            .trim()
        if (eigen.length >= 12) {
            // te smal = minder dan ongeveer 12 tekens per regel over 3+ regels (breedte / lettergrootte < 6,5)
            const fs = parseFloat(s.fontSize)
            const lh = parseFloat(s.lineHeight) || fs * 1.4
            const regels = Math.round(r.height / lh)
            if (regels >= 3 && r.width / fs < 6.5) uit.push(["smal", `${naam(el)} ${Math.round(r.width)}px, ${regels} regels`])
        }
        if (r.right > vw + 1 && !clipt(el)) uit.push(["buiten", `${naam(el)} rechts ${Math.round(r.right)}px`])
    }
    // woorden (8+ tekens) die midden in het woord over twee regels breken
    const loper = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const bereik = document.createRange()
    for (let n; (n = loper.nextNode());) {
        const t = n.textContent || ""
        if (t.length < 8 || !n.parentElement || n.parentElement.closest(".sr-only, script, style, [hidden]")) continue
        for (const m of t.matchAll(/\S{8,}/g)) {
            bereik.setStart(n, m.index)
            bereik.setEnd(n, m.index + m[0].length)
            const rects = [...bereik.getClientRects()].filter((x) => x.width > 0)
            if (rects.length > 1 && Math.abs(rects[0].top - rects[rects.length - 1].top) > 2) {
                uit.push(["woordbreuk", `${naam(n.parentElement)} "${m[0]}"`])
            }
        }
    }
    return uit
}

async function draai(browserType, contexten, label) {
    const b = await browserType.launch()
    const vondsten = new Map()
    for (const [naamCtx, opties] of contexten) {
        const ctx = await b.newContext({ ...opties, reducedMotion: "reduce" })
        const wachtrij = [...paden]
        await Promise.all(
            Array.from({ length: 4 }, async () => {
                const p = await ctx.newPage()
                for (let pad; (pad = wachtrij.shift());) {
                    try {
                        await p.goto(BASIS + pad, { waitUntil: "load" })
                        await p.evaluate(() => document.fonts.ready)
                        for (const [soort, info] of await p.evaluate(scan)) {
                            const sleutel = `${pad} | ${soort} | ${info.replace(/\d+px, \d+ regels|rechts \d+px|scrollWidth \d+/, "")}`
                            if (!vondsten.has(sleutel)) vondsten.set(sleutel, { pad, soort, info, waar: [] })
                            vondsten.get(sleutel).waar.push(naamCtx)
                        }
                    } catch (e) {
                        console.log(`fout ${pad} @ ${naamCtx}: ${e.message.split("\n")[0]}`)
                    }
                }
                await p.close()
            }),
        )
        await ctx.close()
    }
    await b.close()
    console.log(`\n== ${label}: ${vondsten.size} vondsten`)
    for (const v of vondsten.values()) console.log(`${v.soort.padEnd(8)} ${v.pad}  ${v.info}  [${v.waar.join(", ")}]`)
    return vondsten.size
}

const n1 = await draai(
    chromium,
    CHROMIUM.map((w) => [`${w}`, { viewport: { width: w, height: 900 } }]),
    "Chromium",
)
const n2 = await draai(
    webkit,
    IPHONES.map((d) => [d, devices[d]]),
    "WebKit (iPhone)",
)
process.exit(n1 + n2 ? 1 : 0)
