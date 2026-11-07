import { test, expect, type Page } from "@playwright/test"

// Turnstile en /api/sollicitatie worden nagebootst: er gaat nooit echte data naar api.geldgarant.com.
async function mockApi(
    page: Page,
    antwoord: Record<string, unknown> = { ok: true, accepted: true, requestId: "GG-SOL-2026-00042" },
) {
    const verzoeken: { headers: Record<string, string>; body: string }[] = []
    await page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
        route.fulfill({
            contentType: "application/javascript",
            body: `window.turnstile = { render(el, o) { setTimeout(() => o.callback("test-token"), 50); return "w1" }, reset() {} }`,
        }),
    )
    await page.route("https://api.geldgarant.com/**", async (route) => {
        const req = route.request()
        verzoeken.push({ headers: req.headers(), body: req.postDataBuffer()?.toString("latin1") ?? "" })
        await route.fulfill({ contentType: "application/json", body: JSON.stringify(antwoord) })
    })
    return verzoeken
}

const PDF = { name: "cv-test.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") }

test.describe("sollicitatie met cv", () => {
    test("houdt tegen zonder verplichte velden en cv", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/werken-bij/incasso-medewerker")
        const sol = page.locator("#solliciteren")
        await sol.getByRole("button", { name: /Verstuur sollicitatie/ }).click()
        await expect(sol.locator('[data-fout="cv"]')).toHaveText(/Voeg uw cv toe/)
        await expect(sol.locator('[data-fout="akkoord"]')).not.toBeEmpty()
        await expect(sol.locator('[name="naam"]')).toHaveAttribute("aria-invalid", "true")
        expect(verzoeken).toHaveLength(0)
    })

    test("verstuurt functie, gegevens en cv als multipart", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/werken-bij/call-center-medewerker")
        const sol = page.locator("#solliciteren")
        await sol.locator('[name="naam"]').fill("Sam de Vries")
        await sol.locator('[name="email"]').fill("sam@voorbeeld.nl")
        await sol.locator('[name="telefoon"]').fill("06 12345678")
        await sol.locator("[data-cv]").setInputFiles(PDF)
        await expect(sol.locator("[data-cv-tekst]")).toContainText("cv-test.pdf")
        await sol.locator('[name="akkoord"]').check()
        await sol.getByRole("button", { name: /Verstuur sollicitatie/ }).click()
        await expect(sol.locator("[data-klaar-ref]")).toHaveText("GG-SOL-2026-00042")
        expect(verzoeken).toHaveLength(1)
        const { headers, body } = verzoeken[0]
        expect(headers["content-type"]).toContain("multipart/form-data")
        expect(headers["x-request-nonce"]).toMatch(/^[a-f0-9]{32}$/)
        expect(body).toContain("Medewerker klantcontact")
        expect(body).toContain("test-token")
        expect(body).toContain('filename="cv-test.pdf"')
    })

    test("weigert een afbeelding als cv", async ({ page }) => {
        await mockApi(page)
        await page.goto("/werken-bij")
        const sol = page.locator("#open-sollicitatie")
        await sol.locator("[data-cv]").setInputFiles({ name: "foto.png", mimeType: "image/png", buffer: Buffer.from("x") })
        await sol.getByRole("button", { name: /Verstuur sollicitatie/ }).click()
        await expect(sol.locator('[data-fout="cv"]')).toHaveText(/PDF- of Word-bestand/)
    })

    test("toont terugvaloptie als versturen mislukt", async ({ page }) => {
        await mockApi(page, { ok: false, error: "" })
        await page.goto("/werken-bij/stage")
        const sol = page.locator("#solliciteren")
        await sol.locator('[name="naam"]').fill("Sam de Vries")
        await sol.locator('[name="email"]').fill("sam@voorbeeld.nl")
        await sol.locator('[name="telefoon"]').fill("0612345678")
        await sol.locator("[data-cv]").setInputFiles(PDF)
        await sol.locator('[name="akkoord"]').check()
        await sol.getByRole("button", { name: /Verstuur sollicitatie/ }).click()
        await expect(sol.locator("[data-melding]")).toContainText(/Versturen lukte niet/)
    })
})
