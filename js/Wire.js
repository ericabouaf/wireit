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
       *   <li>coeffMulDirection: Parameter for bezier style</li>
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
      this.options.coeffMulDirection = YAHOO.lang.isUndefined(options.coeffMulDirection) ? 100 : options.coeffMulDirection;

      // Syling
      this.options.drawingMethod = options.drawingMethod || 'bezier';
      this.options.cap = options.cap || 'round';
      this.options.bordercap = options.bordercap || 'round';
      this.options.width = options.width || 3;
      this.options.borderwidth = options.borderwidth || 1;
      this.options.color = options.color || 'rgb(173, 216, 230)';
      this.options.bordercolor = options.bordercolor || '#0000ff';
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
    * Redraw the Wire
    * @method drawBezierCurve
    */
   drawBezierCurve: function() {
   
      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();
      
      // Coefficient multiplicateur de direction
      // 100 par defaut, si distance(p1,p2) < 100, on passe en distance/2
      var coeffMulDirection = this.options.coeffMulDirection;
   
   
      var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
      if(distance < coeffMulDirection){
         coeffMulDirection = distance/2;
      }
   
      // Calcul des vecteurs directeurs d1 et d2 :
      var d1 = [this.terminal1.options.direction[0]*coeffMulDirection,
                this.terminal1.options.direction[1]*coeffMulDirection];
      var d2 = [this.terminal2.options.direction[0]*coeffMulDirection,
                this.terminal2.options.direction[1]*coeffMulDirection];
   
      var bezierPoints=[];
      bezierPoints[0] = p1;
      bezierPoints[1] = [p1[0]+d1[0],p1[1]+d1[1]];
      bezierPoints[2] = [p2[0]+d2[0],p2[1]+d2[1]];
      bezierPoints[3] = p2;
      var min = [p1[0],p1[1]];
      var max = [p1[0],p1[1]];
      for(var i=1 ; i<bezierPoints.length ; i++){
         var p = bezierPoints[i];
         if(p[0] < min[0]){
            min[0] = p[0];
         }
         if(p[1] < min[1]){
            min[1] = p[1];
         }
         if(p[0] > max[0]){
            max[0] = p[0];
         }
         if(p[1] > max[1]){
            max[1] = p[1];
         }
      }
      // Redimensionnement du canvas
      var margin = [4,4];
      min[0] = min[0]-margin[0];
      min[1] = min[1]-margin[1];
      max[0] = max[0]+margin[0];
      max[1] = max[1]+margin[1];
      var lw = Math.abs(max[0]-min[0]);
      var lh = Math.abs(max[1]-min[1]);
   
      this.SetCanvasRegion(min[0],min[1],lw,lh);
   
      var ctxt = this.getContext();
      for(i = 0 ; i<bezierPoints.length ; i++){
         bezierPoints[i][0] = bezierPoints[i][0]-min[0];
         bezierPoints[i][1] = bezierPoints[i][1]-min[1];
      }
   
      // Draw the border
      ctxt.lineCap = this.options.bordercap;
      ctxt.strokeStyle = this.options.bordercolor;
      ctxt.lineWidth = this.options.width+this.options.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
      ctxt.stroke();
   
      // Draw the inner bezier curve
      ctxt.lineCap = this.options.cap;
      ctxt.strokeStyle = this.options.color;
      ctxt.lineWidth = this.options.width;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
      ctxt.stroke();
   
   },

	/**
    * Attempted bezier drawing method for arrows
    * @method drawBezierArrows
    */
   drawBezierArrows: function() {
	  //From drawArrows function

	 	var arrowWidth = Math.round(this.options.width * 1.5 + 20);
		var arrowLength = Math.round(this.options.width * 1.2 + 20);
	  	var d = arrowWidth/2; // arrow width/2
      var redim = d+3; //we have to make the canvas a little bigger because of arrows
      var margin=[4+redim,4+redim];

      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();

      // Coefficient multiplicateur de direction
      // 100 par defaut, si distance(p1,p2) < 100, on passe en distance/2
      var coeffMulDirection = this.options.coeffMulDirection;


      var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
      if(distance < coeffMulDirection){
         coeffMulDirection = distance/2;
      }

      // Calcul des vecteurs directeurs d1 et d2 :
      var d1 = [this.terminal1.options.direction[0]*coeffMulDirection,
                this.terminal1.options.direction[1]*coeffMulDirection];
      var d2 = [this.terminal2.options.direction[0]*coeffMulDirection,
                this.terminal2.options.direction[1]*coeffMulDirection];

      var bezierPoints=[];
      bezierPoints[0] = p1;
      bezierPoints[1] = [p1[0]+d1[0],p1[1]+d1[1]];
      bezierPoints[2] = [p2[0]+d2[0],p2[1]+d2[1]];
      bezierPoints[3] = p2;
      var min = [p1[0],p1[1]];
      var max = [p1[0],p1[1]];
      for(var i=1 ; i<bezierPoints.length ; i++){
         var p = bezierPoints[i];
         if(p[0] < min[0]){
            min[0] = p[0];
         }
         if(p[1] < min[1]){
            min[1] = p[1];
         }
         if(p[0] > max[0]){
            max[0] = p[0];
         }
         if(p[1] > max[1]){
            max[1] = p[1];
         }
      }
      // Redimensionnement du canvas
      //var margin = [4,4];
      min[0] = min[0]-margin[0];
      min[1] = min[1]-margin[1];
      max[0] = max[0]+margin[0];
      max[1] = max[1]+margin[1];
      var lw = Math.abs(max[0]-min[0]);
      var lh = Math.abs(max[1]-min[1]);

      this.SetCanvasRegion(min[0],min[1],lw,lh);

      var ctxt = this.getContext();
      for(i = 0 ; i<bezierPoints.length ; i++){
         bezierPoints[i][0] = bezierPoints[i][0]-min[0];
         bezierPoints[i][1] = bezierPoints[i][1]-min[1];
      }

      // Draw the border
      ctxt.lineCap = this.options.bordercap;
      ctxt.strokeStyle = this.options.bordercolor;
      ctxt.lineWidth = this.options.width+this.options.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]+arrowLength/2*this.terminal2.options.direction[1]);
      ctxt.stroke();

      // Draw the inner bezier curve
      ctxt.lineCap = this.options.cap;
      ctxt.strokeStyle = this.options.color;
      ctxt.lineWidth = this.options.width;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]+arrowLength/2*this.terminal2.options.direction[1]);
      ctxt.stroke();

	//Variables from drawArrows
		//var t1 = p1;
		var t1 = bezierPoints[2],
			 t2 = p2;

   	var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
   	var dlug = arrowLength; //arrow length
   	var t = 1-(dlug/distance);
   	z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
   	z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );	
   	
	//line which connects the terminals: y=ax+b
   	var W = t1[0] - t2[0];
   	var Wa = t1[1] - t2[1];
   	var Wb = t1[0]*t2[1] - t1[1]*t2[0];
   	if (W !== 0) {
   		a = Wa/W;
   		b = Wb/W;
   	}
   	else {
   		a = 0;
   	}
   	//line perpendicular to the main line: y = aProst*x + b
   	if (a === 0) {
   		aProst = 0;
   	}
   	else {
   		aProst = -1/a;
   	}
   	bProst = z[1] - aProst*z[0]; //point z lays on this line

   	//we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
   	var A = 1 + Math.pow(aProst,2),
			 B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst,
			 C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2),
			 delta = Math.pow(B,2) - 4*A*C;
			
   	if (delta < 0) { return; }
	   
   	var x1 = (-B + Math.sqrt(delta)) / (2*A),
			 x2 = (-B - Math.sqrt(delta)) / (2*A),
			 y1 = aProst*x1 + bProst,
			 y2 = aProst*x2 + bProst;
   	
   	if(t1[1] == t2[1]) {
   	      var o = (t1[0] > t2[0]) ? 1 : -1;
      	   x1 = t2[0]+o*dlug;
      	   x2 = x1;
      	   y1 -= d;
      	   y2 += d;
   	}   	

   	//triangle fill
   	ctxt.fillStyle = this.options.color;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.fill();

   	//triangle border	
   	ctxt.strokeStyle = this.options.bordercolor;
   	ctxt.lineWidth = this.options.borderwidth;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.lineTo(t2[0],t2[1]);
   	ctxt.stroke();

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
    * Drawing methods for arrows
    * @method drawArrows
    */
   drawArrows: function()
   {
   	var d = 7; // arrow width/2
      var redim = d+3; //we have to make the canvas a little bigger because of arrows
      var margin=[4+redim,4+redim];

      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();

      var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));

      var min=[ Math.min(p1[0],p2[0])-margin[0], Math.min(p1[1],p2[1])-margin[1]];
      var max=[ Math.max(p1[0],p2[0])+margin[0], Math.max(p1[1],p2[1])+margin[1]];
      
      // Redimensionnement du canvas
      
      var lw=Math.abs(max[0]-min[0])+redim;
      var lh=Math.abs(max[1]-min[1])+redim;

      p1[0]=p1[0]-min[0];
      p1[1]=p1[1]-min[1];
      p2[0]=p2[0]-min[0];
      p2[1]=p2[1]-min[1];

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

   	/* start drawing arrows */

   	var t1 = p1;
   	var t2 = p2;

   	var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
   	var dlug = 20; //arrow length
   	var t = (distance == 0) ? 0 : 1-(dlug/distance);
   	z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
   	z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );	

   	//line which connects the terminals: y=ax+b
   	var W = t1[0] - t2[0];
   	var Wa = t1[1] - t2[1];
   	var Wb = t1[0]*t2[1] - t1[1]*t2[0];
   	if (W !== 0) {
   		a = Wa/W;
   		b = Wb/W;
   	}
   	else {
   		a = 0;
   	}
   	//line perpendicular to the main line: y = aProst*x + b
   	if (a == 0) {
   		aProst = 0;
   	}
   	else {
   		aProst = -1/a;
   	}
   	bProst = z[1] - aProst*z[0]; //point z lays on this line

   	//we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
   	var A = 1 + Math.pow(aProst,2);
   	var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;
   	var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);
   	var delta = Math.pow(B,2) - 4*A*C;
   	if (delta < 0) { return; }
	   
   	var x1 = (-B + Math.sqrt(delta)) / (2*A);
   	var x2 = (-B - Math.sqrt(delta)) / (2*A);	 
   	var y1 = aProst*x1 + bProst;
   	var y2 = aProst*x2 + bProst;
   	
   	if(t1[1] == t2[1]) {
   	      var o = (t1[0] > t2[0]) ? 1 : -1;
      	   x1 = t2[0]+o*dlug;
      	   x2 = x1;
      	   y1 -= d;
      	   y2 += d;
   	}   	

   	//triangle fill
   	ctxt.fillStyle = this.options.color;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.fill();

   	//triangle border	
   	ctxt.strokeStyle = this.options.bordercolor;
   	ctxt.lineWidth = this.options.borderwidth;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.lineTo(t2[0],t2[1]);
   	ctxt.stroke();

   },
   
   /**
    * Drawing method for arrows
    * @method drawStraight
    */
   drawStraight: function()
   {
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
    * Redraw the canvas (according to the drawingMethod option)
    * @method redraw
    */
   redraw: function() {
      if(this.options.drawingMethod == 'straight') {
         this.drawStraight();
      }
      else if(this.options.drawingMethod == 'arrows') {
         this.drawArrows();
      }
      else if(this.options.drawingMethod == 'bezier') {
         this.drawBezierCurve();
      }
	   else if(this.options.drawingMethod == 'bezierArrows') {
         this.drawBezierArrows();
	   }
      else {
         throw new Error("WireIt.Wire unable to find '"+this.drawingMethod+"' drawing method.");
      }
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
			// should we call both ??
			// else {
			this.onWireMove(x,y);
			// }
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
   }


});

