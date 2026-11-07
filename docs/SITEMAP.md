# GeldGarant: paginakaart (6 nov 2026)

Deze kaart is gebaseerd op de echte sitemaps van geldgarant.com (Framer), breyta.nl en incasso.nl, opgehaald op 6 nov 2026 via de Framer-MCP `fetch`.

Regel: **elke bestaande URL blijft bestaan of krijgt een 301-redirect**, om de SEO te behouden.

## 1. Wat geldgarant.com nu heeft (56 URL's in de sitemap)

- **Kern:**
    - `/`
    - `/incasso`
    - `/debiteurenbeheer`
    - `/hoe-werkt-het`
    - `/over-ons`
    - `/vordering-indienen`
    - `/contact-opnemen`
    - `/kennisbank`
    - `/branches`
    - `/werken-bij`
    - `/hulp-nodig-bij-geldproblemen`
    - `/nowid`
    - `/wki`
- **Incasso-subpagina's:**
    - `/incasso/incassobureau-inschakelen`
    - `/incasso/incasso-in-het-buitenland`
    - `/incasso/incassokosten-berekenen`
    - `/incasso/wik-brief`
- **Branches (10):** `/branches/incasso-` + `bouw`, `automotive`, `dienstverlening`, `ecommerce`, `groothandel`, `mkb`, `transport`, `verhuur`, `zorg`, `zzp`
- **Vacatures:**
    - `/werken-bij/incasso-medewerker`
    - `/werken-bij/call-center-medewerker`
    - `/werken-bij/stage`
- **Kennisbank: 27 artikelen** onder `/kennisbank/<slug>`. De slugs staan in de Framer-sitemap.
- **Niet in de sitemap, wel gelinkt in de footer:**
    - `/juridisch/algemene-voorwaarden`
    - `/juridisch/privacy-beleid`
    - `/juridisch/cookie-beleid`
    - `/klachtenregelement`
    - `/brief-ontvangen`
    - `/tarieven`

    Controleer bij de bouw of deze in Framer bestaan.

## 2. Wat Breyta heeft (structuur, ter inspiratie)

- **Diensten als losse pagina's:**
    - `/onze-incassodiensten` (overzicht)
    - `/pre-incasso`
    - `/no-cure-no-pay-incasso`
    - `/gerechtelijke-incassoprocedure`
    - `/deurwaarder-inschakelen`
    - `/faillissement-aanvragen`
    - `/incassobureau-inschakelen`
    - `/incassokosten-berekenen`
- **Conversie:**
    - `/incasso-indienen` en `/pre-incasso-indienen`
    - `/aanvraag-gerechtelijk-advies`
    - `/incassopartner` (BreytaPro-abonnement) met `/incassopartner-aanvraag`
    - een aparte bedankpagina per formulier (`/bedankt-*`)
- **Vertrouwen:**
    - `/reviews`
    - `/testimonials`
    - `/over-ons`
    - `/tarieven`
    - `/verwerkersovereenkomst`
- **Debiteur:** `/rekening-betalen`, `/betaling-verwerken`, `/betaling-mislukt` (betalen via de site)
- **Lokale SEO:** `/steden/*`, 18 stadspagina's ("incassobureau Amsterdam" enz.)
- **Content:**
    - `/blog` (24 artikelen)
    - `/vacatures`
    - `/vraag-het-finn` (chatbot)
    - Engelse versie `/en-gb/*`

## 3. Doelstructuur GeldGarant, met prioriteit

Elke pagina krijgt één hoofdvraag van de bezoeker. Elke sectie op die pagina beantwoordt een deelvraag, in de volgorde waarin hij die stelt (zie de principes in `HANDOFF.md` §4).

### Fase A: kernpagina's (nu)

| #   | URL                     | Hoofdvraag bezoeker                                               | Kerninhoud                                                                                                                                                                                                                                                                           |
| --- | ----------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1  | `/incasso` ✓ (6 nov)    | "Hoe gaan jullie mijn vordering innen, en wat kan ik verwachten?" | Minnelijk traject stap voor stap (dossier-component hergebruiken), wat wij doen en wat u doet, zakelijk vs particulier (14-dagenbrief), doorlooptijden zonder verzonnen cijfers, kosten (`Kosten.astro`), naar de rechter alleen met akkoord, FAQ, CTA. Linkt naar de A-subpagina's. |
| A2  | `/debiteurenbeheer` ✓   | "Kunnen jullie voorkomen dat facturen een incassozaak worden?"    | Verschil met incasso, wat we overnemen (herinneringen, bellen, bewaken), pakketten (prijzen eerst bevestigen), hoe de overstap naar incasso werkt, voorbeeldtijdlijn van een factuur, FAQ                                                                                            |
| A3  | `/tarieven` ✓           | "Wat kost het mij precies?"                                       | WIK-staffel + rekenmodule, provisiestaffel uit de AV (document nodig), scenario's, debiteurenbeheer-pakketten, wat nooit kost                                                                                                                                                        |
| A4  | `/vordering-indienen` ✓ | "Hoe snel kan ik starten?"                                        | Meerstapsformulier op de intake-worker, verwachtingen per stap, bedankstatus                                                                                                                                                                                                         |
| A5  | `/hoe-werkt-het` ✓      | "Wat gebeurt er na het indienen?"                                 | Eigen pagina (6 nov): zes stappen met wat wij doen, wat u doet en wat u ziet; situatie-kiezer "wat als de debiteur…"; aanleveren; FAQ                                                                                                                                                |
| A6  | `/over-ons` ✓           | "Wie zijn jullie, en kan ik jullie vertrouwen?"                   | Gebouwd 6 nov, **zonder persoonsnamen**: missie + feitenkaart, verhaal + vergelijking, principes, zekerheid (Wki, register 00273, derdengeldenrekening, NowID), organisatie, branches, kantoor, werken bij                                                                           |
| A7  | `/contact-opnemen` ✓    | "Hoe bereik ik jullie het snelst?"                                | Kanalen met reactietijd, contactformulier (worker `/api/contact`), adres en kaart, openingstijden                                                                                                                                                                                    |

### Fase B: subpagina's en vertrouwen

| URL                                                        | Opmerking                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `/incasso/incassobureau-inschakelen` ✓ (6 nov)             | Wanneer en hoe: signalen, check, vergelijking, drie stappen                    |
| `/incasso/incassokosten-berekenen` ✓ (6 nov)               | Rekenmodule: WIK, btw en wettelijke (handels)rente per periode, rente op rente |
| `/incasso/incasso-in-het-buitenland` ✓ (6 nov)             | Aanpak, landen en EU-procedures; alleen wat jullie echt doen                   |
| `/incasso/wik-brief` ✓ (6 nov)                             | Termijnrekenaar, geannoteerde voorbeeldbrief, de vijf eisen                    |
| **Nieuw (Breyta-gat):** `/incasso/gerechtelijke-procedure` | Wanneer, kosten vooraf, alleen met akkoord. Alleen als jullie dit aanbieden.   |
| **Nieuw:** `/incasso/faillissement`                        | Vordering bij de curator, €115 excl. btw (uit de FAQ)                          |
| `/wki` ✓, `/nowid` ✓ (6 nov)                               | Vertrouwenspagina's, gebouwd. Feiten met bronnen in `faq.ts`.                  |
| `/branches` + 10 branches ✓ (6 nov)                        | Eén template, unieke inhoud per branche in `src/data/branches.ts`              |

### Fase C: content, SEO en debiteur

| URL                                          | Opmerking                                                                                                                                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/kennisbank` + 27 artikelen ✓ (6 nov)       | Gebouwd als content collection (`src/content/kennisbank`), slugs gelijk aan Framer, alle artikelen herschreven.                                                                                                 |
| `/brief-ontvangen`                           | **Later** (besluit gebruiker): direct betalen en regelingen vragen een koppeling met CaseControl (debiteurenportaal `site.debtorPortal`). Eerst uitzoeken wat CaseControl biedt (betaallink, portaal-deeplink). |
| `/hulp-nodig-bij-geldproblemen` ✓ (7 nov)    | Voor debiteuren: situatiekiezer, negen instanties, brief van GeldGarant, 113                                                                                                                                    |
| `/werken-bij` + 3 vacatures ✓ (7 nov)        | Slugs behouden; template `werken-bij/[slug].astro`, inhoud `src/data/vacatures.ts`, JobPosting-schema                                                                                                           |
| **Optioneel nieuw:** `/incassobureau/<stad>` | Lokale SEO zoals Breyta's `/steden`. Alleen met echte, unieke inhoud per stad; anders zijn het "doorway pages", en daar straft Google voor.                                                                     |
| **Optioneel nieuw:** `/reviews`              | Pas als er echte reviews zijn                                                                                                                                                                                   |

### Fase D: juridisch en techniek

- `/juridisch/algemene-voorwaarden`, `/juridisch/privacy-beleid`, `/juridisch/cookie-beleid`, `/klachtenregelement`.
- Overweeg een verwerkersovereenkomst, zoals Breyta: zakelijke opdrachtgevers vragen daarom.
- 404-pagina, bedankpagina's per formulier, redirects (`public/_redirects` of een Worker-route), sitemap en robots, OG-beelden per pagina.

## 4. Navigatie (voorstel)

- **Hoofdmenu:** Incasso (met een uitklapmenu voor de subpagina's), Debiteurenbeheer, Tarieven, Branches, Kennisbank, Over ons.
- **CTA:** "Vordering indienen".
- **Utility-balk:** "Brief ontvangen?" en "Inloggen", zoals nu.
- Een uitklapmenu (mega-menu) bij Incasso komt pas als fase B er staat. Breyta heeft een dropdown "Onze incassodiensten".
