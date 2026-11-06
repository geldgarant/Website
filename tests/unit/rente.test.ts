import { describe, expect, it } from "vitest"
import { RENTE, dag, huidigPercentage, wettelijkeRente } from "../../src/lib/rente"

describe("rentetabellen", () => {
    it("staan op volgorde van datum en zijn geldige datums", () => {
        for (const rijen of Object.values(RENTE)) {
            const t = rijen.map(([d]) => dag(d))
            t.forEach((x) => expect(Number.isFinite(x)).toBe(true))
            expect([...t].sort((a, b) => a - b)).toEqual(t)
        }
    })

    it("kent de actuele percentages (nov 2026)", () => {
        expect(huidigPercentage("handel", "2026-11-06")).toBe(10.4)
        expect(huidigPercentage("handel", "2026-03-01")).toBe(10.15)
        expect(huidigPercentage("consument", "2026-11-06")).toBe(4)
        expect(huidigPercentage("consument", "2024-06-30")).toBe(7)
    })
})

describe("wettelijke rente", () => {
    it("splitst bij een tariefwijziging (handelsrente 2026)", () => {
        const { rente, perioden } = wettelijkeRente(1000, "handel", "2026-01-01", "2027-01-01")
        expect(perioden).toHaveLength(2)
        expect(perioden[0]).toMatchObject({ dagen: 181, pct: 10.15 })
        expect(perioden[1]).toMatchObject({ dagen: 184, pct: 10.4 })
        // 1000 × 10,15% × 181/365 + 1000 × 10,4% × 184/365
        expect(rente).toBeCloseTo(50.33 + 52.43, 1)
    })

    it("telt na een vol jaar de rente bij de hoofdsom op (rente op rente)", () => {
        const { rente, perioden } = wettelijkeRente(1000, "consument", "2024-01-01", "2026-01-01")
        const jaar1 = (1000 * 0.07 * 366) / 365
        const jaar2 = ((1000 + jaar1) * 0.06 * 365) / 365
        expect(rente).toBeCloseTo(jaar1 + jaar2, 2)
        expect(perioden[1].grondslag).toBeCloseTo(1000 + jaar1, 2)
    })

    it("geeft 0 bij een ongeldige invoer of een lege periode", () => {
        expect(wettelijkeRente(0, "handel", "2026-01-01", "2026-02-01").rente).toBe(0)
        expect(wettelijkeRente(1000, "handel", "2026-02-01", "2026-02-01").rente).toBe(0)
        expect(wettelijkeRente(1000, "handel", "2026-03-01", "2026-02-01").rente).toBe(0)
        expect(wettelijkeRente(1000, "handel", "geen-datum", "2026-02-01").rente).toBe(0)
    })

    it("rekent één maand handelsrente goed uit", () => {
        // 31 dagen in juli 2026 tegen 10,4%
        expect(wettelijkeRente(10000, "handel", "2026-07-01", "2026-08-01").rente).toBeCloseTo((10000 * 0.104 * 31) / 365, 2)
    })
})
