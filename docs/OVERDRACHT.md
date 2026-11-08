# GeldGarant website: complete overdracht (8 nov 2026, SEO fase 4 tot 7 afgerond)

Dit is het startpunt voor een nieuw gesprek of een nieuw project. Het vervangt alle eerdere overdrachten (ook die van 7 nov in Downloads en in het claude.ai-project). Details staan in de repo: `CLAUDE.md`, `docs/seo/SEO_STATE.md` (hervattingspunt SEO), `docs/seo/SEO_MASTERPLAN.md`, `docs/seo/SEO_EVIDENCE.md` (E1 tot E20), `docs/HANDOFF.md` (§6b), `brieven/README.md`, `docs/SITEMAP.md`, `docs/LIVEGANG.md`.

**LIVE sinds 7 nov 2026: https://geldgarant.com** op Cloudflare Worker "website" (www → 301, http → 301 https). Alles staat op `main`; elke push naar `main` is een productie-release via Workers Builds. Staging: https://website.geldgarant.workers.dev. GitHub-CI (`.github/workflows/kwaliteit.yml`) is groen inclusief Lighthouse (steekproef van 16 pagina's, drempel 95).

**SEO-stand (8 nov 2026):** Search Console gekoppeld en sitemap ingediend, 11 URL's ter indexering aangeboden, zes commerciële pagina's verbeterd op basis van GSC-data, kannibalisatie opgelost, interne links op orde, keyword-URL-kaart, Bedrijfsprofiel bijgewerkt, vermeldingen geïnventariseerd, Web Analytics hersteld, IndexNow actief, voorbeeldbrief huurachterstand nieuw. Hervatten: `docs/seo/SEO_STATE.md` → `next_action`.

---

## 1. Startprompt (plak dit in het nieuwe gesprek)

**Variant A: Claude-desktopapp op de Windows-pc (aanbevolen, zo is er sinds 8 nov gewerkt)**

> Open de repository `C:\Users\Ilyas Chattat\code\geldgarant-website` (verplaats de sessie daarheen). Lees alle projectinstructies (CLAUDE.md, docs/OVERDRACHT.md) en daarna docs/seo/SEO_STATE.md, docs/seo/SEO_MASTERPLAN.md en docs/seo/SEO_EVIDENCE.md. Controleer branch, laatste commit en werkboom (`git pull` eerst). Hervat exact bij `next_action` in SEO_STATE. Verifieer bestaand werk voordat je iets herhaalt. Werk autonoom verder volgens de SEO-masterprompt (zelfde regels als in docs/seo/SEO_MASTERPLAN.md): SEO 100% optimaliseren, alles wat mogelijk is doen en duidelijk aangeven wat ik zelf moet doen. Gebruik het ingebouwde browserpaneel voor Search Console, Cloudflare en het Google Bedrijfsprofiel (ik ben daar ingelogd). Laat het weten als het contextvenster op 90% zit; werk dan alle md-bestanden bij en geef een volledige overdracht.

**Variant B: claude.ai-project met cloudsandbox**

> Koppel de repo geldgarant/Website met add_repo (push-toegang), kloon hem naar /home/claude/geldgarant-site en draai `npm ci`. Maak de symlink `ln -sfn /home/claude/geldgarant-site /home/claude/website` en registreer /home/claude/website met register_repo_root, zodat de skills uit .claude/skills laden. Lees daarna dezelfde bestanden als in variant A en hervat bij `next_action`. In de sandbox: `CHROME_PATH=/usr/bin/google-chrome`, `NODE_USE_ENV_PROXY=1` voor de crawler; externe sites (GSC, Cloudflare) zijn daar niet bereikbaar, dus die stappen bewaren voor de desktopapp.

**Twee chats tegelijk (vanaf 8 nov 2026)**: de SEO-chat (desktopapp, `docs/seo/SEO_STATE.md`) en een website-chat (nieuwe functies, ontwerp, brieven, techniek). Afspraken: altijd `git pull --rebase` vóór je begint en vóór elke push; kleine commits; de website-chat wijzigt geen titles, descriptions, H1's of URL's zonder `docs/seo/keyword-url-map.csv` te checken en meldt zulke wijzigingen in `docs/seo/SEO_STATE.md` (sectie "Laatste werkstappen"); de SEO-chat laat ontwerp en functionaliteit aan de website-chat. Nieuwe pagina's: kannibalisatiecheck in de keyword-kaart en een rij toevoegen.

**Projectinstructie** (voor het nieuwe project): "Let me know when we are at 90% context window, then update all my md files we have touched and provide a verbose, detailed handoff that includes files, snippets, line numbers and flows".

---

## 2. Bedrijf en besluiten

- **GeldGarant**: incassobureau voor ondernemers, landelijk, kantoor Keulenstraat 1, 7418 ET Deventer. Eigenaren Anas Chattat en broer Ilyas; hun namen staan nooit op de site of in brieven (ook niet in review-reacties: ondertekening "team GeldGarant").
- **Gegevens**: KvK 90622375; Wki-registratie Justis 00273 (https://www.justis.nl/registers/incassoregister/geldgarant); NowID (ledenlijst nr. 71); geschillencommissie IncassoKlacht.
- **Contact**: 085 212 73 88 (+31852127388); info@geldgarant.com; klachten@geldgarant.com; werkdagen 9.00–17.00 (ook zo in het Bedrijfsprofiel); op werkdagen binnen het uur in behandeling.
- **Derdengelden**: NL57 BUNQ 2188 2124 36, Stichting Beheer Derdengelden GeldGarant, BIC BUNQNL2AXXX. Kenmerk = dossiernummer (jaar-volgnummer, bv. 26-1008). Online alleen iDEAL.
- **Dossiermail**: info@dossiers.geldgarant.com. **Portalen** (CaseControl): opdrachtgevers https://geldgarant.dossierportal.nl, debiteuren https://geldgarant.debtorportal.com (niet meer nodig om te betalen).
- **Mail**: Google Workspace (MX), formulieren via Resend.

**Bindende besluiten**

1. Geen persoonsnamen. Professioneel, gevestigd bureau.
2. Geen "geen callcenter"/"geen keuzemenu"; "direct contact" en "vaste dossierbehandelaar" mogen.
3. Niet te voorzichtig commercieel; kwaliteit, creativiteit, SEO en uitstraling voorop.
4. Niets verzinnen (reviews, logo's, cijfers, certificaten). Voorbeelden altijd als voorbeeld labelen. Google-reviews niet op de site zonder opdracht.
5. "Geregistreerd bij Justis", niet "Erkend". H1 home "Wij halen uw geld wél op". Rechtsvorm nooit noemen. Geen btw-id in de footer.
6. Tarieven: WIK-staffel, geen succesfee; volledig betaald € 0; deels = incassokosten min. € 45, nooit meer dan ontvangen; niets binnen € 0; intrekken min. 10% en min. € 95; curator € 115 excl. btw op verzoek; debiteurenbeheer € 99 / € 199 / € 349 p/m, maandelijks opzegbaar.
7. Landelijk positioneren, geen stadspagina's. Kennisbank zonder datum en disclaimer.
8. Vacatures met salarisindicatie, cv-upload, gegevens na vier weken weg.
9. Klachten door een andere medewerker dan de dossierbehandelaar.
10. **Betalen**: zoals Breyta, direct naar iDEAL, nooit via het portaal.
11. **Brieven**: in de stijl van de site, exact op het vensterraster, met echte CaseControl-variabelen.
12. **SEO** (8 nov): debiteurenverkeer (`/brief-ontvangen`, `/betalen`) is geen acquisitie; titels per intentie (dienstpagina = commercieel, kennisbank = probleemvraag, voorbeeldbrieven = sjabloon); juridische claims alleen met primaire bron.

**Samenwerken met Anas/Ilyas**: Nederlands, direct, praktisch; meerdere stappen per prompt; controle met screenshots; "doe alles wat kan en zeg wat ik zelf moet doen".

---

## 3. Werkomgeving

**Windows-pc (desktopapp, sinds 8 nov)**

- Repo: `C:\Users\Ilyas Chattat\code\geldgarant-website` (buiten OneDrive). Git, Node 26, `gh` (ingelogd als `geldgarant`), Poppler via winget. Commit-identiteit lokaal: Claude <noreply@anthropic.com>.
- PATH in elke shell zetten: in Bash `export PATH="/c/Program Files/Git/cmd:/c/Program Files/nodejs:/c/Program Files/GitHub CLI:$PATH"`; in PowerShell `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.
- Git Bash: `MSYS_NO_PATHCONV=1` bij scripts met paden als argument (anders wordt `/pad` een Windows-pad).
- Playwright-Chromium geïnstalleerd (`npx playwright install chromium`), dus geen `CHROME_PATH`. Lighthouse lokaal start op deze pc geen Chrome (spawn UNKNOWN): Lighthouse draait in de CI.
- Juridische pdf's: Poppler-bin op PATH (`.../WinGet/Packages/oschwartz10612.Poppler_.../poppler-25.07.0/Library/bin`), dan `node scripts/juridisch-pdf.mjs` met preview op 4399.
- Visuele snapshots (`-linux.png`) niet op Windows bijwerken; de CI draait ze niet.
- Browserpaneel (ingebouwd) is ingelogd bij Cloudflare (account f46669d1a19288f34d2b13818bd111c7, zone 277e66e28d934ba36ef029dddf4be3e2) en Google (account `/u/1` = Search Console + Bedrijfsprofiel). Cloudflare-API: lezen via `fetch("/api/v4/...", {headers: {"x-cross-site-security": "dash"}})` in het dashboard; wijzigen alleen via de UI (botcheck).
- **Netwerk**: op het wifi van de huidige verblijfslocatie is geldgarant.com niet bereikbaar (zie §8, E20). Controleren kan dan via `curl --resolve geldgarant.com:443:188.114.96.1 https://geldgarant.com/...` of via 4G.

**Cloudsandbox (claude.ai)**: zie variant B in §1; `CHROME_PATH=/usr/bin/google-chrome`, dompdf via `bash scripts/dev/dompdf-lib.sh`.

**Controles**: `npm run qa` (check, lint, format, unit, build, html, seo, e2e, audit); gericht `npx playwright test --grep-invert "@visueel" --grep "<pad>"`; crawl `node scripts/seo/crawl.mjs [basis]`; screenshots met een kleine Playwright-scriptje (preview op 4399: `npm run build && npx astro preview --port 4399 --ignore-lock`; poort vrijmaken in PowerShell met `Get-NetTCPConnection -LocalPort 4399 | Stop-Process`).

**Push en build**: `git push -q origin main`; Workers Build volgen: `gh api repos/geldgarant/Website/commits/<sha>/check-runs --jq '.check_runs[] | {name, status, conclusion}'` ("Workers Builds: website" ± 2 min, "controle" = CI ± 15 min). Na een deploy: `node scripts/seo/indexnow.mjs` (meldt alle URL's bij Bing e.a.).

**Commits** eindigen met `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

**Valkuilen**: vaste spatie in Astro als `" "`; CLS door het accentfont (fallback Georgia ontbreekt op Linux/Android, zie de H1-fix op `/hulp-nodig-bij-geldproblemen`); `artikel.css` geldt globaal; html-validate-regels (label/for, twee `<aside>`, koppen niet met cijfer, `<section aria-label>` in plaats van `role="region"`); formulierpagina's `stickyCta={false}`; scrollgebieden focusbaar maken (axe scrollable-region-focusable); dompdf-eigenaardigheden (zie brieven/README).

---

## 4. Stand van de site

Astro 7, statisch, Cloudflare Workers (static assets + worker voor `/api/*`). 73 pagina's (71 in de sitemap), Lighthouse mobiel ≥ 95 (CI-steekproef), WCAG 2.2 AA, geen overloop 320–2560 px.

| Fase | Pagina's                                                                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | home, `/incasso`, `/debiteurenbeheer`, `/tarieven`, `/vordering-indienen`, `/contact-opnemen`, `/over-ons`, `/hoe-werkt-het`                                   |
| B    | `/wki`, `/nowid`, `/incasso/*` (4), `/branches` + 10                                                                                                           |
| C    | `/kennisbank` + 27, `/werken-bij` + 3, `/hulp-nodig-bij-geldproblemen`                                                                                         |
| D    | `/klachtenregelement`, `/juridisch` + 3 (AV, privacy, cookies), redirects, OG-beelden                                                                          |
| E    | `/brief-ontvangen` (+ `/bedankt`, `/mislukt`), `/betalen` (302), brieven voor CaseControl                                                                      |
| SEO  | `/voorbeeldbrieven` + 6 (betalingsherinnering, aanmaning, ingebrekestelling, sommatie, betalingsregeling, huurachterstand), briefmaker op `/incasso/wik-brief` |

**Belangrijke bestanden**

| Bestand                                                                     | Rol                                                                                                                    |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/data/site.ts`                                                          | Alle bedrijfsgegevens, `sameAs`, `cfBeaconToken` (Web Analytics), `betaalLinkApi`, `derdengelden`. Nooit hardcoden.    |
| `src/data/branches.ts` + `src/pages/branches/[slug].astro`                  | Branchepagina's; velden `kennis` (kennisbanklink) en optioneel `aanpak` (label, kop, lead, stappen, brieven, linksKop) |
| `src/data/voorbeeldbrieven.ts`, `src/lib/briefmaker.ts`, `Briefmaker.astro` | Voorbeeldbrieven en briefmaker (slugs incl. `huurachterstand`); getest in `tests/unit/briefmaker.test.ts`              |
| `src/components/debiteuren/Afweging.astro`                                  | `/debiteurenbeheer` sectie 04: uitbesteden ja/nee, factoring vs incasso, start in 3 stappen                            |
| `src/layouts/Base.astro`                                                    | Metadata, JSON-LD, Web Analytics-beacon (alleen op hostname geldgarant.com)                                            |
| `public/_headers`, `public/_redirects`, `public/<indexnow-sleutel>.txt`     | CSP (incl. cloudflareinsights), redirects, IndexNow-sleutel                                                            |
| `worker/index.ts`, `worker/betalen.ts`, `worker/qr.ts`, `wrangler.jsonc`    | Worker voor `/api/*` (betalen via CaseControl, dynamische QR)                                                          |
| `scripts/seo/crawl.mjs`, `scripts/seo/indexnow.mjs`                         | Productiecrawl (`docs/seo/crawl-<datum>.csv`), IndexNow-melding                                                        |
| `lighthouserc.cjs`, `.github/workflows/kwaliteit.yml`                       | Lighthouse: lokaal alle pagina's, in CI steekproef van 16; CI-timeout 60 min                                           |
| `docs/seo/*`                                                                | SEO_STATE (hervatten), MASTERPLAN, EVIDENCE (E1–E20), `keyword-url-map.csv`, `backlink-opportunities.csv`, crawls      |

**Ontwerp**: Poppins 500/600, Inter Variable, Newsreader cursief accentwoord (`<span class="accent">`, één per kop); `--ink #061126`, `--blue #3069FE`, `--blue-ink #1F4FD6`, `--surface #F3F4F7`. Knoppen `.btn` + `.btn-dot`.

**Intake-worker** (`geldgarant-intake-api`, https://api.geldgarant.com): `/api/incasso-*`, `/api/contact`, `/api/location/search`, `/api/bestand`, `/api/health`, `POST /api/sollicitatie`. Turnstile sitekey `0x4AAAAAACzginGi5pgJr1Ux`.

---

## 5. Open punten bij Anas/Ilyas (gebruikersacties)

**SEO en vermeldingen (8 nov)**

1. **Justis-register**: telefoonnummer staat nog op 085 083 5230 → laten wijzigen naar 085 212 73 88.
2. **KvK, LinkedIn, Instagram-bio**: website `https://geldgarant.com` en telefoon controleren; Instagram-bio zegt nog "No cure, no pay" (site: € 0 bij volledige betaling). Bevestigen of @geldgarant van GeldGarant is (dan in `site.sameAs`).
3. **Google-reviews**: 15 oudere reviews beantwoorden (doet gebruiker zelf; neutraal bij debiteuren, geen namen, geen dossierdetails).
4. **Bedrijfsprofiel**: servicegebied eventueel handmatig op "Nederland" (nu Deventer); controleren dat de beschrijving en openingstijden (9.00–17.00) door Google zijn goedgekeurd.
5. **Netwerk verblijfslocatie**: beheerder vragen 188.114.96.0 en 188.114.97.0 toe te staan (router blokkeert adressen op .0; site én formulieren onbereikbaar op dat wifi). Tijdelijk alleen voor de eigen laptop: hosts-bestand (als beheerder) met `188.114.96.1 geldgarant.com`, `www.geldgarant.com` en `api.geldgarant.com`; weghalen bij vertrek. Bezoekers elders hebben er geen last van (uptimecontrole draait buiten dat netwerk).
6. **Bing Webmaster Tools**: inloggen met een Microsoft-account en importeren uit Search Console (Claude kan daarna verder).
7. **Trustoo / NowID-websitelink / Trustpilot**: besluiten of we deze vermeldingen actief willen (geen contact zonder opdracht).
8. **Bankbeslag** (beslagvrije voet): status wetsvoorstel 35225 door jurist laten nalopen voordat we erover schrijven.

**Juridisch en bedrijf (eerder)**

9. Akkoord AV, privacy- en cookieverklaring (bij voorkeur jurist). Let op: privacy- en cookieverklaring op 8 nov aangepast voor Cloudflare Web Analytics (cookieloos), versie 2026-11-08.
10. Verwerkersovereenkomsten: Cloudflare, Resend, Telegram, CaseControl.
11. ~~WhatsApp Business~~: actief op 085 212 73 88 en gekoppeld aan het Bedrijfsprofiel (8 nov). Op de site via `site.whatsappHref` met begintekst.
12. Compliance-claims /over-ons 03 en /wki 02 bevestigen; buitenlandpagina: landenlijst en tariefaanpak; (foto's staan sinds 8 nov op de site); losse prijzen debiteurenbeheer (€ 9,95 / € 3,95) bevestigen.
13. Periodiek: wettelijke rente 1 jan/1 jul (site én aanmaning), griffierechten, beslagvrije voet, hulpnummers.
14. **Betalen en brieven**: antwoord CaseControl over `/pay` vanaf onze server; testbetaling € 5 op eigen testdossier (terugkeer-URL); telefoonnummer in CaseControl naar 085 212 73 88; aanmaning, sommatie en 14-dagenbrief in CaseControl plakken en proefbrief (laadt de dynamische QR?); 14-dagenbrief-kostensjabloon pas na 14 dagen; variabelenlijst `case.*`/`creditor.*` opvragen; webhook-secret vernieuwen.
15. Intake-worker: Trigger.dev-job van de vorige bouwer roept nog `/api/internal/portal-provisioning/run` aan (404) → laten stoppen.
16. Framer-site pas na een maand opzeggen (terugvaloptie). Uptimecontrole draait sinds 8 nov (zie §9); controleren dat GitHub-meldingen voor issues bij het account aanstaan.

---

## 6. Direct betalen (gebouwd 7 nov)

- **Flow**: betaalkaart `#betalen` op /brief-ontvangen (voorinvullen met `?dossier=&bedrag=`, kort adres `/betalen`) → "Betalen met iDEAL" → `POST /api/betalen` → worker → `POST https://api.casecontrol.app/api/portal/debtor/v1/geldgarant/pay {caseNumber, amount}` → `{url}` → iDEAL. CaseControl boekt de betaling op het dossier.
- **Worker** (`worker/betalen.ts`): zelfde origin, JSON, max 500 bytes, `isDossier`, € 5 tot € 250.000. Onbekend dossier → 404-melding; andere fout → overmaakgegevens + "Opnieuw proberen". Niets opgeslagen. `GET /api/betalen` controleert de koppeling.
- **wrangler.jsonc**: `main: worker/index.ts`, `assets.binding: ASSETS`, `run_worker_first: ["/api/*"]`, var `CASECONTROL_PORTAL: geldgarant`. `site.betaalLinkApi = null` zet online betalen uit.
- Tests: `tests/unit/betalen-worker.test.ts`, `tests/e2e/brief.spec.ts`.

## 7. Brieven voor CaseControl (gebouwd 7 nov)

Alles in `brieven/README.md` (raster, variabelen, werkwijze, QR). Drie brieven: `aanmaning-1-b2b.html` (akkoord Anas), `sommatie-b2b.html`, `aanmaning-14-dagen-b2c.html`; dynamische QR via `worker/qr.ts`. Werkwijze: bron `brieven/src/<naam>.html` → `python3 brieven/tools/bouw.py` → render met `brieven/tools/render-cc.php` (dompdf, cloudsandbox). Volgende brieven: betalingsherinnering B2C na de 14 dagen, regelingsbevestiging, eventueel Engelstalige B2B-varianten.

---

## 8. SEO-traject: wat er staat en wat er nog moet

**Gedaan (7–8 nov 2026, details per bewijsnummer in `docs/seo/SEO_EVIDENCE.md`)**

- **Meting**: Search Console (`sc-domain:geldgarant.com`, Google-account `/u/1`) geverifieerd via TXT; sitemap `https://geldgarant.com/sitemap-index.xml` ingediend en gelezen; 11 URL's ter indexering aangeboden op 8 nov (quotum 10/dag). Nulmeting GSC (16 maanden, Framer-tijd): 137 klikken, 28,9K vertoningen, gem. positie 43 (E9). Cloudflare Web Analytics hersteld (stond op "EU uitgesloten") met handmatige beacon (E20). IndexNow actief, 71 URL's gemeld (E20).
- **Techniek**: Always Use HTTPS aan; productiecrawl schoon (70+ URL's 200, canonicals, JSON-LD overal); CI groen incl. Lighthouse; CLS-fix `/hulp-nodig-bij-geldproblemen`; a11y-fix briefmaker; homepage JSON-LD met `@id`, logo, `sameAs`.
- **Inhoud en structuur**: interne links (geen pagina meer met < 2 inlinks, E7); keyword-URL-kaart `docs/seo/keyword-url-map.csv` (57 clusters, E8); kannibalisatie opgelost met titelscheiding zzp/verhuur/Wki/kosten (E10); commerciële pagina's verbeterd: `/debiteurenbeheer` (E11), `/branches/incasso-verhuur` (E12), `/branches/incasso-mkb` (E13), `/incasso/incassobureau-inschakelen` (E14), `/incasso` en `/tarieven` (E17); snelle winst e-commerce, stappenplan, beslagvrije voet (E16); voorbeeldbrief huurachterstand (E20).
- **Lokaal en vermeldingen**: Google Bedrijfsprofiel bijgewerkt (beschrijving, 9.00–17.00, https, oude WhatsApp weg; E19), 4 nieuwe reviews beantwoord; vermeldingen geïnventariseerd in `docs/seo/backlink-opportunities.csv` (E18).

**Nog te doen (volgorde; staat ook in SEO_STATE `next_action`)**

1. **9 nov**: GSC-indexering aanvragen voor `/` (homepage toont in Google nog de oude Framer-titel) en `/voorbeeldbrieven/huurachterstand`; Web Analytics-dashboard controleren (komt er data binnen?).
2. **± 15 nov**: GSC prestaties per pagina vergelijken met de nulmeting (E9): vertoningen, positie, CTR; titels/descriptions bijsturen op CTR; `keyword-url-map.csv` bijwerken; indexeringsrapport (nieuwe URL's geïndexeerd?).
3. Na de gebruikersacties (§5): Bing Webmaster Tools inrichten; vermeldingen gelijktrekken; eventueel Trustoo/NowID-link.
4. Inhoud (alleen met primaire bronnen): bankbeslag na juridische check; bewijsstukkenchecklist en beslisboom "kan ik deze vordering nog innen?" (masterplan fase 5); verdere kennisbankverbeteringen op basis van GSC-zoekvragen (bv. "wik brief" ±600 vertoningen pos 37–49, "lege bv" 323, "internationale incasso" 337).
5. Fase 8 AI-zichtbaarheid: vaste vragenset (10 vragen) meten in ChatGPT Search, Perplexity en AI Overviews; vastleggen in SEO_EVIDENCE.
6. Fase 9 meting: events voor aanvragen (Web Analytics kent geen custom events; beoordelen of een lichte teller in de worker zonder persoonsgegevens nodig is).

**Werkregels SEO** (uit de masterprompt): geen verzonnen data of claims; elke wijziging met bewijs in SEO_EVIDENCE; na elke batch: QA, push, live controleren, CI controleren, IndexNow, SEO_STATE bijwerken; kannibalisatie controleren vóór een nieuwe URL of titel; gebruikersacties duidelijk benoemen.

---

## 9. Website-chat 8 nov 2026

- **Uptimecontrole**: `.github/workflows/uptime.yml` draait `scripts/uptime.mjs` elk kwartier (pagina's, sitemap, `/api/betalen` = koppeling CaseControl, `/api/qr`, intake-worker `/api/health`, www- en http-doorverwijzing). Elke fout krijgt na 20 s een tweede kans. Storing → één issue "Storing op geldgarant.com" met label `storing` (GitHub mailt); weer in orde → issue dicht. Lokaal: `node scripts/uptime.mjs` (`BASIS=` voor staging).
- **Herinneringen**: `.github/workflows/herinneringen.yml` opent op 1 januari en 1 juli een issue (label `onderhoud`) met de checklist rente, brieven, kennisbank, hulpnummers.
- **WhatsApp**: `site.whatsappHref` = wa.me met begintekst "Hallo GeldGarant, ik heb een vraag, namelijk: ". Staat op home 04, /contact-opnemen, /hulp-nodig-bij-geldproblemen, footer en mobiel menu.
- **Foto's** (eigen shoot, bevestigd 8 nov): `src/assets/fotos/`, alleen bestanden van minimaal 1024 px breed (600 px-versies waren op retina onscherp en zijn weggehaald). Indeling: home-hero `gesprek-adviseur.jpg` (foto bovenin het navy vlak, afrekenkaart erover), home 04 `collegas-laptop.jpg` (keuze gebruiker), /incasso fotoband `adviseur-buiten.jpg`, /over-ons fotoband `welkom.jpg` en kantoorkaart `collegas-tafel.jpg`, /hoe-werkt-het fotoband `team-overleg.jpg`, /contact-opnemen kantoorkaart `welkom.jpg` (uitsnede), /werken-bij hero `collegas-tafel.jpg`, /vordering-indienen gezicht (48 px) uit `adviseur-buiten.jpg`. Componenten: `Foto.astro` (Picture, AVIF/WebP kwaliteit 80, altijd ook de volle bronbreedte, `focus`, `eager` = fetchpriority high, `widths`) en `FotoBand.astro`. **Scherpte:** bij bijsnijden (`object-fit: cover`) wordt de foto breder getoond dan het vak; `sizes` moet die getoonde breedte geven (bv. hero `960px, 260vw`), anders kiest de browser een te kleine versie. Gemeten op 2x: home 0,84 tot 0,98, brede banden 0,65 (grens van de 1600 px-bronnen). Originelen van 3000+ px maken de banden ook op retina volledig scherp.
- **Illustraties of cartoons**: bewust niet toegevoegd. Alleen de iconenillustraties in de kennisbank; losse cartoons zouden naast echte foto's goedkoper ogen. Pas overwegen met een illustrator en één vaste stijl.
- **Kennisbank-illustraties**: `src/lib/kennisbeeld.ts` (met de hand getekende iconen in een vak van 100 x 100; per artikel een wit hoofdicoon + blauw accent, `BEELDEN`), component `src/components/KennisBeeld.astro` (navy vlak met blauwe gloed en stippenraster, pijlbol). Op home 07, /kennisbank en "Verder lezen". Nieuw artikel zonder regel in `BEELDEN` = build faalt (unit-test `tests/unit/kennisbeeld.test.ts`). Proefvel: `npx tsx scripts/dev/kennisbeeld-proef.mts uit.png`. Homekaarten tonen de leestijd in plaats van de datum.
- **Formulierstijlen**: alle veldregels en de adres-zoekhulp van /vordering-indienen staan nu in `src/styles/form.css`.
- **Intake-worker**: `/api/health` meldt `telegram: false` (interne Telegram-melding niet ingesteld); de privacyverklaring noemt Telegram wel. Navragen of dat zo hoort.
- **Navigatie (8 nov)**: menu in `src/data/menu.ts` (één bron voor desktop en mobiel). Desktop: Diensten ▾ (diensten, branches, promo indienen met foto), Hoe werkt het, Tarieven, Kennis ▾ (hulpmiddelen, kennisbankonderwerpen, promo stappenplan), Over ons ▾ (over, Wki, NowID, klachten, werken bij, promo direct contact met bel- en WhatsApp-knop), Contact, knop Vordering indienen. Panelen: knoppen met `aria-expanded`, openen op klik/toets en met de muis (90 ms), sluiten met Escape (focus terug), klik buiten of focus weg. Scrollen: balk 10 px lager en belknop zichtbaar op desktop. Mobiel: drie contacttegels, uitklapgroepen (branches en onderwerpen als chips), knop, inloggen en brief ontvangen. Utility-balk heeft nu ook WhatsApp. Tests: `tests/e2e/interacties.spec.ts` (desktoppaneel, mobiele groep). Nieuwe pagina? Voeg hem toe aan `menu.ts` of de footer.
- **Veelgestelde vragen**: het vak "Staat uw vraag er niet tussen?" (`Faq.astro`) heeft een rond portret, belknop en WhatsApp-knop, op elke pagina met FAQ. /debiteurenbeheer-hero: `welkom.jpg` op dezelfde manier als de home-hero.
- **Responsiviteit (8 nov)**: `scripts/dev/responsief.mjs` scant alle sitemappagina's op 10 breedtes (Chromium) en 3 iPhones (WebKit = Safari; eenmalig `npx playwright install webkit`) op overloop, te smalle tekstkolommen, elementen buiten beeld en woorden die midden in het woord breken. Gevonden en opgelost: veegrijen met `grid-auto-columns: minmax(0, %)` kromp in iOS Safari tot smalle kolommen (nu flex, /brief-ontvangen, /hulp-nodig-bij-geldproblemen, /werken-bij); `.sr-only` in een veegrij maakte de pagina 2000 px breed (veegrijen krijgen `position: relative`); FAQ-vragen met lange woorden; kennisbanktabellen (cellen min. 8,5rem, tabel scrolt); betaalstappen, snelkeuzes, overmaakgegevens, rekenvoorbeeld branches, feitenkaart-labels, contacttegels, H1's van /debiteurenbeheer, voorbeeldbrieven en vacatures. Algemeen: `overflow-wrap: break-word` op body, afbreken met streepje voor dt/dd, FAQ-koppen en koppen onder 480 px. Home-hero: fotostrook 220 px op desktop, buitenfoto van de adviseur, label onderin de foto.
