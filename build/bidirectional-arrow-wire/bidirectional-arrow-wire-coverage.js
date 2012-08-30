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
_yuitest_coverage["build/bidirectional-arrow-wire/bidirectional-arrow-wire.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/bidirectional-arrow-wire/bidirectional-arrow-wire.js",
    code: []
};
_yuitest_coverage["build/bidirectional-arrow-wire/bidirectional-arrow-wire.js"].code=["YUI.add('bidirectional-arrow-wire', function (Y, NAME) {","","/**"," * @module straight-wire"," */","","/**"," * BidirectionalArrowWire"," * @class BidirectionalArrowWire"," * @extends WireBase"," * @constructor"," * @param {Object} config the configuration for the BezierWire attributes"," */","Y.BidirectionalArrowWire = function (cfg) {","   Y.BidirectionalArrowWire.superclass.constructor.apply(this, arguments);","};","","Y.BidirectionalArrowWire.NAME = \"bidirectionalarrowwire\";","","Y.extend(Y.BidirectionalArrowWire, Y.WireBase, {","   ","   /**","    * @method _draw","    * @private","    */","   _draw: function () {","      ","      var d = 7; // arrow width/2","      var redim = d+3; //we have to make the canvas a little bigger because of arrows","      var margin=[4+redim,4+redim];","     ","      var src = this.get('src').getXY();","        var tgt = this.get('tgt').getXY();","      ","      var distance=Math.sqrt(Math.pow(src[0]-tgt[0],2)+Math.pow(src[1]-tgt[1],2));","      this.moveTo((src[0]+6), (src[1]+6));","      this.lineTo((tgt[0]+6), (tgt[1]+6));","        ","      // start drawing arrows","","      var t1 = src;","      var t2 = tgt;","","      var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2","      var dlug = 20; //arrow length","      var t = (distance === 0) ? 0 : 1-(dlug/distance);","      z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );","      z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );   ","","      //line which connects the terminals: y=ax+b","      var W = t1[0] - t2[0];","      var Wa = t1[1] - t2[1];","      var Wb = t1[0]*t2[1] - t1[1]*t2[0];","      if (W !== 0) {","         a = Wa/W;","         b = Wb/W;","      }","      else {","         a = 0;","      }","      //line perpendicular to the main line: y = aProst*x + b","      if (a === 0) {","         aProst = 0;","      }","      else {","         aProst = -1/a;","      }","      bProst = z[1] - aProst*z[0]; //point z lays on this line","","      //we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z","      var A = 1 + Math.pow(aProst,2);","      var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;","      var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);","      var delta = Math.pow(B,2) - 4*A*C;","      if (delta < 0) { return; }","         ","      var x1 = (-B + Math.sqrt(delta)) / (2*A);","      var x2 = (-B - Math.sqrt(delta)) / (2*A);    ","      var y1 = aProst*x1 + bProst;","      var y2 = aProst*x2 + bProst;","      ","      if(t1[1] == t2[1]) {","           var o = (t1[0] > t2[0]) ? 1 : -1;","            x1 = t2[0]+o*dlug;","            x2 = x1;","            y1 -= d;","            y2 += d;","      }      ","","      this.moveTo(t2[0]+6,t2[1]+6);","      this.lineTo(x1+6,y1+6);","      this.moveTo(t2[0]+6,t2[1]+6);","      this.lineTo(x2+6,y2+6);","","      t1 = tgt;","      t2 = src;","","      var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2","      var dlug = 20; //arrow length","      var t = (distance == 0) ? 0 : 1-(dlug/distance);","      z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );","      z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );   ","","      //line which connects the terminals: y=ax+b","      var W = t1[0] - t2[0];","      var Wa = t1[1] - t2[1];","      var Wb = t1[0]*t2[1] - t1[1]*t2[0];","      if (W !== 0) {","         a = Wa/W;","         b = Wb/W;","      }","      else {","         a = 0;","      }","      //line perpendicular to the main line: y = aProst*x + b","      if (a == 0) {","         aProst = 0;","      }","      else {","         aProst = -1/a;","      }","      bProst = z[1] - aProst*z[0]; //point z lays on this line","","      //we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z","      var A = 1 + Math.pow(aProst,2);","      var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;","      var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);","      var delta = Math.pow(B,2) - 4*A*C;","      if (delta < 0) { return; }","         ","      var x1 = (-B + Math.sqrt(delta)) / (2*A);","      var x2 = (-B - Math.sqrt(delta)) / (2*A);    ","      var y1 = aProst*x1 + bProst;","      var y2 = aProst*x2 + bProst;","      ","      if(t1[1] == t2[1]) {","           var o = (t1[0] > t2[0]) ? 1 : -1;","            x1 = t2[0]+o*dlug;","            x2 = x1;","            y1 -= d;","            y2 += d;","      }      ","","      this.moveTo(t2[0]+6,t2[1]+6);","      this.lineTo(x1+6,y1+6);","      this.moveTo(t2[0]+6,t2[1]+6);","      this.lineTo(x2+6,y2+6);      ","      ","      this.end();","   ","   }","   ","   ","});","","Y.BidirectionalArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});","","","}, '@VERSION@', {\"requires\": [\"wire-base\"]});"];
_yuitest_coverage["build/bidirectional-arrow-wire/bidirectional-arrow-wire.js"].lines = {"1":0,"14":0,"15":0,"18":0,"20":0,"28":0,"29":0,"30":0,"32":0,"33":0,"35":0,"36":0,"37":0,"41":0,"42":0,"44":0,"45":0,"46":0,"47":0,"48":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"59":0,"62":0,"63":0,"66":0,"68":0,"71":0,"72":0,"73":0,"74":0,"75":0,"77":0,"78":0,"79":0,"80":0,"82":0,"83":0,"84":0,"85":0,"86":0,"87":0,"90":0,"91":0,"92":0,"93":0,"95":0,"96":0,"98":0,"99":0,"100":0,"101":0,"102":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":0,"113":0,"116":0,"117":0,"120":0,"122":0,"125":0,"126":0,"127":0,"128":0,"129":0,"131":0,"132":0,"133":0,"134":0,"136":0,"137":0,"138":0,"139":0,"140":0,"141":0,"144":0,"145":0,"146":0,"147":0,"149":0,"156":0};
_yuitest_coverage["build/bidirectional-arrow-wire/bidirectional-arrow-wire.js"].functions = {"BidirectionalArrowWire:14":0,"_draw:26":0,"(anonymous 1):1":0};
_yuitest_coverage["build/bidirectional-arrow-wire/bidirectional-arrow-wire.js"].coveredLines = 89;
_yuitest_coverage["build/bidirectional-arrow-wire/bidirectional-arrow-wire.js"].coveredFunctions = 3;
_yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 1);
YUI.add('bidirectional-arrow-wire', function (Y, NAME) {

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
_yuitest_coverfunc("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", "(anonymous 1)", 1);
_yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 14);
Y.BidirectionalArrowWire = function (cfg) {
   _yuitest_coverfunc("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", "BidirectionalArrowWire", 14);
_yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 15);
Y.BidirectionalArrowWire.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 18);
Y.BidirectionalArrowWire.NAME = "bidirectionalarrowwire";

_yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 20);
Y.extend(Y.BidirectionalArrowWire, Y.WireBase, {
   
   /**
    * @method _draw
    * @private
    */
   _draw: function () {
      
      _yuitest_coverfunc("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", "_draw", 26);
_yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 28);
var d = 7; // arrow width/2
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 29);
var redim = d+3; //we have to make the canvas a little bigger because of arrows
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 30);
var margin=[4+redim,4+redim];
     
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 32);
var src = this.get('src').getXY();
        _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 33);
var tgt = this.get('tgt').getXY();
      
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 35);
var distance=Math.sqrt(Math.pow(src[0]-tgt[0],2)+Math.pow(src[1]-tgt[1],2));
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 36);
this.moveTo((src[0]+6), (src[1]+6));
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 37);
this.lineTo((tgt[0]+6), (tgt[1]+6));
        
      // start drawing arrows

      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 41);
var t1 = src;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 42);
var t2 = tgt;

      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 44);
var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 45);
var dlug = 20; //arrow length
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 46);
var t = (distance === 0) ? 0 : 1-(dlug/distance);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 47);
z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 48);
z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );   

      //line which connects the terminals: y=ax+b
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 51);
var W = t1[0] - t2[0];
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 52);
var Wa = t1[1] - t2[1];
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 53);
var Wb = t1[0]*t2[1] - t1[1]*t2[0];
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 54);
if (W !== 0) {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 55);
a = Wa/W;
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 56);
b = Wb/W;
      }
      else {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 59);
a = 0;
      }
      //line perpendicular to the main line: y = aProst*x + b
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 62);
if (a === 0) {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 63);
aProst = 0;
      }
      else {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 66);
aProst = -1/a;
      }
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 68);
bProst = z[1] - aProst*z[0]; //point z lays on this line

      //we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 71);
var A = 1 + Math.pow(aProst,2);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 72);
var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 73);
var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 74);
var delta = Math.pow(B,2) - 4*A*C;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 75);
if (delta < 0) { return; }
         
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 77);
var x1 = (-B + Math.sqrt(delta)) / (2*A);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 78);
var x2 = (-B - Math.sqrt(delta)) / (2*A);    
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 79);
var y1 = aProst*x1 + bProst;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 80);
var y2 = aProst*x2 + bProst;
      
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 82);
if(t1[1] == t2[1]) {
           _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 83);
var o = (t1[0] > t2[0]) ? 1 : -1;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 84);
x1 = t2[0]+o*dlug;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 85);
x2 = x1;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 86);
y1 -= d;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 87);
y2 += d;
      }      

      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 90);
this.moveTo(t2[0]+6,t2[1]+6);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 91);
this.lineTo(x1+6,y1+6);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 92);
this.moveTo(t2[0]+6,t2[1]+6);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 93);
this.lineTo(x2+6,y2+6);

      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 95);
t1 = tgt;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 96);
t2 = src;

      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 98);
var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 99);
var dlug = 20; //arrow length
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 100);
var t = (distance == 0) ? 0 : 1-(dlug/distance);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 101);
z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 102);
z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );   

      //line which connects the terminals: y=ax+b
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 105);
var W = t1[0] - t2[0];
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 106);
var Wa = t1[1] - t2[1];
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 107);
var Wb = t1[0]*t2[1] - t1[1]*t2[0];
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 108);
if (W !== 0) {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 109);
a = Wa/W;
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 110);
b = Wb/W;
      }
      else {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 113);
a = 0;
      }
      //line perpendicular to the main line: y = aProst*x + b
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 116);
if (a == 0) {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 117);
aProst = 0;
      }
      else {
         _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 120);
aProst = -1/a;
      }
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 122);
bProst = z[1] - aProst*z[0]; //point z lays on this line

      //we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 125);
var A = 1 + Math.pow(aProst,2);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 126);
var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 127);
var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 128);
var delta = Math.pow(B,2) - 4*A*C;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 129);
if (delta < 0) { return; }
         
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 131);
var x1 = (-B + Math.sqrt(delta)) / (2*A);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 132);
var x2 = (-B - Math.sqrt(delta)) / (2*A);    
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 133);
var y1 = aProst*x1 + bProst;
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 134);
var y2 = aProst*x2 + bProst;
      
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 136);
if(t1[1] == t2[1]) {
           _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 137);
var o = (t1[0] > t2[0]) ? 1 : -1;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 138);
x1 = t2[0]+o*dlug;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 139);
x2 = x1;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 140);
y1 -= d;
            _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 141);
y2 += d;
      }      

      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 144);
this.moveTo(t2[0]+6,t2[1]+6);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 145);
this.lineTo(x1+6,y1+6);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 146);
this.moveTo(t2[0]+6,t2[1]+6);
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 147);
this.lineTo(x2+6,y2+6);      
      
      _yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 149);
this.end();
   
   }
   
   
});

_yuitest_coverline("build/bidirectional-arrow-wire/bidirectional-arrow-wire.js", 156);
Y.BidirectionalArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});


}, '@VERSION@', {"requires": ["wire-base"]});
