(function() {

   var util = YAHOO.util;
   var Event = util.Event, lang = YAHOO.lang, Dom = util.Dom, CSS_PREFIX = "WireIt-";


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
	WireIt.Scissors.visibleInstance = null;
   lang.extend(WireIt.Scissors, util.Element, {
      
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
			
			if(WireIt.Scissors.visibleInstance && WireIt.Scissors.visibleInstance != this) {
				if(WireIt.Scissors.visibleInstance.terminalTimeout) { WireIt.Scissors.visibleInstance.terminalTimeout.cancel(); }
				WireIt.Scissors.visibleInstance.hideNow(); 
			}
			WireIt.Scissors.visibleInstance = this;
			
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
			WireIt.Scissors.visibleInstance = null;
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
 * @param {Object} options Configuration object (see "termConfig" property for details)
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
    *   <li>{Integer} terminalProxySize: size of the drag drop proxy element. default is 10 for "10px"</li>
    * </ul>
    * @property termConfig
    */
   // WARNING: the object config cannot be called "config" because YAHOO.util.DDProxy already has a "config" property
   this.termConfig = options || {};
   
   this.terminalProxySize = options.terminalProxySize || 10;
   
   /**
    * Object that emulate a terminal which is following the mouse
    */
   this.fakeTerminal = null;
   
   // Init the DDProxy
   WireIt.TerminalProxy.superclass.constructor.call(this,this.terminal.el, undefined, {
      dragElId: "WireIt-TerminalProxy",
      resizeFrame: false,
      centerFrame: true
   });
};

// Mode Intersect to get the DD objects
util.DDM.mode = util.DDM.INTERSECT;

lang.extend(WireIt.TerminalProxy, util.DDProxy, {
   
   /**
    * Took this method from the YAHOO.util.DDProxy class
    * to overwrite the creation of the proxy Element with our custom size
    * @method createFrame
    */
   createFrame: function() {
        var self=this, body=document.body;
        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }
        var div=this.getDragEl(), Dom=YAHOO.util.Dom;
        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;
            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;
            var size = this.terminalProxySize+"px";
            s.height     = size; 
            s.width      = size;
            var _data = document.createElement('div');
            Dom.setStyle(_data, 'height', '100%');
            Dom.setStyle(_data, 'width', '100%');
            Dom.setStyle(_data, 'background-color', '#ccc');
            Dom.setStyle(_data, 'opacity', '0');
            div.appendChild(_data);
            body.insertBefore(div, body.firstChild);
        }
    },
   
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
      
      var halfProxySize = this.terminalProxySize/2;
      this.fakeTerminal = {
         options: {direction: this.terminal.options.fakeDirection},
         pos: [200,200], 
         addWire: function() {},
         removeWire: function() {},
         getXY: function() { 
            var layers = Dom.getElementsByClassName('WireIt-Layer');
            if(layers.length > 0) {
               var orig = Dom.getXY(layers[0]);
               return [this.pos[0]-orig[0]+halfProxySize, this.pos[1]-orig[1]+halfProxySize]; 
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
      
      // Connect to the FIRST target terminal
      var targetTerminalProxy = null;
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            targetTerminalProxy =  ddTargets[i];
            break;
         }
      }

      // Quit if no valid terminal found
      if( !targetTerminalProxy ) { 
         return;
      }
      
      // Remove the editing wire
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
      if(termAlreadyConnected) {
         //console.log("terminals already connected ");
         return;
      }
         
      var parentEl = this.terminal.parentEl.parentNode;
      if(this.terminal.container) {
         parentEl = this.terminal.container.layer.el;
      }
      
      // Switch the order of the terminals if tgt as the "alwaysSrc" property
      var term1 = this.terminal;
      var term2 = targetTerminalProxy.terminal;
      if(term2.options.alwaysSrc) {
         term1 = targetTerminalProxy.terminal;
         term2 = this.terminal;
      }
      
      // Check the number of wires for this terminal
      var tgtTerm = targetTerminalProxy.terminal;
      if( tgtTerm.options.nMaxWires == 1) {
         if(tgtTerm.wires.length > 0) {
            tgtTerm.wires[0].remove();
         }
         var w = new WireIt.Wire(term1, term2, parentEl, term1.options.wireConfig);
         w.redraw();
      }
      else if(tgtTerm.wires.length < tgtTerm.options.nMaxWires) {
         var w = new WireIt.Wire(term1, term2, parentEl, term1.options.wireConfig);
         w.redraw();
      }
      /*else {
         console.log("Cannot connect to this terminal: nMaxWires = ", ddTargets[0].terminal.options.nMaxWires);
      }*/
      
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
      
      // Check the allowSelfWiring
      if(this.terminal.container) {
         if(this.terminal.container.options.preventSelfWiring) {
            if(DDterminal.terminal.container == this.terminal.container) {
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
   this.eventAddWire = new util.CustomEvent("eventAddWire");
   
   /**
    * Event that is fired when a wire is removed
    * You can register this event with myTerminal.eventRemoveWire.subscribe(function(e,params) { var wire=params[0];}, scope);
    * @event eventRemoveWire
    */
   this.eventRemoveWire = new util.CustomEvent("eventRemoveWire");
   
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
       *   <li><b>offsetPosition</b>: offset position from the parentEl position. Can be an array [top,left] or an object {left: 100, bottom: 20} or {right: 10, top: 5} etc... (default to [0,0])</li>
       *   <li><b>ddConfig</b>: configuration of the WireIt.TerminalProxy object (only if editable)</li>
       *   <li><b>alwaysSrc</b>: alwaysSrc forces this terminal to be the src terminal in the wire config (default false, only if editable)</li>
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
      this.options.editable = lang.isUndefined(options.editable) ? true : options.editable;
      this.options.nMaxWires = options.nMaxWires || Infinity;
      this.options.wireConfig = options.wireConfig || {};
      this.options.editingWireConfig = options.editingWireConfig || this.options.wireConfig;
      this.options.offsetPosition = options.offsetPosition;
      this.options.alwaysSrc = lang.isUndefined(options.alwaysSrc) ? false : options.alwaysSrc;
      this.options.ddConfig = options.ddConfig || {};
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
      var pos = this.options.offsetPosition;
      if(pos) {
         // Kept old version [x,y] for retro-compatibility
         if( lang.isArray(pos) ) {
            this.el.style.left = pos[0]+"px";
            this.el.style.top = pos[1]+"px";
         }
         // New version: {top: 32, left: 23}
         else if( lang.isObject(pos) ) {
            for(var key in pos) {
               if(pos.hasOwnProperty(key) && pos[key] != ""){
                  this.el.style[key] = pos[key]+"px";
               }
            }
         }
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
      var index = WireIt.indexOf(wire, this.wires), w;   
      if( index != -1 ) {
         
         this.wires[index].destroy();
         
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
lang.extend(WireIt.util.TerminalInput, WireIt.Terminal, {
   
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
lang.extend(WireIt.util.TerminalOutput, WireIt.Terminal, {
   
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
      this.options.alwaysSrc = true;
   }
   
});


})();