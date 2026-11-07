import { test, expect, type Page } from "@playwright/test"

// Turnstile en /api/contact worden nagebootst: er gaat nooit echte data naar api.geldgarant.com.
async function mockApi(page: Page, antwoord: Record<string, unknown> = { ok: true, accepted: true, requestId: "CT-2026-0042" }) {
    const verzoeken: { headers: Record<string, string>; body: Record<string, unknown> }[] = []
    await page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
        route.fulfill({
            contentType: "application/javascript",
            body: `window.turnstile = { render(el, o) { setTimeout(() => o.callback("test-token"), 50); return "w1" }, reset() {} }`,
        }),
    )
    await page.route("https://api.geldgarant.com/**", async (route) => {
        const req = route.request()
        verzoeken.push({ headers: req.headers(), body: JSON.parse(req.postData() ?? "{}") })
        await route.fulfill({ contentType: "application/json", body: JSON.stringify(antwoord) })
    })
    return verzoeken
}

test.describe("contact opnemen", () => {
    test("houdt je tegen zonder onderwerp en verplichte velden", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/contact-opnemen")
        await page.getByRole("button", { name: /Bericht versturen/ }).click()
        await expect(page.locator('[data-fout="onderwerp"]')).toHaveText(/Kies waar uw vraag over gaat/)
        await expect(page.locator('[data-fout="email"]')).toHaveText(/geldig e-mailadres/)
        await expect(page.locator("#c-naam")).toHaveAttribute("aria-invalid", "true")
        expect(verzoeken).toHaveLength(0)
    })

    test("voorvullen vanuit pakketknop en versturen met nonce en pakket", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/contact-opnemen?onderwerp=debiteurenbeheer&pakket=groei")
        await expect(page.locator('input[name="onderwerp"][value="debiteurenbeheer"]')).toBeChecked()
        await expect(page.locator("#c-pakket")).toHaveValue("groei")
        await page.fill("#c-aantal", "40")
        await page.fill("#c-naam", "Test Persoon")
        await page.fill("#c-bedrijf", "Testbedrijf")
        await page.fill("#c-email", "Test@Voorbeeld.nl")
        await page.fill("#c-toelichting", "Ik wil graag weten hoe de koppeling werkt.")
        await page.getByRole("button", { name: /Bericht versturen/ }).click()
        await expect(page.locator("[data-verzonden]")).toBeVisible()
        await expect(page.locator("[data-verzonden-ref]")).toHaveText("CT-2026-0042")
        expect(verzoeken).toHaveLength(1)
        const { headers, body } = verzoeken[0]
        expect(headers["x-request-nonce"]).toBe(body.nonce)
        expect(body.onderwerp).toEqual({ key: "debiteurenbeheer", label: "Debiteurenbeheer" })
        expect((body.contact as Record<string, string>).email).toBe("test@voorbeeld.nl")
        expect((body.details as Record<string, string>).toelichting).toMatch(/^Pakket: Groei/)
        expect(body.turnstile_token).toBe("test-token")
    })

    test("klacht vanaf de klachtenregeling: dossiernummer gaat mee", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/contact-opnemen?onderwerp=klacht_geschil")
        await expect(page.locator('input[name="onderwerp"][value="klacht_geschil"]')).toBeChecked()
        await expect(page.locator("#c-dossier")).toBeVisible()
        await page.fill("#c-dossier", "GG-2026-01234")
        await page.fill("#c-naam", "Test Persoon")
        await page.fill("#c-bedrijf", "Persoon")
        await page.fill("#c-email", "test@voorbeeld.nl")
        await page.fill("#c-toelichting", "Ik ben niet tevreden over hoe ik te woord ben gestaan.")
        await page.getByRole("button", { name: /Bericht versturen/ }).click()
        await expect(page.locator("[data-verzonden]")).toBeVisible()
        expect(verzoeken).toHaveLength(1)
        const { body } = verzoeken[0]
        expect((body.onderwerp as Record<string, string>).key).toBe("klacht_geschil")
        expect((body.details as Record<string, string>).dossiernummer).toBe("GG-2026-01234")
    })

    test("terugbelverzoek maakt telefoon verplicht en toont het moment-veld", async ({ page }) => {
        await mockApi(page)
        await page.goto("/contact-opnemen")
        await expect(page.locator("#c-moment")).toBeHidden()
        await page.locator('input[name="onderwerp"][value="terugbelverzoek"]').check()
        await expect(page.locator("#c-moment")).toBeVisible()
        await page.getByRole("button", { name: /Bericht versturen/ }).click()
        await expect(page.locator('[data-fout="telefoon"]')).toHaveText(/telefoonnummer/)
    })

    test("opgeslagen maar niet gemeld: toont referentie met belnoot", async ({ page }) => {
        await mockApi(page, { ok: false, accepted: false, requestId: "CT-2026-0099", error: "mail" })
        await page.goto("/contact-opnemen?onderwerp=algemene_vraag")
        await page.fill("#c-naam", "Test Persoon")
        await page.fill("#c-bedrijf", "Testbedrijf")
        await page.fill("#c-email", "test@voorbeeld.nl")
        await page.fill("#c-toelichting", "Een algemene vraag over jullie werkwijze.")
        await page.getByRole("button", { name: /Bericht versturen/ }).click()
        await expect(page.locator("[data-verzonden-ref]")).toHaveText("CT-2026-0099")
        await expect(page.locator("[data-verzonden-noot]")).toBeVisible()
    })
})
