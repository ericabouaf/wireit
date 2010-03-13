/**
 * Include the form library inputEx + WirableField + FormContainer
 *
 * WARNING: This file should be placed between "inputEx/field.js" and all other inputEx fields
 *
 * See the inputEx website for documentation of the fields & forms: http://neyric.github.com/inputex
 *
 * @module inputex-plugin
 */
/**
 * Class used to build a container with inputEx forms
 * @class FormContainer
 * @namespace WireIt
 * @extends WireIt.Container
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.FormContainer = function(options, layer) {
   WireIt.FormContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.FormContainer, WireIt.Container, {
	   
   /**
    * @method setOptions
    */
   setOptions: function(options) {
      WireIt.FormContainer.superclass.setOptions.call(this, options);
   },
   
   /**
    * The render method is overrided to call renderForm
    * @method render
    */
   render: function() {
      WireIt.FormContainer.superclass.render.call(this);
      this.renderForm();
   },
   
   /**
    * Render the form
    * @method renderForm
    */
   renderForm: function() {
	  this.setBackReferenceOnFieldOptionsRecursively(this.options.fields);
      
      var groupParams = {parentEl: this.bodyEl, fields: this.options.fields, legend: this.options.legend, collapsible: this.options.collapsible};
      this.form = new YAHOO.inputEx.Group(groupParams);
   },
   
	/**
	 * When creating wirable input fields, the field configuration must have a reference to the current container (this is used for positionning).
	 * For complex fields (like object or list), the reference is set recursively AFTER the field creation.
	 * @method setBackReferenceOnFieldOptionsRecursively
	 */
   setBackReferenceOnFieldOptionsRecursively: function(fieldArray, container) {
       if (YAHOO.lang.isUndefined(container))
			container = this;
	
      for(var i = 0 ; i < fieldArray.length ; i++) {
    	  var inputParams = fieldArray[i];
    	  inputParams.container = container;

    	  // Checking for group sub elements
    	  if(inputParams.fields && typeof inputParams.fields == 'object') {
    		  this.setBackReferenceOnFieldOptionsRecursively(inputParams.fields);
    	  }

    	  // Checking for list sub elements
    	  if(inputParams.elementType) {
    		  inputParams.elementType.container = container;

    		  // Checking for group elements within list elements
    		  if(inputParams.elementType.fields && typeof inputParams.elementType.fields == 'object') {
    			  this.setBackReferenceOnFieldOptionsRecursively(inputParams.elementType.fields);
    		  }
    	  }
      }
   },
   
   /**
    * @method getValue
    */
   getValue: function() {
      return this.form.getValue();
   },
   
   /**
    * @method setValue
    */
   setValue: function(val) {
      this.form.setValue(val);
   }
   
});
