import { describe, expect, it } from "vitest"
import {
    BRIEF_SLUGS,
    briefAlsTekst,
    leesBedrag,
    maakBrief,
    plaatshouders,
    plusMaanden,
    regeling,
    termijnDagen,
    type Invoer,
} from "../../src/lib/briefmaker"

// Intl zet een harde spatie na het euroteken; voor leesbare verwachtingen maken we er een gewone spatie van.
const nb = (s: string) => s.replace(/\u00a0/g, " ")
const tekst = (...a: Parameters<typeof maakBrief>) => nb(briefAlsTekst(maakBrief(...a)))
const spec = (b: ReturnType<typeof maakBrief>) => b.specificatie!.regels.map(([l, w]) => [l, nb(w)])

const vol: Partial<Invoer> = {
    afzender: "Bakkerij De Linde",
    afzenderAdres: "Brink 1, 7411 BR Deventer",
    plaats: "Deventer",
    ondertekenaar: "P. de Linde",
    klant: "Jansen Bouw",
    klantAdres: "Markt 2, 8011 AA Zwolle",
    aanhef: "heer Jansen",
    factuur: "2026-118",
    factuurdatum: "2026-10-02",
    vervaldatum: "2026-11-01",
    bedrag: "1.250,00",
    iban: "nl00bank0123456789",
    datum: "2026-11-09",
    termijnen: "3",
    eerste: "2026-01-31",
}

describe("leesBedrag", () => {
    it("leest Nederlandse en Engelse notatie", () => {
        expect(leesBedrag("1.250,50")).toBe(1250.5)
        expect(leesBedrag("€ 1250,5")).toBe(1250.5)
        expect(leesBedrag("1250.50")).toBe(1250.5)
        expect(leesBedrag("12.500")).toBe(12500)
    })
    it("weigert onzin, nul en negatief", () => {
        expect(leesBedrag("")).toBeNaN()
        expect(leesBedrag("abc")).toBeNaN()
        expect(leesBedrag("0")).toBeNaN()
        expect(leesBedrag("-5")).toBeNaN()
        expect(leesBedrag("1,234")).toBeNaN()
    })
})

describe("termijnen en data", () => {
    it("gebruikt de standaardtermijn bij lege of onzinnige invoer", () => {
        expect(termijnDagen("betalingsherinnering", "")).toBe(7)
        expect(termijnDagen("ingebrekestelling", "0")).toBe(14)
        expect(termijnDagen("sommatie", "10")).toBe(10)
        expect(termijnDagen("sommatie", "365")).toBe(7)
    })
    it("plusMaanden valt terug op de laatste dag van de maand", () => {
        expect(plusMaanden("2026-01-31", 1)).toBe("2026-02-28")
        expect(plusMaanden("2026-01-31", 2)).toBe("2026-03-31")
        expect(plusMaanden("2026-11-15", 2)).toBe("2027-01-15")
    })
    it("regeling verdeelt het bedrag en vangt de afronding op in de laatste termijn", () => {
        const r = regeling(1000, "3", "2026-01-31")!
        expect(r.termijnbedrag).toBe(333.33)
        expect(r.laatste).toBe(333.34)
        expect(r.data).toEqual(["2026-01-31", "2026-02-28", "2026-03-31"])
        expect(regeling(1000, "1", "2026-01-31")).toBeNull()
        expect(regeling(1000, "25", "2026-01-31")).toBeNull()
    })
})

describe("maakBrief", () => {
    it("zonder invoer staan er alleen plaatshouders, geen 'undefined' of 'NaN'", () => {
        for (const slug of BRIEF_SLUGS) {
            const t = tekst(slug)
            expect(t).not.toMatch(/undefined|NaN|null/)
            // de huurbrief vraagt om een huurperiode in plaats van een factuurnummer
            expect(t).toContain(slug === "huurachterstand" ? "[huurperiode]" : "[factuurnummer]")
        }
    })

    it("volledig ingevuld blijven er geen plaatshouders over", () => {
        for (const slug of BRIEF_SLUGS) {
            expect(plaatshouders(maakBrief(slug, vol)), slug).toEqual([])
        }
    })

    it("herinnering noemt termijn en uiterste datum", () => {
        const t = tekst("betalingsherinnering", vol)
        expect(t).toContain("binnen 7 dagen")
        expect(t).toContain("uiterlijk op 16 november 2026")
        expect(t).toContain("NL00BANK0123456789")
        expect(t).toContain("Geachte heer Jansen,")
    })

    it("14-dagenbrief: wettelijke termijn, exact bedrag aan kosten, kosteloos", () => {
        const t = tekst("14-dagenbrief", vol)
        expect(t).toContain("binnen 14 dagen, te rekenen vanaf de dag na ontvangst van deze brief")
        expect(t).toMatch(/incassokosten verschuldigd van € 187,50\./)
        expect(t).toContain("Aan deze brief zijn voor u geen kosten verbonden.")
        // geen vaste einddatum: die kan te vroeg vallen
        expect(t).not.toContain("uiterlijk op")
    })

    it("14-dagenbrief met btw noemt het bedrag inclusief en de btw apart", () => {
        const t = tekst("14-dagenbrief", { ...vol, btw: true })
        expect(t).toContain("€ 226,88")
        expect(t).toContain("€ 187,50 plus € 39,38 btw")
    })

    it("aanmaning: zakelijk met kosten en handelsrente, particulier zonder kosten", () => {
        const z = tekst("aanmaning", vol)
        expect(z).toContain("€ 187,50")
        expect(z).toContain("handelsrente")
        expect(z).toContain("Ondanks onze herinnering hebben wij nog geen betaling ontvangen.")
        const p = tekst("aanmaning", { ...vol, soort: "particulier", herinnering: false })
        expect(p).not.toContain("€ 187,50")
        expect(p).toContain("Wij hebben nog geen betaling ontvangen.")
        expect(p).toContain("laatste termijn van 14 dagen")
    })

    it("ingebrekestelling stuit de verjaring en noemt bij particulieren geen incassokosten", () => {
        const p = tekst("ingebrekestelling", { ...vol, soort: "particulier" })
        expect(p).toContain("Hierbij stellen wij u in gebreke.")
        expect(p).toContain("stuit daarmee ook de verjaring")
        expect(p).not.toContain("incassokosten")
        expect(p).toContain("tot en met 23 november 2026")
    })

    it("sommatie telt incassokosten alleen mee als ze verschuldigd zijn", () => {
        const z = maakBrief("sommatie", vol)
        expect(spec(z).at(-1)).toEqual(["Totaal", "€ 1.437,50"])
        const p = maakBrief("sommatie", { ...vol, soort: "particulier" })
        expect(p.specificatie!.regels.map((r) => r[0])).toEqual(["Hoofdsom", "Totaal"])
        expect(spec(p).at(-1)).toEqual(["Totaal", "€ 1.250,00"])
        const pw = maakBrief("sommatie", { ...vol, soort: "particulier", wikVerstuurd: true })
        expect(spec(pw).at(-1)).toEqual(["Totaal", "€ 1.437,50"])
    })

    it("betalingsregeling maakt een betaalschema en een akkoordblok", () => {
        const b = maakBrief("betalingsregeling", vol)
        expect(b.specificatie!.regels).toHaveLength(3)
        expect(spec(b)[1]).toEqual(["Termijn 2, uiterlijk 28 februari 2026", "€ 416,66"])
        expect(spec(b)[2][1]).toBe("€ 416,68")
        expect(nb(briefAlsTekst(b))).toContain("De laatste termijn is € 416,68.")
        expect(b.akkoord![0]).toBe("Voor akkoord: Jansen Bouw")
    })
    it("huurachterstand: woonruimte zonder kosten en met hulpverwijzing, bedrijfsruimte met kosten", () => {
        const huur = { ...vol, factuur: "september en oktober 2026", bedrag: "1.900,00" }
        const z = tekst("huurachterstand", huur)
        expect(z).toContain("Betreft: Aanmaning huurachterstand september en oktober 2026")
        expect(z).toContain("onder vermelding van huur september en oktober 2026")
        expect(z).toContain("incassokosten verschuldigd van € 285,00")
        expect(z).not.toContain("Geldfit")
        const p = tekst("huurachterstand", { ...huur, soort: "particulier" })
        expect(p).not.toContain("incassokosten verschuldigd")
        expect(p).toContain("14 dagen")
        expect(p).toContain("kantonrechter")
        expect(p).toContain("Geldfit (0800 8115)")
        expect(termijnDagen("huurachterstand", "")).toBe(14)
        expect(plaatshouders(maakBrief("huurachterstand"))).toEqual(
            expect.arrayContaining(["huurperiode", "naam huurder", "adres huurder"]),
        )
    })
})
