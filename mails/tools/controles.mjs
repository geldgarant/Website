// Gedeelde controles voor e-mails, brieven en sms (mails/tools/bouw.mjs, brieven/tools/bouw.mjs, sms/tools/bouw.mjs).
export const VERBODEN = [
    [/[—–]/, "gedachtestreepje"],
    [/!(?![^<]*>)/, "uitroepteken in tekst"],
    [/debtor_portal|raw_password/, "portaalinlog of wachtwoord (B14, R-04)"],
    [/case\.installment_amount|case\.outstanding_amount/, "veld bestaat niet in CaseControl (R-14)"],
    [/text_block\./, "oud tekstblok (kop/voet zitten in de bouwstenen)"],
    [/niet verzonden/i, "nooit 'beschouw als niet verzonden' (B29)"],
    [/Geachte relatie|correspondence_salutation/, "aanhef is altijd Hallo {{debtor.name}}, (B29)"],
]

/** Geeft de overtredingen in een tekst (HTML-commentaar telt niet mee). */
export const controleer = (...teksten) => {
    const schoon = teksten.map((t) => t.replace(/<!--[\s\S]*?-->/g, ""))
    return VERBODEN.filter(([re]) => schoon.some((t) => re.test(t))).map(([, wat]) => wat)
}
