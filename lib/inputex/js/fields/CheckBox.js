(function() {
	
	var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
	
/**
 * @class Create a checkbox.
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options for CheckBoxes:
 * <ul>
 *   <li>sentValues: 2D vector of values for checked/unchecked states (default is [true, false])</li>
 * </ul>
 */
inputEx.CheckBox = function(options) {
	inputEx.CheckBox.superclass.constructor.call(this,options);
};
	
lang.extend(inputEx.CheckBox, inputEx.Field, 
/**
 * @scope inputEx.CheckBox.prototype   
 */
{
	   
	/**
	 * Adds the CheckBox specific options
	 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
	 */
	setOptions: function(options) {
	   inputEx.CheckBox.superclass.setOptions.call(this, options);
	   
	   // Overwrite options:
	   this.options.className = options.className ? options.className : 'inputEx-Field inputEx-CheckBox';
	   
	   this.options.rightLabel = options.rightLabel || '';
	   
	   // Added options
	   this.sentValues = options.sentValues || [true, false];
	   this.options.sentValues = this.sentValues; // for compatibility
	   this.checkedValue = this.sentValues[0];
	   this.uncheckedValue = this.sentValues[1];
	},
	   
	/**
	 * Render the checkbox and the hidden field
	 */
	renderComponent: function() {
	
   	var checkBoxId = this.divEl.id?this.divEl.id+'-field':YAHOO.util.Dom.generateId();
   	
	   this.el = inputEx.cn('input', { id: checkBoxId, type: 'checkbox', checked:(this.options.checked === false) ? false : true });
	   this.fieldContainer.appendChild(this.el);
	
	   this.rightLabelEl = inputEx.cn('label', {"for": checkBoxId, className: 'inputEx-CheckBox-rightLabel'}, null, this.options.rightLabel);
	   this.fieldContainer.appendChild(this.rightLabelEl);
	
	   // Keep state of checkbox in a hidden field (format : this.checkedValue or this.uncheckedValue)
	   this.hiddenEl = inputEx.cn('input', {type: 'hidden', name: this.options.name || '', value: this.el.checked ? this.checkedValue : this.uncheckedValue});
	   this.fieldContainer.appendChild(this.hiddenEl);
	},
	   
	/**
	 * Clear the previous events and listen for the "change" event
	 */
	initEvents: function() {
	   Event.addListener(this.el, "change", this.onChange, this, true);	
	   
	   // Awful Hack to work in IE6 and below (the checkbox doesn't fire the change event)
	   // It seems IE 8 removed this behavior from IE7 so it only works with IE 7 ??
	   /*if( YAHOO.env.ua.ie && parseInt(YAHOO.env.ua.ie,10) != 7 ) {
	      Event.addListener(this.el, "click", function() { this.fireUpdatedEvt(); }, this, true);	
	   }*/
	   if( YAHOO.env.ua.ie ) {
	      Event.addListener(this.el, "click", function() { YAHOO.lang.later(10,this,this.fireUpdatedEvt); }, this, true);	
	   }
	   
	   Event.addFocusListener(this.el, this.onFocus, this, true);
	   Event.addBlurListener(this.el, this.onBlur, this, true);
	},
	   
	/**
	 * Function called when the checkbox is toggled
	 * @param {Event} e The original 'change' event
	 */
	onChange: function(e) {
	   this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
	
      // In IE the fireUpdatedEvent is sent by the click ! We need to send it only once ! 
      if( !YAHOO.env.ua.ie ) {
	      inputEx.CheckBox.superclass.onChange.call(this,e);
      }
	},
	
	/**
	 * Get the state value
	 * @return {Any} one of [checkedValue,uncheckedValue]
	 */
	getValue: function() {
	      return this.el.checked ? this.checkedValue : this.uncheckedValue;
	},
	
	/**
	 * Set the value of the checkedbox
	 * @param {Any} value The value schould be one of [checkedValue,uncheckedValue]
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(value, sendUpdatedEvt) {
	   if (value===this.checkedValue) {
			this.hiddenEl.value = value;
			this.el.checked = true;
		}
	   else {
	      // DEBUG :
	      /*if (value!==this.uncheckedValue && lang.isObject(console) && lang.isFunction(console.log) ) {
	         console.log("inputEx.CheckBox: value is *"+value+"*, schould be in ["+this.checkedValue+","+this.uncheckedValue+"]");
         }*/
			this.hiddenEl.value = value;
			this.el.checked = false;
		}
		
		// Call Field.setValue to set class and fire updated event
		inputEx.CheckBox.superclass.setValue.call(this,value, sendUpdatedEvt);
	},
	
	/**
    * Disable the field
    */
   disable: function() {
      this.el.disabled = true;
   },

   /**
    * Enable the field
    */
   enable: function() {
      this.el.disabled = false;
   }
	
});   
	
/**
 * Register this class as "boolean" type
 */
inputEx.registerType("boolean", inputEx.CheckBox);
	
})();