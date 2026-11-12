// Debiteurenbeheer (pakket, 07 §B3 en §K6): herinneringen namens de opdrachtgever, nog zonder incassokosten.
// Herinnering 2 noemt de overdracht aan incasso (B25: akkoord via het pakket). Zelfde mail voor B2B en B2C.
const D = "{{misc.today_plus_7_business_days}}"
const refs = [
    ["Datum", "{{misc.today}}"],
    ["Namens", "{{creditor.name}}"],
    ["Factuur", "{{claims.all_numbers}}"],
    ["Kenmerk", "{{case.case_number}}", true],
]
const oneens = (b) =>
    "Klopt de factuur niet, of heeft u al betaald? Laat het ons weten met het betaalbewijs: " +
    b.link("reactie sturen", b.ONEENS) +
    "."

export default {
    stukken: {
        "deb-db-1-herinnering": {
            naam: "GG | DEB | DB | 1 Herinnering",
            onderwerp: "Herinnering: factuur {{claims.all_numbers}} van {{creditor.name}}",
            preheader: "Nog open: {{case.total_amount_due}}. Betaal eenvoudig met iDEAL.",
            inhoud: (b) =>
                b.kort({
                    label: "Betalingsherinnering",
                    kop: "Uw factuur van {{creditor.name}} staat nog open",
                    refs,
                    alineas: [
                        "Wij verzorgen het debiteurenbeheer voor {{creditor.name}}. Volgens de administratie is de factuur " +
                            "hieronder nog niet betaald. Wilt u het bedrag uiterlijk op " +
                            b.sterk(D) +
                            " betalen?",
                        oneens(b),
                    ],
                    betaal: { termijn: D, labelBedrag: "Openstaand" },
                }),
            sms: {
                naam: "GG | SMS | DB | 1 Herinnering",
                tekst:
                    "GeldGarant namens {{creditor.name}}: uw factuur staat nog open. Betaal via " +
                    "{{case.online_payment_link}} WA 0852127388",
            },
        },
        "deb-db-2-herinnering": {
            naam: "GG | DEB | DB | 2 Herinnering",
            onderwerp: "Tweede herinnering: factuur {{claims.all_numbers}} van {{creditor.name}}",
            preheader: "Betaal uiterlijk " + D + ". Daarna wordt de vordering overgedragen voor incasso.",
            inhoud: (b) =>
                b.kort({
                    label: "Tweede herinnering",
                    kop: "Betaal nu en voorkom incassokosten",
                    refs,
                    alineas: [
                        "Wij stuurden u namens {{creditor.name}} al een herinnering, maar de factuur is nog niet betaald. " +
                            "Betaal het bedrag uiterlijk op " +
                            b.sterk(D) +
                            ".",
                        "Betaalt u niet op tijd, dan dragen wij de vordering over voor incasso. Daarna komen er " +
                            "incassokosten en rente bij, volgens de wet.",
                        oneens(b),
                    ],
                    betaal: { termijn: D, labelBedrag: "Openstaand" },
                }),
            sms: {
                naam: "GG | SMS | DB | 2 Herinnering",
                tekst:
                    "GeldGarant namens {{creditor.name}}, 2e herinnering: betaal nu en voorkom incassokosten: " +
                    "{{case.online_payment_link}}",
            },
        },
    },
}
