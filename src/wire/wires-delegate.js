YUI.add('wires-delegate', function(Y) {


/**
 * WireIt - Wiring javascript library
 * @module wireit
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
Y.WiresDelegate = function(config) {
	
	this.publish("addWire");
	
	this.publish("removeWire");
	
	this._wires = [];
};

Y.WiresDelegate.ATTRS = {};

Y.WiresDelegate.prototype = {
	
	/**
    * Add a wire to this terminal.
    * @param {WireIt.Wire} wire Wire instance to add
    */
   addWire: function(wire) {
		var index = Y.Array.indexOf(this._wires, wire); 
		if(index == -1) {
      	this._wires.push(wire);
			this.fire('addWire', wire);
		}
   },

	/**
	 * When a wire is destroyed
	 */
	removeWire: function(wire) {

		var index = Y.Array.indexOf(this._wires, wire); 

      if( index != -1 ) {

			// Compact the array
			var w = this._wires;
			this._wires = [];
			var v = this._wires;
			Y.Array.each(w,function(i) { if(i != wire){ v.push(i); } });

         // Fire the event
         this.fire('removeWire', wire);
      }

   },

	/** 
    * Remove all wires
    */
   destroyWires: function() {
		// This isn't very nice but...
      // the method Wire.remove calls Terminal.removeWire to remove the reference
      while(this._wires.length > 0) {
         this._wires[0].destroy();
      }
   },

	/**
    * Returns a list of all the terminals connected to this terminal through its wires.
    * @return  {Array}  List of all connected terminals
    */
   getConnected: function() {
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
    */
   redrawAllWires: function() {
      if(this._wires) {
         for(var i = 0, n = this._wires.length ; i < n ; i++) {
				if(this._wires[i]._drawWire) {
            	this._wires[i]._drawWire();
				}
         }
      }
   }
	
};

}, '3.0.0a', {requires: ['wire']});
