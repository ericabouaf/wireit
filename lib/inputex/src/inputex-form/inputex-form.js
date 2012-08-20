/**
 * @module inputex-form
 */
YUI.add("inputex-form", function(Y){

  var lang = Y.Lang,
      inputEx = Y.inputEx;

/**
 * Create a group of fields within a FORM tag and adds buttons
 * @class inputEx.Form
 * @extends inputEx.Group
 * @constructor
 * @param {Object} options The following options are added for Forms:
 * <ul>
 *   <li>buttons: list of button definition objects {value: 'Click Me', type: 'submit'}</li>
 *   <li>ajax: send the form through an ajax request (submit button should be present): {method: 'POST', uri: 'myScript.php', callback: same as Y.io callback}</li>
 *   <li>showMask: adds a mask over the form while the request is running (default is false)</li>
 * </ul>
 */
inputEx.Form = function(options) {
   inputEx.Form.superclass.constructor.call(this, options);
};

Y.extend(inputEx.Form, inputEx.Group, {

   /**
    * Adds buttons and set ajax default parameters
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.Form.superclass.setOptions.call(this, options);

      this.buttons = [];

      this.options.buttons = options.buttons || [];

      this.options.action = options.action;
   	this.options.method = options.method;

		this.options.className =  options.className || 'inputEx-Group';
	   this.options.autocomplete = lang.isUndefined(options.autocomplete) ?
	                                  inputEx.browserAutocomplete :
	                                  (options.autocomplete === false || options.autocomplete === "off") ? false : true;
		
		this.options.enctype = options.enctype;

      if(options.ajax) {
         this.options.ajax = {};
         this.options.ajax.method = options.ajax.method || 'POST';
         this.options.ajax.uri = options.ajax.uri || 'default.php';
         this.options.ajax.callback = options.ajax.callback || {};
         this.options.ajax.callback.scope = (options.ajax.callback && options.ajax.callback.scope) || this;
         this.options.ajax.showMask = lang.isUndefined(options.ajax.showMask) ? false : options.ajax.showMask;

			this.options.ajax.contentType = options.ajax.contentType || "application/json";
			this.options.ajax.wrapObject = options.ajax.wrapObject;
      }
      
      if (lang.isFunction(options.onSubmit)) {
         this.options.onSubmit = options.onSubmit;
      }
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
   	  	   
  	   // Create the FORM element
      this.form = inputEx.cn('form', {method: this.options.method || 'POST', action: this.options.action || '', className: this.options.className || 'inputEx-Form'});
      this.divEl.appendChild(this.form);

		// set the enctype
		if(this.options.enctype) {
			this.form.setAttribute('enctype',this.options.enctype);
		}

	   // Set the autocomplete attribute to off to disable browser autocompletion
		this.form.setAttribute('autocomplete', this.options.autocomplete ? 'on' : 'off');
   	
      // Set the name of the form
      if(this.options.formName) { this.form.name = this.options.formName; }
  	   
  	   this.renderFields(this.form);

      this.renderButtons();
      
      if(this.options.disabled) {
  	      this.disable();
  	   }	  
   },


   /**
    * Render the buttons
    * @method renderButtons
    */
   renderButtons: function() {
       
      var buttonConf, button, i, buttonsNb = this.options.buttons.length;
      
      this.buttonDiv = inputEx.cn('div', {className: 'inputEx-Form-buttonBar'});

      for(i = 0 ; i < buttonsNb ; i++ ) {
         buttonConf = this.options.buttons[i];
   
         // Throw Error if button is undefined
         if(!buttonConf) {
            throw new Error("inputEx.Form: One of the provided button is undefined ! (check trailing comma)");
         }
         
         button = new inputEx.widget.Button(buttonConf);
         button.render(this.buttonDiv);
         
         this.buttons.push(button);
         
      }
      
      // useful for link buttons re-styling (float required on <a>'s ... )
      this.buttonDiv.appendChild(inputEx.cn('div',null,{clear:'both'}));
      
      this.form.appendChild(this.buttonDiv);
   },


   /**
    * Init the events
    * @method initEvents
    */
   initEvents: function() {
      
      var i, length;
      
      inputEx.Form.superclass.initEvents.call(this);
      
      
      // Custom event to normalize form submits
      this.publish("submit")
      
      //CustomEvent to provide additionnal features afterValidation
      this.publish("afterValidation")
      
      // Two ways to trigger the form submitEvent firing
      //
      //
      // 1. catch a 'submit' event on form (say a user pressed <Enter> in a field)
      //
      Y.on("submit",function(e) {
         
            // always stop event
            e.halt();
         
            // replace with custom event
            this.fire("submit");
         
      },this.form,this);
      
      
      //
      // 2. click on a 'submit' or 'submit-link' button
      //
         for(i=0, length=this.buttons.length; i<length; i++) {
            
            this.buttons[i].on("submit",function() { this.fire("submit"); }, this);
         
         }
      
      
      // When form submitEvent is fired, call onSubmit
      this.on("submit", this.options.onSubmit || this.onSubmit,this)
   },

   /**
    * Intercept the 'onsubmit' event and stop it if !validate
    * If the ajax option object is set, use YUI async Request to send the form
    * @method onSubmit
    * @param {Event} e The original onSubmit event
    */
   onSubmit: function(e) {
	   
      // do nothing if does not validate
	   if ( !this.validate() ) {
		   return; // no submit
	   }
	   this.fire("afterValidation");
	   
	   if(this.options.ajax) {
	      this.asyncRequest(); // send ajax request
	      return;
	   }
	   
	   // normal submit finally
	   // (won't fire a dom "submit" event, so no risk to loop)
	   this.form.submit();
   },

   /**
    * Send the form value in JSON through an ajax request
    * @method asyncRequest
    */
   asyncRequest: function() {

      if(this.options.ajax.showMask) { this.showMask(); }

      var formValue = this.getValue();

      // options.ajax.uri and options.ajax.method can also be functions that return a the uri/method depending of the value of the form
      var uri = lang.isFunction(this.options.ajax.uri) ? this.options.ajax.uri(formValue) : this.options.ajax.uri;
      var method = lang.isFunction(this.options.ajax.method) ? this.options.ajax.method(formValue) : this.options.ajax.method;

      var postData = null;
      
      var headers = {};

      // Classic application/x-www-form-urlencoded (like html forms)
      if(this.options.ajax.contentType == "application/x-www-form-urlencoded" && method != "PUT") {
         
         headers["Content-Type"] = "application/x-www-form-urlencoded";
         
        var params = [];
        for(var key in formValue) {
          if(formValue.hasOwnProperty(key)) {
            var pName = (this.options.ajax.wrapObject ? this.options.ajax.wrapObject+'[' : '')+key+(this.options.ajax.wrapObject ? ']' : '');
            params.push( pName+"="+window.encodeURIComponent(formValue[key]));
          }
        }
        postData = params.join('&');
      }
      // The only other contentType available is "application/json"
      else {
        headers["Content-Type"] = 'application/json';

        // method PUT don't send as x-www-form-urlencoded but in JSON
        if(method == "PUT") {
          var formVal = this.getValue();
          var p;
          if(this.options.ajax.wrapObject) {
            p = {};
            p[this.options.ajax.wrapObject] = formVal;
          }
          else {
            p = formVal;
          }
          postData = Y.JSON.stringify(p);
        }
        else {
          // We keep this case for backward compatibility, but should not be used
          // Used when we send in JSON in POST or GET
          postData = "value="+window.encodeURIComponent(Y.JSON.stringify(this.getValue()));
        }
      }
      var onSuccess = function() {
            if(this.options.ajax.showMask) { this.hideMask(); }
            if( lang.isFunction(this.options.ajax.callback.success) ) {
               this.options.ajax.callback.success.apply(this.options.ajax.callback.scope,arguments);
            }
      };
      var onFailure = function() {
            if(this.options.ajax.showMask) { this.hideMask(); }
            if( lang.isFunction(this.options.ajax.callback.failure) ) {
               this.options.ajax.callback.failure.apply(this.options.ajax.callback.scope,arguments);
            }
      };
      Y.io(uri,{
        method:method,
        data: postData,
        headers: headers,
        on : {
          success: onSuccess,
          failure: onFailure
        },
        context: this
      });
   },

   /**
    * Create a Mask over the form
    * @method renderMask
    */
   renderMask: function() {
      if(this.maskRendered) return;

      // position as "relative" to position formMask inside as "absolute"
      Y.one(this.divEl).setStyle( "position", "relative");

      // set zoom = 1 to fix hasLayout issue with IE6/7
      if (Y.UA.ie > 0) { Y.one(this.divEl).setStyle("zoom", 1); }

      // Render mask over the divEl
      this.formMask = inputEx.cn('div', {className: 'inputEx-Form-Mask'},
         {
            display: 'none',
            // Use offsetWidth instead of Dom.getStyle(this.divEl,"width") because
            // would return "auto" with IE instead of size in px
            width: this.divEl.offsetWidth+"px",
            height: this.divEl.offsetHeight+"px"
         },
         "<div class='inputEx-Form-Mask-bg'/><center><br/><div class='inputEx-Form-Mask-spinner'></div><br /><span>"+inputEx.messages.ajaxWait+"</span></div>");
      this.divEl.appendChild(this.formMask);
      this.maskRendered = true;
   },

   /**
    * Show the form mask
    * @method showMask
    */
   showMask: function() {
      this.renderMask();

      // Hide selects in IE 6
      this.toggleSelectsInIE(false);

      this.formMask.style.display = '';
   },

   /**
    * Hide the form mask
    * @method hideMask
    */
   hideMask: function() {

      // Show selects back in IE 6
      this.toggleSelectsInIE(true);

      this.formMask.style.display = 'none';
   },

   /**
    * Method to hide selects in IE 6 when masking the form (else they would appear over the mask)
    * @method toggleSelectsInIE
    */
   toggleSelectsInIE: function(show) {
      // IE 6 only
      if (!!Y.UA.ie && Y.UA.ie < 7) {
         var methodName = !!show ? "removeClass" : "addClass";
         var that = this;
         Y.one(this.divEl).all("select").each(function(e){
           e[methodName]("inputEx-hidden")
         });
      }
   },


   /**
    * Enable all fields and buttons in the form
    * @method enable
    */
   enable: function() {
      inputEx.Form.superclass.enable.call(this);
      
      for (var i = 0 ; i < this.buttons.length ; i++) {
 	      this.buttons[i].enable();
      }
   },

   /**
    * Disable all fields and buttons in the form
    * @method disable
    */
   disable: function() {
      inputEx.Form.superclass.disable.call(this);
      
      for (var i = 0 ; i < this.buttons.length ; i++) {
         this.buttons[i].disable();
      }
   },
   
   
   /**
    * Purge all event listeners and remove the component from the dom
    * @method destroy
    */
   destroy: function() {
      
      var i, length, button;
      
      // Unsubscribe all listeners to submit event
      Y.Event.purgeElement(this.form);
      
      // Recursively destroy buttons
      for (i = 0, length = this.buttons.length ; i < length ; i++) {
         button = this.buttons[i];
         button.destroy();
      }
      
      // destroy Form itself (+ inputs)
      inputEx.Form.superclass.destroy.call(this);
      
   }

});

// Register this class as "form" type
inputEx.registerType("form", inputEx.Form, [
   {  
      type: 'list', 
      label: 'Buttons', 
      name: 'buttons', 
      elementType: {
         type: 'group', 
         fields: [
            { label: 'Label', name: 'value'},
            { type: 'select', label: 'Type', name: 'type', choices:[{ value: "button" }, { value: "submit" }] }
         ]
      }
   }
]);


},'3.1.0',{
  requires: ['io-base','inputex-group','json','inputex-button']
});
