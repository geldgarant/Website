// SMS B2B Laatste kans (07 §K3 stap 6): werkdag 5 na de sommatie; de sommatietermijn (7 werkdagen) eindigt over 2
// werkdagen, vandaar misc.today_plus_2_business_days. Wijzigt de wachttijd, pas dan het veld aan.
// Alleen sms: mails/tools/bouw.mjs slaat dit bestand over; sms/tools/bouw.mjs controleert lengte en tekens.
export default {
    sms: {
        naam: "GG | SMS | B2B | Laatste kans",
        tekst:
            "GeldGarant: laatste kans dossier {{case.case_number}}. Betaal uiterlijk " +
            "{{misc.today_plus_2_business_days}}, anders naar de rechter: {{case.online_payment_link}}",
    },
}
