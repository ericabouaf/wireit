YUI.add("lang/inputex_it", function(Y) {

    Y.Intl.add(

    "inputex", // associated module
    "it",   // BCP 47 language tag
    {

   required: "Questo campo è obbligatorio",
   invalid: "Questo campo non è stato validato",
   valid: "Questo campo è stato validato",
   invalidEmail: "Email non valida, es: antonio.rossi@fai.it",
   selectColor: "Seleziona un colore:",
   invalidPassword: ["La password deve contenere almeno ","numeri o lettere"],
   invalidPasswordConfirmation: "le password sono differenti !",
   capslockWarning: "Attenzione: tasto maiuscole attive",
   invalidDate: "Data non valida, es: 25/01/2007",
   defaultDateFormat: "d/m/Y",
   shortMonths: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu","Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
   months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio","Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre","Dicembre"],
   weekdays1char:  ["D", "L", "M", "M", "G", "V", "S"],
   shortWeekdays: ["Do","Lu","Ma","Me","Gi","Ve","Sa"],
   selectMonth: "- Seleziona Mese -",
   dayTypeInvite: "Giorno",
   monthTypeInvite: "Mese",
   yearTypeInvite: "Anno",
   cancelEditor: "Annulla",
   okEditor: "Ok",
   defaultCalendarOpts: {
      navigator: {
        strings : {
            month: "Seleziona un mese",
            year: "Digita un anno",
            submit: "Ok",
            cancel: "Annulla",
            invalidYear: "Anno non valido"
         }
      },
      start_weekday: 1 // la semaine commence un lundi
   },

   // Datatable
   saveText: "Salva",
   cancelText: "Annulla",
   modifyText: "Modifica",
   deleteText: "Elimina",
   insertItemText: "Aggiungi",
   confirmDeletion: "Sei sicuro?"


 });

 Y.inputEx.messages = Y.Intl.get("inputex");

},
'3.1.0', {
 requires: ['inputex']
});

