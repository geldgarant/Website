// Vordering indienen: validatie, payload en API-aanroepen naar de intake-worker (api.geldgarant.com).
// Contract: zie claude/intake-worker-index.js in de projectdocs (handleSession, handleUpload, handleSubmit).
// Puur en testbaar; de DOM-logica staat in src/scripts/vordering.ts.

export const API_BASE = "https://api.geldgarant.com"
export const TURNSTILE_SITE_KEY = "0x4AAAAAACzginGi5pgJr1Ux"
export const TURNSTILE_ACTION = "incasso_submit"
export const MAX_FILES = 5
export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const

export interface Adres {
    straat: string
    huisnummer: string
    postcode: string
    plaats: string
}

export interface FormState {
    // stap 1: factuur
    bedrag: string
    factuurnummer: string
    vervaldatum: string
    omschrijving: string
    // stap 2: debiteur
    debiteur_soort: "bedrijf" | "particulier"
    debiteur_naam: string
    debiteur_email: string
    debiteur_telefoon: string
    debiteur_adres: Adres
    // stap 3: opdrachtgever
    bedrijfsnaam: string
    kvk: string
    btw_plichtig: "ja" | "nee"
    iban: string
    bedrijf_adres: Adres
    aanspreektitel: string
    voornaam: string
    achternaam: string
    email: string
    telefoon: string
    // stap 4
    akkoord: boolean
}

export const leegAdres = (): Adres => ({ straat: "", huisnummer: "", postcode: "", plaats: "" })

export const leegFormulier = (): FormState => ({
    bedrag: "",
    factuurnummer: "",
    vervaldatum: "",
    omschrijving: "",
    debiteur_soort: "bedrijf",
    debiteur_naam: "",
    debiteur_email: "",
    debiteur_telefoon: "",
    debiteur_adres: leegAdres(),
    bedrijfsnaam: "",
    kvk: "",
    btw_plichtig: "ja",
    iban: "",
    bedrijf_adres: leegAdres(),
    aanspreektitel: "",
    voornaam: "",
    achternaam: "",
    email: "",
    telefoon: "",
    akkoord: false,
})

// ---------- normaliseren ----------

const schoon = (v: string, max = 200) =>
    String(v ?? "")
        // eslint-disable-next-line no-control-regex -- stuurtekens bewust verwijderen
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max)

/** "2.500,50", "2500,50", "2500.50" en "2.500" worden allemaal goed gelezen. */
export function parseBedrag(v: string): number {
    let s = String(v ?? "").replace(/[^\d,.]/g, "")
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".")
    else if (/\.\d{3}(\.|$)/.test(s)) s = s.replace(/\./g, "")
    const n = parseFloat(s)
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0
}

export const normPostcode = (v: string) => {
    const s = String(v ?? "")
        .toUpperCase()
        .replace(/\s+/g, "")
    return /^\d{4}[A-Z]{2}$/.test(s) ? `${s.slice(0, 4)} ${s.slice(4)}` : schoon(v, 12)
}
export const normIban = (v: string) =>
    String(v ?? "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
export const normTelefoon = (v: string) =>
    String(v ?? "")
        .replace(/[^0-9+\s()-]/g, "")
        .trim()
        .slice(0, 30)

// ---------- validatie ----------

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v ?? "").trim())
export const isTelefoon = (v: string) => normTelefoon(v).replace(/\D/g, "").length >= 9
export const isKvk = (v: string) => /^\d{8}$/.test(String(v ?? "").replace(/\s/g, ""))

/** IBAN-controle volgens ISO 13616 (mod 97). */
export function isIban(v: string): boolean {
    const s = normIban(v)
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false
    if (s.startsWith("NL") && s.length !== 18) return false
    const r = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55))
    let rest = 0
    for (const d of r) rest = (rest * 10 + Number(d)) % 97
    return rest === 1
}

export type Fouten = Partial<Record<string, string>>

export function valideerStap(stap: number, s: FormState): Fouten {
    const f: Fouten = {}
    if (stap === 1) {
        const b = parseBedrag(s.bedrag)
        if (!(b > 0)) f.bedrag = "Vul het openstaande bedrag in."
        else if (b > 10_000_000) f.bedrag = "Dat bedrag is te hoog voor het formulier. Bel ons, dan helpen we u direct."
        if (s.vervaldatum && !/^\d{4}-\d{2}-\d{2}$/.test(s.vervaldatum)) f.vervaldatum = "Kies een geldige datum."
    }
    if (stap === 2) {
        if (!schoon(s.debiteur_naam)) f.debiteur_naam = "Vul de naam van uw klant in."
        if (s.debiteur_email && !isEmail(s.debiteur_email)) f.debiteur_email = "Dit e-mailadres klopt niet."
        if (s.debiteur_telefoon && !isTelefoon(s.debiteur_telefoon)) f.debiteur_telefoon = "Dit telefoonnummer is te kort."
        const a = s.debiteur_adres
        const heeftAdres = Boolean(schoon(a.straat) && schoon(a.plaats))
        if (!s.debiteur_email && !s.debiteur_telefoon && !heeftAdres)
            f.debiteur_contact = "Vul minstens één manier in om uw klant te bereiken: e-mail, telefoon of adres."
    }
    if (stap === 3) {
        if (!schoon(s.bedrijfsnaam)) f.bedrijfsnaam = "Vul uw bedrijfsnaam in."
        if (s.kvk && !isKvk(s.kvk)) f.kvk = "Een KvK-nummer heeft 8 cijfers."
        if (s.iban && !isIban(s.iban)) f.iban = "Dit IBAN klopt niet. Controleer de cijfers."
        if (!schoon(s.voornaam)) f.voornaam = "Vul uw voornaam in."
        if (!schoon(s.achternaam)) f.achternaam = "Vul uw achternaam in."
        if (!isEmail(s.email)) f.email = "Vul een geldig e-mailadres in."
        if (!isTelefoon(s.telefoon)) f.telefoon = "Vul uw telefoonnummer in, dan kunnen we u bellen bij vragen."
    }
    if (stap === 4) {
        if (!s.akkoord) f.akkoord = "Ga akkoord met de voorwaarden en het privacybeleid om te versturen."
    }
    return f
}

export function valideerBestand(file: { name: string; type: string; size: number }): string | null {
    if (!(FILE_TYPES as readonly string[]).includes(file.type)) return `${file.name}: alleen pdf, jpg, png of webp.`
    if (file.size > MAX_FILE_BYTES) return `${file.name}: groter dan 10 MB.`
    return null
}

// ---------- payload ----------

export interface Document {
    naam: string
    grootte: number
    type: string
    storage_path: string
}

const adresUit = (a: Adres): Adres => ({
    straat: schoon(a.straat, 120),
    huisnummer: schoon(a.huisnummer, 12),
    postcode: normPostcode(a.postcode),
    plaats: schoon(a.plaats, 80),
})

export function bouwPayload(
    s: FormState,
    ctx: { nonce: string; sessionToken: string; dossierId: string; documenten: Document[]; duurSec: number },
) {
    const soort = s.debiteur_soort === "particulier" ? "Particulier" : "Bedrijf"
    const omschrijving = [`Soort debiteur: ${soort}`, schoon(s.omschrijving, 1500)].filter(Boolean).join("\n")
    return {
        type: "incasso_aanvraag" as const,
        nonce: ctx.nonce,
        session_token: ctx.sessionToken,
        dossier_id: ctx.dossierId,
        aanvrager: {
            aanspreektitel: schoon(s.aanspreektitel, 20),
            voornaam: schoon(s.voornaam, 80),
            achternaam: schoon(s.achternaam, 120),
            email: schoon(s.email, 200).toLowerCase(),
            telefoon: normTelefoon(s.telefoon),
        },
        bedrijf: {
            naam: schoon(s.bedrijfsnaam, 200),
            kvk: String(s.kvk ?? "")
                .replace(/\s/g, "")
                .slice(0, 8),
            btw_plichtig: s.btw_plichtig === "ja",
            iban: normIban(s.iban),
            adres: adresUit(s.bedrijf_adres),
        },
        vordering: {
            debiteur: {
                naam: schoon(s.debiteur_naam, 200),
                email: schoon(s.debiteur_email, 200).toLowerCase(),
                telefoon: normTelefoon(s.debiteur_telefoon),
                adres: adresUit(s.debiteur_adres),
            },
            factuurnummer: schoon(s.factuurnummer, 60),
            bedrag: parseBedrag(s.bedrag),
            vervaldatum: /^\d{4}-\d{2}-\d{2}$/.test(s.vervaldatum) ? s.vervaldatum : "",
            omschrijving,
            documenten: ctx.documenten,
        },
        toestemmingen: { akkoord_av: s.akkoord, akkoord_avg: s.akkoord },
        metadata: { ingediend_op: new Date().toISOString(), bron: "website", formulier_duur_sec: Math.round(ctx.duurSec) },
    }
}

// ---------- API ----------

export function maakNonce(): string {
    const a = new Uint8Array(16)
    crypto.getRandomValues(a)
    return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("")
}

export class ApiFout extends Error {
    constructor(
        message: string,
        public status: number,
        public dossierId?: string,
    ) {
        super(message)
    }
}

async function lees(res: Response): Promise<Record<string, unknown>> {
    return ((await res.json().catch(() => null)) as Record<string, unknown> | null) ?? {}
}

export async function startSessie(base: string, nonce: string, turnstileToken: string) {
    const res = await fetch(`${base}/api/incasso-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, turnstile_token: turnstileToken }),
    })
    const d = await lees(res)
    if (!res.ok || !d.ok)
        throw new ApiFout(String(d.error || "De beveiligingscheck is mislukt. Probeer het opnieuw."), res.status)
    return { dossierId: String(d.dossierId), sessionToken: String(d.sessionToken) }
}

export async function uploadBestanden(
    base: string,
    files: File[],
    ctx: { nonce: string; sessionToken: string; dossierId: string },
): Promise<Document[]> {
    if (!files.length) return []
    const fd = new FormData()
    fd.append("dossier_id", ctx.dossierId)
    fd.append("nonce", ctx.nonce)
    fd.append("session_token", ctx.sessionToken)
    files.forEach((f) => fd.append("bestanden", f, f.name))
    const res = await fetch(`${base}/api/incasso-upload`, { method: "POST", body: fd })
    const d = await lees(res)
    if (!res.ok || !d.ok) throw new ApiFout(String(d.error || "Uploaden is mislukt."), res.status)
    return (d.bestanden as Document[]) ?? []
}

export async function ruimBestandenOp(base: string, ctx: { sessionToken: string; dossierId: string }, paths: string[]) {
    if (!paths.length) return
    await fetch(`${base}/api/incasso-upload`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dossier_id: ctx.dossierId, session_token: ctx.sessionToken, storage_paths: paths }),
    }).catch(() => undefined)
}

export async function verstuur(base: string, payload: ReturnType<typeof bouwPayload>) {
    const res = await fetch(`${base}/api/incasso-aanvragen`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Request-Nonce": payload.nonce },
        body: JSON.stringify(payload),
    })
    const d = await lees(res)
    if (res.ok && d.ok && d.accepted !== false) return { dossierId: String(d.dossierId || payload.dossier_id) }
    // accepted:false = ontvangen en bewaard, maar het team is (nog) niet gemaild
    if (d.accepted === false && d.dossierId) throw new ApiFout("ontvangen-niet-gemeld", res.status, String(d.dossierId))
    throw new ApiFout(String(d.error || "Versturen is mislukt."), res.status)
}

export interface AdresSuggestie {
    id: string
    label: string
    street: string
    houseNumber: string
    postcode: string
    city: string
}

export async function zoekAdres(base: string, q: string, signal?: AbortSignal): Promise<AdresSuggestie[]> {
    if (q.trim().length < 3) return []
    const res = await fetch(`${base}/api/location/search?q=${encodeURIComponent(q.trim())}&limit=5`, { signal })
    if (!res.ok) return []
    const d = await res.json().catch(() => [])
    return Array.isArray(d) ? (d as AdresSuggestie[]) : []
}
