# Livegang: van Framer naar de nieuwe site

Draaiboek voor het omzetten van geldgarant.com van Framer naar de Cloudflare Worker "website". Alleen uitvoeren samen met Anas. Opgesteld 7 nov 2026; DNS-gegevens die dag nagelopen.

## Huidige situatie (7 nov 2026)

| Record               | Waarde                                                   | Bij de overstap   |
| -------------------- | -------------------------------------------------------- | ----------------- |
| NS                   | `heather.ns.cloudflare.com`, `dane.ns.cloudflare.com`    | Niet aanraken     |
| A `geldgarant.com`   | `31.43.160.6`, `31.43.161.6` (Framer)                    | Verwijderen       |
| CNAME `www`          | `sites.framer.app`                                       | Verwijderen       |
| MX                   | Google Workspace (`aspmx.l.google.com` en alternatieven) | **Niet aanraken** |
| TXT                  | SPF (`include:mailgun.org include:_spf.google.com`)      | **Niet aanraken** |
| TXT                  | `google-site-verification=…` (Search Console via DNS)    | **Niet aanraken** |
| `api.geldgarant.com` | Intake-worker                                            | Niet aanraken     |

Schrijf vóór de overstap alle DNS-records van de zone op (Cloudflare → DNS → Records → Export). Dat is het terugdraaiplan.

## Vooraf (dagen ervoor)

1. Akkoord van Anas op alle pagina's en op de AV, privacy- en cookieverklaring. Liefst ook nagelezen door een jurist.
2. Intake-worker `geldgarant-intake-api`:
    - route `POST /api/sollicitatie` geïnstalleerd (projectdocument `claude/intake-worker-sollicitatie-installeren.md`);
    - `ALLOWED_ORIGINS` bevat `https://geldgarant.com` en `https://www.geldgarant.com`;
    - Turnstile-widget kent de hostnames `geldgarant.com` en `www.geldgarant.com`.
3. WhatsApp Business draait op 085 212 73 88 (de site linkt daarheen).
4. `main` is groen: `npm run qa` en `npm run lhci`, Workers Build "website" op `success`.
5. Op staging: `BASIS=https://website.geldgarant.workers.dev node scripts/livegang-check.mjs` geeft "Alles in orde".
6. Kies een rustig moment (avond of weekend). De overstap duurt een paar minuten; reken op maximaal een kwartier waarin de site even niet of nog via Framer laadt.

## De overstap (± 15 minuten)

1. **Framer**: Site settings → Domains → het eigen domein loskoppelen. De Framer-site blijft bereikbaar op het framer-adres; dat is de terugvaloptie. Niet verwijderen of depubliceren.
2. **Cloudflare → DNS**: verwijder de twee A-records van `geldgarant.com` en de CNAME `www`. Laat MX en TXT staan.
3. **Cloudflare → Workers & Pages → website → Settings → Domains & Routes → Add → Custom domain**: voeg `geldgarant.com` toe, daarna `www.geldgarant.com`. Cloudflare maakt de DNS-records en het certificaat zelf aan.
4. **Cloudflare → Rules → Redirect Rules**: maak de regel "www naar root" (sjabloon _Redirect from WWW to root_): `www.geldgarant.com/*` → `https://geldgarant.com/${1}`, status 301, querystring behouden.
5. Wacht tot het certificaat actief is (meestal binnen een paar minuten; status zichtbaar bij Custom domains).

## Direct na de overstap

1. `node scripts/livegang-check.mjs`: alle oude Framer-URL's (56 plus footerpagina's), de redirects, headers, canonical en het telefoonnummer. Moet eindigen op "Alles in orde".
2. `curl -sI https://www.geldgarant.com/` geeft 301 naar `https://geldgarant.com/`; `curl -sI https://geldgarant.com/` toont `server: cloudflare` en geen `Framer`.
3. Formulieren echt testen, met duidelijk herkenbare testgegevens:
    - `/vordering-indienen` met een kleine testfactuur;
    - `/contact-opnemen` (onderwerp Algemene vraag);
    - een sollicitatie met een test-cv.

    Controleer dat de e-mails binnenkomen en dat Turnstile niet blokkeert. Verwijder de testdossiers daarna uit KV en CaseControl.

4. Telefoon- en WhatsApp-knop op een telefoon proberen.
5. Google Search Console (domeineigendom staat al via DNS):
    - Sitemaps → `https://geldgarant.com/sitemap-index.xml` indienen (de oude `/sitemap.xml` stuurt door);
    - URL-inspectie op de homepage en op één kennisbankartikel → "Indexering aanvragen".
6. Deelvoorbeeld controleren (OG-beeld), bijvoorbeeld met de LinkedIn Post Inspector op de homepage en op `/juridisch/algemene-voorwaarden`.

## Daarna (eerste week)

- Search Console dagelijks: dekking, 404's, Core Web Vitals. Een 404 op een oude URL → regel toevoegen in `public/_redirects` (en `tests/unit/redirects.test.ts` draait mee).
- Staging (`website.geldgarant.workers.dev`) blijft bestaan, met canonical naar geldgarant.com. Wil je dubbele indexering helemaal uitsluiten, zet dan in `wrangler.jsonc` `workers_dev` op `false`; previews per commit blijven werken via `preview_urls`.
- Uptime: een externe controle op `https://geldgarant.com/` en `https://api.geldgarant.com/api/health` (bijvoorbeeld Cloudflare Health Checks). Geen bezoekersstatistieken toevoegen zonder eerst de cookie- en privacyverklaring aan te passen.
- De Framer-site pas opzeggen als de nieuwe site een maand zonder problemen draait.

## Terugdraaien (± 10 minuten)

Alleen als de site na de overstap niet werkt en het niet binnen een half uur op te lossen is.

1. Cloudflare → Workers & Pages → website → Domains & Routes: verwijder `geldgarant.com` en `www.geldgarant.com`.
2. Cloudflare → DNS: zet terug wat je hebt geëxporteerd: A `geldgarant.com` → `31.43.160.6` en `31.43.161.6`, CNAME `www` → `sites.framer.app`. Kopieer de proxy-instelling (oranje of grijze wolk) exact uit de export.
3. Framer → Domains: het domein opnieuw koppelen en wachten tot Framer het als verbonden toont.
4. Redirect-regel www → root uitzetten als Framer zelf www afhandelt.

## Periodiek (ook na de livegang)

- 1 januari en 1 juli: wettelijke rente (`src/lib/rente.ts` + artikel), beslagvrije voet.
- 1 januari: griffierechten.
- Jaarlijks: telefoonnummers op `/hulp-nodig-bij-geldproblemen`, links in de kennisbank (`npm run check:links`).
- Bij elke wijziging van een tarief: site én AV aanpassen, daarna `node scripts/juridisch-pdf.mjs`.
