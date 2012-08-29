YUI.add('bezier-wire', function (Y, NAME) {

/**
 * @module bezier-wire
 */

/**
 * Extend WireBase to draw a bezier curve
 * @class BezierWire
 * @extends WireBase
 * @constructor
 * @param {Object} config the configuration for the BezierWire attributes
 */
Y.BezierWire = function (cfg) {
   Y.BezierWire.superclass.constructor.apply(this, arguments);
};

Y.BezierWire.NAME = "bezierwire";

Y.extend(Y.BezierWire, Y.WireBase, {
   
   /**
    * Draw the bezier curve.
    * The canvas is made bigger to contain the curls
    * @method _draw
    * @method private
    */
    _draw: function () {
        
        this.clear();
        
        var src = this.get('src').getXY();
        var tgt = this.get('tgt').getXY();
        
        var srcDir = this.get('srcDir');
        var tgtDir = this.get('tgtDir');
        var bezierTangentNorm = this.get('bezierTangentNorm');
         
         var terminalSize = 14/2;
         
        this.moveTo(src[0]+terminalSize,src[1]+terminalSize);
        
        this.curveTo(src[0]+terminalSize+srcDir[0]*bezierTangentNorm,
                     src[1]+terminalSize+srcDir[1]*bezierTangentNorm, 
                     
                     tgt[0]+terminalSize+tgtDir[0]*bezierTangentNorm,
                     tgt[1]+terminalSize+tgtDir[1]*bezierTangentNorm, 
                     
                     tgt[0]+terminalSize,
                     tgt[1]+terminalSize);
        
        this.end();
     },
   
   
   
   SERIALIZABLE_ATTRS: ["color","width","bezierTangentNorm"]
   
});

Y.BezierWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {
   
   /** 
    * Norm of the tangeant vector at the endpoints.
    * @attribute bezierTangentNorm
    * @default 100
    * @type Integer
    */
   bezierTangentNorm: {
      setter: function (val) {
         return parseInt(val, 10);
      },
      value: 200
   }

});



}, '@VERSION@', {"requires": ["wire-base"]});
