// Vacatures op /werken-bij en /werken-bij/<slug>. Slugs gelijk aan de Framer-site (niet wijzigen: SEO).
// Let op: de slug "call-center-medewerker" blijft, maar het woord "callcenter" staat nergens in zichtbare tekst (besluit Anas).
// Feiten uit de huidige vacatures op geldgarant.com (nov 2026): 32–40 uur, 25 vakantiedagen en 8% vakantiegeld bij
// fulltime, stage mbo niveau 4 en minimaal 3 dagen. Opleidingsniveau en VOG: eisen uit de Wki (zie /wki).
// Salarisindicatie (akkoord Anas, 7 nov 2026) bruto per maand bij 40 uur, onderbouwd met wageindicator.nl
// (incasseerders: aanvang € 2.744 tot € 3.364), nationaleberoepengids.nl en Breyta (tot € 3.600). Minimumloon
// per 1 juli 2026: € 14,99 per uur, ruim € 2.598 per maand bij 40 uur. Stagevergoeding: nog niet bevestigd.
import { site } from "./site"

export interface Vacature {
    slug: string
    titel: string
    // kop met één accentwoord: [voor, accent, na]
    h1: readonly [string, string, string]
    seoTitle: string
    description: string
    kort: string
    lead: string
    kernpunten: readonly string[]
    feiten: readonly { icon: "pin" | "clock" | "doc" | "calendar" | "user" | "check" | "euro"; k: string; v: string }[]
    salaris?: { min: number; max: number }
    uren: string
    taken: readonly string[]
    profiel: readonly string[]
    bieden: readonly { icon: "doc" | "calendar" | "euro" | "user" | "check" | "chat"; kop: string; tekst: string }[]
    employmentType: readonly string[]
    datePosted: string
}

export const geld = (n: number) => `€\u00a0${n.toLocaleString("nl-NL")}`
export const salarisTekst = (s: { min: number; max: number }) => `${geld(s.min)} tot ${geld(s.max)}`

const biedenBaan = (s: { min: number; max: number }) =>
    [
        {
            icon: "doc",
            kop: "Opleiding in het vak",
            tekst: "U hoeft het vak nog niet te kennen. U leert het bij ons, met een vaste collega naast u en elk jaar de bijscholing die de wet vraagt.",
        },
        {
            icon: "calendar",
            kop: "25 vakantiedagen en 8% vakantiegeld",
            tekst: "Bij een fulltime dienstverband, plus de vrijheid om ze op te nemen wanneer het u uitkomt.",
        },
        {
            icon: "euro",
            kop: `${salarisTekst(s)} bruto`,
            tekst: "Per maand bij 40 uur, afhankelijk van uw ervaring. Werkt u minder uren, dan naar rato.",
        },
        {
            icon: "user",
            kop: "Korte lijnen",
            tekst: "Geen lagen tussen u en de beslissing. Ziet u iets dat beter kan, dan kunt u het meteen aankaarten.",
        },
    ] as const

const SAL_INCASSO = { min: 2750, max: 3400 }
const SAL_KLANTCONTACT = { min: 2650, max: 3100 }

export const vacatures: readonly Vacature[] = [
    {
        slug: "incasso-medewerker",
        titel: "Incassomedewerker",
        h1: ["Incassomedewerker in ", "Deventer", ""],
        seoTitle: "Vacature incassomedewerker in Deventer | GeldGarant",
        description:
            "Werk als incassomedewerker bij GeldGarant in Deventer: eigen dossiers, gesprekken met debiteuren en goede regelingen. 32 tot 40 uur, ervaring niet vereist.",
        kort: "U beheert eigen incassodossiers, van de eerste aanmaning tot betaling of regeling.",
        lead: "U beheert uw eigen dossiers, van de eerste aanmaning tot een betaling of een regeling. U spreekt debiteuren, zoekt een oplossing die werkt en houdt opdrachtgevers op de hoogte.",
        kernpunten: [
            "Eigen portefeuille met dossiers",
            "Opleiding in het vak, ook zonder ervaring",
            "Werk dat zichtbaar resultaat oplevert",
        ],
        feiten: [
            { icon: "pin", k: "Standplaats", v: `Kantoor ${site.city}` },
            { icon: "euro", k: "Salaris", v: `${salarisTekst(SAL_INCASSO)} bruto` },
            { icon: "clock", k: "Uren", v: "32 tot 40 per week" },
            { icon: "doc", k: "Opleiding", v: "Minimaal mbo niveau 3" },
            { icon: "check", k: "Ervaring", v: "Niet vereist, wij leiden u op" },
            { icon: "calendar", k: "Start", v: "In overleg" },
        ],
        uren: "32–40 uur",
        taken: [
            "U beheert een eigen portefeuille met dossiers in het minnelijke traject.",
            "U belt en mailt met debiteuren en maakt heldere afspraken over betaling.",
            "U stelt betalingsregelingen voor, legt ze vast en bewaakt of ze worden nagekomen.",
            "U beoordeelt verweer en stemt met de opdrachtgever af wat de volgende stap is.",
            "U houdt opdrachtgevers op de hoogte, zodat zij online zien wat er in hun dossier gebeurt.",
            "U zet dossiers klaar voor de rechter of deurwaarder als de opdrachtgever daarvoor kiest.",
        ],
        profiel: [
            "U communiceert helder en blijft rustig, ook als het gesprek lastig wordt.",
            "U bent vasthoudend, maar zoekt altijd naar een oplossing die past.",
            "U werkt nauwkeurig en legt afspraken direct vast.",
            "U heeft minimaal een mbo-diploma op niveau 3. Dat is een eis uit de Wki.",
            "U spreekt en schrijft goed Nederlands.",
            "U kunt een Verklaring Omtrent het Gedrag (VOG) aanvragen.",
        ],
        salaris: SAL_INCASSO,
        bieden: biedenBaan(SAL_INCASSO),
        employmentType: ["FULL_TIME", "PART_TIME"],
        datePosted: "2026-11-07",
    },
    {
        slug: "call-center-medewerker",
        titel: "Medewerker klantcontact",
        h1: ["Medewerker ", "klantcontact", ""],
        seoTitle: "Vacature medewerker klantcontact in Deventer | GeldGarant",
        description:
            "Word medewerker klantcontact bij GeldGarant in Deventer. U spreekt debiteuren en opdrachtgevers en zorgt voor duidelijke afspraken. 32 tot 40 uur per week.",
        kort: "U bent de eerste stem van GeldGarant voor debiteuren en opdrachtgevers.",
        lead: "U bent de eerste stem van GeldGarant. U spreekt debiteuren en opdrachtgevers aan de telefoon, per e-mail en via WhatsApp, en zorgt dat elk gesprek eindigt met een duidelijke afspraak.",
        kernpunten: ["Elke dag echte gesprekken", "Telefoon, e-mail en WhatsApp", "Opleiding in het vak"],
        feiten: [
            { icon: "pin", k: "Standplaats", v: `Kantoor ${site.city}` },
            { icon: "euro", k: "Salaris", v: `${salarisTekst(SAL_KLANTCONTACT)} bruto` },
            { icon: "clock", k: "Uren", v: "32 tot 40 per week" },
            { icon: "doc", k: "Opleiding", v: "Minimaal mbo niveau 3" },
            { icon: "check", k: "Ervaring", v: "Klantcontact is een pre" },
            { icon: "calendar", k: "Start", v: "In overleg" },
        ],
        uren: "32–40 uur",
        taken: [
            "U beantwoordt vragen van debiteuren en opdrachtgevers, aan de telefoon, per e-mail en via WhatsApp.",
            "U belt debiteuren over openstaande facturen, vaak al voordat er een incassozaak van komt.",
            "U maakt betalingsafspraken en legt elk gesprek vast in het dossier.",
            "U pakt nieuwe aanvragen en terugbelverzoeken op werkdagen snel op, zodat wij onze belofte van binnen het uur waarmaken.",
            "U signaleert wanneer een dossier aandacht van een incassomedewerker nodig heeft.",
        ],
        profiel: [
            "U heeft een prettige, duidelijke stem en praat graag met mensen.",
            "U blijft rustig en respectvol als iemand boos of verdrietig is.",
            "U luistert goed en vat een situatie kort en juist samen.",
            "U heeft minimaal een mbo-diploma op niveau 3. Dat is een eis uit de Wki.",
            "U spreekt en schrijft goed Nederlands.",
            "U kunt een Verklaring Omtrent het Gedrag (VOG) aanvragen.",
        ],
        salaris: SAL_KLANTCONTACT,
        bieden: biedenBaan(SAL_KLANTCONTACT),
        employmentType: ["FULL_TIME", "PART_TIME"],
        datePosted: "2026-11-07",
    },
    {
        slug: "stage",
        titel: "Stage incasso en klantcontact",
        h1: ["Stage incasso en ", "klantcontact", ""],
        seoTitle: "Stage incasso en klantcontact (mbo 4) in Deventer | GeldGarant",
        description:
            "Loop stage bij GeldGarant in Deventer. Meewerken aan echte dossiers en klantcontact, met een vaste begeleider. Voor mbo niveau 4, minimaal drie dagen per week.",
        kort: "Meewerken aan echte dossiers en klantcontact, met een vaste begeleider.",
        lead: "U loopt stage in een team dat ondernemers helpt met incasso en debiteurenbeheer. U kijkt niet alleen mee: u werkt echt mee aan dossiers en klantcontact, met een vaste begeleider naast u.",
        kernpunten: ["Echt meewerken, niet alleen meekijken", "Een vaste begeleider", "Meewerk- of afstudeerstage"],
        feiten: [
            { icon: "pin", k: "Standplaats", v: `Kantoor ${site.city}` },
            { icon: "clock", k: "Tijd", v: "Minimaal 3 dagen per week" },
            { icon: "doc", k: "Opleiding", v: "Mbo niveau 4" },
            { icon: "user", k: "Soort stage", v: "Meewerk- of afstudeerstage" },
            { icon: "calendar", k: "Start", v: "In overleg, passend bij uw opleiding" },
        ],
        uren: "3–5 dagen",
        taken: [
            "U draait mee in de dagelijkse praktijk: dossiers, klantvragen en processen.",
            "U spreekt debiteuren en opdrachtgevers, eerst samen met uw begeleider en daarna zelfstandig.",
            "U werkt aan een eigen opdracht, bijvoorbeeld in klantcontact, processen, content of marketing.",
            "U krijgt elke week feedback en werkt gericht aan de leerdoelen van uw opleiding.",
        ],
        profiel: [
            "U volgt een mbo-opleiding op niveau 4, bijvoorbeeld juridisch, financieel of commercieel.",
            "U zoekt een meewerkstage of een afstudeerstage.",
            "U bent nieuwsgierig en pakt dingen zelf op.",
            "U communiceert helder en werkt nauwkeurig.",
            "U bent minimaal drie dagen per week beschikbaar.",
        ],
        bieden: [
            {
                icon: "user",
                kop: "Een vaste begeleider",
                tekst: "Iemand die tijd voor u maakt, uw vragen beantwoordt en uw leerdoelen bewaakt.",
            },
            {
                icon: "check",
                kop: "Echte verantwoordelijkheid",
                tekst: "U werkt aan echte dossiers. Wat u doet, heeft direct effect voor een ondernemer.",
            },
            {
                icon: "chat",
                kop: "Feedback die u verder helpt",
                tekst: "Elke week een kort moment om terug te kijken: wat ging goed, en wat kan beter.",
            },
            {
                icon: "doc",
                kop: "Ervaring die telt",
                tekst: "U leert hoe incasso volgens de wet werkt, kennis die u in elk financieel beroep gebruikt.",
            },
        ],
        employmentType: ["INTERN"],
        datePosted: "2026-11-07",
    },
]

export const sollicitatieMail = (functie: string) =>
    `mailto:${site.email}?subject=${encodeURIComponent(`Sollicitatie ${functie}`)}`

export const procedure = [
    {
        kop: "U reageert",
        tekst: "Upload uw cv met het formulier en vertel in een paar zinnen waar u goed in bent. Binnen twee minuten gedaan.",
    },
    {
        kop: "Kennismaking",
        tekst: "We bellen u voor een eerste kennismaking: wie bent u, en past de functie bij u?",
    },
    {
        kop: "Gesprek op kantoor",
        tekst: `U komt langs op ons kantoor in ${site.city}. U ziet waar u gaat werken en ontmoet het team.`,
    },
    {
        kop: "Aan de slag",
        tekst: "Is er een match, dan maken we afspraken. U vraagt een VOG aan, want die is in ons vak wettelijk verplicht.",
    },
] as const

export const werkenFaq = [
    {
        q: "Heb ik ervaring in incasso nodig?",
        a: "Nee. U leert het vak bij ons, met een vaste collega naast u. Wel vraagt de Wet kwaliteit incassodienstverlening dat medewerkers minimaal een opleiding op mbo-niveau 3 hebben, en leidinggevenden niveau 4.",
    },
    {
        q: "Waarom moet ik een VOG aanvragen?",
        a: "Wie incassowerk doet, moet volgens de Wki een Verklaring Omtrent het Gedrag hebben. Die is bij de start niet ouder dan drie maanden. U vraagt hem aan zodra we samen verder willen.",
    },
    {
        q: "Kan ik parttime werken?",
        a: "De vacatures zijn voor 32 tot 40 uur per week. Een stage is minimaal drie dagen per week. Heeft u een andere wens, vermeld die dan in uw reactie.",
    },
    {
        q: "Waar werk ik?",
        a: `Op ons kantoor aan de ${site.street} in ${site.city}. Daar zit het team bij elkaar, zodat u snel kunt overleggen.`,
    },
    {
        q: "Ik zie geen vacature die past. Kan ik toch reageren?",
        a: "Ja. Stuur een open sollicitatie met uw cv en vertel welk werk u zoekt en waar u goed in bent. Past er nu niets en mogen we uw gegevens langer bewaren, dan nemen we contact op zodra er wel een plek is.",
    },
    {
        q: "Wat gebeurt er met mijn gegevens?",
        a: "We gebruiken uw gegevens alleen voor de sollicitatie. Na afloop verwijderen we ze binnen vier weken, tenzij u ons toestemming geeft om ze langer te bewaren.",
    },
] as const
