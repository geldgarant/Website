// Bouwt de plakklare CaseControl-e-mails: mails/src/<naam>.mjs -> mails/<naam>.html (+ .txt met onderwerp en
// preheader). Gebruik: node mails/tools/bouw.mjs [naam ...]   (zonder naam: alle mails)
// Controles: geen gedachtestreepjes, geen uitroeptekens, geen portaalinlog (B14), geen velden die niet bestaan (R-14).
import { readdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import * as b from "./bouwstenen.mjs";

const MAILS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(MAILS, "src");

const VERBODEN = [
  [/[—–]/, "gedachtestreepje"],
  [/!(?![^<]*>)/, "uitroepteken in tekst"],
  [/debtor_portal|raw_password/, "portaalinlog of wachtwoord (B14, R-04)"],
  [/case\.installment_amount|case\.outstanding_amount/, "veld bestaat niet in CaseControl (R-14)"],
  [/text_block\./, "oud tekstblok (kop/voet zitten in de bouwstenen)"],
  [/niet verzonden/i, "nooit 'beschouw als niet verzonden' (B29)"],
  [/Geachte relatie|correspondence_salutation/, "aanhef is altijd Hallo {{debtor.name}}, (B29)"],
];

const namen = process.argv.slice(2);
const bestanden = (await readdir(SRC)).filter((f) => f.endsWith(".mjs") && (!namen.length || namen.includes(f.slice(0, -4))));
let fouten = 0;

for (const f of bestanden.sort()) {
  const naam = f.slice(0, -4);
  const m = (await import(pathToFileURL(path.join(SRC, f)).href)).default;
  const html = b.omhul({ ...m, inhoud: m.inhoud(b) });
  const tekst = html.replace(/<!--[\s\S]*?-->/g, "");
  for (const [re, wat] of VERBODEN) {
    if (re.test(tekst) || re.test(m.onderwerp)) { console.error(`FOUT ${naam}: ${wat}`); fouten++; }
  }
  await writeFile(path.join(MAILS, `${naam}.html`), html, "utf8");
  await writeFile(path.join(MAILS, `${naam}.txt`), `Onderwerp: ${m.onderwerp}\nPreheader: ${m.preheader}\n`, "utf8");
  console.log(`mails/${naam}.html  (${html.length.toLocaleString("nl-NL")} tekens)`);
}
if (fouten) process.exit(1);
