// Briefmaker: zet de invoer van het formulier op /voorbeeldbrieven/* om in een brief.
// Puur en zonder DOM, zodat dezelfde code de server-render (lege plaatshouders), de live preview,
// de platte tekst (kopiëren) en het Word-bestand voedt. Getest in tests/unit/briefmaker.test.ts.
// Lege velden worden een plaatshouder tussen blokhaken, bv. "[factuurnummer]".
import { wikKosten, euro } from "./wik"

export const BRIEF_SLUGS = [
    "betalingsherinnering",
    "aanmaning",
    "14-dagenbrief",
    "ingebrekestelling",
    "sommatie",
    "betalingsregeling",
] as const
export type BriefSlug = (typeof BRIEF_SLUGS)[number]
export type Soort = "zakelijk" | "particulier"

export interface Invoer {
    afzender: string
    afzenderAdres: string
    plaats: string
    ondertekenaar: string
    klant: string
    klantAdres: string
    aanhef: string
    factuur: string
    factuurdatum: string
    vervaldatum: string
    bedrag: string
    iban: string
    termijn: string
    datum: string
    soort: Soort
    herinnering: boolean
    btw: boolean
    wikVerstuurd: boolean
    termijnen: string
    eerste: string
}

export const LEEG: Invoer = {
    afzender: "",
    afzenderAdres: "",
    plaats: "",
    ondertekenaar: "",
    klant: "",
    klantAdres: "",
    aanhef: "",
    factuur: "",
    factuurdatum: "",
    vervaldatum: "",
    bedrag: "",
    iban: "",
    termijn: "",
    datum: "",
    soort: "zakelijk",
    herinnering: true,
    btw: false,
    wikVerstuurd: false,
    termijnen: "",
    eerste: "",
}

export interface Brief {
    afzender: string[]
    geadresseerde: string[]
    plaatsDatum: string
    onderwerp: string
    aanhef: string
    alineas: string[]
    specificatie?: { kop: string; regels: [string, string][] }
    /** Alinea's die ná de specificatie komen. */
    naSpecificatie?: string[]
    slot: string
    ondertekening: string[]
    akkoord?: string[]
}

/** Standaard betaaltermijn in dagen per brief (de 14-dagenbrief heeft een wettelijke termijn). */
export const STANDAARD_TERMIJN: Record<BriefSlug, number> = {
    betalingsherinnering: 7,
    aanmaning: 7,
    "14-dagenbrief": 14,
    ingebrekestelling: 14,
    sommatie: 7,
    betalingsregeling: 0,
}

const DAG = 86_400_000
const BTW = 0.21

const p = (waarde: string, plaatshouder: string) => {
    const w = waarde.trim()
    return w ? w : `[${plaatshouder}]`
}

/** "2026-11-07" → UTC-tijdstempel; anders NaN */
export function dagVan(iso: string): number {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return Number.NaN
    const t = Date.parse(`${iso}T00:00:00Z`)
    return Number.isFinite(t) ? t : Number.NaN
}

const isoVan = (t: number) => new Date(t).toISOString().slice(0, 10)

export function datumNl(iso: string): string {
    const t = dagVan(iso)
    if (!Number.isFinite(t)) return ""
    return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(t)
}

const d = (iso: string, plaatshouder: string) => datumNl(iso) || `[${plaatshouder}]`

/** "1.250,50", "1250,5", "€ 1250.50" → 1250.5; ongeldig of ≤ 0 → NaN */
export function leesBedrag(rauw: string): number {
    let s = rauw.replace(/[€\s]/g, "") // \s omvat ook de harde spatie
    if (!s) return Number.NaN
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".")
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "")
    if (!/^\d+(\.\d{1,2})?$/.test(s)) return Number.NaN
    const n = Number(s)
    return n > 0 ? Math.round(n * 100) / 100 : Number.NaN
}

const rond = (n: number) => Math.round(n * 100) / 100

/** Termijn in dagen: invoer, anders de standaard; begrensd op 1 tot 60. */
export function termijnDagen(slug: BriefSlug, rauw: string): number {
    const n = Number.parseInt(rauw, 10)
    if (Number.isFinite(n) && n >= 1 && n <= 60) return n
    return STANDAARD_TERMIJN[slug]
}

/** Zelfde dag van de maand, `maanden` later; valt die dag weg (31 feb), dan de laatste dag van die maand. */
export function plusMaanden(iso: string, maanden: number): string {
    const t = dagVan(iso)
    if (!Number.isFinite(t)) return ""
    const b = new Date(t)
    const jaar = b.getUTCFullYear()
    const maand = b.getUTCMonth() + maanden
    const dag = b.getUTCDate()
    const laatste = new Date(Date.UTC(jaar, maand + 1, 0)).getUTCDate()
    return isoVan(Date.UTC(jaar, maand, Math.min(dag, laatste)))
}

export interface Regeling {
    aantal: number
    termijnbedrag: number
    laatste: number
    data: string[]
}

/** Verdeel `bedrag` over `aantal` maandtermijnen (2 tot 24); de laatste termijn vangt de afronding op. */
export function regeling(bedrag: number, aantalRauw: string, eerste: string): Regeling | null {
    const aantal = Number.parseInt(aantalRauw, 10)
    if (!(bedrag > 0) || !Number.isFinite(aantal) || aantal < 2 || aantal > 24) return null
    const termijnbedrag = Math.floor((bedrag / aantal) * 100) / 100
    const laatste = rond(bedrag - termijnbedrag * (aantal - 1))
    const data = Number.isFinite(dagVan(eerste)) ? Array.from({ length: aantal }, (_, i) => plusMaanden(eerste, i)) : []
    return { aantal, termijnbedrag, laatste, data }
}

const regels = (...r: (string | false | undefined)[]) => r.filter((x): x is string => Boolean(x && x.trim()))

export function maakBrief(slug: BriefSlug, invoer: Partial<Invoer> = {}): Brief {
    const v: Invoer = { ...LEEG, ...invoer }
    const bedragN = leesBedrag(v.bedrag)
    const heeftBedrag = Number.isFinite(bedragN)
    const bedrag = heeftBedrag ? euro(bedragN) : "[bedrag]"
    const kostenN = heeftBedrag ? wikKosten(bedragN) : Number.NaN
    const kosten = heeftBedrag ? euro(kostenN) : "[incassokosten]"
    const afzender = p(v.afzender, "uw bedrijfsnaam")
    const klant = p(v.klant, "naam klant")
    const factuur = p(v.factuur, "factuurnummer")
    const factuurdatum = d(v.factuurdatum, "factuurdatum")
    const vervaldatum = d(v.vervaldatum, "vervaldatum")
    const iban = p(v.iban.toUpperCase(), "IBAN")
    const dagen = termijnDagen(slug, v.termijn)
    const datumT = dagVan(v.datum)
    const einddatum = Number.isFinite(datumT) ? datumNl(isoVan(datumT + dagen * DAG)) : "[uiterste betaaldatum]"
    const betaal = `op rekening ${iban} ten name van ${afzender}, onder vermelding van factuur ${factuur}`
    const zakelijk = v.soort === "zakelijk"

    const brief: Brief = {
        afzender: regels(afzender, v.afzenderAdres),
        geadresseerde: regels(klant, v.klantAdres || "[adres klant]"),
        plaatsDatum: `${p(v.plaats, "plaats")}, ${d(v.datum, "datum")}`,
        onderwerp: "",
        aanhef: v.aanhef.trim() ? `Geachte ${v.aanhef.trim()},` : "Geachte heer, mevrouw,",
        alineas: [],
        slot: "Met vriendelijke groet,",
        ondertekening: regels(v.ondertekenaar || "[uw naam]", afzender),
    }

    const nietBetaald = "Heeft u het bedrag inmiddels betaald? Dan kunt u deze brief als niet verzonden beschouwen."

    switch (slug) {
        case "betalingsherinnering":
            brief.onderwerp = `Betalingsherinnering factuur ${factuur}`
            brief.alineas = [
                `Volgens onze administratie is factuur ${factuur} van ${factuurdatum} nog niet betaald. Het gaat om een bedrag van ${bedrag}. De betaaltermijn is verlopen op ${vervaldatum}.`,
                `Mogelijk is de factuur aan uw aandacht ontsnapt. Wilt u het bedrag binnen ${dagen} dagen overmaken, dus uiterlijk op ${einddatum}, ${betaal}? Een kopie van de factuur sturen wij mee.`,
                "Heeft u de factuur niet ontvangen of klopt er volgens u iets niet? Laat het ons weten, dan lossen we het samen op.",
                nietBetaald,
            ]
            break

        case "aanmaning":
            brief.onderwerp = `Aanmaning factuur ${factuur}`
            brief.alineas = [
                `Op ${factuurdatum} stuurden wij u factuur ${factuur} van ${bedrag}. Deze factuur had uiterlijk op ${vervaldatum} betaald moeten zijn. ${v.herinnering ? "Ondanks onze herinnering hebben wij" : "Wij hebben"} nog geen betaling ontvangen.`,
                `Wij verzoeken u het openstaande bedrag van ${bedrag} binnen ${dagen} dagen te betalen, dus uiterlijk op ${einddatum}, ${betaal}.`,
                zakelijk
                    ? `Ontvangen wij uw betaling niet op tijd, dan dragen wij de vordering over aan een incassobureau. U bent dan naast het openstaande bedrag ook buitengerechtelijke incassokosten verschuldigd van ${kosten}, berekend volgens het Besluit vergoeding voor buitengerechtelijke incassokosten, en de wettelijke handelsrente vanaf de vervaldatum.`
                    : "Ontvangen wij uw betaling niet op tijd, dan nemen wij verdere stappen om het bedrag te innen. Voordat daar kosten voor u aan verbonden zijn, ontvangt u eerst nog een brief met een laatste termijn van 14 dagen.",
                `Kunt u niet betalen of bent u het niet eens met de factuur? Neem dan vóór ${einddatum} contact met ons op.`,
                nietBetaald,
            ]
            break

        case "14-dagenbrief": {
            const btwN = heeftBedrag && v.btw ? rond(kostenN * BTW) : 0
            const kostenZin = !heeftBedrag
                ? `incassokosten verschuldigd van ${kosten}`
                : v.btw
                  ? `incassokosten verschuldigd van ${euro(rond(kostenN + btwN))}. Dat is ${kosten} plus ${euro(btwN)} btw, omdat wij de btw niet kunnen verrekenen`
                  : `incassokosten verschuldigd van ${kosten}`
            brief.onderwerp = `Aanmaning factuur ${factuur}`
            brief.alineas = [
                `Op ${factuurdatum} stuurden wij u factuur ${factuur} van ${bedrag}. De betaaltermijn is verlopen op ${vervaldatum} en wij hebben uw betaling nog niet ontvangen.`,
                `Wij verzoeken u het bedrag van ${bedrag} te betalen binnen 14 dagen, te rekenen vanaf de dag na ontvangst van deze brief. U kunt betalen ${betaal}.`,
                `Betaalt u niet binnen deze termijn, dan bent u naast het openstaande bedrag ${kostenZin}. Dit bedrag is berekend volgens het Besluit vergoeding voor buitengerechtelijke incassokosten. Daarnaast bent u dan de wettelijke rente verschuldigd.`,
                "Aan deze brief zijn voor u geen kosten verbonden.",
                "Kunt u het bedrag niet in één keer betalen of klopt de factuur volgens u niet? Neem dan binnen deze termijn contact met ons op. Dan zoeken we samen naar een oplossing.",
                nietBetaald,
            ]
            break
        }

        case "ingebrekestelling":
            brief.onderwerp = `Ingebrekestelling factuur ${factuur}`
            brief.alineas = [
                `Op ${factuurdatum} stuurden wij u factuur ${factuur} van ${bedrag}, te betalen uiterlijk op ${vervaldatum}. Ondanks ons eerdere verzoek hebben wij nog geen betaling ontvangen.`,
                `Hierbij stellen wij u in gebreke. Wij geven u een laatste termijn van ${dagen} dagen na de datum van deze brief, dus tot en met ${einddatum}, om het bedrag van ${bedrag} te betalen ${betaal}.`,
                zakelijk
                    ? `Betaalt u niet binnen deze termijn, dan bent u in verzuim. Wij dragen de vordering dan over aan een incassobureau of starten een gerechtelijke procedure. U bent dan ook de wettelijke handelsrente en buitengerechtelijke incassokosten van ${kosten} verschuldigd.`
                    : "Betaalt u niet binnen deze termijn, dan bent u in verzuim en bent u vanaf dat moment de wettelijke rente verschuldigd. Wij kunnen dan verdere stappen nemen om het bedrag te innen.",
                "Met deze brief behouden wij uitdrukkelijk ons recht op betaling van dit bedrag. De brief stuit daarmee ook de verjaring van onze vordering.",
                `Is er een reden waarom u niet kunt betalen? Neem dan vóór ${einddatum} contact met ons op.`,
            ]
            break

        case "sommatie": {
            const metKosten = heeftBedrag && (zakelijk || v.wikVerstuurd)
            const totaal = heeftBedrag ? euro(rond(bedragN + (metKosten ? kostenN : 0))) : "[totaalbedrag]"
            const rente = zakelijk ? "de wettelijke handelsrente" : "de wettelijke rente"
            brief.onderwerp = `Sommatie tot betaling factuur ${factuur}`
            brief.alineas = [
                `Ondanks onze eerdere brieven heeft u factuur ${factuur} van ${factuurdatum} nog altijd niet betaald. De betaaltermijn is verlopen op ${vervaldatum}.`,
            ]
            brief.specificatie = {
                kop: "Openstaand",
                regels: [
                    ["Hoofdsom", bedrag],
                    ...(metKosten || !heeftBedrag ? ([["Buitengerechtelijke incassokosten", kosten]] as [string, string][]) : []),
                    ["Totaal", totaal],
                ],
            }
            brief.naSpecificatie = [
                `Wij sommeren u het totaalbedrag van ${totaal}, vermeerderd met ${rente}, binnen ${dagen} dagen na de datum van deze brief te betalen, dus uiterlijk op ${einddatum}, ${betaal}.`,
                "Is het bedrag niet op tijd binnen, dan starten wij zonder verdere aankondiging een gerechtelijke procedure. De rechter kan u dan ook veroordelen in de kosten daarvan, zoals het griffierecht en de kosten van de deurwaarder.",
                `Dit is de laatste mogelijkheid om een procedure te voorkomen. Wilt u een betalingsregeling bespreken? Neem dan vóór ${einddatum} contact met ons op.`,
            ]
            break
        }

        case "betalingsregeling": {
            const r = heeftBedrag ? regeling(bedragN, v.termijnen, v.eerste) : null
            const aantal = r ? String(r.aantal) : p(v.termijnen, "aantal")
            const termijnbedrag = r ? euro(r.termijnbedrag) : "[termijnbedrag]"
            const afwijkend = r && r.laatste !== r.termijnbedrag ? ` De laatste termijn is ${euro(r.laatste)}.` : ""
            brief.onderwerp = `Bevestiging betalingsregeling factuur ${factuur}`
            brief.alineas = [
                `Zoals besproken bevestigen wij hierbij de betalingsregeling voor factuur ${factuur}. U erkent dat u ons in totaal ${bedrag} verschuldigd bent.`,
                `U betaalt dit bedrag in ${aantal} maandelijkse termijnen van ${termijnbedrag}.${afwijkend} De eerste termijn betaalt u uiterlijk op ${d(v.eerste, "datum eerste termijn")}, de volgende termijnen telkens uiterlijk op dezelfde dag van de maand. U betaalt ${betaal}.`,
            ]
            if (r && r.data.length) {
                brief.specificatie = {
                    kop: "Betaalschema",
                    regels: r.data.map((dt, i) => [
                        `Termijn ${i + 1}, uiterlijk ${datumNl(dt)}`,
                        euro(i === r.aantal - 1 ? r.laatste : r.termijnbedrag),
                    ]),
                }
            }
            brief.naSpecificatie = [
                "Zolang u zich aan deze afspraken houdt, nemen wij geen verdere stappen om het bedrag te innen. U mag het resterende bedrag altijd eerder betalen.",
                "Betaalt u een termijn niet of niet volledig binnen 7 dagen na de afgesproken datum, dan vervalt de regeling. Het volledige resterende bedrag is dan in één keer opeisbaar en wij kunnen zonder verdere aankondiging verdere stappen nemen.",
                "Gaat u akkoord? Onderteken deze brief en stuur hem binnen 7 dagen naar ons terug. Betaalt u de eerste termijn, dan gaan wij er ook van uit dat u akkoord bent met deze afspraken.",
            ]
            brief.akkoord = [`Voor akkoord: ${klant}`, "Datum:", "Handtekening:"]
            break
        }
    }
    return brief
}

/** Platte tekst voor het klembord en als terugval. */
export function briefAlsTekst(b: Brief): string {
    const blok = (r: string[]) => r.join("\n")
    const delen = [blok(b.afzender), blok(b.geadresseerde), b.plaatsDatum, `Betreft: ${b.onderwerp}`, b.aanhef, ...b.alineas]
    if (b.specificatie) {
        delen.push(blok([`${b.specificatie.kop}:`, ...b.specificatie.regels.map(([l, w]) => `${l}: ${w}`)]))
    }
    delen.push(...(b.naSpecificatie ?? []), b.slot, blok(b.ondertekening))
    if (b.akkoord) delen.push(blok(b.akkoord))
    return delen.join("\n\n") + "\n"
}

/** Heeft de brief nog lege plaatshouders? */
export function plaatshouders(b: Brief): string[] {
    const alles = briefAlsTekst(b)
    return [...new Set([...alles.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]))]
}
