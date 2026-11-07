# GeldGarant CaseControl — Volledig Projectoverzicht

## Bedrijf
- Naam: GeldGarant B.V.
- Type: Incassobureau (debiteurenbeheer + incasso, B2B en B2C)
- Toon: Zakelijk en direct
- Kleuren: Blauw #3f68f5, Zwart #000000
- Systeem: CaseControl

## Wat al gebouwd is

### Dossiertypen (Codetabellen)
- ID 1: Pre-incasso
- ID 2: Minnelijke incasso
- ID 3: Juridische incasso
- ID 4: Debiteurenbeheer (nieuw aangemaakt)

### Vrije velden (tabblad: Incasso gegevens, sectie: Belresultaten)
- Belresultaat 1 — Dropdown — sleutel: belresultaat_1
  Opties: Geen contact, Betaald, Toezegging, Betwist, Wil regeling, Failliet, Fout nummer
- Belresultaat 2 — Dropdown — sleutel: belresultaat_2
  Opties: Geen contact, Betaald, Toezegging, Betwist, Wil regeling, Failliet, Fout nummer
- Toezegging uitkomst — Dropdown — sleutel: toezegging_uitkomst
  Opties: Betaald, Niet betaald, Deels betaald, Geen contact, Betwist

### Workflows KLAAR
1. **GeldGarant Start Workflow** (Dossier, router)
   - Splitst op case.case_type_id = 4 (Debiteurenbeheer) of Incasso
   - Per tak: Particulier / Zakelijk NL / Zakelijk Buitenland
   - Stelt rente, incassokosten, provisie, team en vervolgworkflow in
   - Verwijst naar: Standaard dossier workflow, Standaard pre-incasso workflow (placeholders)

2. **GeldGarant B2B Standaard dossier workflow** (Dossier)
   - Fase 0: Dossierfase Amicable, Email aanmaning 1, SMS aanmaning 1, Email OG
   - Conditie: Heeft emailadres? (Nee → taak gegevens controleren)
   - Fase 1: Belactie 1 (+3 werkdagen) [pauzeert]
   - Belresultaat 1 ketting: Betaald / Betwist / Failliet / Wil regeling / Toezegging / Fout nummer
   - Fase 2: Aanmaning 2 email + SMS
   - Fase 3: Belactie 2 (+3 dagen) [pauzeert]
   - Belresultaat 2 ketting: Betaald / Betwist / Failliet / Wil regeling (met OG goedkeuring) / Toezegging / Fout nummer
   - Fase 4: Sommatie email + brief (aangetekend) + dossierfase Legal + email OG
   - Fase 5: Betaald na sommatie? (+7 dagen)
     - Ja: afsluiting OG + debiteur + Declareren en sluiten
     - Nee: Betalingstoezegging? → toezegging workflow
     - Nee: Vordering > €500? → Juridische beoordeling taak / Kleine vordering taak
   - BEKEND PROBLEEM: Email check staat verkeerd in flow (2x dezelfde structuur). Bij rebuild weghalen.
   - Placeholder workflows: dispuut/regeling/toezegging wijzen nog naar verkeerde workflows — updaten zodra die gebouwd zijn

3. **GeldGarant Betalingsregeling workflow** (Betalingsregeling, trigger -2 dagen)
   - Fase 0: Herinnering email + SMS debiteur
   - Fase 1 (+3 dagen): Conditie payment_plan.is_running_behind = 1?
     - Nee: Dossier volledig betaald? Ja → afsluiting / Nee → log termijn ontvangen
     - Ja: Email + SMS gemiste termijn → Belactie achterstand (+2 werkdagen) [pauzeert]
   - Toezegging uitkomst ketting: Betaald / Betwist / Failliet
   - Laatste waarschuwing: Email + SMS
   - Na 3 dagen: Nog achter? Nee → log / Ja → Beëindiging
   - Beëindiging: Email debiteur + Email OG + Dossierfase Legal + Afbreken BTR (Hervat hoofdflow aan)

### Workflows NOG TE BOUWEN (volgorde)
4. GeldGarant Betalingstoezegging workflow (Betalingstoezegging, trigger -2 dagen)
5. GeldGarant Dispuut workflow (Dispuut)
6. GeldGarant Pre-incasso B2C workflow (Dossier)
7. GeldGarant B2C Standaard dossier workflow (Dossier)
8. GeldGarant Debiteurenbeheer B2B workflow (Dossier)
9. GeldGarant Debiteurenbeheer B2C workflow (Dossier)
10. GeldGarant Buitenland dossier workflow (Dossier)
11. GeldGarant Gerechtelijk/deurwaarder workflow (Dossier)
12. GeldGarant Faillissement workflow (Dossier)

### Templates NOG TE MAKEN
- Alle email, SMS en brief templates (na workflows klaar)
- Email HTML basisdesign in GeldGarant huisstijl (#3f68f5 blauw)

## CaseControl technische kennis

### Workflow regels
- Conditie = splitst flow in Ja/Nee tak — alles daarna zit IN die tak
- Condities alleen zinvol aan einde van tak of bij echte splitsingen
- Email/SMS actie wordt automatisch overgeslagen als geen adres bekend
- Werkdagen = aparte optie naast Dagen bij timing
- manual.condition = voor vrije velden / belresultaten

### Actie sys_ids (geverifieerd)
- 2 = Email
- 3 = SMS (via subactie "SMS bericht verzenden")
- 4 = Taak
- 5 = Wijzig team
- 7 = Wijzig rente sjabloon
- 8 = Wijzig incassokosten sjabloon
- 10 = Wijzig workflow
- 11 = Wijzig dossierfase
- 20 = Wijzig declaratie methode

### Dossierfases (exacte namen in systeem)
- Amicable (= minnelijk)
- Legal (= juridisch)
- Declareren en sluiten
- Buitengerechtelijke fase
- Onderzoek
- Juridisch

### Taak instellingen standaard
- Memo invoer verplicht: AAN
- Pauzeer de taak: AAN (bij belacties en beoordelingstaken)
- Agenda prioriteit: Hoog (belacties), Normaal (overige)
- Dossierlog type: Contact met debiteur (belacties), Aantekening (overige)

### Belresultaat 2 is strenger dan 1
- Bij belactie 2: Wil regeling = taak met OG goedkeuring vereist (niet automatisch naar regeling workflow)
- Bij belactie 1: Wil regeling = direct naar betalingsregeling workflow

## Volgende stap
Start met GeldGarant Betalingstoezegging workflow.
Maak kopie van Standaard betalingstoezegging workflow, naam: GeldGarant Betalingstoezegging workflow, verwijder bestaande stappen.

Blauwdruk Betalingstoezegging:
- Trigger: -2 dagen voor vervaldatum
- Fase 0: Wijzig dossierfase → Betalingstoezegging, Email debiteur bevestiging toezegging, Email OG toezegging ontvangen
- Fase 1 (-1 dag): Email + SMS herinnering debiteur
- Fase 2 (+1 dag na vervaldatum): Conditie case.paid = 1?
  - Ja: afsluiting betaald OG + debiteur + Declareren en sluiten
  - Nee: Taak controleer betaling + bel debiteur [pauzeert] — vul Toezegging uitkomst in
- Fase 3: Toezegging uitkomst ketting:
  - Betaald → afsluiting
  - Deels betaald → taak beoordeel restant
  - Geen contact → email laatste waarschuwing → na 2 dagen Heractiveer hoofdworkflow
  - Betwist → Wijzig workflow GeldGarant Dispuut workflow
  - Niet betaald → email laatste waarschuwing → na 2 dagen Heractiveer hoofdworkflow
