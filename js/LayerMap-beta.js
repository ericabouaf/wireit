/**
 * Widget to display a minimap on a layer (beta)
 * @class LayerMap
 * @namespace WireIt
 * @extends WireIt.CanvasElement
 * @constructor
 * @param {WireIt.Layer} layer the layer object it is attached to
 * @param  {Obj} options configuration object
 */
WireIt.LayerMap = function(layer,options) {
   
   /**
    * @property layer
    * @type {WireIt.Layer}
    */
   this.layer = layer;
   
   this.setOptions(options || {});
   
   // Create the canvas element
   WireIt.LayerMap.superclass.constructor.call(this, this.options.parentEl);
   
   // Set the className
   this.element.className = this.options.className;
   
   // Set size
   this.element.style.width = this.options.width+"px";
   this.element.style.height = this.options.height+"px";
   
   this.initEvents();
   
   this.draw();
};

YAHOO.lang.extend(WireIt.LayerMap, WireIt.CanvasElement, {
   
   /**
    * @method setOptions
    * @param {Object} options
    */
   setOptions: function(options) {
      /**
       * Options:
       * <ul>
       *    <li>parentEl: parent element (defaut layer.el)</li>
       *    <li>className: default to "WireIt-LayerMap"</li>
       *    <li>style: display style, default to "rgba(0, 0, 200, 0.5)"</li>
       *    <li>ratio: (warning, this might get removed in futur versions)</li>
       *    <li>lineWidth: default 2</li>
       *    <li>width: default 250</li>
       *    <li>height: default 150</li>
       * </ul>
       * @property options
       */
      this.options = {};
      this.options.parentEl = options.parentEl || this.layer.el;
      this.options.className = options.className || "WireIt-LayerMap";
      this.options.style = options.style || "rgba(0, 0, 200, 0.5)";
      this.options.ratio = options.ratio || 0.1;
      this.options.lineWidth = options.lineWidth || 2;
      this.options.width = options.width || 250;
      this.options.height = options.height || 150;
   },
   
   
   /**
    * Listen for various events that should redraw the layer map
    * @method initEvents
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.element, 'click', this.onClick, this, true);
      
      this.layer.eventAddWire.subscribe(this.draw, this, true);
      this.layer.eventRemoveWire.subscribe(this.draw, this, true);
      this.layer.eventAddContainer.subscribe(this.draw, this, true);
      this.layer.eventRemoveContainer.subscribe(this.draw, this, true);


      this.layer.eventContainerDragged.subscribe(this.draw, this, true);
      this.layer.eventContainerResized.subscribe(this.draw, this, true);
   },
   
   /**
    * When a click event is received
    * @method onClick
    * @param {Event} e Original event
    * @param {Array} args event parameters
    */
   onClick: function(e, args) { 
      YAHOO.util.Event.stopEvent(e);
      // TODO: move the layer scrollPos ?
   },
   
   /**
    * Redraw the layer map
    * @method draw
    */
   draw: function() {
      var ctxt=this.getContext();
      
      ctxt.clearRect(0,0,this.options.width,this.options.height);
      
      var ratio = this.options.ratio;
      
      ctxt.fillStyle = this.options.style;
      ctxt.strokeStyle= this.options.style;
      ctxt.lineWidth=this.options.lineWidth;
      
      for(var i = 0 ; i < this.layer.containers.length ; i++) {
         var containerEl = this.layer.containers[i].el;
         
         
         var w = WireIt.getIntStyle(containerEl, "width");
         var h = WireIt.getIntStyle(containerEl, "height");
         var l = WireIt.getIntStyle(containerEl, "left");
         var t = WireIt.getIntStyle(containerEl, "top");
          ctxt.fillRect(l*ratio, t*ratio, w*ratio, h*ratio);
         
      }
      
      for(var i = 0 ; i < this.layer.wires.length ; i++) {
         var wire = this.layer.wires[i];
         var t1 = wire.terminal1, t2 = wire.terminal2;
         var pos1 = t1.getXY(), pos2 = t2.getXY();
      
         // Stroked triangle
         ctxt.beginPath();
         ctxt.moveTo(pos1[0]*ratio,pos1[1]*ratio);
         ctxt.lineTo(pos2[0]*ratio,pos2[1]*ratio);
         ctxt.closePath();
         ctxt.stroke();
      }
      
   }
   
   
});
