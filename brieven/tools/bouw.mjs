// Bouwt de plakklare CaseControl-brieven (Node; vervangt tools/bouw.py, Python staat niet op de pc).
//
// brieven/src/<naam>.html -> brieven/<naam>.html
//    - %%naam%% in een style-attribuut wordt de stijl uit STIJL hieronder (de editor bewaart alleen inline stijlen).
//    - [[LOGO_DATA]] en [[QR_DATA]] worden data-URI's van brieven/assets/*.png.
//    - [[QR_BETAAL]] wordt de dynamische QR: een afbeelding van onze route /api/qr met {{case.online_payment_link}}
//      erin (worker/qr.ts). QR=statisch zet de vaste QR naar geldgarant.com/betalen erin.
//
// Gebruik: node brieven/tools/bouw.mjs [naam ...]
import { readdir, readFile, writeFile } from "node:fs/promises"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { controleer } from "../../mails/tools/controles.mjs"

const BRIEVEN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const F = "font-family:Helvetica,Arial,sans-serif;"
const BLAUW = "#3069fe"
const INK = "#061126"
const STIJL = {
    tabel: "border-collapse:collapse; width:100%;",
    p: F + " font-size:9.5pt; line-height:14pt; color:#2b3245; margin:0 0 3.2mm 0;",
    klein: F + " font-size:7pt; line-height:10pt; color:#6b7390; margin:0 0 1.6mm 0;",
    h2: F + ` font-size:11pt; line-height:15pt; font-weight:bold; color:${INK}; margin:5mm 0 1.6mm 0;`,
    h3: F + ` font-size:9.5pt; line-height:13pt; font-weight:bold; color:${INK}; margin:0 0 1.2mm 0;`,
    kaart: F + " font-size:8.5pt; line-height:12pt; color:#2b3245;",
    "ref-l":
        F +
        " font-size:8pt; line-height:11pt; color:#6b7390; padding:1.3mm 3mm 1.3mm 0; border-bottom:0.5pt solid #dfe3ec; white-space:nowrap; vertical-align:top;",
    "ref-w":
        F +
        ` font-size:8.5pt; line-height:11pt; color:${INK}; padding:1.3mm 0; border-bottom:0.5pt solid #dfe3ec; text-align:right; vertical-align:top;`,
    blok: `background-color:${INK}; padding:3.2mm 4.5mm; vertical-align:top;`,
    "blok-l": F + " font-size:7pt; line-height:10pt; letter-spacing:0.6pt; text-transform:uppercase; color:#b9c3dc;",
    "blok-w": F + " font-size:11pt; line-height:15pt; font-weight:bold; color:#ffffff; margin-top:0.6mm;",
    "spec-l":
        F +
        " font-size:8.5pt; line-height:12pt; color:#2b3245; padding:1.8mm 6mm 1.8mm 0; border-bottom:0.5pt solid #dfe3ec; vertical-align:top;",
    "spec-w":
        F +
        " font-size:9pt; line-height:12pt; font-weight:bold; color:#2b3245; padding:1.8mm 0; border-bottom:0.5pt solid #dfe3ec; text-align:right; white-space:nowrap; vertical-align:top; width:30mm;",
    "bank-l":
        F +
        " font-size:8pt; line-height:11.5pt; color:#6b7390; padding:0.6mm 3mm 0.6mm 0; white-space:nowrap; vertical-align:top;",
    "bank-w": F + ` font-size:8.5pt; line-height:11.5pt; color:${INK}; padding:0.6mm 0; vertical-align:top;`,
    contact: "vertical-align:top; padding:3mm 3mm 3mm 0;",
    "contact-l":
        F + ` font-size:7pt; line-height:10pt; letter-spacing:0.6pt; text-transform:uppercase; color:${BLAUW}; font-weight:bold;`,
    "contact-w": F + ` font-size:8.5pt; line-height:11.5pt; color:${INK}; font-weight:bold; margin-top:0.6mm;`,
    "contact-x": F + " font-size:7.5pt; line-height:10pt; color:#6b7390;",
    stap: "vertical-align:top; padding:1.6mm 2mm 0 0;",
    "stap-l": F + " font-size:6.5pt; line-height:9pt; letter-spacing:0.6pt; text-transform:uppercase; font-weight:bold;",
    "stap-w": F + ` font-size:9pt; line-height:12pt; font-weight:bold; color:${INK};`,
    "stap-x": F + " font-size:7.5pt; line-height:10pt; color:#6b7390;",
    // Kaart met lichte achtergrond (B2C: "Betaalt u binnen 14 dagen?", geldzorgen).
    gevolg: "width:50%; vertical-align:top; padding:3mm 4mm 3mm 4mm; background-color:#f3f4f7;",
    // Genummerde gevolgen (strikt en feitelijk): nummer in blauw, tekst, haarlijn eronder.
    nr:
        F +
        ` width:9mm; font-size:8pt; line-height:13pt; font-weight:bold; letter-spacing:0.6pt; color:#1f4fd6; padding:1.8mm 0 1.6mm 0; border-bottom:0.5pt solid #dfe3ec; vertical-align:top;`,
    "nr-t":
        F +
        " font-size:9.5pt; line-height:13pt; color:#2b3245; padding:1.8mm 0 1.6mm 0; border-bottom:0.5pt solid #dfe3ec; vertical-align:top;",
}

const QR_HOST = process.env.QR_HOST || "https://geldgarant.com"
const dataUri = (f) => "data:image/png;base64," + readFileSync(path.join(BRIEVEN, "assets", f)).toString("base64")

const namen = process.argv.slice(2)
// Zonder namen: alleen de nieuwe brieven (deb-*). De oude v1-bestanden blijven zoals ze in de repo staan.
const kies = (f, ext) => (namen.length ? namen.includes(f.slice(0, -ext.length)) : f.startsWith("deb-"))
let fouten = 0
const meld = (naam, html) => {
    if (!naam.startsWith("deb-")) return // oude v1-bestanden (aanmaning-1-b2b enz.) vallen buiten de nieuwe regels
    for (const wat of controleer(html)) {
        console.error(`FOUT ${naam}: ${wat}`)
        fouten++
    }
}

for (const f of (await readdir(path.join(BRIEVEN, "src"))).filter((f) => f.endsWith(".html") && kies(f, ".html")).sort()) {
    const naam = f.slice(0, -5)
    let s = await readFile(path.join(BRIEVEN, "src", f), "utf8")
    s = s.replace(/%%([a-z0-9-]+)%%/g, (m, k) => {
        if (!(k in STIJL)) throw new Error(`Onbekende stijl %%${k}%% in ${f}`)
        return STIJL[k]
    })
    s = s
        .replaceAll("[[LOGO_DATA]]", dataUri("logo-brief.png"))
        .replaceAll("[[QR_DATA]]", dataUri("qr-betalen.png"))
        .replaceAll(
            "[[QR_BETAAL]]",
            process.env.QR === "statisch"
                ? dataUri("qr-betalen.png")
                : QR_HOST + "/api/qr?d={{case.case_number}}&amp;data={{case.online_payment_link}}",
        )
        .replace(/;\s{2,}/g, "; ")
    if (/[—–]/.test(s)) throw new Error(`Gedachtestreepje in ${f}`)
    meld(naam, s)
    await writeFile(path.join(BRIEVEN, `${naam}.html`), s, "utf8")
    console.log(`brieven/${naam}.html  (${Math.round(s.length / 1024)} kB)`)
}

if (fouten) process.exit(1)
