# GeldGarant website (geldgarant.com)

Incassobureau voor ondernemers, landelijk, kantoor Deventer. Astro 7, statisch, gehost op Cloudflare Pages naast de
intake-worker (api.geldgarant.com). Benchmark: breyta.nl, maar beter op mobiel, prijstransparantie en bewijs.

## Harde regels

- Merkkleur exact `#3f68f5`; alleen voor knoppen, accenten en onderstrepingen. Als tekstkleur haalt hij op getinte
  achtergronden geen 4,5:1, dus tekstlinks zijn navy met blauwe onderstreping.
- Bedrijfsgegevens alleen uit `src/data/site.ts` (telefoon, KvK 90622375, register 00273). Nooit hardcoden.
- Copy: Nederlands, altijd `u`, geen em-dashes, geen uitroeptekens in koppen, geen emoji, woordenlijst uit het werkplan.
- Geen verzonnen reviews, logo's, cijfers, percentages of certificaten. Voorbeeldinhoud krijgt `.todo` en gaat nooit live.
- Rechtsvorm niet noemen; nooit "B.V.". Btw-id niet in de footer.
- Kosten exact volgens de AV: WIK-staffel in `src/lib/wik.ts`; volledig betaald = €0, deels = verrekening (min. €45).
- Het logo blijft het bestaande GeldGarant-logo (nog te exporteren uit Framer); het huidige woordmerk is tijdelijk.
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
