# Ontwerp e-mails en brieven (v4 "kantoor", 12 nov 2026)

## Les uit v1 tot en met v3

- v1 (SaaS-kaarten, navy blok, pil-tag) oogde goedkoop.
- v2 (wit zonder kader, cursief accent, tijdlijn, pilknoppen) oogde als een app, niet als een incassobureau.
- v3 (formeel document, één lettertype, vijf lichtgrijze vlakken onder elkaar) was netjes maar zonder elegantie:
  te veel gelijke grijze blokken, geen hiërarchie in letters, en een voorzichtige toon ("in de regel", "kan").
  Gebruiker: "lijkt goedkoop, niet bang praten maar strikt"; betalen bovenaan was wel goed.

## Doel v4

De uitstraling van een advocaten- of notarisbrief: serieus, overzichtelijk, strikt. De lezer moet in drie seconden
zien wat er speelt, hoeveel, vóór wanneer, hoe te betalen en wat er anders gebeurt, en voelen dat dit een echt
incassobureau is.

## Regels

1. Kaart van max. 600 px op #e9ecf1, 1 px rand. Bovenaan een **donkere kopbalk** (#061126) met wit logo
   (`public/mail/logo-wit.png`), rechts documentsoort in klein kapitaal en het dossiernummer; daaronder een blauwe lijn
   van 3 px.
2. **Twee letters**: Georgia (schreef) alleen voor de kop en de ondertekening "GeldGarant"; Arial voor alle tekst en
   **alle cijfers** (Georgia heeft oude-stijl-cijfers die in bedragen rommelig ogen).
3. Kop in Georgia 30/37 vet: de kernboodschap zonder cijfers ("Uw betaling is achterstallig."). Daaronder de datum.
4. **Betalen bovenaan**: één kader met donkere bovenrand, bedrag 34 px vet, "Uiterlijk op" met datum op een eigen
   regel (stapelt niet op mobiel), blauwe knop over de volle breedte, overmaken in één regel.
5. Geen grijze vlakken behalve de voettekst. Rubrieken in klein kapitaal met ruime spatiëring; blokken gescheiden door
   haarlijnen. Gevolgen als genummerde stappen (01-04, blauw), specificatie met donkere lijn boven het totaal.
6. Toon strikt en feitelijk: geen "in de regel", "kan", "mogelijk". Afsluiting "Hoogachtend,".
7. Mobiel: zijmarge 30 px, niets mag onbreekbaar breder zijn dan 290 px (geen reeksen `&nbsp;`); controleren met
   `node mails/tools/voorbeeld.mjs` en de breedte van de 375-png (moet 375 zijn).

## Opbouw formeel stuk (aanmaning)

1. Kopbalk (soort + dossier).
2. Kop, datum en "enige aanmaning, daarna sommatie en rechter".
3. Betaalblok.
4. Betreft (opdrachtgever, factuur, datum).
5. Aanhef en één alinea.
6. "Als u niet op tijd betaalt" (genummerde stappen).
7. Specificatie en regel over de ingebrekestelling.
8. Regeling of bezwaar.
9. Hoogachtend.
10. Voet (Justis, KvK, derdengelden).

## CaseControl-velden (getest 9 nov 2026, proeftemplate 263)

- Werkt: `claims.all_numbers`, `case.paid`, `case.total_amount_past_due`, `misc.today`, `debtor.name`, en de
  kant-en-klare tabellen `misc.case_original_claims_unpaid_v3` (7 kolommen) en `misc.case_cost_specification_v3`.
- Leeg buiten een lus: `claims.number`, `claims.date`, `claims.due_date`, `claims.amount_open`. Lus-syntax
  (`[[foreach.claims]]`, `[[claims]]`, `data-repeat`) werkt niet.
- Leeg: `case.debtor_reference`. `[[if]]` op bedragen is onbetrouwbaar (vergelijkt tekst).

## Livegang

`public/mail/logo-wit.png` moet op geldgarant.com staan (commit + deploy van de website) voordat een mail in v4 echt
wordt verstuurd; anders toont de kopbalk alleen de alt-tekst "GeldGarant" in wit.
