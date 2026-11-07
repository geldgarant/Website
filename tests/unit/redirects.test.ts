import { existsSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

// Elk doel in public/_redirects moet een echte pagina zijn, en geen bron mag zelf een pagina zijn
// (anders wint de pagina en werkt de redirect nooit).
const regels = readFileSync("public/_redirects", "utf8")
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r && !r.startsWith("#"))
    .map((r) => r.split(/\s+/))

// bestanden die de build zelf maakt (geen pagina in src/pages)
const BUILD = ["/sitemap-index.xml"]

const pagina = (pad: string) => {
    if (BUILD.includes(pad)) return true
    const p = pad.split("#")[0].replace(/\/$/, "")
    if (p === "") return existsSync("src/pages/index.astro")
    if (p.startsWith("/werken-bij/:splat")) return existsSync("src/pages/werken-bij/[slug].astro")
    return existsSync(`src/pages${p}.astro`) ||
        existsSync(`src/pages${p}/index.astro`) ||
        existsSync(`src/pages${p}/[slug].astro`)
        ? true
        : existsSync(`src/pages${p.replace(/\/[^/]+$/, "")}/[slug].astro`)
}

describe("_redirects", () => {
    it("heeft per regel bron, doel en een geldige status", () => {
        for (const r of regels) {
            expect(r).toHaveLength(3)
            expect(["301", "302"]).toContain(r[2])
            expect(r[0].startsWith("/")).toBe(true)
        }
    })

    it("stuurt alleen door naar bestaande pagina's", () => {
        for (const [, doel] of regels) expect(pagina(doel), doel).toBe(true)
    })

    it("heeft geen bron die zelf een pagina is", () => {
        for (const [bron] of regels) {
            if (bron.includes("*")) continue
            const p = bron.replace(/\/$/, "")
            expect(existsSync(`src/pages${p}.astro`) || existsSync(`src/pages${p}/index.astro`), bron).toBe(false)
        }
    })

    it("heeft geen dubbele bronnen", () => {
        const bronnen = regels.map((r) => r[0])
        expect(new Set(bronnen).size).toBe(bronnen.length)
    })
})
