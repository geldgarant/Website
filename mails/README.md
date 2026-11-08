# E-mails voor CaseControl

Drie e-mails, gelijk aan de brieven in `brieven/` (zelfde termijnen, bedragen, verplichte onderdelen en toon), in de
huisstijl van de site.

| Bestand                       | Onderwerp en preheader in    | Termijn                              |
| ----------------------------- | ---------------------------- | ------------------------------------ |
| `aanmaning-1-b2b.html`        | `aanmaning-1-b2b.txt`        | `misc.today_plus_7_business_days`    |
| `sommatie-b2b.html`           | `sommatie-b2b.txt`           | `misc.today_plus_5_business_days`    |
| `aanmaning-14-dagen-b2c.html` | `aanmaning-14-dagen-b2c.txt` | 14 dagen na ontvangst (art. 6:96 BW) |

## Werkwijze

1. Wijzig tekst of opmaak alleen in `mails/tools/bouw.py` (inhoud onderaan, bouwstenen bovenaan).
2. `python3 mails/tools/bouw.py` schrijft de plakklare HTML en de `.txt` met onderwerp en preheader.
3. `CHROME_PATH=/usr/bin/google-chrome node mails/tools/voorbeeld.mjs` vult `mails/voorbeeld/<naam>.json` in en maakt
   screenshots op 640 en 375 px in `/tmp`. Velden zonder voorbeeldwaarde worden gemeld.
4. In CaseControl: e-mailsjabloon openen, codeweergave, alles vervangen door de inhoud van het `.html`-bestand,
   onderwerp uit het `.txt`-bestand plakken. Stuur een proefmail naar een eigen adres (Gmail en Outlook).

## Keuzes

- **Alleen inline stijlen, één kolom, max. 600 px.** De editor bewaart geen `<style>`; zonder media queries is dit de
  opbouw die op elk scherm klopt. Bedragen breken nooit af; lange namen en de portaal-URL wel.
- **Eigen kop en voet**, niet `{{text_block.email_header}}`/`{{text_block.email_footer}}`: die bevatten het oude
  telefoonnummer en het btw-nummer. Alles komt uit de organisatievelden (`org_*`), dus een nieuw nummer in CaseControl
  verschijnt vanzelf. Wki-nummer via `{{org_registration.business_license_number}}` (zoals in de brieven).
- **Logo** als gehoste PNG: `https://geldgarant.com/mail/logo.png` (`public/mail/logo.png`, uit
  `public/brand/full-logo-light.svg`). Data-URI's worden door Gmail geblokkeerd. Laadt het beeld niet, dan staat er
  "GeldGarant" als alt-tekst.
- **iDEAL-knop bovenaan**, direct onder het bedrag en de datum (`{{case.online_payment_link}}`). Overmaakgegevens als
  terugval. Regeling en "niet eens" linken naar `/brief-ontvangen?dossier=…&reden=regeling|oneens#regelen`.
- **Geen "Grondslag"** (veld is meestal leeg), geen gedachtestreepjes in het onderwerp, geen btw-nummer.
- **Portaalblok** met inlog (`misc.debtor_portal_url`, gebruikersnaam, wachtwoord) staat onderaan en is bewust
  bescheiden: betalen gaat via de knop, het portaal is voor stukken aanleveren.

## Controleren in CaseControl

- `{{debtor.correspondence_salutation_merged}}` gaf in de oude mail "Geachte relatie". Vul bij debiteuren de aanhef of
  contactpersoon in, anders blijft die algemene aanhef staan. De brieven gaan uit van een aanhef met komma.
- `{{claims.all_numbers}}` en `{{case.capital_amount}}` werkten in de oude mail; staan nu in de specificatie.
- 14-dagenbrief per e-mail is alleen geldig als de debiteur met e-mail als communicatiemiddel heeft ingestemd (of u
  al per e-mail met hem communiceerde). Zet het incassokostensjabloon pas na de 14 dagen aan:
  `{{case.total_amount_due}}` mag in deze mail nog geen incassokosten bevatten.
