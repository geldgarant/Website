// Alle bedrijfsgegevens op één plek. Nieuw telefoonnummer? Alleen hier aanpassen.
export const site = {
    name: "GeldGarant",
    phone: "085\u00a0212\u00a073\u00a088", // vaste spaties: nummer breekt nooit af
    phoneHref: "tel:+31852127388",
    phoneIntl: "+31852127388", // voor JSON-LD
    whatsappHref: "https://wa.me/31852127388",
    // Profielen van GeldGarant elders (JSON-LD sameAs). Alleen bevestigde profielen: LinkedIn staat in het eigen
    // Google Bedrijfsprofiel (8 nov 2026). Instagram pas toevoegen na bevestiging dat het account van GeldGarant is.
    sameAs: ["https://www.linkedin.com/company/geldgarant/"] as string[],
    // Cloudflare Web Analytics (cookieloos), handmatige installatie sinds 8 nov 2026. Het token is publiek (staat in de
    // HTML). Het script laadt alleen op geldgarant.com zelf (zie Base.astro). null = meting uit.
    cfBeaconToken: "43a6812452f9495d84df429b599e52c2" as string | null,
    email: "info@geldgarant.com",
    klachtenEmail: "klachten@geldgarant.com",
    street: "Keulenstraat 1",
    postcode: "7418 ET",
    city: "Deventer",
    hours: "werkdagen van 9.00 tot 17.00",
    incassoRegister: "00273",
    // rechtstreeks naar de inschrijving van GeldGarant in het register van Justis (nagelopen 7 nov 2026)
    incassoRegisterHref: "https://www.justis.nl/registers/incassoregister/geldgarant",
    // het hele register, om zelf te zoeken
    incassoRegisterOverzichtHref: "https://www.justis.nl/registers/register-incassodienstverlening",
    // debiteurenpagina "Brief ontvangen?" (header, footer, hulppagina)
    briefHref: "/brief-ontvangen",
    // btw bewust leeg: btw-id niet tonen op de site (keuze GeldGarant, 7 nov 2026; wettelijk wel verplicht, is gemeld)
    kvk: "90622375" as string | null,
    btw: null as string | null,
    portalLogin: "https://geldgarant.dossierportal.nl",
    debtorPortal: "https://geldgarant.debtorportal.com",
    // Debiteurenportaal van CaseControl (niet meer nodig om te betalen; blijft als reserve, zie docs/HANDOFF.md §6b)
    debtorPortalBetalen: "https://geldgarant.debtorportal.com/sign-in",
    // Direct betalen op /brief-ontvangen: onze eigen worker (worker/betalen.ts) vraagt bij CaseControl een
    // iDEAL-betaallink op met dossiernummer + bedrag en stuurt de bezoeker meteen door. null = online betalen uit.
    betaalLinkApi: "/api/betalen" as string | null,
    // Derdengeldenrekening (bevestigd door GeldGarant, 7 nov 2026). Kenmerk bij overmaken = dossiernummer.
    derdengelden: {
        iban: "NL57 BUNQ 2188 2124 36" as string | null,
        tenaamstelling: "Stichting Beheer Derdengelden GeldGarant" as string | null,
        bic: "BUNQNL2AXXX",
    },
    // Online betalen gaat via iDEAL (bevestigd 7 nov 2026)
    betaalMethode: "iDEAL",
    // Afzender van e-mails over dossiers (CaseControl-mailbox), genoemd bij "Is deze brief echt?"
    dossierMail: "info@dossiers.geldgarant.com",
    // Formaat van een dossiernummer in CaseControl: jaar-volgnummer (zoals 26-1008). Dit voorbeeld is fictief.
    dossierVoorbeeld: "26-0412",
}

export const nav = [
    { label: "Incasso", href: "/incasso" },
    { label: "Debiteurenbeheer", href: "/debiteurenbeheer" },
    { label: "Tarieven", href: "/tarieven" },
    { label: "Branches", href: "/branches" },
    { label: "Kennisbank", href: "/kennisbank" },
    { label: "Over ons", href: "/over-ons" },
]

// Slugs gelijk aan de huidige site, zodat bestaande URL's blijven werken
export const branches = [
    { label: "Bouw en installatie", slug: "incasso-bouw" },
    { label: "Transport en logistiek", slug: "incasso-transport" },
    { label: "Verhuur", slug: "incasso-verhuur" },
    { label: "Automotive", slug: "incasso-automotive" },
    { label: "Groothandel", slug: "incasso-groothandel" },
    { label: "Dienstverlening", slug: "incasso-dienstverlening" },
    { label: "Webshops", slug: "incasso-ecommerce" },
    { label: "Zorg", slug: "incasso-zorg" },
    { label: "MKB", slug: "incasso-mkb" },
    { label: "Zzp", slug: "incasso-zzp" },
]
