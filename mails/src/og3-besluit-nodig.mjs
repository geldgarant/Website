// OG3 Besluit nodig (masterplan §D, §K3 stap 7): na de sommatie nog open. Zonder keuze van de opdrachtgever kunnen
// we niet verder. Kosten bij sluiten volgens AV (niets binnen = € 0; deels = incassokosten verrekend, min. € 45, nooit
// meer dan ontvangen). Juridisch: eerst kostenopgave, pas na akkoord kosten. Opvolgtaak 5 werkdagen (§E).
export default {
    onderwerp: "Besluit nodig voor dossier {{case.case_number}}: {{debtor.name}}",
    preheader: "Na aanmaning en sommatie is niet volledig betaald. Juridisch doorzetten of sluiten?",
    ontvanger: "og",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Debiteur", "{{debtor.name}}"],
            ["Nog open", "{{case.total_amount_due}}", true],
            ["Ontvangen", "{{case.paid}}"],
        ]) +
        b.label("Besluit nodig") +
        b.h1("Juridisch doorzetten of het dossier sluiten?") +
        b.p("Hallo {{creditor.name}},") +
        b.p(
            "Wij hebben {{debtor.name}} een aanmaning en een sommatie gestuurd en de debiteur gebeld. De laatste " +
                "termijn is verstreken en de vordering is niet volledig betaald. Om verder te gaan, hebben wij uw " +
                "besluit nodig.",
            "0 0 4px",
        ) +
        b.kaarten([
            [
                "Juridisch doorzetten",
                "Wij leggen de vordering via een deurwaarder aan de rechter voor. U ontvangt eerst een opgave van de " +
                    "verwachte kosten. Pas na uw akkoord maken wij kosten.",
                b.C.ink,
            ],
            [
                "Dossier sluiten",
                "Wij stoppen de incasso. Is er niets ontvangen, dan kost dit u niets. Is er een deel ontvangen, dan " +
                    "verrekenen wij de incassokosten daarmee (minimaal € 45, nooit meer dan wat is ontvangen).",
                b.C.blauw,
            ],
        ]) +
        b.h2("Ons advies") +
        b.p(
            "Wij weten wat de debiteur heeft gezegd en of er verhaal lijkt te zijn. Wilt u ons advies voordat u " +
                "kiest? Bel ons op " +
                b.sterk(b.TEL) +
                ".",
            "0",
        ) +
        b.h2("Uw keuze doorgeven") +
        b.p(
            "Antwoord op deze e-mail met ‘doorzetten’ of ‘sluiten’, of bel ons. Horen wij binnen 5 werkdagen niets, " +
                "dan nemen wij contact met u op. " +
                b.link("Keuze mailen", "mailto:{{org_communication.email}}?subject=Besluit%20dossier%20{{case.case_number}}"),
            "0",
        ) +
        b.contact({ og: true }) +
        b.slot("Met vriendelijke groet,"),
}
