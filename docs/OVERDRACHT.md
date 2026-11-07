# GeldGarant website: complete overdracht (7 nov 2026, 11:00)

Dit is het startpunt voor een nieuw gesprek of een nieuw project. Het vervangt alle eerdere overdrachten (ook `claude/website-overdracht-*.md` en `claude/website-START-HIER.md` in het claude.ai-project, die dezelfde inhoud hebben). Details staan in de repo: `CLAUDE.md`, `docs/HANDOFF.md` (§6b), `brieven/README.md`, `docs/SITEMAP.md`, `docs/LIVEGANG.md`.

Stand: alles staat op `main` en op staging (https://website.geldgarant.workers.dev), laatste Workers Build geslaagd, `npm run qa` groen (94 unit, 930 e2e). Betaalkoppeling gecontroleerd: `/api/betalen` geeft `ok: true`; `/api/qr` (dynamische QR voor de brieven) draait. Brieven: aanmaning 1 B2B (akkoord Anas), sommatie B2B en 14-dagenbrief B2C (nieuw, wachten op akkoord). Cloudflare 7 nov: Turnstile-hostname en origin voor staging toegevoegd (zie §5.5).

---

## 1. Startprompt (plak dit in het nieuwe gesprek)

> Koppel de repo geldgarant/Website met add_repo (push-toegang), kloon hem naar /home/claude/geldgarant-site en draai `npm ci`. Maak de symlink `ln -sfn /home/claude/geldgarant-site /home/claude/website` en registreer /home/claude/website met register_repo_root, zodat de skills uit .claude/skills laden. Draai `bash scripts/dev/dompdf-lib.sh` (dompdf voor de brieven). Controleer of de Framer-connector actief is (anders RefreshMcpTools). Lees docs/OVERDRACHT.md, daarna CLAUDE.md, docs/HANDOFF.md (§0 en §6b), brieven/README.md, docs/SITEMAP.md en docs/LIVEGANG.md.
>
> Volgende taak: mijn feedback op de sommatie en de 14-dagenbrief verwerken (OVERDRACHT §7), de proefbrieven in CaseControl (laadt de dynamische QR?), de open punten in §5 en de livegang. Werkwijze per pagina: kort plan, bouwen, verifiëren, pushen, screenshots sturen. Kwaliteit en creativiteit voorop. Laat het weten als het contextvenster op 90% zit; werk dan alle md-bestanden bij en geef een volledige overdracht.

**Meenemen naar een nieuw claude.ai-project** (projectkennis): dit bestand (`docs/OVERDRACHT.md`), en als je ze nog nodig hebt de intake-workerbestanden `claude/intake-worker-index.js`, `claude/intake-worker-setup.md`, `claude/intake-worker-sollicitatie.js`, `claude/intake-worker-sollicitatie-installeren.md`, plus `GeldGarant_CaseControl_Context.md`. De CaseControl-variabelenlijst en de oude sommatie staan nu in de repo (`brieven/casecontrol-variabelen.md`, `brieven/oud/`). Vervallen: `claude/intake-worker-betaallink.md`, `claude/website-handoff.md`, `claude/website-sitemap.md`.

**Projectinstructie** (voor het nieuwe project): "Let me know when we are at 90% context window, then update all my md files we have touched and provide a verbose, detailed handoff that includes files, snippets, line numbers and flows".

---

## 2. Bedrijf en besluiten

- **GeldGarant**: incassobureau voor ondernemers, landelijk, kantoor Keulenstraat 1, 7418 ET Deventer. Eigenaren Anas Chattat en broer Ilyas; hun namen staan nooit op de site of in brieven.
- **Gegevens**: KvK 90622375; Wki-registratie Justis 00273 (https://www.justis.nl/registers/incassoregister/geldgarant); NowID; geschillencommissie IncassoKlacht.
- **Contact**: 085 212 73 88 (+31852127388); info@geldgarant.com; klachten@geldgarant.com; werkdagen 9.00–17.00; op werkdagen binnen het uur in behandeling.
- **Derdengelden**: NL57 BUNQ 2188 2124 36, Stichting Beheer Derdengelden GeldGarant, BIC BUNQNL2AXXX. Kenmerk = dossiernummer (formaat jaar-volgnummer, bv. 26-1008). Online alleen iDEAL.
- **Dossiermail**: info@dossiers.geldgarant.com. **Portalen** (CaseControl): opdrachtgevers https://geldgarant.dossierportal.nl, debiteuren https://geldgarant.debtorportal.com (niet meer nodig om te betalen).
- **Mail**: Google Workspace (MX), formulieren via Resend.

**Bindende besluiten**

1. Geen persoonsnamen. Professioneel, gevestigd bureau.
2. Geen "geen callcenter"/"geen keuzemenu"; "direct contact" en "vaste dossierbehandelaar" mogen.
3. Niet te voorzichtig commercieel; kwaliteit, creativiteit, SEO en uitstraling voorop.
4. Niets verzinnen (reviews, logo's, cijfers, certificaten). Voorbeelden altijd als voorbeeld labelen.
5. "Geregistreerd bij Justis", niet "Erkend". H1 home "Wij halen uw geld wél op". Rechtsvorm nooit noemen. Geen btw-id in de footer.
6. Tarieven: WIK-staffel, geen succesfee; volledig betaald € 0; deels = incassokosten min. € 45, nooit meer dan ontvangen; niets binnen € 0; intrekken min. 10% en min. € 95; curator € 115 excl. btw op verzoek; debiteurenbeheer € 99 / € 199 / € 349 p/m, maandelijks opzegbaar.
7. Landelijk positioneren. Kennisbank zonder datum en disclaimer.
8. Vacatures met salarisindicatie, cv-upload, gegevens na vier weken weg.
9. Klachten door een andere medewerker dan de dossierbehandelaar.
10. **Betalen**: zoals Breyta, direct naar iDEAL, nooit via het portaal.
11. **Brieven**: alles opnieuw, in de stijl van de site, exact op het vensterraster, met echte CaseControl-variabelen. Begonnen met de eerste aanmaning.

**Samenwerken met Anas**: Nederlands, direct, praktisch; meerdere stappen per prompt; hij controleert met screenshots en ziet kleine onevenheden.

---

## 3. Werkomgeving

- **Repo** https://github.com/geldgarant/Website (`main`). Klonen met `add_repo` (owner `geldgarant`, repo `Website`, access `push`), dan `git clone --depth 1 https://github.com/geldgarant/website /home/claude/geldgarant-site`, `npm ci`, symlink naar `/home/claude/website`, `register_repo_root`.
- **Netwerk**: de shell bereikt alleen GitHub en npm. Externe sites (staging, CaseControl, concurrenten) via de **Framer-connector**: `open_project("R87P79buXWtsQbzZzCmY")` (alleen lezen), `exec` met `fetch()` (alleen GET met 2xx werkt; anders status 0) en `api.screenshot(url, { viewport })` (ook handig om een JSON-antwoord te lezen).
- **Chrome**: `CHROME_PATH=/usr/bin/google-chrome`. Aanwezig: pdftoppm, pdfinfo, pdfplumber, qrcode (python), sharp.
- **dompdf** (brieven): `bash scripts/dev/dompdf-lib.sh` → `/home/claude/brief/lib`.
- **Preview**: `npm run build && npx astro preview --port 4399 --ignore-lock`; vóór e2e stoppen met `fuser -k 4399/tcp`.
- **Controles**: `npm run qa` (~12 min, achtergrond); `npm run test:e2e` (930 tests); visueel `npx playwright test --grep "<pad>" --update-snapshots`; screenshots `node scripts/dev/shot.mjs /pad`; breedtes `scripts/dev/resoluties.mjs`; knoppen `npx tsx scripts/dev/uitlijning.mjs`; focus `scripts/dev/focus.mjs`; Lighthouse per pagina via `node_modules/lighthouse/cli/index.js`.
- **Push en build**: `git push -q origin main`; `timeout 60 gh api repos/geldgarant/Website/commits/<sha>/check-runs --jq '.check_runs[] | {name, conclusion}'` → "Workers Builds: website" `success` (~2 min).
- **Commits** eindigen met `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` en `Claude-Session: <sessie-url>`.

**Valkuilen**: vaste spatie in Astro als `" "` (controleer `grep -nP "\xa0"`); CLS door het accentfont; `artikel.css` geldt globaal; html-validate-regels (label/for, twee `<aside>`, koppen niet met cijfer); formulierpagina's `stickyCta={false}`; **dompdf**: `height`/`width` op een td tellen zonder padding, geen `counter(pages)`, fixed herhaalt per pagina, absolute alleen op die pagina; **CaseControl `/pay`**: onbekend dossier = HTTP 400 `{"errorCode":"case-not-found"}`.

---

## 4. Stand van de site

Astro 7, statisch, Cloudflare Workers (static assets + worker alleen voor `/api/*`). 67 pagina's, Lighthouse mobiel ≥ 95, WCAG 2.2 AA, geen overloop 320–2560 px.

| Fase | Pagina's                                                                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | home, `/incasso`, `/debiteurenbeheer`, `/tarieven`, `/vordering-indienen`, `/contact-opnemen`, `/over-ons`, `/hoe-werkt-het`                        |
| B    | `/wki`, `/nowid`, `/incasso/*` (4), `/branches` + 10                                                                                                |
| C    | `/kennisbank` + 27, `/werken-bij` + 3, `/hulp-nodig-bij-geldproblemen`                                                                              |
| D    | `/klachtenregelement`, `/juridisch` + 3 (AV, privacy, cookies; pdf's via `scripts/juridisch-pdf.mjs`), redirects, OG-beelden, livegangvoorbereiding |
| E    | `/brief-ontvangen` (+ `/bedankt`, `/mislukt`), `/betalen` (302), brieven voor CaseControl                                                           |

**Belangrijke bestanden**

| Bestand                                                                                | Rol                                                                                                                                           |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/site.ts`                                                                     | Alle bedrijfsgegevens, `betaalLinkApi` (`/api/betalen`), `derdengelden`, `betaalMethode`, `dossierMail`, `dossierVoorbeeld`. Nooit hardcoden. |
| `worker/index.ts`, `worker/betalen.ts`, `wrangler.jsonc`                               | Worker voor `/api/*`: `POST /api/betalen` → CaseControl `/pay` → iDEAL; `GET` = controle                                                      |
| `brieven/`                                                                             | CaseControl-brieven: README, `aanmaning-1-b2b.html`, `src/`, `tools/`, `voorbeeld/`, `assets/`, `casecontrol-variabelen.md`, `oud/`           |
| `src/pages/brief-ontvangen/index.astro`, `src/scripts/brief.ts`, `src/lib/debiteur.ts` | Debiteurenpagina                                                                                                                              |
| `src/lib/wik.ts`, `rente.ts`, `termijn.ts`, `werkdagen.ts`, `juridisch.ts`             | Staffel, rente (handelsrente 10,40% sinds 1-7-2026), termijnen, plaatshouders                                                                 |
| `src/components/form/Veld.astro`                                                       | Formulierveld, met `prefix` (bv. "€")                                                                                                         |
| `public/_redirects`, `public/_headers`, `public/brief/`                                | Redirects (getest), CSP, QR/fonts voor brieven                                                                                                |

**Ontwerp**: Poppins 500/600, Inter Variable, Newsreader cursief accentwoord (`<span class="accent">`, één per kop); `--ink #061126`, `--blue #3069FE`, `--blue-ink #1F4FD6`, `--surface #F3F4F7`; in CaseControl-brieven accent `#3f68f5`. Knoppen `.btn` + `.btn-dot`.

**Intake-worker** (`geldgarant-intake-api`, https://api.geldgarant.com): `/api/incasso-*`, `/api/contact` (ook debiteurreacties, onderwerp `bestaand_dossier`), `/api/location/search`, `/api/bestand`, `/api/health`; nog te installeren `POST /api/sollicitatie`. Turnstile sitekey `0x4AAAAAACzginGi5pgJr1Ux`. Betalen loopt níet via deze worker.

---

## 5. Open punten bij Anas

1. Akkoord AV, privacy- en cookieverklaring (bij voorkeur jurist).
2. Telegram-melding intake-worker met minimale persoonsgegevens.
3. Verwerkersovereenkomsten: Cloudflare, Resend, Telegram, CaseControl.
4. WhatsApp Business op 085 212 73 88.
5. Intake-worker (Cloudflare, 7 nov, ingebouwde browser): **klaar**.
    - Turnstile-widget `geldgarant-incassoform` en `INTAKE_ALLOWED_ORIGINS` kennen nu ook `website.geldgarant.workers.dev` (naast geldgarant.com en www);
    - route `POST /api/sollicitatie` uitgerold (code = `docs/projectkennis/intake-worker-index.js` + route + `intake-worker-sollicitatie.js`, sha256 `48dcfd59…`, byte voor byte gecontroleerd via de API);
    - 16 ongebruikte geheimen van de vorige bouwer verwijderd; over: `INTAKE_ALLOWED_ORIGINS`, `INTAKE_SESSION_SECRET`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TURNSTILE_ALLOWED_HOSTNAMES` (ongebruikt, onschuldig), `TURNSTILE_SECRET_KEY`;
    - Resend: MX en SPF op `send.` toegevoegd door Anas, DKIM stond er al;
    - test contactformulier op staging geslaagd (GG-CONT-2026-87121, geen Resend-fouten in de logs); vordering en sollicitatie test Anas in zijn eigen browser (Turnstile weigert de geautomatiseerde browser, fout 600010);
    - Telegram bewust uit (akkoord Anas);
    - de Trigger.dev-job van de vorige bouwer roept nog elke 15 min `/api/internal/portal-provisioning/run` aan (geeft 404). Bouwer vragen te stoppen en de CaseControl-API-client bij CaseControl vernieuwen;
    - de Cloudflare-editor accepteert geen geautomatiseerd plakken; dashboard-API-mutaties worden door de botcheck geblokkeerd (alleen de UI werkt). Lezen via `/api/v4/...` met `x-cross-site-security: dash` werkt wel.
6. Compliance-claims /over-ons 03 en /wki 02 bevestigen.
7. Buitenlandpagina: landenlijst en tariefaanpak.
8. Foto's kantoor/team zonder namen; later echte reviews en cijfers.
9. Losse prijzen debiteurenbeheer (€ 9,95 / € 3,95) bevestigen.
10. Periodiek: wettelijke rente 1 jan/1 jul (site én de vaste 10,40% in de aanmaning), griffierechten, beslagvrije voet, hulpnummers.
11. **Betalen en brieven**:
    - antwoord van CaseControl op Anas' mail: mogen wij `/pay` vanaf onze server aanroepen (technisch werkt het);
    - testbetaling van € 5 op een eigen testdossier via https://website.geldgarant.workers.dev/betalen: landt hij op het dossier, waar komt de bezoeker na iDEAL uit (terugkeer-URL; `/brief-ontvangen/bedankt` en `/mislukt` staan klaar);
    - telefoonnummer in CaseControl (organisatie) naar 085 212 73 88 (brieven halen het daar; oud: 085 083 5230);
    - aanmaning, sommatie en 14-dagenbrief in CaseControl plakken (codeweergave), proefbrief: logo zichtbaar, **laadt de dynamische QR** (anders `QR=statisch` bouwen)? Printen, vouwen, adres in het venster?
    - 14-dagenbrief: incassokostensjabloon pas na de 14 dagen aanzetten (`case.total_amount_due` mag dan nog geen kosten bevatten); controleren dat `case.penalty_amount_incl_vat` al het staffelbedrag geeft;
    - eerste variabelenlijst (`case.*`, `creditor.*`) opvragen: is er een variabele voor hoofdsom of rentepercentage? (Betaallink: `case.online_payment_link`, nu gebruikt.)
    - signing secret van de webhook vernieuwen (was zichtbaar in een screenshot).
12. Livegang volgens `docs/LIVEGANG.md` (DNS bij Cloudflare; A-records en www-CNAME naar Worker "website"; MX/TXT ongemoeid). **Akkoord Anas 7 nov**: direct na geslaagde formuliertests. Pre-flight op staging geslaagd (64 oude URL's + 5 bestanden 200, 6 redirects, canonical, telefoon). DNS-backup: `docs/dns-backup-2026-11-07.tsv` (let op: wildcard `*.geldgarant.com` → 213.249.67.10 blijft staan).

---

## 6. Direct betalen (gebouwd 7 nov)

- **Flow**: betaalkaart `#betalen` op /brief-ontvangen (voorinvullen met `?dossier=&bedrag=`, kort adres `/betalen`) → "Betalen met iDEAL" → `POST /api/betalen` → worker → `POST https://api.casecontrol.app/api/portal/debtor/v1/geldgarant/pay {caseNumber, amount}` → `{url}` → `location.assign(url)` naar iDEAL. CaseControl boekt de betaling op het dossier. Zelfde aanroep als "Maak een betaling" in het debiteurenportaal (code nagelopen: `RequestPaymentLink`).
- **Worker** (`worker/betalen.ts`): zelfde origin verplicht, JSON, max 500 bytes, `isDossier`, € 5 tot € 250.000. Onbekend dossier → 404 → melding "We vinden dossiernummer … niet". Andere fout → kaart met IBAN, tenaamstelling, kenmerk en bedrag, plus "Opnieuw proberen". Niets opgeslagen. `GET /api/betalen` controleert portalinfo + `/pay` met testnummer 00-0000; bij storing staat CaseControls antwoord in `melding`.
- **wrangler.jsonc**: `main: worker/index.ts`, `assets.binding: ASSETS`, `run_worker_first: ["/api/*"]`, var `CASECONTROL_PORTAL: geldgarant`. `site.betaalLinkApi = null` zet online betalen uit.
- Bewust geen naam/e-mail zoals Breyta: CaseControl gebruikt ze niet.
- Tests: `tests/unit/betalen-worker.test.ts`, `tests/e2e/brief.spec.ts`.

## 7. Brieven voor CaseControl (gebouwd 7 nov, bijgewerkt 11:00)

Alles staat in `brieven/README.md` (raster, variabelen, werkwijze, QR). Kort:

- **Zo maakt CaseControl een brief** (gemeten aan hun PDF, nagebouwd): dompdf 3.1.6, A4, marges 20 mm rondom, standaardfont Roboto, editor bewaart alleen inline stijlen. Eigen logo als data-URI.
- **Drie brieven**, zelfde raster en opbouw (kop, venster links, referenties vanaf 133 mm, onderwerp na de vouw, navy balk, specificatie, pagina 2 betalen/regeling/niet eens/contact/klachten/hulp):
    - `aanmaning-1-b2b.html`: akkoord Anas; termijn `misc.today_plus_7_business_days`;
    - `sommatie-b2b.html`: "Laatste verzoek om te betalen voordat de rechter eraan te pas komt", verzonden aangetekend en per e-mail, termijn `misc.today_plus_5_business_days`, voortgangsbalk Aanmaning/Sommatie/Rechter, gevolgen feitelijk (dagvaarding na akkoord opdrachtgever, proceskosten, beslag na vonnis);
    - `aanmaning-14-dagen-b2c.html`: "U kunt nog betalen zonder extra kosten", eisen art. 6:96 lid 6 BW (14 dagen vanaf de dag na ontvangst, exact kostenbedrag `case.penalty_amount_incl_vat`, gevolgen, geen kosten voor de brief), wettelijke rente 4%, hulpblok geldzorgen.
- **Dynamische QR** (wens Anas): `<img src="https://website.geldgarant.workers.dev/api/qr?d={{case.case_number}}&data={{case.online_payment_link}}">`, route `worker/qr.ts` (PNG, eigen encoder, `uqr`), terugval naar `/brief-ontvangen?dossier=…#betalen`. QR en "Online met iDEAL" ook klikbaar in de PDF. Proefbrief moet uitwijzen of CaseControl externe afbeeldingen laadt; zo niet: `QR=statisch python3 brieven/tools/bouw.py`.
- **Werkwijze**: bron `brieven/src/<naam>.html` → `python3 brieven/tools/bouw.py` → `npx tsx scripts/dev/qr-proef.mts "d=…&data=…" /tmp/qr.png` → `QR_PNG=/tmp/qr.png DOMPDF_LIB=/home/claude/brief/lib php brieven/tools/render-cc.php brieven/<naam>.html brieven/voorbeeld/<naam>.json brieven/voorbeeld/<naam>-voorbeeld.pdf`.
- **Website**: de voorbeeldbrief op /brief-ontvangen volgt de aanmaning (met vaste QR naar /betalen, gelabeld als voorbeeld).
- **Volgende brieven**: betalingsherinnering B2C na de 14 dagen, regelingsbevestiging, eventueel Engelstalige B2B-varianten (buitenland).

**Kritiek op de oude sommatie** (voor de nieuwe): oud telefoonnummer, gedachtestreepjes, "Geachte relatie", leeg veld "Grondslag", kapotte vinkjes ("v", "!"), QR-blok zonder QR, "zonder nadere aankondiging naar de juridische afdeling" (procedure vraagt akkoord opdrachtgever), loonbeslag bij een bedrijf, "worden niet door de rechter gematigd" (onjuist), geen rentepercentage of periode, adres niet op het vensterraster, te veel gekleurde vlakken.
