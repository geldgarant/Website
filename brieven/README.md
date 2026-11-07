# Brieven (CaseControl-templates)

CaseControl maakt brieven met **dompdf 3.1** (gemeten in hun PDF van 7 nov 2026): A4, **marges 20 mm rondom**,
standaardlettertype Roboto, **externe afbeeldingen laden niet** (de QR-code van api.qrserver.com in de oude sommatie bleef
leeg). De editor bewaart alleen inline stijlen, dus geen `<style>`-blok, geen klassen, geen flexbox of grid.

## Aanmaning 1 (B2B), versie 1, 7 nov 2026

| Bestand                                   | Wat                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `aanmaning-1-b2b.html`                    | **Plakklaar** voor CaseControl: GG \| BRIEF \| B2B \| Aanmaning 1        |
| `src/aanmaning-1-b2b.html`                | Leesbare bron (stijlen als `%%naam%%`, afbeeldingen als `[[LOGO_DATA]]`) |
| `tools/bouw.py`                           | Bouwt de plakklare versie: stijlen inline, logo en QR als data-URI       |
| `tools/render-cc.php`                     | Voorbeeld-PDF met dezelfde motor en marges als CaseControl               |
| `voorbeeld/aanmaning-1-b2b.json`          | Voorbeeldwaarden per CaseControl-variabele (dossier 26-1008)             |
| `voorbeeld/aanmaning-1-b2b-voorbeeld.pdf` | Resultaat                                                                |
| `assets/logo-brief.png`, `qr-betalen.png` | Logo (900 px, 16 kleuren) en QR-code naar https://geldgarant.com/betalen |

Werkwijze: bron aanpassen → `python3 brieven/tools/bouw.py` →
`DOMPDF_LIB=/pad/lib php brieven/tools/render-cc.php brieven/aanmaning-1-b2b.html brieven/voorbeeld/aanmaning-1-b2b.json uit.pdf`
→ PDF bekijken → de hele inhoud van `aanmaning-1-b2b.html` in de CaseControl-editor plakken (codeweergave).

Variabelen (uit de lijst van CaseControl en de oude sommatie): `debtor.name`, `debtor.correspondence_attention_of_merged`,
`debtor.street`, `debtor.house_no`, `debtor.house_no_suffix`, `debtor.zipcode`, `debtor.city`,
`debtor.correspondence_salutation_merged`, `creditor.name`, `case.case_number`, `case.total_amount_due`, `case.interest`,
`case.penalty_amount_incl_vat`, `misc.case_original_claims`, `misc.today`, `misc.today_plus_7_business_days`,
`org_visiting_address.*`, `org_communication.telephone`, `org_communication.email`,
`org_registration.chamber_of_commerce_number`, `org_registration.business_license_number`, `org_escrow_bank_account.*`.

Let op bij gebruik:

- **Telefoonnummer in CaseControl bijwerken** (Organisatie → communicatie): de oude PDF toont nog 085 083 5230.
- Rentepercentage staat vast in de tekst (10,40% sinds 1 juli 2026): bijwerken per 1 januari en 1 juli.
- Betaaltermijn: 7 werkdagen (`misc.today_plus_7_business_days`). Langer: `misc.today_plus_14_business_days`.
- Postcode komt uit CaseControl zoals ingevoerd (vaak zonder spatie); de plaats staat via de opmaak in hoofdletters.
- Alleen voor debiteuren in Nederland (geen landregel). Voor particulieren is een aparte 14-dagenbrief nodig.

## Sommatie (versie 2, eerdere opzet)

De sommatie hieronder gebruikt nog `[[TOKENS]]` en eigen lettertypes; die wordt omgezet naar dezelfde opbouw als de aanmaning.

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
