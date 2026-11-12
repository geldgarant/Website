// DEB B2C 1 14-dagenbrief, e-mail en sms (masterplan §B2, §K4; art. 6:96 lid 6 BW en Besluit BIK; ontwerp v5 "brief").
// Digitale tegenhanger van brieven/src/deb-b2c-1-14-dagenbrief.html. De brief is leidend voor de termijn: de 14 dagen
// gaan in op de dag na ontvangst van de brief (B15: verzending + 2 werkdagen). Daarom geen vaste datum.
// Voorwaarde in CaseControl: case.total_amount_due bevat nog geen incassokosten (kostensjabloon pas na 14 dagen, §K4
// stap 8); case.penalty_amount_incl_vat geeft wel het staffelbedrag. Toon: rustig en duidelijk (consument), B1.
export default {
    onderwerp: "Dossier {{case.case_number}}: betaal binnen 14 dagen zonder extra kosten",
    preheader: "Nu te betalen {{case.total_amount_due}}. Betaalt u binnen 14 dagen, dan betaalt u geen incassokosten.",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Namens", "{{creditor.name}}"],
            ["Factuur", "{{claims.all_numbers}}"],
            ["Verzonden", "per e-mail en per post"],
            ["Betalen uiterlijk", "14 dagen na ontvangst", true],
        ]) +
        b.label("Aanmaning") +
        b.h1("U kunt nog betalen zonder extra kosten") +
        b.aanhef() +
        b.p(
            "Wij treden op namens {{creditor.name}}. De betaaltermijn van de factuur is voorbij en er staat nog een " +
                "bedrag open. Wij vragen u dat bedrag te betalen.",
            "0 0 20px",
        ) +
        b.betaalbalk({
            termijn: "14 dagen na ontvangst",
            knoptekst: "Betaal nu met iDEAL",
            noot: " Deze aanmaning ontvangt u ook per post. U betaalt één keer.",
            labelBedrag: "Nu te betalen",
        }) +
        b.kaarten([
            [
                "Betaalt u binnen 14 dagen?",
                "Dan betaalt u " +
                    b.sterk("geen incassokosten") +
                    ". De 14 dagen gaan in op de dag nadat u onze brief heeft ontvangen. Aan deze aanmaning zijn " +
                    "geen kosten verbonden.",
                b.C.blauw,
            ],
            [
                "Betaalt u niet op tijd?",
                "Dan komen er " +
                    b.sterk("{{case.penalty_amount_incl_vat}}") +
                    " aan incassokosten bij, berekend volgens de wettelijke staffel. De wettelijke rente loopt door.",
                b.C.ink,
            ],
        ]) +
        b.h2("Specificatie") +
        b.specificatie([
            ["Openstaand bedrag", "{{case.capital_amount}}"],
            ["Wettelijke rente tot en met {{misc.today}}", "{{case.interest}}"],
            ["Nu te betalen", "{{case.total_amount_due}}"],
        ]) +
        b.klein(
            "Alleen als u niet binnen 14 dagen betaalt: buitengerechtelijke incassokosten van " +
                "{{case.penalty_amount_incl_vat}} (art. 6:96 BW). De rente loopt door tot de dag van betaling.",
        ) +
        b.h2("Als u niet binnen 14 dagen betaalt") +
        b.gevolgen([
            "De incassokosten van {{case.penalty_amount_incl_vat}} komen erbij.",
            "U ontvangt een sommatie, per post en per e-mail.",
            "Blijft betaling daarna uit, dan gaat de zaak naar de rechter. De proceskosten en de kosten van de " +
                "deurwaarder komen dan ook voor uw rekening.",
            "De rente loopt door tot de dag van volledige betaling.",
        ]) +
        b.h2("Kunt u niet in één keer betalen?") +
        b.p(
            "Bel of mail ons dan binnen de 14 dagen. Samen kijken wij wat haalbaar is, bijvoorbeeld betalen in delen. " +
                "Een regeling geldt pas als wij die schriftelijk aan u hebben bevestigd. " +
                b.link("Regeling voorstellen", b.REGELING),
            "0",
        ) +
        b.h2("Klopt deze rekening niet?") +
        b.p(
            "Laat het ons dan binnen de 14 dagen weten en vertel waarom, het liefst met bewijs, zoals een " +
                "betaalbewijs of een afspraak. Wij leggen uw reactie voor aan onze opdrachtgever en laten u " +
                "schriftelijk weten wat de uitkomst is. " +
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

    // Sms (optionele stap, §K4 stap 4). Max. 160 tekens na invullen.
    sms: {
        naam: "GG | SMS | B2C | 14-dagenbrief",
        tekst: "GeldGarant: aanmaning namens {{creditor.name}}, betaal binnen 14 dagen zonder kosten: {{case.online_payment_link}}",
    },
}
