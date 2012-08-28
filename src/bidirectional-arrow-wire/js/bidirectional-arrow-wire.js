/**
 * @module straight-wire
 */

/**
 * BidirectionalArrowWire
 * @class BidirectionalArrowWire
 * @extends WireBase
 * @constructor
 * @param {Object} config the configuration for the BezierWire attributes
 */
Y.BidirectionalArrowWire = function (cfg) {
   Y.BidirectionalArrowWire.superclass.constructor.apply(this, arguments);
};

Y.BidirectionalArrowWire.NAME = "bidirectionalarrowwire";

Y.extend(Y.BidirectionalArrowWire, Y.WireBase, {
   
   /**
    * @method _draw
    * @private
    */
   _draw: function () {
      
      var d = 7; // arrow width/2
      var redim = d+3; //we have to make the canvas a little bigger because of arrows
      var margin=[4+redim,4+redim];
     
      var src = this.get('src').getXY();
        var tgt = this.get('tgt').getXY();
      
      var distance=Math.sqrt(Math.pow(src[0]-tgt[0],2)+Math.pow(src[1]-tgt[1],2));
      this.moveTo((src[0]+6), (src[1]+6));
      this.lineTo((tgt[0]+6), (tgt[1]+6));
        
      // start drawing arrows

      var t1 = src;
      var t2 = tgt;

      var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
      var dlug = 20; //arrow length
      var t = (distance === 0) ? 0 : 1-(dlug/distance);
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

      this.moveTo(t2[0]+6,t2[1]+6);
      this.lineTo(x1+6,y1+6);
      this.moveTo(t2[0]+6,t2[1]+6);
      this.lineTo(x2+6,y2+6);

      t1 = tgt;
      t2 = src;

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

      this.moveTo(t2[0]+6,t2[1]+6);
      this.lineTo(x1+6,y1+6);
      this.moveTo(t2[0]+6,t2[1]+6);
      this.lineTo(x2+6,y2+6);      
      
      this.end();
   
   }
   
   
});

Y.BidirectionalArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});
