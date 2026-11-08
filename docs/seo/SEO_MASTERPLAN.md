# GeldGarant SEO-masterplan

Werkwijze: de SEO-masterprompt (aangeleverd door de gebruiker op 7 nov 2026, kopie van de kern in deze map niet nodig:
volg de fasen hieronder). Hervatten altijd via `docs/seo/SEO_STATE.md`. Bewijs staat in `docs/seo/SEO_EVIDENCE.md`.
Projectregels in `CLAUDE.md` gaan voor (merk, copy, geen verzonnen cijfers, bedrijfsgegevens uit `src/data/site.ts`).

**Primaire maatstaf:** gekwalificeerde organische aanvragen (vordering indienen, debiteurenbeheer-aanvraag, zakelijk
bellen/mailen). **Niet meetellen als acquisitie:** debiteurenverkeer (`/brief-ontvangen`, `/betalen`, `/api/betalen`).
Drie doelgroepen strikt gescheiden: (1) ondernemer met onbetaalde facturen, (2) ondernemer die debiteurenbeheer wil
uitbesteden, (3) debiteur met een brief.

**Uitgangssituatie (7 nov 2026):** site live sinds 7 nov 2026 op Cloudflare Workers (Astro 7, statisch). Nieuw domein
voor Google in de zin van weinig autoriteit; Framer-URL's behouden. Techniek grotendeels op orde (zie bewijs E1). Geen
Search Console-toegang, geen analytics, geen backlinkdata. Kansen liggen in zoekintentie, linkwaardige hulpmiddelen,
lokale aanwezigheid en vermeldingen.

## Prioritering (impact op aanvragen × bewijs × urgentie ÷ inspanning × risico)

| #   | Initiatief                                              | Fase | Impact | Bewijs | Urgentie | Inspanning | Status                          |
| --- | ------------------------------------------------------- | ---- | ------ | ------ | -------- | ---------- | ------------------------------- |
| 1   | HTTP → HTTPS-redirect (nu 200 op http://)               | 3    | middel | sterk  | hoog     | laag       | aan (8 nov), hertest open       |
| 2   | Search Console + sitemap + Bing                         | 0/9  | hoog   | sterk  | hoog     | laag       | GSC klaar (E9), Bing open       |
| 3   | Meting: Cloudflare Web Analytics + CSP + events         | 9    | hoog   | sterk  | hoog     | middel     | aan (E20), data controleren     |
| 4   | Voorbeeldbrieven-bibliotheek met briefmaker             | 5/7  | hoog   | middel | middel   | middel     | live (batch 2), meten na GSC    |
| 5   | Quick wins: 2 lange titels, JSON-LD /vordering-indienen | 3    | laag   | sterk  | middel   | laag       | klaar (batch 2)                 |
| 6   | Interne links naar zwak gelinkte pagina's (E1)          | 5    | middel | sterk  | middel   | laag       | klaar (batch 3, E7)             |
| 7   | Zoekcluster-naar-URL-kaart + SERP per prioritaire vraag | 2    | hoog   | middel | middel   | middel     | kaart klaar (E8), SERP deels    |
| 7b  | Kannibalisatie: 4 titelparen scheiden (E8)              | 2/3  | middel | middel | middel   | laag       | klaar (batch 4, E10)            |
| 8   | Commerciële pagina's verbeteren (/incasso, inschakelen) | 4    | hoog   | middel | middel   | hoog       | bezig: deb.beheer, verhuur, mkb |
| 9   | Google Bedrijfsprofiel + NAP-consistentie               | 6    | middel | middel | middel   | laag       | geïnventariseerd (E18)          |
| 10  | Vermeldingen en backlinks (Justis, NowID, Trustoo, KvK) | 7    | hoog   | middel | laag     | middel     | lijst klaar (E18)               |
| 11  | AI-zichtbaarheid: vaste vragenset meten                 | 8    | middel | zwak   | laag     | laag       | open                            |

## Fase 0. Systeem en meetketen

- **Doel:** weten hoe de site werkt en wat we kunnen meten.
- **Gedaan:** systeemkaart (hieronder), reproduceerbare build (`npm run qa`), crawler `scripts/seo/crawl.mjs`.
- **Open:** meetketen bestaat nog niet (geen analytics, geen Search Console voor dit Google-account).
- **DoD:** Search Console en analytics leveren data; events voor aanvragen werken zonder persoonsgegevens.

Systeemkaart (kort; details in `CLAUDE.md`, `docs/HANDOFF.md`, `docs/OVERDRACHT.md`):

- Astro 7 statisch → Cloudflare Worker `website` (static assets; worker alleen voor `/api/*`), Workers Builds bij push
  naar `main` = productie. Staging: website.geldgarant.workers.dev. Rollback: vorige versie in Workers → Deployments.
- Metadata in `src/layouts/Base.astro` (title, description, canonical = `Astro.site` + pad zonder slash, OG-beeld per H1).
- Sitemap `@astrojs/sitemap` (filter in `astro.config.mjs`), robots.txt = Cloudflare Managed (AI-training geblokkeerd)
    - eigen `Allow: /` + sitemap. Redirects in `public/_redirects` (getest).
- Formulieren: intake-worker api.geldgarant.com (`/api/incasso-*`, `/api/contact`, `/api/sollicitatie`), Turnstile.
  Debiteurenbetaling via eigen worker `/api/betalen` → CaseControl.
- Bedrijfsgegevens: `src/data/site.ts`.

## Fase 1. Nulmeting productie

- **Gedaan (E1):** crawl 64 sitemap-URL's: alle 200, canonicals correct, geen noindex, één H1 per pagina, descriptions
  binnen marge, alt-teksten aanwezig. Afwijkingen: 2 lange titels, `/vordering-indienen` zonder JSON-LD, dunne pagina's
  (`/contact-opnemen`, `/juridisch`, `/vordering-indienen`, functioneel; geen actie behalve /juridisch beoordelen),
  zwak intern gelinkt: `/incasso/incassobureau-inschakelen`, `/hulp-nodig-bij-geldproblemen`, 4 kennisbankartikelen.
  HTTP-varianten geven 200 i.p.v. 301 (E2).
- **Open:** velddata CWV (CrUX/PSI; PSI-API geeft 429 zonder sleutel), Search Console-indexering, Lighthouse op
  productie per sjabloon.
- **DoD:** elke bevinding is een taak in de tabel hierboven.

## Fase 2. Zoekmarkt en URL-strategie

- **Gedaan (E4):** SERP-steekproef 4 zoekvragen.
- **Taak:** `docs/seo/keyword-url-map.csv` met per intentie één voorkeurs-URL. Eerste versie (hypothese, geen volumes):
    - incassobureau inschakelen / incasso uit handen geven → `/incasso/incassobureau-inschakelen` (nu zwak gelinkt)
    - incassobureau voor ondernemers / zakelijk incasso → `/incasso`
    - onbetaalde factuur / factuur niet betaald → `/kennisbank/openstaande-factuur-stappenplan`
    - incassokosten berekenen / WIK-staffel → `/incasso/incassokosten-berekenen`
    - 14-dagenbrief / WIK-brief (voorbeeld) → `/incasso/wik-brief`
    - betalingsherinnering / aanmaning / ingebrekestelling / sommatie / betalingsregeling voorbeeld →
      `/voorbeeldbrieven/<brief>` (nieuw, aparte intentie: sjabloon om in te vullen)
    - verschil herinnering, aanmaning, WIK-brief → `/kennisbank/betalingsherinnering-aanmaning-wik-brief`
    - debiteurenbeheer uitbesteden → `/debiteurenbeheer`
    - incasso kosten / no cure no pay → `/tarieven`
    - incasso buitenland → `/incasso/incasso-in-het-buitenland`
    - incassobureau Deventer → homepage + Bedrijfsprofiel (geen stadspagina's)
    - brief van GeldGarant ontvangen → `/brief-ontvangen` (debiteur, niet acquisitie)
- **DoD:** kaart in de repo, kannibalisatie gecontroleerd vóór elke nieuwe URL.
- **Gedaan (batch 3, E8):** `docs/seo/keyword-url-map.csv`, 56 clusters met voorkeurs-URL, ondersteunende en
  concurrerende URL's, status en volgende stap. Gevonden kannibalisatierisico's (titels): `/wki` ↔
  `/kennisbank/wki-proof-werken-2026`, `/branches/incasso-zzp` ↔ `/kennisbank/incasso-zzp`, `/branches/incasso-verhuur`
  ↔ `/kennisbank/huurachterstand-incasseren`, `/tarieven` ↔ `/kennisbank/wat-kost-incasso-uitbesteden`.
  Voorstel: branchepagina's richten op "incassobureau voor …" (commercieel), kennisbank houdt de probleemvraag;
  kennisbanktitel Wki richten op "Wki-proof werken als schuldeiser". Doorgevoerd in batch 4 (akkoord gebruiker, E10).

## Fase 3. Technische SEO

- HTTP → HTTPS en http://www → https:// (Cloudflare "Always Use HTTPS"; gebruiker).
- Titels inkorten: `/brief-ontvangen` (70), `/incasso/incasso-in-het-buitenland` (69).
- JSON-LD op `/vordering-indienen` (WebPage + BreadcrumbList), Service/Offer op `/tarieven` alleen met echte prijzen uit
  `src/lib/pakketten.ts`/AV.
- Na Search Console: indexeringsrapport, URL-inspectie homepage en 3 kernpagina's.
- **DoD:** crawl zonder afwijkingen; `npm run qa` groen; response-HTML gecontroleerd.

## Fase 4. Commerciële pagina's

- Volgorde (bijgesteld 8 nov op basis van GSC, E9): `/debiteurenbeheer` (2.082 vertoningen op "debiteurenbeheer
  uitbesteden", pos 65), huurachterstand (`/branches/incasso-verhuur` + kennisbank, ruim 3.000 vertoningen),
  `/branches/incasso-mkb` ("mkb incasso", ruim 3.000), `/incasso/incassobureau-inschakelen`, `/incasso`, `/tarieven`.
- Per pagina: SERP-vergelijking, intentie, ontbrekende antwoorden (benodigde stukken, termijnen, uitkomsten,
  uitzonderingen), één primaire CTA, schema. Geen verzonnen claims.

## Fase 5. Informatieve autoriteit en interne links

- **Voorbeeldbrieven-bibliotheek (klaar, batch 2):** `/voorbeeldbrieven` + 5 briefpagina's met briefmaker (live voorbeeld,
  Word zonder afhankelijkheden, pdf via afdrukken, kopiëren). 14-dagenbrief blijft op `/incasso/wik-brief` (briefmaker
  daar toevoegen) om kannibalisatie te voorkomen. Interne links vanuit kennisbank, `/incasso`, footer.
- Interne links naar zwak gelinkte pagina's (E1): **klaar in batch 3 (E7)**. Branchepagina's tonen het passende
  kennisbankartikel (`kennis` in `src/data/branches.ts`, build faalt bij een onbekende slug); `verwant` aangepast in 5
  artikelen; contextuele links naar `/incasso/incassobureau-inschakelen` (3 artikelen + alle voorbeeldbrieven) en
  `/hulp-nodig-bij-geldproblemen` (2 artikelen + `/contact-opnemen`); `/voorbeeldbrieven` vanaf `/incasso` en `/kennisbank`.
- Daarna: bewijsstukkenchecklist, beslisboom "kan ik deze vordering nog innen?" (verjaring), alleen met primaire bronnen.

## Fase 6. Lokaal

- Bedrijfsprofiel bestaat (gebruiker, 7 nov). Nodig: toegang of export. Controle NAP tegen `src/data/site.ts`,
  categorie "Incassobureau", website-URL, openingstijden. Geen stadspagina's zonder unieke lokale waarde.
- Reviewproces voor echte klanten (zonder beloning), voorbereiden; niet publiceren zonder opdracht.

## Fase 7. Vermeldingen en backlinks

- Kansen (te verifiëren, status "kans"): Justis-register (link naar inschrijving bestaat al op de site), NowID
  ledenlijst, KvK-profiel, Trustoo/vergelijkingssites (staat bovenaan bij "incassobureau Deventer"), branchegidsen,
  boekhouderspartners. Linkwaardige assets: voorbeeldbrieven, incassokosten- en rentecalculator.
- Bestand: `docs/seo/backlink-opportunities.csv` zodra er geverifieerde kansen zijn. Geen outreach zonder opdracht.

## Fase 8. AI-zichtbaarheid

- robots.txt: zoekcrawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot) toegestaan; trainingscrawlers geblokkeerd
  door Cloudflare Managed robots. Bewuste keuze, bevestigen met gebruiker.
- Vaste vragenset (10 Nederlandse klantvragen) meten in ChatGPT Search, Perplexity, Google AI Overviews; vastleggen in
  SEO_EVIDENCE. Geen llms.txt zonder concreet doel.

## Fase 9. Meting

- Cloudflare Web Analytics (gebruiker akkoord 7 nov): cookieloos. Let op: CSP in `public/_headers` moet
  `static.cloudflareinsights.com` (script) en `cloudflareinsights.com` (connect) toestaan; automatische injectie werkt
  pas daarna. Cookie- en privacyverklaring aanpassen (+ pdf's opnieuw maken, zie CLAUDE.md Fase D).
- Events (succes vordering, debiteurenbeheer, tel-/mailklik, debiteurenbetaling apart): Web Analytics kent geen
  custom events; beoordelen of een lichte eigen teller in de worker (zonder persoonsgegevens) nodig is.

## Fase 10. Release

- Per batch: `npm run qa`, screenshots 390/1440, crawl lokale preview (`node scripts/seo/crawl.mjs http://localhost:4399`),
  commit, push naar `main` (= productie via Workers Builds), crawl productie, status bijwerken.
