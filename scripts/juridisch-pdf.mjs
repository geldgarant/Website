// Maakt de pdf's van de juridische documenten uit de HTML-pagina's (printopmaak in src/pages/juridisch/[slug].astro),
// plus een preview van pagina 1 (webp) en src/data/juridisch-pdf.ts (aantal pagina's, grootte).
// Zo zijn website en pdf altijd gelijk. Draai dit na elke tekstwijziging in src/content/juridisch/ en commit het resultaat.
//
// Gebruik: npm run build && npx astro preview --port 4399 --ignore-lock &
//          CHROME_PATH=/usr/bin/google-chrome node scripts/juridisch-pdf.mjs
// Vereist pdfinfo en pdftoppm (poppler-utils).
import { execFileSync } from "node:child_process"
import { stat, writeFile } from "node:fs/promises"
import { chromium } from "playwright"
import sharp from "sharp"

const BASIS = process.env.BASIS ?? "http://localhost:4399"
const DOCS = [
    { slug: "algemene-voorwaarden", naam: "Algemene voorwaarden", bestand: "algemene-voorwaarden.pdf" },
    { slug: "privacy-beleid", naam: "Privacyverklaring", bestand: "privacyverklaring.pdf" },
    { slug: "cookie-beleid", naam: "Cookieverklaring", bestand: "cookieverklaring.pdf" },
]

const voet = (naam) => `
<div style="width:100%;padding:0 16mm;font-family:Inter,Arial,sans-serif;font-size:7.5pt;color:#586280;display:flex;justify-content:space-between">
  <span>GeldGarant · ${naam}</span>
  <span>Pagina <span class="pageNumber"></span> van <span class="totalPages"></span></span>
</div>`

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const info = {}
for (const d of DOCS) {
    const page = await browser.newPage()
    await page.goto(`${BASIS}/juridisch/${d.slug}`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    const pad = `public/juridisch/${d.bestand}`
    await page.pdf({
        path: pad,
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<span></span>",
        footerTemplate: voet(d.naam),
        margin: { top: "16mm", bottom: "18mm", left: "16mm", right: "16mm" },
    })
    await page.close()
    const paginas = Number(/Pages:\s+(\d+)/.exec(execFileSync("pdfinfo", [pad], { encoding: "utf8" }))?.[1] ?? 0)
    const kb = Math.round((await stat(pad)).size / 1024)
    execFileSync("pdftoppm", [
        "-f",
        "1",
        "-l",
        "1",
        "-png",
        "-scale-to-x",
        "1200",
        "-scale-to-y",
        "-1",
        "-singlefile",
        pad,
        `/tmp/preview-${d.slug}`,
    ])
    const preview = d.bestand.replace(/\.pdf$/, ".webp")
    await sharp(`/tmp/preview-${d.slug}.png`).resize(600).webp({ quality: 74, effort: 6 }).toFile(`public/juridisch/${preview}`)
    info[d.slug] = { bestand: d.bestand, preview, paginas, kb }
    console.log(`${d.bestand}: ${paginas} pagina's, ${kb} kB`)
}
await browser.close()
await writeFile(
    "src/data/juridisch-pdf.ts",
    `// Gemaakt door scripts/juridisch-pdf.mjs: niet met de hand aanpassen.\nexport const PDF = ${JSON.stringify(info, null, 4)} as const\n`,
)
