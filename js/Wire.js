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
