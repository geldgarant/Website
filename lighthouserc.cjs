// Lighthouse CI op de gebouwde site (dist). Lokaal: CHROME_PATH=/usr/bin/google-chrome npm run lhci
// Lokaal (zonder CI): alle pagina's, 3 runs (± 40 tot 70 min). In GitHub Actions (CI=true): één pagina per sjabloon,
// 2 runs, zodat de job binnen de tijdslimiet blijft (alle pagina's x 3 runs duurde langer dan 60 min, nov 2026).
const steekproef = [
    "/",
    "/incasso/",
    "/incasso/incassobureau-inschakelen/",
    "/incasso/wik-brief/",
    "/debiteurenbeheer/",
    "/tarieven/",
    "/vordering-indienen/",
    "/contact-opnemen/",
    "/brief-ontvangen/",
    "/branches/incasso-verhuur/",
    "/kennisbank/",
    "/kennisbank/openstaande-factuur-stappenplan/",
    "/voorbeeldbrieven/",
    "/voorbeeldbrieven/aanmaning/",
    "/juridisch/algemene-voorwaarden/",
    "/hulp-nodig-bij-geldproblemen/",
]
const inCi = Boolean(process.env.CI)

module.exports = {
    ci: {
        collect: {
            staticDistDir: "./dist",
            // standaard pakt lhci maar 5 pagina's; 0 = alle pagina's in dist. In CI: vaste steekproef (lhci herschrijft
            // http://localhost naar de poort van zijn eigen statische server)
            ...(inCi ? { url: steekproef.map((p) => `http://localhost${p}`) } : { maxAutodiscoverUrls: 0 }),
            numberOfRuns: inCi ? 2 : 3,
            settings: {
                chromeFlags: "--no-sandbox --headless=new",
                // standaard = mobiel met netwerk- en CPU-vertraging, zoals PageSpeed Insights
            },
        },
        assert: {
            // 404.html en de terugkeerpagina's na betaling staan bewust op noindex (SEO-score zakt dan per definitie);
            // alle andere pagina's moeten 95+ halen
            assertMatrix: [
                {
                    matchingUrlPattern: "^(?!.*(/404\\.html|/brief-ontvangen/(bedankt|mislukt))).*$",
                    assertions: {
                        "categories:performance": ["error", { minScore: 0.95 }],
                        "categories:accessibility": ["error", { minScore: 0.95 }],
                        "categories:best-practices": ["error", { minScore: 0.95 }],
                        "categories:seo": ["error", { minScore: 0.95 }],
                        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
                        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
                        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
                    },
                },
            ],
        },
        upload: { target: "filesystem", outputDir: "./.lighthouseci" },
    },
}
