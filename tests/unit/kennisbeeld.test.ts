import { readdirSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { BEELDEN, beeldVoor } from "../../src/lib/kennisbeeld"

const artikelen = readdirSync("src/content/kennisbank")
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))

describe("kennisbank-illustraties", () => {
    it("elk artikel heeft een illustratie en er zijn geen verweesde regels", () => {
        expect(Object.keys(BEELDEN).sort()).toEqual([...artikelen].sort())
    })

    it("elke combinatie is uniek", () => {
        const paren = Object.values(BEELDEN).map((p) => p.join("+"))
        expect(new Set(paren).size).toBe(paren.length)
    })

    it("maakt een geldige, decoratieve svg zonder ongeldige getallen", () => {
        for (const slug of artikelen) {
            const svg = beeldVoor(slug)
            expect(svg.startsWith('<svg viewBox="0 0 320 200"')).toBe(true)
            expect(svg).toContain('aria-hidden="true"')
            expect(svg).not.toMatch(/NaN|undefined/)
        }
    })

    it("onbekend artikel laat de build falen", () => {
        expect(() => beeldVoor("bestaat-niet")).toThrow(/kennisbeeld/)
    })
})
