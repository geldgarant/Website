// OG1 Opdracht ontvangen (besluit gebruiker 13 nov 2026): niet meer automatisch per dossier vanuit de router (bij
// 20 facturen = 20 mails), maar handmatig één keer per opdracht vanuit een van de dossiers. Daarom geen
// dossiergegevens, geen stappenlijst (klinkt alsof we weinig doen) en geen inloggegevens: die krijgt de opdrachtgever
// in de welkomstmail (GG | OG | 6 Welkom portaal, automatisch bij het aanmaken van de portaalgebruiker).
// Neutraal over kosten (besluit 12 nov 2026): werkt bij 0% en bij een afgesproken succesfee.
export default {
    naam: "GG | OG | 1 Opdracht ontvangen",
    onderwerp: "Wij zijn gestart met uw opdracht",
    preheader: "Volg per dossier de stand van zaken in uw portaal.",
    ontvanger: "og",
    inhoud: (b) =>
        b.label("Opdracht ontvangen") +
        b.h1("Wij zijn gestart met uw opdracht") +
        b.p("Hallo {{creditor.name}},") +
        b.p("Dank voor uw opdracht. Wij hebben de vorderingen ontvangen en zijn ermee aan de slag.") +
        b.p(
            "In uw portaal ziet u per dossier de stand van zaken, alle correspondentie en wat er is ontvangen. U logt " +
                "in met de gegevens uit onze welkomstmail.",
            "0 0 20px",
        ) +
        b.kaarten([["Naar uw portaal", b.link("geldgarant.dossierportal.nl", b.PORTAAL), b.C.blauw]], "0 0 24px") +
        b.h2("Eén verzoek") +
        b.p(
            "Betaalt een debiteur rechtstreeks aan u, of neemt hij contact met u op over de vordering? Laat het ons " +
                "weten met het dossiernummer. Zo blijft het dossier actueel en voorkomen wij onnodige stappen.",
            "0",
        ) +
        b.contact({ og: true }) +
        b.slot("Met vriendelijke groet,"),
}
