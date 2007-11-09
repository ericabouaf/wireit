/**
 * @fileoverview Terminals represent the end points of the "wires"
 *
 * @class WireIt.Terminal
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} parentEl Element that will contain the terminal
 * @param {Object} config Configuration object
 */
WireIt.Terminal = function(parentEl, terminalConfig) {
   
   // Save the parentEl
   /**
    * DOM parent element
    */
   this.terminalParent = parentEl;
   
   // Config :
   this.terminalConfig = terminalConfig || {};
   this.terminalConfig.direction = this.terminalConfig.direction || [0,1];
   this.terminalConfig.fakeDirection = this.terminalConfig.fakeDirection || [-this.terminalConfig.direction[0],-this.terminalConfig.direction[1]];
   
   // Render
   this.terminalEl = WireIt.cn('div', {className: "WireIt-Terminal"});
   this.terminalParent.appendChild(this.terminalEl);
   
   // Init the DDProxy
   WireIt.Terminal.superclass.constructor.call(this,this.terminalEl);
   
};

// Mode Intersect to get the DD objects
YAHOO.util.DDM.mode = YAHOO.util.DDM.INTERSECT; 

// Inheritance
YAHOO.extend(WireIt.Terminal,YAHOO.util.DDProxy,{
   
   startDrag: function() {
      
      if(this.wire) {
         this.wire.remove();
      }
      
      this.fakeTerminal = this.fakeTerminal || {
         terminalConfig: {direction: this.terminalConfig.fakeDirection},
         pos: [200,200],
         addWire: function() {},
         removeWire: function() {},
         getXYWire: function() { return this.pos; }
      };
      
      this.editingWire = new WireIt.Wire(this, this.fakeTerminal, this.terminalParent.parentNode, this.terminalConfig.editingWireConfig);
      YAHOO.util.Dom.addClass(this.editingWire.el, 'WireIt-Wire-editing');
   },
   
   onDrag: function(e) {
      this.fakeTerminal.pos = [e.clientX, e.clientY];
      this.editingWire.redraw();
   },
   
   endDrag: function(e) {
      this.editingWire.remove();
      this.editingWire = null;
   },
   
   onDragEnter: function(e,ddTargets) {
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            YAHOO.util.Dom.addClass(ddTargets[i].terminalEl, 'WireIt-Terminal-dropinvite');
         }
      }
   },
   
   onDragOut: function(e,ddTargets) { 
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            YAHOO.util.Dom.removeClass(ddTargets[i].terminalEl, 'WireIt-Terminal-dropinvite');
         }
      }
   },
   
   onDragDrop: function(e,ddTargets) {
      this.onDragOut(e,ddTargets);
      if( !this.isValidWireTerminal(ddTargets[0]) ) return;
      if(ddTargets[0].wire) {
         ddTargets[0].wire.remove();
      }
      var w = new WireIt.Wire(this, ddTargets[0], this.terminalParent.parentNode, this.terminalConfig.wireConfig);
      w.redraw();
   },
   
   /**
    * Wires :
    */
   addWire: function(wire) {
       this.wire = wire;
       YAHOO.util.Dom.addClass(this.terminalEl, 'WireIt-Terminal-connected');
   },

   /**
    * @method removeWire
    */
   removeWire: function(wire) {
       if(this.wire == wire) {
          this.wire = null;
          YAHOO.util.Dom.removeClass(this.terminalEl, 'WireIt-Terminal-connected');
       }
   },

   
   // Distinct from other YAHOO.util.DragDrop objects
   isWireItTerminal: true,
   
   isValidWireTerminal: function(terminal) {
      return terminal.isWireItTerminal;
   }
   
});


/**
 * get the absolute position of the terminal. (Used by the Wire to redraw itself)
 * @returns {Array} [x,y]: Absolute position of the terminal
 */
WireIt.Terminal.prototype.getXYWire = function() {
    var pos = YAHOO.util.Dom.getXY(this.terminalEl);
    pos[0] += 8;
    pos[1] += 8;
    return pos;
};

