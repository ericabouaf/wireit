if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/arrow-wire/arrow-wire.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/arrow-wire/arrow-wire.js",
    code: []
};
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].code=["YUI.add('arrow-wire', function (Y, NAME) {","","    'use strict';","","    /**","     * @module arrow-wire","     */","","    /**","     * Extend CanvasWire to draw an arrow wire","     * @class ArrowWire","     * @extends WireBase","     * @constructor","     * @param {Object} cfg the configuration for the ArrowWire attributes","     */","    Y.ArrowWire = function (cfg) {","        Y.ArrowWire.superclass.constructor.apply(this, arguments);","    };","","    Y.ArrowWire.NAME = \"arrowwire\";","","    Y.extend(Y.ArrowWire, Y.WireBase, {","        /**","         * @method _draw","         * @private","         */","        _draw: function () {","","            var d = 7, // arrow width/2","                redim = d + 3, //we have to make the canvas a little bigger because of arrows","                margin=[4 + redim,4 + redim],","","                src = this.get('src').getXY(),","                tgt = this.get('tgt').getXY(),","","                distance=Math.sqrt(Math.pow(src[0]-tgt[0],2) + Math.pow(src[1]-tgt[1],2));","","            this.moveTo((src[0] + 6), (src[1] + 6));","            this.lineTo((tgt[0] + 6), (tgt[1] + 6));","","            // start drawing arrows","","            var z = [0,0], //point on the wire with constant distance (dlug) from terminal2","                dlug = 20, //arrow length","                t = (distance === 0) ? 0 : 1 - (dlug/distance);","","            z[0] = Math.abs( src[0] + t * (tgt[0] - src[0]) );","            z[1] = Math.abs( src[1] + t * (tgt[1] - src[1]) );","","            //line which connects the terminals: y=ax+b","            var W = src[0] - tgt[0],","                Wa = src[1] - tgt[1],","                Wb = src[0] * tgt[1] - src[1] * tgt[0],","                a, b, aProst, bProst;","         ","            if (W !== 0) {","                a = Wa / W;","                b = Wb / W;","            } else {","                a = 0;","            }","            //line perpendicular to the main line: y = aProst*x + b","            if (a === 0) {","                aProst = 0;","            } else {","                aProst = -1 / a;","            }","            bProst = z[1] - aProst * z[0]; //point z lays on this line","            ","            // we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z","            var A = 1 + Math.pow(aProst, 2),","                B = 2 * aProst * bProst - 2 * z[0] - 2 * z[1] * aProst,","                C = -2 * z[1] * bProst + Math.pow(z[0], 2) + Math.pow(z[1], 2) - Math.pow(d, 2) + Math.pow(bProst, 2);","","            var delta = Math.pow(B, 2) - 4 * A * C;","            if (delta < 0) { return; }","            ","            var x1 = (-B + Math.sqrt(delta)) / (2 * A),","                x2 = (-B - Math.sqrt(delta)) / (2 * A),","                y1 = aProst * x1 + bProst,","                y2 = aProst * x2 + bProst;","            ","            if (src[1] === tgt[1]) {","                var o = (src[0] > tgt[0]) ? 1 : -1;","                x1 = tgt[0] + o * dlug;","                x2 = x1;","                y1 -= d;","                y2 += d;","            }","","            //triangle border","            this.moveTo(tgt[0] + 6, tgt[1] + 6);","            this.lineTo(x1 + 6, y1 + 6);","            this.moveTo(tgt[0] + 6, tgt[1] + 6);","            this.lineTo(x2 + 6, y2 + 6);","            this.end();","        }","    });","","    Y.ArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});","","","}, '@VERSION@', {\"requires\": [\"wire-base\"]});"];
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].lines = {"1":0,"3":0,"16":0,"17":0,"20":0,"22":0,"29":0,"38":0,"39":0,"43":0,"47":0,"48":0,"51":0,"56":0,"57":0,"58":0,"60":0,"63":0,"64":0,"66":0,"68":0,"71":0,"75":0,"76":0,"78":0,"83":0,"84":0,"85":0,"86":0,"87":0,"88":0,"92":0,"93":0,"94":0,"95":0,"96":0,"100":0};
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].functions = {"ArrowWire:16":0,"_draw:27":0,"(anonymous 1):1":0};
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].coveredLines = 37;
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].coveredFunctions = 3;
_yuitest_coverline("build/arrow-wire/arrow-wire.js", 1);
YUI.add('arrow-wire', function (Y, NAME) {

    _yuitest_coverfunc("build/arrow-wire/arrow-wire.js", "(anonymous 1)", 1);
_yuitest_coverline("build/arrow-wire/arrow-wire.js", 3);
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
    _yuitest_coverline("build/arrow-wire/arrow-wire.js", 16);
Y.ArrowWire = function (cfg) {
        _yuitest_coverfunc("build/arrow-wire/arrow-wire.js", "ArrowWire", 16);
_yuitest_coverline("build/arrow-wire/arrow-wire.js", 17);
Y.ArrowWire.superclass.constructor.apply(this, arguments);
    };

    _yuitest_coverline("build/arrow-wire/arrow-wire.js", 20);
Y.ArrowWire.NAME = "arrowwire";

    _yuitest_coverline("build/arrow-wire/arrow-wire.js", 22);
Y.extend(Y.ArrowWire, Y.WireBase, {
        /**
         * @method _draw
         * @private
         */
        _draw: function () {

            _yuitest_coverfunc("build/arrow-wire/arrow-wire.js", "_draw", 27);
_yuitest_coverline("build/arrow-wire/arrow-wire.js", 29);
var d = 7, // arrow width/2
                redim = d + 3, //we have to make the canvas a little bigger because of arrows
                margin=[4 + redim,4 + redim],

                src = this.get('src').getXY(),
                tgt = this.get('tgt').getXY(),

                distance=Math.sqrt(Math.pow(src[0]-tgt[0],2) + Math.pow(src[1]-tgt[1],2));

            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 38);
this.moveTo((src[0] + 6), (src[1] + 6));
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 39);
this.lineTo((tgt[0] + 6), (tgt[1] + 6));

            // start drawing arrows

            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 43);
var z = [0,0], //point on the wire with constant distance (dlug) from terminal2
                dlug = 20, //arrow length
                t = (distance === 0) ? 0 : 1 - (dlug/distance);

            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 47);
z[0] = Math.abs( src[0] + t * (tgt[0] - src[0]) );
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 48);
z[1] = Math.abs( src[1] + t * (tgt[1] - src[1]) );

            //line which connects the terminals: y=ax+b
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 51);
var W = src[0] - tgt[0],
                Wa = src[1] - tgt[1],
                Wb = src[0] * tgt[1] - src[1] * tgt[0],
                a, b, aProst, bProst;
         
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 56);
if (W !== 0) {
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 57);
a = Wa / W;
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 58);
b = Wb / W;
            } else {
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 60);
a = 0;
            }
            //line perpendicular to the main line: y = aProst*x + b
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 63);
if (a === 0) {
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 64);
aProst = 0;
            } else {
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 66);
aProst = -1 / a;
            }
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 68);
bProst = z[1] - aProst * z[0]; //point z lays on this line
            
            // we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 71);
var A = 1 + Math.pow(aProst, 2),
                B = 2 * aProst * bProst - 2 * z[0] - 2 * z[1] * aProst,
                C = -2 * z[1] * bProst + Math.pow(z[0], 2) + Math.pow(z[1], 2) - Math.pow(d, 2) + Math.pow(bProst, 2);

            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 75);
var delta = Math.pow(B, 2) - 4 * A * C;
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 76);
if (delta < 0) { return; }
            
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 78);
var x1 = (-B + Math.sqrt(delta)) / (2 * A),
                x2 = (-B - Math.sqrt(delta)) / (2 * A),
                y1 = aProst * x1 + bProst,
                y2 = aProst * x2 + bProst;
            
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 83);
if (src[1] === tgt[1]) {
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 84);
var o = (src[0] > tgt[0]) ? 1 : -1;
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 85);
x1 = tgt[0] + o * dlug;
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 86);
x2 = x1;
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 87);
y1 -= d;
                _yuitest_coverline("build/arrow-wire/arrow-wire.js", 88);
y2 += d;
            }

            //triangle border
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 92);
this.moveTo(tgt[0] + 6, tgt[1] + 6);
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 93);
this.lineTo(x1 + 6, y1 + 6);
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 94);
this.moveTo(tgt[0] + 6, tgt[1] + 6);
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 95);
this.lineTo(x2 + 6, y2 + 6);
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 96);
this.end();
        }
    });

    _yuitest_coverline("build/arrow-wire/arrow-wire.js", 100);
Y.ArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});


}, '@VERSION@', {"requires": ["wire-base"]});
