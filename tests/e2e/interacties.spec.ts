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
    for (const route of [
        "/",
        "/over-ons",
        "/contact-opnemen",
        "/hoe-werkt-het",
        "/kennisbank",
        "/werken-bij",
        "/werken-bij/call-center-medewerker",
        "/hulp-nodig-bij-geldproblemen",
    ]) {
        test(`${route} noemt geen namen en geen callcenter`, async ({ page }) => {
            await page.goto(route)
            const tekst = (await page.locator("main, body").first().innerText()).toLowerCase()
            for (const woord of ["anas", "ilyas", "callcenter", "call center", "keuzemenu"]) expect(tekst).not.toContain(woord)
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

test.describe("14-dagenbrief", () => {
    test("termijnrekenaar telt vanaf de dag na ontvangst", async ({ page }) => {
        await page.goto("/incasso/wik-brief")
        await page.fill("#t-datum", "2026-11-02")
        await page.locator('input[name="via"][value="email"]').check({ force: true })
        await expect(page.locator('[data-t="kosten"]')).toContainText("17 nov")
        await page.locator('input[name="via"][value="post"]').check({ force: true })
        await expect(page.locator('[data-t="ontvangen"]')).toContainText("4 nov")
        await expect(page.locator('[data-t="kosten"]')).toContainText("19 nov")
    })
})

test.describe("kennisbank", () => {
    test("zoeken filtert artikelen en toont een melding zonder resultaat", async ({ page }) => {
        await page.goto("/kennisbank")
        const zichtbaar = page.locator("[data-kaart]:visible")
        const totaal = await zichtbaar.count()
        expect(totaal).toBe(27)
        await page.fill("#kb-zoek", "verjaring")
        await expect(page.locator("[data-zoek-status]")).toContainText("gevonden")
        expect(await zichtbaar.count()).toBeLessThan(totaal)
        await expect(page.locator("[data-kaart]:visible").first()).toBeVisible()
        await page.fill("#kb-zoek", "xyzonzin")
        await expect(page.locator("[data-leeg]")).toBeVisible()
        await page.fill("#kb-zoek", "")
        expect(await zichtbaar.count()).toBe(totaal)
    })

    test("onderwerpknoppen springen naar het blok", async ({ page }) => {
        await page.goto("/kennisbank")
        await page.locator('.onderwerpen a[href="#rechter"]').click()
        await expect(page).toHaveURL(/#rechter$/)
        await expect(page.locator("#rechter-title")).toBeInViewport()
    })

    test("inhoudsopgave linkt naar elk kopje en markeert het actieve onderdeel", async ({ page, isMobile }) => {
        await page.goto("/kennisbank/verjaringstermijnen-vorderingen")
        const links = page.locator(isMobile ? ".toc-mob [data-toc]" : ".toc [data-toc]")
        const n = await links.count()
        expect(n).toBeGreaterThan(3)
        for (let i = 0; i < n; i++) {
            const id = await links.nth(i).getAttribute("data-toc")
            await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
        }
        if (isMobile) await page.locator(".toc-mob summary").click()
        await links.nth(2).click()
        const id = await links.nth(2).getAttribute("data-toc")
        await expect(page.locator(`[id="${id}"]`)).toBeInViewport()
        if (!isMobile) await expect(links.nth(2)).toHaveAttribute("aria-current", "true")
    })

    test("veelgestelde vragen komt net onder de header uit", async ({ page, isMobile }) => {
        await page.goto("/kennisbank/betalingsregeling-treffen")
        if (isMobile) await page.locator(".toc-mob summary").click()
        await page.locator(`${isMobile ? ".toc-mob" : ".toc"} a[href="#vragen"]`).click()
        const eyebrow = page.locator("#vragen .eyebrow")
        await expect(eyebrow).toBeInViewport()
        const kop = await page.locator(".bar").boundingBox()
        const box = await eyebrow.boundingBox()
        expect(box!.y).toBeGreaterThanOrEqual(kop!.y + kop!.height)
        expect(box!.y).toBeLessThan(kop!.y + kop!.height + 80)
    })

    test("zijbalk past altijd in het scherm en scrollt nooit zelf", async ({ page, isMobile }) => {
        test.skip(isMobile, "zijbalk alleen op desktop")
        for (const [w, h] of [
            [1440, 900],
            [1280, 720],
            [1080, 650],
        ]) {
            await page.setViewportSize({ width: w, height: h })
            await page.goto("/kennisbank/openstaande-factuur-stappenplan")
            await page.evaluate(() => document.fonts.ready)
            const r = await page.evaluate(() => {
                const a = document.querySelector<HTMLElement>("[data-aside]")!
                const s = getComputedStyle(a)
                return {
                    los: a.classList.contains("is-los"),
                    h: a.scrollHeight,
                    ruimte: innerHeight - parseFloat(s.top),
                    overflow: s.overflowY,
                }
            })
            expect(r.overflow).toBe("visible")
            if (!r.los) expect(r.h).toBeLessThanOrEqual(r.ruimte)
        }
    })
})

test.describe("werken bij", () => {
    test("overzicht toont drie vacatures die naar de oude slugs linken", async ({ page }) => {
        await page.goto("/werken-bij")
        for (const slug of ["incasso-medewerker", "call-center-medewerker", "stage"])
            await expect(page.locator(`#vacatures a[href="/werken-bij/${slug}"]`)).toHaveCount(1)
    })
    test("vacature heeft JobPosting en een sollicitatielink", async ({ page }) => {
        await page.goto("/werken-bij/incasso-medewerker")
        const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
        expect(ld.join(" ")).toContain('"JobPosting"')
        await expect(page.locator('a[href^="mailto:"][href*="Sollicitatie"]').first()).toBeVisible()
    })
})

test.describe("hulp bij geldproblemen", () => {
    test("situatiekiezer toont per keuze het juiste advies", async ({ page }) => {
        await page.goto("/hulp-nodig-bij-geldproblemen")
        await expect(page.locator('[data-p="brief"]')).toBeVisible()
        await expect(page.locator('[data-p="ondernemer"]')).toBeHidden()
        await page.locator('input[value="ondernemer"]').check()
        await expect(page.locator('[data-p="ondernemer"]')).toBeVisible()
        await expect(page.locator('[data-p="brief"]')).toBeHidden()
    })
})
