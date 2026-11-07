# GeldGarant Intake API: setup

Vervangt de code van de bestaande worker **geldgarant-intake-api** in het GeldGarant Cloudflare-account.
De oude code hing af van accounts van de externe bouwer (Supabase, Trigger.dev, Airtable). Deze versie gebruikt alleen diensten die jullie zelf beheren.

Omdat dezelfde worker en route (`api.geldgarant.com/api/*`) blijven, verandert er **niets in Framer**. Het formulier, het endpoint en de Turnstile-sleutel blijven zoals ze zijn.

**Wat het doet**
- **Incassoformulier:** controleert de Cloudflare-check, maakt een dossiernummer aan (`GG-2026-01234`) en slaat de bijlagen op. De klant krijgt een bevestigingsmail van `noreply@geldgarant.com`. Jullie krijgen een mail met alle gegevens en de PDF's, plus een Telegram-melding.
- **Contactformulier** (`/api/contact`): de afzender krijgt een bevestiging, jullie krijgen een mail en een Telegram-melding.
- **Adres zoeken** via PDOK (Kadaster, gratis).
- **Backup:** elke aanvraag wordt ook opgeslagen in KV, zodat er niets verloren gaat als het mailen mislukt.

**Kosten:** €0. Cloudflare Workers en KV vallen in het gratis plan, Resend is gratis tot 3.000 mails per maand, Telegram is gratis.

---

## Stap 1. Resend, voor de noreply-mail (10 min)
1. Maak een account op resend.com met een GeldGarant-mailadres.
2. **Domains** → **Add domain** → `geldgarant.com`, regio **Ireland (eu-west-1)**.
3. Resend toont een aantal DNS-records. Zet ze in Cloudflare → geldgarant.com → **DNS** → **Records**:
   - **`resend._domainkey` (TXT) bestaat al**, nog van het account van de bouwer. Klik op **Edit** en vervang de inhoud door de nieuwe waarde uit Resend. Maak er geen tweede bij.
   - De overige records (MX en TXT op `send`) voeg je toe als nieuw record. Zet de **Proxy-status op DNS only** (grijze wolk).
   - Laat de MX-records van Google en Mailgun staan.
4. Klik in Resend op **Verify**.
5. Ga naar **API Keys** → **Create** → kies *Sending access* → kopieer de key (`re_...`).

## Stap 2. Telegram-bot voor meldingen (5 min, optioneel)
1. Stuur in Telegram een bericht naar **@BotFather** → `/newbot` → geef hem een naam → kopieer het **token**.
2. Stuur je nieuwe bot een willekeurig bericht. Voor een groep: voeg de bot toe aan de groep en stuur daar een bericht.
3. Open `https://api.telegram.org/botJOUWTOKEN/getUpdates` in je browser en zoek `"chat":{"id": ...}`. Dat getal is je **chat id**. Bij een groep begint het met `-`.

## Stap 3. KV-opslag aanmaken en koppelen
1. Cloudflare → **Storage & databases** → **KV** → **Create** → naam `geldgarant-intake`.
2. Ga naar Workers → **geldgarant-intake-api** → **Settings** → **Bindings** → **Add** → **KV namespace**.
   - Variable name: `INTAKE` (precies zo)
   - Namespace: `geldgarant-intake`

## Stap 4. Variabelen toevoegen
Ga naar de worker → **Settings** → **Variables and Secrets** → **Add**.
Laat de bestaande variabelen staan. `TURNSTILE_SECRET_KEY` en `INTAKE_SESSION_SECRET` worden gewoon hergebruikt.

| Naam | Type | Waarde |
|---|---|---|
| `RESEND_API_KEY` | Secret | Key uit stap 1 |
| `TELEGRAM_BOT_TOKEN` | Secret | Token uit stap 2 |
| `TELEGRAM_CHAT_ID` | Text | Chat id uit stap 2 |
| `MAIL_FROM` | Text | `GeldGarant <noreply@geldgarant.com>` |
| `MAIL_TO_INTERNAL` | Text | Het adres waar aanvragen binnen moeten komen (meerdere adressen scheiden met een komma) |
| `MAIL_REPLY_TO` | Text | `info@geldgarant.com` |
| `CONTACT_EMAIL` | Text | `info@geldgarant.com` |
| `CONTACT_PHONE` | Text | `06 14 82 37 19` |
| `PUBLIC_BASE_URL` | Text | `https://api.geldgarant.com` |

Staan `TURNSTILE_SECRET_KEY` en `INTAKE_SESSION_SECRET` er niet? Voeg ze dan toe. Voor `INTAKE_SESSION_SECRET` gebruik je een willekeurige string van minstens 40 tekens. De Turnstile-secret vind je bij Cloudflare → **Turnstile** → je widget → **Settings**.

## Stap 5. De code vervangen
1. Kopieer **eerst** de huidige code als backup. Die heb je al als .txt-bestand.
2. Ga naar de worker → **Edit code** → selecteer alles in `index.js` en verwijder het → plak de volledige inhoud van `src/index.js` → **Deploy**.
3. Gaat er iets mis, dan zet je de oude versie terug via **Deployments** → oudere versie → **Rollback**.

**Check:** open `https://api.geldgarant.com/api/health` op je telefoon. Onder `config` moet alles `true` zijn.

## Stap 6. Testen
Test vanaf je telefoon (5G) of een andere computer, want je huidige pc bereikte de worker niet.
- **Incassoformulier** met je eigen mail en een PDF. Je hoort te krijgen: een dossiernummer in beeld, een bevestigingsmail, een interne mail met de PDF en een Telegram-melding.
- **Contactformulier:** een bevestigingsmail, een interne mail en een Telegram-melding.

Werkt het niet? Kijk bij de worker → **Observability**. Elke fout staat daar met een leesbare reden, bijvoorbeeld "Resend fout 403 domain not verified".

---

## Verschillen met de oude backend
- **Geen Airtable, Supabase en CaseControl-sync meer.** Het dossier zet je zelf in CaseControl aan de hand van de mail. Een directe CaseControl-koppeling kan later worden toegevoegd.
- **Geen automatisch portaalaccount.** Het wachtwoord dat de klant kiest wordt niet opgeslagen en niet gemaild. De interne mail meldt dat je het account handmatig moet aanmaken.
- **De oude interne routes** `/api/internal/portal-provisioning/*` bestaan niet meer.

## API-contract
| Methode | Pad | Antwoord |
|---|---|---|
| POST | `/api/incasso-session` | `{ok, dossierId, sessionToken}` |
| POST/DELETE | `/api/incasso-upload` | `{ok, bestanden[]}` / `{ok, removed}` |
| POST | `/api/incasso-aanvragen` | `{ok, accepted, dossierId}` |
| POST | `/api/contact` | `{ok, accepted, requestId}` |
| GET | `/api/location/search?q=..&limit=5` | `[{id,label,street,houseNumber,postcode,city}]` |
| GET | `/api/health` | configuratiestatus |
