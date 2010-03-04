(function() {

   var Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * Create a select field
 * @class inputEx.SelectField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>selectValues: contains the list of options values</li>
 *	   <li>selectOptions: list of option element texts</li>
 *    <li>multiple: boolean to allow multiple selections</li>
 * </ul>
 */
inputEx.SelectField = function(options) {
	inputEx.SelectField.superclass.constructor.call(this,options);
 };
lang.extend(inputEx.SelectField, inputEx.Field, {
   /**
    * Set the default values of the options
    * @param {Object} options Options object as passed to the constructor
    */
	setOptions: function(options) {
	   inputEx.SelectField.superclass.setOptions.call(this,options);
	   
	   this.options.multiple = lang.isUndefined(options.multiple) ? false : options.multiple;
	   this.options.selectValues = [];
	   this.options.selectOptions = [];
	   
	   for (var i=0, length=options.selectValues.length; i<length; i++) {
	      
	      this.options.selectValues.push(options.selectValues[i]);
	      // ""+  hack to convert into text (values may be 0 for example)
	      this.options.selectOptions.push(""+((options.selectOptions && !lang.isUndefined(options.selectOptions[i])) ? options.selectOptions[i] : options.selectValues[i]));
	      
      }
      
   },
   
   /**
    * Build a select tag with options
    */
   renderComponent: function() {

      this.el = inputEx.cn('select', {id: this.divEl.id?this.divEl.id+'-field':YAHOO.util.Dom.generateId(), name: this.options.name || ''});
      
      if (this.options.multiple) {this.el.multiple = true; this.el.size = this.options.selectValues.length;}
      
      this.optionEls = [];
      
      var optionEl;
      for( var i = 0 ; i < this.options.selectValues.length ; i++) {
         
         optionEl = inputEx.cn('option', {value: this.options.selectValues[i]}, null, this.options.selectOptions[i]);
         
         this.optionEls.push(optionEl);
         this.el.appendChild(optionEl);
      }
      this.fieldContainer.appendChild(this.el);
   },
   
   /**
    * Register the "change" event
    */
   initEvents: function() {
      Event.addListener(this.el,"change", this.onChange, this, true);
	   Event.addFocusListener(this.el, this.onFocus, this, true);
	   Event.addBlurListener(this.el, this.onBlur, this, true);
   },
   
   /**
    * Set the value
    * @param {String} value The value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      var index = 0;
      var option;
      for(var i = 0 ; i < this.options.selectValues.length ; i++) {
         if(value === this.options.selectValues[i]) {
            option = this.el.childNodes[i];
		      option.selected = "selected";
         }
      }
      
		// Call Field.setValue to set class and fire updated event
		inputEx.SelectField.superclass.setValue.call(this,value, sendUpdatedEvt);
   },
   
   /**
    * Return the value
    * @return {Any} the selected value from the selectValues array
    */
   getValue: function() {
      return this.options.selectValues[this.el.selectedIndex];
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
   },
   
   /**
    * Add an option in the selector
    * @param {Object} item
    */
   addOption: function(config) {

      var value = config.value,
			 option = ""+(!lang.isUndefined(config.option) ? config.option : config.value),
			 nbOptions = this.options.selectOptions.length,
      	 position = nbOptions, // position of new option (default last)
			 i;
      
      if (lang.isNumber(config.position) && config.position >= 0 && config.position <= position) {
         position = parseInt(config.position,10);
         
      } else if (lang.isString(config.before)) {
         
            for (i = 0 ; i < nbOptions ; i++) {
               if (this.options.selectOptions[i] === config.before) {
                  position = i;
                  break;
               }
            }
            
      } else if (lang.isString(config.after)) {

            for (i = 0 ; i < nbOptions ; i++) {
               if (this.options.selectOptions[i] === config.after) {
                  position = i+1;
                  break;
               }
            }
      }
      
      // update values and options lists
      this.options.selectValues.splice(position,0,value); // insert value at position
      this.options.selectOptions.splice(position,0,option);

      // new option in select
      var newOption = inputEx.cn('option', {value: value}, null, option);
      this.optionEls = this.optionEls.splice(position,0,newOption);
      
      if (position<nbOptions) {
         YAHOO.util.Dom.insertBefore(newOption,this.el.childNodes[position]);
      } else {
         this.el.appendChild(newOption);
      }

      // select new option
      if (!!config.selected) {
         // setTimeout for IE6 (let time to create dom option)
         var that = this;
         setTimeout(function() {that.setValue(value);},0);
      }
   },

   removeOption: function(config) {

      var position,
		    nbOptions = this.options.selectOptions.length,
			 selectedIndex = this.el.selectedIndex,
			 i;
      
      if (lang.isNumber(config.position) && config.position >= 0 && config.position <= nbOptions) {
         
         position = parseInt(config.position,10);
         
      } else if (lang.isString(config.option)) {
         
            for (i = 0 ; i < nbOptions ; i++) {
               if (this.options.selectOptions[i] === config.option) {
                  position = i;
                  break;
               }
            }
            
      } else if (lang.isString(config.value)) {

            for (i = 0 ; i < nbOptions ; i++) {
               if (this.options.selectValues[i] === config.value) {
                  position = i;
                  break;
               }
            }
      }
      
      if (!lang.isNumber(position)) {
         throw new Error("SelectField : invalid or missing position, option or value in removeOption");
      }

      // remove from selectValues / selectOptions array
      this.options.selectValues.splice(position,1); // remove 1 element at position
      this.options.selectOptions.splice(position,1); // remove 1 element at position

      // remove from selector
      this.el.removeChild(this.optionEls[position]);
      this.optionEls.splice(position,1); // remove 1 element at position
      
      // clear if previous selected value doesn't exist anymore
      if (selectedIndex == position) {
         this.clear();
      }
   }
   
});

// Register this class as "select" type
inputEx.registerType("select", inputEx.SelectField, [
   {  type: 'list', name: 'selectValues', label: 'Values', elementType: {type: 'string'}, required: true },
   {  type: 'list', name: 'selectOptions', label: 'Options', elementType: {type: 'string'} }
]);

})();