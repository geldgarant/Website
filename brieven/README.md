# Brieven (CaseControl-templates)

CaseControl maakt brieven met **dompdf 3.1** (gemeten in hun PDF van 7 nov 2026): A4, **marges 20 mm rondom**,
standaardlettertype Roboto. De editor bewaart alleen inline stijlen, dus geen `<style>`-blok, geen klassen, geen flexbox
of grid. Vaste afbeeldingen (logo) staan als data-URI in de brief.

## De brieven (versie 1, 7 nov 2026)

| Plakklaar (CaseControl, codeweergave) | Naam in CaseControl                   | Termijn                                       | Voorbeeld-PDF                                    |
| ------------------------------------- | ------------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| `aanmaning-1-b2b.html`                | GG \| BRIEF \| B2B \| Aanmaning 1     | `misc.today_plus_7_business_days`             | `voorbeeld/aanmaning-1-b2b-voorbeeld.pdf`        |
| `sommatie-b2b.html`                   | GG \| BRIEF \| B2B \| Sommatie        | `misc.today_plus_5_business_days`             | `voorbeeld/sommatie-b2b-voorbeeld.pdf`           |
| `aanmaning-14-dagen-b2c.html`         | GG \| BRIEF \| B2C \| Aanmaning 14 d. | 14 dagen na de dag van ontvangst (geen datum) | `voorbeeld/aanmaning-14-dagen-b2c-voorbeeld.pdf` |

Alle drie: zelfde raster (venster links), zelfde kop, voet en contactblok, specificatie volgens Besluit Wki art. 3.1,
betaalblok met dynamische QR (zie hieronder) en overmaakgegevens, regeling, niet eens, klachtenregeling, hulp bij geldzorgen.

- **Sommatie**: verzonden aangetekend en per e-mail (workflow fase 4). Voortgangsbalk Aanmaning (gedaan), Sommatie (nu),
  Rechter (als betaling uitblijft, na akkoord opdrachtgever). Gevolgen feitelijk: dagvaarding, proceskosten, beslag na
  een vonnis. Bewust niet: "zonder nadere aankondiging", loonbeslag (bedrijf), "niet gematigd" (zie kritiek oude sommatie).
- **14-dagenbrief (B2C)**: voldoet aan art. 6:96 lid 6 BW (na de vervaldatum, 14 dagen vanaf de dag na ontvangst, het
  exacte bedrag aan kosten, de gevolgen, "aan deze brief zijn geen kosten verbonden"). Wettelijke rente art. 6:119 BW
  (4% sinds 1 januari 2026). Geen t.a.v.-regel. **Voorwaarde in CaseControl:** `case.total_amount_due` mag op dat moment
  nog geen incassokosten bevatten; zet het incassokostensjabloon pas aan na de 14 dagen. `case.penalty_amount_incl_vat`
  moet wel al het staffelbedrag geven (incl. btw alleen als de opdrachtgever de btw niet kan verrekenen).

## Dynamische QR-code (betaallink van het dossier)

De QR-code opent `{{case.online_payment_link}}`, de betaallink die CaseControl per dossier heeft. Een template kan zelf
geen QR tekenen, dus de brief laadt een afbeelding van onze eigen worker-route:

```
https://website.geldgarant.workers.dev/api/qr?d={{case.case_number}}&data={{case.online_payment_link}}
```

- Route: `worker/qr.ts` (tests: `tests/unit/qr-worker.test.ts`). `data` staat altijd achteraan en wordt letterlijk tot
  het einde gelezen (CaseControl codeert de link niet). Een `<a>`-element of HTML-entiteiten worden opgevangen.
- Ontbreekt de betaallink of is hij ongeldig, dan wijst de QR naar `geldgarant.com/brief-ontvangen?dossier=…#betalen`.
  Een brief krijgt dus nooit een QR die nergens heen gaat. Er wordt niets opgeslagen of gelogd.
- In een gemailde PDF zijn de QR en "Online met iDEAL" ook klikbaar (`<a href="{{case.online_payment_link}}">`).
- **Nog te controleren in een proefbrief:** laadt CaseControl externe afbeeldingen? De oude sommatie liet een lege QR
  zien (toen via api.qrserver.com). Blijft de QR leeg, bouw dan met `QR=statisch python3 brieven/tools/bouw.py`: dan
  staat er weer de vaste QR naar geldgarant.com/betalen in.
- Host wijzigen (na de livegang mag het `https://geldgarant.com` zijn): `QR_HOST=https://geldgarant.com python3 brieven/tools/bouw.py`.

## Werkwijze

1. Bron aanpassen in `src/<naam>.html` (stijlen als `%%naam%%` uit `tools/bouw.py`, afbeeldingen `[[LOGO_DATA]]`,
   `[[QR_DATA]]` (vast) en `[[QR_BETAAL]]` (dynamisch)).
2. `python3 brieven/tools/bouw.py` schrijft de plakklare `brieven/<naam>.html` (weigert gedachtestreepjes).
3. Voorbeeld-PDF met dezelfde motor en marges als CaseControl (dompdf eenmalig ophalen: `bash scripts/dev/dompdf-lib.sh`):

    ```bash
    npx tsx scripts/dev/qr-proef.mts "d=26-1008&data=https://geldgarant.debtorportal.com/betalen/VOORBEELD-26-1008" /tmp/qr.png
    QR_PNG=/tmp/qr.png DOMPDF_LIB=/home/claude/brief/lib php brieven/tools/render-cc.php \
      brieven/<naam>.html brieven/voorbeeld/<naam>.json brieven/voorbeeld/<naam>-voorbeeld.pdf
    ```

    `QR_PNG` is nodig omdat de render geen netwerk heeft; `qr-proef.mts` gebruikt exact de code van de route.

4. PDF bekijken (`pdftoppm`, `pdfplumber` voor posities in mm) en de inhoud van `brieven/<naam>.html` in de
   CaseControl-editor plakken (codeweergave). Proefbrief printen, vouwen, adres in het venster?

## Variabelen

Uit de lijst van CaseControl (`casecontrol-variabelen.md`) en de oude sommatie (`oud/`): `debtor.name`,
`debtor.correspondence_attention_of_merged`, `debtor.street`, `debtor.house_no`, `debtor.house_no_suffix`,
`debtor.zipcode`, `debtor.city`, `debtor.correspondence_salutation_merged`, `creditor.name`, `case.case_number`,
`case.total_amount_due`, `case.interest`, `case.penalty_amount_incl_vat`, `case.online_payment_link`,
`misc.case_original_claims`, `misc.today`, `misc.today_plus_5_business_days`, `misc.today_plus_7_business_days`,
`org_visiting_address.*`, `org_communication.telephone`, `org_communication.email`,
`org_registration.chamber_of_commerce_number`, `org_registration.business_license_number`, `org_escrow_bank_account.*`.

## Let op bij gebruik

- **Telefoonnummer in CaseControl bijwerken** (Organisatie → communicatie): de oude PDF toont nog 085 083 5230.
- Rentepercentages staan vast in de tekst (handelsrente 10,40% sinds 1 juli 2026; wettelijke rente 4% sinds 1 januari
  2026): bijwerken per 1 januari en 1 juli.
- Postcode komt uit CaseControl zoals ingevoerd (vaak zonder spatie); de plaats staat via de opmaak in hoofdletters.
- Alleen voor debiteuren in Nederland (geen landregel).

## Raster (vensterenvelop, venster links)

- Kop 20 tot 42 mm; retourregel op 50 mm; adres ca. 56 tot 75 mm van boven, 25 mm van links. Past in EA5/6 (110 x 220)
  of C5/6 (114 x 229) met venster links, ook als de brief een paar millimeter verschuift.
- Referenties (datum, dossiernummer enz.) vanaf 133 mm, buiten het venster.
- **Vouwtekens** op 99 en 198 mm (zigzag in drieën, het adres komt boven), **ponsteken** op 148,5 mm.
- Na de eerste vouw (99 mm) begint het onderwerp. Vaste voettekst met dossiernummer op elke pagina.

## Archief (`oud/`)

`sommatie-b2b-casecontrol-oud.*` (de sommatie die in CaseControl stond) en `sommatie-b2b-opzet-v2.*` + `render-opzet-v2.php`
(eerste opzet met tokens en eigen lettertypes; vervangen door `src/sommatie-b2b.html`).
