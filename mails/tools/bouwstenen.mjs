// Bouwstenen voor de CaseControl-e-mails, ontwerp v5 "brief" (12 nov 2026, mails/DESIGN.md).
// De mail is de digitale tegenhanger van de brief (brieven/src/deb-*.html): wit briefhoofd met logo en onze gegevens,
// referentieblok, blauw label boven de kop, donkere betaalbalk, specificatie met blauwe lijn boven het totaal,
// genummerde gevolgen, dezelfde secties en kleine letters. Eén letter (Arial/Helvetica), dezelfde kleuren.
// Alleen wat een mail beter kan dan papier wijkt af: een betaalknop onder de balk en klikbare links.
// Alleen inline stijlen (de editor bewaart geen <style>), één kolom, vloeiend tot max. 600 px.
// Opmaak hier, inhoud in mails/src/<naam>.mjs.

export const SITE = "https://geldgarant.com"
const LOGO = SITE + "/mail/logo.png" // public/mail/logo.png, 456x54, getoond op 152x18 (zoals de brief: donker logo op wit)
export const BRIEF = SITE + "/brief-ontvangen?dossier={{case.case_number}}"
export const REGELING = BRIEF + "&reden=regeling#regelen"
export const ONEENS = BRIEF + "&reden=oneens#regelen"
export const BETAALLINK = "{{case.online_payment_link}}"
export const TEL = "{{org_communication.telephone}}"
export const MAIL = "{{org_communication.email}}"

// Kleuren gelijk aan de brief (brieven/tools/bouw.mjs).
export const C = {
    ink: "#061126",
    tekst: "#2b3245",
    muted: "#6b7390",
    adres: "#5b6478",
    blauw: "#3069fe",
    blauwInk: "#1f4fd6",
    lijn: "#dfe3ec",
    pagina: "#e9ecf1",
    vlak: "#f3f4f7",
    balkLabel: "#b9c3dc",
    balkLijn: "#2a3550",
}
export const F = "font-family:Helvetica,Arial,sans-serif;"
const T = 'role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"'
const tabel = (inhoud, stijl = "") => `<table ${T} style="border-collapse:collapse; width:100%;${stijl}">${inhoud}</table>`
const NW = "white-space:nowrap;"
const ruimte = (px) => `<div style="height:${px}px; line-height:${px}px; font-size:0;">&nbsp;</div>`

// ---- Tekst -------------------------------------------------------------------------------------------------------

export const p = (inhoud, marge = "0 0 16px") =>
    `<p style="${F} margin:${marge}; font-size:15px; line-height:24px; color:${C.tekst};">${inhoud}</p>`
export const sterk = (t) => `<strong style="color:${C.ink};">${t}</strong>`
export const klein = (inhoud, marge = "10px 0 0") =>
    `<p style="${F} margin:${marge}; font-size:12px; line-height:18px; color:${C.muted};">${inhoud}</p>`
export const aanhef = () => p("Hallo {{debtor.name}},") // B29
export const link = (t, href) =>
    `<a href="${href}" target="_blank" style="color:${C.blauwInk}; font-weight:bold; text-decoration:underline;">${t}</a>`

// Blauw label in klein kapitaal boven de kop (brief: "LAATSTE AANMANING", "SOMMATIE").
export const label = (t, marge = "0 0 6px") =>
    `<p style="${F} margin:${marge}; font-size:11px; line-height:14px; letter-spacing:1.6px; text-transform:uppercase; font-weight:bold; color:${C.blauw};">${t}</p>`
export const h1 = (t, marge = "0 0 22px") =>
    `<h1 style="${F} margin:${marge}; font-size:23px; line-height:30px; font-weight:bold; color:${C.ink};">${t}</h1>`
export const h2 = (t, marge = "32px 0 10px") =>
    `<h2 style="${F} margin:${marge}; font-size:16px; line-height:22px; font-weight:bold; color:${C.ink};">${t}</h2>`

// ---- Referenties (zoals rechts naast het adresvenster in de brief) -------------------------------------------------

export const referenties = (rijen, marge = "0 0 30px") =>
    tabel(
        rijen
            .map(([l, w, nadruk], i) => {
                const rand = i === rijen.length - 1 ? "" : `border-bottom:1px solid ${C.lijn};`
                return (
                    `<tr><td style="${F} padding:5px 16px 5px 0; ${rand} font-size:13px; line-height:18px; color:${C.muted}; ${NW} vertical-align:top; width:1%;">${l}</td>` +
                    `<td style="${F} padding:5px 0; ${rand} font-size:13px; line-height:18px; color:${C.ink}; text-align:right; vertical-align:top;${nadruk ? " font-weight:bold;" : ""}">${w}</td></tr>`
                )
            })
            .join(""),
        ` margin:${marge};`,
    )

// ---- Betalen ---------------------------------------------------------------------------------------------------------

// De donkere balk uit de brief, voor een telefoon in twee rijen: bedrag groot, daaronder datum en kenmerk.
// Daaronder de betaalknop (het enige dat een mail meer heeft dan de brief) en overmaken in één regel.
export const betaalbalk = ({
    bedrag = "{{case.total_amount_due}}",
    termijn,
    kenmerk = "{{case.case_number}}",
    knoptekst,
    noot = "",
    labelBedrag = "Totaal te betalen",
}) => {
    const l = (t) =>
        `<p style="${F} margin:0; font-size:11px; line-height:14px; letter-spacing:0.8px; text-transform:uppercase; color:${C.balkLabel};">${t}</p>`
    const w = (t, px = 16, heel = false) =>
        `<p style="${F} margin:4px 0 0; font-size:${px}px; line-height:${Math.round(px * 1.25)}px; font-weight:bold; color:#ffffff;${heel ? " " + NW : ""}">${t}</p>`
    return (
        tabel(
            `<tr><td colspan="2" bgcolor="${C.ink}" style="background-color:${C.ink}; padding:18px 20px 16px;">${l(labelBedrag)}${w(bedrag, 28, true)}</td></tr>` +
                `<tr><td bgcolor="${C.ink}" style="background-color:${C.ink}; padding:14px 16px 18px 20px; border-top:1px solid ${C.balkLijn}; width:55%; vertical-align:top;">${l("Uiterlijk op")}${w(termijn)}</td>` +
                `<td bgcolor="${C.ink}" style="background-color:${C.ink}; padding:14px 16px 18px; border-top:1px solid ${C.balkLijn}; border-left:1px solid ${C.balkLijn}; vertical-align:top;">${l("Kenmerk")}${w(kenmerk)}</td></tr>`,
            " margin:4px 0 0;",
        ) +
        tabel(
            `<tr><td align="center" bgcolor="${C.blauw}" style="background-color:${C.blauw};">` +
                `<a href="${BETAALLINK}" target="_blank" style="${F} display:block; padding:16px 20px; font-size:16px; line-height:20px; font-weight:bold; color:#ffffff; text-decoration:none; text-align:center;">${knoptekst}</a></td></tr>`,
        ) +
        `<p style="${F} margin:14px 0 0; font-size:13px; line-height:20px; color:${C.muted};">Liever overmaken? ` +
        `<span style="color:${C.ink}; ${NW}">{{org_escrow_bank_account.iban}}</span> ten name van ` +
        `<span style="color:${C.ink};">{{org_escrow_bank_account.account_name}}</span>, onder vermelding van ` +
        `<strong style="color:${C.ink}; ${NW}">${kenmerk}</strong>.${noot}</p>` +
        ruimte(8)
    )
}

// Waar staat het dossier (sommatie): drie stappen, de huidige donker. Zoals in de brief.
export const stappen = (items) =>
    tabel(
        "<tr>" +
            items
                .map(
                    ([, , , kleur], i) =>
                        `<td style="height:5px; padding:0; background-color:${kleur}; font-size:0; line-height:0;${i ? ` border-left:4px solid #ffffff;` : ""}">&nbsp;</td>`,
                )
                .join("") +
            "</tr><tr>" +
            items
                .map(
                    ([status, kop, uitleg, kleur], i) =>
                        `<td style="${F} padding:8px 8px 0 ${i ? "6px" : "0"}; vertical-align:top; width:33%;">` +
                        `<p style="margin:0; font-size:10px; line-height:13px; letter-spacing:0.8px; text-transform:uppercase; font-weight:bold; color:${kleur === C.lijn ? C.muted : kleur === C.blauw ? C.blauwInk : C.ink};">${status}</p>` +
                        `<p style="margin:2px 0 0; font-size:12px; line-height:17px; font-weight:bold; color:${kleur === C.lijn ? C.muted : C.ink};">${kop}</p>` +
                        `<p style="margin:1px 0 0; font-size:12px; line-height:16px; color:${C.muted};">${uitleg}</p></td>`,
                )
                .join("") +
            "</tr>",
        " margin:22px 0 0;",
    )

// Kaartjes onder elkaar met een gekleurde linkerrand (B2C: "Betaalt u binnen 14 dagen?" / "Betaalt u niet op tijd?").
// Op papier staan ze naast elkaar; in een mail onder elkaar, zodat het op een telefoon leesbaar blijft.
export const kaarten = (items, marge = "16px 0 0") =>
    tabel(
        items
            .map(
                ([kop, tekst, kleur], i) =>
                    `<tr><td style="${F} padding:14px 16px; background-color:${C.vlak}; border-left:3px solid ${kleur || C.blauw};${i ? " border-top:8px solid #ffffff;" : ""}">` +
                    `<p style="margin:0 0 4px; font-size:15px; line-height:21px; font-weight:bold; color:${C.ink};">${kop}</p>` +
                    `<p style="margin:0; font-size:14px; line-height:21px; color:${C.tekst};">${tekst}</p></td></tr>`,
            )
            .join(""),
        ` margin:${marge};`,
    )

// ---- Specificatie en gevolgen ------------------------------------------------------------------------------------

export const specificatie = (items) =>
    tabel(
        items
            .map(([l, w], i) => {
                const tot = i === items.length - 1
                const rand = tot ? `border-top:2px solid ${C.blauw};` : `border-bottom:1px solid ${C.lijn};`
                const s = tot ? `font-size:15px; font-weight:bold; color:${C.ink};` : `font-size:14px; color:${C.tekst};`
                return (
                    `<tr><td style="${F} padding:${tot ? "12px" : "9px"} 14px 9px 0; ${rand} line-height:20px; ${s} vertical-align:top;">${l}</td>` +
                    `<td align="right" style="${F} padding:${tot ? "12px" : "9px"} 0 9px; ${rand} line-height:20px; ${s} font-weight:bold; vertical-align:top; ${NW}">${w}</td></tr>`
                )
            })
            .join(""),
    )

export const gevolgen = (items) =>
    tabel(
        items
            .map((s, i) => {
                const rand = `border-bottom:1px solid ${C.lijn};${i === 0 ? ` border-top:1px solid ${C.ink};` : ""}`
                return (
                    `<tr><td style="${F} width:30px; padding:11px 0 10px; ${rand} font-size:12px; line-height:21px; font-weight:bold; letter-spacing:0.8px; color:${C.blauwInk}; vertical-align:top;">0${i + 1}</td>` +
                    `<td style="${F} padding:11px 0 10px; ${rand} font-size:15px; line-height:21px; color:${C.tekst}; vertical-align:top;">${s}</td></tr>`
                )
            })
            .join(""),
    )

// Contactrij uit de brief, voor een telefoon als 2 x 2.
// og = true: voor de opdrachtgever (geen debiteurenpagina, wel het portaal).
export const contact = ({ og = false } = {}) => {
    const cel = (l, w, x, rand) =>
        `<td style="${F} padding:12px 6px 12px 0; vertical-align:top; width:50%;${rand}">` +
        `<p style="margin:0; font-size:11px; line-height:14px; letter-spacing:0.8px; text-transform:uppercase; font-weight:bold; color:${C.blauw};">${l}</p>` +
        `<p style="margin:3px 0 0; font-size:13px; line-height:19px; font-weight:bold; color:${C.ink};">${w}</p>` +
        `<p style="margin:1px 0 0; font-size:12px; line-height:16px; color:${C.muted};">${x}</p></td>`
    const a = (href, t) => `<a href="${href}" style="color:${C.ink}; text-decoration:none;">${t}</a>`
    const b = ` border-bottom:1px solid ${C.lijn};`
    return tabel(
        `<tr>${cel("Bellen", a(`tel:${TEL}`, TEL), "op werkdagen", b)}${cel("E-mail", a(`mailto:${MAIL}`, MAIL), "noem uw dossiernummer", b)}</tr>` +
            `<tr>${og ? cel("Online", a(SITE, "geldgarant.com"), "stand van zaken in uw portaal", "") : cel("Online", a(BRIEF, "geldgarant.com/brief-ontvangen"), "betalen, regeling, reactie", "")}${cel("Op kantoor", "{{org_visiting_address.street}} {{org_visiting_address.house_no}}, {{org_visiting_address.city}}", "op afspraak", "")}</tr>`,
        ` margin:28px 0 0; border-top:1px solid ${C.lijn}; border-bottom:1px solid ${C.lijn};`,
    )
}

// Debiteur: "Hoogachtend," (formeel stuk). Opdrachtgever: "Met vriendelijke groet,".
export const slot = (groet = "Hoogachtend,") =>
    `<p style="${F} margin:28px 0 4px; font-size:15px; line-height:24px; color:${C.tekst};">${groet}</p>` +
    `<p style="${F} margin:0; font-size:15px; line-height:22px; font-weight:bold; color:${C.ink};">GeldGarant</p>` +
    `<p style="${F} margin:0; font-size:15px; line-height:22px; color:${C.tekst};">Afdeling incasso</p>`

// ---- Briefhoofd en voet --------------------------------------------------------------------------------------------

// Wit briefhoofd zoals de brief: logo links, onze gegevens rechts, haarlijn eronder.
const kop = () =>
    `<tr><td style="padding:30px 30px 22px; border-bottom:1px solid ${C.lijn};">` +
    tabel(
        `<tr><td style="vertical-align:top;"><a href="${SITE}" target="_blank" style="text-decoration:none;"><img src="${LOGO}" width="152" height="18" alt="GeldGarant" style="display:block; border:0; width:152px; height:18px; ${F} font-size:18px; font-weight:bold; color:${C.ink};"></a></td>` +
            `<td align="right" style="${F} vertical-align:top; font-size:11px; line-height:15px; color:${C.adres};">` +
            `<strong style="color:${C.ink};">GeldGarant</strong><br>{{org_visiting_address.street}} {{org_visiting_address.house_no}}<br>{{org_visiting_address.zipcode}} {{org_visiting_address.city}}<br>` +
            `<a href="tel:${TEL}" style="color:${C.adres}; text-decoration:none; ${NW}">${TEL}</a></td></tr>`,
    ) +
    `</td></tr>`

// Kleine letters van de brief, op een licht vlak.
const voet = (ontvanger) => {
    const k = `${F} font-size:11px; line-height:17px; color:${C.muted};`
    const namens =
        ontvanger === "og"
            ? ""
            : " Wij handelen in opdracht van en namens {{creditor.name}}. Betalingen die wij ontvangen, staan op onze derdengeldenrekening en dragen wij af aan onze opdrachtgever."
    return (
        `<tr><td style="padding:22px 30px 26px; background-color:${C.vlak}; border-top:1px solid ${C.lijn};">` +
        `<p style="${k} margin:0 0 8px;">GeldGarant is als incassodienstverlener ingeschreven in het Incassoregister van Justis onder nummer {{org_registration.business_license_number}}. KvK {{org_registration.chamber_of_commerce_number}}.${namens} Heeft u een klacht over onze werkwijze? Lees dan onze <a href="${SITE}/klachtenregelement" target="_blank" style="color:${C.muted};">klachtenregeling</a>.</p>` +
        (ontvanger === "og"
            ? ""
            : `<p style="${k} margin:0 0 8px;">Geldzorgen? Uw gemeente helpt gratis, net als Geldfit (geldfit.nl, 0800 8115). Loopt het u boven het hoofd? Praat erover met 113 Zelfmoordpreventie, gratis via 0800 0113 of 113.nl.</p>`) +
        `<p style="${k} margin:0;">GeldGarant&nbsp; | &nbsp;{{org_visiting_address.street}} {{org_visiting_address.house_no}}, {{org_visiting_address.zipcode}} {{org_visiting_address.city}}&nbsp; | &nbsp;<a href="${SITE}" target="_blank" style="color:${C.muted}; text-decoration:none;">geldgarant.com</a></p></td></tr>`
    )
}

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export const omhul = ({ onderwerp, preheader, inhoud, ontvanger = "deb" }) =>
    '<!DOCTYPE html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<meta name="color-scheme" content="light">\n<meta name="supported-color-schemes" content="light">\n' +
    `<title>${escape(onderwerp)}</title>\n</head>\n` +
    `<body style="margin:0; padding:0; background-color:${C.pagina};"><!-- ONDERWERP: ${onderwerp} -->\n` +
    `<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:${C.pagina};">${escape(preheader)}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>\n` +
    tabel(
        `<tr><td align="center" style="padding:28px 10px;">` +
            `<table ${T} style="border-collapse:collapse; width:100%; max-width:600px; background-color:#ffffff; border:1px solid ${C.lijn};">` +
            kop() +
            `<tr><td style="padding:26px 30px 36px;">${inhoud}</td></tr>` +
            voet(ontvanger) +
            "</table></td></tr>",
        ` background-color:${C.pagina};`,
    ) +
    "\n</body>\n</html>\n"
