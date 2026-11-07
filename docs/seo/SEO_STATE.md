# SEO-status (hervattingspunt)

```yaml
last_updated: 2026-11-07 23:00 (Europe/Amsterdam)
current_branch: main
latest_commit: zie `git log -1` (batch 2: voorbeeldbrieven + quick wins)
current_phase: 3/5 afgerond voor deze batch; volgende 5 (interne links) en 2 (keyword-url-map)
current_task: geen lopende wijziging
status: batch 2 gepusht naar main (= productie via Workers Builds)
next_action: 1) Controleer productie: `NODE_USE_ENV_PROXY=1 node scripts/seo/crawl.mjs` (verwacht 70 URL's, geen titels > 65, /vordering-indienen met JSON-LD) en open /voorbeeldbrieven/sommatie live. 2) Vraag/controleer gebruikersacties hieronder (TXT, Always Use HTTPS, Web Analytics). 3) Taak 6 uit het masterplan: interne links naar /incasso/incassobureau-inschakelen, /hulp-nodig-bij-geldproblemen en de 4 zwak gelinkte kennisbankartikelen (vanuit /incasso, branches, verwante artikelen), plus links naar /voorbeeldbrieven vanaf /incasso en /kennisbank. 4) docs/seo/keyword-url-map.csv maken (fase 2).
blocked_by: Search Console (TXT-record door gebruiker), Always Use HTTPS (gebruiker), Web Analytics (gebruiker of token)
production_state: geldgarant.com live; batch 2 gepusht 7 nov ±23:00
preview_url: https://website.geldgarant.workers.dev (staging, zelfde Worker)
```

## Afgerond sinds vorig checkpoint

- Voorbeeldbrieven-bibliotheek live: `/voorbeeldbrieven` + 5 briefpagina's, briefmaker (live voorbeeld, Word, pdf,
  kopiëren) ook op `/incasso/wik-brief#briefmaker`. Tijdlijn-component `src/components/BriefTijdlijn.astro`.
- Interne links: footer "Gratis voorbeeldbrieven", kennisbank `openstaande-factuur-stappenplan`,
  `betalingsherinnering-aanmaning-wik-brief`, `betalingsregeling-treffen` linken naar de brieven.
- Titels ingekort (`/brief-ontvangen`, `/incasso/incasso-in-het-buitenland`), JSON-LD op `/vordering-indienen`.
- E2E: briefmakertests in `tests/e2e/interacties.spec.ts`; nieuwe routes in `tests/e2e/pages.ts`; visuele snapshots
  bijgewerkt (footer kreeg een link) en toegevoegd voor de nieuwe pagina's.

## Besluiten

- 14-dagenbrief blijft op `/incasso/wik-brief` (geen kannibalisatie). Geen stadspagina's.
- Briefmaker-formulier is een `<div>` (niets wordt verstuurd; html-validate eist anders een verzendknop).
- Particulier: aanmaning/ingebrekestelling zonder incassokosten; sommatie alleen met vinkje.
- Productie-release = push naar `main`.

## Gewijzigde bestanden (batch 2)

`src/components/{Briefmaker,BriefTijdlijn}.astro`, `src/scripts/briefmaker.ts`, `src/pages/voorbeeldbrieven/{index,[slug]}.astro`,
`src/pages/incasso/wik-brief.astro`, `src/pages/vordering-indienen.astro`, `src/pages/brief-ontvangen/index.astro`,
`src/pages/incasso/incasso-in-het-buitenland.astro`, `src/components/Footer.astro`, 3 kennisbankartikelen,
`tests/e2e/{pages,interacties.spec}.ts`, snapshots, `scripts/dev/briefmaker-proef.mjs`, `CLAUDE.md`, `docs/*`.

## Tests

Zie `SEO_EVIDENCE.md`, lokaal batch 2.

## Open risico's en controles

- Brieftekst niet door een jurist nagelopen; pagina's zeggen "geen juridisch advies".
- Web Analytics vereist CSP-aanpassing in `public/_headers` (script `https://static.cloudflareinsights.com`, connect
  `https://cloudflareinsights.com`) en een update van cookie- en privacyverklaring (+ `node scripts/juridisch-pdf.mjs`).
- `/juridisch` (101 woorden): overzichtspagina; beoordelen (meer inhoud of uit sitemap).
- Lighthouse niet opnieuw gedraaid voor de nieuwe pagina's (`npm run lhci`, ± 40 min).

## Gebruikersacties (gebundeld)

1. Cloudflare DNS: TXT `@` = `google-site-verification=IBklbLEvZbA3XR53hRmVoH-RuAY1GPVcEVf8zSlH5k0` (dan kan Claude in
   Search Console verifiëren en de sitemap indienen; vereist het browserpaneel met Google-login).
2. Cloudflare SSL/TLS → Edge Certificates → Always Use HTTPS aan (http:// geeft nu 200, E2).
3. Cloudflare → Web Analytics → geldgarant.com toevoegen; liefst "handmatig" en het token doorgeven (Claude zet de
   beacon in `Base.astro` en past de CSP aan).
4. Bedrijfsprofiel: screenshots of export van categorie, adres, uren en website-URL.

## Laatste werkstappen

1. Masterprompt verwerkt, skills, productiecrawl (batch 1, commit bfb1a58).
2. Briefmaker-component, pagina's, wik-brief-sectie, interne links.
3. html-validate-fouten opgelost (landmark, form zonder knop).
4. QA: check, lint, format, unit, build, html, seo, e2e (993 + 72), audit.
5. Snapshots bijgewerkt, docs bijgewerkt, commit + push.
