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
_yuitest_coverage["build/layer/layer.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/layer/layer.js",
    code: []
};
_yuitest_coverage["build/layer/layer.js"].code=["YUI.add('layer', function (Y, NAME) {","","/**"," * @module layer"," */","","/**"," * Layer : Widget to manage collections of wires (through WiresDelegate) and containers (trough WidgetParent)"," * @class Layer"," * @extends Widget"," * @uses WidgetParent"," * @uses WiresDelegate"," */","Y.Layer = Y.Base.create(\"layer\", Y.Widget, [Y.WidgetParent, Y.WiresDelegate], {","   ","   initializer: function () {","      ","      this.graphic = new Y.Graphic({render: this.get('contentBox') }); ","      ","   },","   ","   ","   /**","    * Alias method for WidgetParent.removeAll","    * @method clear","    */","   clear: function () {","      this.removeAll();","   }","   ","}, {","   ","   ATTRS: {","      ","      defaultChildType: {","         value: 'Container'","      }","      ","   }","   ","});","","","","}, '@VERSION@', {\"requires\": [\"widget-parent\", \"container\", \"wires-delegate\"], \"skinnable\": \"true\"});"];
_yuitest_coverage["build/layer/layer.js"].lines = {"1":0,"14":0,"18":0,"28":0};
_yuitest_coverage["build/layer/layer.js"].functions = {"initializer:16":0,"clear:27":0,"(anonymous 1):1":0};
_yuitest_coverage["build/layer/layer.js"].coveredLines = 4;
_yuitest_coverage["build/layer/layer.js"].coveredFunctions = 3;
_yuitest_coverline("build/layer/layer.js", 1);
YUI.add('layer', function (Y, NAME) {

/**
 * @module layer
 */

/**
 * Layer : Widget to manage collections of wires (through WiresDelegate) and containers (trough WidgetParent)
 * @class Layer
 * @extends Widget
 * @uses WidgetParent
 * @uses WiresDelegate
 */
_yuitest_coverfunc("build/layer/layer.js", "(anonymous 1)", 1);
_yuitest_coverline("build/layer/layer.js", 14);
Y.Layer = Y.Base.create("layer", Y.Widget, [Y.WidgetParent, Y.WiresDelegate], {
   
   initializer: function () {
      
      _yuitest_coverfunc("build/layer/layer.js", "initializer", 16);
_yuitest_coverline("build/layer/layer.js", 18);
this.graphic = new Y.Graphic({render: this.get('contentBox') }); 
      
   },
   
   
   /**
    * Alias method for WidgetParent.removeAll
    * @method clear
    */
   clear: function () {
      _yuitest_coverfunc("build/layer/layer.js", "clear", 27);
_yuitest_coverline("build/layer/layer.js", 28);
this.removeAll();
   }
   
}, {
   
   ATTRS: {
      
      defaultChildType: {
         value: 'Container'
      }
      
   }
   
});



}, '@VERSION@', {"requires": ["widget-parent", "container", "wires-delegate"], "skinnable": "true"});
