import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
    site: "https://geldgarant.com",
    // Zonder slash aan het eind, gelijk aan de Framer-URL's die al bij Google bekend zijn (SEO-behoud)
    trailingSlash: "never",
    build: { format: "directory" },
    integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
})
