/**
 * @module inputex-wirable
 */

   var inputEx = Y.inputEx;

/**
 * Copy of the original inputEx.Field class that we're gonna override to extend it.
 * @class BaseField
 */
inputEx.BaseField = inputEx.Field;

/**
 * Class to make inputEx Fields "wirable".Re-create inputEx.Field adding the wirable properties
 * @class Field
 * @extends inputEx.BaseField
 */
inputEx.Field = function (options) {
   inputEx.Field.superclass.constructor.call(this,options);
};

Y.extend(inputEx.Field, inputEx.BaseField, {

   /**
    * Adds a wirable option to every field
    * @method setOptions
    */
   setOptions: function (options) {
      inputEx.Field.superclass.setOptions.call(this, options);
      
      this.options.wirable = Y.Lang.isUndefined(options.wirable) ? false : options.wirable;
      this.options.container = options.container;
   },
   
   /**
    * Adds a terminal to each field
    * @method render
    */
   render: function () {
      inputEx.Field.superclass.render.call(this);
      
      if(this.options.wirable) {
         this.renderTerminal();
      }
   },
   
   /**
    * Render the associated input terminal
    * @method renderTerminal
    */
   renderTerminal: function () {

      if(this.options.container) {
         this.terminal = this.options.container.add({
            name: this.options.name, 
            dir: [-1,0],
            alignNode: this.divEl,
            align: {"points":['tl', 'lc']}
         }).item(0);
         
         // Register the events
         this.terminal.on('addWire', this.onAddWire, this, true);
         this.terminal.on('removeWire', this.onRemoveWire, this, true);
      }
      
    },

   /**
    * Set the container for this field
    */
   setContainer: function (container) {
      if(!this.options.container) {
         this.renderTerminal();
      }
      this.options.container = container;
      /*if(this.terminal) {
         this.terminal.container = container;
         if( Y.Array.indexOf(container.terminals, this.terminal) == -1 ) {
            container.terminals.push(this.terminal);
         }
      }*/
   },

   /**
    * also change the terminal name when changing the field name
    */
   setFieldName: function (name) {
      if(this.terminal) {
         this.terminal.name = name;
         this.terminal.el.title = name;
      }
   },

    /**
     * Remove the input wired state on the 
     * @method onAddWire
     */
    onAddWire: function (e, params) {
       // TODO: this.options.container.onAddWire(e,params);

       this.disable();
       this.el.value = "[wired]";
    },

    /**
     * Remove the input wired state on the 
     * @method onRemoveWire
     */
    onRemoveWire: function (e, params) { 
       // TODO: this.options.container.onRemoveWire(e,params);

       this.enable();
       this.el.value = "";
    }

});

inputEx.Field.groupOptions = inputEx.BaseField.groupOptions.concat([
   { type: 'boolean', label: 'Wirable', name: 'wirable', value: false}
]);

