import { describe, expect, it } from "vitest"
import { crc32, documentXml, maakDocx } from "../../src/lib/docx"
import { maakBrief } from "../../src/lib/briefmaker"

/** Leest een ongecomprimeerde zip terug: naam → inhoud, en controleert de CRC per bestand. */
function leesZip(z: Uint8Array): Map<string, string> {
    const v = new DataView(z.buffer, z.byteOffset, z.byteLength)
    const dec = new TextDecoder()
    const uit = new Map<string, string>()
    let pos = 0
    while (v.getUint32(pos, true) === 0x04034b50) {
        expect(v.getUint16(pos + 8, true)).toBe(0) // stored
        const crc = v.getUint32(pos + 14, true)
        const grootte = v.getUint32(pos + 18, true)
        const naamLen = v.getUint16(pos + 26, true)
        const naam = dec.decode(z.subarray(pos + 30, pos + 30 + naamLen))
        const data = z.subarray(pos + 30 + naamLen, pos + 30 + naamLen + grootte)
        expect(crc32(data)).toBe(crc)
        uit.set(naam, dec.decode(data))
        pos += 30 + naamLen + grootte
    }
    // einde van de centrale map
    const eocd = z.length - 22
    expect(v.getUint32(eocd, true)).toBe(0x06054b50)
    expect(v.getUint16(eocd + 10, true)).toBe(uit.size)
    return uit
}

describe("docx", () => {
    it("crc32 klopt met de standaard testwaarde", () => {
        expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926)
    })

    it("pakt een geldig Word-pakket in", () => {
        const brief = maakBrief("betalingsherinnering", { factuur: "2026-118", klant: "Jansen & Zn <bv>" })
        const bestanden = leesZip(maakDocx(brief))
        expect([...bestanden.keys()]).toEqual([
            "[Content_Types].xml",
            "_rels/.rels",
            "word/document.xml",
            "word/_rels/document.xml.rels",
            "word/styles.xml",
        ])
        const doc = bestanden.get("word/document.xml")!
        expect(doc).toContain("Betalingsherinnering factuur 2026-118")
        expect(doc).toContain("Jansen &amp; Zn &lt;bv&gt;")
        expect(doc).not.toContain("<bv>")
    })

    it("zet de specificatie op een rechter tabstop", () => {
        const xml = documentXml(maakBrief("sommatie", { bedrag: "1000" }))
        expect(xml).toContain('<w:tab w:val="right" w:pos="9000"/>')
        expect(xml).toContain("Hoofdsom")
    })
})
