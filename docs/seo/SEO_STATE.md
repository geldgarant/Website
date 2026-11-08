# SEO-status (hervattingspunt)

```yaml
last_updated: 2026-11-08 05:30 (Europe/Amsterdam)
current_branch: main
latest_commit: zie `git log -1` (batch 8: inschakelen, weinig zin + FAQ)
current_phase: 4 (commerciële pagina's): /debiteurenbeheer, verhuur, mkb, inschakelen klaar (E11 tot E14)
current_task: geen lopende wijziging
status: batch 3 live (Workers Build success); Search Console gekoppeld, sitemap ingediend, 4 URL's ter indexering aangeboden
workspace: Windows-pc van de gebruiker, C:\Users\Ilyas Chattat\code\geldgarant-website (zie CLAUDE.md)
next_action: 1) Snelle winst dicht bij pagina 1 (E9): /branches/incasso-ecommerce ("incasso e-commerce" pos 12, "incasso webshops" 18), /kennisbank/openstaande-factuur-stappenplan ("openstaande facturen" 19), /kennisbank/beslagvrije-voet-2026 (9 tot 14): title/description/intro scherper op de zoekvraag, ontbrekende antwoorden. 2) Fase 4 rest: /incasso en /tarieven (SERP-vergelijking). 3) Kans: voorbeeldbrief huurachterstand (eerst kannibalisatiecheck). 4) GSC: mkb, inschakelen-wijziging ter indexering (quotum per dag); over 1 tot 2 weken prestaties meten. 5) Niet-SEO: wifi-probleem huidige locatie (E10). 6) CI is groen (run 42431568238); bij elke batch de CI-uitkomst controleren.geldgarant.workers.dev (staging, zelfde Worker)
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
7. Productiecrawl na batch 3 schoon (E10); titels van 4 kannibalisatieparen gescheiden (batch 4), live gecontroleerd.
8. CI-tijdslimiet 20 → 60 min (Lighthouse werd steeds afgebroken).
9. /debiteurenbeheer: sectie afweging/factoring/start + 2 FAQ's (batch 5, E11), live; 6 URL's ter indexering.
10. /branches/incasso-verhuur: sectie aanpak per fase + brieflinks + 2 FAQ's (batch 6, E12), live.
11. /branches/incasso-mkb: checklist betrouwbaar incassobureau + FAQ (batch 7, E13), live.
12. /incasso/incassobureau-inschakelen: blok weinig zin + FAQ benodigdheden (batch 8, E14), live.
13. CI: Lighthouse in GitHub Actions op een steekproef per sjabloon (alle pagina's x 3 runs duurde > 60 min).
14. CLS-fix H1 /hulp-nodig-bij-geldproblemen (E15).
