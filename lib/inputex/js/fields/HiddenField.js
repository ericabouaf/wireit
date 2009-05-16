(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Create a hidden input, inherits from inputEx.Field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.HiddenField = function(options) {
	inputEx.HiddenField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.HiddenField, inputEx.Field, 
/**
 * @scope inputEx.HiddenField.prototype   
 */   
{
   
   /**
    * Doesn't render much...
    */
   render: function() {
      this.type = inputEx.HiddenField;
	   this.divEl = inputEx.cn('div', null, {display: 'none'});
	   
	   this.el = inputEx.cn('input', {type: 'hidden'});
	   if(this.options.name) this.el.name = this.options.name;
	   this.divEl.appendChild(this.el);
   },

   /**
    * Stores the value in a local variable
    * @param {Any} val The value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(val, sendUpdatedEvt) {
      this.el.value = val;

      // Call Field.setValue to set class and fire updated event
		inputEx.HiddenField.superclass.setValue.call(this,val, sendUpdatedEvt);
   },

   /**
    * Get the previously stored value
    * @return {Any} the previously stored value
    */
   getValue: function() {
      return this.el.value;
   }

});
   
/**
 * Register this class as "hidden" type
 */
inputEx.registerType("hidden", inputEx.HiddenField);

})();