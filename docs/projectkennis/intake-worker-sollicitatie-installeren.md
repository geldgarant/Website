# Sollicitaties met cv: worker bijwerken (7 nov 2026)

De nieuwe site heeft op elke vacature en op /werken-bij een sollicitatieformulier met cv-upload. Dat formulier stuurt naar `POST https://api.geldgarant.com/api/sollicitatie`. Die route moet nog in de worker **geldgarant-intake-api**. Het gaat om twee plakacties, in ongeveer 5 minuten.

## Stap 1. Backup
Cloudflare → **Workers & Pages** → **geldgarant-intake-api** → **Edit code**. Kopieer de hele `index.js` naar een tekstbestand. Dat is je backup.

## Stap 2. Route toevoegen
Zoek in `index.js` (bovenaan, in `switch (route)`) dit blok:

```js
                case "POST /api/contact":
                    res = await handleContact(request, env, ctx)
                    break
```

Plak **direct daaronder**:

```js
                case "POST /api/sollicitatie":
                    res = await handleSollicitatie(request, env, ctx)
                    break
```

## Stap 3. Code toevoegen
Ga naar de **allerlaatste regel** van `index.js` en plak daar de volledige inhoud van `intake-worker-sollicitatie.js`. Klik op **Deploy**.

Er zijn geen nieuwe variabelen nodig. De worker gebruikt dezelfde Resend-, Telegram-, KV- en Turnstile-instellingen.

## Stap 4. Testen
Test vanaf je telefoon (5G), op een vacature op de site, met een PDF of Word-bestand als cv. Je hoort te krijgen:
- een referentie in beeld (GG-SOL-2026-…),
- een bevestigingsmail naar de kandidaat,
- een interne mail met het cv als bijlage,
- een Telegram-melding.

**Werkt het op staging (website.geldgarant.workers.dev) niet?** Dat ligt aan dezelfde twee instellingen als bij de andere formulieren:
- `https://website.geldgarant.workers.dev` moet in `ALLOWED_ORIGINS` staan;
- `website.geldgarant.workers.dev` moet bij de hostnames van de Turnstile-widget staan.

**Gaat er iets mis?** Ga naar **Deployments**, kies de vorige versie en klik op **Rollback**.

## Wat de route doet
- **Beveiliging:** controleert Turnstile (verplicht, met action `sollicitatie_submit`) en de formulier-nonce.
- **Bestand:** accepteert alleen PDF, DOCX en DOC tot 10 MB. Het type wordt gecontroleerd aan de inhoud van het bestand, niet aan de extensie.
- **Bewaren:** sollicitatie en cv blijven **28 dagen** in KV (`sollicitatie/<id>` en `upload/sollicitatie/<id>/…`) en worden daarna automatisch verwijderd. Dat sluit aan op de belofte op de site: "binnen vier weken na afloop verwijderd".
- **Mail:** de interne mail heeft het cv als bijlage plus een ondertekende downloadlink.
