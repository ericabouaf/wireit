(function() {	
	var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
	
/**
 * @class Create a radio button. Here are the added options :
 * <ul>
 *    <li>choices: list of choices (array of string)</li>
 *    <li>values: list of returned values (array )</li>
 *    <li>allowAny: add an option with a string field</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.RadioField = function(options) {
	inputEx.RadioField.superclass.constructor.call(this,options);
};
	
lang.extend(inputEx.RadioField, inputEx.Field, 
/**
 * @scope inputEx.RadioField.prototype   
 */
{
	   
	/**
	 * Adds the Radio button specific options
	 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
	 */
	setOptions: function(options) {
	   inputEx.RadioField.superclass.setOptions.call(this, options);

      this.options.className = options.className ? options.className : 'inputEx-Field inputEx-RadioField';
	   if (lang.isUndefined(options.allowAny) || options.allowAny === false ) {
        this.options.allowAny = false;
      } else {
        this.options.allowAny = {};
        if (lang.isArray(options.allowAny.separators)) { this.options.allowAny.separators = options.allowAny.separators;};
        this.options.allowAny.validator = (lang.isFunction(options.allowAny.validator)) ? options.allowAny.validator : function(val) {return true;};
        this.options.allowAny.value = (!lang.isUndefined(options.allowAny.value)) ? options.allowAny.value : "";
      }
      
      this.options.choices = options.choices;
      // values == choices if not provided
	   this.options.values = lang.isArray(options.values) ? options.values : options.choices;
	},
	   
	/**
	 * Render the checkbox and the hidden field
	 */
	renderComponent: function() {
	
	   this.optionEls = [];
	
	   for(var i = 0 ; i < this.options.choices.length ; i++) {
	
	      var div = inputEx.cn('div', {className: 'inputEx-RadioField-choice'});
	      
	      // radioId MUST be different for each option,
	      // so add "-opt"+i (where i = option's position) to generated id
	      var radioId = this.divEl.id ? this.divEl.id+'-field-opt'+i : YAHOO.util.Dom.generateId();
	      
	      var radio = inputEx.cn('input', { id: radioId,type: 'radio', name: this.options.name, value: this.options.values[i] });
           
         div.appendChild(radio);
         var label = inputEx.cn('label', {"for": radioId, className: 'inputEx-RadioField-rightLabel'}, null, ""+this.options.choices[i]);
      	div.appendChild(label);
	      
      	
      	this.fieldContainer.appendChild( div );
      	
      	this.optionEls.push(radio);
     }
     
     // Build a "any" radio combined with a StringField
     if(this.options.allowAny) {
        var div = inputEx.cn('div', {className: 'inputEx-RadioField-choice'});
        
        if(YAHOO.env.ua.ie) {
           this.radioAny = document.createElement("<input type='radio' name='"+this.options.name+"'>");
        }
        else {
           this.radioAny = inputEx.cn('input', { type: 'radio', name: this.options.name });
        }
	     div.appendChild(this.radioAny);
	     
        this.anyField = new inputEx.StringField({value:this.options.allowAny.value});
        Dom.setStyle(this.radioAny, "float","left");
        Dom.setStyle(this.anyField.getEl(), "float","left");
        this.anyField.disable();
        
        if (this.options.allowAny.separators) {
     	     var sep = inputEx.cn("div",null,{margin:"3px"},this.options.allowAny.separators[0] || '');
     	     Dom.setStyle(sep, "float","left");
     	     div.appendChild(sep);
  	     }
  	     
     	  div.appendChild(this.anyField.getEl());
     	  
        if (this.options.allowAny.separators) {
     	     var sep = inputEx.cn("div",null,{margin:"3px"},this.options.allowAny.separators[1] || '');
     	     Dom.setStyle(sep, "float","left");
     	     div.appendChild(sep);
  	     }
  	     
  	     this.fieldContainer.appendChild( div );
     	  this.optionEls.push(this.radioAny);
     }
     
	},
	   
	/**
	 * Listen for change events on all radios
	 */
	initEvents: function() {
	   Event.addListener(this.optionEls, "change", this.onChange, this, true);
	   
	   Event.addFocusListener(this.optionEls, this.onFocus, this, true);
	   Event.addBlurListener(this.optionEls, this.onBlur, this, true);


	   if( YAHOO.env.ua.ie ) {
	      Event.addListener(this.optionEls, "click", function() { YAHOO.lang.later(10,this,this.fireUpdatedEvt); }, this, true);	
	   }
	   
	   if(this.anyField)	{
	      this.anyField.updatedEvt.subscribe(function(e) {
	         inputEx.RadioField.superclass.onChange.call(this,e);
	      }, this, true);
	      
	      // Update radio field style after editing anyField content !
	      Event.addBlurListener(this.anyField.el, this.onBlur, this, true);
	   }
	},
	   
	/**
	 * Function called when the checkbox is toggled
	 * @param {Event} e The original 'change' event
	 */
	onChange: function(e) {
	   // Enable/disable the "any" field
      if(this.radioAny) {
         if(this.radioAny == Event.getTarget(e) ) {
            this.anyField.enable();
            lang.later( 50 , this.anyField , "focus");
         }
         else {
            this.anyField.disable();
         }
      }
      // In IE the fireUpdatedEvent is sent by the click ! We need to send it only once ! 
      if( !YAHOO.env.ua.ie ) {
	      inputEx.RadioField.superclass.onChange.call(this,e);
      }
	},
	
	/**
	 * Get the field value
	 * @return {Any} 
	 */
	getValue: function() {
	   for(var i = 0 ; i < this.optionEls.length ; i++) {
	      if(this.optionEls[i].checked) {
	         if(this.radioAny && this.radioAny == this.optionEls[i]) {
	            var val = this.anyField.getValue();
	            return val;
	         }
	         return this.options.values[i];
	      }
	   }
	   return "";
	},
	
	/**
	 * Set the value of the checkedbox
	 * @param {Any} value The value schould be one of this.options.values (which defaults to this.options.choices if missing) if allowAny option not true.
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(value, sendUpdatedEvt) {
	   var checkAny = true, anyEl;
	   
	   for(var i = 0 ; i < this.optionEls.length ; i++) {
	      if (value == this.options.values[i]) {
	         this.optionEls[i].checked = true;
	         checkAny = false;
         } else {
            this.optionEls[i].checked = false;
         }
         
         if(this.radioAny && this.radioAny == this.optionEls[i]) {
            anyEl = this.optionEls[i];
         }
	   }
	   
	   if(this.radioAny && checkAny) {
         anyEl.checked = true;
         this.anyField.enable(); // enable anyField
         this.anyField.setValue(value, false);
      }
	   
      // call parent class method to set style and fire updatedEvt
      inputEx.StringField.superclass.setValue.call(this, value, sendUpdatedEvt);
	},
	
	validate: function() {
	   if (this.options.allowAny) {
	      for(var i = 0 ; i < this.optionEls.length ; i++) {
   	      if(this.optionEls[i].checked) {
   	         // if "any" option checked
   	         if(this.radioAny && this.radioAny == this.optionEls[i]) {
   	            var val = this.anyField.getValue();
         	      return this.options.allowAny.validator(val);
   	         }
   	      }
   	   }
	   }
	   
	   return true;
	}
	
});   
	
/**
 * Register this class as "radio" type
 */
inputEx.registerType("radio", inputEx.RadioField);
	
})();