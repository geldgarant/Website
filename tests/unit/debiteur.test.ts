import { describe, it, expect, vi, afterEach } from "vitest"
import {
    normDossier,
    isDossier,
    bedragVeld,
    valideerBetaling,
    leesVoorinvulling,
    vraagBetaallink,
    termijnen,
    leegReactie,
    valideerReactie,
    reactieTekst,
    bouwReactiePayload,
    BETAAL_MIN,
} from "../../src/lib/debiteur"
import { ApiFout } from "../../src/lib/intake"

describe("dossiernummer", () => {
    it("maakt netjes: hoofdletters, geen spaties", () => {
        expect(normDossier(" gg-2026 00412 ")).toBe("GG-202600412")
        expect(normDossier("2026/00412")).toBe("2026/00412")
    })
    it("accepteert gangbare vormen en weigert onzin", () => {
        expect(isDossier("2026-00412")).toBe(true)
        expect(isDossier("GG-2026-01234")).toBe(true)
        expect(isDossier("12")).toBe(false)
        expect(isDossier("-123")).toBe(false)
        expect(isDossier("")).toBe(false)
    })
})

describe("betalen", () => {
    it("bedrag voor een invoerveld", () => {
        expect(bedragVeld(245.6)).toBe("245,60")
        expect(bedragVeld(0)).toBe("")
    })
    it("valideert dossiernummer en minimumbedrag", () => {
        expect(valideerBetaling({ dossier: "", bedrag: "" })).toMatchObject({
            dossier: expect.any(String),
            bedrag: expect.any(String),
        })
        expect(valideerBetaling({ dossier: "2026-00412", bedrag: "4,99" }).bedrag).toContain(`€ ${BETAAL_MIN}`)
        expect(valideerBetaling({ dossier: "2026-00412", bedrag: "967,93" })).toEqual({})
    })
    it("vult voor uit de link in een brief of QR-code", () => {
        expect(leesVoorinvulling("?dossier=2026-00412&bedrag=967,93")).toEqual({ dossier: "2026-00412", bedrag: "967,93" })
        expect(leesVoorinvulling("?d=gg%20123&b=50")).toEqual({ dossier: "GG123", bedrag: "50,00" })
        expect(leesVoorinvulling("?kenmerk=2026-00412")).toEqual({ dossier: "2026-00412", bedrag: "" })
        // onbruikbare waarden worden genegeerd
        expect(leesVoorinvulling("?dossier=x&bedrag=1")).toEqual({ dossier: "", bedrag: "" })
    })
})

describe("vraagBetaallink", () => {
    afterEach(() => vi.unstubAllGlobals())
    const stub = (status: number, body: unknown) => {
        const f = vi.fn(async () => new Response(JSON.stringify(body), { status }))
        vi.stubGlobal("fetch", f)
        return f
    }
    it("stuurt dossiernummer en bedrag en geeft de https-URL terug", async () => {
        const f = stub(200, { ok: true, url: "https://betalen.example/abc" })
        await expect(
            vraagBetaallink("https://api.test/api/betaallink", { dossier: "2026 00412", bedrag: "967,93" }),
        ).resolves.toBe("https://betalen.example/abc")
        const [, init] = f.mock.calls[0] as unknown as [string, RequestInit]
        expect(JSON.parse(String(init.body))).toEqual({ dossiernummer: "202600412", bedrag: 967.93 })
    })
    it("onbekend dossier geeft een 404-fout", async () => {
        stub(404, { ok: false, error: "niet-gevonden" })
        await expect(vraagBetaallink("https://api.test", { dossier: "2026-00412", bedrag: "10" })).rejects.toMatchObject({
            status: 404,
        })
    })
    it("weigert een antwoord zonder veilige URL", async () => {
        stub(200, { ok: true, url: "http://onveilig.example" })
        await expect(vraagBetaallink("https://api.test", { dossier: "2026-00412", bedrag: "10" })).rejects.toBeInstanceOf(ApiFout)
    })
})

describe("termijnen", () => {
    it("rekent aantal en laatste termijn", () => {
        expect(termijnen(967.93, 100)).toEqual({ aantal: 10, laatste: 67.93 })
        expect(termijnen(300, 100)).toEqual({ aantal: 3, laatste: 100 })
        expect(termijnen(50, 100)).toEqual({ aantal: 1, laatste: 50 })
        expect(termijnen(0, 100)).toBeNull()
        expect(termijnen(100, 0)).toBeNull()
    })
})

describe("reactie", () => {
    const basis = () => ({ ...leegReactie(), dossier: "2026-00412", naam: "J. de Vries", email: "j@example.nl" })
    it("vraagt per reden de juiste velden", () => {
        expect(valideerReactie(leegReactie())).toHaveProperty("reden")
        expect(valideerReactie({ ...basis(), reden: "regeling" })).toHaveProperty("per_maand")
        expect(valideerReactie({ ...basis(), reden: "regeling", per_maand: "100" })).toEqual({})
        expect(valideerReactie({ ...basis(), reden: "betaald" })).toMatchObject({
            betaald_op: expect.any(String),
            betaald_bedrag: expect.any(String),
        })
        expect(valideerReactie({ ...basis(), reden: "oneens", toelichting: "kort" })).toHaveProperty("toelichting")
        expect(valideerReactie({ ...basis(), reden: "anders", toelichting: "Ik wil graag een overzicht." })).toEqual({})
        expect(valideerReactie({ ...basis(), reden: "regeling", per_maand: "50", voorkeur: "telefoon" })).toHaveProperty(
            "telefoon",
        )
    })
    it("zet de feiten bovenaan voor ons team", () => {
        const t = reactieTekst({ ...basis(), reden: "regeling", per_maand: "100", ingang: "2026-12-01", schuldhulp: true })
        expect(t).toContain("Betalingsregeling aanvragen")
        expect(t).toContain("Dossiernummer: 2026-00412")
        expect(t).toContain("€ 100,00 per maand")
        expect(t).toContain("Eerste betaling: 01-12-2026")
        expect(t).toContain("schuldhulpverlener")
        expect(t).not.toContain("\n")
    })
    it("volgt het contract van /api/contact (bestaand dossier, naam als bedrijfsnaam)", () => {
        const p = bouwReactiePayload(
            { ...basis(), reden: "betaald", betaald_op: "2026-11-03", betaald_bedrag: "967,93" },
            { nonce: "a".repeat(32), turnstileToken: "", pagina: "/brief-ontvangen", referrer: "", utm: new URLSearchParams() },
        )
        expect(p.onderwerp.key).toBe("bestaand_dossier")
        expect(p.contact.bedrijfsnaam).toBe("J. de Vries")
        expect(p.details.dossiernummer).toBe("2026-00412")
        expect(p.details.toelichting).toContain("Betaald op: 03-11-2026")
        expect(p.details.toelichting.length).toBeGreaterThanOrEqual(10)
        expect(p.metadata.cta).toBe("brief-betaald")
    })
})
