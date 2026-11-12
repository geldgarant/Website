// Bouwstenen voor de CaseControl-e-mails, ontwerp v4 "kantoor" (zie mails/DESIGN.md).
// Uitstraling van een advocaten- of notarisbrief: donkere kopbalk, klassieke schreefletter voor kop en bedrag,
// veel wit, dunne lijnen, één blauwe knop. Alleen inline stijlen (de editor bewaart geen <style>), één kolom,
// vloeiend tot max. 600 px. Wijzig opmaak hier, inhoud in mails/src/<naam>.mjs.

export const SITE = "https://geldgarant.com";
const LOGO_WIT = SITE + "/mail/logo-wit.png"; // public/mail/logo-wit.png, 456x54, getoond op 148x18
export const BRIEF = SITE + "/brief-ontvangen?dossier={{case.case_number}}";
export const REGELING = BRIEF + "&reden=regeling#regelen";
export const ONEENS = BRIEF + "&reden=oneens#regelen";
export const BETAALLINK = "{{case.online_payment_link}}";
export const TEL = "{{org_communication.telephone}}";
export const MAIL = "{{org_communication.email}}";

export const C = {
  ink: "#061126", tekst: "#1f2a44", muted: "#6a7390", zacht: "#8a92aa", blauw: "#3069fe", blauwInk: "#1f4fd6",
  lijn: "#dde1ea", lijnZacht: "#eceff4", pagina: "#e9ecf1", vlak: "#f6f7fa", kopTekst: "#aab6d3",
};
export const F = "font-family:Arial,Helvetica,sans-serif;";
export const S = "font-family:Georgia,'Times New Roman',Times,serif;"; // schreef: kop, bedrag, nummers
const T = 'role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"';
const tabel = (inhoud, stijl = "") => `<table ${T} style="border-collapse:collapse; width:100%;${stijl}">${inhoud}</table>`;
const NUM = "font-variant-numeric:tabular-nums; white-space:nowrap;";

// ---- Tekst -------------------------------------------------------------------------------------------------------

export const p = (inhoud, marge = "0 0 16px") =>
  `<p style="${F} margin:${marge}; font-size:15px; line-height:25px; color:${C.tekst};">${inhoud}</p>`;
export const sterk = (t) => `<strong style="color:${C.ink};">${t}</strong>`;
export const klein = (inhoud, marge = "12px 0 0") =>
  `<p style="${F} margin:${marge}; font-size:12px; line-height:19px; color:${C.muted};">${inhoud}</p>`;
export const aanhef = () => p("Hallo {{debtor.name}},"); // B29

// Klein kapitaal met ruime spatiëring: alleen als rubriek boven een blok.
export const label = (t, marge = "0 0 12px", kleur = C.muted) =>
  `<p style="${F} margin:${marge}; font-size:11px; line-height:14px; letter-spacing:2px; text-transform:uppercase; font-weight:700; color:${kleur};">${t}</p>`;

export const h1 = (t, marge = "0 0 14px") =>
  `<h1 style="${S} margin:${marge}; font-size:30px; line-height:37px; font-weight:700; letter-spacing:-0.2px; color:${C.ink};">${t}</h1>`;

export const h2 = (t, marge = "36px 0 14px") => label(t, marge, C.ink);

export const link = (t, href) =>
  `<a href="${href}" target="_blank" style="color:${C.blauwInk}; font-weight:700; text-decoration:underline;">${t}</a>`;

export const lead = (inhoud, marge = "0 0 28px") =>
  `<p style="${F} margin:${marge}; font-size:16px; line-height:26px; color:${C.tekst};">${inhoud}</p>`;

export const lijn = (marge = "32px 0") =>
  tabel(`<tr><td style="border-top:1px solid ${C.lijn}; font-size:0; line-height:0;">&nbsp;</td></tr>`, ` margin:${marge};`);

// ---- Betalen (bovenaan) --------------------------------------------------------------------------------------------

// Knop over de volle breedte, bijna rechte hoeken. Werkt in Outlook zonder VML.
export const knop = (t, href = BETAALLINK) =>
  tabel(`<tr><td align="center" bgcolor="${C.blauw}" style="background-color:${C.blauw}; border-radius:3px;">` +
    `<a href="${href}" target="_blank" style="${F} display:block; padding:17px 20px; font-size:16px; line-height:20px; font-weight:700; letter-spacing:0.2px; color:#ffffff; text-decoration:none; text-align:center;">${t}</a></td></tr>`);

// Het betaalblok: rubriek, groot bedrag in schreefletter, uiterste datum en kenmerk, knop, overmaken in één regel.
// Kader met een donkere bovenrand: leest als het kernstuk van een officieel document.
export const betaalblok = ({ bedrag = "{{case.total_amount_due}}", termijn, kenmerk = "{{case.case_number}}", knoptekst }) =>
  tabel(`<tr><td style="padding:24px 22px 20px; border:1px solid ${C.lijn}; border-top:3px solid ${C.ink}; background-color:#ffffff;">` +
    label("Te betalen", "0 0 6px") +
    `<p style="${F} margin:0 0 16px; font-size:34px; line-height:40px; font-weight:700; letter-spacing:-0.6px; color:${C.ink}; ${NUM}">${bedrag}</p>` +
    tabel(`<tr><td style="${F} padding:11px 0; border-top:1px solid ${C.lijn}; border-bottom:1px solid ${C.lijn}; font-size:14px; line-height:20px; color:${C.muted};">Uiterlijk op</td>` +
      `<td align="right" style="${F} padding:11px 0; border-top:1px solid ${C.lijn}; border-bottom:1px solid ${C.lijn}; font-size:15px; line-height:20px; font-weight:700; color:${C.ink}; ${NUM}">${termijn}</td></tr>`) +
    `<div style="height:22px; line-height:22px; font-size:0;">&nbsp;</div>` +
    knop(knoptekst) +
    `<p style="${F} margin:16px 0 0; font-size:13px; line-height:21px; color:${C.muted};">Liever overmaken? ` +
      `<span style="color:${C.ink}; ${NUM}">{{org_escrow_bank_account.iban}}</span> ten name van ` +
      `<span style="color:${C.ink};">{{org_escrow_bank_account.account_name}}</span>, onder vermelding van ` +
      `<span style="color:${C.ink}; font-weight:700; ${NUM}">${kenmerk}</span>.</p>` +
    `</td></tr>`, " margin:0 0 32px;");

// ---- Gevolgen --------------------------------------------------------------------------------------------------------

// Genummerde stappen met nummers in schreefletter. Strikt en feitelijk: wat er gebeurt, in volgorde.
export const gevolgen = (kop, stappen) =>
  label(kop, "0 0 14px", C.ink) +
  tabel(stappen.map((s, i) => {
    const rand = i === 0 ? `border-top:1px solid ${C.ink};` : `border-top:1px solid ${C.lijn};`;
    return `<tr><td style="${F} width:34px; padding:16px 0 14px; ${rand} font-size:13px; line-height:21px; font-weight:700; letter-spacing:1px; color:${C.blauwInk}; vertical-align:top;">0${i + 1}</td>` +
      `<td style="${F} padding:15px 0 14px; ${rand} font-size:15px; line-height:23px; color:${C.tekst}; vertical-align:top;">${s}</td></tr>`;
  }).join("") + `<tr><td colspan="2" style="border-top:1px solid ${C.lijn}; font-size:0; line-height:0;">&nbsp;</td></tr>`);

// ---- Specificatie ----------------------------------------------------------------------------------------------------

export const specificatie = (items) => {
  const rows = items.map(([l, w], i) => {
    const tot = i === items.length - 1;
    const rand = tot ? `border-top:1px solid ${C.ink};` : `border-top:1px solid ${C.lijn};`;
    const stijlL = tot ? `font-weight:700; color:${C.ink};` : `color:${C.tekst};`;
    const stijlW = tot ? `${F} font-size:16px; font-weight:700;` : `${F} font-size:14px;`;
    return `<tr><td style="${F} padding:12px 16px 12px 0; ${rand} font-size:14px; line-height:21px; ${stijlL} vertical-align:bottom;">${l}</td>` +
      `<td align="right" style="padding:12px 0; ${rand} line-height:21px; color:${C.ink}; vertical-align:bottom; ${stijlW} ${NUM}">${w}</td></tr>`;
  }).join("");
  return tabel(rows + `<tr><td colspan="2" style="border-top:1px solid ${C.ink}; font-size:0; line-height:0;">&nbsp;</td></tr>`);
};

// Gegevens als in een brief: twee kolommen, klein en rustig.
export const gegevens = (items, marge = "0 0 28px") =>
  tabel(items.map(([l, w]) =>
    `<tr><td style="${F} padding:3px 18px 3px 0; font-size:13px; line-height:20px; color:${C.muted}; white-space:nowrap; vertical-align:top; width:1%;">${l}</td>` +
    `<td style="${F} padding:3px 0; font-size:13px; line-height:20px; color:${C.ink}; vertical-align:top;">${w}</td></tr>`).join(""),
    ` margin:${marge};`);

// Regeling of bezwaar: geen vlak, alleen tekst en twee links onder een haarlijn.
export const contact = ({ kop, tekst }) =>
  label(kop, "36px 0 10px", C.ink) +
  `<p style="${F} margin:0; font-size:14px; line-height:23px; color:${C.tekst};">${tekst}</p>` +
  `<p style="${F} margin:12px 0 0; font-size:14px; line-height:23px; color:${C.tekst};">` +
  `${link("Regeling voorstellen", REGELING)}&nbsp;&nbsp;&nbsp;${link("Bezwaar of betaalbewijs sturen", ONEENS)}</p>` +
  `<p style="${F} margin:10px 0 0; font-size:14px; line-height:23px; color:${C.tekst};">Telefonisch: ${sterk(TEL)}, op werkdagen.</p>`;

// ---- Ondertekening, kop en voet ------------------------------------------------------------------------------------

export const slot = () =>
  `<p style="${F} margin:40px 0 0; font-size:15px; line-height:25px; color:${C.tekst};">Hoogachtend,</p>` +
  `<p style="${S} margin:14px 0 0; font-size:18px; line-height:24px; font-weight:700; color:${C.ink};">GeldGarant</p>` +
  `<p style="${F} margin:2px 0 0; font-size:13px; line-height:20px; color:${C.muted};">Afdeling incasso</p>`;

// Donkere kopbalk: wit logo links, documentsoort en dossiernummer rechts. Dunne blauwe lijn eronder.
const kop = (soort) =>
  `<tr><td bgcolor="${C.ink}" style="padding:24px 30px; background-color:${C.ink};">` +
  tabel(`<tr><td style="vertical-align:middle;"><a href="${SITE}" target="_blank" style="text-decoration:none;"><img src="${LOGO_WIT}" width="148" height="18" alt="GeldGarant" style="display:block; border:0; width:148px; height:18px; ${F} font-size:18px; font-weight:700; color:#ffffff;"></a></td>` +
    `<td align="right" style="vertical-align:middle;">` +
      `<p style="${F} margin:0; font-size:11px; line-height:14px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; color:#ffffff;">${soort}</p>` +
      `<p style="${F} margin:4px 0 0; font-size:12px; line-height:16px; color:${C.kopTekst}; ${NUM}">Dossier {{case.case_number}}</p></td></tr>`) +
  `</td></tr>` +
  `<tr><td style="height:3px; background-color:${C.blauw}; font-size:0; line-height:0;">&nbsp;</td></tr>`;

const voet = (extra, ontvanger) => {
  const k = `${F} font-size:12px; line-height:19px; color:${C.muted};`;
  const namens = ontvanger === "og" ? "" :
    " Wij treden op in opdracht van {{creditor.name}}. Betalingen komen binnen op onze derdengeldenrekening en worden afgedragen aan onze opdrachtgever.";
  return `<tr><td style="padding:24px 30px 28px; background-color:${C.vlak}; border-top:1px solid ${C.lijn};">` +
    `<p style="${k} margin:0 0 10px;"><strong style="color:${C.ink};">GeldGarant</strong>&nbsp;&nbsp;{{org_visiting_address.street}} {{org_visiting_address.house_no}}, {{org_visiting_address.zipcode}} {{org_visiting_address.city}}<br>` +
    `<a href="tel:${TEL}" style="color:${C.muted}; text-decoration:none; white-space:nowrap;">${TEL}</a> &nbsp;· <a href="mailto:${MAIL}" style="color:${C.muted}; text-decoration:none; white-space:nowrap;">${MAIL}</a> &nbsp;· <a href="${SITE}" target="_blank" style="color:${C.muted}; text-decoration:none;">geldgarant.com</a></p>` +
    `<p style="${k} margin:0 0 10px;">Geregistreerd bij Justis in het Incassoregister onder nummer {{org_registration.business_license_number}}. KvK {{org_registration.chamber_of_commerce_number}}.${namens}</p>` +
    `<p style="${k} margin:0;">Een klacht over onze werkwijze? Zie onze <a href="${SITE}/klachtenregelement" target="_blank" style="color:${C.muted};">klachtenregeling</a>.${extra}</p></td></tr>`;
};

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const omhul = ({ onderwerp, preheader, soort, inhoud, voetExtra = "", ontvanger = "deb" }) =>
  '<!DOCTYPE html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '<meta name="color-scheme" content="light">\n<meta name="supported-color-schemes" content="light">\n' +
  `<title>${escape(onderwerp)}</title>\n</head>\n` +
  `<body style="margin:0; padding:0; background-color:${C.pagina};"><!-- ONDERWERP: ${onderwerp} -->\n` +
  `<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:${C.pagina};">${escape(preheader)}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>\n` +
  tabel(`<tr><td align="center" style="padding:32px 12px;">` +
    `<table ${T} style="border-collapse:collapse; width:100%; max-width:600px; background-color:#ffffff; border:1px solid ${C.lijn};">` +
    kop(soort) + `<tr><td style="padding:38px 30px 42px;">${inhoud}</td></tr>` + voet(voetExtra, ontvanger) +
    "</table></td></tr>", ` background-color:${C.pagina};`) +
  "\n</body>\n</html>\n";
