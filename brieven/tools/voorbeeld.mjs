// Voorbeeld-PDF en -PNG van een gebouwde brief, met dezelfde motor en marges als CaseControl (dompdf 3.1, A4, 20 mm).
// Gebruik: node brieven/tools/voorbeeld.mjs <naam> [uitmap]
//   leest brieven/<naam>.html en brieven/voorbeeld/<naam>.json, schrijft <uitmap>/<naam>-voorbeeld.pdf en -1.png, -2.png
// Nodig: php (winget PHP.PHP.NTS.8.4) met mbstring en gd, dompdf in DOMPDF_LIB (bash scripts/dev/dompdf-lib.sh <map>;
// standaard %LOCALAPPDATA%\dompdf-lib), pdftoppm (Poppler). De QR wordt lokaal gemaakt met dezelfde code als de route.
import { execFileSync, execSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

const [naam, uit = "brieven/voorbeeld"] = process.argv.slice(2)
if (!naam) throw new Error("Gebruik: node brieven/tools/voorbeeld.mjs <naam> [uitmap]")
const lib = process.env.DOMPDF_LIB || path.join(process.env.LOCALAPPDATA || "", "dompdf-lib")
const json = `brieven/voorbeeld/${naam}.json`
const data = JSON.parse(readFileSync(json, "utf8"))

const qr = path.join(tmpdir(), `qr-${naam}.png`)
const query = `d=${data["case.case_number"]}&data=${data["case.online_payment_link"]}`
execSync(`npx --yes tsx scripts/dev/qr-proef.mts "${query}" "${qr}"`, { stdio: "inherit" })

// CaseControl zet in een brief zelf een QR-code op de plek van {{case.online_payment_link}}; hier nabootsen.
let jsonPad = json
if (!readFileSync(`brieven/${naam}.html`, "utf8").includes("/api/qr?")) {
    const img = `<img src="data:image/png;base64,${readFileSync(qr).toString("base64")}" style="width:21mm; height:21mm;">`
    jsonPad = path.join(tmpdir(), `${naam}-voorbeeld.json`)
    writeFileSync(jsonPad, JSON.stringify({ ...data, "case.online_payment_link": img }))
}
const pdf = path.join(uit, `${naam}-voorbeeld.pdf`)
const ext = path.join(path.dirname(execFileSync("where", ["php"]).toString().split(/\r?\n/)[0]), "ext")
const php = ["-d", `extension_dir=${ext}`, "-d", "extension=mbstring", "-d", "extension=gd", "-d", "memory_limit=512M"]
execFileSync("php", [...php, "brieven/tools/render-cc.php", `brieven/${naam}.html`, jsonPad, pdf], {
    stdio: "inherit",
    env: { ...process.env, DOMPDF_LIB: lib, QR_PNG: qr },
})
for (const f of readdirSync(uit).filter((f) => f.startsWith(`${naam}-voorbeeld-`) && f.endsWith(".png")))
    unlinkSync(path.join(uit, f))
execFileSync("pdftoppm", ["-png", "-r", "110", pdf, path.join(uit, `${naam}-voorbeeld`)])
const pngs = readdirSync(uit).filter((f) => f.startsWith(`${naam}-voorbeeld-`) && f.endsWith(".png"))
console.log(`${pdf}: ${pngs.length} pagina('s)  ${pngs.join(", ")}`)
if (!existsSync(pdf)) process.exit(1)
