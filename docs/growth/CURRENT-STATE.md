# Huidige stand en nulmeting (difference report)

Peildatum **12 nov 2026, ±01:00** (Europe/Amsterdam). Opdracht: `GeldGarant_GIGA_Masterprompt_AI_SEO_Growth_2026.md`
(gebruiker, 12 nov 2026). Labels: GEMETEN, BEREKEND, GESCHAT, HYPOTHESE, NIET BESCHIKBAAR, NIET GECONTROLEERD.
Detailbewijs van het SEO-traject staat in `docs/seo/SEO_EVIDENCE.md` (E1 tot E29); hier alleen de kern en wat nieuw is.

## 1. Executive audit

**Wat er staat en werkt**

- Technische basis op orde (GEMETEN, E1-E29 + 12 nov): 72 sitemap-URL's, alle 200, canonicals goed, geen noindex,
  JSON-LD op elke pagina, http en www → 301 naar https://geldgarant.com, robots.txt staat zoek- en AI-zoekbots toe en
  sluit trainingsbots uit (`Content-Signal: search=yes, ai-input=yes, ai-train=no`), `/llms.txt` live.
  Getest met de user-agents van OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Bingbot en Googlebot: 200.
- Search Console (domeinproperty) en Bing Webmaster Tools gekoppeld, sitemaps ingediend, IndexNow werkt (via yandex.com).
- Cloudflare Web Analytics (cookieloos), uptimecontrole elk kwartier, CI met Lighthouse.
- Inhoud: 28 kennisbankartikelen, 7 voorbeeldbrieven met briefmaker, 10 branchepagina's, calculators; "antwoord
  eerst"-zinnen op de dienstpagina's; Bedrijfsprofiel bijgewerkt.
- Transparante tarieven en een volledig online intake (vordering indienen in vier stappen, op werkdagen binnen het uur).

**Wat groei blokkeert (geverifieerd)**

1. **Autoriteit vrijwel nul.** Ahrefs DR geldgarant.com **0,2** (GEMETEN 12 nov, gratis DR-API). Concurrenten die
   AI-systemen noemen: e-Legal 47, Flanderijn 48, GGN 41, Invorderingsbedrijf 40, Intrum 39, Credifin 35, Intercash 28,
   Bill Incasso 21, incasso.nl 18, RIB Incasso 13; Trustoo 81. Zonder vermeldingen en links blijven commerciële
   zoekwoorden buiten de top 100 en noemen AI-antwoorden GeldGarant niet.
2. **Indexering nog half.** GSC 10 nov: 34 geïndexeerd, 34 niet (13 gecrawld-niet-geïndexeerd, 11 nooit gecrawld). Jong
   domein, nieuwe site sinds 7 nov. Aanpak loopt (dagelijks 10 aanvragen).
3. **Leadbron onbekend (opgelost in code op 12 nov, zie §4).** Het vorderingsformulier stuurde alleen `bron: "website"` mee;
   geen enkele aanvraag was aan een kanaal toe te wijzen. Contactformulier stuurde wel pagina/referrer/UTM.
4. **Geen koppeling lead → opdrachtgever → dossier → geïnde incassokosten.** CaseControl-data niet ontsloten voor
   marketing; geen cohortmeting. Daardoor zijn CAC, terugverdientijd en kanaalrendement NIET BESCHIKBAAR.
5. **Oud telefoonnummer 085 083 5230** bij Justis, telefoonboek.nl, infobel en ProvenExpert; ChatGPT en Perplexity geven
   het door (E22). Gebruikersactie, nog open.
6. **AI-zichtbaarheid 0%** op 10 gevolgde vragen (Ubersuggest, ChatGPT, 5 antwoorden; GEMETEN 8 nov, ongewijzigd 12 nov).

## 2. Nulmeting per domein

| Domein                    | Meting                                                                                                                        | Label        | Bron / datum                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| Google, 16 mnd (Framer)   | 137 klikken, 28,9K vertoningen, CTR 0,5%, pos 43,1                                                                            | GEMETEN      | GSC 8 nov (E9)                                 |
| Google, sinds livegang    | niet uitgelezen: GSC uitgelogd in het browserpaneel                                                                           | GEBLOKKEERD  | 12 nov                                         |
| Posities (20 zoekwoorden) | 3 in top 100: "incassobureau zzp" #26, "huurachterstand incasso" #28, "openstaande factuur" #40; 17 niet in top 100           | GEMETEN      | Ubersuggest NL desktop, 8 nov; volgende 15 nov |
| Zoekvolume / CPC          | "incassobureau" 6.600/mnd, CPC 13,28; "incassobureau inschakelen" 1.900, CPC 16,79; "no cure no pay incasso" 1.300, CPC 16,98 | GESCHAT      | Ubersuggest 12 nov (valuta niet bevestigd)     |
| Bing                      | 12 klikken, 755 vertoningen (aug-okt); 72 URL's ingediend; sitemapfout 10 nov, opnieuw ingediend                              | GEMETEN      | BWT, E28/E29                                   |
| AI-zichtbaarheid          | 0 vermeldingen, 0 citaties; genoemd: e-Legal, Bill Incasso (60%), Invorderingsbedrijf (40%), Intercash, RIB, Smaal, coeo e.a. | GEMETEN      | Ubersuggest 8-12 nov, handmatig E22            |
| AI-verwijsverkeer         | 0 AI-referrers in 24 uur                                                                                                      | GEMETEN      | CF Web Analytics 11 nov (E29)                  |
| Bezoek                    | 82 bezoeken/24 u, waarvan ±18 NL (rest grotendeels bots)                                                                      | GEMETEN      | CF Web Analytics 11 nov                        |
| Backlinks                 | DR 0,2; aantal verwijzende domeinen NIET BESCHIKBAAR (Ahrefs/Semrush zonder units)                                            | GEMETEN / NB | Ahrefs DR 12 nov                               |
| Bedrijfsprofiel           | bijgewerkt 8 nov; 19 Google-reviews (15 oudere onbeantwoord)                                                                  | GEMETEN      | E19                                            |
| Leads per kanaal          | NIET BESCHIKBAAR (bron werd niet meegestuurd)                                                                                 | NB           | code, 12 nov                                   |
| Opdrachtgevers / fees     | NIET BESCHIKBAAR (CaseControl niet ontsloten)                                                                                 | NB           | –                                              |
| Core Web Vitals (RUM)     | LCP P75 2,8 s (hero-foto home), INP en CLS goed                                                                               | GEMETEN      | CF Web Analytics 11 nov (E29)                  |

## 3. Correcties op aannames in de masterprompt (geverifieerd)

| Aanname masterprompt                  | Werkelijkheid                                                                                                                                                                                                                                                                               | Bron                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Succesfee standaard 15%               | **Geen succesfee.** GeldGarant verdient de wettelijke incassokosten (WIK-staffel) die de debiteur betaalt. Volledig betaald: opdrachtgever € 0; deels: incassokosten eerst, min. € 45, nooit meer dan ontvangen; niets binnen: € 0. Debiteurenbeheer € 99/199/349 p/m.                      | AV art. 6, `src/lib/wik.ts`, OVERDRACHT §2                   |
| Formule `V × s × p`                   | Omzet per dossier ≈ `WIK(V) × p` (+ rente, + deelbetalingen). WIK(€ 1.500) = € 225, WIK(€ 3.000) = € 425, WIK(€ 10.000) = € 875, max € 6.775. Kleine vorderingen zijn bij lage inningskans verliesgevend na behandeltijd.                                                                   | BEREKEND, `scripts/growth/ads-scenario.mjs`                  |
| FinChamps/FCPay, Mailgun              | Betalingen: derdengeldenrekening (bunq) + iDEAL via CaseControl `/pay`. Formuliermail via Resend; Mailgun alleen als trackingdomein van het dossierportaal (`email.dossiers…`). FinChamps NIET GECONTROLEERD.                                                                               | OVERDRACHT §2, `worker/betalen.ts`, E27                      |
| Officiële Google Ads MCP is read-only | "Read and partial mutate": lezen + assets/labels aanmaken; **geen** campagnes, advertenties, budgetten of biedingen. Developer token vervalt 9 sep 2026; toegang via Google Cloud-project (Test → Explorer/Basic).                                                                          | developers.google.com/…/developer-toolkit/mcp-server, 12 nov |
| Google Ads-beleid voor incasso        | De NL-pagina Financiële diensten noemt incasso niet; "Services voor schulden" (schuldsanering/-beheer voor consumenten) vereist certificering. GeldGarant werkt voor schuldeisers: waarschijnlijk niet onder die categorie (HYPOTHESE, bevestigen met een proefcampagne of Google-support). | support.google.com/adspolicy/answer/2464998, 12 nov          |
| Wki-registratie 00273 "controleren"   | Bevestigd in het Justis-register (link `site.incassoRegisterHref`); telefoon daar nog oud.                                                                                                                                                                                                  | E24, E26                                                     |

## 4. Uitgevoerd in deze sessie (12 nov 2026)

- **Leadherkomst in het vorderingsformulier** (`src/lib/intake.ts`, `src/scripts/vordering.ts`, test `tests/unit/intake.test.ts`):
    - Vordering indienen stuurt nu `bron_pagina`, `referrer`, `utm_source/medium/campaign` mee (zoals het contactformulier al
      deed). Geen cookies, geen browseropslag: gelezen op het moment van versturen. Cookieverklaring blijft kloppen.
    - Een zichtbare vraag "Hoe kent u GeldGarant?" is gebouwd en op verzoek van de gebruiker weer weggehaald (onnodig en
      vreemd in het formulier). De bron wordt achteraf gevraagd (telefoon, eerste contact) en in het leadregister gezet.
    - Tests: unit 118/118, e2e contact + vordering + kwaliteit 84/84 (mobiel, tablet, desktop: axe, 16px-velden, overloop,
      volledige aanvraag), `check` 0 fouten, `check:html` 0 fouten.
    - Worker-patch (zodat het team de bron in de meldingsmail ziet): `docs/projectkennis/intake-worker-herkomst-patch.md`.
      Zonder patch staat de vorderingsherkomst al in de KV-backup, alleen niet in de mail.
- Nulmetingen: CPC/volume (3 zoekwoorden), DR van GeldGarant en 13 concurrenten, live crawlertoegang, redirects.
- Rekenmodel Google Ads (`scripts/growth/ads-scenario.mjs` → `docs/growth/ads-scenario.csv`), GEO-promptbibliotheek (115
  vragen, `docs/growth/geo-prompts.csv`), concurrentenlijst (`docs/growth/competitors.csv`), meetplan, registers.

## 5. Antwoorden op de auditvragen (§2.4 masterprompt)

| Vraag                                      | Antwoord (12 nov)                                                                                                    |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Welke pagina's niet geïndexeerd en waarom? | 34 van 68 bekende (E27); oorzaak: jong domein en recrawl van de Framer-tijd, geen technische blokkade.               |
| Welke zoekopdrachten geven al vertoningen? | Merk, "incassobureau deventer" (pos 4), debiteurenbeheer uitbesteden, huurachterstand, mkb incasso (E9).             |
| Welke verwijzingen bestaan?                | Bijna geen (DR 0,2). Bekend: Justis, NowID, Bedrijfsprofiel, ProvenExpert, telefoonboek/infobel (oud nummer).        |
| Komt er AI-verkeer binnen?                 | Nee (0 AI-referrers); meting via referrer + achteraf vragen (leadregister).                                          |
| Haalbare transactionele zoekwoorden?       | Long tail met lage SD: "incassobureau zzp" (SD 13), "huurachterstand incasso" (13), "onbetaalde factuur innen" (21). |
| Website overtuigend genoeg?                | Kwalitatief sterk (prijs, proces, registratie); conversiecijfers NIET BESCHIKBAAR door te weinig verkeer.            |
| Van klik tot geïnde fee meetbaar?          | Nog niet: herkomst nu in de aanvraag; koppeling dossiernummer → CaseControl-ontvangsten is de volgende stap.         |
| Wat eerst?                                 | Telefoonnummer extern, intake-worker-patch, GSC-wachtrij, vermeldingen/autoriteit, CaseControl-export. Geen Ads.     |
