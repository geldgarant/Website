# Registers: toegang, tools, kosten, routines, risico's

Bijwerken bij elke wijziging. Geen wachtwoorden, tokens of persoonsgegevens in dit bestand.

## 1. Toegang (stand 12 nov 2026)

| Systeem                          | Toegang Claude                                              | Rechten                     | Opmerking                                                    |
| -------------------------------- | ----------------------------------------------------------- | --------------------------- | ------------------------------------------------------------ |
| GitHub `geldgarant/Website`      | `gh` + git push                                             | schrijven                   | push naar `main` = productie                                 |
| Search Console                   | browserpaneel (Google-login gebruiker)                      | eigenaar                    | **12 nov uitgelogd**: gebruiker moet opnieuw inloggen        |
| Bing Webmaster Tools             | browserpaneel (Google-login)                                | eigenaar                    | E28                                                          |
| Cloudflare                       | browserpaneel / API eerder gebruikt                         | beheer                      | Web Analytics, AI Crawl Control, Workers                     |
| Google Bedrijfsprofiel           | browserpaneel                                               | beheer                      | wijzigingen alleen met akkoord                               |
| Ubersuggest                      | MCP, geldgarant@gmail.com                                   | gratis plan                 | 3 rapporten/dag, 1 project, 20/25 zoekwoorden, 10 AI-prompts |
| Ahrefs                           | MCP                                                         | gratis                      | alleen Domain Rating (gratis endpoint); overige 0 units      |
| Semrush                          | MCP                                                         | abonnement zonder API-units | niet bruikbaar                                               |
| Google Ads                       | geen                                                        | –                           | geen account (12 nov)                                        |
| GA4 / GTM                        | niet in gebruik (bewust, cookieloos beleid)                 | –                           |                                                              |
| CaseControl                      | read-only (memory)                                          | lezen                       | export-mogelijkheden onderzoeken                             |
| Intake-worker api.geldgarant.com | geen deploy vanuit repo; code-kopie in `docs/projectkennis` | –                           | patch via Cloudflare-dashboard                               |

## 2. Tools en kosten

| Tool                          | Doel                               | Kosten/mnd          | Advies                                                                 |
| ----------------------------- | ---------------------------------- | ------------------- | ---------------------------------------------------------------------- |
| Search Console, BWT, IndexNow | indexering, zoekdata               | € 0                 | kern                                                                   |
| Cloudflare Web Analytics      | bezoek, referrers, RUM-CWV         | € 0                 | kern; geen GA4 nodig bij dit volume                                    |
| Ubersuggest (gratis)          | 20 posities, 10 AI-prompts, CPC    | € 0                 | houden; betaald plan pas bij > 25 zoekwoorden of meer AI-prompts       |
| Ahrefs DR (gratis endpoint)   | autoriteit eigen + concurrenten    | € 0                 | maandelijks                                                            |
| Eigen scripts                 | crawl, IndexNow, uptime, ads-model | € 0                 | `scripts/seo`, `scripts/growth`, GitHub Actions                        |
| Keyword Planner               | officiële volumes/CPC              | € 0                 | zodra er een Ads-account is                                            |
| DataForSEO (pay-as-you-go)    | SERP's incl. AI Overviews, volumes | ± € 10-50 (GESCHAT) | optioneel; pas bij concrete vraag die gratis bronnen niet beantwoorden |
| Ahrefs/Semrush abonnement     | backlinks, concurrenten            | € 100+              | **niet doen** zolang er nauwelijks links zijn om te analyseren         |

## 3. Kostengoedkeuring (COST-APPROVAL-REGISTER)

| Datum | Omschrijving                                       | Bedrag | Frequentie | Besluit | Door |
| ----- | -------------------------------------------------- | ------ | ---------- | ------- | ---- |
| –     | (nog geen betaalde aanschaf voorgesteld of gedaan) |        |            |         |      |

## 4. Routines (scheduler-register)

| Routine                                      | Scheduler                                 | Frequentie        | Status                 | Laatste succesvolle run |
| -------------------------------------------- | ----------------------------------------- | ----------------- | ---------------------- | ----------------------- |
| Uptime + issue `storing`                     | GitHub Actions `uptime.yml`               | elk kwartier      | ACTIEF                 | zie Actions             |
| Kwaliteit + Lighthouse                       | GitHub Actions `kwaliteit.yml`            | bij push          | ACTIEF                 | zie Actions             |
| Halfjaarherinnering (rente/beslagvrije voet) | `herinneringen.yml`                       | 1 jan, 1 jul      | ACTIEF                 | –                       |
| Ubersuggest posities                         | Ubersuggest                               | wekelijks         | ACTIEF (extern)        | 8 nov; volgende 15 nov  |
| Ubersuggest AI-prompts                       | Ubersuggest                               | maandelijks       | ACTIEF (extern)        | 8 nov                   |
| GSC-indexeringswachtrij                      | handmatig (browserpaneel)                 | dagelijks, 10/dag | NIET ACTIEF (handwerk) | 11 nov                  |
| IndexNow na deploy                           | handmatig `node scripts/seo/indexnow.mjs` | per deploy        | NIET ACTIEF (handwerk) | 10 nov                  |
| Maandrapport groei                           | –                                         | maandelijks       | NIET ACTIEF            | –                       |

Kandidaat voor automatisering: IndexNow als stap in de deploy (GitHub Action na Workers Build) — klein, gratis, testbaar.

## 5. Risico's

| Risico                                  | Gevolg                        | Preventie                                                        | Status           |
| --------------------------------------- | ----------------------------- | ---------------------------------------------------------------- | ---------------- |
| Oud telefoonnummer in externe bronnen   | AI en klanten bellen verkeerd | Justis, telefoonboek, infobel, ProvenExpert                      | open (gebruiker) |
| Ads zonder meting tot opdrachtgever     | kosten zonder klanten         | NO-GO tot checklist groen (`google-ads.md`)                      | bewaakt          |
| Kleine vorderingen trekken              | verlies per dossier           | sturen op ≥ € 2.500 en herhaalvolume                             | bewaakt          |
| Cookie/tracking strijdig met verklaring | privacy- en vertrouwensschade | alleen cookieloze meting; wijziging = eerst verklaring + akkoord | ok               |
| Juridisch onjuiste content              | reputatie                     | primaire bronnen, halfjaarherinnering                            | ok               |
| Linkspam / gekochte links               | zoekmachinerisico             | alleen echte vermeldingen, sponsored gemarkeerd                  | ok               |
| Twee chats wijzigen dezelfde bestanden  | conflicten                    | `git pull --rebase`, kleine commits                              | ok               |
| Debiteurenverkeer als acquisitie tellen | verkeerde conclusies          | `/brief-ontvangen` en `/betalen` uitsluiten                      | ok               |
