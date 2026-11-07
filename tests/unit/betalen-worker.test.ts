import { describe, it, expect, vi } from "vitest"
import { handleBetalen } from "../../worker/betalen"

const BASIS = "https://geldgarant.com/api/betalen"
const post = (body: unknown, headers: Record<string, string> = {}) =>
    new Request(BASIS, {
        method: "POST",
        headers: { Origin: "https://geldgarant.com", "Content-Type": "application/json", ...headers },
        body: typeof body === "string" ? body : JSON.stringify(body),
    })
const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } })

describe("worker /api/betalen", () => {
    it("vraagt de betaallink op bij CaseControl met genormaliseerd dossiernummer en bedrag", async () => {
        const f = vi.fn(async () => json({ url: "https://pay.example/ideal/abc" }))
        const r = await handleBetalen(post({ dossiernummer: " 26-1008 ", bedrag: 967.934 }), {}, f as typeof fetch)
        expect(r.status).toBe(200)
        expect(await r.json()).toEqual({ ok: true, url: "https://pay.example/ideal/abc" })
        const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit]
        expect(url).toBe("https://api.casecontrol.app/api/portal/debtor/v1/geldgarant/pay")
        expect(JSON.parse(String(init.body))).toEqual({ caseNumber: "26-1008", amount: 967.93 })
        expect(r.headers.get("Cache-Control")).toBe("no-store")
    })

    it("geeft 404 als CaseControl het dossier niet kent (400 case-not-found of 404)", async () => {
        for (const antw of [json({ errorCode: "case-not-found" }, 400), json({}, 404)]) {
            const f = vi.fn(async () => antw)
            const r = await handleBetalen(post({ dossiernummer: "26-9999", bedrag: 10 }), {}, f as typeof fetch)
            expect(r.status).toBe(404)
            expect(await r.json()).toMatchObject({ error: "niet-gevonden" })
        }
    })

    it("weigert verzoeken van een andere site, zonder JSON of met ongeldige gegevens, zonder CaseControl te bellen", async () => {
        const f = vi.fn()
        const ff = f as unknown as typeof fetch
        expect(
            (await handleBetalen(post({ dossiernummer: "26-1008", bedrag: 10 }, { Origin: "https://evil.example" }), {}, ff))
                .status,
        ).toBe(403)
        expect((await handleBetalen(post("x", { "Content-Type": "text/plain" }), {}, ff)).status).toBe(415)
        expect((await handleBetalen(post("{kapot"), {}, ff)).status).toBe(400)
        expect((await handleBetalen(post({ dossiernummer: "x", bedrag: 10 }), {}, ff)).status).toBe(400)
        expect((await handleBetalen(post({ dossiernummer: "26-1008", bedrag: 4.99 }), {}, ff)).status).toBe(400)
        expect((await handleBetalen(post({ dossiernummer: "26-1008", bedrag: 250_001 }), {}, ff)).status).toBe(400)
        expect((await handleBetalen(new Request(BASIS, { method: "PUT" }), {}, ff)).status).toBe(405)
        expect(f).not.toHaveBeenCalled()
    })

    it("meldt een fout als CaseControl geen geldige https-link geeft of onbereikbaar is", async () => {
        const slecht = vi.fn(async () => json({ url: "javascript:alert(1)" }))
        expect((await handleBetalen(post({ dossiernummer: "26-1008", bedrag: 10 }), {}, slecht as typeof fetch)).status).toBe(502)
        const weg = vi.fn(async () => {
            throw new Error("netwerk")
        })
        const spy = vi.spyOn(console, "error").mockImplementation(() => {})
        expect((await handleBetalen(post({ dossiernummer: "26-1008", bedrag: 10 }), {}, weg as typeof fetch)).status).toBe(502)
        spy.mockRestore()
    })

    it("controle (GET) werkt als de betaallink aanstaat en /pay het testnummer niet kent", async () => {
        const f = vi.fn(async (url: string) =>
            url.endsWith("/portalinfo/basic")
                ? json({ displayName: "GeldGarant", paymentLinkEnabled: true })
                : json({ errorCode: "case-not-found" }, 400),
        )
        const r = await handleBetalen(new Request(BASIS), { CASECONTROL_PORTAL: "geldgarant" }, f as unknown as typeof fetch)
        expect(r.status).toBe(200)
        expect(await r.json()).toEqual({ ok: true, betaallink: true, pay: 400 })
    })
})
