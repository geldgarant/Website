// Illustraties voor de kennisbank (kaarten op de home, het overzicht en "Verder lezen").
// Elk artikel krijgt een eigen combinatie: een wit hoofdicoon met een blauw accenticoon rechtsonder, op navy.
// De iconen zijn hier met de hand getekend in een vak van 100 x 100, zodat ze strak blijven op elk formaat en er
// geen afbeeldingen geladen hoeven te worden (inline SVG, geen CLS). Kleuren uit het logo (--ink, --blue).
// Nieuw artikel? Voeg een regel toe aan BEELDEN; zonder regel faalt de build (zie beeldVoor) en de unit-test.

const INK = "#061126"
const BLUE = "#3069FE"
const WIT = "#FFFFFF"

/** fg = vulkleur, dt = detailkleur, x = extra lijndikte (voor de rand om het accenticoon) */
interface Kleur {
    fg: string
    dt: string
    x: number
}

type Glyph = (k: Kleur) => string

const r = (n: number) => Math.round(n * 10) / 10
const vorm = (k: Kleur, extra = 4) => `fill="${k.fg}" stroke="${k.fg}" stroke-width="${extra + k.x}" stroke-linejoin="round"`
const lijn = (kleur: string, breedte: number) =>
    `fill="none" stroke="${kleur}" stroke-width="${breedte}" stroke-linecap="round" stroke-linejoin="round"`

const GLYPHS = {
    doc: (k) =>
        `<path d="M24 8H62L80 26V92H24Z" ${vorm(k)}/>` +
        (k.x ? "" : `<path d="M62 8V26H80Z" fill="${k.dt}" opacity=".9"/>`) +
        (k.x
            ? ""
            : [44, 57, 70]
                  .map((y, i) => `<rect x="34" y="${y}" width="${i === 2 ? 24 : 36}" height="6" rx="3" fill="${k.dt}"/>`)
                  .join("")),

    scales: (k) =>
        `<rect x="30" y="84" width="40" height="9" rx="4" ${vorm(k, 0)}/>` +
        `<rect x="46" y="20" width="8" height="66" rx="3" ${vorm(k, 0)}/>` +
        `<rect x="12" y="24" width="76" height="7" rx="3.5" ${vorm(k, 0)}/>` +
        `<circle cx="50" cy="18" r="7" ${vorm(k, 0)}/>` +
        [26, 74]
            .map(
                (cx) =>
                    `<path d="M${cx} 30L${cx - 15} 60M${cx} 30L${cx + 15} 60" ${lijn(k.fg, 3 + k.x)}/>` +
                    `<path d="M${cx - 18} 60H${cx + 18}A18 12 0 0 1 ${cx - 18} 60Z" ${vorm(k, 2)}/>`,
            )
            .join(""),

    lock: (k) =>
        `<path d="M32 48V34A18 18 0 0 1 68 34V48" ${lijn(k.fg, 10 + k.x)}/>` +
        `<rect x="20" y="44" width="60" height="48" rx="9" ${vorm(k)}/>` +
        (k.x
            ? ""
            : `<circle cx="50" cy="63" r="7" fill="${k.dt}"/><rect x="46.5" y="64" width="7" height="15" rx="3" fill="${k.dt}"/>`),

    shield: (k) =>
        `<path d="M50 8L84 20V46C84 68 70 84 50 94C30 84 16 68 16 46V20Z" ${vorm(k)}/>` +
        (k.x ? "" : `<path d="M34 50L46 62L67 39" ${lijn(k.dt, 9)}/>`),

    check: (k) =>
        `<circle cx="50" cy="50" r="40" ${vorm(k, 0 + 0)}/>` + (k.x ? "" : `<path d="M31 51L45 65L70 38" ${lijn(k.dt, 10)}/>`),

    wallet: (k) =>
        `<rect x="8" y="20" width="84" height="68" rx="13" ${vorm(k)}/>` +
        (k.x
            ? ""
            : `<path d="M20 34H62" ${lijn(k.dt, 5)} opacity=".45"/>` +
              `<rect x="56" y="44" width="38" height="26" rx="9" fill="${k.dt}"/><circle cx="70" cy="57" r="5" fill="${k.fg}"/>`),

    envelope: (k) =>
        `<rect x="8" y="20" width="84" height="62" rx="9" ${vorm(k)}/>` +
        (k.x ? "" : `<path d="M14 28L50 57L86 28" ${lijn(k.dt, 6)}/>`),

    clock: (k) => `<circle cx="50" cy="50" r="40" ${vorm(k, 0)}/>` + (k.x ? "" : `<path d="M50 26V50L66 60" ${lijn(k.dt, 8)}/>`),

    calendar: (k) =>
        `<rect x="12" y="18" width="76" height="72" rx="11" ${vorm(k)}/>` +
        `<rect x="27" y="7" width="9" height="22" rx="4.5" ${vorm(k, 0)}/><rect x="64" y="7" width="9" height="22" rx="4.5" ${vorm(k, 0)}/>` +
        (k.x
            ? ""
            : `<rect x="12" y="34" width="76" height="5" fill="${k.dt}"/>` +
              [50, 64, 78]
                  .flatMap((y) =>
                      [25, 44, 63].map((x) => `<rect x="${x}" y="${y - 4}" width="12" height="9" rx="2.5" fill="${k.dt}"/>`),
                  )
                  .join("")),

    building: (k) =>
        `<rect x="66" y="40" width="22" height="52" rx="3" ${vorm(k)}/>` +
        (k.x ? "" : `<rect x="64" y="40" width="4" height="52" fill="${k.dt}"/>`) +
        `<rect x="14" y="12" width="50" height="80" rx="3" ${vorm(k)}/>` +
        (k.x
            ? ""
            : [26, 42, 58]
                  .flatMap((y) => [24, 44].map((x) => `<rect x="${x}" y="${y}" width="10" height="9" rx="1.5" fill="${k.dt}"/>`))
                  .join("") +
              `<rect x="33" y="74" width="12" height="18" rx="2" fill="${k.dt}"/>` +
              `<rect x="72" y="52" width="10" height="8" rx="1.5" fill="${k.dt}"/><rect x="72" y="68" width="10" height="8" rx="1.5" fill="${k.dt}"/>`),

    question: (k) =>
        `<path d="M24 12H76A14 14 0 0 1 90 26V60A14 14 0 0 1 76 74H48L30 90V74H24A14 14 0 0 1 10 60V26A14 14 0 0 1 24 12Z" ${vorm(k)}/>` +
        (k.x
            ? ""
            : `<path d="M39 33A11 11 0 1 1 55 43Q50 46 50 52" ${lijn(k.dt, 8)}/><circle cx="50" cy="62.5" r="5" fill="${k.dt}"/>`),

    alert: (k) =>
        `<path d="M50 12L90 84H10Z" ${vorm(k, 10)}/>` +
        (k.x
            ? ""
            : `<rect x="45.5" y="36" width="9" height="28" rx="4.5" fill="${k.dt}"/><circle cx="50" cy="74" r="5" fill="${k.dt}"/>`),

    coin: (k) =>
        `<circle cx="50" cy="50" r="40" ${vorm(k, 0)}/>` +
        (k.x ? "" : `<path d="M65 33A21 21 0 1 0 65 67" ${lijn(k.dt, 8)}/><path d="M27 45H54M27 56H50" ${lijn(k.dt, 6)}/>`),

    snowflake: (k) => {
        let d = ""
        for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3 - Math.PI / 2
            const tip = [50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)]
            d += `M50 50L${r(tip[0])} ${r(tip[1])}`
            const m = [50 + 26 * Math.cos(a), 50 + 26 * Math.sin(a)]
            for (const s of [-1, 1]) {
                const b = a + (s * Math.PI) / 4
                d += `M${r(m[0])} ${r(m[1])}L${r(m[0] + 13 * Math.cos(b))} ${r(m[1] + 13 * Math.sin(b))}`
            }
        }
        return `<path d="${d}" ${lijn(k.fg, 8 + k.x)}/>`
    },

    chart: (k) =>
        [
            [12, 58, 34],
            [38, 40, 52],
            [64, 18, 74],
        ]
            .map(([x, y, h]) => `<rect x="${x}" y="${y}" width="22" height="${h}" rx="4" ${vorm(k, 0)}/>`)
            .join(""),

    people: (k) =>
        `<circle cx="68" cy="34" r="13" ${vorm(k, 0)}/><path d="M46 90A22 22 0 0 1 90 90Z" ${vorm(k, 0)}/>` +
        `<circle cx="36" cy="32" r="15" ${vorm(k, 0)} stroke="${k.x ? k.fg : k.dt}" stroke-width="${5 + k.x}"/>` +
        `<path d="M8 92A28 28 0 0 1 64 92Z" ${vorm(k, 0)} stroke="${k.x ? k.fg : k.dt}" stroke-width="${5 + k.x}"/>`,

    court: (k) =>
        `<path d="M50 8L90 30H10Z" ${vorm(k, 6)}/>` +
        `<rect x="12" y="34" width="76" height="8" rx="2" ${vorm(k, 0)}/>` +
        [18, 36, 54, 72].map((x) => `<rect x="${x}" y="46" width="10" height="34" rx="2" ${vorm(k, 0)}/>`).join("") +
        `<rect x="8" y="82" width="84" height="10" rx="3" ${vorm(k, 0)}/>`,

    gavel: (k) =>
        `<g transform="rotate(-40 50 44)"><rect x="24" y="16" width="52" height="24" rx="6" ${vorm(k, 0)}/>` +
        (k.x
            ? ""
            : `<rect x="34" y="16" width="5" height="24" fill="${k.dt}"/><rect x="61" y="16" width="5" height="24" fill="${k.dt}"/>`) +
        `<rect x="45" y="40" width="10" height="46" rx="5" ${vorm(k, 0)}/></g>` +
        `<rect x="8" y="82" width="50" height="10" rx="4" ${vorm(k, 0)}/>`,

    redo: (k) => {
        const rad = 30
        const a0 = Math.PI / 3
        const a1 = -Math.PI / 6
        const p0 = [50 + rad * Math.cos(a0), 50 + rad * Math.sin(a0)]
        const p1 = [50 + rad * Math.cos(a1), 50 + rad * Math.sin(a1)]
        const dir = [-Math.sin(a1), Math.cos(a1)]
        const nor = [Math.cos(a1), Math.sin(a1)]
        const punt = [p1[0] + dir[0] * 16, p1[1] + dir[1] * 16]
        const b1 = [p1[0] + nor[0] * 15, p1[1] + nor[1] * 15]
        const b2 = [p1[0] - nor[0] * 15, p1[1] - nor[1] * 15]
        return (
            `<path d="M${r(p0[0])} ${r(p0[1])}A${rad} ${rad} 0 1 1 ${r(p1[0])} ${r(p1[1])}" ${lijn(k.fg, 13 + k.x)}/>` +
            `<path d="M${r(punt[0])} ${r(punt[1])}L${r(b1[0])} ${r(b1[1])}L${r(b2[0])} ${r(b2[1])}Z" ${vorm(k, 4)}/>`
        )
    },

    arrowUp: (k) => `<path d="M50 10L86 48H62V90H38V48H14Z" ${vorm(k, 6)}/>`,

    house: (k) =>
        `<path d="M50 10L90 46H80V90H20V46H10Z" ${vorm(k, 6)}/>` +
        (k.x ? "" : `<rect x="42" y="62" width="16" height="28" rx="2" fill="${k.dt}"/>`),

    hardhat: (k) =>
        `<path d="M18 68A32 32 0 0 1 82 68Z" ${vorm(k)}/>` +
        `<rect x="8" y="66" width="84" height="13" rx="6.5" ${vorm(k, 0)}/>` +
        (k.x ? "" : `<rect x="44" y="34" width="12" height="32" rx="4" fill="${k.dt}" opacity=".9"/>`),

    briefcase: (k) =>
        `<path d="M36 28V20A7 7 0 0 1 43 13H57A7 7 0 0 1 64 20V28" ${lijn(k.fg, 7 + k.x)}/>` +
        `<rect x="8" y="27" width="84" height="62" rx="11" ${vorm(k)}/>` +
        (k.x
            ? ""
            : `<rect x="8" y="50" width="84" height="6" fill="${k.dt}"/><rect x="42" y="45" width="16" height="16" rx="4" fill="${k.fg}" stroke="${k.dt}" stroke-width="4"/>`),

    globe: (k) =>
        `<circle cx="50" cy="50" r="40" ${vorm(k, 0)}/>` +
        (k.x
            ? ""
            : `<ellipse cx="50" cy="50" rx="17" ry="40" ${lijn(k.dt, 5)}/><path d="M10 50H90M17 30H83M17 70H83" ${lijn(k.dt, 5)}/>`),

    stairs: (k) => `<path d="M10 90V70H31V50H52V30H73V10H90V90Z" ${vorm(k, 6)}/>`,

    podium: (k) =>
        `<rect x="36" y="32" width="28" height="60" rx="3" ${vorm(k, 0)}/>` +
        `<rect x="8" y="52" width="28" height="40" rx="3" ${vorm(k, 0)}/>` +
        `<rect x="64" y="64" width="28" height="28" rx="3" ${vorm(k, 0)}/>` +
        (k.x
            ? ""
            : `<path d="M36 52V92M64 64V92" ${lijn(k.dt, 3)}/><path d="M46 46L51 42V62" ${lijn(k.dt, 5)}/>` +
              `<path d="M50 8L54 17L63 18L56 24L58 33L50 28L42 33L44 24L37 18L46 17Z" fill="${k.fg}"/>`),

    hourglass: (k) =>
        `<path d="M24 12H76V18C76 36 58 44 58 50C58 56 76 64 76 82V88H24V82C24 64 42 56 42 50C42 44 24 36 24 18Z" ${vorm(k)}/>` +
        `<rect x="16" y="6" width="68" height="9" rx="4.5" ${vorm(k, 0)}/><rect x="16" y="85" width="68" height="9" rx="4.5" ${vorm(k, 0)}/>` +
        (k.x
            ? ""
            : `<path d="M34 24H66L50 40Z" fill="${k.dt}"/><path d="M33 82C35 72 45 66 50 63C55 66 65 72 67 82Z" fill="${k.dt}"/>`),

    calculator: (k) =>
        `<rect x="18" y="8" width="64" height="84" rx="11" ${vorm(k)}/>` +
        (k.x
            ? ""
            : `<rect x="28" y="18" width="44" height="18" rx="4" fill="${k.dt}"/>` +
              [46, 61, 76]
                  .flatMap((y) =>
                      [28, 45, 62].map((x) => `<rect x="${x}" y="${y}" width="10" height="10" rx="2.5" fill="${k.dt}"/>`),
                  )
                  .join("")),

    percent: (k) =>
        `<path d="M76 18L24 82" ${lijn(k.fg, 11 + k.x)}/>` +
        `<circle cx="30" cy="28" r="13" ${vorm(k, 0)}/><circle cx="70" cy="72" r="13" ${vorm(k, 0)}/>`,
} satisfies Record<string, Glyph>

export type GlyphNaam = keyof typeof GLYPHS

/** Artikel → [hoofdicoon, accenticoon] */
export const BEELDEN: Record<string, [GlyphNaam, GlyphNaam]> = {
    "algemene-voorwaarden-incasso": ["doc", "scales"],
    "avg-en-incasso": ["doc", "lock"],
    "beslagvrije-voet-2026": ["wallet", "shield"],
    "betalingsherinnering-aanmaning-wik-brief": ["envelope", "clock"],
    "betalingsregeling-treffen": ["calendar", "check"],
    "bv-uitgeschreven-schulden": ["building", "question"],
    "conservatoir-beslag": ["coin", "snowflake"],
    "creditmanagement-openstaande-facturen-voorkomen": ["chart", "shield"],
    "debiteur-betwist-factuur": ["doc", "question"],
    "debiteur-failliet-vordering-beschermen": ["building", "alert"],
    "eisen-correcte-factuur": ["doc", "check"],
    "geleend-geld-terugvorderen": ["people", "coin"],
    "gerechtelijke-procedure-kantonrechter": ["court", "gavel"],
    "griffierechten-2026": ["court", "coin"],
    "herincasso-afgeschreven-facturen": ["doc", "redo"],
    "hoger-beroep-vonnis": ["court", "arrowUp"],
    "huurachterstand-incasseren": ["house", "coin"],
    "incasso-bouwsector": ["hardhat", "coin"],
    "incasso-zzp": ["briefcase", "coin"],
    "internationale-vordering-de-moeite-waard": ["globe", "coin"],
    "loonbeslag-hoe-werkt-het": ["wallet", "gavel"],
    "openstaande-factuur-stappenplan": ["stairs", "scales"],
    "selectief-betalen-debiteur-rechten": ["podium", "coin"],
    "verjaringstermijnen-vorderingen": ["doc", "hourglass"],
    "wat-kost-incasso-uitbesteden": ["calculator", "coin"],
    "wettelijke-rente-2026": ["calendar", "percent"],
    "wki-proof-werken-2026": ["shield", "check"],
}

// Opbouw in een vlak van 320 x 200 (16:10). Hoofdicoon 110 px, accent 62 px rechtsonder, met een navy rand eromheen
// zodat het accent los van het hoofdicoon staat (zoals een sticker).
const HOOFD = { x: 96, y: 40, s: 1.1 }
const ACCENT = { x: 168, y: 102, s: 0.62 }

export function beeldVoor(slug: string): string {
    const paar = BEELDEN[slug]
    if (!paar)
        throw new Error(`kennisbeeld: geen illustratie voor kennisbank/${slug} (voeg een regel toe in src/lib/kennisbeeld.ts)`)
    const [hoofd, accent] = paar
    const rand = 9 / ACCENT.s
    return (
        `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">` +
        `<g transform="translate(${HOOFD.x} ${HOOFD.y}) scale(${HOOFD.s})">${GLYPHS[hoofd]({ fg: WIT, dt: INK, x: 0 })}</g>` +
        `<g transform="translate(${ACCENT.x} ${ACCENT.y}) scale(${ACCENT.s})">` +
        GLYPHS[accent]({ fg: INK, dt: INK, x: rand }) +
        GLYPHS[accent]({ fg: BLUE, dt: WIT, x: 0 }) +
        `</g></svg>`
    )
}
