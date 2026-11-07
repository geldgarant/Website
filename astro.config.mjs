import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
    site: "https://geldgarant.com",
    // Zonder slash aan het eind, gelijk aan de Framer-URL's die al bij Google bekend zijn (SEO-behoud)
    trailingSlash: "never",
    build: { format: "directory" },
    // noindex-pagina's (404, terugkeer na betaling) horen niet in de sitemap
    integrations: [sitemap({ filter: (page) => !/\/404|\/brief-ontvangen\/(bedankt|mislukt)/.test(page) })],
})
