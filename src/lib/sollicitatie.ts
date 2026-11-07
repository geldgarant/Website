// Sollicitatieformulier (vacatures en open sollicitatie): validatie en verzenden naar de intake-worker.
// Endpoint POST /api/sollicitatie (multipart): velden functie, naam, email, telefoon, motivatie, akkoord,
// nonce, turnstile_token en het bestand "cv". Header X-Request-Nonce = nonce. Antwoord { ok, accepted, requestId }.
// De worker bewaart sollicitaties vier weken (zie werkenFaq) en mailt GeldGarant met het cv als bijlage.
import { ApiFout, isEmail, isTelefoon, type Fouten } from "./intake"

export const SOLLICITATIE_ACTION = "sollicitatie_submit"
export const CV_MAX_BYTES = 10 * 1024 * 1024
export const CV_TYPES: Record<string, string> = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
}
export const CV_ACCEPT =
    ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export interface SollicitatieState {
    naam: string
    email: string
    telefoon: string
    motivatie: string
    akkoord: boolean
}

export const leegSollicitatie = (): SollicitatieState => ({ naam: "", email: "", telefoon: "", motivatie: "", akkoord: false })

// Sommige browsers geven bij Word-bestanden geen of een algemeen type mee; dan beslist de extensie.
export function cvSoort(file: { name: string; type: string }): string | null {
    if (CV_TYPES[file.type]) return CV_TYPES[file.type]
    const ext = file.name.toLowerCase().split(".").pop() ?? ""
    return ["pdf", "doc", "docx"].includes(ext) ? ext : null
}

export function valideerCv(file: { name: string; type: string; size: number } | null): string | null {
    if (!file) return "Voeg uw cv toe."
    if (!cvSoort(file)) return "Uw cv moet een PDF- of Word-bestand zijn."
    if (file.size > CV_MAX_BYTES) return "Uw cv is groter dan 10 MB."
    if (file.size === 0) return "Dit bestand is leeg."
    return null
}

export function valideerSollicitatie(s: SollicitatieState, cv: { name: string; type: string; size: number } | null): Fouten {
    const f: Fouten = {}
    if (s.naam.trim().length < 2) f.naam = "Vul uw naam in."
    if (!isEmail(s.email)) f.email = "Vul een geldig e-mailadres in."
    if (!isTelefoon(s.telefoon)) f.telefoon = "Vul een telefoonnummer in waarop we u kunnen bellen."
    if (s.motivatie.length > 2000) f.motivatie = "Houd uw motivatie korter dan 2.000 tekens."
    const cvFout = valideerCv(cv)
    if (cvFout) f.cv = cvFout
    if (!s.akkoord) f.akkoord = "Geef toestemming om uw gegevens voor deze sollicitatie te gebruiken."
    return f
}

export async function verstuurSollicitatie(
    base: string,
    s: SollicitatieState,
    cv: File,
    ctx: { functie: string; nonce: string; turnstileToken: string; pagina: string },
): Promise<{ requestId: string }> {
    const fd = new FormData()
    fd.append("functie", ctx.functie.slice(0, 120))
    fd.append("naam", s.naam.trim().slice(0, 120))
    fd.append("email", s.email.trim().toLowerCase().slice(0, 200))
    fd.append("telefoon", s.telefoon.trim().slice(0, 30))
    fd.append("motivatie", s.motivatie.trim().slice(0, 2000))
    fd.append("akkoord", s.akkoord ? "ja" : "nee")
    fd.append("nonce", ctx.nonce)
    fd.append("bron_pagina", ctx.pagina.slice(0, 255))
    if (ctx.turnstileToken) fd.append("turnstile_token", ctx.turnstileToken)
    fd.append("cv", cv, cv.name)
    const res = await fetch(`${base}/api/sollicitatie`, { method: "POST", headers: { "X-Request-Nonce": ctx.nonce }, body: fd })
    const d = ((await res.json().catch(() => null)) as Record<string, unknown> | null) ?? {}
    if (res.ok && d.ok && d.accepted !== false) return { requestId: String(d.requestId || "") }
    if (d.accepted === false && d.requestId)
        throw new ApiFout(String(d.error || "ontvangen-niet-gemeld"), res.status, String(d.requestId))
    throw new ApiFout(String(d.error || "Versturen is mislukt."), res.status)
}
