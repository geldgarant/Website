import { site } from "./site"

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

// Vragen op /tarieven. Bron: AV (incassokosten 7.2, deelbetaling 7.4 en 7.8, faillissement 10.3, intrekking 7.9,
// procedure 8.1 tot 8.4) en de besluiten van Anas (provisie = WIK-staffel, geen succesfee, geen opstartkosten).
export const tarievenFaq = [
    {
        q: "Betaal ik opstartkosten of een abonnement voor incasso?",
        a: "Nee. Een incassodossier starten kost u niets en u zit nergens aan vast. Een abonnement heeft u alleen nodig als u kiest voor debiteurenbeheer.",
    },
    {
        q: "Hoe verdient GeldGarant dan aan mijn dossier?",
        a: "Aan de wettelijke incassokosten en de rente die de debiteur betaalt. Onze provisie is precies de wettelijke staffel. Een succesfee bovenop uw factuurbedrag rekenen we niet.",
    },
    {
        q: "Wat als de debiteur maar een deel betaalt?",
        a: "Wat binnenkomt gaat eerst naar de incassokosten, met een minimum van €45. De rest maken we aan u over. U kunt het dossier dan sluiten of, met uw akkoord, doorpakken via de rechter.",
    },
    {
        q: "Wat kost een gerechtelijke procedure?",
        a: "Dat hangt af van het bedrag en de rechtbank. Griffierecht en deurwaarder zijn voor uw rekening en hoort u vooraf, zodat u kunt beslissen. We vragen daarvoor een voorschot en verhalen de kosten waar mogelijk op de debiteur.",
    },
    {
        q: "Zijn de incassokosten voor een particulier anders dan voor een bedrijf?",
        a: "Nee, beide volgen de wettelijke staffel met een minimum van €40. Bij een particulier mogen ze pas worden gerekend nadat de 14-dagenbrief is verstuurd en de termijn is verlopen.",
    },
    {
        q: "Wat als ik de opdracht intrek?",
        a: "Trekt u de opdracht in nadat we gestart zijn, dan bent u de berekende incassokosten verschuldigd, met een minimum van 10% van de hoofdsom en ten minste €95.",
    },
] as const

// Vragen op /over-ons. Registratie en NowID: zie geldgarant.com/wki en /nowid (Framer). Gegevens uit site.ts.
export const overOnsFaq = [
    {
        q: "Is GeldGarant geregistreerd als incassobureau?",
        a: `Ja. GeldGarant staat ingeschreven in het incassoregister van Dienst Justis onder nummer ${site.incassoRegister}. Sinds 1 april 2024 is die registratie verplicht onder de Wet kwaliteit incassodienstverlening (Wki). Het register is openbaar, dus u kunt onze inschrijving zelf controleren.`,
    },
    {
        q: "Waar is GeldGarant gevestigd?",
        a: `Ons kantoor staat aan de ${site.street} in ${site.city}. We werken voor opdrachtgevers in heel Nederland, en vorderingen op buitenlandse debiteuren behandelen we samen met lokale partners.`,
    },
    {
        q: "Hoe gaat GeldGarant om met mijn klanten?",
        a: "Zakelijk, correct en volgens de wet. We zijn duidelijk over wat er openstaat en wat de gevolgen zijn, maar we zoeken eerst naar een oplossing die werkt. Zo blijft er ruimte om de relatie met uw klant te behouden als u dat wilt.",
    },
    {
        q: "Wat gebeurt er met het geld dat binnenkomt?",
        a: "De debiteur betaalt op onze derdengeldenrekening. Dat geld staat apart van ons eigen geld en dragen we wekelijks aan u af, met een specificatie per dossier.",
    },
    {
        q: "Wat als ik niet tevreden ben?",
        a: "Laat het ons eerst weten: we lossen het liefst samen op. Komen we er niet uit, dan volgt u onze klachtenregeling. Via NowID heeft u daarnaast toegang tot een onafhankelijke, erkende geschillencommissie.",
    },
    {
        q: "Kan ik langskomen op kantoor?",
        a: "Ja, op afspraak. De meeste opdrachtgevers regelen alles online en telefonisch, maar een kennismaking op kantoor plannen we graag.",
    },
] as const

// Vragen op /hoe-werkt-het. Bron: AV (rechtstreekse betaling 9.5, regeling buiten ons om 7.10, intrekking 7.9) en homeFaq.
export const hoeWerktFaq = [
    {
        q: "Hoe lang duurt een incassotraject?",
        a: "Dat hangt vooral af van de debiteur. Wie kan betalen, reageert meestal op een van de eerste brieven of telefoontjes. Bij een particulier loopt eerst de wettelijke termijn van 14 dagen. Spreken we een regeling af, dan loopt het dossier tot de laatste termijn binnen is.",
    },
    {
        q: "Kan ik ook buiten kantoortijd indienen?",
        a: `Ja, het formulier staat altijd open. Op ${site.hours} nemen we uw vordering binnen 1 uur in behandeling. Komt hij daarbuiten binnen, dan pakken we hem het eerste uur van de volgende werkdag op.`,
    },
    {
        q: "Heb ik veel facturen. Moet ik ze allemaal los indienen?",
        a: "Een paar facturen dient u gewoon een voor een in. Heeft u er structureel veel, neem dan contact op. Dan spreken we een vaste manier van aanleveren af, bijvoorbeeld via een koppeling met uw boekhoudpakket.",
    },
    {
        q: "Moet ik zelf nog contact houden met de debiteur?",
        a: "Nee, dat nemen wij over. Maak zolang het dossier loopt liever geen eigen afspraken met de debiteur: een regeling buiten ons om geldt als intrekking van de opdracht. Betaalt de debiteur toch rechtstreeks aan u, meld dat dan binnen een week.",
    },
    {
        q: "Wanneer hoor ik iets van jullie?",
        a: "U krijgt direct een bevestiging per e-mail en daarna toegang tot uw online dossier, waarin u elke stap ziet. We bellen of mailen u zelf als er een beslissing van u nodig is, bijvoorbeeld bij een betwisting of als een gang naar de rechter aan de orde is.",
    },
    {
        q: "Kan ik tussentijds stoppen?",
        a: "Ja. Trekt u de opdracht in nadat we gestart zijn, dan bent u de berekende incassokosten verschuldigd, met een minimum van 10% van de hoofdsom en ten minste €95.",
    },
] as const

// Vragen op /wki. Bronnen (nov 2026): rijksoverheid.nl (nieuws 9 feb 2024), ondernemersplein.overheid.nl
// "Regels voor incassodienstverleners", Justis, en de definitie van schuldenaar in het Besluit kwaliteit incassodienstverlening.
export const wkiFaq = [
    {
        q: "Geldt de Wki ook als mijn klant een bedrijf is?",
        a: "De Wki beschermt schuldenaren die natuurlijke personen zijn en in Nederland wonen. Dat zijn particulieren, maar vaak ook zzp’ers, eenmanszaken en vennoten van een vof, omdat zij met hun privévermogen aansprakelijk zijn. Wij werken voor al onze debiteuren volgens de Wki, dus u hoeft het onderscheid niet zelf te maken.",
    },
    {
        q: "Wat als een incassobureau niet geregistreerd is?",
        a: "Dan handelt het in strijd met de wet. Sinds 1 oktober 2026 hoeft een debiteur bovendien geen incassokosten en rente te betalen aan een incassodienstverlener die niet geregistreerd is; alleen de oorspronkelijke vordering blijft staan. Controleer daarom altijd het openbare register van Justis.",
    },
    {
        q: "Wat is de cumulatieregel van € 140?",
        a: "Betaalt een particuliere debiteur in termijnen en is de maandelijkse vordering of termijn lager dan € 266,67, dan mogen er per zes maanden maximaal € 140 aan incassokosten worden gerekend. Zo stapelen kosten bij kleine, terugkerende bedragen niet op. Wij houden daar in de berekening rekening mee.",
    },
    {
        q: "Wie houdt toezicht op incassobureaus?",
        a: "Dienst Justis beheert het register en screent een bureau voordat het wordt ingeschreven. De registratie moet elk jaar worden vernieuwd. De Inspectie Justitie en Veiligheid houdt toezicht op de kwaliteitseisen en kan handhaven.",
    },
    {
        q: "Wat kan mijn debiteur doen als hij het niet eens is met onze aanpak?",
        a: "Hij kan een klacht indienen volgens onze klachtenregeling. Komen we er samen niet uit, dan kan hij naar een onafhankelijke geschillencommissie. Wij zijn daarvoor aangesloten bij NowID.",
    },
    {
        q: "Moet ik als opdrachtgever zelf iets regelen voor de Wki?",
        a: "Niet veel. Zorg dat uw vordering klopt en dat u haar kunt onderbouwen met een factuur, opdrachtbevestiging of afspraken. De wettelijke verplichtingen in het incassotraject nemen wij voor onze rekening.",
    },
] as const

// Vragen op /nowid. Bronnen (nov 2026): nowid.org en incassoklacht.nl.
export const nowidFaq = [
    {
        q: "Is NowID een overheidsinstantie?",
        a: "Nee. NowID, de Nederlandse Orde voor Wettelijke Incassodienstverleners, is een branchevereniging. Het toezicht ligt bij Dienst Justis en de Inspectie Justitie en Veiligheid. NowID helpt aangesloten bureaus om aantoonbaar aan de wet te voldoen.",
    },
    {
        q: "Wat doet de geschillencommissie precies?",
        a: "IncassoKlacht, de geschillencommissie van NowID, behandelt klachten die niet samen met het incassobureau zijn opgelost. De commissie bestaat uit onafhankelijke leden en beoordeelt de klacht aan de hand van de Wki. Haar uitspraak is een bindend advies.",
    },
    {
        q: "Kost een klacht indienen geld?",
        a: "Voor een klacht bij IncassoKlacht geldt een vergoeding voor de behandeling. Wordt de klacht gegrond verklaard, dan moet het incassobureau dat bedrag vaak terugbetalen. De actuele bedragen staan op incassoklacht.nl.",
    },
    {
        q: "Kan ik als opdrachtgever ook een klacht indienen?",
        a: "Ja. Neem eerst contact met ons op, dan zoeken we samen naar een oplossing. Lukt dat niet, dan staat de route via IncassoKlacht ook voor opdrachtgevers open.",
    },
] as const

// Vragen op /incasso/incassokosten-berekenen. Bron: Besluit vergoeding voor buitengerechtelijke incassokosten,
// art. 6:96, 6:119, 6:119a BW. Rente: src/lib/rente.ts.
export const kostenFaq = [
    {
        q: "Wie betaalt de incassokosten?",
        a: "De debiteur, mits aan de wettelijke voorwaarden is voldaan. Schakelt u GeldGarant in en betaalt de debiteur volledig, dan betaalt u niets: de incassokosten en de rente zijn dan voor ons, uw hoofdsom krijgt u volledig.",
    },
    {
        q: "Mag ik btw rekenen over de incassokosten?",
        a: "Alleen als u de btw niet kunt verrekenen met de Belastingdienst, bijvoorbeeld omdat u btw-vrijgestelde diensten levert. Kunt u de btw wel verrekenen, dan rekent u de incassokosten zonder btw.",
    },
    {
        q: "Mag ik bij een bedrijf meer rekenen dan de staffel?",
        a: "Bij een bedrijf mag u in uw contract of algemene voorwaarden andere incassokosten afspreken, zolang ze redelijk zijn. Zonder zo'n afspraak geldt de wettelijke staffel. Bij een particulier mag u nooit meer rekenen dan de staffel.",
    },
    {
        q: "Vanaf wanneer loopt de rente?",
        a: "Bij een bedrijf geldt de wettelijke handelsrente automatisch vanaf de dag na de uiterste betaaldatum. Bij een particulier loopt de wettelijke rente vanaf het moment dat hij in verzuim is. Meestal is dat de dag na de vervaldatum, of na het verstrijken van de termijn in een aanmaning.",
    },
    {
        q: "Wat betekent rente op rente?",
        a: "Na elk vol jaar wordt de opgebouwde rente bij de hoofdsom opgeteld. Vanaf dat moment loopt de rente ook over die rente. De rekenmodule houdt daar automatisch rekening mee.",
    },
    {
        q: "Waarom is het minimum € 40?",
        a: "De wettelijke staffel kent een minimum van € 40, zodat ook bij een kleine factuur de kosten van het innen worden vergoed. Betaalt een particulier in termijnen en is de termijn kleiner dan € 266,67, dan geldt een plafond van € 140 per half jaar.",
    },
] as const

// Vragen op /incasso/incassobureau-inschakelen.
export const inschakelenFaq = [
    {
        q: "Hoe lang wacht ik voordat ik een incassobureau inschakel?",
        a: "Er is geen vaste termijn. Is de betaaltermijn verstreken en reageert uw klant niet op een herinnering, dan is het moment er. Hoe langer u wacht, hoe kleiner de kans dat de debiteur nog kan en wil betalen.",
    },
    {
        q: "Moet ik eerst zelf een aanmaning sturen?",
        a: "Dat is niet verplicht. Bij een particulier moet vóór er incassokosten mogen worden gerekend de wettelijke 14-dagenbrief zijn verstuurd. Die brief sturen wij voor u, als eerste stap.",
    },
    {
        q: "Schaadt een incassobureau mijn klantrelatie?",
        a: "Niet als het netjes gebeurt. Wij schrijven zakelijk en correct, en zoeken eerst naar een oplossing, zoals een betalingsregeling. Vaak is een brief van een onafhankelijke partij al genoeg om de factuur bovenaan de stapel te krijgen.",
    },
    {
        q: "Wat is het verschil met een deurwaarder of advocaat?",
        a: "Wij doen het minnelijke traject: aanmanen, bellen en regelingen treffen, zonder rechter. Een advocaat of deurwaarder komt pas in beeld als er gedagvaard moet worden of als er na een vonnis beslag nodig is. Dat doen we alleen met uw akkoord, en de kosten hoort u vooraf.",
    },
    {
        q: "Kost een incassobureau inschakelen mij geld?",
        a: "Bij GeldGarant niet als de debiteur volledig betaalt. Er zijn geen opstartkosten en geen abonnement. Betaalt de debiteur maar een deel, dan verrekenen we de incassokosten met wat binnenkomt, met een minimum van € 45.",
    },
    {
        q: "Kan ik een oude factuur nog laten innen?",
        a: "Meestal wel. Een vordering verjaart doorgaans na vijf jaar, bij een koop door een consument na twee jaar. Twijfelt u, dien de factuur dan in: we controleren de verjaring als eerste.",
    },
] as const

// Vragen op /incasso/wik-brief. Bron: art. 6:96 lid 6 BW, HR 25 november 2016 (ECLI:NL:HR:2016:2704),
// Aanbeveling 14-dagenbrief (rechtspraak.nl, BIK-overleg 2017).
export const wikFaq = [
    {
        q: "Moet ik ook een 14-dagenbrief sturen als mijn klant een bedrijf is?",
        a: "Nee. De 14-dagenbrief is alleen verplicht bij een consument, een particulier die niet handelt in beroep of bedrijf. Bij een bedrijf mag u incassokosten rekenen zodra het in verzuim is. Wij sturen een bedrijf wel altijd eerst een duidelijke aanmaning.",
    },
    {
        q: "Mag de 14-dagenbrief per e-mail?",
        a: "Ja, een aanmaning per e-mail kan, als u kunt aantonen dat de debiteur hem heeft ontvangen. Bij een e-mail is de ontvangstdag meestal de dag van verzending. Wij versturen de brief per post en per e-mail, zodat de debiteur hem zeker ziet.",
    },
    {
        q: "Wanneer begint de termijn van 14 dagen?",
        a: "Op de dag ná ontvangst van de brief, niet op de dagtekening en niet op de dag van verzending. Een brief die de termijn verkeerd vermeldt, ook al is het één dag te kort, geeft geen recht op incassokosten.",
    },
    {
        q: "Mag ik de 14-dagenbrief al vóór de vervaldatum sturen?",
        a: "Nee. De brief moet worden verstuurd nadat de debiteur in verzuim is, dus na het verstrijken van de betaaltermijn van de factuur. Een gewone herinnering vooraf mag altijd, maar telt niet als 14-dagenbrief.",
    },
    {
        q: "Wat als mijn 14-dagenbrief niet klopt?",
        a: "Dan zijn de incassokosten niet verschuldigd. De rechter toetst dat zelf, ook als de debiteur niet verschijnt. De hoofdsom en de rente blijven wel verschuldigd. U kunt een nieuwe, juiste brief sturen; vanaf dan loopt een nieuwe termijn.",
    },
    {
        q: "Kost het versturen van de 14-dagenbrief iets?",
        a: "De brief zelf moet voor de debiteur kosteloos zijn. Voor u als opdrachtgever kost het bij GeldGarant niets: het is de eerste stap van het incassotraject, en betaalt de debiteur volledig, dan betaalt u niets.",
    },
] as const

// Vragen op /incasso/incasso-in-het-buitenland. Basis: homeFaq (lokale partners) en EU-verordeningen
// (Europees betalingsbevel 1896/2006, Europese procedure geringe vorderingen 861/2007 tot € 5.000, Brussel I bis 1215/2012).
export const buitenlandFaq = [
    {
        q: "Wat kost incasso in het buitenland?",
        a: "Dat hangt af van het land en de vordering. U hoort vooraf wat het kost, voordat we iets doen. Waar het recht van dat land het toelaat, verhalen we de kosten op de debiteur.",
    },
    {
        q: "In welke landen kunnen jullie innen?",
        a: "Wij innen regelmatig in onze buurlanden, zoals België, Duitsland, Frankrijk en het Verenigd Koninkrijk, en werken daarnaast met partners in andere landen. Zit uw klant ergens anders, neem dan contact op; we zeggen u eerlijk of het haalbaar is.",
    },
    {
        q: "Moet ik zelf stukken laten vertalen?",
        a: "Meestal niet. Stuur de factuur, de afspraken en de correspondentie zoals u ze heeft. Wij en onze partner bekijken wat er nodig is, en een eventuele vertaling hoort u vooraf.",
    },
    {
        q: "Welk recht geldt er voor mijn vordering?",
        a: "Meestal het recht dat u in uw contract of algemene voorwaarden heeft afgesproken. Zonder afspraak bepalen Europese regels welk recht geldt. Dat bepaalt onder meer de rente en welke incassokosten u mag rekenen; wij nemen dat mee in de aanpak.",
    },
    {
        q: "Wat als mijn klant buiten de Europese Unie zit?",
        a: "Dan kan het ook, maar de EU-procedures gelden daar niet en een Nederlands vonnis werkt er niet altijd. We beoordelen eerst of het minnelijke traject kans heeft en wat een procedure ter plaatse zou kosten.",
    },
] as const
