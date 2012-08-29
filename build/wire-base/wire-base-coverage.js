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
_yuitest_coverage["build/wire-base/wire-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/wire-base/wire-base.js",
    code: []
};
_yuitest_coverage["build/wire-base/wire-base.js"].code=["YUI.add('wire-base', function (Y, NAME) {","","/**"," * @module wire-base"," */","","/**"," * The wire widget"," * The wire is drawn between \"src\" and \"tgt\" (so they might be directional)."," *"," * \"src\" and \"tgt\" MUST have a \"getXY\" function"," *"," * \"src\" and \"tgt\" MAY additionnaly have the \"addWire\", \"removeWire\" methods."," * Those methods are designed to be used through the Y.WiringsDelegate extension,"," * which provide basic list-handling on wires."," *"," * @class WireBase"," * @extends Path"," * @param {Object} oConfigs The user configuration for the instance."," */","Y.WireBase = function (cfg) {","   Y.WireBase.superclass.constructor.apply(this, arguments);","};","","Y.WireBase.NAME = \"wirebase\";","","Y.extend(Y.WireBase, Y.Path, {","   ","   /**","    * Notify the WiresDeletates through addWire","    * @method initializer","    */","   initializer: function () {","      ","      Y.WireBase.superclass.initializer.apply(this, arguments);","      ","      var src = this.get('src'), tgt = this.get('tgt');","      ","      if(src && src.get) {","         this.set('srcDir', src.get('dir') );","      }","      ","      if(tgt && tgt.get) {","         this.set('tgtDir', tgt.get('dir') );","      }","      ","      if(src && Y.Lang.isFunction (src.addWire) ) {","         src.addWire(this);","      }","      if(tgt && Y.Lang.isFunction (tgt.addWire) ) {","         tgt.addWire(this);","      }","      ","   },","   ","   ","   /**","    * @method bindUI","    */","   bindUI: function () {","      Y.ArrowWire.superclass.bindUI.call(this);","      ","      //this.after(\"bezierTangentNormChange\", this._afterChangeRedraw, this);","      ","      this.on('srcChange', function (e) {","         this.set('srcDir', e.newVal.get('dir') );","      }, this);","      ","      this.on('tgtChange', function (e) {","         this.set('tgtDir', e.newVal.get('dir') );","      }, this);","      ","   },","   ","   ","   /**","    * call removeWire on WiringsDelegate","    * @method destroy","    */","   destroy: function () {","      ","      Y.WireBase.superclass.destroy.apply(this, arguments);","      ","      var src = this.get('src'), tgt = this.get('tgt');","      ","      if(src && Y.Lang.isFunction (src.removeWire) ) {","         src.removeWire(this);","      }","      if(tgt && Y.Lang.isFunction (tgt.removeWire) ) {","         tgt.removeWire(this);","      }","   },","   ","   /**","    * Drawing method. Meant to be overriden by a plugin","    * @method _draw","    * @private","    */","   _draw: function () {","      //throw new Error(\"Y.Wire has no draw method. Consider using a plugin such as 'bezier-wire' in your YUI.use statement\");","   },","   ","   getOtherTerminal: function (term) {","      return (term == this.get('src')) ? this.get('tgt') : this.get('src');","   },","   ","   // TODO:","   SERIALIZABLE_ATTRS: [\"src\",\"tgt\"],","   toJSON: function () {","      return {};","   }","   ","});","","","Y.WireBase.ATTRS = Y.merge(Y.Path.ATTRS, {","   ","   /**","    * @attribute src","    */","   src: {","      value: null,","      setter: function (val) {","         //console.log(\"src setter\", val, this);","         ","         // remove this wire from the list of the previous src/tgt item","         // TODO: prev value","         /*if(e.prevVal && Y.Lang.isFunction (e.prevVal.removeWire) ) {","            e.prevVal.removeWire(this);","         }*/","         ","         if(val && Y.Lang.isFunction (val.addWire) ) {","            val.addWire(this);","         }","         ","         return val;","      }","   },","   ","   /**","    * @attribute tgt","    */","   tgt: {","      value: null,","      setter: function (val) {","         //console.log(\"tgt setter\", val, this);","         ","         ","         // remove this wire from the list of the previous src/tgt item","         // TODO: prev value","         /*if(e.prevVal && Y.Lang.isFunction (e.prevVal.removeWire) ) {","            e.prevVal.removeWire(this);","         }*/","         ","         ","         if(val && Y.Lang.isFunction (val.addWire) ) {","            val.addWire(this);","         }","         ","         return val;","      }","   },","   ","   /**","    * ","    * @attribute srcDir","    * @type Array","    * @default [1,0]","    */ ","   srcDir: {","      validator: Y.Lang.isArray,","      value: [1,0]","      // TODO: normalize ?","   },","   ","   /**","    * TODO: normalize ?","    * @attribute tgtDir","    * @type Array","    * @default -srcDir","    */","   tgtDir: {","      validator: Y.Lang.isArray,","      valueFn: function () {","         var d = this.get('srcDir');","         return [-d[0],-d[1]];","      }","      // TODO: normalize ?","   }","   ","});","","","}, '@VERSION@', {\"requires\": [\"graphics\"], \"skinnable\": true});"];
_yuitest_coverage["build/wire-base/wire-base.js"].lines = {"1":0,"21":0,"22":0,"25":0,"27":0,"35":0,"37":0,"39":0,"40":0,"43":0,"44":0,"47":0,"48":0,"50":0,"51":0,"61":0,"65":0,"66":0,"69":0,"70":0,"82":0,"84":0,"86":0,"87":0,"89":0,"90":0,"104":0,"110":0,"116":0,"132":0,"133":0,"136":0,"156":0,"157":0,"160":0,"185":0,"186":0};
_yuitest_coverage["build/wire-base/wire-base.js"].functions = {"WireBase:21":0,"initializer:33":0,"(anonymous 2):65":0,"(anonymous 3):69":0,"bindUI:60":0,"destroy:80":0,"getOtherTerminal:103":0,"toJSON:109":0,"setter:123":0,"setter:145":0,"valueFn:184":0,"(anonymous 1):1":0};
_yuitest_coverage["build/wire-base/wire-base.js"].coveredLines = 37;
_yuitest_coverage["build/wire-base/wire-base.js"].coveredFunctions = 12;
_yuitest_coverline("build/wire-base/wire-base.js", 1);
YUI.add('wire-base', function (Y, NAME) {

/**
 * @module wire-base
 */

/**
 * The wire widget
 * The wire is drawn between "src" and "tgt" (so they might be directional).
 *
 * "src" and "tgt" MUST have a "getXY" function
 *
 * "src" and "tgt" MAY additionnaly have the "addWire", "removeWire" methods.
 * Those methods are designed to be used through the Y.WiringsDelegate extension,
 * which provide basic list-handling on wires.
 *
 * @class WireBase
 * @extends Path
 * @param {Object} oConfigs The user configuration for the instance.
 */
_yuitest_coverfunc("build/wire-base/wire-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/wire-base/wire-base.js", 21);
Y.WireBase = function (cfg) {
   _yuitest_coverfunc("build/wire-base/wire-base.js", "WireBase", 21);
_yuitest_coverline("build/wire-base/wire-base.js", 22);
Y.WireBase.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/wire-base/wire-base.js", 25);
Y.WireBase.NAME = "wirebase";

_yuitest_coverline("build/wire-base/wire-base.js", 27);
Y.extend(Y.WireBase, Y.Path, {
   
   /**
    * Notify the WiresDeletates through addWire
    * @method initializer
    */
   initializer: function () {
      
      _yuitest_coverfunc("build/wire-base/wire-base.js", "initializer", 33);
_yuitest_coverline("build/wire-base/wire-base.js", 35);
Y.WireBase.superclass.initializer.apply(this, arguments);
      
      _yuitest_coverline("build/wire-base/wire-base.js", 37);
var src = this.get('src'), tgt = this.get('tgt');
      
      _yuitest_coverline("build/wire-base/wire-base.js", 39);
if(src && src.get) {
         _yuitest_coverline("build/wire-base/wire-base.js", 40);
this.set('srcDir', src.get('dir') );
      }
      
      _yuitest_coverline("build/wire-base/wire-base.js", 43);
if(tgt && tgt.get) {
         _yuitest_coverline("build/wire-base/wire-base.js", 44);
this.set('tgtDir', tgt.get('dir') );
      }
      
      _yuitest_coverline("build/wire-base/wire-base.js", 47);
if(src && Y.Lang.isFunction (src.addWire) ) {
         _yuitest_coverline("build/wire-base/wire-base.js", 48);
src.addWire(this);
      }
      _yuitest_coverline("build/wire-base/wire-base.js", 50);
if(tgt && Y.Lang.isFunction (tgt.addWire) ) {
         _yuitest_coverline("build/wire-base/wire-base.js", 51);
tgt.addWire(this);
      }
      
   },
   
   
   /**
    * @method bindUI
    */
   bindUI: function () {
      _yuitest_coverfunc("build/wire-base/wire-base.js", "bindUI", 60);
_yuitest_coverline("build/wire-base/wire-base.js", 61);
Y.ArrowWire.superclass.bindUI.call(this);
      
      //this.after("bezierTangentNormChange", this._afterChangeRedraw, this);
      
      _yuitest_coverline("build/wire-base/wire-base.js", 65);
this.on('srcChange', function (e) {
         _yuitest_coverfunc("build/wire-base/wire-base.js", "(anonymous 2)", 65);
_yuitest_coverline("build/wire-base/wire-base.js", 66);
this.set('srcDir', e.newVal.get('dir') );
      }, this);
      
      _yuitest_coverline("build/wire-base/wire-base.js", 69);
this.on('tgtChange', function (e) {
         _yuitest_coverfunc("build/wire-base/wire-base.js", "(anonymous 3)", 69);
_yuitest_coverline("build/wire-base/wire-base.js", 70);
this.set('tgtDir', e.newVal.get('dir') );
      }, this);
      
   },
   
   
   /**
    * call removeWire on WiringsDelegate
    * @method destroy
    */
   destroy: function () {
      
      _yuitest_coverfunc("build/wire-base/wire-base.js", "destroy", 80);
_yuitest_coverline("build/wire-base/wire-base.js", 82);
Y.WireBase.superclass.destroy.apply(this, arguments);
      
      _yuitest_coverline("build/wire-base/wire-base.js", 84);
var src = this.get('src'), tgt = this.get('tgt');
      
      _yuitest_coverline("build/wire-base/wire-base.js", 86);
if(src && Y.Lang.isFunction (src.removeWire) ) {
         _yuitest_coverline("build/wire-base/wire-base.js", 87);
src.removeWire(this);
      }
      _yuitest_coverline("build/wire-base/wire-base.js", 89);
if(tgt && Y.Lang.isFunction (tgt.removeWire) ) {
         _yuitest_coverline("build/wire-base/wire-base.js", 90);
tgt.removeWire(this);
      }
   },
   
   /**
    * Drawing method. Meant to be overriden by a plugin
    * @method _draw
    * @private
    */
   _draw: function () {
      //throw new Error("Y.Wire has no draw method. Consider using a plugin such as 'bezier-wire' in your YUI.use statement");
   },
   
   getOtherTerminal: function (term) {
      _yuitest_coverfunc("build/wire-base/wire-base.js", "getOtherTerminal", 103);
_yuitest_coverline("build/wire-base/wire-base.js", 104);
return (term == this.get('src')) ? this.get('tgt') : this.get('src');
   },
   
   // TODO:
   SERIALIZABLE_ATTRS: ["src","tgt"],
   toJSON: function () {
      _yuitest_coverfunc("build/wire-base/wire-base.js", "toJSON", 109);
_yuitest_coverline("build/wire-base/wire-base.js", 110);
return {};
   }
   
});


_yuitest_coverline("build/wire-base/wire-base.js", 116);
Y.WireBase.ATTRS = Y.merge(Y.Path.ATTRS, {
   
   /**
    * @attribute src
    */
   src: {
      value: null,
      setter: function (val) {
         //console.log("src setter", val, this);
         
         // remove this wire from the list of the previous src/tgt item
         // TODO: prev value
         /*if(e.prevVal && Y.Lang.isFunction (e.prevVal.removeWire) ) {
            e.prevVal.removeWire(this);
         }*/
         
         _yuitest_coverfunc("build/wire-base/wire-base.js", "setter", 123);
_yuitest_coverline("build/wire-base/wire-base.js", 132);
if(val && Y.Lang.isFunction (val.addWire) ) {
            _yuitest_coverline("build/wire-base/wire-base.js", 133);
val.addWire(this);
         }
         
         _yuitest_coverline("build/wire-base/wire-base.js", 136);
return val;
      }
   },
   
   /**
    * @attribute tgt
    */
   tgt: {
      value: null,
      setter: function (val) {
         //console.log("tgt setter", val, this);
         
         
         // remove this wire from the list of the previous src/tgt item
         // TODO: prev value
         /*if(e.prevVal && Y.Lang.isFunction (e.prevVal.removeWire) ) {
            e.prevVal.removeWire(this);
         }*/
         
         
         _yuitest_coverfunc("build/wire-base/wire-base.js", "setter", 145);
_yuitest_coverline("build/wire-base/wire-base.js", 156);
if(val && Y.Lang.isFunction (val.addWire) ) {
            _yuitest_coverline("build/wire-base/wire-base.js", 157);
val.addWire(this);
         }
         
         _yuitest_coverline("build/wire-base/wire-base.js", 160);
return val;
      }
   },
   
   /**
    * 
    * @attribute srcDir
    * @type Array
    * @default [1,0]
    */ 
   srcDir: {
      validator: Y.Lang.isArray,
      value: [1,0]
      // TODO: normalize ?
   },
   
   /**
    * TODO: normalize ?
    * @attribute tgtDir
    * @type Array
    * @default -srcDir
    */
   tgtDir: {
      validator: Y.Lang.isArray,
      valueFn: function () {
         _yuitest_coverfunc("build/wire-base/wire-base.js", "valueFn", 184);
_yuitest_coverline("build/wire-base/wire-base.js", 185);
var d = this.get('srcDir');
         _yuitest_coverline("build/wire-base/wire-base.js", 186);
return [-d[0],-d[1]];
      }
      // TODO: normalize ?
   }
   
});


}, '@VERSION@', {"requires": ["graphics"], "skinnable": true});
