// Voorbeeldbrieven-bibliotheek (/voorbeeldbrieven). Eén record per brief: paginatekst, eisen, FAQ en bronnen.
// De brieftekst zelf komt uit src/lib/briefmaker.ts. De 14-dagenbrief heeft geen eigen pagina hier maar staat
// op /incasso/wik-brief (geen twee pagina's die op hetzelfde zoeken concurreren); de hub linkt daarheen.
// Bronnen alleen naar nagelopen URL's (zie CLAUDE.md, kennisbank).
import type { BriefSlug } from "../lib/briefmaker"

export interface Voorbeeldbrief {
    slug: BriefSlug
    /** Korte naam in kaarten en tijdlijn */
    naam: string
    /** Pad van de pagina */
    href: string
    /** Stap in de volgorde; 0 = op elk moment */
    stap: number
    kaart: string
    voor: string
    toon: string
    verplicht: string
    seoTitle: string
    description: string
    /** H1 in twee delen: tekst + accentwoord + rest */
    h1: [string, string, string]
    lead: string
    /** Toon de keuze zakelijk/particulier in de briefmaker */
    soortKeuze: boolean
    wanneer: string[]
    eisen: { kop: string; tekst: string }[]
    tips: string[]
    faq: { q: string; a: string }[]
    bronnen: { t: string; href: string }[]
    verwant: string[]
}

const BW6 = { t: "Burgerlijk Wetboek Boek 6", href: "https://wetten.overheid.nl/BWBR0005289/" }
const BW3 = { t: "Burgerlijk Wetboek Boek 3 (verjaring en stuiting)", href: "https://wetten.overheid.nl/BWBR0005291/" }
const BW7 = { t: "Burgerlijk Wetboek Boek 7 (huur, art. 7:231)", href: "https://wetten.overheid.nl/BWBR0005290/" }
const BIK = {
    t: "Besluit vergoeding voor buitengerechtelijke incassokosten",
    href: "https://wetten.overheid.nl/BWBR0031432/",
}

export const voorbeeldbrieven: Voorbeeldbrief[] = [
    {
        slug: "betalingsherinnering",
        naam: "Betalingsherinnering",
        href: "/voorbeeldbrieven/betalingsherinnering",
        stap: 1,
        kaart: "Vriendelijk en kort, voor de eerste dagen na de vervaldatum.",
        voor: "Zakelijk en particulier",
        toon: "Vriendelijk",
        verplicht: "Nee",
        seoTitle: "Betalingsherinnering voorbeeld: gratis brief | GeldGarant",
        description:
            "Gratis voorbeeld van een betalingsherinnering. Vul de gegevens in en download de brief als Word of pdf. Met uitleg wat erin moet en wanneer u hem stuurt.",
        h1: ["Betalingsherinnering:", "voorbeeldbrief", "om in te vullen"],
        lead: "De eerste brief na de vervaldatum. Vriendelijk, want meestal is een factuur gewoon vergeten. Vul hieronder de gegevens in en download de brief als Word of pdf.",
        soortKeuze: false,
        wanneer: [
            "Stuur de herinnering binnen een paar dagen na de vervaldatum. Hoe sneller, hoe groter de kans op betaling: een factuur die net verlopen is, heeft nog alle aandacht.",
            "Ga uit van een vergissing. Een vriendelijke herinnering met de factuur als bijlage en een duidelijke betaaltermijn is voor de meeste klanten genoeg.",
        ],
        eisen: [
            { kop: "Factuurnummer en datum", tekst: "Zodat de klant meteen ziet om welke factuur het gaat." },
            { kop: "Het openstaande bedrag", tekst: "Het bedrag dat nog betaald moet worden, zonder extra kosten." },
            { kop: "Een nieuwe termijn", tekst: "Een korte, concrete termijn met een datum, bijvoorbeeld zeven dagen." },
            { kop: "Hoe de klant betaalt", tekst: "Rekeningnummer, tenaamstelling en het kenmerk, of een betaallink." },
            { kop: "Ruimte voor een reactie", tekst: "Misschien is de factuur niet ontvangen of klopt er iets niet." },
        ],
        tips: [
            "Stuur de factuur als bijlage mee. Dan hoeft de klant niet te zoeken.",
            "Reken geen kosten voor de herinnering. Die zijn bij particulieren niet toegestaan en werken bij zakelijke klanten averechts.",
            "Een betaallink in de e-mail verlaagt de drempel. Hoe minder stappen, hoe sneller het geld binnen is.",
        ],
        faq: [
            {
                q: "Is een betalingsherinnering verplicht?",
                a: "Nee. De wet schrijft geen herinnering voor. Wel is hij verstandig: veel facturen worden betaald zodra de klant er even aan herinnerd wordt. Bij particulieren is pas de 14-dagenbrief verplicht, voordat u incassokosten mag rekenen.",
            },
            {
                q: "Mag ik kosten rekenen voor een herinnering?",
                a: "Niet apart. De kosten van herinneringen en aanmaningen vallen onder de buitengerechtelijke incassokosten van de wettelijke staffel. Bij een particulier mag u die pas rekenen na een correcte 14-dagenbrief.",
            },
            {
                q: "Mag ik de herinnering per e-mail sturen?",
                a: "Ja. Een herinnering per e-mail is gebruikelijk en vaak sneller dan per post. Bewaar de verzonden e-mail, zodat u later kunt laten zien wanneer u hem stuurde.",
            },
            {
                q: "Hoeveel dagen geef ik de klant?",
                a: "Zeven dagen is gangbaar. Noem ook de datum zelf, dus uiterlijk op een vaste dag. Dat is duidelijker dan alleen een aantal dagen.",
            },
        ],
        bronnen: [BW6],
        verwant: ["betalingsherinnering-aanmaning-wik-brief", "openstaande-factuur-stappenplan", "eisen-correcte-factuur"],
    },
    {
        slug: "aanmaning",
        naam: "Aanmaning",
        href: "/voorbeeldbrieven/aanmaning",
        stap: 2,
        kaart: "Zakelijk, met een laatste termijn en de gevolgen als die verloopt.",
        voor: "Vooral zakelijk",
        toon: "Zakelijk",
        verplicht: "Nee",
        seoTitle: "Aanmaning voorbeeld: gratis brief om in te vullen | GeldGarant",
        description:
            "Gratis voorbeeld van een aanmaning voor een onbetaalde factuur. Met de incassokosten volgens de staffel. Download als Word of pdf.",
        h1: ["Aanmaning: voorbeeldbrief met de", "juiste", "gevolgen"],
        lead: "Betaalt de klant niet na de herinnering, dan volgt een aanmaning. Zakelijk van toon, met een laatste termijn en wat er gebeurt als die verloopt. De incassokosten rekent de briefmaker voor u uit.",
        soortKeuze: true,
        wanneer: [
            "Stuur de aanmaning als de termijn uit de herinnering voorbij is, meestal tien tot veertien dagen na de vervaldatum. Noem een laatste termijn en wat er gebeurt als die verloopt.",
            "Is uw klant een particulier? Dan mag u pas incassokosten rekenen na een 14-dagenbrief. De aanmaning voor particulieren noemt daarom nog geen kosten. Kies hieronder voor particulier en de tekst past zich aan.",
        ],
        eisen: [
            { kop: "Welke factuur en welk bedrag", tekst: "Factuurnummer, factuurdatum, vervaldatum en het openstaande bedrag." },
            { kop: "Een laatste termijn", tekst: "Een concrete datum waarop het bedrag binnen moet zijn." },
            {
                kop: "De gevolgen",
                tekst: "Bij een zakelijke klant: overdracht aan een incassobureau, de incassokosten volgens de staffel en de handelsrente.",
            },
            { kop: "Een ondubbelzinnige eis", tekst: "Duidelijk dat u betaling eist. Dat stuit ook de verjaring." },
        ],
        tips: [
            "Kondig alleen aan wat u ook echt doet. Een klant die merkt dat er na de laatste termijn niets gebeurt, betaalt de volgende keer nog later.",
            "Eén aanmaning is genoeg. Na drie aanmaningen neemt niemand de vierde nog serieus.",
            "Bel ook even. Een telefoontje naast de brief levert vaak sneller een betaling of een afspraak op.",
        ],
        faq: [
            {
                q: "Wat is het verschil tussen een herinnering en een aanmaning?",
                a: "Een herinnering gaat uit van een vergissing en is vriendelijk. Een aanmaning is zakelijk: u stelt een laatste termijn en noemt de gevolgen als de klant ook dan niet betaalt.",
            },
            {
                q: "Mag ik in een aanmaning incassokosten noemen?",
                a: "Bij een zakelijke klant wel. U mag de kosten volgens de wettelijke staffel aankondigen en rekenen zodra de klant in verzuim is. Bij een particulier mag dat pas na een correcte 14-dagenbrief.",
            },
            {
                q: "Hoeveel aanmaningen moet ik sturen?",
                a: "Wettelijk geen enkele. In de praktijk is één aanmaning na een herinnering genoeg. Daarna geeft u de vordering uit handen of stuurt u bij een particulier eerst de 14-dagenbrief.",
            },
            {
                q: "Stuit een aanmaning de verjaring?",
                a: "Ja, als u er ondubbelzinnig in eist dat de klant betaalt. Een schriftelijke aanmaning is daarvoor genoeg. Er begint dan een nieuwe verjaringstermijn.",
            },
        ],
        bronnen: [BW6, BIK, BW3],
        verwant: ["betalingsherinnering-aanmaning-wik-brief", "wettelijke-rente-2026", "verjaringstermijnen-vorderingen"],
    },
    {
        slug: "ingebrekestelling",
        naam: "Ingebrekestelling",
        href: "/voorbeeldbrieven/ingebrekestelling",
        stap: 3,
        kaart: "Zet de klant formeel in verzuim, met een laatste redelijke termijn.",
        voor: "Zakelijk en particulier",
        toon: "Formeel",
        verplicht: "Soms",
        seoTitle: "Ingebrekestelling voorbeeld bij niet betalen | GeldGarant",
        description:
            "Gratis voorbeeld van een ingebrekestelling voor een onbetaalde factuur. Wanneer u hem nodig heeft, wat erin moet en download als Word of pdf.",
        h1: ["Ingebrekestelling bij een onbetaalde factuur:", "voorbeeld", "en uitleg"],
        lead: "Met een ingebrekestelling geeft u de klant een laatste redelijke termijn. Betaalt hij dan niet, dan is hij in verzuim. Niet altijd nodig, wel vaak verstandig. Hieronder leest u wanneer.",
        soortKeuze: true,
        wanneer: [
            "Staat er op de factuur of in de afspraken een vaste betaaltermijn, dan is de klant meestal al in verzuim zodra die termijn verloopt. Een ingebrekestelling is dan niet nodig, maar maakt het wel onomstreden. Bij zakelijke klanten geldt bovendien een wettelijke termijn van 30 dagen als er niets is afgesproken.",
            "Is er geen vaste termijn afgesproken, of twijfelt u of de termijn hard was? Stuur dan een ingebrekestelling. Bij een particulier kan de 14-dagenbrief tegelijk als ingebrekestelling dienen, als hij aan de eisen van beide voldoet.",
        ],
        eisen: [
            { kop: "Schriftelijk", tekst: "Een brief of e-mail. Mondeling telt niet." },
            { kop: "Wat de klant moet doen", tekst: "Welk bedrag, voor welke factuur en hoe hij betaalt." },
            { kop: "Een redelijke termijn", tekst: "Voor een betaling is veertien dagen gangbaar." },
            { kop: "Het gevolg", tekst: "Dat de klant na die termijn in verzuim is, met rente en verdere stappen." },
        ],
        tips: [
            "Verstuur hem zo dat u de ontvangst kunt bewijzen. Bijvoorbeeld per e-mail en daarnaast per post, of aangetekend.",
            "Noem een datum, niet alleen een aantal dagen. Dan is er geen discussie over wanneer de termijn afloopt.",
            "Bewaar een kopie met de verzenddatum in uw administratie. Bij een procedure heeft u die nodig.",
        ],
        faq: [
            {
                q: "Wanneer is een ingebrekestelling nodig?",
                a: "Als de klant nog niet vanzelf in verzuim is. Is er een vaste betaaltermijn afgesproken, dan treedt verzuim meestal in zodra die verloopt en is een ingebrekestelling niet nodig. Zonder vaste termijn is hij dat wel.",
            },
            {
                q: "Wat is het verschil met de 14-dagenbrief?",
                a: "De ingebrekestelling zorgt dat de klant in verzuim komt. De 14-dagenbrief geeft u bij particulieren het recht op incassokosten. Eén brief kan beide doen als hij aan de eisen van allebei voldoet.",
            },
            {
                q: "Moet een ingebrekestelling aangetekend?",
                a: "Nee, dat is niet verplicht. Wel moet u kunnen bewijzen dat de klant hem heeft ontvangen. Aangetekend versturen helpt daarbij, net als een e-mail waarop de klant reageert.",
            },
            {
                q: "Wat is een redelijke termijn?",
                a: "Dat hangt af van wat de klant moet doen. Voor het betalen van een factuur is veertien dagen gangbaar en in de regel redelijk.",
            },
        ],
        bronnen: [BW6, BW3],
        verwant: ["openstaande-factuur-stappenplan", "wettelijke-rente-2026", "verjaringstermijnen-vorderingen"],
    },
    {
        slug: "sommatie",
        naam: "Sommatie",
        href: "/voorbeeldbrieven/sommatie",
        stap: 4,
        kaart: "De laatste brief voordat u naar de rechter stapt.",
        voor: "Zakelijk en particulier",
        toon: "Dwingend",
        verplicht: "Nee",
        seoTitle: "Sommatie voorbeeld: laatste brief voor de rechter | GeldGarant",
        description:
            "Gratis voorbeeld van een sommatie tot betaling met specificatie van hoofdsom en incassokosten. Wat erin moet en download als Word of pdf.",
        h1: ["Sommatie tot betaling: de", "laatste", "brief voor de rechter"],
        lead: "De sommatie is de laatste kans voor de klant om een procedure te voorkomen. Met een overzicht van wat er openstaat en een korte, harde termijn.",
        soortKeuze: true,
        wanneer: [
            "Stuur een sommatie als herinnering en aanmaning niets hebben opgeleverd en u echt bereid bent naar de rechter te gaan. Een sommatie zonder vervolg verzwakt uw positie.",
            "Bij een particulier mag u de incassokosten alleen opnemen als u eerder een correcte 14-dagenbrief stuurde en die termijn is verlopen. Vink dat hieronder aan; anders telt de briefmaker ze niet mee.",
        ],
        eisen: [
            { kop: "Een specificatie", tekst: "Hoofdsom, eventueel incassokosten en het totaal, plus de rente." },
            { kop: "Een korte termijn", tekst: "Vijf tot zeven dagen, met een vaste datum." },
            { kop: "De aankondiging", tekst: "Dat u zonder verdere aankondiging een procedure start." },
            { kop: "Een laatste uitweg", tekst: "Ruimte om contact op te nemen of een regeling te bespreken." },
        ],
        tips: [
            "Stuur hem alleen als u de vervolgstap ook zet. Overweeg dan wel eerst of de klant iets heeft om op te verhalen.",
            "Laat een incassobureau of deurwaarder de sommatie sturen. Een brief van een derde heeft vaak meer effect.",
            "Reken de kosten van een procedure vooraf uit. Bij kleine bedragen wegen griffierecht en deurwaarder zwaar.",
        ],
        faq: [
            {
                q: "Wat is een sommatie?",
                a: "Een sommatie is een dringende, laatste eis tot betaling. U geeft een korte termijn en kondigt aan dat u daarna zonder verdere waarschuwing naar de rechter gaat.",
            },
            {
                q: "Is een sommatie verplicht voordat ik naar de rechter ga?",
                a: "Niet wettelijk. Wel wil de rechter zien dat de klant wist wat er van hem gevraagd werd en de kans had om te betalen. Een sommatie laat dat zien en voorkomt discussie over de proceskosten.",
            },
            {
                q: "Wie stuurt de sommatie?",
                a: "Dat kunt u zelf doen. Vaak stuurt een incassobureau of deurwaarder hem namens u, omdat dat meer gewicht heeft en het vervolg dan al geregeld is.",
            },
            {
                q: "Welke kosten komen er bij een procedure bij?",
                a: "Onder meer griffierecht, de kosten van de deurwaarder voor de dagvaarding en eventueel een vergoeding voor uw gemachtigde. Wint u, dan kan de rechter die kosten grotendeels bij de klant leggen.",
            },
        ],
        bronnen: [BW6, BIK],
        verwant: ["gerechtelijke-procedure-kantonrechter", "griffierechten-2026", "conservatoir-beslag"],
    },
    {
        slug: "betalingsregeling",
        naam: "Betalingsregeling",
        href: "/voorbeeldbrieven/betalingsregeling",
        stap: 0,
        kaart: "Leg een afspraak over betalen in termijnen vast, met betaalschema.",
        voor: "Zakelijk en particulier",
        toon: "Helder",
        verplicht: "Nee",
        seoTitle: "Betalingsregeling voorbeeld met betaalschema | GeldGarant",
        description:
            "Gratis voorbeeldbrief om een betalingsregeling vast te leggen, met automatisch betaalschema en akkoordverklaring. Download als Word of pdf.",
        h1: ["Betalingsregeling vastleggen: voorbeeld met", "betaalschema", ""],
        lead: "Spreekt u met een klant af dat hij in termijnen betaalt? Leg het vast. De briefmaker verdeelt het bedrag over de maanden en zet er een akkoordverklaring onder.",
        soortKeuze: false,
        wanneer: [
            "Een regeling kan op elk moment: na de herinnering, na de aanmaning of tijdens een incasso. Een klant die wil maar niet in één keer kan, betaalt in termijnen vaak alsnog volledig.",
            "Leg de afspraak altijd schriftelijk vast. Dan weet de klant precies wat hij wanneer betaalt, en u heeft bewijs van de afspraak en van de erkenning van de schuld.",
        ],
        eisen: [
            { kop: "Het totale bedrag", tekst: "Wat de klant in totaal verschuldigd is, en dat hij dat erkent." },
            { kop: "Termijnen en data", tekst: "Hoeveel termijnen, welk bedrag en uiterlijk wanneer." },
            { kop: "Een vervalbeding", tekst: "Wat er gebeurt als een termijn niet op tijd betaald wordt." },
            { kop: "Een akkoord", tekst: "Een handtekening, of betaling van de eerste termijn als akkoord." },
        ],
        tips: [
            "Houd de looptijd kort. Hoe langer de regeling, hoe groter de kans dat hij halverwege stopt.",
            "Volg elke termijn op. Een gemiste betaling die u meteen signaleert, is makkelijker te herstellen.",
            "Vraag om een automatische overboeking. Dan hoeft de klant er niet elke maand aan te denken.",
        ],
        faq: [
            {
                q: "Moet een betalingsregeling op papier?",
                a: "Nee, een mondelinge afspraak is ook geldig. Op papier is het wel veel sterker: u kunt bewijzen wat er is afgesproken en dat de klant de schuld erkende.",
            },
            {
                q: "Stuit een betalingsregeling de verjaring?",
                a: "Ja. Erkent de klant de schuld, bijvoorbeeld door een regeling te tekenen of een termijn te betalen, dan wordt de verjaring gestuit en begint er een nieuwe termijn.",
            },
            {
                q: "Mag ik rente rekenen tijdens de regeling?",
                a: "Dat mag, als u het afspreekt. In deze voorbeeldbrief rekenen we geen rente zolang de klant zich aan de afspraken houdt. Dat maakt een regeling aantrekkelijker en duidelijker.",
            },
            {
                q: "Wat als de klant zich niet aan de regeling houdt?",
                a: "Dan treedt het vervalbeding in werking: het hele resterende bedrag is in één keer opeisbaar en u kunt verdere stappen zetten, zoals incasso of een procedure.",
            },
        ],
        bronnen: [BW3, BW6],
        verwant: ["betalingsregeling-treffen", "verjaringstermijnen-vorderingen", "debiteur-betwist-factuur"],
    },
    {
        // Zoekintentie "aanmaning huurachterstand" / "voorbeeldbrief huurachterstand" (GSC, E9). Inhoud volgt het
        // kennisbankartikel huurachterstand-incasseren; geen concurrentie met /branches/incasso-verhuur (dienst).
        slug: "huurachterstand",
        naam: "Aanmaning huurachterstand",
        href: "/voorbeeldbrieven/huurachterstand",
        stap: 0,
        kaart: "Voor verhuurders: huur die niet binnenkomt, voor woon- of bedrijfsruimte.",
        voor: "Verhuurders",
        toon: "Zakelijk",
        verplicht: "Nee",
        seoTitle: "Aanmaning huurachterstand: gratis voorbeeldbrief | GeldGarant",
        description:
            "Gratis voorbeeldbrief bij huurachterstand voor woon- en bedrijfsruimte. Vul huurder, periode en bedrag in en download de aanmaning als Word of pdf.",
        h1: ["Huurachterstand: aanmaning om", "direct", "in te vullen"],
        lead: "Betaalt uw huurder de huur niet, dan helpt een snelle en duidelijke aanmaning. Vul de huurder, de periode en het bedrag in. Voor woonruimte past de brief zich aan de regels voor particulieren aan.",
        soortKeuze: true,
        wanneer: [
            "Stuur de aanmaning zodra een huurtermijn niet binnen is en een herinnering of telefoontje niets oplevert. Hoe kleiner de achterstand, hoe groter de kans dat de huurder hem nog kan inhalen.",
            "Huurt een particulier een woning, dan mag u pas incassokosten rekenen na een 14-dagenbrief. Kies daarom voor woonruimte: de brief noemt dan nog geen kosten en wijst de huurder op gratis hulp bij geldzorgen.",
        ],
        eisen: [
            {
                kop: "Welke huur en welk bedrag",
                tekst: "De periode waarover de huur openstaat, het bedrag van de achterstand en de dag waarop de huur betaald had moeten zijn.",
            },
            {
                kop: "Een concrete termijn",
                tekst: "Een datum waarop de achterstand binnen moet zijn, en het verzoek om ook de lopende huur op tijd te betalen.",
            },
            {
                kop: "De gevolgen",
                tekst: "Bij bedrijfsruimte: overdracht aan een incassobureau, incassokosten en rente. Bij woonruimte eerst nog een 14-dagenbrief. Ontbinding van de huur kan alleen via de kantonrechter.",
            },
            {
                kop: "Ruimte voor een regeling",
                tekst: "Een uitnodiging om contact op te nemen als de huurder tijdelijk niet kan betalen.",
            },
        ],
        tips: [
            "Neem al bij de eerste gemiste maand contact op. Een kleine achterstand is veel makkelijker op te lossen dan drie maanden huur.",
            "Verreken de waarborgsom niet tussentijds. Dat mag pas aan het einde van de huur.",
            "Treft u een regeling, laat de lopende huur dan meetellen en leg de afspraak vast met de voorbeeldbrief betalingsregeling.",
        ],
        faq: [
            {
                q: "Mag ik incassokosten rekenen bij huurachterstand?",
                a: "Bij bedrijfsruimte meestal wel: volgens de wettelijke staffel, of volgens wat in de huurovereenkomst staat. Huurt een particulier een woning, dan mag dat pas na een correcte 14-dagenbrief.",
            },
            {
                q: "Mag ik de waarborgsom gebruiken voor de achterstand?",
                a: "Niet zolang de huur loopt. De waarborgsom verrekent u pas aan het einde van de huurovereenkomst met wat er dan nog openstaat.",
            },
            {
                q: "Wanneer kan ik de huur laten ontbinden?",
                a: "Bij woonruimte alleen via de kantonrechter. Die weegt de achterstand af tegen de omstandigheden. Bij drie maanden achterstand of meer wordt ontbinding meestal toegewezen. Zelf de sloten vervangen of spullen buiten zetten is verboden.",
            },
            {
                q: "Verjaart huurachterstand?",
                a: "Ja. Elke huurtermijn verjaart apart, vijf jaar na de dag waarop hij betaald had moeten zijn. Een schriftelijke aanmaning waarin u betaling eist, stuit de verjaring.",
            },
        ],
        bronnen: [BW7, BW6, BIK, BW3],
        verwant: ["huurachterstand-incasseren", "betalingsregeling-treffen", "verjaringstermijnen-vorderingen"],
    },
]

/** Kaart voor de 14-dagenbrief, die op /incasso/wik-brief staat. */
export const veertienDagenKaart = {
    naam: "14-dagenbrief",
    href: "/incasso/wik-brief#briefmaker",
    stap: 3,
    kaart: "Verplicht bij particulieren voordat u incassokosten mag rekenen.",
    voor: "Particulier",
    toon: "Formeel",
    verplicht: "Ja, bij particulieren",
}

export const briefBySlug = Object.fromEntries(voorbeeldbrieven.map((b) => [b.slug, b])) as Record<
    Exclude<BriefSlug, "14-dagenbrief">,
    Voorbeeldbrief
>
