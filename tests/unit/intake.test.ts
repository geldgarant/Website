import { describe, expect, it } from "vitest"
import {
    parseBedrag,
    isIban,
    isKvk,
    isEmail,
    normPostcode,
    valideerStap,
    valideerBestand,
    bouwPayload,
    leegFormulier,
    MAX_FILE_BYTES,
    leegContact,
    valideerContact,
    bouwContactPayload,
} from "../../src/lib/intake"

describe("bedrag lezen", () => {
    it.each([
        ["2.500", 2500],
        ["2.500,50", 2500.5],
        ["2500,5", 2500.5],
        ["2500.50", 2500.5],
        ["€ 1.234.567,89", 1234567.89],
        ["", 0],
        ["abc", 0],
    ])("%s → %d", (v, n) => expect(parseBedrag(v)).toBe(n))
})

describe("validators", () => {
    it("IBAN met mod 97", () => {
        expect(isIban("NL91 ABNA 0417 1643 00")).toBe(true)
        expect(isIban("nl91abna0417164300")).toBe(true)
        expect(isIban("NL91ABNA0417164301")).toBe(false)
        expect(isIban("NL91ABNA041716430")).toBe(false)
        expect(isIban("DE89370400440532013000")).toBe(true)
    })
    it("KvK, e-mail en postcode", () => {
        expect(isKvk("90622375")).toBe(true)
        expect(isKvk("9062237")).toBe(false)
        expect(isEmail("jan@bedrijf.nl")).toBe(true)
        expect(isEmail("jan@bedrijf")).toBe(false)
        expect(normPostcode("7418et")).toBe("7418 ET")
    })
    it("bestanden", () => {
        expect(valideerBestand({ name: "f.pdf", type: "application/pdf", size: 1000 })).toBeNull()
        expect(valideerBestand({ name: "f.docx", type: "application/msword", size: 1000 })).toMatch(/alleen pdf/)
        expect(valideerBestand({ name: "f.pdf", type: "application/pdf", size: MAX_FILE_BYTES + 1 })).toMatch(/10 MB/)
    })
})

describe("stappen", () => {
    it("stap 1 vraagt een bedrag", () => {
        const s = leegFormulier()
        expect(valideerStap(1, s).bedrag).toBeTruthy()
        s.bedrag = "1.250"
        expect(valideerStap(1, s)).toEqual({})
    })
    it("stap 2 vraagt naam en minstens één contactmogelijkheid", () => {
        const s = leegFormulier()
        s.debiteur_naam = "Bakker BV"
        expect(valideerStap(2, s).debiteur_contact).toBeTruthy()
        s.debiteur_email = "info@bakker.nl"
        expect(valideerStap(2, s)).toEqual({})
    })
    it("stap 3 vraagt bedrijf en contactpersoon; IBAN is optioneel maar moet kloppen", () => {
        const s = leegFormulier()
        Object.assign(s, {
            bedrijfsnaam: "Jansen",
            voornaam: "Piet",
            achternaam: "Jansen",
            email: "p@j.nl",
            telefoon: "0612345678",
        })
        expect(valideerStap(3, s)).toEqual({})
        s.iban = "NL00FOUT0000000000"
        expect(valideerStap(3, s).iban).toBeTruthy()
    })
    it("stap 4 vraagt akkoord", () => {
        expect(valideerStap(4, leegFormulier()).akkoord).toBeTruthy()
    })
})

describe("payload", () => {
    it("past op het contract van de intake-worker", () => {
        const s = leegFormulier()
        Object.assign(s, {
            bedrag: "2.500,00",
            factuurnummer: "F-1",
            vervaldatum: "2026-10-01",
            debiteur_soort: "particulier",
            debiteur_naam: "M. de Boer",
            bedrijfsnaam: "Jansen",
            voornaam: "Piet",
            achternaam: "Jansen",
            email: "P@J.NL",
            telefoon: "06 1234 5678",
            iban: "nl91 abna 0417 1643 00",
            akkoord: true,
        })
        s.debiteur_adres.postcode = "7418et"
        const p = bouwPayload(s, {
            nonce: "ab".repeat(16),
            sessionToken: "t",
            dossierId: "GG-2026-00001",
            documenten: [],
            duurSec: 90.4,
        })
        expect(p.type).toBe("incasso_aanvraag")
        expect(p.vordering.bedrag).toBe(2500)
        expect(p.vordering.omschrijving).toMatch(/^Soort debiteur: Particulier/)
        expect(p.vordering.debiteur.adres.postcode).toBe("7418 ET")
        expect(p.aanvrager.email).toBe("p@j.nl")
        expect(p.bedrijf.iban).toBe("NL91ABNA0417164300")
        expect(p.toestemmingen).toEqual({ akkoord_av: true, akkoord_avg: true })
        expect(p.metadata.formulier_duur_sec).toBe(90)
        expect(p.metadata).not.toHaveProperty("bron_pagina")
        expect(JSON.stringify(p).length).toBeLessThan(50_000)
    })

    it("stuurt pagina, verwijzer en UTM mee, zonder iets te bewaren", () => {
        const p = bouwPayload(leegFormulier(), {
            nonce: "ab".repeat(16),
            sessionToken: "t",
            dossierId: "GG-2026-00002",
            documenten: [],
            duurSec: 60,
            herkomst: {
                pagina: "/vordering-indienen",
                referrer: "https://geldgarant.com/tarieven",
                utm: new URLSearchParams("utm_source=google&utm_medium=cpc&utm_campaign=" + "x".repeat(300)),
            },
        })
        expect(p.metadata).toMatchObject({
            bron_pagina: "/vordering-indienen",
            referrer: "https://geldgarant.com/tarieven",
            utm_source: "google",
            utm_medium: "cpc",
        })
        expect(p.metadata.utm_campaign).toHaveLength(100)
    })
})

describe("contactformulier", () => {
    it("vraagt onderwerp, naam, bedrijf, e-mail en toelichting; telefoon bij bellen of WhatsApp", () => {
        const s = leegContact()
        expect(Object.keys(valideerContact(s))).toEqual(
            expect.arrayContaining(["onderwerp", "naam", "bedrijfsnaam", "email", "toelichting"]),
        )
        Object.assign(s, {
            onderwerp: "algemene_vraag",
            naam: "Piet",
            bedrijfsnaam: "Jansen",
            email: "p@j.nl",
            toelichting: "Een vraag over de werkwijze.",
        })
        expect(valideerContact(s)).toEqual({})
        s.voorkeur = "whatsapp"
        expect(valideerContact(s).telefoon).toBeTruthy()
    })
    it("payload volgens het contract van /api/contact, met pakket in de toelichting", () => {
        const s = leegContact()
        Object.assign(s, {
            onderwerp: "debiteurenbeheer",
            pakket: "groei",
            aantal_facturen: "40",
            naam: "Piet",
            bedrijfsnaam: "Jansen",
            email: "P@J.NL",
            toelichting: "Graag meer info.",
        })
        const p = bouwContactPayload(s, {
            nonce: "ab".repeat(16),
            turnstileToken: "t",
            pagina: "/contact-opnemen",
            referrer: "",
            utm: new URLSearchParams("utm_source=google"),
        })
        expect(p.onderwerp).toEqual({ key: "debiteurenbeheer", label: "Debiteurenbeheer" })
        expect(p.contact.email).toBe("p@j.nl")
        expect(p.contact.voorkeur_contact).toBe("email")
        expect(p.details.toelichting).toBe("Pakket: Groei\nGraag meer info.")
        expect(p.details.aantal_facturen).toBe("40")
        expect(p.details.dossiernummer).toBe("")
        expect(p.metadata).toMatchObject({ cta: "pakket-groei", utm_source: "google" })
        expect(p.turnstile_token).toBe("t")
    })
})
