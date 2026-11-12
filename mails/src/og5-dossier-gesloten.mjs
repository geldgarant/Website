// OG5 Dossier gesloten zonder volledige betaling (masterplan §D, §K3 stap 8): retour, oninbaar, faillissement.
// Duidelijk einde. Geen bedragen die per reden verschillen (faillissement, intrekking): afrekening volgens de AV met
// een specificatie. Intrekking op verzoek van de opdrachtgever heeft een eigen bericht (OG7).
export default {
    onderwerp: "Dossier {{case.case_number}} gesloten: {{debtor.name}}",
    preheader: "Het dossier is gesloten zonder volledige betaling. Wat dit voor u betekent.",
    ontvanger: "og",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Debiteur", "{{debtor.name}}"],
            ["Hoofdsom", "{{case.capital_amount}}"],
            ["Ontvangen", "{{case.paid}}", true],
        ]) +
        b.label("Dossier gesloten") +
        b.h1("Dossier {{case.case_number}} is gesloten") +
        b.p("Hallo {{creditor.name}},") +
        b.p(
            "Wij hebben het dossier tegen {{debtor.name}} gesloten zonder dat de vordering volledig is betaald. Wij " +
                "voeren voor dit dossier geen incassohandelingen meer uit.",
            "0 0 4px",
        ) +
        b.kaarten([
            [
                "Wat u ontvangt",
                "Wat wij van de debiteur hebben ontvangen, dragen wij aan u af. U ontvangt een specificatie van wat is " +
                    "ontvangen en wat wordt verrekend, volgens onze algemene voorwaarden.",
                b.C.blauw,
            ],
            [
                "De vordering blijft van u",
                "Biedt de debiteur later toch verhaal, bijvoorbeeld een nieuw adres of inkomen? Neem dan contact met " +
                    "ons op. Wij kijken graag opnieuw met u mee.",
                b.C.ink,
            ],
        ]) +
        b.contact({ og: true }) +
        b.slot("Met vriendelijke groet,"),
}
