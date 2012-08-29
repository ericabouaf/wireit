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
_yuitest_coverage["build/container-base/container-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/container-base/container-base.js",
    code: []
};
_yuitest_coverage["build/container-base/container-base.js"].code=["YUI.add('container-base', function (Y, NAME) {","","/**"," * @module container-base"," */","","/**"," * ContainerBase is an Overlay (XY positioning)"," * It is a WidgetChild (belongs to Layer)"," * It is also a WidgetParent (has many terminals)"," * @class ContainerBase"," * @extends Overlay"," * @uses WidgetParent"," * @uses WidgetChild"," * @uses WiresDelegate"," * @constructor"," */","var ContainerBase = Y.Base.create('container-base', Y.Overlay, [Y.WidgetParent, Y.WidgetChild, Y.WiresDelegate], {","   ","   /**","    * @method renderUI","    */","   renderUI: function () {","      ","      // make the overlay draggable","      this.drag = new Y.DD.Drag({","         node: this.get('boundingBox'), ","         handles : [ this._findStdModSection(Y.WidgetStdMod.HEADER) ]","      });","      ","      this.drag.on('drag:drag', function () {","         this.redrawAllWires();","      }, this);","      ","      // Make the overlay resizable","      if(this.get('resizable')) {","         var contentBox = this.get('contentBox');","         var resize = new Y.Resize({ ","            node: contentBox,","            handles: 'br'","         });","         /*resize.plug(Y.Plugin.ResizeConstrained, {","            minWidth: 50,","            minHeight: 50,","            maxWidth: 300,","            maxHeight: 300","            //preserveRatio: true","          });*/","         // On resize, fillHeight, & align terminals & wires","         resize.on('resize:resize', function () {","            // TODO: fillHeight","            this._fillHeight();","            this.alignTerminals();","            this.redrawAllWires();","         }, this);","         ","         this.resize = resize;","      }","      ","      // TODO: this is awful ! But we need to wait for everything to render & position","      Y.later(200, this, function () {","         this.alignTerminals();","      });","      ","   },","   ","   /**","    * @method alignTerminals","    */","   alignTerminals: function () {","      var contentBox = this.get('contentBox');","      this.each(function (term) {","         if(term.get('align')) {","            term.align( term.get('alignNode') || contentBox, ['tl',term.get('align').points[1]]);","         }","      }, this);","   },","   ","   /**","    * @method syncUI","    */","   syncUI: function () {","      ","      // Align terminals","      var c = this;","      this.each(function (term) {","         if(term.get('align')) {   ","            term.align( c.get('contentBox') , ['tl',term.get('align').points[1]]);","         }","      });","      ","   },","   ","   SERIALIZABLE_ATTRS: ['x','y'],","   ","   toJSON: function () {","      var o = {}, a = this;","      Y.Array.each(this.SERIALIZABLE_ATTRS, function (attr) {","         o[attr] = a.get(attr);","      });","      ","      return o;","   },","   ","   /**","    * Get a terminal by name","    * @method getTerminal","    */","   getTerminal: function (name) {","      return Y.Array.find(this._items, function (item) {","         if(item.get('name') == name) {","            return true;","         }","      });","   },","   ","   destructor: function () {","","      this.drag.destroy();","      ","      if(this.resize) {","         this.resize.destroy();","      }","   }","","}, {","","   ATTRS: {","      ","      /**","       * @attribute defaultChildType","       */","      defaultChildType: {","         value: 'Terminal'","      },","      ","      /**","       * @attribute zIndex","       */","      zIndex: {","         value: 5","      },","      ","      /**","       * @attribute resizable","       */","      resizable: {","         value: true","      },","      ","      /**","       * @attribute fillHeight","       */","      fillHeight: {","         value: true","      },","      ","      x: {","         getter: function () {","            var left = this.get('boundingBox').getStyle('left');","            return parseInt(left.substr(0,left.length-2),10);","         }","      },","      ","      y: {","         getter: function () {","            var top = this.get('boundingBox').getStyle('top');","            return parseInt(top.substr(0,top.length-2),10);","         }","      },","      ","      preventSelfWiring: {","         value: true","      }","      ","   },","   ","   EIGHT_POINTS: [","      { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },","      { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },","      { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },","      { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },","      { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },","      { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },","      { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' },","      { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }","   ],","","   FOUR_CORNERS: [","      { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },","      { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },","      { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },","      { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }","   ],","","   FOUR_EDGES: [","      { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },","      { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },","      { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },","      { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' }","   ]","   ","});","","Y.ContainerBase = ContainerBase;","","","","}, '@VERSION@', {\"requires\": [\"overlay\", \"widget-parent\", \"widget-child\", \"dd\", \"resize\", \"terminal\", \"wires-delegate\"]});"];
_yuitest_coverage["build/container-base/container-base.js"].lines = {"1":0,"18":0,"26":0,"31":0,"32":0,"36":0,"37":0,"38":0,"50":0,"52":0,"53":0,"54":0,"57":0,"61":0,"62":0,"71":0,"72":0,"73":0,"74":0,"85":0,"86":0,"87":0,"88":0,"97":0,"98":0,"99":0,"102":0,"110":0,"111":0,"112":0,"119":0,"121":0,"122":0,"160":0,"161":0,"167":0,"168":0,"205":0};
_yuitest_coverage["build/container-base/container-base.js"].functions = {"(anonymous 2):31":0,"(anonymous 3):50":0,"(anonymous 4):61":0,"renderUI:23":0,"(anonymous 5):72":0,"alignTerminals:70":0,"(anonymous 6):86":0,"syncUI:82":0,"(anonymous 7):98":0,"toJSON:96":0,"(anonymous 8):110":0,"getTerminal:109":0,"destructor:117":0,"getter:159":0,"getter:166":0,"(anonymous 1):1":0};
_yuitest_coverage["build/container-base/container-base.js"].coveredLines = 38;
_yuitest_coverage["build/container-base/container-base.js"].coveredFunctions = 16;
_yuitest_coverline("build/container-base/container-base.js", 1);
YUI.add('container-base', function (Y, NAME) {

/**
 * @module container-base
 */

/**
 * ContainerBase is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class ContainerBase
 * @extends Overlay
 * @uses WidgetParent
 * @uses WidgetChild
 * @uses WiresDelegate
 * @constructor
 */
_yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/container-base/container-base.js", 18);
var ContainerBase = Y.Base.create('container-base', Y.Overlay, [Y.WidgetParent, Y.WidgetChild, Y.WiresDelegate], {
   
   /**
    * @method renderUI
    */
   renderUI: function () {
      
      // make the overlay draggable
      _yuitest_coverfunc("build/container-base/container-base.js", "renderUI", 23);
_yuitest_coverline("build/container-base/container-base.js", 26);
this.drag = new Y.DD.Drag({
         node: this.get('boundingBox'), 
         handles : [ this._findStdModSection(Y.WidgetStdMod.HEADER) ]
      });
      
      _yuitest_coverline("build/container-base/container-base.js", 31);
this.drag.on('drag:drag', function () {
         _yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 2)", 31);
_yuitest_coverline("build/container-base/container-base.js", 32);
this.redrawAllWires();
      }, this);
      
      // Make the overlay resizable
      _yuitest_coverline("build/container-base/container-base.js", 36);
if(this.get('resizable')) {
         _yuitest_coverline("build/container-base/container-base.js", 37);
var contentBox = this.get('contentBox');
         _yuitest_coverline("build/container-base/container-base.js", 38);
var resize = new Y.Resize({ 
            node: contentBox,
            handles: 'br'
         });
         /*resize.plug(Y.Plugin.ResizeConstrained, {
            minWidth: 50,
            minHeight: 50,
            maxWidth: 300,
            maxHeight: 300
            //preserveRatio: true
          });*/
         // On resize, fillHeight, & align terminals & wires
         _yuitest_coverline("build/container-base/container-base.js", 50);
resize.on('resize:resize', function () {
            // TODO: fillHeight
            _yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 3)", 50);
_yuitest_coverline("build/container-base/container-base.js", 52);
this._fillHeight();
            _yuitest_coverline("build/container-base/container-base.js", 53);
this.alignTerminals();
            _yuitest_coverline("build/container-base/container-base.js", 54);
this.redrawAllWires();
         }, this);
         
         _yuitest_coverline("build/container-base/container-base.js", 57);
this.resize = resize;
      }
      
      // TODO: this is awful ! But we need to wait for everything to render & position
      _yuitest_coverline("build/container-base/container-base.js", 61);
Y.later(200, this, function () {
         _yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 4)", 61);
_yuitest_coverline("build/container-base/container-base.js", 62);
this.alignTerminals();
      });
      
   },
   
   /**
    * @method alignTerminals
    */
   alignTerminals: function () {
      _yuitest_coverfunc("build/container-base/container-base.js", "alignTerminals", 70);
_yuitest_coverline("build/container-base/container-base.js", 71);
var contentBox = this.get('contentBox');
      _yuitest_coverline("build/container-base/container-base.js", 72);
this.each(function (term) {
         _yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 5)", 72);
_yuitest_coverline("build/container-base/container-base.js", 73);
if(term.get('align')) {
            _yuitest_coverline("build/container-base/container-base.js", 74);
term.align( term.get('alignNode') || contentBox, ['tl',term.get('align').points[1]]);
         }
      }, this);
   },
   
   /**
    * @method syncUI
    */
   syncUI: function () {
      
      // Align terminals
      _yuitest_coverfunc("build/container-base/container-base.js", "syncUI", 82);
_yuitest_coverline("build/container-base/container-base.js", 85);
var c = this;
      _yuitest_coverline("build/container-base/container-base.js", 86);
this.each(function (term) {
         _yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 6)", 86);
_yuitest_coverline("build/container-base/container-base.js", 87);
if(term.get('align')) {   
            _yuitest_coverline("build/container-base/container-base.js", 88);
term.align( c.get('contentBox') , ['tl',term.get('align').points[1]]);
         }
      });
      
   },
   
   SERIALIZABLE_ATTRS: ['x','y'],
   
   toJSON: function () {
      _yuitest_coverfunc("build/container-base/container-base.js", "toJSON", 96);
_yuitest_coverline("build/container-base/container-base.js", 97);
var o = {}, a = this;
      _yuitest_coverline("build/container-base/container-base.js", 98);
Y.Array.each(this.SERIALIZABLE_ATTRS, function (attr) {
         _yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 7)", 98);
_yuitest_coverline("build/container-base/container-base.js", 99);
o[attr] = a.get(attr);
      });
      
      _yuitest_coverline("build/container-base/container-base.js", 102);
return o;
   },
   
   /**
    * Get a terminal by name
    * @method getTerminal
    */
   getTerminal: function (name) {
      _yuitest_coverfunc("build/container-base/container-base.js", "getTerminal", 109);
_yuitest_coverline("build/container-base/container-base.js", 110);
return Y.Array.find(this._items, function (item) {
         _yuitest_coverfunc("build/container-base/container-base.js", "(anonymous 8)", 110);
_yuitest_coverline("build/container-base/container-base.js", 111);
if(item.get('name') == name) {
            _yuitest_coverline("build/container-base/container-base.js", 112);
return true;
         }
      });
   },
   
   destructor: function () {

      _yuitest_coverfunc("build/container-base/container-base.js", "destructor", 117);
_yuitest_coverline("build/container-base/container-base.js", 119);
this.drag.destroy();
      
      _yuitest_coverline("build/container-base/container-base.js", 121);
if(this.resize) {
         _yuitest_coverline("build/container-base/container-base.js", 122);
this.resize.destroy();
      }
   }

}, {

   ATTRS: {
      
      /**
       * @attribute defaultChildType
       */
      defaultChildType: {
         value: 'Terminal'
      },
      
      /**
       * @attribute zIndex
       */
      zIndex: {
         value: 5
      },
      
      /**
       * @attribute resizable
       */
      resizable: {
         value: true
      },
      
      /**
       * @attribute fillHeight
       */
      fillHeight: {
         value: true
      },
      
      x: {
         getter: function () {
            _yuitest_coverfunc("build/container-base/container-base.js", "getter", 159);
_yuitest_coverline("build/container-base/container-base.js", 160);
var left = this.get('boundingBox').getStyle('left');
            _yuitest_coverline("build/container-base/container-base.js", 161);
return parseInt(left.substr(0,left.length-2),10);
         }
      },
      
      y: {
         getter: function () {
            _yuitest_coverfunc("build/container-base/container-base.js", "getter", 166);
_yuitest_coverline("build/container-base/container-base.js", 167);
var top = this.get('boundingBox').getStyle('top');
            _yuitest_coverline("build/container-base/container-base.js", 168);
return parseInt(top.substr(0,top.length-2),10);
         }
      },
      
      preventSelfWiring: {
         value: true
      }
      
   },
   
   EIGHT_POINTS: [
      { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },
      { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },
      { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },
      { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },
      { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },
      { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },
      { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' },
      { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }
   ],

   FOUR_CORNERS: [
      { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },
      { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },
      { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },
      { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }
   ],

   FOUR_EDGES: [
      { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },
      { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },
      { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },
      { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' }
   ]
   
});

_yuitest_coverline("build/container-base/container-base.js", 205);
Y.ContainerBase = ContainerBase;



}, '@VERSION@', {"requires": ["overlay", "widget-parent", "widget-child", "dd", "resize", "terminal", "wires-delegate"]});
