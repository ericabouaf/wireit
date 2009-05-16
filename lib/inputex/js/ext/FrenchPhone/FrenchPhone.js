(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class inputEx.FrenchPhone
 * @extends inputEx.StringField
 */
inputEx.FrenchPhone = function(options) {
	inputEx.FrenchPhone.superclass.constructor.call(this,options);
	this.options.regexp = /^( *[0-9] *){10}$/;
	this.options.messages.invalid = "Numéro de téléphone non valide, ex: 06 12 34 56 78";
};
YAHOO.lang.extend(inputEx.FrenchPhone, inputEx.StringField);


/**
* Register this class as "frenchphone" type
*/
inputEx.registerType("frenchphone", inputEx.FrenchPhone);

})();