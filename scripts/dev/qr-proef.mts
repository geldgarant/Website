// Maakt een QR-PNG met precies dezelfde code als de worker-route /api/qr (voor voorbeeldbrieven en controle).
// Gebruik: npx tsx scripts/dev/qr-proef.mts "<querystring na ?>" <uit.png>
//   bv. npx tsx scripts/dev/qr-proef.mts "d=26-1008&data=https://geldgarant.debtorportal.com/..." /tmp/qr.png
import { writeFileSync } from "node:fs"
import { handleQr } from "../../worker/qr.ts"

const [query = "d=26-1008&data=", uit = "/tmp/qr.png"] = process.argv.slice(2)
const r = await handleQr(new Request(`https://geldgarant.com/api/qr?${query}`))
writeFileSync(uit, new Uint8Array(await r.arrayBuffer()))
console.log(`${uit} (${r.headers.get("X-QR-Bron")})`)
