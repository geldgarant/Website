# GeldGarant website (geldgarant.com)

Incassobureau voor ondernemers, landelijk, kantoor Deventer. Astro 7, statisch, gehost op Cloudflare Workers (static assets, `wrangler.jsonc`;
staging: website.geldgarant.workers.dev) naast de intake-worker (api.geldgarant.com). Overdracht: `docs/HANDOFF.md`. Benchmark: breyta.nl, maar beter op mobiel, prijstransparantie en bewijs.

## Harde regels

- Merkkleur `--blue #3069FE` (uit het logo) voor knoppen, accenten en onderstrepingen. Blauw als tekst: `--blue-ink #1F4FD6`.
  Tekstlinks zijn navy met blauwe onderstreping (`.textlink`).
- Bedrijfsgegevens alleen uit `src/data/site.ts` (telefoon, KvK 90622375, register 00273). Nooit hardcoden.
- Copy: Nederlands, altijd `u`, geen em-dashes, geen uitroeptekens in koppen, geen emoji, woordenlijst uit het werkplan.
- Geen verzonnen reviews, logo's, cijfers, percentages of certificaten. Voorbeelden (zoals het voorbeelddossier) altijd zichtbaar als voorbeeld labelen.
- Rechtsvorm niet noemen; nooit "B.V.". Btw-id niet in de footer.
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
