// Lighthouse CI op de gebouwde site (dist). Lokaal: CHROME_PATH=/usr/bin/google-chrome npm run lhci
module.exports = {
    ci: {
        collect: {
            staticDistDir: "./dist",
            // standaard pakt lhci maar 5 pagina's; 0 = alle pagina's in dist
            maxAutodiscoverUrls: 0,
            numberOfRuns: 3,
            settings: {
                chromeFlags: "--no-sandbox --headless=new",
                // standaard = mobiel met netwerk- en CPU-vertraging, zoals PageSpeed Insights
            },
        },
        assert: {
            // 404.html staat bewust op noindex (SEO-score zakt dan per definitie); alle andere pagina's moeten 95+ halen
            assertMatrix: [
                {
                    matchingUrlPattern: "^(?!.*/404\\.html).*$",
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
