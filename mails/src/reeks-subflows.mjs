// Berichten van de subflows (07 §E en §K7): toezegging, regeling, dispuut, betaling en afsluiting.
// Velden zoals in de oude templates 133-145, 255, 256 (gecontroleerd 12 nov 2026).
const nr = ["Dossiernummer", "{{case.case_number}}", true]
const namens = ["Namens", "{{creditor.name}}"]
const datum = ["Datum", "{{misc.today}}"]

export default {
    stukken: {
        // ---- Toezegging (S-Toezegging, 1W) ----
        "deb-tz-1-bevestigd": {
            naam: "GG | DEB | TZ | 1 Toezegging bevestigd",
            onderwerp: "Bevestiging: u betaalt {{case.promised_payment_amount}} uiterlijk {{case.promised_payment_date}}",
            preheader: "Dossier {{case.case_number}}. Zo betaalt u in één keer met iDEAL.",
            inhoud: (b) =>
                b.kort({
                    label: "Betalingsafspraak",
                    kop: "Wij bevestigen uw betalingsafspraak",
                    refs: [datum, nr, namens],
                    alineas: [
                        "U heeft toegezegd " +
                            b.sterk("{{case.promised_payment_amount}}") +
                            " te betalen, uiterlijk op " +
                            b.sterk("{{case.promised_payment_date}}") +
                            ". Zolang u zich hieraan houdt, zetten wij geen vervolgstappen.",
                        "Betaalt u niet op tijd, dan vervalt de afspraak en gaat de incasso verder.",
                        "Direct betalen kan via " + b.link("deze betaallink", "{{case.online_payment_link}}") + ".",
                    ],
                }),
        },
        "deb-tz-2-morgen": {
            sms: {
                naam: "GG | SMS | TZ | 2 Morgen betalen",
                tekst:
                    "GeldGarant: morgen betaalt u {{case.promised_payment_amount}} zoals afgesproken, dossier " +
                    "{{case.case_number}}: {{case.online_payment_link}}",
            },
        },
        "deb-tz-3-niet-nagekomen": {
            naam: "GG | DEB | TZ | 3 Toezegging niet nagekomen",
            onderwerp: "Afspraak niet nagekomen: dossier {{case.case_number}}",
            preheader: "U heeft niet betaald zoals afgesproken. De incasso gaat verder.",
            inhoud: (b) =>
                b.kort({
                    label: "Afspraak niet nagekomen",
                    kop: "U heeft niet betaald zoals afgesproken",
                    refs: [datum, nr, namens, ["Nog open", "{{case.total_amount_due}}", true]],
                    alineas: [
                        "U zou uiterlijk op {{case.promised_payment_date}} {{case.promised_payment_amount}} betalen. " +
                            "Dat bedrag hebben wij niet ontvangen. De afspraak is daarmee vervallen en de incasso gaat verder.",
                        "Betaal het openstaande bedrag nu, of bel ons vandaag als er iets is misgegaan.",
                    ],
                    betaal: { termijn: "per direct", labelBedrag: "Nog open" },
                    groet: "Hoogachtend,",
                }),
            sms: {
                naam: "GG | SMS | TZ | 3 Niet nagekomen",
                tekst:
                    "GeldGarant: uw betaalafspraak voor dossier {{case.case_number}} is niet nagekomen. De incasso gaat " +
                    "verder. Betaal: {{case.online_payment_link}}",
            },
        },

        // ---- Betalingsregeling (S-Regeling, 3W) ----
        "deb-br-1-bevestigd": {
            naam: "GG | DEB | BR | 1 Regeling bevestigd",
            onderwerp: "Bevestiging betalingsregeling dossier {{case.case_number}}",
            preheader: "{{payment_plan.number_of_terms}} termijnen van {{payment_plan.next_term_due_amount}}.",
            inhoud: (b) =>
                b.kort({
                    label: "Betalingsregeling",
                    kop: "Wij bevestigen uw betalingsregeling",
                    refs: [
                        datum,
                        nr,
                        namens,
                        ["Totaal", "{{payment_plan.total_to_settle}}"],
                        ["Termijnen", "{{payment_plan.number_of_terms}} x {{payment_plan.next_term_due_amount}}"],
                        ["Eerste termijn", "{{payment_plan.next_term_due_date}}", true],
                    ],
                    alineas: [
                        "U betaalt in {{payment_plan.number_of_terms}} termijnen van " +
                            b.sterk("{{payment_plan.next_term_due_amount}}") +
                            ". De eerste termijn betaalt u uiterlijk op " +
                            b.sterk("{{payment_plan.next_term_due_date}}") +
                            ". Heeft u ons uw mobiele nummer gegeven, dan krijgt u de dag voor elke termijn een sms met een betaallink.",
                        "Betaalt u een termijn niet op tijd, dan krijgt u nog één kans. Blijft betaling daarna uit, " +
                            "dan vervalt de regeling en is het volledige restant direct opeisbaar.",
                    ],
                    betaal: {
                        bedrag: "{{payment_plan.next_term_due_amount}}",
                        termijn: "{{payment_plan.next_term_due_date}}",
                        labelBedrag: "Eerste termijn",
                        link: "{{case.next_term_due_amount_online_payment_link}}",
                    },
                }),
        },
        "deb-br-2-termijn-morgen": {
            sms: {
                naam: "GG | SMS | BR | 2 Termijn morgen",
                tekst:
                    "GeldGarant: morgen vervalt uw termijn van {{payment_plan.next_term_due_amount}}, dossier " +
                    "{{case.case_number}}: {{case.next_term_due_amount_online_payment_link}}",
            },
        },
        "deb-br-3-termijn-gemist": {
            naam: "GG | DEB | BR | 3 Termijn gemist",
            onderwerp: "Termijn gemist: dossier {{case.case_number}}",
            preheader: "Betaal de gemiste termijn binnen 7 dagen, anders vervalt de regeling.",
            inhoud: (b) =>
                b.kort({
                    label: "Termijn gemist",
                    kop: "U heeft een termijn gemist",
                    refs: [datum, nr, namens, ["Restant regeling", "{{payment_plan.current_balance}}"]],
                    alineas: [
                        "De termijn van " +
                            b.sterk("{{payment_plan.previous_term_due_amount}}") +
                            " die uiterlijk op {{payment_plan.previous_term_due_date}} betaald moest zijn, hebben wij niet " +
                            "ontvangen.",
                        "Betaal deze termijn binnen 7 dagen. Doet u dat niet, dan vervalt de regeling en is het volledige " +
                            "restant direct opeisbaar. Lukt het niet? Bel ons vandaag.",
                    ],
                    betaal: {
                        bedrag: "{{payment_plan.previous_term_due_amount}}",
                        termijn: "binnen 7 dagen",
                        labelBedrag: "Gemiste termijn",
                        link: "{{case.previous_term_due_amount_online_payment_link}}",
                    },
                }),
            sms: {
                naam: "GG | SMS | BR | 3 Termijn gemist",
                tekst:
                    "GeldGarant: termijn van {{payment_plan.previous_term_due_amount}} niet betaald. Betaal binnen 7 " +
                    "dagen, anders vervalt de regeling: {{case.previous_term_due_amount_online_payment_link}}",
            },
        },
        "deb-br-4-beeindigd": {
            naam: "GG | DEB | BR | 4 Regeling beëindigd",
            onderwerp: "Betalingsregeling beëindigd: dossier {{case.case_number}}",
            preheader: "Het volledige restant is nu direct opeisbaar.",
            inhoud: (b) =>
                b.kort({
                    label: "Regeling beëindigd",
                    kop: "Uw betalingsregeling is beëindigd",
                    refs: [datum, nr, namens, ["Nu opeisbaar", "{{case.total_amount_due}}", true]],
                    alineas: [
                        "Ondanks onze herinnering zijn de termijnen niet betaald. De betalingsregeling is daarom beëindigd. " +
                            "Het volledige restant is nu direct opeisbaar en de incasso gaat verder.",
                    ],
                    betaal: { termijn: "per direct", labelBedrag: "Nu opeisbaar" },
                    groet: "Hoogachtend,",
                }),
        },

        // ---- Dispuut (S-Dispuut, 2W) ----
        "deb-dsp-1-ontvangen": {
            naam: "GG | DEB | DSP | 1 Bezwaar ontvangen",
            onderwerp: "Uw bezwaar is ontvangen: dossier {{case.case_number}}",
            preheader: "Wij leggen uw bezwaar voor aan onze opdrachtgever. Tot de uitkomst zetten wij geen stappen.",
            inhoud: (b) =>
                b.kort({
                    label: "Bezwaar ontvangen",
                    kop: "Wij hebben uw bezwaar ontvangen",
                    refs: [datum, nr, namens],
                    alineas: [
                        "Dank voor uw reactie. Wij leggen uw bezwaar voor aan {{creditor.name}} en laten u schriftelijk weten " +
                            "wat de uitkomst is. Zolang wij uw bezwaar beoordelen, zetten wij geen vervolgstappen.",
                        "Heeft u nog stukken die uw standpunt onderbouwen? Stuur ze mee via " +
                            b.link("geldgarant.com/brief-ontvangen", b.ONEENS) +
                            ".",
                    ],
                }),
        },
        "deb-dsp-2-afgewezen": {
            naam: "GG | DEB | DSP | 2 Bezwaar afgewezen",
            onderwerp: "Uitkomst bezwaar: dossier {{case.case_number}}",
            preheader: "Uw bezwaar is beoordeeld. De vordering blijft staan.",
            inhoud: (b) =>
                b.kort({
                    label: "Uitkomst bezwaar",
                    kop: "Uw bezwaar is beoordeeld: de vordering blijft staan",
                    refs: [datum, nr, namens, ["Openstaand", "{{case.total_amount_due}}", true]],
                    alineas: [
                        "Wij hebben uw bezwaar met {{creditor.name}} beoordeeld. Uw bezwaar geeft geen grond om de vordering " +
                            "aan te passen. De incasso gaat daarom verder.",
                        "Betaal het openstaande bedrag binnen 7 dagen, of neem contact op als u een regeling wilt.",
                    ],
                    betaal: { termijn: "binnen 7 dagen", labelBedrag: "Openstaand" },
                    groet: "Hoogachtend,",
                }),
        },
        "deb-dsp-3-gehonoreerd": {
            naam: "GG | DEB | DSP | 3 Bezwaar gehonoreerd",
            onderwerp: "Uitkomst bezwaar: dossier {{case.case_number}}",
            preheader: "Uw bezwaar is gegrond verklaard.",
            inhoud: (b) =>
                b.kort({
                    label: "Uitkomst bezwaar",
                    kop: "Uw bezwaar is gegrond",
                    refs: [datum, nr, namens],
                    alineas: [
                        "Wij hebben uw bezwaar met {{creditor.name}} beoordeeld en u krijgt gelijk. Wij passen het dossier " +
                            "hierop aan. Staat er daarna nog een bedrag open, dan ontvangt u daarover apart bericht.",
                    ],
                }),
        },

        // ---- Betaling en afsluiting (S-Betaling) ----
        "deb-bet-1-deelbetaling": {
            naam: "GG | DEB | BET | 1 Deelbetaling ontvangen",
            onderwerp: "Betaling ontvangen: dossier {{case.case_number}}",
            preheader: "Ontvangen {{case.last_payment_amount}}. Nog open {{case.total_amount_due}}.",
            inhoud: (b) =>
                b.kort({
                    label: "Betaling ontvangen",
                    kop: "Wij hebben uw betaling ontvangen",
                    refs: [
                        datum,
                        nr,
                        ["Ontvangen", "{{case.last_payment_amount}}"],
                        ["Nog open", "{{case.total_amount_due}}", true],
                    ],
                    alineas: [
                        "Dank voor uw betaling van " +
                            b.sterk("{{case.last_payment_amount}}") +
                            ". Er staat nog " +
                            b.sterk("{{case.total_amount_due}}") +
                            " open. Betaal het restant, of neem contact op als u een regeling wilt.",
                    ],
                    betaal: { termijn: "zo snel mogelijk", labelBedrag: "Nog open" },
                }),
        },
        "deb-bet-2-betaald": {
            naam: "GG | DEB | BET | 2 Volledig betaald",
            onderwerp: "Volledig betaald: dossier {{case.case_number}} is afgerond",
            preheader: "Dank voor uw betaling. U hoeft niets meer te doen.",
            inhoud: (b) =>
                b.kort({
                    label: "Afgerond",
                    kop: "Dank u, het dossier is afgerond",
                    refs: [datum, nr, namens],
                    alineas: [
                        "Wij hebben het volledige bedrag ontvangen. Het dossier is daarmee afgerond en u hoeft niets meer te " +
                            "doen. U ontvangt van ons geen berichten meer over deze vordering.",
                    ],
                }),
        },
        "deb-bet-3-gesloten": {
            naam: "GG | DEB | BET | 3 Dossier gesloten",
            onderwerp: "Dossier {{case.case_number}} gesloten",
            preheader: "Wij hebben het dossier bij ons gesloten.",
            inhoud: (b) =>
                b.kort({
                    label: "Dossier gesloten",
                    kop: "Wij hebben het dossier gesloten",
                    refs: [datum, nr, namens],
                    alineas: [
                        "Wij hebben dit dossier bij ons gesloten en voeren geen incassohandelingen meer uit. Dit betekent " +
                            "niet dat de vordering is vervallen: {{creditor.name}} kan u hierover rechtstreeks benaderen.",
                    ],
                }),
        },
    },
}
