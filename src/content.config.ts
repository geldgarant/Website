// Contentcollecties. Kennisbank: één Markdown-bestand per artikel in src/content/kennisbank/<slug>.md.
// De bestandsnaam is de slug en dus de URL (/kennisbank/<slug>); die gelijk houden aan de oude Framer-URL's.
import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { ONDERWERP_IDS } from "./data/kennisbank"

const kennisbank = defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/kennisbank" }),
    schema: z.object({
        // h1 op de pagina
        title: z.string(),
        // <title>: 50 tot 65 tekens, eindigt op "| GeldGarant"
        seoTitle: z.string().max(70),
        // meta description: 120 tot 160 tekens
        description: z.string().min(110).max(165),
        onderwerp: z.enum(ONDERWERP_IDS),
        // korte intro onder de h1, ook gebruikt op de kaartjes
        lead: z.string(),
        // "In het kort": drie tot vijf zinnen die samen het antwoord geven
        kort: z.array(z.string()).min(3).max(6),
        gepubliceerd: z.coerce.date(),
        bijgewerkt: z.coerce.date(),
        faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
        bronnen: z.array(z.object({ t: z.string(), href: z.url() })).min(1),
        verwant: z.array(z.string()).min(2).max(4),
        // optioneel: rekenhulp of dienstpagina die bij dit artikel hoort
        hulp: z.object({ t: z.string(), d: z.string(), href: z.string() }).optional(),
        uitgelicht: z.boolean().default(false),
    }),
})

// Juridische documenten: AV, privacy- en cookieverklaring. Bestandsnaam = slug onder /juridisch/ (oude Framer-URL's).
// Bedrijfsgegevens staan als plaatshouder in de tekst ({{telefoon}}, {{adres}}, ...) en komen bij de build uit
// src/data/site.ts; de WIK-staffel ({{wikStaffel}}) uit src/lib/wik.ts. Zie src/lib/juridisch.ts.
const juridisch = defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/juridisch" }),
    schema: z.object({
        naam: z.string(),
        // h1 als [vóór het accent, accent]; eindigt het eerste deel op een spatie, dan komt het accent op een nieuwe regel
        h1: z.tuple([z.string(), z.string()]),
        seoTitle: z.string().max(70),
        description: z.string().min(110).max(165),
        lead: z.string(),
        voor: z.string(),
        // pdf in public/juridisch/, gemaakt met `node scripts/juridisch-pdf.mjs`
        bestand: z.string().regex(/^[a-z-]+\.pdf$/),
        versie: z.coerce.date(),
        kort: z.array(z.string()).min(3).max(6),
    }),
})

export const collections = { kennisbank, juridisch }
