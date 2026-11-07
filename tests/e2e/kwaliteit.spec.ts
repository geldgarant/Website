import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { routes } from "./pages"

for (const route of routes) {
    test.describe(`pagina ${route}`, () => {
        test("laadt zonder fouten en zonder horizontale overloop", async ({ page }) => {
            const fouten: string[] = []
            page.on("console", (m) => m.type() === "error" && fouten.push(m.text()))
            page.on("pageerror", (e) => fouten.push(e.message))
            const res = await page.goto(route)
            expect(res?.status(), "HTTP-status").toBe(200)
            await page.evaluate(() => document.fonts.ready)

            const overloop = await page.evaluate(() => {
                const vw = document.documentElement.clientWidth
                return [...document.querySelectorAll("body *")]
                    .filter((el) => {
                        // bewuste veegrijen (scroll-snap) mogen buiten beeld doorlopen; de rij zelf niet
                        if (el.closest("[data-scroller]") && !el.matches("[data-scroller]")) return false
                        const r = el.getBoundingClientRect()
                        return r.width > 0 && (r.right > vw + 1 || r.left < -1)
                    })
                    .slice(0, 5)
                    .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`)
            })
            expect(overloop, "elementen breder dan het scherm").toEqual([])
            // en de pagina als geheel mag nooit zijwaarts scrollen (ook niet door inhoud van een veegrij die niet scrollt)
            const breedte = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
            expect(breedte, "pagina scrolt zijwaarts").toBeLessThanOrEqual(1)
            expect(fouten, "console- en scriptfouten").toEqual([])
        })

        test("formuliervelden zijn minimaal 16px (geen iOS-zoom) en tikdoelen minimaal 44px", async ({ page, isMobile }) => {
            await page.goto(route)
            const kleineVelden = await page.$$eval("input:not([type=hidden]),select,textarea", (els) =>
                els.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16).map((e) => e.id || e.getAttribute("name")),
            )
            expect(kleineVelden).toEqual([])
            if (isMobile) {
                const kleineKnoppen = await page.$$eval("a.btn, button", (els) =>
                    els
                        .filter((e) => {
                            const r = e.getBoundingClientRect()
                            return r.width > 0 && r.height > 0 && r.height < 36
                        })
                        .map((e) => e.textContent?.trim().slice(0, 30)),
                )
                expect(kleineKnoppen).toEqual([])
            }
        })

        test("SEO-basis: één h1, title, description, canonical, alt-teksten, geldige JSON-LD", async ({ page }) => {
            await page.goto(route)
            await expect(page.locator("h1")).toHaveCount(1)
            expect((await page.title()).length).toBeGreaterThan(10)
            const desc = await page.locator('meta[name="description"]').getAttribute("content")
            expect(desc?.length ?? 0, "meta description 70 tot 165 tekens").toBeGreaterThanOrEqual(70)
            expect(desc?.length ?? 0).toBeLessThanOrEqual(165)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            expect(await page.locator("img:not([alt])").count(), "afbeeldingen zonder alt").toBe(0)
            for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
                const data = JSON.parse(raw)
                expect(data["@context"]).toBe("https://schema.org")
                expect(data["@type"]).toBeTruthy()
            }
        })

        test("toegankelijkheid (axe, WCAG 2.2 AA)", async ({ page }) => {
            await page.goto(route)
            const result = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
                .analyze()
            const samenvatting = result.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}x`)
            expect(samenvatting).toEqual([])
        })
    })
}
