/**
 * Provides the base "field" abstract class
 * @module inputex-field
 */
YUI.add("inputex-field",function(Y) {
 
     var lang = Y.Lang,
          inputEx = Y.inputEx;

  /** 
   * An abstract class (never instantiated) that contains the shared features for all fields.
   * @class inputEx.Field
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
	
	  // Set the default values of the options
	  this.setOptions(options || {});
	
	  // Call the render of the dom
	  this.render();
	
	  /**
	   * Event fired after the user changed the value of the field.
	   * Fired when the field is "updated"<br /> subscribe with: myfield.on('updated', function(value) { console.log("updated",value); }, this, true);
	   * @event updated
	   * @param {Any} value The new value of the field
	   */
	  this.publish("updated");
          
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
	       // searching for the id
	       Y.one("#"+options.parentEl).appendChild(this.getEl());  
	     }
	     else {
	        options.parentEl.appendChild(this.getEl());
        }
	  }
  };

  inputEx.Field.prototype = {
    
     /**
      * Set the default values of the options
      * @method setOptions
      * @param {Object} options Options object as passed to the constructor
      */
     setOptions: function(options) {
        
        // Configuration object to set the options for this class and the parent classes. See constructor details for options added by this class.
        this.options = {};
        
        // Basic options
        this.options.name = options.name;
        this.options.value = options.value;
        this.options.id = options.id || Y.guid();
        this.options.label = options.label;
        this.options.description = options.description;
        this.options.wrapperClassName = options.wrapperClassName;
        
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
	   * Set the name of the field (or hidden field)
	   * @method setFieldName
	   */
	  setFieldName: function(name) {
	  },

     /**
      * Default render of the dom element. Create a divEl that wraps the field.
      * @method render
      */
	  render: function() {
	
	     // Create a DIV element to wrap the editing el and the image
	     this.divEl = inputEx.cn('div', {className: this.options.wrapperClassName || 'inputEx-fieldWrapper'});
	     if(this.options.id) {
	        this.divEl.id = this.options.id;
	     }
	     if(this.options.required) {
	        Y.one(this.divEl).addClass("inputEx-required");
	     }
	     
	     // Label element
	     if (lang.isString(this.options.label)) {
          this.labelDiv = inputEx.cn('div', {id: this.divEl.id+'-label', className: 'inputEx-label'});
          this.labelEl = inputEx.cn('label', {'for': this.divEl.id+'-field'}, null, this.options.label === "" ? "&nbsp;" : this.options.label);
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
	   * @method fireUpdatedEvt
	   */
	  fireUpdatedEvt: function() {
        // Uses setTimeout to escape the stack (that originiated in an event)
        var that = this;
        setTimeout(function() {
           that.fire("updated",that.getValue(), that);
        },50);
	  },

     /**
      * Render the interface component into this.divEl
      * @method renderComponent
      */
	  renderComponent: function() {
        // override me
	  },

     /**
      * The default render creates a div to put in the messages
      * @method getEl
      * @return {HTMLElement} divEl The main DIV wrapper
      */
	  getEl: function() {
	     return this.divEl;
	  },

     /**
      * Initialize events of the Input
      * @method initEvents
      */
	  initEvents: function() {
        // override me
	  },

     /**
      * Return the value of the input
      * @method getValue
      * @return {Any} value of the field
      */
	  getValue: function() { 
	     // override me
	  },

     /**
      * Function to set the value
      * @method setValue
      * @param {Any} value The new value
      * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
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
      * Set the styles for valid/invalid state.  If a state is not provided, getState will be called.
      * @method setClassFromState
      * @param {String} One of the following states: 'empty', 'required', 'valid' or 'invalid'
      */
	  setClassFromState: function(state) {
		  var className;
	     // remove previous class
	     if( this.previousState ) {
	        // remove invalid className for both required and invalid fields
	        className = 'inputEx-'+((this.previousState == inputEx.stateRequired) ? inputEx.stateInvalid : this.previousState);
		     Y.one(this.divEl).removeClass(className);
	     }
	     
	     // add new class
	     state = state || this.getState();
	     if( !(state == inputEx.stateEmpty && Y.one(this.divEl).hasClass( 'inputEx-focused') ) ) {
	        // add invalid className for both required and invalid fields
	        className = 'inputEx-'+((state == inputEx.stateRequired) ? inputEx.stateInvalid : state);
	        Y.one(this.divEl).addClass(className );
        }
	
	     if(this.options.showMsg) {
	        this.displayMessage( this.getStateString(state) );
        }
	     
	     this.previousState = state;
	  },

     /**
      * Get the string for the given state
      * @method getStateString
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
      * @method getState
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
      * @method validate
      * @return {Boolean} field validation status (true/false)
      */
	  validate: function() {
        return true;
     },

     /**
      * Function called on the focus event
      * @method onFocus
      * @param {Event} e The original 'focus' event
      */
	  onFocus: function(e) {
	     var el = Y.one(this.getEl());
	     el.removeClass('inputEx-empty');
	     el.addClass('inputEx-focused');
	  },

     /**
      * Function called on the blur event
      * @method onBlur
      * @param {Event} e The original 'blur' event
      */
	  onBlur: function(e) {
	     Y.one(this.getEl()).removeClass('inputEx-focused');
	     
	     // Call setClassFromState on Blur
	     this.setClassFromState();
	  },

     /**
      * onChange event handler
      * @method onChange
      * @param {Event} e The original 'change' event
      */
	  onChange: function(e) {
        this.fireUpdatedEvt();
	  },

     /**
      * Close the field and eventually opened popups...
      * @method close
      */
	  close: function() {
	  },

     /**
      * Disable the field
      * @method disable
      */
	  disable: function() {
	  },

     /**
      * Enable the field
      * @method enable
      */
	  enable: function() {
	  },

     /**
      * Check if the field is diabled
      * @method isDisabled
      */
     isDisabled: function() {
        return false;
     },

     /**
      * Focus the field
      * @method focus
      */
     focus: function() {
     },
     
     /**
      * Purge all event listeners and remove the component from the dom
      * @method destroy
      */
     destroy: function() {
        var el = this.getEl();
        
        // Unsubscribe all listeners on the "updated" event
        //this.updatedEvt.unsubscribeAll();
        // no equivalent in YUI3 Event mechanism
        
        // Purge element (remove listeners on el and childNodes recursively)
        Y.Event.purgeElement(el, true);
        
        // Remove from DOM
        if(Y.one(el).inDoc()) {
           el.parentNode.removeChild(el);
        }
        
     },
     
     /**
      * Update the message 
      * @method displayMessage
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
      * @method show
      */
     show: function() {
        this.divEl.style.display = '';
     },
     
     /**
      * Hide the field
      * @method hide
      */
     hide: function() {
        this.divEl.style.display = 'none';
     },
     
     /**
      * Clear the field by setting the field value to this.options.value
      * @method clear
      * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the 'updated' event or not (default is true, pass false to NOT send the event)
      */
     clear: function(sendUpdatedEvt) {
        this.setValue(lang.isUndefined(this.options.value) ? '' : this.options.value, sendUpdatedEvt);
     },
     
     /**
      * Should return true if empty
      * @method isEmpty
      */
     isEmpty: function() {
        return this.getValue() === '';
     },

	  /**
	   * Set the parentField.
	   * Generally use by composable fields (ie. Group,Form,ListField,CombineField,...}
	   * @method setParentField
	   * @param {inputEx.Group|inputEx.Form|inputEx.ListField|inputEx.CombineField} parentField The parent field instance
	   */
	  setParentField: function(parentField) {
		  this.parentField = parentField;
	  },
	
	  /**
	   * Return the parent field instance
	   * @method getParentField
	   * @return {inputEx.Group|inputEx.Form|inputEx.ListField|inputEx.CombineField}
	   */
	  getParentField: function() {
		  return this.parentField;
	  }
     
  };

  Y.augment(inputEx.Field, Y.EventTarget, null, null, {});

  inputEx.Field.groupOptions = [
	  { type: "string", label: "Name", name: "name", value: '', required: true },
     { type: "string", label: "Label", name: "label", value: '' },
     { type: "string", label: "Description",name: "description", value: '' },
     { type: "boolean", label: "Required?",name: "required", value: false },
     { type: "boolean", label: "Show messages",name: "showMsg", value: false }
  ];

}, '3.1.0',{
  requires: ["inputex","event-custom"]
});
