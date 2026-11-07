// GET /api/qr?d=<dossiernummer>&data=<betaallink>  →  PNG met een QR-code (voor de brieven in CaseControl)
//
// De brieven zetten hier de CaseControl-variabelen in: d={{case.case_number}}&data={{case.online_payment_link}}.
// - `data` staat altijd als laatste parameter en wordt letterlijk tot het einde van de URL gelezen, omdat CaseControl
//   de betaallink niet URL-codeert (een `&` of `?` in de link mag hem dus niet afbreken).
// - Geeft CaseControl een <a>-element of HTML-gecodeerde tekst, dan halen we de eerste https-link eruit.
// - Ontbreekt de betaallink of is hij ongeldig, dan wijst de QR naar onze eigen betaalpagina met het dossiernummer
//   ingevuld (/brief-ontvangen?dossier=…#betalen). Een brief krijgt zo nooit een lege of kapotte QR-code.
// Er wordt niets opgeslagen of gelogd.
import { encode } from "uqr"
import { normDossier, isDossier } from "../src/lib/debiteur"

export interface QrEnv {
    /** Basisadres van de site voor de terugval-QR (standaard https://geldgarant.com). */
    SITE_URL?: string
}

const MAX_LINK = 1000
const SCHAAL = 8 // pixels per module; de brief toont de code op 21 mm
const RAND = 2 // witte rand in modules (de brief heeft er zelf ook ruimte omheen)

/** Haalt de betaallink uit de ruwe querystring (alles na `data=`). */
export function leesLink(rauw: string): string | null {
    let s = rauw
    for (let i = 0; i < 2; i++) {
        // CaseControl of de editor kan de link (gedeeltelijk) coderen; probeer te decoderen zolang dat iets oplevert
        try {
            const d = decodeURIComponent(s.replace(/\+/g, "%20"))
            if (d === s) break
            s = d
        } catch {
            break
        }
    }
    s = s
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
    const m = /https:\/\/[^\s"'<>]+/i.exec(s)
    if (!m) return null
    const link = m[0].replace(/[).,;]+$/, "")
    if (link.length > MAX_LINK) return null
    try {
        const u = new URL(link)
        return u.protocol === "https:" && u.hostname.includes(".") ? u.toString() : null
    } catch {
        return null
    }
}

/** Bepaalt wat er in de QR-code komt: de betaallink, of anders onze eigen betaalpagina. */
export function qrInhoud(requestUrl: string, env: QrEnv = {}): { tekst: string; bron: "betaallink" | "terugval" } {
    const url = new URL(requestUrl)
    const i = url.search.indexOf("data=")
    const link = i >= 0 ? leesLink(url.search.slice(i + 5)) : null
    if (link) return { tekst: link, bron: "betaallink" }
    const basis = (env.SITE_URL || "https://geldgarant.com").replace(/\/+$/, "")
    const d = normDossier(url.searchParams.get("d") || "")
    const terug = isDossier(d) ? `${basis}/brief-ontvangen?dossier=${encodeURIComponent(d)}#betalen` : `${basis}/betalen`
    return { tekst: terug, bron: "terugval" }
}

// ── PNG (1 bit grijs) zonder afhankelijkheden ────────────────────────────────────────────────────────────────────────

const CRC_TABEL = (() => {
    const t = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        t[n] = c >>> 0
    }
    return t
})()

function crc32(bytes: Uint8Array): number {
    let c = 0xffffffff
    for (const b of bytes) c = CRC_TABEL[(c ^ b) & 0xff]! ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
}

function blok(type: string, data: Uint8Array): Uint8Array {
    const uit = new Uint8Array(12 + data.length)
    const v = new DataView(uit.buffer)
    v.setUint32(0, data.length)
    for (let i = 0; i < 4; i++) uit[4 + i] = type.charCodeAt(i)
    uit.set(data, 8)
    v.setUint32(8 + data.length, crc32(uit.subarray(4, 8 + data.length)))
    return uit
}

async function zlib(data: Uint8Array): Promise<Uint8Array> {
    const stream = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream("deflate"))
    return new Uint8Array(await new Response(stream).arrayBuffer())
}

/** Maakt een zwart-wit PNG van een QR-matrix (true = donker). */
export async function maakPng(matrix: boolean[][], schaal = SCHAAL): Promise<Uint8Array> {
    const n = matrix.length
    const px = n * schaal
    const rijBytes = Math.ceil(px / 8)
    const ruw = new Uint8Array((rijBytes + 1) * px)
    for (let y = 0; y < px; y++) {
        const rij = matrix[Math.floor(y / schaal)]!
        const o = y * (rijBytes + 1) // eerste byte = filter 0
        for (let x = 0; x < px; x++) {
            if (!rij[Math.floor(x / schaal)]) ruw[o + 1 + (x >> 3)]! |= 0x80 >> (x & 7) // 1 = wit
        }
    }
    const ihdr = new Uint8Array(13)
    const v = new DataView(ihdr.buffer)
    v.setUint32(0, px)
    v.setUint32(4, px)
    ihdr.set([1, 0, 0, 0, 0], 8) // bitdiepte 1, grijs, standaard compressie/filter, geen interlace
    const delen = [
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        blok("IHDR", ihdr),
        blok("IDAT", await zlib(ruw)),
        blok("IEND", new Uint8Array(0)),
    ]
    const uit = new Uint8Array(delen.reduce((s, d) => s + d.length, 0))
    let p = 0
    for (const d of delen) {
        uit.set(d, p)
        p += d.length
    }
    return uit
}

export async function handleQr(request: Request, env: QrEnv = {}): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Alleen GET.", { status: 405, headers: { Allow: "GET, HEAD" } })
    }
    const { tekst, bron } = qrInhoud(request.url, env)
    const { data } = encode(tekst, { ecc: "M", border: RAND })
    const png = await maakPng(data)
    return new Response(request.method === "HEAD" ? null : (png as BodyInit), {
        headers: {
            "Content-Type": "image/png",
            "Content-Length": String(png.length),
            // de inhoud hangt alleen af van de URL; CaseControl haalt het beeld één keer per brief op
            "Cache-Control": "public, max-age=86400",
            "X-Content-Type-Options": "nosniff",
            "X-QR-Bron": bron,
        },
    })
}
