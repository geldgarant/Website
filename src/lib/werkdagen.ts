// Werkdagen volgens de Algemene termijnenwet (art. 3): zaterdag, zondag en de algemeen erkende feestdagen tellen niet mee.
// Feestdagen: Nieuwjaarsdag, tweede paasdag, Koningsdag (27 april, of 26 april als die op zondag valt), 5 mei,
// Hemelvaartsdag, tweede pinksterdag en beide kerstdagen. Goede Vrijdag hoort er niet bij.
// Gebruikt op /klachtenregelement voor de termijnen van de klachtenregeling (bevestiging en antwoord).

const DAG = 86_400_000
const t = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? Date.parse(`${iso}T00:00:00Z`) : Number.NaN)
const iso = (n: number) => new Date(n).toISOString().slice(0, 10)

/** Eerste paasdag (Gregoriaans, algoritme van Meeus/Jones/Butcher), als UTC-tijdstip. */
export function pasen(jaar: number): number {
    const a = jaar % 19
    const b = Math.floor(jaar / 100)
    const c = jaar % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const maand = Math.floor((h + l - 7 * m + 114) / 31)
    const dag = ((h + l - 7 * m + 114) % 31) + 1
    return Date.UTC(jaar, maand - 1, dag)
}

const cache = new Map<number, Set<string>>()

/** Algemeen erkende feestdagen in een jaar, als ISO-datums. */
export function feestdagen(jaar: number): Set<string> {
    const al = cache.get(jaar)
    if (al) return al
    const p = pasen(jaar)
    const koning = Date.UTC(jaar, 3, 27)
    const set = new Set([
        iso(Date.UTC(jaar, 0, 1)),
        iso(p + DAG), // tweede paasdag
        iso(new Date(koning).getUTCDay() === 0 ? koning - DAG : koning),
        iso(Date.UTC(jaar, 4, 5)),
        iso(p + 39 * DAG), // Hemelvaartsdag
        iso(p + 50 * DAG), // tweede pinksterdag
        iso(Date.UTC(jaar, 11, 25)),
        iso(Date.UTC(jaar, 11, 26)),
    ])
    cache.set(jaar, set)
    return set
}

export function isWerkdag(datum: string): boolean {
    const n = t(datum)
    if (!Number.isFinite(n)) return false
    const dag = new Date(n).getUTCDay()
    return dag !== 0 && dag !== 6 && !feestdagen(new Date(n).getUTCFullYear()).has(datum)
}

/** De datum zelf als dat een werkdag is, anders de eerstvolgende werkdag. */
export function volgendeWerkdag(datum: string): string | null {
    let n = t(datum)
    if (!Number.isFinite(n)) return null
    while (!isWerkdag(iso(n))) n += DAG
    return iso(n)
}

/** Telt n werkdagen op bij een datum (de startdag zelf telt niet mee). */
export function plusWerkdagen(datum: string, n: number): string | null {
    let d = t(datum)
    if (!Number.isFinite(d)) return null
    let over = n
    while (over > 0) {
        d += DAG
        if (isWerkdag(iso(d))) over--
    }
    return iso(d)
}

export interface KlachtTermijnen {
    ontvangen: string
    bevestiging: string // uiterlijk, binnen twee werkdagen (art. 6.1 lid 2 onder b Besluit Wki)
    antwoord: string // streefdatum, binnen veertien werkdagen
}

/** Termijnen van de klachtenregeling voor een klacht die op `vandaag` binnenkomt. */
export function klachtTermijnen(vandaag: string, bevestigen = 2, antwoorden = 14): KlachtTermijnen | null {
    const ontvangen = volgendeWerkdag(vandaag)
    if (!ontvangen) return null
    const bevestiging = plusWerkdagen(ontvangen, bevestigen)
    const antwoord = plusWerkdagen(ontvangen, antwoorden)
    if (!bevestiging || !antwoord) return null
    return { ontvangen, bevestiging, antwoord }
}
