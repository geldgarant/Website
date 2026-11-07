# GeldGarant website (geldgarant.com)

Incassobureau voor ondernemers, landelijk, kantoor Deventer. Startpunt nieuwe sessie: `docs/OVERDRACHT.md`. Astro 7, statisch, gehost op Cloudflare Workers (static assets + worker voor `/api/*`, `wrangler.jsonc`;
staging: website.geldgarant.workers.dev) naast de intake-worker (api.geldgarant.com). Overdracht: `docs/HANDOFF.md`. Benchmark: breyta.nl, maar beter op mobiel, prijstransparantie en bewijs.

## Harde regels

- Merkkleur `--blue #3069FE` (uit het logo) voor knoppen, accenten en onderstrepingen. Blauw als tekst: `--blue-ink #1F4FD6`.
  Tekstlinks zijn navy met blauwe onderstreping (`.textlink`).
- Bedrijfsgegevens alleen uit `src/data/site.ts` (telefoon, KvK 90622375, register 00273). Nooit hardcoden.
- Copy: Nederlands, altijd `u`, geen em-dashes, geen uitroeptekens in koppen, geen emoji, woordenlijst uit het werkplan.
- Geen verzonnen reviews, logo's, cijfers, percentages of certificaten. Voorbeelden (zoals het voorbeelddossier) altijd zichtbaar als voorbeeld labelen.
- Rechtsvorm niet noemen; nooit "B.V.". Btw-id niet in de footer.
- Geen persoonsnamen (Anas, Ilyas) en geen "geen callcenter"/"geen keuzemenu": GeldGarant presenteert zich als gevestigd bureau. "Direct contact" en "vaste dossierbehandelaar" mogen wel.
- Kosten exact volgens de AV: WIK-staffel in `src/lib/wik.ts`; volledig betaald = €0, deels = verrekening (min. €45).
- Officieel GeldGarant-logo staat gecropt en transparant in `public/brand/` (aangeleverd door de gebruiker).
- Formuliervelden altijd ≥16px, tikdoelen ≥44px, geen vaste breedtes die op 360px overlopen.
- Bestaande URL's van de Framer-site behouden of 301-redirect geven.

## Werkwijze per taak

1. Begrijpen: lees het werkplan (Claude Docs "GeldGarant Website Revamp | Werkplan A tot Z") en de relevante pagina-blauwdruk.
2. Plannen: `writing-plans` bij meer dan een paar stappen.
3. Ontwerpen: `frontend-design` voor richting, `ui-ux-pro-max` als naslag (merkregels hierboven gaan voor),
   `ui-typography` voor typografie.
4. Bouwen: `astro`, `frontend-ui-engineering`; animatie alleen met reden (`gsap-*` of CSS), altijd reduced-motion.
5. Bekijken: screenshots op 390 en 1440 px via Playwright (MCP of `npm run test:e2e`), echt kijken, niet aannemen.
6. Kritiek en afwerking: `impeccable` (critique, polish), `web-design-guidelines`.
7. Testen: `npm run qa`; daarna `npm run lhci`. Toegankelijkheid: `accessibility-scan` / `accessibility-audit`.
8. Klaar melden alleen na `verification-before-completion`: wat is getest, met welke uitkomst, wat staat nog open.

## Commando's

| Doel                                | Commando                                                             |
| ----------------------------------- | -------------------------------------------------------------------- |
| Ontwikkelen                         | `npm run dev`                                                        |
| Alles in één keer                   | `npm run qa`                                                         |
| Types / lint / opmaak               | `npm run check`, `npm run lint`, `npm run format`                    |
| Unit-tests (staffel e.d.)           | `npm run test:unit`                                                  |
| Browsertests mobiel/tablet/desktop  | `npm run test:e2e` (overloop, 16px-velden, SEO-basis, axe, menu)     |
| Visuele regressie                   | `npm run test:visual` (`-- --update-snapshots` na bewuste wijziging) |
| HTML / SEO / links                  | `npm run check:html`, `npm run check:seo`, `npm run check:links`     |
| Lighthouse (doel 95+ per categorie) | `npm run lhci`                                                       |
| Afhankelijkheden                    | `npm run audit:deps`                                                 |

In de cloudwerkomgeving van Claude: zet `CHROME_PATH=/usr/bin/google-chrome` voor Playwright en Lighthouse
(browserdownloads zijn daar geblokkeerd). Playwright MCP daar handmatig met
`--executable-path /usr/bin/google-chrome --headless --no-sandbox`.

## Skills in `.claude/skills`

Bron, commit en licentie per skill: `.claude/skills/THIRD_PARTY.md`. Hooks van de oorspronkelijke plugins zijn
bewust niet overgenomen. Bijwerken: `bash scripts/update-skills.sh` en daarna de wijzigingen nalezen.

## Ontwerpsysteem v2 (vastgesteld 6 nov 2026)

- Fonts (self-hosted via @fontsource, geïmporteerd in `src/layouts/Base.astro`): Poppins 500/600 voor koppen, Inter Variable voor body, Newsreader Variable cursief (opsz 72, gewicht 500) als accentfont.
- Accentwoord in een kop: `<span class="accent">woord</span>`; één per kop. Breyta doet hetzelfde met een gestylede `<code>`.
- Kleuren uit het logo: `--ink #061126`, `--blue #3069FE` (knoppen), `--blue-ink #1F4FD6` (blauw als tekst op licht), `--surface #F3F4F7` (kaarten). Tokens staan in `src/styles/global.css`.
- Knoppen: `.btn` (blauw), `.btn-dark`, `.btn-light`, `.btn-ghost`; met pijlbol `<span class="btn-dot"><Icon name="arrow"/></span>` of zonder.
- Type: `.display` (H1), `.h2`, `.h3`, `.lead`, `.eyebrow`. Secties: `.section`, `.bg-surface`, `.bg-ink`.
- Logo: `public/brand/` (gecropt, transparant). `<Logo variant="light|dark" height={..}/>`.
- Scroll-onthulling via `data-reveal` (+ `style="--d:n"` voor vertraging); Playwright draait met `reducedMotion: "reduce"`.
- Screenshots: `CHROME_PATH=/usr/bin/google-chrome node scripts/dev/shot.mjs` (preview moet op poort 4399 draaien).

## Homepage v3 en header (6 nov 2026)

- Homepage-secties met nummering (eyebrow `.idx`): 01 `components/home/Proces.astro` (voorbeelddossier, tabs + tijdlijn, `data-active`), 02 `Bento.astro` (mini-visuals, veegrij mobiel), 03 `Kosten.astro` (scenario-kiezer met radios + `:has`), 04 persoonlijk, 05 diensten/branches, 06 FAQ, 07 kennisbank.
- Veegrijen krijgen `data-scroller`; de overlooptest negeert hun kinderen. Een veegrij zonder links krijgt `tabindex="0"` + `aria-label` (axe: scrollable-region-focusable).
- Header: utility-balk (scrollt weg, korte teksten < 560px) + zwevende kaart `.bar` (sticky top 10px). Mobiel menu is een kaart onder `.bar`, positie berekend bij openen. `StickyCta.astro` = vaste actiebalk < 1080px.
- Compliance-woordkeus: "Geregistreerd bij Justis", niet "Erkend". Geen verzonnen reviews/cijfers; voorbeelden altijd als voorbeeld labelen.
- Controle op 10 schermbreedtes: `CHROME_PATH=/usr/bin/google-chrome node scripts/dev/resoluties.mjs` (preview op 4399).

## Kennisbank (7 nov 2026)

- Artikelen: `src/content/kennisbank/<slug>.md` (slug = oude Framer-URL). Schema: `src/content.config.ts`; onderwerpen: `src/data/kennisbank.ts`.
- Kaders in Markdown: blockquote die begint met `**Let op:**`, `**Voorbeeld:**`, `**Rekenvoorbeeld:**`, `**Tip:**` of `**Goed om te weten:**` (verwerkt in `src/lib/artikel.ts`). Kopjes niet met een cijfer laten beginnen (ongeldig id).
- Geen zichtbare datum en geen disclaimer op artikelen (besluit Anas). Bronnen alleen naar nagelopen URL's (wetten.overheid.nl, rechtspraak.nl, officielebekendmakingen.nl).
- Ankers: `html` heeft `scroll-padding-top`; geef kopjes geen extra `scroll-margin`. De zijbalk mag nooit zelf scrollen (zie `pas()` in `src/pages/kennisbank/[slug].astro`).
- CLS-valkuil: het accentfont laadt later; een kop die daardoor van regelaantal wisselt, faalt Lighthouse (zie HANDOFF §5).

## Fase D (7 nov 2026)

- Juridische documenten (AV, privacy, cookies) zijn HTML-pagina's uit `src/content/juridisch/<slug>.md` (collectie `juridisch`), template `src/pages/juridisch/[slug].astro`. De HTML is leidend; de pdf's in `public/juridisch/` maak je daaruit met `node scripts/juridisch-pdf.mjs` (preview op 4399; schrijft ook previews en `src/data/juridisch-pdf.ts`). Na elke tekstwijziging: build, script, opnieuw build, committen.
- In die Markdown nooit bedrijfsgegevens typen: plaatshouders `{{telefoon}}`, `{{email}}`, `{{klachtenEmail}}`, `{{adres}}`, `{{kvk}}`, `{{register}}`, `{{uren}}`, `{{wikStaffel}}` (ingevuld door `src/lib/juridisch.ts`, getest in `tests/unit/juridisch.test.ts`). Leden schrijven als "6.4 Tekst" (anker `#lid-6-4`), artikelkoppen als "## Artikel 6 Titel" (anker `#artikel-6`).
- De AV moeten kloppen met de site: volledig betaald € 0, deels = incassokosten (min. € 45, nooit meer dan ontvangen), niets binnen = € 0, intrekken 10% / min. € 95, faillissement € 115 excl. btw, wekelijkse afdracht, debiteurenbeheer maandelijks opzegbaar. Wijzigt een tarief, pas dan site én AV aan.
- Klachtenregeling `/klachtenregelement` volgt art. 6.1 Besluit Wki (mondeling én schriftelijk, bevestiging binnen 2 werkdagen). Termijnen rekenen met `src/lib/werkdagen.ts`.
- Redirects alleen in `public/_redirects` (getest door `tests/unit/redirects.test.ts`).
- OG-beelden worden na de build gemaakt door `scripts/og.mjs` uit de H1 van elke pagina. Een pagina zonder H1 krijgt geen beeld en laat `check:seo` falen.
- Knoppen: een `.btn` zonder `.btn-dot` krijgt automatisch aan beide kanten 24px (global.css). Controle op scheve knoppen: `CHROME_PATH=/usr/bin/google-chrome npx tsx scripts/dev/uitlijning.mjs` (preview op 4399).
- Livegang: `docs/LIVEGANG.md`; controle oude URL's en redirects: `node scripts/livegang-check.mjs` (`BASIS=` voor staging). Toetsenbordcontrole: `node scripts/dev/focus.mjs`.
- Register-link: `site.incassoRegisterHref` wijst rechtstreeks naar de inschrijving van GeldGarant bij Justis; `site.incassoRegisterOverzichtHref` naar het hele register. "Brief ontvangen?" linkt via `site.briefHref` (= `/brief-ontvangen`).
- Telefoon: `site.phone` (085 212 73 88), `site.phoneHref`, en voor JSON-LD `site.phoneIntl`. Klachten-e-mail: `site.klachtenEmail`.

## /brief-ontvangen (7 nov 2026)

- Debiteurenpagina: `src/pages/brief-ontvangen/index.astro`, logica `src/lib/debiteur.ts` (getest), DOM `src/scripts/brief.ts`. Rustige toon, B1, geen druk; geen StickyCta maar een eigen actiebalk.
- Direct betalen: formulier (dossiernummer + bedrag) → `POST /api/betalen` in onze eigen worker (`worker/betalen.ts`, getest in `tests/unit/betalen-worker.test.ts`) → CaseControl `/pay` → direct door naar iDEAL; CaseControl boekt de betaling op het dossier. Mislukt het, dan tonen we de overmaakgegevens (geen omweg via het portaal). `GET /api/betalen` controleert de koppeling. De worker draait alleen voor `/api/*` (`run_worker_first` in `wrangler.jsonc`). Kort adres in brieven: `/betalen` (302 naar de betaalkaart).
- Brieven voor CaseControl: `brieven/` (README): aanmaning 1 B2B, sommatie B2B, 14-dagenbrief B2C. De QR in de brieven is dynamisch: `worker/qr.ts` (`GET /api/qr?d=&data=`) maakt een PNG van `{{case.online_payment_link}}`, met terugval naar `/brief-ontvangen?dossier=…#betalen`. Bron in `brieven/src`, `python3 brieven/tools/bouw.py` maakt de plakklare versie (alleen inline stijlen, logo als data-URI; of CaseControl externe afbeeldingen zoals de QR laadt, moet een proefbrief uitwijzen), `brieven/tools/render-cc.php` rendert met dezelfde motor en marges (20 mm). De voorbeeldbrief op /brief-ontvangen volgt `aanmaning-1-b2b.html`.
- Reacties van debiteuren gaan via `/api/contact` (onderwerp `bestaand_dossier`). Link of QR in brieven: `/brief-ontvangen?dossier=…&bedrag=…`, regeling: `?reden=regeling#regelen`.
- Niets toezeggen wat niet bevestigd is (betaalmethodes, verwerkingstijd, afzenderadres van e-mails).
