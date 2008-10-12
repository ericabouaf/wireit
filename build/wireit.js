/**
 * @fileoverview Set the WireIt namespace ; DOM and Canvas helpers
 */
/**
 * @namespace WireIt main namespace (only global variable !)
 */
var WireIt = {
   
   /**
    * Get a css property in pixels and convert it to an integer
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
    * @function indexOf replace Array.indexOf for cases where it isn't available (IE6 only ?)
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
    * @function compact replace Array.compact for cases where it isn't available
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
 * @namespace WireIt.util contains utility classes
 */
WireIt.util = {};
/**
 * @fileoverview Define the WireIt.CanvasElement class
 */
(function () {
   
   // Shortcuts
   var Event = YAHOO.util.Event, UA = YAHOO.env.ua;

   /**
    * @class Create a canvas element and wrap cross-browser hacks to resize it
    * @constructor
    */
   WireIt.CanvasElement = function() {
      
      // Create the canvas element
      this.element = document.createElement('canvas');
      
      // excanvas.js for dynamic canvas tags
      if(typeof (G_vmlCanvasManager)!="undefined"){
         this.element = G_vmlCanvasManager.initElement(this.element);
      }
      
   };
   
   WireIt.CanvasElement.prototype = {
      
      /**
       * Get a drawing context
       * @param {String} [mode] Context mode (default "2d")
       * @return {CanvasContext} the context
       */
      getContext: function(mode) {
      	return this.element.getContext(mode || "2d");
      },
      
      /**
       * Set the canvas position and size 
       * @function
       * @param {Number} left Left position
       * @param {Number} top Top position
       * @param {Number} width New width
       * @param {Number} height New height
       */
      SetCanvasRegion: UA.ie ? 
               // IE
               function(left,top,width,height){
                  WireIt.sn(this.element,null,{left:left+"px",top:top+"px",width:width+"px",height:height+"px"});
                  this.getContext().clearRect(0,0,width,height);
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
 * @fileoverview Defines the Wire class that wraps a canvas tag to create wires.
 */
/**
 * @class The wire widget that uses a canvas to render
 * @extends WireIt.CanvasElement
 * @constructor
 * @param  {WireIt.Terminal}    terminal1   Source terminal
 * @param  {WireIt.Terminal}    terminal2   Target terminal
 * @param  {DomEl}              parentEl    Container of the CANVAS tag
 * @param  {Obj}                config      Styling configuration
 */
WireIt.Wire = function( terminal1, terminal2, parentEl, config) {
   
   /**
    * Reference to the parent dom element
    */
   this.parentEl = parentEl;
   
   /**
    * Reference to the first terminal
    */
   this.terminal1 = terminal1;
   
   /**
    * Reference to the second terminal
    */
   this.terminal2 = terminal2;
   
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
    */
   this.config = config || {};
   this.config.className = this.config.className || 'WireIt-Wire';
   this.config.coeffMulDirection = YAHOO.lang.isUndefined(this.config.coeffMulDirection) ? 100 : this.config.coeffMulDirection;
   
   // Syling
   this.config.drawingMethod = this.config.drawingMethod || 'bezier';
   this.config.cap = this.config.cap || 'round';
   this.config.bordercap = this.config.bordercap || 'round';
   this.config.width = this.config.width || 3;
   this.config.borderwidth = this.config.borderwidth || 1;
   this.config.color = this.config.color || 'rgb(173, 216, 230)';
   this.config.bordercolor = this.config.bordercolor || '#0000ff';
   
   // Create the canvas element
   WireIt.Wire.superclass.constructor.call(this);
   
   this.element.className = this.config.className;
   
   // Append the canvas to the parent element
   this.parentEl.appendChild(this.element);
   
   
   // Call addWire on both terminals
   this.terminal1.addWire(this);
   this.terminal2.addWire(this);
};


YAHOO.lang.extend(WireIt.Wire, WireIt.CanvasElement, 
/**
 * @scope WireIt.Wire.prototype
 */  
{
   /**
    * Remove a Wire from the Dom
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
    */
   drawBezierCurve: function() {
   
      // Get the positions of the terminals
      var p1 = this.terminal1.getXY();
      var p2 = this.terminal2.getXY();
   
      // Coefficient multiplicateur de direction
      // 100 par défaut, si distance(p1,p2) < 100, on passe en distance/2
      var coeffMulDirection=this.config.coeffMulDirection;
   
   
      var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
      if(distance < coeffMulDirection){
         coeffMulDirection=distance/2;
      }
   
      // Calcul des vecteurs directeurs d1 et d2 :
      var d1=[this.terminal1.config.direction[0]*coeffMulDirection,this.terminal1.config.direction[1]*coeffMulDirection];
      var d2=[this.terminal2.config.direction[0]*coeffMulDirection,this.terminal2.config.direction[1]*coeffMulDirection];
   
      var bezierPoints=[];
      bezierPoints[0]=p1;
      bezierPoints[1]=[p1[0]+d1[0],p1[1]+d1[1]];
      bezierPoints[2]=[p2[0]+d2[0],p2[1]+d2[1]];
      bezierPoints[3]=p2;
      var min=[p1[0],p1[1]];
      var max=[p1[0],p1[1]];
      for(var i=1;i<bezierPoints.length;i++){
         var p=bezierPoints[i];
         if(p[0]<min[0]){
            min[0]=p[0];
         }
         if(p[1]<min[1]){
            min[1]=p[1];
         }
         if(p[0]>max[0]){
            max[0]=p[0];
         }
         if(p[1]>max[1]){
            max[1]=p[1];
         }
      }
      // Redimensionnement du canvas
      var margin=[4,4];
      min[0]=min[0]-margin[0];
      min[1]=min[1]-margin[1];
      max[0]=max[0]+margin[0];
      max[1]=max[1]+margin[1];
      var lw=Math.abs(max[0]-min[0]);
      var lh=Math.abs(max[1]-min[1]);
   
      this.SetCanvasRegion(min[0],min[1],lw,lh);
   
      var ctxt=this.getContext();
      for(var i=0;i<bezierPoints.length;i++){
         bezierPoints[i][0]=bezierPoints[i][0]-min[0];
         bezierPoints[i][1]=bezierPoints[i][1]-min[1];
      }
   
      // Draw the border
      ctxt.lineCap=this.config.bordercap;
      ctxt.strokeStyle=this.config.bordercolor;
      ctxt.lineWidth=this.config.width+this.config.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
      ctxt.stroke();
   
      // Draw the inner bezier curve
      ctxt.lineCap=this.config.cap;
      ctxt.strokeStyle=this.config.color;
      ctxt.lineWidth=this.config.width;
      ctxt.beginPath();
      ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
      ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
      ctxt.stroke();
   
   },



   /**
    * This function returns terminal1 if the first argument is terminal2 and vice-versa
    * @param   {WireIt.Terminal} terminal    
    * @return  {WireIt.Terminal} terminal    the terminal that is NOT passed as argument
    */
   getOtherTerminal: function(terminal) {
      return (terminal == this.terminal1) ? this.terminal2 : this.terminal1;
   },
   
   
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
      ctxt.lineCap=this.config.bordercap;
      ctxt.strokeStyle=this.config.bordercolor;
      ctxt.lineWidth=this.config.width+this.config.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();

      // Draw the inner bezier curve
      ctxt.lineCap=this.config.cap;
      ctxt.strokeStyle=this.config.color;
      ctxt.lineWidth=this.config.width;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();

   	/* start drawing arrows */

   	var t1 = p1;
   	var t2 = p2;

   	var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
   	var dlug = 20; //arrow length
   	var t = 1-(dlug/distance);
   	z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
   	z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );	

   	//line which connects the terminals: y=ax+b
   	var W = t1[0] - t2[0];
   	var Wa = t1[1] - t2[1];
   	var Wb = t1[0]*t2[1] - t1[1]*t2[0];
   	if (W != 0)
   	{
   		a = Wa/W;
   		b = Wb/W;
   	}
   	else
   	{
   		a = 0;
   	}
   	//line perpendicular to the main line: y = aProst*x + b
   	if (a == 0)
   	{
   		aProst = 0;
   	}
   	else
   	{
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
   	ctxt.fillStyle = this.config.color;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.fill();

   	//triangle border	
   	ctxt.strokeStyle = this.config.bordercolor;
   	ctxt.lineWidth = this.config.borderwidth;
   	ctxt.beginPath();
   	ctxt.moveTo(t2[0],t2[1]);
   	ctxt.lineTo(x1,y1);
   	ctxt.lineTo(x2,y2);
   	ctxt.lineTo(t2[0],t2[1]);
   	ctxt.stroke();

   },
   
   drawStraight: function()
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
      ctxt.lineCap=this.config.bordercap;
      ctxt.strokeStyle=this.config.bordercolor;
      ctxt.lineWidth=this.config.width+this.config.borderwidth*2;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();

      // Draw the inner bezier curve
      ctxt.lineCap=this.config.cap;
      ctxt.strokeStyle=this.config.color;
      ctxt.lineWidth=this.config.width;
      ctxt.beginPath();
      ctxt.moveTo(p1[0],p1[1]);
      ctxt.lineTo(p2[0],p2[1]);
      ctxt.stroke();
   },
   
   redraw: function() {
      if(this.config.drawingMethod == 'straight') {
         this.drawStraight();
      }
      else if(this.config.drawingMethod == 'arrows') {
         this.drawArrows();
      }
      else if(this.config.drawingMethod == 'bezier') {
         this.drawBezierCurve();
      }
      else {
         throw new Error("WireIt.Wire unable to find '"+this.drawingMethod+"' drawing method.");
      }
   }


});

/**
 * @fileoverview Terminals represent the end points of the "wires"
 */
(function() {

   var Event = YAHOO.util.Event, lang = YAHOO.lang;
   var CSS_PREFIX = "WireIt-";


   /**
    * @class Scissors widget to cut wires
    * @extends YAHOO.util.Element
    * @constructor
    * @param {WireIt.Terminal} terminal Associated terminal
    * @param {Object} oConfigs 
    */
   WireIt.Scissors = function(terminal, oConfigs) {
      WireIt.Scissors.superclass.constructor.call(this, document.createElement('div'), oConfigs);

      this._terminal = terminal;
      this.initScissors();
   };
   lang.extend(WireIt.Scissors, YAHOO.util.Element, 
      /**
       * @scope WireIt.Scissors.prototype
       */
      {
      
      initScissors: function() {
         
         // Display the cut button
         this.hideNow();
         this.addClass(CSS_PREFIX+"Wire-scissors");
         
         if(this._terminal.container) {
            this.appendTo(this._terminal.el);
            this.setStyle("left", (this._terminal.config.direction[0]*30)+"px");
            this.setStyle("top", (this._terminal.config.direction[1]*30)+"px");
         }
         else {
            var termPos = this._terminal.getXY();
            this.appendTo(this._terminal.el.parentNode.parentNode);
            this.setStyle("left", (termPos[0]+this._terminal.config.direction[0]*30-13)+"px");
            this.setStyle("top", (termPos[1]+this._terminal.config.direction[1]*30-10)+"px");
         }

         // Ajoute un listener sur le scissor:
         this.on("mouseover", this.show, this, true);
         this.on("mouseout", this.hide, this, true);
         this.on("click", this.scissorClick, this, true);
         
         // On mouseover/mouseout to display/hide the scissors
         Event.addListener(this._terminal.el, "mouseover", this.mouseOver, this, true);
         Event.addListener(this._terminal.el, "mouseout", this.hide, this, true);
      },
      
      mouseOver: function() {
         if(this._terminal.wires.length > 0)  {
            this.show();
         }
      },

      scissorClick: function() {
         this._terminal.removeAllWires();
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
         this.hideNow();
      },   
      
      show: function() {
         this.setStyle('display','');
         if(this.terminalTimeout) { this.terminalTimeout.cancel(); }
      },
      
      hide: function() {
         this.terminalTimeout = lang.later(700,this,this.hideNow);
      },
      
      hideNow: function() {
         this.setStyle('display','none');
      }

   });




   
   
/**
 * @class This class is used for wire edition. It inherits from YAHOO.util.DDProxy and acts as a "temporary" Terminal.
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {WireIt.Terminal} terminal Parent terminal
 * @param {Object} config Configuration object (see in properties for details)
 */
WireIt.TerminalProxy = function(terminal, config) {
   
   /**
    * Reference to the terminal parent
    */
   this.terminal = terminal;
   
   /**
    * Object containing the configuration object
    * <ul>
    *   <li>type: 'type' of this terminal. If no "allowedTypes" is specified in the config, the terminal will only connect to the same type of terminal</li>
    *   <li>allowedTypes: list of all the allowed types that we can connect to.</li>
    * </ul>
    */
   // WARNING: the object config cannot be called "config" because YAHOO.util.DDProxy already has a "config" property
   this.termConfig = config || {};
   
   /**
    * Object that emulate a terminal which is following the mouse
    */
   this.fakeTerminal = null;
   
   // Init the DDProxy
   WireIt.TerminalProxy.superclass.constructor.call(this,this.terminal.el);
};

// Mode Intersect to get the DD objects
YAHOO.util.DDM.mode = YAHOO.util.DDM.INTERSECT;

YAHOO.extend(WireIt.TerminalProxy,YAHOO.util.DDProxy,
/**
 * @scope WireIt.TerminalProxy.prototype   
 */   
{      
   startDrag: function() {
      
      // If only one wire admitted, we remove the previous wire
      if(this.terminal.config.nMaxWires == 1 && this.terminal.wires.length == 1) {
         this.terminal.wires[0].remove();
      }
      // If the number of wires is at its maximum, prevent editing...
      else if(this.terminal.wires.length >= this.terminal.config.nMaxWires) {
         return;
      }
      
      this.fakeTerminal = {
         config: {direction: this.terminal.config.fakeDirection},
         pos: [200,200], 
         addWire: function() {},
         removeWire: function() {},
         getXY: function() { 
            return this.pos; 
         }
      };
      
      var parentEl = this.terminal.parentEl.parentNode;
      if(this.terminal.container) {
         parentEl = this.terminal.container.layer.el;
      }
      this.editingWire = new WireIt.Wire(this.terminal, this.fakeTerminal, parentEl, this.terminal.config.editingWireConfig);
      YAHOO.util.Dom.addClass(this.editingWire.el, 'WireIt-Wire-editing');
   },
   
   onDrag: function(e) {
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
         this.fakeTerminal.pos = [e.clientX+window.pageXOffset, e.clientY+window.pageYOffset];
      }
      this.editingWire.redraw();
   },
   
   endDrag: function(e) {
      if(this.editingWire) {
         this.editingWire.remove();
         this.editingWire = null;
      }
   },
   
   onDragEnter: function(e,ddTargets) {
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            ddTargets[i].terminal.setDropInvitation(true);
         }
      }
   },
   
   onDragOut: function(e,ddTargets) { 
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( this.isValidWireTerminal(ddTargets[i]) ) {
            ddTargets[i].terminal.setDropInvitation(false);
         }
      }
   },
   
   onDragDrop: function(e,ddTargets) {
      this.onDragOut(e,ddTargets);
      
      var targetTerminalProxy = null;
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( ddTargets[i].isWireItTerminal ) {
            targetTerminalProxy =  ddTargets[i];
         }
      }
      
      // Connect to the FIRST target terminal
      if( targetTerminalProxy ) {
         if( this.isValidWireTerminal(targetTerminalProxy) ) { 
            
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
            if(!termAlreadyConnected) {
               
               
               var parentEl = this.terminal.parentEl.parentNode;
               if(this.terminal.container) {
                  parentEl = this.terminal.container.layer.el;
               }
               
               // Check the number of wires for this terminal
               if( targetTerminalProxy.terminal.config.nMaxWires == 1) {
                  if(targetTerminalProxy.terminal.wires.length > 0) {
                     targetTerminalProxy.terminal.wires[0].remove();
                  }
                  
                  var w = new WireIt.Wire(this.terminal, targetTerminalProxy.terminal, parentEl, this.terminal.config.wireConfig);
                  w.redraw();
               }
               else if(targetTerminalProxy.terminal.wires.length < targetTerminalProxy.terminal.config.nMaxWires) {
                  var w = new WireIt.Wire(this.terminal, targetTerminalProxy.terminal, parentEl, this.terminal.config.wireConfig);
                  w.redraw();
               }
               else {
                  //console.log("Cannot connect to this terminal: nMaxWires = ", ddTargets[0].terminal.config.nMaxWires);
               }
            }
            else {
               //console.log("terminals already connected ");
            }
         }
      }
      
   },
   
   
   // Distinct from other YAHOO.util.DragDrop objects
   isWireItTerminal: true,
   
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
      
      return true;
   }
   
});


   

/**
 * @class WireIt.Terminal
 * @constructor
 * @param {DomEl} parentEl Element that will contain the terminal
 * @param {Object} config Configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
WireIt.Terminal = function(parentEl, config, container) {
   
   /**
    * DOM parent element
    */
   this.parentEl = parentEl;
   
   /**
    * Container (optional). Parent container of this terminal
    */
   this.container = container;
   
   /**
    * List of the associated wires
    */
    this.wires = [];
   
   /**
    * <p>Object that contains the terminal configuration:</p>
    * 
    * <ul>
    *   <li><b>direction</b>: direction vector of the wires when connected to this terminal (default [0,1])</li>
    *   <li><b>fakeDirection</b>: direction vector of the "editing" wire when it started from this terminal (default to -direction)</li>
    *   <li><b>editable</b>: boolean that makes the terminal editable (default to true)</li>
    *   <li><b>nMaxWires</b>: maximum number of wires for this terminal (default to Infinity)</li>
    *   <li><b>offsetPosition</b>: offset position from the parentEl position (default to [0,0])</li>
    *   <li><b>ddConfig</b>: configuration of the WireIt.TerminalProxy object (only if editable)</li>
    *   <li><b>className</b>: CSS class name of the terminal (default to "WireIt-Terminal")</li>
    *   <li><b>connectedClassName</b>: CSS class added to the terminal when it is connected (default to "WireIt-Terminal-connected")</li>
    *   <li><b>dropinviteClassName</b>: CSS class added for drop invitation (default to "WireIt-Terminal-dropinvite")</li>
    * </ul>
    */  
   this.config = config || {};
   this.config.direction = this.config.direction || [0,1];
   this.config.fakeDirection = this.config.fakeDirection || [-this.config.direction[0],-this.config.direction[1]];
   this.config.className = this.config.className || 'WireIt-Terminal';
   this.config.connectedClassName = this.config.connectedClassName || 'WireIt-Terminal-connected';
   this.config.dropinviteClassName = this.config.dropinviteClassName || 'WireIt-Terminal-dropinvite';
   this.config.editable = YAHOO.lang.isUndefined(this.config.editable) ? true : this.config.editable;
   this.config.nMaxWires = this.config.nMaxWires || Infinity;
   this.config.wireConfig = this.config.wireConfig || {};
   this.config.editingWireConfig = this.config.editingWireConfig || this.config.wireConfig;
   
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
    * DIV dom element that will display the Terminal
    */
   this.el = null;
   
   
   this.render();
   
   // Create the TerminalProxy object to make the terminal editable
   if(this.config.editable) {
      this.dd = new WireIt.TerminalProxy(this, this.config.ddConfig);
      this.scissors = new WireIt.Scissors(this);
   }
};

WireIt.Terminal.prototype = {

   /**
    * Show or hide the drop invitation. (by adding/removing this.config.dropinviteClassName CSS class)
    * @param {Boolean} display Show the invitation if true, hide it otherwise
    */
   setDropInvitation: function(display) {
      if(display) {
         YAHOO.util.Dom.addClass(this.el, this.config.dropinviteClassName);
      }
      else {
         YAHOO.util.Dom.removeClass(this.el, this.config.dropinviteClassName);
      }
   },

   /**
    * Render the DOM of the terminal
    */
   render: function() {
   
      // Create the DIV element
      this.el = WireIt.cn('div', {className: this.config.className} );
      if(this.config.name) { this.el.title = this.config.name; }
   
      // Set the offset position
      if(this.config.offsetPosition) {
         this.el.style.left = this.config.offsetPosition[0]+"px";
         this.el.style.top = this.config.offsetPosition[1]+"px";
      }
   
      // Append the element to the parent
      this.parentEl.appendChild(this.el);
   },


   /**
    * Add a wire to this terminal.
    * @param {WireIt.Wire} wire Wire instance to add
    */
   addWire: function(wire) {
   
      // Adds this wire to the list of connected wires :
      this.wires.push(wire);
   
      // Set class indicating that the wire is connected
      YAHOO.util.Dom.addClass(this.el, this.config.connectedClassName);
   
      // Fire the event
      this.eventAddWire.fire(wire);
   },

   /**
    * Remove a wire
    * @param {WireIt.Wire} wire Wire instance to remove
    */
   removeWire: function(wire) {
      var index = WireIt.indexOf(wire, this.wires);   
      if( index != -1 ) {
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
      
         // Remove the connected class if it has no more wires:
         if(this.wires.length == 0) {
            YAHOO.util.Dom.removeClass(this.el, this.config.connectedClassName);
         }
      
         // Fire the event
         this.eventRemoveWire.fire(wire);
      }
   },


   /**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
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
    */
   remove: function() {
      // This isn't very nice but...
      // the method Wire.remove calls Terminal.removeWire to remove the reference
      while(this.wires.length > 0) {
         this.wires[0].remove();
      }
      this.parentEl.removeChild(this.el);
      
      // TODO: remove this.scissors
   },



   /**
    * Returns a list of all the terminals connecter to this terminal through its wires.
    * @return  {Array}  List of all connected terminals
    */
   getConnectedTerminals: function() {
      var terminalList = [];
      if(this.wires) {
         for(var i = 0 ; i < this.wires.length ; i++) {
            terminalList.push(this.wires[i].getOtherTerminal());
         }
      }
      return terminalList;
   },


   /**
    * Redraw all the wires connected to this terminal
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
  * @param {DOMEl} parentEl Parent dom element
  * @param {Object} config configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalInput = function(parentEl, config, container) {
   if(!config) { var config = {}; }
   config.direction = [0,-1];
   config.fakeDirection = [0,1];
   config.ddConfig = {
      type: "input",
      allowedTypes: ["output"]
   };
   config.nMaxWires = 1;
   WireIt.util.TerminalInput.superclass.constructor.call(this,parentEl, config, container);
};
YAHOO.extend(WireIt.util.TerminalInput, WireIt.Terminal);




 /**
  * Class that extends Terminal to differenciate Input/Output terminals
  * @class WireIt.util.TerminalOutput
  * @extends WireIt.Terminal
  * @constructor
  * @param {DOMEl} parentEl Parent dom element
  * @param {Object} config configuration object
  * @param {WireIt.Container} container (Optional) Container containing this terminal
  */
WireIt.util.TerminalOutput = function(parentEl, config, container) {
  if(!config) { var config = {}; }
   config.direction = [0,1];
   config.fakeDirection = [0,-1];
   config.ddConfig = {
      type: "output",
      allowedTypes: ["input"]
   };
   WireIt.util.TerminalOutput.superclass.constructor.call(this,parentEl, config, container);
};
YAHOO.extend(WireIt.util.TerminalOutput, WireIt.Terminal);


})();/**
 * @fileoverview Provide a wrapper around YAHOO.util.DD to drag/drop a block containing terminals and redraw the associated wires
 */
/**
 * @class Wraper for YAHOO.util.DD, to redraw the wires associated with the given terminals
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
    */
   this._WireItTerminals = terminals;
   WireIt.util.DD.superclass.constructor.call(this, id, sGroup, config);
};

YAHOO.extend(WireIt.util.DD, YAHOO.util.DD, 
/**
 * @scope WireIt.util.DD.prototype
 */
{

   /**
    * Override YAHOO.util.DD.prototype.onDrag to redraw the wires
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
    */
   setTerminals: function(terminals) {
      this._WireItTerminals = terminals;
   }
   
});
/**
 * @fileoverview This class enable resizing on the containers
 */
/**
 * @class Make a container resizable
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
    */
   this.eventResize = new YAHOO.util.CustomEvent("eventResize");
};

YAHOO.extend(WireIt.util.DDResize, YAHOO.util.DragDrop, 
/**
 * @scope WireIt.util.DDResize.prototype
 */
{

   onMouseDown: function(e) {
        var panel = this.getEl();
        this.startWidth = panel.offsetWidth;
        this.startHeight = panel.offsetHeight;

        this.startPos = [YAHOO.util.Event.getPageX(e), YAHOO.util.Event.getPageY(e)];
    },

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
/**
 * @fileoverview This class represents the module and contains multiple terminals.
 */
(function() {
   
   var Dom = YAHOO.util.Dom;
   
/**
 * @class Visual module that contains terminals. The wires are updated when the module is dragged around.
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
   this.config.height = this.config.height;// || 100;
   
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
      	this.ddResize.eventResize.subscribe(this.onResize, this, true);
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

WireIt.Container.prototype = {

   /**
    * Function called when the container is being resized.
    * It doesn't do anything, so please override it.
    */
   onResize: function(event, args) {
      var size = args[0];
      WireIt.sn(this.bodyEl, null, {width: (size[0]-10)+"px", height: (size[1]-44)+"px"});
   },

   /**
    * Render the dom of the container
    */
   render: function() {
   
      // Create the element
      this.el = WireIt.cn('div', {className: this.config.className});
   
      if(this.config.width) {
         this.el.style.width = this.config.width+"px";
      }
      if(this.config.height) {
         this.el.style.height = this.config.height+"px";
      }
   
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
   },

   /**
    * Sets the content of the body element
    * @param {String or DomEl} content
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
    */
   setFocus: function() {
      Dom.addClass(this.el, "WireIt-Container-focused");
   },

   /**
    * Remove the class that shows the container as "focused"
    */
   removeFocus: function() {
      Dom.removeClass(this.el, "WireIt-Container-focused");
   },

   /**
    * Called when the user clicked on the close button
    */
   onCloseButton: function(e, args) {
      YAHOO.util.Event.stopEvent(e);
      this.layer.removeContainer(this);
   },

   /**
    * Remove this container from the dom
    */
   remove: function() {
   
      // Remove the terminals (and thus remove the wires)
      this.removeAllTerminals();
   
      // Remove from the dom
      this.layer.el.removeChild(this.el);
   },


   /**
    * Call the addTerminal method for each terminal configuration.
    */
   initTerminals: function(terminalConfigs) {
      for(var i = 0 ; i < terminalConfigs.length ; i++) {
         this.addTerminal(terminalConfigs[i]);
      }
   },


   /**
    * Instanciate the terminal from the class pointer "xtype" (default WireIt.Terminal)
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
    */
   removeAllTerminals: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].remove();
      }
      this.terminals = [];
   },

   /**
    * Redraw all the wires connected to the terminals of this container
    */
   redrawAllWires: function() {
      for(var i = 0 ; i < this.terminals.length ; i++) {
         this.terminals[i].redrawAllWires();
      }
   },

   /**
    * Return the config of this container.
    */
   getConfig: function() {
      var obj = {};
   
      // Position
      obj.position = Dom.getXY(this.el);
      if(this.layer) {
         var layerPos = Dom.getXY(this.layer.el);
         obj.position[0] -= layerPos[0];
         obj.position[1] -= layerPos[1];
      }
   
      // xtype
      if(this.config.xtype) {
         obj.xtype = this.config.xtype;
      }
   
      return obj;
   }

};

})();/**
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
         this.wires[index] = null;
         this.wires = WireIt.compact(this.wires);
         this.eventRemoveWire.fire(wire);
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

};/**
 * @fileoverview Provide a wrapper around YAHOO.util.Anim to animate a block containing terminals and redraw the associated wires
 */
/**
 * @class Wraper for YAHOO.util.Anim, to redraw the wires associated with the given terminals
 * @extends YAHOO.util.Anim
 * @constructor
 * @param {Array} terminals List of WireIt.Terminal objects associated within the animated element
 * @params {String} id Parameter of YAHOO.util.Anim
 * @params {String} sGroup Parameter of YAHOO.util.Anim
 * @params {Object} config Parameter of YAHOO.util.Anim
 */
 
WireIt.util.Anim = function( terminals, el, attributes, duration, method) {
   if(!terminals) {
      throw new Error("WireIt.util.Anim needs at least terminals and id");
   }
   if(!YAHOO.util.Anim) { return;}
   /**
    * List of the contained terminals
    */
   this._WireItTerminals = terminals;
   WireIt.util.Anim.superclass.constructor.call(this, el, attributes, duration, method);
   // Subscribe the onTween event
   this.onTween.subscribe(this.moveWireItWires, this, true);
};

if(YAHOO.util.Anim) { 
YAHOO.extend(WireIt.util.Anim, YAHOO.util.Anim, 
/**
 * @scope WireIt.util.Anim.prototype
 */
{
   
   /**
    * Listen YAHOO.util.Anim.onTween events to redraw the wires
    */
  moveWireItWires: function(e) {
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
    * In case you change the terminals since you created the WireIt.util.Anim:
    */
   setTerminals: function(terminals) {
      this._WireItTerminals = terminals;
   }

});

}
