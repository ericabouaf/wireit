/**
 * @fileoverview Provide a wrapper around YAHOO.util.Anim to animate a block containing terminals and redraw the associated wires
 */
/**
 * @class Wraper for YAHOO.util.Anim, to redraw the wires associated with the given terminals
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
   if(!YAHOO.util.Anim) { return;}
   /**
    * List of the contained terminals
    */
   this._WireItTerminals = terminals;
   WireIt.util.Anim.superclass.constructor.call(this, el, attributes, duration, method);
   // Subscribe the onTween event
   this.onTween.subscribe(this.moveWireItWires, this, true);
};

if(YAHOO.util.Anim) { 
YAHOO.extend(WireIt.util.Anim, YAHOO.util.Anim, 
/**
 * @scope WireIt.util.Anim.prototype
 */
{
   
   /**
    * Listen YAHOO.util.Anim.onTween events to redraw the wires
    */
  moveWireItWires: function(e) {
      // Make sure terminalList is an array
      var terminalList = YAHOO.lang.isArray(this._WireItTerminals) ? this._WireItTerminals : (this._WireItTerminals.isWireItTerminal ? [this._WireItTerminals] : []);
      // Redraw all the wires
      for(var i = 0 ; i < terminalList.length ; i++) {
         if(terminalList[i].wires) {
            for(var k = 0 ; k < terminalList[i].wires.length ; k++) {
               terminalList[i].wires[k].redraw();
            }
         }
      }
   },

   /**
    * In case you change the terminals since you created the WireIt.util.Anim:
    */
   setTerminals: function(terminals) {
      this._WireItTerminals = terminals;
   }

});

}
