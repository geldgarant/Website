import { describe, it, expect } from "vitest"
import { inflateSync } from "node:zlib"
import { encode } from "uqr"
import { handleQr, leesLink, qrInhoud, maakPng } from "../../worker/qr"

const BASIS = "https://website.geldgarant.workers.dev/api/qr"

describe("worker /api/qr: inhoud van de QR-code", () => {
    it("neemt de betaallink letterlijk over, ook met ? en & erin (CaseControl codeert niet)", () => {
        const link = "https://geldgarant.debtorportal.com/pay?case=26-1008&token=abc123"
        expect(qrInhoud(`${BASIS}?d=26-1008&data=${link}`)).toEqual({ tekst: link, bron: "betaallink" })
    })

    it("decodeert een (dubbel) URL-gecodeerde link en HTML-entiteiten", () => {
        const link = "https://pay.example.nl/p/xyz?a=1&b=2"
        expect(leesLink(encodeURIComponent(link))).toBe(link)
        expect(leesLink(encodeURIComponent(encodeURIComponent(link)))).toBe(link)
        expect(leesLink("https://pay.example.nl/p/xyz?a=1&amp;b=2")).toBe(link)
    })

    it("haalt de link uit een <a>-element als CaseControl HTML invult", () => {
        const html = '<a href="https://pay.example.nl/p/xyz" target="_blank">Betaal nu</a>'
        expect(leesLink(encodeURIComponent(html))).toBe("https://pay.example.nl/p/xyz")
    })

    it("weigert http, te lange of lege links en valt terug op de eigen betaalpagina met dossiernummer", () => {
        expect(leesLink("http://pay.example.nl/x")).toBeNull()
        expect(leesLink(`https://pay.example.nl/${"a".repeat(1200)}`)).toBeNull()
        expect(qrInhoud(`${BASIS}?d=26-1008&data=`)).toEqual({
            tekst: "https://geldgarant.com/brief-ontvangen?dossier=26-1008#betalen",
            bron: "terugval",
        })
        expect(qrInhoud(`${BASIS}?d=x&data={{case.online_payment_link}}`).tekst).toBe("https://geldgarant.com/betalen")
        expect(qrInhoud(`${BASIS}?d=26-1008`, { SITE_URL: "https://website.geldgarant.workers.dev/" }).tekst).toBe(
            "https://website.geldgarant.workers.dev/brief-ontvangen?dossier=26-1008#betalen",
        )
    })
})

describe("worker /api/qr: PNG", () => {
    it("maakt een geldige zwart-wit PNG waarvan de pixels de QR-matrix volgen", async () => {
        const { data, size } = encode("https://geldgarant.com/betalen", { ecc: "M", border: 2 })
        const png = await maakPng(data, 4)
        expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
        const v = new DataView(png.buffer, png.byteOffset)
        expect(v.getUint32(16)).toBe(size * 4) // breedte
        expect(v.getUint32(20)).toBe(size * 4) // hoogte
        // IDAT terugrekenen en een paar pixels vergelijken met de matrix
        let p = 8
        let idat: Uint8Array = new Uint8Array(0)
        while (p < png.length) {
            const len = v.getUint32(p)
            const type = String.fromCharCode(...png.subarray(p + 4, p + 8))
            if (type === "IDAT") idat = png.subarray(p + 8, p + 8 + len)
            p += 12 + len
        }
        const ruw = inflateSync(idat)
        const rij = Math.ceil((size * 4) / 8) + 1
        const pixelDonker = (x: number, y: number) => !(ruw[y * rij + 1 + (x >> 3)]! & (0x80 >> (x & 7)))
        for (const [mx, my] of [
            [0, 0],
            [2, 2],
            [3, 3],
            [size - 3, 2],
            [Math.floor(size / 2), Math.floor(size / 2)],
        ] as const) {
            expect(pixelDonker(mx * 4 + 1, my * 4 + 1)).toBe(data[my]![mx]!)
        }
    })

    it("geeft image/png met cachekop en meldt de bron in een header", async () => {
        const r = await handleQr(new Request(`${BASIS}?d=26-1008&data=https://pay.example.nl/p/1`))
        expect(r.status).toBe(200)
        expect(r.headers.get("Content-Type")).toBe("image/png")
        expect(r.headers.get("X-QR-Bron")).toBe("betaallink")
        expect(r.headers.get("Cache-Control")).toContain("max-age")
        expect((await r.arrayBuffer()).byteLength).toBeGreaterThan(100)
        expect((await handleQr(new Request(BASIS, { method: "POST" }))).status).toBe(405)
    })
})
