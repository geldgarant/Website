# SEO-bewijs

Alleen controleerbaar bewijs: bron, datum, omvang, beperkingen. Geen persoonsgegevens. Productie, lokaal, extern en
hypotheses gescheiden.

## Beschikbare bronnen (7 nov 2026)

| Bron                    | Status                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Repository + live site  | beschikbaar (`curl`/Node fetch via proxy werkt; `NODE_USE_ENV_PROXY=1`)                                |
| GitHub                  | git push werkt; `gh` CLI niet ingelogd (token ongeldig)                                                |
| Search Console          | **niet**: geldgarant@gmail.com heeft geen toegang; bestaande TXT hoort bij ander account (E3)          |
| GA4 / analytics         | geen; Cloudflare Web Analytics akkoord, nog niet aan                                                   |
| PageSpeed Insights API  | bereikbaar maar 429 zonder API-sleutel                                                                 |
| CrUX                    | niet beschikbaar (te weinig verkeer verwacht, geen sleutel)                                            |
| Bing Webmaster Tools    | niet gekoppeld                                                                                         |
| Google Bedrijfsprofiel  | bestaat volgens gebruiker; geen toegang in deze sessie                                                 |
| Browserpaneel (desktop) | in deze sessie niet meer beschikbaar (remote-devices-tools weg); was ingelogd bij Cloudflare en Google |
| WebFetch/WebSearch      | tijdelijk gelimiteerd (5-uurslimiet bereikt om ~12:00)                                                 |

## Productie

### E1. Crawl productie (7 nov 2026, 22:05)

- Methode: `NODE_USE_ENV_PROXY=1 node scripts/seo/crawl.mjs` → `docs/seo/crawl-2026-11-07.csv`. Bron: sitemap-index,
  64 URL's. UA `GeldGarant-SEO-crawl/1.0`. Niet-renderend (kerninhoud is servergerenderd). Inlinks alleen binnen `<main>`.
- Alle 64: status 200, canonical = `https://geldgarant.com<pad>`, geen noindex/X-Robots-Tag, precies één H1, description
  110 tot 165 tekens, geen `<img>` zonder alt.
- Titels > 65 tekens: `/brief-ontvangen` (70), `/incasso/incasso-in-het-buitenland` (69).
- Zonder JSON-LD: `/vordering-indienen`.
- < 400 woorden in main: `/contact-opnemen` (242), `/juridisch` (101), `/vordering-indienen` (366).
- < 2 inkomende links vanuit main-inhoud: `/hulp-nodig-bij-geldproblemen`, `/incasso/incassobureau-inschakelen`,
  `/kennisbank/geleend-geld-terugvorderen`, `/kennisbank/huurachterstand-incasseren`, `/kennisbank/incasso-bouwsector`,
  `/kennisbank/incasso-zzp` (elk 1). Header/footer niet meegeteld.

### E2. HTTP-varianten (7 nov 2026)

- `curl -I http://geldgarant.com/` → `200 OK`, `cf-cache-status: HIT` (echte Cloudflare-respons, geen proxy-artefact).
  `http://www.geldgarant.com/` → 200. `https://www.geldgarant.com/` → 301 naar `https://geldgarant.com/` (goed).
- Gevolg: http-duplicaten bereikbaar; canonical wijst wel naar https, dus beperkt risico, maar onnodig.
- Oplossing: Cloudflare → SSL/TLS → Edge Certificates → **Always Use HTTPS** aan (gebruiker; omkeerbaar).

### E3. Search Console (7 nov 2026)

- Ingelogd als geldgarant@gmail.com: "Je hebt geen toegang tot deze property" voor `sc-domain:geldgarant.com`.
- DNS heeft `google-site-verification=_Y0Q2jXF3Vgtj0ydot77QNi2uDX_c4WWnDcYBPkisEM` (ander account, waarschijnlijk oude
  bouwer). Voor geldgarant@gmail.com is een TXT-record nodig:
  `google-site-verification=IBklbLEvZbA3XR53hRmVoH-RuAY1GPVcEVf8zSlH5k0` (naam `@`). DNS-wijziging mocht Claude niet
  zelf opslaan; gebruiker gevraagd. Daarna: Verifiëren, sitemap `https://geldgarant.com/sitemap-index.xml` indienen.

### E5. robots.txt (7 nov 2026)

- Cloudflare Managed blok vóór eigen regels: blokkeert o.a. GPTBot, ClaudeBot, Google-Extended, GoogleOther,
  CCBot, Bytespider, meta-externalagent. Googlebot, Bingbot, OAI-SearchBot, PerplexityBot niet geblokkeerd.
  Eigen deel: `User-agent: * / Allow: /` en `Sitemap: https://geldgarant.com/sitemap-index.xml`.

## Extern (SERP-steekproef, 7 nov 2026, handmatig via WebSearch; niet gepersonaliseerd, geen volumes)

### E4

- "incassobureau inschakelen": KvK, Knab, MKB Servicedesk, dezaak, Trustoo. Informatief/vergelijkend; hoge autoriteit.
- "WIK brief voorbeeld": wikbriefversturen.nl, rechtspraak.nl, Stripe, Credifin. Sjabloon- en toolpagina's winnen.
- "incassobureau Deventer": Trustoo bovenaan, daarna lokale bureaus (o.a. Van den Bos & Jansen); lokaal pakket.
- "factuur niet betaald": banken, ondernemersplein/onderneming.nl, MKB Servicedesk.
- Conclusie (hypothese): op brede zoekvragen weinig kans op korte termijn; sjablonen/tools en lokaal zijn haalbaarder.

## Lokaal (tests)

- 7 nov 2026: `tests/unit/briefmaker.test.ts` (14) en `tests/unit/docx.test.ts` (3) groen. Word-bestanden van alle 6
  brieven geopend met python-docx en LibreOffice (pdf-render bekeken: sommatie 1 pagina, regeling 2 pagina's).

- 7 nov 2026, batch 2: `npm run check` 0 fouten, eslint en prettier schoon, 111 unit-tests, `check:html` 0 fouten,
  `check:seo` 73 pagina's zonder problemen, volledige e2e 993 groen (vóór quick wins), daarna gerichte e2e 72 groen
  (briefmaker, vordering-indienen, brief-ontvangen, buitenland, 14-dagenbrief), `audit:deps` 0 kwetsbaarheden.
  Browserproef briefmaker sommatie: alle velden ingevuld → 0 plaatshouders, Word-download `sommatie-2026-118.docx`
  geopend met python-docx. Screenshots 1440/390 van hub, betalingsregeling en briefmaker bekeken.

## Hypotheses (niet gemeten)

- Voorbeeldbrieven met invulhulp trekken zoekverkeer van ondernemers in de fase vóór incasso en leveren links op.
- Bedrijfsprofiel + Trustoo-vermelding verbeteren zichtbaarheid op "incassobureau Deventer".
