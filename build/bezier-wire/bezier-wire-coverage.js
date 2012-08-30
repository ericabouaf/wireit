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
_yuitest_coverage["build/bezier-wire/bezier-wire.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/bezier-wire/bezier-wire.js",
    code: []
};
_yuitest_coverage["build/bezier-wire/bezier-wire.js"].code=["YUI.add('bezier-wire', function (Y, NAME) {","","/**"," * @module bezier-wire"," */","","/**"," * Extend WireBase to draw a bezier curve"," * @class BezierWire"," * @extends WireBase"," * @constructor"," * @param {Object} config the configuration for the BezierWire attributes"," */","Y.BezierWire = function (cfg) {","   Y.BezierWire.superclass.constructor.apply(this, arguments);","};","","Y.BezierWire.NAME = \"bezierwire\";","","Y.extend(Y.BezierWire, Y.WireBase, {","   ","   /**","    * Draw the bezier curve.","    * The canvas is made bigger to contain the curls","    * @method _draw","    * @method private","    */","    _draw: function () {","        ","        this.clear();","        ","        var src = this.get('src').getXY();","        var tgt = this.get('tgt').getXY();","        ","        var srcDir = this.get('srcDir');","        var tgtDir = this.get('tgtDir');","        var bezierTangentNorm = this.get('bezierTangentNorm');","         ","         var terminalSize = 14/2;","         ","        this.moveTo(src[0]+terminalSize,src[1]+terminalSize);","        ","        this.curveTo(src[0]+terminalSize+srcDir[0]*bezierTangentNorm,","                     src[1]+terminalSize+srcDir[1]*bezierTangentNorm, ","                     ","                     tgt[0]+terminalSize+tgtDir[0]*bezierTangentNorm,","                     tgt[1]+terminalSize+tgtDir[1]*bezierTangentNorm, ","                     ","                     tgt[0]+terminalSize,","                     tgt[1]+terminalSize);","        ","        this.end();","     },","   ","   ","   ","   SERIALIZABLE_ATTRS: [\"color\",\"width\",\"bezierTangentNorm\"]","   ","});","","Y.BezierWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {","   ","   /** ","    * Norm of the tangeant vector at the endpoints.","    * @attribute bezierTangentNorm","    * @default 100","    * @type Integer","    */","   bezierTangentNorm: {","      setter: function (val) {","         return parseInt(val, 10);","      },","      value: 200","   }","","});","","","","}, '@VERSION@', {\"requires\": [\"wire-base\"]});"];
_yuitest_coverage["build/bezier-wire/bezier-wire.js"].lines = {"1":0,"14":0,"15":0,"18":0,"20":0,"30":0,"32":0,"33":0,"35":0,"36":0,"37":0,"39":0,"41":0,"43":0,"52":0,"61":0,"71":0};
_yuitest_coverage["build/bezier-wire/bezier-wire.js"].functions = {"BezierWire:14":0,"_draw:28":0,"setter:70":0,"(anonymous 1):1":0};
_yuitest_coverage["build/bezier-wire/bezier-wire.js"].coveredLines = 17;
_yuitest_coverage["build/bezier-wire/bezier-wire.js"].coveredFunctions = 4;
_yuitest_coverline("build/bezier-wire/bezier-wire.js", 1);
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
_yuitest_coverfunc("build/bezier-wire/bezier-wire.js", "(anonymous 1)", 1);
_yuitest_coverline("build/bezier-wire/bezier-wire.js", 14);
Y.BezierWire = function (cfg) {
   _yuitest_coverfunc("build/bezier-wire/bezier-wire.js", "BezierWire", 14);
_yuitest_coverline("build/bezier-wire/bezier-wire.js", 15);
Y.BezierWire.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/bezier-wire/bezier-wire.js", 18);
Y.BezierWire.NAME = "bezierwire";

_yuitest_coverline("build/bezier-wire/bezier-wire.js", 20);
Y.extend(Y.BezierWire, Y.WireBase, {
   
   /**
    * Draw the bezier curve.
    * The canvas is made bigger to contain the curls
    * @method _draw
    * @method private
    */
    _draw: function () {
        
        _yuitest_coverfunc("build/bezier-wire/bezier-wire.js", "_draw", 28);
_yuitest_coverline("build/bezier-wire/bezier-wire.js", 30);
this.clear();
        
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 32);
var src = this.get('src').getXY();
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 33);
var tgt = this.get('tgt').getXY();
        
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 35);
var srcDir = this.get('srcDir');
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 36);
var tgtDir = this.get('tgtDir');
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 37);
var bezierTangentNorm = this.get('bezierTangentNorm');
         
         _yuitest_coverline("build/bezier-wire/bezier-wire.js", 39);
var terminalSize = 14/2;
         
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 41);
this.moveTo(src[0]+terminalSize,src[1]+terminalSize);
        
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 43);
this.curveTo(src[0]+terminalSize+srcDir[0]*bezierTangentNorm,
                     src[1]+terminalSize+srcDir[1]*bezierTangentNorm, 
                     
                     tgt[0]+terminalSize+tgtDir[0]*bezierTangentNorm,
                     tgt[1]+terminalSize+tgtDir[1]*bezierTangentNorm, 
                     
                     tgt[0]+terminalSize,
                     tgt[1]+terminalSize);
        
        _yuitest_coverline("build/bezier-wire/bezier-wire.js", 52);
this.end();
     },
   
   
   
   SERIALIZABLE_ATTRS: ["color","width","bezierTangentNorm"]
   
});

_yuitest_coverline("build/bezier-wire/bezier-wire.js", 61);
Y.BezierWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {
   
   /** 
    * Norm of the tangeant vector at the endpoints.
    * @attribute bezierTangentNorm
    * @default 100
    * @type Integer
    */
   bezierTangentNorm: {
      setter: function (val) {
         _yuitest_coverfunc("build/bezier-wire/bezier-wire.js", "setter", 70);
_yuitest_coverline("build/bezier-wire/bezier-wire.js", 71);
return parseInt(val, 10);
      },
      value: 200
   }

});



}, '@VERSION@', {"requires": ["wire-base"]});
