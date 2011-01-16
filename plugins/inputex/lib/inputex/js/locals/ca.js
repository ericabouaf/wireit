// InputEx Catalan localization
(function() {

  var msgs = inputEx.messages;

  msgs.required = "Aquest camp és obligatori";
  msgs.invalid = "Aquest camp no és obligatori";
  msgs.valid = "Aquest camp és vàlid";

  msgs.invalidEmail = "Correu electrònic no vàlid; ex:nom@correu.cat";
  msgs.selectColor = "Seleccioni un color:";
  msgs.invalidPassword = ["La contrasenya ha de tenir almenys","números o lletres"];
  msgs.invalidPasswordConfirmation = "Les contrasenyes són diferents!";
  msgs.passwordStrength = "La contrasenya és massa senzilla";
  msgs.capslockWarning = "Atenció: bloqueig de majúscules activat";
  msgs.invalidDate = "Data no vàlida; ej: 25/01/2007";
  msgs.defaultDateFormat = "d/m/Y";
  msgs.shortMonths=["Gen", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dec"];
  msgs.months=["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Decembre"];
  msgs.weekdays1char=["G", "L", "T", "X", "J", "V", "S"];
  msgs.shortWeekdays=["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"];
  msgs.selectMonth = "- Seleccioni un mes -";
  msgs.dayTypeInvite = "Dia";
  msgs.monthTypeInvite = "Mes";
  msgs.yearTypeInvite = "Any";
  msgs.cancelEditor = "Cancel·la";
  msgs.okEditor = "D'acord";
  msgs.defautCalendarOpts = {
     navigator: {
       strings : {
           month: "Seleccioni un mes",
           year: "Introdueixi un any",
           submit: "D'acord",
           cancel: "Cancel·la",
           invalidYear: "Any no vàlid"
        }
     },
     start_weekday: 1 // la setmana comença el Dilluns
  };
  msgs.stringTooShort = ["Aquest camp ha de tenir, almenys, "," caràcters (lletres o números)"];
  msgs.stringTooLong = ["Aquest camp ha de tenir, com a molt, "," caràcters (lletres o números)"];
  msgs.ajaxWait = "Enviant...";
  msgs.menuTypeInvite = "Fes clic aquí per seleccionar";

  // List
  msgs.listAddLink = "Afegir";
  msgs.listRemoveLink = "Eliminar";


  // Datatable
  msgs.saveText = "Desa";
  msgs.cancelText = "Cancel·la";
  msgs.modifyText = "Modifica";
  msgs.deleteText = "Elimina";
  msgs.insertItemText = "Insereix";
  msgs.confirmDeletion = "Està segur que vol esborrar?";


  // TimeInterval
  msgs.timeUnits = {
     SECOND: "segons",
     MINUTE: "minuts",
     HOUR: "hores",
     DAY: "dies",
     MONTH: "mesos",
     YEAR: "anys"
  };

  // for YUI loader
  inputEx.lang_ca = true;
})();