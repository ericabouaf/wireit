/**
 * @fileoverview This class represents the module and contains multiple terminals.
 */
/**
 * @class WireIt.Container
 * @constructor
 * @param {Object}   config      Configuration object (see properties)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.Container = function(config, layer) {
   
   /**
    * Main config object
    * <ul>
    *    <li>terminals: list of the terminals configuration</li>
    *    <li>draggable: boolean that enables drag'n drop on this container (default: true)</li>
    *    <li>className: CSS class name for the container element (default 'WireIt-Container')</li>
    *    <li>position: initial position of the container</li>
    *    <li>ddHandle: (only if draggable) boolean indicating we use a handle for drag'n drop (default true)</li>
    *    <li>ddHandleClassName: CSS class name for the drag'n drop handle (default 'WireIt-Container-ddhandle')</li>
    *    <li>resizable: boolean that makes the container resizable (default true)</li>
    *    <li>resizeHandleClassName: CSS class name for the resize handle (default 'WireIt-Container-resizehandle')</li>
    *    <li>width: initial width of the container (no default so it autoadjusts to the content)</li>
    *    <li>height: initial height of the container (default 100)</li>
    *    <li>close: display a button to close the container (default true)</li>
    *    <li>closeButtonClassName: CSS class name for the close button (default "WireIt-Container-closebutton")</li>
    * </ul>
    */
   this.config = config || {};
   this.config.terminals = this.config.terminals || [];
   this.config.draggable = (typeof this.config.draggable == "undefined") ? true : this.config.draggable ;
   this.config.position = this.config.position || [100,100];
   this.config.className = this.config.className || 'WireIt-Container';
   
   this.config.ddHandle = (typeof this.config.ddHandle == "undefined") ? true : this.config.ddHandle;
   this.config.ddHandleClassName = this.config.ddHandleClassName || "WireIt-Container-ddhandle";
   
   this.config.resizable = (typeof this.config.resizable == "undefined") ? true : this.config.resizable;
   this.config.resizeHandleClassName = this.config.resizeHandleClassName || "WireIt-Container-resizehandle";
   
   this.config.width = this.config.width; // no default
   this.config.height = this.config.height || 100;
   
   this.config.close = (typeof this.config.close == "undefined") ? true : this.config.close;
   this.config.closeButtonClassName = this.config.closeButtonClassName || "WireIt-Container-closebutton";
   
   /**
    * the WireIt.Layer object that schould contain this container
    */
   this.layer = layer;
   
   /**
    * List of the terminals
    */
   this.terminals = [];
   
   /**
    * List of all the wires connected to this container terminals
    */
   this.wires = [];
   
   /**
    * Container DOM element
    */
   this.el = null;
   
   /**
    * Body element
    */
   this.bodyEl = null;
   
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
   
   // Render the div object
   this.render();
   
   // Init the terminals
   this.initTerminals( this.config.terminals);
   
	// Make the container draggable
	if(this.config.draggable) {
		   
	   if(this.config.resizable) {
      	// Make resizeable   
      	this.ddResize = new WireIt.util.DDResize(this);
      	this.ddResize.eventResize.subscribe(this.onResize, this);
	   }
	   
	   // Use the drag'n drop utility to make the container draggable
	   this.dd = new WireIt.util.DD(this.terminals,this.el);
	   
	   // Sets ddHandle as the drag'n drop handle
	   if(this.config.ddHandle) {
   	   this.dd.setHandleElId(this.ddHandle);
	   }
	   
	   // Mark the resize handle as an invalid drag'n drop handle and vice versa
	   if(this.config.resizable) {
   	   this.dd.addInvalidHandleId(this.ddResizeHandle);
      	this.ddResize.addInvalidHandleId(this.ddHandle);
	   }
   }
   
};

/**
 * Function called when the container is being resized.
 * It doesn't do anything, so please override it.
 */
WireIt.Container.prototype.onResize = function(event, args) {
   var size = args[0];
};

/**
 * Render the dom of the container
 */
WireIt.Container.prototype.render = function() {
   
   // Create the element
   this.el = WireIt.cn('div', {className: this.config.className}, {width: this.config.width+"px", height: this.config.height+"px"});
   
   // Adds a handler for mousedown so we can notice the layer
   YAHOO.util.Event.addListener(this.el, "mousedown", this.onMouseDown, this, true);
   
   if(this.config.ddHandle) {
      // Create the drag/drop handle
   	this.ddHandle = WireIt.cn('div', {className: this.config.ddHandleClassName});
   	this.el.appendChild(this.ddHandle);
   }
   
   // Create the body element
   this.bodyEl = WireIt.cn('div', {className: "body"});
   this.el.appendChild(this.bodyEl);
   
   if(this.config.resizable) {
      // Create the resize handle
   	this.ddResizeHandle = WireIt.cn('div', {className: this.config.resizeHandleClassName} );
   	this.el.appendChild(this.ddResizeHandle);
   }
   
   if(this.config.close) {
      // Close button
      this.closeButton = WireIt.cn('div', {className: this.config.closeButtonClassName} );
      this.el.appendChild(this.closeButton);
      YAHOO.util.Event.addListener(this.closeButton, "click", this.onCloseButton, this, true);
   }
   
   // Append to the layer element
   this.layer.el.appendChild(this.el);
   
	// Set the position
	this.el.style.left = this.config.position[0]+"px";
	this.el.style.top = this.config.position[1]+"px";
};

/**
 * Sets the content of the body element
 * @param {String or DomEl} content
 */
WireIt.Container.prototype.setBody = function(content) {
   if(typeof content == "string") {
      this.bodyEl.innerHTML = content;
   }
   else {
      this.bodyEl.innerHTML = "";
      this.bodyEl.appendChild(content);
   }
};


/**
 * Called when the user made a mouse down on the container and sets the focus to this container (only if within a Layer)
 */
WireIt.Container.prototype.onMouseDown = function() {
   if(this.layer) {
      if(this.layer.focusedContainer && this.layer.focusedContainer != this) {
         this.layer.focusedContainer.removeFocus();
      }
      this.setFocus();
      this.layer.focusedContainer = this;
   }
};

/**
 * Adds the class that shows the container as "focused"
 */
WireIt.Container.prototype.setFocus = function() {
   YAHOO.util.Dom.addClass(this.el, "WireIt-Container-focused");
};

/**
 * Remove the class that shows the container as "focused"
 */
WireIt.Container.prototype.removeFocus = function() {
   YAHOO.util.Dom.removeClass(this.el, "WireIt-Container-focused");
};

/**
 * Called when the user clicked on the close button
 */
WireIt.Container.prototype.onCloseButton = function() {
   this.layer.removeContainer(this);
};

/**
 * Remove this container from the dom
 */
WireIt.Container.prototype.remove = function() {
   
   // Remove the terminals (and thus remove the wires)
   this.removeAllTerminals();
   
   // Remove from the dom
   this.layer.el.removeChild(this.el);
};


/**
 * Call the addTerminal method for each terminal configuration.
 */
WireIt.Container.prototype.initTerminals = function(terminalConfigs) {
   for(var i = 0 ; i < terminalConfigs.length ; i++) {
      this.addTerminal(terminalConfigs[i]);
   }
};


/**
 * Instanciate the terminal from the class pointer "xtype" (default WireIt.Terminal)
 * @return {WireIt.Terminal}  terminal Created terminal
 */
WireIt.Container.prototype.addTerminal = function(terminalConfig) {
   
   // Terminal type
   var type = eval(terminalConfig.xtype || "WireIt.Terminal");
   
   // Instanciate the terminal
   var term = new type(this.el, terminalConfig, this);
   
   // Add the terminal to the list
   this.terminals.push( term );
   
   // Event listeners
   term.eventAddWire.subscribe(this.onAddWire, this, true);
   term.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
   
   return term;
};

/**
 * This method is called when a wire is added to one of the terminals
 * @param {Event} event The eventAddWire event fired by the terminal
 * @param {Array} args This array contains a single element args[0] which is the added Wire instance
 */
WireIt.Container.prototype.onAddWire = function(event, args) {
   var wire = args[0];
   // add the wire to the list if it isn't in
   if( this.wires.indexOf(wire) == -1 ) {
      this.wires.push(wire);
      this.eventAddWire.fire(wire);
   } 
};

/**
 * This method is called when a wire is removed from one of the terminals
 * @param {Event} event The eventRemoveWire event fired by the terminal
 * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
 */
WireIt.Container.prototype.onRemoveWire = function(event, args) {
   var wire = args[0];
   var index = this.wires.indexOf(wire);
   if( index != -1 ) {
      this.eventRemoveWire.fire(wire);
      this.wires[index] = null;
   }
   this.wires = this.wires.compact();
};

/**
 * Remove all terminals
 */
WireIt.Container.prototype.removeAllTerminals = function() {
   for(var i = 0 ; i < this.terminals.length ; i++) {
      this.terminals[i].remove();
   }
   this.terminals = [];
};

/**
 * Redraw all the wires connected to the terminals of this container
 */
WireIt.Container.prototype.redrawAllWires = function() {
   for(var i = 0 ; i < this.terminals.length ; i++) {
      this.terminals[i].redrawAllWires();
   }
};


/**
 * Return the config of this container.
 */
WireIt.Container.prototype.getConfig = function() {
   var obj = {};
   
   // Position
   obj.position = YAHOO.util.Dom.getXY(this.el);
   if(this.layer) {
      var layerPos = YAHOO.util.Dom.getXY(this.layer.el);
      obj.position[0] -= layerPos[0];
      obj.position[1] -= layerPos[1];
   }
   
   // xtype
   if(this.config.xtype) {
      obj.xtype = this.config.xtype;
   }
   
   /*
   obj.terminals = [];
   for(var i = 0 ; i < this.terminals.length ; i++) {
      obj.terminals.push( this.terminals[i].getConfig() );
   }*/
   
   return obj;
};
