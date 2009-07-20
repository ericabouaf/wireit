/**
 * A layer encapsulate a bunch of containers and wires
 * @class Layer
 * @namespace WireIt
 * @constructor
 * @param {Object}   options   Configuration object (see the properties)
 */
WireIt.Layer = function(options) {
   
   this.setOptions(options);
   
   /**
    * List of all the WireIt.Container (or subclass) instances in this layer
    * @property containers
    * @type {Array}
    */
   this.containers = [];
   
   /**
    * List of all the WireIt.Wire (or subclass) instances in this layer
    * @property wires
    * @type {Array}
    */
   this.wires = [];
   
   /**
    * Layer DOM element
    * @property el
    * @type {HTMLElement}
    */
   this.el = null;

	/**
    * Event that is fired when the layer has been changed
    * You can register this event with myTerminal.eventChanged.subscribe(function(e,params) { }, scope);
    * @event eventChanged
    */
   this.eventChanged = new YAHOO.util.CustomEvent("eventChanged");
   
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
    * Event that is fired when a container is added
    * You can register this event with myTerminal.eventAddContainer.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventAddContainer
    */
   this.eventAddContainer = new YAHOO.util.CustomEvent("eventAddContainer");
   
   /**
    * Event that is fired when a container is removed
    * You can register this event with myTerminal.eventRemoveContainer.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventRemoveContainer
    */
   this.eventRemoveContainer = new YAHOO.util.CustomEvent("eventRemoveContainer");
   
   /**
    * Event that is fired when a container has been moved
    * You can register this event with myTerminal.eventContainerDragged.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventContainerDragged
    */
   this.eventContainerDragged = new YAHOO.util.CustomEvent("eventContainerDragged");
   
   /**
    * Event that is fired when a container has been resized
    * You can register this event with myTerminal.eventContainerResized.subscribe(function(e,params) { var container=params[0];}, scope);
    * @event eventContainerResized
    */
   this.eventContainerResized = new YAHOO.util.CustomEvent("eventContainerResized");
   
   this.render();
   
   this.initContainers();
   
   this.initWires();
   
   if(this.options.layerMap) { 
      new WireIt.LayerMap(this, this.options.layerMapOptions);
   }
   
};

WireIt.Layer.prototype = {

   /**
    * @method setOptions
    */
   setOptions: function(options) {
      /**
       * Configuration object of the layer
       * <ul>
       *   <li>className: CSS class name for the layer element (default 'WireIt-Layer')</li>
       *   <li>parentEl: DOM element that schould contain the layer (default document.body)</li>
       *   <li>containers: array of container configuration objects</li>  
       *   <li>wires: array of wire configuration objects</li>
       *   <li>layerMap: boolean</li>
       *   <li>layerMapOptions: layer map options</li>
       * </ul>
       * @property options
       */
      this.options = {};
      this.options.className = options.className || 'WireIt-Layer';
      this.options.parentEl = options.parentEl || document.body;
      this.options.containers = options.containers || [];
      this.options.wires = options.wires || [];
      this.options.layerMap = YAHOO.lang.isUndefined(options.layerMap) ? false : options.layerMap;
      this.options.layerMapOptions = options.layerMapOptions;
      this.options.enableMouseEvents = YAHOO.lang.isUndefined(options.enableMouseEvents) ? true : options.enableMouseEvents;
   },

   /**
    * Create the dom of the layer and insert it into the parent element
    * @method render
    */
   render: function() {
   
      this.el = WireIt.cn('div', {className: this.options.className} );
   
      this.options.parentEl.appendChild(this.el);
   },


   /**
    * Create all the containers passed as options
    * @method initContainers
    */
   initContainers: function() {
      for(var i = 0 ; i < this.options.containers.length ; i++) {
         this.addContainer(this.options.containers[i]);
      } 
   },

   /**
    * Create all the wires passed in the config
    * @method initWires
    */
   initWires: function() {
      for(var i = 0 ; i < this.options.wires.length ; i++) {
         this.addWire(this.options.wires[i]);
      }
   },

   /**
    * Instanciate a wire given its "xtype" (default to WireIt.Wire)
    * @method addWire
    * @param {Object} wireConfig  Wire configuration object (see WireIt.Wire class for details)
    * @return {WireIt.Wire} Wire instance build from the xtype
    */
   addWire: function(wireConfig) {
      var type = eval(wireConfig.xtype || "WireIt.Wire");
   
      var src = wireConfig.src;
      var tgt = wireConfig.tgt;
   
      var terminal1 = this.containers[src.moduleId].getTerminal(src.terminal);
      var terminal2 = this.containers[tgt.moduleId].getTerminal(tgt.terminal);
      var wire = new type( terminal1, terminal2, this.el, wireConfig);
      wire.redraw();
   
      return wire;
   },

   /**
    * Instanciate a container given its "xtype": WireIt.Container (default) or a subclass of it.
    * @method addContainer
    * @param {Object} containerConfig  Container configuration object (see WireIt.Container class for details)
    * @return {WireIt.Container} Container instance build from the xtype
    */
   addContainer: function(containerConfig) {
   
      var type = eval('('+(containerConfig.xtype || "WireIt.Container")+')');
      if(!YAHOO.lang.isFunction(type)) {
         throw new Error("WireIt layer unable to add container: xtype '"+containerConfig.xtype+"' not found");
      }
      var container = new type(containerConfig, this);
   
      this.containers.push( container );
   
      // Event listeners
      container.eventAddWire.subscribe(this.onAddWire, this, true);
      container.eventRemoveWire.subscribe(this.onRemoveWire, this, true);
   
      if(container.ddResize) {
         container.ddResize.on('endDragEvent', function() {
            this.eventContainerResized.fire(container);
				this.eventChanged.fire(this);
         }, this, true);
      }
      if(container.dd) {
         container.dd.on('endDragEvent', function() {
            this.eventContainerDragged.fire(container);
				this.eventChanged.fire(this);
         }, this, true);
      }
   
      this.eventAddContainer.fire(container);

		this.eventChanged.fire(this);
   
      return container;
   },

   /**
    * Remove a container
    * @method removeContainer
    * @param {WireIt.Container} container Container instance to remove
    */
   removeContainer: function(container) {
      var index = WireIt.indexOf(container, this.containers);
      if( index != -1 ) {
         container.remove();
         this.containers[index] = null;
         this.containers = WireIt.compact(this.containers);
      
         this.eventRemoveContainer.fire(container);

			this.eventChanged.fire(this);
      }
   },

   /**
    * Update the wire list when any of the containers fired the eventAddWire
    * @method onAddWire
    * @param {Event} event The eventAddWire event fired by the container
    * @param {Array} args This array contains a single element args[0] which is the added Wire instance
    */
   onAddWire: function(event, args) {
      var wire = args[0];
      // add the wire to the list if it isn't in
      if( WireIt.indexOf(wire, this.wires) == -1 ) {
         this.wires.push(wire);
         
         if(this.options.enableMouseEvents) {
            YAHOO.util.Event.addListener(wire.element, "mousemove", this.onWireMouseMove, this, true);
            YAHOO.util.Event.addListener(wire.element, "click", this.onWireClick, this, true);
         }
         
         // Re-Fire an event at the layer level
         this.eventAddWire.fire(wire);

			// Fire the layer changed event
			this.eventChanged.fire(this);
      }
   },

   /**
    * Update the wire list when a wire is removed
    * @method onRemoveWire
    * @param {Event} event The eventRemoveWire event fired by the container
    * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
    */
   onRemoveWire: function(event, args) {
      var wire = args[0];
      var index = WireIt.indexOf(wire, this.wires);
      if( index != -1 ) {
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
         this.eventRemoveWire.fire(wire);
			this.eventChanged.fire(this);
      }
   },


   /**
    * Remove all the containers in this layer (and the associated terminals and wires)
    * @method clear
    */
   clear: function() {
		while(this.containers.length > 0) {
         this.removeContainer(this.containers[0]);
      }
   },

   /**
    * Alias for clear
    * @deprecated
    * @method removeAllContainers
    */
   removeAllContainers: function() {
      this.clear();
   },


   /**
    * Return an object that represent the state of the layer including the containers and the wires
    * @method getWiring
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
            src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.containers), terminal: wire.terminal1.name }, 
            tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.containers), terminal: wire.terminal2.name }
         };
         obj.wires.push(wireObj);
      }
   
      return obj;
   },

   /**
    * Load a layer configuration object
    * @method setWiring
    * @param {Object} wiring layer configuration
    */
   setWiring: function(wiring) {
      this.clear();
      
      if(YAHOO.lang.isArray(wiring.containers)) {
         for(var i = 0 ; i < wiring.containers.length ; i++) {
            this.addContainer(wiring.containers[i]);
         }
      }
      if(YAHOO.lang.isArray(wiring.wires)) {
         for(var i = 0 ; i < wiring.wires.length ; i++) {
            this.addWire(wiring.wires[i]);
         }
       }
   },
   
   /**
    * Returns a position relative to the layer from a mouse event
    * @method _getMouseEvtPos
    * @param {Event} e Mouse event
    * @return {Array} position
    */
   _getMouseEvtPos: function(e) {
   	var tgt = YAHOO.util.Event.getTarget(e);
   	var tgtPos = [tgt.offsetLeft, tgt.offsetTop];
   	return [tgtPos[0]+e.layerX, tgtPos[1]+e.layerY];
   },

   /**
    * Handles click on any wire canvas
    * Note: we treat mouse events globally so that wires behind others can still receive the events
    * @method onWireClick
    * @param {Event} e Mouse click event
    */
   onWireClick: function(e) {
      var p = this._getMouseEvtPos(e);
   	var lx = p[0], ly = p[1], n = this.wires.length, w;
   	for(var i = 0 ; i < n ; i++) {
   	   w = this.wires[i];
      	var elx = w.element.offsetLeft, ely = w.element.offsetTop;
      	// Check if the mouse is within the canvas boundaries
   	   if( lx >= elx && lx < elx+w.element.width && ly >= ely && ly < ely+w.element.height ) {
   	      var rx = lx-elx, ry = ly-ely; // relative to the canvas
   			w.onClick(rx,ry);
   	   }
   	}
   },

   /**
    * Handles mousemove events on any wire canvas
    * Note: we treat mouse events globally so that wires behind others can still receive the events
    * @method onWireMouseMove
    * @param {Event} e Mouse click event
    */
   onWireMouseMove: function(e) {
      var p = this._getMouseEvtPos(e);
   	var lx = p[0], ly = p[1], n = this.wires.length, w;
   	for(var i = 0 ; i < n ; i++) {
   	   w = this.wires[i];
      	var elx = w.element.offsetLeft, ely = w.element.offsetTop;
      	// Check if the mouse is within the canvas boundaries
   	   if( lx >= elx && lx < elx+w.element.width && ly >= ely && ly < ely+w.element.height ) {
   	      var rx = lx-elx, ry = ly-ely; // relative to the canvas
   			w.onMouseMove(rx,ry);
   	   }
   	}
   },
   
   
   /**
    * Layer explosing animation
    * @method clearExplode
    */
   clearExplode: function(callback, bind) {

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

   }
   

};
