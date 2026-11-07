import { describe, it, expect } from "vitest"
import { cvSoort, valideerCv, valideerSollicitatie, leegSollicitatie } from "../../src/lib/sollicitatie"

const pdf = { name: "cv.pdf", type: "application/pdf", size: 120_000 }

describe("cv", () => {
    it("herkent PDF en Word, ook zonder type", () => {
        expect(cvSoort(pdf)).toBe("pdf")
        expect(cvSoort({ name: "Mijn CV.DOCX", type: "" })).toBe("docx")
        expect(cvSoort({ name: "cv.doc", type: "application/octet-stream" })).toBe("doc")
        expect(cvSoort({ name: "foto.jpg", type: "image/jpeg" })).toBeNull()
    })
    it("weigert te groot, leeg of ontbrekend", () => {
        expect(valideerCv(null)).toMatch(/Voeg uw cv toe/)
        expect(valideerCv({ ...pdf, size: 11 * 1024 * 1024 })).toMatch(/10 MB/)
        expect(valideerCv({ ...pdf, size: 0 })).toMatch(/leeg/)
        expect(valideerCv(pdf)).toBeNull()
    })
})

describe("sollicitatie", () => {
    it("vraagt naam, e-mail, telefoon, cv en akkoord", () => {
        const f = valideerSollicitatie(leegSollicitatie(), null)
        expect(Object.keys(f).sort()).toEqual(["akkoord", "cv", "email", "naam", "telefoon"])
    })
    it("is geldig met alles ingevuld, motivatie optioneel", () => {
        const s = { naam: "Sam de Vries", email: "sam@voorbeeld.nl", telefoon: "06 12345678", motivatie: "", akkoord: true }
        expect(valideerSollicitatie(s, pdf)).toEqual({})
    })
})
