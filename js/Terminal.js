(function() {

   var Event = YAHOO.util.Event, lang = YAHOO.lang, Dom = YAHOO.util.Dom, CSS_PREFIX = "WireIt-";


   /**
    * Scissors widget to cut wires
    * @class Scissors
    * @namespace WireIt
    * @extends YAHOO.util.Element
    * @constructor
    * @param {WireIt.Terminal} terminal Associated terminal
    * @param {Object} oConfigs 
    */
   WireIt.Scissors = function(terminal, oConfigs) {
      WireIt.Scissors.superclass.constructor.call(this, document.createElement('div'), oConfigs);

      /**
       * The terminal it is associated to
       * @property _terminal
       * @type {WireIt.Terminal}
       */
      this._terminal = terminal;
      
      this.initScissors();
   };
   lang.extend(WireIt.Scissors, YAHOO.util.Element, {
      
      /**
       * Init the scissors
       * @method initScissors
       */
      initScissors: function() {
         
         // Display the cut button
         this.hideNow();
         this.addClass(CSS_PREFIX+"Wire-scissors");
         
         // The scissors are within the terminal element
         this.appendTo(this._terminal.container ? this._terminal.container.layer.el : this._terminal.el.parentNode.parentNode);

         // Ajoute un listener sur le scissor:
         this.on("mouseover", this.show, this, true);
         this.on("mouseout", this.hide, this, true);
         this.on("click", this.scissorClick, this, true);
         
         // On mouseover/mouseout to display/hide the scissors
         Event.addListener(this._terminal.el, "mouseover", this.mouseOver, this, true);
         Event.addListener(this._terminal.el, "mouseout", this.hide, this, true);
      },
      
      /**
       * @method setPosition
       */
      setPosition: function() {
         var pos = this._terminal.getXY();
         this.setStyle("left", (pos[0]+this._terminal.options.direction[0]*30-8)+"px");
         this.setStyle("top", (pos[1]+this._terminal.options.direction[1]*30-8)+"px");
      },
      /**
       * @method mouseOver
       */
      mouseOver: function() {
         if(this._terminal.wires.length > 0)  {
            this.show();
         }
      },

      /**
       * @method scissorClick
       */
      scissorClick: function() {
         this._terminal.removeAllWires();
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
         this.hideNow();
      },   
      /**
       * @method show
       */
      show: function() {
         this.setPosition();
         this.setStyle('display','');
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
      },
      /**
       * @method hide
       */
      hide: function() {
         this.terminalTimeout = lang.later(700,this,this.hideNow);
      },
      /**
       * @method hideNow
       */
      hideNow: function() {
         this.setStyle('display','none');
      }

   });




   
   
/**
 * This class is used for wire edition. It inherits from YAHOO.util.DDProxy and acts as a "temporary" Terminal.
 * @class TerminalProxy
 * @namespace WireIt
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {WireIt.Terminal} terminal Parent terminal
 * @param {Object} options Configuration object (see in properties for details)
 */
WireIt.TerminalProxy = function(terminal, options) {
   
   /**
    * Reference to the terminal parent
    */
   this.terminal = terminal;
   
   /**
    * Object containing the configuration object
    * <ul>
    *   <li>type: 'type' of this terminal. If no "allowedTypes" is specified in the options, the terminal will only connect to the same type of terminal</li>
    *   <li>allowedTypes: list of all the allowed types that we can connect to.</li>
    * </ul>
    * @property termConfig
    */
   // WARNING: the object config cannot be called "config" because YAHOO.util.DDProxy already has a "config" property
   this.termConfig = options || {};
   
   /**
    * Object that emulate a terminal which is following the mouse
    */
   this.fakeTerminal = null;
   
   // Init the DDProxy
   WireIt.TerminalProxy.superclass.constructor.call(this,this.terminal.el);
};

// Mode Intersect to get the DD objects
YAHOO.util.DDM.mode = YAHOO.util.DDM.INTERSECT;

YAHOO.extend(WireIt.TerminalProxy,YAHOO.util.DDProxy, {
   
   /**
    * @method startDrag
    */
   startDrag: function() {
      
      // If only one wire admitted, we remove the previous wire
      if(this.terminal.options.nMaxWires == 1 && this.terminal.wires.length == 1) {
         this.terminal.wires[0].remove();
      }
      // If the number of wires is at its maximum, prevent editing...
      else if(this.terminal.wires.length >= this.terminal.options.nMaxWires) {
         return;
      }
      
      this.fakeTerminal = {
         options: {direction: this.terminal.options.fakeDirection},
         pos: [200,200], 
         addWire: function() {},
         removeWire: function() {},
         getXY: function() { 
            var layers = YAHOO.util.Dom.getElementsByClassName('WireIt-Layer');
            if(layers.length > 0) {
               var orig = YAHOO.util.Dom.getXY(layers[0]);
               return [this.pos[0]-orig[0], this.pos[1]-orig[1]]; 
            }
            return this.pos;
         }
      };
      
      var parentEl = this.terminal.parentEl.parentNode;
      if(this.terminal.container) {
         parentEl = this.terminal.container.layer.el;
      }
      this.editingWire = new WireIt.Wire(this.terminal, this.fakeTerminal, parentEl, this.terminal.options.editingWireConfig);
      Dom.addClass(this.editingWire.element, CSS_PREFIX+'Wire-editing');
   },
   
   /**
    * @method onDrag
    */
   onDrag: function(e) {
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
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
         this.fakeTerminal.pos = (YAHOO.env.ua.ie) ? [e.clientX, e.clientY] : [e.clientX+window.pageXOffset, e.clientY+window.pageYOffset];
         //this.fakeTerminal.pos = [e.clientX, e.clientY];
      }
      this.editingWire.redraw();
   },
   
   
   /**
    * @method endDrag
    */
   endDrag: function(e) {
      if(this.editingWire) {
         this.editingWire.remove();
         this.editingWire = null;
      }
   },
   
   /**
    * @method onDragEnter
    */
   onDragEnter: function(e,ddTargets) {
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            ddTargets[i].terminal.setDropInvitation(true);
         }
      }
   },
   
   /**
    * @method onDragOut
    */
   onDragOut: function(e,ddTargets) { 
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            ddTargets[i].terminal.setDropInvitation(false);
         }
      }
   },
   
   /**
    * @method onDragDrop
    */
   onDragDrop: function(e,ddTargets) {
      
      // Prevention when the editing wire could not be created (due to nMaxWires)
      if(!this.editingWire) { return; }
      
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
               if( targetTerminalProxy.terminal.options.nMaxWires == 1) {
                  if(targetTerminalProxy.terminal.wires.length > 0) {
                     targetTerminalProxy.terminal.wires[0].remove();
                  }
                  
                  var w = new WireIt.Wire(this.terminal, targetTerminalProxy.terminal, parentEl, this.terminal.options.wireConfig);
                  w.redraw();
               }
               else if(targetTerminalProxy.terminal.wires.length < targetTerminalProxy.terminal.options.nMaxWires) {
                  var w = new WireIt.Wire(this.terminal, targetTerminalProxy.terminal, parentEl, this.terminal.options.wireConfig);
                  w.redraw();
               }
               else {
                  //console.log("Cannot connect to this terminal: nMaxWires = ", ddTargets[0].terminal.options.nMaxWires);
               }
            }
            else {
               //console.log("terminals already connected ");
            }
         }
      }
      
   },
   
   
   // to distinct from other YAHOO.util.DragDrop objects
   isWireItTerminal: true,
   
   
   /**
    * @method isValidWireTerminal
    */
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
 * Terminals represent the end points of the "wires"
 * @class Terminal
 * @constructor
 * @param {HTMLElement} parentEl Element that will contain the terminal
 * @param {Object} options Configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
WireIt.Terminal = function(parentEl, options, container) {
   
   /**
    * DOM parent element
    * @property parentEl
    * @type {HTMLElement}
    */
   this.parentEl = parentEl;
   
   /**
    * Container (optional). Parent container of this terminal
    * @property container
    * @type {WireIt.Container}
    */
   this.container = container;
   
   /**
    * List of the associated wires
    * @property wires
    * @type {Array}
    */
    this.wires = [];
   
   
   this.setOptions(options);
   
   /**
    * Event that is fired when a wire is added
    * You can register this event with myTerminal.eventAddWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventAddWire
    */
   this.eventAddWire = new YAHOO.util.CustomEvent("eventAddWire");
   
   /**
    * Event that is fired when a wire is removed
    * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventRemoveWire
    */
   this.eventRemoveWire = new YAHOO.util.CustomEvent("eventRemoveWire");
   
   /**
    * DIV dom element that will display the Terminal
    * @property el
    * @type {HTMLElement}
    */
   this.el = null;
   
   
   this.render();
   
   // Create the TerminalProxy object to make the terminal editable
   if(this.options.editable) {
      this.dd = new WireIt.TerminalProxy(this, this.options.ddConfig);
      this.scissors = new WireIt.Scissors(this);
   }
};

WireIt.Terminal.prototype = {
   
   /**
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) {
      
      /**
       * <p>Object that contains the terminal configuration:</p>
       * 
       * <ul>
       *   <li><b>name</b>: terminal name</li>
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
       * @property options
       */  
      this.options = {};
      this.options.name = options.name;
      this.options.direction = options.direction || [0,1];
      this.options.fakeDirection = options.fakeDirection || [-this.options.direction[0],-this.options.direction[1]];
      this.options.className = options.className || CSS_PREFIX+'Terminal';
      this.options.connectedClassName = options.connectedClassName || CSS_PREFIX+'Terminal-connected';
      this.options.dropinviteClassName = options.dropinviteClassName || CSS_PREFIX+'Terminal-dropinvite';
      this.options.editable = YAHOO.lang.isUndefined(options.editable) ? true : options.editable;
      this.options.nMaxWires = options.nMaxWires || Infinity;
      this.options.wireConfig = options.wireConfig || {};
      this.options.editingWireConfig = options.editingWireConfig || this.options.wireConfig;
      this.options.offsetPosition = options.offsetPosition;
   },

   /**
    * Show or hide the drop invitation. (by adding/removing this.options.dropinviteClassName CSS class)
    * @method setDropInvitation
    * @param {Boolean} display Show the invitation if true, hide it otherwise
    */
   setDropInvitation: function(display) {
      if(display) {
         Dom.addClass(this.el, this.options.dropinviteClassName);
      }
      else {
         Dom.removeClass(this.el, this.options.dropinviteClassName);
      }
   },

   /**
    * Render the DOM of the terminal
    * @method render
    */
   render: function() {
   
      // Create the DIV element
      this.el = WireIt.cn('div', {className: this.options.className} );
      if(this.options.name) { this.el.title = this.options.name; }
   
      // Set the offset position
      if(this.options.offsetPosition) {
         this.el.style.left = this.options.offsetPosition[0]+"px";
         this.el.style.top = this.options.offsetPosition[1]+"px";
      }
   
      // Append the element to the parent
      this.parentEl.appendChild(this.el);
   },


   /**
    * Add a wire to this terminal.
    * @method addWire
    * @param {WireIt.Wire} wire Wire instance to add
    */
   addWire: function(wire) {
   
      // Adds this wire to the list of connected wires :
      this.wires.push(wire);
   
      // Set class indicating that the wire is connected
      Dom.addClass(this.el, this.options.connectedClassName);
   
      // Fire the event
      this.eventAddWire.fire(wire);
   },

   /**
    * Remove a wire
    * @method removeWire
    * @param {WireIt.Wire} wire Wire instance to remove
    */
   removeWire: function(wire) {
      var index = WireIt.indexOf(wire, this.wires);   
      if( index != -1 ) {
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
      
         // Remove the connected class if it has no more wires:
         if(this.wires.length == 0) {
            Dom.removeClass(this.el, this.options.connectedClassName);
         }
      
         // Fire the event
         this.eventRemoveWire.fire(wire);
      }
   },


   /**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
    * @method getXY
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
    * @method remove
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
    * @method getConnectedTerminals
    * @return  {Array}  List of all connected terminals
    */
   getConnectedTerminals: function() {
      var terminalList = [];
      if(this.wires) {
         for(var i = 0 ; i < this.wires.length ; i++) {
            terminalList.push(this.wires[i].getOtherTerminal(this));
         }
      }
      return terminalList;
   },


   /**
    * Redraw all the wires connected to this terminal
    * @method redrawAllWires
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
    * @method removeAllWires
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
  * @param {HTMLElement} parentEl Parent dom element
  * @param {Object} options configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalInput = function(parentEl, options, container) {
   WireIt.util.TerminalInput.superclass.constructor.call(this,parentEl, options, container);
};
YAHOO.extend(WireIt.util.TerminalInput, WireIt.Terminal, {
   
   /**
    * Override setOptions to add the default options for TerminalInput
    * @method setOptions
    */
   setOptions: function(options) {
      
      WireIt.util.TerminalInput.superclass.setOptions.call(this,options);
      
      this.options.direction = options.direction || [0,-1];
      this.options.fakeDirection = options.fakeDirection || [0,1];
      this.options.ddConfig = {
         type: "input",
         allowedTypes: ["output"]
      };
      this.options.nMaxWires = options.nMaxWires || 1;
   }
   
});




 /**
  * Class that extends Terminal to differenciate Input/Output terminals
  * @class WireIt.util.TerminalOutput
  * @extends WireIt.Terminal
  * @constructor
  * @param {HTMLElement} parentEl Parent dom element
  * @param {Object} options configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalOutput = function(parentEl, options, container) {
   WireIt.util.TerminalOutput.superclass.constructor.call(this,parentEl, options, container);
};
YAHOO.extend(WireIt.util.TerminalOutput, WireIt.Terminal, {
   
   /**
    * Override setOptions to add the default options for TerminalOutput
    * @method setOptions
    */
   setOptions: function(options) {
      
      WireIt.util.TerminalOutput.superclass.setOptions.call(this,options);
      
      this.options.direction = options.direction || [0,1];
      this.options.fakeDirection = options.fakeDirection || [0,-1];
      this.options.ddConfig = {
          type: "output",
          allowedTypes: ["input"]
       };
   }
   
});


})();