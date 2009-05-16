(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event;

/**
 * @class A field limited to number inputs
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>negative: boolean indicating if we accept boolean numbers</li>
 * </ul>
 */
inputEx.IntegerField = function(options) {
   inputEx.IntegerField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IntegerField, inputEx.StringField, 
/**
 * @scope inputEx.IntegerField.prototype   
 */
{
   /**
    * Adds the negative option
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) {
      inputEx.IntegerField.superclass.setOptions.call(this, options);
      
      this.options.negative = lang.isUndefined(options.negative) ? false : options.negative;
   },
   
   /**
    * Get the value
    * @return {int} The integer value
    */
   getValue: function() {
      // don't return NaN if empty field
      if ((this.options.typeInvite && this.el.value == this.options.typeInvite) || this.el.value == '') {
         return '';
      }
      
      return parseInt(this.el.value, 10);
   },
   
   /**
    * Validate  if is a number
    * @method validate
    */
   validate: function() {
      var v = this.getValue();
      
      // empty field is OK
      if (v == "") return true;
      
      if(isNaN(v)) return false;
      return !!this.el.value.match(new RegExp(this.options.negative ? "^[+-]?[0-9]*$" : "^\\+?[0-9]*$") );
   }
   
});

/**
 * Register this class as "integer" type
 */
inputEx.registerType("integer", inputEx.IntegerField);

})();