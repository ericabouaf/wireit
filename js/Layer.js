/**
 * @fileoverview A layer encapsulate a bunch of containers and wires.
 */
/**
 * @class WireIt.Layer
 * @constructor
 * @param {Object}   config   Configuration object (see the properties)
 */
WireIt.Layer = function(config) {
   
   /**
    * Configuration object of the layer
    * <ul>
    *   <li>className: CSS class name for the layer element (default 'WireIt-Layer')</li>
    *   <li>parentEl: DOM element that schould contain the layer (default document.body)</li>
    *   <li>containers: array of container configuration objects</li>  
    *   <li>wires: array of wire configuration objects</li>
    * </ul>
    */
   this.config = config || {};
   this.config.className = this.config.className || 'WireIt-Layer';
   this.config.parentEl = this.config.parentEl || document.body;
   this.config.containers = this.config.containers || [];
   this.config.wires = this.config.wires || [];
   
   /**
    * List of all the WireIt.Container (or subclass) instances in this layer
    */
   this.containers = [];
   
   /**
    * List of all the WireIt.Wire (or subclass) instances in this layer
    */
   this.wires = [];
   
   /**
    * Layer DOM element
    */
   this.el = null;
   
   
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
   
   
   this.render();
   
   this.initContainers();
   
   this.initWires();
   
};

/**
 * Create the dom of the layer and insert it into the parent element
 */
WireIt.Layer.prototype.render = function() {
   
   this.el = WireIt.cn('div', {className: this.config.className} );
   
   this.config.parentEl.appendChild(this.el);
};


/**
 * Create all the containers passed as config
 */
WireIt.Layer.prototype.initContainers = function() {
   for(var i = 0 ; i < this.config.containers.length ; i++) {
      this.addContainer(this.config.containers[i]);
   } 
};

/**
 * Create all the wires passed in the config
 */
WireIt.Layer.prototype.initWires = function() {
   for(var i = 0 ; i < this.config.wires.length ; i++) {
      this.addWire(this.config.wires[i]);
   }
};

/**
 * Instanciate a wire given its "xtype" (default to WireIt.Wire)
 * @param {Object} wireConfig  Wire configuration object (see WireIt.Wire class for details)
 * @return {WireIt.Wire} Wire instance build from the xtype
 */
WireIt.Layer.prototype.addWire = function(wireConfig) {
   var type = eval(wireConfig.xtype || "WireIt.Wire");
   
   var src = wireConfig.src;
   var tgt = wireConfig.tgt;
   
   var terminal1 = this.containers[src.moduleId].terminals[src.terminalId];
   var terminal2 = this.containers[tgt.moduleId].terminals[tgt.terminalId];
   
   var wire = new type( terminal1, terminal2, this.el);
   wire.redraw();
   
   return wire;
};

/**
 * Instanciate a container given its "xtype": WireIt.Container (default) or a subclass of it.
 * @param {Object} containerConfig  Container configuration object (see WireIt.Container class for details)
 * @return {WireIt.Container} Container instance build from the xtype
 */
WireIt.Layer.prototype.addContainer = function(containerConfig) {
   
   var type = eval(containerConfig.xtype || "WireIt.Container");
   var container = new type(containerConfig, this);
   
   this.containers.push( container );
   
   // Event listeners
   container.eventAddWire.subscribe(this.onAddWire, this, true);
   container.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
   
   return container;
};

/**
 * Remove a container
 * @param {WireIt.Container} container Container instance to remove
 */
WireIt.Layer.prototype.removeContainer = function(container) {
   var index = this.containers.indexOf(container);
   if( index != -1 ) {
      container.remove();
      this.containers[index] = null;
      this.containers = this.containers.compact();
   }
};

/**
 * Update the wire list when any of the containers fired the eventAddWire
 * @param {Event} event The eventAddWire event fired by the container
 * @param {Array} args This array contains a single element args[0] which is the added Wire instance
 */
WireIt.Layer.prototype.onAddWire = function(event, args) {
   var wire = args[0];
   // add the wire to the list if it isn't in
   if( this.wires.indexOf(wire) == -1 ) {
      this.wires.push(wire);
      // Re-Fire an event at the layer level
      this.eventAddWire.fire(wire);
   }
};

/**
 * Update the wire list when a wire is removed
 * @param {Event} event The eventRemoveWire event fired by the container
 * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
 */
WireIt.Layer.prototype.onRemoveWire = function(event, args) {
   var wire = args[0];
   var index = this.wires.indexOf(wire);
   if( index != -1 ) {
      this.eventRemoveWire.fire(wire);
      this.wires[index] = null;
      this.wires = this.wires.compact();
   }
};

/**
 * Remove all the containers in this layer (and the associated terminals and wires)
 */
WireIt.Layer.prototype.removeAllContainers = function() {
   for(var i = this.containers.length-1 ; i >= 0 ; i--) {
      this.removeContainer(this.containers[i]);
   }
};



/**
 * Return an object that represent the state of the layer including the containers and the wires
 * @return {Obj} layer configuration
 */
WireIt.Layer.prototype.getWiring = function() {
   
   var i;
   var obj = {containers: [], wires: []};
   
   for( i = 0 ; i < this.containers.length ; i++) {
      obj.containers.push( this.containers[i].getConfig() );
   }
   
   for( i = 0 ; i < this.wires.length ; i++) {
      var wire = this.wires[i];
      
      var wireObj = { 
         src: {moduleId: this.containers.indexOf(wire.terminal1.container), terminalId: wire.terminal1.container.terminals.indexOf(wire.terminal1)}, 
         tgt: {moduleId: this.containers.indexOf(wire.terminal2.container), terminalId: wire.terminal2.container.terminals.indexOf(wire.terminal2)} 
      };
      obj.wires.push(wireObj);
   }
   
   return obj;
};
