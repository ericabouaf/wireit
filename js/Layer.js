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
   this.config.layerMap = YAHOO.lang.isUndefined(this.config.layerMap) ? false : this.config.layerMap;
   
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
   
   
   /**
    * Event that is fired when a container is added
    * You can register this event with myTerminal.eventAddContainer.subscribe(function(e,params) { var container=params[0];}, scope);
    */
   this.eventAddContainer = new YAHOO.util.CustomEvent("eventAddContainer");
   
   /**
    * Event that is fired when a container is removed
    * You can register this event with myTerminal.eventRemoveContainer.subscribe(function(e,params) { var container=params[0];}, scope);
    */
   this.eventRemoveContainer = new YAHOO.util.CustomEvent("eventRemoveContainer");
   
   /**
    * Event that is fired when a container has been moved
    * You can register this event with myTerminal.eventContainerDragged.subscribe(function(e,params) { var container=params[0];}, scope);
    */
   this.eventContainerDragged = new YAHOO.util.CustomEvent("eventContainerDragged");
   
   /**
    * Event that is fired when a container has been resized
    * You can register this event with myTerminal.eventContainerResized.subscribe(function(e,params) { var container=params[0];}, scope);
    */
   this.eventContainerResized = new YAHOO.util.CustomEvent("eventContainerResized");
   
   
   this.render();
   
   this.initContainers();
   
   this.initWires();
   
   if(this.config.layerMap) { 
      new WireIt.LayerMap({layer: this});
   }
   
};

WireIt.Layer.prototype = {

   /**
    * Create the dom of the layer and insert it into the parent element
    */
   render: function() {
   
      this.el = WireIt.cn('div', {className: this.config.className} );
   
      this.config.parentEl.appendChild(this.el);
   },


   /**
    * Create all the containers passed as config
    */
   initContainers: function() {
      for(var i = 0 ; i < this.config.containers.length ; i++) {
         this.addContainer(this.config.containers[i]);
      } 
   },

   /**
    * Create all the wires passed in the config
    */
   initWires: function() {
      for(var i = 0 ; i < this.config.wires.length ; i++) {
         this.addWire(this.config.wires[i]);
      }
   },

   /**
    * Instanciate a wire given its "xtype" (default to WireIt.Wire)
    * @param {Object} wireConfig  Wire configuration object (see WireIt.Wire class for details)
    * @return {WireIt.Wire} Wire instance build from the xtype
    */
   addWire: function(wireConfig) {
      var type = eval(wireConfig.xtype || "WireIt.Wire");
   
      var src = wireConfig.src;
      var tgt = wireConfig.tgt;
   
      var terminal1 = this.containers[src.moduleId].terminals[src.terminalId];
      var terminal2 = this.containers[tgt.moduleId].terminals[tgt.terminalId];
   
      var wire = new type( terminal1, terminal2, this.el);
      wire.redraw();
   
      return wire;
   },

   /**
    * Instanciate a container given its "xtype": WireIt.Container (default) or a subclass of it.
    * @param {Object} containerConfig  Container configuration object (see WireIt.Container class for details)
    * @return {WireIt.Container} Container instance build from the xtype
    */
   addContainer: function(containerConfig) {
   
      var type = eval(containerConfig.xtype || "WireIt.Container");
      var container = new type(containerConfig, this);
   
      this.containers.push( container );
   
      // Event listeners
      container.eventAddWire.subscribe(this.onAddWire, this, true);
      container.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
   
      if(container.ddResize) {
         container.ddResize.on('endDragEvent', function() {
            this.eventContainerResized.fire(container);
         }, this, true);
      }
      if(container.dd) {
         container.dd.on('endDragEvent', function() {
            this.eventContainerDragged.fire(container);
         }, this, true);
      }
   
      this.eventAddContainer.fire(container);
   
      return container;
   },

   /**
    * Remove a container
    * @param {WireIt.Container} container Container instance to remove
    */
   removeContainer: function(container) {
      var index = WireIt.indexOf(container, this.containers);
      if( index != -1 ) {
         container.remove();
         this.containers[index] = null;
         this.containers = WireIt.compact(this.containers);
      
         this.eventRemoveContainer.fire(container);
      }
   },

   /**
    * Update the wire list when any of the containers fired the eventAddWire
    * @param {Event} event The eventAddWire event fired by the container
    * @param {Array} args This array contains a single element args[0] which is the added Wire instance
    */
   onAddWire: function(event, args) {
      var wire = args[0];
      // add the wire to the list if it isn't in
      if( WireIt.indexOf(wire, this.wires) == -1 ) {
         this.wires.push(wire);
         // Re-Fire an event at the layer level
         this.eventAddWire.fire(wire);
      }
   },

   /**
    * Update the wire list when a wire is removed
    * @param {Event} event The eventRemoveWire event fired by the container
    * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
    */
   onRemoveWire: function(event, args) {
      var wire = args[0];
      var index = WireIt.indexOf(wire, this.wires);
      if( index != -1 ) {
         this.eventRemoveWire.fire(wire);
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
      }
   },

   /**
    * Remove all the containers in this layer (and the associated terminals and wires)
    */
   removeAllContainers: function() {
      while(this.containers.length > 0) {
         this.removeContainer(this.containers[0]);
      }
   },


   /**
    * Return an object that represent the state of the layer including the containers and the wires
    * @return {Obj} layer configuration
    */
   getWiring: function() {
   
      var i;
      var obj = {containers: [], wires: []};
   
      for( i = 0 ; i < this.containers.length ; i++) {
         obj.containers.push( this.containers[i].getConfig() );
      }
   
      for( i = 0 ; i < this.wires.length ; i++) {
         var wire = this.wires[i];
      
         var wireObj = { 
            src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.containers), terminalId: WireIt.indexOf(wire.terminal1, wire.terminal1.container.terminals)}, 
            tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.containers), terminalId: WireIt.indexOf(wire.terminal2, wire.terminal2.container.terminals)} 
         };
         obj.wires.push(wireObj);
      }
   
      return obj;
   },

   /**
    * Load a layer configuration object
    * @param {Object} wiring layer configuration
    */
   setWiring: function(wiring) {
      this.removeAllContainers();
   
      for(var i = 0 ; i < wiring.containers.length ; i++) {
         this.addContainer(wiring.containers[i]);
      }
   
      for(var i = 0 ; i < wiring.wires.length ; i++) {
          this.addWire(wiring.wires[i]);
       }
   },

   /**
    * Alias for removeAllContainers
    */
   clear: function() {
      this.removeAllContainers();
   }

};