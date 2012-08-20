/**
 * @module inputex-uppercase
 */
YUI.add("inputex-uppercase",function(Y){
	
   var inputEx = Y.inputEx,
       lang = Y.Lang;

/**
 * A field where the value is always uppercase
 * @class inputEx.UpperCaseField
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UpperCaseField = function(options) {
   inputEx.UpperCaseField.superclass.constructor.call(this,options);
};

Y.extend(inputEx.UpperCaseField, inputEx.StringField, {

   /**
    * Set the value and call toUpperCase
    * @method setValue
    * @param {String} val The string
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(val, sendUpdatedEvt) {
      // don't always rewrite the value to able selections with Ctrl+A
      var uppered = val.toUpperCase();
      if(uppered != this.getValue()) {
         inputEx.UpperCaseField.superclass.setValue.call(this, uppered, sendUpdatedEvt);
      }
   },

   /**
    * Call setvalue on input to update the field with upper case value
    * @method onKeyPress
    * @param {Event} e The original 'input' event
    */
   onKeyPress: function(e) { 
      inputEx.UpperCaseField.superclass.onKeyPress.call(this,e);
      
      // Re-Apply a toUpperCase method
      Y.Lang.later(0,this,function() {this.setValue( (this.getValue()) );});
   }

});

// Register this class as "uppercase" type
inputEx.registerType("uppercase", inputEx.UpperCaseField);

},'3.1.0',{
  requires: ['inputex-string']
});
