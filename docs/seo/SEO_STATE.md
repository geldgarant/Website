# SEO-status (hervattingspunt)

```yaml
last_updated: 2026-11-07 22:15 (Europe/Amsterdam)
current_branch: main
latest_commit: zie `git log -1` (batch 1: SEO-basis, skills, crawler, briefmaker-kern)
current_phase: 5 (voorbeeldbrieven) parallel aan 0/9 (meetketen, wacht op gebruiker)
current_task: Voorbeeldbrieven-bibliotheek, pagina's bouwen
status: in uitvoering; kern (lib + Word + tests) klaar, pagina's nog niet
next_action: Bouw src/components/Briefmaker.astro + src/scripts/briefmaker.ts en de pagina's src/pages/voorbeeldbrieven/index.astro en [slug].astro (data uit src/data/voorbeeldbrieven.ts); daarna briefmaker op /incasso/wik-brief (#briefmaker), pages.ts in e2e uitbreiden, interne links, npm run qa, screenshots, commit, push.
blocked_by: Search Console (TXT-record door gebruiker), Always Use HTTPS (gebruiker), Web Analytics (Cloudflare-dashboard)
production_state: geldgarant.com live sinds 7 nov 2026 (Worker website, commit 4b4b775 + batch 1 zonder zichtbare wijziging)
preview_url: https://website.geldgarant.workers.dev (staging, zelfde Worker)
```

## Afgerond sinds vorig checkpoint

- SEO-masterprompt verwerkt: `docs/seo/SEO_MASTERPLAN.md`, `SEO_STATE.md`, `SEO_EVIDENCE.md`.
- Skills repo-lokaal: claude-seo (seo-audit, seo-technical, seo-schema, seo-local, seo-geo, seo-backlinks, seo-plan,
  seo-page, seo-content, seo-content-brief, seo-cluster, seo-sitemap, seo-claude) en marketingskills (ai-seo,
  link-building, site-architecture, copywriting, analytics, conversion-tracking, free-tools, mk-schema, mk-seo-audit).
  Geregistreerd in `.claude/skills/THIRD_PARTY.md` en `scripts/update-skills.sh`.
- Crawler `scripts/seo/crawl.mjs` + productiecrawl (E1).
- Briefmaker-kern: `src/lib/briefmaker.ts` (6 brieven), `src/lib/briefHtml.ts`, `src/lib/docx.ts` (Word zonder
  afhankelijkheden), `src/data/voorbeeldbrieven.ts` (paginatekst 5 brieven + kaart 14-dagenbrief), tests.
- WAF-regel blokkeert `/api/internal/` (aanroepen oude bouwer), eerder vandaag.

## Besluiten

- 14-dagenbrief krijgt geen eigen `/voorbeeldbrieven/`-pagina: `/incasso/wik-brief` is de voorkeurs-URL (geen
  kannibalisatie); daar komt de briefmaker bij, anker `#briefmaker`.
- Geen stadspagina's (dunne inhoud); lokaal via Bedrijfsprofiel en vermeldingen.
- Word-bestand client-side (eigen zip, `stored`), pdf via `window.print()` met printstijl; geen afhankelijkheden.
- Brieven zonder vaste einddatum bij de 14-dagenbrief (termijn vanaf dag na ontvangst); andere brieven wel met datum.
- Particulier: aanmaning en ingebrekestelling noemen geen incassokosten; sommatie alleen met vinkje "14-dagenbrief
  verstuurd en verlopen".
- Productie-release = push naar `main` (bestaande projectwerkwijze).

## Gewijzigde bestanden (batch 1)

`docs/seo/*`, `scripts/seo/crawl.mjs`, `.claude/skills/{seo-*,mk-*,ai-seo,link-building,site-architecture,copywriting,analytics,conversion-tracking,free-tools}`,
`.claude/skills/THIRD_PARTY.md`, `scripts/update-skills.sh`, `src/lib/{briefmaker,briefHtml,docx}.ts`,
`src/data/voorbeeldbrieven.ts`, `tests/unit/{briefmaker,docx}.test.ts`.

## Tests

- `npx vitest run tests/unit/briefmaker.test.ts tests/unit/docx.test.ts`: 17 groen.
- Word-bestanden gerenderd met LibreOffice: correct (zie E-lokaal).

## Open risico's en controles

- Brieftekst juridisch nagelopen door Claude op basis van BW 6:82/6:83/6:96 lid 6/6:119a, 3:317/3:318 en het
  Besluit; geen advocaatcontrole. Pagina's labelen als voorbeeld, geen juridisch advies.
- Web Analytics vereist CSP-aanpassing in `public/_headers`.
- `/juridisch` (101 woorden) is een overzichtspagina; beoordelen of noindex of meer inhoud.

## Gebruikersacties (gebundeld)

1. Cloudflare DNS: TXT `@` = `google-site-verification=IBklbLEvZbA3XR53hRmVoH-RuAY1GPVcEVf8zSlH5k0`.
2. Cloudflare SSL/TLS → Edge Certificates → Always Use HTTPS aan.
3. Cloudflare → Web Analytics → site geldgarant.com toevoegen, kies "handmatig" (JS-snippet) en geef het token door,
   of automatische injectie (dan eerst CSP aanpassen; Claude doet dat).
4. Bedrijfsprofiel: Claude als beheerder toevoegen is niet mogelijk; stuur een export of screenshots van categorie,
   adres, uren, website-URL.

## Laatste werkstappen

1. SEO-skill geladen, nulmeting en SERP-steekproef (E1, E4).
2. Search Console geopend: geen toegang, verificatiewaarde opgehaald (E3).
3. Briefmaker-kern + tests + Word-render.
4. Masterprompt verwerkt in deze map, skills geïnstalleerd, productiecrawl gedraaid.
