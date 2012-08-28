/**
 * @module straight-wire
 */

/**
 * Straight Wire
 * @class StraightWire
 * @extends WireBase
 * @constructor
 * @param {Object} cfg the configuration for the StraightWire attributes
 */
Y.StraightWire = function (cfg) {
   Y.StraightWire.superclass.constructor.apply(this, arguments);
};

Y.StraightWire.NAME = "straightwire";

Y.extend(Y.StraightWire, Y.WireBase, {
  
   /**
    * @method _draw
    * @private
    */
   _draw: function () {
      
      this.clear();
      
      var src = this.get('src').getXY();
      var tgt = this.get('tgt').getXY();
      
      this.moveTo((src[0]+6), (src[1]+6));
      this.lineTo((tgt[0]+6), (tgt[1]+6));
      this.end();
   }
   
});

Y.StraightWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});
