import { describe, expect, it } from "vitest"
import { feestdagen, isWerkdag, klachtTermijnen, pasen, plusWerkdagen, volgendeWerkdag } from "../../src/lib/werkdagen"

const iso = (n: number) => new Date(n).toISOString().slice(0, 10)

describe("werkdagen", () => {
    it("berekent Pasen correct", () => {
        expect(iso(pasen(2026))).toBe("2026-04-05")
        expect(iso(pasen(2027))).toBe("2027-03-28")
        expect(iso(pasen(2025))).toBe("2025-04-20")
    })

    it("kent de feestdagen uit de Algemene termijnenwet", () => {
        const f = feestdagen(2026)
        expect(f.has("2026-04-06")).toBe(true) // tweede paasdag
        expect(f.has("2026-04-27")).toBe(true) // Koningsdag
        expect(f.has("2026-05-05")).toBe(true)
        expect(f.has("2026-05-14")).toBe(true) // Hemelvaart
        expect(f.has("2026-05-25")).toBe(true) // tweede pinksterdag
        expect(f.has("2026-04-03")).toBe(false) // Goede Vrijdag telt niet
        // 27 april 2025 viel op zondag: Koningsdag op zaterdag 26 april
        expect(feestdagen(2025).has("2025-04-26")).toBe(true)
    })

    it("slaat weekenden en feestdagen over", () => {
        expect(isWerkdag("2026-11-07")).toBe(false) // zaterdag
        expect(isWerkdag("2026-11-09")).toBe(true)
        expect(volgendeWerkdag("2026-11-07")).toBe("2026-11-09")
        expect(plusWerkdagen("2026-12-24", 1)).toBe("2026-12-28") // over kerst en weekend heen
    })

    it("berekent de termijnen van een klacht", () => {
        // zaterdag ingediend: ontvangen maandag, bevestiging woensdag, antwoord 14 werkdagen later
        expect(klachtTermijnen("2026-11-07")).toEqual({
            ontvangen: "2026-11-09",
            bevestiging: "2026-11-11",
            antwoord: "2026-11-27",
        })
        expect(klachtTermijnen("geen-datum")).toBeNull()
    })
})
