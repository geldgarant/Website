import { describe, expect, it } from "vitest"
import { veertienDagen } from "../../src/lib/termijn"

describe("14-dagentermijn", () => {
    it("begint per e-mail op de dag na verzending", () => {
        expect(veertienDagen("2026-11-02", "email")).toEqual({
            ontvangen: "2026-11-02",
            eersteDag: "2026-11-03",
            laatsteDag: "2026-11-16",
            kostenVanaf: "2026-11-17",
        })
    })

    it("rekent bij post met ontvangst op de tweede bezorgdag (di t/m za)", () => {
        // maandag verzonden → woensdag ontvangen → termijn do 5 t/m wo 18 nov
        expect(veertienDagen("2026-11-02", "post")?.ontvangen).toBe("2026-11-04")
        expect(veertienDagen("2026-11-02", "post")?.laatsteDag).toBe("2026-11-18")
    })

    it("slaat zondag en maandag over als bezorgdag", () => {
        // vrijdag verzonden → za (1), di (2) → ontvangen dinsdag
        expect(veertienDagen("2026-11-06", "post")?.ontvangen).toBe("2026-11-10")
    })

    it("geeft null bij een ongeldige datum", () => {
        expect(veertienDagen("", "post")).toBeNull()
        expect(veertienDagen("6-11-2026", "email")).toBeNull()
    })
})
