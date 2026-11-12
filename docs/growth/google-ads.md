# Google Ads: beleid, businesscase en conceptcampagnes

Status 12 nov 2026 (bijgesteld): **pilot met plafond** op verzoek van de eigenaar (nul klanten: eerste klanten en echte
cijfers kopen). Max € 15 per dag, 4 weken, exacte zoekwoorden, importbestand `docs/growth/ads-import.csv` (uit
`scripts/growth/ads-campagne.mjs`). Opschalen blijft NO-GO tot de checklist hieronder groen is. Er is nog geen account.

## 1. Beleid (gecontroleerd 12 nov 2026)

- Pagina [Financiële diensten](https://support.google.com/adspolicy/answer/2464998?hl=nl) noemt incasso niet. Gereguleerde
  categorie "Services voor schulden" = schuldsanering/schuldbeheer namens consumenten, alleen met Google-certificering.
  GeldGarant werkt voor schuldeisers (B2B): **HYPOTHESE** dat dit buiten die categorie valt. Risico: advertenties of
  zoekwoorden met "schulden", "schuldhulp", "betalingsregeling" kunnen als schuldendienst worden gelezen → vermijden.
- Verboden in dezelfde policy: gebruikers aansporen geen contact op te nemen met schuldhulpverlener/advocaat.
- Landingspagina's moeten contactgegevens, privacyverklaring en eerlijke kosten tonen: aanwezig (`/tarieven`, AV, footer).
- Wki: claims alleen zoals op de site ("Geregistreerd bij Justis", 00273). Geen "erkend", geen garantie op inning.
- Bevestigen vóór livegang: Google Ads-adverteerdersverificatie en een proefadvertentie ter beoordeling (kost niets
  zolang het budget € 0 of gepauzeerd is).

## 2. Tooling (gecontroleerd 12 nov 2026)

- [Officiële Google Ads MCP](https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server)
  (`google-ads-mcp`, v0.0.6): lezen (GAQL), plus beperkt schrijven (assets, labels) met dry-run en bevestiging. **Geen**
  campagnes, advertenties, budgetten of biedingen. Python 3.10+, pipx, gcloud, Google Cloud-project met Ads API, OAuth/ADC.
  Developer tokens vervallen 9 sep 2026; toegangsniveau hangt aan het Cloud-project (nieuw = Test; productie vraagt
  Explorer/Basic). Pas installeren als er een account met data is (read-only configureren).
- Zoekvolumes/CPC: Keyword Planner (gratis in een Ads-account) is de officiële bron; tot die tijd Ubersuggest-schattingen.

## 3. Rekenmodel (BEREKEND op AANNAMES)

`node scripts/growth/ads-scenario.mjs` → `docs/growth/ads-scenario.csv`. Omzet = WIK-incassokosten × inningskans
(rente en deelbetalingen weggelaten), min behandeltijd à € 45/uur.

| Scenario      | CPC  | klik→aanvraag | kwal. | close | dossiers/klant 12 m | hoofdsom | inning | marge/klant 12 m | CAC     | **break-even CPC**               |
| ------------- | ---- | ------------- | ----- | ----- | ------------------- | -------- | ------ | ---------------- | ------- | -------------------------------- |
| Pessimistisch | € 20 | 3%            | 50%   | 60%   | 1,3                 | € 1.500  | 40%    | € -29            | € 2.222 | **n.v.t. (verlies per dossier)** |
| Basis         | € 15 | 6%            | 65%   | 75%   | 2,5                 | € 3.000  | 55%    | € 359            | € 513   | **€ 10,51**                      |
| Optimistisch  | € 10 | 10%           | 80%   | 90%   | 5                   | € 6.000  | 70%    | € 2.025          | € 139   | **€ 145,80**                     |

Per budget (basis): € 300 → 20 klikken, 1,2 aanvragen, 0,6 opdrachtgever; € 750 → 50 klikken, 3 aanvragen, 1,5
opdrachtgever; € 1.500 → 100 klikken, 6 aanvragen, 2,9 opdrachtgevers. Netto na 12 maanden marge: −€ 90 / −€ 224 / −€ 449
per maand budget.

**Lezen.** De uitkomst hangt bijna volledig af van hoofdsom en dossiers per opdrachtgever, niet van het budget. Bij
geschatte CPC's van € 13 tot € 17 (Ubersuggest) is brede zoekcampagne in het basisscenario verliesgevend. Een pilot is
alleen verdedigbaar als die zich richt op opdrachtgevers met herhaalvolume of grotere vorderingen (debiteurenbeheer,
verhuur/vastgoed, groothandel, bouw-onderaanneming) én als de conversiemeting tot opdrachtgever werkt.

**Break-even-regel.** `max CPC = marge per opdrachtgever (12 m) × klik→aanvraag × kwalificatie × close`. Herbereken zodra
er 20+ echte aanvragen met bron en 10+ opdrachtgevers met 6 maanden historie zijn.

## 4. GO/NO-GO-checklist

| #   | Voorwaarde                                                         | Status 12 nov                              |
| --- | ------------------------------------------------------------------ | ------------------------------------------ |
| 1   | Ads-account, verificatie, beleid bevestigd                         | geen account (gebruiker, 12 nov)           |
| 2   | Landingspagina's en claims juridisch akkoord                       | site ok; advertentieteksten concept        |
| 3   | Conversie = aanvraag met bron (backend), geen klik                 | herkomst in code 12 nov; worker-patch open |
| 4   | Definitie gekwalificeerde aanvraag + leadregister                  | definitie in MEETPLAN; sjabloon klaar      |
| 5   | Opvolging binnen het uur op werkdagen                              | belofte op de site; borgen                 |
| 6   | Dag- en maandlimiet, eigenaar, stopregel                           | concept hieronder                          |
| 7   | Negatieve zoekwoorden                                              | concept hieronder                          |
| 8   | Inningskans en dossiers/klant uit CaseControl (minimaal schatting) | NIET BESCHIKBAAR                           |
| 9   | Expliciete toestemming gebruiker voor livegang en budget           | niet gegeven                               |

Stopregel pilot: na € 500 uitgave zonder één gekwalificeerde aanvraag, of na 8 weken CAC > 2× break-even → stoppen.

## 5. Conceptcampagnes (niet aangemaakt)

| Campagne                | Zoekwoorden (exact/phrase)                                                    | Landingspagina                             | Doel                                       |
| ----------------------- | ----------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------ |
| Zakelijke incasso       | [incassobureau inschakelen], "incasso uit handen geven", [zakelijke incasso]  | `/incasso/incassobureau-inschakelen`       | vordering indienen                         |
| Kosten / no cure no pay | [no cure no pay incasso], "kosten incassobureau", [incassobureau kosten]      | `/tarieven`                                | vordering indienen                         |
| Oude facturen           | "oude factuur innen", "openstaande factuur innen", [onbetaalde factuur innen] | `/incasso` (blok oude vorderingen nodig)   | vordering indienen                         |
| Branche (pilot 1)       | "incasso huurachterstand", [incassobureau verhuurder], "incasso groothandel"  | `/branches/incasso-verhuur`, `/branches/…` | vordering indienen                         |
| Debiteurenbeheer        | [debiteurenbeheer uitbesteden], "debiteurenbeheer mkb"                        | `/debiteurenbeheer`                        | contact (pakket)                           |
| Merk                    | [geldgarant]                                                                  | `/`                                        | alleen als concurrenten op het merk bieden |

Advertentietekst (concept, binnen huisstijl): "Incassobureau voor ondernemers" / "Betaalt uw klant alles, dan betaalt u
niets" / "Geregistreerd bij Justis (00273)" / "Op werkdagen binnen het uur in behandeling". Geen uitroeptekens, geen
garanties op inning.

Negatieve zoekwoorden (start): `betalen`, `betaling regelen`, `brief ontvangen`, `bezwaar`, `klacht`, `schuldhulp`,
`schulden`, `schuldsanering`, `vacature`, `werken bij`, `opleiding`, `cursus`, `stage`, `gratis`, `voorbeeldbrief`,
`template`, `particulier`, `belastingdienst`, `cjib`, `deurwaarder kosten`. Na de eerste week zoektermrapport nalopen;
"gratis" en "voorbeeld" kunnen ook waardevol blijken (geen blinde uitsluiting zonder data).

Instellingen: Nederland, Nederlands, alleen Zoeken (geen Display/PMax), handmatige CPC of Maximize clicks met plafond
in de leerfase, werkdagen 7-19 uur, conversiedoel = aanvraag met bron (offline import later).
