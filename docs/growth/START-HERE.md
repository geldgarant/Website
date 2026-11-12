# Groei GeldGarant: startpunt

Opdracht: `GeldGarant_GIGA_Masterprompt_AI_SEO_Growth_2026.md` (gebruiker, 12 nov 2026; staat in Downloads, niet in de
repo). Doel: meer betalende opdrachtgevers en meer rendabele dossiers, gemeten in ontvangen incassokosten minus kosten.
Het SEO-traject loopt door in `docs/seo/` (hervatten via `SEO_STATE.md`); deze map is de laag erboven (meting, kanalen,
geld). Geen parallelle waarheid: SEO-bewijs blijft in `SEO_EVIDENCE.md`.

## Lees in deze volgorde

1. `CURRENT-STATE.md`: nulmeting, wat werkt, wat blokkeert, correcties op de masterprompt, wat er gedaan is.
2. `NEXT-ACTIONS.md`: actielijst P0-P3, top-10 kansen, 30 dagen, 12 maanden, gebruikersacties.
3. `MEETPLAN.md`: eventwoordenboek, KPI's, verdienmodel per hoofdsom, CaseControl-koppeling.
4. `google-ads.md`: beleid, tooling, rekenmodel, GO/NO-GO, conceptcampagnes.
5. `REGISTERS.md`: toegang, tools, kosten, routines, risico's.
6. Data: `geo-prompts.csv` (115 AI-vragen), `competitors.csv`, `ads-scenario.csv` (uit `scripts/growth/ads-scenario.mjs`).

## Stand in vijf regels (12 nov 2026)

- Techniek en inhoud op orde; **autoriteit (DR 0,2) en indexering** zijn de bottlenecks, niet de site.
- Verdienmodel = WIK-incassokosten bij inning (geen succesfee): sturen op hoofdsom ≥ ±€ 2.500 en herhaalvolume.
- Vorderingsformulier stuurt sinds 12 nov pagina/referrer/UTM mee (cookieloos, onzichtbaar); bron verder achteraf vragen.
- Google Ads: NO-GO tot meting tot opdrachtgever werkt; basisscenario break-even CPC ±€ 10,50 vs geschat € 13-17.
- Gebruiker: Google opnieuw inloggen (GSC), oud telefoonnummer extern, worker-patch akkoord, leadregister-sheet.
- Geen Google Ads-account (12 nov).

## Belangrijke besluiten

| Datum  | Besluit                                                                                 | Waarom                                       |
| ------ | --------------------------------------------------------------------------------------- | -------------------------------------------- |
| 12 nov | Geen GA4/GTM/cookies; herkomst alleen op het moment van versturen + zelf opgegeven bron | cookieverklaring belooft "wij volgen u niet" |
| 12 nov | Google Ads niet starten (NO-GO-checklist in `google-ads.md`)                            | rekenmodel + ontbrekende meting              |
| 12 nov | Geen betaalde SEO-tools; Ubersuggest gratis + Ahrefs DR + GSC/BWT                       | weinig data om te analyseren, kosten > nut   |
| 8 nov  | AI-zoekbots toegestaan, trainingsbots niet (robots.txt)                                 | `docs/seo/GEO_PLAN.md`                       |

## Volgende sessie: top-5

1. GSC: wachtrij 12 nov afmaken, prestaties sinds 7 nov vastleggen (nieuwe E-regel in `SEO_EVIDENCE.md`).
2. Na akkoord: intake-worker-patch deployen en testaanvraag met `?utm_source=test` controleren (KV + mail).
3. Ubersuggest-update 15 nov vergelijken met 8 nov; DR opnieuw meten.
4. Vermeldingen uitvoeren of klaarzetten (Trustoo, KvK, LinkedIn) met de gebruiker.
5. CaseControl: veld "bron" en maandexport onderzoeken (read-only); daarna aggregatiescript in `scripts/growth/`.

Laatste tests: 12 nov 2026 (unit 118/118, e2e formulieren + kwaliteit 84/84, check 0, html-validate 0).
Rollback websitewijziging: vorige versie in Cloudflare Workers → Deployments, of `git revert` van de commit.
