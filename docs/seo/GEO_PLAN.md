# GEO/AEO-plan GeldGarant (AI-zoekmachines en antwoordmachines)

Opgesteld 8 nov 2026. Doel: GeldGarant wordt genoemd, geciteerd en correct beschreven in ChatGPT (search), Google AI
Overviews en AI Mode, Perplexity, Microsoft Copilot, Gemini en Claude, voor de vragen van ondernemers met onbetaalde
facturen (doelgroep 1) en debiteurenbeheer (doelgroep 2). Methode: skill `seo-geo` (Google: "optimaliseren voor
generatieve AI-zoekfuncties is nog steeds SEO"). Geen verzonnen data, geen nep-vermeldingen, geen astroturfing.

## 1. Nulmeting techniek (8 nov 2026)

**Crawlers** (live robots.txt, beheerd door Cloudflare "Managed robots.txt"; per bot de functie die hij bepaalt):

| Bot                  | Functie                                      | Status                   |
| -------------------- | -------------------------------------------- | ------------------------ |
| Googlebot            | Google Search, AI Overviews, AI Mode         | toegestaan               |
| Google-Extended      | Gemini/Vertex training én grounding          | geblokkeerd              |
| OAI-SearchBot        | citeerbaarheid in ChatGPT Search             | toegestaan               |
| GPTBot               | OpenAI-training                              | geblokkeerd              |
| ChatGPT-User         | ophalen op verzoek van een gebruiker         | toegestaan               |
| Claude-SearchBot     | citeerbaarheid in Claude-zoekfuncties        | toegestaan               |
| ClaudeBot            | Anthropic-training                           | geblokkeerd              |
| PerplexityBot        | Perplexity-zoekindex                         | toegestaan               |
| Bingbot              | Bing en Copilot (en indirect ChatGPT)        | toegestaan               |
| Applebot / -Extended | Siri/Spotlight / Apple Intelligence-training | toegestaan / geblokkeerd |

- `Content-Signal: search=yes, ai-train=no, use=reference`; **`ai-input` ontbreekt** (geen expliciete toestemming voor
  gebruik in gegenereerde antwoorden/RAG).
- Onbekend: of Cloudflare "AI Crawl Control" / "Block AI bots" AI-zoekbots op netwerkniveau blokkeert (dashboard was
  uitgelogd; controleren onder Security → Bots / AI Crawl Control).
- Server-side rendering: ja (Astro statisch); alle inhoud staat in de HTML.
- `llms.txt`: ontbreekt (Google: niet nodig, geen effect; mogelijk nuttig voor andere systemen).
- Structured data: Organization/ProfessionalService (homepage, met `@id`, `sameAs`), Article met auteur "Redactie
  GeldGarant" en `dateModified` (kennisbank), FAQPage, BreadcrumbList. **Ontbreekt: Service + Offer met prijzen op
  `/tarieven`.**
- Meting: Cloudflare Web Analytics sinds 8 nov actief (referrers van chatgpt.com, perplexity.ai e.d. zichtbaar); GSC.

## 2. Werkstromen (prioriteit: impact × haalbaarheid)

### A. Toegang en signalen (snel, hoge impact)

1. **Besluit gebruiker**: `ai-input=yes` in het Content-Signal (Cloudflare → AI Crawl Control / Managed robots.txt).
2. **Besluit gebruiker**: `Google-Extended` toestaan (Gemini-antwoorden kunnen GeldGarant dan als bron gebruiken).
   Trainingscrawlers (GPTBot, ClaudeBot, Applebot-Extended, CCBot) is een licentiekeuze, geen zichtbaarheidskeuze.
3. Cloudflare AI-botblokkade op netwerkniveau controleren (OAI-SearchBot, Claude-SearchBot, PerplexityBot moeten door).
4. GSC: controle "Search generative AI" op "opnemen" laten staan.
5. Bing Webmaster Tools (Copilot én ChatGPT Search leunen op de Bing-index) + IndexNow (actief sinds 8 nov).
6. `llms.txt` en `llms-full.txt` (lage kosten, geen Google-effect; voor niet-Google-systemen).

### B. Citeerbare inhoud (doorlopend)

1. **Feitenblok "GeldGarant in het kort"** op `/over-ons` (en compact op `/incasso`, `/tarieven`): registratie Justis 00273,
   NowID, landelijk vanuit Deventer, € 0 bij volledige betaling, start binnen het uur, wekelijkse afdracht. Korte,
   losstaande zinnen die een AI letterlijk kan overnemen.
2. **Antwoord eerst**: elke commerciële pagina en elk kennisbankartikel begint met een direct antwoord van 40 tot 60
   woorden; vraag-koppen (H2) die de zoekvraag letterlijk spiegelen; tabellen voor vergelijkingen (staffel, termijnen).
3. **Schema**: Service + OfferCatalog met echte prijzen op `/tarieven` en `/debiteurenbeheer`; Article/`dateModified`
   actueel houden; Organization-feiten (KvK als `identifier`, `memberOf` NowID) waar correct.
4. **Actualiteitsprogramma**: kennisbank per kwartaal nalopen (rente 1 jan/1 jul, griffierechten, beslagvrije voet);
   `dateModified` alleen bij inhoudelijke wijziging.
5. **Eigen, citeerbare data**: geanonimiseerde cijfers uit eigen dossiers (bv. gemiddelde doorlooptijd, % betaald na
   eerste brief) als jaarlijkse "Incassomonitor". Alleen met echte data van GeldGarant; nooit verzinnen.
6. Hulpmiddelen (incassokosten- en rentecalculator, briefmaker) als linkwaardige, citeerbare assets uitbouwen.

### C. Entiteit en vermeldingen (grootste hefboom volgens onderzoek; gebruiker beslist en publiceert)

1. Overal dezelfde NAW-gegevens: Bedrijfsprofiel (gedaan), Justis (telefoon), KvK, LinkedIn, Instagram.
2. LinkedIn-bedrijfspagina volledig (omschrijving, website, specialisaties); regelmatig korte kennisposts.
3. Wikidata-item voor GeldGarant (organisatie, met KvK- en Justis-bron) zodra de gebruiker akkoord is.
4. YouTube: korte uitlegvideo's ("Wat is een 14-dagenbrief?", "Wat kost een incassobureau?") met transcript op de site.
5. Echte reviews (Google, Trustpilot) via een vast verzoek na afronding, zonder beloning.
6. Vermeldingen in vergelijkingen en lijsten ("beste incassobureaus"), Trustoo, branchepartners, boekhouders;
   geen gekochte links, gesponsorde plaatsing altijd `rel=sponsored`.
7. Reddit/fora: alleen echte, behulpzame antwoorden als GeldGarant, nooit anoniem promoten.

### D. Meting (maandelijks)

1. **Vaste vragenset** (20 Nederlandse vragen, zie §3) in ChatGPT (search), Perplexity, Google AI Overviews/AI Mode,
   Copilot, Gemini en Claude: wordt GeldGarant genoemd, geciteerd (welke URL), juist beschreven, welke concurrenten.
   Vastleggen in `docs/seo/SEO_EVIDENCE.md` (tabel per maand).
2. Web Analytics: AI-referrers per maand. GSC: vertoningen/klikken op informatieve zoekvragen.
3. Optioneel met data-tool (§4): automatische AI-vermeldingen en geciteerde domeinen.

## 3. Vaste vragenset (nulmeting volgt)

1. Wat is een goed incassobureau voor ondernemers?
2. Welk incassobureau is betrouwbaar en geregistreerd bij Justis?
3. Wat kost een incassobureau inschakelen?
4. Incassobureau no cure no pay Nederland
5. Wanneer schakel ik een incassobureau in?
6. Hoe werkt de 14-dagenbrief?
7. Hoe bereken ik incassokosten volgens de WIK?
8. Wat moet ik doen als een klant mijn factuur niet betaalt?
9. Debiteurenbeheer uitbesteden: wat kost dat?
10. Wat is het verschil tussen debiteurenbeheer en factoring?
11. Incassobureau voor zzp'ers
12. Huurachterstand incasseren als verhuurder
13. Incassobureau Deventer
14. Voorbeeld aanmaning onbetaalde factuur
15. Wat is de wettelijke handelsrente in 2026?
16. Mag een incassobureau kosten rekenen aan een particulier?
17. Hoe lang duurt een incassotraject?
18. Wat gebeurt er als een debiteur failliet gaat?
19. Wat is de Wet kwaliteit incassodienstverlening?
20. Incassobureau voor webshops

## 4. Tools en koppelingen

| Behoefte                                                                             | Optie                         | Kosten (indicatie)      | Advies                  |
| ------------------------------------------------------------------------------------ | ----------------------------- | ----------------------- | ----------------------- |
| Echte google.nl-SERP's incl. AI Overviews, NL-zoekvolumes, ChatGPT-/LLM-vermeldingen | DataForSEO (API + MCP-server) | pay-as-you-go, laag     | **aanbevolen**          |
| AI-zichtbaarheid (Brand Radar), backlinks                                            | Ahrefs MCP                    | abonnement, hoog        | optioneel bij budget    |
| Zoekwoorden, AI-toolkit, concurrenten                                                | Semrush MCP                   | abonnement, hoog        | alternatief voor Ahrefs |
| Goedkoper middensegment incl. AI-zichtbaarheid                                       | Ubersuggest MCP               | abonnement, laag-midden | optioneel               |
| Search Console, Bedrijfsprofiel, Cloudflare                                          | browserpaneel (ingelogd)      | gratis                  | in gebruik              |
| GEO-methode, schema, content, lokaal                                                 | 58 skills in `.claude/skills` | gratis                  | in gebruik              |

Geen extra skill-plugins nodig: de bestaande `seo-geo`, `ai-seo`, `seo-schema`, `seo-local`, `link-building` dekken de
methode. Overlappende community-plugins voegen weinig toe.
