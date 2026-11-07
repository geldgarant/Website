// Logica voor /brief-ontvangen (debiteuren): direct betalen, voorinvullen uit een link of QR-code,
// een regeling doorrekenen en een reactie (regeling, al betaald, niet eens) via /api/contact versturen.
// Puur en zonder DOM, zodat alles in tests/unit/debiteur.test.ts getest kan worden.
//
// Betalen loopt via CaseControl. Het debiteurenportaal (geldgarant.debtorportal.com) maakt een betaallink met
// POST https://api.casecontrol.app/api/portal/debtor/v1/geldgarant/pay  { caseNumber, amount }  →  { url }
// (nagelopen in de portaalcode, 7 nov 2026; minimaal € 5, geen inlog nodig). Zolang site.betaalLinkApi leeg is,
// sturen we de bezoeker naar het portaal met de gegevens om over te nemen. Staat de worker-route aan, dan vraagt
// vraagBetaallink() de link op via onze eigen worker en gaat de bezoeker direct door naar de betaalpagina.
import { parseBedrag, normTelefoon, isEmail, isTelefoon, bouwContactPayload, leegContact, ApiFout } from "./intake"
import type { Fouten, ContactState } from "./intake"

export const BETAAL_MIN = 5 // minimum van de CaseControl-betaallink
export const BETAAL_MAX = 250_000

const schoon = (v: string, max = 200) =>
    String(v ?? "")
        // eslint-disable-next-line no-control-regex -- stuurtekens bewust verwijderen
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max)

/** Dossiernummer zoals een bezoeker het intypt of uit een link haalt: hoofdletters, zonder spaties. */
export const normDossier = (v: string) =>
    String(v ?? "")
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/[^A-Z0-9\-/.]/g, "")
        .slice(0, 30)

/** Ruime controle: het precieze formaat van CaseControl verschilt per bureau. Letters, cijfers, - / . */
export const isDossier = (v: string) => /^[A-Z0-9][A-Z0-9\-/.]{2,29}$/.test(normDossier(v))

/** 245.6 → "245,60" (voor in een invoerveld; zonder euroteken en zonder duizendtalpunt) */
export const bedragVeld = (n: number) => (n > 0 ? n.toFixed(2).replace(".", ",") : "")

export interface Betaling {
    dossier: string
    bedrag: string
}

export function valideerBetaling(b: Betaling): Fouten {
    const f: Fouten = {}
    if (!normDossier(b.dossier)) f.dossier = "Vul het dossiernummer uit onze brief of e-mail in."
    else if (!isDossier(b.dossier)) f.dossier = "Dit dossiernummer klopt niet. Neem het over zoals het in de brief staat."
    const n = parseBedrag(b.bedrag)
    if (!n) f.bedrag = "Vul het bedrag in dat u wilt betalen."
    else if (n < BETAAL_MIN) f.bedrag = `Online betalen kan vanaf € ${BETAAL_MIN}.`
    else if (n > BETAAL_MAX) f.bedrag = "Dit bedrag is te hoog voor een online betaling. Bel ons, dan helpen we u verder."
    return f
}

/**
 * Voorinvullen uit de link in een brief, e-mail of QR-code:
 * /brief-ontvangen?dossier=GG-123&bedrag=245,60  (ook ?d= en ?b=, of ?kenmerk=)
 */
export function leesVoorinvulling(search: string): Betaling {
    const p = new URLSearchParams(search)
    const dossier = normDossier(p.get("dossier") ?? p.get("d") ?? p.get("kenmerk") ?? "")
    const n = parseBedrag(p.get("bedrag") ?? p.get("b") ?? "")
    return {
        dossier: isDossier(dossier) ? dossier : "",
        bedrag: n >= BETAAL_MIN && n <= BETAAL_MAX ? bedragVeld(n) : "",
    }
}

/** Vraagt via onze worker een betaallink op bij CaseControl. Geeft de https-URL van de betaalpagina terug. */
export async function vraagBetaallink(api: string, b: Betaling): Promise<string> {
    const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossiernummer: normDossier(b.dossier), bedrag: parseBedrag(b.bedrag) }),
    })
    const d = ((await res.json().catch(() => null)) as Record<string, unknown> | null) ?? {}
    const url = typeof d.url === "string" ? d.url : ""
    if (res.ok && d.ok !== false && /^https:\/\/[^\s]+$/.test(url)) return url
    if (res.status === 404 || d.error === "niet-gevonden") throw new ApiFout("niet-gevonden", 404)
    throw new ApiFout(String(d.error || "betaallink-mislukt"), res.status || 0)
}

// ---------- regeling ----------

/** Hoeveel termijnen van `perTermijn` zijn nodig voor `open`, en wat is de laatste termijn. */
export function termijnen(open: number, perTermijn: number): { aantal: number; laatste: number } | null {
    if (!(open > 0) || !(perTermijn > 0)) return null
    const aantal = Math.ceil(Math.round((open / perTermijn) * 1e6) / 1e6)
    const laatste = Math.round((open - (aantal - 1) * perTermijn) * 100) / 100
    return { aantal, laatste }
}

// ---------- reactie (regeling, al betaald, niet eens, iets anders) ----------

export const REDENEN = [
    { key: "regeling", label: "Betalingsregeling", kop: "Betalingsregeling aanvragen" },
    { key: "betaald", label: "Ik heb al betaald", kop: "Ik heb al betaald" },
    { key: "oneens", label: "Ik ben het niet eens", kop: "Ik ben het niet eens met de vordering" },
    { key: "anders", label: "Iets anders", kop: "Vraag over mijn dossier" },
] as const
export type Reden = (typeof REDENEN)[number]["key"]
export const isReden = (v: string): v is Reden => REDENEN.some((r) => r.key === v)

export interface Reactie {
    reden: Reden | ""
    dossier: string
    naam: string
    email: string
    telefoon: string
    voorkeur: "email" | "telefoon" | "whatsapp"
    per_maand: string
    ingang: string
    schuldhulp: boolean
    betaald_op: string
    betaald_bedrag: string
    toelichting: string
}

export const leegReactie = (): Reactie => ({
    reden: "",
    dossier: "",
    naam: "",
    email: "",
    telefoon: "",
    voorkeur: "email",
    per_maand: "",
    ingang: "",
    schuldhulp: false,
    betaald_op: "",
    betaald_bedrag: "",
    toelichting: "",
})

const isDatum = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(`${v}T00:00:00Z`))

export function valideerReactie(s: Reactie): Fouten {
    const f: Fouten = {}
    if (!s.reden) f.reden = "Kies wat u wilt regelen."
    if (!normDossier(s.dossier)) f.dossier = "Vul het dossiernummer uit onze brief of e-mail in."
    else if (!isDossier(s.dossier)) f.dossier = "Dit dossiernummer klopt niet. Neem het over zoals het in de brief staat."
    if (!schoon(s.naam)) f.naam = "Vul uw naam in."
    if (!isEmail(s.email)) f.email = "Vul een geldig e-mailadres in, dan kunnen we u antwoorden."
    if ((s.voorkeur === "telefoon" || s.voorkeur === "whatsapp") && !isTelefoon(s.telefoon))
        f.telefoon = "Vul uw telefoonnummer in, dan kunnen we u bereiken."
    else if (s.telefoon && !isTelefoon(s.telefoon)) f.telefoon = "Dit telefoonnummer is te kort."

    if (s.reden === "regeling") {
        const n = parseBedrag(s.per_maand)
        if (!n) f.per_maand = "Vul in welk bedrag u per maand kunt betalen."
        if (s.ingang && !isDatum(s.ingang)) f.ingang = "Kies een geldige datum."
    }
    if (s.reden === "betaald") {
        if (!isDatum(s.betaald_op)) f.betaald_op = "Vul de datum van uw betaling in."
        if (!parseBedrag(s.betaald_bedrag)) f.betaald_bedrag = "Vul het bedrag in dat u heeft betaald."
    }
    if (s.reden === "oneens" && schoon(s.toelichting, 1500).length < 20)
        f.toelichting = "Vertel in een paar zinnen waarom u het niet eens bent."
    if (s.reden === "anders" && schoon(s.toelichting, 1500).length < 10) f.toelichting = "Vertel kort waar uw vraag over gaat."
    return f
}

const datumNl = (iso: string) => {
    const [j, m, d] = iso.split("-")
    return j && m && d ? `${d}-${m}-${j}` : iso
}
const euroNl = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** De tekst die ons team in de mail ziet: eerst de feiten, dan de toelichting van de debiteur. */
export function reactieTekst(s: Reactie): string {
    const r = REDENEN.find((x) => x.key === s.reden)
    const regels = [`Debiteur via /brief-ontvangen: ${r?.kop ?? "Reactie"}`, `Dossiernummer: ${normDossier(s.dossier)}`]
    if (s.reden === "regeling") {
        regels.push(`Voorstel: ${euroNl(parseBedrag(s.per_maand))} per maand`)
        if (s.ingang) regels.push(`Eerste betaling: ${datumNl(s.ingang)}`)
        if (s.schuldhulp) regels.push("Heeft een schuldhulpverlener of bewindvoerder")
    }
    if (s.reden === "betaald") {
        regels.push(`Betaald op: ${datumNl(s.betaald_op)}`, `Bedrag: ${euroNl(parseBedrag(s.betaald_bedrag))}`)
    }
    const t = schoon(s.toelichting, 1500)
    if (t) regels.push(`Toelichting: ${t}`)
    // één regel met scheidingstekens: het contactcontract maakt van witruimte (ook regeleinden) één spatie
    return regels.join(" | ")
}

/** Zelfde contract als het contactformulier (worker /api/contact), onderwerp "Bestaand dossier". */
export function bouwReactiePayload(
    s: Reactie,
    ctx: { nonce: string; turnstileToken: string; pagina: string; referrer: string; utm: URLSearchParams },
) {
    const c: ContactState = {
        ...leegContact(),
        onderwerp: "bestaand_dossier",
        naam: schoon(s.naam, 120),
        // de worker vraagt een bedrijfsnaam; een particulier heeft die niet, dan gaat de naam mee
        bedrijfsnaam: schoon(s.naam, 120),
        email: s.email,
        telefoon: normTelefoon(s.telefoon),
        voorkeur: s.voorkeur,
        toelichting: reactieTekst(s),
        dossiernummer: normDossier(s.dossier),
    }
    const p = bouwContactPayload(c, ctx)
    return { ...p, metadata: { ...p.metadata, cta: `brief-${s.reden}` } }
}
