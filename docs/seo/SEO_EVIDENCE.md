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
