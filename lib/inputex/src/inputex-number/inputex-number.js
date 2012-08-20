/**
 * @module inputex-number
 */
YUI.add("inputex-number", function(Y) {

  var lang = Y.Lang,
      inputEx = Y.inputEx;

/**
 * A field limited to number inputs (floating)
 * @class inputEx.NumberField
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.NumberField = function(options) {
   inputEx.NumberField.superclass.constructor.call(this,options);
};

Y.extend(inputEx.NumberField, inputEx.StringField, {
   /**
    * Adds the min, and max options
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) {
      inputEx.NumberField.superclass.setOptions.call(this, options);
      
      this.options.min = lang.isUndefined(options.min) ? -Infinity : parseFloat(options.min);
      this.options.max = lang.isUndefined(options.max) ? Infinity : parseFloat(options.max);
   },
   /**
    * Return a parsed float (javascript type number)
    * @method getValue
    * @return {Number} The parsed float
    */
   getValue: function() {
	
      var str_value;
      
      // StringField getValue (handles typeInvite and trim options)
      str_value = inputEx.NumberField.superclass.getValue.call(this);
      
      // don't return NaN if empty field
      if (str_value === '') {
         return '';
      }
      
      return parseFloat(str_value);
   },
   
   /**
    * Check if the entered number is a float
    * @method validate
    */
   validate: function() { 
      
      var v = this.getValue(), str_value = inputEx.NumberField.superclass.getValue.call(this);
      
      // empty field
      if (v === '') {
         // validate only if not required
         return !this.options.required;
      }
      
      if (isNaN(v)) {
         return false;
      }
      
      // We have to check the number with a regexp, otherwise "0.03a" is parsed to a valid number 0.03
      return !!str_value.match(/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/) && v >= this.options.min && v <= this.options.max;
      
   }

});

// Register this class as "number" type
inputEx.registerType("number", inputEx.NumberField, []);

}, '3.1.0',{
requires: ['inputex-string']
});
