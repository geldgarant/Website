# GeldGarant website: overdracht (6 nov 2026)

Lees dit samen met `CLAUDE.md` (projectregels en ontwerpsysteem). Dit document beschrijft waar het project staat, hoe alles werkt en wat de volgende sessie moet doen.

## 1. Stand van zaken

| Onderdeel                | Status                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Repo                     | https://github.com/geldgarant/Website, branch `main`, laatste commit: zie `git log`                            |
| Hosting (staging)        | Cloudflare Workers "website" → https://website.geldgarant.workers.dev, bouwt automatisch bij elke push         |
| Productie                | geldgarant.com draait nog op Framer. DNS pas omzetten als de hele site af is, en alleen samen met de gebruiker |
| Homepage                 | v3 af, inclusief header v2 (zwevende kaart). Alle kwaliteitspoorten groen                                      |
| `/incasso` (A1)          | Gebouwd 6 nov 2026, qa + lhci (100 op alle categorieën) groen. Wacht op akkoord van de gebruiker               |
| `/debiteurenbeheer` (A2) | Gebouwd 6 nov 2026, qa + lhci (100) groen. Wacht op akkoord                                                    |
| Overige pagina's         | Nog niet gebouwd (zie §6). Alle links op de homepage wijzen al naar de juiste URL's                            |

**Tarieven (bevestigd door Anas, 6 nov 2026):** de provisie is gelijk aan de WIK-staffel (`src/lib/wik.ts`); er is **geen succesfee**. De AV (art. 7.5, 10% succesfee) past Anas zelf nog aan. Debiteurenbeheer: € 99 / € 199 / € 349 per maand. AV-PDF: `https://framerusercontent.com/assets/gxmqPPJMbOPExmAFYa66PrGuLI.pdf`.

**Werkwijze (Anas, 6 nov 2026):** niet te voorzichtig zijn. Goede commerciële toevoegingen gewoon doen ("Meest gekozen" bij Groei, koppeling met het boekhoudpakket: Exact Online, Twinfield, SnelStart). Anas meldt het zelf als iets te ver gaat. Geen verzonnen reviews, logo's of cijfers blijft wel staan.

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

| Bestand                              | Regels | Inhoud                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/layouts/Base.astro`             | 92     | Fonts (@fontsource Poppins 500/600, Inter Variable, Newsreader Variable opsz-italic), meta/OG/favicons, `html.js`-klasse, scroll-onthulling (`data-reveal`, IntersectionObserver), `<StickyCta/>`                                                                                                                                                                                      |
| `src/styles/global.css`              | 425    | Tokens r28–74 (kleur, type, radius, ruimte), reset r82, layout r161 (`.wrap .section .bg-surface .bg-ink`), typografie r185 (`.display .h2 .h3 .lead .accent .eyebrow`), knoppen r260 (`.btn` + `-dark -light -ghost`, `.btn-dot`), `.photo-slot`, reveal, `.eyebrow .idx`, mobiele body-padding voor de actiebalk, `.only-wide/.only-narrow` (< 560px)                                |
| `src/components/Header.astro`        | 410    | Utility-balk (scrollt weg) + sticky zwevende kaart `.bar`. `setOpen()` r138: menu krijgt `top` op basis van `.bar.getBoundingClientRect().bottom` r142. Scrollschaduw r164. Korte teksten via `max-width: 559px` r222                                                                                                                                                                  |
| `src/components/Footer.astro`        | 238    | Navy footer met logo en CTA, contact, 3 kolommen, register en KvK, juridische links. Geen btw-id (keuze van de gebruiker; wettelijk verplicht volgens art. 3:15d BW, is gemeld)                                                                                                                                                                                                        |
| `src/components/StickyCta.astro`     | 75     | Vaste balk onder 1080px: verschijnt na 60% schermhoogte scrollen, verborgen als het menu open is                                                                                                                                                                                                                                                                                       |
| `src/components/Logo.astro`          | 25     | `<Logo variant="light/dark" height={n}/>` → `/brand/full-logo-*.svg`                                                                                                                                                                                                                                                                                                                   |
| `src/components/Icon.astro`          | 95     | Lijniconen 24px (o.a. arrow, arrow-up-right, euro, bolt, eye, scale, bank, chat, map, calendar, plus, branche-iconen)                                                                                                                                                                                                                                                                  |
| `src/components/Afrekening.astro`    | 259    | Hero-calculator: `parse()` r79 leest NL- en EN-notatie, `render()` r89, presets r4. Rente-rij verplaatst naar de toelichting (voor de hero-balans)                                                                                                                                                                                                                                     |
| `src/components/home/Proces.astro`   | 436    | 01 Voorbeelddossier: `stappen` r6, `tijdlijn` r40, `ontvangen` r50. Sectie met `data-active` r53. Tabs-script r139 (pijltjestoetsen, Home/End). Zichtbaarheid per stap via `[data-active] [data-show]` r315. Toekomstige items gedimd via globale stijl r420 (kleur, geen opacity: axe)                                                                                                |
| `src/components/home/Bento.astro`    | 431    | 02 Zes beloftes met mini-visuals. Veegrij met `data-scroller tabindex="0" aria-label`                                                                                                                                                                                                                                                                                                  |
| `src/components/home/Kosten.astro`   | 324    | 03 Scenario-kiezer: `scenarios` r6, radios + `.switch:has(...)` r234. Staffel in `<details>` (`staffelRijen` r54)                                                                                                                                                                                                                                                                      |
| `src/pages/index.astro`              | 874    | Hero r84, `<Proces/><Bento/><Kosten/>` r144–146, Persoonlijk r148, Aanbod (diensten + branches) r203, FAQ r245, Kennisbank r284, Slot-CTA r317. Frontmatter: `diensten` r50, `branchIcon` r69, JSON-LD r18                                                                                                                                                                             |
| `src/pages/incasso/index.astro`      |        | A1. Hero met kruimelpad + navy feitenkaart (`feiten`), `<Fasen/>` (01), vergelijkingstabel bedrijf/particulier (`verschillen`, 02, op < 640px blokken met `data-label`), `<Kosten surface idx="03">` met `<Afrekening/>` in de slot (alleen ≥ 1024px), `<Klaar/>` (04), verder lezen (05), `<Faq items={incassoFaq} idx="06">`, `<SlotCta>`. JSON-LD: Service, BreadcrumbList, FAQPage |
| `src/components/incasso/Fasen.astro` |        | 01 Drie fasen (aanmaning, minnelijk, rechter). Desktop: matrix met `grid-template-rows: subgrid`, zodat de rijen gelijk lopen. Mobiel: radio's + `:has()`, één fase tegelijk. Zijspoor faillissement eronder                                                                                                                                                                           |
| `src/components/incasso/Klaar.astro` |        | 04 "Is uw factuur klaar voor incasso?": drie vinkjes, en een klein script zet het oordeel in `role="status"`                                                                                                                                                                                                                                                                           |
| `src/components/Faq.astro`           |        | Gedeelde FAQ-sectie (props `items`, `idx`, slot `title`), gebruikt op home en /incasso                                                                                                                                                                                                                                                                                                 |
| `src/components/SlotCta.astro`       |        | Gedeelde navy afsluiter (prop `lead`, kop via slot)                                                                                                                                                                                                                                                                                                                                    |
| `src/data/site.ts`                   | 63     | Bedrijfsgegevens, `nav`, `branches` (10 slugs), `latestArticles`                                                                                                                                                                                                                                                                                                                       |
| `src/data/faq.ts`                    |        | `homeFaq` (8) en `incassoFaq` (7). Bron voor alle compliance-teksten; de AV-artikelen staan in het commentaar                                                                                                                                                                                                                                                                          |
| `src/lib/wik.ts`                     | 36     | `WIK_STAFFEL` r3, `WIK_MIN` 40, `WIK_MAX` 6775, `wikKosten()` r14, `euro()` r30                                                                                                                                                                                                                                                                                                        |
| `public/brand/`                      |        | Gecropte transparante logo's (full/main/short × light/dark/primair), iconen, `og-default.png`                                                                                                                                                                                                                                                                                          |
| `public/_headers`                    |        | CSP (staat api.geldgarant.com en challenges.cloudflare.com toe)                                                                                                                                                                                                                                                                                                                        |
| `wrangler.jsonc`                     |        | Workers static assets uit `./dist`, `workers_dev` en `preview_urls` aan, `not_found_handling: 404-page`                                                                                                                                                                                                                                                                                |
| `tests/e2e/`                         |        | `kwaliteit.spec.ts` (overloop, waarbij kinderen van `[data-scroller]` niet meetellen; 16px-velden; tikdoelen; SEO; axe), `interacties.spec.ts` (menu, afrekening WIK, FAQ, tel-link, dossier-tabs, scenario's), `visueel.spec.ts`                                                                                                                                                      |

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
- Een telefoonnummer achter "Bel" moet `Bel{"\u00a0"}{site.phone}` zijn. Een gewone spatie (`Bel{" "}`) faalt op html-validate `tel-non-breaking`.
- Een `<label>` die zijn input omvat, mag geen `for` hebben (html-validate `no-redundant-for`).
- Decoratieve absolute elementen (logo-watermerk) niet buiten hun kaart laten uitsteken: de overlooptest meet `getBoundingClientRect`, ook als de ouder `overflow: hidden` heeft.
- `fieldset` heeft een standaardrand. Zet `border: 0; padding: 0; margin: 0; min-width: 0` in de component.
- **Na elke push controleren of Cloudflare echt gedeployd heeft.** Een groene GitHub-check zegt niets over Workers Builds. Controleer met `gh api repos/geldgarant/website/commits/$(git rev-parse HEAD)/check-runs --jq '.check_runs[] | "\(.name): \(.status) \(.conclusion)"'`: "Workers Builds: website" moet `success` zijn. Op 6 nov faalde één build direct, zonder fout in de code; een nieuwe push loste het op. De buildlog staat alleen in het Cloudflare-dashboard. Vanuit de werkomgeving is staging niet bereikbaar; via Framer-MCP `fetch()` of `api.screenshot()` lukt het wel.
- `src/pages/404.astro` bestaat (noindex). Zonder 404.html gaf een onbekende URL op Workers geen antwoord. In `lighthouserc.cjs` is 404.html uitgesloten van de assertions.
- `[hidden] { display: none !important }` staat in global.css: zonder die regel won `.btn { display: inline-flex }` van het hidden-attribuut.
- `.htmlvalidate.json`: `prefer-native-element` staat `combobox` en `listbox` toe, voor de adres-zoekhulp (ARIA-combobox). Een stap is een `div role="group"`, geen fieldset; radiogroepen zijn een `fieldset` met `legend`.
- `lighthouserc.cjs`: `maxAutodiscoverUrls: 0`. Standaard meet lhci maar 5 pagina's.
- html-validate `tel-non-breaking` geldt voor **elke** tekst in een `tel:`-link, ook "Vraag advies": gebruik `\u00a0`.
- Footer: `.footer a` maakte ook de knop wit-op-wit. Opgelost met `:not(.btn)`; let hierop bij scoped `a`-regels.
- Dev-scripts `shot.mjs` en `resoluties.mjs` nemen nu een route: `node scripts/dev/shot.mjs /incasso` → `/tmp/incasso-*.png`.

## 6. Volgende stappen (op volgorde, bijgewerkt na besluit gebruiker)

De volledige paginakaart, met wat er nu bestaat, wat Breyta heeft en de doelstructuur met prioriteit, staat in **`docs/SITEMAP.md`**.

**Werkwijze per pagina:**

1. Bekijk de vergelijkbare pagina van Breyta plus 2–3 andere incasso- en fintech-sites (Framer-screenshot op 390 en 1200px).
2. Bekijk de huidige inhoud op geldgarant.com (Framer-MCP; alleen lezen).
3. Bepaal per sectie de bezoekersvraag en zet het plan in 5–10 regels.
4. Bouw met de bestaande componenten en tokens.
5. Verifieer: shot, resoluties, qa, lhci.
6. Push, stuur screenshots en vraag om akkoord voor je de volgende pagina doet.

**Volgorde van de pagina's:**

1. ~~**`/incasso`** (A1)~~: gebouwd op 6 nov 2026, wacht op akkoord. Eerst door de gebruiker te controleren: de `incassoFaq`-teksten (intrekken, rechtstreekse betaling, betwisting), "€ 0" bij een particulier die binnen de 14 dagen betaalt, en de vergelijkingstabel (handelsrente en verjaring van 2 of 5 jaar).
2. ~~**`/debiteurenbeheer`** (A2)~~: gebouwd op 6 nov 2026. De knoppen wijzen naar `/contact-opnemen?onderwerp=debiteurenbeheer&pakket=…`; dat formulier (A7) moet de parameters `onderwerp` en `pakket` vooraf invullen.
3. ~~**`/tarieven`** (A3)~~: gebouwd op 6 nov 2026. Provisie = WIK-staffel (`src/lib/wik.ts`), geen succesfee; debiteurenbeheer uit `src/lib/pakketten.ts`. Hergebruik `Kosten.astro`, `Afrekening.astro` en `Pakketten.astro` (eventueel met props).
4. ~~**`/vordering-indienen`** (A4)~~: gebouwd op 6 nov 2026. **Om live te kunnen versturen vanaf staging** moet Anas in Cloudflare (1) `https://website.geldgarant.workers.dev` toevoegen aan `ALLOWED_ORIGINS` (of `INTAKE_ALLOWED_ORIGINS`) van de worker geldgarant-intake-api, en (2) de hostname `website.geldgarant.workers.dev` toevoegen aan de Turnstile-widget. Bij livegang op geldgarant.com is dat al in orde. Het oude wachtwoordveld is vervallen; de worker sloeg het toch niet op. Het soort debiteur (bedrijf of particulier) gaat mee als eerste regel van `omschrijving`.
5. `/over-ons`, `/contact-opnemen`, `/hoe-werkt-het` (A5–A7).
6. Fase B: incasso-subpagina's, `/wki`, `/nowid`, branches.
7. Fase C: kennisbank (27), werken-bij, en **later** `/brief-ontvangen` met de CaseControl-koppeling. De gebruiker wil dat bewust uitstellen tot de betaallink of het portaal uitgezocht is.
8. Fase D: juridisch, 404, redirects. Pas daarna, en met akkoord: het domein koppelen.

## 7. Geïnstalleerde skills (`.claude/skills/`, 34 stuks): wanneer welke

Laad een skill met de Skill-tool voordat je de bijbehorende stap doet. Het overzicht van bronnen en licenties staat in `.claude/skills/THIRD_PARTY.md`.

| Fase                                               | Skills                                                                                                                                                                                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Plannen                                            | `writing-plans` (bij elke pagina met meer dan een paar stappen)                                                                                                                                                                                                                |
| Richting en ontwerp                                | `frontend-design`, `impeccable` (critique, polish, audit; engine: `sh .claude/skills/impeccable/scripts/impeccable detect dist/<pagina>/index.html`), `ui-ux-pro-max` (naslag: `python3 -I scripts/search.py "<q>" --design-system`), `ui-typography`, `web-design-guidelines` |
| Bouwen                                             | `astro` (content collections voor de kennisbank), `frontend-ui-engineering`, `vercel-composition-patterns` (componentopbouw)                                                                                                                                                   |
| Animatie (alleen met reden, altijd reduced-motion) | `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-performance`                                                                                                                                                                           |
| Kwaliteit en web                                   | `web-quality-audit`, `performance`, `core-web-vitals`, `seo` (per pagina: title, description, JSON-LD, interne links), `best-practices`                                                                                                                                        |
| Toegankelijkheid                                   | `accessibility`, `accessibility-scan`, `accessibility-inspect`, `accessibility-audit` (vóór livegang), `accessibility-fix`, `accessibility-diff`                                                                                                                               |
| Testen en debuggen                                 | `webapp-testing`, `browser-testing-with-devtools` (chrome-devtools MCP), `systematic-debugging`                                                                                                                                                                                |
| Formulieren en veiligheid                          | `security-and-hardening` (vordering-indienen, contact: invoer, uploads, Turnstile, geen geheimen in de client)                                                                                                                                                                 |
| Livegang                                           | `ci-cd-and-automation`, `shipping-and-launch` (domein, redirects, checklist)                                                                                                                                                                                                   |
| Afronden                                           | `verification-before-completion`: pas "klaar" melden met bewijs                                                                                                                                                                                                                |

**Open punten bij de gebruiker:** btw-id in de footer (wettelijk verplicht, is gemeld), echte foto's van Anas en Ilyas (fotoshoot), echte reviews en cijfers, bevestiging van de debiteurenbeheer-prijzen, en het AV-document met de provisiestaffel.
