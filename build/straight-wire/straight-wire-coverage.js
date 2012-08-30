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
_yuitest_coverage["build/straight-wire/straight-wire.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/straight-wire/straight-wire.js",
    code: []
};
_yuitest_coverage["build/straight-wire/straight-wire.js"].code=["YUI.add('straight-wire', function (Y, NAME) {","","/**"," * @module straight-wire"," */","","/**"," * Straight Wire"," * @class StraightWire"," * @extends WireBase"," * @constructor"," * @param {Object} cfg the configuration for the StraightWire attributes"," */","Y.StraightWire = function (cfg) {","   Y.StraightWire.superclass.constructor.apply(this, arguments);","};","","Y.StraightWire.NAME = \"straightwire\";","","Y.extend(Y.StraightWire, Y.WireBase, {","  ","   /**","    * @method _draw","    * @private","    */","   _draw: function () {","      ","      this.clear();","      ","      var src = this.get('src').getXY();","      var tgt = this.get('tgt').getXY();","      ","      this.moveTo((src[0]+6), (src[1]+6));","      this.lineTo((tgt[0]+6), (tgt[1]+6));","      this.end();","   }","   ","});","","Y.StraightWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});","","","}, '@VERSION@', {\"requires\": [\"wire-base\"]});"];
_yuitest_coverage["build/straight-wire/straight-wire.js"].lines = {"1":0,"14":0,"15":0,"18":0,"20":0,"28":0,"30":0,"31":0,"33":0,"34":0,"35":0,"40":0};
_yuitest_coverage["build/straight-wire/straight-wire.js"].functions = {"StraightWire:14":0,"_draw:26":0,"(anonymous 1):1":0};
_yuitest_coverage["build/straight-wire/straight-wire.js"].coveredLines = 12;
_yuitest_coverage["build/straight-wire/straight-wire.js"].coveredFunctions = 3;
_yuitest_coverline("build/straight-wire/straight-wire.js", 1);
YUI.add('straight-wire', function (Y, NAME) {

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
_yuitest_coverfunc("build/straight-wire/straight-wire.js", "(anonymous 1)", 1);
_yuitest_coverline("build/straight-wire/straight-wire.js", 14);
Y.StraightWire = function (cfg) {
   _yuitest_coverfunc("build/straight-wire/straight-wire.js", "StraightWire", 14);
_yuitest_coverline("build/straight-wire/straight-wire.js", 15);
Y.StraightWire.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/straight-wire/straight-wire.js", 18);
Y.StraightWire.NAME = "straightwire";

_yuitest_coverline("build/straight-wire/straight-wire.js", 20);
Y.extend(Y.StraightWire, Y.WireBase, {
  
   /**
    * @method _draw
    * @private
    */
   _draw: function () {
      
      _yuitest_coverfunc("build/straight-wire/straight-wire.js", "_draw", 26);
_yuitest_coverline("build/straight-wire/straight-wire.js", 28);
this.clear();
      
      _yuitest_coverline("build/straight-wire/straight-wire.js", 30);
var src = this.get('src').getXY();
      _yuitest_coverline("build/straight-wire/straight-wire.js", 31);
var tgt = this.get('tgt').getXY();
      
      _yuitest_coverline("build/straight-wire/straight-wire.js", 33);
this.moveTo((src[0]+6), (src[1]+6));
      _yuitest_coverline("build/straight-wire/straight-wire.js", 34);
this.lineTo((tgt[0]+6), (tgt[1]+6));
      _yuitest_coverline("build/straight-wire/straight-wire.js", 35);
this.end();
   }
   
});

_yuitest_coverline("build/straight-wire/straight-wire.js", 40);
Y.StraightWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {});


}, '@VERSION@', {"requires": ["wire-base"]});
