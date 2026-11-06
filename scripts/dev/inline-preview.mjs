// Maakt van dist/index.html één zelfstandige HTML (CSS, fonts, afbeeldingen en scripts inline)
// zodat de homepage als privé-preview te bekijken is. Gebruik: node scripts/dev/inline-preview.mjs <uit.html>
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join, extname } from "node:path"

const dist = new URL("../../dist/", import.meta.url).pathname
const out = process.argv[2] ?? "/tmp/preview.html"
const mime = { ".woff2": "font/woff2", ".woff": "font/woff", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" }
const dataUri = (p) => {
    const f = join(dist, p.replace(/^\//, ""))
    if (!existsSync(f)) return p
    return `data:${mime[extname(f)] ?? "application/octet-stream"};base64,${readFileSync(f).toString("base64")}`
}

let html = readFileSync(join(dist, "index.html"), "utf8")

// stylesheets inline, met fonts als data-URI
html = html.replace(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)"\s*\/?>/g, (_, href) => {
    const css = readFileSync(join(dist, href), "utf8").replace(/url\((\/_astro\/[^)]+)\)/g, (_, u) => `url(${dataUri(u)})`)
    return `<style>${css}</style>`
})
// fonts in reeds inline <style>-blokken
html = html.replace(/url\((\/_astro\/[^)]+)\)/g, (_, u) => `url(${dataUri(u)})`)
// module-scripts inline
html = html.replace(/<script type="module" src="(\/_astro\/[^"]+\.js)"><\/script>/g, (_, src) => {
    return `<script type="module">${readFileSync(join(dist, src), "utf8")}</script>`
})
// afbeeldingen en iconen
html = html.replace(/(src|href)="(\/(?:brand\/[^"]+|favicon\.[a-z]+|apple-touch-icon\.png))"/g, (_, attr, p) => `${attr}="${dataUri(p)}"`)
// interne links werken niet in de preview: markeren zodat ze niet wegnavigeren
html = html.replace("</head>", `<base target="_blank"></head>`)

writeFileSync(out, html)
console.log(`${out}: ${(html.length / 1024).toFixed(0)} KB`)
