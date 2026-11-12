// SMS B2B Termijn loopt af (07 §K2 stap 7): werkdag 6 na de aanmaning, termijn (7 werkdagen) verloopt de volgende werkdag.
// "morgen" klopt alleen zolang de wachttijden in GG-B2B 1 Aanmaning zo blijven.
// Alleen sms: mails/tools/bouw.mjs slaat dit bestand over; sms/tools/bouw.mjs controleert lengte en tekens.
export default {
    sms: {
        naam: "GG | SMS | B2B | Termijn loopt af",
        tekst:
            "GeldGarant: de betaaltermijn van dossier {{case.case_number}} verloopt morgen. Betaal nu en voorkom " +
            "de sommatie: {{case.online_payment_link}}",
    },
}
