/**
 * @fileoverview Provide a wrapper around YAHOO.util.DD to drag/drop a block containing terminals and redraw the associated wires
 */
/**
 * Wraper for YAHOO.util.DD, to redraw the wires associated with the given terminals
 * @class WireIt.util.DD
 * @extends YAHOO.util.DD
 * @constructor
 * @param {Array} terminals List of WireIt.Terminal objects associated within the DragDrop element
 * @params {String} id Parameter of YAHOO.util.DD
 * @params {String} sGroup Parameter of YAHOO.util.DD
 * @params {Object} config Parameter of YAHOO.util.DD
 */
WireIt.util.DD = function( terminals, id, sGroup, config) {
   if(!terminals) {
      throw new Error("WireIt.util.DD needs at least terminals and id");
   }
   /**
    * List of the contained terminals
    */
   this._WireItTerminals = terminals;
   WireIt.util.DD.superclass.constructor.call(this, id, sGroup, config);
};

YAHOO.extend(WireIt.util.DD, YAHOO.util.DD);

/**
 * Override YAHOO.util.DD.prototype.onDrag to redraw the wires
 */
WireIt.util.DD.prototype.onDrag = function(e) {
   if( YAHOO.lang.isArray(this._WireItTerminals) ) {
      for(var i = 0 ; i < this._WireItTerminals.length ; i++) {
         if(this._WireItTerminals[i].wire) {
            this._WireItTerminals[i].wire.redraw();
         }
      }
   }
   else if (this._WireItTerminals.isWireItTerminal){
      if(this._WireItTerminals.wire) {
         this._WireItTerminals.wire.redraw();
      }
   }
};

