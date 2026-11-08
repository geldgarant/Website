#!/usr/bin/env python3
"""Bouwt de plakklare CaseControl-e-mails (mails/<naam>.html) uit de inhoud hieronder.

Waarom zo: de CaseControl-editor bewaart alleen inline stijlen (geen <style>, geen media queries), dus elke stijl
staat hier één keer en wordt inline gezet. De opbouw is daardoor op elk scherm vloeiend (één kolom, max. 600 px)
zonder media queries, en werkt in Outlook, Gmail en Apple Mail. Teksten volgen de brieven in brieven/src.

Gebruik:  python3 mails/tools/bouw.py            schrijft mails/<naam>.html en mails/<naam>.txt (onderwerp, preheader)
Voorbeeld: node mails/tools/voorbeeld.mjs <naam>  (vult mails/voorbeeld/<naam>.json in en maakt screenshots)
"""
import html, pathlib

HIER = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://geldgarant.com"
LOGO = SITE + "/mail/logo.png"  # public/mail/logo.png, 456x54, getoond op 178x21

# Kleuren uit het ontwerpsysteem van de site (src/styles/global.css)
INK, TEKST, MUTED, LIJN, SURFACE, BLAUW, BLAUW_INK, ACHTERGROND = (
    "#061126", "#2b3245", "#5d6680", "#e3e7ef", "#f3f4f7", "#3069fe", "#1f4fd6", "#eef0f5")
F = "font-family:Helvetica,Arial,sans-serif;"

def tekst(s):
    return s  # inhoud hieronder is al HTML (met {{velden}}); geen escaping nodig

def p(inhoud, marge="0 0 16px"):
    return f'<p style="{F} margin:{marge}; font-size:15px; line-height:24px; color:{TEKST};">{inhoud}</p>'

def label(t, kleur=BLAUW_INK):
    return (f'<div style="{F} font-size:11px; line-height:16px; letter-spacing:1px; text-transform:uppercase;'
            f' font-weight:bold; color:{kleur};">{t}</div>')

def h2(t):
    return f'<h2 style="{F} margin:0 0 10px; font-size:17px; line-height:24px; font-weight:bold; color:{INK};">{t}</h2>'

BEDRAG = "{{case."  # bedragen (case.*) nooit afbreken; namen en lijsten mogen wel

def rijen(items, kleur_l=MUTED, kleur_w=INK, lijn=LIJN, totaal_laatste=False):
    out = []
    for i, (l, w) in enumerate(items):
        vet = totaal_laatste and i == len(items) - 1
        rand = f"border-top:{'2px' if vet else '1px'} solid {INK if vet else lijn};"
        out.append(
            f'<tr><td style="{F} padding:10px 16px 10px 0; {rand} font-size:14px; line-height:20px;'
            f' color:{INK if vet else kleur_l};{" font-weight:bold;" if vet else ""} vertical-align:top;">{l}</td>'
            f'<td align="right" style="{F} padding:10px 0; {rand} font-size:{15 if vet else 14}px; line-height:20px;'
            f' font-weight:bold; color:{kleur_w}; vertical-align:top;{" white-space:nowrap;" if BEDRAG in w else ""}">{w}</td></tr>')
    return ('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"'
            ' style="border-collapse:collapse; width:100%;">' + "".join(out) + "</table>")

def kaart(inhoud, achtergrond="#ffffff", rand=LIJN, padding="18px 20px", marge="0 0 16px"):
    return (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"'
            f' style="border-collapse:separate; width:100%; margin:{marge};">'
            f'<tr><td style="padding:{padding}; background-color:{achtergrond}; border:1px solid {rand};'
            f' border-radius:12px;">{inhoud}</td></tr></table>')

def kernblok(items):
    """Navy blok met bedrag, datum en kenmerk: het belangrijkste staat in één oogopslag."""
    rows = "".join(
        f'<tr><td style="{F} padding:12px 0;{" border-top:1px solid #23304d;" if i else ""} font-size:13px;'
        f' line-height:18px; color:#b9c3dc; vertical-align:middle;">{l}</td>'
        f'<td align="right" style="{F} padding:12px 0;{" border-top:1px solid #23304d;" if i else ""}'
        f' font-size:{20 if i == 0 else 15}px; line-height:24px; font-weight:bold; color:#ffffff;'
        f' vertical-align:middle;">{w}</td></tr>'
        for i, (l, w) in enumerate(items))
    return ('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"'
            ' style="border-collapse:separate; width:100%; margin:4px 0 20px;"><tr>'
            f'<td style="padding:6px 20px; background-color:{INK}; border-radius:12px;">'
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"'
            f' style="border-collapse:collapse; width:100%;">{rows}</table></td></tr></table>')

def knop(t, href):
    """Bulletproof knop: gekleurde cel met link, werkt ook in Outlook (zonder VML, want de editor stript commentaar)."""
    return ('<table role="presentation" cellpadding="0" cellspacing="0" border="0"'
            ' style="border-collapse:separate; margin:0 0 10px;"><tr>'
            f'<td align="center" bgcolor="{BLAUW}" style="background-color:{BLAUW}; border-radius:999px;">'
            f'<a href="{href}" target="_blank" style="{F} display:inline-block; padding:15px 30px; font-size:16px;'
            f' line-height:20px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:999px;">'
            f'{t}&nbsp;&nbsp;&rarr;</a></td></tr></table>')

def link(t, href):
    return (f'<a href="{href}" target="_blank" style="color:{INK}; font-weight:bold; text-decoration:underline;'
            f' text-decoration-color:{BLAUW};">{t}</a>')

def actie(kop, inhoud, linktekst=None, href=None):
    extra = f'<div style="{F} margin-top:8px; font-size:14px; line-height:20px;">{link(linktekst, href)}</div>' if href else ""
    return (f'<tr><td style="padding:16px 0; border-top:1px solid {LIJN};">'
            f'<div style="{F} font-size:15px; line-height:22px; font-weight:bold; color:{INK};">{kop}</div>'
            f'<div style="{F} margin-top:4px; font-size:14px; line-height:22px; color:{TEKST};">{inhoud}</div>'
            f'{extra}</td></tr>')

def acties(items):
    return ('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"'
            ' style="border-collapse:collapse; width:100%; margin:8px 0 8px;">' + "".join(items) + "</table>")

BRIEF = SITE + "/brief-ontvangen?dossier={{case.case_number}}"

def overmaken():
    return kaart(
        label("Liever overmaken") + '<div style="height:8px; line-height:8px;">&nbsp;</div>' +
        rijen([("IBAN", "{{org_escrow_bank_account.iban}}"),
               ("Ten name van", "{{org_escrow_bank_account.account_name}}"),
               ("BIC", "{{org_escrow_bank_account.bic}}"),
               ("Kenmerk", "{{case.case_number}}")]) +
        f'<div style="{F} margin-top:10px; font-size:13px; line-height:20px; color:{MUTED};">'
        "Vermeld altijd uw dossiernummer als kenmerk. Dan komt uw betaling goed terecht.</div>",
        achtergrond=SURFACE, rand=SURFACE)

def portaal():
    return kaart(
        label("Uw dossier online", MUTED) +
        f'<div style="{F} margin:8px 0 6px; font-size:14px; line-height:22px; color:{TEKST};">'
        "In het debiteurenportaal ziet u uw dossier en kunt u stukken, zoals een betaalbewijs, veilig aanleveren.</div>" +
        rijen([("Portaal", '<a href="{{misc.debtor_portal_url}}" target="_blank" style="color:' + BLAUW_INK + '; word-break:break-all;">{{misc.debtor_portal_url}}</a>'),
               ("Gebruikersnaam", "{{debtor.debtor_portal_username}}"),
               ("Wachtwoord", "{{debtor.debtor_portal_password}}")]),
        rand=LIJN, marge="8px 0 24px")

def slot():
    return (p("Met vriendelijke groet,", "8px 0 4px") +
            f'<p style="{F} margin:0 0 28px; font-size:15px; line-height:22px; color:{INK};"><strong>GeldGarant</strong><br>'
            f'<span style="color:{MUTED};">Afdeling incasso, namens {{{{creditor.name}}}}</span></p>')

def kop(soort):
    return (
        '<tr><td style="padding:24px 24px 20px; border-bottom:3px solid ' + BLAUW + ';">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:100%;"><tr>'
        f'<td style="vertical-align:middle;"><a href="{SITE}" target="_blank" style="text-decoration:none;">'
        f'<img src="{LOGO}" width="178" height="21" alt="GeldGarant" style="display:block; border:0; width:178px; height:21px; {F} font-size:20px; font-weight:bold; color:{INK};"></a></td>'
        f'<td align="right" style="vertical-align:middle; {F} font-size:12px; line-height:18px; color:{MUTED};">'
        f'{soort}<br><strong style="color:{INK};">Dossier {{{{case.case_number}}}}</strong></td>'
        '</tr></table></td></tr>')

def voet(extra=""):
    klein = f"{F} font-size:12px; line-height:19px; color:{MUTED};"
    return (
        f'<tr><td style="padding:24px 24px 28px; background-color:{SURFACE};">'
        f'<p style="{klein} margin:0 0 10px; color:{INK};"><strong>GeldGarant</strong>&nbsp;&nbsp;'
        "{{org_visiting_address.street}} {{org_visiting_address.house_no}}, {{org_visiting_address.zipcode}} {{org_visiting_address.city}}<br>"
        f'<a href="tel:{{{{org_communication.telephone}}}}" style="color:{INK}; text-decoration:none;">{{{{org_communication.telephone}}}}</a> (werkdagen)&nbsp;&nbsp;'
        f'<a href="mailto:{{{{org_communication.email}}}}" style="color:{INK}; text-decoration:none;">{{{{org_communication.email}}}}</a>&nbsp;&nbsp;'
        f'<a href="{SITE}" target="_blank" style="color:{INK}; text-decoration:none;">geldgarant.com</a></p>'
        f'<p style="{klein} margin:0 0 10px;">GeldGarant is als incassodienstverlener ingeschreven in het Incassoregister van Justis onder nummer '
        "{{org_registration.business_license_number}}. KvK {{org_registration.chamber_of_commerce_number}}. Wij handelen in opdracht van en namens "
        "{{creditor.name}}. Betalingen die wij ontvangen, staan op onze derdengeldenrekening en dragen wij af aan onze opdrachtgever.</p>"
        f'<p style="{klein} margin:0;">Een klacht over onze werkwijze? Lees onze '
        f'<a href="{SITE}/klachtenregelement" target="_blank" style="color:{MUTED};">klachtenregeling</a>.{extra}</p>'
        "</td></tr>")

def pil(t, kleur=BLAUW_INK, achter="#e8efff"):
    return (f'<div style="margin:0 0 16px;"><span style="{F} display:inline-block; padding:6px 12px; background-color:{achter};'
            f' border-radius:999px; font-size:11px; line-height:14px; letter-spacing:1px; text-transform:uppercase;'
            f' font-weight:bold; color:{kleur};">{t}</span></div>')

def h1(t):
    return f'<h1 style="{F} margin:0 0 20px; font-size:26px; line-height:33px; font-weight:bold; color:{INK};">{t}</h1>'

def omhul(onderwerp, preheader, soort, inhoud, voet_extra=""):
    ph = html.escape(preheader, quote=False)
    return (
        '<!DOCTYPE html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<meta name="color-scheme" content="light">\n<meta name="supported-color-schemes" content="light">\n'
        f'<title>{html.escape(onderwerp)}</title>\n</head>\n'
        f'<body style="margin:0; padding:0; background-color:{ACHTERGROND};">'
        f'<!-- ONDERWERP: {onderwerp} -->\n'
        f'<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:{ACHTERGROND};">'
        f'{ph}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>\n'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:100%; background-color:{ACHTERGROND};">'
        '<tr><td align="center" style="padding:24px 8px;">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"'
        f' style="border-collapse:separate; width:100%; max-width:600px; background-color:#ffffff; border:1px solid {LIJN}; border-radius:16px; overflow:hidden;">'
        + kop(soort) +
        f'<tr><td style="padding:28px 24px 4px;">{inhoud}</td></tr>'
        + voet(voet_extra) +
        '</table></td></tr></table>\n</body>\n</html>\n')

# ---------------------------------------------------------------------------------------------------------------
# De drie e-mails. Termijnen, bedragen en verplichte onderdelen gelijk aan de brieven.

D7, D5 = "{{misc.today_plus_7_business_days}}", "{{misc.today_plus_5_business_days}}"
SPEC_B2B = [
    ("Opdrachtgever", "{{creditor.name}}"),
    ("Factuurnummer(s)", "{{claims.all_numbers}}"),
    ("Hoofdsom", "{{case.capital_amount}}"),
    ("Wettelijke handelsrente t/m {{misc.today}}", "{{case.interest}}"),
    ("Incassokosten (wettelijke staffel)", "{{case.penalty_amount_incl_vat}}"),
    ("Totaal te betalen", "{{case.total_amount_due}}"),
]
SPEC_NOOT = (f'<div style="{F} margin-top:10px; font-size:13px; line-height:20px; color:{MUTED};">'
             "De rente loopt door tot de dag van betaling. Mist u een betaling in dit overzicht? Laat het ons weten, dan zoeken wij het uit.</div>")

def specificatie(items, noot=SPEC_NOOT):
    return kaart(label("Specificatie") + '<div style="height:6px; line-height:6px;">&nbsp;</div>' +
                 rijen(items, totaal_laatste=True) + noot)

MAILS = {}

MAILS["aanmaning-1-b2b"] = dict(
    onderwerp="Aanmaning: uw betaling aan {{creditor.name}} staat open (dossier {{case.case_number}})",
    preheader="Betaal {{case.total_amount_due}} uiterlijk op " + D7 + ". Met iDEAL regelt u het direct vanuit deze e-mail.",
    soort="Aanmaning",
    inhoud=lambda: (
        pil("Aanmaning") +
        h1("Uw betaling aan {{creditor.name}} staat nog open") +
        p("{{debtor.correspondence_salutation_merged}}") +
        p("{{creditor.name}} heeft GeldGarant gevraagd de betaling van de factuur of facturen hieronder te regelen. "
          "De betaaltermijn is verstreken en wij hebben nog geen (volledige) betaling ontvangen. "
          f"Wij vragen u het openstaande bedrag uiterlijk op {D7} te betalen.") +
        kernblok([("Totaal te betalen", "{{case.total_amount_due}}"), ("Uiterlijk op", D7),
                  ("Betalingskenmerk", "{{case.case_number}}")]) +
        knop("Betaal direct met iDEAL", "{{case.online_payment_link}}") +
        p("U betaalt in uw eigen bank-app. Betaalt u het totaalbedrag op tijd, dan is uw dossier daarmee afgerond. "
          "Heeft u de afgelopen dagen al betaald? Dan kunt u dit bericht als niet verzonden beschouwen.", "6px 0 24px") +
        specificatie(SPEC_B2B) + overmaken() +
        h2("Iets anders aan de hand?") +
        acties([
            actie("Kunt u niet in één keer betalen?",
                  f"Neem dan vóór {D7} contact met ons op. Wij leggen uw voorstel voor een betalingsregeling voor aan onze "
                  "opdrachtgever. Een regeling geldt pas als wij die schriftelijk aan u hebben bevestigd.",
                  "Regeling voorstellen", BRIEF + "&reden=regeling#regelen"),
            actie("Bent u het niet eens met de vordering?",
                  f"Laat ons vóór {D7} weten waarom, met de stukken die uw standpunt onderbouwen. Het deel waarover u het wel "
                  "eens bent, vragen wij u te betalen.",
                  "Reactie sturen", BRIEF + "&reden=oneens#regelen"),
            actie("Als wij niets van u horen",
                  f"Ontvangen wij vóór {D7} geen betaling en geen reactie, dan zetten wij de incasso voort en ontvangt u een "
                  "sommatie. Dat willen wij liever voorkomen, samen met u."),
            actie("Vragen?", "Bel {{org_communication.telephone}} op werkdagen of mail naar {{org_communication.email}}. "
                  "Noem altijd uw dossiernummer."),
        ]) +
        portaal() + slot()),
)

MAILS["sommatie-b2b"] = dict(
    onderwerp="Sommatie: laatste verzoek om te betalen (dossier {{case.case_number}})",
    preheader="Betaal {{case.total_amount_due}} uiterlijk op " + D5 + ". Daarna adviseren wij onze opdrachtgever naar de rechter te gaan.",
    soort="Sommatie",
    inhoud=lambda: (
        pil("Sommatie", "#9a2a12", "#fdece6") +
        h1("Laatste verzoek om te betalen voordat de rechter eraan te pas komt") +
        p("{{debtor.correspondence_salutation_merged}}") +
        p("Eerder hebben wij u namens {{creditor.name}} gevraagd de factuur of facturen hieronder te betalen. Tot nu toe "
          "hebben wij geen (volledige) betaling van u ontvangen en is er geen betalingsregeling afgesproken.") +
        p(f"Wij sommeren u het totaalbedrag uiterlijk op <strong>{D5}</strong> te betalen. Dit is het laatste verzoek "
          "voordat wij onze opdrachtgever adviseren de vordering aan de rechter voor te leggen.") +
        kernblok([("Totaal te betalen", "{{case.total_amount_due}}"), ("Uiterlijk op", D5),
                  ("Betalingskenmerk", "{{case.case_number}}")]) +
        knop("Betaal direct met iDEAL", "{{case.online_payment_link}}") +
        p("U betaalt in uw eigen bank-app. Heeft u de afgelopen dagen al betaald? Dan kunt u dit bericht als niet "
          "verzonden beschouwen.", "6px 0 24px") +
        specificatie(SPEC_B2B) +
        h2("Wat er gebeurt als u niet betaalt") +
        p(f"Ontvangen wij uiterlijk op {D5} geen betaling en ook geen reactie, dan leggen wij het dossier aan "
          "{{creditor.name}} voor met het advies de vordering aan de rechter voor te leggen. Kiest onze opdrachtgever "
          "daarvoor, dan ontvangt u een dagvaarding van een gerechtsdeurwaarder.") +
        p("Wijst de rechter de vordering toe, dan komen ook de proceskosten meestal voor uw rekening: griffierecht, de "
          "kosten van de deurwaarder en een vergoeding voor de gemachtigde. Met een vonnis kan de deurwaarder beslag "
          "leggen, bijvoorbeeld op uw bankrekening of op bedrijfsmiddelen.", "0 0 24px") +
        overmaken() +
        h2("Nog te voorkomen") +
        acties([
            actie("Kunt u niet in één keer betalen?",
                  f"Neem dan uiterlijk op {D5} contact met ons op, liefst telefonisch via {{{{org_communication.telephone}}}}. "
                  "Een regeling geldt pas als wij die schriftelijk aan u hebben bevestigd.",
                  "Regeling voorstellen", BRIEF + "&reden=regeling#regelen"),
            actie("Bent u het niet eens met de vordering?",
                  f"Laat ons uiterlijk op {D5} schriftelijk weten waarom, met de stukken die uw standpunt onderbouwen.",
                  "Reactie sturen", BRIEF + "&reden=oneens#regelen"),
        ]) +
        portaal() + slot()),
)

MAILS["aanmaning-14-dagen-b2c"] = dict(
    onderwerp="Uw factuur van {{creditor.name}}: u kunt nog betalen zonder extra kosten",
    preheader="Betaal {{case.total_amount_due}} binnen 14 dagen, dan betaalt u geen incassokosten. Dossier {{case.case_number}}.",
    soort="Aanmaning",
    inhoud=lambda: (
        pil("Aanmaning") +
        h1("U kunt nog betalen zonder extra kosten") +
        p("{{debtor.correspondence_salutation_merged}}") +
        p("{{creditor.name}} heeft GeldGarant gevraagd de betaling van de factuur of facturen hieronder te regelen. "
          "De betaaltermijn is voorbij en er staat nog een bedrag open. Wij vragen u dat bedrag te betalen.") +
        kernblok([("Nu te betalen", "{{case.total_amount_due}}"), ("Betalen binnen", "14 dagen na ontvangst"),
                  ("Betalingskenmerk", "{{case.case_number}}")]) +
        knop("Betaal direct met iDEAL", "{{case.online_payment_link}}") +
        kaart(
            f'<div style="{F} font-size:15px; line-height:24px; color:{INK};"><strong>Betaalt u binnen 14 dagen? Dan betaalt '
            "u geen incassokosten.</strong></div>"
            f'<div style="{F} margin-top:6px; font-size:14px; line-height:22px; color:{TEKST};">'
            "De 14 dagen gaan in op de dag nadat u deze e-mail heeft ontvangen. Betaalt u niet op tijd? Dan brengen wij "
            "<strong>{{case.penalty_amount_incl_vat}}</strong> aan incassokosten in rekening, berekend volgens de wettelijke "
            "staffel. De wettelijke rente loopt door. Aan deze e-mail zijn voor u geen kosten verbonden.</div>",
            achtergrond="#e8efff", rand="#d0dcf7", marge="10px 0 16px") +
        p("Heeft u het bedrag de afgelopen dagen al betaald? Dan kunt u dit bericht als niet verzonden beschouwen.",
          "0 0 24px") +
        specificatie([
            ("Factuurnummer(s)", "{{claims.all_numbers}}"),
            ("Hoofdsom", "{{case.capital_amount}}"),
            ("Wettelijke rente t/m {{misc.today}}", "{{case.interest}}"),
            ("Nu te betalen", "{{case.total_amount_due}}"),
        ], noot=(f'<div style="{F} margin-top:10px; font-size:13px; line-height:20px; color:{MUTED};">'
                 "Alleen als u niet binnen 14 dagen betaalt, komen er buitengerechtelijke incassokosten bij: "
                 "{{case.penalty_amount_incl_vat}}. De rente loopt door tot de dag van betaling.</div>")) +
        overmaken() +
        h2("Lukt het niet, of klopt het niet?") +
        acties([
            actie("Kunt u niet in één keer betalen?",
                  "Laat het ons binnen de 14 dagen weten. Samen kijken wij wat haalbaar is, bijvoorbeeld betalen in delen. "
                  "Een regeling geldt pas als wij die schriftelijk aan u hebben bevestigd.",
                  "Betalen in delen aanvragen", BRIEF + "&reden=regeling#regelen"),
            actie("Klopt deze rekening niet?",
                  "Laat het ons binnen de 14 dagen weten en vertel waarom. Heeft u bewijs, zoals een betaalbewijs of een "
                  "afspraak? Stuur het mee.",
                  "Reactie sturen", BRIEF + "&reden=oneens#regelen"),
            actie("Heeft u geldzorgen?",
                  "U staat er niet alleen voor. Uw gemeente helpt gratis en vertrouwelijk met schulden. Ook Geldfit denkt "
                  "met u mee: geldfit.nl of gratis 0800 8115. Wilt u liever eerst met ons praten? Bel "
                  "{{org_communication.telephone}} op werkdagen."),
        ]) +
        portaal() + slot()),
    voet_extra=" Loopt het u boven het hoofd? Praat erover met 113 Zelfmoordpreventie, gratis via 0800 0113 of 113.nl.",
)

def main():
    for naam, m in MAILS.items():
        uit = omhul(m["onderwerp"], m["preheader"], m["soort"], m["inhoud"](), m.get("voet_extra", ""))
        assert "—" not in uit and "–" not in uit, f"{naam}: gedachtestreepje"
        (HIER / f"{naam}.html").write_text(uit, encoding="utf-8")
        (HIER / f"{naam}.txt").write_text(f"Onderwerp: {m['onderwerp']}\nPreheader: {m['preheader']}\n", encoding="utf-8")
        print(f"mails/{naam}.html  ({len(uit):,} tekens)")

if __name__ == "__main__":
    main()
