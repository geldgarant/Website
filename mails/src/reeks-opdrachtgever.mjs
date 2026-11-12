// Opdrachtgevermails OG2, OG4, OG6, OG7 en stand van zaken juridisch (07 §D). Neutraal over kosten en fees
// (besluit gebruiker 12 nov 2026): dezelfde mail werkt bij 0% en bij een afgesproken succesfee.
const nr = ["Dossiernummer", "{{case.case_number}}", true]
const deb = ["Debiteur", "{{debtor.name}}"]
const datum = ["Datum", "{{misc.today}}"]

export default {
    stukken: {
        "og2-betaald": {
            naam: "GG | OG | 2 Betaald en afgerond",
            onderwerp: "Betaald: dossier {{case.case_number}} ({{debtor.name}}) is afgerond",
            preheader: "De debiteur heeft volledig betaald. Wij dragen af volgens de afspraken.",
            ontvanger: "og",
            inhoud: (b) =>
                b.kort({
                    og: true,
                    label: "Betaald en afgerond",
                    kop: "{{debtor.name}} heeft volledig betaald",
                    refs: [datum, nr, deb, ["Hoofdsom", "{{case.capital_amount}}"], ["Ontvangen", "{{case.paid}}", true]],
                    alineas: [
                        "Goed nieuws: de vordering is volledig betaald en het dossier is afgerond. Wij dragen het ontvangen " +
                            "bedrag aan u af volgens de afspraken. U ontvangt daarvan een specificatie.",
                    ],
                }),
        },
        "og4-informatie-nodig": {
            naam: "GG | OG | 4 Informatie nodig",
            onderwerp: "Informatie nodig voor dossier {{case.case_number}}: {{debtor.name}}",
            preheader: "Om verder te kunnen, hebben wij een antwoord of stukken van u nodig.",
            ontvanger: "og",
            inhoud: (b) =>
                b.kort({
                    og: true,
                    label: "Informatie nodig",
                    kop: "Wij hebben informatie van u nodig",
                    refs: [datum, nr, deb],
                    alineas: [
                        "Voor dit dossier hebben wij informatie van u nodig, bijvoorbeeld omdat de debiteur de vordering " +
                            "betwist of zegt rechtstreeks aan u te hebben betaald. Zolang wij uw antwoord niet hebben, staat " +
                            "het dossier in afwachting.",
                        "Bel ons op " +
                            b.sterk(b.TEL) +
                            " of antwoord op deze e-mail. Wij leggen u uit wat wij precies nodig hebben.",
                    ],
                }),
        },
        "og6-welkom-portaal": {
            naam: "GG | OG | 6 Welkom portaal",
            onderwerp: "Uw toegang tot het GeldGarant-portaal",
            preheader: "Volg uw dossiers online. Stel eerst zelf uw wachtwoord in.",
            ontvanger: "og",
            inhoud: (b) =>
                b.label("Welkom") +
                b.h1("Uw toegang tot het portaal") +
                b.p("Hallo {{external_user.name}},") +
                b.p(
                    "Er is een account voor u aangemaakt in het GeldGarant-portaal. Daar volgt u de stand van uw dossiers " +
                        "en ziet u wat er is ontvangen.",
                ) +
                b.p(
                    "Uw gebruikersnaam is " +
                        b.sterk("{{external_user.email}}") +
                        ". Om veiligheidsredenen sturen wij geen wachtwoord mee: kies op de inlogpagina voor " +
                        "‘wachtwoord vergeten’ en stel zelf een wachtwoord in.",
                    "0 0 20px",
                ) +
                b.kaarten([["Naar het portaal", b.link("{{misc.login_url}}", "{{misc.login_url}}"), b.C.blauw]], "0") +
                b.contact({ og: true }) +
                b.slot("Met vriendelijke groet,"),
        },
        "og7-intrekking": {
            naam: "GG | OG | 7 Intrekking bevestigd",
            onderwerp: "Intrekking bevestigd: dossier {{case.case_number}} ({{debtor.name}})",
            preheader: "Wij stoppen de incasso. De afrekening volgt volgens onze algemene voorwaarden.",
            ontvanger: "og",
            inhoud: (b) =>
                b.kort({
                    og: true,
                    label: "Intrekking bevestigd",
                    kop: "Wij hebben uw intrekking verwerkt",
                    refs: [datum, nr, deb, ["Hoofdsom", "{{case.capital_amount}}"]],
                    alineas: [
                        "U heeft de opdracht voor dit dossier ingetrokken. Wij stoppen de incasso en sluiten het dossier. " +
                            "De afrekening volgt volgens onze algemene voorwaarden; u ontvangt daarvan een specificatie.",
                        "Betaalt de debiteur na vandaag toch nog aan ons, dan dragen wij dat bedrag aan u af.",
                    ],
                }),
        },
        "og-juridisch-stand": {
            naam: "GG | OG | Stand van zaken juridisch",
            onderwerp: "Stand van zaken juridische procedure: dossier {{case.case_number}}",
            preheader: "Een update over de procedure tegen {{debtor.name}}.",
            ontvanger: "og",
            inhoud: (b) =>
                b.kort({
                    og: true,
                    label: "Stand van zaken",
                    kop: "Stand van zaken van de procedure",
                    refs: [datum, nr, deb, ["Openstaand", "{{case.total_amount_due}}"]],
                    alineas: [
                        "De vordering op {{debtor.name}} ligt bij de deurwaarder en de rechtbank. Wij houden u op de hoogte " +
                            "van elke stap die van u een besluit vraagt.",
                        "Wilt u tussendoor weten hoe het ervoor staat? Bel ons op " + b.sterk(b.TEL) + ".",
                    ],
                }),
        },
    },
}
