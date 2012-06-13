/**
 * @module inputex-string
 */
YUI.add("inputex-string", function(Y){
   
   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * Basic string field (equivalent to the input type "text")
 * @class inputEx.StringField
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

Y.extend(inputEx.StringField, inputEx.Field, {
   /**
    * Set the default values of the options
    * @param {Object} options Options object as passed to the constructor
    */
	setOptions: function(options) {
	   inputEx.StringField.superclass.setOptions.call(this, options);

	   this.options.regexp = options.regexp;
	   this.options.size = options.size;
	   this.options.maxLength = options.maxLength;
	   this.options.minLength = options.minLength;
	   this.options.typeInvite = options.typeInvite;
	   this.options.readonly = options.readonly;
	   this.options.autocomplete = lang.isUndefined(options.autocomplete) ?
	                                  inputEx.browserAutocomplete :
	                                  (options.autocomplete === false || options.autocomplete === "off") ? false : true;
	   this.options.trim = (options.trim === true) ? true : false;
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
      attributes.id = this.divEl.id?this.divEl.id+'-field':Y.guid();
      if(this.options.size) { attributes.size = this.options.size; }
      if(this.options.name) { attributes.name = this.options.name; }
      if(this.options.readonly) { attributes.readonly = 'readonly'; }

      if(this.options.maxLength) { attributes.maxLength = this.options.maxLength; }
      attributes.autocomplete = this.options.autocomplete ? 'on' : 'off';

      // Create the node
      this.el = inputEx.cn('input', attributes);

      // Append it to the main element
      this.wrapEl.appendChild(this.el);
      this.fieldContainer.appendChild(this.wrapEl);
   },

	/**
	 * Set the name of the field (or hidden field)
	 */
	setFieldName: function(name) {
		this.el.name = name;
	},

   /**
    * Register the change, focus and blur events
    */
   initEvents: function() {
     Y.on("change", this.onChange,this.el, this);

       if (Y.UA.ie > 0){ // refer to inputEx-95
            var field = this.el;
            Y.on("key", function(e){
              field.blur();
              field.focus();
            }, this.el,'down:13', this);
       }

     Y.on("focus", this.onFocus,this.el, this);
     Y.on("blur", this.onBlur,this.el, this);
     // bug to scope event handlers in this context
     var that = this;
     Y.on("key", function(e,scope){ that.onKeyPress.call(that,e); },this.el, "press",this);
     Y.on("key", function(e,scope){ that.onKeyUp.call(that,e); },this.el, 'up',this);
   },

   /**
    * Return the string value
    * @param {String} The string value
    */
   getValue: function() {
      
      var value;
      
      value = (this.options.typeInvite && this.el.value == this.options.typeInvite) ? '' : this.el.value;
      
      if (this.options.trim) {
         value = lang.trim(value);
      }
      
	   return value;
   },

   /**
    * Function to set the value
    * @param {String} value The new value
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
		// + check : if Null or Undefined we put '' in the stringField
		this.el.value = ( lang.isNull(value) || lang.isUndefined(value) ) ? '' : value;

      // call parent class method to set style and fire "updated" event
      inputEx.StringField.superclass.setValue.call(this, value, sendUpdatedEvt);
   },

   /**
    * Uses the optional regexp to validate the field value
    */
   validate: function() {
      var val = this.getValue();

      // empty field
      if (val === '') {
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
    * Check if the field is disabled
    */
   isDisabled: function() {
      return this.el.disabled;
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
      if (!Y.one(this.divEl).hasClass( "inputEx-focused")) {

         // show type invite if field is empty
         if(this.isEmpty()) {
	         Y.one(this.divEl).addClass( "inputEx-typeInvite");
	         this.el.value = this.options.typeInvite;

	      // important for setValue to work with typeInvite
         } else {
            Y.one(this.divEl).removeClass("inputEx-typeInvite");
         }

      // field focused : remove type invite
      } else {
	      if(Y.one(this.divEl).hasClass("inputEx-typeInvite")) {
	         // remove text
	         this.el.value = "";

	         // remove the "empty" state and class
	         this.previousState = null;
	         Y.one(this.divEl).removeClass("inputEx-typeInvite");
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




// Register this class as "string" type
inputEx.registerType("string", inputEx.StringField, [
    { type: 'string', label: 'Type invite', name: 'typeInvite', value: ''},
    { type: 'integer', label: 'Size', name: 'size', value: 20},
    { type: 'integer', label: 'Min. length', name: 'minLength', value: 0}
]);

}, '3.0.0a',{
  requires: ["inputex-field","event-key"]
});
