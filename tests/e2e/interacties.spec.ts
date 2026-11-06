import { test, expect } from "@playwright/test"

test.describe("homepage interacties", () => {
    test("mobiel menu opent, sluit met knop en Escape", async ({ page, isMobile }) => {
        test.skip(!isMobile, "alleen mobiel")
        await page.goto("/")
        const knop = page.locator("[data-menu-toggle]")
        const menu = page.locator("[data-menu]")
        await expect(menu).toBeHidden()
        await knop.click()
        await expect(menu).toBeVisible()
        await expect(knop).toHaveAttribute("aria-expanded", "true")
        await page.keyboard.press("Escape")
        await expect(menu).toBeHidden()
        await knop.click()
        await knop.click()
        await expect(menu).toBeHidden()
    })

    test("afrekening rekent volgens de WIK-staffel", async ({ page }) => {
        await page.goto("/")
        const veld = page.locator("[data-bedrag]")
        const kosten = page.locator('[data-out="kosten"]')
        await veld.fill("1234,50")
        await expect(kosten).toHaveText("€ 185,18")
        await veld.fill("10.000")
        await expect(kosten).toHaveText("€ 875,00")
        await veld.fill("100")
        await expect(kosten).toHaveText("€ 40,00")
        await page.locator('[data-preset="2500"]').click()
        await expect(kosten).toHaveText("€ 375,00")
        await expect(page.locator('[data-out="ontvangt"]')).toHaveText("€ 2.500,00")
    })

    test("FAQ is met het toetsenbord te openen en antwoorden staan in de HTML", async ({ page }) => {
        await page.goto("/")
        const eerste = page.locator(".faq-item").first()
        await expect(eerste.locator("p")).toHaveCount(1)
        await eerste.locator("summary").focus()
        await page.keyboard.press("Enter")
        await expect(eerste).toHaveAttribute("open", "")
    })

    test("telefoonlinks wijzen naar het juiste nummer", async ({ page }) => {
        await page.goto("/")
        const hrefs = await page.$$eval('a[href^="tel:"]', (as) => [...new Set(as.map((a) => a.getAttribute("href")))])
        expect(hrefs).toEqual(["tel:+31852127914"])
    })

    test("voorbeelddossier: stappen zijn met muis en pijltjestoetsen te kiezen", async ({ page }) => {
        await page.goto("/")
        const proces = page.locator("[data-proces]")
        await proces.locator('[role="tab"]').nth(4).click()
        await expect(proces).toHaveAttribute("data-active", "4")
        await expect(page.locator("#stap-panel-4")).toBeVisible()
        await expect(page.locator("#stap-panel-0")).toBeHidden()
        await page.keyboard.press("ArrowRight")
        await expect(proces).toHaveAttribute("data-active", "0")
        await expect(proces.locator('[role="tab"]').nth(0)).toBeFocused()
    })

    test("kosten-scenario's tonen per keuze de juiste uitkomst", async ({ page }) => {
        await page.goto("/")
        await expect(page.locator('[data-scenario="volledig"]')).toBeVisible()
        await page.locator('input[value="niets"]').check({ force: true })
        await expect(page.locator('[data-scenario="niets"]')).toBeVisible()
        await expect(page.locator('[data-scenario="volledig"]')).toBeHidden()
    })
})

test.describe("hoe werkt het", () => {
    test("situatie-kiezer toont per keuze één uitkomst", async ({ page }) => {
        await page.goto("/hoe-werkt-het")
        await expect(page.locator('[data-situatie="betaalt"]')).toBeVisible()
        await page.locator('input[name="situatie"][value="failliet"]').check({ force: true })
        await expect(page.locator('[data-situatie="failliet"]')).toBeVisible()
        await expect(page.locator('[data-situatie="betaalt"]')).toBeHidden()
        await expect(page.locator(".outcome:visible")).toHaveCount(1)
    })

    test("overzicht in de hero springt naar de stap", async ({ page }) => {
        await page.goto("/hoe-werkt-het")
        await page.locator('.overzicht a[href="#stap-5"]').click()
        await expect(page).toHaveURL(/#stap-5$/)
        await expect(page.locator("#stap-5")).toBeInViewport()
    })
})

test.describe("geen persoonsnamen op de site", () => {
    for (const route of ["/", "/over-ons", "/contact-opnemen", "/hoe-werkt-het"]) {
        test(`${route} noemt geen namen en geen callcenter`, async ({ page }) => {
            await page.goto(route)
            const tekst = (await page.locator("main, body").first().innerText()).toLowerCase()
            for (const woord of ["anas", "ilyas", "callcenter", "keuzemenu"]) expect(tekst).not.toContain(woord)
        })
    }
})

test.describe("incassokosten berekenen", () => {
    test("rekent staffel en handelsrente, en geen kosten bij een particulier zonder 14-dagenbrief", async ({ page }) => {
        await page.goto("/incasso/incassokosten-berekenen")
        await page.fill("#r-bedrag", "2500")
        await page.fill("#r-verval", "2026-01-15")
        await page.fill("#r-tot", "2026-11-06")
        const uit = (k: string) => page.locator(`[data-uit="${k}"]`)
        await expect(uit("kosten")).toHaveText("€ 375,00")
        await expect(uit("rente")).toHaveText("€ 207,29") // 166 dagen à 10,15% + 129 dagen à 10,4%
        await expect(uit("totaal")).toHaveText("€ 3.082,29")

        await page.locator('input[name="soort"][value="consument"]').check({ force: true })
        await expect(uit("kosten")).toHaveText("€ 0,00")
        await expect(uit("noot")).toBeVisible()
        await page.locator('input[name="brief"]').check()
        await expect(uit("kosten")).toHaveText("€ 375,00")

        await page.locator('input[name="btw"]').check()
        await expect(uit("btw")).toHaveText("€ 78,75")
    })
})
