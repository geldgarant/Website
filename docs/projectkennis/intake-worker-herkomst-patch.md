# Patch intake-worker: herkomst van vorderingen in de meldingsmail (12 nov 2026)

**Waarom.** Sinds 12 nov 2026 stuurt het formulier "vordering indienen" de herkomst mee (`src/lib/intake.ts`,
`herkomstVelden`), net als het contactformulier al deed: `bron_pagina`, `referrer`, `utm_source`, `utm_medium`,
`utm_campaign` in `metadata`. Geen cookies, geen opslag in de browser: het formulier leest dit op het moment van versturen.
Er is geen zichtbare bronvraag (besluit gebruiker); de bron wordt achteraf gevraagd en in het leadregister gezet.

**Zonder patch.** De worker bewaart `p.metadata` volledig in KV (`aanvraag/<dossierId>`), dus de herkomst staat in de
backup, maar niet in de interne mail. Het contactformulier toont herkomst al in de mail (sectie "Herkomst").

**Patch** (worker `geldgarant-intake-api`, code-kopie: `intake-worker-index.js`; eerst de live code in het dashboard
vergelijken met deze kopie). Vordering, interne mail (`internHtml`, sectie "Overig", rond regel 764), rijen toevoegen na
"Invulduur":

```js
["Pagina", r.metadata.bron_pagina],
["Referrer", r.metadata.referrer],
["UTM", [r.metadata.utm_source, r.metadata.utm_medium, r.metadata.utm_campaign].filter(Boolean).join(" / ")],
```

`rows()` slaat lege waarden over (controleren in de live code).

**Test.** Na deploy één testaanvraag met `?utm_source=test` en het KV-record en de mail controleren; testaanvraag niet
meetellen in het leadregister.

**Rollback.** Vorige versie in Workers → Deployments. De website werkt ook zonder patch (extra velden worden genegeerd).
