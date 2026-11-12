// DEB B2B 1 Aanmaning, e-mail (masterplan §B1, B28, B29, B30; ontwerp v5 "brief", mails/DESIGN.md). CaseControl 262.
// Digitale tegenhanger van brieven/src/deb-b2b-1-aanmaning.html: zelfde kop, tekst, termijn, bedragen en opbouw.
// De debiteur krijgt beide op dezelfde dag; de mail zegt dat de brief ook per post komt (en dat één betaling genoeg is).
// Toon: strikt en feitelijk. Incassokosten zijn bij B2B direct verschuldigd (B28).
const D = "{{misc.today_plus_7_business_days}}"

export default {
    onderwerp: "Laatste aanmaning dossier {{case.case_number}}: betaal uiterlijk " + D,
    preheader: "{{case.total_amount_due}} uiterlijk " + D + ". Daarna volgt de sommatie en gaat de zaak naar de rechter.",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Namens", "{{creditor.name}}"],
            ["Factuur", "{{claims.all_numbers}}"],
            ["Verzonden", "per e-mail en per post"],
            ["Betalen uiterlijk", D, true],
        ]) +
        b.label("Laatste aanmaning") +
        b.h1("Uw betaling aan {{creditor.name}} is achterstallig") +
        b.aanhef() +
        b.p(
            "Wij treden op namens {{creditor.name}}. De betaaltermijn van de factuur is verstreken en er is niet " +
                "betaald. Het volledige bedrag, inclusief rente en incassokosten, is daarmee direct opeisbaar. " +
                b.sterk("Dit is de enige aanmaning die u van ons ontvangt.") +
                " Daarna volgen de sommatie en de rechter.",
            "0 0 20px",
        ) +
        b.betaalbalk({
            termijn: D,
            knoptekst: "Betaal nu met iDEAL",
            noot: " Deze aanmaning ontvangt u ook per post. U betaalt één keer.",
        }) +
        b.h2("Specificatie") +
        b.specificatie([
            ["Hoofdsom", "{{case.capital_amount}}"],
            ["Wettelijke handelsrente tot en met {{misc.today}}", "{{case.interest}}"],
            ["Buitengerechtelijke incassokosten (wettelijke staffel)", "{{case.penalty_amount_incl_vat}}"],
            ["Totaal te betalen", "{{case.total_amount_due}}"],
        ]) +
        b.klein(
            "Deze aanmaning geldt als ingebrekestelling. Bij een zakelijke vordering zijn de wettelijke " +
                "incassokosten verschuldigd zodra de betaaltermijn is verstreken (art. 6:96 BW). De rente loopt door " +
                "tot de dag van volledige betaling.",
        ) +
        b.h2("Als u niet op tijd betaalt") +
        b.gevolgen([
            "Op " + D + " verstrijkt de termijn. U ontvangt geen herinnering meer.",
            "U ontvangt een sommatie, per post en per e-mail.",
            "Blijft betaling daarna uit, dan gaat de zaak naar de rechter. De proceskosten en de kosten van de " +
                "deurwaarder komen voor uw rekening.",
            "De rente loopt door tot de dag van volledige betaling.",
        ]) +
        b.h2("Kunt u niet in één keer betalen?") +
        b.p(
            "Neem dan vóór " +
                D +
                " contact met ons op. Wij leggen uw voorstel voor een betalingsregeling voor aan onze opdrachtgever. " +
                "Een regeling geldt pas na onze schriftelijke bevestiging. Tot die tijd loopt de termijn door. " +
                b.link("Regeling voorstellen", b.REGELING),
            "0",
        ) +
        b.h2("Bent u het niet eens met de vordering?") +
        b.p(
            "Laat ons dan vóór " +
                D +
                " schriftelijk weten waarom, met de stukken die uw standpunt onderbouwen. Wij leggen uw reactie voor " +
                "aan onze opdrachtgever en laten u schriftelijk weten wat de uitkomst is. Het deel waarover u het wel " +
                "eens bent, betaalt u binnen de termijn. " +
                b.link("Bezwaar of betaalbewijs sturen", b.ONEENS),
            "0",
        ) +
        b.contact() +
        b.slot(),

    // Sms (optionele stap, §K2 stap 4), zelfde dag als mail en brief. Max. 160 tekens na invullen.
    sms: {
        naam: "GG | SMS | B2B | Aanmaning",
        tekst: "GeldGarant: laatste aanmaning namens {{creditor.name}}, zie mail (ook spam). {{case.online_payment_link}} WA 0852127388",
    },
}
