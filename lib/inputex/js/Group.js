(function() {
   
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;
   
/**
 * @class Handle a group of fields
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options The following options are added for Groups and subclasses:
 * <ul>
 *   <li>fields: Array of input fields declared like { label: 'Enter the value:' , type: 'text' or fieldClass: inputEx.Field, optional: true/false, inputParams: {inputparams object} }</li>
 *   <li>legend: The legend for the fieldset (default is an empty string)</li>
 *   <li>collapsible: Boolean to make the group collapsible (default is false)</li>
 *   <li>collapsed: If collapsible only, will be collapsed at creation (default is false)</li>
 *   <li>flatten:</li>
 * </ul>
 */
inputEx.Group = function(options) {
   inputEx.Group.superclass.constructor.call(this,options);
   
   if(this.hasInteractions) {
      for(var i = 0 ; i < this.inputs.length ; i++) {
         this.runInteractions(this.inputs[i],this.inputs[i].getValue());
      }
   }
};
lang.extend(inputEx.Group, inputEx.Field, 
/**
 * @scope inputEx.Group.prototype   
 */   
{
   
   /**
    * Adds some options: legend, collapsible, fields...
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
   
   	this.options = {};
   	
   	this.options.className = options.className || 'inputEx-Group';
   	
   	this.options.fields = options.fields;
   	
   	this.options.id = options.id;
   	
   	this.options.name = options.name;
   	
   	this.options.value = options.value;
   	
   	this.options.flatten = options.flatten;
   
      this.options.legend = options.legend || '';
   
      // leave this for compatibility reasons
      this.inputConfigs = options.fields;
   
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
    */
   renderFields: function(parentEl) {
      
      this.fieldset = inputEx.cn('fieldset');
      this.legend = inputEx.cn('legend', {className: 'inputEx-Group-legend'});
   
      // Option Collapsible
      //TODO: <MF> should it be renamed to 'collapsed'?
      if(this.options.collapsible) {
         var collapseImg = inputEx.cn('div', {className: 'inputEx-Group-collapseImg'}, null, ' ');
         this.legend.appendChild(collapseImg);
         inputEx.sn(this.fieldset,{className:'inputEx-Expanded'});
      }
   
      if(!lang.isUndefined(this.options.legend) && this.options.legend !== ''){
         this.legend.appendChild( document.createTextNode(" "+this.options.legend) );
      }
   
      if( this.options.collapsible || (!lang.isUndefined(this.options.legend) && this.options.legend !== '') ) {
         this.fieldset.appendChild(this.legend);
      }
  	   
      // Iterate this.createInput on input fields
      for (var i = 0 ; i < this.options.fields.length ; i++) {
         var input = this.options.fields[i];
        
         // Render the field
         var field = this.renderField(input);
         this.fieldset.appendChild(field.getEl() );
  	   }
  	
  	   // Collapsed at creation ?
  	   if(this.options.collapsed) {
  	      this.toggleCollapse();
  	   }
  	
  	   // Append the fieldset
  	   parentEl.appendChild(this.fieldset);
   },
  
   /**
    * Instanciate one field given its parameters, type or fieldClass
    * @param {Object} fieldOptions The field properties as required bu inputEx.buildField
    */
   renderField: function(fieldOptions) {

      // Instanciate the field
      var fieldInstance = inputEx.buildField(fieldOptions);      
      
	   this.inputs.push(fieldInstance);
      
      // Create an index to access fields by their name
      if(fieldInstance.options.name) {
         this.inputsNames[fieldInstance.options.name] = fieldInstance;
      }
      
      // Create the this.hasInteractions to run interactions at startup
      if(!this.hasInteractions && fieldOptions.interactions) {
         this.hasInteractions = true;
      }
      
	   // Subscribe to the field "updated" event to send the group "updated" event
      fieldInstance.updatedEvt.subscribe(this.onChange, this, true);
   	  
      return fieldInstance;
   },
  
   /**
    * Add a listener for the 'collapsible' option
    */
   initEvents: function() {
      if(this.options.collapsible) {
         Event.addListener(this.legend, "click", this.toggleCollapse, this, true);
      }
   },

   /**
    * Toggle the collapse state
    */
   toggleCollapse: function() {
      if(Dom.hasClass(this.fieldset, 'inputEx-Expanded')) {
         Dom.replaceClass(this.fieldset, 'inputEx-Expanded', 'inputEx-Collapsed');
      }
      else {
         Dom.replaceClass(this.fieldset, 'inputEx-Collapsed','inputEx-Expanded');
      }
   },
   
   /**
    * Validate each field
    * @returns {Boolean} true if all fields validate and required fields are not empty
    */
   validate: function() {
      var response = true;
      
      // Validate all the sub fields
      for (var i = 0 ; i < this.inputs.length ; i++) {
   	   var input = this.inputs[i];
   	   input.setClassFromState(); // update field classes (mark invalid fields...)
   	   var state = input.getState();
   	   if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
   		   response = false; // but keep looping on fields to set classes
   	   }
      }
      return response;
   },
   
   /**
    * Enable all fields in the group
    */
   enable: function() {
 	   for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].enable();
      }
   },
   
   /**
    * Disable all fields in the group
    */
   disable: function() {
 	   for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].disable();
      }
   },
   
   /**
    * Set the values of each field from a key/value hash object
     * @param {Any} value The group value
     * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
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
      
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
   },
   
   /**
    * Return an object with all the values of the fields
    */
   getValue: function() {
	   var o = {};
	   for (var i = 0 ; i < this.inputs.length ; i++) {
	      var v = this.inputs[i].getValue();
	      if(this.inputs[i].options.name) {
	         if(this.inputs[i].options.flatten && lang.isObject(v) ) {
	            lang.augmentObject( o, v);
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
    */
   close: function() {
      for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].close();
      }
   },

   /**
    * Set the focus to the first input in the group
    */
   focus: function() {
      if( this.inputs.length > 0 ) {
         this.inputs[0].focus();
      }
   },

   /**
    * Return the sub-field instance by its name property
    * @param {String} fieldName The name property
    */
   getFieldByName: function(fieldName) {
      if( !this.inputsNames.hasOwnProperty(fieldName) ) {
         return null;
      }
      return this.inputsNames[fieldName];
   },
   
   
   /**
    * Called when one of the group subfields is updated.
    * @param {String} eventName Event name
    * @param {Array} args Array of [fieldValue, fieldInstance] 
    */
   onChange: function(eventName, args) {

      // Run interactions
      var fieldValue = args[0];
      var fieldInstance = args[1];
      this.runInteractions(fieldInstance,fieldValue);
      
      //this.setClassFromState();
      
      this.fireUpdatedEvt();
   },

   /**
    * Run an action (for interactions)
    * @param {Object} action inputEx action object
    * @param {Any} triggerValue The value that triggered the interaction
    */
   runAction: function(action, triggerValue) {
      var field = this.getFieldByName(action.name);
      if( YAHOO.lang.isFunction(field[action.action]) ) {
         field[action.action].call(field);
      }
      else if( YAHOO.lang.isFunction(action.action) ) {
         action.action.call(field, triggerValue);
      }
      else {
         throw new Error("action "+action.action+" is not a valid action for field "+action.name);
      }
   },
   
   /**
    * Run the interactions for the given field instance
    * @param {inputEx.Field} fieldInstance Field that just changed
    * @param {Any} fieldValue Field value
    */
   runInteractions: function(fieldInstance,fieldValue) {
      
      var index = inputEx.indexOf(fieldInstance, this.inputs);
      var fieldConfig = this.options.fields[index];
      if( YAHOO.lang.isUndefined(fieldConfig.interactions) ) return;
      
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
	 * Clear all subfields
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	clear: function(sendUpdatedEvt) {
	   for(var i = 0 ; i < this.inputs.length ; i++) {
	      this.inputs[i].clear(false);
	   }
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
	}
   
   
});

   
/**
 * Register this class as "group" type
 */
inputEx.registerType("group", inputEx.Group);


})();