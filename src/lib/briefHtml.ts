// HTML van de brief voor het papiervoorbeeld op /voorbeeldbrieven/* en /incasso/wik-brief.
// Zelfde functie op de server (eerste render, met plaatshouders) en in de browser (live bij elke toetsaanslag).
// Plaatshouders "[...]" worden een gemarkeerde <span class="ph">, zodat zichtbaar is wat nog ingevuld moet.
import type { Brief } from "./briefmaker"

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const ph = (s: string) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>')
const regels = (r: string[]) => r.map(ph).join("<br>")

export function briefHtml(b: Brief): string {
    const delen = [
        `<p class="p-afz">${regels(b.afzender)}</p>`,
        `<p class="p-adres">${regels(b.geadresseerde)}</p>`,
        `<p class="p-datum">${ph(b.plaatsDatum)}</p>`,
        `<p class="p-betreft"><strong>Betreft: ${ph(b.onderwerp)}</strong></p>`,
        `<p>${ph(b.aanhef)}</p>`,
        ...b.alineas.map((a) => `<p>${ph(a)}</p>`),
    ]
    if (b.specificatie) {
        const totaal = b.specificatie.kop === "Openstaand"
        delen.push(
            `<table class="p-spec"><caption>${esc(b.specificatie.kop)}</caption><tbody>` +
                b.specificatie.regels
                    .map(
                        ([l, w], i) =>
                            `<tr${totaal && i === b.specificatie!.regels.length - 1 ? ' class="p-tot"' : ""}><th scope="row">${ph(l)}</th><td>${ph(w)}</td></tr>`,
                    )
                    .join("") +
                `</tbody></table>`,
        )
    }
    delen.push(...(b.naSpecificatie ?? []).map((a) => `<p>${ph(a)}</p>`))
    delen.push(`<p class="p-slot">${ph(b.slot)}</p>`, `<p class="p-onder">${regels(b.ondertekening)}</p>`)
    if (b.akkoord) delen.push(`<p class="p-akkoord">${b.akkoord.map(ph).join("<br><br>")}</p>`)
    return delen.join("")
}
