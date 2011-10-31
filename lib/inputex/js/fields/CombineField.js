(function() {

   var lang = YAHOO.lang, Dom = YAHOO.util.Dom;

/**
 * A meta field to put N fields on the same line, separated by separators
 * @class inputEx.CombineField
 * @extends inputEx.Group
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>separators: array of string inserted</li>
 * </ul>
 */
inputEx.CombineField = function(options) {
   inputEx.CombineField.superclass.constructor.call(this, options);
};

lang.extend( inputEx.CombineField, inputEx.Group, {
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.CombineField.superclass.setOptions.call(this, options);

      this.options.label = options.label;

      // Overwrite options
      this.options.className = options.className ? options.className : 'inputEx-CombineField';

      // Added options
      this.options.separators = options.separators;
   },


	render: function() {

      // Create the div wrapper for this group
	   this.divEl = inputEx.cn('div', {className: this.options.className});
	   if(this.options.id) {
   	   this.divEl.id = this.options.id;
   	}

	   // Label element
	   if(this.options.label) {
	      this.labelDiv = inputEx.cn('div', {id: this.divEl.id+'-label', className: 'inputEx-label', 'for': this.divEl.id+'-field'});
	      this.labelEl = inputEx.cn('label');
	      this.labelEl.appendChild( document.createTextNode(this.options.label) );
	      this.labelDiv.appendChild(this.labelEl);
	      this.divEl.appendChild(this.labelDiv);
      }

  	   this.renderFields(this.divEl);

  	   if(this.options.disabled) {
  	      this.disable();
  	   }

	   // Insert a float breaker
	   this.divEl.appendChild( inputEx.cn('div', {className: "inputEx-clear-div"}, null, " ") );
	},

	/**
	 * Render the subfields
	 */
	renderFields: function(parentEl) {

	   this.appendSeparator(0);

	   if(!this.options.fields) {return;}

	   var i, n=this.options.fields.length, f, field, fieldEl,t;

	   for(i = 0 ; i < n ; i++) {
	      f = this.options.fields[i];
	      if (this.options.required) {f.required = true;}
	      field = this.renderField(f);
	      fieldEl = field.getEl();
	      t = f.type;
	      if(t != "group" && t != "form") {
	         // remove the line breaker (<div style='clear: both;'>)
	         field.divEl.removeChild(fieldEl.childNodes[fieldEl.childNodes.length-1]);
         }
      	// make the field float left
      	Dom.setStyle(fieldEl, 'float', 'left');

      	this.divEl.appendChild(fieldEl);

      	this.appendSeparator(i+1);
	   }

	},

	/**
    * Override to force required option on each subfield
    * @param {Object} fieldOptions The field properties as required by inputEx()
    */
   renderField: function(fieldOptions) {

      // Subfields should inherit required property
      if (this.options.required) {
         if (!fieldOptions.inputParams) {fieldOptions.inputParams = {};}
         fieldOptions.inputParams.required = true;
      }

      return inputEx.CombineField.superclass.renderField.call(this, fieldOptions);
   },

	appendSeparator: function(i) {
	   if(this.options.separators && this.options.separators[i]) {
	      var sep = inputEx.cn('div', {className: 'inputEx-CombineField-separator'}, null, this.options.separators[i]);
	      this.divEl.appendChild(sep);
      }
	},



	/**
	 * Set the value
	 * @param {Array} values [value1, value2, ...]
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(values, sendUpdatedEvt) {
		if(!values) {
         return;
      }
      var i, n=this.inputs.length;
	   for (i = 0 ; i < n ; i++) {
	      this.inputs[i].setValue(values[i], false);
      }

      this.runFieldsInteractions();

	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
	},

	/**
	 * Specific getValue
	 * @return {Array} An array of values [value1, value2, ...]
	 */
	getValue: function() {
	   var values = [], i, n=this.inputs.length;
	   for(i = 0 ; i < n; i++) {
	      values.push(this.inputs[i].getValue());
	   }
	   return values;
	}

});

// Register this class as "combine" type
inputEx.registerType("combine", inputEx.CombineField, [
   { type: 'list', inputParams: {name: 'fields', label: 'Elements', required: true, elementType: {type: 'type'} } },
   { type: 'list', inputParams: {name: 'separators', label: 'Separators', required: true } }
]);

})();