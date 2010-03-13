(function() {

   var util = YAHOO.util;
   var Event = util.Event, lang = YAHOO.lang, Dom = util.Dom, CSS_PREFIX = "WireIt-";

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
      this.setPosition(this.options.offsetPosition);
   
      // Append the element to the parent
      this.parentEl.appendChild(this.el);
   },

	/**
	 * TODO
	 */
   setPosition: function(pos) {
		if(pos) {
	    	//Clear the current position
	    	this.el.style.left = "";
	    	this.el.style.top = "";
	    	this.el.style.right = "";
	    	this.el.style.bottom = "";
	    
	    	// Kept old version [x,y] for retro-compatibility
	    	if( lang.isArray(pos) ) {
				this.el.style.left = pos[0]+"px";
				this.el.style.top = pos[1]+"px";
	    	}
	    	// New version: {top: 32, left: 23}
	    	else if( lang.isObject(pos) ) {
				for(var key in pos) {
		    		if(pos.hasOwnProperty(key) && pos[key] != ""){ //This will ignore the number 0 since 0 == "" in javascript (firefox 3.0
						this.el.style[key] = pos[key]+"px";
		    		}
				}
	    	}
		}
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

})();