# SEO-status (hervattingspunt)

```yaml
last_updated: 2026-11-08 10:30 (Europe/Amsterdam)
current_branch: main
latest_commit: zie `git log -1` (batch 11: voorbeeldbrief huurachterstand, Web Analytics, IndexNow, JSON-LD)
current_phase: 6 (lokaal): Bedrijfsprofiel bijgewerkt (E19); 7 (vermeldingen): lijst klaar (E18)
current_task: geen lopende wijziging
status: batch 3 live (Workers Build success); Search Console gekoppeld, sitemap ingediend, 4 URL's ter indexering aangeboden
workspace: Windows-pc van de gebruiker, C:\Users\Ilyas Chattat\code\geldgarant-website (zie CLAUDE.md)
next_action: 0) GEO/AEO volgens docs/seo/GEO_PLAN.md: wacht op besluiten gebruiker (ai-input, Google-Extended, data-tool); zonder besluit uitvoerbaar: Service/Offer-schema /tarieven, feitenblok /over-ons, llms.txt, nulmeting vragenset in het browserpaneel. 1) 9 nov: GSC indexering homepage aanvragen (quotum 8 nov op) + /voorbeeldbrieven/huurachterstand. 2) Na deploy: `node scripts/seo/indexnow.mjs` (alle URL's) en controleren dat Web Analytics data binnenkrijgt (dashboard, 24 uur). 3) Over 1 tot 2 weken (±15 nov): GSC prestaties per pagina vs E9, keyword-url-map bijwerken, titels/descriptions bijsturen op CTR. 4) Gebruiker: Justis-telefoon, KvK/LinkedIn/Instagram, oudere reviews, eventueel servicegebied; netwerkbeheerder op de huidige locatie vragen 188.114.96.0 en 188.114.97.0 toe te staan (E20). 5) Bankbeslag alleen na juridische check (E20). 6) Bing Webmaster Tools koppelen (gebruiker inloggen met Microsoft-account; importeren uit GSC).
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

## Bedrijfsprofiel

Bijgewerkt op 8 nov na akkoord (E19): beschrijving, chat-link verwijderd, https, openingstijden 9.00-17.00. Servicegebied
niet gewijzigd. 4 nieuwe reviews beantwoord; de 15 oudere beantwoordt de gebruiker zelf.

## Gebruikersacties (gebundeld)

1. ~~TXT-record Search Console~~ **gedaan 8 nov** (E9).
2. ~~Always Use HTTPS~~ **aan sinds 8 nov** (Cloudflare-API `on`; http-redirect zelf nog niet getest door de
   verbindingsstoring vanaf de pc).
3. ~~Web Analytics~~ gedaan door Claude (E20).
4. ~~Bedrijfsprofiel: akkoord~~ gegeven en doorgevoerd (E19).
5. Justis: telefoonnummer in het incassoregister wijzigen naar 085 212 73 88 (staat op 085 083 5230).
6. KvK, LinkedIn, Instagram-bio: website en telefoon controleren (zie backlink-opportunities.csv).

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
14. CLS-fix H1 /hulp-nodig-bij-geldproblemen (E15); CI volledig groen.
15. Snelle winst: e-commerce, stappenplan, beslagvrije voet (batch 9, E16); CI groen.
16. /incasso B2B/B2C + staffelrij, /tarieven FAQ no cure no pay en faillissement (batch 10, E17), live.
17. Productiecrawl, 5 extra URL's ter indexering, Bedrijfsprofiel en vermeldingen geïnventariseerd (E18).
18. Bedrijfsprofiel bijgewerkt en 4 nieuwe reviews beantwoord (E19).
19. Wifi-oorzaak gevonden (.0-adressen), Web Analytics gerepareerd (EU uitgesloten → handmatig), IndexNow, JSON-LD, voorbeeldbrief huurachterstand (E20).
20. **Website-chat (8 nov):** geen titles, descriptions, H1's of URL's gewijzigd. Wel: eigen foto's (AVIF/WebP via `astro:assets`, alt zonder namen) op home 04, /over-ons (kantoor) en /werken-bij (hero); kennisbankkaarten op home, /kennisbank en "Verder lezen" hebben een illustratie per artikel (`src/lib/kennisbeeld.ts`, inline SVG, `aria-hidden`); op de homekaarten staat de leestijd in plaats van de datum (besluit: kennisbank zonder zichtbare datum). WhatsApp-link met begintekst in footer, mobiel menu, home en /contact-opnemen. Uptimecontrole elk kwartier (`.github/workflows/uptime.yml`).
