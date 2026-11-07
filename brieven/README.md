# Brieven (CaseControl-templates)

CaseControl maakt brieven met **dompdf** (de oude sommatie meldt "dompdf 3.1.6"). Daarom zijn deze templates gewone HTML
met CSS die dompdf goed ondersteunt: tabellen, absolute en vaste posities, geen flexbox of grid. Zet in CaseControl
alleen de inhoud van het bestand in de template editor: geen DOCTYPE, `html`, `head` of `body`.

| Bestand                                | Wat                                                               |
| -------------------------------------- | ----------------------------------------------------------------- |
| `sommatie-b2b.html`                    | GG \| BRIEF \| B2B \| Sommatie aangetekend (versie 2, 7 nov 2026) |
| `voorbeeld/sommatie-b2b.json`          | Voorbeelddata (dossier 26-1008) voor de voorbeeld-PDF             |
| `voorbeeld/sommatie-b2b-voorbeeld.pdf` | Zo ziet de brief eruit in dompdf                                  |
| `tools/render.php`                     | Maakt de voorbeeld-PDF met dezelfde motor als CaseControl         |

Lettertypes en logo staan op de site: `public/brief/` (Inter, Poppins als TTF; `logo.png`). In het template heet die
map `[[ASSETS]]`: tot de livegang `https://website.geldgarant.workers.dev/brief`, daarna `https://geldgarant.com/brief`.

## Raster (vensterenvelop)

- A4, marges 20 mm links en rechts, 22 mm boven, 24 mm onder (voettekst in de ondermarge).
- **Adresveld**: 22 tot 107 mm van links, retourregel op 47 mm, adres van ca. 57 tot 80 mm van boven. Past in een
  vensterenvelop met venster links (EA5/6 110 x 220 of C5/6 114 x 229, venster ca. 40 x 90 tot 110 mm op 20 mm van links),
  ook als de brief een paar millimeter verschuift. Postcode en plaats met twee spaties, plaats in hoofdletters (PostNL).
- Alles rechts van het adres (stempel "Aangetekend", datum, kenmerk) begint op 133 mm, buiten het venster.
- **Vouwtekens** op 99 en 198 mm (zigzag in drieën, het adres komt boven), **ponsteken** op 148,5 mm.
- Na de eerste vouw (99 mm) begint de tekst: onderwerp op ca. 102 mm.

## Tokens

Vervang elk `[[TOKEN]]` door de juiste CaseControl-variabele (de namen staan in jullie huidige template; die code had ik
nog niet). `render.php` meldt tokens die niet vervangen zijn.

| Token                   | Inhoud                                                                    | Voorbeeld                                                                             |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `[[ASSETS]]`            | Map met lettertypes en logo (vast, geen variabele)                        | `https://geldgarant.com/brief`                                                        |
| `[[DATUM]]`             | Datum van de brief                                                        | 7 november 2026                                                                       |
| `[[DOSSIERNUMMER]]`     | Dossiernummer (ook betalingskenmerk)                                      | 26-1008                                                                               |
| `[[OPDRACHTGEVER]]`     | Naam opdrachtgever                                                        | Icon koeriersdiensten                                                                 |
| `[[UITERSTE_DATUM]]`    | Datum + 5 werkdagen                                                       | 13 november 2026                                                                      |
| `[[DEBITEUR_NAAM]]`     | Bedrijfsnaam debiteur                                                     | EANA Transport                                                                        |
| `[[DEBITEUR_TAV]]`      | T.a.v.-regel (leeg laten mag)                                             | T.a.v. de directie                                                                    |
| `[[DEBITEUR_ADRES]]`    | Straat en huisnummer                                                      | Aquamarijnstraat 155                                                                  |
| `[[DEBITEUR_POSTCODE]]` | Postcode                                                                  | 7554 NP                                                                               |
| `[[DEBITEUR_PLAATS]]`   | Plaats, in hoofdletters                                                   | HENGELO                                                                               |
| `[[AANHEF]]`            | `debtor.correspondence_salutation_merged` (vaste regel)                   | Geachte directie,                                                                     |
| `[[VORDERINGEN_RIJEN]]` | Lus over de facturen, per factuur één `<tr>` met 6 cellen (zie hieronder) |                                                                                       |
| `[[HOOFDSOM]]`          | Totaal openstaande hoofdsom                                               | € 7.253,77                                                                            |
| `[[RENTE]]`             | Opgebouwde wettelijke (handels)rente                                      | € 421,70                                                                              |
| `[[RENTE_TOELICHTING]]` | Periode en percentage (Besluit Wki art. 3.1)                              | Vanaf de vervaldatum per factuur tot en met 7-11-2026 (10,15%, vanaf 1-7-2026 10,40%) |
| `[[INCASSOKOSTEN]]`     | Buitengerechtelijke incassokosten                                         | € 737,69                                                                              |
| `[[BTW_RIJ]]`           | Alleen als btw over de kosten wordt gerekend, anders leeg                 | zie hieronder                                                                         |
| `[[TOTAAL]]`            | Totaal te betalen                                                         | € 8.413,16                                                                            |
| `[[QR_URL]]`            | Afbeelding van een QR-code naar de betaalpagina                           | zie hieronder                                                                         |

Factuurrij (`[[VORDERINGEN_RIJEN]]`), per factuur:

```html
<tr>
    <td>{factuurnummer}</td>
    <td>{factuurdatum}</td>
    <td>{vervaldatum}</td>
    <td class="r">{bedrag}</td>
    <td class="r">{betaald}</td>
    <td class="r">{open}</td>
</tr>
```

Btw-rij (`[[BTW_RIJ]]`), alleen als de opdrachtgever de btw niet kan verrekenen:

```html
<tr class="post">
    <td colspan="5">Btw over de incassokosten (21%)</td>
    <td class="r">{btw}</td>
</tr>
```

## QR-code

De QR-code opent `https://geldgarant.com/brief-ontvangen?dossier={dossiernummer}&bedrag={totaal met punt}`. Daar staan
dossiernummer en bedrag al ingevuld en betaalt de debiteur met iDEAL. Mogelijkheden voor `[[QR_URL]]`:

1. Een QR-variabele van CaseControl, als die er is (vraag na bij FinChamps: "QR-code met betaallink in template").
2. Een QR-dienst, bijvoorbeeld `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=` gevolgd door de
   URL-gecodeerde link. Werkt direct, maar dan gaan dossiernummer en bedrag naar een externe partij.
3. Later een eigen route in onze worker (`/api/qr`), dan blijft alles bij ons.

## Voorbeeld-PDF maken

```bash
git clone --depth 1 --branch v3.1.4 https://github.com/dompdf/dompdf lib/dompdf   # plus php-font-lib 1.0.1,
# php-svg-lib 1.0.0, Masterminds/html5-php 2.9.0 en MyIntervals/PHP-CSS-Parser v8.8.0 in dezelfde map
DOMPDF_LIB=$PWD/lib php brieven/tools/render.php brieven/sommatie-b2b.html brieven/voorbeeld/sommatie-b2b.json uit.pdf
```

Voor de echte brief: print één exemplaar, vouw hem op de tekens en controleer in de envelop die jullie gebruiken of het
adres helemaal in het venster valt.
