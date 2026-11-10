# SEO-bewijs

Alleen controleerbaar bewijs: bron, datum, omvang, beperkingen. Geen persoonsgegevens. Productie, lokaal, extern en
hypotheses gescheiden.

## Beschikbare bronnen (7 nov 2026)

| Bron                                   | Status                                                                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Werkomgeving (vanaf 7 nov 2026, 23:45) | Windows-pc van de gebruiker (Claude-desktopapp); repo in `C:\Users\Ilyas Chattat\code\geldgarant-website`, geen proxy |
| Repository + live site                 | beschikbaar (`curl`/Node fetch rechtstreeks; in de cloudomgeving via proxy met `NODE_USE_ENV_PROXY=1`)                |
| GitHub                                 | git push werkt; `gh` CLI ingelogd als `geldgarant` (op de pc van de gebruiker)                                        |
| Search Console                         | **niet**: geldgarant@gmail.com heeft geen toegang; bestaande TXT hoort bij ander account (E3)                         |
| GA4 / analytics                        | geen; Cloudflare Web Analytics akkoord, nog niet aan                                                                  |
| PageSpeed Insights API                 | bereikbaar maar 429 zonder API-sleutel                                                                                |
| CrUX                                   | niet beschikbaar (te weinig verkeer verwacht, geen sleutel)                                                           |
| Bing Webmaster Tools                   | niet gekoppeld                                                                                                        |
| Google Bedrijfsprofiel                 | bestaat volgens gebruiker; geen toegang in deze sessie                                                                |
| Browserpaneel (desktop)                | in deze sessie niet meer beschikbaar (remote-devices-tools weg); was ingelogd bij Cloudflare en Google                |
| WebFetch/WebSearch                     | tijdelijk gelimiteerd (5-uurslimiet bereikt om ~12:00)                                                                |

## Productie

### E1. Crawl productie (7 nov 2026, 22:05)

- Methode: `NODE_USE_ENV_PROXY=1 node scripts/seo/crawl.mjs` → `docs/seo/crawl-2026-11-07.csv`. Bron: sitemap-index,
  64 URL's. UA `GeldGarant-SEO-crawl/1.0`. Niet-renderend (kerninhoud is servergerenderd). Inlinks alleen binnen `<main>`.
- Alle 64: status 200, canonical = `https://geldgarant.com<pad>`, geen noindex/X-Robots-Tag, precies één H1, description
  110 tot 165 tekens, geen `<img>` zonder alt.
- Titels > 65 tekens: `/brief-ontvangen` (70), `/incasso/incasso-in-het-buitenland` (69).
- Zonder JSON-LD: `/vordering-indienen`.
- < 400 woorden in main: `/contact-opnemen` (242), `/juridisch` (101), `/vordering-indienen` (366).
- < 2 inkomende links vanuit main-inhoud: `/hulp-nodig-bij-geldproblemen`, `/incasso/incassobureau-inschakelen`,
  `/kennisbank/geleend-geld-terugvorderen`, `/kennisbank/huurachterstand-incasseren`, `/kennisbank/incasso-bouwsector`,
  `/kennisbank/incasso-zzp` (elk 1). Header/footer niet meegeteld.

### E2. HTTP-varianten (7 nov 2026)

- `curl -I http://geldgarant.com/` → `200 OK`, `cf-cache-status: HIT` (echte Cloudflare-respons, geen proxy-artefact).
  `http://www.geldgarant.com/` → 200. `https://www.geldgarant.com/` → 301 naar `https://geldgarant.com/` (goed).
- Gevolg: http-duplicaten bereikbaar; canonical wijst wel naar https, dus beperkt risico, maar onnodig.
- Let op: de livegangcontrole van 7 nov (OVERDRACHT §5.12) meldde "http → https" wel goed. Mogelijk verschil door de
  uitgaande proxy van deze werkomgeving. **Eerst bevestigen** in een gewone browser (http://geldgarant.com typen).
- **Bevestigd 7 nov 2026, 23:50** vanaf de pc van de gebruiker (gewone internetverbinding, geen proxy):
  `curl.exe -sI http://geldgarant.com/` → `HTTP/1.1 200 OK`, `CF-Cache-Status: HIT`, geen `Location`;
  `http://www.geldgarant.com/` → 200. De bevinding klopt: Always Use HTTPS moet aan.
- Oplossing als het klopt: Cloudflare → SSL/TLS → Edge Certificates → **Always Use HTTPS** aan (gebruiker; omkeerbaar).

### E3. Search Console (7 nov 2026)

- Ingelogd als geldgarant@gmail.com: "Je hebt geen toegang tot deze property" voor `sc-domain:geldgarant.com`.
- DNS heeft `google-site-verification=_Y0Q2jXF3Vgtj0ydot77QNi2uDX_c4WWnDcYBPkisEM` (ander account, waarschijnlijk oude
  bouwer). Voor geldgarant@gmail.com is een TXT-record nodig:
  `google-site-verification=IBklbLEvZbA3XR53hRmVoH-RuAY1GPVcEVf8zSlH5k0` (naam `@`). DNS-wijziging mocht Claude niet
  zelf opslaan; gebruiker gevraagd. Daarna: Verifiëren, sitemap `https://geldgarant.com/sitemap-index.xml` indienen.
- Controle 7 nov 2026, 23:50 (`Resolve-DnsName geldgarant.com -Type TXT -Server 1.1.1.1`): alleen het oude record
  `_Y0Q2…` en SPF. Het nieuwe TXT-record staat er **nog niet**.
- Web Analytics: homepage bevat geen `cloudflareinsights`; CSP staat het script niet toe. Nog niet aan.

### E5. robots.txt (7 nov 2026)

- Cloudflare Managed blok vóór eigen regels: blokkeert o.a. GPTBot, ClaudeBot, Google-Extended, GoogleOther,
  CCBot, Bytespider, meta-externalagent. Googlebot, Bingbot, OAI-SearchBot, PerplexityBot niet geblokkeerd.
  Eigen deel: `User-agent: * / Allow: /` en `Sitemap: https://geldgarant.com/sitemap-index.xml`.

## Extern (SERP-steekproef, 7 nov 2026, handmatig via WebSearch; niet gepersonaliseerd, geen volumes)

### E4

- "incassobureau inschakelen": KvK, Knab, MKB Servicedesk, dezaak, Trustoo. Informatief/vergelijkend; hoge autoriteit.
- "WIK brief voorbeeld": wikbriefversturen.nl, rechtspraak.nl, Stripe, Credifin. Sjabloon- en toolpagina's winnen.
- "incassobureau Deventer": Trustoo bovenaan, daarna lokale bureaus (o.a. Van den Bos & Jansen); lokaal pakket.
- "factuur niet betaald": banken, ondernemersplein/onderneming.nl, MKB Servicedesk.
- Conclusie (hypothese): op brede zoekvragen weinig kans op korte termijn; sjablonen/tools en lokaal zijn haalbaarder.

## Lokaal (tests)

- 7 nov 2026: `tests/unit/briefmaker.test.ts` (14) en `tests/unit/docx.test.ts` (3) groen. Word-bestanden van alle 6
  brieven geopend met python-docx en LibreOffice (pdf-render bekeken: sommatie 1 pagina, regeling 2 pagina's).

- 7 nov 2026, batch 2: `npm run check` 0 fouten, eslint en prettier schoon, 111 unit-tests, `check:html` 0 fouten,
  `check:seo` 73 pagina's zonder problemen, volledige e2e 993 groen (vóór quick wins), daarna gerichte e2e 72 groen
  (briefmaker, vordering-indienen, brief-ontvangen, buitenland, 14-dagenbrief), `audit:deps` 0 kwetsbaarheden.
  Browserproef briefmaker sommatie: alle velden ingevuld → 0 plaatshouders, Word-download `sommatie-2026-118.docx`
  geopend met python-docx. Screenshots 1440/390 van hub, betalingsregeling en briefmaker bekeken.

## Hypotheses (niet gemeten)

- Voorbeeldbrieven met invulhulp trekken zoekverkeer van ondernemers in de fase vóór incasso en leveren links op.
- Bedrijfsprofiel + Trustoo-vermelding verbeteren zichtbaarheid op "incassobureau Deventer".

### E6. Productiecrawl na batch 2 (7 nov 2026, ±23:20)

- 70 URL's (64 + 6 voorbeeldbrieven), alle 200, canonicals correct, geen noindex, één H1, geen titels > 65, alle
  pagina's met JSON-LD. Enige nieuwe afwijking: description `/voorbeeldbrieven` 174 tekens (ingekort in batch 2b).
  Ongewijzigd: dunne functionele pagina's en 6 zwak gelinkte pagina's (zie E1). CSV: `docs/seo/crawl-2026-11-07.csv`.

### E7. Productiecrawl vóór en lokale crawl na batch 3 (7 nov 2026, ±23:50)

- Productie (`node scripts/seo/crawl.mjs`, rechtstreeks vanaf de pc): 70 URL's, alle 200, geen afwijkingen behalve
  dunne functionele pagina's en de 6 zwak gelinkte pagina's (elk 1 inlink in main). CSV: `docs/seo/crawl-2026-11-07.csv`.
- Lokaal na batch 3 (`node scripts/seo/crawl.mjs http://localhost:4399`): `weinigInlinks` leeg. Inlinks in main:
  `/incasso/incassobureau-inschakelen` 9, `/hulp-nodig-bij-geldproblemen` 4, `/kennisbank/incasso-zzp` 4,
  `/kennisbank/geleend-geld-terugvorderen` 3, `/kennisbank/huurachterstand-incasseren` 3,
  `/kennisbank/incasso-bouwsector` 3, `/voorbeeldbrieven` 8.

### E8. Keyword-URL-kaart (7 nov 2026)

- `docs/seo/keyword-url-map.csv`: 56 zoekclusters, elk met één voorkeurs-URL (alle URL's gecontroleerd tegen de crawl).
  Geen zoekvolumes (geen databron); clusters zijn hypotheses, behalve waar E4 staat.
- Kannibalisatierisico's gevonden (titels die dezelfde vraag bedienen): `/wki` ↔ `/kennisbank/wki-proof-werken-2026`
  (titels bijna gelijk), `/branches/incasso-zzp` ↔ `/kennisbank/incasso-zzp` ("factuur niet betaald"),
  `/branches/incasso-verhuur` ↔ `/kennisbank/huurachterstand-incasseren` ("huurachterstand"), `/tarieven` ↔
  `/kennisbank/wat-kost-incasso-uitbesteden` ("wat kost een incassobureau"). Te bewaken: `/` ↔ `/incasso` ↔
  `/branches/incasso-mkb`, `/voorbeeldbrieven/betalingsregeling` ↔ `/kennisbank/betalingsregeling-treffen`.

### Lokaal batch 3 (8 nov 2026, Windows-pc)

- `npm run check` 0 fouten, eslint en prettier schoon, unit-tests groen, `check:html` 0 fouten, `check:seo` 73 pagina's
  zonder problemen, `audit:deps` 0 kwetsbaarheden.
- Volledige e2e (zonder visueel): 1002 groen, 6 rood: axe `scrollable-region-focusable` op desktop voor alle
  briefmaker-pagina's (`/incasso/wik-brief`, 5 voorbeeldbrieven). Oorzaak: het briefvoorbeeld `.papier` scrollt vanaf
  1080 px en was niet focusbaar; op Windows loopt de inhoud net over (in de Linux-omgeving niet). Fix: `<section
aria-label="Voorbeeld van de brief" tabindex="0">` in `src/components/Briefmaker.astro`. Daarna de 102 tests van die
  pagina's (kwaliteit + interacties) groen.

### E9. Search Console (8 nov 2026, ±01:00, browserpaneel, account met toegang tot `sc-domain:geldgarant.com`)

- Toegang werkt (TXT-record `IBklbLEv…` door de gebruiker toegevoegd, gecontroleerd via de Cloudflare-API).
  Always Use HTTPS staat nu `on` (Cloudflare-API, zone-instelling).
- Sitemaps: oud `https://geldgarant.com/sitemap.xml` (ingediend 13 apr 2026, gelezen 31 okt, 57 pagina's; geeft nu
  301 naar de index). Nieuw ingediend: `https://geldgarant.com/sitemap-index.xml`, direct gelezen, status Succesvol.
- Indexering (rapport bijgewerkt 23 okt 2026, dus vóór de livegang): 35 geïndexeerd, 32 niet. Redenen: noindex 5,
  omleiding 3, 404 2 (`/algemene-voorwaarden`, nu 301 naar `/juridisch/algemene-voorwaarden`; en
  `email.dossiers.geldgarant.com`, Mailgun-tracking, geen site), gecrawld niet geïndexeerd 11 (o.a.
  `/incasso/incassobureau-inschakelen`, `/incasso/incassokosten-berekenen`, `/hoe-werkt-het`, 7 kennisbankartikelen),
  gevonden niet geïndexeerd 11.
- URL-inspectie 8 nov: `/debiteurenbeheer`, `/incasso/incassobureau-inschakelen`, `/kennisbank/huurachterstand-incasseren`
  geïndexeerd (oude versie); `/voorbeeldbrieven` gevonden via de nieuwe sitemap, niet geïndexeerd. Voor alle vier
  "Indexering aanvragen" gedaan (prioriteitscrawlwachtrij).
- Prestaties, 16 maanden (grotendeels Framer-site): 137 klikken, 28,9K vertoningen, CTR 0,5%, gem. positie 43,1;
  704 zoekvragen. Niet integraal opgeslagen (enkele zoekvragen bevatten namen of nummers). Kern:
    - Merk/lokaal met klikken: "geldgarant" 31 klikken (pos 1,4); "incassobureau deventer" 7 klikken, 496 vert. (pos 4,1);
      "incassobureau" 217 vert. (pos 4,1).
    - Veel vertoningen, slechte positie: "debiteurenbeheer uitbesteden" 2.082 (65), "uitbesteden debiteurenbeheer" 391,
      "debiteurenbeheer mkb" 477; huurachterstand-cluster ("incasso verhuurder" 685, "incasso huurachterstand" 335,
      "huurachterstand" 322, plus regionale varianten Weert/Roermond/Venray/Noord-Brabant) samen ruim 3.000;
      "mkb incasso" + regionale varianten (Weert, Venray, Venlo, Roermond) ruim 3.000; "incassobureau zzp" 399 (53);
      "internationale incasso" 337 (47); "lege bv" 323 (50); "wik brief"/"wik-brief"/"wik" ±600 (37 tot 49).
    - Dicht bij pagina 1: "incasso e-commerce" 207 (12,1), "incasso webshops" 112 (18), "openstaande facturen" 260
      (19,1), "openstaande factuur" 138 (19,9), "beslagvrije voet 2026" en varianten (9 tot 14), "incasso zzp" 277 (23,9),
      "incasso bouw" 38 (21,8), "incasso groothandel" 33 (13,9), "incasso zorg" 20 (13,9).
- Beperking: de data meet de oude Framer-pagina's op dezelfde URL's; effect van de nieuwe site pas over 2 tot 4 weken
  zichtbaar.

### E10. Productiecrawl na batch 3 en titelscheiding (8 nov 2026, ±01:30, via 4G)

- `node scripts/seo/crawl.mjs`: 70 URL's, alle 200, geen afwijkingen behalve de 3 dunne functionele pagina's;
  `weinigInlinks` leeg. Varianten: `http://geldgarant.com/` → 301 naar https (Always Use HTTPS werkt);
  `http://www.` → 301 naar `https://www.` → 301 naar root (twee stappen, acceptabel).
- Verbinding: op het wifi van de huidige locatie van de gebruiker opent geldgarant.com niet (TCP naar 188.114.96.0/97.0
  faalt), andere sites wel; via 4G wel. Apart uitzoeken (niet-SEO).
- Titels gescheiden (masterplan 7b, akkoord gebruiker 8 nov), lengtes 54 tot 63 tekens: `/branches/incasso-zzp`,
  `/branches/incasso-verhuur`, `/tarieven`, en kennisbank `huurachterstand-incasseren`, `wki-proof-werken-2026`,
  `wat-kost-incasso-uitbesteden`; H1 van kennisbank `incasso-zzp` en `huurachterstand-incasseren`. Check, lint, unit,
  html, seo groen; e2e van de geraakte pagina's 99 groen.

### E11. Fase 4: /debiteurenbeheer (8 nov 2026)

- Aanleiding: GSC (E9) "debiteurenbeheer uitbesteden" 2.082 vertoningen, pos 65 (oude Framer-pagina).
- SERP-steekproef "debiteurenbeheer uitbesteden" en "… kosten mkb" (WebSearch, niet gepersonaliseerd, geen NL-locatie):
  vooral uitleg- en afwegingsartikelen (mtsprout.nl, mkbservicedesk.nl, dezaak.nl, mijnzzp.nl) en aanbieders;
  terugkerende vragen: wat het is, wanneer het loont, verschil met factoring, kosten. Geen van de bronnen noemt concrete
  prijzen; onze pagina wel (pakketten).
- Toegevoegd: sectie 04 "Wanneer loont het om uw debiteurenbeheer uit te besteden?" (`src/components/debiteuren/Afweging.astro`):
  wel/niet-afweging, vergelijking debiteurenbeheer / factoring / incasso, "Zo start u" in 3 stappen; 2 FAQ's (kosten,
  factoring); "uitbesteden" in lead en description. Alleen bestaande site-feiten; factoring algemeen beschreven.
  Woorden in main: 1.072 → 1.576 (gemeten in de build).
- Controles: check, lint, format, unit, build, html, seo groen; e2e /debiteurenbeheer + contact 45 groen; screenshots
  390/1440 bekeken, geen overloop.
- Live gecontroleerd na Workers Build (8 nov ±02:30): sectie `#uitbesteden` en factoring-FAQ staan op productie.
- GSC "Indexering aanvragen" 8 nov, totaal 6: `/debiteurenbeheer`, `/incasso/incassobureau-inschakelen`,
  `/kennisbank/huurachterstand-incasseren`, `/voorbeeldbrieven`, `/branches/incasso-verhuur`, `/branches/incasso-zzp`.

### E12. Fase 4: /branches/incasso-verhuur (8 nov 2026)

- Aanleiding: GSC (E9) huurachterstand-cluster ruim 3.000 vertoningen ("incasso verhuurder" 685, "incasso
  huurachterstand" 335, "aanmaning huurachterstand" 220, "1/2/3 maanden huurachterstand", "wanneer deurwaarder bij
  huurachterstand" 180).
- SERP-steekproef "incasso huurachterstand verhuurder incassobureau" (WebSearch, niet gepersonaliseerd):
  mkbservicedesk.nl ("wat als de huurder niet betaalt"), fora (Radar), modelbrieven (rocketlawyer.com, wonder.legal).
  Terugkerend: stappen per fase, regeling vóór incasso, ontruiming via de kantonrechter, sjablonen.
- Toegevoegd: optioneel veld `aanpak` in `src/data/branches.ts` en sectie "Zo pakken we een huurachterstand aan" in
  `src/pages/branches/[slug].astro` (4 stappen + links naar voorbeeld aanmaning, 14-dagenbriefmaker, voorbeeld
  betalingsregeling); nummering schuift mee (verhuur 01 tot 06, overige branches ongewijzigd 01 tot 05). 2 FAQ's
  (waarborgsom, woon- vs bedrijfsruimte). Inhoud volgt het kennisbankartikel (art. 7:231 BW, 14-dagenbrief).
  Woorden in main 706 → 1.010.
- Controles: check, lint, format, unit, build, html, seo groen; e2e alle branchepagina's 132 groen; screenshots
  390/1440 zonder overloop.

### E13. Fase 4: /branches/incasso-mkb (8 nov 2026)

- GSC (E9): "incasso mkb" 507 (38,5), "incassobureau mkb" 397 (42,9), "mkb incasso" 315 (35,5); daarnaast "mkb incasso"
    - Weert/Venray/Venlo/Roermond samen ±2.300 vertoningen. Die regionale varianten lijken een merk- of regionale
      zoekterm van een ander bureau; niet op gericht (geen stadspagina's, besluit).
- SERP-steekproef "mkb incasso" en "incassobureau mkb" (WebSearch, niet gepersonaliseerd): checklist MKB-Nederland
  "Incasso nodig? Weet wie je inhuurt" (mkb.nl), mkbservicedesk.nl (betrouwbaar incassobureau), Flanderijn
  (incassoproces mkb), platforms (incasso.nl, Syncasso). Kernvraag: hoe kies ik een betrouwbaar bureau.
- Toegevoegd via veld `aanpak` (nu ook `label` en `linksKop`): checklist "Zo kiest u een betrouwbaar incassobureau"
  (register Justis + NowID/IncassoKlacht, tarief bij volledige/deel/geen betaling, derdengeldenrekening + wekelijkse
  afdracht, rechter alleen met akkoord) met links naar de inschrijving bij Justis, /wki en /tarieven; FAQ "Hoe controleer
  ik of een incassobureau betrouwbaar is?". Gegevens uit `site.ts`. Woorden in main 680 → 933.
- Controles: check, lint, format, unit, build, html, seo groen; e2e alle branches 132 groen; screenshots 390/1440.

### E14. Fase 4: /incasso/incassobureau-inschakelen (8 nov 2026)

- GSC (E9): in de Framer-tijd "gecrawld, niet geïndexeerd"; URL-inspectie 8 nov: geïndexeerd, ter indexering aangeboden.
- SERP-steekproef "incassobureau inschakelen wanneer en hoe" (WebSearch, niet gepersonaliseerd): dezaak.nl,
  mkbservicedesk.nl, mijnzzp.nl, bobex.be, Atradius. Terugkerend: hoeveel herinneringen eerst, welke gegevens aanleveren,
  kosten, en wanneer het geen zin heeft (faillissement).
- Bestaand en goed: signalen, check "is mijn factuur klaar", vergelijking zelf/GeldGarant/advocaat, startstappen, FAQ
  (wachttijd, eerst aanmaning, relatie, deurwaarder, kosten, oude factuur).
- Toegevoegd: blok "Wanneer heeft inschakelen weinig zin?" (faillissement: kosteloos sluiten, curator op verzoek € 115
  excl. btw; inhoudelijk geschil: procedure via vaste partners met akkoord; verjaring: wij controleren eerst), met links
  naar 3 kennisbankartikelen; FAQ "Wat heb ik nodig om een incassobureau in te schakelen?" (volgt de velden van
  /vordering-indienen). Woorden in main 808 → 990.
- Controles: check, lint, format, unit, build, html, seo groen; e2e pagina groen; screenshots 390/1440 zonder overloop.

### E15. CI-Lighthouse en CLS /hulp-nodig-bij-geldproblemen (8 nov 2026)

- Eerste CI-run met de Lighthouse-steekproef (16 pagina's x 2, run 42430229959): binnen de tijdslimiet; 15 van 16
  pagina's halen alle drempels. `/hulp-nodig-bij-geldproblemen`: performance 0,93, CLS 0,169.
- Oorzaak (lokaal nagemeten met layout-shift-observer: alleen `span.accent "hulp"` verschuift): het accentfont laadt na
  de fallback; op Linux/Android ontbreekt Georgia, dus de H1 "Geldzorgen? Er is hulp" brak daar anders af dan na het
  laden van Newsreader. Fix: twee vaste regels (`.h1-regel`, nowrap). H1-tekst ongewijzigd; 2 regels op 320, 390 en
  1440 px, geen overloop. E2e van de pagina groen.
- CI-run 42431568238 (commit ae0a53a): **volledig groen**, voor het eerst sinds de livegang. Lighthouse-steekproef 16
  URL's x 2 runs: alle drempels (performance, toegankelijkheid, best practices, SEO >= 0,95; CLS <= 0,1) gehaald.

### E16. Snelle winst dicht bij pagina 1 (8 nov 2026)

- `/branches/incasso-ecommerce` (GSC: "incasso e-commerce" 207 vert. pos 12,1; "incasso webshops" 112 pos 18;
  "incassobureau webshop" 12; "incassobureau e-commerce" 9): title → "Incassobureau voor webshops en e-commerce";
  route in 3 stappen (aanleveren, 14-dagenbrief, bezwaar met bewijs) en links naar voorbeeld betalingsherinnering en
  14-dagenbriefmaker, alleen bestaande feiten van de pagina. Branche-sjabloon: 3 stappen = 3 kolommen op desktop.
- `/kennisbank/openstaande-factuur-stappenplan` (GSC: "openstaande facturen" 260 pos 19,1; "openstaande factuur" 138
  pos 19,9; "openstaande facturen innen" 42): seoTitle → "Openstaande facturen innen: stappenplan 2026", description
  begint met "Openstaande facturen innen?".
- `/kennisbank/beslagvrije-voet-2026` (GSC: "minimale beslagvrije voet 2026" 56 pos 11, 1 klik; "beslagvrije voet 2026"
  36 pos 14,2): description noemt nu minimum (95% van de bijstandsnorm) en 1 juli. Zoekers zijn vooral debiteuren
  (weinig acquisitiewaarde); bankbeslag niet uitgebreid zonder primaire bron (GSC: "beslagvrij bedrag bankbeslag 2026"
  66 pos 9,5 — kans, eerst bron nalopen).
- Controles: check, lint, format, unit, build, html, seo groen; e2e branches + beide artikelen groen; screenshots.

### E17. Fase 4 afgerond: /incasso en /tarieven (8 nov 2026)

- `/incasso` (GSC E9: "incasso b2b" 232 vert. pos 63,6, "b2b incasso" 57, "incasso voor ondernemers" 86 pos 50,
  "incasso uitbesteden" 38 pos 37). SERP-steekproef "incasso b2b zakelijke incasso uitbesteden": dezaak.nl
  (incasso-vergelijker), incasso.nl, bobex.be, Trustoo. Toegevoegd: B2B/B2C in lead en tabelkoppen, rij "Afwijken van de
  staffel" (bedrijf: kan via algemene voorwaarden; particulier: dwingend, art. 6:96 BW, zoals kennisbankartikel kosten),
  description noemt zakelijke klant of particulier.
- `/tarieven` (GSC: "incasso kosten" 80, "kosten incassobureau berekenen" 77, "incassobureau no cure no pay" pos 8,2).
  SERP-steekproef "wat kost een incassobureau no cure no pay": mkbservicedesk.nl, trustoo.nl, knab.nl, rechtspraak.nl
  (onduidelijke prijzen). Terugkerend: wat no cure no pay echt inhoudt, verborgen dossierkosten, faillissement.
  Toegevoegd: FAQ's "Werkt GeldGarant op basis van no cure, no pay?" en "Wat als de debiteur failliet gaat?" (feiten uit
  de lijsten "nooit" en "soms" op dezelfde pagina en de AV).
- Controles: check, lint, format, unit, build, html, seo groen; e2e /incasso en /tarieven groen; tabel op 320/390/1440
  zonder overloop.

### E18. Productie na fase 4, Bedrijfsprofiel en vermeldingen (8 nov 2026)

- Live gecontroleerd (via 4G): alle wijzigingen uit batch 3 tot 10 staan op productie. Productiecrawl
  (`docs/seo/crawl-2026-11-08.csv`): 70 URL's, alle 200, geen afwijkingen behalve 3 dunne functionele pagina's; alle
  http/www-varianten 301.
- GSC "Indexering aanvragen" 8 nov (tweede ronde, totaal 11): `/incasso`, `/tarieven`, `/branches/incasso-mkb`,
  `/branches/incasso-ecommerce`, `/kennisbank/openstaande-factuur-stappenplan`.
- Google-zoekresultaat "GeldGarant" (ingelogd als profielbeheerder): toont nog de oude Framer-title "GeldGarant: No Cure
  No Pay Incassobureau ..." en oude sitelinks (homepage nog niet opnieuw verwerkt). Vermeldingen in de resultaten:
  Justis, Company.info, Instagram (@geldgarant), Stagemarkt (leerbedrijf). Een uitspraak uit 2009 (ECLI:NL:GHAMS:2009:BI9212)
  noemt een "GeldGarant" uit 2005: andere onderneming dan KvK 90622375 (opgericht later); alleen ter info.
- Google Bedrijfsprofiel (Bedrijfsprofielmanager, account `/u/1`): 1 bedrijf, geverifieerd. 190 klantinteracties,
  4 nieuwe reviews, 1 "update van Google". Gegevens: naam GeldGarant, categorie Incassobureau, Keulenstraat 1, 7418 ET
  Deventer, 085 212 7388, website http://geldgarant.com/, LinkedIn. Afwijkend van de site: openingstijden ma-vr
  9.00-19.00 (site werkdagen 9.00-17.00), chat wa.me/31850835230 (oud nummer), servicegebied alleen Deventer,
  beschrijving ("no cure no pay is mogelijk in veel situaties", "Wet Incassokosten"). Niets gewijzigd (wacht op akkoord).
- Justis-register: actief, nr. 00273, adres goed, **telefoon 0850835230 (oud)**.
- NowID-ledenlijst: GeldGarant vermeld (nr. 71, KvK 90622375), zonder websitelink.
- Trustoo Deventer: niet vermeld. Trustpilot: profiel bestaat (0 reviews volgens zoekresultaten), automatische controle
  geblokkeerd.
- Alles met acties in `docs/seo/backlink-opportunities.csv`.

### E19. Bedrijfsprofiel bijgewerkt en reviews beantwoord (8 nov 2026, akkoord gebruiker)

- Ingediend via Bedrijfsprofiel-editor (Google beoordeelt bewerkingen, meestal binnen 10 minuten):
    - beschrijving vervangen door de voorgestelde tekst (595 tekens, alleen site-feiten);
    - chat-link wa.me/31850835230 (oud nummer) verwijderd;
    - website http://geldgarant.com/ → https://geldgarant.com/ (website en chat al zichtbaar als doorgevoerd);
    - openingstijden ma-vr 9.00-19.00 → 9.00-17.00, za/zo gesloten (gelijk aan site.ts).
- Niet gewijzigd: servicegebied (blijft Deventer). De suggestielijst viel buiten beeld, waardoor het land Nederland
  niet betrouwbaar te onderscheiden was van "Nederland, Texas"; voor een profiel met vast adres weinig effect.
- Reviews: 19 reviews, gemiddeld 5,0, geen enkele was beantwoord. De 4 nieuwe (laatste 24 uur) beantwoord met korte,
  persoonlijke reacties in "u"-vorm, zonder medewerkersnamen en zonder dossierdetails, ondertekend "team GeldGarant".
  15 oudere reviews nog onbeantwoord. Let op: enkele reviews komen van debiteuren (bijv. over een openstaand dossier);
  reacties daarop neutraal houden.

### E20. Netwerkblokkade, Web Analytics, IndexNow, voorbeeldbrief huurachterstand (8 nov 2026)

- **Wifi-probleem (huidige locatie gebruiker):** alle proxied hostnamen in de zone (geldgarant.com, www, api) krijgen van
  Cloudflare de IPv4-adressen 188.114.96.0 en 188.114.97.0. Op dat netwerk faalt TCP naar precies die twee adressen
  (curl `--resolve` naar 188.114.96.1, 188.114.97.7 en 188.114.96.10 met SNI geldgarant.com gaf 200; ook 104.21.0.1).
  Geen IPv6 op dat netwerk. Conclusie: router/firewall van het netwerk behandelt adressen op .0 als netwerkadres. Op het
  gratis Cloudflare-plan kiezen we de IP's niet zelf. Oplossing ligt bij de netwerkbeheerder (188.114.96.0 en
  188.114.97.0 toestaan); eventueel Cloudflare-support vragen. Raakt ook formulieren (api.geldgarant.com).
- **Web Analytics:** site bestond sinds 1 apr 2026 (Framer-tijd) met "Enable, excluding visitor data in the EU" en
  automatische injectie: daardoor geen data voor EU-bezoekers (1 paginaweergave in 24 uur). Omgezet naar handmatige
  installatie (UI; API-mutaties geblokkeerd door botcheck). Beacon in `src/layouts/Base.astro` (token in
  `site.cfBeaconToken`), laadt alleen op hostname geldgarant.com; CSP uitgebreid (script static.cloudflareinsights.com,
  connect cloudflareinsights.com). Privacy- en cookieverklaring aangepast ("we meten geen bezoekers" klopte niet meer),
  versie 2026-11-08, pdf's opnieuw gemaakt (Poppler via winget; script gebruikt nu `os.tmpdir()`).
- **IndexNow:** sleutelbestand `public/5a95a251ff2a96453f3636db6038652f.txt`, script `scripts/seo/indexnow.mjs`
  (alle URL's uit dist/sitemap-0.xml of opgegeven paden) naar api.indexnow.org (Bing, Yandex e.a.).
- **Homepage JSON-LD:** `@id`, logo, image, description, `sameAs` (LinkedIn uit het eigen Bedrijfsprofiel + inschrijving
  Justis). Instagram niet opgenomen (eigendom niet bevestigd).
- **GSC:** indexering homepage aangevraagd → "Quotum overschreden" (11 aanvragen op 8 nov). Morgen opnieuw.
- **Bankbeslag:** niet uitgewerkt. Primaire bronnen tonen alleen het wetsvoorstel 35225 (beslagvrij bedrag bij
  bankbeslag); de status in 2026 kon niet worden vastgesteld. Laten nalopen door een jurist.
- **Voorbeeldbrief huurachterstand:** nieuwe pagina `/voorbeeldbrieven/huurachterstand` (briefmaker-slug
  `huurachterstand`; woonruimte = particulier zonder kosten, met 14-dagenbrief-aankondiging, kantonrechter en
  hulpverwijzing Geldfit; bedrijfsruimte met incassokosten en contractuele of handelsrente). Bronnen BW7 (art. 7:231),
  BW6, BIK, BW3. Links vanaf hub, `/branches/incasso-verhuur` en kennisbankartikel. Unit-tests (15) groen; e2e 204 groen;
  browserproef: 0 open plaatshouders, Word-download werkt.

### E21. GEO fase A: robots.txt, prijs-schema, llms.txt (8 nov 2026)

- **Besluit gebruiker:** `ai-input=yes` en `Google-Extended` toestaan; training blijft uit (`ai-train=no`).
- **robots.txt in eigen beheer** (`public/robots.txt`, commit 3ca518a); Cloudflare "Managed robots.txt" door de
  gebruiker uitgezet. Live gecontroleerd: alleen onze inhoud, geen Cloudflare-blok ervoor;
  `Content-Signal: search=yes, ai-input=yes, ai-train=no`; Google-Extended niet geblokkeerd; alleen trainingscrawlers
  (GPTBot, ClaudeBot, CCBot, Applebot-Extended, Bytespider e.a.) op Disallow. OAI-SearchBot, Claude-SearchBot,
  PerplexityBot en Bingbot vallen onder `*` (toegestaan). UA-proef op /tarieven: 200 (zegt niets over geverifieerde
  bot-IP's, wel dat er geen UA-blokkade is).
- **Prijs-schema `/tarieven`:** Service "Incasso voor ondernemers" (Offer € 0, toelichting WIK) en Service
  "Debiteurenbeheer" met OfferCatalog uit `PAKKETTEN` (€ 99/199/349 p/m), provider `@id #organisatie`. Live bevestigd.
- **`/over-ons`:** feitenblok "GeldGarant in het kort" bestond al (Feitenkaart). Schema gekoppeld: ProfessionalService
  met `@id #organisatie` + `sameAs`, AboutPage `about` (commit 46332f8).
- **`/llms.txt`:** kernfeiten (Justis 00273, KvK, NowID, € 0 bij volledige betaling, pakketprijzen, start binnen het uur,
  wekelijkse afdracht, contact) en de belangrijkste pagina's; alle links bestaan in de build. Geen Google-effect (Google
  AI-optimalisatiegids); bedoeld voor andere systemen. `_headers`: charset=utf-8 voor llms.txt en robots.txt.
- **IndexNow:** Yandex 202 (geaccepteerd). **Bing 403 `UserForbiddedToAccessSite`**, ook rechtstreeks op
  bing.com/indexnow, terwijl het sleutelbestand live 200 geeft (ook met bingbot-UA). Oorzaak niet vastgesteld
  (Cloudflare-logs: dashboard logde uit, GraphQL-API geblokkeerd door botcheck). Oplossing: site in Bing Webmaster
  Tools verifiëren (import uit GSC), daarna opnieuw; anders Security Events op het sleutelpad bekijken.

### E22. Nulmeting AI-zichtbaarheid (8 nov 2026, ±12.15–12.30 uur)

Methode: browserpaneel, niet ingelogd (Perplexity, ChatGPT met zoeken; Google AI Mode via `udm=50`, cookies
geweigerd). Antwoorden variëren per sessie en locatie; ChatGPT kleurt naar de regio van de gebruiker (Deventer), dus
landelijke vragen zijn daar te gunstig. Copilot en Gemini niet gemeten.

| Vraag                                           | Perplexity                                  | Google AI Mode                | ChatGPT                        |
| ----------------------------------------------- | ------------------------------------------- | ----------------------------- | ------------------------------ |
| Wat is een goed incassobureau voor ondernemers? | nee (Bill Incasso, Atradius)                | nee (Debtt, e-Legal, Trustoo) | ja, nr. 2 (regionaal), oud nr. |
| Wat kost een incassobureau inschakelen?         | nee (KvK, Credifin, Atradius, Knab)         | –                             | –                              |
| Incassobureau no cure no pay Nederland          | nee (Credifin, Bill Incasso, Justice)       | nee (incasso.nl, Bierens)     | –                              |
| Incassobureau Deventer                          | ja, **oud tel. 085-0835230** (ProvenExpert) | ja, correct (Bedrijfsprofiel) | ja, nr. 2, **oud tel.**        |
| Welk incassobureau is geregistreerd bij Justis? | nee (Credifin 00023, Atradius 00127)        | –                             | –                              |
| Incassobureau voor zzp'ers                      | nee (Bill, Credifin, IncassoJuristen, GGN)  | nee (Invorderingsbedrijf)     | –                              |
| Debiteurenbeheer uitbesteden: wat kost dat?     | nee (creman, dockdock, onguard)             | –                             | –                              |
| Wat moet ik doen als een klant niet betaalt?    | nee                                         | –                             | –                              |

Bevindingen:

1. **Landelijk onzichtbaar**: op generieke vragen noemt geen enkel systeem GeldGarant (buiten ChatGPT's regionale
   kleuring). Steeds genoemd: Credifin, Bill Incasso, Atradius, GGN, Invorderingsbedrijf, Debtt, e-Legal; vaak geciteerd:
   kvk.nl, justis.nl, trustoo.nl, incassoadvocaten.nl.
2. **Lokaal zichtbaar** (Deventer) in alle drie, maar **twee van de drie geven het oude nummer 085 083 5230**. Bronnen met
   dat nummer (Google-zoekactie op het nummer): Justis-register, telefoonboek.nl, infobel.com, ProvenExpert. Het
   Bedrijfsprofiel (085 212 73 88) wordt alleen door Google gebruikt.
3. Antwoorden noemen bureaus met **een eigen registratienummer, concrete voorwaarden en reviews/vergelijkingssites**
   (Trustoo). Onze sterke punten (€ 0, binnen het uur, wekelijkse afdracht, 00273) worden nergens overgenomen.
4. ChatGPT noemt "15 beoordelingen" (Google-reviews) en "abonnementen voor debiteurenbeheer": het leest het
   Bedrijfsprofiel en de site.

**Doorlopende meting**: Ubersuggest-project "GeldGarant" (gratis plan; project-id
969bfaa272aadc3dd8eb50ebf22ed6f7a3bd51091d045fe1853407c83ec7ca03): 10 vragen uit §3 van GEO_PLAN, maandelijks, ChatGPT en
Google AI Overviews (Gemini niet in het plan), concurrenten Incassobureau.nl, Bierens, Flanderijn, Intrum, GGN; 20
zoekwoorden wekelijks (NL). Eerste rapport ±9–10 nov. Ahrefs-API: "Insufficient plan" (geen Brand Radar).

### E23. Kennisbank op citeerbaarheid nagelopen (8 nov 2026)

- Template al GEO-sterk: "In het kort" direct onder de H1, Article (`dateModified`, auteur "Redactie GeldGarant"),
  FAQPage, bronnen. Nieuw: Article-`publisher` met `@id #organisatie` (alle 27 artikelen één entiteit met home en
  /over-ons). Zichtbare datum blijft weg (besluit gebruiker).
- Eerste "kort"-zin van alle 27 artikelen naast de titelvraag gelegd: 26 geven direct antwoord. Aangepast:
  `wat-kost-incasso-uitbesteden` (lead en kort beginnen nu met "kost u meestal niets", staffel met maximum € 6.775;
  bijgewerkt 2026-11-08). De 3 artikelen die de website-chat juridisch corrigeerde, zijn niet aangeraakt.
- Cijfers 2026 gecontroleerd: handelsrente 10,4% per 1 juli 2026 en wettelijke rente 4% per 1 januari 2026
  (rijksoverheid.nl); griffierecht kanton 2026 € 139 tot € 1.504 voor rechtspersonen (rechtspraak.nl); maximale
  beslagvrije voet alleenstaande € 2.191,42 per 1 januari en € 2.208,48 per 1 juli 2026 (mededeling 1 juni 2026). Alles
  klopt met de artikelen.

### E24. Nieuw artikel "betrouwbaar incassobureau kiezen", homepage-schema, Wikidata-concept (8 nov 2026)

- **Waarom:** in de AI-nulmeting (E22) noemt geen enkel systeem GeldGarant op "goed incassobureau" en "geregistreerd bij
  Justis"; geciteerd worden keuzecriteria van Atradius, KvK en concurrenten.
- **`/kennisbank/betrouwbaar-incassobureau-kiezen`** (onderwerp regels): zeven controles als vraag-koppen (Justis-register,
  kosten per situatie in een tabel, derdengelden en afdracht, toon richting klant, dossier volgen en snelheid,
  klachten/geschillen, opdrachtvoorwaarden), checklist, slotblok met GeldGarant-feiten (00273, NowID/IncassoKlacht, € 0
  bij volledige betaling, derdengeldenrekening, wekelijkse afdracht, binnen het uur). Feiten uit de bestaande site
  (Wki-artikel, /nowid, /over-ons, /tarieven) en wetten.overheid.nl. Afgebakend van het Wki-artikel (wet) en
  `/incasso/incassobureau-inschakelen` (wanneer). Links: vanaf `/incasso/incassobureau-inschakelen` (keuze-noot) en
  `verwant` in het Wki-artikel; illustratie building+check. Keyword-kaart: cluster "incassobureau kiezen".
- **Homepage JSON-LD:** `identifier` (KvK 90622375, Incassoregister Justis 00273 met URL), `memberOf` NowID, `knowsAbout`.
- **Wikidata:** concept in `docs/seo/WIKIDATA_CONCEPT.md`; niet gepubliceerd (akkoord en account gebruiker nodig).

### E25. Bing-index, Copilot, debiteurenbeheer-kosten, branche-leads (8 nov 2026)

- **Bing-index:** `site:geldgarant.com` geeft op Bing onzin (Microsoft-loginpagina's), maar gerichte zoekopdrachten tonen
  minstens 10 geïndexeerde pagina's: home, /over-ons, /kennisbank en artikelen (avg, bv-uitgeschreven, algemene
  voorwaarden, betalingsregeling, kantonrechter, huurachterstand, eisen factuur), /incasso/incassokosten-berekenen.
  `url:https://geldgarant.com/tarieven` gaf niets. Bing kent de site dus gedeeltelijk; Bing Webmaster Tools blijft nodig
  (sitemap indienen, IndexNow-403 oplossen).
- **Copilot:** niet gemeten (vraagt inloggen).
- **Debiteurenbeheer-kosten:** geen apart artikel (zou kannibaliseren met `/debiteurenbeheer`, dat in de keyword-kaart
  "debiteurenbeheer kosten" heeft). In plaats daarvan de FAQ "Wat kost debiteurenbeheer uitbesteden?" met alle drie de
  pakketprijzen uit `PAKKETTEN` (Start € 99, Groei € 199, Zakelijk € 349 p/m excl. btw). Provider op /debiteurenbeheer
  gekoppeld aan `@id #organisatie`.
- **Correctie:** in het prijs-schema op /tarieven stond "inclusief N nieuwe dossiers"; dossierlimieten zijn volgens
  `src/lib/pakketten.ts` nog niet bevestigd. Vervangen door "vast bedrag per maand exclusief btw". Let op: het schema en de
  pakketkaarten op /debiteurenbeheer (website-chat) noemen de dossierlimieten wel; bevestiging door de gebruiker nodig.
- **Branchepagina's:** de hero-lead van alle 10 branches noemt nu GeldGarant als onderwerp ("GeldGarant int …" i.p.v.
  "Wij innen …"); verder niets gewijzigd.
- **CI-fout 5a5ce03:** e2e-test verwachtte exact 27 kennisbankartikelen; nu 28. Test telt nu de bestanden in
  `src/content/kennisbank`.

### E26. Eerste Ubersuggest-meting en controle gebruikersacties (10 nov 2026)

- **AI-zichtbaarheid (Ubersuggest, ChatGPT, 5 antwoorden op 8 nov; Google AIO nog niet geleverd):** GeldGarant 0
  vermeldingen, 0% zichtbaarheid, 0 citaties. Wel genoemd: e-Legal Incasso Advocaten (60%), Bill Incasso (60%),
  Invorderingsbedrijf (40%), Intercash, RIB Incasso, Smaal Finance, coeo, Aertery, NL Legal, Recht Incasso. Geciteerde
  domeinen: e-legal.nl (3), billincasso.nl, invorderingsbedrijf.nl, justis.nl, kvk.nl (elk 2), inspectie-jenv.nl,
  intercash.nl, mkb.nl, nl.legal, rechtspraak.nl, ribincasso.nl, rijksoverheid.nl, smaalfinance.nl, zzp-nederland.nl.
  Bevestigt E22: landelijk onzichtbaar; ChatGPT leunt op bureaus met veel eigen kennisartikelen en op overheidsbronnen.
- **Google-posities (Ubersuggest, NL desktop, 8 nov):** 3 van 20 zoekwoorden in de top 100: "incassobureau zzp" #26
  (/branches/incasso-zzp), "huurachterstand incasso" #28 (/branches/incasso-verhuur), "openstaande factuur" #40
  (/kennisbank/openstaande-factuur-stappenplan). Gemiddelde positie 31,3. Niet in top 100 o.a. "incassobureau" (6.600),
  "incassobureau inschakelen" (1.900), "incassokosten berekenen" (1.300), "no cure no pay incasso" (1.300), "wettelijke
  rente 2026" (880), "debiteurenbeheer" (720), "wik brief" (590). Volgende update 15 nov.
- **Gebruikersacties:** Justis-register toont nog 0850835230 (oud). Bing IndexNow nog 403 (Bing Webmaster Tools niet
  gekoppeld). Browserpaneel was opnieuw gestart: Google en Cloudflare uitgelogd, GSC-aanvragen wachten op inloggen.

### E27. Search Console: 10 indexeringsaanvragen en indexeringsanalyse (10 nov 2026)

- **Aangevraagd (10/10, quotum op):** `/` (geïndexeerd, herindexering), `/kennisbank/betrouwbaar-incassobureau-kiezen`
  (onbekend bij Google), `/voorbeeldbrieven/huurachterstand` (onbekend), `/tarieven`, `/incasso`, `/debiteurenbeheer`,
  `/incasso/incassobureau-inschakelen`, `/over-ons`, `/branches/incasso-zzp` (alle geïndexeerd, herindexering na
  wijzigingen) en `/kennisbank/wat-kost-incasso-uitbesteden` (gecrawld 23 aug, niet geïndexeerd).
- **GSC werkt nu zonder `/u/1`** (Google-account opnieuw ingelogd als standaardaccount); directe inspect-links geven 404,
  inspectie via het zoekveld.
- **Sitemaps:** `sitemap-index.xml` succesvol gelezen 10 nov, 72 URL's (incl. nieuw artikel); oude `/sitemap.xml`
  (Framer, 57 URL's) verwijst nu 301 naar de index.
- **Indexering:** 34 geïndexeerd, 34 niet. Redenen: noindex 5 (/faq, /juridisch/privacy-beleid, /cookie-beleid,
  /algemene-voorwaarden, /klachtenregelement; gecrawld aug-sep in Framer-tijd, nu allemaal 200 zonder noindex of 301), 404
  2 (/algemene-voorwaarden: nu 301; email.dossiers.geldgarant.com: subdomein van het dossierportaal, geen actie), omleiding
  2, alternatieve canonieke 1, **gecrawld niet geïndexeerd 13** (o.a. /voorbeeldbrieven (8 nov), /incasso/incassokosten-
  berekenen, /hoe-werkt-het, wki-proof-werken-2026, gerechtelijke-procedure-kantonrechter, eisen-correcte-factuur,
  wat-kost-incasso-uitbesteden, /branches/incasso-dienstverlening, algemene-voorwaarden-incasso, /incasso/incasso-in-het-
  buitenland; meeste gecrawld in de Framer-tijd), **gevonden niet geïndexeerd 11** (nooit gecrawld: creditmanagement,
  debiteur-betwist-factuur, geleend-geld-terugvorderen, griffierechten-2026, herincasso, hoger-beroep-vonnis,
  incasso-bouwsector, internationale-vordering, loonbeslag, selectief-betalen, plus de oude /sitemap.xml).
- **Conclusie:** geen technische blokkade; Google heeft de vernieuwde site nog niet opnieuw beoordeeld en geeft een jong
  domein weinig crawlbudget. Aanpak: dagelijks 10 aanvragen (wachtrij in SEO_STATE), interne links laten staan, Bing
  Webmaster Tools koppelen.
- **Klein:** `/algemene-voorwaarden/` (met slash) geeft 404, zonder slash 301. Geen actie nodig zolang er niet naar wordt
  gelinkt.

### E28. Bing Webmaster Tools (10 nov 2026)

- Gebruiker logde in met Google. **De site stond al in Bing Webmaster Tools** (geverifieerd, data sinds aug 2026: 12
  klikken, 755 vertoningen in 3 maanden). Bekende sitemaps waren alleen de oude Framer-sitemaps (`/sitemap.xml` en
  `www./sitemap.xml`, 57 URL's, laatst gelezen apr/jun 2026).
- **Ingediend:** `https://geldgarant.com/sitemap-index.xml` (status Processing) en via URL Submission **alle 72
  sitemap-URL's** (quotum 100 per dag; 28 over).
- **IndexNow:** BWT toont 25 URL's als ontvangen op 8 nov (bron "Self"), terwijl `bing.com/indexnow` en
  `api.indexnow.org` 403 `UserForbiddedToAccessSite` geven. De meldingen kwamen dus via yandex.com/indexnow (gedeeld
  protocol). `scripts/seo/indexnow.mjs` probeert nu eerst api.indexnow.org en valt terug op yandex.com (getest: 200).
- **BWT-aanbevelingen:** "IndexNow instellen" (zie boven), "te veel identieke meta descriptions" (huidige build: 74
  pagina's, 0 dubbel; melding stamt uit de Framer-crawl), "te weinig inkomende links van kwaliteitsdomeinen" (bekend;
  werkstroom C in GEO_PLAN).
