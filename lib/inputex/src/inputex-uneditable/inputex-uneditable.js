/**
 * @module inputex-uneditable
 */
YUI.add("inputex-uneditable", function(Y){

  var lang = Y.Lang,
      inputEx = Y.inputEx;

/**
 * Create a uneditable field where you can stick the html you want
 * Added Options:
 * <ul>
 *    <li>visu: inputEx visu type</li>
 * </ul>
 * @class inputEx.UneditableField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UneditableField = function(options) {
	inputEx.UneditableField.superclass.constructor.call(this,options);
};
Y.extend(inputEx.UneditableField, inputEx.Field, {
   
   /**
    * Set the default values of the options
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
	setOptions: function(options) {
      inputEx.UneditableField.superclass.setOptions.call(this,options);
      this.options.visu = options.visu;
   },
   
   /**
    * Store the value and update the visu
    * @method setValue
    * @param {Any} val The value that will be sent to the visu
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(val, sendUpdatedEvt) {
      this.value = val;
      
      inputEx.renderVisu(this.options.visu, val, this.fieldContainer);
      
	   inputEx.UneditableField.superclass.setValue.call(this, val, sendUpdatedEvt);
   },
   
   /**
    * Return the stored value
    * @method getValue
    * @return {Any} The previously stored value
    */
   getValue: function() {
      return this.value;
   }
   
});

// Register this class as "url" type
inputEx.registerType("uneditable", inputEx.UneditableField);

}, '3.1.0',{
requires: ['inputex-field']
});
