// Alle bedrijfsgegevens op één plek. Nieuw telefoonnummer? Alleen hier aanpassen.
export const site = {
    name: "GeldGarant",
    phone: "085\u00a0212\u00a073\u00a088", // vaste spaties: nummer breekt nooit af
    phoneHref: "tel:+31852127388",
    phoneIntl: "+31852127388", // voor JSON-LD
    whatsappHref: "https://wa.me/31852127388",
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
    // debiteurenpagina "Brief ontvangen?" komt later (CaseControl); tot die tijd naar het briefblok op de hulppagina
    briefHref: "/hulp-nodig-bij-geldproblemen#brief",
    // btw bewust leeg: btw-id niet tonen op de site (keuze GeldGarant, 7 nov 2026; wettelijk wel verplicht, is gemeld)
    kvk: "90622375" as string | null,
    btw: null as string | null,
    portalLogin: "https://geldgarant.dossierportal.nl",
    debtorPortal: "https://geldgarant.debtorportal.com",
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
