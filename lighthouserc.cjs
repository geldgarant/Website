// Lighthouse CI op de gebouwde site (dist). Lokaal: CHROME_PATH=/usr/bin/google-chrome npm run lhci
module.exports = {
    ci: {
        collect: {
            staticDistDir: "./dist",
            numberOfRuns: 3,
            settings: {
                chromeFlags: "--no-sandbox --headless=new",
                // standaard = mobiel met netwerk- en CPU-vertraging, zoals PageSpeed Insights
            },
        },
        assert: {
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
        upload: { target: "filesystem", outputDir: "./.lighthouseci" },
    },
}
