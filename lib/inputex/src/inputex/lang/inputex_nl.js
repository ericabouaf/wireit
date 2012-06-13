// Dutch translations for inputEx 0.2.2. Courtesy of Oqapi (http://www.oqapi.nl).
YUI.add("lang/inputex_nl", function(Y) {

    Y.Intl.add(

    "inputex", // associated module
    "nl", // BCP 47 language tag
    {

        required: "Dit veld is verplicht",
        invalid: "Dit veld is incorrect",
        valid: "Dit veld is correct",
        invalidEmail: "Het emailadres is incorrect, bv. example@test.com",
        selectColor: "Kies een kleur :",
        invalidPassword: ["Het paswoord moet bestaan uit minstens ", " karakters (letters of cijfers)."],
        invalidPasswordConfirmation: "De ingevoerde paswoorden komen niet overeen!",
        capslockWarning: "Let op: de caps-lock staat aan.",
        invalidDate: "De datum is incorrect, bv: 25/01/2007",
        defaultDateFormat: "d/m/Y",
        shortMonths: ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
        weekdays1char: ["Z", "M", "D", "W", "D", "V", "Z"],
        shortWeekdays: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
        selectMonth: "- Maak een keuze -",
        dayTypeInvite: "Dag",
        monthTypeInvite: "Maand",
        yearTypeInvite: "Jaar",
        cancelEditor: "annuleren",
        okEditor: "Ok",
        defaultCalendarOpts: {
            navigator: {
                strings: {
                    month: "Kies een maand",
                    year: "Voer een jaar in",
                    submit: "Ok",
                    cancel: "Annuleren",
                    invalidYear: "Jaar is incorrect"
                }
            },
            start_weekday: 0
        },


        // Datatable
        saveText: "Opslaan",
        cancelText: "Annuleren",
        modifyText: "Wijzigen",
        deleteText: "Verwijderen",
        insertItemText: "Toevoegen",
        confirmDeletion: "Weet u het zeker?",

        stringTooShort: ["Dit veld moet tenminste ", " nummers of karakters bevatten"],
        stringTooLong: ["Dit veld mag maximaal ", " nummers of karakters bevatten"],

        invalidUrl: "Ongeldige URL, bv: http://www.test.com"


    });

    Y.inputEx.messages = Y.Intl.get("inputex");

},
'3.0.0a', {
    requires: ['inputex']
});

