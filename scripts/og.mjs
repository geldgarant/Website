// OG-beelden per pagina (1200×630), na `astro build`. Leest uit elke dist/**/index.html de echte H1, inclusief het
// accentwoord (<span class="accent">), en tekent die in de huisstijl: navy vlak, Poppins, accent in Newsreader cursief.
// Satori zet tekst om in paden (geen systeemfonts nodig), sharp maakt er een PNG van. Uitvoer: dist/og/<pad>.png;
// Base.astro verwijst daar per pagina naar. Nieuwe pagina's krijgen dus vanzelf een eigen beeld.
//
// Gebruik: `node scripts/og.mjs` (draait automatisch na `npm run build`).
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { dirname, join, relative } from "node:path"
import satori from "satori"
import sharp from "sharp"

const DIST = "dist"
const font = (pad) => readFile(join("node_modules", pad))

const [poppins600, poppins500, newsreader, inter500, logo, merk, siteTs] = await Promise.all([
    font("@fontsource/poppins/files/poppins-latin-600-normal.woff"),
    font("@fontsource/poppins/files/poppins-latin-500-normal.woff"),
    font("@fontsource/newsreader/files/newsreader-latin-500-italic.woff"),
    font("@fontsource/inter/files/inter-latin-500-normal.woff"),
    readFile("public/brand/full-logo-dark.svg"),
    readFile("public/brand/short-logo-dark.svg"),
    readFile("src/data/site.ts", "utf8"),
])
const register = siteTs.match(/incassoRegister:\s*"([^"]+)"/)?.[1] ?? ""
const dataUri = (buf) => `data:image/svg+xml;base64,${buf.toString("base64")}`

const fonts = [
    { name: "Poppins", data: poppins600, weight: 600, style: "normal" },
    { name: "Poppins", data: poppins500, weight: 500, style: "normal" },
    { name: "Newsreader", data: newsreader, weight: 500, style: "italic" },
    { name: "Inter", data: inter500, weight: 500, style: "normal" },
]

const RUBRIEK = {
    incasso: "Incasso",
    kennisbank: "Kennisbank",
    branches: "Branches",
    "werken-bij": "Werken bij",
    juridisch: "Juridisch",
    klachtenregelement: "Klachtenregeling",
    tarieven: "Tarieven",
    debiteurenbeheer: "Debiteurenbeheer",
    "hulp-nodig-bij-geldproblemen": "Hulp bij geldzorgen",
    "vordering-indienen": "Vordering indienen",
    "contact-opnemen": "Contact",
    "over-ons": "Over ons",
    "hoe-werkt-het": "Hoe werkt het",
    wki: "Wki en registratie",
    nowid: "NowID",
}

const ontsnap = (s) =>
    s
        .replace(/<[^>]+>/g, "")
        .replace(/&shy;|\u00ad/g, "")
        .replace(/&nbsp;|\u00a0/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&#x27;/g, "’")
        .replace(/&quot;/g, "”")
        .replace(/\s+/g, " ")
        .trim()

/** H1 opsplitsen in woorden; elk woord bestaat uit stukken met of zonder accent (Privacy|verklaring blijft één woord). */
function woordenUitH1(html) {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]
    if (!h1) return null
    // accent markeren met stuurtekens, dan alle tags weg en spaties normaliseren
    const gemarkeerd = h1
        .replace(/<span[^>]*class="[^"]*\baccent\b[^"]*"[^>]*>([\s\S]*?)<\/span>/g, "\u0001$1\u0002")
        .replace(/<br\s*\/?>/g, " ")
    const tekst = ontsnap(gemarkeerd)
    const woorden = []
    let inAccent = false
    for (const ruwWoord of tekst.split(" ")) {
        const stukken = []
        let huidig = ""
        for (const teken of ruwWoord) {
            if (teken === "\u0001" || teken === "\u0002") {
                if (huidig) stukken.push({ w: huidig, accent: inAccent })
                huidig = ""
                inAccent = teken === "\u0001"
            } else huidig += teken
        }
        if (huidig) stukken.push({ w: huidig, accent: inAccent })
        if (stukken.length) woorden.push(stukken)
    }
    return woorden
}

function tekenGrootte(woorden) {
    const lengte = woorden.reduce((n, w) => n + w.reduce((m, s) => m + s.w.length, 0) + 1, 0)
    if (lengte <= 24) return 92
    if (lengte <= 36) return 80
    if (lengte <= 52) return 68
    if (lengte <= 70) return 58
    return 50
}

const h = (type, props, ...children) => ({ type, props: { ...props, children: children.flat() } })

function kaart(woorden, rubriek) {
    const grootte = tekenGrootte(woorden)
    return h(
        "div",
        {
            style: {
                width: 1200,
                height: 630,
                display: "flex",
                position: "relative",
                background: "#061126",
                fontFamily: "Inter",
            },
        },
        // decoratie: gloed rechtsboven en groot merkteken als watermerk, buiten de layout
        h(
            "div",
            { style: { position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", overflow: "hidden" } },
            h("div", {
                style: {
                    position: "absolute",
                    left: 780,
                    top: -260,
                    width: 640,
                    height: 640,
                    borderRadius: 640,
                    background: "radial-gradient(circle, rgba(48,105,254,0.35) 0%, rgba(48,105,254,0) 70%)",
                },
            }),
            h("img", {
                src: dataUri(merk),
                width: 420,
                height: 482,
                style: { position: "absolute", left: 840, top: 238, opacity: 0.06 },
            }),
        ),
        h(
            "div",
            {
                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 1200,
                    height: 630,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    padding: "64px 72px",
                },
            },
            h(
                "div",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                h("img", { src: dataUri(logo), width: 262, height: 42 }),
                h(
                    "div",
                    {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 20px",
                            borderRadius: 999,
                            border: "1.5px solid rgba(255,255,255,0.18)",
                            color: "rgba(255,255,255,0.78)",
                            fontSize: 20,
                        },
                    },
                    `Geregistreerd bij Justis · ${register}`,
                ),
            ),
            h(
                "div",
                { style: { display: "flex", flexDirection: "column", maxWidth: 980 } },
                h(
                    "div",
                    {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 26,
                            color: "#8FA9FF",
                            fontSize: 22,
                            letterSpacing: 2.5,
                            textTransform: "uppercase",
                        },
                    },
                    h("div", { style: { width: 34, height: 3, borderRadius: 2, background: "#3069FE", marginRight: 16 } }),
                    rubriek,
                ),
                h(
                    "div",
                    {
                        style: {
                            display: "flex",
                            flexWrap: "wrap",
                            fontFamily: "Poppins",
                            fontWeight: 600,
                            fontSize: grootte,
                            lineHeight: 1.08,
                            letterSpacing: -grootte * 0.03,
                            color: "#FFFFFF",
                        },
                    },
                    woorden.map((woord) =>
                        h(
                            "div",
                            { style: { display: "flex", marginRight: grootte * 0.26 } },
                            woord.map((s) =>
                                h(
                                    "span",
                                    s.accent
                                        ? {
                                              style: {
                                                  fontFamily: "Newsreader",
                                                  fontStyle: "italic",
                                                  fontWeight: 500,
                                                  color: "#7FA0FF",
                                                  letterSpacing: 0,
                                                  fontSize: grootte * 1.06,
                                              },
                                          }
                                        : {},
                                    s.w,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            h(
                "div",
                {
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 22,
                    },
                },
                h("div", { style: { display: "flex" } }, "geldgarant.com"),
                h(
                    "div",
                    {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            padding: "12px 24px",
                            borderRadius: 999,
                            background: "#3069FE",
                            color: "#FFFFFF",
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            fontSize: 21,
                        },
                    },
                    "Incassobureau voor ondernemers",
                ),
            ),
        ),
    )
}

async function* htmlBestanden(map) {
    for (const e of await readdir(map, { withFileTypes: true })) {
        const pad = join(map, e.name)
        if (e.isDirectory()) {
            if (e.name === "_astro" || e.name === "og") continue
            yield* htmlBestanden(pad)
        } else if (e.name.endsWith(".html")) yield pad
    }
}

/** Pad zoals Base.astro het verwacht: "/" → index, "/incasso/wik-brief" → incasso/wik-brief, 404.html → 404. */
export const ogPad = (bestand) => {
    const r = relative(DIST, bestand).replace(/\\/g, "/")
    if (r === "index.html") return "index"
    return r.replace(/\/index\.html$/, "").replace(/\.html$/, "")
}

const start = Date.now()
let n = 0
for await (const bestand of htmlBestanden(DIST)) {
    const html = await readFile(bestand, "utf8")
    const woorden = woordenUitH1(html)
    if (!woorden?.length) continue
    const pad = ogPad(bestand)
    const rubriek = pad === "index" ? "Incassobureau" : (RUBRIEK[pad.split("/")[0]] ?? "GeldGarant")
    const svg = await satori(kaart(woorden, rubriek), { width: 1200, height: 630, fonts })
    const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
    const doel = join(DIST, "og", `${pad}.png`)
    await mkdir(dirname(doel), { recursive: true })
    await writeFile(doel, png)
    n++
}
console.log(`og: ${n} beelden in ${((Date.now() - start) / 1000).toFixed(1)}s`)
