/*global YAHOO */
/**
 * The wire widget that uses a canvas to render
 * @class Wire
 * @namespace WireIt
 * @extends WireIt.CanvasElement
 * @constructor
 * @param  {WireIt.Terminal}    terminal1   Source terminal
 * @param  {WireIt.Terminal}    terminal2   Target terminal
 * @param  {HTMLElement} parentEl    Container of the CANVAS tag
 * @param  {Obj}                options      Wire configuration (see options property)
 */
WireIt.Wire = function( terminal1, terminal2, parentEl, options) {
   
   /**
    * Reference to the parent dom element
    * @property parentEl
    * @type HTMLElement
    */
   this.parentEl = parentEl;
   
   /**
    * Source terminal
    * @property terminal1
    * @type WireIt.Terminal
    */
   this.terminal1 = terminal1;
   
   /**
    * Target terminal
    * @property terminal2
    * @type WireIt.Terminal || WireIt.TerminalProxy
    */
   this.terminal2 = terminal2;

	
   /**
    * Event that is fired when a wire is clicked (on the wire, not the canvas)
    * You can register this event with myWire.eventWireClick.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseClick
    */
   this.eventMouseClick = new YAHOO.util.CustomEvent("eventMouseClick");

	/**
    * Event that is fired when the mouse enter the wire
    * You can register this event with myWire.eventMouseIn.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseIn
    */
	this.eventMouseIn = new YAHOO.util.CustomEvent("eventMouseIn");
	
	/**
    * Event that is fired when the mouse exits the wire
    * You can register this event with myWire.eventMouseOut.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseOut
    */
	this.eventMouseOut = new YAHOO.util.CustomEvent("eventMouseOut");
	
	/**
    * Event that is fired when the mouse moves inside the wire
    * You can register this event with myWire.eventMouseMove.subscribe(function(e,params) { var wire = params[0], xy = params[1];}, scope);
    * @event eventMouseMove
    */
	this.eventMouseMove = new YAHOO.util.CustomEvent("eventMouseMove");


   
   // Init the options property
   this.setOptions(options || {});
   
   // Create the canvas element and append it to parentEl
   WireIt.Wire.superclass.constructor.call(this, this.parentEl);
   
   // CSS classname
   YAHOO.util.Dom.addClass(this.element, this.options.className);
   
   // Call addWire on both terminals
   this.terminal1.addWire(this);
   this.terminal2.addWire(this);
};


YAHOO.lang.extend(WireIt.Wire, WireIt.CanvasElement, {
   
   /**
    * Build options object and set default properties
    * @method setOptions
    */
   setOptions: function(options) {
      /**
       * Wire styling, and properties:
       * <ul>
       *   <li>className: CSS class name of the canvas element (default 'WireIt-Wire')</li>
       *   <li>cap: default 'round'</li>
       *   <li>bordercap: default 'round'</li>
       *   <li>width: Wire width (default to 3)</li>
       *   <li>borderwidth: Border Width (default to 1)</li>
       *   <li>color: Wire color (default to rgb(173, 216, 230) )</li>
       *   <li>bordercolor: Border color (default to #0000ff )</li>
       * </ul>
       * @property options
       */
      this.options = {};
      this.options.className = options.className || 'WireIt-Wire';

      // Syling
      this.options.cap = options.cap || 'round';
      this.options.bordercap = options.bordercap || 'round';
      this.options.width = options.width || 3;
      this.options.borderwidth = options.borderwidth || 1;
      this.options.color = options.color || 'rgb(173, 216, 230)';
      this.options.bordercolor = options.bordercolor || '#0000ff';

		// Label
		this.options.label = options.label;
   },
   
   /**
    * Remove a Wire from the Dom
    * @method remove
    */
   remove: function() {
   
      // Remove the canvas from the dom
      this.parentEl.removeChild(this.element);
   
      // Remove the wire reference from the connected terminals
    	if(this.terminal1 && this.terminal1.removeWire) {
			this.terminal1.removeWire(this);
    	}
    	if(this.terminal2 && this.terminal2.removeWire) {
			this.terminal2.removeWire(this);
    	}

    	// Remove references to old terminals
    	this.terminal1 = null;
    	this.terminal2 = null;
   },


   /**
    * This function returns terminal1 if the first argument is terminal2 and vice-versa
    * @method getOtherTerminal
    * @param   {WireIt.Terminal} terminal    
    * @return  {WireIt.Terminal} terminal    the terminal that is NOT passed as argument
    */
   getOtherTerminal: function(terminal) {
      return (terminal == this.terminal1) ? this.terminal2 : this.terminal1;
   },
   
   
   
   /**
    * Drawing method
    */
   draw: function() {
      var margin = [4,4];

      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();

      var min=[ Math.min(p1[0],p2[0])-margin[0], Math.min(p1[1],p2[1])-margin[1]];
      var max=[ Math.max(p1[0],p2[0])+margin[0], Math.max(p1[1],p2[1])+margin[1]];
      
      // Redimensionnement du canvas
      var lw=Math.abs(max[0]-min[0]);
      var lh=Math.abs(max[1]-min[1]);

      // Convert points in canvas coordinates
      p1[0] = p1[0]-min[0];
      p1[1] = p1[1]-min[1];
      p2[0] = p2[0]-min[0];
      p2[1] = p2[1]-min[1];

      this.SetCanvasRegion(min[0],min[1],lw,lh);

      var ctxt=this.getContext();
      
      // Draw the border
      ctxt.lineCap=this.options.bordercap;
      ctxt.strokeStyle=this.options.bordercolor;
      ctxt.lineWidth=this.options.width+this.options.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();

      // Draw the inner bezier curve
      ctxt.lineCap=this.options.cap;
      ctxt.strokeStyle=this.options.color;
      ctxt.lineWidth=this.options.width;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();
   },

   /**
    * Redraw the wire and label
    * @method redraw
    */
   redraw: function() {
				
      this.draw();

		if(this.options.label) {
			this.drawLabel();
		}
   },

	drawLabel: function(positions) {
		
		var p1 = positions[0];
		var p2 = positions[1];
		var t1 = positions[2];
		var t2 = positions[3];
		
		var winkel = 0;
		var distance = 15;
		
		var ctxt=this.getContext();
		ctxt.save();
		
		//1.Quadrant
      if ((p1[0]<p2[0])&&(p1[1]>p2[1])){
         winkel=Math.PI*1.5+winkel;
         ctxt.translate(t1[0],t1[1]);
      }
      //2. Quadrant
      else if ((p1[0]<p2[0])&&(p1[1]<p2[1])){
         winkel = Math.PI/2-winkel;
         ctxt.translate(t1[0],t1[1]);
      }
      //3. Quadrant
      else if ((p1[0]>p2[0])&&(p1[1]<p2[1])){
         //winkel = Math.PI/2+winkel;
        winkel = Math.PI*1.5+winkel;
        ctxt.translate(t2[0],t2[1]);
      }
      //4. Quadrant
      else if ((p1[0]>p2[0])&&(p1[1]>p2[1])){
         winkel=Math.PI*0.5-winkel;
         ctxt.translate(t2[0],t2[1]);
      }

       ctxt.rotate(winkel);

      ctxt.font = "14px Arial";
      ctxt.fillStyle = "Black";
      ctxt.translate((distance-(ctxt.measureText(this.options.label)).width)/2,0);
      ctxt.fillText(this.options.label, 0, 0);
      ctxt.restore();
	},
   
   /**
    * Determine if the wire is drawn at position (x,y) relative to the canvas element. This is used for mouse events.
    * @method wireDrawnAt
    * @return {Boolean} true if the wire is drawn at position (x,y) relative to the canvas element
    */
   wireDrawnAt: function(x,y) {
      var ctxt = this.getContext();
	   var imgData = ctxt.getImageData(x,y,1,1);
	   var pixel = imgData.data;
	   return !( pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0 );
   },
   
   /**
    * Called by the Layer when the mouse moves over the canvas element.
    * Note: the event is not listened directly, to receive the event event if the wire is behind another wire
    * @method onMouseMove
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onMouseMove: function(x,y) {
      
      if(typeof this.mouseInState === undefined) {
         this.mouseInState = false;
      }

	   if( this.wireDrawnAt(x,y) ) {
			if(!this.mouseInState) {
			   this.mouseInState=true;
			   this.onWireIn(x,y);
			}	
			
			this.onWireMove(x,y);
	   }
	   else {
	      if(this.mouseInState) {
	         this.mouseInState=false;
			   this.onWireOut(x,y);
	      }
	   }
      
   },
   
   /**
    * When the mouse moves over a wire
    * Note: this will only work within a layer
    * @method onWireMove
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireMove: function(x,y) {
		this.eventMouseMove.fire(this, [x,y]);
   },
   
   /**
    * When the mouse comes into the wire
    * Note: this will only work within a layer
    * @method onWireIn
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireIn: function(x,y) {
		this.eventMouseIn.fire(this, [x,y]);
   },
   
   /**
    * When the mouse comes out of the wire
    * Note: this will only work within a layer
    * @method onWireOut
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireOut: function(x,y) {
		this.eventMouseOut.fire(this, [x,y]);
   },
   
   /**
    * When the mouse clicked on the canvas
    * Note: this will only work within a layer
    * @method onClick
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onClick: function(x,y) {
		if( this.wireDrawnAt(x,y) ) {
			this.onWireClick(x,y);
      }
   },
   
   /**
    * When the mouse clicked on the wire
    * Note: this will only work within a layer
    * @method onWireClick
    * @param {Integer} x left position of the mouse (relative to the canvas)
    * @param {Integer} y top position of the mouse (relative to the canvas)
    */
   onWireClick: function(x,y) {
		this.eventMouseClick.fire(this, [x,y]);
   },


	/**
    * Return the config of this Wire
    * @method getConfig
    */
	getConfig: function() {
      var obj = {};

      // xtype
      if(this.options.xtype) {
         obj.xtype = this.options.xtype;
      }

      return obj;
   }


});

