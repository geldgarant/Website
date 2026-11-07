# SEO-status (hervattingspunt)

```yaml
last_updated: 2026-11-08 00:10 (Europe/Amsterdam)
current_branch: main
latest_commit: zie `git log -1` (batch 3: interne links + keyword-url-map)
current_phase: 5 (interne links) en 2 (keyword-url-map) afgerond voor deze batch
current_task: geen lopende wijziging
status: batch 3 gepusht naar main (= productie via Workers Builds)
workspace: Windows-pc van de gebruiker, C:\Users\Ilyas Chattat\code\geldgarant-website (zie CLAUDE.md)
next_action: 1) Productiecrawl na batch 3 (verwacht weinigInlinks leeg). 2) Gebruikersacties hieronder (TXT, Always Use HTTPS, Web Analytics); daarna in het browserpaneel Search Console verifiëren en sitemap indienen. 3) Kannibalisatie (masterplan 7b): voorstel titels voorleggen (branche zzp/verhuur → "incassobureau voor …", kennisbank Wki → "Wki-proof werken als schuldeiser"). 4) Fase 4: /incasso/incassobureau-inschakelen (SERP-vergelijking, ontbrekende antwoorden).
blocked_by: Search Console (TXT-record door gebruiker), Always Use HTTPS (gebruiker), Web Analytics (gebruiker of token)
production_state: batch 2 live en gecontroleerd; batch 3 gepusht
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

1. Cloudflare DNS: TXT `@` = `google-site-verification=IBklbLEvZbA3XR53hRmVoH-RuAY1GPVcEVf8zSlH5k0` (dan kan Claude in
   Search Console verifiëren en de sitemap indienen; vereist het browserpaneel met Google-login). **Nog niet gedaan
   (gecontroleerd 7 nov 23:50).**
2. Cloudflare SSL/TLS → Edge Certificates → **Always Use HTTPS** aan. **Bevestigd nodig**: http://geldgarant.com geeft
   200 zonder redirect (E2).
3. Cloudflare → Web Analytics → geldgarant.com toevoegen; liefst "handmatig" en het token doorgeven (Claude zet de
   beacon in `Base.astro` en past de CSP aan).
4. Bedrijfsprofiel: screenshots of export van categorie, adres, uren en website-URL.

## Laatste werkstappen

1. Omgeving opgezet op de pc, docs gelezen, `main` op `22ab9ce`, schone werkboom.
2. Productiecrawl, gebruikersacties gecontroleerd.
3. Interne links (batch 3), lokale crawl, keyword-url-map.
4. QA: check, lint, format, unit, build, html, seo, e2e (1002 + 102 groen na a11y-fix briefvoorbeeld).
5. Docs bijgewerkt, commit + push.
