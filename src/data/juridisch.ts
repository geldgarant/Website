// Juridische documenten: volgorde en pdf-gegevens. De tekst zelf staat in src/content/juridisch/<slug>.md.
// De pdf's in public/juridisch/ en hun previews maakt `node scripts/juridisch-pdf.mjs` uit de HTML-pagina's
// (draai dat na elke tekstwijziging; het script werkt ook juridisch-pdf.ts bij).
import { PDF } from "./juridisch-pdf"

export type DocSlug = "algemene-voorwaarden" | "privacy-beleid" | "cookie-beleid"
export const VOLGORDE: readonly DocSlug[] = ["algemene-voorwaarden", "privacy-beleid", "cookie-beleid"]

export interface PdfInfo {
    bestand: string
    preview: string
    paginas: number
    kb: number
}
export const pdfInfo = (slug: DocSlug): PdfInfo => PDF[slug]
