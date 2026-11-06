# GeldGarant website: overdracht (6 nov 2026)

Lees dit samen met `CLAUDE.md` (projectregels en ontwerpsysteem). Dit document beschrijft waar het project staat, hoe alles werkt en wat de volgende sessie moet doen.

## 1. Stand van zaken

| Onderdeel         | Status                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Repo              | https://github.com/geldgarant/Website, branch `main`, laatste commit: zie `git log`                                 |
| Hosting (staging) | Cloudflare Workers "website" → https://website.geldgarant.workers.dev, bouwt automatisch bij elke push         |
| Productie         | geldgarant.com draait nog op Framer. DNS pas omzetten als de hele site af is, en alleen samen met de gebruiker |
| Homepage          | v3 af, inclusief header v2 (zwevende kaart). Alle kwaliteitspoorten groen                                      |
| Overige pagina's  | Nog niet gebouwd (zie §6). Alle links op de homepage wijzen al naar de juiste URL's                            |

**Akkoord van de gebruiker (Anas):**

- De opbouw van homepage v3 en de nieuwe header bevallen.
- Compliance-teksten bepalen ze zelf. De H1 "Wij halen uw geld wél op" blijft staan; daar niets aan veranderen.
- Het idee van een debiteurenpagina "Brief ontvangen?" is goedgekeurd.
- Opdracht: de kwaliteit en het doel per sectie op elke pagina vasthouden. Breyta blijft de maatstaf, en voor creativiteit steeds ook andere incasso- en fintech-sites bekijken.

## 2. Werkomgeving en commando's

- Projectmap: `/home/claude/geldgarant-site`. Een nieuwe sessie moet de repo eerst klonen; `add_repo geldgarant/Website` met push-toegang werkt.
- Stel altijd `CHROME_PATH=/usr/bin/google-chrome` in: browserdownloads zijn geblokkeerd.
- Preview: `npm run build && npx astro preview --port 4399 --ignore-lock`. Gebruik `--ignore-lock`, anders blijft een oude daemon de vorige build serveren.
- Kwaliteit: `npm run qa` draait astro check, eslint, prettier, vitest, build, html-validate, check:seo, playwright (mobiel/tablet/desktop + axe WCAG 2.2 AA) en npm audit. Daarnaast `npm run lhci` (minimaal 0,95 op alle categorieën).
- Visuele baselines vernieuwen na een bewuste ontwerpwijziging: `npx playwright test --grep @visueel --update-snapshots`.
- Formatteren vóór qa: `npm run format`. qa faalt op `format:check`.
- Dev-scripts in `scripts/dev/` (preview moet op poort 4399 draaien):
    - `shot.mjs`: volledige screenshots van 1440 en 390px naar `/tmp/home-*.png`.
    - `measure-hero.mjs`: meet de hero-verhoudingen op 6 breedtes (kaart in het navy vlak, verticale balans).
    - `resoluties.mjs`: controleert 320 tot 2560px op overloop, kleine tikdoelen en kaarthoogte, en maakt header-screenshots.
    - `overflow.mjs`: vindt de elementen die bij 390px uitsteken.
    - `axe-detail.mjs`: toont axe-overtredingen per element.
    - `inline-preview.mjs`: maakt één zelfstandige HTML voor een artifact-preview.
- Externe sites zijn vanuit de werkomgeving niet bereikbaar. Screenshots van Breyta en concurrenten maak je via de Framer-MCP: `exec` met `api.screenshot(url, { fullPage: true, viewport: { width: 390, height: 844 } })`. HTML en CSS haal je op via `fetch()` in exec. Framer-project `R87P79buXWtsQbzZzCmY`; alleen lezen.
- Commits sluiten af met de Co-Authored-By- en Claude-Session-regels (zie git log).

## 3. Bestanden en wat ze doen

| Bestand                            | Regels | Inhoud                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/layouts/Base.astro`           | 92     | Fonts (@fontsource Poppins 500/600, Inter Variable, Newsreader Variable opsz-italic), meta/OG/favicons, `html.js`-klasse, scroll-onthulling (`data-reveal`, IntersectionObserver), `<StickyCta/>`                                                                                                                                                       |
| `src/styles/global.css`            | 425    | Tokens r28–74 (kleur, type, radius, ruimte), reset r82, layout r161 (`.wrap .section .bg-surface .bg-ink`), typografie r185 (`.display .h2 .h3 .lead .accent .eyebrow`), knoppen r260 (`.btn` + `-dark -light -ghost`, `.btn-dot`), `.photo-slot`, reveal, `.eyebrow .idx`, mobiele body-padding voor de actiebalk, `.only-wide/.only-narrow` (< 560px) |
| `src/components/Header.astro`      | 410    | Utility-balk (scrollt weg) + sticky zwevende kaart `.bar`. `setOpen()` r138: menu krijgt `top` op basis van `.bar.getBoundingClientRect().bottom` r142. Scrollschaduw r164. Korte teksten via `max-width: 559px` r222                                                                                                                                   |
| `src/components/Footer.astro`      | 238    | Navy footer met logo en CTA, contact, 3 kolommen, register en KvK, juridische links. Geen btw-id (keuze van de gebruiker; wettelijk verplicht volgens art. 3:15d BW, is gemeld)                                                                                                                                                                         |
| `src/components/StickyCta.astro`   | 75     | Vaste balk onder 1080px: verschijnt na 60% schermhoogte scrollen, verborgen als het menu open is                                                                                                                                                                                                                                                        |
| `src/components/Logo.astro`        | 25     | `<Logo variant="light/dark" height={n}/>` → `/brand/full-logo-*.svg`                                                                                                                                                                                                                                                                                    |
| `src/components/Icon.astro`        | 95     | Lijniconen 24px (o.a. arrow, arrow-up-right, euro, bolt, eye, scale, bank, chat, map, calendar, plus, branche-iconen)                                                                                                                                                                                                                                   |
| `src/components/Afrekening.astro`  | 259    | Hero-calculator: `parse()` r79 leest NL- en EN-notatie, `render()` r89, presets r4. Rente-rij verplaatst naar de toelichting (voor de hero-balans)                                                                                                                                                                                                      |
| `src/components/home/Proces.astro` | 436    | 01 Voorbeelddossier: `stappen` r6, `tijdlijn` r40, `ontvangen` r50. Sectie met `data-active` r53. Tabs-script r139 (pijltjestoetsen, Home/End). Zichtbaarheid per stap via `[data-active] [data-show]` r315. Toekomstige items gedimd via globale stijl r420 (kleur, geen opacity: axe)                                                                 |
| `src/components/home/Bento.astro`  | 431    | 02 Zes beloftes met mini-visuals. Veegrij met `data-scroller tabindex="0" aria-label`                                                                                                                                                                                                                                                                   |
| `src/components/home/Kosten.astro` | 324    | 03 Scenario-kiezer: `scenarios` r6, radios + `.switch:has(...)` r234. Staffel in `<details>` (`staffelRijen` r54)                                                                                                                                                                                                                                       |
| `src/pages/index.astro`            | 874    | Hero r84, `<Proces/><Bento/><Kosten/>` r144–146, Persoonlijk r148, Aanbod (diensten + branches) r203, FAQ r245, Kennisbank r284, Slot-CTA r317. Frontmatter: `diensten` r50, `branchIcon` r69, JSON-LD r18                                                                                                                                              |
| `src/data/site.ts`                 | 63     | Bedrijfsgegevens, `nav`, `branches` (10 slugs), `latestArticles`                                                                                                                                                                                                                                                                                        |
| `src/data/faq.ts`                  | 34     | `homeFaq`: 8 vragen, bron voor alle compliance-teksten                                                                                                                                                                                                                                                                                                  |
| `src/lib/wik.ts`                   | 36     | `WIK_STAFFEL` r3, `WIK_MIN` 40, `WIK_MAX` 6775, `wikKosten()` r14, `euro()` r30                                                                                                                                                                                                                                                                         |
| `public/brand/`                    |        | Gecropte transparante logo's (full/main/short × light/dark/primair), iconen, `og-default.png`                                                                                                                                                                                                                                                           |
| `public/_headers`                  |        | CSP (staat api.geldgarant.com en challenges.cloudflare.com toe)                                                                                                                                                                                                                                                                                         |
| `wrangler.jsonc`                   |        | Workers static assets uit `./dist`, `workers_dev` en `preview_urls` aan, `not_found_handling: 404-page`                                                                                                                                                                                                                                                 |
| `tests/e2e/`                       |        | `kwaliteit.spec.ts` (overloop, waarbij kinderen van `[data-scroller]` niet meetellen; 16px-velden; tikdoelen; SEO; axe), `interacties.spec.ts` (menu, afrekening WIK, FAQ, tel-link, dossier-tabs, scenario's), `visueel.spec.ts`                                                                                                                       |

## 4. Ontwerpprincipes (vasthouden)

1. **Elke sectie beantwoordt één vraag van de bezoeker**, in de volgorde waarin hij die stelt. Homepage: kan je helpen en wat kost het (hero) → wat gebeurt er (01) → waarom jullie (02) → en als het tegenvalt (03) → wie (04) → aanbod (05) → vragen (06) → kennis (07) → CTA.
2. **Laat zien in plaats van opsommen.** Mini-interfaces en voorbeelddossiers in plaats van icoon plus drie regels tekst (patroon van Mollie en Mercury).
3. **Mobiel compact.** Veegrijen (`data-scroller`), tabs en uitklappers in plaats van lange stapels. Homepage mobiel ≈ 10.400px (Breyta 8.782px).
4. **Type:** Poppins-koppen met negatieve letterafstand, één accentwoord per kop in `<span class="accent">` (Newsreader cursief), Inter voor de lopende tekst. Eyebrow met sectienummer `<span class="idx">01</span>`.
5. **Vorm:** pill-knoppen met pijlbol, kaarten `--surface` op wit (of wit op `--surface`), navy vlakken met ronde hoeken (`--r-xl`).
6. **Eerlijk:** geen verzonnen reviews, klantlogo's of percentages. Voorbeelden altijd labelen ("Voorbeelddossier"). Woordkeus: "Geregistreerd bij Justis", niet "Erkend".
7. **Kwaliteitslat:** WCAG 2.2 AA (axe groen), tikdoelen ≥ 44px, invoervelden ≥ 16px, geen overloop van 320 tot 2560px, Lighthouse ≥ 0,95.

## 5. Bekende valkuilen (en oplossingen)

- Grids met één kolom moeten `grid-template-columns: minmax(0, 1fr)` hebben, anders duwt een nowrap-veegrij de kolom breder dan het scherm.
- Gebruik `opacity` niet om tekst te dimmen: dat faalt op axe-contrast. Gebruik expliciete kleuren (#586280 / #6b7390 op wit).
- Een veegrij zonder focusbare inhoud heeft `tabindex="0"` en een `aria-label` nodig.
- html-validate wil een vaste spatie in telefoonteksten: `Bel{"\u00a0"}{site.phone}`, `Bel{"\u00a0"}ons`.
- Een `position: fixed`-element binnen iets met `backdrop-filter` wordt relatief aan die ouder; daarom staat het mobiele menu naast `.bar`, niet erin.
- Playwright draait met `reducedMotion: "reduce"`, zodat `data-reveal`-elementen in tests direct zichtbaar zijn.

## 6. Volgende stappen (op volgorde)

Werkwijze per pagina: eerst Breyta's versie plus 2–3 andere incasso- en fintech-sites bekijken (Framer-screenshot, mobiel en desktop). Dan per sectie de bezoekersvraag bepalen, bouwen met de bestaande componenten en tokens, en verifiëren (shot, resoluties, qa, lhci). Push daarna en stuur screenshots.

1. **`/brief-ontvangen`**: debiteurenpagina (goedgekeurd). Rustige, niet-bedreigende toon. Secties: wat is dit voor brief, direct betalen (`site.debtorPortal`), regeling aanvragen, bezwaar of vraag, contact. Voeg "Hulp bij geldzorgen" toe (`/hulp-nodig-bij-geldproblemen`). Inspiratie: Intrum's keuzetegels ("Ik wil direct betalen", "Ik kan niet volledig betalen").
2. **`/tarieven`**: volledige provisiestaffel uit de AV (staat nog niet in de code: vraag de gebruiker om het AV-document of haal het van de huidige site via Framer), WIK-staffel, rekenvoorbeelden, `Kosten.astro` hergebruiken, en de debiteurenbeheer-pakketten (voorstel €99/€199/€349 per maand, €9,95 los, €3,95 extra dossier: eerst bevestigen).
3. **`/vordering-indienen`**: formulier op de bestaande intake-worker `api.geldgarant.com/api/*` (`/incasso-session`, `/incasso-upload`, `/incasso-aanvragen`, PDOK `/location/search`; bron `claude/intake-worker-index.js` in de projectdocs). Meerstaps, velden ≥ 16px, Turnstile. Tijdens tests nooit echte data versturen.
4. `/incasso`, `/debiteurenbeheer`, `/over-ons`, `/contact-opnemen`.
5. `/branches` + 10 branchepagina's (slugs in `site.ts`): één template met een branchespecifieke hero, veelvoorkomende situaties en FAQ.
6. Kennisbank: 27 artikelen migreren uit Framer (CMS uitlezen via de Framer-MCP; alleen lezen) naar Astro content collections. Behoud de slugs.
7. Juridische pagina's (`/juridisch/*`, `/klachtenregelement`), een 404-pagina, 301-redirects van oude Framer-URL's, sitemap en robots controleren.
8. Pas als alles af is, en met akkoord: custom domain koppelen in Cloudflare.

**Open punten bij de gebruiker:** btw-id in de footer (wettelijk verplicht, is gemeld), echte foto's van Anas en Ilyas (fotoshoot), echte reviews en cijfers, bevestiging van de debiteurenbeheer-prijzen, en het AV-document met de provisiestaffel.
