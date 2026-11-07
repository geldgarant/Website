// POST /api/betalen  { dossiernummer, bedrag }  →  { ok: true, url }  (iDEAL-betaalpagina van CaseControl)
// GET  /api/betalen                             →  controle of de koppeling met CaseControl werkt (zonder gegevens)
//
// Zelfde aanroep als het CaseControl-debiteurenportaal doet bij "Maak een betaling" (nagelopen 7 nov 2026):
// POST https://api.casecontrol.app/api/portal/debtor/v1/<portaal>/pay  { caseNumber, amount }  →  { url }
// Onbekend dossiernummer → 404. Na betaling boekt CaseControl de betaling zelf op het dossier.
// Er wordt niets opgeslagen of gelogd behalve foutcodes: alleen dossiernummer en bedrag gaan door.
import { normDossier, isDossier, BETAAL_MIN, BETAAL_MAX } from "../src/lib/debiteur"

export interface BetaalEnv {
    /** Subdomein van het CaseControl-portaal (geldgarant.debtorportal.com). */
    CASECONTROL_PORTAL?: string
}

const CC = "https://api.casecontrol.app/api/portal/debtor/v1"
const DOSSIER_TEST = "00-0000" // bestaat nooit; gebruikt door de controle (GET) om /pay zonder gevolgen te testen

const antwoord = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    })

async function vraagLink(portaal: string, dossier: string, bedrag: number, f: typeof fetch) {
    return f(`${CC}/${portaal}/pay`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ caseNumber: dossier, amount: bedrag }),
    })
}

export async function handleBetalen(request: Request, env: BetaalEnv, f: typeof fetch = fetch): Promise<Response> {
    const portaal = (env.CASECONTROL_PORTAL || "geldgarant").replace(/[^a-z0-9-]/gi, "")

    if (request.method === "GET") {
        // Controle: is CaseControl bereikbaar, staat de betaallink aan en antwoordt /pay (verwacht 404 op het testnummer)?
        try {
            const [info, pay] = await Promise.all([
                f(`${CC}/${portaal}/portalinfo/basic`, { headers: { Accept: "application/json" } }),
                vraagLink(portaal, DOSSIER_TEST, BETAAL_MIN, f),
            ])
            const d = (await info.json().catch(() => ({}))) as { paymentLinkEnabled?: boolean }
            const werkt = info.ok && d.paymentLinkEnabled === true && pay.status === 404
            // antwoord van /pay op het testnummer (bevat geen persoonsgegevens), handig bij een storing
            const melding = werkt ? undefined : (await pay.text().catch(() => "")).slice(0, 300)
            return antwoord({ ok: werkt, betaallink: d.paymentLinkEnabled === true, pay: pay.status, melding }, werkt ? 200 : 503)
        } catch {
            return antwoord({ ok: false, error: "onbereikbaar" }, 503)
        }
    }

    if (request.method !== "POST") return antwoord({ ok: false, error: "methode" }, 405)

    // Alleen vanaf onze eigen pagina's (zelfde herkomst). Browsers sturen Origin altijd mee bij een POST.
    const herkomst = request.headers.get("Origin")
    if (herkomst !== new URL(request.url).origin) return antwoord({ ok: false, error: "herkomst" }, 403)
    if (!(request.headers.get("Content-Type") || "").includes("application/json")) {
        return antwoord({ ok: false, error: "formaat" }, 415)
    }

    const tekst = await request.text()
    if (tekst.length > 500) return antwoord({ ok: false, error: "formaat" }, 413)
    let p: { dossiernummer?: unknown; bedrag?: unknown }
    try {
        p = JSON.parse(tekst)
    } catch {
        return antwoord({ ok: false, error: "formaat" }, 400)
    }
    const dossier = normDossier(String(p?.dossiernummer ?? ""))
    const bedrag = Math.round(Number(p?.bedrag) * 100) / 100
    if (!isDossier(dossier)) return antwoord({ ok: false, error: "dossiernummer" }, 400)
    if (!Number.isFinite(bedrag) || bedrag < BETAAL_MIN || bedrag > BETAAL_MAX) {
        return antwoord({ ok: false, error: "bedrag" }, 400)
    }

    let r: Response
    try {
        r = await vraagLink(portaal, dossier, bedrag, f)
    } catch {
        console.error("betalen: CaseControl onbereikbaar")
        return antwoord({ ok: false, error: "onbereikbaar" }, 502)
    }
    if (r.status === 404) return antwoord({ ok: false, error: "niet-gevonden" }, 404)
    const d = (await r.json().catch(() => ({}))) as { url?: unknown }
    const url = typeof d.url === "string" ? d.url : ""
    if (!r.ok || !/^https:\/\/[^\s"<>]+$/.test(url)) {
        console.error("betalen: CaseControl /pay gaf", r.status)
        return antwoord({ ok: false, error: "betaallink-mislukt" }, 502)
    }
    return antwoord({ ok: true, url })
}
