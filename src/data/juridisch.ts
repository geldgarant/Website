// Juridische documenten. De pdf's staan in public/juridisch/ (aangeleverd door GeldGarant, 7 nov 2026), zodat ze ook na
// de verhuizing van Framer blijven werken. Per document een eigen pagina met preview, inhoudsopgave en pdf.
//
// Nieuwe versie van een document? Vervang de pdf in public/juridisch/ (zelfde bestandsnaam), maak een nieuwe preview
// (`pdftoppm -f 1 -l 1 -png -scale-to-x 600 -scale-to-y -1 <pdf> /tmp/p` en dan naar .webp), en werk hieronder
// `paginas`, `bijgewerkt` en `inhoud` bij. Paginanummers: `pdftotext -f N -l N -layout <pdf> -`.

export type DocSlug = "algemene-voorwaarden" | "privacy-beleid" | "cookie-beleid"

export interface JuridischDoc {
    slug: DocSlug
    naam: string // zoals in lopende tekst en links
    h1: [string, string] // [vóór het accent, accent]
    seoTitle: string
    description: string
    lead: string
    voor: string
    bestand: string // in public/juridisch/
    preview: string
    paginas: number
    bijgewerkt?: string // ISO-datum zoals vermeld in het document
    snel: readonly { label: string; pagina: number }[]
    inhoud: readonly { nr: string; titel: string; pagina: number }[]
}

export const juridisch: readonly JuridischDoc[] = [
    {
        slug: "algemene-voorwaarden",
        naam: "Algemene voorwaarden",
        h1: ["Algemene ", "voorwaarden"],
        seoTitle: "Algemene voorwaarden | GeldGarant incassobureau",
        description:
            "De algemene voorwaarden van GeldGarant: hoe we incasso-opdrachten uitvoeren, welke kosten gelden en hoe derdengelden werken. Online te lezen als pdf.",
        lead: "Hoe we incasso-opdrachten uitvoeren, welke kosten gelden, hoe we met derdengelden en uw gegevens omgaan en wat u als opdrachtgever van ons mag verwachten. Lees ze rustig door voordat u een vordering indient.",
        voor: "Voor opdrachtgevers",
        bestand: "algemene-voorwaarden.pdf",
        preview: "algemene-voorwaarden.webp",
        paginas: 8,
        snel: [
            { label: "Tarieven en vergoedingen", pagina: 3 },
            { label: "Stichting Derdengelden", pagina: 5 },
            { label: "Klachten", pagina: 8 },
        ],
        inhoud: [
            { nr: "1", titel: "Algemeen", pagina: 1 },
            { nr: "2", titel: "Definities", pagina: 1 },
            { nr: "3", titel: "Geheimhouding en persoonsgegevens", pagina: 2 },
            { nr: "4", titel: "Aanvaarding, aansprakelijkheid en intellectueel eigendom", pagina: 2 },
            { nr: "5", titel: "Incasso-opdrachten", pagina: 2 },
            { nr: "6", titel: "Verplichtingen opdrachtgever", pagina: 3 },
            { nr: "7", titel: "Tarieven en vergoedingsmodel", pagina: 3 },
            { nr: "8", titel: "Gerechtelijke procedures", pagina: 4 },
            { nr: "9", titel: "Stichting Derdengelden", pagina: 5 },
            { nr: "10", titel: "Faillissement en insolventie van de debiteur", pagina: 5 },
            { nr: "11", titel: "Debiteurenbeheer", pagina: 6 },
            { nr: "12", titel: "Betalingsverplichtingen", pagina: 6 },
            { nr: "13", titel: "Voorschotten", pagina: 7 },
            { nr: "14", titel: "Overmacht", pagina: 7 },
            { nr: "15", titel: "Ontbinding en opschorting", pagina: 7 },
            { nr: "16", titel: "Wijzigingsclausule", pagina: 8 },
            { nr: "17", titel: "Klachten", pagina: 8 },
            { nr: "18", titel: "Toepasselijk recht en geschillen", pagina: 8 },
        ],
    },
    {
        slug: "privacy-beleid",
        naam: "Privacyverklaring",
        h1: ["Privacy", "verklaring"],
        seoTitle: "Privacyverklaring | GeldGarant",
        description:
            "Welke persoonsgegevens GeldGarant verwerkt, waarom, hoe lang we ze bewaren en welke rechten u heeft. Lees onze privacyverklaring online of als pdf.",
        lead: "Welke persoonsgegevens we verwerken, waarom, hoe lang we ze bewaren en welke rechten u heeft. Voor opdrachtgevers, debiteuren en iedereen die onze website bezoekt.",
        voor: "Voor iedereen",
        bestand: "privacyverklaring.pdf",
        preview: "privacyverklaring.webp",
        paginas: 4,
        bijgewerkt: "2026-03-15",
        snel: [
            { label: "Bewaartermijnen", pagina: 2 },
            { label: "Delen met derden", pagina: 2 },
            { label: "Uw rechten", pagina: 3 },
        ],
        inhoud: [
            { nr: "1", titel: "Inleiding", pagina: 1 },
            { nr: "2", titel: "Contactgegevens", pagina: 1 },
            { nr: "3", titel: "Persoonsgegevens die wij verwerken", pagina: 1 },
            { nr: "4", titel: "Bijzondere en gevoelige persoonsgegevens", pagina: 1 },
            { nr: "5", titel: "Doel en grondslag van de verwerking", pagina: 1 },
            { nr: "6", titel: "Geautomatiseerde besluitvorming", pagina: 2 },
            { nr: "7", titel: "Bewaartermijnen", pagina: 2 },
            { nr: "8", titel: "Delen van persoonsgegevens met derden", pagina: 2 },
            { nr: "9", titel: "Cookies en vergelijkbare technieken", pagina: 2 },
            { nr: "10", titel: "Beveiliging van persoonsgegevens", pagina: 3 },
            { nr: "11", titel: "Uw rechten als betrokkene", pagina: 3 },
            { nr: "12", titel: "Wijzigingen in deze privacyverklaring", pagina: 3 },
            { nr: "13", titel: "Contact", pagina: 3 },
        ],
    },
    {
        slug: "cookie-beleid",
        naam: "Cookieverklaring",
        h1: ["Cookie", "verklaring"],
        seoTitle: "Cookieverklaring | GeldGarant",
        description:
            "Welke cookies en vergelijkbare technieken de website van GeldGarant gebruikt, waarvoor, hoe lang ze bewaard blijven en hoe u uw voorkeuren beheert.",
        lead: "Welke cookies en vergelijkbare technieken onze website gebruikt, waarvoor, hoe lang ze bewaard blijven en hoe u uw voorkeuren zelf beheert.",
        voor: "Voor websitebezoekers",
        bestand: "cookieverklaring.pdf",
        preview: "cookieverklaring.webp",
        paginas: 3,
        bijgewerkt: "2026-03-30",
        snel: [
            { label: "Welke cookies", pagina: 1 },
            { label: "Bewaartermijnen", pagina: 2 },
            { label: "Cookies beheren", pagina: 2 },
        ],
        inhoud: [
            { nr: "1", titel: "Inleiding", pagina: 1 },
            { nr: "2", titel: "Wat zijn cookies?", pagina: 1 },
            { nr: "3", titel: "Toestemming", pagina: 1 },
            { nr: "4", titel: "Welke cookies gebruiken wij?", pagina: 1 },
            { nr: "5", titel: "Cookies van derden", pagina: 2 },
            { nr: "6", titel: "Bewaartermijnen", pagina: 2 },
            { nr: "7", titel: "Cookies beheren en verwijderen", pagina: 2 },
            { nr: "8", titel: "Uw rechten", pagina: 2 },
            { nr: "9", titel: "Nieuwe ontwikkelingen en onvoorziene cookies", pagina: 3 },
            { nr: "10", titel: "Contact", pagina: 3 },
        ],
    },
]

export const pdfHref = (d: JuridischDoc, pagina?: number) => `/juridisch/${d.bestand}${pagina ? `#page=${pagina}` : ""}`
