// Handmatige en losse debiteurberichten (07 §G): contactverzoek (ook automatisch na 2 belmomenten zonder contact),
// betaallink na gesprek, overzicht facturen, kostenspecificatie (informatieplicht), schuldhulp, faillissement,
// buitenland (Engels) en de aankondiging van een gerechtelijke procedure (na akkoord opdrachtgever).
const nr = ["Dossiernummer", "{{case.case_number}}", true]
const namens = ["Namens", "{{creditor.name}}"]
const datum = ["Datum", "{{misc.today}}"]
const open = ["Openstaand", "{{case.total_amount_due}}", true]

export default {
    stukken: {
        "deb-contact-verzoek": {
            naam: "GG | DEB | Verzoek contact",
            onderwerp: "Graag contact over dossier {{case.case_number}}",
            preheader: "Wij hebben u niet kunnen bereiken. Bel of app ons op werkdagen.",
            inhoud: (b) =>
                b.kort({
                    label: "Verzoek om contact",
                    kop: "Wij proberen u te bereiken",
                    refs: [datum, nr, namens, open],
                    alineas: [
                        "Wij hebben u een paar keer gebeld over de openstaande vordering van {{creditor.name}}, maar konden u " +
                            "niet bereiken. Neem binnen 3 werkdagen contact met ons op, dan zoeken wij samen naar een oplossing.",
                        "Bellen of WhatsApp: " + b.sterk(b.TEL) + " (werkdagen). Liever direct betalen kan ook.",
                    ],
                    betaal: { termijn: "zo snel mogelijk", labelBedrag: "Openstaand" },
                }),
            sms: {
                naam: "GG | SMS | Verzoek contact",
                tekst:
                    "GeldGarant namens {{creditor.name}}: wij konden u niet bereiken. Bel of app ons binnen 3 werkdagen: " +
                    "0852127388",
            },
        },
        "deb-betaallink": {
            naam: "GG | DEB | Betaallink",
            onderwerp: "Uw betaallink voor dossier {{case.case_number}}",
            preheader: "Zoals besproken: hiermee betaalt u direct met iDEAL.",
            inhoud: (b) =>
                b.kort({
                    label: "Betaallink",
                    kop: "Uw betaallink, zoals besproken",
                    refs: [datum, nr, namens],
                    alineas: ["Zoals telefonisch besproken, vindt u hieronder de link om direct te betalen met iDEAL."],
                    betaal: { termijn: "zoals afgesproken", labelBedrag: "Te betalen" },
                }),
        },
        "deb-overzicht-facturen": {
            naam: "GG | DEB | Overzicht facturen",
            onderwerp: "Overzicht openstaande facturen: dossier {{case.case_number}}",
            preheader: "Op uw verzoek: de facturen die nog openstaan.",
            inhoud: (b) =>
                b.referenties([datum, nr, namens, open]) +
                b.label("Overzicht") +
                b.h1("Overzicht van de openstaande facturen") +
                b.aanhef() +
                b.p("Op uw verzoek sturen wij u het overzicht van de facturen die nog openstaan.", "0 0 12px") +
                // Tabel van CaseControl zelf (zoals in de oude template 249), los van een alinea
                `<div style="font-family:Helvetica,Arial,sans-serif; font-size:13px; line-height:19px; color:#2b3245; margin:0 0 20px;">{{misc.case_original_claims}}</div>` +
                b.betaalbalk({ termijn: "zo snel mogelijk", knoptekst: "Betaal nu met iDEAL", labelBedrag: "Openstaand" }) +
                b.contact() +
                b.slot("Met vriendelijke groet,"),
        },
        "deb-specificatie-kosten": {
            naam: "GG | DEB | Specificatie kosten",
            onderwerp: "Specificatie van de vordering: dossier {{case.case_number}}",
            preheader: "Hoofdsom, rente en incassokosten op een rij.",
            inhoud: (b) =>
                b.referenties([datum, nr, namens]) +
                b.label("Specificatie") +
                b.h1("Zo is het bedrag opgebouwd") +
                b.aanhef() +
                b.p("Op uw verzoek ziet u hieronder hoe het openstaande bedrag is opgebouwd.", "0 0 8px") +
                b.specificatie([
                    ["Hoofdsom", "{{case.capital_amount}}"],
                    ["Rente tot en met {{misc.today}}", "{{case.interest}}"],
                    ["Buitengerechtelijke incassokosten (wettelijke staffel)", "{{case.penalty_amount_incl_vat}}"],
                    ["Totaal te betalen", "{{case.total_amount_due}}"],
                ]) +
                b.klein(
                    "De incassokosten zijn berekend volgens het Besluit vergoeding voor buitengerechtelijke incassokosten " +
                        "(art. 6:96 BW). De rente loopt door tot de dag van volledige betaling.",
                ) +
                b.contact() +
                b.slot("Met vriendelijke groet,"),
        },
        "deb-schuldhulp": {
            naam: "GG | DEB | Schuldhulp",
            onderwerp: "Hulp bij geldzorgen: dossier {{case.case_number}}",
            preheader: "Zoals besproken: waar u gratis hulp krijgt.",
            inhoud: (b) =>
                b.kort({
                    label: "Hulp bij geldzorgen",
                    kop: "U hoeft dit niet alleen op te lossen",
                    refs: [datum, nr, namens],
                    alineas: [
                        "Zoals besproken sturen wij u informatie over gratis hulp bij schulden. Uw gemeente helpt gratis en " +
                            "vertrouwelijk. Ook Geldfit denkt met u mee: geldfit.nl of gratis 0800 8115.",
                        "Loopt het u boven het hoofd? Praat erover met 113 Zelfmoordpreventie, gratis via 0800 0113 of 113.nl.",
                        "Laat het ons weten als een hulpverlener uw zaken overneemt. Dan stemmen wij de vervolgstappen met " +
                            "hem of haar af.",
                    ],
                }),
        },
        "deb-faillissement": {
            naam: "GG | DEB | Faillissement ontvangen",
            onderwerp: "Melding faillissement ontvangen: dossier {{case.case_number}}",
            preheader: "Wij hebben de melding ontvangen en stoppen de incassohandelingen.",
            inhoud: (b) =>
                b.kort({
                    label: "Faillissement",
                    kop: "Wij hebben de melding van het faillissement ontvangen",
                    refs: [datum, nr, namens],
                    alineas: [
                        "Wij hebben de melding van het faillissement ontvangen. Wij stoppen de incassohandelingen tegen u. " +
                            "De vordering van {{creditor.name}} wordt bij de curator ingediend.",
                    ],
                }),
        },
        "deb-buitenland-en": {
            naam: "GG | DEB | Buitenland (EN)",
            onderwerp: "Payment demand, file {{case.case_number}}",
            preheader: "Outstanding: {{case.total_amount_due}}. Pay within 14 days.",
            inhoud: (b) =>
                b.referenties([
                    ["Date", "{{misc.today}}"],
                    ["File number", "{{case.case_number}}", true],
                    ["On behalf of", "{{creditor.name}}"],
                    ["Invoice", "{{claims.all_numbers}}"],
                ]) +
                b.label("Payment demand") +
                b.h1("Your invoice from {{creditor.name}} is overdue") +
                b.p("Dear {{debtor.name}},") +
                b.p(
                    "We act on behalf of {{creditor.name}}. The payment term of the invoice has expired and the amount " +
                        "has not been paid. Please pay the full amount within 14 days.",
                    "0 0 20px",
                ) +
                b.betaalbalk({ termijn: "within 14 days", knoptekst: "Pay now", labelBedrag: "Amount due" }) +
                b.p(
                    "Do you dispute the claim or need a payment plan? Contact us within 14 days at " +
                        b.sterk("+31 85 212 73 88") +
                        " or {{org_communication.email}}.",
                    "16px 0 0",
                ) +
                `<p style="font-family:Helvetica,Arial,sans-serif; margin:28px 0 4px; font-size:15px; line-height:24px; color:#2b3245;">Kind regards,</p>` +
                `<p style="font-family:Helvetica,Arial,sans-serif; margin:0; font-size:15px; line-height:22px; font-weight:bold; color:#061126;">GeldGarant</p>`,
        },
        "deb-aankondiging-procedure": {
            naam: "GG | DEB | Aankondiging procedure",
            onderwerp: "Aankondiging gerechtelijke procedure: dossier {{case.case_number}}",
            preheader:
                "Onze opdrachtgever laat de zaak aan de rechter voorleggen. Betaal binnen 5 werkdagen om dit te voorkomen.",
            inhoud: (b) =>
                b.kort({
                    label: "Aankondiging procedure",
                    kop: "De zaak gaat naar de rechter",
                    refs: [datum, nr, namens, open, ["Laatste moment", "{{misc.today_plus_5_business_days}}", true]],
                    alineas: [
                        "Ondanks onze aanmaning en sommatie is de vordering niet betaald. {{creditor.name}} heeft daarom " +
                            "besloten de vordering aan de rechter voor te leggen. De deurwaarder brengt u een dagvaarding.",
                        "U kunt dit nog voorkomen door het volledige bedrag uiterlijk op " +
                            b.sterk("{{misc.today_plus_5_business_days}}") +
                            " te betalen. Daarna komen ook de proceskosten en de kosten van de deurwaarder voor uw rekening.",
                    ],
                    betaal: { termijn: "{{misc.today_plus_5_business_days}}", labelBedrag: "Openstaand" },
                    groet: "Hoogachtend,",
                }),
        },
    },
}
