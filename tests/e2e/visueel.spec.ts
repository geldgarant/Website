import { test, expect } from "@playwright/test"
import { routes } from "./pages"

// Visuele regressie. Eerste keer of na een bewuste ontwerpwijziging:
//   npm run test:visual -- --update-snapshots
// Baselines zijn per besturingssysteem; maak ze in dezelfde omgeving als waar ze vergeleken worden (CI = Linux).
test.describe("@visueel", () => {
    for (const route of routes) {
        test(`schermafbeelding ${route}`, async ({ page }) => {
            await page.goto(route)
            await page.evaluate(() => document.fonts.ready)
            await expect(page).toHaveScreenshot({ fullPage: true })
        })
    }
})
