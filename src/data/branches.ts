// Inhoud per branchepagina (/branches/<slug>). Slugs en labels komen uit site.ts (bestaande URL's).
// Elke pagina heeft eigen tekst: geen "doorway pages". Juridische punten zijn algemeen en controleerbaar:
// CMR art. 32 en art. 8:1711 BW (verjaring vervoer 1 jaar), art. 6:119a lid 6 BW (grootbedrijf → mkb max. 30 dagen,
// sinds 1 juli 2022), art. 3:92 BW (eigendomsvoorbehoud), art. 3:290 BW (retentierecht), art. 7:768 BW (5%-regeling
// bouw consument), art. 3:308 BW (verjaring periodieke betalingen 5 jaar), art. 7:28 BW (consumentenkoop 2 jaar).
import type { Soort } from "../lib/rente"
import { site } from "./site"

export type BrancheIcon = "building" | "truck" | "key" | "car" | "box" | "briefcase" | "cart" | "heart" | "store" | "person"
type FeitIcon = "pin" | "map" | "shield" | "doc" | "scale" | "clock" | "calendar" | "eye" | "user" | "building" | "check"

export interface Branche {
    slug: string
    icon: BrancheIcon
    /** "de bouw", "transportbedrijven" … voor zinnen als "Incasso voor …" */
    voor: string
    /** "in de bouw", "voor zzp’ers" … voor koppen als "Belangrijk om te weten …" */
    bij: string
    title: string
    description: string
    h1: [string, string, string?] // tekst voor, accentwoord, tekst na
    lead: string
    kort: string // één zin voor het overzicht
    feiten: { icon: FeitIcon; k: string; v: string }[]
    situaties: { t: string; d: string }[]
    regels: { t: string; d: string }[]
    voorbeeld: { bedrag: number; wat: string; soort: Soort }
    faq: { q: string; a: string }[]
    verwant: string[]
    /** slug van het kennisbankartikel dat het best bij deze branche past (link in "Verder kijken") */
    kennis: string
    /** optioneel: aanpak per fase (sectie "Zo pakken we het aan"), met links naar voorbeeldbrieven */
    aanpak?: {
        kop: [string, string, string?]
        lead: string
        stappen: { t: string; d: string }[]
        brieven?: { t: string; href: string }[]
        /** label boven de kop; standaard "Onze aanpak" */
        label?: string
        /** kop boven de links; standaard "Liever eerst zelf een brief sturen?" */
        linksKop?: string
    }
}

export const brancheData: Branche[] = [
    {
        slug: "incasso-bouw",
        icon: "building",
        voor: "de bouw",
        bij: "in de bouw",
        title: "Incassobureau voor de bouw en installatie | GeldGarant",
        description:
            "Onbetaalde termijn- of meerwerkfactuur in de bouw? GeldGarant int voor aannemers, onderaannemers en installateurs. Volledig betaald? Dan betaalt u niets.",
        h1: ["Incasso voor de ", "bouw", " en installatie"],
        lead: "Termijnfacturen die blijven liggen, discussie over meerwerk of een opdrachtgever die na de oplevering stil wordt. Wij kennen de bouw en innen uw facturen zonder dat het project of de relatie eronder lijdt.",
        kort: "Termijnfacturen, meerwerk en eindafrekeningen voor aannemers en installateurs.",
        feiten: [
            { icon: "user", k: "Voor", v: "Aannemers, onderaannemers en installateurs" },
            { icon: "doc", k: "Typische factuur", v: "Termijn, meerwerk of eindafrekening" },
            { icon: "scale", k: "Let op", v: "Meerwerk schriftelijk laten akkorderen" },
            { icon: "clock", k: "Verjaring", v: "Meestal 5 jaar" },
        ],
        situaties: [
            {
                t: "De opdrachtgever betaalt de termijnen niet, maar wil wel dat u doorwerkt",
                d: "We sommeren direct en wijzen op uw recht om het werk op te schorten zolang er niet betaald is. Dat geeft druk, zonder dat u zelf het gesprek hoeft te voeren.",
            },
            {
                t: "Over het meerwerk ontstaat discussie, achteraf",
                d: "We leggen het meerwerk naast de opdracht, de mails en de werkbonnen. Is het aantoonbaar, dan vorderen we het. Is het onduidelijk, dan zeggen we dat eerlijk en zoeken we een regeling.",
            },
            {
                t: "Na de oplevering wordt een deel ingehouden vanwege opleverpunten",
                d: "Een particuliere opdrachtgever mag maximaal 5% inhouden tot de punten zijn opgelost. Wordt er meer ingehouden of blijven de punten liggen, dan vorderen we het restant.",
            },
            {
                t: "De hoofdaannemer betaalt u als onderaannemer niet door",
                d: "We benaderen de hoofdaannemer zakelijk en vasthoudend, en controleren of een grote opdrachtgever zich aan de maximale betaaltermijn van 30 dagen houdt.",
            },
        ],
        regels: [
            {
                t: "Leg meerwerk vast voordat u het uitvoert",
                d: "Een korte mail of een getekende meerwerkbon met omschrijving en prijs voorkomt de meeste discussies. Zonder akkoord moet u achteraf bewijzen dat de opdrachtgever het wilde.",
            },
            {
                t: "Bij een particulier geldt de 5%-regeling",
                d: "Een consument mag bij de laatste termijn maximaal 5% van de aanneemsom inhouden of bij de notaris laten storten. Meer inhouden mag niet zonder goede reden.",
            },
            {
                t: "U mag het werk opschorten",
                d: "Betaalt de opdrachtgever een opeisbare termijn niet, dan mag u in de regel uw werk stilleggen tot er betaald is. Kondig dat schriftelijk aan.",
            },
        ],
        voorbeeld: { bedrag: 8500, wat: "een onbetaalde meerwerkfactuur", soort: "handel" },
        faq: [
            {
                q: "Kunnen jullie ook een termijnfactuur innen terwijl het project nog loopt?",
                a: "Ja. We stemmen de toon af op de situatie: zakelijk en duidelijk, zodat het project door kan als er betaald wordt. U beslist zelf of u het werk intussen opschort.",
            },
            {
                q: "De opdrachtgever zegt dat het werk niet goed is. Wat nu?",
                a: "Dan vragen we om een concrete onderbouwing. Vage klachten zijn vaak een manier om tijd te rekken. Is er echt een gebrek, dan overleggen we met u over herstel of een regeling voor het onbetwiste deel.",
            },
            {
                q: "Werkt dit ook voor installateurs en onderaannemers?",
                a: "Ja. Of uw klant een particulier, een hoofdaannemer of een projectontwikkelaar is: we passen de aanpak aan op wie er moet betalen.",
            },
            {
                q: "Wat als de opdrachtgever failliet gaat?",
                a: "Dan sluiten we het dossier zonder kosten voor u. Wilt u, dan dienen we uw vordering bij de curator in tegen een vaste vergoeding van € 115 exclusief btw.",
            },
        ],
        verwant: ["incasso-verhuur", "incasso-groothandel", "incasso-zzp"],
        kennis: "incasso-bouwsector",
    },
    {
        slug: "incasso-transport",
        icon: "truck",
        voor: "transport en logistiek",
        bij: "in transport en logistiek",
        title: "Incasso transport en logistiek | Vrachtprijs innen | GeldGarant",
        description:
            "Onbetaalde vrachtfacturen? Let op: vorderingen uit vervoer verjaren al na één jaar. GeldGarant int voor transportbedrijven, binnen- en buitenland.",
        h1: ["Incasso voor ", "transport", " en logistiek"],
        lead: "Vrachtfacturen, wachturen en extra ritten: in transport staan de marges onder druk en telt elke openstaande factuur. Bovendien verjaren vorderingen uit vervoer al na één jaar. Wij zorgen dat uw geld op tijd binnenkomt.",
        kort: "Vrachtprijzen en wachturen innen, op tijd: vorderingen uit vervoer verjaren na één jaar.",
        feiten: [
            { icon: "user", k: "Voor", v: "Vervoerders, expediteurs en charters" },
            { icon: "clock", k: "Verjaring", v: "Meestal 1 jaar, ook voor de vrachtprijs" },
            { icon: "doc", k: "Bewijs", v: "Vrachtbrief, CMR en afleverbewijs" },
            { icon: "map", k: "Over de grens", v: "Ook buitenlandse opdrachtgevers" },
        ],
        situaties: [
            {
                t: "De opdrachtgever betaalt de vrachtfactuur pas na maanden, of helemaal niet",
                d: "We sommeren direct en houden de verjaringstermijn in de gaten. Waar nodig stuiten we de verjaring op tijd, zodat uw vordering niet vervalt.",
            },
            {
                t: "Wachturen of extra kosten worden betwist",
                d: "We leggen de afspraken, de tijdregistratie en de vrachtbrief naast elkaar. Wat aantoonbaar is, vorderen we; voor de rest zoeken we een redelijke oplossing.",
            },
            {
                t: "Een buitenlandse opdrachtgever reageert niet meer",
                d: "We pakken het op met onze partners in het land van de opdrachtgever, met één aanspreekpunt voor u in Nederland.",
            },
            {
                t: "Een vaste klant loopt structureel achter",
                d: "Met debiteurenbeheer volgen we uw facturen al op vanaf de vervaldatum, zodat achterstanden niet oplopen en de relatie goed blijft.",
            },
        ],
        regels: [
            {
                t: "Vorderingen uit vervoer verjaren na één jaar",
                d: "Voor internationaal wegvervoer (CMR) en binnenlands wegvervoer geldt meestal een verjaringstermijn van één jaar, ook voor uw vrachtprijs. Wacht dus niet te lang met incasso.",
            },
            {
                t: "Het afleverbewijs is uw sterkste bewijs",
                d: "Een getekende vrachtbrief of CMR met afleverbevestiging laat zien dat de rit is uitgevoerd. Bewaar die bij elke factuur.",
            },
            {
                t: "Grote verladers betalen binnen 30 dagen",
                d: "Is uw opdrachtgever een groot bedrijf en bent u mkb, dan mag de betaaltermijn in de regel niet langer zijn dan 30 dagen.",
            },
        ],
        voorbeeld: { bedrag: 3200, wat: "drie onbetaalde vrachtfacturen", soort: "handel" },
        faq: [
            {
                q: "Hoe lang heb ik om een vrachtfactuur te laten innen?",
                a: "Bij vervoer over de weg verjaart de vordering meestal al na één jaar. Een schriftelijke aanmaning kan de verjaring stuiten. Dien een onbetaalde vrachtfactuur daarom liefst binnen een paar maanden in.",
            },
            {
                q: "Mijn opdrachtgever zit in het buitenland. Kan dat ook?",
                a: "Ja. We werken met lokale partners en houden de regie vanuit Nederland. Op de pagina over incasso in het buitenland leest u hoe dat werkt.",
            },
            {
                q: "Kan ik de lading vasthouden tot er betaald is?",
                a: "Onder voorwaarden heeft een vervoerder een retentierecht op de lading. Of dat in uw geval verstandig is, hangt af van de situatie. Bel ons gerust voordat u die stap zet.",
            },
            {
                q: "Ik heb veel kleine facturen bij één klant. Moet ik die apart indienen?",
                a: "Nee, meerdere facturen bij dezelfde debiteur kunnen in één dossier. Bij grote aantallen spreken we een vaste manier van aanleveren af.",
            },
        ],
        verwant: ["incasso-groothandel", "incasso-mkb", "incasso-automotive"],
        kennis: "verjaringstermijnen-vorderingen",
    },
    {
        slug: "incasso-verhuur",
        icon: "key",
        voor: "verhuurders",
        bij: "bij verhuur",
        title: "Incasso voor verhuurders: huurachterstand innen | GeldGarant",
        description:
            "Huurachterstand bij een huurder? GeldGarant int voor verhuurders van woningen, bedrijfsruimte en materieel. Correct, volgens de regels en met oog voor de huurder.",
        h1: ["Incasso voor ", "verhuurders"],
        lead: "Een huurachterstand loopt elke maand verder op. Hoe eerder u ingrijpt, hoe groter de kans dat de huurder het nog kan inhalen. Wij pakken het correct en vasthoudend aan, met een regeling waar dat kan.",
        kort: "Huurachterstanden bij woningen, bedrijfsruimte en materieel, correct en vroeg aangepakt.",
        feiten: [
            { icon: "user", k: "Voor", v: "Verhuurders van woningen, bedrijfsruimte en materieel" },
            { icon: "calendar", k: "Typisch", v: "Een achterstand die elke maand groeit" },
            { icon: "scale", k: "Ontruiming", v: "Alleen via de rechter" },
            { icon: "clock", k: "Verjaring", v: "Huur: 5 jaar per termijn" },
        ],
        situaties: [
            {
                t: "De huurder loopt een of twee maanden achter",
                d: "Juist dan is snel handelen het verschil. We sturen de juiste brief, bellen de huurder en spreken waar mogelijk een haalbare regeling af.",
            },
            {
                t: "De achterstand loopt op en de huurder reageert niet",
                d: "We blijven opvolgen en adviseren u over de vervolgstappen. Een ontbinding van de huur en ontruiming lopen altijd via de rechter, en alleen met uw akkoord.",
            },
            {
                t: "Een vertrokken huurder laat een eindafrekening open",
                d: "We innen de achterstallige huur en de afgesproken kosten, ook als de huurder al ergens anders woont of zit.",
            },
            {
                t: "Een zakelijke huurder van bedrijfsruimte of materieel betaalt niet",
                d: "Bij een bedrijf gelden zakelijke regels en de wettelijke handelsrente. We treden zakelijk op en houden rekening met uw huurrelatie.",
            },
        ],
        regels: [
            {
                t: "Bij een particuliere huurder eerst de 14-dagenbrief",
                d: "Woont de huurder er als particulier, dan mag u pas incassokosten rekenen na een correcte 14-dagenbrief. Die sturen wij voor u.",
            },
            {
                t: "Ontruimen kan alleen via de rechter",
                d: "Een woning of bedrijfsruimte laten ontruimen mag nooit op eigen houtje. De kantonrechter beslist, en kijkt onder meer naar de hoogte van de achterstand.",
            },
            {
                t: "Elke huurtermijn verjaart apart",
                d: "Achterstallige huur verjaart per termijn na vijf jaar. Maar een achterstand van jaren is zelden nog in één keer te innen: begin vroeg.",
            },
        ],
        voorbeeld: { bedrag: 2850, wat: "drie maanden huurachterstand", soort: "consument" },
        faq: [
            {
                q: "Vanaf hoeveel maanden achterstand schakel ik u in?",
                a: "Liefst al bij de eerste gemiste maand. Hoe kleiner de achterstand, hoe makkelijker de huurder hem kan inhalen en hoe beter de kans dat de huur gewoon doorloopt.",
            },
            {
                q: "Kunnen jullie ook de woning laten ontruimen?",
                a: "Een ontruiming loopt via de rechter en een deurwaarder. Wij doen het minnelijke traject en regelen een procedure alleen als u dat wilt, met de kosten vooraf.",
            },
            {
                q: "Gaan jullie netjes om met mijn huurders?",
                a: "Ja. Wij werken volgens de Wet kwaliteit incassodienstverlening: duidelijk, correct en zonder dreigen. Met een huurder die wil meewerken, spreken we een regeling af.",
            },
            {
                q: "Mag ik de waarborgsom verrekenen met de huurachterstand?",
                a: "Pas aan het einde van de huur. Zolang de huurovereenkomst loopt, blijft de waarborgsom staan en int u de achterstand gewoon. Na het vertrek verrekent u de borg met wat er dan nog openstaat.",
            },
            {
                q: "Wat is het verschil tussen woonruimte en bedrijfsruimte?",
                a: "Een huurder van woonruimte is meestal een particulier: dan is eerst een 14-dagenbrief nodig en kan de huur alleen via de rechter worden ontbonden. Bij bedrijfsruimte is de huurder meestal een onderneming. Dan gelden de afspraken uit het huurcontract en de handelsrente, maar ook dan vraagt een ontruiming altijd een uitspraak van de rechter.",
            },
            {
                q: "Ik verhuur materieel of machines. Is dit ook voor mij?",
                a: "Zeker. Of het nu om een woning, een bedrijfspand of een hoogwerker gaat: een onbetaalde huurfactuur innen we op dezelfde manier.",
            },
        ],
        verwant: ["incasso-bouw", "incasso-dienstverlening", "incasso-mkb"],
        kennis: "huurachterstand-incasseren",
        // Inhoud volgt het kennisbankartikel huurachterstand-incasseren (art. 7:231 BW, 6:96 lid 6 BW)
        aanpak: {
            kop: ["Zo pakken we een ", "huurachterstand", " aan"],
            lead: "Van de eerste gemiste maand tot, als het echt niet anders kan, de kantonrechter. Bij elke stap kijken we of de huurder nog kan en wil betalen.",
            stappen: [
                {
                    t: "De eerste gemiste maand",
                    d: "We sturen een herinnering en bellen de huurder. Een gemiste maand heeft vaak een oorzaak, zoals ziekte of baanverlies. Wie dat vroeg weet, voorkomt dat de achterstand groeit.",
                },
                {
                    t: "Aanmaning of 14-dagenbrief",
                    d: "Huurt een particulier een woning, dan sturen we eerst de wettelijke 14-dagenbrief: pas daarna mogen incassokosten worden gerekend. Is de huurder een bedrijf, dan volgt direct een aanmaning en loopt de handelsrente vanaf de vervaldatum.",
                },
                {
                    t: "Een regeling die ook de lopende huur dekt",
                    d: "Kan de huurder niet alles ineens betalen, dan spreken we een haalbare regeling af. De lopende huur telt mee, en de afspraak leggen we schriftelijk vast.",
                },
                {
                    t: "Naar de rechter, alleen met uw akkoord",
                    d: "Ontbinding van de huur en ontruiming lopen altijd via de kantonrechter en een deurwaarder. Bij woonruimte en drie maanden achterstand of meer wijst de rechter ontbinding meestal toe. U hoort vooraf wat een procedure kost.",
                },
            ],
            brieven: [
                { t: "Voorbeeld aanmaning", href: "/voorbeeldbrieven/aanmaning" },
                { t: "14-dagenbrief maken", href: "/incasso/wik-brief#briefmaker" },
                { t: "Voorbeeld betalingsregeling", href: "/voorbeeldbrieven/betalingsregeling" },
            ],
        },
    },
    {
        slug: "incasso-automotive",
        icon: "car",
        voor: "automotive",
        bij: "in de autobranche",
        title: "Incasso voor garages en autobedrijven | GeldGarant",
        description:
            "Onbetaalde reparatie of onderhoud? GeldGarant int voor garages, autobedrijven en dealers, bij particulieren en bedrijven. Volledig betaald? Dan betaalt u niets.",
        h1: ["Incasso voor ", "automotive"],
        lead: "Een auto die is opgehaald zonder te betalen, een reparatie waarover achteraf discussie ontstaat of een zakelijke klant met een rij openstaande werkorders. Wij innen voor garages, autobedrijven en dealers.",
        kort: "Reparaties, onderhoud en verkoop voor garages, autobedrijven en dealers.",
        feiten: [
            { icon: "user", k: "Voor", v: "Garages, autobedrijven, dealers en schadeherstel" },
            { icon: "doc", k: "Typische factuur", v: "Reparatie, onderhoud of aanbetaling" },
            { icon: "shield", k: "Sterk punt", v: "Retentierecht op de auto" },
            { icon: "scale", k: "Let op", v: "Meerwerk vooraf laten akkorderen" },
        ],
        situaties: [
            {
                t: "De klant heeft de auto opgehaald, maar de reparatie niet betaald",
                d: "We sommeren direct, met de werkorder en de factuur als onderbouwing. Bij een particulier sturen we eerst de wettelijke 14-dagenbrief.",
            },
            {
                t: "Achteraf vindt de klant de rekening te hoog",
                d: "We kijken of het meerwerk vooraf is besproken. Was er akkoord, dan vorderen we het volledig. Zo niet, dan zoeken we een redelijke oplossing.",
            },
            {
                t: "Een zakelijke klant of leasemaatschappij betaalt traag",
                d: "We volgen alle openstaande werkorders in één dossier op, zakelijk en vasthoudend, met de wettelijke handelsrente.",
            },
            {
                t: "Een koper betaalt het restant van een auto niet",
                d: "We innen het openstaande bedrag en adviseren u over de mogelijkheden als er een eigendomsvoorbehoud is afgesproken.",
            },
        ],
        regels: [
            {
                t: "U mag de auto vasthouden tot er betaald is",
                d: "Een garage heeft een retentierecht: u mag een gerepareerde auto onder u houden tot de reparatie is betaald. Geef de auto dus niet mee zonder betaling of afspraak.",
            },
            {
                t: "Laat meerwerk vooraf akkorderen",
                d: "Bel of app de klant voordat u extra werk uitvoert en leg het akkoord vast. Dat voorkomt de meeste discussies achteraf.",
            },
            {
                t: "Particulier of bedrijf maakt verschil",
                d: "Bij een particulier mag u pas incassokosten rekenen na de 14-dagenbrief. Bij een bedrijf zodra het in verzuim is, met de wettelijke handelsrente.",
            },
        ],
        voorbeeld: { bedrag: 1480, wat: "een onbetaalde reparatie", soort: "consument" },
        faq: [
            {
                q: "De klant heeft de auto al meegenomen. Kan ik nog iets?",
                a: "Ja. Het retentierecht vervalt als u de auto vrijwillig meegeeft, maar de vordering zelf blijft gewoon bestaan. Die innen wij voor u.",
            },
            {
                q: "Werken jullie ook voor schadeherstelbedrijven?",
                a: "Ja. Ook als er discussie is met een verzekeraar over wie wat betaalt, kijken we wie de factuur verschuldigd is en innen we bij die partij.",
            },
            {
                q: "Ik heb veel kleine werkorders openstaan. Is dat de moeite waard?",
                a: "Ja. Er geldt een minimum van € 40 aan incassokosten, en die betaalt de debiteur. Voor u kost een volledig betaald dossier niets.",
            },
            {
                q: "Kan ik al mijn openstaande posten laten bewaken?",
                a: "Met debiteurenbeheer volgen we uw facturen op vanaf de vervaldatum, met herinneringen in uw eigen naam. Zo wordt een werkorder geen incassozaak.",
            },
        ],
        verwant: ["incasso-dienstverlening", "incasso-transport", "incasso-ecommerce"],
        kennis: "debiteur-betwist-factuur",
    },
    {
        slug: "incasso-groothandel",
        icon: "box",
        voor: "groothandels",
        bij: "in de groothandel",
        title: "Incasso voor groothandels en leveranciers | GeldGarant",
        description:
            "Afnemers die niet betalen? GeldGarant int voor groothandels en leveranciers, met handelsrente en oog voor uw vaste klanten. Volledig betaald? Dan betaalt u niets.",
        h1: ["Incasso voor ", "groothandels"],
        lead: "Vaste afnemers, grote volumes en vaak lange betaaltermijnen. Eén klant die stopt met betalen, raakt direct uw werkkapitaal. Wij innen zakelijk en snel, en houden rekening met de relatie.",
        kort: "Afnemers die achterlopen, met handelsrente en aandacht voor de klantrelatie.",
        feiten: [
            { icon: "user", k: "Voor", v: "Groothandels, leveranciers en producenten" },
            { icon: "doc", k: "Typisch", v: "Meerdere facturen bij één afnemer" },
            { icon: "shield", k: "Sterk punt", v: "Eigendomsvoorbehoud" },
            { icon: "scale", k: "Rente", v: "Wettelijke handelsrente" },
        ],
        situaties: [
            {
                t: "Een vaste afnemer loopt steeds verder achter",
                d: "We pakken alle openstaande facturen samen op en spreken een betalingsregeling af die past. U beslist of er intussen nog geleverd wordt.",
            },
            {
                t: "De afnemer betwist een levering",
                d: "We leggen de order, de pakbon en het afleverbewijs naast elkaar. Is de levering aantoonbaar, dan vorderen we het volledige bedrag.",
            },
            {
                t: "U vermoedt dat de afnemer in financiële problemen zit",
                d: "Dan is snelheid belangrijk. We starten direct en bekijken met u of u op grond van een eigendomsvoorbehoud geleverde goederen kunt terughalen.",
            },
            {
                t: "Een grote klant hanteert eenzijdig een lange betaaltermijn",
                d: "Bent u mkb en is uw klant een groot bedrijf, dan mag de betaaltermijn in de regel niet langer zijn dan 30 dagen. Daar wijzen we de klant op.",
            },
        ],
        regels: [
            {
                t: "Neem een eigendomsvoorbehoud op in uw voorwaarden",
                d: "Met een eigendomsvoorbehoud blijven geleverde goederen van u tot ze betaald zijn. Gaat de afnemer failliet, dan kunt u onbetaalde, nog aanwezige goederen terugvragen.",
            },
            {
                t: "De wettelijke handelsrente loopt automatisch",
                d: "Bij een zakelijke afnemer is de wettelijke handelsrente verschuldigd vanaf de dag na de vervaldatum, zonder dat u daarvoor eerst hoeft aan te manen.",
            },
            {
                t: "Houd uw kredietlimieten bij",
                d: "Wie op rekening levert, geeft krediet. Een kredietlimiet per afnemer en snel opvolgen van achterstanden voorkomt grote verliezen.",
            },
        ],
        voorbeeld: { bedrag: 12400, wat: "vier openstaande facturen bij één afnemer", soort: "handel" },
        faq: [
            {
                q: "Kunnen jullie meerdere facturen van één afnemer samen innen?",
                a: "Ja. We bundelen ze in één dossier. De incassokosten worden dan berekend over het totaal, volgens de wettelijke staffel.",
            },
            {
                q: "Wat als mijn afnemer failliet gaat?",
                a: "Dan sluiten we het dossier zonder kosten. Met een eigendomsvoorbehoud kunt u mogelijk nog aanwezige goederen terughalen, en we kunnen uw vordering bij de curator indienen tegen een vaste vergoeding van € 115 exclusief btw.",
            },
            {
                q: "Kunnen jullie aansluiten op ons boekhoudpakket?",
                a: "Ja, bij debiteurenbeheer koppelen we onder meer met Exact Online, Twinfield en SnelStart. Vervallen facturen komen dan automatisch bij ons binnen.",
            },
            {
                q: "Mijn afnemer zit in het buitenland. Kan dat ook?",
                a: "Ja. We werken met lokale partners en houden de regie vanuit Nederland, zodat u één aanspreekpunt heeft.",
            },
        ],
        verwant: ["incasso-transport", "incasso-ecommerce", "incasso-mkb"],
        kennis: "debiteur-failliet-vordering-beschermen",
    },
    {
        slug: "incasso-dienstverlening",
        icon: "briefcase",
        voor: "dienstverleners",
        bij: "in de dienstverlening",
        title: "Incasso voor dienstverleners en adviesbureaus | GeldGarant",
        description:
            "Onbetaalde uren of projectfacturen? GeldGarant int voor adviseurs, bureaus en andere dienstverleners. Zakelijk, correct en zonder kosten bij volledige betaling.",
        h1: ["Incasso voor ", "dienstverleners"],
        lead: "Bij dienstverlening levert u kennis en tijd, geen product dat u terug kunt halen. Komt de factuur niet binnen, dan is het werk al gedaan. Wij innen voor adviseurs, bureaus en andere dienstverleners.",
        kort: "Uren, projecten en abonnementen voor adviseurs, bureaus en andere dienstverleners.",
        feiten: [
            { icon: "user", k: "Voor", v: "Adviseurs, bureaus, IT en zakelijke diensten" },
            { icon: "doc", k: "Typische factuur", v: "Uren, project of abonnement" },
            { icon: "scale", k: "Let op", v: "Opdracht en uren goed vastleggen" },
            { icon: "clock", k: "Verjaring", v: "Meestal 5 jaar" },
        ],
        situaties: [
            {
                t: "De klant betwist het aantal uren",
                d: "We leggen de opdrachtbevestiging naast uw urenregistratie en de correspondentie. Wat is afgesproken en gedaan, vorderen we.",
            },
            {
                t: "Het project is af, maar de eindfactuur blijft liggen",
                d: "We sommeren zakelijk en volgen op met telefoon en e-mail, zodat de factuur bovenaan de stapel komt.",
            },
            {
                t: "Een klant zegt het abonnement op en betaalt de laatste maanden niet",
                d: "We innen wat er volgens de overeenkomst nog verschuldigd is. Bij een particuliere klant houden we rekening met de regels voor kleine, terugkerende bedragen.",
            },
            {
                t: "U wilt de relatie goed houden",
                d: "Met debiteurenbeheer sturen we herinneringen in uw eigen naam en toon. Pas als dat niet werkt, wordt het een incassodossier.",
            },
        ],
        regels: [
            {
                t: "Een opdrachtbevestiging is uw beste bewijs",
                d: "Leg vooraf vast wat u doet, tegen welk tarief en wanneer u factureert. Een bevestigende mail van de klant is al genoeg.",
            },
            {
                t: "Houd uw uren bij met omschrijving",
                d: "Een urenspecificatie per taak maakt een discussie over uren kort. Stuur hem mee met de factuur.",
            },
            {
                t: "Bij kritiek op de kwaliteit: vraag om specifiek",
                d: "Een klant die pas na de factuur klaagt, moet concreet maken wat er mis is. Vage kritiek is geen reden om niet te betalen.",
            },
        ],
        voorbeeld: { bedrag: 4600, wat: "een onbetaalde projectfactuur", soort: "handel" },
        faq: [
            {
                q: "Werkt dit ook voor IT-bedrijven en marketingbureaus?",
                a: "Ja. Iedere dienstverlener die op rekening werkt, kan bij ons terecht, van softwarebureau tot accountantskantoor.",
            },
            {
                q: "Mijn klant wil een korting omdat hij ontevreden is. Wat nu?",
                a: "We vragen om een concrete onderbouwing en overleggen met u. U bepaalt of u een korting wilt geven; wij zorgen dat de rest wordt betaald.",
            },
            {
                q: "Kan ik ook terugkerende facturen laten bewaken?",
                a: "Ja, met debiteurenbeheer. We volgen uw abonnements- en projectfacturen op vanaf de vervaldatum, met herinneringen in uw eigen naam.",
            },
            {
                q: "Wat kost het mij?",
                a: "Betaalt de klant volledig, dan niets: de wettelijke incassokosten zijn voor de debiteur. Er zijn geen opstartkosten en geen abonnement.",
            },
        ],
        verwant: ["incasso-zzp", "incasso-mkb", "incasso-zorg"],
        kennis: "creditmanagement-openstaande-facturen-voorkomen",
    },
    {
        slug: "incasso-ecommerce",
        icon: "cart",
        voor: "webshops",
        bij: "in e-commerce",
        title: "Incassobureau voor webshops en e-commerce | GeldGarant",
        description:
            "Veel kleine onbetaalde bestellingen van consumenten? GeldGarant int voor webshops, volgens de regels voor consumenten. Volledig betaald? Dan betaalt u niets.",
        h1: ["Incasso voor ", "webshops"],
        lead: "Veel bestellingen, kleine bedragen en vooral particuliere klanten. Een onbetaalde bestelling lijkt klein, maar ze tellen op. Wij innen ze efficiënt en volgens de strenge regels voor consumenten.",
        kort: "Veel kleine onbetaalde bestellingen, volgens de regels voor consumenten.",
        feiten: [
            { icon: "user", k: "Voor", v: "Webshops en online platforms" },
            { icon: "doc", k: "Typisch", v: "Veel kleine bedragen van consumenten" },
            { icon: "scale", k: "Let op", v: "Altijd eerst de 14-dagenbrief" },
            { icon: "clock", k: "Verjaring", v: "Consumentenkoop: 2 jaar" },
        ],
        situaties: [
            {
                t: "Klanten bestellen op rekening en betalen niet",
                d: "We sturen elke klant de wettelijke 14-dagenbrief en volgen daarna op per e-mail en sms. Ook bij kleine bedragen loont dat: het minimum aan incassokosten is € 40.",
            },
            {
                t: "De klant zegt het pakket nooit te hebben ontvangen",
                d: "We vragen u om het afleverbewijs of de track-and-trace en leggen dat de klant voor. Is de levering aantoonbaar, dan vorderen we de betaling.",
            },
            {
                t: "Een retour is aangekondigd, maar nooit aangekomen",
                d: "We controleren of de klant binnen de bedenktijd heeft geretourneerd. Zo niet, of is er niets aangekomen, dan blijft de betaling verschuldigd.",
            },
            {
                t: "U heeft tientallen openstaande bestellingen per maand",
                d: "We spreken een vaste manier van aanleveren af, zodat u niet elke bestelling los hoeft in te dienen.",
            },
        ],
        regels: [
            {
                t: "Bij consumenten altijd eerst de 14-dagenbrief",
                d: "Een particulier mag pas incassokosten betalen na een correcte 14-dagenbrief, met het exacte bedrag aan kosten. Fouten daarin kosten u die vergoeding.",
            },
            {
                t: "Een consumentenkoop verjaart na twee jaar",
                d: "De vordering op een consument die iets bij u kocht, verjaart al na twee jaar. Wacht dus niet te lang met openstaande bestellingen.",
            },
            {
                t: "Bewaar het afleverbewijs",
                d: "Track-and-trace of een handtekening bij levering is uw bewijs dat de klant het product heeft gekregen. Bewaar het bij elke bestelling.",
            },
        ],
        voorbeeld: { bedrag: 189, wat: "een onbetaalde bestelling", soort: "consument" },
        faq: [
            {
                q: "Is incasso de moeite waard voor kleine bedragen?",
                a: "Ja. Het wettelijke minimum aan incassokosten is € 40, ook bij een bestelling van € 30. Die kosten zijn voor de klant. Voor u kost een volledig betaald dossier niets.",
            },
            {
                q: "Mag ik incassokosten rekenen bij een abonnement in termijnen?",
                a: "Ja, maar bij kleine termijnen van een particulier geldt een plafond: is de termijn lager dan € 266,67, dan mag er per half jaar maximaal € 140 aan incassokosten worden gerekend.",
            },
            {
                q: "Gaan jullie netjes om met mijn klanten?",
                a: "Ja. We werken volgens de Wet kwaliteit incassodienstverlening: duidelijk, correct en bereikbaar. Dat beschermt ook uw reviews en uw naam.",
            },
            {
                q: "Kunnen jullie koppelen met mijn webshop of boekhouding?",
                a: "Bij debiteurenbeheer koppelen we met onder meer Exact Online, Twinfield en SnelStart. Voor een webshopplatform bekijken we samen wat mogelijk is.",
            },
        ],
        verwant: ["incasso-groothandel", "incasso-dienstverlening", "incasso-zzp"],
        kennis: "betalingsherinnering-aanmaning-wik-brief",
        // GSC (E9): "incasso e-commerce" pos 12, "incasso webshops" pos 18. Route ordent bestaande feiten van deze pagina.
        aanpak: {
            label: "Zo werkt het",
            kop: ["Van openstaande bestelling naar ", "betaald"],
            lead: "Een vaste route voor elke onbetaalde bestelling, ook als het om tientallen kleine bedragen per maand gaat.",
            stappen: [
                {
                    t: "U levert in één keer aan",
                    d: "We spreken een vaste manier van aanleveren af, zodat u niet elke bestelling los hoeft in te dienen.",
                },
                {
                    t: "De klant krijgt de 14-dagenbrief",
                    d: "Met het exacte bedrag aan incassokosten en 14 dagen om zonder die kosten te betalen. Daarna volgen we op per e-mail en sms.",
                },
                {
                    t: "Bezwaar? Dan het bewijs erbij",
                    d: "Zegt de klant dat het pakket niet aankwam of dat hij retourneerde, dan leggen we het afleverbewijs of de track-and-trace voor en controleren we de bedenktijd.",
                },
            ],
            brieven: [
                { t: "Voorbeeld betalingsherinnering", href: "/voorbeeldbrieven/betalingsherinnering" },
                { t: "14-dagenbrief maken", href: "/incasso/wik-brief#briefmaker" },
            ],
        },
    },
    {
        slug: "incasso-zorg",
        icon: "heart",
        voor: "zorgverleners",
        bij: "in de zorg",
        title: "Incasso voor zorgverleners en praktijken | GeldGarant",
        description:
            "Onbetaalde patiëntfacturen? GeldGarant int voor tandartsen, fysiotherapeuten en andere zorgverleners. Zorgvuldig, zonder medische gegevens en volgens de regels.",
        h1: ["Incasso voor de ", "zorg"],
        lead: "Patiënten die een factuur niet betalen, zijn bijna altijd particulieren. Dat vraagt om zorgvuldigheid en kennis van de regels. Wij innen voor praktijken en zorginstellingen, met respect voor de patiënt en zonder medische gegevens.",
        kort: "Patiëntfacturen voor praktijken en zorginstellingen, zorgvuldig en zonder medische gegevens.",
        feiten: [
            { icon: "user", k: "Voor", v: "Tandartsen, fysiotherapeuten, praktijken en instellingen" },
            { icon: "doc", k: "Typisch", v: "Niet vergoede zorg of eigen bijdrage" },
            { icon: "shield", k: "Privacy", v: "Geen medische gegevens nodig" },
            { icon: "scale", k: "Let op", v: "Altijd eerst de 14-dagenbrief" },
        ],
        situaties: [
            {
                t: "De patiënt dacht dat de zorgverzekeraar zou betalen",
                d: "We leggen rustig uit dat de behandeling niet of niet volledig wordt vergoed en dat de factuur bij de patiënt ligt. Vaak volgt dan een regeling.",
            },
            {
                t: "De patiënt reageert niet op herinneringen",
                d: "We sturen de wettelijke 14-dagenbrief en volgen daarna op per brief, e-mail, sms en telefoon, in een toon die past bij de zorg.",
            },
            {
                t: "De patiënt kan niet in één keer betalen",
                d: "We spreken een haalbare betalingsregeling af en bewaken de termijnen, zodat u er geen omkijken naar heeft.",
            },
            {
                t: "Uw praktijk heeft veel kleine openstaande bedragen",
                d: "Met debiteurenbeheer volgen we uw patiëntfacturen op vanaf de vervaldatum, in naam van uw praktijk.",
            },
        ],
        regels: [
            {
                t: "Deel geen medische gegevens",
                d: "Voor incasso zijn naam, adres, factuurnummer, datum en bedrag genoeg. Een diagnose of behandelinhoud hoeft er niet bij, en hoort er ook niet bij.",
            },
            {
                t: "Patiënten zijn consumenten",
                d: "Er gelden de regels voor consumenten: eerst de 14-dagenbrief, de wettelijke rente en de wettelijke staffel voor incassokosten.",
            },
            {
                t: "Wees duidelijk over vergoedingen vooraf",
                d: "Een korte melding vooraf dat een behandeling niet of gedeeltelijk wordt vergoed, voorkomt de meeste onbetaalde facturen.",
            },
        ],
        voorbeeld: { bedrag: 640, wat: "een niet vergoede behandeling", soort: "consument" },
        faq: [
            {
                q: "Welke gegevens hebben jullie van mijn patiënt nodig?",
                a: "Alleen wat nodig is om te innen: naam, adres, contactgegevens, factuurnummer, datum en bedrag. Medische gegevens hebben we niet nodig.",
            },
            {
                q: "Hoe gaan jullie om met kwetsbare patiënten?",
                a: "Zorgvuldig. We zijn duidelijk over wat er openstaat, maar zoeken eerst een oplossing. Wie hulp nodig heeft met geldzorgen, wijzen we de weg naar hulpinstanties.",
            },
            {
                q: "Ik ben een eenmanspraktijk. Is dit ook voor mij?",
                a: "Ja. Ook met één openstaande factuur kunt u bij ons terecht. Er zijn geen opstartkosten en geen abonnement.",
            },
            {
                q: "Sturen jullie de brieven in naam van mijn praktijk?",
                a: "Bij debiteurenbeheer kan dat, in uw eigen naam en toon. Bij incasso schrijven we namens GeldGarant, zodat de patiënt ziet dat er een professionele partij meekijkt.",
            },
        ],
        verwant: ["incasso-dienstverlening", "incasso-zzp", "incasso-mkb"],
        kennis: "betalingsregeling-treffen",
    },
    {
        slug: "incasso-mkb",
        icon: "store",
        voor: "het mkb",
        bij: "in het mkb",
        title: "Incassobureau voor het mkb | Binnen 1 uur gestart | GeldGarant",
        description:
            "Onbetaalde facturen drukken op uw cashflow? GeldGarant int voor mkb-bedrijven in elke branche. Binnen 1 uur gestart en geen kosten bij volledige betaling.",
        h1: ["Incasso voor ", "mkb-bedrijven"],
        lead: "In het mkb is cashflow alles. Een paar facturen die blijven liggen, kunnen al voelen in de salarisrun. Wij nemen het innen van u over, zodat u kunt doen waar u goed in bent.",
        kort: "Voor mkb-bedrijven in elke branche: snel gestart en geen kosten bij volledige betaling.",
        feiten: [
            { icon: "user", k: "Voor", v: "Mkb-bedrijven in elke branche" },
            { icon: "clock", k: "Start", v: "Op werkdagen binnen 1 uur" },
            { icon: "check", k: "Kosten", v: "€ 0 bij volledige betaling" },
            { icon: "scale", k: "Grote klanten", v: "Betaaltermijn max. 30 dagen" },
        ],
        situaties: [
            {
                t: "Een paar grote facturen houden uw cashflow vast",
                d: "We starten op werkdagen binnen een uur en volgen consequent op, zodat het geld zo snel mogelijk binnenkomt.",
            },
            {
                t: "U heeft geen tijd om zelf achter facturen aan te gaan",
                d: "Eén keer aanleveren is genoeg. Wij doen de brieven, de telefoontjes en de afspraken, en u ziet alles in uw online dossier.",
            },
            {
                t: "Een grote klant betaalt structureel te laat",
                d: "Bent u mkb en is uw klant een groot bedrijf, dan mag de betaaltermijn in de regel niet langer zijn dan 30 dagen. Daar houden we de klant aan.",
            },
            {
                t: "U wilt voorkomen dat het zover komt",
                d: "Met debiteurenbeheer bewaken we uw openstaande posten vanaf de vervaldatum, met herinneringen in uw eigen naam en een koppeling met uw boekhouding.",
            },
        ],
        regels: [
            {
                t: "Zonder afspraak is de betaaltermijn 30 dagen",
                d: "Heeft u geen betaaltermijn afgesproken, dan geldt bij een zakelijke klant een termijn van 30 dagen. Daarna loopt de wettelijke handelsrente.",
            },
            {
                t: "Grote bedrijven betalen mkb binnen 30 dagen",
                d: "Sinds 1 juli 2022 mag een groot bedrijf met een mkb-leverancier in de regel geen betaaltermijn van meer dan 30 dagen afspreken.",
            },
            {
                t: "Wacht niet te lang",
                d: "Hoe langer een factuur openstaat, hoe kleiner de kans op betaling. Na een herinnering zonder reactie is het tijd om het uit handen te geven.",
            },
        ],
        voorbeeld: { bedrag: 6000, wat: "twee onbetaalde facturen", soort: "handel" },
        faq: [
            {
                q: "Moet ik een abonnement afsluiten?",
                a: "Nee. Voor incasso betaalt u alleen als de debiteur maar een deel betaalt; bij volledige betaling betaalt u niets. Debiteurenbeheer is een maandelijks opzegbaar pakket.",
            },
            {
                q: "Kunnen jullie koppelen met onze boekhouding?",
                a: "Ja, bij debiteurenbeheer koppelen we onder meer met Exact Online, Twinfield en SnelStart.",
            },
            {
                q: "Hoe snel staat het geld op onze rekening?",
                a: "Betalingen komen binnen op onze derdengeldenrekening en dragen we wekelijks aan u af, met een specificatie per dossier.",
            },
            {
                q: "Hoe controleer ik of een incassobureau betrouwbaar is?",
                a: "Kijk of het bureau in het openbare incassoregister van Justis staat, vraag een tariefopgave voor volledige, gedeeltelijke en geen betaling, en vraag of betalingen via een aparte derdengeldenrekening lopen. Bij twijfel helpt de checklist op deze pagina.",
            },
            {
                q: "Werken jullie in onze branche?",
                a: "Waarschijnlijk wel. We werken voor ondernemers in vrijwel elke branche waar op rekening wordt geleverd. Bekijk het overzicht van branches of bel ons.",
            },
        ],
        verwant: ["incasso-zzp", "incasso-dienstverlening", "incasso-groothandel"],
        kennis: "openstaande-factuur-stappenplan",
        // Zoekintentie "incassobureau mkb": hoe kies ik een betrouwbaar bureau (checklist MKB-Nederland in de SERP).
        // Alleen feiten die elders op de site staan: register (site.ts), derdengelden, wekelijkse afdracht, NowID/IncassoKlacht,
        // tarieven volgens de AV, rechter alleen met akkoord.
        aanpak: {
            label: "Checklist",
            kop: ["Zo kiest u een ", "betrouwbaar", " incassobureau"],
            lead: "Een incassobureau treedt op namens uw bedrijf. Let daarom op deze vier punten voordat u een vordering uit handen geeft, bij ons of bij een ander.",
            stappen: [
                {
                    t: "Staat het bureau in het incassoregister?",
                    d: `Sinds 1 april 2024 moet elk incassobureau dat voor anderen int, geregistreerd zijn bij Justis. GeldGarant staat ingeschreven onder nummer ${site.incassoRegister} en is aangesloten bij NowID, met IncassoKlacht als onafhankelijke geschillencommissie.`,
                },
                {
                    t: "Weet u vooraf wat het kost?",
                    d: "Vraag wat u betaalt als de debiteur alles, een deel of niets betaalt. Bij ons: volledig betaald kost u niets, bij een deel gaan eerst de incassokosten (minimaal € 45, nooit meer dan wat binnenkomt) en valt er niets te halen, dan betaalt u niets.",
                },
                {
                    t: "Komt het geld op een derdengeldenrekening?",
                    d: `Betalingen van uw debiteuren horen gescheiden te blijven van het geld van het bureau zelf. Bij ons komen ze binnen bij de ${site.derdengelden.tenaamstelling ?? "stichting derdengelden"}, en dragen we ze wekelijks aan u af.`,
                },
                {
                    t: "Beslist u zelf over de rechter?",
                    d: "Een procedure kost tijd en geld. Bij ons gaat een dossier alleen naar de rechter als u daar vooraf akkoord op geeft.",
                },
            ],
            linksKop: "Zelf controleren?",
            brieven: [
                { t: "Onze inschrijving bij Justis", href: site.incassoRegisterHref },
                { t: "Wat de Wki van een bureau vraagt", href: "/wki" },
                { t: "Tarieven", href: "/tarieven" },
            ],
        },
    },
    {
        slug: "incasso-zzp",
        icon: "person",
        voor: "zzp’ers",
        bij: "voor zzp’ers",
        title: "Incassobureau voor zzp’ers | Ook voor één factuur | GeldGarant",
        description:
            "Klant betaalt uw factuur niet? GeldGarant int voor zzp’ers, ook bij één factuur. Geen abonnement, geen opstartkosten en bij volledige betaling betaalt u niets.",
        h1: ["Incasso voor ", "zzp’ers"],
        lead: "Als zzp’er voelt elke onbetaalde factuur direct. U wilt er geen tijd en energie meer in steken, en ook geen dure stappen zetten. Wij innen ook één factuur, zonder abonnement en zonder kosten als de klant volledig betaalt.",
        kort: "Ook voor één factuur: geen abonnement en geen kosten bij volledige betaling.",
        feiten: [
            { icon: "user", k: "Voor", v: "Zelfstandigen en freelancers" },
            { icon: "doc", k: "Vanaf", v: "Eén onbetaalde factuur" },
            { icon: "check", k: "Kosten", v: "€ 0 bij volledige betaling" },
            { icon: "scale", k: "Grote klant", v: "Betaaltermijn max. 30 dagen" },
        ],
        situaties: [
            {
                t: "Uw klant reageert niet meer op mails en telefoontjes",
                d: "Een brief van een onafhankelijke partij doet vaak wonderen. We sommeren direct en volgen op met telefoon, e-mail en sms.",
            },
            {
                t: "U wilt de klant niet kwijt, maar wel betaald worden",
                d: "We zijn zakelijk en correct, en zoeken eerst een oplossing. Zo houdt u de deur open voor een volgende opdracht.",
            },
            {
                t: "Een groot bedrijf laat u maanden wachten",
                d: "Een groot bedrijf mag een kleine leverancier in de regel niet langer dan 30 dagen laten wachten. Daar wijzen we de klant op, met de wettelijke handelsrente.",
            },
            {
                t: "Uw klant is zelf een particulier",
                d: "Dan sturen we eerst de wettelijke 14-dagenbrief, zodat de incassokosten ook echt verhaalbaar zijn.",
            },
        ],
        regels: [
            {
                t: "Leg de opdracht vast, ook als het informeel begon",
                d: "Een mail waarin de klant de opdracht en uw tarief bevestigt, is genoeg om een discussie achteraf kort te houden.",
            },
            {
                t: "Grote klanten betalen binnen 30 dagen",
                d: "Sinds 1 juli 2022 mag een groot bedrijf met een kleine leverancier in de regel geen betaaltermijn van meer dan 30 dagen afspreken.",
            },
            {
                t: "Uw factuur verjaart na vijf jaar",
                d: "Een zakelijke factuur verjaart meestal na vijf jaar. Maar hoe eerder u stappen zet, hoe groter de kans dat de klant nog betaalt.",
            },
        ],
        voorbeeld: { bedrag: 1850, wat: "een onbetaalde factuur", soort: "handel" },
        faq: [
            {
                q: "Kan ik met één factuur bij jullie terecht?",
                a: "Ja. Of het nu om € 150 of € 15.000 gaat: elk dossier krijgt dezelfde aanpak. Er zijn geen opstartkosten en geen abonnement.",
            },
            {
                q: "Wat kost het mij als zzp’er?",
                a: "Betaalt de klant volledig, dan niets: de wettelijke incassokosten zijn voor de klant. Betaalt de klant maar een deel, dan verrekenen we de incassokosten met wat binnenkomt, met een minimum van € 45.",
            },
            {
                q: "Ik heb geen schriftelijke opdracht. Kan ik toch laten innen?",
                a: "Vaak wel. Mails, appjes, offertes en eerdere betalingen laten ook zien dat er een opdracht was. Dien de factuur in, dan kijken we wat er nodig is.",
            },
            {
                q: "Mijn klant is zelf ook zzp’er. Maakt dat uit?",
                a: "Een zzp’er die als ondernemer opdracht geeft, is een zakelijke klant. Wij werken bij elke debiteur volgens de Wki, dus u hoeft daar zelf niet op te letten.",
            },
        ],
        verwant: ["incasso-dienstverlening", "incasso-mkb", "incasso-bouw"],
        kennis: "incasso-zzp",
    },
]

export const brancheBySlug = Object.fromEntries(brancheData.map((b) => [b.slug, b]))
