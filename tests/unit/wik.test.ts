import { describe, expect, it } from "vitest"
import { wikKosten, WIK_MAX, afrekening } from "../../src/lib/wik"

describe("WIK-staffel", () => {
    it.each([
        [100, 40], // minimum
        [266.67, 40],
        [1000, 150],
        [2500, 375],
        [5000, 625],
        [10000, 875],
        [200000, 2775],
        [300000, 3275],
        [1234.5, 185.18],
    ])("hoofdsom %d geeft %d", (hoofdsom, verwacht) => {
        expect(wikKosten(hoofdsom)).toBe(verwacht)
    })

    it("heeft een maximum van €6.775", () => {
        expect(wikKosten(10_000_000)).toBe(WIK_MAX)
    })

    it("geeft 0 bij een ongeldig of leeg bedrag", () => {
        expect(wikKosten(0)).toBe(0)
        expect(wikKosten(-5)).toBe(0)
        expect(wikKosten(Number.NaN)).toBe(0)
    })
})

describe("afrekening", () => {
    it("volledig betaald: hoofdsom naar u, kosten naar GeldGarant", () => {
        expect(afrekening(1000, 1)).toEqual({ kosten: 150, debiteurBetaalt: 1150, naarGeldGarant: 150, naarU: 1000 })
    })
    it("deels betaald: eerst de incassokosten", () => {
        const r = afrekening(1000, 750 / 1150)
        expect(r.debiteurBetaalt).toBe(750)
        expect(r.naarGeldGarant).toBe(150)
        expect(r.naarU).toBe(600)
    })
    it("deels betaald bij een kleine vordering: minimum € 45", () => {
        const r = afrekening(200, 0.5) // kosten 40, betaald 120
        expect(r.naarGeldGarant).toBe(45)
        expect(r.naarU).toBe(75)
    })
    it("niets betaald: niemand ontvangt iets", () => {
        expect(afrekening(1000, 0)).toEqual({ kosten: 150, debiteurBetaalt: 0, naarGeldGarant: 0, naarU: 0 })
    })
})
