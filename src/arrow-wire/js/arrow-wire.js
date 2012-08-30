    'use strict';

    /**
     * @module arrow-wire
     */

    /**
     * Extend CanvasWire to draw an arrow wire
     * @class ArrowWire
     * @extends WireBase
     * @constructor
     * @param {Object} cfg the configuration for the ArrowWire attributes
     */
    Y.ArrowWire = function (cfg) {
        Y.ArrowWire.superclass.constructor.apply(this, arguments);
    };

    Y.ArrowWire.NAME = "arrowwire";

    Y.extend(Y.ArrowWire, Y.WireBase, {
        /**
         * @method _draw
         * @private
         */
        _draw: function () {

            var d = 7, // arrow width/2
                redim = d + 3, //we have to make the canvas a little bigger because of arrows
                margin=[4 + redim,4 + redim],

                src = this.get('src').getXY(),
                tgt = this.get('tgt').getXY(),

                distance=Math.sqrt(Math.pow(src[0]-tgt[0],2) + Math.pow(src[1]-tgt[1],2));

            this.moveTo((src[0] + 6), (src[1] + 6));
            this.lineTo((tgt[0] + 6), (tgt[1] + 6));

            // start drawing arrows

            var z = [0,0], //point on the wire with constant distance (dlug) from terminal2
                dlug = 20, //arrow length
                t = (distance === 0) ? 0 : 1 - (dlug/distance);

            z[0] = Math.abs( src[0] + t * (tgt[0] - src[0]) );
            z[1] = Math.abs( src[1] + t * (tgt[1] - src[1]) );

            //line which connects the terminals: y=ax+b
            var W = src[0] - tgt[0],
                Wa = src[1] - tgt[1],
                Wb = src[0] * tgt[1] - src[1] * tgt[0],
                a, b, aProst, bProst;
         
            if (W !== 0) {
                a = Wa / W;
                b = Wb / W;
            } else {
                a = 0;
            }
            //line perpendicular to the main line: y = aProst*x + b
            if (a === 0) {
                aProst = 0;
            } else {
                aProst = -1 / a;
            }
            bProst = z[1] - aProst * z[0]; //point z lays on this line
            
            // we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
            var A = 1 + Math.pow(aProst, 2),
                B = 2 * aProst * bProst - 2 * z[0] - 2 * z[1] * aProst,
                C = -2 * z[1] * bProst + Math.pow(z[0], 2) + Math.pow(z[1], 2) - Math.pow(d, 2) + Math.pow(bProst, 2);

            var delta = Math.pow(B, 2) - 4 * A * C;
            if (delta < 0) { return; }
            
            var x1 = (-B + Math.sqrt(delta)) / (2 * A),
                x2 = (-B - Math.sqrt(delta)) / (2 * A),
                y1 = aProst * x1 + bProst,
                y2 = aProst * x2 + bProst;
            
            if (src[1] === tgt[1]) {
                var o = (src[0] > tgt[0]) ? 1 : -1;
                x1 = tgt[0] + o * dlug;
                x2 = x1;
                y1 -= d;
                y2 += d;
            }

            //triangle border
            this.moveTo(tgt[0] + 6, tgt[1] + 6);
            this.lineTo(x1 + 6, y1 + 6);
            this.moveTo(tgt[0] + 6, tgt[1] + 6);
            this.lineTo(x2 + 6, y2 + 6);
            this.end();
        }
    });

    Y.ArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});
