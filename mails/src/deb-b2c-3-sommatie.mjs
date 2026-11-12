// DEB B2C 3 Sommatie, e-mail en sms (masterplan §B2, §K5; ontwerp v5 "brief").
// Digitale tegenhanger van brieven/src/deb-b2c-2-sommatie.html. Na de 14-dagenbrief: incassokosten nu verschuldigd,
// termijn 7 dagen na ontvangst (geen vaste datum). Rente art. 6:119 BW. Bij signalen van problematische schulden niet
// escaleren (handmatig, §B2). Toon: strikt maar rustig (consument).
export default {
    onderwerp: "Sommatie dossier {{case.case_number}}: betaal binnen 7 dagen",
    preheader: "{{case.total_amount_due}} binnen 7 dagen na ontvangst. Daarna gaat de zaak naar de rechter.",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Namens", "{{creditor.name}}"],
            ["Factuur", "{{claims.all_numbers}}"],
            ["Verzonden", "per e-mail en per post"],
            ["Betalen uiterlijk", "7 dagen na ontvangst", true],
        ]) +
        b.label("Sommatie") +
        b.h1("Wij sommeren u de vordering van {{creditor.name}} te betalen") +
        b.aanhef() +
        b.p(
            "Wij treden op namens {{creditor.name}}. U heeft van ons een aanmaning ontvangen met 14 dagen om zonder " +
                "extra kosten te betalen. Dat is niet gebeurd en er is geen regeling afgesproken. Daarom zijn nu ook " +
                "de incassokosten verschuldigd. " +
                b.sterk("Hierbij sommeren wij u het totaalbedrag binnen 7 dagen na ontvangst te betalen.") +
                " Daarna gaat de zaak naar de rechter.",
            "0 0 20px",
        ) +
        b.betaalbalk({
            termijn: "7 dagen na ontvangst",
            knoptekst: "Betaal nu met iDEAL",
            noot: " Deze sommatie ontvangt u ook per post. U betaalt één keer.",
        }) +
        b.stappen([
            ["Gedaan", "Aanmaning", "14 dagen zonder kosten", b.C.blauw],
            ["Nu", "Sommatie", "laatste termijn", b.C.ink],
            ["Daarna", "Rechter", "dagvaarding", b.C.lijn],
        ]) +
        b.h2("Specificatie") +
        b.specificatie([
            ["Hoofdsom", "{{case.capital_amount}}"],
            ["Wettelijke rente tot en met {{misc.today}}", "{{case.interest}}"],
            ["Buitengerechtelijke incassokosten (wettelijke staffel)", "{{case.penalty_amount_incl_vat}}"],
            ["Totaal te betalen", "{{case.total_amount_due}}"],
        ]) +
        b.klein(
            "Deze sommatie is de laatste ingebrekestelling voor een gerechtelijke procedure. De rente loopt door tot " +
                "de dag van volledige betaling.",
        ) +
        b.h2("Als u niet op tijd betaalt") +
        b.gevolgen([
            "7 dagen na ontvangst verstrijkt de laatste termijn. Er volgt geen aanmaning meer.",
            "De zaak gaat naar de rechter. U ontvangt een dagvaarding van de deurwaarder.",
            "U betaalt de proceskosten en de kosten van de deurwaarder. De rente loopt door.",
            "Met een vonnis mag de deurwaarder beslag leggen, bijvoorbeeld op uw loon of uw bankrekening.",
        ]) +
        b.h2("Kunt u niet in één keer betalen?") +
        b.p(
            "Neem dan binnen de 7 dagen contact met ons op. Samen kijken wij wat haalbaar is, bijvoorbeeld betalen in " +
                "delen. Een regeling geldt pas als wij die schriftelijk aan u hebben bevestigd. " +
                b.link("Regeling voorstellen", b.REGELING),
            "0",
        ) +
        b.h2("Klopt deze rekening niet?") +
        b.p(
            "Laat het ons dan binnen de 7 dagen weten en vertel waarom, het liefst met bewijs, zoals een betaalbewijs " +
                "of een afspraak. Wij leggen uw reactie voor aan onze opdrachtgever en laten u schriftelijk weten wat " +
                "de uitkomst is. " +
                b.link("Reactie of betaalbewijs sturen", b.ONEENS),
            "0",
        ) +
        b.kaarten(
            [
                [
                    "Heeft u geldzorgen?",
                    "U staat er niet alleen voor. Uw gemeente helpt gratis en vertrouwelijk met schulden. Ook Geldfit " +
                        "denkt met u mee: geldfit.nl of gratis 0800 8115. Liever eerst met ons praten? Dat kan altijd.",
                    b.C.blauw,
                ],
            ],
            "28px 0 0",
        ) +
        b.contact() +
        b.slot(),

    // Sms (§K5). Max. 140 tekens na invullen.
    sms: {
        naam: "GG | SMS | B2C | 3 Sommatie",
        tekst:
            "GeldGarant: sommatie namens {{creditor.name}}, betaal binnen 7 dagen: " +
            "{{case.online_payment_link}} WA 0852127388",
    },
}
