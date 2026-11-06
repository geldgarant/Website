import { defineConfig, devices } from "@playwright/test"

// Lokaal in de cloudwerkomgeving: CHROME_PATH=/usr/bin/google-chrome (geen browserdownload nodig).
// In CI: `npx playwright install --with-deps chromium` en CHROME_PATH leeg laten.
const executablePath = process.env.CHROME_PATH || undefined
const launchOptions = executablePath ? { executablePath, args: ["--no-sandbox"] } : {}

export default defineConfig({
    testDir: "tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: [["list"], ["html", { open: "never" }]],
    expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
    use: {
        reducedMotion: "reduce", // scroll-onthullingen uit: stabiele screenshots en axe-metingen
        baseURL: "http://localhost:4399",
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        launchOptions,
    },
    projects: [
        { name: "mobiel", use: { ...devices["iPhone 13"], browserName: "chromium", launchOptions } },
        { name: "tablet", use: { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true, launchOptions } },
        { name: "desktop", use: { viewport: { width: 1440, height: 900 }, launchOptions } },
    ],
    webServer: {
        command: "npm run build && npx astro preview --port 4399 --ignore-lock",
        url: "http://localhost:4399",
        reuseExistingServer: false, // altijd verse build testen
        timeout: 120_000,
    },
})
