import { describe, expect, it } from "vitest"
import { wikKosten, WIK_MAX } from "../../src/lib/wik"

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
