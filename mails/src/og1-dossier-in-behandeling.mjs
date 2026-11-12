// OG1 Dossier in behandeling (masterplan §D, §K1): naar de opdrachtgever bij de start (router), alle routes.
// Bevestiging, wat er gebeurt, wat we van hem vragen. Bewust neutraal over kosten (besluit gebruiker 12 nov 2026):
// dezelfde mail moet werken bij de norm 0% en bij een afgesproken succesfee (bijv. 15%). Geen tarieven, geen link.
export default {
    onderwerp: "Dossier {{case.case_number}} in behandeling: {{debtor.name}}",
    preheader: "Wij zijn gestart. Zo pakken wij het aan, en dit vragen wij van u.",
    ontvanger: "og",
    inhoud: (b) =>
        b.referenties([
            ["Datum", "{{misc.today}}"],
            ["Dossiernummer", "{{case.case_number}}", true],
            ["Debiteur", "{{debtor.name}}"],
            ["Factuur", "{{claims.all_numbers}}"],
            ["Hoofdsom", "{{case.capital_amount}}"],
        ]) +
        b.label("Dossier in behandeling") +
        b.h1("Wij zijn gestart met uw vordering op {{debtor.name}}") +
        b.p("Hallo {{creditor.name}},") +
        b.p(
            "Wij hebben uw opdracht ontvangen en het dossier is in behandeling. Hieronder ziet u wat er de komende " +
                "weken gebeurt. U hoeft niets te doen, behalve wat onder ‘Wat wij van u vragen’ staat.",
            "0 0 8px",
        ) +
        b.h2("Zo pakken wij het aan") +
        b.gevolgen([
            "De debiteur ontvangt ons eerste betaalverzoek, per post, e-mail en sms, met een directe betaallink.",
            "Wij bellen de debiteur om tot betaling of een afspraak te komen.",
            "Betaalt de debiteur niet, dan volgt een sommatie.",
            "Blijft betaling daarna uit, dan vragen wij uw besluit over juridische stappen. Zonder uw akkoord maken wij " +
                "geen proceskosten.",
        ]) +
        b.h2("Wat wij van u vragen") +
        b.p(
            "Betaalt de debiteur rechtstreeks aan u, of neemt hij contact met u op over de vordering? Meld het ons " +
                "direct, met het dossiernummer. Zo voorkomen wij onnodige stappen. Maak liever geen eigen afspraken " +
                "met de debiteur; verwijs hem naar ons.",
            "0",
        ) +
        b.contact({ og: true }) +
        b.slot("Met vriendelijke groet,"),
}
