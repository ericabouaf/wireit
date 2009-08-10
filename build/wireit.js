/**
 * WireIt provide classes to build wirable interfaces
 * @module WireIt
 */
/**
 * @class WireIt
 * @static
 * @namespace WireIt
 */
var WireIt = {
   
   /**
    * Get a css property in pixels and convert it to an integer
    * @method getIntStyle
    * @namespace WireIt
    * @static
    * @param {HTMLElement} el The element
    * @param {String} style css-property to get
    * @return {Integer} integer size
    */
   getIntStyle: function(el,style) {
      var sStyle = YAHOO.util.Dom.getStyle(el, style);
      return parseInt(sStyle.substr(0, sStyle.length-2), 10);
   },

   /**
    * Helper function to set DOM node attributes and style attributes.
    * @method sn
    * @static
    * @param {HTMLElement} el The element to set attributes to
    * @param {Object} domAttributes An object containing key/value pairs to set as node attributes (ex: {id: 'myElement', className: 'myCssClass', ...})
    * @param {Object} styleAttributes Same thing for style attributes. Please use camelCase for style attributes (ex: backgroundColor for 'background-color')
    */
   sn: function(el,domAttributes,styleAttributes){
      if(!el) { return; }
      if(domAttributes){
         for(var i in domAttributes){
            var domAttribute = domAttributes[i];
            if(typeof (domAttribute)=="function"){continue;}
            if(i=="className"){
               i="class";
               el.className=domAttribute;
            }
            if(domAttribute!==el.getAttribute(i)){
               if(domAttribute===false){
                  el.removeAttribute(i);
               }else{
                  el.setAttribute(i,domAttribute);
               }
            }
         }
      }
      if(styleAttributes){
         for(var i in styleAttributes){
            if(typeof (styleAttributes[i])=="function"){ continue; }
            if(el.style[i]!=styleAttributes[i]){
               el.style[i]=styleAttributes[i];
            }
         }
      }
   
   },


   /**
    * Helper function to create a DOM node. (wrapps the document.createElement tag and the inputEx.sn functions)
    * @method cn
    * @static
    * @param {String} tag The tagName to create (ex: 'div', 'a', ...)
    * @param {Object} [domAttributes] see inputEx.sn
    * @param {Object} [styleAttributes] see inputEx.sn
    * @param {String} [innerHTML] The html string to append into the created element
    * @return {HTMLElement} The created node
    */
   cn: function(tag, domAttributes, styleAttributes, innerHTML){
      var el=document.createElement(tag);
      this.sn(el,domAttributes,styleAttributes);
      if(innerHTML){ el.innerHTML = innerHTML; }
      return el;
   },
   
   /**
    * indexOf replace Array.indexOf for cases where it isn't available (IE6 only ?)
    * @method indexOf
    * @static
    * @param {Any} el element to search for
    * @param {Array} arr Array to search into
    * @return {Integer} element index or -1 if not found
    */
   indexOf: YAHOO.lang.isFunction(Array.prototype.indexOf) ? 
                        function(el, arr) { return arr.indexOf(el);} : 
                        function(el, arr) {
                           for(var i = 0 ;i < arr.length ; i++) {
                              if(arr[i] == el) return i;
                           }
                           return -1;
                        },

   /**
    * compact replace Array.compact for cases where it isn't available
    * @method compact
    * @static
    * @param {Array} arr Array to compact
    * @return {Array} compacted array
    */
   compact: YAHOO.lang.isFunction(Array.prototype.compact) ? 
                        function(arr) { return arr.compact();} :          
                        function(arr) {
                           var n = [];
                           for(var i = 0 ; i < arr.length ; i++) {
                              if(arr[i]) {
                                 n.push(arr[i]);
                              }
                           }
                           return n;
                        }
};


/**
 * WireIt.util contains utility classes
 */
WireIt.util = {};
(function () {
   
   // Shortcuts
   var Event = YAHOO.util.Event, UA = YAHOO.env.ua;

   /**
    * Create a canvas element and wrap cross-browser hacks to resize it
    * @class CanvasElement
    * @namespace WireIt
    * @constructor
    * @param {HTMLElement} parentNode The canvas tag will be append to this parent DOM node.
    */
   WireIt.CanvasElement = function(parentNode) {
      
      /**
       * The canvas element
       * @property element
       * @type HTMLElement
       */
      this.element = document.createElement('canvas');
      
      // Append to parentNode
      parentNode.appendChild(this.element);
      
      // excanvas.js for dynamic canvas tags
      if(typeof (G_vmlCanvasManager)!="undefined"){
         this.element = G_vmlCanvasManager.initElement(this.element);
      }
      
   };
   
   WireIt.CanvasElement.prototype = {
      
      /**
       * Get a drawing context
       * @method getContext
       * @param {String} [mode] Context mode (default "2d")
       * @return {CanvasContext} the context
       */
      getContext: function(mode) {
       return this.element.getContext(mode || "2d");
      },
      
      /**
       * Purge all event listeners and remove the component from the dom
       * @method destroy
       */
      destroy: function() {
         var el = this.element;

         // Remove from DOM
         if(YAHOO.util.Dom.inDocument(el)) {
            el.parentNode.removeChild(el);
         }

         // recursively purge element
         Event.purgeElement(el, true);
      },
      
      /**
       * Set the canvas position and size.
       * <b>Warning:</b> This method changes the <i>element</i> property under some brother. Don't copy references !
       * @method SetCanvasRegion
       * @param {Number} left Left position
       * @param {Number} top Top position
       * @param {Number} width New width
       * @param {Number} height New height
       */
      SetCanvasRegion: UA.ie ? 
               // IE
               function(left,top,width,height){
                  var el = this.element;
                  WireIt.sn(el,null,{left:left+"px",top:top+"px",width:width+"px",height:height+"px"});
                  el.getContext("2d").clearRect(0,0,width,height);
                  this.element = el;
               } : 
               ( (UA.webkit || UA.opera) ? 
                  // Webkit (Safari & Chrome) and Opera
                  function(left,top,width,height){
                     var el = this.element;
                     var newCanvas=WireIt.cn("canvas",{className:el.className || el.getAttribute("class"),width:width,height:height},{left:left+"px",top:top+"px"});
                     var listeners=Event.getListeners(el);
                     for(var listener in listeners){
                        var l=listeners[listener];
                        Event.addListener(newCanvas,l.type,l.fn,l.obj,l.adjust);
                     }
                     Event.purgeElement(el);
                     el.parentNode.replaceChild(newCanvas,el);
                     this.element = newCanvas;
                  } :  
                  // Other (Firefox)
                  function(left,top,width,height){
                     WireIt.sn(this.element,{width:width,height:height},{left:left+"px",top:top+"px"});
                  })
   };
   
})();/**
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


})();/**
 * WireIt.util.DD is a wrapper class for YAHOO.util.DD, to redraw the wires associated with the given terminals while drag-dropping
 * @class DD
 * @namespace WireIt.util
 * @extends YAHOO.util.DD
 * @constructor
 * @param {Array} terminals List of WireIt.Terminal objects associated within the DragDrop element
 * @param {String} id Parameter of YAHOO.util.DD
 * @param {String} sGroup Parameter of YAHOO.util.DD
 * @param {Object} config Parameter of YAHOO.util.DD
 */
WireIt.util.DD = function( terminals, id, sGroup, config) {
   if(!terminals) {
      throw new Error("WireIt.util.DD needs at least terminals and id");
   }
   /**
    * List of the contained terminals
    * @property _WireItTerminals
    * @type {Array}
    */
   this._WireItTerminals = terminals;
   
   WireIt.util.DD.superclass.constructor.call(this, id, sGroup, config);
};

YAHOO.extend(WireIt.util.DD, YAHOO.util.DD, {

   /**
    * Override YAHOO.util.DD.prototype.onDrag to redraw the wires
    * @method onDrag
    */
   onDrag: function(e) {
      // Make sure terminalList is an array
      var terminalList = YAHOO.lang.isArray(this._WireItTerminals) ? this._WireItTerminals : (this._WireItTerminals.isWireItTerminal ? [this._WireItTerminals] : []);
      // Redraw all the wires
      for(var i = 0 ; i < terminalList.length ; i++) {
         if(terminalList[i].wires) {
            for(var k = 0 ; k < terminalList[i].wires.length ; k++) {
               terminalList[i].wires[k].redraw();
            }
         }
      }
   },

   /**
    * In case you change the terminals since you created the WireIt.util.DD:
    * @method setTerminals
    */
   setTerminals: function(terminals) {
      this._WireItTerminals = terminals;
   }
   
});
/**
 * Make a container resizable
 * @class DDResize
 * @namespace WireIt.util
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param {WireIt.Container} container The container that is to be resizable
 * @param {Object} config Configuration object
 */
WireIt.util.DDResize = function(container, config) {
   
   /**
    * Configuration object
    * <ul>
    *   <li>minWidth: minimum width (default 50)</li>
    *   <li>minHeight: minimum height (default 50)</li>
    * </ul>
    * @property myConf
    */
   // WARNING: the object config cannot be called "config" because YAHOO.util.DragDrop already has a "config" property
   this.myConf = config || {};
   this.myConf.container = container;
   this.myConf.minWidth = this.myConf.minWidth || 50;
   this.myConf.minHeight = this.myConf.minHeight || 50;
   
   // Call the superconstructor
   WireIt.util.DDResize.superclass.constructor.apply(this, [container.el, container.ddResizeHandle]);
   
   // Set the resize handle
   this.setHandleElId(container.ddResizeHandle);
   
   /**
    * The event fired when the container is resized
    * @event eventResize
    */
   this.eventResize = new YAHOO.util.CustomEvent("eventResize");
};

YAHOO.extend(WireIt.util.DDResize, YAHOO.util.DragDrop, {

   /**
    * @method onMouseDown
    */
   onMouseDown: function(e) {
        var panel = this.getEl();
        this.startWidth = panel.offsetWidth;
        this.startHeight = panel.offsetHeight;

        this.startPos = [YAHOO.util.Event.getPageX(e), YAHOO.util.Event.getPageY(e)];
    },

    /**
     * @method onDrag
     */
    onDrag: function(e) {
        var newPos = [YAHOO.util.Event.getPageX(e),  YAHOO.util.Event.getPageY(e)];

        var offsetX = newPos[0] - this.startPos[0];
        var offsetY = newPos[1] - this.startPos[1];

        var newWidth = Math.max(this.startWidth + offsetX, this.myConf.minWidth);
        var newHeight = Math.max(this.startHeight + offsetY, this.myConf.minHeight);

        var panel = this.getEl();
        panel.style.width = newWidth + "px";
        panel.style.height = newHeight + "px";
        
        // Fire the resize event
        this.eventResize.fire([newWidth, newHeight]);
    }
});
(function() {
   
   var util = YAHOO.util;
   var Dom = util.Dom, Event = util.Event, CSS_PREFIX = "WireIt-";
   
/**
 * Visual module that contains terminals. The wires are updated when the module is dragged around.
 * @class Container
 * @namespace WireIt
 * @constructor
 * @param {Object}   options      Configuration object (see options property)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.Container = function(options, layer) {
   
   // Set the options
   this.setOptions(options);
   
   /**
    * the WireIt.Layer object that schould contain this container
    * @property layer
    * @type {WireIt.Layer}
    */
   this.layer = layer;
   
   /**
    * List of the terminals 
    * @property terminals
    * @type {Array}
    */
   this.terminals = [];
   
   /**
    * List of all the wires connected to this container terminals
    * @property wires
    * @type {Array}
    */
   this.wires = [];
   
   /**
    * Container DOM element
    * @property el
    * @type {HTMLElement}
    */
   this.el = null;
   
   /**
    * Body element
    * @property bodyEl
    * @type {HTMLElement}
    */
   this.bodyEl = null;
   
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
   
   // Render the div object
   this.render();
   
   // Init the terminals
   this.initTerminals( this.options.terminals);
   
	// Make the container draggable
	if(this.options.draggable) {
		   
	   if(this.options.resizable) {
      	// Make resizeable   
      	this.ddResize = new WireIt.util.DDResize(this);
      	this.ddResize.eventResize.subscribe(this.onResize, this, true);
	   }
	   
	   // Use the drag'n drop utility to make the container draggable
	   this.dd = new WireIt.util.DD(this.terminals,this.el);
	   
	   // Sets ddHandle as the drag'n drop handle
	   if(this.options.ddHandle) {
   	   this.dd.setHandleElId(this.ddHandle);
	   }
	   
	   // Mark the resize handle as an invalid drag'n drop handle and vice versa
	   if(this.options.resizable) {
   	   this.dd.addInvalidHandleId(this.ddResizeHandle);
      	this.ddResize.addInvalidHandleId(this.ddHandle);
	   }
   }
   
};

WireIt.Container.prototype = {
   
   /**
    * set the options
    * @method setOptions
    */
   setOptions: function(options) {
      
      /**
       * Main options object
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
       *    <li>title: text that will appear in the module header</li>
       *    <li>icon: image url to be displayed in the module header</li>
       *    <li>preventSelfWiring: option to prevent connections between terminals of this same container (default true)</li>
       * </ul>
       * @property options
       * @type {Object}
       */
      this.options = {};
      this.options.terminals = options.terminals || [];
      this.options.draggable = (typeof options.draggable == "undefined") ? true : options.draggable ;
      this.options.position = options.position || [100,100];
      this.options.className = options.className || CSS_PREFIX+'Container';

      this.options.ddHandle = (typeof options.ddHandle == "undefined") ? true : options.ddHandle;
      this.options.ddHandleClassName = options.ddHandleClassName || CSS_PREFIX+"Container-ddhandle";

      this.options.resizable = (typeof options.resizable == "undefined") ? true : options.resizable;
      this.options.resizeHandleClassName = options.resizeHandleClassName || CSS_PREFIX+"Container-resizehandle";

      this.options.width = options.width; // no default
      this.options.height = options.height;

      this.options.close = (typeof options.close == "undefined") ? true : options.close;
      this.options.closeButtonClassName = options.closeButtonClassName || CSS_PREFIX+"Container-closebutton";

      this.options.title = options.title; // no default
      
      this.options.icon = options.icon;
      
      this.options.preventSelfWiring = (typeof options.preventSelfWiring == "undefined") ? true : options.preventSelfWiring;
   },

   /**
    * Function called when the container is being resized.
    * It doesn't do anything, so please override it.
    * @method onResize
    */
   onResize: function(event, args) {
      var size = args[0];
      WireIt.sn(this.bodyEl, null, {width: (size[0]-10)+"px", height: (size[1]-44)+"px"});
   },

   /**
    * Render the dom of the container
    * @method render
    */
   render: function() {
   
      // Create the element
      this.el = WireIt.cn('div', {className: this.options.className});
   
      if(this.options.width) {
         this.el.style.width = this.options.width+"px";
      }
      if(this.options.height) {
         this.el.style.height = this.options.height+"px";
      }
   
      // Adds a handler for mousedown so we can notice the layer
      Event.addListener(this.el, "mousedown", this.onMouseDown, this, true);
   
      if(this.options.ddHandle) {
         // Create the drag/drop handle
      	this.ddHandle = WireIt.cn('div', {className: this.options.ddHandleClassName});
      	this.el.appendChild(this.ddHandle);
      	
         // Set title
         if(this.options.title) {
            this.ddHandle.appendChild( WireIt.cn('span', null, null, this.options.title) );
         }
         
         // Icon
         if (this.options.icon) {
            var iconCn = WireIt.cn('img', {src: this.options.icon, className: 'WireIt-Container-icon'});
            this.ddHandle.appendChild(iconCn);
         }

      }
   
      // Create the body element
      this.bodyEl = WireIt.cn('div', {className: "body"});
      this.el.appendChild(this.bodyEl);
   
      if(this.options.resizable) {
         // Create the resize handle
      	this.ddResizeHandle = WireIt.cn('div', {className: this.options.resizeHandleClassName} );
      	this.el.appendChild(this.ddResizeHandle);
      }
   
      if(this.options.close) {
         // Close button
         this.closeButton = WireIt.cn('div', {className: this.options.closeButtonClassName} );
         this.el.appendChild(this.closeButton);
         Event.addListener(this.closeButton, "click", this.onCloseButton, this, true);
      }
   
      // Append to the layer element
      this.layer.el.appendChild(this.el);
   
   	// Set the position
   	this.el.style.left = this.options.position[0]+"px";
   	this.el.style.top = this.options.position[1]+"px";
   },

   /**
    * Sets the content of the body element
    * @method setBody
    * @param {String or HTMLElement} content
    */
   setBody: function(content) {
      if(typeof content == "string") {
         this.bodyEl.innerHTML = content;
      }
      else {
         this.bodyEl.innerHTML = "";
         this.bodyEl.appendChild(content);
      }
   },

   /**
    * Called when the user made a mouse down on the container and sets the focus to this container (only if within a Layer)
    * @method onMouseDown
    */
   onMouseDown: function() {
      if(this.layer) {
         if(this.layer.focusedContainer && this.layer.focusedContainer != this) {
            this.layer.focusedContainer.removeFocus();
         }
         this.setFocus();
         this.layer.focusedContainer = this;
      }
   },

   /**
    * Adds the class that shows the container as "focused"
    * @method setFocus
    */
   setFocus: function() {
      Dom.addClass(this.el, CSS_PREFIX+"Container-focused");
   },

   /**
    * Remove the class that shows the container as "focused"
    * @method removeFocus
    */
   removeFocus: function() {
      Dom.removeClass(this.el, CSS_PREFIX+"Container-focused");
   },

   /**
    * Called when the user clicked on the close button
    * @method onCloseButton
    */
   onCloseButton: function(e, args) {
      Event.stopEvent(e);
      this.layer.removeContainer(this);
   },

   /**
    * Remove this container from the dom
    * @method remove
    */
   remove: function() {
   
      // Remove the terminals (and thus remove the wires)
      this.removeAllTerminals();
   
      // Remove from the dom
      this.layer.el.removeChild(this.el);
      
      // Remove all event listeners
      Event.purgeElement(this.el);
   },


   /**
    * Call the addTerminal method for each terminal configuration.
    * @method initTerminals
    */
   initTerminals: function(terminalConfigs) {
      for(var i = 0 ; i < terminalConfigs.length ; i++) {
         this.addTerminal(terminalConfigs[i]);
      }
   },


   /**
    * Instanciate the terminal from the class pointer "xtype" (default WireIt.Terminal)
    * @method addTerminal
    * @return {WireIt.Terminal}  terminal Created terminal
    */
   addTerminal: function(terminalConfig) {
   
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
   },

   /**
    * This method is called when a wire is added to one of the terminals
    * @method onAddWire
    * @param {Event} event The eventAddWire event fired by the terminal
    * @param {Array} args This array contains a single element args[0] which is the added Wire instance
    */
   onAddWire: function(event, args) {
      var wire = args[0];
      // add the wire to the list if it isn't in
      if( WireIt.indexOf(wire, this.wires) == -1 ) {
         this.wires.push(wire);
         this.eventAddWire.fire(wire);
      } 
   },

   /**
    * This method is called when a wire is removed from one of the terminals
    * @method onRemoveWire
    * @param {Event} event The eventRemoveWire event fired by the terminal
    * @param {Array} args This array contains a single element args[0] which is the removed Wire instance
    */
   onRemoveWire: function(event, args) {
      var wire = args[0];
      var index = WireIt.indexOf(wire, this.wires);
      if( index != -1 ) {
         this.eventRemoveWire.fire(wire);
         this.wires[index] = null;
      }
      this.wires = WireIt.compact(this.wires);
   },

   /**
    * Remove all terminals
    * @method removeAllTerminals
    */
   removeAllTerminals: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].remove();
      }
      this.terminals = [];
   },

   /**
    * Redraw all the wires connected to the terminals of this container
    * @method redrawAllTerminals
    */
   redrawAllWires: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].redrawAllWires();
      }
   },

   /**
    * Return the config of this container.
    * @method getConfig
    */
   getConfig: function() {
      var obj = {};
   
      // Position
      obj.position = Dom.getXY(this.el);
      if(this.layer) {
         // remove the layer position to the container position
         var layerPos = Dom.getXY(this.layer.el);
         obj.position[0] -= layerPos[0];
         obj.position[1] -= layerPos[1];
         // add the scroll position of the layer to the container position
         obj.position[0] += this.layer.el.scrollLeft;
         obj.position[1] += this.layer.el.scrollTop;
      }
   
      // xtype
      if(this.options.xtype) {
         obj.xtype = this.options.xtype;
      }
   
      return obj;
   },
   
   /**
    * Subclasses should override this method.
    * @method getValue
    * @return {Object} value
    */
   getValue: function() {
      return {};
   },

   /**
    * Subclasses should override this method.
    * @method setValue
    * @param {Any} val Value 
    */
   setValue: function(val) {
   },
   
   
   /**
    * @method getTerminal
    */
   getTerminal: function(name) {
      var term;
      for(var i = 0 ; i < this.terminals.length ; i++) {
         term = this.terminals[i];
         if(term.options.name == name) {
            return term;
         }
      }
      return null;
   }

};

})();/**
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
/**
 * Class used to build a container with inputEx forms
 * @class FormContainer
 * @namespace WireIt
 * @extends WireIt.Container
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.FormContainer = function(options, layer) {
   WireIt.FormContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.FormContainer, WireIt.Container, {
   
   /**
    * @method setOptions
    */
   setOptions: function(options) {
      WireIt.FormContainer.superclass.setOptions.call(this, options);
      
      this.options.legend = options.legend; 
      this.options.collapsible = options.collapsible; 
      this.options.fields = options.fields;
   },
   
   /**
    * The render method is overrided to call renderForm
    * @method render
    */
   render: function() {
      WireIt.FormContainer.superclass.render.call(this);
      this.renderForm();
   },
   
   /**
    * Render the form
    * @method renderForm
    */
   renderForm: function() {
	  this.setBackReferenceOnFieldOptionsRecursively(this.options.fields);
      
      var groupParams = {parentEl: this.bodyEl, fields: this.options.fields, legend: this.options.legend, collapsible: this.options.collapsible};
      this.form = new YAHOO.inputEx.Group(groupParams);
   },
   
	/**
	 * When creating wirable input fields, the field configuration (inputParams) must have a reference to the current container (this is used for positionning).
	 * For complex fields (like object or list), the reference is set recursively AFTER the field creation.
	 * @method setBackReferenceOnFieldOptionsRecursively
	 */
   setBackReferenceOnFieldOptionsRecursively: function(fieldArray) {
      for(var i = 0 ; i < fieldArray.length ; i++) {
    	  var inputParams = fieldArray[i].inputParams;
    	  inputParams.container = this;

    	  // Checking for group sub elements
    	  if(inputParams.fields && typeof inputParams.fields == 'object') {
    		  this.setBackReferenceOnFieldOptionsRecursively(inputParams.fields);
    	  }

    	  // Checking for list sub elements
    	  if(inputParams.elementType) {
    		  inputParams.elementType.inputParams.container = this;

    		  // Checking for group elements within list elements
    		  if(inputParams.elementType.inputParams.fields && typeof inputParams.elementType.inputParams.fields == 'object') {
    			  this.setBackReferenceOnFieldOptionsRecursively(inputParams.elementType.inputParams.fields);
    		  }
    	  }
      }
   },
   
   /**
    * @method getValue
    */
   getValue: function() {
      return this.form.getValue();
   },
   
   /**
    * @method setValue
    */
   setValue: function(val) {
      this.form.setValue(val);
   }
   
});
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

})();(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;


/**
 * Module Proxy handle the drag/dropping from the module list to the layer (in the WiringEditor)
 * @class ModuleProxy
 * @constructor
 * @param {HTMLElement} el
 * @param {WireIt.WiringEditor} WiringEditor
 */
WireIt.ModuleProxy = function(el, WiringEditor) {
   
   this._WiringEditor = WiringEditor;
   
   // Init the DDProxy
   WireIt.ModuleProxy.superclass.constructor.call(this,el, "module", {
        dragElId: "moduleProxy"
    });
    
    this.isTarget = false; 
};
YAHOO.extend(WireIt.ModuleProxy,YAHOO.util.DDProxy, {
   
   /**
    * copy the html and apply selected classes
    * @method startDrag
    */
   startDrag: function(e) {
      WireIt.ModuleProxy.superclass.startDrag.call(this,e);
       var del = this.getDragEl(),
			  lel = this.getEl();
       del.innerHTML = lel.innerHTML;
       del.className = lel.className;
   },
   
   /**
    * Override default behavior of DDProxy
    * @method endDrag
    */
   endDrag: function(e) {},
    
   /**
    * Add the module to the WiringEditor on drop on layer
    * @method onDragDrop
    */
   onDragDrop: function(e, ddTargets) { 
      // The layer is the only target :
      var layerTarget = ddTargets[0],
			 layer = ddTargets[0]._layer,
			 del = this.getDragEl(),
			 pos = YAHOO.util.Dom.getXY(del),
			 layerPos = YAHOO.util.Dom.getXY(layer.el);
      this._WiringEditor.addModule( this._module ,[pos[0]-layerPos[0]+layer.el.scrollLeft, pos[1]-layerPos[1]+layer.el.scrollTop]);
    }
   
});


/**
 * The WiringEditor class provides a full page interface 
 * @class WiringEditor
 * @constructor
 * @param {Object} options
 */
WireIt.WiringEditor = function(options) {
	
	 /**
	  * Hash object to reference module definitions by their name
	  * @property modulesByName
	  * @type {Object}
	  */
    this.modulesByName = {};

    // set the default options
    this.setOptions(options);
    
    /**
     * Container DOM element
     * @property el
     */
    this.el = Dom.get(options.parentEl);
    
    /**
     * @property helpPanel
     * @type {YAHOO.widget.Panel}
     */
    this.helpPanel = new widget.Panel('helpPanel', {
        fixedcenter: true,
        draggable: true,
        visible: false,
        modal: true
     });
     this.helpPanel.render();
	
    
    /**
     * @property layout
     * @type {YAHOO.widget.Layout}
     */
    this.layout = new widget.Layout(this.el, this.options.layoutOptions);
    this.layout.render();

	 // Right accordion
    this.renderAccordion();

    /**
     * @property layer
     * @type {WireIt.Layer}
     */
    this.layer = new WireIt.Layer(this.options.layerOptions);
	 this.layer.eventChanged.subscribe(this.onLayerChanged, this, true);

	 /**
	  * @property leftEl
	  * @type {DOMElement}
	  */
    this.leftEl = Dom.get('left');

    // Render module list
    this.buildModulesList();

    // Render buttons
    this.renderButtons();

 	 // Saved status
	 this.renderSavedStatus();

    // Properties Form
    this.renderPropertiesForm();

	 // LoadWirings
	 if( this.adapter.init && YAHOO.lang.isFunction(this.adapter.init) ) {
			this.adapter.init();
 	 }
	 this.load();
};

WireIt.WiringEditor.prototype = {

 /**
  * @method setOptions
  * @param {Object} options
  */
 setOptions: function(options) {
    
    /**
     * @property options
     * @type {Object}
     */
    this.options = {};
    
    // Load the modules from options
    this.modules = options.modules || [];
    for(var i = 0 ; i < this.modules.length ; i++) {
       var m = this.modules[i];
       this.modulesByName[m.name] = m;
    }

	 this.adapter = options.adapter || WireIt.WiringEditor.adapters.JsonRpc;
     
    this.options.languageName = options.languageName || 'anonymousLanguage';
    
    this.options.propertiesFields = options.propertiesFields || [
		{"type": "string", inputParams: {"name": "name", label: "Title", typeInvite: "Enter a title" } },
		{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30, rows: 4} }
	 ];
    
    this.options.layoutOptions = options.layoutOptions || {
	 	units: [
	   	{ position: 'top', height: 50, body: 'top'},
	      { position: 'left', width: 200, resize: true, body: 'left', gutter: '5px', collapse: true, 
	        collapseSize: 25, header: 'Modules', scroll: true, animate: true },
	      { position: 'center', body: 'center', gutter: '5px' },
	      { position: 'right', width: 320, resize: true, body: 'right', gutter: '5px', collapse: true, 
	        collapseSize: 25, /*header: 'Properties', scroll: true,*/ animate: true }
	   ]
	};
     
    this.options.layerOptions = {};
    var layerOptions = options.layerOptions || {};
    this.options.layerOptions.parentEl = layerOptions.parentEl ? layerOptions.parentEl : Dom.get('center');
    this.options.layerOptions.layerMap = YAHOO.lang.isUndefined(layerOptions.layerMap) ? true : layerOptions.layerMap;
    this.options.layerOptions.layerMapOptions = layerOptions.layerMapOptions || { parentEl: 'layerMap' };

	 this.options.accordionViewParams = options.accordionViewParams || {
												collapsible: true, 
												expandable: true, // remove this parameter to open only one panel at a time
												width: '308px', 
												expandItem: 0, 
												animationSpeed: '0.3', 
												animate: true, 
												effect: YAHOO.util.Easing.easeBothStrong
											};
 },

	
	/**
	 * Render the accordion using yui-accordion
  	 */
	renderAccordion: function() {
		this.accordionView = new YAHOO.widget.AccordionView('accordionView', this.options.accordionViewParams);
	},
 
 /**
  * Render the properties form
  * @method renderPropertiesForm
  */
 renderPropertiesForm: function() {
    this.propertiesForm = new inputEx.Group({
       parentEl: YAHOO.util.Dom.get('propertiesForm'),
       fields: this.options.propertiesFields
    });

	this.propertiesForm.updatedEvt.subscribe(function() {
		this.markUnsaved();
	}, this, true);
 },
 
 /**
  * Build the left menu on the left
  * @method buildModulesList
  */
 buildModulesList: function() {

     var modules = this.modules;
     for(var i = 0 ; i < modules.length ; i++) {
		  this.addModuleToList(modules[i]);
     }

     // Make the layer a drag drop target
     if(!this.ddTarget) {
       this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");
       this.ddTarget._layer = this.layer;
     }
     
 },

 /**
  * Add a module definition to the left list
  */
 addModuleToList: function(module) {
	
		var div = WireIt.cn('div', {className: "WiringEditor-module"});
      if(module.container.icon) {
         div.appendChild( WireIt.cn('img',{src: module.container.icon}) );
      }
      div.appendChild( WireIt.cn('span', null, null, module.name) );

      var ddProxy = new WireIt.ModuleProxy(div, this);
      ddProxy._module = module;

      this.leftEl.appendChild(div);
 },
 
 /**
  * add a module at the given pos
  */
 addModule: function(module, pos) {
    try {
       var containerConfig = module.container;
       containerConfig.position = pos;
       containerConfig.title = module.name;
       var container = this.layer.addContainer(containerConfig);
       Dom.addClass(container.el, "WiringEditor-module-"+module.name);
    }
    catch(ex) {
       this.alert("Error Layer.addContainer: "+ ex.message);
    }    
 },

 /**
  * Toolbar
  * @method renderButtons
  */
 renderButtons: function() {
    var toolbar = Dom.get('toolbar');
    // Buttons :
    var newButton = new widget.Button({ label:"New", id:"WiringEditor-newButton", container: toolbar });
    newButton.on("click", this.onNew, this, true);

    var loadButton = new widget.Button({ label:"Load", id:"WiringEditor-loadButton", container: toolbar });
    loadButton.on("click", this.load, this, true);

    var saveButton = new widget.Button({ label:"Save", id:"WiringEditor-saveButton", container: toolbar });
    saveButton.on("click", this.onSave, this, true);

    var deleteButton = new widget.Button({ label:"Delete", id:"WiringEditor-deleteButton", container: toolbar });
    deleteButton.on("click", this.onDelete, this, true);

    var helpButton = new widget.Button({ label:"Help", id:"WiringEditor-helpButton", container: toolbar });
    helpButton.on("click", this.onHelp, this, true);
 },

	/**
	 * @method renderSavedStatus
	 */
	renderSavedStatus: function() {
		var top = Dom.get('top');
		this.savedStatusEl = WireIt.cn('div', {className: 'savedStatus', title: 'Not saved'}, {display: 'none'}, "*");
		top.appendChild(this.savedStatusEl);
	},

 /**
  * save the current module
  * @method saveModule
  */
 saveModule: function() {
    
    var value = this.getValue();
    
    if(value.name === "") {
       this.alert("Please choose a name");
       return;
    }

	this.tempSavedWiring = {name: value.name, working: JSON.stringify(value.working), language: this.options.languageName };
                
    this.adapter.saveWiring(this.tempSavedWiring, {
       success: this.saveModuleSuccess,
       failure: this.saveModuleFailure,
       scope: this
    });

 },

 /**
  * saveModule success callback
  * @method saveModuleSuccess
  */
 saveModuleSuccess: function(o) {

	this.markSaved();

   this.alert("Saved !");

	// TODO:
	/*var name = this.tempSavedWiring.name;	
	if(this.modulesByName.hasOwnProperty(name) ) {
		//already exists
	}
	else {
		//new one
	}*/
	
 },

 /**
  * saveModule failure callback
  * @method saveModuleFailure
  */
 saveModuleFailure: function(errorStr) {
    this.alert("Unable to save the wiring : "+errorStr);
 },

	alert: function(txt) {
		if(!this.alertPanel){ this.renderAlertPanel(); }
		Dom.get('alertPanelBody').innerHTML = txt;
		this.alertPanel.show();
	},

 /**
  * Create a help panel
  * @method onHelp
  */
 onHelp: function() {
    this.helpPanel.show();
 },

 /**
  * @method onNew
  */
 onNew: function() {
	
	if(!this.isSaved()) {
		if( !confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.") ) {
			return;
		}
	}
	
	this.preventLayerChangedEvent = true;
	
   this.layer.clear(); 

   this.propertiesForm.clear(false); // false to tell inputEx to NOT send the updatedEvt

	this.markSaved();

	this.preventLayerChangedEvent = false;
 },

 /**
  * @method onDelete
  */
 onDelete: function() {
    if( confirm("Are you sure you want to delete this wiring ?") ) {
       
      var value = this.getValue();
 		this.adapter.deleteWiring({name: value.name, language: this.options.languageName},{
 			success: function(result) {
				this.onNew();
 				this.alert("Deleted !");
 			},
			failure: function(errorStr) {
				this.alert("Unable to delete wiring: "+errorStr);
			},
			scope: this
 		});
       
    }
 },

 /**
  * @method onSave
  */
 onSave: function() {
    this.saveModule();
 },

 /**
  * @method renderLoadPanel
  */
 renderLoadPanel: function() {
    if( !this.loadPanel) {
       this.loadPanel = new widget.Panel('WiringEditor-loadPanel', {
          fixedcenter: true,
          draggable: true,
          width: '500px',
          visible: false,
          modal: true
       });
       this.loadPanel.setHeader("Select the wiring to load");
       this.loadPanel.setBody("Filter: <input type='text' id='loadFilter' /><div id='loadPanelBody'></div>");
       this.loadPanel.render(document.body);

		// Listen the keyup event to filter the module list
		Event.onAvailable('loadFilter', function() {
			Event.addListener('loadFilter', "keyup", this.inputFilterTimer, this, true);
		}, this, true);

    }
 },

	/**
	 * Method called from each keyup on the search filter in load panel.
	 * The real filtering occurs only after 500ms so that the filter process isn't called too often
	 */
	inputFilterTimer: function() {
		if(this.inputFilterTimeout) {
			clearTimeout(this.inputFilterTimeout);
			this.inputFilterTimeout = null;
		}
		var that = this;
		this.inputFilterTimeout = setTimeout(function() {
				that.updateLoadPanelList(Dom.get('loadFilter').value);
		}, 500);
	},


 /**
  * @method updateLoadPanelList
  */
 updateLoadPanelList: function(filter) {
	
    var list = WireIt.cn("ul");
    if(lang.isArray(this.pipes)) {
       for(var i = 0 ; i < this.pipes.length ; i++) {
          var module = this.pipes[i];
          this.pipesByName[module.name] = module;
          if(!filter || filter === "" || module.name.match(new RegExp(filter,"i")) ) {
	          list.appendChild( WireIt.cn('li',null,{cursor: 'pointer'},module.name) );
			}
       }
    }
    var panelBody = Dom.get('loadPanelBody');
    panelBody.innerHTML = "";
    panelBody.appendChild(list);

    Event.addListener(list, 'click', function(e,args) {
    	this.loadPipe(Event.getTarget(e).innerHTML);
    }, this, true);

 },

 /**
  * @method load
  */
 load: function() {
    
    this.adapter.listWirings({language: this.options.languageName},{
			success: function(result) {
				this.onLoadSuccess(result);
			},
			failure: function(errorStr) {
				this.alert("Unable to load the wirings: "+errorStr);
			},
			scope: this
		}
		);

 },

 /**
  * @method onLoadSuccess
  */
 onLoadSuccess: function(wirings) {
		this.pipes = wirings;
		this.pipesByName = {};
		
		this.renderLoadPanel();
    	this.updateLoadPanelList();

		if(!this.afterFirstRun) {
			var p = window.location.search.substr(1).split('&');
			var oP = {};
			for(var i = 0 ; i < p.length ; i++) {
				var v = p[i].split('=');
				oP[v[0]]=window.decodeURIComponent(v[1]);
			}
			this.afterFirstRun = true;
			if(oP.autoload) {
				this.loadPipe(oP.autoload);
				return;
			}
		}

    this.loadPanel.show();
	},

 /**
  * @method getPipeByName
  * @param {String} name Pipe's name
  * @return {Object} return the evaled json pipe configuration
  */
 getPipeByName: function(name) {
    var n = this.pipes.length,ret;
    for(var i = 0 ; i < n ; i++) {
       if(this.pipes[i].name == name) {
          // Try to eval working property:
          try {
             ret = JSON.parse(this.pipes[i].working);
             return ret;
          }
          catch(ex) {
             this.alert("Unable to eval working json for module "+name);
             return null;
          }
       }
    }
    
    return null;
 },
 
 /**
  * @method loadPipe
  * @param {String} name Pipe name
  */
 loadPipe: function(name) {
	
	if(!this.isSaved()) {
		if( !confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.") ) {
			return;
		}
	}
	
	try {
	
		this.preventLayerChangedEvent = true;
	
     this.loadPanel.hide();
	
    var wiring = this.getPipeByName(name), i;

	 if(!wiring) {
		this.alert("The wiring '"+name+"' was not found.");
		return;
  	 }
    
    // TODO: check if current wiring is saved...
    this.layer.clear();
    
    this.propertiesForm.setValue(wiring.properties, false); // the false tells inputEx to NOT fire the updatedEvt
    
    if(lang.isArray(wiring.modules)) {
      
       // Containers
       for(i = 0 ; i < wiring.modules.length ; i++) {
          var m = wiring.modules[i];
          if(this.modulesByName[m.name]) {
             var baseContainerConfig = this.modulesByName[m.name].container;
             YAHOO.lang.augmentObject(m.config, baseContainerConfig); 
             m.config.title = m.name;
             var container = this.layer.addContainer(m.config);
             Dom.addClass(container.el, "WiringEditor-module-"+m.name);
             container.setValue(m.value);
          }
          else {
             throw new Error("WiringEditor: module '"+m.name+"' not found !");
          }
       }
       
       // Wires
       if(lang.isArray(wiring.wires)) {
           for(i = 0 ; i < wiring.wires.length ; i++) {
              // On doit chercher dans la liste des terminaux de chacun des modules l'index des terminaux...
              this.layer.addWire(wiring.wires[i]);
           }
        }
     }
     
	this.markSaved();
	
	this.preventLayerChangedEvent = false;
	
  	}
  	catch(ex) {
     	this.alert(ex);
  	}
 },

 	renderAlertPanel: function() {
		
 	 /**
     * @property alertPanel
     * @type {YAHOO.widget.Panel}
     */
		this.alertPanel = new widget.Panel('WiringEditor-alertPanel', {
         fixedcenter: true,
         draggable: true,
         width: '500px',
         visible: false,
         modal: true
      });
      this.alertPanel.setHeader("Message");
      this.alertPanel.setBody("<div id='alertPanelBody'></div><button id='alertPanelButton'>Ok</button>");
      this.alertPanel.render(document.body);
		Event.addListener('alertPanelButton','click', function() {
			this.alertPanel.hide();
		}, this, true);
	},

	onLayerChanged: function() {
		if(!this.preventLayerChangedEvent) {
			this.markUnsaved();
		}
	},

	markSaved: function() {
		this.savedStatusEl.style.display = 'none';
	},
	
	markUnsaved: function() {
		this.savedStatusEl.style.display = '';
	},

	isSaved: function() {
		return (this.savedStatusEl.style.display == 'none');
	},
 
 /**
  * This method return a wiring within the given vocabulary described by the modules list
  * @method getValue
  */
 getValue: function() {
    
   var i;
   var obj = {modules: [], wires: [], properties: null};

   for( i = 0 ; i < this.layer.containers.length ; i++) {
      obj.modules.push( {name: this.layer.containers[i].options.title, value: this.layer.containers[i].getValue(), config: this.layer.containers[i].getConfig()});
   }

   for( i = 0 ; i < this.layer.wires.length ; i++) {
      var wire = this.layer.wires[i];

      var wireObj = { 
         src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.layer.containers), terminal: wire.terminal1.options.name}, 
         tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.layer.containers), terminal: wire.terminal2.options.name}
      };
      obj.wires.push(wireObj);
   }
   
   obj.properties = this.propertiesForm.getValue();
    
   return {
      name: obj.properties.name,
      working: obj
   };
 }


};


/**
 * WiringEditor Adapters
 * @static
 */
WireIt.WiringEditor.adapters = {};


})();
   /**
 * Container represented by an image
 * @class ImageContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.ImageContainer = function(options, layer) {
   WireIt.ImageContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.ImageContainer, WireIt.Container, {
   
   /**
    * @method setOptions
    * @param {Object} options the options object
    */
   setOptions: function(options) {
      WireIt.ImageContainer.superclass.setOptions.call(this, options);
      
      this.options.image = options.image;
      this.options.xtype = "WireIt.ImageContainer";
      
      this.options.className = options.className || "WireIt-Container WireIt-ImageContainer";
      
      // Overwrite default value for options:
      this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;
      this.options.ddHandle = (typeof options.ddHandle == "undefined") ? false : options.ddHandle;
   },
   
   /**
    * @method render
    */
   render: function() {
      WireIt.ImageContainer.superclass.render.call(this);
      YAHOO.util.Dom.setStyle(this.bodyEl, "background-image", "url("+this.options.image+")");
   }
   
});/**
 * Container with left inputs and right outputs
 * @class InOutContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.InOutContainer = function(options, layer) {
   WireIt.InOutContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.InOutContainer, WireIt.Container, {
   
   /**
    * @method setOptions
    * @param {Object} options the options object
    */
   setOptions: function(options) {
      WireIt.InOutContainer.superclass.setOptions.call(this, options);
      
      this.options.xtype = "WireIt.InOutContainer";
      
      this.options.className = options.className || "WireIt-Container WireIt-InOutContainer";
      
      // Overwrite default value for options:
      this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;

		this.options.inputs = options.inputs || [];
		this.options.outputs = options.outputs || [];

   },
   
   render: function() {
      WireIt.InOutContainer.superclass.render.call(this);

		for(var i = 0 ; i < this.options.inputs.length ; i++) {
			var input = this.options.inputs[i];
			this.options.terminals.push({
				"name": input, 
				"direction": [-1,0], 
				"offsetPosition": {"left": -14, "top": 3+30*(i+1) }, 
				"ddConfig": {
             	"type": "input",
             	"allowedTypes": ["output"]
          	}
 			});
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px"}, input));
		}
		
		for(i = 0 ; i < this.options.outputs.length ; i++) {
			var output = this.options.outputs[i];
			this.options.terminals.push({
				"name": output, 
				"direction": [1,0], 
				"offsetPosition": {"right": -14, "top": 3+30*(i+1+this.options.inputs.length) }, 
				"ddConfig": {
             "type": "output",
             "allowedTypes": ["input"]
          	},
				"alwaysSrc": true
			});
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px", textAlign: "right"}, output));
		}
		
   }
   
});