/**
 * @module inputex-integer
 */
YUI.add("inputex-integer", function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * A field limited to number inputs
 * @class inputEx.IntegerField
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>negative: boolean indicating if we accept negative numbers</li>
 * </ul>
 */
inputEx.IntegerField = function(options) {
   inputEx.IntegerField.superclass.constructor.call(this,options);
};

Y.extend(inputEx.IntegerField, inputEx.StringField, {
   /**
    * Adds the negative, min, and max options
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) {
      inputEx.IntegerField.superclass.setOptions.call(this, options);
      
      this.options.negative = lang.isUndefined(options.negative) ? false : options.negative;
      this.options.min = lang.isUndefined(options.min) ? (this.options.negative ? -Infinity : 0) : parseInt(options.min,10);
      this.options.max = lang.isUndefined(options.max) ? Infinity : parseInt(options.max,10);
   },
   
   /**
    * Get the value
    * @method getValue
    * @return {int} The integer value
    */
   getValue: function() {
      
      var str_value;
      
      // StringField getValue (handles typeInvite and trim options)
      str_value = inputEx.IntegerField.superclass.getValue.call(this);
      
      // don't return NaN if empty field
      if (str_value === '') {
         return '';
      }
      
      return parseInt(str_value, 10);
   },
   
   /**
    * Validate  if is a number
    * @method validate
    */
   validate: function() {
      
      var v = this.getValue(), str_value = inputEx.IntegerField.superclass.getValue.call(this);
      
      // empty field
      if (v === '') {
         // validate only if not required
         return !this.options.required;
      }
      
      if (isNaN(v)) {
         return false;
      }
      
      return !!str_value.match(/^[\+\-]?[0-9]+$/) && (this.options.negative ? true : v >= 0) && v >= this.options.min && v <= this.options.max;
      
   }
   
});

// Register this class as "integer" type
inputEx.registerType("integer", inputEx.IntegerField, [
   //{ type: 'integer', label: 'Radix', name: 'radix', value: 10},
   {type: 'boolean', label: 'Accept negative', name: 'negative', value: false }
]);

}, '3.1.0',{
requires: ['inputex-string']
});
