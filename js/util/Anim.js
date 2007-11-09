/**
 * @fileoverview Provide a wrapper around YAHOO.util.Anim to animate a block containing terminals and redraw the associated wires
 */
/**
 * Wraper for YAHOO.util.Anim, to redraw the wires associated with the given terminals
 * @class WireIt.util.Anim
 * @extends YAHOO.util.Anim
 * @constructor
 * @param {Array} terminals List of WireIt.Terminal objects associated within the animated element
 * @params {String} id Parameter of YAHOO.util.Anim
 * @params {String} sGroup Parameter of YAHOO.util.Anim
 * @params {Object} config Parameter of YAHOO.util.Anim
 */
WireIt.util.Anim = function( terminals, el, attributes, duration, method) {
   if(!terminals) {
      throw new Error("WireIt.util.Anim needs at least terminals and id");
   }
   /**
    * List of the contained terminals
    */
   this._WireItTerminals = terminals;
   WireIt.util.Anim.superclass.constructor.call(this, el, attributes, duration, method);
   // Subscribe the onTween event
   this.onTween.subscribe(this.moveWireItWires, this, true);
};

YAHOO.extend(WireIt.util.Anim, YAHOO.util.Anim);

/**
 * Listen YAHOO.util.Anim.onTween events to redraw the wires
 */
WireIt.util.Anim.prototype.moveWireItWires = function(e) {
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

