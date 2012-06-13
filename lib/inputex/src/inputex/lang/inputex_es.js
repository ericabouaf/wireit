YUI.add("lang/inputex_es", function(Y) {

    Y.Intl.add(

    "inputex", // associated module
    "es", // BCP 47 language tag
    {
        required: "Este campo es obligatorio",
        invalid: "Este campo no es válido",
        valid: "Este campo es válido",

        invalidEmail: "Correo electrónico no válido, ej: tu.nombre@correo.es",
        selectColor: "Selecciona un color:",
        invalidPassword: ["La contraseña debe contener al menos ", "numeros o letras"],
        invalidPasswordConfirmation: "las contraseñas son diferentes!",
        passwordStrength: "La contraseña es demasiado débil",
        capslockWarning: "Atención: bloqueo de mayúsculas activado",
        invalidDate: "Fecha no válida, ej: 25/01/2007",
        defaultDateFormat: "d/m/Y",
        shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        weekdays1char: ["D", "L", "M", "X", "J", "V", "S"],
        shortWeekdays: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        selectMonth: "- Seleccione un mes -",
        dayTypeInvite: "Día",
        monthTypeInvite: "Mes",
        yearTypeInvite: "Año",
        cancelEditor: "Cancelar",
        okEditor: "Aceptar",
        defaultCalendarOpts: {
            navigator: {
                strings: {
                    month: "Seleccione un mes",
                    year: "Introduzca un año",
                    submit: "Aceptar",
                    cancel: "Cancelar",
                    invalidYear: "Año no válido"
                }
            },
            start_weekday: 1
            // la semaine commence un lundi
        },
        stringTooShort: ["Este campo debe contener al menos ", " caracteres (letras o números)"],
        stringTooLong: ["Este campo debe contener como mucho ", " caracteres (letras o números)"],
        ajaxWait: "Enviando...",
        menuTypeInvite: "Haga click aquí para seleccionar",

        // List
        listAddLink: "Añadir",
        listRemoveLink: "Eliminar",


        // Datatable
        saveText: "Salvar",
        cancelText: "Cancelar",
        modifyText: "Modificar",
        deleteText: "Eliminar",
        insertItemText: "Insertar",
        confirmDeletion: "¿Está seguro que desea borrar?",


        // TimeInterval
        timeUnits: {
            SECOND: "segundos",
            MINUTE: "minutos",
            HOUR: "horas",
            DAY: "días",
            MONTH: "meses",
            YEAR: "años"
        }


    });

    Y.inputEx.messages = Y.Intl.get("inputex");

},
'3.0.0a', {
    requires: ['inputex']
});
