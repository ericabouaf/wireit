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
_yuitest_coverage["build/terminal-scissors/terminal-scissors.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/terminal-scissors/terminal-scissors.js",
    code: []
};
_yuitest_coverage["build/terminal-scissors/terminal-scissors.js"].code=["YUI.add('terminal-scissors', function (Y, NAME) {","","/**"," * @module terminal-scissors"," */","","/**"," * @class TerminalScissors"," * @constructor"," * @param {Object} config configuration object"," */","Y.TerminalScissors = function (config) {","   ","   Y.after(this._renderUIScissors, this, \"renderUI\");","   Y.after(this._bindUIScissors, this, \"bindUI\");","   ","};","","Y.TerminalScissors.ATTRS = {};","","Y.TerminalScissors.prototype = {","   ","   /**","    * @method _renderUIScissors","    * @private","    */","   _renderUIScissors: function () {","      if( this.get('editable') ) {","         this._renderScissors();","      }","   },","   ","   /**","    * @method _bindUIScissors","    * @private","    */","   _bindUIScissors: function () {","      if( this.get('editable') ) {","         this._scissorsOverlay.get('boundingBox').on('click', this.destroyWires, this);","      }","   },","   ","   /**","    * @method _renderScissors","    * @private","    */","   _renderScissors: function () {","      this._scissorsOverlay = new Y.Overlay({});","      ","      this._scissorsOverlay.get('contentBox').addClass( this.getClassName(\"scissors\") );","      ","      // Position the scissors using 'dir'","      var dir = this.get('dir');","      this._scissorsOverlay.set('x', dir[0]*40);","      this._scissorsOverlay.set('y', dir[1]*40);","      ","      this._scissorsOverlay.render( this.get('boundingBox') );","   }","   ","};","","","","}, '@VERSION@', {\"requires\": [\"overlay\"]});"];
_yuitest_coverage["build/terminal-scissors/terminal-scissors.js"].lines = {"1":0,"12":0,"14":0,"15":0,"19":0,"21":0,"28":0,"29":0,"38":0,"39":0,"48":0,"50":0,"53":0,"54":0,"55":0,"57":0};
_yuitest_coverage["build/terminal-scissors/terminal-scissors.js"].functions = {"TerminalScissors:12":0,"_renderUIScissors:27":0,"_bindUIScissors:37":0,"_renderScissors:47":0,"(anonymous 1):1":0};
_yuitest_coverage["build/terminal-scissors/terminal-scissors.js"].coveredLines = 16;
_yuitest_coverage["build/terminal-scissors/terminal-scissors.js"].coveredFunctions = 5;
_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 1);
YUI.add('terminal-scissors', function (Y, NAME) {

/**
 * @module terminal-scissors
 */

/**
 * @class TerminalScissors
 * @constructor
 * @param {Object} config configuration object
 */
_yuitest_coverfunc("build/terminal-scissors/terminal-scissors.js", "(anonymous 1)", 1);
_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 12);
Y.TerminalScissors = function (config) {
   
   _yuitest_coverfunc("build/terminal-scissors/terminal-scissors.js", "TerminalScissors", 12);
_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 14);
Y.after(this._renderUIScissors, this, "renderUI");
   _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 15);
Y.after(this._bindUIScissors, this, "bindUI");
   
};

_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 19);
Y.TerminalScissors.ATTRS = {};

_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 21);
Y.TerminalScissors.prototype = {
   
   /**
    * @method _renderUIScissors
    * @private
    */
   _renderUIScissors: function () {
      _yuitest_coverfunc("build/terminal-scissors/terminal-scissors.js", "_renderUIScissors", 27);
_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 28);
if( this.get('editable') ) {
         _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 29);
this._renderScissors();
      }
   },
   
   /**
    * @method _bindUIScissors
    * @private
    */
   _bindUIScissors: function () {
      _yuitest_coverfunc("build/terminal-scissors/terminal-scissors.js", "_bindUIScissors", 37);
_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 38);
if( this.get('editable') ) {
         _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 39);
this._scissorsOverlay.get('boundingBox').on('click', this.destroyWires, this);
      }
   },
   
   /**
    * @method _renderScissors
    * @private
    */
   _renderScissors: function () {
      _yuitest_coverfunc("build/terminal-scissors/terminal-scissors.js", "_renderScissors", 47);
_yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 48);
this._scissorsOverlay = new Y.Overlay({});
      
      _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 50);
this._scissorsOverlay.get('contentBox').addClass( this.getClassName("scissors") );
      
      // Position the scissors using 'dir'
      _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 53);
var dir = this.get('dir');
      _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 54);
this._scissorsOverlay.set('x', dir[0]*40);
      _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 55);
this._scissorsOverlay.set('y', dir[1]*40);
      
      _yuitest_coverline("build/terminal-scissors/terminal-scissors.js", 57);
this._scissorsOverlay.render( this.get('boundingBox') );
   }
   
};



}, '@VERSION@', {"requires": ["overlay"]});
