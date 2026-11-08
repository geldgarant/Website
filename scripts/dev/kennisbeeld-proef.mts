// Proefvel van alle kennisbank-illustraties: npx tsx scripts/dev/kennisbeeld-proef.mts <uit.png>
import { chromium } from "playwright"
import { BEELDEN, beeldVoor } from "../../src/lib/kennisbeeld.ts"

const uit = process.argv[2] || "kennisbeeld-proef.png"
const kaarten = Object.keys(BEELDEN)
    .map((s) => `<figure><div class="b">${beeldVoor(s)}</div><figcaption>${s}</figcaption></figure>`)
    .join("")
const html = `<style>body{margin:24px;font:12px sans-serif;display:grid;grid-template-columns:repeat(5,1fr);gap:16px;background:#fff}
figure{margin:0}.b{border-radius:16px;overflow:hidden;aspect-ratio:16/10;background:radial-gradient(circle at 50% 50%,rgba(48,105,254,.28),transparent 62%),#061126}
svg{display:block;width:100%;height:100%}</style>${kaarten}`
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1500, height: 900 } })
await p.setContent(html)
await p.screenshot({ path: uit, fullPage: true })
await b.close()
console.log(uit)
