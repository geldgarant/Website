// Alle bedrijfsgegevens op één plek. Nieuw telefoonnummer? Alleen hier aanpassen.
export const site = {
    name: "GeldGarant",
    phone: "085\u00a0212\u00a079\u00a014", // vaste spaties: nummer breekt nooit af
    phoneHref: "tel:+31852127914",
    whatsappHref: "https://wa.me/31852127914",
    email: "info@geldgarant.com",
    street: "Keulenstraat 1",
    postcode: "7418 ET",
    city: "Deventer",
    hours: "werkdagen van 9.00 tot 17.00",
    incassoRegister: "00273",
    incassoRegisterHref: "https://www.justis.nl/registers/incassodienstverlening",
    // TODO: aanleveren door GeldGarant
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

export const latestArticles = [
    {
        title: "BV uitgeschreven met schulden: uw rechten als schuldeiser",
        slug: "bv-uitgeschreven-schulden",
        date: "2026-03-25",
        cat: "Juridisch",
    },
    {
        title: "Huurachterstand incasseren als verhuurder: stap voor stap",
        slug: "huurachterstand-incasseren",
        date: "2026-03-22",
        cat: "Incasso en betaling",
    },
    {
        title: "Openstaande factuur: het complete stappenplan voor ondernemers",
        slug: "openstaande-factuur-stappenplan",
        date: "2026-03-10",
        cat: "Incasso en betaling",
    },
]
