// Hoofdmenu (Header.astro). Drie uitklappanelen (Diensten, Kennis, Over ons) en drie directe links.
// Elke pagina van de site is hier of in de footer bereikbaar; debiteuren gaan via de pil "Brief ontvangen?" bovenin.
// Teksten kort houden: één regel onder elke link. Bedragen niet typen maar uit de bron halen.
import { branches } from "./site"
import { onderwerpen } from "./kennisbank"
import { PAKKETTEN } from "../lib/pakketten"

export type MenuIcoon =
    | "scale"
    | "list"
    | "map"
    | "bolt"
    | "euro"
    | "calendar"
    | "doc"
    | "user"
    | "shield"
    | "check"
    | "chat"
    | "briefcase"
    | "search"

export interface MenuLink {
    label: string
    href: string
    icon?: MenuIcoon
    tekst?: string
}

export interface MenuGroep {
    titel: string
    /** compact = korte lijst zonder icoon en uitleg (branches, onderwerpen) */
    compact?: boolean
    links: MenuLink[]
    alle?: MenuLink
}

export type Promo = "indienen" | "stappenplan" | "contact"

export interface MenuPaneel {
    label: string
    id: string
    /** paden die dit paneel als "actief" markeren */
    paden: string[]
    groepen: MenuGroep[]
    promo: Promo
}

export interface MenuDirect {
    label: string
    href: string
}

export type MenuItem = MenuPaneel | MenuDirect

export const isPaneel = (m: MenuItem): m is MenuPaneel => "groepen" in m

const vanaf = Math.min(...PAKKETTEN.map((p) => p.prijs))

export const menu: MenuItem[] = [
    {
        label: "Diensten",
        id: "diensten",
        paden: ["/incasso", "/debiteurenbeheer", "/branches"],
        groepen: [
            {
                titel: "Onze diensten",
                links: [
                    {
                        label: "Incasso",
                        href: "/incasso",
                        icon: "scale",
                        tekst: "Ook voor één factuur. € 0 bij volledige betaling",
                    },
                    {
                        label: "Debiteurenbeheer",
                        href: "/debiteurenbeheer",
                        icon: "list",
                        tekst: `Wij bewaken uw facturen, vanaf € ${vanaf} per maand`,
                    },
                    {
                        label: "Buitenlandse vordering",
                        href: "/incasso/incasso-in-het-buitenland",
                        icon: "map",
                        tekst: "Innen bij een klant over de grens",
                    },
                    {
                        label: "Incassobureau inschakelen",
                        href: "/incasso/incassobureau-inschakelen",
                        icon: "bolt",
                        tekst: "Wanneer het loont en wat u nodig heeft",
                    },
                ],
            },
            {
                titel: "Per branche",
                compact: true,
                links: branches.map((b) => ({ label: b.label, href: `/branches/${b.slug}` })),
                alle: { label: "Alle branches", href: "/branches" },
            },
        ],
        promo: "indienen",
    },
    { label: "Hoe werkt het", href: "/hoe-werkt-het" },
    { label: "Tarieven", href: "/tarieven" },
    {
        label: "Kennis",
        id: "kennis",
        paden: ["/kennisbank", "/voorbeeldbrieven", "/incasso/incassokosten-berekenen", "/incasso/wik-brief"],
        groepen: [
            {
                titel: "Gratis hulpmiddelen",
                links: [
                    {
                        label: "Incassokosten berekenen",
                        href: "/incasso/incassokosten-berekenen",
                        icon: "euro",
                        tekst: "Staffel en wettelijke rente van vandaag",
                    },
                    {
                        label: "Termijn 14-dagenbrief",
                        href: "/incasso/wik-brief",
                        icon: "calendar",
                        tekst: "Vanaf welke dag mag u kosten rekenen?",
                    },
                    {
                        label: "Voorbeeldbrieven",
                        href: "/voorbeeldbrieven",
                        icon: "doc",
                        tekst: "Herinnering, aanmaning, sommatie: invullen en downloaden",
                    },
                ],
            },
            {
                titel: "Kennisbank",
                compact: true,
                links: onderwerpen.map((o) => ({ label: o.label, href: `/kennisbank#${o.id}` })),
                alle: { label: "Alle artikelen", href: "/kennisbank" },
            },
        ],
        promo: "stappenplan",
    },
    {
        label: "Over ons",
        id: "over",
        paden: ["/over-ons", "/wki", "/nowid", "/klachtenregelement", "/werken-bij"],
        groepen: [
            {
                titel: "GeldGarant",
                links: [
                    { label: "Over GeldGarant", href: "/over-ons", icon: "user", tekst: "Wie we zijn en hoe we werken" },
                    {
                        label: "Wki en registratie",
                        href: "/wki",
                        icon: "shield",
                        tekst: "Geregistreerd bij Justis, wat dat u oplevert",
                    },
                    { label: "Aangesloten bij NowID", href: "/nowid", icon: "check", tekst: "Wat ons lidmaatschap u oplevert" },
                    {
                        label: "Klachtenregeling",
                        href: "/klachtenregelement",
                        icon: "chat",
                        tekst: "Niet tevreden? Zo lossen we het op",
                    },
                    { label: "Werken bij", href: "/werken-bij", icon: "briefcase", tekst: "Vacatures en open sollicitatie" },
                ],
            },
        ],
        promo: "contact",
    },
    { label: "Contact", href: "/contact-opnemen" },
]

/** Is dit menu-item actief voor het huidige pad? */
export function isActief(m: MenuItem, pad: string): boolean {
    const past = (p: string) => pad === p || pad.startsWith(`${p}/`)
    if (!isPaneel(m)) return past(m.href)
    // /incasso/wik-brief en /incasso/incassokosten-berekenen horen bij Kennis, niet bij Diensten
    const kennis = menu.find((x) => isPaneel(x) && x.id === "kennis") as MenuPaneel
    if (m.id === "diensten" && kennis.paden.some(past)) return false
    return m.paden.some(past)
}
