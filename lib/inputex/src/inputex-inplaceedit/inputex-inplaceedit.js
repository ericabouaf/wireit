/**
 * @module inputex-inplaceedit
 */
YUI.add("inputex-inplaceedit", function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx,
       CSS_PREFIX = "inputEx-";

/**
 * Meta field providing in place editing (the editor appears when you click on the formatted value). 
 * @class inputEx.InPlaceEdit
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
   this.publish('openEditor');
   this.publish('closeEditor');
};

Y.extend(inputEx.InPlaceEdit, inputEx.Field, {
   /**
    * Set the default values of the options
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.InPlaceEdit.superclass.setOptions.call(this, options);
      
      this.options.visu = options.visu;
      
      this.options.editorField = options.editorField;
      
      //this.options.buttonTypes = options.buttonTypes || {ok:"submit",cancel:"link"};
      
      this.options.buttonConfigs = options.buttonConfigs || [{
               type: "submit",
               value: inputEx.messages.okEditor,
               className: "inputEx-Button "+CSS_PREFIX+'OkButton',
               onClick: {fn: this.onOkEditor, scope:this}
            },{
               type: "link",
               value: inputEx.messages.cancelEditor,
               className: "inputEx-Button "+CSS_PREFIX+'CancelLink',
               onClick: {fn: this.onCancelEditor, scope:this}
            }];
      
      this.options.animColors = options.animColors || null;
   },
   
   /**
    * Override renderComponent to create 2 divs: the visualization one, and the edit in place form
    * @method renderComponent
    */
   renderComponent: function() {
      this.renderVisuDiv();
     this.renderEditor();
   },
   
   /**
    * Render the editor
    * @method renderEditor
    */
   renderEditor: function() {
      var i;

      this.editorContainer = inputEx.cn('div', {className: CSS_PREFIX+'editor'}, {display: 'none'});
      
      // Render the editor field
      this.editorField = inputEx(this.options.editorField,this);
      var editorFieldEl = this.editorField.getEl();
      
      this.editorContainer.appendChild( editorFieldEl );
      Y.one(editorFieldEl).addClass(CSS_PREFIX+'editorDiv');
      this.buttons = [];
      for (i = 0; i < this.options.buttonConfigs.length ; i++){
        var config = this.options.buttonConfigs[i];
        config.parentEl = this.editorContainer;
        this.buttons.push(new inputEx.widget.Button(config));
      }
      
      // Line breaker ()
      this.editorContainer.appendChild( inputEx.cn('div',null, {clear: 'both'}) );
      
      this.fieldContainer.appendChild(this.editorContainer);
      
   },
   
   /**
    * Set the color when hovering the field
    * @method onVisuMouseOver
    * @param {Event} e The original mouseover event
    */
   onVisuMouseOver: function(e) {
      // to totally disable the visual effect on mouse enter, you should change css options inputEx-InPlaceEdit-visu:hover
      if(this.disabled) {
         return;
      }
      
      if(this.colorAnim) {
         this.colorAnim.stop(true);
      }
      inputEx.sn(this.formattedContainer, null, {backgroundColor: this.options.animColors.from });
   },
   
   /**
    * Start the color animation when hovering the field
    * @method onVisuMouseOut
    * @param {Event} e The original mouseout event
    */
   onVisuMouseOut: function(e) {
      var optionsAnim;
      if(this.disabled) {
         return;
      }
      
      // Start animation
      if(this.colorAnim) {
         this.colorAnim.stop(true);
      }
      if(!this.options.animColors) {
         return;
      }

      optionsAnim =  {
        node: this.formattedContainer
      };

      if(this.options.animColors.from){
        optionsAnim.from = {
          backgroundColor : this.options.animColors.from
        };
      }
      if(this.options.animColors.from){
        optionsAnim.to = {
          backgroundColor : this.options.animColors.to
        };
      }
      this.colorAnim = new Y.Anim(optionsAnim);
      var that = this;
      this.colorAnim.on("end",function() { 
        Y.one(that.formattedContainer).setStyle('backgroundColor', ''); 
      });
      this.colorAnim.run();
      
   },
   
   /**
    * Create the div that will contain the visualization of the value
    * @method renderVisuDiv
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
    * @method initEvents
    */
   initEvents: function() {  
      Y.one(this.formattedContainer).on("click", this.openEditor, this, true);
            
      // For color animation (if specified)
      if (this.options.animColors) {
         Y.one(this.formattedContainer).on('mouseover', this.onVisuMouseOver, this);
         Y.one(this.formattedContainer).on('mouseout', this.onVisuMouseOut, this);
      }
      
      if(this.editorField.el) {
         var that = this;
         // Register some listeners
         Y.on("keyup", function(e){ that.onKeyUp(e); },"#"+Y.one(this.editorField.el).get("id"));
         Y.on("keydown", function(e){ that.onKeyDown(e); },"#"+Y.one(this.editorField.el).get("id"));
      }
   },
   
   /**
    * Handle some keys events to close the editor
    * @method onKeyUp
    * @param {Event} e The original keyup event
    */
   onKeyUp: function(e) {
      // Enter
      if( e.keyCode === 13) {
         this.onOkEditor(e);
      }
      // Escape
      if( e.keyCode === 27) {
         this.onCancelEditor(e);
      }
   },
   
   /**
    * Handle the tabulation key to close the editor
    * @method onKeyDown
    * @param {Event} e The original keydown event
    */
   onKeyDown: function(e) {
      // Tab
      if(e.keyCode === 9) {
         this.onOkEditor(e);
      }
   },
   
   /**
    * Validate the editor (ok button, enter key or tabulation key)
    * @method onOkEditor
    */
   onOkEditor: function(e) {

      if(e) {
         e.halt();
      }
      
      var newValue = this.editorField.getValue();
      this.setValue(newValue);
      this.closeEditor();
      
      var that = this;
      setTimeout(function() {that.fire("updated",newValue);}, 50);      
   },

   
   /**
    * Close the editor on cancel (cancel button, blur event or escape key)
    * @method onCancelEditor
    * @param {Event} e The original event (click, blur or keydown)
    */
   onCancelEditor: function(e) {
      if(e) {
         e.halt();
      }
      this.closeEditor();
   },
   
   /**
    * Close the editor on cancel (cancel button, blur event or escape key)
    * @method closeEditor
    * @param {Event} e The original event (click, blur or keydown)
    */
   closeEditor: function() {
      this.editorContainer.style.display = 'none';
      this.formattedContainer.style.display = '';
      this.fire("closeEditor");
   },  
       
   /**
    * Override enable to Enable openEditor
    * @method enable
    */
    enable: function(){
      this.disabled = false;
      inputEx.sn(this.formattedContainer, {className: 'inputEx-InPlaceEdit-visu'});
    },  
    
   /**
    * Override disable to Disable openEditor
    * @method disable
    */   
    disable: function(){
      this.disabled = true;
      inputEx.sn(this.formattedContainer, {className: 'inputEx-InPlaceEdit-visu-disable'});
    },
    
   /**
    * Display the editor
    * @method openEditor
    */
   openEditor: function() {
      if(this.disabled) {
         return; 
      }

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
      this.fire("openEditor");
   },
   
   /**
    * Returned the previously stored value
    * @method getValue
    * @return {Any} The value of the subfield
    */
   getValue: function() {
      var editorOpened = (this.editorContainer.style.display === '');
      return editorOpened ? this.editorField.getValue() : this.value;
   },

   /**
    * Set the value and update the display
    * @method setValue
    * @param {Any} value The value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {   
      // Store the value
     this.value = value;
   
      if(lang.isUndefined(value) || value === "") {
         inputEx.renderVisu(this.options.visu, inputEx.messages.emptyInPlaceEdit, this.formattedContainer);
      }
      else {
         inputEx.renderVisu(this.options.visu, this.value, this.formattedContainer);
      }
      
      // If the editor is opened, update it 
      if(this.editorContainer.style.display === '') {
         this.editorField.setValue(value);
      }
      
      inputEx.InPlaceEdit.superclass.setValue.call(this, value, sendUpdatedEvt);
   },
   
   /**
    * Close the editor when calling the close function on this field
    * @method close
    */
   close: function() {
      this.editorContainer.style.display = 'none';
      this.formattedContainer.style.display = '';
      this.fire("openEditor");
  }

});
  
// Register this class as "inplaceedit" type
inputEx.registerType("inplaceedit", inputEx.InPlaceEdit, [
   { type:'type', label: 'Editor', name: 'editorField'}
]);

}, '3.1.0', {
  requires:['inputex-field', 'inputex-button', 'anim','inputex-visus']
});
