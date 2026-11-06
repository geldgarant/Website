import { describe, expect, it } from "vitest"
import { PAKKETTEN, pakketKosten, losKosten, besteKeuze } from "../../src/lib/pakketten"

const [start, groei, zakelijk] = PAKKETTEN

describe("debiteurenbeheer-pakketten", () => {
    it("rekent extra dossiers boven de limiet", () => {
        expect(pakketKosten(start, 20)).toBe(99)
        expect(pakketKosten(start, 21)).toBe(102.95)
        expect(pakketKosten(groei, 60)).toBe(238.5)
        expect(pakketKosten(zakelijk, 130)).toBe(388.5)
    })

    it("rekent losse dossiers", () => {
        expect(losKosten(0)).toBe(0)
        expect(losKosten(5)).toBe(49.75)
    })

    it.each([
        [1, "los"],
        [9, "los"],
        [10, "start"], // 99,50 los tegen 99 Start
        [20, "start"],
        [45, "start"], // Start 197,75 tegen Groei 199
        [46, "groei"],
        [87, "groei"], // Groei 345,15 tegen Zakelijk 349
        [88, "zakelijk"],
        [100, "zakelijk"],
        [200, "zakelijk"],
    ])("bij %d dossiers is %s het goedkoopst", (n, id) => {
        expect(besteKeuze(n).id).toBe(id)
    })
})
