#!/usr/bin/env python3
"""Bouwt de plakklare CaseControl-templates uit brieven/src/*.html.

- %%naam%% in een style-attribuut wordt vervangen door de stijlregels hieronder (CaseControl's editor bewaart
  alleen inline stijlen; zo blijft de bron leesbaar en is elke stijl op één plek te wijzigen).
- [[LOGO_DATA]] en [[QR_DATA]] worden data-URI's van brieven/assets/*.png: CaseControl laadt geen externe
  afbeeldingen (gezien in hun PDF van 7 nov 2026: de QR-code van api.qrserver.com bleef leeg).
Gebruik: python3 brieven/tools/bouw.py   (schrijft brieven/<naam>.html)
"""
import base64, pathlib, re, sys

HIER = pathlib.Path(__file__).resolve().parent.parent
F = "font-family:Helvetica,Arial,sans-serif;"
STIJL = {
    "tabel": "border-collapse:collapse; width:100%;",
    "p": F + " font-size:9.5pt; line-height:14pt; color:#2b3245; margin:0 0 3.2mm 0;",
    "klein": F + " font-size:7pt; line-height:10pt; color:#6b7390; margin:0 0 1.6mm 0;",
    "h2": F + " font-size:11pt; line-height:15pt; font-weight:bold; color:#061126; margin:5mm 0 1.6mm 0;",
    "h3": F + " font-size:9.5pt; line-height:13pt; font-weight:bold; color:#061126; margin:0 0 1.2mm 0;",
    "kaart": F + " font-size:8.5pt; line-height:12pt; color:#2b3245;",
    "ref-l": F + " font-size:8pt; line-height:11pt; color:#6b7390; padding:1.3mm 3mm 1.3mm 0; border-bottom:0.5pt solid #dfe3ec; white-space:nowrap; vertical-align:top;",
    "ref-w": F + " font-size:8.5pt; line-height:11pt; color:#061126; padding:1.3mm 0; border-bottom:0.5pt solid #dfe3ec; text-align:right; vertical-align:top;",
    "blok": "background-color:#061126; padding:3.2mm 4.5mm; vertical-align:top;",
    "blok-l": F + " font-size:7pt; line-height:10pt; letter-spacing:0.6pt; text-transform:uppercase; color:#b9c3dc;",
    "blok-w": F + " font-size:11pt; line-height:15pt; font-weight:bold; color:#ffffff; margin-top:0.6mm;",
    "spec-l": F + " font-size:8.5pt; line-height:12pt; color:#2b3245; padding:1.8mm 6mm 1.8mm 0; border-bottom:0.5pt solid #dfe3ec; vertical-align:top;",
    "spec-w": F + " font-size:9pt; line-height:12pt; font-weight:bold; color:#2b3245; padding:1.8mm 0; border-bottom:0.5pt solid #dfe3ec; text-align:right; white-space:nowrap; vertical-align:top; width:30mm;",
    "bank-l": F + " font-size:8pt; line-height:11.5pt; color:#6b7390; padding:0.6mm 3mm 0.6mm 0; white-space:nowrap; vertical-align:top;",
    "bank-w": F + " font-size:8.5pt; line-height:11.5pt; color:#061126; padding:0.6mm 0; vertical-align:top;",
    "contact": "vertical-align:top; padding:3mm 3mm 3mm 0;",
    "contact-l": F + " font-size:7pt; line-height:10pt; letter-spacing:0.6pt; text-transform:uppercase; color:#3f68f5; font-weight:bold;",
    "contact-w": F + " font-size:8.5pt; line-height:11.5pt; color:#061126; font-weight:bold; margin-top:0.6mm;",
    "contact-x": F + " font-size:7.5pt; line-height:10pt; color:#6b7390;",
}

def data_uri(naam):
    return "data:image/png;base64," + base64.b64encode((HIER / "assets" / naam).read_bytes()).decode()

def bouw(bron):
    s = bron.read_text(encoding="utf-8")
    def stijl(m):
        sleutel = m.group(1)
        if sleutel not in STIJL:
            sys.exit(f"Onbekende stijl %%{sleutel}%% in {bron.name}")
        return STIJL[sleutel]
    s = re.sub(r"%%([a-z0-9-]+)%%", stijl, s)
    s = s.replace("[[LOGO_DATA]]", data_uri("logo-brief.png")).replace("[[QR_DATA]]", data_uri("qr-betalen.png"))
    # dubbele spaties uit "stijl% extra" opschonen
    s = re.sub(r";\s{2,}", "; ", s)
    for verboden in ("—", "–"):
        if verboden in s:
            sys.exit(f"Gedachtestreepje in {bron.name}")
    uit = HIER / bron.name
    uit.write_text(s, encoding="utf-8")
    print(f"{uit.relative_to(HIER.parent)}  ({len(s) // 1024} kB)")

for b in sorted((HIER / "src").glob("*.html")):
    bouw(b)
