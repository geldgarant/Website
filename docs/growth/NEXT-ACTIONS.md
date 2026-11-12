# Volgende acties, top-10 kansen en roadmap

Stand 12 nov 2026. Volgorde volgens de masterprompt: meting → indexering en vindbaarheid → conversie → autoriteit →
gecontroleerde betaalde acquisitie → schaal. P0 = blokkeert meting/continuïteit, P1 = bewezen blokkade of direct
omzetrelevant, P2 = toetsbare kans, P3 = later.

## 1. Actielijst

| Prio | Actie                                                                                            | Waarom                                            | Kosten        | Inspanning | Toestemming?                    | Status                                         |
| ---- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ------------- | ---------- | ------------------------------- | ---------------------------------------------- |
| P0   | Herkomst (pagina/referrer/UTM) in het vorderingsformulier                                        | zonder bron geen kanaalrendement                  | € 0           | klein      | nee (cookieloos)                | **klaar 12 nov** (code + tests)                |
| P0   | Intake-worker-patch (herkomst in de meldingsmail van vorderingen)                                | team ziet de herkomst zonder KV te openen         | € 0           | 15 min     | ja (productie-worker)           | patch klaar, deploy open                       |
| P0   | Telefoonnummer 085 083 5230 → 085 212 73 88 bij Justis, telefoonboek.nl, infobel, ProvenExpert   | AI geeft het oude nummer door                     | € 0           | 30 min     | gebruiker                       | open sinds 8 nov                               |
| P0   | Leadregister (Google Sheet, sjabloon `leadregister-sjabloon.csv`)                                | basis voor CAC en cohorten                        | € 0           | 1 uur      | Google Sheet (besluit)          | open                                           |
| P1   | Achteraf vragen "hoe kent u ons?" (vaste keuzelijst, MEETPLAN)                                   | telefoon is vermoedelijk het grootste kanaal      | € 0           | gewoonte   | gebruiker                       | open                                           |
| P1   | GSC-wachtrij 12 nov (9 kennisbankartikelen) + prestaties sinds 7 nov uitlezen                    | helft van de site niet geïndexeerd                | € 0           | 20 min     | inloggen gebruiker              | geblokkeerd (uitgelogd)                        |
| P1   | Vermeldingen: Trustoo, KvK, LinkedIn-bedrijfspagina, NowID-ledenlijst, branchegidsen             | DR 0,2; AI noemt bureaus met vermeldingen         | € 0           | 2-4 uur    | gebruiker publiceert            | lijst in `docs/seo/backlink-opportunities.csv` |
| P1   | Reviewverzoek na afgerond dossier (vast moment, geen beloning)                                   | reviews zijn bron voor AI en lokaal               | € 0           | klein      | gebruiker                       | open                                           |
| P1   | CaseControl: vrij veld "bron" + maandexport onderzoeken                                          | koppeling lead → geïnde incassokosten             | € 0           | 1 uur      | read-only, onderzoek            | open                                           |
| P1   | LCP home (hero-foto, 2,8 s P75) en alt-teksten 2 grote foto's                                    | CWV en beeldzoeken                                | € 0           | klein      | website-chat                    | overgedragen (E29)                             |
| P2   | Blok "oude of hardnekkige vorderingen" op `/incasso` of eigen pagina na keyword-check            | segment uit de masterprompt, nu geen landingsplek | € 0           | middel     | nee (kannibalisatiecheck eerst) | open                                           |
| P2   | Partnerpagina voor boekhouders/administratiekantoren (verwijzen, geen provisie zonder AV-check)  | partners leveren herhaalvolume                    | € 0           | middel     | inhoud: gebruiker               | open                                           |
| P2   | Eigen data "Incassomonitor" (geaggregeerd uit CaseControl)                                       | citeerbare, linkwaardige bron                     | € 0           | groot      | ja (data)                       | idee                                           |
| P2   | IndexNow automatisch na deploy (GitHub Action)                                                   | handwerk weg                                      | € 0           | klein      | nee                             | open                                           |
| P2   | Maandelijkse GEO-meting: 20 vragen uit `geo-prompts.csv` handmatig in ChatGPT/Perplexity/AI Mode | Ubersuggest dekt alleen 10 vragen, 1 platform     | € 0           | 1 uur/mnd  | nee                             | open                                           |
| P3   | Google Ads-pilot (smal, branche met herhaalvolume)                                               | pas zinvol na GO-checklist                        | € 300-750/mnd | middel     | **ja**                          | NO-GO (`google-ads.md`)                        |
| P3   | Cookieloze klikteller (tel/mail/WhatsApp) via worker                                             | pas bij > 300 NL-bezoeken/week                    | € 0           | middel     | nee                             | uitgesteld                                     |
| P3   | Wikidata-item                                                                                    | entiteit                                          | € 0           | klein      | ja                              | concept klaar                                  |

## 2. Top-10 commerciële kansen (gerangschikt op verwachte bijdrage per uur werk)

1. **Bron van elke aanvraag vastleggen** (herkomst in code, achteraf vragen, leadregister): zonder dit is elke volgende keuze gokken.
2. **Externe NAW-correctie** (oud nummer): goedkoopste fix met direct effect op AI-antwoorden en belverkeer.
3. **Debiteurenbeheer-abonnementen** (€ 99-349 p/m): stabiele omzet per lead; "debiteurenbeheer uitbesteden" had 2.082
   vertoningen (E9). Pagina is verbeterd; nu vermeldingen en vergelijkingssites.
4. **Verhuur/huurachterstand**: ruim 3.000 vertoningen (E9), #28 op "huurachterstand incasso" (SD 13); verhuurders hebben
   herhaalvolume. Uitbouwen met de voorbeeldbrief en een verhuurderschecklist.
5. **Boekhouders en administratiekantoren als verwijzers**: één partner = veel opdrachtgevers; past bij de Mailmachine/
   callcenter-aanpak (aparte KPI's, alleen rechtmatige contacten).
6. **Trustoo en vergelijkingsplatforms**: DR 81, staat bovenaan bij lokale zoekvragen en wordt door AI geciteerd.
7. **Long tail met lage moeilijkheid** ("incassobureau zzp" #26, "onbetaalde factuur innen" SD 21, "openstaande factuur"
   #40): interne links + inhoud, geen nieuwe pagina's nodig.
8. **Oude/hardnekkige zakelijke vorderingen** als eigen boodschap (masterprompt §1.2), na keyword- en verjaringscheck.
9. **Reviews** (19 op Google; vast verzoek na afronding): vertrouwen op de site en bron voor AI.
10. **Incassokosten-/rentecalculator en briefmaker als linkwaardige tools**: outreach naar ondernemersblogs en
    boekhoudsoftware-kennisbanken (concepten; versturen pas met akkoord).

## 3. Eerste 30 dagen (vanaf 12 nov)

- **Week 1 (12-18 nov):** worker-patch deployen + testaanvraag; telefoonnummer extern; GSC-wachtrij afmaken en prestaties
  sinds 7 nov vastleggen; leadregister inrichten; Ubersuggest-update 15 nov vergelijken met 8 nov.
- **Week 2 (19-25 nov):** vermeldingen (Trustoo, KvK, LinkedIn, branchegidsen); reviewverzoek-template; CaseControl
  exportmogelijkheden bekijken; IndexNow-Action.
- **Week 3 (26 nov-2 dec):** GSC-prestaties per pagina vs E9 → titels/descriptions bijsturen (keyword-kaart); blok oude
  vorderingen (na check); partnerpagina-concept.
- **Week 4 (3-9 dec):** eerste maandrapport (`docs/growth/rapporten/2026-12.md`): aanvragen per bron, GSC, AI-meting,
  vermeldingen live; Ads GO/NO-GO opnieuw beoordelen.

## 4. 90 dagen en 12 maanden

| Fase | Periode      | Doel                                                       | Harde oplevering                                             |
| ---- | ------------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| 1    | nov-dec 2026 | Meting werkt, NAW klopt, indexering > 60 van 72 URL's      | leadregister met bron, maandrapport dec                      |
| 2    | jan 2027     | Autoriteit: 10+ echte vermeldingen, reviewproces loopt     | lijst live vermeldingen, DR-meting                           |
| 3    | feb-mrt 2027 | Commerciële pagina's op GSC-data, partnerkanaal            | 2-3 partners, eerste cohort (aanvragen nov-jan) met dossiers |
| 4    | apr-jun 2027 | Ads-pilot alleen bij GO; anders SEO/partners verdiepen     | pilotevaluatie met echte CPQL/CAC                            |
| 5    | jul-sep 2027 | Schalen wat rendeert (per kanaal bijdrage na 6 mnd cohort) | groeibesluit per kanaal                                      |
| 6    | okt-dec 2027 | Jaarreview: kanaalrendement, Incassomonitor                | jaarrapport + nieuwe roadmap                                 |

## 5. Wat de gebruiker moet doen (gebundeld)

1. Opnieuw inloggen bij Google in het browserpaneel (Search Console).
2. Telefoonnummer laten wijzigen: Justis-register, telefoonboek.nl, infobel, ProvenExpert.
3. Akkoord op deploy van de intake-worker-patch (of zelf plakken volgens `docs/projectkennis/intake-worker-herkomst-patch.md`).
4. Leadregister als Google Sheet: `docs/growth/leadregister-sjabloon.csv` importeren (Bestand → Importeren), of Google
   Drive koppelen in de chat zodat Claude hem maakt. Afspreken wie hem bijhoudt.
5. Google Ads: er is geen account (12 nov). Niet aanmaken tot de GO-checklist groen is.
6. Bij het eerste contact de bronvraag stellen.
