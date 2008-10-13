/**
 * @fileoverview Terminals represent the end points of the "wires"
 */
(function() {

   var Event = YAHOO.util.Event, lang = YAHOO.lang, Dom = YAHOO.util.Dom, CSS_PREFIX = "WireIt-";


   /**
    * @class Scissors widget to cut wires
    * @extends YAHOO.util.Element
    * @constructor
    * @param {WireIt.Terminal} terminal Associated terminal
    * @param {Object} oConfigs 
    */
   WireIt.Scissors = function(terminal, oConfigs) {
      WireIt.Scissors.superclass.constructor.call(this, document.createElement('div'), oConfigs);

      this._terminal = terminal;
      this.initScissors();
   };
   lang.extend(WireIt.Scissors, YAHOO.util.Element, 
      /**
       * @scope WireIt.Scissors.prototype
       */
      {
      
      initScissors: function() {
         
         // Display the cut button
         this.hideNow();
         this.addClass(CSS_PREFIX+"Wire-scissors");
         
         // The scissors are within the terminal element
         this.appendTo(this._terminal.el);
         this.setStyle("left", (this._terminal.config.direction[0]*30+8)+"px");
         this.setStyle("top", (this._terminal.config.direction[1]*30+8)+"px");

         // Ajoute un listener sur le scissor:
         this.on("mouseover", this.show, this, true);
         this.on("mouseout", this.hide, this, true);
         this.on("click", this.scissorClick, this, true);
         
         // On mouseover/mouseout to display/hide the scissors
         Event.addListener(this._terminal.el, "mouseover", this.mouseOver, this, true);
         Event.addListener(this._terminal.el, "mouseout", this.hide, this, true);
      },
      
      mouseOver: function() {
         if(this._terminal.wires.length > 0)  {
            this.show();
         }
      },

      scissorClick: function() {
         this._terminal.removeAllWires();
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
         this.hideNow();
      },   
      
      show: function() {
         this.setStyle('display','');
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
      },
      
      hide: function() {
         this.terminalTimeout = lang.later(700,this,this.hideNow);
      },
      
      hideNow: function() {
         this.setStyle('display','none');
      }

   });




   
   
/**
 * @class This class is used for wire edition. It inherits from YAHOO.util.DDProxy and acts as a "temporary" Terminal.
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {WireIt.Terminal} terminal Parent terminal
 * @param {Object} config Configuration object (see in properties for details)
 */
WireIt.TerminalProxy = function(terminal, config) {
   
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
   
   /**
    * Object that emulate a terminal which is following the mouse
    */
   this.fakeTerminal = null;
   
   // Init the DDProxy
   WireIt.TerminalProxy.superclass.constructor.call(this,this.terminal.el);
};

// Mode Intersect to get the DD objects
YAHOO.util.DDM.mode = YAHOO.util.DDM.INTERSECT;

YAHOO.extend(WireIt.TerminalProxy,YAHOO.util.DDProxy,
/**
 * @scope WireIt.TerminalProxy.prototype   
 */   
{      
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
         addWire: function() {},
         removeWire: function() {},
         getXY: function() { 
            return this.pos; 
         }
      };
      
      var parentEl = this.terminal.parentEl.parentNode;
      if(this.terminal.container) {
         parentEl = this.terminal.container.layer.el;
      }
      this.editingWire = new WireIt.Wire(this.terminal, this.fakeTerminal, parentEl, this.terminal.config.editingWireConfig);
      Dom.addClass(this.editingWire.element, CSS_PREFIX+'Wire-editing');
   },
   
   onDrag: function(e) {
      if(this.terminal.container) {
         var obj = this.terminal.container.layer.el;
         var curleft = curtop = 0;
        	if (obj.offsetParent) {
        		do {
        			curleft += obj.offsetLeft;
        			curtop += obj.offsetTop;
        			obj = obj.offsetParent ;
        		} while ( obj = obj.offsetParent );
        	}
         
         this.fakeTerminal.pos = [e.clientX-curleft+this.terminal.container.layer.el.scrollLeft,
                                  e.clientY-curtop+this.terminal.container.layer.el.scrollTop];
      }
      else {
         this.fakeTerminal.pos = [e.clientX+window.pageXOffset, e.clientY+window.pageYOffset];
      }
      this.editingWire.redraw();
   },
   
   endDrag: function(e) {
      if(this.editingWire) {
         this.editingWire.remove();
         this.editingWire = null;
      }
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
      
      var targetTerminalProxy = null;
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( ddTargets[i].isWireItTerminal ) {
            targetTerminalProxy =  ddTargets[i];
         }
      }
      
      // Connect to the FIRST target terminal
      if( targetTerminalProxy ) {
         if( this.isValidWireTerminal(targetTerminalProxy) ) { 
            
            this.editingWire.remove();
            this.editingWire = null;
               
            // Don't create the wire if it already exists between the 2 terminals !!
            var termAlreadyConnected = false;
            for(var i = 0 ; i < this.terminal.wires.length ; i++) {
               if(this.terminal.wires[i].terminal1 == this.terminal) {
                  if( this.terminal.wires[i].terminal2 == targetTerminalProxy.terminal) {
                     termAlreadyConnected = true;
                     break;
                  }
               }
               else if(this.terminal.wires[i].terminal2 == this.terminal) {
                  if( this.terminal.wires[i].terminal1 == targetTerminalProxy.terminal) {
                     termAlreadyConnected = true;
                     break;
                  }
               }
            }
            
            // Create the wire only if the terminals aren't connected yet
            if(!termAlreadyConnected) {
               
               
               var parentEl = this.terminal.parentEl.parentNode;
               if(this.terminal.container) {
                  parentEl = this.terminal.container.layer.el;
               }
               
               // Check the number of wires for this terminal
               if( targetTerminalProxy.terminal.config.nMaxWires == 1) {
                  if(targetTerminalProxy.terminal.wires.length > 0) {
                     targetTerminalProxy.terminal.wires[0].remove();
                  }
                  
                  var w = new WireIt.Wire(this.terminal, targetTerminalProxy.terminal, parentEl, this.terminal.config.wireConfig);
                  w.redraw();
               }
               else if(targetTerminalProxy.terminal.wires.length < targetTerminalProxy.terminal.config.nMaxWires) {
                  var w = new WireIt.Wire(this.terminal, targetTerminalProxy.terminal, parentEl, this.terminal.config.wireConfig);
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
            if( WireIt.indexOf(DDterminal.termConfig.type, this.termConfig.allowedTypes) == -1 ) {
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
            if( WireIt.indexOf(this.termConfig.type, DDterminal.termConfig.allowedTypes) == -1 ) {
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
    *   <li><b>direction</b>: direction vector of the wires when connected to this terminal (default [0,1])</li>
    *   <li><b>fakeDirection</b>: direction vector of the "editing" wire when it started from this terminal (default to -direction)</li>
    *   <li><b>editable</b>: boolean that makes the terminal editable (default to true)</li>
    *   <li><b>nMaxWires</b>: maximum number of wires for this terminal (default to Infinity)</li>
    *   <li><b>offsetPosition</b>: offset position from the parentEl position (default to [0,0])</li>
    *   <li><b>ddConfig</b>: configuration of the WireIt.TerminalProxy object (only if editable)</li>
    *   <li><b>className</b>: CSS class name of the terminal (default to "WireIt-Terminal")</li>
    *   <li><b>connectedClassName</b>: CSS class added to the terminal when it is connected (default to "WireIt-Terminal-connected")</li>
    *   <li><b>dropinviteClassName</b>: CSS class added for drop invitation (default to "WireIt-Terminal-dropinvite")</li>
    * </ul>
    */  
   this.config = config || {};
   this.config.direction = this.config.direction || [0,1];
   this.config.fakeDirection = this.config.fakeDirection || [-this.config.direction[0],-this.config.direction[1]];
   this.config.className = this.config.className || CSS_PREFIX+'Terminal';
   this.config.connectedClassName = this.config.connectedClassName || CSS_PREFIX+'Terminal-connected';
   this.config.dropinviteClassName = this.config.dropinviteClassName || CSS_PREFIX+'Terminal-dropinvite';
   this.config.editable = YAHOO.lang.isUndefined(this.config.editable) ? true : this.config.editable;
   this.config.nMaxWires = this.config.nMaxWires || Infinity;
   this.config.wireConfig = this.config.wireConfig || {};
   this.config.editingWireConfig = this.config.editingWireConfig || this.config.wireConfig;
   
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
   
   // Create the TerminalProxy object to make the terminal editable
   if(this.config.editable) {
      this.dd = new WireIt.TerminalProxy(this, this.config.ddConfig);
      this.scissors = new WireIt.Scissors(this);
   }
};

WireIt.Terminal.prototype = {

   /**
    * Show or hide the drop invitation. (by adding/removing this.config.dropinviteClassName CSS class)
    * @param {Boolean} display Show the invitation if true, hide it otherwise
    */
   setDropInvitation: function(display) {
      if(display) {
         Dom.addClass(this.el, this.config.dropinviteClassName);
      }
      else {
         Dom.removeClass(this.el, this.config.dropinviteClassName);
      }
   },

   /**
    * Render the DOM of the terminal
    */
   render: function() {
   
      // Create the DIV element
      this.el = WireIt.cn('div', {className: this.config.className} );
      if(this.config.name) { this.el.title = this.config.name; }
   
      // Set the offset position
      if(this.config.offsetPosition) {
         this.el.style.left = this.config.offsetPosition[0]+"px";
         this.el.style.top = this.config.offsetPosition[1]+"px";
      }
   
      // Append the element to the parent
      this.parentEl.appendChild(this.el);
   },


   /**
    * Add a wire to this terminal.
    * @param {WireIt.Wire} wire Wire instance to add
    */
   addWire: function(wire) {
   
      // Adds this wire to the list of connected wires :
      this.wires.push(wire);
   
      // Set class indicating that the wire is connected
      Dom.addClass(this.el, this.config.connectedClassName);
   
      // Fire the event
      this.eventAddWire.fire(wire);
   },

   /**
    * Remove a wire
    * @param {WireIt.Wire} wire Wire instance to remove
    */
   removeWire: function(wire) {
      var index = WireIt.indexOf(wire, this.wires);   
      if( index != -1 ) {
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
      
         // Remove the connected class if it has no more wires:
         if(this.wires.length == 0) {
            Dom.removeClass(this.el, this.config.connectedClassName);
         }
      
         // Fire the event
         this.eventRemoveWire.fire(wire);
      }
   },


   /**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
    */
   getXY: function() {
   
      var layerEl = this.container && this.container.layer ? this.container.layer.el : document.body;

      var obj = this.el;
      var curleft = curtop = 0;
     	if (obj.offsetParent) {
     		do {
     			curleft += obj.offsetLeft;
     			curtop += obj.offsetTop;
     			obj = obj.offsetParent;
     		} while ( !!obj && obj != layerEl);
     	}
  	
     	return [curleft+15,curtop+15];
   },



   /**
    * Remove the terminal from the DOM
    */
   remove: function() {
      // This isn't very nice but...
      // the method Wire.remove calls Terminal.removeWire to remove the reference
      while(this.wires.length > 0) {
         this.wires[0].remove();
      }
      this.parentEl.removeChild(this.el);
      
      // Remove all event listeners
      Event.purgeElement(this.el);
      
      // Remove scissors widget
      if(this.scissors) {
         Event.purgeElement(this.scissors.get('element'));
      }
      
   },



   /**
    * Returns a list of all the terminals connecter to this terminal through its wires.
    * @return  {Array}  List of all connected terminals
    */
   getConnectedTerminals: function() {
      var terminalList = [];
      if(this.wires) {
         for(var i = 0 ; i < this.wires.length ; i++) {
            terminalList.push(this.wires[i].getOtherTerminal());
         }
      }
      return terminalList;
   },


   /**
    * Redraw all the wires connected to this terminal
    */
   redrawAllWires: function() {
      if(this.wires) {
         for(var i = 0 ; i < this.wires.length ; i++) {
            this.wires[i].redraw();
         }
      }
   },
   
   /** 
    * Remove all wires
    */
   removeAllWires: function() {
      while(this.wires.length > 0) {
         this.wires[0].remove();
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


})();