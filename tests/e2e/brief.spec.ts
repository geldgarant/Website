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
    test("betalen: voorinvullen uit de link en direct door naar iDEAL", async ({ page }) => {
        const verzoeken: Record<string, unknown>[] = []
        await page.route("**/api/betalen", async (route) => {
            verzoeken.push(JSON.parse(route.request().postData() ?? "{}"))
            await route.fulfill({
                contentType: "application/json",
                body: JSON.stringify({ ok: true, url: "https://ideal.test/betaal/abc" }),
            })
        })
        await page.route("https://ideal.test/**", (route) =>
            route.fulfill({ contentType: "text/html", body: "<title>iDEAL</title>" }),
        )
        await page.goto("/brief-ontvangen?dossier=26-1008&bedrag=967,93")
        await expect(page.locator("#b-dossier")).toHaveValue("26-1008")
        await expect(page.locator("#b-bedrag")).toHaveValue("967,93")
        await page.getByRole("button", { name: "Betalen met iDEAL" }).click()
        await page.waitForURL("https://ideal.test/betaal/abc")
        expect(verzoeken).toEqual([{ dossiernummer: "26-1008", bedrag: 967.93 }])
    })

    test("betalen: onbekend dossiernummer en storing worden netjes opgevangen", async ({ page }) => {
        let antwoord = { status: 404, body: { ok: false, error: "niet-gevonden" } }
        await page.route("**/api/betalen", (route) =>
            route.fulfill({ status: antwoord.status, contentType: "application/json", body: JSON.stringify(antwoord.body) }),
        )
        await page.goto("/brief-ontvangen?dossier=26-9999&bedrag=50")
        const knop = page.getByRole("button", { name: "Betalen met iDEAL" })
        await knop.click()
        await expect(page.locator("[data-betaal-melding]")).toHaveText(/26-9999 niet/)
        await expect(page.locator("#b-dossier")).toBeFocused()

        antwoord = { status: 502, body: { ok: false, error: "onbereikbaar" } }
        await knop.click()
        const alt = page.locator("[data-betaal-alt]")
        await expect(alt).toBeVisible()
        await expect(alt).toContainText("NL57 BUNQ 2188 2124 36")
        await expect(alt.locator('[data-alt-waarde="dossier"]')).toHaveText("26-9999")
        await alt.getByRole("button", { name: "Opnieuw proberen" }).click()
        await expect(knop).toBeFocused()
    })

    test("betalen: controleert dossiernummer en minimumbedrag", async ({ page }) => {
        let geroepen = false
        await page.route("**/api/betalen", (route) => {
            geroepen = true
            return route.abort()
        })
        await page.goto("/brief-ontvangen")
        await page.getByRole("button", { name: "Betalen met iDEAL" }).click()
        await expect(page.locator('[data-betaal] [data-fout="dossier"]')).toHaveText(/dossiernummer/)
        await expect(page.locator("#b-dossier")).toBeFocused()
        await page.fill("#b-dossier", "26-1008")
        await page.fill("#b-bedrag", "3")
        await page.getByRole("button", { name: "Betalen met iDEAL" }).click()
        await expect(page.locator('[data-betaal] [data-fout="bedrag"]')).toHaveText(/vanaf € 5/)
        expect(geroepen).toBe(false)
    })

    test("snelkeuze 'Ik heb al betaald' zet het formulier goed en verstuurt naar /api/contact", async ({ page }) => {
        const verzoeken = await mockApi(page)
        await page.goto("/brief-ontvangen?dossier=26-1008")
        await page.locator('.snel a[data-kies-reden="betaald"]').click()
        await expect(page.locator('input[name="reden"][value="betaald"]')).toBeChecked()
        await expect(page.locator("#r-betaaldop")).toBeVisible()
        await expect(page.locator("#r-maand")).toBeHidden()
        await expect(page.locator("#r-dossier")).toHaveValue("26-1008")
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
        expect(details.dossiernummer).toBe("26-1008")
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
