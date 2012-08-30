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
_yuitest_coverage["build/wires-delegate/wires-delegate.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/wires-delegate/wires-delegate.js",
    code: []
};
_yuitest_coverage["build/wires-delegate/wires-delegate.js"].code=["YUI.add('wires-delegate', function (Y, NAME) {","","/**"," * @module wires-delegate"," */","","/**"," * WiresDelegate is an extension for Widgets to manipulate a list of wires."," *"," * The WidgetParent/WidgetChild relationship isn't sufficient"," * because wires have 2 parents, so we use this extension instead of WidgetParent"," *"," * @class WiresDelegate"," * @constructor"," * @param {Object} config configuration object"," */","Y.WiresDelegate = function (config) {","   ","   this._wires = [];","   ","   this.publish('addWire');","   ","   this.publish('removeWire');","   ","   // Bubble events from terminals","   this.on('terminal:addWire', this._onAddWire, this);","   this.on('terminal:removeWire', this._onRemoveWire, this);","   ","};","","Y.WiresDelegate.ATTRS = {};","","Y.WiresDelegate.prototype = {","   ","   _onAddWire: function (e) {","      var w = e;","      while(!!w._event) { w = w.details[0]; }","      this.addWire(w);","   },","   ","   _onRemoveWire: function (e) {","      var w = e;","      while(!!w._event) { w = w.details[0]; }","      this.removeWire(w);","   },","   ","   /**","    * Add a wire to this terminal.","    * @method addWire","    * @param {Wire} wire Wire instance to add","    */","   addWire: function (wire) {","      var index = Y.Array.indexOf(this._wires, wire); ","      if(index == -1) {","         this._wires.push(wire);","         this.fire('addWire', wire);","      }","   },","   ","   /**","    * When a wire is destroyed","    * @method removeWire","    */","   removeWire: function (wire) {","      ","      var index = Y.Array.indexOf(this._wires, wire); ","      ","      if( index != -1 ) {","         ","         // Compact the array","         var w = this._wires;","         this._wires = [];","         var v = this._wires;","         Y.Array.each(w,function (i) { if(i != wire){ v.push(i); } });","         ","         // Fire the event","         this.fire('removeWire', wire);","      }","      ","   },","   ","   /** ","    * Remove all wires","    * @method destroyWires","    */","   destroyWires: function () {","      ","      if(this._wires) {","         Y.Array.each(this._wires, function (w) {","            w.destroy();","         });","      }","   ","   },","   ","   /**","    * Returns a list of all the terminals connected to this terminal through its wires.","    * @method getConnected","    * @return  {Array}  List of all connected terminals","    */","   getConnected: function () {","      var list = [];","      if(this._wires) {","         for(var i = 0, n = this._wires.length ; i < n ; i++) {","            list.push(this._wires[i].getOtherTerminal(this));","         }","      }","      return list;","   },","   ","   /**","    * Redraw all the wires connected to this terminal","    * @method redrawAllWires","    */","   redrawAllWires: function () {","      ","      if(this._wires) {","         Y.Array.each(this._wires, function (w) {","            w._draw();","         });","      }","   },","","   destructor: function () {","      this.destroyWires();","   }","   ","};","","","","}, '@VERSION@', {\"requires\": [\"wire-base\"]});"];
_yuitest_coverage["build/wires-delegate/wires-delegate.js"].lines = {"1":0,"17":0,"19":0,"21":0,"23":0,"26":0,"27":0,"31":0,"33":0,"36":0,"37":0,"38":0,"42":0,"43":0,"44":0,"53":0,"54":0,"55":0,"56":0,"66":0,"68":0,"71":0,"72":0,"73":0,"74":0,"77":0,"88":0,"89":0,"90":0,"102":0,"103":0,"104":0,"105":0,"108":0,"117":0,"118":0,"119":0,"125":0};
_yuitest_coverage["build/wires-delegate/wires-delegate.js"].functions = {"WiresDelegate:17":0,"_onAddWire:35":0,"_onRemoveWire:41":0,"addWire:52":0,"(anonymous 2):74":0,"removeWire:64":0,"(anonymous 3):89":0,"destroyWires:86":0,"getConnected:101":0,"(anonymous 4):118":0,"redrawAllWires:115":0,"destructor:124":0,"(anonymous 1):1":0};
_yuitest_coverage["build/wires-delegate/wires-delegate.js"].coveredLines = 38;
_yuitest_coverage["build/wires-delegate/wires-delegate.js"].coveredFunctions = 13;
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 1);
YUI.add('wires-delegate', function (Y, NAME) {

/**
 * @module wires-delegate
 */

/**
 * WiresDelegate is an extension for Widgets to manipulate a list of wires.
 *
 * The WidgetParent/WidgetChild relationship isn't sufficient
 * because wires have 2 parents, so we use this extension instead of WidgetParent
 *
 * @class WiresDelegate
 * @constructor
 * @param {Object} config configuration object
 */
_yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "(anonymous 1)", 1);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 17);
Y.WiresDelegate = function (config) {
   
   _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "WiresDelegate", 17);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 19);
this._wires = [];
   
   _yuitest_coverline("build/wires-delegate/wires-delegate.js", 21);
this.publish('addWire');
   
   _yuitest_coverline("build/wires-delegate/wires-delegate.js", 23);
this.publish('removeWire');
   
   // Bubble events from terminals
   _yuitest_coverline("build/wires-delegate/wires-delegate.js", 26);
this.on('terminal:addWire', this._onAddWire, this);
   _yuitest_coverline("build/wires-delegate/wires-delegate.js", 27);
this.on('terminal:removeWire', this._onRemoveWire, this);
   
};

_yuitest_coverline("build/wires-delegate/wires-delegate.js", 31);
Y.WiresDelegate.ATTRS = {};

_yuitest_coverline("build/wires-delegate/wires-delegate.js", 33);
Y.WiresDelegate.prototype = {
   
   _onAddWire: function (e) {
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "_onAddWire", 35);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 36);
var w = e;
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 37);
while(!!w._event) { w = w.details[0]; }
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 38);
this.addWire(w);
   },
   
   _onRemoveWire: function (e) {
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "_onRemoveWire", 41);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 42);
var w = e;
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 43);
while(!!w._event) { w = w.details[0]; }
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 44);
this.removeWire(w);
   },
   
   /**
    * Add a wire to this terminal.
    * @method addWire
    * @param {Wire} wire Wire instance to add
    */
   addWire: function (wire) {
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "addWire", 52);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 53);
var index = Y.Array.indexOf(this._wires, wire); 
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 54);
if(index == -1) {
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 55);
this._wires.push(wire);
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 56);
this.fire('addWire', wire);
      }
   },
   
   /**
    * When a wire is destroyed
    * @method removeWire
    */
   removeWire: function (wire) {
      
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "removeWire", 64);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 66);
var index = Y.Array.indexOf(this._wires, wire); 
      
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 68);
if( index != -1 ) {
         
         // Compact the array
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 71);
var w = this._wires;
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 72);
this._wires = [];
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 73);
var v = this._wires;
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 74);
Y.Array.each(w,function (i) { _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "(anonymous 2)", 74);
if(i != wire){ v.push(i); } });
         
         // Fire the event
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 77);
this.fire('removeWire', wire);
      }
      
   },
   
   /** 
    * Remove all wires
    * @method destroyWires
    */
   destroyWires: function () {
      
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "destroyWires", 86);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 88);
if(this._wires) {
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 89);
Y.Array.each(this._wires, function (w) {
            _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "(anonymous 3)", 89);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 90);
w.destroy();
         });
      }
   
   },
   
   /**
    * Returns a list of all the terminals connected to this terminal through its wires.
    * @method getConnected
    * @return  {Array}  List of all connected terminals
    */
   getConnected: function () {
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "getConnected", 101);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 102);
var list = [];
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 103);
if(this._wires) {
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 104);
for(var i = 0, n = this._wires.length ; i < n ; i++) {
            _yuitest_coverline("build/wires-delegate/wires-delegate.js", 105);
list.push(this._wires[i].getOtherTerminal(this));
         }
      }
      _yuitest_coverline("build/wires-delegate/wires-delegate.js", 108);
return list;
   },
   
   /**
    * Redraw all the wires connected to this terminal
    * @method redrawAllWires
    */
   redrawAllWires: function () {
      
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "redrawAllWires", 115);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 117);
if(this._wires) {
         _yuitest_coverline("build/wires-delegate/wires-delegate.js", 118);
Y.Array.each(this._wires, function (w) {
            _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "(anonymous 4)", 118);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 119);
w._draw();
         });
      }
   },

   destructor: function () {
      _yuitest_coverfunc("build/wires-delegate/wires-delegate.js", "destructor", 124);
_yuitest_coverline("build/wires-delegate/wires-delegate.js", 125);
this.destroyWires();
   }
   
};



}, '@VERSION@', {"requires": ["wire-base"]});
