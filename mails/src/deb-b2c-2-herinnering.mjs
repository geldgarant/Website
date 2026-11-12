// DEB B2C 2 Herinnering, e-mail en sms (masterplan §B2 dag 11, §K4 stap 7; ontwerp v5 "brief").
// Grootste prikkel: kosten vermijden. Gaat alleen als er nog iets openstaat (> € 5). Geen vaste datum: de 14 dagen
// lopen vanaf ontvangst van de 14-dagenbrief (brief 268). Voorwaarde: case.total_amount_due bevat nog geen kosten.
// Toon: rustig en kort (consument, B1). Geen brief: alleen mail en sms.
export default {
    onderwerp: "Dossier {{case.case_number}}: nog enkele dagen betalen zonder extra kosten",
    preheader:
        "Nu te betalen {{case.total_amount_due}}. Na de 14 dagen komen er {{case.penalty_amount_incl_vat}} aan kosten bij.",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Namens", "{{creditor.name}}"],
            ["Factuur", "{{claims.all_numbers}}"],
            ["Betalen uiterlijk", "14 dagen na ontvangst van onze brief", true],
        ]) +
        b.label("Herinnering") +
        b.h1("Nog enkele dagen betalen zonder extra kosten") +
        b.aanhef() +
        b.p(
            "Onlangs stuurden wij u namens {{creditor.name}} een aanmaning, per post en per e-mail. Er staat nog een " +
                "bedrag open. Betaalt u binnen de 14 dagen na ontvangst van onze brief, dan betaalt u geen " +
                "incassokosten.",
            "0 0 20px",
        ) +
        b.betaalbalk({
            termijn: "binnen 14 dagen na onze brief",
            knoptekst: "Betaal nu met iDEAL",
            labelBedrag: "Nu te betalen",
        }) +
        b.kaarten([
            [
                "Betaalt u niet op tijd?",
                "Dan komen er " +
                    b.sterk("{{case.penalty_amount_incl_vat}}") +
                    " aan incassokosten bij en ontvangt u een sommatie. De wettelijke rente loopt door.",
                b.C.ink,
            ],
        ]) +
        b.h2("Kunt u niet in één keer betalen?") +
        b.p(
            "Bel of mail ons dan nu, binnen de 14 dagen. Samen kijken wij wat haalbaar is, bijvoorbeeld betalen in " +
                "delen. " +
                b.link("Regeling voorstellen", b.REGELING),
            "0",
        ) +
        b.kaarten(
            [
                [
                    "Heeft u geldzorgen?",
                    "Uw gemeente helpt gratis en vertrouwelijk met schulden. Ook Geldfit denkt met u mee: geldfit.nl " +
                        "of gratis 0800 8115. Liever eerst met ons praten? Dat kan altijd.",
                    b.C.blauw,
                ],
            ],
            "28px 0 0",
        ) +
        b.contact() +
        b.slot("Met vriendelijke groet,"),

    // Sms (§K4 stap 7). Max. 140 tekens na invullen.
    sms: {
        naam: "GG | SMS | B2C | 2 Herinnering",
        tekst:
            "GeldGarant: nog enkele dagen zonder kosten betalen aan {{creditor.name}}: {{case.online_payment_link}} " +
            "WA 0852127388",
    },
}
