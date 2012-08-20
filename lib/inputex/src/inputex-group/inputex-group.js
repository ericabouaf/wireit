/**
 * @module inputex-group
 */
YUI.add("inputex-group", function(Y){
   
   var lang = Y.Lang,
       inputEx = Y.inputEx;
       
/**
 * Handle a group of fields
 * @class inputEx.Group
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options The following options are added for Groups and subclasses:
 * <ul>
 *   <li>fields: Array of input fields declared like { label: 'Enter the value:' , type: 'text' or fieldClass: inputEx.Field, optional: true/false, ... }</li>
 *   <li>legend: The legend for the fieldset (default is an empty string)</li>
 *   <li>collapsible: Boolean to make the group collapsible (default is false)</li>
 *   <li>collapsed: If collapsible only, will be collapsed at creation (default is false)</li>
 *   <li>flatten:</li>
 * </ul>
 */
inputEx.Group = function(options) {
   inputEx.Group.superclass.constructor.call(this,options);
   
   // Run default field interactions (if setValue has not been called before)
   if(!this.options.value) {
      this.runFieldsInteractions();
   }
};
Y.extend(inputEx.Group, inputEx.Field, {
   
   /**
    * Adds some options: legend, collapsible, fields...
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      
      inputEx.Group.superclass.setOptions.call(this, options);
      
      this.options.className = options.className || 'inputEx-Group';
      
      this.options.fields = options.fields;
      
      this.options.flatten = options.flatten;
      
      this.options.legend = options.legend || '';
      
      this.options.collapsible = lang.isUndefined(options.collapsible) ? false : options.collapsible;
      this.options.collapsed = lang.isUndefined(options.collapsed) ? false : options.collapsed;
      
      this.options.disabled = lang.isUndefined(options.disabled) ? false : options.disabled;
      
      // Array containing the list of the field instances
      this.inputs = [];

      // Associative array containing the field instances by names
      this.inputsNames = {};
   },

   /**
    * Render the group
    * @method render
    */
   render: function() {
   
      // Create the div wrapper for this group
      this.divEl = inputEx.cn('div', {className: this.options.className});
      if(this.options.id) {
         this.divEl.id = this.options.id;
      }
      
      this.renderFields(this.divEl);
      
      if(this.options.disabled) {
         this.disable();
      }
   },
   
   /**
    * Render all the fields.
    * We use the parentEl so that inputEx.Form can append them to the FORM tag
    * @method renderFields
    */
   renderFields: function(parentEl) {
      
      this.fieldset = inputEx.cn('fieldset');
      this.legend = inputEx.cn('legend', {className: 'inputEx-Group-legend'});
   
      // Option Collapsible
      if(this.options.collapsible) {
         var collapseImg = inputEx.cn('div', {className: 'inputEx-Group-collapseImg'}, null, ' ');
         this.legend.appendChild(collapseImg);
         inputEx.sn(this.fieldset,{className:'inputEx-Expanded'});
      }
   
      if(!lang.isUndefined(this.options.legend) && this.options.legend !== ''){
         this.legend.appendChild( inputEx.cn("span", null, null, " "+this.options.legend) );
      }
   
      if( this.options.collapsible || (!lang.isUndefined(this.options.legend) && this.options.legend !== '') ) {
         this.fieldset.appendChild(this.legend);
      }
      
      // Iterate this.createInput on input fields
      for (var i = 0 ; i < this.options.fields.length ; i++) {
         var fieldOptions = this.options.fields[i];
         
         // Throw Error if input is undefined
         if(!fieldOptions) {
            throw new Error("inputEx.Form: One of the provided fields is undefined ! (check trailing comma)");
         }
         
         // Render the field
         this.addField(fieldOptions);
      }
      
      // Collapsed at creation ?
      if(this.options.collapsed) {
         this.toggleCollapse();
      }
      
      // Append the fieldset
      parentEl.appendChild(this.fieldset);
   },

   /**
    * Render a field and add it to the field set
    * @method addField
    * @param {Object} fieldOptions The field properties as required by the inputEx() method
    */
   addField: function(fieldOptions) {
		var field = this.renderField(fieldOptions);
      this.fieldset.appendChild(field.getEl() );
	},

   /**
    * Instanciate one field given its parameters, type or fieldClass
    * @method renderField
    * @param {Object} fieldOptions The field properties as required by the inputEx() method
    */
   renderField: function(fieldOptions) {

      // Instanciate the field
      var fieldInstance = inputEx(fieldOptions,this);
      
	   this.inputs.push(fieldInstance);
      
      // Create an index to access fields by their name
      if(fieldInstance.options.name) {
         this.inputsNames[fieldInstance.options.name] = fieldInstance;
      } 
      // when the instance is a flatten group, we consider his fields as our fields
      if(fieldInstance.options.flatten && lang.isObject(fieldInstance.inputsNames)){
        Y.mix(this.inputsNames,fieldInstance.inputsNames);
        this.inputs = this.inputs.concat(fieldInstance.inputs);
      }
      
      // Create the this.hasInteractions to run interactions at startup
      if(!this.hasInteractions && fieldOptions.interactions) {
         this.hasInteractions = true;
      }
      
      // Subscribe to the field "updated" event to send the group "updated" event
      fieldInstance.on("updated",this.onChange, this);
      
      return fieldInstance;
   },
  
   /**
    * Add a listener for the 'collapsible' option
    * @method initEvents
    */
   initEvents: function() {
      if(this.options.collapsible) {
         Y.on("click", this.toggleCollapse,this.legend, this);
      }
   },

   /**
    * Toggle the collapse state
    * @method toggleCollapse
    */
   toggleCollapse: function() {
      if(Y.one(this.fieldset).hasClass( 'inputEx-Expanded')) {
        Y.one(this.fieldset).replaceClass('inputEx-Expanded', 'inputEx-Collapsed');
      }
      else {
         Y.one(this.fieldset).replaceClass( 'inputEx-Collapsed','inputEx-Expanded');
      }
   },
   
   /**
    * Validate each field
    * @method validate
    * @return {Boolean} true if all fields validate and required fields are not empty
    */
   validate: function() {
      var response = true;

      // Validate all the sub fields
      for (var i = 0; i < this.inputs.length; i++) {
         var input = this.inputs[i];
         if (!input.isDisabled()) {
            var state = input.getState();
            input.setClassFromState(state); // update field classes (mark invalid fields...)
            if (state == inputEx.stateRequired || state == inputEx.stateInvalid) {
               response = false; // but keep looping on fields to set classes
            }
         }
      }
      return response;
   },
	
	/**
	 * Alternative method to validate for advanced error handling
	 * @method getFieldsStates
	 * @return {Object} with all Forms's fields state, error message
	 * and validate containing a boolean for the global Form validation
	 */
	getFieldsStates: function() {
		var input, inputName, state, message,
		returnedObj = { fields:{}, validate:true };
      
      // Loop on all the sub fields
      for (var i = 0 ; i < this.inputs.length ; i++) {
         
         input = this.inputs[i];
         inputName = input.options.name;
         state = input.getState();
         message = input.getStateString(state);
         
         returnedObj.fields[inputName] = {};
         returnedObj.fields[inputName].valid = true;
         returnedObj.fields[inputName].message = message;
         
         // check if subfield validates
         if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
            returnedObj.fields[inputName].valid = false;
            returnedObj.validate = false;
         }

      }

      return returnedObj;
	},
   
   /**
    * Enable all fields in the group
    * @method enable
    */
   enable: function() {
      for (var i = 0 ; i < this.inputs.length ; i++) {
         this.inputs[i].enable();
      }
   },
   
   /**
    * Disable all fields in the group
    * @method disable
    */
   disable: function() {
      for (var i = 0 ; i < this.inputs.length ; i++) {
         this.inputs[i].disable();
      }
   },
   
   /**
    * Set the values of each field from a key/value hash object
    * @method setValue
    * @param {Any} value The group value
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(oValues, sendUpdatedEvt) {
      if(!oValues) {
         return;
      }
	   for (var i = 0 ; i < this.inputs.length ; i++) {
	      var field = this.inputs[i];
	      var name = field.options.name;
	      if(name && !lang.isUndefined(oValues[name]) ) {
	         field.setValue(oValues[name], false); // don't fire the updated event !
	      }
	      else {
	         field.clear(false);
	      }
      }
      
      this.runFieldsInteractions();
      
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
   },
   
   /**
    * Return an object with all the values of the fields
    * @method getValue
    */
   getValue: function() {
	   var o = {};
	   for (var i = 0 ; i < this.inputs.length ; i++) {
	      var v = this.inputs[i].getValue();
	      if(this.inputs[i].options.name) {
	         if(this.inputs[i].options.flatten && lang.isObject(v) ) {
	            Y.mix( o, v);
	         }
	         else {
		         o[this.inputs[i].options.name] = v;
	         }
	      }
      }
	   return o;
   },
  
   /**
    * Close the group (recursively calls "close" on each field, does NOT hide the group )
    * Call this function before hidding the group to close any field popup
    * @method close
    */
   close: function() {
      for (var i = 0 ; i < this.inputs.length ; i++) {
         this.inputs[i].close();
      }
   },

   /**
    * Set the focus to the first input in the group
    * @method focus
    */
   focus: function() {
      if( this.inputs.length > 0 ) {
         this.inputs[0].focus();
      }
   },

   /**
    * Return the sub-field instance by its name property
    * @method getFieldByName
    * @param {String} fieldName The name property
    */
   getFieldByName: function(fieldName) {
      if( !this.inputsNames.hasOwnProperty(fieldName) ) {
         return null;
      }
      return this.inputsNames[fieldName];
   },

   /**
    * Find a field anywhere in the hierarchy this group is a part of.
    * @method findFieldByName
    * @param {String} fieldName The name property
    * @param {Boolean} descendOnly Set true to only look at children of this group
    */
   findFieldByName: function(fieldName, descendOnly) {
      var search = this,
          parent,
          field;

      if (descendOnly) {
         if (this.inputsNames.hasOwnProperty(fieldName) && (field = this.inputsNames[fieldName])) {
            for (var group, inputs = this.inputs, i = 0, len = inputs.length; i < len; ++i) {
               group = inputs[i];
               if (lang.isFunction(group.getFieldByName) &&
                     (field = group.getFieldByName(fieldName, true))) {
                  break;
               }
            }
         }

         return field;
      }
      else {
         while ((parent = search.getParentField()) &&
               lang.isFunction(parent.getFieldByName)) {
            search = parent;
         }
         return search.getFieldByName(fieldName, true);
      }
   },


   /**
    * Called when one of the group subfields is updated.
    * @method onChange
    * @param {String} eventName Event name
    * @param {Array} args Array of [fieldValue, fieldInstance] 
    */
   onChange: function(fieldValue, fieldInstance) {

      // Run interactions
      this.runInteractions(fieldInstance,fieldValue);
      
      //this.setClassFromState();
      
      this.fireUpdatedEvt();
   },

   /**
    * Run an action (for interactions)
    * @method runAction
    * @param {Object} action inputEx action object
    * @param {Any} triggerValue The value that triggered the interaction
    */
   runAction: function(action, triggerValue) {
      var field = this.getFieldByName(action.name);
      if( lang.isFunction(field[action.action]) ) {
         field[action.action].call(field);
      }
      else if( lang.isFunction(action.action) ) {
         action.action.call(field, triggerValue);
      }
      else {
         throw new Error("action "+action.action+" is not a valid action for field "+action.name);
      }
   },
   
   /**
    * Run the interactions for the given field instance
    * @method runInteractions
    * @param {inputEx.Field} fieldInstance Field that just changed
    * @param {Any} fieldValue Field value
    */
   runInteractions: function(fieldInstance,fieldValue) {
      
      var index = inputEx.indexOf(fieldInstance, this.inputs);
      var fieldConfig = this.options.fields[index];
      if(lang.isUndefined(fieldConfig.interactions) ) return;
      
      // Let's run the interactions !
      var interactions = fieldConfig.interactions;
      for(var i = 0 ; i < interactions.length ; i++) {
         var interaction = interactions[i];
         if(interaction.valueTrigger === fieldValue) {
            for(var j = 0 ; j < interaction.actions.length ; j++) {
               this.runAction(interaction.actions[j], fieldValue);
            }
         }
      }
      
   },
   
   /**
    * Run the interactions for all fields
    * @method runFieldsInteractions
    */
   runFieldsInteractions: function() {
      if(this.hasInteractions) {
         for(var i = 0 ; i < this.inputs.length ; i++) {
            this.runInteractions(this.inputs[i],this.inputs[i].getValue());
         }
      }
   },
   
	/**
	 * Clear all subfields
	 * @method clear
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the 'updated' event or not (default is true, pass false to NOT send the event)
	 */
	clear: function(sendUpdatedEvt) {
	   for(var i = 0 ; i < this.inputs.length ; i++) {
	      this.inputs[i].clear(false);
	   }
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
	},
	
	/**
	 * Write error messages for fields as specified in the hash
	 * @method setErrors
	 * @param {Object || Array} errors Hash object containing error messages as Strings referenced by the field name, or array [ ["fieldName", "Message"], ...]
	 */
	setErrors: function(errors) {	
		var i,k;
		if(lang.isArray(errors)) {
			for(i = 0 ; i < errors.length ; i++) {
				k = errors[i][0];
				value = errors[i][1];
				if(this.inputsNames[k]) {
					if(this.inputsNames[k].options.showMsg) {
						this.inputsNames[k].displayMessage(value);
						Y.one(this.inputsNames[k].divEl).replaceClass("inputEx-valid", "inputEx-invalid" );
					}
				}
			}
		}
		else if(lang.isObject(errors)) {
			for(k in errors) {
				if(errors.hasOwnProperty(k)) {
					if(this.inputsNames[k]) {
						if(this.inputsNames[k].options.showMsg) {
							this.inputsNames[k].displayMessage(errors[k]);
							Y.one(this.inputsNames[k].divEl).replaceClass("inputEx-valid", "inputEx-invalid" );
						}
					}
				}
			}
		}
	},
	
   /**
    * Compatibility with classic forms in listField for instance
    * @method setFieldName
    */
    setFieldName: function(name){
			var l = this.inputs.length;
			for (var i = 0; i < l; i++){
				this.inputs[i].setFieldName(name+""+((this.inputs[i].el && this.inputs[i].el.name )|| "group-"+i ));
			}
    },
   
   /**
    * Purge all event listeners and remove the component from the dom
    * @method destroy
    */
   destroy: function() {
      
      var i, length, field;
      
      // Recursively destroy inputs
      for (i = 0, length = this.inputs.length ; i < length ; i++) {
         field = this.inputs[i];
         field.destroy();
      }
      
      // Destroy group itself
      inputEx.Group.superclass.destroy.call(this);
      
   }
   
   
});

   
// Register this class as "group" type
inputEx.registerType("group", inputEx.Group, [
   { type: "string", label: "Name", name: "name", value: '' },
   { type: 'string', label: 'Legend', name:'legend'},
   { type: 'boolean', label: 'Collapsible', name:'collapsible', value: false},
   { type: 'boolean', label: 'Collapsed', name:'collapsed', value: false},
   { type: 'list', label: 'Fields', name: 'fields', elementType: {type: 'type' } }
], true);


}, '3.1.0',{
  requires: ["inputex-field"]
});
