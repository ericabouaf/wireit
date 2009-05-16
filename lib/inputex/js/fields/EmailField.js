(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Field that adds the email regexp for validation. Result is always lower case.
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.EmailField = function(options) {
   inputEx.EmailField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.EmailField, inputEx.StringField, 
/**
 * @scope inputEx.EmailField.prototype   
 */   
{
   
   /**
    * Set the email regexp and invalid message
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.EmailField.superclass.setOptions.call(this, options);
      // Overwrite options
      this.options.messages.invalid = inputEx.messages.invalidEmail;
      this.options.regexp = inputEx.regexps.email;
   },
   
   /**
    * Set the value to lower case since email have no case
    * @return {String} The email string
    */
   getValue: function() {
      return this.el.value.toLowerCase();
   }

});
   
// Specific message for the email field
inputEx.messages.invalidEmail = "Invalid email, ex: sample@test.com";

/**
 * Register this class as "email" type
 */
inputEx.registerType("email", inputEx.EmailField);

})();