import { test, expect, type Page, type Request } from "@playwright/test"

// Alle verzoeken naar de intake-API en Turnstile worden nagebootst: er gaat nooit echte data naar api.geldgarant.com.
async function mockApi(page: Page) {
    const verzoeken: { pad: string; methode: string; body: string }[] = []
    await page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
        route.fulfill({
            contentType: "application/javascript",
            body: `window.turnstile = { render(el, o) { setTimeout(() => o.callback("test-token"), 50); return "w1" }, reset() {} }`,
        }),
    )
    await page.route("https://api.geldgarant.com/**", async (route) => {
        const req: Request = route.request()
        const url = new URL(req.url())
        verzoeken.push({ pad: url.pathname, methode: req.method(), body: req.postData() ?? "" })
        const json = (d: unknown) => route.fulfill({ contentType: "application/json", body: JSON.stringify(d) })
        if (url.pathname === "/api/location/search")
            return json([
                {
                    id: "1",
                    label: "Keulenstraat 1, 7418ET Deventer",
                    street: "Keulenstraat",
                    houseNumber: "1",
                    postcode: "7418ET",
                    city: "Deventer",
                },
            ])
        if (url.pathname === "/api/incasso-session")
            return json({ ok: true, dossierId: "GG-2026-12345", sessionToken: "sess.tok" })
        if (url.pathname === "/api/incasso-upload")
            return json({
                ok: true,
                bestanden: [
                    {
                        naam: "factuur.pdf",
                        grootte: 9,
                        type: "application/pdf",
                        storage_path: "upload/GG-2026-12345/1-factuur.pdf",
                    },
                ],
            })
        if (url.pathname === "/api/incasso-aanvragen") return json({ ok: true, accepted: true, dossierId: "GG-2026-12345" })
        return route.fulfill({ status: 404, body: "{}" })
    })
    return verzoeken
}

test.describe("vordering indienen", () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => sessionStorage.clear())
    })

    test("stap 1 houdt je tegen zonder bedrag en rekent de incassokosten live", async ({ page }) => {
        await mockApi(page)
        await page.goto("/vordering-indienen")
        await page.getByRole("button", { name: /Volgende stap/ }).click()
        await expect(page.locator('[data-fout="bedrag"]')).toHaveText(/Vul het openstaande bedrag in/)
        await expect(page.locator("#v-bedrag")).toHaveAttribute("aria-invalid", "true")
        await page.fill("#v-bedrag", "2.500")
        await expect(page.locator("[data-bedrag-uitleg]")).toContainText("€ 375,00")
    })

    test("volledige aanvraag met bijlage en adreszoeker, payload volgens contract", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/vordering-indienen")

        // stap 1
        await page.fill("#v-bedrag", "2.500")
        await page.fill("#v-factuurnummer", "F-2026-204")
        await page.setInputFiles("#v-bestanden", {
            name: "factuur.pdf",
            mimeType: "application/pdf",
            buffer: Buffer.from("%PDF-1.4\n"),
        })
        await expect(page.locator("[data-bestandlijst] li")).toHaveCount(1)
        await page.getByRole("button", { name: /Volgende stap/ }).click()

        // stap 2: zonder contactgegevens niet verder
        await page.fill("#v-deb-naam", "Bakker Bouw BV")
        await page.getByRole("button", { name: /Volgende stap/ }).click()
        await expect(page.locator('[data-fout="debiteur_contact"]')).toHaveText(/minstens één manier/)
        await page.locator("#debiteur-adres-zoek").fill("7418ET 1")
        await page.getByRole("option", { name: /Keulenstraat 1/ }).click()
        await expect(page.locator("#debiteur-adres-straat")).toHaveValue("Keulenstraat")
        await expect(page.locator("#debiteur-adres-postcode")).toHaveValue("7418 ET")
        await page.getByRole("button", { name: /Volgende stap/ }).click()

        // stap 3
        await page.fill("#v-bedrijfsnaam", "Jansen Installatie")
        await page.fill("#v-iban", "NL91 ABNA 0417 1643 00")
        await page.fill("#v-voornaam", "Piet")
        await page.fill("#v-achternaam", "Jansen")
        await page.fill("#v-email", "piet@jansen.nl")
        await page.fill("#v-telefoon", "06 1234 5678")
        await page.getByRole("button", { name: /Volgende stap/ }).click()

        // stap 4: overzicht, akkoord, versturen
        await expect(page.locator("[data-overzicht]")).toContainText("Bakker Bouw BV")
        await page.getByRole("button", { name: /Vordering versturen/ }).click()
        await expect(page.locator('[data-fout="akkoord"]')).toHaveText(/Ga akkoord/)
        await page.check("#v-akkoord")
        await page.getByRole("button", { name: /Vordering versturen/ }).click()

        await expect(page.locator("[data-klaar]")).toBeVisible()
        await expect(page.locator("[data-klaar-dossier]")).toHaveText("GG-2026-12345")

        const paden = verzoeken.map((v) => `${v.methode} ${v.pad}`)
        expect(paden).toEqual(
            expect.arrayContaining(["POST /api/incasso-session", "POST /api/incasso-upload", "POST /api/incasso-aanvragen"]),
        )
        const sessie = JSON.parse(verzoeken.find((v) => v.pad === "/api/incasso-session")!.body)
        expect(sessie.turnstile_token).toBe("test-token")
        expect(sessie.nonce).toMatch(/^[a-f0-9]{32}$/)
        const p = JSON.parse(verzoeken.find((v) => v.pad === "/api/incasso-aanvragen")!.body)
        expect(p).toMatchObject({
            type: "incasso_aanvraag",
            session_token: "sess.tok",
            dossier_id: "GG-2026-12345",
            nonce: sessie.nonce,
            aanvrager: { voornaam: "Piet", achternaam: "Jansen", email: "piet@jansen.nl" },
            bedrijf: { naam: "Jansen Installatie", iban: "NL91ABNA0417164300", btw_plichtig: true },
            vordering: {
                bedrag: 2500,
                factuurnummer: "F-2026-204",
                debiteur: { naam: "Bakker Bouw BV", adres: { straat: "Keulenstraat", postcode: "7418 ET", plaats: "Deventer" } },
                documenten: [{ storage_path: "upload/GG-2026-12345/1-factuur.pdf" }],
            },
            toestemmingen: { akkoord_av: true, akkoord_avg: true },
        })
    })

    test("foutmelding van de API wordt getoond en het formulier blijft staan", async ({ page }) => {
        await mockApi(page)
        await page.route("https://api.geldgarant.com/api/incasso-session", (r) =>
            r.fulfill({
                status: 403,
                contentType: "application/json",
                body: JSON.stringify({ ok: false, error: "De beveiligingscheck is verlopen of mislukt." }),
            }),
        )
        await page.addInitScript(() =>
            sessionStorage.setItem(
                "gg-vordering-v1",
                JSON.stringify({
                    bedrag: "500",
                    debiteur_naam: "Klant",
                    debiteur_email: "k@k.nl",
                    bedrijfsnaam: "Mijn BV",
                    voornaam: "A",
                    achternaam: "B",
                    email: "a@b.nl",
                    telefoon: "0612345678",
                }),
            ),
        )
        await page.goto("/vordering-indienen")
        for (let i = 0; i < 3; i++) await page.getByRole("button", { name: /Volgende stap/ }).click()
        await page.check("#v-akkoord")
        await page.getByRole("button", { name: /Vordering versturen/ }).click()
        await expect(page.locator("[data-melding]")).toHaveText(/beveiligingscheck/)
        await expect(page.locator("[data-vordering]")).toBeVisible()
    })
})
