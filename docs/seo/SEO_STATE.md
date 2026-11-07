# SEO-status (hervattingspunt)

```yaml
last_updated: 2026-11-08 01:15 (Europe/Amsterdam)
current_branch: main
latest_commit: zie `git log -1` (batch 3 = 4b963ea live; daarna docs Search Console)
current_phase: 5 (interne links) en 2 (keyword-url-map) afgerond voor deze batch
current_task: geen lopende wijziging
status: batch 3 live (Workers Build success); Search Console gekoppeld, sitemap ingediend, 4 URL's ter indexering aangeboden
workspace: Windows-pc van de gebruiker, C:\Users\Ilyas Chattat\code\geldgarant-website (zie CLAUDE.md)
next_action: 1) Productiecrawl na batch 3 (op 8 nov niet gelukt: de pc van de gebruiker bereikte Cloudflare-adressen 188.114.96.0/97.0 niet; Google las de sitemap wel). 2) Kannibalisatie (masterplan 7b) voorleggen, nu met GSC-data: huurachterstand-cluster ruim 3.000 vertoningen, branche verhuur ↔ kennisbank. 3) Fase 4 commerciële pagina's, volgorde op basis van E9: /debiteurenbeheer (2.082 vertoningen op "debiteurenbeheer uitbesteden", pos 65), /branches/incasso-verhuur + kennisbank huurachterstand, /branches/incasso-mkb, /incasso/incassobureau-inschakelen. 4) Snelle winst dicht bij pagina 1 (E9): /branches/incasso-ecommerce, /kennisbank/openstaande-factuur-stappenplan, /kennisbank/beslagvrije-voet-2026. 5) Over 1 tot 2 weken: GSC indexering en prestaties nieuwe site; resterende kernpagina's ter indexering aanbieden (quotum per dag).
blocked_by: Web Analytics (gebruiker of token); akkoord titels kannibalisatie
production_state: batch 3 live (deploy 8 nov 00:25); productiecrawl na batch 3 nog open
preview_url: https://website.geldgarant.workers.dev (staging, zelfde Worker)
```

## Afgerond sinds vorig checkpoint (batch 3)

- Werkomgeving verhuisd naar de Windows-pc van de gebruiker: Git, Node 26, `gh` (ingelogd), repo gekloond, `npm ci`.
- Gebruikersacties gecontroleerd (E2, E3): http://geldgarant.com geeft 200 zonder redirect (bevestigd zonder proxy),
  TXT-record ontbreekt, Web Analytics staat uit.
- Interne links (E7): de 6 zwak gelinkte pagina's hebben nu 3 tot 9 inlinks in main; `/voorbeeldbrieven` 8.
    - Branchepagina's: nieuw veld `kennis` in `src/data/branches.ts`, getoond als eerste item in "Verder kijken"
      (`src/pages/branches/[slug].astro`, `getEntry`, build faalt bij onbekende slug).
    - `verwant` aangepast: betalingsregeling-treffen, verjaringstermijnen-vorderingen, debiteur-betwist-factuur,
      wat-kost-incasso-uitbesteden, eisen-correcte-factuur.
    - Contextuele links naar `/incasso/incassobureau-inschakelen`: openstaande-factuur-stappenplan, incasso-zzp,
      creditmanagement-openstaande-facturen-voorkomen, en onder de knop in de tipskaart van elke voorbeeldbrief.
    - Naar `/hulp-nodig-bij-geldproblemen`: betalingsregeling-treffen, huurachterstand-incasseren, debiteurenkaart op
      `/contact-opnemen`.
    - `/incasso` "Meer over incasso": + voorbeeldbrieven, + stappenplan; `/kennisbank` "Begin hier": + voorbeeldbrieven.
- Keyword-URL-kaart (E8): `docs/seo/keyword-url-map.csv`, 56 clusters; 4 kannibalisatierisico's gevonden.
- Toegankelijkheid: briefvoorbeeld in de briefmaker focusbaar gemaakt (axe scrollable-region-focusable, zichtbaar op Windows).

## Besluiten

- 14-dagenbrief blijft op `/incasso/wik-brief` (geen kannibalisatie). Geen stadspagina's.
- Briefmaker-formulier is een `<div>` (niets wordt verstuurd; html-validate eist anders een verzendknop).
- Particulier: aanmaning/ingebrekestelling zonder incassokosten; sommatie alleen met vinkje.
- Productie-release = push naar `main`.
- Titelwijzigingen tegen kannibalisatie pas na akkoord gebruiker of GSC-data (nog niet doorgevoerd).

## Gewijzigde bestanden (batch 3)

`src/components/Briefmaker.astro`, `src/data/branches.ts`, `src/pages/branches/[slug].astro`, `src/pages/incasso/index.astro`,
`src/pages/kennisbank/index.astro`, `src/pages/voorbeeldbrieven/[slug].astro`, `src/pages/contact-opnemen.astro`,
8 kennisbankartikelen, `docs/seo/{SEO_STATE,SEO_MASTERPLAN,SEO_EVIDENCE}.md`, `docs/seo/keyword-url-map.csv`,
`docs/seo/crawl-2026-11-07.csv`, `CLAUDE.md`.

## Tests

Zie `SEO_EVIDENCE.md` (lokaal batch 3).

## Open risico's en controles

- Visuele snapshots (`-linux.png`) van `/incasso`, `/kennisbank`, `/contact-opnemen`, branches en voorbeeldbrieven zijn
  verouderd door de nieuwe links. Niet op Windows bijwerken; bij een volgende sessie in de cloudomgeving
  `npx playwright test --grep @visueel --update-snapshots` voor die pagina's. De CI draait ze niet.
- Brieftekst niet door een jurist nagelopen; pagina's zeggen "geen juridisch advies".
- Web Analytics vereist CSP-aanpassing in `public/_headers` (script `https://static.cloudflareinsights.com`, connect
  `https://cloudflareinsights.com`) en een update van cookie- en privacyverklaring (+ `node scripts/juridisch-pdf.mjs`).
- `/juridisch` (101 woorden): overzichtspagina; beoordelen (meer inhoud of uit sitemap).
- Lighthouse niet opnieuw gedraaid voor de nieuwe pagina's (`npm run lhci`, ± 40 min; CI draait het bij push).

## Gebruikersacties (gebundeld)

1. ~~TXT-record Search Console~~ **gedaan 8 nov** (E9).
2. ~~Always Use HTTPS~~ **aan sinds 8 nov** (Cloudflare-API `on`; http-redirect zelf nog niet getest door de
   verbindingsstoring vanaf de pc).
3. Cloudflare → Web Analytics → geldgarant.com toevoegen; liefst "handmatig" en het token doorgeven (Claude zet de
   beacon in `Base.astro` en past de CSP aan).
4. Bedrijfsprofiel: screenshots of export van categorie, adres, uren en website-URL.

## Laatste werkstappen

1. Omgeving opgezet op de pc, docs gelezen, `main` op `22ab9ce`, schone werkboom.
2. Productiecrawl, gebruikersacties gecontroleerd.
3. Interne links (batch 3), lokale crawl, keyword-url-map.
4. QA: check, lint, format, unit, build, html, seo, e2e (1002 + 102 groen na a11y-fix briefvoorbeeld).
5. Docs bijgewerkt, commit + push (`4b963ea`), Workers Build success.
6. Search Console: sitemap-index ingediend, indexering en prestaties uitgelezen (E9), 4 URL's ter indexering.
