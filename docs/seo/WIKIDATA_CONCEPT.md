# Wikidata-item GeldGarant (concept, niet gepubliceerd)

Opgesteld 8 nov 2026 (GEO werkstroom C3). Doel: één eenduidige entiteit "GeldGarant" waar zoek- en AI-systemen feiten
uit kunnen halen (naam, website, vestiging, registraties). Publiceren alleen met akkoord van de gebruiker, met een eigen
Wikidata-account van GeldGarant (Claude maakt geen accounts aan). Alleen feiten met een openbare bron; niets
promotioneels.

## Toelaatbaarheid

Wikidata neemt een item op als het een duidelijk identificeerbare entiteit is die met serieuze, openbare bronnen te
beschrijven is (notability-criterium 2). Bronnen hier: Handelsregister KvK en het Incassoregister van Justis. Risico:
een item van een klein bedrijf zonder onafhankelijke publicaties kan worden voorgedragen voor verwijdering. Daarom
sober houden, geen marketingtekst, en later aanvullen met onafhankelijke vermeldingen (pers, brancheorganisatie).

## Labels en beschrijvingen

| Taal | Label      | Beschrijving                                                     |
| ---- | ---------- | ---------------------------------------------------------------- |
| nl   | GeldGarant | Nederlands incassobureau voor ondernemers, gevestigd in Deventer |
| en   | GeldGarant | Dutch debt collection agency based in Deventer                   |

Alias: geldgarant.com

## Verklaringen (eigenschap → waarde → bron)

Controleer bij het invoeren elk P- en Q-nummer in Wikidata zelf (zoekveld van de eigenschap); de nummers hieronder zijn
een hulpmiddel, geen zekerheid.

| Eigenschap                              | Waarde                                        | Bron (referentie-URL)                                      |
| --------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| is een (P31)                            | bedrijf (Q4830453)                            | KvK-uittreksel                                             |
| bedrijfstak (P452)                      | incasso / debt collection (Q-nummer opzoeken) | https://www.justis.nl/registers/incassoregister/geldgarant |
| land (P17)                              | Nederland (Q55)                               | KvK-uittreksel                                             |
| hoofdkantoor (P159)                     | Deventer (Q-nummer opzoeken)                  | KvK-uittreksel                                             |
| officiële website (P856)                | https://geldgarant.com                        | eigen site                                                 |
| KvK-nummer (eigenschap opzoeken: "KvK") | 90622375                                      | KvK-uittreksel                                             |
| LinkedIn-bedrijfs-ID (P4264)            | geldgarant                                    | https://www.linkedin.com/company/geldgarant/               |
| lid van (P463)                          | NowID (alleen als er een item voor NowID is)  | https://www.nowid.org (ledenlijst, indien openbaar)        |
| oprichtingsdatum (P571)                 | datum uit het KvK-uittreksel                  | KvK-uittreksel                                             |

Het registratienummer bij Justis (00273) heeft geen eigen Wikidata-eigenschap; vermeld het via de referentie-URL bij
bedrijfstak, of als kwalificator "beschreven door bron" met de Justis-URL.

## Na publicatie

1. Wikidata-URL toevoegen aan `site.sameAs` in `src/data/site.ts` (komt dan in de JSON-LD van home en /over-ons).
2. Vastleggen in `docs/seo/SEO_EVIDENCE.md` en de AI-meting na ±4 weken herhalen.

## Wat de gebruiker moet doen

- Akkoord geven op publicatie.
- Wikidata-account aanmaken (op naam van GeldGarant, niet anoniem), daarna kan Claude in het browserpaneel helpen met
  invoeren; de gebruiker logt zelf in.
- Oprichtingsdatum uit het KvK-uittreksel aanleveren (staat niet op de site).
