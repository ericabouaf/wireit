YUI.add("lang/inputex_fr", function(Y) {

    Y.Intl.add(

    "inputex", // associated module
    "fr",   // BCP 47 language tag
    {

        required: "Ce champ est obligatoire",
        invalid: "Ce champ n'est pas valide",
        valid: "Ce champ est valide",

        invalidEmail: "Email non valide, ex: michel.dupont@fai.fr",
        didYouMean: "Voulez-vous dire : ",
        disposableEmail: "Adresse jetable non autorisée avec le domaine : ",
        selectColor: "S&eacute,lectionnez une couleur :",
        invalidPassword: ["Le mot de passe doit contenir au moins ", " caract&egrave,res (lettres ou chiffres)"],
        invalidPasswordConfirmation: "Les mots de passe entrés ne sont pas identiques !",
        passwordStrength: "Solidité du mot de passe",
        capslockWarning: "Attention: touche majuscule activée",
        invalidDate: "Date non valide, ex: 25/01/2007",
        defaultDateFormat: "d/m/Y",
        shortMonths: ["Jan", "Fév", "Mars", "Avril", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        weekdays1char: ["D", "L", "M", "M", "J", "V", "S"],
        shortWeekdays: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
        selectMonth: "- Choisissez -",
        dayTypeInvite: "Jour",
        monthTypeInvite: "Mois",
        yearTypeInvite: "Année",
        cancelEditor: "annuler",
        okEditor: "Ok",
        defaultCalendarOpts: {
            navigator: {
                strings: {
                    month: "Choisissez un mois",
                    year: "Entrez une année",
                    submit: "Ok",
                    cancel: "Annuler",
                    invalidYear: "Année non valide"
                }
            },
            start_weekday: 1
            // la semaine commence un lundi
        },
        stringTooShort: ["Ce champ doit contenir au moins ", " caract&egrave,res (lettres ou chiffres)"],
        stringTooLong: ["Ce champ doit contenir au plus ", " caract&egrave,res (lettres ou chiffres)"],
        ajaxWait: "Envoi en cours...",
        menuTypeInvite: "Cliquez ici pour choisir",

        emptyInPlaceEdit: "(editer)",

        // List
        listAddLink: "Ajouter",
        listRemoveLink: "Supprimer",

        // Datatable
        saveText: "Sauver",
        cancelText: "Annuler",
        modifyText: "modifier",
        deleteText: "supprimer",
        insertItemText: "Ajouter",
        confirmDeletion: "Êtes-vous sûr ?",
        addButtonText: "Ajouter",
        loadingText: "Patientez...",
        emptyDataText: "Aucune donnée.",
        errorDataText: "Erreur de données.",

      /*  tableOptions: "Options des colonnes",
        showColumnButton: "Afficher",
        hideColumnButton: "Masquer",
        columnDialogTitle: "Choisissez les colonnes à afficher",
        columnDialogCloseButton: "Fermer",*/

        // TimeInterval
        timeUnits: {
            SECOND: "secondes",
            MINUTE: "minutes",
            HOUR: "heures",
            DAY: "jours",
            MONTH: "mois",
            YEAR: "ans"
        }

    });

    Y.inputEx.messages = Y.Intl.get("inputex");

},
'3.0.0a', {
    requires: ['inputex']
});
