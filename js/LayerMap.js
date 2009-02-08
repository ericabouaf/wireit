(function() {

   var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;

/**
 * Widget to display a minimap on a layer
 * @class LayerMap
 * @namespace WireIt
 * @extends WireIt.CanvasElement
 * @constructor
 * @param {WireIt.Layer} layer the layer object it is attached to
 * @param {Obj} options configuration object
 */
WireIt.LayerMap = function(layer,options) {
   
   /**
    * @property layer
    */
   this.layer = layer;
   
   this.setOptions(options);
   
   // Create the canvas element
   WireIt.LayerMap.superclass.constructor.call(this, this.options.parentEl);
   
   // Set the className
   this.element.className = this.options.className;
   
   this.initEvents();
   
   this.draw();
};

YAHOO.lang.extend(WireIt.LayerMap, WireIt.CanvasElement, {
   
   /**
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) { 
      var options = options || {};
      /**
       * Options:
       * <ul>
       *    <li>parentEl: parent element (defaut layer.el)</li>
       *    <li>className: default to "WireIt-LayerMap"</li>
       *    <li>style: display style, default to "rgba(0, 0, 200, 0.5)"</li>
       *    <li>lineWidth: default 2</li>
       * </ul>
       * @property options
       */
      this.options = {};
      this.options.parentEl = Dom.get(options.parentEl || this.layer.el);
      this.options.className = options.className || "WireIt-LayerMap";
      this.options.style = options.style || "rgba(0, 0, 200, 0.5)";
      this.options.lineWidth = options.lineWidth || 2;
   },
   
   
   /**
    * Listen for various events that should redraw the layer map
    * @method initEvents
    */
   initEvents: function() {
      
      var layer = this.layer;
      
      Event.addListener(this.element, 'mousedown', this.onMouseDown, this, true);
      Event.addListener(this.element, 'mouseup', this.onMouseUp, this, true);
      Event.addListener(this.element, 'mousemove', this.onMouseMove, this, true);
      Event.addListener(this.element, 'mouseout', this.onMouseUp, this, true);
      
      layer.eventAddWire.subscribe(this.draw, this, true);
      layer.eventRemoveWire.subscribe(this.draw, this, true);
      layer.eventAddContainer.subscribe(this.draw, this, true);
      layer.eventRemoveContainer.subscribe(this.draw, this, true);
      layer.eventContainerDragged.subscribe(this.draw, this, true);
      layer.eventContainerResized.subscribe(this.draw, this, true);

      Event.addListener(this.layer.el, "scroll", this.onLayerScroll, this, true);
   },
   
   /**
    * When a mouse move is received
    * @method onMouseMove
    * @param {Event} e Original event
    * @param {Array} args event parameters
    */
   onMouseMove: function(e, args) { 
      Event.stopEvent(e);
      if(this.isMouseDown) 
         this.scrollLayer(e.clientX,e.clientY);
   },   
   
   /**
    * When a mouseup or mouseout is received
    * @method onMouseUp
    * @param {Event} e Original event
    * @param {Array} args event parameters
    */
   onMouseUp: function(e, args) {
      Event.stopEvent(e);
      this.isMouseDown = false;
   },
   
   /**
    * When a mouse down is received
    * @method onMouseDown
    * @param {Event} e Original event
    * @param {Array} args event parameters
    */
   onMouseDown: function(e, args) {
      Event.stopEvent(e);
      this.scrollLayer(e.clientX,e.clientY);
      this.isMouseDown = true;
   },
   
   /**
    * Scroll the layer from mousedown/mousemove
    * @method scrollLayer
    * @param {Integer} clientX mouse event x coordinate
    * @param {Integer} clientY mouse event y coordinate
    */
   scrollLayer: function(clientX, clientY) {
      
      var canvasPos = Dom.getXY(this.element);
      var click = [ clientX-canvasPos[0], clientY-canvasPos[1] ];
      
      // Canvas Region
      var canvasRegion = Dom.getRegion(this.element);
      var canvasWidth = canvasRegion.right-canvasRegion.left-4;
      var canvasHeight = canvasRegion.bottom-canvasRegion.top-4;
      
      // Calculate ratio
      var layerWidth = this.layer.el.scrollWidth;
      var layerHeight = this.layer.el.scrollHeight;
      var hRatio = Math.floor(100*canvasWidth/layerWidth)/100;
      var vRatio = Math.floor(100*canvasHeight/layerHeight)/100;
      
      // Center position:
      var center = [ click[0]/hRatio, click[1]/vRatio ];
      
      // Region
      var region = Dom.getRegion(this.layer.el);
      var viewportWidth = region.right-region.left;
      var viewportHeight = region.bottom-region.top;
      
      // Calculate the scroll position of the layer
      var topleft = [ Math.max(Math.floor(center[0]-viewportWidth/2),0) ,  Math.max(Math.floor(center[1]-viewportHeight/2), 0) ];
      if( topleft[0]+viewportWidth > layerWidth ) {
         topleft[0] = layerWidth-viewportWidth;
      }
      if( topleft[1]+viewportHeight > layerHeight ) {
         topleft[1] = layerHeight-viewportHeight;
      }
     
      this.layer.el.scrollLeft = topleft[0];
      this.layer.el.scrollTop = topleft[1];
   
   },
   
   /**
    * Redraw after a timeout
    * @method onLayerScroll
    */
   onLayerScroll: function() {
      
      if(this.scrollTimer) { clearTimeout(this.scrollTimer); }
      var that = this;
      this.scrollTimer = setTimeout(function() {
         that.draw();
      },50);
      
   },
   
   /**
    * Redraw the layer map
    * @method draw
    */
   draw: function() {
      var ctxt=this.getContext();
      
      // Canvas Region
      var canvasRegion = Dom.getRegion(this.element);
      var canvasWidth = canvasRegion.right-canvasRegion.left-4;
      var canvasHeight = canvasRegion.bottom-canvasRegion.top-4;
      
      // Clear Rect
      ctxt.clearRect(0,0, canvasWidth, canvasHeight);
      
      // Calculate ratio
      var layerWidth = this.layer.el.scrollWidth;
      var layerHeight = this.layer.el.scrollHeight;
      var hRatio = Math.floor(100*canvasWidth/layerWidth)/100;
      var vRatio = Math.floor(100*canvasHeight/layerHeight)/100;

      // Draw the viewport
      var region = Dom.getRegion(this.layer.el);
      var viewportWidth = region.right-region.left;
      var viewportHeight = region.bottom-region.top;
      var viewportX = this.layer.el.scrollLeft;
      var viewportY = this.layer.el.scrollTop;
      ctxt.strokeStyle= "rgb(200, 50, 50)";
      ctxt.lineWidth=1;
      ctxt.strokeRect(viewportX*hRatio, viewportY*vRatio, viewportWidth*hRatio, viewportHeight*vRatio);
   
      // Draw containers and wires
      ctxt.fillStyle = this.options.style;
      ctxt.strokeStyle= this.options.style;
      ctxt.lineWidth=this.options.lineWidth;
      this.drawContainers(ctxt, hRatio, vRatio);
      this.drawWires(ctxt, hRatio, vRatio);
   },
   
   /**
    * Subroutine to draw the containers
    * @method drawContainers
    */
   drawContainers: function(ctxt, hRatio, vRatio) {
      var containers = this.layer.containers;
      var n = containers.length,i,gIS = WireIt.getIntStyle,containerEl;
      for(i = 0 ; i < n ; i++) {
         containerEl = containers[i].el;
         ctxt.fillRect(gIS(containerEl, "left")*hRatio, gIS(containerEl, "top")*vRatio, 
                       gIS(containerEl, "width")*hRatio, gIS(containerEl, "height")*vRatio);
      }
   },
   
   /**
    * Subroutine to draw the wires
    * @method drawWires
    */
   drawWires: function(ctxt, hRatio, vRatio) {
      var wires = this.layer.wires;
      var n = wires.length,i,wire;
      for(i = 0 ; i < n ; i++) {
         wire = wires[i];
         var pos1 = wire.terminal1.getXY(), 
             pos2 = wire.terminal2.getXY();

         // Stroked line
         // TODO:
         ctxt.beginPath();
         ctxt.moveTo(pos1[0]*hRatio,pos1[1]*vRatio);
         ctxt.lineTo(pos2[0]*hRatio,pos2[1]*vRatio);
         ctxt.closePath();
         ctxt.stroke();
      }
      
   }
   
   
});

})();