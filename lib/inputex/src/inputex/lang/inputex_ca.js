YUI.add("lang/inputex_ca", function(Y) {

    Y.Intl.add(

    "inputex", // associated module
    "ca", // BCP 47 language tag
    {

        required: "Aquest camp és obligatori",
        invalid: "Aquest camp no és obligatori",
        valid: "Aquest camp és vàlid",

        invalidEmail: "Correu electrònic no vàlid, ex:nom@correu.cat",
        selectColor: "Seleccioni un color:",
        invalidPassword: ["La contrasenya ha de tenir almenys", "números o lletres"],
        invalidPasswordConfirmation: "Les contrasenyes són diferents!",
        passwordStrength: "La contrasenya és massa senzilla",
        capslockWarning: "Atenció: bloqueig de majúscules activat",
        invalidDate: "Data no vàlida, ej: 25/01/2007",
        defaultDateFormat: "d/m/Y",
        shortMonths: ["Gen", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dec"],
        months: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Decembre"],
        weekdays1char: ["G", "L", "T", "X", "J", "V", "S"],
        shortWeekdays: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
        selectMonth: "- Seleccioni un mes -",
        dayTypeInvite: "Dia",
        monthTypeInvite: "Mes",
        yearTypeInvite: "Any",
        cancelEditor: "Cancel·la",
        okEditor: "D'acord",
        defaultCalendarOpts: {
            navigator: {
                strings: {
                    month: "Seleccioni un mes",
                    year: "Introdueixi un any",
                    submit: "D'acord",
                    cancel: "Cancel·la",
                    invalidYear: "Any no vàlid"
                }
            },
            start_weekday: 1
            // la setmana comença el Dilluns
        },
        stringTooShort: ["Aquest camp ha de tenir, almenys, ", " caràcters (lletres o números)"],
        stringTooLong: ["Aquest camp ha de tenir, com a molt, ", " caràcters (lletres o números)"],
        ajaxWait: "Enviant...",
        menuTypeInvite: "Fes clic aquí per seleccionar",

        // List
        listAddLink: "Afegir",
        listRemoveLink: "Eliminar",


        // Datatable
        saveText: "Desa",
        cancelText: "Cancel·la",
        modifyText: "Modifica",
        deleteText: "Elimina",
        insertItemText: "Insereix",
        confirmDeletion: "Està segur que vol esborrar?",


        // TimeInterval
        timeUnits: {
            SECOND: "segons",
            MINUTE: "minuts",
            HOUR: "hores",
            DAY: "dies",
            MONTH: "mesos",
            YEAR: "anys"
        }

    });

    Y.inputEx.messages = Y.Intl.get("inputex");

},
'3.1.0', {
    requires: ['inputex']
});
