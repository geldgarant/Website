# Meetplan: van zoekopdracht tot geïnde incassokosten

Doel: per kanaal weten wat het oplevert in **ontvangen incassokosten minus kosten**, niet in klikken. Principes: zo weinig
mogelijk gegevens, geen cookies zonder noodzaak (de cookieverklaring belooft "onze website volgt u niet"), geen
persoonsgegevens, dossiernummers of bedragen in URL's of analytics. Debiteurenverkeer (`/brief-ontvangen`, `/betalen`)
is geen acquisitie en telt nergens mee.

## 1. Datastroom

```
kanaal (Google, Bing, AI, via via, boekhouder, koude acquisitie, Ads)
  → aanvraag (website: dossiernummer GG-… / contact: requestId)  [herkomst: pagina, referrer, UTM; bron achteraf gevraagd]
  → gekwalificeerd (echte zakelijke vordering, opeisbaar)        [handmatig, leadregister]
  → opdrachtgever met eerste dossier in CaseControl             [CaseControl-dossiernummer]
  → ontvangsten (deels/volledig) en afdracht                    [CaseControl-export, alleen aggregaten]
  → incassokosten voor GeldGarant − behandeltijd = bijdrage     [maandelijks, per cohort en kanaal]
```

Koppelsleutel: het website-dossiernummer (`GG-…`) of `requestId` → CaseControl-dossiernummer (jaar-volgnummer). De
koppeltabel staat **niet** in de repo (persoonsgegevens) maar in een afgeschermd bestand of in CaseControl zelf (vrij veld
"bron"). In rapportages alleen aantallen en bedragen per kanaal/maand.

## 2. Eventwoordenboek

| Event                                           | Definitie                                                  | Bron                      | Status 12 nov                                              | Primair?  |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- | --------- |
| `pageview`                                      | Paginaweergave (cookieloos)                                | CF Web Analytics          | actief                                                     | nee       |
| `lead_form_submit_success`                      | Worker accepteert aanvraag (vordering of contact)          | intake-worker (KV + mail) | actief; herkomst sinds 12 nov in de payload                | voorlopig |
| `lead_source_asked`                             | Bron achteraf gevraagd (telefoon, eerste contact)          | leadregister (handmatig)  | sjabloon klaar (`leadregister-sjabloon.csv`)               | nee       |
| `lead_form_start`                               | Eerste invoer in een formulier                             | –                         | NIET GEBOUWD (zou opslag/tellers vragen; laag volume)      | nee       |
| `call_click` / `email_click` / `whatsapp_click` | Klik op tel:/mailto:/wa.me                                 | –                         | NIET GEBOUWD; telefoon is vermoedelijk het grootste kanaal | nee       |
| `lead_qualified`                                | Beoordeeld als echte zakelijke vordering                   | leadregister (handmatig)  | NIET INGERICHT                                             | ja        |
| `client_won`                                    | Eerste dossier van een nieuwe opdrachtgever in CaseControl | CaseControl               | NIET INGERICHT                                             | ja        |
| `payment_collected`                             | Ontvangst op een dossier (deels/volledig)                  | CaseControl               | NIET ONTSLOTEN                                             | intern    |
| `fee_realized`                                  | Incassokosten (+ rente) voor GeldGarant na afrekening      | CaseControl / boekhouding | NIET ONTSLOTEN                                             | intern    |

Bron achteraf vragen (besluit gebruiker 12 nov: geen vraag in het formulier). Bij het eerste telefoon- of mailcontact:
"hoe kent u ons?", antwoord in het leadregister met deze vaste keuzes: Google, Bing, ChatGPT of andere AI, aanbevolen door
iemand, boekhouder/accountant, al klant, door GeldGarant benaderd, LinkedIn/sociale media, anders. Een klik op het
telefoonnummer is geen gesprek.

Een cookieloze klikteller (worker `/api/meting` → Workers Analytics Engine, alleen eventnaam + pagina, geen IP of id) is
mogelijk zonder cookiebanner, maar pas zinvol bij meer verkeer. Besluit: uitstellen tot > 300 NL-bezoeken per week.

## 3. KPI-woordenboek (kern)

| KPI                        | Teller / noemer                                    | Bron                        | Frequentie  | Opmerking                      |
| -------------------------- | -------------------------------------------------- | --------------------------- | ----------- | ------------------------------ |
| Organische klikken (NL)    | klikken, excl. merk en debiteurenpagina's          | GSC                         | wekelijks   | merk apart                     |
| Geïndexeerde sitemap-URL's | geïndexeerd / 72                                   | GSC                         | wekelijks   |                                |
| AI-vermeldingen            | antwoorden met GeldGarant / gemeten antwoorden     | Ubersuggest + handmatig     | maandelijks | steekproef, onzekerheid noemen |
| Aanvragen per kanaal       | vordering + acquisitie-contact, per bron           | KV-export / mail            | wekelijks   | test-aanvragen uitsluiten      |
| Kwalificatieratio          | gekwalificeerd / aanvragen                         | leadregister                | maandelijks |                                |
| Nieuwe opdrachtgevers      | eerste dossier, per kanaal en maand                | CaseControl                 | maandelijks |                                |
| Dossiers per opdrachtgever | dossiers in 12 mnd / opdrachtgevers van het cohort | CaseControl                 | kwartaal    | belangrijkste hefboom (zie §4) |
| Inningsgraad               | dossiers met (deel)betaling / afgesloten dossiers  | CaseControl                 | kwartaal    | per hoofdsomklasse             |
| Bijdrage per opdrachtgever | incassokosten + rente − behandeluren × uurwaarde   | CaseControl + urenschatting | kwartaal    |                                |
| CAC per kanaal             | toerekenbare kosten / nieuwe opdrachtgevers        | kostenregister              | maandelijks | uren meetellen                 |

## 4. Wat het verdienmodel betekent voor marketing (BEREKEND)

Omzet per dossier ≈ WIK(hoofdsom) × inningskans. Met 2 uur behandeling à € 45 (AANNAME):

| Hoofdsom | WIK   | bij 40% inning | bij 55% | bij 70% | minus € 90 behandeling (55%) |
| -------- | ----- | -------------- | ------- | ------- | ---------------------------- |
| € 1.000  | € 150 | € 60           | € 83    | € 105   | € -8                         |
| € 1.500  | € 225 | € 90           | € 124   | € 158   | € 34                         |
| € 3.000  | € 425 | € 170          | € 234   | € 298   | € 144                        |
| € 6.000  | € 675 | € 270          | € 371   | € 473   | € 281                        |
| € 10.000 | € 875 | € 350          | € 481   | € 613   | € 391                        |

Gevolgen: (1) marketing moet sturen op **zakelijke vorderingen vanaf ±€ 2.500 en opdrachtgevers met herhaalvolume**, niet
op aantallen aanvragen; (2) debiteurenbeheer-abonnementen (€ 99-349 p/m) zijn de stabielste omzet per lead; (3) de echte
inningskans en behandeltijd moeten uit CaseControl komen, anders blijven dit aannames. Zelfde conclusie als het
callcenter-model (`GeldGarant-Callcenter/09_KPI_AND_UNIT_ECONOMICS.md`).

## 5. CaseControl-koppeling (onderzoek, nog niet gedaan)

Bekend: workflows, vrije velden en actie-id's (`docs/projectkennis/GeldGarant_CaseControl_Context.md`), betaal-endpoint
`/pay` (`worker/betalen.ts`). Te onderzoeken in de CaseControl-UI (eerst menu's, zie memory "CaseControl werkwijze"):

1. Kan een dossier een vrij veld "bron" / "kanaal" krijgen bij aanmaken? → dan zet de behandelaar daar het antwoord uit de
   aanvraag.
2. Welke export geeft per dossier: opdrachtgever, aanmaakdatum, hoofdsom, status, ontvangen bedrag, incassokosten?
   (CSV per maand is genoeg; geen API nodig.)
3. Maandelijks: export → lokaal script dat per kanaal/cohort aggregeert (`scripts/growth/`, nog te bouwen) → alleen totalen
   in `docs/growth/rapporten/`.

Geen scraping van ingelogde dossiers, geen dossierdata naar externe tools. Read-only (CaseControl is read-only voor Claude).
