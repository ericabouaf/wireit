/**
 * @module wires-delegate
 */

/**
 * WiresDelegate is an extension for Widgets to manipulate a list of wires.
 *
 * The WidgetParent/WidgetChild relationship isn't sufficient
 * because wires have 2 parents, so we use this extension instead of WidgetParent
 *
 * @class WiresDelegate
 * @constructor
 * @param {Object} config configuration object
 */
Y.WiresDelegate = function (config) {
   
   this._wires = [];
   
   this.publish('addWire');
   
   this.publish('removeWire');
   
   // Bubble events from terminals
   this.on('terminal:addWire', this._onAddWire, this);
   this.on('terminal:removeWire', this._onRemoveWire, this);
   
};

Y.WiresDelegate.ATTRS = {};

Y.WiresDelegate.prototype = {
   
   _onAddWire: function (e) {
      var w = e;
      while(!!w._event) { w = w.details[0]; }
      this.addWire(w);
   },
   
   _onRemoveWire: function (e) {
      var w = e;
      while(!!w._event) { w = w.details[0]; }
      this.removeWire(w);
   },
   
   /**
    * Add a wire to this terminal.
    * @method addWire
    * @param {Wire} wire Wire instance to add
    */
   addWire: function (wire) {
      var index = Y.Array.indexOf(this._wires, wire); 
      if(index == -1) {
         this._wires.push(wire);
         this.fire('addWire', wire);
      }
   },
   
   /**
    * When a wire is destroyed
    * @method removeWire
    */
   removeWire: function (wire) {
      
      var index = Y.Array.indexOf(this._wires, wire); 
      
      if( index != -1 ) {
         
         // Compact the array
         var w = this._wires;
         this._wires = [];
         var v = this._wires;
         Y.Array.each(w,function (i) { if(i != wire){ v.push(i); } });
         
         // Fire the event
         this.fire('removeWire', wire);
      }
      
   },
   
   /** 
    * Remove all wires
    * @method destroyWires
    */
   destroyWires: function () {
      
      if(this._wires) {
         Y.Array.each(this._wires, function (w) {
            w.destroy();
         });
      }
   
   },
   
   /**
    * Returns a list of all the terminals connected to this terminal through its wires.
    * @method getConnected
    * @return  {Array}  List of all connected terminals
    */
   getConnected: function () {
      var list = [];
      if(this._wires) {
         for(var i = 0, n = this._wires.length ; i < n ; i++) {
            list.push(this._wires[i].getOtherTerminal(this));
         }
      }
      return list;
   },
   
   /**
    * Redraw all the wires connected to this terminal
    * @method redrawAllWires
    */
   redrawAllWires: function () {
      
      if(this._wires) {
         Y.Array.each(this._wires, function (w) {
            w._draw();
         });
      }
   },

   destructor: function () {
      this.destroyWires();
   }
   
};

