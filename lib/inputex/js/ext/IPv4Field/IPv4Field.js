(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Adds an IPv4 address regexp
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.IPv4Field = function(options) {
	inputEx.IPv4Field.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IPv4Field, inputEx.StringField, 
/**
 * @scope inputEx.IPv4Field.prototype   
 */   
{
   
   /**
    * set IPv4 regexp and invalid string
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.IPv4Field.superclass.setOptions.call(this, options);
      this.options.messages.invalid = inputEx.messages.invalidIPv4;
      this.options.regexp = /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/;
   }
  
});

// Specific message for the email field
inputEx.messages.invalidIPv4 = "Invalid IPv4 address, ex: 192.168.0.1";

/**
 * Register this class as "IPv4" type
 */
inputEx.registerType("IPv4", inputEx.IPv4Field);

})();