# Ontwerp e-mails en brieven

## Actueel: v5 "brief" (12 nov 2026)

De brief is leidend (opmaak v1, `brieven/src/deb-*.html`, goedgekeurd door GeldGarant); de mail is de digitale
tegenhanger, zodat debiteuren mail en brief direct als hetzelfde stuk herkennen.

- Wit briefhoofd: donker logo links (`public/mail/logo.png`), onze gegevens rechts, haarlijn. Daaronder het
  referentieblok uit de brief (datum, dossier, namens, factuur, **verzonden per e-mail en per post**, betalen uiterlijk).
- Blauw label in klein kapitaal ("Laatste aanmaning", "Sommatie") boven een kop met de naam van de opdrachtgever.
- Eén letter overal: Helvetica/Arial. Kleuren gelijk aan de brief.
- Donkere betaalbalk (bedrag, uiterlijk op, kenmerk), in de mail met de blauwe betaalknop eronder en de regel
  "ontvangt u ook per post. U betaalt één keer."
- Sommatie: voortgangsbalk Betaalverzoek, Sommatie, Rechter. Specificatie met blauwe lijn boven het totaal, genummerde
  gevolgen, "Kunt u niet in één keer betalen?", "Bent u het niet eens?", contactrij, "Hoogachtend,", kleine letters
  van de brief (Justis, derdengelden, klachtenregeling, geldzorgen) in de voet.
- Verschil met de brief: geen factuurtabel (zeven kolommen passen niet op een telefoon; factuurnummers staan in het
  referentieblok) en klikbare links. Mobiel: niets onbreekbaar breder dan de kolom; 375-png moet 375 breed zijn.
- In een brief maakt CaseControl zelf een QR-code van `{{case.online_payment_link}}`; in een mail is het een link.

## Eerder: v4 "kantoor" (12 nov 2026, vervangen door v5)

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
