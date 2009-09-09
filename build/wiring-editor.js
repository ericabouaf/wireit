/** 
 * @fileoverview Main inputEx file. Define inputEx namespace in YAHOO.inputEx
 */
(function() {
 
 var lang = YAHOO.lang;
 
/**
 * Build a field from an object like: { type: 'color' or fieldClass: inputEx.ColorField, inputParams: {} }<br />
 * The inputParams property is the object that will be passed as the <code>options</code> parameter to the field class constructor.<br />
 * If the neither type or fieldClass are found, it uses inputEx.StringField
 * @name inputEx
 * @namespace The inputEx global namespace object.
 * @static
 * @param {Object} fieldOptions
 * @return {inputEx.Field} Created field instance
 */
YAHOO.inputEx = function(fieldOptions) {
   var fieldClass = null;
	if(fieldOptions.type) {
	   fieldClass = YAHOO.inputEx.getFieldClass(fieldOptions.type);
	   if(fieldClass === null) fieldClass = YAHOO.inputEx.StringField;
	}
	else {
	   fieldClass = fieldOptions.fieldClass ? fieldOptions.fieldClass : inputEx.StringField;
	}

   // Instanciate the field
   var inputInstance = new fieldClass(fieldOptions.inputParams);

   // Add the flatten attribute if present in the params
   /*if(fieldOptions.flatten) {
      inputInstance._flatten = true;
   }*/
	  
   return inputInstance;
};

/**
 * Test de documentation inputEx
 */
var inputEx = YAHOO.inputEx;

lang.augmentObject(inputEx, 
/**
 * @scope inputEx
 */   
{
   
   VERSION: "0.2.1",
   
   /**
    * Url to the spacer image. This url schould be changed according to your project directories
    * @type String
    */
   spacerUrl: "images/space.gif", // 1x1 px
   
   /**
    * Field empty state constant
    * @type String
    */
   stateEmpty: 'empty',
   
   /**
    * Field required state constant
    * @type String
    */
   stateRequired: 'required',
   
   /**
    * Field valid state constant
    * @type String
    */
   stateValid: 'valid',
   
   /**
    * Field invalid state constant
    * @type String
    */
   stateInvalid: 'invalid',
   
   /**
    * Associative array containing field messages
    */
   messages: {
   	required: "This field is required",
   	invalid: "This field is invalid",
   	valid: "This field is valid",
   	defaultDateFormat: "m/d/Y",
   	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
   },
   
   /**
    * @namespace inputEx widget namespace
    */
   widget: {},
   
   /**
    * Associative array containing common regular expressions
    */
   regexps: {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i,
      password: /^[0-9a-zA-Z\x20-\x7E]*$/
   },
   
   /**
    * Hash between inputEx types and classes (ex: <code>inputEx.typeClasses.color = inputEx.ColorField</code>)<br />
    * Please register the types with the <code>registerType</code> method
    */
   typeClasses: {},
   
   /**
    * When you create a new inputEx Field Class, you can register it to give it a simple type.
    * ex:   inputEx.registerType("color", inputEx.ColorField);
    * @static
    */
   registerType: function(type, field) {
      if(!lang.isString(type)) {
         throw new Error("inputEx.registerType: first argument must be a string");
      }
      if(!lang.isFunction(field)) {
         throw new Error("inputEx.registerType: second argument must be a function");
      }
      this.typeClasses[type] = field;
   },
   
   /**
    * Returns the class for the given type
    * ex: inputEx.getFieldClass("color") returns inputEx.ColorField
    * @static
    * @param {String} type String type of the field
    */
   getFieldClass: function(type) {
      return lang.isFunction(this.typeClasses[type]) ? this.typeClasses[type] : null;
   },
   
   /**
    * Get the inputex type for the given class (ex: <code>inputEx.getType(inputEx.ColorField)</code> returns "color")
    * @static
    * @param {inputEx.Field} FieldClass An inputEx.Field or derivated class
    * @return {String} returns the inputEx type string or <code>null</code>
    */
   getType: function(FieldClass) {
      for(var type in this.typeClasses) {
         if(this.typeClasses.hasOwnProperty(type) ) {
            if(this.typeClasses[type] == FieldClass) {
               return type;
            }
         }
      }
      return null;
   },
   
   /**
    * Kept for backward compatibility
    * @alias inputEx
    * @param {Object} fieldOptions
    * @return {inputEx.Field} Created field instance
    */
   buildField: function(fieldOptions) {      
      return inputEx(fieldOptions);
   },
   
   /**
    * Helper function to set DOM node attributes and style attributes.
    * @static
    * @param {HTMLElement} el The element to set attributes to
    * @param {Object} domAttributes An object containing key/value pairs to set as node attributes (ex: {id: 'myElement', className: 'myCssClass', ...})
    * @param {Object} styleAttributes Same thing for style attributes. Please use camelCase for style attributes (ex: backgroundColor for 'background-color')
    */
   sn: function(el,domAttributes,styleAttributes){
      if(!el) { return; }

      if(domAttributes){
         for(var i in domAttributes){
            var domAttribute = domAttributes[i];
            if( lang.isFunction(domAttribute) ){
               continue;
            }
            if(i=="className"){
               i="class";
               el.className=domAttribute;
            }
            if(domAttribute!==el.getAttribute(i)){
               try{
                  if(domAttribute===false){
                     el.removeAttribute(i);
                  }else{
                     el.setAttribute(i,domAttribute);
                  }
               }
               catch(err){
                  //console.log("WARNING: WireIt.sn failed for "+el.tagName+", attr "+i+", val "+domAttribute);
               }
            }
         }
      }

      if(styleAttributes){
         for(var i in styleAttributes){
            if( lang.isFunction(styleAttributes[i]) ){
               continue;
            }
            if(el.style[i]!=styleAttributes[i]){
               el.style[i]=styleAttributes[i];
            }
         }
      }
   },


   /**
    * Helper function to create a DOM node. (wrapps the document.createElement tag and the inputEx.sn functions)
    * @static
    * @param {String} tag The tagName to create (ex: 'div', 'a', ...)
    * @param {Object} [domAttributes] see inputEx.sn
    * @param {Object} [styleAttributes] see inputEx.sn
    * @param {String} [innerHTML] The html string to append into the created element
    * @return {HTMLElement} The created node
    */
   cn: function(tag, domAttributes, styleAttributes, innerHTML) {
        if (tag == 'input' && YAHOO.env.ua.ie) { //only limit to input tag that has no tag body
            var strDom = '<' + tag;
            if (domAttributes!=='undefined'){
                for (var k in domAttributes){
                    strDom += ' ' + k + '="' + domAttributes[k] + '"';
                }
            }
            strDom += '/' + '>';
            return document.createElement(strDom);

        } else {
            var el = document.createElement(tag);
            this.sn(el, domAttributes, styleAttributes);
            if (innerHTML) {
                el.innerHTML = innerHTML;
            }
            return el;
        }
    },
   
   
   /**
    * Find the position of the given element. (This method is not available in IE 6)
    * @static
    * @param {Object} el Value to search
    * @param {Array} arr The array to search
    * @return {number} Element position, -1 if not found
    */
   indexOf: function(el,arr) {
      var l=arr.length,i;
      for(i = 0 ;i < l ; i++) {
         if(arr[i] == el) return i;
      }
      return -1;
   },

   
   /**
    * Create a new array without the null or undefined values
    * @static
    * @param {Array} arr The array to compact
    * @return {Array} The new array
    */
   compactArray: function(arr) {
      var n = [], l=arr.length,i;
      for(i = 0 ; i < l ; i++) {
         if( !lang.isNull(arr[i]) && !lang.isUndefined(arr[i]) ) {
            n.push(arr[i]);
         }
      }
      return n;
   }
   
});

})();


// The main inputEx namespace shortcut
var inputEx = YAHOO.inputEx;
(function() {
   var inputEx = YAHOO.inputEx, Dom = YAHOO.util.Dom, lang = YAHOO.lang, util = YAHOO.util;

/** 
 * @class An abstract class that contains the shared features for all fields
 * @constructor
 * @param {Object} options Configuration object
 * <ul>
 *	  <li>name: the name of the field</li>
 *	  <li>required: boolean, the field cannot be null if true</li>
 *   <li>className: CSS class name for the div wrapper (default 'inputEx-Field')</li>
 *   <li>value: initial value</li>
 *   <li>parentEl: HTMLElement or String id, append the field to this DOM element</li>
 * </ul>
 */
inputEx.Field = function(options) {
	
   if(!options) {var options = {}; }
	
	// Set the default values of the options
	this.setOptions(options);
	
	// Call the render of the dom
	this.render();
	
	/**
	 * @event
	 * @param {Any} value The new value of the field
	 * @desc YAHOO custom event fired when the field is "updated"<br /> subscribe with: this.updatedEvt.subscribe(function(e, params) { var value = params[0]; console.log("updated",value, this.updatedEvt); }, this, true);
	 */
	this.updatedEvt = new util.CustomEvent('updated', this);
	
	// initialize behaviour events
	this.initEvents();
	
	// Set the initial value
	//   -> no initial value = no style (setClassFromState called by setValue)
	if(!lang.isUndefined(this.options.value)) {
		this.setValue(this.options.value, false);
	}
	
	// append it immediatly to the parent DOM element
	if(options.parentEl) {
	   if( lang.isString(options.parentEl) ) {
	     Dom.get(options.parentEl).appendChild(this.getEl());  
	   }
	   else {
	      options.parentEl.appendChild(this.getEl());
      }
	}
};


inputEx.Field.prototype = {
  
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
	setOptions: function(options) {

   	/**
   	 * Configuration object to set the options for this class and the parent classes. See constructor details for options added by this class.
   	 */
   	this.options = {};
   	
   	// Basic options
   	this.options.name = options.name;
   	this.options.value = options.value;
   	this.options.id = options.id || Dom.generateId();
   	this.options.label = options.label;
   	this.options.description = options.description;
   
      // Define default messages
	   this.options.messages = {};
	   this.options.messages.required = (options.messages && options.messages.required) ? options.messages.required : inputEx.messages.required;
	   this.options.messages.invalid = (options.messages && options.messages.invalid) ? options.messages.invalid : inputEx.messages.invalid;
	   //this.options.messages.valid = (options.messages && options.messages.valid) ? options.messages.valid : inputEx.messages.valid;
	
	   // Other options
	   this.options.className = options.className ? options.className : 'inputEx-Field';
	   this.options.required = lang.isUndefined(options.required) ? false : options.required;
	   this.options.showMsg = lang.isUndefined(options.showMsg) ? false : options.showMsg;
	},

   /**
    * Default render of the dom element. Create a divEl that wraps the field.
    */
	render: function() {
	
	   // Create a DIV element to wrap the editing el and the image
	   this.divEl = inputEx.cn('div', {className: 'inputEx-fieldWrapper'});
	   if(this.options.id) {
	      this.divEl.id = this.options.id;
	   }
	   if(this.options.required) {
	      Dom.addClass(this.divEl, "inputEx-required");
	   }
	   
	   // Label element
	   if(this.options.label) {
	      this.labelDiv = inputEx.cn('div', {id: this.divEl.id+'-label', className: 'inputEx-label', 'for': this.divEl.id+'-field'});
	      this.labelEl = inputEx.cn('label');
	      this.labelEl.appendChild( document.createTextNode(this.options.label) );
	      this.labelDiv.appendChild(this.labelEl);
	      this.divEl.appendChild(this.labelDiv);
      }
      
      this.fieldContainer = inputEx.cn('div', {className: this.options.className}); // for wrapping the field and description
	
      // Render the component directly
      this.renderComponent();
      
      // Description
      if(this.options.description) {
         this.fieldContainer.appendChild(inputEx.cn('div', {id: this.divEl.id+'-desc', className: 'inputEx-description'}, null, this.options.description));
      }
      
   	this.divEl.appendChild(this.fieldContainer);
      
	   // Insert a float breaker
	   this.divEl.appendChild( inputEx.cn('div',null, {clear: 'both'}," ") );
	
	},
	
	/**
	 * Fire the "updated" event (only if the field validated)
	 * Escape the stack using a setTimeout
	 */
	fireUpdatedEvt: function() {
      // Uses setTimeout to escape the stack (that originiated in an event)
      var that = this;
      setTimeout(function() {
         that.updatedEvt.fire(that.getValue(), that);
      },50);
	},

   /**
    * Render the interface component into this.divEl
    */
	renderComponent: function() {
 	   // override me
	},

   /**
    * The default render creates a div to put in the messages
    * @return {HTMLElement} divEl The main DIV wrapper
    */
	getEl: function() {
	   return this.divEl;
	},

   /**
    * Initialize events of the Input
    */
	initEvents: function() {
 	   // override me
	},

   /**
    * Return the value of the input
    * @return {Any} value of the field
    */
	getValue: function() { 
	   // override me
	},

   /**
    * Function to set the value
    * @param {Any} value The new value
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
	setValue: function(value, sendUpdatedEvt) {
	   // to be inherited
	   
	   // set corresponding style
	   this.setClassFromState();
	   
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
	},

   /**
    * Set the styles for valid/invalide state
    */
	setClassFromState: function() {
	
	   // remove previous class
	   if( this.previousState ) {
	      // remove invalid className for both required and invalid fields
	      var className = 'inputEx-'+((this.previousState == inputEx.stateRequired) ? inputEx.stateInvalid : this.previousState);
		   Dom.removeClass(this.divEl, className);
	   }
	   
	   // add new class
	   var state = this.getState();
	   if( !(state == inputEx.stateEmpty && Dom.hasClass(this.divEl, 'inputEx-focused') ) ) {
	      // add invalid className for both required and invalid fields
	      var className = 'inputEx-'+((state == inputEx.stateRequired) ? inputEx.stateInvalid : state);
	      Dom.addClass(this.divEl, className );
      }
	
	   if(this.options.showMsg) {
	      this.displayMessage( this.getStateString(state) );
      }
	   
	   this.previousState = state;
	},

   /**
    * Get the string for the given state
    */
	getStateString: function(state) {
      if(state == inputEx.stateRequired) {
         return this.options.messages.required;
      }
      else if(state == inputEx.stateInvalid) {
         return this.options.messages.invalid;
      }
      else {
         return '';
      }
	},

   /**
    * Returns the current state (given its value)
    * @return {String} One of the following states: 'empty', 'required', 'valid' or 'invalid'
    */
	getState: function() { 
	   // if the field is empty :
	   if( this.isEmpty() ) {
	      return this.options.required ? inputEx.stateRequired : inputEx.stateEmpty;
	   }
	   return this.validate() ? inputEx.stateValid : inputEx.stateInvalid;
	},

   /**
    * Validation of the field
    * @return {Boolean} field validation status (true/false)
    */
	validate: function() {
      return true;
   },

   /**
    * Function called on the focus event
    * @param {Event} e The original 'focus' event
    */
	onFocus: function(e) {
	   var el = this.getEl();
	   Dom.removeClass(el, 'inputEx-empty');
	   Dom.addClass(el, 'inputEx-focused');
	},

   /**
    * Function called on the blur event
    * @param {Event} e The original 'blur' event
    */
	onBlur: function(e) {
	   Dom.removeClass(this.getEl(), 'inputEx-focused');
	   
	   // Call setClassFromState on Blur
	   this.setClassFromState();
	},

   /**
    * onChange event handler
    * @param {Event} e The original 'change' event
    */
	onChange: function(e) {
      this.fireUpdatedEvt();
	},

   /**
    * Close the field and eventually opened popups...
    */
	close: function() {
	},

   /**
    * Disable the field
    */
	disable: function() {
	},

   /**
    * Enable the field
    */
	enable: function() {
	},

   /**
    * Focus the field
    */
   focus: function() {
   },
   
   /**
    * Purge all event listeners and remove the component from the dom
    */
   destroy: function() {
      var el = this.getEl();
      
      // Unsubscribe all listeners on the updatedEvt
      this.updatedEvt.unsubscribeAll();
      
      // Remove from DOM
      if(Dom.inDocument(el)) {
         el.parentNode.removeChild(el);
      }
      
      // recursively purge element
      util.Event.purgeElement(el, true);
   },
   
   /**
    * Update the message 
    * @param {String} msg Message to display
    */
   displayMessage: function(msg) {
      if(!this.fieldContainer) { return; }
      if(!this.msgEl) {
         this.msgEl = inputEx.cn('div', {className: 'inputEx-message'});
          try{
             var divElements = this.divEl.getElementsByTagName('div');
             this.divEl.insertBefore(this.msgEl, divElements[(divElements.length-1>=0)?divElements.length-1:0]); //insertBefore the clear:both div
          }catch(e){alert(e);}
      }
      this.msgEl.innerHTML = msg;
   },

   /**
    * Show the field
    */
   show: function() {
      this.divEl.style.display = '';
   },
   
   /**
    * Hide the field
    */
   hide: function() {
      this.divEl.style.display = 'none';
   },
   
   /**
    * Clear the field by setting the field value to this.options.value
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   clear: function(sendUpdatedEvt) {
      this.setValue(lang.isUndefined(this.options.value) ? '' : this.options.value, sendUpdatedEvt);
   },
   
   /**
    * Should return true if empty
    */
   isEmpty: function() {
      return this.getValue() === '';
   }
   
};

})();// This file should be placed between "inputEx/field.js" and all other inputEx fields
// see http://javascript.neyric.com/inputex
(function() {

   var lang = YAHOO.lang;

/**
 * Copy of the original inputEx.Field class that we're gonna override to extend it.
 * @class BaseField
 * @namespace inputEx
 */
inputEx.BaseField = inputEx.Field;

/**
 * Class to make inputEx Fields "wirable".Re-create inputEx.Field adding the wirable properties
 * @class Field
 * @namespace inputEx
 * @extends inputEx.BaseField
 */
inputEx.Field = function(options) {
   inputEx.Field.superclass.constructor.call(this,options);
};

lang.extend(inputEx.Field, inputEx.BaseField, {

   /**
    * Adds a wirable option to every field
    * @method setOptions
    */
   setOptions: function(options) {
      inputEx.Field.superclass.setOptions.call(this, options);
      
      this.options.wirable = lang.isUndefined(options.wirable) ? false : options.wirable;
      this.options.container = options.container;
   },
   
   /**
    * Adds a terminal to each field
    * @method render
    */
   render: function() {
      inputEx.Field.superclass.render.call(this);
      
      if(this.options.wirable) {
         this.renderTerminal();
      }
   },
   
   /**
    * Render the associated input terminal
    * @method renderTerminal
    */
   renderTerminal: function() {

      var wrapper = inputEx.cn('div', {className: 'WireIt-InputExTerminal'});
      this.divEl.insertBefore(wrapper, this.fieldContainer);

      this.terminal = new WireIt.Terminal(wrapper, {
         name: this.options.name, 
         direction: [-1,0],
         fakeDirection: [0, 1],
         ddConfig: {
            type: "input",
            allowedTypes: ["output"]
         },
      nMaxWires: 1 }, this.options.container);

      // Dfly name for this terminal
      this.terminal.dflyName = "input_"+this.options.name;

      // Reference to the container
      if(this.options.container) {
         this.options.container.terminals.push(this.terminal);
      }

      // Register the events
      this.terminal.eventAddWire.subscribe(this.onAddWire, this, true);
      this.terminal.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
    },

    /**
     * Remove the input wired state on the 
     * @method onAddWire
     */
    onAddWire: function(e, params) {
       this.options.container.onAddWire(e,params);

       this.disable();
       this.el.value = "[wired]";
    },

    /**
     * Remove the input wired state on the 
     * @method onRemoveWire
     */
    onRemoveWire: function(e, params) { 
       this.options.container.onRemoveWire(e,params);

       this.enable();
       this.el.value = "";
    }

});


})();(function() {
   
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


})();(function() {
   
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;
/**
 * Contains the various visualization methods
 */
inputEx.visus = {
  
  /**
   * Use the trimpath-template engine
   * see http://code.google.com/p/trimpath/wiki/JavaScriptTemplates for syntax
   * options = {visuType: 'trimpath', template: "String template"}
   */
  trimpath: function(options, data) {
      if(!TrimPath) { alert('TrimPath is not on the page. Please load inputex/lib/trimpath-template.js'); return; }
      var tpl = TrimPath.parseTemplate(options.template);
     	var ret = tpl.process(data);
     	return ret;
  },
  
  /**
   * Use a rendering function
   * options = {visuType: 'func', func: function(data) { ...code here...} }
   */
  "func": function(options, data) {
     return options.func(data);
  },
  
  /**
   * Use YAHOO.lang.dump
   * options = {visuType: 'dump'}
   */
  dump: function(options, data) {
     return lang.dump(data);
  }
   
};

/**
 * Render 'data' using a visualization function described by 'visuOptions'
 * @static
 * @param {Object} visuOptions The visu parameters {visuType: 'myType', ...args...}
 * @param {Object} data The input data to send to the template
 * @param {HTMLElement || String} parentEl optional Set the result as content of parentEl
 * @return {HTMLElement || String} Either the inserted HTMLElement or the String set to parentEl.innerHTML
 */
inputEx.renderVisu = function(visuOptions,data, parentEl) {
   
   var opts = visuOptions || {};
   var visuType = opts.visuType || 'dump';
   
   if( !inputEx.visus.hasOwnProperty(visuType) ) {
      throw new Error("inputEx: no visu for visuType: "+visuType);
   }
   
   var f = inputEx.visus[visuType];
   if( !lang.isFunction(f) ) {
      throw new Error("inputEx: no visu for visuType: "+visuType);
   }
   
   var v = null;
   try {
      v = f(opts,data);
   }
   catch(ex) {
      throw new Error("inputEx: error while running visu "+visuType+" : "+ex.message);
      return;
   }
   
   // Get the node
   var node = null;
   if(parentEl) {
      if(lang.isString(parentEl)) {
         node = YAHOO.util.Dom.get(parentEl);
      }
      else {
         node = parentEl;
      }
   }
   
   // Insert it
   if(node) {
      if(YAHOO.lang.isObject(v) && v.tagName ) {
         node.innerHTML = "";
         node.appendChild(v);
      }
      else {
         node.innerHTML = v;
      }
   }
   
   return v;
};

})();(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class Basic string field (equivalent to the input type "text")
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	  <li>regexp: regular expression used to validate (otherwise it always validate)</li>
 *   <li>size: size attribute of the input</li>
 *   <li>maxLength: maximum size of the string field (no message display, uses the maxlength html attribute)</li>
 *   <li>minLength: minimum size of the string field (will display an error message if shorter)</li>
 *   <li>typeInvite: string displayed when the field is empty</li>
 *   <li>readonly: set the field as readonly</li>
 * </ul>
 */
inputEx.StringField = function(options) {
   inputEx.StringField.superclass.constructor.call(this, options);

	  if(this.options.typeInvite) {
	     this.updateTypeInvite();
	  }
};

lang.extend(inputEx.StringField, inputEx.Field,
/**
 * @scope inputEx.StringField.prototype
 */
{
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
	setOptions: function(options) {
	   inputEx.StringField.superclass.setOptions.call(this, options);

	   this.options.regexp = options.regexp;
	   this.options.size = options.size;
	   this.options.maxLength = options.maxLength;
	   this.options.minLength = options.minLength;
	   this.options.typeInvite = options.typeInvite;
	   this.options.readonly = options.readonly;
   },


   /**
    * Render an 'INPUT' DOM node
    */
   renderComponent: function() {

      // This element wraps the input node in a float: none div
      this.wrapEl = inputEx.cn('div', {className: 'inputEx-StringField-wrapper'});

      // Attributes of the input field
      var attributes = {};
      attributes.type = 'text';
      attributes.id = this.divEl.id?this.divEl.id+'-field':YAHOO.util.Dom.generateId();
      if(this.options.size) attributes.size = this.options.size;
      if(this.options.name) attributes.name = this.options.name;
      if(this.options.readonly) attributes.readonly = 'readonly';

      if(this.options.maxLength) attributes.maxLength = this.options.maxLength;

      // Create the node
      this.el = inputEx.cn('input', attributes);

      // Append it to the main element
      this.wrapEl.appendChild(this.el);
      this.fieldContainer.appendChild(this.wrapEl);
   },

   /**
    * Register the change, focus and blur events
    */
   initEvents: function() {
	   Event.addListener(this.el, "change", this.onChange, this, true);

       if (YAHOO.env.ua.ie){ // refer to inputEx-95
            var field = this.el;
            new YAHOO.util.KeyListener(this.el, {keys:[13]}, {fn:function(){
                field.blur();
                field.focus();
            }}).enable();
       }

	   Event.addFocusListener(this.el, this.onFocus, this, true);
	   Event.addBlurListener(this.el, this.onBlur, this, true);

	   Event.addListener(this.el, "keypress", this.onKeyPress, this, true);
	   Event.addListener(this.el, "keyup", this.onKeyUp, this, true);
   },

   /**
    * Return the string value
    * @param {String} The string value
    */
   getValue: function() {
	   return (this.options.typeInvite && this.el.value == this.options.typeInvite) ? '' : this.el.value;
   },

   /**
    * Function to set the value
    * @param {String} value The new value
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      this.el.value = value;

      // call parent class method to set style and fire updatedEvt
      inputEx.StringField.superclass.setValue.call(this, value, sendUpdatedEvt);
   },

   /**
    * Uses the optional regexp to validate the field value
    */
   validate: function() {
      var val = this.getValue();

      // empty field
      if (val == '') {
         // validate only if not required
         return !this.options.required;
      }

      // Check regex matching and minLength (both used in password field...)
      var result = true;

      // if we are using a regular expression
      if( this.options.regexp ) {
	      result = result && val.match(this.options.regexp);
      }
      if( this.options.minLength ) {
	      result = result && val.length >= this.options.minLength;
      }
      return result;
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
    * Set the focus to this field
    */
   focus: function() {
      // Can't use lang.isFunction because IE >= 6 would say focus is not a function (IE says it's an object) !!
      if(!!this.el && !lang.isUndefined(this.el.focus) ) {
         this.el.focus();
      }
   },

	/**
    * Add the minLength string message handling
    */
	getStateString: function(state) {
	   if(state == inputEx.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {
	      return inputEx.messages.stringTooShort[0]+this.options.minLength+inputEx.messages.stringTooShort[1];
      }
	   return inputEx.StringField.superclass.getStateString.call(this, state);
	},

   /**
    * Display the type invite after setting the class
    */
   setClassFromState: function() {
	   inputEx.StringField.superclass.setClassFromState.call(this);

	   // display/mask typeInvite
	   if(this.options.typeInvite) {
	      this.updateTypeInvite();
      }
	},

	updateTypeInvite: function() {

	   // field not focused
      if (!Dom.hasClass(this.divEl, "inputEx-focused")) {

         // show type invite if field is empty
         if(this.isEmpty()) {
	         Dom.addClass(this.divEl, "inputEx-typeInvite");
	         this.el.value = this.options.typeInvite;

	      // important for setValue to work with typeInvite
         } else {
            Dom.removeClass(this.divEl, "inputEx-typeInvite");
         }

      // field focused : remove type invite
      } else {
	      if(Dom.hasClass(this.divEl,"inputEx-typeInvite")) {
	         // remove text
	         this.el.value = "";

	         // remove the "empty" state and class
	         this.previousState = null;
	         Dom.removeClass(this.divEl,"inputEx-typeInvite");
         }
      }
	},

	/**
	 * Clear the typeInvite when the field gains focus
	 */
	onFocus: function(e) {
	   inputEx.StringField.superclass.onFocus.call(this,e);

	   if(this.options.typeInvite) {
         this.updateTypeInvite();
      }
	},

	onKeyPress: function(e) {
	   // override me
	},

   onKeyUp: function(e) {
      // override me
      //
      //   example :
      //
      //   lang.later(0, this, this.setClassFromState);
      //
      //     -> Set style immediatly when typing in the field
      //     -> Call setClassFromState escaping the stack (after the event has been fully treated, because the value has to be updated)
   }

});


inputEx.messages.stringTooShort = ["This field should contain at least "," numbers or characters"];

/**
 * Register this class as "string" type
 */
inputEx.registerType("string", inputEx.StringField);

})();
(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event;

/**
 * @class Create a textarea input
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>rows: rows attribute</li>
 *	   <li>cols: cols attribute</li>
 * </ul>
 */
inputEx.Textarea = function(options) {
	inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.Textarea, inputEx.StringField, 
/**
 * @scope inputEx.Textarea.prototype   
 */   
{

   /**
    * Set the specific options (rows and cols)
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.Textarea.superclass.setOptions.call(this, options);
      this.options.rows = options.rows || 6;
      this.options.cols = options.cols || 23;
   },
   
   /**
    * Render an 'INPUT' DOM node
    */
   renderComponent: function() {
      
      // This element wraps the input node in a float: none div
      this.wrapEl = inputEx.cn('div', {className: 'inputEx-StringField-wrapper'});
      
      // Attributes of the input field
      var attributes = {};
      attributes.id = this.divEl.id?this.divEl.id+'-field':YAHOO.util.Dom.generateId();
      attributes.rows = this.options.rows;
      attributes.cols = this.options.cols;
      if(this.options.name) attributes.name = this.options.name;
      
      //if(this.options.maxLength) attributes.maxLength = this.options.maxLength;
   
      // Create the node
      this.el = inputEx.cn('textarea', attributes, null, this.options.value);
      
      // Append it to the main element
      this.wrapEl.appendChild(this.el);
      this.fieldContainer.appendChild(this.wrapEl);
   },
   
	/**
    * Uses the optional regexp to validate the field value
    */
   validate: function() { 
      var previous = inputEx.Textarea.superclass.validate.call(this);
      
      // emulate maxLength property for textarea
      //   -> user can still type but field is invalid
      if (this.options.maxLength) {
         previous = previous && this.getValue().length <= this.options.maxLength;
      }
      
      return previous;
   },
   
   /**
    * Add the minLength string message handling
    */
    getStateString: function(state) {
	   if(state == inputEx.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {  
	      return inputEx.messages.stringTooShort[0]+this.options.minLength+inputEx.messages.stringTooShort[1];
	   
	   // Add message too long
      } else if (state == inputEx.stateInvalid && this.options.maxLength && this.el.value.length > this.options.maxLength) {
         return inputEx.messages.stringTooLong[0]+this.options.maxLength+inputEx.messages.stringTooLong[1];
      }
	   return inputEx.Textarea.superclass.getStateString.call(this, state);
	}

});

inputEx.messages.stringTooLong = ["This field should contain at most "," numbers or characters"];

/**
 * Register this class as "text" type
 */
inputEx.registerType("text", inputEx.Textarea);

})();(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class Create a select field
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
lang.extend(inputEx.SelectField, inputEx.Field, 
/**
 * @scope inputEx.SelectField.prototype
 */   
{
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
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
      
      this.optionEls = {};
      
      var optionEl;
      for( var i = 0 ; i < this.options.selectValues.length ; i++) {
         
         optionEl = inputEx.cn('option', {value: this.options.selectValues[i]}, null, this.options.selectOptions[i]);
         
         this.optionEls[this.options.selectOptions[i]] = optionEl;
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

      var value = config.value;
      var option = ""+(!lang.isUndefined(config.option) ? config.option : config.value);
      var nbOptions = this.options.selectOptions.length;
      
      // position of new option (default last)
      var position = nbOptions;
      
      if (lang.isNumber(config.position) && config.position >= 0 && config.position <= position) {
         position = parseInt(config.position,10);
         
      } else if (lang.isString(config.before)) {
         
            for (var i = 0 ; i < nbOptions ; i++) {
               if (this.options.selectOptions[i] === config.before) {
                  position = i;
                  break;
               }
            }
            
      } else if (lang.isString(config.after)) {

            for (var i = 0 ; i < nbOptions ; i++) {
               if (this.options.selectOptions[i] === config.after) {
                  position = i+1;
                  break;
               }
            }
      }
      
      // update values and options lists
      this.options.selectValues = this.options.selectValues.slice(0,position).concat([value]).concat(this.options.selectValues.slice(position,nbOptions));
      this.options.selectOptions = this.options.selectOptions.slice(0,position).concat([option]).concat(this.options.selectOptions.slice(position,nbOptions));

      // new option in select
      var newOption = inputEx.cn('option', {value: value}, null, option);
      this.optionEls[option] = newOption;
      
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

      var position;
      var nbOptions = this.options.selectOptions.length;
      var selectedIndex = this.el.selectedIndex;
      
      if (lang.isNumber(config.position) && config.position >= 0 && config.position <= nbOptions) {
         
         position = parseInt(config.position,10);
         
      } else if (lang.isString(config.option)) {
         
            for (var i = 0 ; i < nbOptions ; i++) {
               if (this.options.selectOptions[i] === config.option) {
                  position = i;
                  break;
               }
            }
            
      } else if (lang.isString(config.value)) {

            for (var i = 0 ; i < nbOptions ; i++) {
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
      this.options.selectValues.splice(position,1);
      var removedOption = this.options.selectOptions.splice(position,1);

      // remove from selector
      this.el.removeChild(this.optionEls[removedOption]);
      delete this.optionEls[removedOption];
      
      // clear if previous selected value doesn't exist anymore
      if (selectedIndex == position) {
         this.clear();
      }
   }
   
});

/**
 * Register this class as "select" type
 */
inputEx.registerType("select", inputEx.SelectField);

})();(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Field that adds the email regexp for validation. Result is always lower case.
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.EmailField = function(options) {
   inputEx.EmailField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.EmailField, inputEx.StringField, 
/**
 * @scope inputEx.EmailField.prototype   
 */   
{
   
   /**
    * Set the email regexp and invalid message
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.EmailField.superclass.setOptions.call(this, options);
      // Overwrite options
      this.options.messages.invalid = inputEx.messages.invalidEmail;
      this.options.regexp = inputEx.regexps.email;
   },
   
   /**
    * Set the value to lower case since email have no case
    * @return {String} The email string
    */
   getValue: function() {
      return this.el.value.toLowerCase();
   }

});
   
// Specific message for the email field
inputEx.messages.invalidEmail = "Invalid email, ex: sample@test.com";

/**
 * Register this class as "email" type
 */
inputEx.registerType("email", inputEx.EmailField);

})();(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;

/**
 * @class Adds an url regexp, and display the favicon at this url
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 * <ul>
 *   <li>favicon: boolean whether the domain favicon.ico should be displayed or not (default is true, except for https)</li>
 * </ul>
 */
inputEx.UrlField = function(options) {
   inputEx.UrlField.superclass.constructor.call(this,options);
};

lang.extend(inputEx.UrlField, inputEx.StringField,
/**
 * @scope inputEx.UrlField.prototype
 */
{

   /**
    * Adds the invalid Url message
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.UrlField.superclass.setOptions.call(this, options);

      this.options.className = options.className ? options.className : "inputEx-Field inputEx-UrlField";
      this.options.messages.invalid = inputEx.messages.invalidUrl;
      this.options.favicon = lang.isUndefined(options.favicon) ? (("https:" == document.location.protocol) ? false : true) : options.favicon;
      this.options.size = options.size || 50;

      // validate with url regexp
      this.options.regexp = inputEx.regexps.url;
   },

   /**
    * Adds a img tag before the field to display the favicon
    */
   render: function() {
      inputEx.UrlField.superclass.render.call(this);
      this.el.size = this.options.size;

      if(!this.options.favicon) {
         YAHOO.util.Dom.addClass(this.el, 'nofavicon');
      }

      // Create the favicon image tag
      if(this.options.favicon) {
         this.favicon = inputEx.cn('img', {src: inputEx.spacerUrl});
         this.fieldContainer.insertBefore(this.favicon,this.fieldContainer.childNodes[0]);

         // focus field when clicking on favicon
         YAHOO.util.Event.addListener(this.favicon,"click",function(){this.focus();},this,true);
      }
   },

   setClassFromState: function() {
      inputEx.UrlField.superclass.setClassFromState.call(this);

      if(this.options.favicon) {
         // try to update with url only if valid url (else pass null to display inputEx.spacerUrl)
         this.updateFavicon((this.previousState == inputEx.stateValid) ? this.getValue() : null);
      }
   },


   updateFavicon: function(url) {
      var newSrc = url ? url.match(/https?:\/\/[^\/]*/)+'/favicon.ico' : inputEx.spacerUrl;
      if(newSrc != this.favicon.src) {

         // Hide the favicon
         inputEx.sn(this.favicon, null, {visibility: 'hidden'});

         // Change the src
         this.favicon.src = newSrc;

         // Set the timer to launch displayFavicon in 1s
         if(this.timer) { clearTimeout(this.timer); }
         var that = this;
         this.timer = setTimeout(function(){that.displayFavicon();}, 1000);
      }
   },

   /**
    * Display the favicon if the icon was found (use of the naturalWidth property)
    */
   displayFavicon: function() {
      inputEx.sn(this.favicon, null, {visibility: (this.favicon.naturalWidth!=0) ? 'visible' : 'hidden'});
   }


});

inputEx.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";


/**
 * Register this class as "url" type
 */
inputEx.registerType("url", inputEx.UrlField);

})();(function() {
	
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
	
/**
 * @class   Meta field to create a list of other fields
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *   <li>sortable: Add arrows to sort the items if true (default false)</li>
 *   <li>elementType: an element type definition (default is {type: 'string'})</li>
 *   <li>useButtons: use buttons instead of links (default false)</li>
 *   <li>unique: require values to be unique (default false)</li>
 *   <li>listAddLabel: if useButtons is false, text to add an item</li>
 *   <li>listRemoveLabel: if useButtons is false, text to remove an item</li>
 * </ul>
 */
inputEx.ListField = function(options) {
	   
   /**
    * List of all the subField instances
    */
   this.subFields = [];
	   
   inputEx.ListField.superclass.constructor.call(this, options);
};
lang.extend(inputEx.ListField,inputEx.Field, 
/**
 * @scope inputEx.ListField.prototype   
 */   
{
	   
	/**
	 * Set the ListField classname
	 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
	 */
	setOptions: function(options) {
	   inputEx.ListField.superclass.setOptions.call(this, options);
	   
	   this.options.className = options.className ? options.className : 'inputEx-Field inputEx-ListField';
	   
	   this.options.sortable = lang.isUndefined(options.sortable) ? false : options.sortable;
	   this.options.elementType = options.elementType || {type: 'string'};
	   this.options.useButtons = lang.isUndefined(options.useButtons) ? false : options.useButtons;
	   this.options.unique = lang.isUndefined(options.unique) ? false : options.unique;
	   
	   this.options.listAddLabel = options.listAddLabel || inputEx.messages.listAddLink;
	   this.options.listRemoveLabel = options.listRemoveLabel || inputEx.messages.listRemoveLink;
	},
	   
	/**
	 * Render the addButton 
	 */
	renderComponent: function() {
	      
	   // Add element button
	   if(this.options.useButtons) {
	      this.addButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-addButton'});
	      this.fieldContainer.appendChild(this.addButton);
      }
	      
	   // List label
	   this.fieldContainer.appendChild( inputEx.cn('span', null, {marginLeft: "4px"}, this.options.listLabel) );
	      
	   // Div element to contain the children
	   this.childContainer = inputEx.cn('div', {className: 'inputEx-ListField-childContainer'});
	   this.fieldContainer.appendChild(this.childContainer);
	   
	   // Add link
	   if(!this.options.useButtons) {
	      this.addButton = inputEx.cn('a', {className: 'inputEx-List-link'}, null, this.options.listAddLabel);
	      this.fieldContainer.appendChild(this.addButton);
      }
	},
	   
	/**
	 * Handle the click event on the add button
	 */
	initEvents: function() {
	   Event.addListener(this.addButton, 'click', this.onAddButton, this, true);
	},
	
	/**
    * Validate each field
    * @returns {Boolean} true if all fields validate, required fields are not empty and unique constraint (if specified) is not violated
    */
   validate: function() {
      var response = true;
      var uniques = {};

      // Validate all the sub fields
      for (var i = 0 ; i < this.subFields.length && response; i++) {
         var input = this.subFields[i];
         input.setClassFromState(); // update field classes (mark invalid fields...)
         var state = input.getState();
         if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
            response = false; // but keep looping on fields to set classes
         }
         if(this.options.unique) {
            var hash = lang.dump(input.getValue());
            //logDebug('listfied index ',i, 'hash', hash);
            if(uniques[hash]) {
               response = false;    // not unique
            } else {
               uniques[hash] = true;
            }
          }
      }
      return response;
   },
	   
	/**
	 * Set the value of all the subfields
	 * @param {Array} value The list of values to set
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(value, sendUpdatedEvt) {
	   
	   if(!lang.isArray(value) ) {
	      // TODO: throw exceptions ?
	      return;
	   }
	      
	   // Set the values (and add the lines if necessary)
	   for(var i = 0 ; i < value.length ; i++) {
	      if(i == this.subFields.length) {
	         this.addElement(value[i]);
	      }
	      else {
	         this.subFields[i].setValue(value[i], false);
	      }
	   }
	      
	   // Remove additional subFields
	   var additionalElements = this.subFields.length-value.length;
	   if(additionalElements > 0) {
	      for(var i = 0 ; i < additionalElements ; i++) { 
	         this.removeElement(value.length);
	      }
	   };
	   
	   inputEx.ListField.superclass.setValue.call(this, value, sendUpdatedEvt);
	},
	   
	/**
	 * Return the array of values
	 * @return {Array} The array
	 */
	getValue: function() {
	   var values = [];
	   for(var i = 0 ; i < this.subFields.length ; i++) {
	      values[i] = this.subFields[i].getValue();
	   }
	   return values;
	},
	   
	/**
	 * Adds an element
	 * @param {Any} The initial value of the subfield to create
	 * @return {inputEx.Field} SubField added instance
	 */
	addElement: function(value) {
	
	   // Render the subField
	   var subFieldEl = this.renderSubField(value);
	      
	   // Adds it to the local list
	   this.subFields.push(subFieldEl);
	   
	   return subFieldEl;
	},
	
	/**
	 * Add a new element to the list and fire updated event
	 * @param {Event} e The original click event
	 */
	onAddButton: function(e) {
	   Event.stopEvent(e);
	   
	   // Add a field with no value: 
	   var subFieldEl = this.addElement();
	   
	   // Focus on this field
	   subFieldEl.focus();
	   
	   // Fire updated !
	   this.fireUpdatedEvt();
	},
	   
	/**
	 * Adds a new line to the List Field
 	 * @param {Any} The initial value of the subfield to create
	 * @return  {inputEx.Field} instance of the created field (inputEx.Field or derivative)
	 */
	renderSubField: function(value) {
	      
	   // Div that wraps the deleteButton + the subField
	   var newDiv = inputEx.cn('div');
	      
	   // Delete button
	   if(this.options.useButtons) {
	      var delButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-delButton'});
	      Event.addListener( delButton, 'click', this.onDelete, this, true);
	      newDiv.appendChild( delButton );
      }
	      
	   // Instanciate the new subField
	   var opts = lang.merge({}, this.options.elementType);
	   if(!opts.inputParams) opts.inputParams = {};
	   if(!lang.isUndefined(value)) opts.inputParams.value = value;
	   
	   var el = inputEx.buildField(opts);
	   
	   var subFieldEl = el.getEl();
	   Dom.setStyle(subFieldEl, 'margin-left', '4px');
	   Dom.setStyle(subFieldEl, 'float', 'left');
	   newDiv.appendChild( subFieldEl );
	   
	   // Subscribe the onChange event to resend it 
	   el.updatedEvt.subscribe(this.onChange, this, true);
	
	   // Arrows to order:
	   if(this.options.sortable) {
	      var arrowUp = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowUp'});
	      Event.addListener(arrowUp, 'click', this.onArrowUp, this, true);
	      var arrowDown = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowDown'});
	      Event.addListener(arrowDown, 'click', this.onArrowDown, this, true);
	      newDiv.appendChild( arrowUp );
	      newDiv.appendChild( arrowDown );
	   }
	   
	   // Delete link
	   if(!this.options.useButtons) {
	      var delButton = inputEx.cn('a', {className: 'inputEx-List-link'}, null, this.options.listRemoveLabel);
	      Event.addListener( delButton, 'click', this.onDelete, this, true);
	      newDiv.appendChild( delButton );
      }
	
	   // Line breaker
	   newDiv.appendChild( inputEx.cn('div', null, {clear: "both"}) );
	
	   this.childContainer.appendChild(newDiv);
	      
	   return el;
	},
	   
	/**
	 * Switch a subField with its previous one
	 * Called when the user clicked on the up arrow of a sortable list
	 * @param {Event} e Original click event
	 */
	onArrowUp: function(e) {
	   var childElement = Event.getTarget(e).parentNode;
	   
	   var previousChildNode = null;
	   var nodeIndex = -1;
	   for(var i = 1 ; i < childElement.parentNode.childNodes.length ; i++) {
	      var el=childElement.parentNode.childNodes[i];
	      if(el == childElement) {
	         previousChildNode = childElement.parentNode.childNodes[i-1];
	         nodeIndex = i;
	         break;
	      }
	   }
	   
	   if(previousChildNode) {
	      // Remove the line
	      var removedEl = this.childContainer.removeChild(childElement);
	      
	      // Adds it before the previousChildNode
	      var insertedEl = this.childContainer.insertBefore(removedEl, previousChildNode);
	      
	      // Swap this.subFields elements (i,i-1)
	      var temp = this.subFields[nodeIndex];
	      this.subFields[nodeIndex] = this.subFields[nodeIndex-1];
	      this.subFields[nodeIndex-1] = temp;
	      
	      // Color Animation
	      if(this.arrowAnim) {
	         this.arrowAnim.stop(true);
	      }
	      this.arrowAnim = new YAHOO.util.ColorAnim(insertedEl, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 0.4);
	      this.arrowAnim.onComplete.subscribe(function() { Dom.setStyle(insertedEl, 'background-color', ''); });
	      this.arrowAnim.animate();
	      
	      // Fire updated !
	      this.fireUpdatedEvt();
	   }
	},
	
	/**
	 * Switch a subField with its next one
	 * Called when the user clicked on the down arrow of a sortable list
	 * @param {Event} e Original click event
	 */
	onArrowDown: function(e) {
	   var childElement = Event.getTarget(e).parentNode;
	   
	   var nodeIndex = -1;
	   var nextChildNode = null;
	   for(var i = 0 ; i < childElement.parentNode.childNodes.length ; i++) {
	      var el=childElement.parentNode.childNodes[i];
	      if(el == childElement) {
	         nextChildNode = childElement.parentNode.childNodes[i+1];
	         nodeIndex = i;
	         break;
	      }
	   }
	   
	   if(nextChildNode) {
	      // Remove the line
	      var removedEl = this.childContainer.removeChild(childElement);
	      // Adds it after the nextChildNode
	      var insertedEl = Dom.insertAfter(removedEl, nextChildNode);
	      
	      // Swap this.subFields elements (i,i+1)
	      var temp = this.subFields[nodeIndex];
	      this.subFields[nodeIndex] = this.subFields[nodeIndex+1];
	      this.subFields[nodeIndex+1] = temp;
	      
	      // Color Animation
	      if(this.arrowAnim) {
	         this.arrowAnim.stop(true);
	      }
	      this.arrowAnim = new YAHOO.util.ColorAnim(insertedEl, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 1);
	      this.arrowAnim.onComplete.subscribe(function() { Dom.setStyle(insertedEl, 'background-color', ''); });
	      this.arrowAnim.animate();
	      
	      // Fire updated !
	      this.fireUpdatedEvt();
	   }
	},
	   
	/**
	 * Called when the user clicked on a delete button.
	 * @param {Event} e The original click event
	 */
	onDelete: function(e) {
	      
	   Event.stopEvent(e);
	      
	   // Get the wrapping div element
	   var elementDiv = Event.getTarget(e).parentNode;
	   
	   // Get the index of the subField
	   var index = -1;
	   
	   var subFieldEl = elementDiv.childNodes[this.options.useButtons ? 1 : 0];
	   for(var i = 0 ; i < this.subFields.length ; i++) {
	      if(this.subFields[i].getEl() == subFieldEl) {
	         index = i;
	         break;
	      }
	   }
	      
	   // Remove it
	   if(index != -1) {
	      this.removeElement(index);
	   }
	      
	   // Fire the updated event
	   this.fireUpdatedEvt();
	},
	   
	/**
	 * Remove the line from the dom and the subField from the list.
	 * @param {integer} index The index of the element to remove
	 */
	removeElement: function(index) {
	   var elementDiv = this.subFields[index].getEl().parentNode;
	      
	   this.subFields[index] = undefined;
	   this.subFields = inputEx.compactArray(this.subFields);
	      
	   // Remove the element
	   elementDiv.parentNode.removeChild(elementDiv);
	}
	
});
	
/**
 * Register this class as "list" type
 */
inputEx.registerType("list", inputEx.ListField);


inputEx.messages.listAddLink = "Add";
inputEx.messages.listRemoveLink = "remove";
	
})();(function() {
	
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
	
})();(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class Meta field providing in place editing (the editor appears when you click on the formatted value). 
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *   <li>visu</li>
 *   <li>editorField</li>
 *   <li>animColors</li>
 * </ul>
 */
inputEx.InPlaceEdit = function(options) {
   inputEx.InPlaceEdit.superclass.constructor.call(this, options);
};

lang.extend(inputEx.InPlaceEdit, inputEx.Field, 
/**
 * @scope inputEx.InPlaceEdit.prototype   
 */   
{
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.InPlaceEdit.superclass.setOptions.call(this, options);
      
      this.options.animColors = options.animColors || {from: '#ffff99' , to: '#ffffff'};
      /*this.options.formatDom = options.formatDom;
      this.options.formatValue = options.formatValue;*/
      this.options.visu = options.visu;
      this.options.editorField = options.editorField;
   },

   /**
    * Override renderComponent to create 2 divs: the visualization one, and the edit in place form
    */
   renderComponent: function() {
      this.renderVisuDiv();
	   this.renderEditor();
   },
   
   /**
    * Render the editor
    */
   renderEditor: function() {
      
      this.editorContainer = inputEx.cn('div', {className: 'inputEx-InPlaceEdit-editor'}, {display: 'none'});
      
      // Render the editor field
      this.editorField = inputEx.buildField(this.options.editorField);
   
      this.editorContainer.appendChild( this.editorField.getEl() );
      Dom.setStyle(this.editorField.getEl(), 'float', 'left');
      
      this.okButton = inputEx.cn('input', {type: 'button', value: inputEx.messages.okEditor, className: 'inputEx-InPlaceEdit-OkButton'});
      Dom.setStyle(this.okButton, 'float', 'left');
      this.editorContainer.appendChild(this.okButton);
      
      this.cancelLink = inputEx.cn('a', {className: 'inputEx-InPlaceEdit-CancelLink'}, null, inputEx.messages.cancelEditor);
      this.cancelLink.href = ""; // IE required (here, not in the cn fct)
      Dom.setStyle(this.cancelLink, 'float', 'left');
      this.editorContainer.appendChild(this.cancelLink);
      
      // Line breaker
      this.editorContainer.appendChild( inputEx.cn('div',null, {clear: 'both'}) );
      
      //this.divEl.appendChild(this.editorContainer);
      this.fieldContainer.appendChild(this.editorContainer);
      
   },
   
   /**
    * Set the color when hovering the field
    * @param {Event} e The original mouseover event
    */
   onVisuMouseOver: function(e) {
      if(this.colorAnim) {
         this.colorAnim.stop(true);
      }
      inputEx.sn(this.formattedContainer, null, {backgroundColor: this.options.animColors.from });
   },
   
   /**
    * Start the color animation when hovering the field
    * @param {Event} e The original mouseout event
    */
   onVisuMouseOut: function(e) {
      // Start animation
      if(this.colorAnim) {
         this.colorAnim.stop(true);
      }
      this.colorAnim = new YAHOO.util.ColorAnim(this.formattedContainer, {backgroundColor: this.options.animColors}, 1);
      this.colorAnim.onComplete.subscribe(function() { Dom.setStyle(this.formattedContainer, 'background-color', ''); }, this, true);
      this.colorAnim.animate();   
   },
   
   /**
    * Create the div that will contain the visualization of the value
    */
   renderVisuDiv: function() {
      this.formattedContainer = inputEx.cn('div', {className: 'inputEx-InPlaceEdit-visu'});
      
      if( lang.isFunction(this.options.formatDom) ) {
         this.formattedContainer.appendChild( this.options.formatDom(this.options.value) );
      }
      else if( lang.isFunction(this.options.formatValue) ) {
         this.formattedContainer.innerHTML = this.options.formatValue(this.options.value);
      }
      else {
         this.formattedContainer.innerHTML = lang.isUndefined(this.options.value) ? inputEx.messages.emptyInPlaceEdit: this.options.value;
      }
      
      this.fieldContainer.appendChild(this.formattedContainer);
      
   },

   /**
    * Adds the events for the editor and color animations
    */
   initEvents: function() {  
      Event.addListener(this.formattedContainer, "click", this.openEditor, this, true);
            
      // For color animation
      Event.addListener(this.formattedContainer, 'mouseover', this.onVisuMouseOver, this, true);
      Event.addListener(this.formattedContainer, 'mouseout', this.onVisuMouseOut, this, true);
         
      // Editor: 
      Event.addListener(this.okButton, 'click', this.onOkEditor, this, true);
      Event.addListener(this.cancelLink, 'click', this.onCancelEditor, this, true);
         
      if(this.editorField.el) {
         // Register some listeners
         Event.addListener(this.editorField.el, "keyup", this.onKeyUp, this, true);
         Event.addListener(this.editorField.el, "keydown", this.onKeyDown, this, true);
      }
   },
   
   /**
    * Handle some keys events to close the editor
    * @param {Event} e The original keyup event
    */
   onKeyUp: function(e) {
      // Enter
      if( e.keyCode == 13) {
         this.onOkEditor();
      }
      // Escape
      if( e.keyCode == 27) {
         this.onCancelEditor(e);
      }
   },
   
   /**
    * Handle the tabulation key to close the editor
    * @param {Event} e The original keydown event
    */
   onKeyDown: function(e) {
      // Tab
      if(e.keyCode == 9) {
         this.onOkEditor();
      }
   },
   
   /**
    * Validate the editor (ok button, enter key or tabulation key)
    */
   onOkEditor: function() {
      var newValue = this.editorField.getValue();
      this.setValue(newValue);
      
      this.editorContainer.style.display = 'none';
      this.formattedContainer.style.display = '';
      
      var that = this;
      setTimeout(function() {that.updatedEvt.fire(newValue);}, 50);      
   },

   
   /**
    * Close the editor on cancel (cancel button, blur event or escape key)
    * @param {Event} e The original event (click, blur or keydown)
    */
   onCancelEditor: function(e) {
      Event.stopEvent(e);
      this.editorContainer.style.display = 'none';
      this.formattedContainer.style.display = '';
   },
   
   /**
    * Display the editor
    */
   openEditor: function() {
      var value = this.getValue();
      this.editorContainer.style.display = '';
      this.formattedContainer.style.display = 'none';
   
      if(!lang.isUndefined(value)) {
         this.editorField.setValue(value);   
      }
      
      // Set focus in the element !
      this.editorField.focus();
   
      // Select the content
      if(this.editorField.el && lang.isFunction(this.editorField.el.setSelectionRange) && (!!value && !!value.length)) {
         this.editorField.el.setSelectionRange(0,value.length);
      }
      
   },
   
   /**
    * Returned the previously stored value
    * @return {Any} The value of the subfield
    */
   getValue: function() {
      var editorOpened = (this.editorContainer.style.display == '');
	   return editorOpened ? this.editorField.getValue() : this.value;
   },

   /**
    * Set the value and update the display
    * @param {Any} value The value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {   
      // Store the value
	   this.value = value;
   
      if(lang.isUndefined(value) || value == "") {
         inputEx.renderVisu(this.options.visu, inputEx.messages.emptyInPlaceEdit, this.formattedContainer);
      }
      else {
         inputEx.renderVisu(this.options.visu, this.value, this.formattedContainer);
      }
      
      // If the editor is opened, update it 
      if(this.editorContainer.style.display == '') {
         this.editorField.setValue(value);
      }
      
      inputEx.InPlaceEdit.superclass.setValue.call(this, value, sendUpdatedEvt);
   },
   
   /**
    * Close the editor when calling the close function on this field
    */
   close: function() {
      this.editorContainer.style.display = 'none';
      this.formattedContainer.style.display = '';
	}

});
  
inputEx.messages.emptyInPlaceEdit = "(click to edit)";
inputEx.messages.cancelEditor = "cancel";
inputEx.messages.okEditor = "Ok";

/**
 * Register this class as "inplaceedit" type
 */
inputEx.registerType("inplaceedit", inputEx.InPlaceEdit);

})();(function(){var G=YAHOO.util.Dom,F=YAHOO.util.Event,I=YAHOO.util.Anim;var A=function(L,K){L=G.get(L);K=K||{};if(!L){L=document.createElement(this.CONFIG.TAG_NAME)}if(L.id){K.id=L.id}YAHOO.widget.AccordionView.superclass.constructor.call(this,L,K);this.initList(L,K);this.refresh(["id","width","hoverActivated"],true)};var D="panelClose";var E="panelOpen";var B="afterPanelClose";var J="afterPanelOpen";var C="stateChanged";var H="beforeStateChange";YAHOO.widget.AccordionView=A;YAHOO.extend(A,YAHOO.util.Element,{initAttributes:function(K){A.superclass.initAttributes.call(this,K);var L=(YAHOO.env.modules.animation)?true:false;this.setAttributeConfig("id",{writeOnce:true,validator:function(M){return(/^[a-zA-Z][\w0-9\-_.:]*$/.test(M))},value:G.generateId(),method:function(M){this.get("element").id=M}});this.setAttributeConfig("width",{value:"400px",method:function(M){this.setStyle("width",M)}});this.setAttributeConfig("animationSpeed",{value:0.7});this.setAttributeConfig("animate",{value:L,validator:YAHOO.lang.isBoolean});this.setAttributeConfig("collapsible",{value:false,validator:YAHOO.lang.isBoolean});this.setAttributeConfig("expandable",{value:false,validator:YAHOO.lang.isBoolean});this.setAttributeConfig("effect",{value:YAHOO.util.Easing.easeBoth,validator:YAHOO.lang.isString});this.setAttributeConfig("hoverActivated",{value:false,validator:YAHOO.lang.isBoolean,method:function(M){if(M){F.on(this,"mouseover",this._onMouseOver,this,true)}else{F.removeListener(this,"mouseover",this._onMouseOver)}}});this.setAttributeConfig("_hoverTimeout",{value:500,validator:YAHOO.lang.isInteger})},CONFIG:{TAG_NAME:"UL",ITEM_WRAPPER_TAG_NAME:"LI",CONTENT_WRAPPER_TAG_NAME:"DIV"},CLASSES:{ACCORDION:"yui-accordionview",PANEL:"yui-accordion-panel",TOGGLE:"yui-accordion-toggle",CONTENT:"yui-accordion-content",ACTIVE:"active",HIDDEN:"hidden",INDICATOR:"indicator"},_idCounter:"1",_hoverTimer:null,_panels:null,_opening:false,_closing:false,_ff2:(YAHOO.env.ua.gecko>0&&YAHOO.env.ua.gecko<1.9),_ie:(YAHOO.env.ua.ie<8&&YAHOO.env.ua.ie>0),_ARIACapable:(YAHOO.env.ua.ie>7||YAHOO.env.ua.gecko>=1.9),initList:function(O,K){G.addClass(O,this.CLASSES.ACCORDION);this._setARIA(O,"role","tree");var N=[];var Q=O.getElementsByTagName(this.CONFIG.ITEM_WRAPPER_TAG_NAME);for(var M=0;M<Q.length;M++){if(G.hasClass(Q[M],"nopanel")){N.push({label:"SINGLE_LINK",content:Q[M].innerHTML.replace(/^\s\s*/,"").replace(/\s\s*$/,"")})}else{if(Q[M].parentNode===O){for(var P=Q[M].firstChild;P&&P.nodeType!=1;P=P.nextSibling){}if(P){for(var R=P.nextSibling;R&&R.nodeType!=1;R=R.nextSibling){}N.push({label:P.innerHTML,content:(R&&R.innerHTML)})}}}}O.innerHTML="";if(N.length>0){this.addPanels(N)}if((K.expandItem===0)||(K.expandItem>0)){var L=this._panels[K.expandItem].firstChild;var R=this._panels[K.expandItem].firstChild.nextSibling;G.removeClass(R,this.CLASSES.HIDDEN);if(L&&R){G.addClass(L,this.CLASSES.ACTIVE);L.tabIndex=0;this._setARIA(L,"aria-expanded","true");this._setARIA(R,"aria-hidden","false")}}this.initEvents()},initEvents:function(){if(true===this.get("hoverActivated")){this.on("mouseover",this._onMouseOver,this,true);this.on("mouseout",this._onMouseOut,this,true)}this.on("click",this._onClick,this,true);this.on("keydown",this._onKeydown,this,true);this.on("panelOpen",function(){this._opening=true},this,true);this.on("panelClose",function(){this._closing=true},this,true);this.on("afterPanelClose",function(){this._closing=false;if(!this._closing&&!this._opening){this._fixTabIndexes()}},this,true);this.on("afterPanelOpen",function(){this._opening=false;if(!this._closing&&!this._opening){this._fixTabIndexes()}},this,true);if(this._ARIACapable){this.on("keypress",function(K){var L=G.getAncestorByClassName(F.getTarget(K),this.CLASSES.PANEL);var M=F.getCharCode(K);if(M===13){this._onClick(L.firstChild);return false}})}},_setARIA:function(L,K,M){if(this._ARIACapable){L.setAttribute(K,M)}},_collapseAccordion:function(){G.batch(this._panels,function(L){var K=this.firstChild.nextSibling;if(K){G.removeClass(L.firstChild,this.CLASSES.ACTIVE);G.addClass(K,this.CLASSES.HIDDEN);this._setARIA(K,"aria-hidden","true")}},this)},_fixTabIndexes:function(){var M=this._panels.length;var K=true;for(var L=0;L<M;L++){if(G.hasClass(this._panels[L].firstChild,this.CLASSES.ACTIVE)){this._panels[L].firstChild.tabIndex=0;K=false}else{this._panels[L].firstChild.tabIndex=-1}}if(K){this._panels[0].firstChild.tabIndex=0}this.fireEvent(C)},addPanel:function(N,M){var L=document.createElement(this.CONFIG.ITEM_WRAPPER_TAG_NAME);G.addClass(L,this.CLASSES.PANEL);if(N.label==="SINGLE_LINK"){L.innerHTML=N.content;G.addClass(L.firstChild,this.CLASSES.TOGGLE);G.addClass(L.firstChild,"link")}else{var K=document.createElement("span");G.addClass(K,this.CLASSES.INDICATOR);var P=L.appendChild(document.createElement("A"));P.id=this.get("element").id+"-"+this._idCounter+"-label";P.innerHTML=N.label||"";P.appendChild(K);if(this._ARIACapable){if(N.href){P.href=N.href}}else{P.href=N.href||"#toggle"}P.tabIndex=-1;G.addClass(P,this.CLASSES.TOGGLE);var Q=document.createElement(this.CONFIG.CONTENT_WRAPPER_TAG_NAME);Q.innerHTML=N.content||"";G.addClass(Q,this.CLASSES.CONTENT);L.appendChild(Q);this._setARIA(L,"role","presentation");this._setARIA(P,"role","treeitem");this._setARIA(Q,"aria-labelledby",P.id);this._setARIA(K,"role","presentation")}this._idCounter++;if(this._panels===null){this._panels=[]}if((M!==null)&&(M!==undefined)){var O=this.getPanel(M);this.insertBefore(L,O);var R=this._panels.slice(0,M);var T=this._panels.slice(M);R.push(L);for(i=0;i<T.length;i++){R.push(T[i])}this._panels=R}else{this.appendChild(L);if(this.get("element")===L.parentNode){this._panels[this._panels.length]=L}}if(N.label!=="SINGLE_LINK"){if(N.expand){if(!this.get("expandable")){this._collapseAccordion()}G.removeClass(Q,this.CLASSES.HIDDEN);G.addClass(P,this.CLASSES.ACTIVE);this._setARIA(Q,"aria-hidden","false");this._setARIA(P,"aria-expanded","true")}else{G.addClass(Q,"hidden");this._setARIA(Q,"aria-hidden","true");this._setARIA(P,"aria-expanded","false")}}var S=YAHOO.lang.later(0,this,function(){this._fixTabIndexes();this.fireEvent(C)})},addPanels:function(L){for(var K=0;K<L.length;K++){this.addPanel(L[K])}},removePanel:function(K){this.removeChild(G.getElementsByClassName(this.CLASSES.PANEL,this.CONFIG.ITEM_WRAPPER_TAG_NAME,this)[K]);var N=[];var O=this._panels.length;for(var M=0;M<O;M++){if(M!==K){N.push(this._panels[M])}}this._panels=N;var L=YAHOO.lang.later(0,this,function(){this._fixTabIndexes();this.fireEvent(C)})},getPanel:function(K){return this._panels[K]},getPanels:function(){return this._panels},openPanel:function(K){var L=this._panels[K];if(!L){return false}if(G.hasClass(L.firstChild,this.CLASSES.ACTIVE)){return false}this._onClick(L.firstChild);return true},closePanel:function(K){var L=this._panels;var O=L[K];if(!O){return false}var N=O.firstChild;if(!G.hasClass(N,this.CLASSES.ACTIVE)){return true}if(this.get("collapsible")===false){if(this.get("expandable")===true){this.set("collapsible",true);for(var M=0;M<L.length;M++){if((G.hasClass(L[M].firstChild,this.CLASSES.ACTIVE)&&M!==K)){this._onClick(N);this.set("collapsible",false);return true}}this.set("collapsible",false)}}this._onClick(N);return true},_onKeydown:function(L){var N=G.getAncestorByClassName(F.getTarget(L),this.CLASSES.PANEL);var O=F.getCharCode(L);var M=this._panels.length;if(O===37||O===38){for(var K=0;K<M;K++){if((N===this._panels[K])&&K>0){this._panels[K-1].firstChild.focus();return }}}if(O===39||O===40){for(var K=0;K<M;K++){if((N===this._panels[K])&&K<M-1){this._panels[K+1].firstChild.focus();return }}}},_onMouseOver:function(K){F.stopPropagation(K);var L=F.getTarget(K);this._hoverTimer=YAHOO.lang.later(this.get("_hoverTimeout"),this,function(){this._onClick(L)})},_onMouseOut:function(){if(this._hoverTimer){this._hoverTimer.cancel();this._hoverTimer=null}},_onClick:function(T){var Q;if(T.nodeType===undefined){Q=F.getTarget(T);if(!G.hasClass(Q,this.CLASSES.TOGGLE)&&!G.hasClass(Q,this.CLASSES.INDICATOR)){return false}if(G.hasClass(Q,"link")){return true}F.preventDefault(T);F.stopPropagation(T)}else{Q=T}var R=Q;var O=this;function S(V,X){if(O._ie){var W=G.getElementsByClassName(O.CLASSES.ACCORDION,O.CONFIG.TAG_NAME,V);if(W[0]){G.setStyle(W[0],"visibility",X)}}}function P(W,Y){var Z=this;function e(h,f){if(!G.hasClass(f,Z.CLASSES.PANEL)){f=G.getAncestorByClassName(f,Z.CLASSES.PANEL)}for(var g=0,j=f;j.previousSibling;g++){j=j.previousSibling}return Z.fireEvent(h,{panel:f,index:g})}if(!Y){if(!W){return false}Y=W.parentNode.firstChild}var b={};var c=0;var a=(!G.hasClass(W,this.CLASSES.HIDDEN));if(this.get("animate")){if(!a){if(this._ff2){G.addClass(W,"almosthidden");G.setStyle(W,"width",this.get("width"))}G.removeClass(W,this.CLASSES.HIDDEN);c=W.offsetHeight;G.setStyle(W,"height",0);if(this._ff2){G.removeClass(W,"almosthidden");G.setStyle(W,"width","auto")}b={height:{from:0,to:c}}}else{c=W.offsetHeight;b={height:{from:c,to:0}}}var d=(this.get("animationSpeed"))?this.get("animationSpeed"):0.5;var X=(this.get("effect"))?this.get("effect"):YAHOO.util.Easing.easeBoth;var V=new I(W,b,d,X);if(a){if(this.fireEvent(D,W)===false){return }G.removeClass(Y,Z.CLASSES.ACTIVE);Y.tabIndex=-1;S(W,"hidden");Z._setARIA(W,"aria-hidden","true");Z._setARIA(Y,"aria-expanded","false");V.onComplete.subscribe(function(){G.addClass(W,Z.CLASSES.HIDDEN);G.setStyle(W,"height","auto");e("afterPanelClose",W)})}else{if(e(E,W)===false){return }S(W,"hidden");V.onComplete.subscribe(function(){G.setStyle(W,"height","auto");S(W,"visible");Z._setARIA(W,"aria-hidden","false");Z._setARIA(Y,"aria-expanded","true");Y.tabIndex=0;e(J,W)});G.addClass(Y,this.CLASSES.ACTIVE)}V.animate()}else{if(a){if(e(D,W)===false){return }G.addClass(W,Z.CLASSES.HIDDEN);G.setStyle(W,"height","auto");G.removeClass(Y,Z.CLASSES.ACTIVE);Z._setARIA(W,"aria-hidden","true");Z._setARIA(Y,"aria-expanded","false");Y.tabIndex=-1;e(B,W)}else{if(e(E,W)===false){return }G.removeClass(W,Z.CLASSES.HIDDEN);G.setStyle(W,"height","auto");G.addClass(Y,Z.CLASSES.ACTIVE);Z._setARIA(W,"aria-hidden","false");Z._setARIA(Y,"aria-expanded","true");Y.tabIndex=0;e(J,W)}}return true}var K=(R.nodeName.toUpperCase()==="SPAN")?R.parentNode.parentNode:R.parentNode;var N=G.getElementsByClassName(this.CLASSES.CONTENT,this.CONFIG.CONTENT_WRAPPER_TAG_NAME,K)[0];if(this.fireEvent(H,this)===false){return }if(this.get("collapsible")===false){if(!G.hasClass(N,this.CLASSES.HIDDEN)){return false}}else{if(!G.hasClass(N,this.CLASSES.HIDDEN)){P.call(this,N);return false}}if(this.get("expandable")!==true){var U=this._panels.length;for(var M=0;M<U;M++){var L=G.hasClass(this._panels[M].firstChild.nextSibling,this.CLASSES.HIDDEN);if(!L){P.call(this,this._panels[M].firstChild.nextSibling)}}}if(R.nodeName.toUpperCase()==="SPAN"){P.call(this,N,R.parentNode)}else{P.call(this,N,R)}return true},toString:function(){var K=this.get("id")||this.get("tagName");return"AccordionView "+K}})})();YAHOO.register("accordionview",YAHOO.widget.AccordionView,{version:"0.99",build:"33"});/**
 * WireIt provide classes to build wirable interfaces
 * @module WireIt
 */
/**
 * @class WireIt
 * @static
 * @namespace WireIt
 */
var WireIt = {
   
   /**
    * Get a css property in pixels and convert it to an integer
    * @method getIntStyle
    * @namespace WireIt
    * @static
    * @param {HTMLElement} el The element
    * @param {String} style css-property to get
    * @return {Integer} integer size
    */
   getIntStyle: function(el,style) {
      var sStyle = YAHOO.util.Dom.getStyle(el, style);
      return parseInt(sStyle.substr(0, sStyle.length-2), 10);
   },

   /**
    * Helper function to set DOM node attributes and style attributes.
    * @method sn
    * @static
    * @param {HTMLElement} el The element to set attributes to
    * @param {Object} domAttributes An object containing key/value pairs to set as node attributes (ex: {id: 'myElement', className: 'myCssClass', ...})
    * @param {Object} styleAttributes Same thing for style attributes. Please use camelCase for style attributes (ex: backgroundColor for 'background-color')
    */
   sn: function(el,domAttributes,styleAttributes){
      if(!el) { return; }
      if(domAttributes){
         for(var i in domAttributes){
            var domAttribute = domAttributes[i];
            if(typeof (domAttribute)=="function"){continue;}
            if(i=="className"){
               i="class";
               el.className=domAttribute;
            }
            if(domAttribute!==el.getAttribute(i)){
               if(domAttribute===false){
                  el.removeAttribute(i);
               }else{
                  el.setAttribute(i,domAttribute);
               }
            }
         }
      }
      if(styleAttributes){
         for(var i in styleAttributes){
            if(typeof (styleAttributes[i])=="function"){ continue; }
            if(el.style[i]!=styleAttributes[i]){
               el.style[i]=styleAttributes[i];
            }
         }
      }
   
   },


   /**
    * Helper function to create a DOM node. (wrapps the document.createElement tag and the inputEx.sn functions)
    * @method cn
    * @static
    * @param {String} tag The tagName to create (ex: 'div', 'a', ...)
    * @param {Object} [domAttributes] see inputEx.sn
    * @param {Object} [styleAttributes] see inputEx.sn
    * @param {String} [innerHTML] The html string to append into the created element
    * @return {HTMLElement} The created node
    */
   cn: function(tag, domAttributes, styleAttributes, innerHTML){
      var el=document.createElement(tag);
      this.sn(el,domAttributes,styleAttributes);
      if(innerHTML){ el.innerHTML = innerHTML; }
      return el;
   },
   
   /**
    * indexOf replace Array.indexOf for cases where it isn't available (IE6 only ?)
    * @method indexOf
    * @static
    * @param {Any} el element to search for
    * @param {Array} arr Array to search into
    * @return {Integer} element index or -1 if not found
    */
   indexOf: YAHOO.lang.isFunction(Array.prototype.indexOf) ? 
                        function(el, arr) { return arr.indexOf(el);} : 
                        function(el, arr) {
                           for(var i = 0 ;i < arr.length ; i++) {
                              if(arr[i] == el) return i;
                           }
                           return -1;
                        },

   /**
    * compact replace Array.compact for cases where it isn't available
    * @method compact
    * @static
    * @param {Array} arr Array to compact
    * @return {Array} compacted array
    */
   compact: YAHOO.lang.isFunction(Array.prototype.compact) ? 
                        function(arr) { return arr.compact();} :          
                        function(arr) {
                           var n = [];
                           for(var i = 0 ; i < arr.length ; i++) {
                              if(arr[i]) {
                                 n.push(arr[i]);
                              }
                           }
                           return n;
                        }
};


/**
 * WireIt.util contains utility classes
 */
WireIt.util = {};
(function () {
   
   // Shortcuts
   var Event = YAHOO.util.Event, UA = YAHOO.env.ua;

   /**
    * Create a canvas element and wrap cross-browser hacks to resize it
    * @class CanvasElement
    * @namespace WireIt
    * @constructor
    * @param {HTMLElement} parentNode The canvas tag will be append to this parent DOM node.
    */
   WireIt.CanvasElement = function(parentNode) {
      
      /**
       * The canvas element
       * @property element
       * @type HTMLElement
       */
      this.element = document.createElement('canvas');
      
      // Append to parentNode
      parentNode.appendChild(this.element);
      
      // excanvas.js for dynamic canvas tags
      if(typeof (G_vmlCanvasManager)!="undefined"){
         this.element = G_vmlCanvasManager.initElement(this.element);
      }
      
   };
   
   WireIt.CanvasElement.prototype = {
      
      /**
       * Get a drawing context
       * @method getContext
       * @param {String} [mode] Context mode (default "2d")
       * @return {CanvasContext} the context
       */
      getContext: function(mode) {
       return this.element.getContext(mode || "2d");
      },
      
      /**
       * Purge all event listeners and remove the component from the dom
       * @method destroy
       */
      destroy: function() {
         var el = this.element;

         // Remove from DOM
         if(YAHOO.util.Dom.inDocument(el)) {
            el.parentNode.removeChild(el);
         }

         // recursively purge element
         Event.purgeElement(el, true);
      },
      
      /**
       * Set the canvas position and size.
       * <b>Warning:</b> This method changes the <i>element</i> property under some brother. Don't copy references !
       * @method SetCanvasRegion
       * @param {Number} left Left position
       * @param {Number} top Top position
       * @param {Number} width New width
       * @param {Number} height New height
       */
      SetCanvasRegion: UA.ie ? 
               // IE
               function(left,top,width,height){
                  var el = this.element;
                  WireIt.sn(el,null,{left:left+"px",top:top+"px",width:width+"px",height:height+"px"});
                  el.getContext("2d").clearRect(0,0,width,height);
                  this.element = el;
               } : 
               ( (UA.webkit || UA.opera) ? 
                  // Webkit (Safari & Chrome) and Opera
                  function(left,top,width,height){
                     var el = this.element;
                     var newCanvas=WireIt.cn("canvas",{className:el.className || el.getAttribute("class"),width:width,height:height},{left:left+"px",top:top+"px"});
                     var listeners=Event.getListeners(el);
                     for(var listener in listeners){
                        var l=listeners[listener];
                        Event.addListener(newCanvas,l.type,l.fn,l.obj,l.adjust);
                     }
                     Event.purgeElement(el);
                     el.parentNode.replaceChild(newCanvas,el);
                     this.element = newCanvas;
                  } :  
                  // Other (Firefox)
                  function(left,top,width,height){
                     WireIt.sn(this.element,{width:width,height:height},{left:left+"px",top:top+"px"});
                  })
   };
   
})();/**
 * The wire widget that uses a canvas to render
 * @class Wire
 * @namespace WireIt
 * @extends WireIt.CanvasElement
 * @constructor
 * @param  {WireIt.Terminal}    terminal1   Source terminal
 * @param  {WireIt.Terminal}    terminal2   Target terminal
 * @param  {HTMLElement} parentEl    Container of the CANVAS tag
 * @param  {Obj}                options      Wire configuration (see options property)
 */
WireIt.Wire = function( terminal1, terminal2, parentEl, options) {
   
   /**
    * Reference to the parent dom element
    * @property parentEl
    * @type HTMLElement
    */
   this.parentEl = parentEl;
   
   /**
    * Source terminal
    * @property terminal1
    * @type WireIt.Terminal
    */
   this.terminal1 = terminal1;
   
   /**
    * Target terminal
    * @property terminal2
    * @type WireIt.Terminal || WireIt.TerminalProxy
    */
   this.terminal2 = terminal2;

	
   /**
    * Event that is fired when a wire is clicked (on the wire, not the canvas)
    * You can register this event with myWire.eventWireClick.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseClick
    */
   this.eventMouseClick = new YAHOO.util.CustomEvent("eventMouseClick");

	/**
    * Event that is fired when the mouse enter the wire
    * You can register this event with myWire.eventMouseIn.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseIn
    */
	this.eventMouseIn = new YAHOO.util.CustomEvent("eventMouseIn");
	
	/**
    * Event that is fired when the mouse exits the wire
    * You can register this event with myWire.eventMouseOut.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseOut
    */
	this.eventMouseOut = new YAHOO.util.CustomEvent("eventMouseOut");
	
	/**
    * Event that is fired when the mouse moves inside the wire
    * You can register this event with myWire.eventMouseMove.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseMove
    */
	this.eventMouseMove = new YAHOO.util.CustomEvent("eventMouseMove");


   
   // Init the options property
   this.setOptions(options || {});
   
   // Create the canvas element and append it to parentEl
   WireIt.Wire.superclass.constructor.call(this, this.parentEl);
   
   // CSS classname
   YAHOO.util.Dom.addClass(this.element, this.options.className);
   
   // Call addWire on both terminals
   this.terminal1.addWire(this);
   this.terminal2.addWire(this);
};


YAHOO.lang.extend(WireIt.Wire, WireIt.CanvasElement, {
   
   /**
    * Build options object and set default properties
    * @method setOptions
    */
   setOptions: function(options) {
      /**
       * Wire styling, and properties:
       * <ul>
       *   <li>className: CSS class name of the canvas element (default 'WireIt-Wire')</li>
       *   <li>coeffMulDirection: Parameter for bezier style</li>
       *   <li>cap: default 'round'</li>
       *   <li>bordercap: default 'round'</li>
       *   <li>width: Wire width (default to 3)</li>
       *   <li>borderwidth: Border Width (default to 1)</li>
       *   <li>color: Wire color (default to rgb(173, 216, 230) )</li>
       *   <li>bordercolor: Border color (default to #0000ff )</li>
       * </ul>
       * @property options
       */
      this.options = {};
      this.options.className = options.className || 'WireIt-Wire';
      this.options.coeffMulDirection = YAHOO.lang.isUndefined(options.coeffMulDirection) ? 100 : options.coeffMulDirection;

      // Syling
      this.options.drawingMethod = options.drawingMethod || 'bezier';
      this.options.cap = options.cap || 'round';
      this.options.bordercap = options.bordercap || 'round';
      this.options.width = options.width || 3;
      this.options.borderwidth = options.borderwidth || 1;
      this.options.color = options.color || 'rgb(173, 216, 230)';
      this.options.bordercolor = options.bordercolor || '#0000ff';
   },
   
   /**
    * Remove a Wire from the Dom
    * @method remove
    */
   remove: function() {
   
      // Remove the canvas from the dom
      this.parentEl.removeChild(this.element);
   
      // Remove the wire reference from the connected terminals
      if(this.terminal1 && this.terminal1.removeWire) {
         this.terminal1.removeWire(this);
      }
      if(this.terminal2 && this.terminal2.removeWire) {
         this.terminal2.removeWire(this);
      }
   
      // Remove references to old terminals
      this.terminal1 = null;
      this.terminal2 = null;
   },

   /**
    * Redraw the Wire
    * @method drawBezierCurve
    */
   drawBezierCurve: function() {
   
      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();
      
      // Coefficient multiplicateur de direction
      // 100 par defaut, si distance(p1,p2) < 100, on passe en distance/2
      var coeffMulDirection = this.options.coeffMulDirection;
   
   
      var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
      if(distance < coeffMulDirection){
         coeffMulDirection = distance/2;
      }
   
      // Calcul des vecteurs directeurs d1 et d2 :
      var d1 = [this.terminal1.options.direction[0]*coeffMulDirection,
                this.terminal1.options.direction[1]*coeffMulDirection];
      var d2 = [this.terminal2.options.direction[0]*coeffMulDirection,
                this.terminal2.options.direction[1]*coeffMulDirection];
   
      var bezierPoints=[];
      bezierPoints[0] = p1;
      bezierPoints[1] = [p1[0]+d1[0],p1[1]+d1[1]];
      bezierPoints[2] = [p2[0]+d2[0],p2[1]+d2[1]];
      bezierPoints[3] = p2;
      var min = [p1[0],p1[1]];
      var max = [p1[0],p1[1]];
      for(var i=1 ; i<bezierPoints.length ; i++){
         var p = bezierPoints[i];
         if(p[0] < min[0]){
            min[0] = p[0];
         }
         if(p[1] < min[1]){
            min[1] = p[1];
         }
         if(p[0] > max[0]){
            max[0] = p[0];
         }
         if(p[1] > max[1]){
            max[1] = p[1];
         }
      }
      // Redimensionnement du canvas
      var margin = [4,4];
      min[0] = min[0]-margin[0];
      min[1] = min[1]-margin[1];
      max[0] = max[0]+margin[0];
      max[1] = max[1]+margin[1];
      var lw = Math.abs(max[0]-min[0]);
      var lh = Math.abs(max[1]-min[1]);
   
      this.SetCanvasRegion(min[0],min[1],lw,lh);
   
      var ctxt = this.getContext();
      for(i = 0 ; i<bezierPoints.length ; i++){
         bezierPoints[i][0] = bezierPoints[i][0]-min[0];
         bezierPoints[i][1] = bezierPoints[i][1]-min[1];
      }
   
      // Draw the border
      ctxt.lineCap = this.options.bordercap;
      ctxt.strokeStyle = this.options.bordercolor;
      ctxt.lineWidth = this.options.width+this.options.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
      ctxt.stroke();
   
      // Draw the inner bezier curve
      ctxt.lineCap = this.options.cap;
      ctxt.strokeStyle = this.options.color;
      ctxt.lineWidth = this.options.width;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
      ctxt.stroke();
   
   },

	/**
    * Attempted bezier drawing method for arrows
    * @method drawBezierArrows
    */
   drawBezierArrows: function() {
	  //From drawArrows function

	 	var arrowWidth = Math.round(this.options.width * 1.5 + 20);
		var arrowLength = Math.round(this.options.width * 1.2 + 20);
	  	var d = arrowWidth/2; // arrow width/2
      var redim = d+3; //we have to make the canvas a little bigger because of arrows
      var margin=[4+redim,4+redim];

      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();

      // Coefficient multiplicateur de direction
      // 100 par defaut, si distance(p1,p2) < 100, on passe en distance/2
      var coeffMulDirection = this.options.coeffMulDirection;


      var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
      if(distance < coeffMulDirection){
         coeffMulDirection = distance/2;
      }

      // Calcul des vecteurs directeurs d1 et d2 :
      var d1 = [this.terminal1.options.direction[0]*coeffMulDirection,
                this.terminal1.options.direction[1]*coeffMulDirection];
      var d2 = [this.terminal2.options.direction[0]*coeffMulDirection,
                this.terminal2.options.direction[1]*coeffMulDirection];

      var bezierPoints=[];
      bezierPoints[0] = p1;
      bezierPoints[1] = [p1[0]+d1[0],p1[1]+d1[1]];
      bezierPoints[2] = [p2[0]+d2[0],p2[1]+d2[1]];
      bezierPoints[3] = p2;
      var min = [p1[0],p1[1]];
      var max = [p1[0],p1[1]];
      for(var i=1 ; i<bezierPoints.length ; i++){
         var p = bezierPoints[i];
         if(p[0] < min[0]){
            min[0] = p[0];
         }
         if(p[1] < min[1]){
            min[1] = p[1];
         }
         if(p[0] > max[0]){
            max[0] = p[0];
         }
         if(p[1] > max[1]){
            max[1] = p[1];
         }
      }
      // Redimensionnement du canvas
      //var margin = [4,4];
      min[0] = min[0]-margin[0];
      min[1] = min[1]-margin[1];
      max[0] = max[0]+margin[0];
      max[1] = max[1]+margin[1];
      var lw = Math.abs(max[0]-min[0]);
      var lh = Math.abs(max[1]-min[1]);

      this.SetCanvasRegion(min[0],min[1],lw,lh);

      var ctxt = this.getContext();
      for(i = 0 ; i<bezierPoints.length ; i++){
         bezierPoints[i][0] = bezierPoints[i][0]-min[0];
         bezierPoints[i][1] = bezierPoints[i][1]-min[1];
      }

      // Draw the border
      ctxt.lineCap = this.options.bordercap;
      ctxt.strokeStyle = this.options.bordercolor;
      ctxt.lineWidth = this.options.width+this.options.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]+arrowLength/2*this.terminal2.options.direction[1]);
      ctxt.stroke();

      // Draw the inner bezier curve
      ctxt.lineCap = this.options.cap;
      ctxt.strokeStyle = this.options.color;
      ctxt.lineWidth = this.options.width;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]+arrowLength/2*this.terminal2.options.direction[1]);
      ctxt.stroke();

	//Variables from drawArrows
		//var t1 = p1;
		var t1 = bezierPoints[2],
			 t2 = p2;

   	var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
   	var dlug = arrowLength; //arrow length
   	var t = 1-(dlug/distance);
   	z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
   	z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );	
   	
	//line which connects the terminals: y=ax+b
   	var W = t1[0] - t2[0];
   	var Wa = t1[1] - t2[1];
   	var Wb = t1[0]*t2[1] - t1[1]*t2[0];
   	if (W !== 0) {
   		a = Wa/W;
   		b = Wb/W;
   	}
   	else {
   		a = 0;
   	}
   	//line perpendicular to the main line: y = aProst*x + b
   	if (a === 0) {
   		aProst = 0;
   	}
   	else {
   		aProst = -1/a;
   	}
   	bProst = z[1] - aProst*z[0]; //point z lays on this line

   	//we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
   	var A = 1 + Math.pow(aProst,2),
			 B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst,
			 C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2),
			 delta = Math.pow(B,2) - 4*A*C;
			
   	if (delta < 0) { return; }
	   
   	var x1 = (-B + Math.sqrt(delta)) / (2*A),
			 x2 = (-B - Math.sqrt(delta)) / (2*A),
			 y1 = aProst*x1 + bProst,
			 y2 = aProst*x2 + bProst;
   	
   	if(t1[1] == t2[1]) {
   	      var o = (t1[0] > t2[0]) ? 1 : -1;
      	   x1 = t2[0]+o*dlug;
      	   x2 = x1;
      	   y1 -= d;
      	   y2 += d;
   	}   	

   	//triangle fill
   	ctxt.fillStyle = this.options.color;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.fill();

   	//triangle border	
   	ctxt.strokeStyle = this.options.bordercolor;
   	ctxt.lineWidth = this.options.borderwidth;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.lineTo(t2[0],t2[1]);
   	ctxt.stroke();

   },



   /**
    * This function returns terminal1 if the first argument is terminal2 and vice-versa
    * @method getOtherTerminal
    * @param   {WireIt.Terminal} terminal    
    * @return  {WireIt.Terminal} terminal    the terminal that is NOT passed as argument
    */
   getOtherTerminal: function(terminal) {
      return (terminal == this.terminal1) ? this.terminal2 : this.terminal1;
   },
   
   
   /**
    * Drawing methods for arrows
    * @method drawArrows
    */
   drawArrows: function()
   {
   	var d = 7; // arrow width/2
      var redim = d+3; //we have to make the canvas a little bigger because of arrows
      var margin=[4+redim,4+redim];

      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();

      var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));

      var min=[ Math.min(p1[0],p2[0])-margin[0], Math.min(p1[1],p2[1])-margin[1]];
      var max=[ Math.max(p1[0],p2[0])+margin[0], Math.max(p1[1],p2[1])+margin[1]];
      
      // Redimensionnement du canvas
      
      var lw=Math.abs(max[0]-min[0])+redim;
      var lh=Math.abs(max[1]-min[1])+redim;

      p1[0]=p1[0]-min[0];
      p1[1]=p1[1]-min[1];
      p2[0]=p2[0]-min[0];
      p2[1]=p2[1]-min[1];

      this.SetCanvasRegion(min[0],min[1],lw,lh);

      var ctxt=this.getContext();
      
      // Draw the border
      ctxt.lineCap=this.options.bordercap;
      ctxt.strokeStyle=this.options.bordercolor;
      ctxt.lineWidth=this.options.width+this.options.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();

      // Draw the inner bezier curve
      ctxt.lineCap=this.options.cap;
      ctxt.strokeStyle=this.options.color;
      ctxt.lineWidth=this.options.width;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();

   	/* start drawing arrows */

   	var t1 = p1;
   	var t2 = p2;

   	var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
   	var dlug = 20; //arrow length
   	var t = (distance == 0) ? 0 : 1-(dlug/distance);
   	z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
   	z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );	

   	//line which connects the terminals: y=ax+b
   	var W = t1[0] - t2[0];
   	var Wa = t1[1] - t2[1];
   	var Wb = t1[0]*t2[1] - t1[1]*t2[0];
   	if (W !== 0) {
   		a = Wa/W;
   		b = Wb/W;
   	}
   	else {
   		a = 0;
   	}
   	//line perpendicular to the main line: y = aProst*x + b
   	if (a == 0) {
   		aProst = 0;
   	}
   	else {
   		aProst = -1/a;
   	}
   	bProst = z[1] - aProst*z[0]; //point z lays on this line

   	//we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
   	var A = 1 + Math.pow(aProst,2);
   	var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;
   	var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);
   	var delta = Math.pow(B,2) - 4*A*C;
   	if (delta < 0) { return; }
	   
   	var x1 = (-B + Math.sqrt(delta)) / (2*A);
   	var x2 = (-B - Math.sqrt(delta)) / (2*A);	 
   	var y1 = aProst*x1 + bProst;
   	var y2 = aProst*x2 + bProst;
   	
   	if(t1[1] == t2[1]) {
   	      var o = (t1[0] > t2[0]) ? 1 : -1;
      	   x1 = t2[0]+o*dlug;
      	   x2 = x1;
      	   y1 -= d;
      	   y2 += d;
   	}   	

   	//triangle fill
   	ctxt.fillStyle = this.options.color;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.fill();

   	//triangle border	
   	ctxt.strokeStyle = this.options.bordercolor;
   	ctxt.lineWidth = this.options.borderwidth;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.lineTo(t2[0],t2[1]);
   	ctxt.stroke();

   },
   
   /**
    * Drawing method for arrows
    * @method drawStraight
    */
   drawStraight: function()
   {
      var margin = [4,4];

      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();

      var min=[ Math.min(p1[0],p2[0])-margin[0], Math.min(p1[1],p2[1])-margin[1]];
      var max=[ Math.max(p1[0],p2[0])+margin[0], Math.max(p1[1],p2[1])+margin[1]];
      
      // Redimensionnement du canvas
      var lw=Math.abs(max[0]-min[0]);
      var lh=Math.abs(max[1]-min[1]);

      // Convert points in canvas coordinates
      p1[0] = p1[0]-min[0];
      p1[1] = p1[1]-min[1];
      p2[0] = p2[0]-min[0];
      p2[1] = p2[1]-min[1];

      this.SetCanvasRegion(min[0],min[1],lw,lh);

      var ctxt=this.getContext();
      
      // Draw the border
      ctxt.lineCap=this.options.bordercap;
      ctxt.strokeStyle=this.options.bordercolor;
      ctxt.lineWidth=this.options.width+this.options.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();

      // Draw the inner bezier curve
      ctxt.lineCap=this.options.cap;
      ctxt.strokeStyle=this.options.color;
      ctxt.lineWidth=this.options.width;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();
   },

   /**
    * Redraw the canvas (according to the drawingMethod option)
    * @method redraw
    */
   redraw: function() {
      if(this.options.drawingMethod == 'straight') {
         this.drawStraight();
      }
      else if(this.options.drawingMethod == 'arrows') {
         this.drawArrows();
      }
      else if(this.options.drawingMethod == 'bezier') {
         this.drawBezierCurve();
      }
	   else if(this.options.drawingMethod == 'bezierArrows') {
         this.drawBezierArrows();
	   }
      else {
         throw new Error("WireIt.Wire unable to find '"+this.drawingMethod+"' drawing method.");
      }
   },
   
   /**
    * Determine if the wire is drawn at position (x,y) relative to the canvas element. This is used for mouse events.
    * @method wireDrawnAt
    * @return {Boolean} true if the wire is drawn at position (x,y) relative to the canvas element
    */
   wireDrawnAt: function(x,y) {
      var ctxt = this.getContext();
	   var imgData = ctxt.getImageData(x,y,1,1);
	   var pixel = imgData.data;
	   return !( pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0 );
   },
   
   /**
    * Called by the Layer when the mouse moves over the canvas element.
    * Note: the event is not listened directly, to receive the event event if the wire is behind another wire
    * @method onMouseMove
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onMouseMove: function(x,y) {
      
      if(typeof this.mouseInState === undefined) {
         this.mouseInState = false;
      }

	   if( this.wireDrawnAt(x,y) ) {
			if(!this.mouseInState) {
			   this.mouseInState=true;
			   this.onWireIn(x,y);
			}	
			// should we call both ??
			// else {
			this.onWireMove(x,y);
			// }
	   }
	   else {
	      if(this.mouseInState) {
	         this.mouseInState=false;
			   this.onWireOut(x,y);
	      }
	   }
      
   },
   
   /**
    * When the mouse moves over a wire
    * Note: this will only work within a layer
    * @method onWireMove
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireMove: function(x,y) {
		this.eventMouseMove.fire(this, [x,y]);
   },
   
   /**
    * When the mouse comes into the wire
    * Note: this will only work within a layer
    * @method onWireIn
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireIn: function(x,y) {
		this.eventMouseIn.fire(this, [x,y]);
   },
   
   /**
    * When the mouse comes out of the wire
    * Note: this will only work within a layer
    * @method onWireOut
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireOut: function(x,y) {
		this.eventMouseOut.fire(this, [x,y]);
   },
   
   /**
    * When the mouse clicked on the canvas
    * Note: this will only work within a layer
    * @method onClick
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onClick: function(x,y) {
 	   if( this.wireDrawnAt(x,y) ) {
 	      this.onWireClick(x,y);
      }
   },
   
   /**
    * When the mouse clicked on the wire
    * Note: this will only work within a layer
    * @method onWireClick
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireClick: function(x,y) {
		this.eventMouseClick.fire(this, [x,y]);
   }


});

(function() {

   var util = YAHOO.util;
   var Event = util.Event, lang = YAHOO.lang, Dom = util.Dom, CSS_PREFIX = "WireIt-";


   /**
    * Scissors widget to cut wires
    * @class Scissors
    * @namespace WireIt
    * @extends YAHOO.util.Element
    * @constructor
    * @param {WireIt.Terminal} terminal Associated terminal
    * @param {Object} oConfigs 
    */
   WireIt.Scissors = function(terminal, oConfigs) {
      WireIt.Scissors.superclass.constructor.call(this, document.createElement('div'), oConfigs);

      /**
       * The terminal it is associated to
       * @property _terminal
       * @type {WireIt.Terminal}
       */
      this._terminal = terminal;
      
      this.initScissors();
   };
	WireIt.Scissors.visibleInstance = null;
   lang.extend(WireIt.Scissors, util.Element, {
      
      /**
       * Init the scissors
       * @method initScissors
       */
      initScissors: function() {
         
         // Display the cut button
         this.hideNow();
         this.addClass(CSS_PREFIX+"Wire-scissors");
         
         // The scissors are within the terminal element
         this.appendTo(this._terminal.container ? this._terminal.container.layer.el : this._terminal.el.parentNode.parentNode);

         // Ajoute un listener sur le scissor:
         this.on("mouseover", this.show, this, true);
         this.on("mouseout", this.hide, this, true);
         this.on("click", this.scissorClick, this, true);
         
         // On mouseover/mouseout to display/hide the scissors
         Event.addListener(this._terminal.el, "mouseover", this.mouseOver, this, true);
         Event.addListener(this._terminal.el, "mouseout", this.hide, this, true);
      },
      
      /**
       * @method setPosition
       */
      setPosition: function() {
         var pos = this._terminal.getXY();
         this.setStyle("left", (pos[0]+this._terminal.options.direction[0]*30-8)+"px");
         this.setStyle("top", (pos[1]+this._terminal.options.direction[1]*30-8)+"px");
      },
      /**
       * @method mouseOver
       */
      mouseOver: function() {
         if(this._terminal.wires.length > 0)  {
            this.show();
         }
      },

      /**
       * @method scissorClick
       */
      scissorClick: function() {
         this._terminal.removeAllWires();
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
         this.hideNow();
      },   
      /**
       * @method show
       */
      show: function() {
         this.setPosition();
         this.setStyle('display','');
			
			if(WireIt.Scissors.visibleInstance && WireIt.Scissors.visibleInstance != this) {
				if(WireIt.Scissors.visibleInstance.terminalTimeout) { WireIt.Scissors.visibleInstance.terminalTimeout.cancel(); }
				WireIt.Scissors.visibleInstance.hideNow(); 
			}
			WireIt.Scissors.visibleInstance = this;
			
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
      },
      /**
       * @method hide
       */
      hide: function() {
         this.terminalTimeout = lang.later(700,this,this.hideNow);
      },
      /**
       * @method hideNow
       */
      hideNow: function() {
			WireIt.Scissors.visibleInstance = null;
         this.setStyle('display','none');
      }

   });




   
   
/**
 * This class is used for wire edition. It inherits from YAHOO.util.DDProxy and acts as a "temporary" Terminal.
 * @class TerminalProxy
 * @namespace WireIt
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {WireIt.Terminal} terminal Parent terminal
 * @param {Object} options Configuration object (see "termConfig" property for details)
 */
WireIt.TerminalProxy = function(terminal, options) {
   
   /**
    * Reference to the terminal parent
    */
   this.terminal = terminal;
   
   /**
    * Object containing the configuration object
    * <ul>
    *   <li>type: 'type' of this terminal. If no "allowedTypes" is specified in the options, the terminal will only connect to the same type of terminal</li>
    *   <li>allowedTypes: list of all the allowed types that we can connect to.</li>
    *   <li>{Integer} terminalProxySize: size of the drag drop proxy element. default is 10 for "10px"</li>
    * </ul>
    * @property termConfig
    */
   // WARNING: the object config cannot be called "config" because YAHOO.util.DDProxy already has a "config" property
   this.termConfig = options || {};
   
   this.terminalProxySize = options.terminalProxySize || 10;
   
   /**
    * Object that emulate a terminal which is following the mouse
    */
   this.fakeTerminal = null;
   
   // Init the DDProxy
   WireIt.TerminalProxy.superclass.constructor.call(this,this.terminal.el, undefined, {
      dragElId: "WireIt-TerminalProxy",
      resizeFrame: false,
      centerFrame: true
   });
};

// Mode Intersect to get the DD objects
util.DDM.mode = util.DDM.INTERSECT;

lang.extend(WireIt.TerminalProxy, util.DDProxy, {
   
   /**
    * Took this method from the YAHOO.util.DDProxy class
    * to overwrite the creation of the proxy Element with our custom size
    * @method createFrame
    */
   createFrame: function() {
        var self=this, body=document.body;
        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }
        var div=this.getDragEl(), Dom=YAHOO.util.Dom;
        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;
            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;
            var size = this.terminalProxySize+"px";
            s.height     = size; 
            s.width      = size;
            var _data = document.createElement('div');
            Dom.setStyle(_data, 'height', '100%');
            Dom.setStyle(_data, 'width', '100%');
            Dom.setStyle(_data, 'background-color', '#ccc');
            Dom.setStyle(_data, 'opacity', '0');
            div.appendChild(_data);
            body.insertBefore(div, body.firstChild);
        }
    },
   
   /**
    * @method startDrag
    */
   startDrag: function() {
      
      // If only one wire admitted, we remove the previous wire
      if(this.terminal.options.nMaxWires == 1 && this.terminal.wires.length == 1) {
         this.terminal.wires[0].remove();
      }
      // If the number of wires is at its maximum, prevent editing...
      else if(this.terminal.wires.length >= this.terminal.options.nMaxWires) {
         return;
      }
      
      var halfProxySize = this.terminalProxySize/2;
      this.fakeTerminal = {
         options: {direction: this.terminal.options.fakeDirection},
         pos: [200,200], 
         addWire: function() {},
         removeWire: function() {},
         getXY: function() { 
            var layers = Dom.getElementsByClassName('WireIt-Layer');
            if(layers.length > 0) {
               var orig = Dom.getXY(layers[0]);
               return [this.pos[0]-orig[0]+halfProxySize, this.pos[1]-orig[1]+halfProxySize]; 
            }
            return this.pos;
         }
      };
      
      var parentEl = this.terminal.parentEl.parentNode;
      if(this.terminal.container) {
         parentEl = this.terminal.container.layer.el;
      }
      this.editingWire = new WireIt.Wire(this.terminal, this.fakeTerminal, parentEl, this.terminal.options.editingWireConfig);
      Dom.addClass(this.editingWire.element, CSS_PREFIX+'Wire-editing');
   },
   
   /**
    * @method onDrag
    */
   onDrag: function(e) {
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
      if(this.terminal.container) {
         var obj = this.terminal.container.layer.el;
         var curleft = curtop = 0;
        	if (obj.offsetParent) {
        		do {
        			curleft += obj.offsetLeft;
        			curtop += obj.offsetTop;
        			obj = obj.offsetParent ;
        		} while ( obj = obj.offsetParent );
        	}
         this.fakeTerminal.pos = [e.clientX-curleft+this.terminal.container.layer.el.scrollLeft,
                                  e.clientY-curtop+this.terminal.container.layer.el.scrollTop];
      }
      else {
         this.fakeTerminal.pos = (YAHOO.env.ua.ie) ? [e.clientX, e.clientY] : [e.clientX+window.pageXOffset, e.clientY+window.pageYOffset];
         //this.fakeTerminal.pos = [e.clientX, e.clientY];
      }
      this.editingWire.redraw();
   },
   
   
   /**
    * @method endDrag
    */
   endDrag: function(e) {
      if(this.editingWire) {
         this.editingWire.remove();
         this.editingWire = null;
      }
   },
   
   /**
    * @method onDragEnter
    */
   onDragEnter: function(e,ddTargets) {
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            ddTargets[i].terminal.setDropInvitation(true);
         }
      }
   },
   
   /**
    * @method onDragOut
    */
   onDragOut: function(e,ddTargets) { 
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            ddTargets[i].terminal.setDropInvitation(false);
         }
      }
   },
   
   /**
    * @method onDragDrop
    */
   onDragDrop: function(e,ddTargets) {
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
      this.onDragOut(e,ddTargets);
      
      // Connect to the FIRST target terminal
      var targetTerminalProxy = null;
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            targetTerminalProxy =  ddTargets[i];
            break;
         }
      }

      // Quit if no valid terminal found
      if( !targetTerminalProxy ) { 
         return;
      }
      
      // Remove the editing wire
      this.editingWire.remove();
      this.editingWire = null;
         
      // Don't create the wire if it already exists between the 2 terminals !!
      var termAlreadyConnected = false;
      for(var i = 0 ; i < this.terminal.wires.length ; i++) {
         if(this.terminal.wires[i].terminal1 == this.terminal) {
            if( this.terminal.wires[i].terminal2 == targetTerminalProxy.terminal) {
               termAlreadyConnected = true;
               break;
            }
         }
         else if(this.terminal.wires[i].terminal2 == this.terminal) {
            if( this.terminal.wires[i].terminal1 == targetTerminalProxy.terminal) {
               termAlreadyConnected = true;
               break;
            }
         }
      }
      
      // Create the wire only if the terminals aren't connected yet
      if(termAlreadyConnected) {
         //console.log("terminals already connected ");
         return;
      }
         
      var parentEl = this.terminal.parentEl.parentNode;
      if(this.terminal.container) {
         parentEl = this.terminal.container.layer.el;
      }
      
      // Switch the order of the terminals if tgt as the "alwaysSrc" property
      var term1 = this.terminal;
      var term2 = targetTerminalProxy.terminal;
      if(term2.options.alwaysSrc) {
         term1 = targetTerminalProxy.terminal;
         term2 = this.terminal;
      }
      
      // Check the number of wires for this terminal
      var tgtTerm = targetTerminalProxy.terminal;
      if( tgtTerm.options.nMaxWires == 1) {
         if(tgtTerm.wires.length > 0) {
            tgtTerm.wires[0].remove();
         }
         var w = new WireIt.Wire(term1, term2, parentEl, term1.options.wireConfig);
         w.redraw();
      }
      else if(tgtTerm.wires.length < tgtTerm.options.nMaxWires) {
         var w = new WireIt.Wire(term1, term2, parentEl, term1.options.wireConfig);
         w.redraw();
      }
      /*else {
         console.log("Cannot connect to this terminal: nMaxWires = ", ddTargets[0].terminal.options.nMaxWires);
      }*/
      
   },
   
   
   // to distinct from other YAHOO.util.DragDrop objects
   isWireItTerminal: true,
   
   
   /**
    * @method isValidWireTerminal
    */
   isValidWireTerminal: function(DDterminal) {
      
      if( !DDterminal.isWireItTerminal ) {
         return false;
      }
      
      // If this terminal has the type property:
      if(this.termConfig.type) {
         if(this.termConfig.allowedTypes) {
            if( WireIt.indexOf(DDterminal.termConfig.type, this.termConfig.allowedTypes) == -1 ) {
               return false;
            }
         }
         else {
            if(this.termConfig.type != DDterminal.termConfig.type) {
               return false;
            }
         }
      }
      // The other terminal may have type property too:
      else if(DDterminal.termConfig.type) {
         if(DDterminal.termConfig.allowedTypes) {
            if( WireIt.indexOf(this.termConfig.type, DDterminal.termConfig.allowedTypes) == -1 ) {
               return false;
            }
         }
         else {
            if(this.termConfig.type != DDterminal.termConfig.type) {
               return false;
            }
         }
      }
      
      // Check the allowSelfWiring
      if(this.terminal.container) {
         if(this.terminal.container.options.preventSelfWiring) {
            if(DDterminal.terminal.container == this.terminal.container) {
               return false;
            }
         }
      }
      
      return true;
   }
   
});


   
/**
 * Terminals represent the end points of the "wires"
 * @class Terminal
 * @constructor
 * @param {HTMLElement} parentEl Element that will contain the terminal
 * @param {Object} options Configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
WireIt.Terminal = function(parentEl, options, container) {
   
   /**
    * DOM parent element
    * @property parentEl
    * @type {HTMLElement}
    */
   this.parentEl = parentEl;
   
   /**
    * Container (optional). Parent container of this terminal
    * @property container
    * @type {WireIt.Container}
    */
   this.container = container;
   
   /**
    * List of the associated wires
    * @property wires
    * @type {Array}
    */
    this.wires = [];
   
   
   this.setOptions(options);
   
   /**
    * Event that is fired when a wire is added
    * You can register this event with myTerminal.eventAddWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventAddWire
    */
   this.eventAddWire = new util.CustomEvent("eventAddWire");
   
   /**
    * Event that is fired when a wire is removed
    * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventRemoveWire
    */
   this.eventRemoveWire = new util.CustomEvent("eventRemoveWire");
   
   /**
    * DIV dom element that will display the Terminal
    * @property el
    * @type {HTMLElement}
    */
   this.el = null;
   
   
   this.render();
   
   // Create the TerminalProxy object to make the terminal editable
   if(this.options.editable) {
      this.dd = new WireIt.TerminalProxy(this, this.options.ddConfig);
      this.scissors = new WireIt.Scissors(this);
   }
};

WireIt.Terminal.prototype = {
   
   /**
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) {
      
      /**
       * <p>Object that contains the terminal configuration:</p>
       * 
       * <ul>
       *   <li><b>name</b>: terminal name</li>
       *   <li><b>direction</b>: direction vector of the wires when connected to this terminal (default [0,1])</li>
       *   <li><b>fakeDirection</b>: direction vector of the "editing" wire when it started from this terminal (default to -direction)</li>
       *   <li><b>editable</b>: boolean that makes the terminal editable (default to true)</li>
       *   <li><b>nMaxWires</b>: maximum number of wires for this terminal (default to Infinity)</li>
       *   <li><b>offsetPosition</b>: offset position from the parentEl position. Can be an array [top,left] or an object {left: 100, bottom: 20} or {right: 10, top: 5} etc... (default to [0,0])</li>
       *   <li><b>ddConfig</b>: configuration of the WireIt.TerminalProxy object (only if editable)</li>
       *   <li><b>alwaysSrc</b>: alwaysSrc forces this terminal to be the src terminal in the wire config (default false, only if editable)</li>
       *   <li><b>className</b>: CSS class name of the terminal (default to "WireIt-Terminal")</li>
       *   <li><b>connectedClassName</b>: CSS class added to the terminal when it is connected (default to "WireIt-Terminal-connected")</li>
       *   <li><b>dropinviteClassName</b>: CSS class added for drop invitation (default to "WireIt-Terminal-dropinvite")</li>
       * </ul>
       * @property options
       */  
      this.options = {};
      this.options.name = options.name;
      this.options.direction = options.direction || [0,1];
      this.options.fakeDirection = options.fakeDirection || [-this.options.direction[0],-this.options.direction[1]];
      this.options.className = options.className || CSS_PREFIX+'Terminal';
      this.options.connectedClassName = options.connectedClassName || CSS_PREFIX+'Terminal-connected';
      this.options.dropinviteClassName = options.dropinviteClassName || CSS_PREFIX+'Terminal-dropinvite';
      this.options.editable = lang.isUndefined(options.editable) ? true : options.editable;
      this.options.nMaxWires = options.nMaxWires || Infinity;
      this.options.wireConfig = options.wireConfig || {};
      this.options.editingWireConfig = options.editingWireConfig || this.options.wireConfig;
      this.options.offsetPosition = options.offsetPosition;
      this.options.alwaysSrc = lang.isUndefined(options.alwaysSrc) ? false : options.alwaysSrc;
      this.options.ddConfig = options.ddConfig || {};
   },

   /**
    * Show or hide the drop invitation. (by adding/removing this.options.dropinviteClassName CSS class)
    * @method setDropInvitation
    * @param {Boolean} display Show the invitation if true, hide it otherwise
    */
   setDropInvitation: function(display) {
      if(display) {
         Dom.addClass(this.el, this.options.dropinviteClassName);
      }
      else {
         Dom.removeClass(this.el, this.options.dropinviteClassName);
      }
   },

   /**
    * Render the DOM of the terminal
    * @method render
    */
   render: function() {
   
      // Create the DIV element
      this.el = WireIt.cn('div', {className: this.options.className} );
      if(this.options.name) { this.el.title = this.options.name; }

      // Set the offset position
      var pos = this.options.offsetPosition;
      if(pos) {
         // Kept old version [x,y] for retro-compatibility
         if( lang.isArray(pos) ) {
            this.el.style.left = pos[0]+"px";
            this.el.style.top = pos[1]+"px";
         }
         // New version: {top: 32, left: 23}
         else if( lang.isObject(pos) ) {
            for(var key in pos) {
               if(pos.hasOwnProperty(key) && pos[key] != ""){
                  this.el.style[key] = pos[key]+"px";
               }
            }
         }
      }
   
      // Append the element to the parent
      this.parentEl.appendChild(this.el);
   },


   /**
    * Add a wire to this terminal.
    * @method addWire
    * @param {WireIt.Wire} wire Wire instance to add
    */
   addWire: function(wire) {
   
      // Adds this wire to the list of connected wires :
      this.wires.push(wire);
   
      // Set class indicating that the wire is connected
      Dom.addClass(this.el, this.options.connectedClassName);
   
      // Fire the event
      this.eventAddWire.fire(wire);
   },

   /**
    * Remove a wire
    * @method removeWire
    * @param {WireIt.Wire} wire Wire instance to remove
    */
   removeWire: function(wire) {
      var index = WireIt.indexOf(wire, this.wires), w;   
      if( index != -1 ) {
         
         this.wires[index].destroy();
         
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
      
         // Remove the connected class if it has no more wires:
         if(this.wires.length == 0) {
            Dom.removeClass(this.el, this.options.connectedClassName);
         }
      
         // Fire the event
         this.eventRemoveWire.fire(wire);
      }
   },


   /**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
    * @method getXY
    */
   getXY: function() {
   
      var layerEl = this.container && this.container.layer ? this.container.layer.el : document.body;

      var obj = this.el;
      var curleft = curtop = 0;
     	if (obj.offsetParent) {
     		do {
     			curleft += obj.offsetLeft;
     			curtop += obj.offsetTop;
     			obj = obj.offsetParent;
     		} while ( !!obj && obj != layerEl);
     	}
  	
     	return [curleft+15,curtop+15];
   },



   /**
    * Remove the terminal from the DOM
    * @method remove
    */
   remove: function() {
      // This isn't very nice but...
      // the method Wire.remove calls Terminal.removeWire to remove the reference
      while(this.wires.length > 0) {
         this.wires[0].remove();
      }
      this.parentEl.removeChild(this.el);
      
      // Remove all event listeners
      Event.purgeElement(this.el);
      
      // Remove scissors widget
      if(this.scissors) {
         Event.purgeElement(this.scissors.get('element'));
      }
      
   },



   /**
    * Returns a list of all the terminals connecter to this terminal through its wires.
    * @method getConnectedTerminals
    * @return  {Array}  List of all connected terminals
    */
   getConnectedTerminals: function() {
      var terminalList = [];
      if(this.wires) {
         for(var i = 0 ; i < this.wires.length ; i++) {
            terminalList.push(this.wires[i].getOtherTerminal(this));
         }
      }
      return terminalList;
   },


   /**
    * Redraw all the wires connected to this terminal
    * @method redrawAllWires
    */
   redrawAllWires: function() {
      if(this.wires) {
         for(var i = 0 ; i < this.wires.length ; i++) {
            this.wires[i].redraw();
         }
      }
   },
   
   /** 
    * Remove all wires
    * @method removeAllWires
    */
   removeAllWires: function() {
      while(this.wires.length > 0) {
         this.wires[0].remove();
      }
   }

};

 /**
  * Class that extends Terminal to differenciate Input/Output terminals
  * @class WireIt.util.TerminalInput
  * @extends WireIt.Terminal
  * @constructor
  * @param {HTMLElement} parentEl Parent dom element
  * @param {Object} options configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalInput = function(parentEl, options, container) {
   WireIt.util.TerminalInput.superclass.constructor.call(this,parentEl, options, container);
};
lang.extend(WireIt.util.TerminalInput, WireIt.Terminal, {
   
   /**
    * Override setOptions to add the default options for TerminalInput
    * @method setOptions
    */
   setOptions: function(options) {
      
      WireIt.util.TerminalInput.superclass.setOptions.call(this,options);
      
      this.options.direction = options.direction || [0,-1];
      this.options.fakeDirection = options.fakeDirection || [0,1];
      this.options.ddConfig = {
         type: "input",
         allowedTypes: ["output"]
      };
      this.options.nMaxWires = options.nMaxWires || 1;
   }
   
});




 /**
  * Class that extends Terminal to differenciate Input/Output terminals
  * @class WireIt.util.TerminalOutput
  * @extends WireIt.Terminal
  * @constructor
  * @param {HTMLElement} parentEl Parent dom element
  * @param {Object} options configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalOutput = function(parentEl, options, container) {
   WireIt.util.TerminalOutput.superclass.constructor.call(this,parentEl, options, container);
};
lang.extend(WireIt.util.TerminalOutput, WireIt.Terminal, {
   
   /**
    * Override setOptions to add the default options for TerminalOutput
    * @method setOptions
    */
   setOptions: function(options) {
      
      WireIt.util.TerminalOutput.superclass.setOptions.call(this,options);
      
      this.options.direction = options.direction || [0,1];
      this.options.fakeDirection = options.fakeDirection || [0,-1];
      this.options.ddConfig = {
         type: "output",
         allowedTypes: ["input"]
      };
      this.options.alwaysSrc = true;
   }
   
});


})();/**
 * WireIt.util.DD is a wrapper class for YAHOO.util.DD, to redraw the wires associated with the given terminals while drag-dropping
 * @class DD
 * @namespace WireIt.util
 * @extends YAHOO.util.DD
 * @constructor
 * @param {Array} terminals List of WireIt.Terminal objects associated within the DragDrop element
 * @param {String} id Parameter of YAHOO.util.DD
 * @param {String} sGroup Parameter of YAHOO.util.DD
 * @param {Object} config Parameter of YAHOO.util.DD
 */
WireIt.util.DD = function( terminals, id, sGroup, config) {
   if(!terminals) {
      throw new Error("WireIt.util.DD needs at least terminals and id");
   }
   /**
    * List of the contained terminals
    * @property _WireItTerminals
    * @type {Array}
    */
   this._WireItTerminals = terminals;
   
   WireIt.util.DD.superclass.constructor.call(this, id, sGroup, config);
};

YAHOO.extend(WireIt.util.DD, YAHOO.util.DD, {

   /**
    * Override YAHOO.util.DD.prototype.onDrag to redraw the wires
    * @method onDrag
    */
   onDrag: function(e) {
      // Make sure terminalList is an array
      var terminalList = YAHOO.lang.isArray(this._WireItTerminals) ? this._WireItTerminals : (this._WireItTerminals.isWireItTerminal ? [this._WireItTerminals] : []);
      // Redraw all the wires
      for(var i = 0 ; i < terminalList.length ; i++) {
         if(terminalList[i].wires) {
            for(var k = 0 ; k < terminalList[i].wires.length ; k++) {
               terminalList[i].wires[k].redraw();
            }
         }
      }
   },

   /**
    * In case you change the terminals since you created the WireIt.util.DD:
    * @method setTerminals
    */
   setTerminals: function(terminals) {
      this._WireItTerminals = terminals;
   }
   
});
/**
 * Make a container resizable
 * @class DDResize
 * @namespace WireIt.util
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param {WireIt.Container} container The container that is to be resizable
 * @param {Object} config Configuration object
 */
WireIt.util.DDResize = function(container, config) {
   
   /**
    * Configuration object
    * <ul>
    *   <li>minWidth: minimum width (default 50)</li>
    *   <li>minHeight: minimum height (default 50)</li>
    * </ul>
    * @property myConf
    */
   // WARNING: the object config cannot be called "config" because YAHOO.util.DragDrop already has a "config" property
   this.myConf = config || {};
   this.myConf.container = container;
   this.myConf.minWidth = this.myConf.minWidth || 50;
   this.myConf.minHeight = this.myConf.minHeight || 50;
   
   // Call the superconstructor
   WireIt.util.DDResize.superclass.constructor.apply(this, [container.el, container.ddResizeHandle]);
   
   // Set the resize handle
   this.setHandleElId(container.ddResizeHandle);
   
   /**
    * The event fired when the container is resized
    * @event eventResize
    */
   this.eventResize = new YAHOO.util.CustomEvent("eventResize");
};

YAHOO.extend(WireIt.util.DDResize, YAHOO.util.DragDrop, {

   /**
    * @method onMouseDown
    */
   onMouseDown: function(e) {
        var panel = this.getEl();
        this.startWidth = panel.offsetWidth;
        this.startHeight = panel.offsetHeight;

        this.startPos = [YAHOO.util.Event.getPageX(e), YAHOO.util.Event.getPageY(e)];
    },

    /**
     * @method onDrag
     */
    onDrag: function(e) {
        var newPos = [YAHOO.util.Event.getPageX(e),  YAHOO.util.Event.getPageY(e)];

        var offsetX = newPos[0] - this.startPos[0];
        var offsetY = newPos[1] - this.startPos[1];

        var newWidth = Math.max(this.startWidth + offsetX, this.myConf.minWidth);
        var newHeight = Math.max(this.startHeight + offsetY, this.myConf.minHeight);

        var panel = this.getEl();
        panel.style.width = newWidth + "px";
        panel.style.height = newHeight + "px";
        
        // Fire the resize event
        this.eventResize.fire([newWidth, newHeight]);
    }
});
(function() {
   
   var util = YAHOO.util;
   var Dom = util.Dom, Event = util.Event, CSS_PREFIX = "WireIt-";
   
/**
 * Visual module that contains terminals. The wires are updated when the module is dragged around.
 * @class Container
 * @namespace WireIt
 * @constructor
 * @param {Object}   options      Configuration object (see options property)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.Container = function(options, layer) {
   
   // Set the options
   this.setOptions(options);
   
   /**
    * the WireIt.Layer object that schould contain this container
    * @property layer
    * @type {WireIt.Layer}
    */
   this.layer = layer;
   
   /**
    * List of the terminals 
    * @property terminals
    * @type {Array}
    */
   this.terminals = [];
   
   /**
    * List of all the wires connected to this container terminals
    * @property wires
    * @type {Array}
    */
   this.wires = [];
   
   /**
    * Container DOM element
    * @property el
    * @type {HTMLElement}
    */
   this.el = null;
   
   /**
    * Body element
    * @property bodyEl
    * @type {HTMLElement}
    */
   this.bodyEl = null;
   
   /**
    * Event that is fired when a wire is added
    * You can register this event with myTerminal.eventAddWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventAddWire
    */
   this.eventAddWire = new util.CustomEvent("eventAddWire");
   
   /**
    * Event that is fired when a wire is removed
    * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventRemoveWire
    */
   this.eventRemoveWire = new util.CustomEvent("eventRemoveWire");
   
   // Render the div object
   this.render();
   
   // Init the terminals
   this.initTerminals( this.options.terminals);
   
	// Make the container draggable
	if(this.options.draggable) {
		   
	   if(this.options.resizable) {
      	// Make resizeable   
      	this.ddResize = new WireIt.util.DDResize(this);
      	this.ddResize.eventResize.subscribe(this.onResize, this, true);
	   }
	   
	   // Use the drag'n drop utility to make the container draggable
	   this.dd = new WireIt.util.DD(this.terminals,this.el);
	   
	   // Sets ddHandle as the drag'n drop handle
	   if(this.options.ddHandle) {
   	   this.dd.setHandleElId(this.ddHandle);
	   }
	   
	   // Mark the resize handle as an invalid drag'n drop handle and vice versa
	   if(this.options.resizable) {
   	   this.dd.addInvalidHandleId(this.ddResizeHandle);
      	this.ddResize.addInvalidHandleId(this.ddHandle);
	   }
   }
   
};

WireIt.Container.prototype = {
   
   /**
    * set the options
    * @method setOptions
    */
   setOptions: function(options) {
      
      /**
       * Main options object
       * <ul>
       *    <li>terminals: list of the terminals configuration</li>
       *    <li>draggable: boolean that enables drag'n drop on this container (default: true)</li>
       *    <li>className: CSS class name for the container element (default 'WireIt-Container')</li>
       *    <li>position: initial position of the container</li>
       *    <li>ddHandle: (only if draggable) boolean indicating we use a handle for drag'n drop (default true)</li>
       *    <li>ddHandleClassName: CSS class name for the drag'n drop handle (default 'WireIt-Container-ddhandle')</li>
       *    <li>resizable: boolean that makes the container resizable (default true)</li>
       *    <li>resizeHandleClassName: CSS class name for the resize handle (default 'WireIt-Container-resizehandle')</li>
       *    <li>width: initial width of the container (no default so it autoadjusts to the content)</li>
       *    <li>height: initial height of the container (default 100)</li>
       *    <li>close: display a button to close the container (default true)</li>
       *    <li>closeButtonClassName: CSS class name for the close button (default "WireIt-Container-closebutton")</li>
       *    <li>title: text that will appear in the module header</li>
       *    <li>icon: image url to be displayed in the module header</li>
       *    <li>preventSelfWiring: option to prevent connections between terminals of this same container (default true)</li>
       * </ul>
       * @property options
       * @type {Object}
       */
      this.options = {};
      this.options.terminals = options.terminals || [];
      this.options.draggable = (typeof options.draggable == "undefined") ? true : options.draggable ;
      this.options.position = options.position || [100,100];
      this.options.className = options.className || CSS_PREFIX+'Container';

      this.options.ddHandle = (typeof options.ddHandle == "undefined") ? true : options.ddHandle;
      this.options.ddHandleClassName = options.ddHandleClassName || CSS_PREFIX+"Container-ddhandle";

      this.options.resizable = (typeof options.resizable == "undefined") ? true : options.resizable;
      this.options.resizeHandleClassName = options.resizeHandleClassName || CSS_PREFIX+"Container-resizehandle";

      this.options.width = options.width; // no default
      this.options.height = options.height;

      this.options.close = (typeof options.close == "undefined") ? true : options.close;
      this.options.closeButtonClassName = options.closeButtonClassName || CSS_PREFIX+"Container-closebutton";

      this.options.title = options.title; // no default
      
      this.options.icon = options.icon;
      
      this.options.preventSelfWiring = (typeof options.preventSelfWiring == "undefined") ? true : options.preventSelfWiring;
   },

   /**
    * Function called when the container is being resized.
    * It doesn't do anything, so please override it.
    * @method onResize
    */
   onResize: function(event, args) {
      var size = args[0];
      WireIt.sn(this.bodyEl, null, {width: (size[0]-10)+"px", height: (size[1]-44)+"px"});
   },

   /**
    * Render the dom of the container
    * @method render
    */
   render: function() {
   
      // Create the element
      this.el = WireIt.cn('div', {className: this.options.className});
   
      if(this.options.width) {
         this.el.style.width = this.options.width+"px";
      }
      if(this.options.height) {
         this.el.style.height = this.options.height+"px";
      }
   
      // Adds a handler for mousedown so we can notice the layer
      Event.addListener(this.el, "mousedown", this.onMouseDown, this, true);
   
      if(this.options.ddHandle) {
         // Create the drag/drop handle
      	this.ddHandle = WireIt.cn('div', {className: this.options.ddHandleClassName});
      	this.el.appendChild(this.ddHandle);
      	
         // Set title
         if(this.options.title) {
            this.ddHandle.appendChild( WireIt.cn('span', null, null, this.options.title) );
         }
         
         // Icon
         if (this.options.icon) {
            var iconCn = WireIt.cn('img', {src: this.options.icon, className: 'WireIt-Container-icon'});
            this.ddHandle.appendChild(iconCn);
         }

      }
   
      // Create the body element
      this.bodyEl = WireIt.cn('div', {className: "body"});
      this.el.appendChild(this.bodyEl);
   
      if(this.options.resizable) {
         // Create the resize handle
      	this.ddResizeHandle = WireIt.cn('div', {className: this.options.resizeHandleClassName} );
      	this.el.appendChild(this.ddResizeHandle);
      }
   
      if(this.options.close) {
         // Close button
         this.closeButton = WireIt.cn('div', {className: this.options.closeButtonClassName} );
         this.el.appendChild(this.closeButton);
         Event.addListener(this.closeButton, "click", this.onCloseButton, this, true);
      }
   
      // Append to the layer element
      this.layer.el.appendChild(this.el);
   
   	// Set the position
   	this.el.style.left = this.options.position[0]+"px";
   	this.el.style.top = this.options.position[1]+"px";
   },

   /**
    * Sets the content of the body element
    * @method setBody
    * @param {String or HTMLElement} content
    */
   setBody: function(content) {
      if(typeof content == "string") {
         this.bodyEl.innerHTML = content;
      }
      else {
         this.bodyEl.innerHTML = "";
         this.bodyEl.appendChild(content);
      }
   },

   /**
    * Called when the user made a mouse down on the container and sets the focus to this container (only if within a Layer)
    * @method onMouseDown
    */
   onMouseDown: function() {
      if(this.layer) {
         if(this.layer.focusedContainer && this.layer.focusedContainer != this) {
            this.layer.focusedContainer.removeFocus();
         }
         this.setFocus();
         this.layer.focusedContainer = this;
      }
   },

   /**
    * Adds the class that shows the container as "focused"
    * @method setFocus
    */
   setFocus: function() {
      Dom.addClass(this.el, CSS_PREFIX+"Container-focused");
   },

   /**
    * Remove the class that shows the container as "focused"
    * @method removeFocus
    */
   removeFocus: function() {
      Dom.removeClass(this.el, CSS_PREFIX+"Container-focused");
   },

   /**
    * Called when the user clicked on the close button
    * @method onCloseButton
    */
   onCloseButton: function(e, args) {
      Event.stopEvent(e);
      this.layer.removeContainer(this);
   },

   /**
    * Remove this container from the dom
    * @method remove
    */
   remove: function() {
   
      // Remove the terminals (and thus remove the wires)
      this.removeAllTerminals();
   
      // Remove from the dom
      this.layer.el.removeChild(this.el);
      
      // Remove all event listeners
      Event.purgeElement(this.el);
   },


   /**
    * Call the addTerminal method for each terminal configuration.
    * @method initTerminals
    */
   initTerminals: function(terminalConfigs) {
      for(var i = 0 ; i < terminalConfigs.length ; i++) {
         this.addTerminal(terminalConfigs[i]);
      }
   },


   /**
    * Instanciate the terminal from the class pointer "xtype" (default WireIt.Terminal)
    * @method addTerminal
    * @return {WireIt.Terminal}  terminal Created terminal
    */
   addTerminal: function(terminalConfig) {
   
      // Terminal type
      var type = eval(terminalConfig.xtype || "WireIt.Terminal");
   
      // Instanciate the terminal
      var term = new type(this.el, terminalConfig, this);
   
      // Add the terminal to the list
      this.terminals.push( term );
   
      // Event listeners
      term.eventAddWire.subscribe(this.onAddWire, this, true);
      term.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
   
      return term;
   },

   /**
    * This method is called when a wire is added to one of the terminals
    * @method onAddWire
    * @param {Event} event The eventAddWire event fired by the terminal
    * @param {Array} args This array contains a single element args[0] which is the added Wire instance
    */
   onAddWire: function(event, args) {
      var wire = args[0];
      // add the wire to the list if it isn't in
      if( WireIt.indexOf(wire, this.wires) == -1 ) {
         this.wires.push(wire);
         this.eventAddWire.fire(wire);
      } 
   },

   /**
    * This method is called when a wire is removed from one of the terminals
    * @method onRemoveWire
    * @param {Event} event The eventRemoveWire event fired by the terminal
    * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
    */
   onRemoveWire: function(event, args) {
      var wire = args[0];
      var index = WireIt.indexOf(wire, this.wires);
      if( index != -1 ) {
         this.eventRemoveWire.fire(wire);
         this.wires[index] = null;
      }
      this.wires = WireIt.compact(this.wires);
   },

   /**
    * Remove all terminals
    * @method removeAllTerminals
    */
   removeAllTerminals: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].remove();
      }
      this.terminals = [];
   },

   /**
    * Redraw all the wires connected to the terminals of this container
    * @method redrawAllTerminals
    */
   redrawAllWires: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].redrawAllWires();
      }
   },

   /**
    * Return the config of this container.
    * @method getConfig
    */
   getConfig: function() {
      var obj = {};
   
      // Position
      obj.position = Dom.getXY(this.el);
      if(this.layer) {
         // remove the layer position to the container position
         var layerPos = Dom.getXY(this.layer.el);
         obj.position[0] -= layerPos[0];
         obj.position[1] -= layerPos[1];
         // add the scroll position of the layer to the container position
         obj.position[0] += this.layer.el.scrollLeft;
         obj.position[1] += this.layer.el.scrollTop;
      }
   
      // xtype
      if(this.options.xtype) {
         obj.xtype = this.options.xtype;
      }
   
      return obj;
   },
   
   /**
    * Subclasses should override this method.
    * @method getValue
    * @return {Object} value
    */
   getValue: function() {
      return {};
   },

   /**
    * Subclasses should override this method.
    * @method setValue
    * @param {Any} val Value 
    */
   setValue: function(val) {
   },
   
   
   /**
    * @method getTerminal
    */
   getTerminal: function(name) {
      var term;
      for(var i = 0 ; i < this.terminals.length ; i++) {
         term = this.terminals[i];
         if(term.options.name == name) {
            return term;
         }
      }
      return null;
   }

};

})();/**
 * A layer encapsulate a bunch of containers and wires
 * @class Layer
 * @namespace WireIt
 * @constructor
 * @param {Object}   options   Configuration object (see the properties)
 */
WireIt.Layer = function(options) {
   
   this.setOptions(options);
   
   /**
    * List of all the WireIt.Container (or subclass) instances in this layer
    * @property containers
    * @type {Array}
    */
   this.containers = [];
   
   /**
    * List of all the WireIt.Wire (or subclass) instances in this layer
    * @property wires
    * @type {Array}
    */
   this.wires = [];
   
   /**
    * Layer DOM element
    * @property el
    * @type {HTMLElement}
    */
   this.el = null;

	/**
    * Event that is fired when the layer has been changed
    * You can register this event with myTerminal.eventChanged.subscribe(function(e,params) { }, scope);
    * @event eventChanged
    */
   this.eventChanged = new YAHOO.util.CustomEvent("eventChanged");
   
   /**
    * Event that is fired when a wire is added
    * You can register this event with myTerminal.eventAddWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventAddWire
    */
   this.eventAddWire = new YAHOO.util.CustomEvent("eventAddWire");
   
   /**
    * Event that is fired when a wire is removed
    * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventRemoveWire
    */
   this.eventRemoveWire = new YAHOO.util.CustomEvent("eventRemoveWire");
   
   /**
    * Event that is fired when a container is added
    * You can register this event with myTerminal.eventAddContainer.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventAddContainer
    */
   this.eventAddContainer = new YAHOO.util.CustomEvent("eventAddContainer");
   
   /**
    * Event that is fired when a container is removed
    * You can register this event with myTerminal.eventRemoveContainer.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventRemoveContainer
    */
   this.eventRemoveContainer = new YAHOO.util.CustomEvent("eventRemoveContainer");
   
   /**
    * Event that is fired when a container has been moved
    * You can register this event with myTerminal.eventContainerDragged.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventContainerDragged
    */
   this.eventContainerDragged = new YAHOO.util.CustomEvent("eventContainerDragged");
   
   /**
    * Event that is fired when a container has been resized
    * You can register this event with myTerminal.eventContainerResized.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventContainerResized
    */
   this.eventContainerResized = new YAHOO.util.CustomEvent("eventContainerResized");
   
   this.render();
   
   this.initContainers();
   
   this.initWires();
   
   if(this.options.layerMap) { 
      new WireIt.LayerMap(this, this.options.layerMapOptions);
   }
   
};

WireIt.Layer.prototype = {

   /**
    * @method setOptions
    */
   setOptions: function(options) {
      /**
       * Configuration object of the layer
       * <ul>
       *   <li>className: CSS class name for the layer element (default 'WireIt-Layer')</li>
       *   <li>parentEl: DOM element that schould contain the layer (default document.body)</li>
       *   <li>containers: array of container configuration objects</li>  
       *   <li>wires: array of wire configuration objects</li>
       *   <li>layerMap: boolean</li>
       *   <li>layerMapOptions: layer map options</li>
       * </ul>
       * @property options
       */
      this.options = {};
      this.options.className = options.className || 'WireIt-Layer';
      this.options.parentEl = options.parentEl || document.body;
      this.options.containers = options.containers || [];
      this.options.wires = options.wires || [];
      this.options.layerMap = YAHOO.lang.isUndefined(options.layerMap) ? false : options.layerMap;
      this.options.layerMapOptions = options.layerMapOptions;
      this.options.enableMouseEvents = YAHOO.lang.isUndefined(options.enableMouseEvents) ? true : options.enableMouseEvents;
   },

   /**
    * Create the dom of the layer and insert it into the parent element
    * @method render
    */
   render: function() {
   
      this.el = WireIt.cn('div', {className: this.options.className} );
   
      this.options.parentEl.appendChild(this.el);
   },


   /**
    * Create all the containers passed as options
    * @method initContainers
    */
   initContainers: function() {
      for(var i = 0 ; i < this.options.containers.length ; i++) {
         this.addContainer(this.options.containers[i]);
      } 
   },

   /**
    * Create all the wires passed in the config
    * @method initWires
    */
   initWires: function() {
      for(var i = 0 ; i < this.options.wires.length ; i++) {
         this.addWire(this.options.wires[i]);
      }
   },

   /**
    * Instanciate a wire given its "xtype" (default to WireIt.Wire)
    * @method addWire
    * @param {Object} wireConfig  Wire configuration object (see WireIt.Wire class for details)
    * @return {WireIt.Wire} Wire instance build from the xtype
    */
   addWire: function(wireConfig) {
      var type = eval(wireConfig.xtype || "WireIt.Wire");
   
      var src = wireConfig.src;
      var tgt = wireConfig.tgt;
   
      var terminal1 = this.containers[src.moduleId].getTerminal(src.terminal);
      var terminal2 = this.containers[tgt.moduleId].getTerminal(tgt.terminal);
      var wire = new type( terminal1, terminal2, this.el, wireConfig);
      wire.redraw();
   
      return wire;
   },

   /**
    * Instanciate a container given its "xtype": WireIt.Container (default) or a subclass of it.
    * @method addContainer
    * @param {Object} containerConfig  Container configuration object (see WireIt.Container class for details)
    * @return {WireIt.Container} Container instance build from the xtype
    */
   addContainer: function(containerConfig) {
   
      var type = eval('('+(containerConfig.xtype || "WireIt.Container")+')');
      if(!YAHOO.lang.isFunction(type)) {
         throw new Error("WireIt layer unable to add container: xtype '"+containerConfig.xtype+"' not found");
      }
      var container = new type(containerConfig, this);
   
      this.containers.push( container );
   
      // Event listeners
      container.eventAddWire.subscribe(this.onAddWire, this, true);
      container.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
   
      if(container.ddResize) {
         container.ddResize.on('endDragEvent', function() {
            this.eventContainerResized.fire(container);
				this.eventChanged.fire(this);
         }, this, true);
      }
      if(container.dd) {
         container.dd.on('endDragEvent', function() {
            this.eventContainerDragged.fire(container);
				this.eventChanged.fire(this);
         }, this, true);
      }
   
      this.eventAddContainer.fire(container);

		this.eventChanged.fire(this);
   
      return container;
   },

   /**
    * Remove a container
    * @method removeContainer
    * @param {WireIt.Container} container Container instance to remove
    */
   removeContainer: function(container) {
      var index = WireIt.indexOf(container, this.containers);
      if( index != -1 ) {
         container.remove();
         this.containers[index] = null;
         this.containers = WireIt.compact(this.containers);
      
         this.eventRemoveContainer.fire(container);

			this.eventChanged.fire(this);
      }
   },

   /**
    * Update the wire list when any of the containers fired the eventAddWire
    * @method onAddWire
    * @param {Event} event The eventAddWire event fired by the container
    * @param {Array} args This array contains a single element args[0] which is the added Wire instance
    */
   onAddWire: function(event, args) {
      var wire = args[0];
      // add the wire to the list if it isn't in
      if( WireIt.indexOf(wire, this.wires) == -1 ) {
         this.wires.push(wire);
         
         if(this.options.enableMouseEvents) {
            YAHOO.util.Event.addListener(wire.element, "mousemove", this.onWireMouseMove, this, true);
            YAHOO.util.Event.addListener(wire.element, "click", this.onWireClick, this, true);
         }
         
         // Re-Fire an event at the layer level
         this.eventAddWire.fire(wire);

			// Fire the layer changed event
			this.eventChanged.fire(this);
      }
   },

   /**
    * Update the wire list when a wire is removed
    * @method onRemoveWire
    * @param {Event} event The eventRemoveWire event fired by the container
    * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
    */
   onRemoveWire: function(event, args) {
      var wire = args[0];
      var index = WireIt.indexOf(wire, this.wires);
      if( index != -1 ) {
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
         this.eventRemoveWire.fire(wire);
			this.eventChanged.fire(this);
      }
   },


   /**
    * Remove all the containers in this layer (and the associated terminals and wires)
    * @method clear
    */
   clear: function() {
		while(this.containers.length > 0) {
         this.removeContainer(this.containers[0]);
      }
   },

   /**
    * Alias for clear
    * @deprecated
    * @method removeAllContainers
    */
   removeAllContainers: function() {
      this.clear();
   },


   /**
    * Return an object that represent the state of the layer including the containers and the wires
    * @method getWiring
    * @return {Obj} layer configuration
    */
   getWiring: function() {
   
      var i;
      var obj = {containers: [], wires: []};
   
      for( i = 0 ; i < this.containers.length ; i++) {
         obj.containers.push( this.containers[i].getConfig() );
      }
   
      for( i = 0 ; i < this.wires.length ; i++) {
         var wire = this.wires[i];
      
         var wireObj = { 
            src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.containers), terminal: wire.terminal1.name }, 
            tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.containers), terminal: wire.terminal2.name }
         };
         obj.wires.push(wireObj);
      }
   
      return obj;
   },

   /**
    * Load a layer configuration object
    * @method setWiring
    * @param {Object} wiring layer configuration
    */
   setWiring: function(wiring) {
      this.clear();
      
      if(YAHOO.lang.isArray(wiring.containers)) {
         for(var i = 0 ; i < wiring.containers.length ; i++) {
            this.addContainer(wiring.containers[i]);
         }
      }
      if(YAHOO.lang.isArray(wiring.wires)) {
         for(var i = 0 ; i < wiring.wires.length ; i++) {
            this.addWire(wiring.wires[i]);
         }
       }
   },
   
   /**
    * Returns a position relative to the layer from a mouse event
    * @method _getMouseEvtPos
    * @param {Event} e Mouse event
    * @return {Array} position
    */
   _getMouseEvtPos: function(e) {
   	var tgt = YAHOO.util.Event.getTarget(e);
   	var tgtPos = [tgt.offsetLeft, tgt.offsetTop];
   	return [tgtPos[0]+e.layerX, tgtPos[1]+e.layerY];
   },

   /**
    * Handles click on any wire canvas
    * Note: we treat mouse events globally so that wires behind others can still receive the events
    * @method onWireClick
    * @param {Event} e Mouse click event
    */
   onWireClick: function(e) {
      var p = this._getMouseEvtPos(e);
   	var lx = p[0], ly = p[1], n = this.wires.length, w;
   	for(var i = 0 ; i < n ; i++) {
   	   w = this.wires[i];
      	var elx = w.element.offsetLeft, ely = w.element.offsetTop;
      	// Check if the mouse is within the canvas boundaries
   	   if( lx >= elx && lx < elx+w.element.width && ly >= ely && ly < ely+w.element.height ) {
   	      var rx = lx-elx, ry = ly-ely; // relative to the canvas
   			w.onClick(rx,ry);
   	   }
   	}
   },

   /**
    * Handles mousemove events on any wire canvas
    * Note: we treat mouse events globally so that wires behind others can still receive the events
    * @method onWireMouseMove
    * @param {Event} e Mouse click event
    */
   onWireMouseMove: function(e) {
      var p = this._getMouseEvtPos(e);
   	var lx = p[0], ly = p[1], n = this.wires.length, w;
   	for(var i = 0 ; i < n ; i++) {
   	   w = this.wires[i];
      	var elx = w.element.offsetLeft, ely = w.element.offsetTop;
      	// Check if the mouse is within the canvas boundaries
   	   if( lx >= elx && lx < elx+w.element.width && ly >= ely && ly < ely+w.element.height ) {
   	      var rx = lx-elx, ry = ly-ely; // relative to the canvas
   			w.onMouseMove(rx,ry);
   	   }
   	}
   },
   
   
   /**
    * Layer explosing animation
    * @method clearExplode
    */
   clearExplode: function(callback, bind) {

      var center = [ Math.floor(YAHOO.util.Dom.getViewportWidth()/2),
   		            Math.floor(YAHOO.util.Dom.getViewportHeight()/2)];
      var R = 1.2*Math.sqrt( Math.pow(center[0],2)+Math.pow(center[1],2));

      for(var i = 0 ; i < this.containers.length ; i++) {
          var left = parseInt(dbWire.layer.containers[i].el.style.left.substr(0,dbWire.layer.containers[i].el.style.left.length-2),10);
   	    var top = parseInt(dbWire.layer.containers[i].el.style.top.substr(0,dbWire.layer.containers[i].el.style.top.length-2),10);

   	    var d = Math.sqrt( Math.pow(left-center[0],2)+Math.pow(top-center[1],2) );

   	    var u = [ (left-center[0])/d, (top-center[1])/d];
   	    YAHOO.util.Dom.setStyle(this.containers[i].el, "opacity", "0.8");

   	    var myAnim = new WireIt.util.Anim(this.containers[i].terminals, this.containers[i].el, {
              left: { to: center[0]+R*u[0] },
              top: { to: center[1]+R*u[1] },
   	        opacity: { to: 0, by: 0.05},
   	        duration: 3
          });
          if(i == this.containers.length-1) {
             myAnim.onComplete.subscribe(function() { this.clear(); callback.call(bind);}, this, true); 
          }
   	    myAnim.animate();
      }

   }
   

};
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
      
      this.options.legend = options.legend; 
      this.options.collapsible = options.collapsible; 
      this.options.fields = options.fields;
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
	 * When creating wirable input fields, the field configuration (inputParams) must have a reference to the current container (this is used for positionning).
	 * For complex fields (like object or list), the reference is set recursively AFTER the field creation.
	 * @method setBackReferenceOnFieldOptionsRecursively
	 */
   setBackReferenceOnFieldOptionsRecursively: function(fieldArray) {
      for(var i = 0 ; i < fieldArray.length ; i++) {
    	  var inputParams = fieldArray[i].inputParams;
    	  inputParams.container = this;

    	  // Checking for group sub elements
    	  if(inputParams.fields && typeof inputParams.fields == 'object') {
    		  this.setBackReferenceOnFieldOptionsRecursively(inputParams.fields);
    	  }

    	  // Checking for list sub elements
    	  if(inputParams.elementType) {
    		  inputParams.elementType.inputParams.container = this;

    		  // Checking for group elements within list elements
    		  if(inputParams.elementType.inputParams.fields && typeof inputParams.elementType.inputParams.fields == 'object') {
    			  this.setBackReferenceOnFieldOptionsRecursively(inputParams.elementType.inputParams.fields);
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
(function() {

   var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;

/**
 * Widget to display a minimap on a layer
 * @class LayerMap
 * @namespace WireIt
 * @extends WireIt.CanvasElement
 * @constructor
 * @param {WireIt.Layer} layer the layer object it is attached to
 * @param {Obj} options configuration object
 */
WireIt.LayerMap = function(layer,options) {
   
   /**
    * @property layer
    */
   this.layer = layer;
   
   this.setOptions(options);
   
   // Create the canvas element
   WireIt.LayerMap.superclass.constructor.call(this, this.options.parentEl);
   
   // Set the className
   this.element.className = this.options.className;
   
   this.initEvents();
   
   this.draw();
};

YAHOO.lang.extend(WireIt.LayerMap, WireIt.CanvasElement, {
   
   /**
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) { 
      var options = options || {};
      /**
       * Options:
       * <ul>
       *    <li>parentEl: parent element (defaut layer.el)</li>
       *    <li>className: default to "WireIt-LayerMap"</li>
       *    <li>style: display style, default to "rgba(0, 0, 200, 0.5)"</li>
       *    <li>lineWidth: default 2</li>
       * </ul>
       * @property options
       */
      this.options = {};
      this.options.parentEl = Dom.get(options.parentEl || this.layer.el);
      this.options.className = options.className || "WireIt-LayerMap";
      this.options.style = options.style || "rgba(0, 0, 200, 0.5)";
      this.options.lineWidth = options.lineWidth || 2;
   },
   
   
   /**
    * Listen for various events that should redraw the layer map
    * @method initEvents
    */
   initEvents: function() {
      
      var layer = this.layer;
      
      Event.addListener(this.element, 'mousedown', this.onMouseDown, this, true);
      Event.addListener(this.element, 'mouseup', this.onMouseUp, this, true);
      Event.addListener(this.element, 'mousemove', this.onMouseMove, this, true);
      Event.addListener(this.element, 'mouseout', this.onMouseUp, this, true);
      
      layer.eventAddWire.subscribe(this.draw, this, true);
      layer.eventRemoveWire.subscribe(this.draw, this, true);
      layer.eventAddContainer.subscribe(this.draw, this, true);
      layer.eventRemoveContainer.subscribe(this.draw, this, true);
      layer.eventContainerDragged.subscribe(this.draw, this, true);
      layer.eventContainerResized.subscribe(this.draw, this, true);

      Event.addListener(this.layer.el, "scroll", this.onLayerScroll, this, true);
   },
   
   /**
    * When a mouse move is received
    * @method onMouseMove
    * @param {Event} e Original event
    * @param {Array} args event parameters
    */
   onMouseMove: function(e, args) { 
      Event.stopEvent(e);
      if(this.isMouseDown) 
         this.scrollLayer(e.clientX,e.clientY);
   },   
   
   /**
    * When a mouseup or mouseout is received
    * @method onMouseUp
    * @param {Event} e Original event
    * @param {Array} args event parameters
    */
   onMouseUp: function(e, args) {
      Event.stopEvent(e);
      this.isMouseDown = false;
   },
   
   /**
    * When a mouse down is received
    * @method onMouseDown
    * @param {Event} e Original event
    * @param {Array} args event parameters
    */
   onMouseDown: function(e, args) {
      Event.stopEvent(e);
      this.scrollLayer(e.clientX,e.clientY);
      this.isMouseDown = true;
   },
   
   /**
    * Scroll the layer from mousedown/mousemove
    * @method scrollLayer
    * @param {Integer} clientX mouse event x coordinate
    * @param {Integer} clientY mouse event y coordinate
    */
   scrollLayer: function(clientX, clientY) {
      
      var canvasPos = Dom.getXY(this.element);
      var click = [ clientX-canvasPos[0], clientY-canvasPos[1] ];
      
      // Canvas Region
      var canvasRegion = Dom.getRegion(this.element);
      var canvasWidth = canvasRegion.right-canvasRegion.left-4;
      var canvasHeight = canvasRegion.bottom-canvasRegion.top-4;
      
      // Calculate ratio
      var layerWidth = this.layer.el.scrollWidth;
      var layerHeight = this.layer.el.scrollHeight;
      var hRatio = Math.floor(100*canvasWidth/layerWidth)/100;
      var vRatio = Math.floor(100*canvasHeight/layerHeight)/100;
      
      // Center position:
      var center = [ click[0]/hRatio, click[1]/vRatio ];
      
      // Region
      var region = Dom.getRegion(this.layer.el);
      var viewportWidth = region.right-region.left;
      var viewportHeight = region.bottom-region.top;
      
      // Calculate the scroll position of the layer
      var topleft = [ Math.max(Math.floor(center[0]-viewportWidth/2),0) ,  Math.max(Math.floor(center[1]-viewportHeight/2), 0) ];
      if( topleft[0]+viewportWidth > layerWidth ) {
         topleft[0] = layerWidth-viewportWidth;
      }
      if( topleft[1]+viewportHeight > layerHeight ) {
         topleft[1] = layerHeight-viewportHeight;
      }
     
      this.layer.el.scrollLeft = topleft[0];
      this.layer.el.scrollTop = topleft[1];
   
   },
   
   /**
    * Redraw after a timeout
    * @method onLayerScroll
    */
   onLayerScroll: function() {
      
      if(this.scrollTimer) { clearTimeout(this.scrollTimer); }
      var that = this;
      this.scrollTimer = setTimeout(function() {
         that.draw();
      },50);
      
   },
   
   /**
    * Redraw the layer map
    * @method draw
    */
   draw: function() {
      var ctxt=this.getContext();
      
      // Canvas Region
      var canvasRegion = Dom.getRegion(this.element);
      var canvasWidth = canvasRegion.right-canvasRegion.left-4;
      var canvasHeight = canvasRegion.bottom-canvasRegion.top-4;
      
      // Clear Rect
      ctxt.clearRect(0,0, canvasWidth, canvasHeight);
      
      // Calculate ratio
      var layerWidth = this.layer.el.scrollWidth;
      var layerHeight = this.layer.el.scrollHeight;
      var hRatio = Math.floor(100*canvasWidth/layerWidth)/100;
      var vRatio = Math.floor(100*canvasHeight/layerHeight)/100;

      // Draw the viewport
      var region = Dom.getRegion(this.layer.el);
      var viewportWidth = region.right-region.left;
      var viewportHeight = region.bottom-region.top;
      var viewportX = this.layer.el.scrollLeft;
      var viewportY = this.layer.el.scrollTop;
      ctxt.strokeStyle= "rgb(200, 50, 50)";
      ctxt.lineWidth=1;
      ctxt.strokeRect(viewportX*hRatio, viewportY*vRatio, viewportWidth*hRatio, viewportHeight*vRatio);
   
      // Draw containers and wires
      ctxt.fillStyle = this.options.style;
      ctxt.strokeStyle= this.options.style;
      ctxt.lineWidth=this.options.lineWidth;
      this.drawContainers(ctxt, hRatio, vRatio);
      this.drawWires(ctxt, hRatio, vRatio);
   },
   
   /**
    * Subroutine to draw the containers
    * @method drawContainers
    */
   drawContainers: function(ctxt, hRatio, vRatio) {
      var containers = this.layer.containers;
      var n = containers.length,i,gIS = WireIt.getIntStyle,containerEl;
      for(i = 0 ; i < n ; i++) {
         containerEl = containers[i].el;
         ctxt.fillRect(gIS(containerEl, "left")*hRatio, gIS(containerEl, "top")*vRatio, 
                       gIS(containerEl, "width")*hRatio, gIS(containerEl, "height")*vRatio);
      }
   },
   
   /**
    * Subroutine to draw the wires
    * @method drawWires
    */
   drawWires: function(ctxt, hRatio, vRatio) {
      var wires = this.layer.wires;
      var n = wires.length,i,wire;
      for(i = 0 ; i < n ; i++) {
         wire = wires[i];
         var pos1 = wire.terminal1.getXY(), 
             pos2 = wire.terminal2.getXY();

         // Stroked line
         // TODO:
         ctxt.beginPath();
         ctxt.moveTo(pos1[0]*hRatio,pos1[1]*vRatio);
         ctxt.lineTo(pos2[0]*hRatio,pos2[1]*vRatio);
         ctxt.closePath();
         ctxt.stroke();
      }
      
   }
   
   
});

})();(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;


/**
 * Module Proxy handle the drag/dropping from the module list to the layer (in the WiringEditor)
 * @class ModuleProxy
 * @constructor
 * @param {HTMLElement} el
 * @param {WireIt.WiringEditor} WiringEditor
 */
WireIt.ModuleProxy = function(el, WiringEditor) {
   
   this._WiringEditor = WiringEditor;
   
   // Init the DDProxy
   WireIt.ModuleProxy.superclass.constructor.call(this,el, "module", {
        dragElId: "moduleProxy"
    });
    
    this.isTarget = false; 
};
YAHOO.extend(WireIt.ModuleProxy,YAHOO.util.DDProxy, {
   
   /**
    * copy the html and apply selected classes
    * @method startDrag
    */
   startDrag: function(e) {
      WireIt.ModuleProxy.superclass.startDrag.call(this,e);
       var del = this.getDragEl(),
			  lel = this.getEl();
       del.innerHTML = lel.innerHTML;
       del.className = lel.className;
   },
   
   /**
    * Override default behavior of DDProxy
    * @method endDrag
    */
   endDrag: function(e) {},
    
   /**
    * Add the module to the WiringEditor on drop on layer
    * @method onDragDrop
    */
   onDragDrop: function(e, ddTargets) { 
      // The layer is the only target :
      var layerTarget = ddTargets[0],
			 layer = ddTargets[0]._layer,
			 del = this.getDragEl(),
			 pos = YAHOO.util.Dom.getXY(del),
			 layerPos = YAHOO.util.Dom.getXY(layer.el);
      this._WiringEditor.addModule( this._module ,[pos[0]-layerPos[0]+layer.el.scrollLeft, pos[1]-layerPos[1]+layer.el.scrollTop]);
    }
   
});


/**
 * The WiringEditor class provides a full page interface 
 * @class WiringEditor
 * @constructor
 * @param {Object} options
 */
WireIt.WiringEditor = function(options) {
	
	 /**
	  * Hash object to reference module definitions by their name
	  * @property modulesByName
	  * @type {Object}
	  */
    this.modulesByName = {};

    // set the default options
    this.setOptions(options);
    
    /**
     * Container DOM element
     * @property el
     */
    this.el = Dom.get(options.parentEl);
    
    /**
     * @property helpPanel
     * @type {YAHOO.widget.Panel}
     */
    this.helpPanel = new widget.Panel('helpPanel', {
        fixedcenter: true,
        draggable: true,
        visible: false,
        modal: true
     });
     this.helpPanel.render();
	
    
    /**
     * @property layout
     * @type {YAHOO.widget.Layout}
     */
    this.layout = new widget.Layout(this.el, this.options.layoutOptions);
    this.layout.render();

	 // Right accordion
    this.renderAccordion();

    /**
     * @property layer
     * @type {WireIt.Layer}
     */
    this.layer = new WireIt.Layer(this.options.layerOptions);
	 this.layer.eventChanged.subscribe(this.onLayerChanged, this, true);

	 /**
	  * @property leftEl
	  * @type {DOMElement}
	  */
    this.leftEl = Dom.get('left');

    // Render module list
    this.buildModulesList();

    // Render buttons
    this.renderButtons();

 	 // Saved status
	 this.renderSavedStatus();

    // Properties Form
    this.renderPropertiesForm();

	 // LoadWirings
	 if( this.adapter.init && YAHOO.lang.isFunction(this.adapter.init) ) {
			this.adapter.init();
 	 }
	 this.load();
};

WireIt.WiringEditor.prototype = {

 /**
  * @method setOptions
  * @param {Object} options
  */
 setOptions: function(options) {
    
    /**
     * @property options
     * @type {Object}
     */
    this.options = {};
    
    // Load the modules from options
    this.modules = options.modules || [];
    for(var i = 0 ; i < this.modules.length ; i++) {
       var m = this.modules[i];
       this.modulesByName[m.name] = m;
    }

	 this.adapter = options.adapter || WireIt.WiringEditor.adapters.JsonRpc;
     
    this.options.languageName = options.languageName || 'anonymousLanguage';
    
    this.options.propertiesFields = options.propertiesFields || [
		{"type": "string", inputParams: {"name": "name", label: "Title", typeInvite: "Enter a title" } },
		{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30, rows: 4} }
	 ];
    
    this.options.layoutOptions = options.layoutOptions || {
	 	units: [
	   	{ position: 'top', height: 50, body: 'top'},
	      { position: 'left', width: 200, resize: true, body: 'left', gutter: '5px', collapse: true, 
	        collapseSize: 25, header: 'Modules', scroll: true, animate: true },
	      { position: 'center', body: 'center', gutter: '5px' },
	      { position: 'right', width: 320, resize: true, body: 'right', gutter: '5px', collapse: true, 
	        collapseSize: 25, /*header: 'Properties', scroll: true,*/ animate: true }
	   ]
	};
     
    this.options.layerOptions = {};
    var layerOptions = options.layerOptions || {};
    this.options.layerOptions.parentEl = layerOptions.parentEl ? layerOptions.parentEl : Dom.get('center');
    this.options.layerOptions.layerMap = YAHOO.lang.isUndefined(layerOptions.layerMap) ? true : layerOptions.layerMap;
    this.options.layerOptions.layerMapOptions = layerOptions.layerMapOptions || { parentEl: 'layerMap' };

	 this.options.accordionViewParams = options.accordionViewParams || {
												collapsible: true, 
												expandable: true, // remove this parameter to open only one panel at a time
												width: '308px', 
												expandItem: 0, 
												animationSpeed: '0.3', 
												animate: true, 
												effect: YAHOO.util.Easing.easeBothStrong
											};
 },

	
	/**
	 * Render the accordion using yui-accordion
  	 */
	renderAccordion: function() {
		this.accordionView = new YAHOO.widget.AccordionView('accordionView', this.options.accordionViewParams);
	},
 
 /**
  * Render the properties form
  * @method renderPropertiesForm
  */
 renderPropertiesForm: function() {
    this.propertiesForm = new inputEx.Group({
       parentEl: YAHOO.util.Dom.get('propertiesForm'),
       fields: this.options.propertiesFields
    });

	this.propertiesForm.updatedEvt.subscribe(function() {
		this.markUnsaved();
	}, this, true);
 },
 
 /**
  * Build the left menu on the left
  * @method buildModulesList
  */
 buildModulesList: function() {

     var modules = this.modules;
     for(var i = 0 ; i < modules.length ; i++) {
		  this.addModuleToList(modules[i]);
     }

     // Make the layer a drag drop target
     if(!this.ddTarget) {
       this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");
       this.ddTarget._layer = this.layer;
     }
     
 },

 /**
  * Add a module definition to the left list
  */
 addModuleToList: function(module) {
	
		var div = WireIt.cn('div', {className: "WiringEditor-module"});
      if(module.container.icon) {
         div.appendChild( WireIt.cn('img',{src: module.container.icon}) );
      }
      div.appendChild( WireIt.cn('span', null, null, module.name) );

      var ddProxy = new WireIt.ModuleProxy(div, this);
      ddProxy._module = module;

      this.leftEl.appendChild(div);
 },
 
 /**
  * add a module at the given pos
  */
 addModule: function(module, pos) {
    try {
       var containerConfig = module.container;
       containerConfig.position = pos;
       containerConfig.title = module.name;
       var container = this.layer.addContainer(containerConfig);
       Dom.addClass(container.el, "WiringEditor-module-"+module.name);
    }
    catch(ex) {
       this.alert("Error Layer.addContainer: "+ ex.message);
    }    
 },

 /**
  * Toolbar
  * @method renderButtons
  */
 renderButtons: function() {
    var toolbar = Dom.get('toolbar');
    // Buttons :
    var newButton = new widget.Button({ label:"New", id:"WiringEditor-newButton", container: toolbar });
    newButton.on("click", this.onNew, this, true);

    var loadButton = new widget.Button({ label:"Load", id:"WiringEditor-loadButton", container: toolbar });
    loadButton.on("click", this.load, this, true);

    var saveButton = new widget.Button({ label:"Save", id:"WiringEditor-saveButton", container: toolbar });
    saveButton.on("click", this.onSave, this, true);

    var deleteButton = new widget.Button({ label:"Delete", id:"WiringEditor-deleteButton", container: toolbar });
    deleteButton.on("click", this.onDelete, this, true);

    var helpButton = new widget.Button({ label:"Help", id:"WiringEditor-helpButton", container: toolbar });
    helpButton.on("click", this.onHelp, this, true);
 },

	/**
	 * @method renderSavedStatus
	 */
	renderSavedStatus: function() {
		var top = Dom.get('top');
		this.savedStatusEl = WireIt.cn('div', {className: 'savedStatus', title: 'Not saved'}, {display: 'none'}, "*");
		top.appendChild(this.savedStatusEl);
	},

 /**
  * save the current module
  * @method saveModule
  */
 saveModule: function() {
    
    var value = this.getValue();
    
    if(value.name === "") {
       this.alert("Please choose a name");
       return;
    }

	this.tempSavedWiring = {name: value.name, working: JSON.stringify(value.working), language: this.options.languageName };
                
    this.adapter.saveWiring(this.tempSavedWiring, {
       success: this.saveModuleSuccess,
       failure: this.saveModuleFailure,
       scope: this
    });

 },

 /**
  * saveModule success callback
  * @method saveModuleSuccess
  */
 saveModuleSuccess: function(o) {

	this.markSaved();

   this.alert("Saved !");

	// TODO:
	/*var name = this.tempSavedWiring.name;	
	if(this.modulesByName.hasOwnProperty(name) ) {
		//already exists
	}
	else {
		//new one
	}*/
	
 },

 /**
  * saveModule failure callback
  * @method saveModuleFailure
  */
 saveModuleFailure: function(errorStr) {
    this.alert("Unable to save the wiring : "+errorStr);
 },

	alert: function(txt) {
		if(!this.alertPanel){ this.renderAlertPanel(); }
		Dom.get('alertPanelBody').innerHTML = txt;
		this.alertPanel.show();
	},

 /**
  * Create a help panel
  * @method onHelp
  */
 onHelp: function() {
    this.helpPanel.show();
 },

 /**
  * @method onNew
  */
 onNew: function() {
	
	if(!this.isSaved()) {
		if( !confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.") ) {
			return;
		}
	}
	
	this.preventLayerChangedEvent = true;
	
   this.layer.clear(); 

   this.propertiesForm.clear(false); // false to tell inputEx to NOT send the updatedEvt

	this.markSaved();

	this.preventLayerChangedEvent = false;
 },

 /**
  * @method onDelete
  */
 onDelete: function() {
    if( confirm("Are you sure you want to delete this wiring ?") ) {
       
      var value = this.getValue();
 		this.adapter.deleteWiring({name: value.name, language: this.options.languageName},{
 			success: function(result) {
				this.onNew();
 				this.alert("Deleted !");
 			},
			failure: function(errorStr) {
				this.alert("Unable to delete wiring: "+errorStr);
			},
			scope: this
 		});
       
    }
 },

 /**
  * @method onSave
  */
 onSave: function() {
    this.saveModule();
 },

 /**
  * @method renderLoadPanel
  */
 renderLoadPanel: function() {
    if( !this.loadPanel) {
       this.loadPanel = new widget.Panel('WiringEditor-loadPanel', {
          fixedcenter: true,
          draggable: true,
          width: '500px',
          visible: false,
          modal: true
       });
       this.loadPanel.setHeader("Select the wiring to load");
       this.loadPanel.setBody("Filter: <input type='text' id='loadFilter' /><div id='loadPanelBody'></div>");
       this.loadPanel.render(document.body);

		// Listen the keyup event to filter the module list
		Event.onAvailable('loadFilter', function() {
			Event.addListener('loadFilter', "keyup", this.inputFilterTimer, this, true);
		}, this, true);

    }
 },

	/**
	 * Method called from each keyup on the search filter in load panel.
	 * The real filtering occurs only after 500ms so that the filter process isn't called too often
	 */
	inputFilterTimer: function() {
		if(this.inputFilterTimeout) {
			clearTimeout(this.inputFilterTimeout);
			this.inputFilterTimeout = null;
		}
		var that = this;
		this.inputFilterTimeout = setTimeout(function() {
				that.updateLoadPanelList(Dom.get('loadFilter').value);
		}, 500);
	},


 /**
  * @method updateLoadPanelList
  */
 updateLoadPanelList: function(filter) {
	
    var list = WireIt.cn("ul");
    if(lang.isArray(this.pipes)) {
       for(var i = 0 ; i < this.pipes.length ; i++) {
          var module = this.pipes[i];
          this.pipesByName[module.name] = module;
          if(!filter || filter === "" || module.name.match(new RegExp(filter,"i")) ) {
	          list.appendChild( WireIt.cn('li',null,{cursor: 'pointer'},module.name) );
			}
       }
    }
    var panelBody = Dom.get('loadPanelBody');
    panelBody.innerHTML = "";
    panelBody.appendChild(list);

    Event.addListener(list, 'click', function(e,args) {
    	this.loadPipe(Event.getTarget(e).innerHTML);
    }, this, true);

 },

 /**
  * @method load
  */
 load: function() {
    
    this.adapter.listWirings({language: this.options.languageName},{
			success: function(result) {
				this.onLoadSuccess(result);
			},
			failure: function(errorStr) {
				this.alert("Unable to load the wirings: "+errorStr);
			},
			scope: this
		}
		);

 },

 /**
  * @method onLoadSuccess
  */
 onLoadSuccess: function(wirings) {
		this.pipes = wirings;
		this.pipesByName = {};
		
		this.renderLoadPanel();
    	this.updateLoadPanelList();

		if(!this.afterFirstRun) {
			var p = window.location.search.substr(1).split('&');
			var oP = {};
			for(var i = 0 ; i < p.length ; i++) {
				var v = p[i].split('=');
				oP[v[0]]=window.decodeURIComponent(v[1]);
			}
			this.afterFirstRun = true;
			if(oP.autoload) {
				this.loadPipe(oP.autoload);
				return;
			}
		}

    this.loadPanel.show();
	},

 /**
  * @method getPipeByName
  * @param {String} name Pipe's name
  * @return {Object} return the evaled json pipe configuration
  */
 getPipeByName: function(name) {
    var n = this.pipes.length,ret;
    for(var i = 0 ; i < n ; i++) {
       if(this.pipes[i].name == name) {
          // Try to eval working property:
          try {
             ret = JSON.parse(this.pipes[i].working);
             return ret;
          }
          catch(ex) {
             this.alert("Unable to eval working json for module "+name);
             return null;
          }
       }
    }
    
    return null;
 },
 
 /**
  * @method loadPipe
  * @param {String} name Pipe name
  */
 loadPipe: function(name) {
	
	if(!this.isSaved()) {
		if( !confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.") ) {
			return;
		}
	}
	
	try {
	
		this.preventLayerChangedEvent = true;
	
     this.loadPanel.hide();
	
    var wiring = this.getPipeByName(name), i;

	 if(!wiring) {
		this.alert("The wiring '"+name+"' was not found.");
		return;
  	 }
    
    // TODO: check if current wiring is saved...
    this.layer.clear();
    
    this.propertiesForm.setValue(wiring.properties, false); // the false tells inputEx to NOT fire the updatedEvt
    
    if(lang.isArray(wiring.modules)) {
      
       // Containers
       for(i = 0 ; i < wiring.modules.length ; i++) {
          var m = wiring.modules[i];
          if(this.modulesByName[m.name]) {
             var baseContainerConfig = this.modulesByName[m.name].container;
             YAHOO.lang.augmentObject(m.config, baseContainerConfig); 
             m.config.title = m.name;
             var container = this.layer.addContainer(m.config);
             Dom.addClass(container.el, "WiringEditor-module-"+m.name);
             container.setValue(m.value);
          }
          else {
             throw new Error("WiringEditor: module '"+m.name+"' not found !");
          }
       }
       
       // Wires
       if(lang.isArray(wiring.wires)) {
           for(i = 0 ; i < wiring.wires.length ; i++) {
              // On doit chercher dans la liste des terminaux de chacun des modules l'index des terminaux...
              this.layer.addWire(wiring.wires[i]);
           }
        }
     }
     
	this.markSaved();
	
	this.preventLayerChangedEvent = false;
	
  	}
  	catch(ex) {
     	this.alert(ex);
  	}
 },

 	renderAlertPanel: function() {
		
 	 /**
     * @property alertPanel
     * @type {YAHOO.widget.Panel}
     */
		this.alertPanel = new widget.Panel('WiringEditor-alertPanel', {
         fixedcenter: true,
         draggable: true,
         width: '500px',
         visible: false,
         modal: true
      });
      this.alertPanel.setHeader("Message");
      this.alertPanel.setBody("<div id='alertPanelBody'></div><button id='alertPanelButton'>Ok</button>");
      this.alertPanel.render(document.body);
		Event.addListener('alertPanelButton','click', function() {
			this.alertPanel.hide();
		}, this, true);
	},

	onLayerChanged: function() {
		if(!this.preventLayerChangedEvent) {
			this.markUnsaved();
		}
	},

	markSaved: function() {
		this.savedStatusEl.style.display = 'none';
	},
	
	markUnsaved: function() {
		this.savedStatusEl.style.display = '';
	},

	isSaved: function() {
		return (this.savedStatusEl.style.display == 'none');
	},
 
 /**
  * This method return a wiring within the given vocabulary described by the modules list
  * @method getValue
  */
 getValue: function() {
    
   var i;
   var obj = {modules: [], wires: [], properties: null};

   for( i = 0 ; i < this.layer.containers.length ; i++) {
      obj.modules.push( {name: this.layer.containers[i].options.title, value: this.layer.containers[i].getValue(), config: this.layer.containers[i].getConfig()});
   }

   for( i = 0 ; i < this.layer.wires.length ; i++) {
      var wire = this.layer.wires[i];

      var wireObj = { 
         src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.layer.containers), terminal: wire.terminal1.options.name}, 
         tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.layer.containers), terminal: wire.terminal2.options.name}
      };
      obj.wires.push(wireObj);
   }
   
   obj.properties = this.propertiesForm.getValue();
    
   return {
      name: obj.properties.name,
      working: obj
   };
 }


};


/**
 * WiringEditor Adapters
 * @static
 */
WireIt.WiringEditor.adapters = {};


})();
   /**
 * Container represented by an image
 * @class ImageContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.ImageContainer = function(options, layer) {
   WireIt.ImageContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.ImageContainer, WireIt.Container, {
   
   /**
    * @method setOptions
    * @param {Object} options the options object
    */
   setOptions: function(options) {
      WireIt.ImageContainer.superclass.setOptions.call(this, options);
      
      this.options.image = options.image;
      this.options.xtype = "WireIt.ImageContainer";
      
      this.options.className = options.className || "WireIt-Container WireIt-ImageContainer";
      
      // Overwrite default value for options:
      this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;
      this.options.ddHandle = (typeof options.ddHandle == "undefined") ? false : options.ddHandle;
   },
   
   /**
    * @method render
    */
   render: function() {
      WireIt.ImageContainer.superclass.render.call(this);
      YAHOO.util.Dom.setStyle(this.bodyEl, "background-image", "url("+this.options.image+")");
   }
   
});/**
 * Container with left inputs and right outputs
 * @class InOutContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.InOutContainer = function(options, layer) {
   WireIt.InOutContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.InOutContainer, WireIt.Container, {
   
   /**
    * @method setOptions
    * @param {Object} options the options object
    */
   setOptions: function(options) {
      WireIt.InOutContainer.superclass.setOptions.call(this, options);
      
      this.options.xtype = "WireIt.InOutContainer";
      
      this.options.className = options.className || "WireIt-Container WireIt-InOutContainer";
      
      // Overwrite default value for options:
      this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;

		this.options.inputs = options.inputs || [];
		this.options.outputs = options.outputs || [];

   },
   
   render: function() {
      WireIt.InOutContainer.superclass.render.call(this);

		for(var i = 0 ; i < this.options.inputs.length ; i++) {
			var input = this.options.inputs[i];
			this.options.terminals.push({
				"name": input, 
				"direction": [-1,0], 
				"offsetPosition": {"left": -14, "top": 3+30*(i+1) }, 
				"ddConfig": {
             	"type": "input",
             	"allowedTypes": ["output"]
          	}
 			});
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px"}, input));
		}
		
		for(i = 0 ; i < this.options.outputs.length ; i++) {
			var output = this.options.outputs[i];
			this.options.terminals.push({
				"name": output, 
				"direction": [1,0], 
				"offsetPosition": {"right": -14, "top": 3+30*(i+1+this.options.inputs.length) }, 
				"ddConfig": {
             "type": "output",
             "allowedTypes": ["input"]
          	},
				"alwaysSrc": true
			});
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px", textAlign: "right"}, output));
		}
		
   }
   
});