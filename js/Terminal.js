/**
 * @fileoverview Terminals represent the end points of the "wires"
 */
/**
 * This class is used for wire edition. It inherits from YAHOO.util.DDProxy and acts as a "temporary" Terminal.
 *
 * @class WireIt.DDTerminal
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {WireIt.Terminal} terminal Parent terminal
 * @param {Object} config Configuration object (see in properties for details)
 */
WireIt.DDTerminal = function(terminal, config) {
   
   /**
    * Reference to the terminal parent
    */
   this.terminal = terminal;
   
   /**
    * Object containing the configuration object
    * <ul>
    *   <li>type: 'type' of this terminal. If no "allowedTypes" is specified in the config, the terminal will only connect to the same type of terminal</li>
    *   <li>allowedTypes: list of all the allowed types that we can connect to.</li>
    * </ul>
    */
   // WARNING: the object config cannot be called "config" because YAHOO.util.DDProxy already has a "config" property
   this.termConfig = config || {};
   
   // Init the DDProxy
   WireIt.DDTerminal.superclass.constructor.call(this,this.terminal.el);
   
   // On mouseover/mouseout to display/hide the scissors
   YAHOO.util.Event.addListener(this.terminal.el, "mouseover", this.mouseOver, this, true);
   YAHOO.util.Event.addListener(this.terminal.el, "mouseout", this.mouseOut, this, true);
   
};

// Mode Intersect to get the DD objects
YAHOO.util.DDM.mode = YAHOO.util.DDM.INTERSECT;

YAHOO.extend(WireIt.DDTerminal,YAHOO.util.DDProxy,{
   
   scissorOver: function() {
      // Stop that.terminalTimeout
      clearTimeout(this.terminalTimeout);
   },
   
   scissorOut: function() {
      var that = this;
      this.terminalTimeout = setTimeout(function() {
         if(that.scissor) {
            that.terminal.parentEl.parentNode.removeChild(that.scissor);
            that.scissor = undefined;
         }
      }, 500);
   },
   
   scissorClick: function() {
      while(this.terminal.wires.length > 0) {
         this.terminal.wires[0].remove();
      }
      if(this.scissor) {
         this.terminal.parentEl.parentNode.removeChild(this.scissor);
         this.scissor = undefined;
      }
   },
   
   initCissor: function() {
      // Position of the scissor
      var termPos = this.terminal.getXY();
      var position = [termPos[0]+this.terminal.config.direction[0]*30-13,termPos[1]+this.terminal.config.direction[1]*30-10];
   
      // Display the cut button
      this.scissor = WireIt.cn('div', {className: "WireIt-Wire-scissors"}, {left: position[0]+"px",top: position[1]+"px"} );
      this.terminal.parentEl.parentNode.appendChild(this.scissor);
      
      // Ajoute un listener sur le scissor:
      YAHOO.util.Event.addListener(this.scissor, "mouseover", this.scissorOver, this, true);
      YAHOO.util.Event.addListener(this.scissor, "mouseout", this.scissorOut, this, true);
      
      // On click : kill all wires !!!
      YAHOO.util.Event.addListener(this.scissor, "click", this.scissorClick, this, true);
   },
   
   mouseOver: function() {
      if(!this.scissor) {
         if(this.terminal.wires.length > 0)  {
            this.initCissor();
         }
      }
   },
   
   mouseOut: function() {
      
         var that = this;
         this.terminalTimeout = setTimeout(function() {
            if(that.scissor) {
               that.terminal.parentEl.parentNode.removeChild(that.scissor);
               that.scissor = undefined;
            }
         }, 300);
         
   },
   
   startDrag: function() {
      
      // If only one wire admitted, we remove the previous wire
      if(this.terminal.config.nMaxWires == 1 && this.terminal.wires.length == 1) {
         this.terminal.wires[0].remove();
      }
      // If the number of wires is at its maximum, prevent editing...
      else if(this.terminal.wires.length >= this.terminal.config.nMaxWires) {
         return;
      }
      
      this.fakeTerminal = {
         config: {direction: this.terminal.config.fakeDirection},
         pos: [200,200], 
         offset: [this.terminal.parentEl.parentNode.offsetLeft-this.terminal.parentEl.parentNode.scrollLeft, 
                  this.terminal.parentEl.parentNode.offsetTop-this.terminal.parentEl.parentNode.scrollTop],
         addWire: function() {},
         removeWire: function() {},
         getXY: function() { 
            return [this.pos[0]-this.offset[0], this.pos[1]-this.offset[1] ]; 
         }
      };
      
      this.editingWire = new WireIt.Wire(this.terminal, this.fakeTerminal, this.terminal.parentEl.parentNode, this.terminal.config.editingWireConfig);
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
            ddTargets[i].terminal.setDropInvitation(true);
         }
      }
   },
   
   onDragOut: function(e,ddTargets) { 
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            ddTargets[i].terminal.setDropInvitation(false);
         }
      }
   },
   
   onDragDrop: function(e,ddTargets) {
      this.onDragOut(e,ddTargets);
      
      var targetDDTerminal = null;
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( ddTargets[i].isWireItTerminal ) {
            targetDDTerminal =  ddTargets[i];
         }
      }
      
      // Connect to the FIRST target terminal
      if( targetDDTerminal ) {
         if( this.isValidWireTerminal(targetDDTerminal) ) { 
               
            // Don't create the wire if it already exists between the 2 terminals !!
            var termAlreadyConnected = false;
            for(var i = 0 ; i < this.terminal.wires.length ; i++) {
               if(this.terminal.wires[i].terminal1 == this.terminal) {
                  if( this.terminal.wires[i].terminal2 == targetDDTerminal.terminal) {
                     termAlreadyConnected = true;
                     break;
                  }
               }
               else if(this.terminal.wires[i].terminal2 == this.terminal) {
                  if( this.terminal.wires[i].terminal1 == targetDDTerminal.terminal) {
                     termAlreadyConnected = true;
                     break;
                  }
               }
            }
            
            // Create the wire only if the terminals aren't connected yet
            if(!termAlreadyConnected) {
               // Check the number of wires for this terminal
               if( targetDDTerminal.terminal.config.nMaxWires == 1) {
                  if(targetDDTerminal.terminal.wires.length > 0) {
                     targetDDTerminal.terminal.wires[0].remove();
                  }
                  var w = new WireIt.Wire(this.terminal, targetDDTerminal.terminal, this.terminal.parentEl.parentNode, this.terminal.config.wireConfig);
                  w.redraw();
               }
               else if(targetDDTerminal.terminal.wires.length < targetDDTerminal.terminal.config.nMaxWires) {
                  var w = new WireIt.Wire(this.terminal, targetDDTerminal.terminal, this.terminal.parentEl.parentNode, this.terminal.config.wireConfig);
                  w.redraw();
               }
               else {
                  //console.log("Cannot connect to this terminal: nMaxWires = ", ddTargets[0].terminal.config.nMaxWires);
               }
            }
            else {
               //console.log("terminals already connected ");
            }
         }
      }
      
   },
   
   
   // Distinct from other YAHOO.util.DragDrop objects
   isWireItTerminal: true,
   
   isValidWireTerminal: function(DDterminal) {
      
      if( !DDterminal.isWireItTerminal ) {
         return false;
      }
      
      // If this terminal has the type property:
      if(this.termConfig.type) {
         if(this.termConfig.allowedTypes) {
            if( this.termConfig.allowedTypes.indexOf(DDterminal.termConfig.type) == -1 ) {
               return false;
            }
         }
         else {
            if(this.termConfig.type != DDterminal.termConfig.type) {
               return false;
            }
         }
      }
      // The other terminal may have type property too:
      else if(DDterminal.termConfig.type) {
         if(DDterminal.termConfig.allowedTypes) {
            if( DDterminal.termConfig.allowedTypes.indexOf(this.termConfig.type) == -1 ) {
               return false;
            }
         }
         else {
            if(this.termConfig.type != DDterminal.termConfig.type) {
               return false;
            }
         }
      }
      
      return true;
   }
   
});


   

/**
 * @class WireIt.Terminal
 * @constructor
 * @param {DomEl} parentEl Element that will contain the terminal
 * @param {Object} config Configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
WireIt.Terminal = function(parentEl, config, container) {
   
   /**
    * DOM parent element
    */
   this.parentEl = parentEl;
   
   /**
    * Container (optional). Parent container of this terminal
    */
   this.container = container;
   
   /**
    * List of the associated wires
    */
    this.wires = [];
   
   /**
    * <p>Object that contains the terminal configuration:</p>
    * 
    * <ul>
    *   <li><b>direction</b: direction vector of the wires when connected to this terminal (default [0,1])</li>
    *   <li><b>fakeDirection</b>: direction vector of the "editing" wire when it started from this terminal (default to -direction)</li>
    *   <li><b>editable</b>: boolean that makes the terminal editable (default to true)</li>
    *   <li><b>nMaxWires</b>: maximum number of wires for this terminal (default to Infinity)</li>
    *   <li><b>offsetPosition</b>: offset position from the parentEl position (default to [0,0])</li>
    *   <li><b>ddConfig</b>: configuration of the WireIt.DDTerminal object (only if editable)</li>
    *   <li><b>className</b>: CSS class name of the terminal (default to "WireIt-Terminal")</li>
    *   <li><b>connectedClassName</b>: CSS class added to the terminal when it is connected (default to "WireIt-Terminal-connected")</li>
    *   <li><b>dropinviteClassName</b>: CSS class added for drop invitation (default to "WireIt-Terminal-dropinvite")</li>
    * </ul>
    */  
   this.config = config || {};
   this.config.direction = this.config.direction || [0,1];
   this.config.fakeDirection = this.config.fakeDirection || [-this.config.direction[0],-this.config.direction[1]];
   this.config.className = this.config.className || 'WireIt-Terminal';
   this.config.connectedClassName = this.config.connectedClassName || 'WireIt-Terminal-connected';
   this.config.dropinviteClassName = this.config.dropinviteClassName || 'WireIt-Terminal-dropinvite';
   this.config.editable = YAHOO.lang.isUndefined(this.config.editable) ? true : this.config.editable;
   this.config.nMaxWires = this.config.nMaxWires || Infinity;
   
   /**
    * Event that is fired when a wire is added
    * You can register this event with myTerminal.eventAddWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    */
   this.eventAddWire = new YAHOO.util.CustomEvent("eventAddWire");
   
   /**
    * Event that is fired when a wire is removed
    * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    */
   this.eventRemoveWire = new YAHOO.util.CustomEvent("eventRemoveWire");
   
   /**
    * DIV dom element that will display the Terminal
    */
   this.el = null;
   
   
   this.render();
   
   // Create the DDTerminal object to make the terminal editable
   if(this.config.editable) {
      this.dd = new WireIt.DDTerminal(this, this.config.ddConfig);
   }
};

/**
 * Show or hide the drop invitation. (by adding/removing this.config.dropinviteClassName CSS class)
 * @param {Boolean} display Show the invitation if true, hide it otherwise
 */
WireIt.Terminal.prototype.setDropInvitation = function(display) {
   if(display) {
      YAHOO.util.Dom.addClass(this.el, this.config.dropinviteClassName);
   }
   else {
      YAHOO.util.Dom.removeClass(this.el, this.config.dropinviteClassName);
   }
};

/**
 * Render the DOM of the terminal
 */
WireIt.Terminal.prototype.render = function() {
   
   // Create the DIV element
   this.el = WireIt.cn('div', {className: this.config.className} );
   
   // Set the offset position
   if(this.config.offsetPosition) {
      this.el.style.left = this.config.offsetPosition[0]+"px";
      this.el.style.top = this.config.offsetPosition[1]+"px";
   }
   
   // Append the element to the parent
   this.parentEl.appendChild(this.el);
};


/**
 * Add a wire to this terminal.
 * @param {WireIt.Wire} wire Wire instance to add
 */
WireIt.Terminal.prototype.addWire = function(wire) {
   
   // Adds this wire to the list of connected wires :
   this.wires.push(wire);
   
   // Set class indicating that the wire is connected
   YAHOO.util.Dom.addClass(this.el, this.config.connectedClassName);
   
   // Fire the event
   this.eventAddWire.fire(wire);
};

/**
 * Remove a wire
 * @param {WireIt.Wire} wire Wire instance to remove
 */
WireIt.Terminal.prototype.removeWire = function(wire) {

   var index = this.wires.indexOf(wire);   
   if( index != -1 ) {
      this.wires[index] = null;
      
      // Compact the wires array:
      var newWires = [];
      for(var i = 0 ; i < this.wires.length ; i++) {
         if(this.wires[i]) {
            newWires.push(this.wires[i]);
         }
      }
      this.wires = newWires;
      
      // Remove the connected class if it has no more wires:
      if(this.wires.length == 0) {
         YAHOO.util.Dom.removeClass(this.el, this.config.connectedClassName);
      }
      
      // Fire the event
      this.eventRemoveWire.fire(wire);
   }
};

/**
 * get the absolute position of the terminal. (Used by the Wire to redraw itself)
 * @returns {Array} pos [x,y] Absolute position of the terminal
 */
WireIt.Terminal.prototype.getXY = function() {
    var pos = YAHOO.util.Dom.getXY(this.el);
    pos[0] += 15-this.el.parentNode.parentNode.offsetLeft+this.el.parentNode.parentNode.scrollLeft;
    pos[1] += 15-this.el.parentNode.parentNode.offsetTop+this.el.parentNode.parentNode.scrollTop;
    return pos;
};


/**
 * Remove the terminal from the DOM
 */
WireIt.Terminal.prototype.remove = function() {
   // This isn't very nice but...
   // the method Wire.remove calls Terminal.removeWire to remove the reference
   while(this.wires.length > 0) {
      this.wires[0].remove();
   }
   this.parentEl.removeChild(this.el);
};



/**
 * Returns a list of all the terminals connecter to this terminal through its wires.
 * @return  {Array}  List of all connected terminals
 */
WireIt.Terminal.prototype.getConnectedTerminals = function() {
   var terminalList = [];
   if(this.wires) {
      for(var i = 0 ; i < this.wires.length ; i++) {
         terminalList.push(this.wires[i].getOtherTerminal());
      }
   }
   return terminalList;
};


/**
 * Redraw all the wires connected to this terminal
 */
WireIt.Terminal.prototype.redrawAllWires = function() {
   if(this.wires) {
      for(var i = 0 ; i < this.wires.length ; i++) {
         this.wires[i].redraw();
      }
   }
};



 /**
  * Class that extends Terminal to differenciate Input/Output terminals
  * @class WireIt.util.TerminalInput
  * @extends WireIt.Terminal
  * @constructor
  * @param {DOMEl} parentEl Parent dom element
  * @param {Object} config configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalInput = function(parentEl, config, container) {
   if(!config) { var config = {}; }
   config.direction = [0,-1];
   config.fakeDirection = [0,1];
   config.ddConfig = {
      type: "input",
      allowedTypes: ["output"]
   };
   config.nMaxWires = 1;
   WireIt.util.TerminalInput.superclass.constructor.call(this,parentEl, config, container);
};
YAHOO.extend(WireIt.util.TerminalInput, WireIt.Terminal);




 /**
  * Class that extends Terminal to differenciate Input/Output terminals
  * @class WireIt.util.TerminalOutput
  * @extends WireIt.Terminal
  * @constructor
  * @param {DOMEl} parentEl Parent dom element
  * @param {Object} config configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalOutput = function(parentEl, config, container) {
  if(!config) { var config = {}; }
   config.direction = [0,1];
   config.fakeDirection = [0,-1];
   config.ddConfig = {
      type: "output",
      allowedTypes: ["input"]
   };
   WireIt.util.TerminalOutput.superclass.constructor.call(this,parentEl, config, container);
};
YAHOO.extend(WireIt.util.TerminalOutput, WireIt.Terminal);

