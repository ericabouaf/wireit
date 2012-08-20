/**
 * @module inputex-type
 */
YUI.add("inputex-type", function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * TypeField is a field to create fields. The user can create any value he wants by switching fields.
 * @class inputEx.TypeField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options  Standard inputEx options definition
 */
inputEx.TypeField = function(options) {
   inputEx.TypeField.superclass.constructor.call(this, options);
};

Y.extend(inputEx.TypeField, inputEx.Field, {
   
   /**
    * Render the TypeField: create a button with a property panel that contains the field options
    * @method renderComponent
    */
   renderComponent: function() {
      // DIV element to wrap the Field "default value"
      this.fieldValueWrapper = inputEx.cn('div', {className: "inputEx-TypeField-FieldValueWrapper"});
      this.fieldContainer.appendChild( this.fieldValueWrapper );
      
      // Render the popup that will contain the property form
      this.propertyPanel = inputEx.cn('div', {className: "inputEx-TypeField-PropertiesPanel"}, {display: 'none'});
      
      // The list of all inputEx declared types to be used in the "type" selector
      var selectOptions = [];
      for(var key in inputEx.typeClasses) {
         if(inputEx.typeClasses.hasOwnProperty(key)) {
            selectOptions.push( { value : key } );
         }
      }
      this.typeSelect = new inputEx.SelectField({label: "Type", choices: selectOptions, parentEl: this.propertyPanel});

      // DIV element to wrap the options group
      this.groupOptionsWrapper = inputEx.cn('div');
      this.propertyPanel.appendChild( this.groupOptionsWrapper );
      
      // Button to switch the panel
      this.button = inputEx.cn('div', {className: "inputEx-TypeField-EditButton"});
      this.button.appendChild(this.propertyPanel);
      this.fieldContainer.appendChild(this.button);
      
      // Build the groupOptions
      this.rebuildGroupOptions();
   },
   
   /**
    * Adds 2 event listeners: 
    *  - on the button to toggel the propertiesPanel
    * @method initEvents
    */
   initEvents: function() {
      inputEx.TypeField.superclass.initEvents.call(this); 
      
      // "Toggle the properties panel" button :
      Y.one(this.button).on('click', this.onTogglePropertiesPanel, this, true);
      
      // Prevent the button to receive a "click" event if the propertyPanel doesn't catch it
      Y.one(this.propertyPanel).on('click', function(e) { e.stopPropagation();}, this, true);
      
      // Listen the "type" selector to update the groupOptions
      // Hack the type selector to rebuild the group option
      this.typeSelect.on('updated', this.rebuildGroupOptions, this, true);
   },
   
   /**
    * Regenerate the property form
    * @method rebuildGroupOptions
    */
   rebuildGroupOptions: function() {
      try {
         
         // Save the previous value:
         var previousVal = null;
         
         // Close a previously created group
         if(this.group) {
            previousVal = this.group.getValue();
            this.group.close();
            this.group.destroy();
            this.groupOptionsWrapper.innerHTML = "";
         }
      
         // Get value is directly the class !!
         var classO = inputEx.getFieldClass(this.typeSelect.getValue());
         
         // Instanciate the group
         var groupParams = {fields: classO.groupOptions, parentEl: this.groupOptionsWrapper};
         this.group = new inputEx.Group(groupParams);
         
         // Set the previous name/label
         if(previousVal) {
            this.group.setValue({
               name: previousVal.name,
               label: previousVal.label
            });
         }
         
         // Register the updated event
         this.group.on('updated', this.onChangeGroupOptions, this, true);
            
         // Create the value field
         this.updateFieldValue();
         
      } catch(ex) {
         if(Y.Lang.isObject(window["console"]) && Y.Lang.isFunction(window["console"]["log"]) ) {
            console.log("inputEx.TypeField.rebuildGroupOptions: ", ex);
         }
      }
         
   },
   
   /**
    * Toggle the property panel
    * @method onTogglePropertiesPanel
    */
   onTogglePropertiesPanel: function() {
      if (this.propertyPanel.style.display == 'none') {
         this.propertyPanel.style.display = '';
         Y.one(this.button).addClass(this.button, "opened");
      } else {
         this.propertyPanel.style.display = 'none';
         Y.one(this.button).removeClass("opened");
      }
   },
   
   /**
    * Update the fieldValue with the changed properties
    * @method onChangeGroupOptions
    */
   onChangeGroupOptions: function() {
      
      // Update the field value 
      this.updateFieldValue();
      
      // Fire "updated" event
      this.fireUpdatedEvt();
   },
   
   /**
    * Update the fieldValue
    * @method updateFieldValue
    */
   updateFieldValue: function() {
      try {
         // Close previous field
         if(this.fieldValue) {
            this.fieldValue.close();
            this.fieldValue.destroy();
            delete this.fieldValue;
            this.fieldValueWrapper.innerHTML = '';
         }
      
         // Re-build the fieldValue
         var fieldOptions = this.group.getValue();
         
         fieldOptions.type = this.getValue().type;
         fieldOptions.parentEl = this.fieldValueWrapper;
         
         this.fieldValue = inputEx(fieldOptions,this);
      
         // Refire the event when the fieldValue is updated
         this.fieldValue.on('updated', this.fireUpdatedEvt, this, true);
      }
      catch(ex) {	
         if(Y.Lang.isObject(window["console"]) && Y.Lang.isFunction(window["console"]["log"]) ) {
         	console.log("Error while updateFieldValue", ex.message);
			}
      }
   },
   
   
   /**
    * Set the value of the label, typeProperties and group
    * @method setValue
    * @param {Object} value Type object configuration
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {

      // Set type in property panel
      this.typeSelect.setValue(value.type, false);
      
      // Rebuild the panel propertues
      this.rebuildGroupOptions();
      
      // Set the parameters value
      this.group.setValue(value, false);
      
      // Rebuild the fieldValue
      this.updateFieldValue();
      
      // Set field value :
		// fix it for default value (because updateFieldValue is called after first setValue)
 		var that = this;      

      // New prefered way to describe a field
      if (!lang.isUndefined(value.value)) {
			setTimeout(function(){
				that.fieldValue.setValue(value.value, false);
			}, 50);
      }
      
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt(false);
      }
   },
   
   /**
    * Return the config for a entry in an Group
    * @method getValue
    * @return {Object} Type object configuration
    */
   getValue: function() {
      
      var getDefaultValueForField = function (classObj, paramName) {
         var i, length = classObj.groupOptions.length, f;
         
         for(i = 0 ; i < length ; i++) {
            f = classObj.groupOptions[i];
            
            // New prefered way to use field options
            if (f.name == paramName) {
               return f.value;
            }
         }
         return undefined;
      };
      
      
      // The field parameters
      var fieldParams = this.group.getValue();
      var classObj = inputEx.getFieldClass(this.typeSelect.getValue());
      
      // + default values
      for(var key in fieldParams) {
         if( fieldParams.hasOwnProperty(key) ) {
            var value1 = getDefaultValueForField(classObj, key);
            var value2 = fieldParams[key];
            if(value1 == value2) {
               fieldParams[key] = undefined;
            }
         }
      }
      
      // The field type
      fieldParams.type = this.typeSelect.getValue();
      
      // The value defined by the fieldValue
      if(this.fieldValue) fieldParams.value = this.fieldValue.getValue();
      
      return fieldParams;
   }
   
});


// Register this class as "type" type
inputEx.registerType("type", inputEx.TypeField, []);

}, '3.1.0',{
requires: ['inputex-field','inputex-group','inputex-select', 'inputex-list','inputex-string','inputex-checkbox','inputex-integer']
});
