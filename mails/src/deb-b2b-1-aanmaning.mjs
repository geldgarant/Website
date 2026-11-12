// DEB B2B 1 Aanmaning (masterplan §B1, B28, B29; ontwerp v4 "kantoor", mails/DESIGN.md).
// Kernboodschap: de enige aanmaning; betaal uiterlijk op de datum, anders sommatie en daarna de rechter.
// Toon: strikt en feitelijk, geen voorbehouden ("in de regel", "kan"). Betalen staat bovenaan.
// Incassokosten zijn bij B2B direct verschuldigd (B28).
const D = "{{misc.today_plus_7_business_days}}";

export default {
  onderwerp: "Laatste aanmaning dossier {{case.case_number}}: betaal uiterlijk " + D,
  preheader: "{{case.total_amount_due}} uiterlijk " + D + ". Daarna volgt de sommatie en gaat de zaak naar de rechter.",
  soort: "Laatste aanmaning",
  inhoud: (b) =>
    b.h1("Uw betaling is achterstallig.") +
    b.lead("Betaal uiterlijk op " + b.sterk(D) + ". Dit is de enige aanmaning die u van ons ontvangt. " +
      "Daarna volgen de sommatie en de rechter.") +
    b.betaalblok({ termijn: D, knoptekst: "Betaal nu met iDEAL" }) +
    b.label("Betreft", "0 0 8px") +
    b.gegevens([
      ["Opdrachtgever", "{{creditor.name}}"],
      ["Factuur", "{{claims.all_numbers}}"],
      ["Datum", "{{misc.today}}"],
    ]) +
    b.aanhef() +
    b.p("Wij treden op namens {{creditor.name}}. De betaaltermijn van de factuur is verstreken en er is niet betaald. " +
      "Het volledige bedrag, inclusief rente en incassokosten, is daarmee direct opeisbaar.", "0 0 36px") +
    b.gevolgen("Als u niet op tijd betaalt", [
      "Op " + D + " verstrijkt de termijn. U ontvangt geen herinnering meer.",
      "U ontvangt een sommatie, per e-mail en per post.",
      "Blijft betaling daarna uit, dan gaat de zaak naar de rechter. De proceskosten en de kosten van de " +
        "deurwaarder komen voor uw rekening.",
      "De rente loopt door tot de dag van volledige betaling.",
    ]) +
    b.h2("Specificatie") +
    b.specificatie([
      ["Hoofdsom", "{{case.capital_amount}}"],
      ["Handelsrente tot en met {{misc.today}}", "{{case.interest}}"],
      ["Incassokosten (wettelijke staffel)", "{{case.penalty_amount_incl_vat}}"],
      ["Totaal te betalen", "{{case.total_amount_due}}"],
    ]) +
    b.klein("Deze aanmaning geldt als ingebrekestelling. Bij een zakelijke vordering zijn de wettelijke " +
      "incassokosten verschuldigd zodra de betaaltermijn is verstreken (art. 6:96 BW).") +
    b.contact({
      kop: "Regeling of bezwaar",
      tekst: "Kunt u niet in één keer betalen, of betwist u de vordering? Meld dit vóór " + D + ", met onderbouwing. " +
        "Een regeling geldt pas na onze schriftelijke bevestiging. Tot die tijd loopt de termijn door.",
    }) +
    b.slot(),
};
