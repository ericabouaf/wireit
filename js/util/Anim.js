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


if(WireIt.Layer) {
/**
 * Layer explosing animation
 */
WireIt.Layer.prototype.clearExplode = function(callback, bind) {

   var center = [ Math.floor(YAHOO.util.Dom.getViewportWidth()/2),
		            Math.floor(YAHOO.util.Dom.getViewportHeight()/2)];
   var R = 1.2*Math.sqrt( Math.pow(center[0],2)+Math.pow(center[1],2));

   for(var i = 0 ; i < this.containers.length ; i++) {
       var left = parseInt(dbWire.layer.containers[i].el.style.left.substr(0,dbWire.layer.containers[i].el.style.left.length-2),10);
	    var top = parseInt(dbWire.layer.containers[i].el.style.top.substr(0,dbWire.layer.containers[i].el.style.top.length-2),10);

	    var d = Math.sqrt( Math.pow(left-center[0],2)+Math.pow(top-center[1],2) );

	    var u = [ (left-center[0])/d, (top-center[1])/d];
	    YAHOO.util.Dom.setStyle(this.containers[i].el, "opacity", "0.8");
	
	    var myAnim = new WireIt.util.Anim(this.containers[i].terminals, this.containers[i].el, {
           left: { to: center[0]+R*u[0] },
           top: { to: center[1]+R*u[1] },
	        opacity: { to: 0, by: 0.05},
	        duration: 3
       });
       if(i == this.containers.length-1) {
          myAnim.onComplete.subscribe(function() { this.clear(); callback.call(bind);}, this, true); 
       }
	    myAnim.animate();
   }

};

}