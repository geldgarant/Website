// DEB B2B 2 Sommatie, e-mail en sms (masterplan §B1, §K3, B29, B30; ontwerp v5 "brief", mails/DESIGN.md).
// Digitale tegenhanger van brieven/src/deb-b2b-2-sommatie.html: zelfde kop, tekst, termijn, bedragen en opbouw.
// Termijn 7 werkdagen vanaf dagtekening; op werkdag 8 besluit de opdrachtgever over juridische stappen (OG3, §K3).
// Ook instap vanuit debiteurenbeheer B2B (§K6): de tekst zegt daarom "eerder gevraagd", niet "onze aanmaning".
// Toon: strikt en feitelijk. Beslag alleen als bevoegdheid na een vonnis ("mag"), niet als dreiging.
const D = "{{misc.today_plus_7_business_days}}"

export default {
    onderwerp: "Sommatie dossier {{case.case_number}}: betaal uiterlijk " + D,
    preheader: "{{case.total_amount_due}} uiterlijk " + D + ". Dit is de laatste termijn. Daarna gaat de zaak naar de rechter.",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Namens", "{{creditor.name}}"],
            ["Factuur", "{{claims.all_numbers}}"],
            ["Verzonden", "per e-mail en per post"],
            ["Betalen uiterlijk", D, true],
        ]) +
        b.label("Sommatie") +
        b.h1("Wij sommeren u de vordering van {{creditor.name}} te betalen") +
        b.aanhef() +
        b.p(
            "Wij treden op namens {{creditor.name}}. U bent eerder gevraagd de factuur te betalen. Dat is niet gebeurd " +
                "en er is geen regeling afgesproken. " +
                b.sterk("Hierbij sommeren wij u het totaalbedrag uiterlijk op " + D + " te betalen.") +
                " Dit is de laatste termijn. Daarna gaat de zaak naar de rechter.",
            "0 0 20px",
        ) +
        b.betaalbalk({
            termijn: D,
            knoptekst: "Betaal nu met iDEAL",
            noot: " Deze sommatie ontvangt u ook per post. U betaalt één keer.",
        }) +
        b.stappen([
            ["Gedaan", "Betaalverzoek", "niet betaald", b.C.blauw],
            ["Nu", "Sommatie", "laatste termijn", b.C.ink],
            ["Daarna", "Rechter", "dagvaarding", b.C.lijn],
        ]) +
        b.h2("Specificatie") +
        b.specificatie([
            ["Hoofdsom", "{{case.capital_amount}}"],
            ["Wettelijke handelsrente tot en met {{misc.today}}", "{{case.interest}}"],
            ["Buitengerechtelijke incassokosten (wettelijke staffel)", "{{case.penalty_amount_incl_vat}}"],
            ["Totaal te betalen", "{{case.total_amount_due}}"],
        ]) +
        b.klein(
            "Deze sommatie is de laatste ingebrekestelling voor een gerechtelijke procedure. De rente loopt door tot " +
                "de dag van volledige betaling.",
        ) +
        b.h2("Als u niet op tijd betaalt") +
        b.gevolgen([
            "Op " + D + " verstrijkt de laatste termijn. Er volgt geen aanmaning meer.",
            "De zaak gaat naar de rechter. U ontvangt een dagvaarding van de deurwaarder.",
            "U betaalt de proceskosten en de kosten van de deurwaarder. De rente loopt door.",
            "Met een vonnis mag de deurwaarder beslag leggen, onder meer op uw bankrekening, bedrijfsmiddelen en " +
                "bedragen die anderen aan uw onderneming moeten betalen.",
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

    // Sms (optionele stap, §K3). Max. 160 tekens na invullen (sms/tools/bouw.mjs rekent met de langste waarden).
    sms: {
        naam: "GG | SMS | B2B | 2 Sommatie",
        tekst: "GeldGarant: sommatie namens {{creditor.name}}, per mail en brief. Betaal: {{case.online_payment_link}} WA 0852127388",
    },
}
