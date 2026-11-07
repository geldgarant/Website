# Projectkennis (kopie uit het claude.ai-project, 7 nov 2026)

Deze bestanden stonden alleen in de projectkennis van het claude.ai-project "GeldGarant". Ze staan hier zodat een nieuw project of gesprek ze uit de repo kan halen. Ze worden niet gebouwd of gelint.

| Bestand | Wat |
| --- | --- |
| `../OVERDRACHT.md` | Startpunt en complete overdracht (leidend) |
| `intake-worker-index.js` | Code van de worker `geldgarant-intake-api` (api.geldgarant.com) |
| `intake-worker-setup.md` | Installatie van die worker (Resend, Telegram, KV, variabelen) |
| `intake-worker-sollicitatie.js` | Route `POST /api/sollicitatie` (nog in de worker te plakken) |
| `intake-worker-sollicitatie-installeren.md` | Stappen om die route toe te voegen |
| `GeldGarant_CaseControl_Context.md` | CaseControl-workflows, vrije velden, actie-id's (maart 2026, deels verouderd: rechtsvorm en kleuren volgen nu de site) |

Let op: in `intake-worker-setup.md` staat nog `CONTACT_PHONE` = `06 14 82 37 19`; het leidende nummer is 085 212 73 88 (zet dat ook in de worker).
