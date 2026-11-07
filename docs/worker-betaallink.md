# Worker-route `POST /api/betaallink` (direct betalen op /brief-ontvangen)

Met deze route betaalt een debiteur direct vanaf geldgarant.com/brief-ontvangen, zonder eerst naar het debiteurenportaal
te gaan. De worker `geldgarant-intake-api` vraagt de betaallink bij CaseControl op en geeft die terug aan de site.

**Eerst navragen bij CaseControl** (afspraak, geen techniek): mogen wij de portaal-API `POST /pay` vanaf onze eigen server
aanroepen? Het is dezelfde aanroep die het portaal zelf doet (zie hieronder), maar het is hun API.

## Wat CaseControl doet (nagelopen in de portaalcode, 7 nov 2026)

- Portaal: `https://geldgarant.debtorportal.com` (Vue-app). API-basis: `https://api.casecontrol.app/api/portal/debtor/v1/geldgarant/`
  (het laatste deel is het subdomein van het portaal).
- `GET  …/portalinfo/basic` → `{"displayName":"GeldGarant","paymentLinkEnabled":true}`
- `POST …/pay` met JSON `{ "caseNumber": "<dossiernummer>", "amount": <bedrag> }` → `{ "url": "<betaalpagina>" }`.
  Geen inlog nodig. Minimaal € 5 (zo staat het in het portaal). Onbekend dossiernummer → HTTP 404.
- Het portaal heeft ook `/paymentplan?token=…` (regelingsvoorstel per dossier, link maakt CaseControl zelf).

## Installeren (één plakactie plus één regel)

1. Cloudflare → Workers & Pages → `geldgarant-intake-api` → Edit code.
2. Zoek in `export default { async fetch(...)` de `switch (route)` en zet er deze case bij, naast `POST /api/contact`:

```js
                case "POST /api/betaallink":
                    res = await handleBetaallink(request, env)
                    break
```

3. Plak onderaan het bestand deze functie:

```js
// ─────────────────────────────────────────────────────────────────────────────
// Direct betalen (debiteur): betaallink opvragen bij CaseControl
// ─────────────────────────────────────────────────────────────────────────────

async function handleBetaallink(request, env) {
    const p = await readJson(request)
    const dossier = String((p && p.dossiernummer) || "")
        .toUpperCase()
        .replace(/\s+/g, "")
        .replace(/[^A-Z0-9\-/.]/g, "")
        .slice(0, 30)
    const bedrag = Math.round(Number(p && p.bedrag) * 100) / 100
    if (!/^[A-Z0-9][A-Z0-9\-/.]{2,29}$/.test(dossier)) return json({ ok: false, error: "dossiernummer" }, 400)
    if (!Number.isFinite(bedrag) || bedrag < 5 || bedrag > 250000) return json({ ok: false, error: "bedrag" }, 400)

    const tenant = env.CASECONTROL_PORTAL || "geldgarant"
    let r
    try {
        r = await fetch(`https://api.casecontrol.app/api/portal/debtor/v1/${tenant}/pay`, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ caseNumber: dossier, amount: bedrag }),
        })
    } catch (e) {
        console.error("CaseControl onbereikbaar", e)
        return json({ ok: false, error: "onbereikbaar" }, 502)
    }
    if (r.status === 404) return json({ ok: false, error: "niet-gevonden" }, 404)
    const data = await r.json().catch(() => ({}))
    const url = String((data && data.url) || "")
    if (!r.ok || !/^https:\/\/\S+$/.test(url)) {
        console.error("CaseControl /pay fout", r.status, JSON.stringify(data).slice(0, 300))
        return json({ ok: false, error: "betaallink-mislukt" }, 502)
    }
    // Bewust geen opslag en geen melding: er gaan geen persoonsgegevens door, alleen dossiernummer en bedrag.
    return json({ ok: true, url })
}
```

4. Deploy.
5. Testen (met een echt dossiernummer uit CaseControl):

```bash
curl -s -X POST https://api.geldgarant.com/api/betaallink \
  -H "Origin: https://geldgarant.com" -H "Content-Type: application/json" \
  -d '{"dossiernummer":"<nummer>","bedrag":5}'
```

Verwacht: `{"ok":true,"url":"https://…"}`. Open de URL niet om te betalen, tenzij u het testbedrag echt wilt betalen.

6. Site aanzetten: in `src/data/site.ts` zet je `betaalLinkApi: "https://api.geldgarant.com/api/betaallink"`, daarna pushen.
   Vanaf dan stuurt de knop "Nu betalen" direct door naar de betaalpagina. Lukt de koppeling een keer niet, dan krijgt
   de bezoeker vanzelf de route via het portaal (zelfde als nu).

## Daarna (optioneel)

- **Terugkeer-URL**: vraag CaseControl of de betaalprovider na betaling kan terugsturen naar
  `https://geldgarant.com/brief-ontvangen/bedankt` (geslaagd) en `/brief-ontvangen/mislukt` (geannuleerd of mislukt).
  Beide pagina's staan klaar (noindex, niet in de sitemap).
- **Link of QR-code in brieven en e-mails**: `https://geldgarant.com/brief-ontvangen?dossier=<dossiernummer>&bedrag=<openstaand>`
  vult het betaalformulier vooraf in (ook `?d=` en `?b=`). Met `?reden=regeling#regelen` opent het regelingsformulier.
- **Origins**: de route gebruikt dezelfde `ALLOWED_ORIGINS` als `/api/contact`. Voor testen vanaf staging moet
  `https://website.geldgarant.workers.dev` daar ook in staan.
