// Word-bestand (.docx) zonder afhankelijkheden: een minimaal OOXML-pakket in een ongecomprimeerde zip.
// Draait in de browser (download op /voorbeeldbrieven/*) en in Node (tests). Getest in tests/unit/docx.test.ts
// en handmatig geopend met LibreOffice en python-docx.
import type { Brief } from "./briefmaker"

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

interface Run {
    t: string
    b?: boolean
}

/** Alinea; `na` = ruimte erna in twintigste punten; `tab` = rechts uitgelijnde tabstop (twips) voor bedragen. */
function para(runs: Run[] | string, opt: { na?: number; tab?: number; keep?: boolean } = {}): string {
    const rs = typeof runs === "string" ? [{ t: runs }] : runs
    const pPr = [
        opt.keep ? "<w:keepNext/>" : "",
        opt.tab ? `<w:tabs><w:tab w:val="right" w:pos="${opt.tab}"/></w:tabs>` : "",
        `<w:spacing w:after="${opt.na ?? 200}"/>`,
    ].join("")
    const body = rs
        .map((r) => {
            const rPr = r.b ? "<w:rPr><w:b/></w:rPr>" : ""
            return r.t
                .split("\t")
                .map(
                    (deel, i) =>
                        (i ? `<w:r>${rPr}<w:tab/></w:r>` : "") + `<w:r>${rPr}<w:t xml:space="preserve">${esc(deel)}</w:t></w:r>`,
                )
                .join("")
        })
        .join("")
    return `<w:p><w:pPr>${pPr}</w:pPr>${body}</w:p>`
}

/** Regels onder elkaar in één blok (adres, ondertekening): laatste regel krijgt de ruimte erna. */
const blok = (regels: string[], na = 240) => regels.map((r, i) => para(r, { na: i === regels.length - 1 ? na : 0 })).join("")

export function documentXml(b: Brief): string {
    const TAB = 9000 // rechterkant tekstvlak bij A4 met 2,5 cm marges (twips)
    const delen = [
        blok(b.afzender, 480),
        blok(b.geadresseerde, 480),
        para(b.plaatsDatum, { na: 240 }),
        para(
            [
                { t: "Betreft: ", b: true },
                { t: b.onderwerp, b: true },
            ],
            { na: 360 },
        ),
        para(b.aanhef),
        ...b.alineas.map((a) => para(a)),
    ]
    if (b.specificatie) {
        delen.push(para([{ t: b.specificatie.kop, b: true }], { na: 80, keep: true }))
        b.specificatie.regels.forEach(([l, w], i) => {
            const laatste = i === b.specificatie!.regels.length - 1
            const vet = b.specificatie!.kop === "Openstaand" && laatste
            delen.push(para([{ t: `${l}\t${w}`, b: vet }], { tab: TAB, na: laatste ? 240 : 40 }))
        })
    }
    delen.push(...(b.naSpecificatie ?? []).map((a) => para(a)))
    delen.push(para(b.slot, { na: 720 }), blok(b.ondertekening, 480))
    if (b.akkoord)
        delen.push(
            blok(
                b.akkoord.flatMap((r, i) => (i ? ["", r] : [r])),
                0,
            ),
        )

    return (
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
        `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>` +
        delen.join("") +
        `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr>` +
        `</w:body></w:document>`
    )
}

const STYLES =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
    `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="nl-NL"/></w:rPr></w:rPrDefault>` +
    `<w:pPrDefault><w:pPr><w:spacing w:after="200" w:line="288" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>` +
    `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>` +
    `</w:styles>`

const CONTENT_TYPES =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
    `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
    `</Types>`

const RELS =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
    `</Relationships>`

const DOC_RELS =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    `</Relationships>`

// CRC-32 (IEEE), nodig voor elke zip-entry
const CRC_TABEL = (() => {
    const t = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        t[n] = c >>> 0
    }
    return t
})()
export function crc32(data: Uint8Array): number {
    let c = 0xffffffff
    for (let i = 0; i < data.length; i++) c = CRC_TABEL[(c ^ data[i]) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
}

/** Ongecomprimeerde zip ("stored"). Genoeg voor Word, LibreOffice en Google Docs. */
export function zip(bestanden: { naam: string; data: Uint8Array }[]): Uint8Array {
    const enc = new TextEncoder()
    const lokaal: Uint8Array[] = []
    const centraal: Uint8Array[] = []
    let offset = 0
    const DOS_TIJD = 0
    const DOS_DATUM = ((2026 - 1980) << 9) | (1 << 5) | 1 // 1 januari 2026
    for (const f of bestanden) {
        const naam = enc.encode(f.naam)
        const crc = crc32(f.data)
        const h = new DataView(new ArrayBuffer(30))
        h.setUint32(0, 0x04034b50, true)
        h.setUint16(4, 20, true)
        h.setUint16(6, 0x0800, true) // UTF-8 namen
        h.setUint16(8, 0, true) // stored
        h.setUint16(10, DOS_TIJD, true)
        h.setUint16(12, DOS_DATUM, true)
        h.setUint32(14, crc, true)
        h.setUint32(18, f.data.length, true)
        h.setUint32(22, f.data.length, true)
        h.setUint16(26, naam.length, true)
        h.setUint16(28, 0, true)
        lokaal.push(new Uint8Array(h.buffer), naam, f.data)

        const c = new DataView(new ArrayBuffer(46))
        c.setUint32(0, 0x02014b50, true)
        c.setUint16(4, 20, true)
        c.setUint16(6, 20, true)
        c.setUint16(8, 0x0800, true)
        c.setUint16(10, 0, true)
        c.setUint16(12, DOS_TIJD, true)
        c.setUint16(14, DOS_DATUM, true)
        c.setUint32(16, crc, true)
        c.setUint32(20, f.data.length, true)
        c.setUint32(24, f.data.length, true)
        c.setUint16(28, naam.length, true)
        c.setUint32(42, offset, true)
        centraal.push(new Uint8Array(c.buffer), naam)
        offset += 30 + naam.length + f.data.length
    }
    const cdGrootte = centraal.reduce((s, b) => s + b.length, 0)
    const e = new DataView(new ArrayBuffer(22))
    e.setUint32(0, 0x06054b50, true)
    e.setUint16(8, bestanden.length, true)
    e.setUint16(10, bestanden.length, true)
    e.setUint32(12, cdGrootte, true)
    e.setUint32(16, offset, true)
    const delen = [...lokaal, ...centraal, new Uint8Array(e.buffer)]
    const uit = new Uint8Array(delen.reduce((s, b) => s + b.length, 0))
    let pos = 0
    for (const b of delen) {
        uit.set(b, pos)
        pos += b.length
    }
    return uit
}

export const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export function maakDocx(b: Brief): Uint8Array {
    const enc = new TextEncoder()
    return zip([
        { naam: "[Content_Types].xml", data: enc.encode(CONTENT_TYPES) },
        { naam: "_rels/.rels", data: enc.encode(RELS) },
        { naam: "word/document.xml", data: enc.encode(documentXml(b)) },
        { naam: "word/_rels/document.xml.rels", data: enc.encode(DOC_RELS) },
        { naam: "word/styles.xml", data: enc.encode(STYLES) },
    ])
}
