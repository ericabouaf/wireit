(function() {
   var inputEx = YAHOO.inputEx;

/**
 * @class inputEx.FrenchDate
 * @extends inputEx.DateField
 */
inputEx.FrenchDate = function(options) {
	if(!options.dateFormat) {options.dateFormat = 'd/m/Y'; }
	inputEx.FrenchDate.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FrenchDate, inputEx.DateField);

// Specific message for the container
inputEx.messages.invalidDate = "Date invalide, ex: 27/03/2008";

/**
 * Register this class as "date" type
 */
inputEx.registerType("date_fr", inputEx.FrenchDate);

})();