import { test, expect, type Page } from "@playwright/test"

// /brief-ontvangen. Turnstile en api.geldgarant.com worden nagebootst: er gaat nooit echte data de deur uit.
async function mockApi(
    page: Page,
    antwoord: Record<string, unknown> = { ok: true, accepted: true, requestId: "GG-CONT-2026-00042" },
) {
    const verzoeken: { url: string; headers: Record<string, string>; body: Record<string, unknown> }[] = []
    await page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
        route.fulfill({
            contentType: "application/javascript",
            body: `window.turnstile = { render(el, o) { setTimeout(() => o.callback("test-token"), 50); return "w1" }, reset() {} }`,
        }),
    )
    await page.route("https://api.geldgarant.com/**", async (route) => {
        const req = route.request()
        verzoeken.push({ url: req.url(), headers: req.headers(), body: JSON.parse(req.postData() ?? "{}") })
        await route.fulfill({ contentType: "application/json", body: JSON.stringify(antwoord) })
    })
    return verzoeken
}

test.describe("brief ontvangen", () => {
    test("betalen: voorinvullen uit de link en stap naar het portaal met de gegevens", async ({ page }) => {
        await page.goto("/brief-ontvangen?dossier=2026-00412&bedrag=967,93")
        await expect(page.locator("#b-dossier")).toHaveValue("2026-00412")
        await expect(page.locator("#b-bedrag")).toHaveValue("967,93")
        await page.getByRole("button", { name: "Nu betalen" }).click()
        const portaal = page.locator("[data-portaal]")
        await expect(portaal).toBeVisible()
        await expect(portaal.locator('[data-portaal-waarde="dossier"]')).toHaveText("2026-00412")
        await expect(portaal.locator('[data-portaal-waarde="bedrag"]')).toHaveText(/967,93/)
        await expect(portaal.getByRole("link", { name: /Naar het betaalportaal/ })).toHaveAttribute(
            "href",
            "https://geldgarant.debtorportal.com/sign-in",
        )
        await portaal.getByRole("button", { name: "Gegevens aanpassen" }).click()
        await expect(page.locator("#b-dossier")).toBeFocused()
    })

    test("betalen: controleert dossiernummer en minimumbedrag", async ({ page }) => {
        await page.goto("/brief-ontvangen")
        await page.getByRole("button", { name: "Nu betalen" }).click()
        await expect(page.locator('[data-betaal] [data-fout="dossier"]')).toHaveText(/dossiernummer/)
        await expect(page.locator("#b-dossier")).toBeFocused()
        await page.fill("#b-dossier", "2026-00412")
        await page.fill("#b-bedrag", "3")
        await page.getByRole("button", { name: "Nu betalen" }).click()
        await expect(page.locator('[data-betaal] [data-fout="bedrag"]')).toHaveText(/vanaf € 5/)
        await expect(page.locator("[data-portaal]")).toBeHidden()
    })

    test("snelkeuze 'Ik heb al betaald' zet het formulier goed en verstuurt naar /api/contact", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/brief-ontvangen?dossier=2026-00412")
        await page.locator('.snel a[data-kies-reden="betaald"]').click()
        await expect(page.locator('input[name="reden"][value="betaald"]')).toBeChecked()
        await expect(page.locator("#r-betaaldop")).toBeVisible()
        await expect(page.locator("#r-maand")).toBeHidden()
        await expect(page.locator("#r-dossier")).toHaveValue("2026-00412")
        await page.getByRole("button", { name: "Versturen" }).click()
        await expect(page.locator('[data-reactie] [data-fout="betaald_op"]')).not.toBeEmpty()
        expect(verzoeken).toHaveLength(0)

        await page.fill("#r-betaaldop", "2026-11-03")
        await page.fill("#r-betaaldbedrag", "967,93")
        await page.fill("#r-naam", "J. de Vries")
        await page.fill("#r-email", "J@Voorbeeld.nl")
        await page.getByRole("button", { name: "Versturen" }).click()
        await expect(page.locator("[data-verzonden]")).toBeVisible()
        await expect(page.locator("[data-verzonden-ref]")).toHaveText("GG-CONT-2026-00042")
        expect(verzoeken).toHaveLength(1)
        const { url, headers, body } = verzoeken[0]
        expect(url).toBe("https://api.geldgarant.com/api/contact")
        expect(headers["x-request-nonce"]).toBe(body.nonce)
        expect(body.onderwerp).toEqual({ key: "bestaand_dossier", label: "Bestaand dossier" })
        const details = body.details as Record<string, string>
        expect(details.dossiernummer).toBe("2026-00412")
        expect(details.toelichting).toContain("Betaald op: 03-11-2026")
        expect((body.contact as Record<string, string>).bedrijfsnaam).toBe("J. de Vries")
    })

    test("rekenhulp: rekent mee en neemt het voorstel over in het formulier", async ({ page }) => {
        await page.goto("/brief-ontvangen")
        await page.fill("#r-open", "500")
        await page.fill("#r-per", "75")
        await expect(page.locator("[data-reken-uit]")).toContainText("7 maanden")
        await expect(page.locator("[data-reken-uit]")).toContainText("50,00")
        await page.getByRole("button", { name: "Neem dit voorstel over" }).click()
        await expect(page.locator('input[name="reden"][value="regeling"]')).toBeChecked()
        await expect(page.locator("#r-maand")).toHaveValue("75,00")
    })

    test("niet eens: toelichting is verplicht en het label past zich aan", async ({ page }) => {
        await page.goto("/brief-ontvangen?reden=oneens")
        await expect(page.locator('input[name="reden"][value="oneens"]')).toBeChecked()
        await expect(page.locator('label[for="r-toelichting"]')).toHaveText(/Waarom bent u het niet eens/)
        await page.getByRole("button", { name: "Versturen" }).click()
        await expect(page.locator('[data-reactie] [data-fout="toelichting"]')).toHaveText(/waarom/)
    })
})
