/**
 * @fileoverview Class to make inputEx Fields "wirable"
 *
 * Rename the class inputEx.Field into inputEx.BaseField,
 * then re-create inputEx.Field making it inherits from inputEx.BaseField.
 *
 * This file should be placed between "inputEx/field.js"
 * 
 */
(function() {

   var lang = YAHOO.lang;

/**
 * @class Copy of the original inputEx.Field class that we're gonna overide
 */
inputEx.BaseField = inputEx.Field;

/**
 * @class Re-create inputEx.Field adding the wirable properties
 */
inputEx.Field = function(options) {
   inputEx.Field.superclass.constructor.call(this,options);
};

lang.extend(inputEx.Field, inputEx.BaseField, {

   /**
    * Adds a wirable option to every field
    */
   setOptions: function() {
      inputEx.Field.superclass.setOptions.call(this);
      
      this.options.wirable = lang.isUndefined(this.options.wirable) ? true : this.options.wirable;
      // + this.options.container
   },
   
   /**
    * Adds a terminal to each field
    */
   render: function() {
      inputEx.Field.superclass.render.call(this);
      
      if(this.options.wirable) {
         this.renderTerminal();
      }
   },
   
   /**
    * Render the associated input terminal
    */
   renderTerminal: function() {

      var wrapper = inputEx.cn('div', {className: 'WireIt-InputExTerminal'});
      this.divEl.insertBefore(wrapper, this.fieldContainer);

      this.terminal = new WireIt.Terminal(wrapper, {
         name: this.options.name, 
         direction: [-1,0],
         fakeDirection: [0, 1],
         /*ddConfig: {
            type: "input",
            allowedTypes: ["output"]
         },*/
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
     */
    onAddWire: function(e, params) {
       this.options.container.onAddWire(e,params);

       this.disable();
       this.el.value = "[wired]";
    },

    /**
     * Remove the input wired state on the 
     */
    onRemoveWire: function(e, params) { 
       this.options.container.onRemoveWire(e,params);

       this.enable();
       this.el.value = "";
    }

});


})();