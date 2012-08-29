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
_yuitest_coverage["build/terminal-base/terminal-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/terminal-base/terminal-base.js",
    code: []
};
_yuitest_coverage["build/terminal-base/terminal-base.js"].code=["YUI.add('terminal-base', function (Y, NAME) {","","'use strict';","","/**"," * @module terminal-base"," */","","/**"," * Terminal is responsible for wire edition"," * @class TerminalBase"," * @constructor"," * @extends Widget"," * @uses WidgetChild"," * @uses WidgetPosition"," * @uses WidgetPositionAlign"," * @uses WiresDelegate"," * @param {Object} oConfigs The user configuration for the instance."," */","Y.TerminalBase = Y.Base.create(\"terminal-base\", Y.Widget, [Y.WidgetChild, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WiresDelegate], {","   ","   renderUI: function () {","      ","      // For Overlay extensions such as Scissors or DDGroups","      var show = Y.bind(function () {","         var bb = this.get('boundingBox');","         if( bb ) {","            bb.addClass( this.getClassName(\"show-overlay\") );","         }","      }, this);","      var hide = Y.bind(function () {","         var bb = this.get('boundingBox');","         if(bb) {","            bb.removeClass( this.getClassName(\"show-overlay\") );","         }","      }, this);","      this.get('boundingBox').on('mouseover', function () { Y.later(300, this, show); });","      this.get('boundingBox').on('mouseout', function () { Y.later(300, this, hide); });","      ","   },","   ","   // override the WiresDelegate behavior which re-fires the event","   // add the connected class","   _onAddWire: function (e) {","      this.get('boundingBox').addClass(  this.getClassName(\"connected\") );","   },","   ","   // override the WiresDelegate behavior which re-fires the event","   // Remove the connected class if it has no more wires:","   _onRemoveWire: function (e) {","      if(this._wires.length === 0) {","         this.get('boundingBox').removeClass(  this.getClassName(\"connected\") );","      }","   },","   ","   /**","    * This function is a temporary test. I added the border width while traversing the DOM and","    * I calculated the offset to center the wire in the terminal just after its creation","    * @method getXY","    */","   getXY: function () {","      return this.get('contentBox').getXY();","   }","   ","}, {","   ","   ATTRS: {","      ","      name: {","         value: null","      },","      ","      /**","       * Vector direction at the terminal","       * (used by BezierWire ou Scissors)","       * @attribute dir","       */","      dir: {","         value: [0,1]","      },","      ","      alignNode: {","         value: null","      }","   }","   ","});","","","","","}, '@VERSION@', {\"requires\": [\"widget\", \"widget-child\", \"widget-position\", \"widget-position-align\", \"wire-base\", \"wires-delegate\"]});"];
_yuitest_coverage["build/terminal-base/terminal-base.js"].lines = {"1":0,"3":0,"20":0,"25":0,"26":0,"27":0,"28":0,"31":0,"32":0,"33":0,"34":0,"37":0,"38":0,"45":0,"51":0,"52":0,"62":0};
_yuitest_coverage["build/terminal-base/terminal-base.js"].functions = {"(anonymous 2):25":0,"(anonymous 3):31":0,"(anonymous 4):37":0,"(anonymous 5):38":0,"renderUI:22":0,"_onAddWire:44":0,"_onRemoveWire:50":0,"getXY:61":0,"(anonymous 1):1":0};
_yuitest_coverage["build/terminal-base/terminal-base.js"].coveredLines = 17;
_yuitest_coverage["build/terminal-base/terminal-base.js"].coveredFunctions = 9;
_yuitest_coverline("build/terminal-base/terminal-base.js", 1);
YUI.add('terminal-base', function (Y, NAME) {

_yuitest_coverfunc("build/terminal-base/terminal-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/terminal-base/terminal-base.js", 3);
'use strict';

/**
 * @module terminal-base
 */

/**
 * Terminal is responsible for wire edition
 * @class TerminalBase
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WiresDelegate
 * @param {Object} oConfigs The user configuration for the instance.
 */
_yuitest_coverline("build/terminal-base/terminal-base.js", 20);
Y.TerminalBase = Y.Base.create("terminal-base", Y.Widget, [Y.WidgetChild, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WiresDelegate], {
   
   renderUI: function () {
      
      // For Overlay extensions such as Scissors or DDGroups
      _yuitest_coverfunc("build/terminal-base/terminal-base.js", "renderUI", 22);
_yuitest_coverline("build/terminal-base/terminal-base.js", 25);
var show = Y.bind(function () {
         _yuitest_coverfunc("build/terminal-base/terminal-base.js", "(anonymous 2)", 25);
_yuitest_coverline("build/terminal-base/terminal-base.js", 26);
var bb = this.get('boundingBox');
         _yuitest_coverline("build/terminal-base/terminal-base.js", 27);
if( bb ) {
            _yuitest_coverline("build/terminal-base/terminal-base.js", 28);
bb.addClass( this.getClassName("show-overlay") );
         }
      }, this);
      _yuitest_coverline("build/terminal-base/terminal-base.js", 31);
var hide = Y.bind(function () {
         _yuitest_coverfunc("build/terminal-base/terminal-base.js", "(anonymous 3)", 31);
_yuitest_coverline("build/terminal-base/terminal-base.js", 32);
var bb = this.get('boundingBox');
         _yuitest_coverline("build/terminal-base/terminal-base.js", 33);
if(bb) {
            _yuitest_coverline("build/terminal-base/terminal-base.js", 34);
bb.removeClass( this.getClassName("show-overlay") );
         }
      }, this);
      _yuitest_coverline("build/terminal-base/terminal-base.js", 37);
this.get('boundingBox').on('mouseover', function () { _yuitest_coverfunc("build/terminal-base/terminal-base.js", "(anonymous 4)", 37);
Y.later(300, this, show); });
      _yuitest_coverline("build/terminal-base/terminal-base.js", 38);
this.get('boundingBox').on('mouseout', function () { _yuitest_coverfunc("build/terminal-base/terminal-base.js", "(anonymous 5)", 38);
Y.later(300, this, hide); });
      
   },
   
   // override the WiresDelegate behavior which re-fires the event
   // add the connected class
   _onAddWire: function (e) {
      _yuitest_coverfunc("build/terminal-base/terminal-base.js", "_onAddWire", 44);
_yuitest_coverline("build/terminal-base/terminal-base.js", 45);
this.get('boundingBox').addClass(  this.getClassName("connected") );
   },
   
   // override the WiresDelegate behavior which re-fires the event
   // Remove the connected class if it has no more wires:
   _onRemoveWire: function (e) {
      _yuitest_coverfunc("build/terminal-base/terminal-base.js", "_onRemoveWire", 50);
_yuitest_coverline("build/terminal-base/terminal-base.js", 51);
if(this._wires.length === 0) {
         _yuitest_coverline("build/terminal-base/terminal-base.js", 52);
this.get('boundingBox').removeClass(  this.getClassName("connected") );
      }
   },
   
   /**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
    * @method getXY
    */
   getXY: function () {
      _yuitest_coverfunc("build/terminal-base/terminal-base.js", "getXY", 61);
_yuitest_coverline("build/terminal-base/terminal-base.js", 62);
return this.get('contentBox').getXY();
   }
   
}, {
   
   ATTRS: {
      
      name: {
         value: null
      },
      
      /**
       * Vector direction at the terminal
       * (used by BezierWire ou Scissors)
       * @attribute dir
       */
      dir: {
         value: [0,1]
      },
      
      alignNode: {
         value: null
      }
   }
   
});




}, '@VERSION@', {"requires": ["widget", "widget-child", "widget-position", "widget-position-align", "wire-base", "wires-delegate"]});
