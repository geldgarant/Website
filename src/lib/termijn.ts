// 14-dagenbrief (art. 6:96 lid 6 BW, HR 25 november 2016, ECLI:NL:HR:2016:2704):
// de termijn van 14 dagen begint op de dag ná ontvangst van de brief. Kosten pas daarna.
// Bij post rekenen we voorzichtig met ontvangst op de tweede bezorgdag na verzending (PostNL bezorgt brieven
// dinsdag t/m zaterdag); bij e-mail op de dag van verzending. Feestdagen laten we buiten beschouwing.

const DAG = 86_400_000
const t = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? Date.parse(`${iso}T00:00:00Z`) : Number.NaN)
const iso = (n: number) => new Date(n).toISOString().slice(0, 10)

/** Bezorgdagen voor brieven: dinsdag t/m zaterdag. */
function plusBezorgdagen(start: number, n: number): number {
    let d = start
    let over = n
    while (over > 0) {
        d += DAG
        if (new Date(d).getUTCDay() >= 2) over--
    }
    return d
}

export type Verzending = "post" | "email"

export interface Termijn {
    ontvangen: string
    eersteDag: string // eerste dag van de termijn (dag na ontvangst)
    laatsteDag: string // dag 14
    kostenVanaf: string // dag na de laatste dag
}

export function veertienDagen(verzonden: string, via: Verzending): Termijn | null {
    const v = t(verzonden)
    if (!Number.isFinite(v)) return null
    const ontvangen = via === "email" ? v : plusBezorgdagen(v, 2)
    const eerste = ontvangen + DAG
    const laatste = eerste + 13 * DAG
    return { ontvangen: iso(ontvangen), eersteDag: iso(eerste), laatsteDag: iso(laatste), kostenVanaf: iso(laatste + DAG) }
}
