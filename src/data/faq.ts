export const homeFaq = [
    {
        q: "Wat kost incasso bij GeldGarant?",
        a: "Betaalt de debiteur volledig, dan betaalt u niets. De wettelijke incassokosten en de wettelijke rente komen voor rekening van de debiteur en zijn voor GeldGarant; uw hoofdsom krijgt u volledig. Betaalt de debiteur maar een deel, dan worden de incassokosten verrekend met wat binnenkomt, met een minimum van €45. Op de tarievenpagina staan de staffel en rekenvoorbeelden.",
    },
    {
        q: "Wat als er niets te halen valt?",
        a: "Gaat de debiteur failliet, overlijdt hij, komt hij in de schuldsanering of is een procedure naar ons oordeel niet haalbaar, dan sluiten we het dossier zonder kosten voor u. Bij een faillissement kunnen we uw vordering bij de curator indienen. Daarvoor geldt een vaste vergoeding van €115 exclusief btw, alleen als u daarvoor kiest.",
    },
    {
        q: "Kan ik ook met één factuur bij u terecht?",
        a: "Ja. Of u nu zzp’er bent met één onbetaalde factuur of een bedrijf met tientallen debiteuren: elk dossier krijgt dezelfde aanpak.",
    },
    {
        q: "Hoe snel komt u in actie?",
        a: "Op werkdagen tussen 9.00 en 17.00 nemen we uw vordering binnen 1 uur in behandeling. Komt uw vordering daarbuiten binnen, dan pakken we hem het eerste uur van de volgende werkdag op.",
    },
    {
        q: "Gaat u altijd naar de rechter?",
        a: "Nee. We starten altijd minnelijk: brieven, e-mail, sms en telefoon. Een gerechtelijke procedure starten we alleen na uw akkoord. Kosten van rechtbank of deurwaarder zijn voor u, en die hoort u vooraf.",
    },
    {
        q: "Hoe blijf ik op de hoogte?",
        a: "In uw online dossier ziet u op elk moment welke acties we hebben ondernomen, of er contact is geweest met de debiteur en of er een betalingsregeling loopt.",
    },
    {
        q: "Wanneer staat het geld op mijn rekening?",
        a: "De debiteur betaalt op onze derdengeldenrekening, gescheiden van ons eigen geld. Ontvangen bedragen dragen we wekelijks aan u af.",
    },
    {
        q: "Werkt u door heel Nederland?",
        a: "Ja. Ons kantoor staat in Deventer, onze opdrachtgevers zitten door heel Nederland. Vorderingen op buitenlandse debiteuren behandelen we samen met lokale partners.",
    },
]

// Vragen op /incasso. Bron: algemene voorwaarden (betwisting 8.1, rechtstreekse betaling 9.5,
// regeling buiten ons om 7.10, intrekking 7.9) en homeFaq. Nalopen als de AV wijzigen.
export const incassoFaq = [
    {
        q: "Moet ik zelf eerst een herinnering sturen?",
        a: "Een eigen herinnering helpt, maar is geen voorwaarde. Is uw klant een particulier, dan sturen wij eerst de wettelijke 14-dagenbrief. Pas als die termijn verstreken is, mogen er incassokosten in rekening worden gebracht.",
    },
    {
        q: "Wat als de debiteur de factuur betwist?",
        a: "Dan hoort u dat direct van ons, met het verweer van de debiteur. Samen bekijken we of het hout snijdt en wat de beste vervolgstap is. Een gerechtelijke procedure starten we alleen met uw schriftelijke akkoord.",
    },
    {
        q: "Wat als de debiteur in termijnen wil betalen?",
        a: "Dan leggen we een betalingsregeling vast. Elke termijn komt binnen op onze derdengeldenrekening en ziet u terug in uw online dossier. Ontvangen bedragen dragen we wekelijks aan u af.",
    },
    {
        q: "Wat als de debiteur rechtstreeks aan mij betaalt?",
        a: "Meld dat dan binnen een week bij ons, zodat we het dossier kunnen bijwerken. Maak zolang het dossier loopt liever geen eigen afspraken met de debiteur: een regeling buiten ons om geldt als intrekking van de opdracht.",
    },
    {
        q: "Kan ik de opdracht intrekken?",
        a: "Ja. Trekt u de opdracht in nadat we gestart zijn, dan bent u de berekende incassokosten verschuldigd, met een minimum van 10% van de hoofdsom en ten minste €95.",
    },
    {
        q: "Hoe oud mag een factuur zijn?",
        a: "Een vordering verjaart meestal na vijf jaar. Gaat het om een koop door een consument, dan al na twee jaar. Hoe eerder u indient, hoe groter de kans dat de debiteur nog kan en wil betalen.",
    },
    {
        q: "Welke stukken heb ik nodig?",
        a: "De factuur en de gegevens van de debiteur zijn genoeg om te starten. Heeft u een offerte, opdrachtbevestiging, leverbon of correspondentie, stuur die dan mee: dat maakt uw vordering sterker als de debiteur gaat twisten.",
    },
] as const

// Vragen op /debiteurenbeheer. Pakketbedragen staan in src/lib/pakketten.ts; houd de teksten daarmee gelijk.
export const debiteurenFaq = [
    {
        q: "Wat is het verschil tussen debiteurenbeheer en incasso?",
        a: "Debiteurenbeheer begint op de vervaldatum: vriendelijke herinneringen, een sms en een telefoontje, meestal in uw naam. Uw klant betaalt geen extra kosten. Incasso komt pas daarna, als uw klant niet reageert: dan schrijven we namens GeldGarant en betaalt de debiteur de wettelijke incassokosten.",
    },
    {
        q: "Wat telt als een dossier?",
        a: "Eén vervallen factuur die u bij ons aanmeldt voor opvolging. Heeft een klant drie openstaande facturen, dan zijn dat drie dossiers.",
    },
    {
        q: "Ziet mijn klant dat ik het heb uitbesteed?",
        a: "Niet als u dat niet wilt. Standaard sturen we de herinneringen in uw bedrijfsnaam en uw toon. Wilt u juist dat uw klant ziet dat er een professionele partij meekijkt, dan schrijven we namens GeldGarant.",
    },
    {
        q: "Koppelen jullie met mijn boekhoudpakket?",
        a: "Ja. We koppelen met onder meer Exact Online, Twinfield en SnelStart. Uw vervallen facturen komen dan automatisch bij ons binnen en betalingen worden direct verwerkt, zodat niemand een klant herinnert die al betaald heeft.",
    },
    {
        q: "Mogen jullie een betalingsregeling afspreken?",
        a: "Ja, binnen de grenzen die we vooraf met u afspreken, bijvoorbeeld een maximaal aantal termijnen. Wil een klant iets daarbuiten, dan overleggen we eerst met u.",
    },
    {
        q: "Wat gebeurt er als een klant toch niet betaalt?",
        a: "Na de laatste herinnering zetten we het dossier door naar incasso. Voor u kost die overstap niets extra: de wettelijke incassokosten zijn voor de debiteur. U hoeft niets opnieuw aan te leveren.",
    },
    {
        q: "Zit ik ergens aan vast?",
        a: "Nee. Elk pakket is maandelijks opzegbaar en er zijn geen opstartkosten. Groeit of krimpt uw aantal facturen, dan stapt u over naar een ander pakket.",
    },
    {
        q: "Wat als ik in een maand meer facturen heb dan mijn pakket?",
        a: "Dan betaalt u voor elk extra dossier een vast bedrag. Gebeurt dat vaker, dan rekenen we samen uit of een groter pakket voordeliger is.",
    },
] as const
