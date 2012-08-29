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
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].code=["YUI.add('arrow-wire', function (Y, NAME) {","","    'use strict';","","    /**","     * @module arrow-wire","     */","","    /**","     * Extend CanvasWire to draw an arrow wire","     * @class ArrowWire","     * @extends WireBase","     * @constructor","     * @param {Object} cfg the configuration for the ArrowWire attributes","     */","    Y.ArrowWire = function (cfg) {","        Y.ArrowWire.superclass.constructor.apply(this, arguments);","    };","","    Y.ArrowWire.NAME = \"arrowwire\";","","    Y.extend(Y.ArrowWire, Y.WireBase, {","      ","      /**","       * @method _draw","       * @private","       */","      _draw: function () {","         ","         var d = 7; // arrow width/2","         var redim = d+3; //we have to make the canvas a little bigger because of arrows","         var margin=[4+redim,4+redim];","         ","         var src = this.get('src').getXY();","         var tgt = this.get('tgt').getXY();","         ","         var distance=Math.sqrt(Math.pow(src[0]-tgt[0],2)+Math.pow(src[1]-tgt[1],2));","         this.moveTo((src[0]+6), (src[1]+6));","         this.lineTo((tgt[0]+6), (tgt[1]+6));","         ","         // start drawing arrows","         var t1 = src;","         var t2 = tgt;","         ","         var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2","         var dlug = 20; //arrow length","         var t = (distance === 0) ? 0 : 1-(dlug/distance);","         z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );","         z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );","         ","         //line which connects the terminals: y=ax+b","         var W = t1[0] - t2[0];","         var Wa = t1[1] - t2[1];","         var Wb = t1[0]*t2[1] - t1[1]*t2[0];","         ","         var a,b, aProst, bProst;","         ","         if (W !== 0) {","            a = Wa/W;","            b = Wb/W;","         }","         else {","            a = 0;","         }","         //line perpendicular to the main line: y = aProst*x + b","         if (a === 0) {","            aProst = 0;","         }","         else {","            aProst = -1/a;","         }","         bProst = z[1] - aProst*z[0]; //point z lays on this line","         ","         //we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z","         var A = 1 + Math.pow(aProst,2);","         var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;","         var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);","         var delta = Math.pow(B,2) - 4*A*C;","         if (delta < 0) { return; }","         ","         var x1 = (-B + Math.sqrt(delta)) / (2*A);","         var x2 = (-B - Math.sqrt(delta)) / (2*A);","         var y1 = aProst*x1 + bProst;","         var y2 = aProst*x2 + bProst;","         ","         if(t1[1] == t2[1]) {","            var o = (t1[0] > t2[0]) ? 1 : -1;","            x1 = t2[0]+o*dlug;","            x2 = x1;","            y1 -= d;","            y2 += d;","         }","","         //triangle fill","         //this.fillStyle = this.options.color;","         //this.beginPath();","         /*this.moveTo(t2[0],t2[1]);","         this.lineTo(x1,y1);","         this.lineTo(x2,y2);*/","         //this.fill();","         ","         ","         //triangle border	","         //this.strokeStyle = this.options.bordercolor;","         //this.lineWidth = this.options.borderwidth;","         //this.beginPath();","         this.moveTo(t2[0]+6,t2[1]+6);","         this.lineTo(x1+6,y1+6);","         this.moveTo(t2[0]+6,t2[1]+6);","         this.lineTo(x2+6,y2+6);","         this.end();","         //this.lineTo(t2[0]+6,t2[1]+6);","         //this.stroke();","         ","      }","      ","    });","","    Y.ArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});","","","","}, '@VERSION@', {\"requires\": [\"wire-base\"]});"];
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].lines = {"1":0,"3":0,"16":0,"17":0,"20":0,"22":0,"30":0,"31":0,"32":0,"34":0,"35":0,"37":0,"38":0,"39":0,"42":0,"43":0,"45":0,"46":0,"47":0,"48":0,"49":0,"52":0,"53":0,"54":0,"56":0,"58":0,"59":0,"60":0,"63":0,"66":0,"67":0,"70":0,"72":0,"75":0,"76":0,"77":0,"78":0,"79":0,"81":0,"82":0,"83":0,"84":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"107":0,"108":0,"109":0,"110":0,"111":0,"119":0};
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].functions = {"ArrowWire:16":0,"_draw:28":0,"(anonymous 1):1":0};
_yuitest_coverage["build/arrow-wire/arrow-wire.js"].coveredLines = 54;
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
         
         _yuitest_coverfunc("build/arrow-wire/arrow-wire.js", "_draw", 28);
_yuitest_coverline("build/arrow-wire/arrow-wire.js", 30);
var d = 7; // arrow width/2
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 31);
var redim = d+3; //we have to make the canvas a little bigger because of arrows
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 32);
var margin=[4+redim,4+redim];
         
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 34);
var src = this.get('src').getXY();
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 35);
var tgt = this.get('tgt').getXY();
         
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 37);
var distance=Math.sqrt(Math.pow(src[0]-tgt[0],2)+Math.pow(src[1]-tgt[1],2));
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 38);
this.moveTo((src[0]+6), (src[1]+6));
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 39);
this.lineTo((tgt[0]+6), (tgt[1]+6));
         
         // start drawing arrows
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 42);
var t1 = src;
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 43);
var t2 = tgt;
         
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 45);
var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 46);
var dlug = 20; //arrow length
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 47);
var t = (distance === 0) ? 0 : 1-(dlug/distance);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 48);
z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 49);
z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );
         
         //line which connects the terminals: y=ax+b
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 52);
var W = t1[0] - t2[0];
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 53);
var Wa = t1[1] - t2[1];
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 54);
var Wb = t1[0]*t2[1] - t1[1]*t2[0];
         
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 56);
var a,b, aProst, bProst;
         
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 58);
if (W !== 0) {
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 59);
a = Wa/W;
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 60);
b = Wb/W;
         }
         else {
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 63);
a = 0;
         }
         //line perpendicular to the main line: y = aProst*x + b
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 66);
if (a === 0) {
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 67);
aProst = 0;
         }
         else {
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 70);
aProst = -1/a;
         }
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 72);
bProst = z[1] - aProst*z[0]; //point z lays on this line
         
         //we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 75);
var A = 1 + Math.pow(aProst,2);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 76);
var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 77);
var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 78);
var delta = Math.pow(B,2) - 4*A*C;
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 79);
if (delta < 0) { return; }
         
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 81);
var x1 = (-B + Math.sqrt(delta)) / (2*A);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 82);
var x2 = (-B - Math.sqrt(delta)) / (2*A);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 83);
var y1 = aProst*x1 + bProst;
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 84);
var y2 = aProst*x2 + bProst;
         
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 86);
if(t1[1] == t2[1]) {
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 87);
var o = (t1[0] > t2[0]) ? 1 : -1;
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 88);
x1 = t2[0]+o*dlug;
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 89);
x2 = x1;
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 90);
y1 -= d;
            _yuitest_coverline("build/arrow-wire/arrow-wire.js", 91);
y2 += d;
         }

         //triangle fill
         //this.fillStyle = this.options.color;
         //this.beginPath();
         /*this.moveTo(t2[0],t2[1]);
         this.lineTo(x1,y1);
         this.lineTo(x2,y2);*/
         //this.fill();
         
         
         //triangle border	
         //this.strokeStyle = this.options.bordercolor;
         //this.lineWidth = this.options.borderwidth;
         //this.beginPath();
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 107);
this.moveTo(t2[0]+6,t2[1]+6);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 108);
this.lineTo(x1+6,y1+6);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 109);
this.moveTo(t2[0]+6,t2[1]+6);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 110);
this.lineTo(x2+6,y2+6);
         _yuitest_coverline("build/arrow-wire/arrow-wire.js", 111);
this.end();
         //this.lineTo(t2[0]+6,t2[1]+6);
         //this.stroke();
         
      }
      
    });

    _yuitest_coverline("build/arrow-wire/arrow-wire.js", 119);
Y.ArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});



}, '@VERSION@', {"requires": ["wire-base"]});
