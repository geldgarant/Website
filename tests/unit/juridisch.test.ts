import { readFileSync, readdirSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { bewerkJuridischHtml } from "../../src/lib/juridisch"

// Nabootsing van de Markdown-uitvoer van een juridisch document, met de constructies die we gebruiken.
const voorbeeld = `<h2 id="artikel-6-kosten">Artikel 6 Kosten</h2>
<p>6.2 De staffel:</p>
<p>{{wikStaffel}}</p>
<p>6.4 Minimaal € 45, bel {{telefoon}} of mail naar {{klachtenEmail}}.</p>
<table><thead><tr><th>Wie</th><th>Wat</th><th>Waarom</th></tr></thead><tbody><tr><td>A</td><td>B</td><td>C</td></tr></tbody></table>
<table><thead><tr><th>Gegevens</th><th>Termijn</th></tr></thead><tbody><tr><td>E-mail</td><td>1 jaar</td></tr></tbody></table>
<h2 id="artikel-7-intrekken">Artikel 7 Intrekken</h2>`

const tel = (html: string, re: RegExp) => (html.match(re) ?? []).length

describe("bewerkJuridischHtml", () => {
    const { html, koppen } = bewerkJuridischHtml(voorbeeld)

    it("vult plaatshouders in en bouwt de staffel uit wik.ts", () => {
        expect(html).not.toMatch(/\{\{|\}\}/)
        expect(html).toContain("15%")
        expect(html).toContain('href="tel:')
        expect(html).toContain("€ 45")
    })

    it("geeft artikelen en leden vaste ankers", () => {
        expect(koppen).toEqual([
            { id: "artikel-6", tekst: "Kosten" },
            { id: "artikel-7", tekst: "Intrekken" },
        ])
        expect(html).toContain('id="lid-6-4"')
    })

    it("houdt de HTML in balans: elke tabel in precies één omhulling", () => {
        expect(tel(html, /<section/g)).toBe(tel(html, /<\/section>/g))
        expect(tel(html, /<table/g)).toBe(3)
        expect(tel(html, /<section class="tabel"/g)).toBe(3)
        expect(html).toContain('<table class="kaarttabel">')
        expect(html).toContain('data-label="Waarom"')
    })

    it("weigert een onbekende plaatshouder", () => {
        expect(() => bewerkJuridischHtml("<p>{{onbekend}}</p><p>x {{onbekend}}</p>")).toThrow()
    })

    it("de echte documenten gebruiken alleen bekende plaatshouders", () => {
        for (const f of readdirSync("src/content/juridisch")) {
            const md = readFileSync(`src/content/juridisch/${f}`, "utf8")
            for (const [, k] of md.matchAll(/\{\{(\w+)\}\}/g))
                expect(["telefoon", "email", "klachtenEmail", "adres", "kvk", "register", "uren", "wikStaffel"]).toContain(k)
            expect(md, f).not.toMatch(/ — | – |!/)
        }
    })
})
