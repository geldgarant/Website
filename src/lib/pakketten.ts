// Debiteurenbeheer: pakketten en losse prijzen. Eén bron voor /debiteurenbeheer en straks /tarieven.
// Prijzen bevestigd door Anas (6 nov 2026): € 99 / € 199 / € 349 per maand.
// Dossierlimieten, belacties, los dossier en extra dossier komen uit het werkplan-voorstel: nog bevestigen.

export const LOS_PER_DOSSIER = 9.95
export const EXTRA_DOSSIER = 3.95

export interface Pakket {
    id: "start" | "groei" | "zakelijk"
    naam: string
    prijs: number
    dossiers: number
    voor: string
    populair?: boolean
    kenmerken: readonly string[]
}

export const PAKKETTEN: readonly Pakket[] = [
    {
        id: "start",
        naam: "Start",
        prijs: 99,
        dossiers: 20,
        voor: "Voor zzp'ers en kleine bedrijven",
        kenmerken: [
            "Herinneringen per e-mail en sms",
            "1 belactie per dossier",
            "Betalingsregelingen",
            "Online overzicht",
            "Koppeling met uw boekhoudpakket",
        ],
    },
    {
        id: "groei",
        naam: "Groei",
        prijs: 199,
        dossiers: 50,
        voor: "Voor het groeiende mkb",
        populair: true,
        kenmerken: [
            "Herinneringen per e-mail en sms",
            "2 belacties per dossier",
            "Betalingsregelingen",
            "Online overzicht",
            "Koppeling met uw boekhoudpakket",
            "Maandrapport",
        ],
    },
    {
        id: "zakelijk",
        naam: "Zakelijk",
        prijs: 349,
        dossiers: 120,
        voor: "Voor bedrijven met veel facturen",
        kenmerken: [
            "Herinneringen per e-mail en sms",
            "2 belacties per dossier",
            "Betalingsregelingen",
            "Online overzicht",
            "Koppeling met uw boekhoudpakket",
            "Maandrapport",
            "Meerdere administraties",
        ],
    },
] as const

/** Maandkosten van een pakket bij n nieuwe dossiers per maand (extra dossiers boven de limiet tegen het extra tarief). */
export function pakketKosten(p: Pakket, n: number): number {
    const extra = Math.max(0, Math.ceil(n) - p.dossiers)
    return Math.round((p.prijs + extra * EXTRA_DOSSIER) * 100) / 100
}

/** Kosten zonder pakket: elk dossier los. */
export function losKosten(n: number): number {
    return Math.round(Math.max(0, Math.ceil(n)) * LOS_PER_DOSSIER * 100) / 100
}

export type Keuze = { id: Pakket["id"] | "los"; kosten: number }

/** Goedkoopste optie bij n dossiers per maand. Bij gelijke kosten wint het grotere pakket (meer belacties). */
export function besteKeuze(n: number): Keuze {
    const opties: Keuze[] = [
        { id: "los", kosten: losKosten(n) },
        ...PAKKETTEN.map((p) => ({ id: p.id, kosten: pakketKosten(p, n) })),
    ]
    return opties.reduce((best, o) => (o.kosten <= best.kosten ? o : best))
}
