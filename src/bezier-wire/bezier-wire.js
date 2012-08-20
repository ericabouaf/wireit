/**
 * @module bezier-wire
 */
YUI.add('bezier-wire', function(Y) {


/**
 * Extend WireBase to draw a bezier curve
 * @class BezierWire
 * @extends WireBase
 * @constructor
 * @param {Object} config the configuration for the BezierWire attributes
 */
Y.BezierWire = function(cfg) {
   
   Y.BezierWire.superclass.constructor.apply(this, arguments);
   
   this.draw();
};

// TODO: use Base.create

Y.BezierWire.NAME = "bezierwire";

Y.extend(Y.BezierWire, Y.WireBase, {
   
   /**
    * @method initializer
    */
   initializer: function() {
      
      Y.BezierWire.superclass.initializer.apply(this, arguments);
      
      if(this.get('src') && this.get('src').get)
         this.set('srcDir', this.get('src').get('dir') );
      if(this.get('tgt') && this.get('tgt').get)
         this.set('tgtDir', this.get('src').get('dir') );
   },
   
   /**
    * @method bindUI
    */
   bindUI: function() {
      Y.BezierWire.superclass.bindUI.call(this);
      
      //this.after("bezierTangentNormChange", this._afterChangeRedraw, this);
      
      this.on('srcChange', function(e) {
         this.set('srcDir', e.newVal.get('dir') );
      }, this);
      
      this.on('tgtChange', function(e) {
         this.set('tgtDir', e.newVal.get('dir') );
      }, this);
      
   },
   
   
   /**
    * Draw the bezier curve.
    * The canvas is made bigger to contain the curls
    * @method draw
    */
     draw: function() {
        
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
//Y.BezierWire.ATTRS = {
   
   /** 
    * Norm of the tangeant vector at the endpoints.
    * @attribute bezierTangentNorm
    * @default 100
    * @type Integer
    */
   bezierTangentNorm: {
      setter: function(val) {
         return parseInt(val, 10);
      },
      value: 200
   },
   /**
    * TODO: normalize ?
    * @attribute srcDir
    * @type Array
    * @default [1,0]
    */ 
   srcDir: {
      validator: Y.Lang.isArray,
      value: [1,0]
   },
   
   /**
    * TODO: normalize ?
    * @attribute tgtDir
    * @type Array
    * @default -srcDir
    */
   tgtDir: {
      validator: Y.Lang.isArray,
      valueFn: function() {
         var d = this.get('srcDir');
         return [-d[0],-d[1]];
      }
   }

});

}, '3.6.0', {requires: ['wire-base']});
