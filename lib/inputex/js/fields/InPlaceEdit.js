(function() {

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

})();