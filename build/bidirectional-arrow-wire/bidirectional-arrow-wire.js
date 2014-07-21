YUI.add('bidirectional-arrow-wire', function (Y, NAME) {

/**
 * @module bidirectional-arrow-wire
 */

/**
 * BidirectionalArrowWire
 * @class BidirectionalArrowWire
 * @extends ArrowWire
 * @constructor
 * @param {Object} config the configuration for the BezierWire attributes
 */
Y.BidirectionalArrowWire = function (config) {
   Y.BidirectionalArrowWire.superclass.constructor.apply(this, arguments);
};

Y.BidirectionalArrowWire.NAME = 'bidirectionalarrowwire';

Y.extend(Y.BidirectionalArrowWire, Y.ArrowWire, {
   
   _draw: function () {

      this.clear();

      var src = this.get('src').getXY(),
          tgt = this.get('tgt').getXY();

      this.moveTo((src[0] + 6), (src[1] + 6));
      this.lineTo((tgt[0] + 6), (tgt[1] + 6));

      this._drawArrow(src, tgt);
      this._drawArrow(tgt, src);

      this.end();
   }
   
});

Y.BidirectionalArrowWire.ATTRS = Y.merge(Y.ArrowWire.ATTRS, {});


}, '@VERSION@', {"requires": ["arrow-wire"]});
