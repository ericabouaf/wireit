/**
 * @module inputex-autocomplete
 */
YUI.add('inputex-autocomplete', function(Y) {

  var lang = Y.Lang,
      inputEx = Y.inputEx;

/**
 * An autocomplete field that wraps the YUI autocompleter
 * @class inputEx.AutoComplete
 * @constructor
 * @extends inputEx.StringField
 * @param {Object} options Added options for Autocompleter
 * <ul>
 *  <li>source: the datasource</li>
 *  <li>autoComp: autocompleter options</li>
 *   <li>returnValue: function to format the returned value (optional)</li>
 * </ul>
 */
inputEx.AutoComplete = function(options) {
   inputEx.AutoComplete.superclass.constructor.call(this, options);
};

Y.extend(inputEx.AutoComplete, inputEx.StringField, {

   /**
    * Adds autocomplete options
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.AutoComplete.superclass.setOptions.call(this, options);
  
      // Overwrite options
      this.options.className = options.className ? options.className : 'inputEx-Field inputEx-AutoComplete';
      
      // Added options
      this.options.autoComp = options.autoComp;
      this.options.returnValue = options.returnValue;
   },
   
   /**
    * Custom event init
    * <ul>
    *   <li>listen to autocompleter textboxBlurEvent instead of this.el "blur" event</li>
    *   <li>listener to autocompleter textboxBlurEvent added in buildAutocomplete method</li>
    * </ul>
    */
   initEvents: function() {
      inputEx.AutoComplete.superclass.initEvents.call(this);

      // remove standard blur listener
      // TODO: ?
   },

   /**
    * Render the hidden list element
    */
   renderComponent: function() {
   
      // This element wraps the input node in a float: none div
      this.wrapEl = inputEx.cn('div', {className: 'inputEx-StringField-wrapper'});
      
      // Attributes of the input field
      var attributes = {
         type: 'text',
         id: Y.guid()
      };
      if(this.options.size) attributes.size = this.options.size;
      if(this.options.readonly) attributes.readonly = 'readonly';
      if(this.options.maxLength) attributes.maxLength = this.options.maxLength;

      // Create the node
      this.el = inputEx.cn('input', attributes);
      
      // Create the hidden input
      var hiddenAttrs = {
         type: 'hidden',
         value: ''
      };
      if(this.options.name) hiddenAttrs.name = this.options.name;
      this.hiddenEl = inputEx.cn('input', hiddenAttrs);
      
      // Append it to the main element
      this.wrapEl.appendChild(this.el);
      this.wrapEl.appendChild(this.hiddenEl);
      this.fieldContainer.appendChild(this.wrapEl);
   
      // Render the list :
      var listId = Y.guid()
      this.listEl = inputEx.cn('div', {id: listId });
      this.fieldContainer.appendChild(this.listEl);
      
      Y.on('available', this.buildAutocomplete, "#"+attributes.id, this);
      Y.on('available', this.buildAutocomplete, "#"+listId, this);
      //Y.on("domready", function(e){alert(e+"domready");});
   },
   
   /**
    * Build the YUI autocompleter
    */
   buildAutocomplete: function() {
      // Call this function only when this.el AND this.listEl are available
      if(!this._nElementsReady) { this._nElementsReady = 0; }
      this._nElementsReady++;
      if(this._nElementsReady != 2) return;
    
      this.yEl = Y.one(this.el)
      this.yEl.plug(Y.Plugin.AutoComplete, this.options.autoComp);

      // Instantiate AutoComplete
      this.yEl.ac.on("select",this.itemSelectHandler, this);
      this.yEl.on("blur", this.onBlur, this);
   },
   
   /**
    * itemSelect handler
    * @param {} sType
    * @param {} aArgs
    */
   itemSelectHandler: function(o) {
      var aData = o.result.raw;
      this.setValue( this.options.returnValue ? this.options.returnValue(aData) : aData.label );
   },

   onBlur: function(e){
     if(this.el.value == '' && this.options.typeInvite) {
       Y.one(this.divEl).addClass("inputEx-typeInvite")
       if (this.el.value == '') this.el.value = this.options.typeInvite;
     }
  },

   
   /**
    * Set the value
    * @param {Any} value Value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updated event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      this.hiddenEl.value = value || "";
      this.el.value  =  value || "";
      // "inherited" from inputex.Field :
      //    (can't inherit of inputex.StringField because would set this.el.value...)
      //
      // set corresponding style
      this.setClassFromState();

      if(sendUpdatedEvt !== false) {
         // fire update event
         this.fireUpdatedEvt();
      }
   },
   
   /**
    * Return the hidden value (stored in a hidden input)
    */
   getValue: function() {
      return this.hiddenEl.value;
   }

});


// Register this class as "autocomplete" type
inputEx.registerType("autocomplete", inputEx.AutoComplete);

}, '3.0.0a',{
  requires: ['inputex-string','autocomplete']
})
