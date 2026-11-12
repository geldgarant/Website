// Bouwt de CaseControl-sms'en uit de gedeelde bron mails/src/<naam>.mjs (veld `sms`) -> sms/<naam>.txt.
// Gebruik: node sms/tools/bouw.mjs [naam ...]
// Controles: zelfde verboden als mails en brieven, alleen GSM-7-tekens (anders wordt het een dure Unicode-sms van 70
// tekens) en max. MAX tekens na invullen met de LANGSTE realistische waarden hieronder (€ telt dubbel in GSM-7).
// MAX = 140 (besluit gebruiker 12 nov 2026: alles boven één sms betalen we dubbel; 140 als veilige marge onder 160).
const MAX = 140
import { readdir, writeFile, mkdir } from "node:fs/promises"
import { fileURLToPath, pathToFileURL } from "node:url"
import path from "node:path"
import { controleer } from "../../mails/tools/controles.mjs"

const SMS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SRC = path.resolve(SMS, "..", "mails", "src")

// Langste waarden die in de praktijk voorkomen. Betaallink: korte FCPay-link per dossier (gezien in test T1, 10).
const LANGST = {
    "creditor.name": "Installatie- en Onderhoudsbedrijf Jansen", // 40 tekens; reken met lange namen
    "org_communication.telephone": "085 212 73 88",
    "case.case_number": "26-10000",
    "case.total_amount_due": "€ 128.413,16",
    "case.online_payment_link": "https://fcpay.nl/p/cqRGvT",
    "misc.today_plus_7_business_days": "30 september 2026",
    "misc.today_plus_5_business_days": "30 september 2026",
    "misc.today_plus_2_business_days": "30 september 2026",
}
const GSM7 =
    "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà"
const GSM7_EXT = "^{}\\[~]|€"
const lengte = (t) => [...t].reduce((n, c) => n + (GSM7_EXT.includes(c) ? 2 : 1), 0)

const namen = process.argv.slice(2)
const bestanden = (await readdir(SRC)).filter((f) => f.endsWith(".mjs") && (!namen.length || namen.includes(f.slice(0, -4))))
await mkdir(SMS, { recursive: true })
let fouten = 0

for (const f of bestanden.sort()) {
    const naam = f.slice(0, -4)
    const sms = (await import(pathToFileURL(path.join(SRC, f)).href)).default.sms
    if (!sms) continue
    const fout = (wat) => (console.error(`FOUT ${naam}: ${wat}`), fouten++)
    controleer(sms.tekst).forEach(fout)
    const ingevuld = sms.tekst.replace(/\{\{([\w.]+)\}\}/g, (m, k) =>
        k in LANGST ? LANGST[k] : (fout(`geen langste waarde voor ${k}`), m),
    )
    const vreemd = [...ingevuld].filter((c) => !GSM7.includes(c) && !GSM7_EXT.includes(c))
    if (vreemd.length) fout(`geen GSM-7: ${[...new Set(vreemd)].join(" ")}`)
    const n = lengte(ingevuld)
    if (n > MAX) fout(`${n} tekens na invullen (max. ${MAX})`)
    await writeFile(path.join(SMS, `${naam}.txt`), sms.tekst + "\n", "utf8")
    console.log(`sms/${naam}.txt  (${sms.naam}; ${n} tekens in het langste geval)\n  ${ingevuld}`)
}
if (fouten) process.exit(1)
