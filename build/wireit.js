/**
 * @fileoverview Set the WireIt namespace ; DOM and Canvas helpers
 */

var WireIt = {};

// WireIt.util namespace
WireIt.util = {};

/**
 * Functions used to create nodes
 * and set node attributes
 */
WireIt.sn = function(el,domAttributes,styleAttributes){
   if(!el) { return; }
   
   if(domAttributes){
      for(var i in domAttributes){
         var domAttribute = domAttributes[i];
         if(typeof (domAttribute)=="function"){
            continue;
         }
         if(YAHOO.env.ua.ie && i=="type" && (el.tagName=="INPUT"||el.tagName=="SELECT") ){
            continue;
         }
         if(i=="className"){
            i="class";
            el.className=domAttribute;
         }
         if(domAttribute!==el.getAttribute(i)){
            try{
               if(domAttribute===false){
                  el.removeAttribute(i);
               }else{
                  el.setAttribute(i,domAttribute);
               }
            }
            catch(err){
               console.log("WARNING: WireIt.sn failed for "+el.tagName+", attr "+i+", val "+domAttribute);
            }
         }
      }
   }
       
   if(styleAttributes){
      for(var i in styleAttributes){
         if(typeof (styleAttributes[i])=="function"){
            continue;
         }
         if(el.style[i]!=styleAttributes[i]){
            el.style[i]=styleAttributes[i];
         }
      }
   }
};


/**
 * Create Node
 */
WireIt.cn = function(tag, domAttributes, styleAttributes, innerHTML){
   var el=document.createElement(tag);
   this.sn(el,domAttributes,styleAttributes);
   if(innerHTML){
      el.innerHTML = innerHTML;
   }
   return el;
};
   
   
/**
 * Canvas functions
 */ 
WireIt.SetCanvasRegionIE = function(el,left,top,lw,lh){
   this.sn(el,null,{left:left+"px",top:top+"px",width:lw+"px",height:lh+"px"});
   el.getContext("2d").clearRect(0,0,lw,lh);
   return el;
};


WireIt.SetCanvasRegionSafari = function(canvasEl,left,top,lw,lh){
   var canvasClass=canvasEl.className;
   if(!canvasClass){
      canvasClass=canvasEl.getAttribute("class");
   }
   var newCanvas=this.cn("canvas",{className:canvasClass,width:lw,height:lh},{left:left+"px",top:top+"px"});
   var listeners=YAHOO.util.Event.getListeners(canvasEl);
   for(var listener in listeners){
      var l=listeners[listener];
      YAHOO.util.Event.addListener(newCanvas,l.type,l.fn,l.obj,l.adjust);
   }
   YAHOO.util.Event.purgeElement(canvasEl);
   canvasEl.parentNode.replaceChild(newCanvas,canvasEl);
   return newCanvas;
};

WireIt.SetCanvasRegionDefault = function(canvasEl,left,top,lw,lh){
   this.sn(canvasEl,{width:lw,height:lh},{left:left+"px",top:top+"px"});
   return canvasEl;
};


WireIt.SetCanvasSize = function(canvasEl,lw,lh){
   if(YAHOO.env.ua.webkit || YAHOO.env.ua.opera){
      var canvasClass=canvasEl.className;
      if(!canvasClass){
         canvasClass=canvasEl.getAttribute("class");
      }
      var newCanvas=this.cn("canvas",{className:canvasClass,width:lw,height:lh});
      canvasEl.parentNode.replaceChild(newCanvas,canvasEl);
      return newCanvas;
   }
   sn(canvasEl,{width:lw,height:lh},{width:lw+"px",height:lh+"px"});
   if(canvasEl.getContext){
      canvasEl.getContext("2d").clearRect(0,0,lw,lh);
   }
   return canvasEl;
};
      

/**
 * This function sets the position and size of a canvas element accross all browsers.
 */
WireIt.SetCanvasRegion = YAHOO.env.ua.ie ? WireIt.SetCanvasRegionIE : ( (YAHOO.env.ua.webkit || YAHOO.env.ua.opera) ? WireIt.SetCanvasRegionSafari :  WireIt.SetCanvasRegionDefault);


if(!Array.prototype.indexOf) {
   /**
    * The method Array.indexOf doesn't exist on IE :(
    */
   Array.prototype.indexOf = function(el) {
      for(var i = 0 ;i < this.length ; i++) {
         if(this[i] == el) return i;
      }
      return -1;
   };
}

if(!Array.prototype.compact) {
   /**
    * Compact
    */
   Array.prototype.compact = function() {
      var n = []
      for(var i = 0 ; i < this.length ; i++) {
         if(this[i]) {
            n.push(this[i]);
         }
      }
      return n;
   };
}

/**
 * @fileoverview Defines the Wire class that wraps a canvas tag to create wires.
 */
/**
 * @class WireIt.Wire
 * @constructor
 *
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
   this.config.cap = this.config.cap || 'round';
   this.config.bordercap = this.config.bordercap || 'round';
   this.config.width = this.config.width || 3;
   this.config.borderwidth = this.config.borderwidth || 1;
   this.config.color = this.config.color || 'rgb(173, 216, 230)';
   this.config.bordercolor = this.config.bordercolor || '#0000ff';
   
   
   // Render the wire
   this.render();
   
   // Call addWire on both terminals
   this.terminal1.addWire(this);
   this.terminal2.addWire(this);
};


/**
 * Render the canvas tag
 */
WireIt.Wire.prototype.render = function() {
   
   // Create the canvas element
   this.el = WireIt.cn("canvas", {className: this.config.className});
   
   // Append the canvas to the parent element
   this.parentEl.appendChild(this.el);
   
   // excanvas.js for dynamic canvas tags
   if(typeof (G_vmlCanvasManager)!="undefined"){
      this.el = G_vmlCanvasManager.initElement(this.el);
   }
};

/**
 * Remove a Wire from the Dom
 */
WireIt.Wire.prototype.remove = function() {
   
   // Remove the canvas from the dom
   this.parentEl.removeChild(this.el);
   
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
};

/**
 * Redraw the Wire
 */
WireIt.Wire.prototype.redraw = function() {
   
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
   
   this.el= WireIt.SetCanvasRegion(this.el,min[0],min[1],lw,lh);
   
   var ctxt=this.el.getContext("2d");
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
   
};


/**
 * This function returns terminal1 if the first argument is terminal2 and vice-versa
 * @param   {WireIt.Terminal} terminal    
 * @return  {WireIt.Terminal} terminal    the terminal that is NOT passed as argument
 */
WireIt.Wire.prototype.getOtherTerminal = function(terminal) {
   return (terminal == this.terminal1) ? this.terminal2 : this.terminal1;
};
/**
 * @fileoverview Terminals represent the end points of the "wires"
 */
/**
 * This class is used for wire edition. It inherits from YAHOO.util.DDProxy and acts as a "temporary" Terminal.
 *
 * @class WireIt.DDTerminal
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {WireIt.Terminal} terminal Parent terminal
 * @param {Object} config Configuration object (see in properties for details)
 */
WireIt.DDTerminal = function(terminal, config) {
   
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
   
   // Init the DDProxy
   WireIt.DDTerminal.superclass.constructor.call(this,this.terminal.el);
   
   // On mouseover/mouseout to display/hide the scissors
   YAHOO.util.Event.addListener(this.terminal.el, "mouseover", this.mouseOver, this, true);
   YAHOO.util.Event.addListener(this.terminal.el, "mouseout", this.mouseOut, this, true);
   
};

// Mode Intersect to get the DD objects
YAHOO.util.DDM.mode = YAHOO.util.DDM.INTERSECT;

YAHOO.extend(WireIt.DDTerminal,YAHOO.util.DDProxy,{
   
   scissorOver: function() {
      // Stop that.terminalTimeout
      clearTimeout(this.terminalTimeout);
   },
   
   scissorOut: function() {
      var that = this;
      this.terminalTimeout = setTimeout(function() {
         if(that.scissor) {
            that.terminal.parentEl.parentNode.removeChild(that.scissor);
            that.scissor = undefined;
         }
      }, 500);
   },
   
   scissorClick: function() {
      while(this.terminal.wires.length > 0) {
         this.terminal.wires[0].remove();
      }
      if(this.scissor) {
         this.terminal.parentEl.parentNode.removeChild(this.scissor);
         this.scissor = undefined;
      }
   },
   
   initCissor: function() {
      // Position of the scissor
      var termPos = this.terminal.getXY();
      var position = [termPos[0]+this.terminal.config.direction[0]*30-13,termPos[1]+this.terminal.config.direction[1]*30-10];
   
      // Display the cut button
      this.scissor = WireIt.cn('div', {className: "WireIt-Wire-scissors"}, {left: position[0]+"px",top: position[1]+"px"} );
      this.terminal.parentEl.parentNode.appendChild(this.scissor);
      
      // Ajoute un listener sur le scissor:
      YAHOO.util.Event.addListener(this.scissor, "mouseover", this.scissorOver, this, true);
      YAHOO.util.Event.addListener(this.scissor, "mouseout", this.scissorOut, this, true);
      
      // On click : kill all wires !!!
      YAHOO.util.Event.addListener(this.scissor, "click", this.scissorClick, this, true);
   },
   
   mouseOver: function() {
      if(!this.scissor) {
         if(this.terminal.wires.length > 0)  {
            this.initCissor();
         }
      }
   },
   
   mouseOut: function() {
      
         var that = this;
         this.terminalTimeout = setTimeout(function() {
            if(that.scissor) {
               that.terminal.parentEl.parentNode.removeChild(that.scissor);
               that.scissor = undefined;
            }
         }, 300);
         
   },
   
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
         offset: [this.terminal.parentEl.parentNode.offsetLeft-this.terminal.parentEl.parentNode.scrollLeft, 
                  this.terminal.parentEl.parentNode.offsetTop-this.terminal.parentEl.parentNode.scrollTop],
         addWire: function() {},
         removeWire: function() {},
         getXY: function() { 
            return [this.pos[0]-this.offset[0], this.pos[1]-this.offset[1] ]; 
         }
      };
      
      this.editingWire = new WireIt.Wire(this.terminal, this.fakeTerminal, this.terminal.parentEl.parentNode, this.terminal.config.editingWireConfig);
      YAHOO.util.Dom.addClass(this.editingWire.el, 'WireIt-Wire-editing');
   },
   
   onDrag: function(e) {
      this.fakeTerminal.pos = [e.clientX, e.clientY];
      this.editingWire.redraw();
   },
   
   endDrag: function(e) {
      this.editingWire.remove();
      this.editingWire = null;
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
      
      var targetDDTerminal = null;
      for(var i = 0 ; i < ddTargets.length ; i++) {
         if( ddTargets[i].isWireItTerminal ) {
            targetDDTerminal =  ddTargets[i];
         }
      }
      
      // Connect to the FIRST target terminal
      if( targetDDTerminal ) {
         if( this.isValidWireTerminal(targetDDTerminal) ) { 
               
            // Don't create the wire if it already exists between the 2 terminals !!
            var termAlreadyConnected = false;
            for(var i = 0 ; i < this.terminal.wires.length ; i++) {
               if(this.terminal.wires[i].terminal1 == this.terminal) {
                  if( this.terminal.wires[i].terminal2 == targetDDTerminal.terminal) {
                     termAlreadyConnected = true;
                     break;
                  }
               }
               else if(this.terminal.wires[i].terminal2 == this.terminal) {
                  if( this.terminal.wires[i].terminal1 == targetDDTerminal.terminal) {
                     termAlreadyConnected = true;
                     break;
                  }
               }
            }
            
            // Create the wire only if the terminals aren't connected yet
            if(!termAlreadyConnected) {
               // Check the number of wires for this terminal
               if( targetDDTerminal.terminal.config.nMaxWires == 1) {
                  if(targetDDTerminal.terminal.wires.length > 0) {
                     targetDDTerminal.terminal.wires[0].remove();
                  }
                  var w = new WireIt.Wire(this.terminal, targetDDTerminal.terminal, this.terminal.parentEl.parentNode, this.terminal.config.wireConfig);
                  w.redraw();
               }
               else if(targetDDTerminal.terminal.wires.length < targetDDTerminal.terminal.config.nMaxWires) {
                  var w = new WireIt.Wire(this.terminal, targetDDTerminal.terminal, this.terminal.parentEl.parentNode, this.terminal.config.wireConfig);
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
            if( this.termConfig.allowedTypes.indexOf(DDterminal.termConfig.type) == -1 ) {
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
            if( DDterminal.termConfig.allowedTypes.indexOf(this.termConfig.type) == -1 ) {
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
    *   <li><b>direction</b: direction vector of the wires when connected to this terminal (default [0,1])</li>
    *   <li><b>fakeDirection</b>: direction vector of the "editing" wire when it started from this terminal (default to -direction)</li>
    *   <li><b>editable</b>: boolean that makes the terminal editable (default to true)</li>
    *   <li><b>nMaxWires</b>: maximum number of wires for this terminal (default to Infinity)</li>
    *   <li><b>offsetPosition</b>: offset position from the parentEl position (default to [0,0])</li>
    *   <li><b>ddConfig</b>: configuration of the WireIt.DDTerminal object (only if editable)</li>
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
   
   // Create the DDTerminal object to make the terminal editable
   if(this.config.editable) {
      this.dd = new WireIt.DDTerminal(this, this.config.ddConfig);
   }
};

/**
 * Show or hide the drop invitation. (by adding/removing this.config.dropinviteClassName CSS class)
 * @param {Boolean} display Show the invitation if true, hide it otherwise
 */
WireIt.Terminal.prototype.setDropInvitation = function(display) {
   if(display) {
      YAHOO.util.Dom.addClass(this.el, this.config.dropinviteClassName);
   }
   else {
      YAHOO.util.Dom.removeClass(this.el, this.config.dropinviteClassName);
   }
};

/**
 * Render the DOM of the terminal
 */
WireIt.Terminal.prototype.render = function() {
   
   // Create the DIV element
   this.el = WireIt.cn('div', {className: this.config.className} );
   
   // Set the offset position
   if(this.config.offsetPosition) {
      this.el.style.left = this.config.offsetPosition[0]+"px";
      this.el.style.top = this.config.offsetPosition[1]+"px";
   }
   
   // Append the element to the parent
   this.parentEl.appendChild(this.el);
};


/**
 * Add a wire to this terminal.
 * @param {WireIt.Wire} wire Wire instance to add
 */
WireIt.Terminal.prototype.addWire = function(wire) {
   
   // Adds this wire to the list of connected wires :
   this.wires.push(wire);
   
   // Set class indicating that the wire is connected
   YAHOO.util.Dom.addClass(this.el, this.config.connectedClassName);
   
   // Fire the event
   this.eventAddWire.fire(wire);
};

/**
 * Remove a wire
 * @param {WireIt.Wire} wire Wire instance to remove
 */
WireIt.Terminal.prototype.removeWire = function(wire) {

   var index = this.wires.indexOf(wire);   
   if( index != -1 ) {
      this.wires[index] = null;
      
      // Compact the wires array:
      var newWires = [];
      for(var i = 0 ; i < this.wires.length ; i++) {
         if(this.wires[i]) {
            newWires.push(this.wires[i]);
         }
      }
      this.wires = newWires;
      
      // Remove the connected class if it has no more wires:
      if(this.wires.length == 0) {
         YAHOO.util.Dom.removeClass(this.el, this.config.connectedClassName);
      }
      
      // Fire the event
      this.eventRemoveWire.fire(wire);
   }
};

/**
 * get the absolute position of the terminal. (Used by the Wire to redraw itself)
 * @returns {Array} pos [x,y] Absolute position of the terminal
 */
WireIt.Terminal.prototype.getXY = function() {
    var pos = YAHOO.util.Dom.getXY(this.el);
    pos[0] += 15-this.el.parentNode.parentNode.offsetLeft+this.el.parentNode.parentNode.scrollLeft;
    pos[1] += 15-this.el.parentNode.parentNode.offsetTop+this.el.parentNode.parentNode.scrollTop;
    return pos;
};


/**
 * Remove the terminal from the DOM
 */
WireIt.Terminal.prototype.remove = function() {
   // This isn't very nice but...
   // the method Wire.remove calls Terminal.removeWire to remove the reference
   while(this.wires.length > 0) {
      this.wires[0].remove();
   }
   this.parentEl.removeChild(this.el);
};



/**
 * Returns a list of all the terminals connecter to this terminal through its wires.
 * @return  {Array}  List of all connected terminals
 */
WireIt.Terminal.prototype.getConnectedTerminals = function() {
   var terminalList = [];
   if(this.wires) {
      for(var i = 0 ; i < this.wires.length ; i++) {
         terminalList.push(this.wires[i].getOtherTerminal());
      }
   }
   return terminalList;
};


/**
 * Redraw all the wires connected to this terminal
 */
WireIt.Terminal.prototype.redrawAllWires = function() {
   if(this.wires) {
      for(var i = 0 ; i < this.wires.length ; i++) {
         this.wires[i].redraw();
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

/**
 * @fileoverview Provide a wrapper around YAHOO.util.DD to drag/drop a block containing terminals and redraw the associated wires
 */
/**
 * Wraper for YAHOO.util.DD, to redraw the wires associated with the given terminals
 * @class WireIt.util.DD
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

YAHOO.extend(WireIt.util.DD, YAHOO.util.DD, {

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
 * @class WireIt.util.DDResize
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

YAHOO.extend(WireIt.util.DDResize, YAHOO.util.DragDrop, {

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
/**
 * @fileoverview Provide a wrapper around YAHOO.util.Anim to animate a block containing terminals and redraw the associated wires
 */
/**
 * Wraper for YAHOO.util.Anim, to redraw the wires associated with the given terminals
 * @class WireIt.util.Anim
 * @extends YAHOO.util.Anim
 * @constructor
 * @param {Array} terminals List of WireIt.Terminal objects associated within the animated element
 * @params {String} id Parameter of YAHOO.util.Anim
 * @params {String} sGroup Parameter of YAHOO.util.Anim
 * @params {Object} config Parameter of YAHOO.util.Anim
 */
if(YAHOO.util.Anim) { 
 
WireIt.util.Anim = function( terminals, el, attributes, duration, method) {
   if(!terminals) {
      throw new Error("WireIt.util.Anim needs at least terminals and id");
   }
   /**
    * List of the contained terminals
    */
   this._WireItTerminals = terminals;
   WireIt.util.Anim.superclass.constructor.call(this, el, attributes, duration, method);
   // Subscribe the onTween event
   this.onTween.subscribe(this.moveWireItWires, this, true);
};

YAHOO.extend(WireIt.util.Anim, YAHOO.util.Anim);

/**
 * Listen YAHOO.util.Anim.onTween events to redraw the wires
 */
WireIt.util.Anim.prototype.moveWireItWires = function(e) {
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
};

/**
 * In case you change the terminals since you created the WireIt.util.Anim:
 */
WireIt.util.Anim.prototype.setTerminals = function(terminals) {
   this._WireItTerminals = terminals;
};

}
