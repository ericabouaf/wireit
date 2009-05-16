(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class A field limited to number inputs (floating)
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.NumberField = function(options) {
   inputEx.NumberField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.NumberField, inputEx.StringField, 
/**
 * @scope inputEx.NumberField.prototype   
 */
{
   /**
    * Return a parsed float (javascript type number)
    * @return {Number} The parsed float
    */
   getValue: function() {
      // don't return NaN if empty field
      if ((this.options.typeInvite && this.el.value == this.options.typeInvite) || this.el.value == '') {
         return '';
      }
      
      return parseFloat(this.el.value);
   },
   
   /**
    * Check if the entered number is a float
    */
   validate: function() { 
      var v = this.getValue();
      
      // empty field is OK
      if (v == "") return true;
      
      if(isNaN(v)) return false;
	   
	   // We have to check the number with a regexp, otherwise "0.03a" is parsed to a valid number 0.03
	   return !!this.el.value.match(/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/);
   }

});

/**
 * Register this class as "number" type
 */
inputEx.registerType("number", inputEx.NumberField);

})();