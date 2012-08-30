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
_yuitest_coverage["build/widget-icons/widget-icons.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-icons/widget-icons.js",
    code: []
};
_yuitest_coverage["build/widget-icons/widget-icons.js"].code=["YUI.add('widget-icons', function (Y, NAME) {","","/**"," * @module widget-icons"," */","","/**"," * @class WidgetIcons"," * @constructor"," * @param {Object} config configuration object"," */","Y.WidgetIcons = function (config) {","","   Y.after(this._renderUIicons, this, \"renderUI\");","   ","};","","Y.WidgetIcons.ATTRS = {","   ","   /**","    * Set of icons","    * @attribute icons","    */","   icons: {","      value: []","   }","   ","};","","Y.WidgetIcons.prototype = {","   ","   _renderUIicons: function () {","      ","      var p = this.get('contentBox'),","          that= this;","          ","      Y.Array.each( this.get('icons'), function (icon) {","         var i = Y.Node.create('<span class=\"'+that.getClassName('icon')+' '+icon.className+'\" title=\"'+icon.title+'\"></span>');","         i.on('click', Y.bind(that[icon.click], that) );","         i.appendTo( p );","         //p.insertBefore(i, p.get('children').item(0) );","      });","      ","   }","   ","};","","","","}, '@VERSION@', {\"requires\": [], \"skinnable\": true});"];
_yuitest_coverage["build/widget-icons/widget-icons.js"].lines = {"1":0,"12":0,"14":0,"18":0,"30":0,"34":0,"37":0,"38":0,"39":0,"40":0};
_yuitest_coverage["build/widget-icons/widget-icons.js"].functions = {"WidgetIcons:12":0,"(anonymous 2):37":0,"_renderUIicons:32":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-icons/widget-icons.js"].coveredLines = 10;
_yuitest_coverage["build/widget-icons/widget-icons.js"].coveredFunctions = 4;
_yuitest_coverline("build/widget-icons/widget-icons.js", 1);
YUI.add('widget-icons', function (Y, NAME) {

/**
 * @module widget-icons
 */

/**
 * @class WidgetIcons
 * @constructor
 * @param {Object} config configuration object
 */
_yuitest_coverfunc("build/widget-icons/widget-icons.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-icons/widget-icons.js", 12);
Y.WidgetIcons = function (config) {

   _yuitest_coverfunc("build/widget-icons/widget-icons.js", "WidgetIcons", 12);
_yuitest_coverline("build/widget-icons/widget-icons.js", 14);
Y.after(this._renderUIicons, this, "renderUI");
   
};

_yuitest_coverline("build/widget-icons/widget-icons.js", 18);
Y.WidgetIcons.ATTRS = {
   
   /**
    * Set of icons
    * @attribute icons
    */
   icons: {
      value: []
   }
   
};

_yuitest_coverline("build/widget-icons/widget-icons.js", 30);
Y.WidgetIcons.prototype = {
   
   _renderUIicons: function () {
      
      _yuitest_coverfunc("build/widget-icons/widget-icons.js", "_renderUIicons", 32);
_yuitest_coverline("build/widget-icons/widget-icons.js", 34);
var p = this.get('contentBox'),
          that= this;
          
      _yuitest_coverline("build/widget-icons/widget-icons.js", 37);
Y.Array.each( this.get('icons'), function (icon) {
         _yuitest_coverfunc("build/widget-icons/widget-icons.js", "(anonymous 2)", 37);
_yuitest_coverline("build/widget-icons/widget-icons.js", 38);
var i = Y.Node.create('<span class="'+that.getClassName('icon')+' '+icon.className+'" title="'+icon.title+'"></span>');
         _yuitest_coverline("build/widget-icons/widget-icons.js", 39);
i.on('click', Y.bind(that[icon.click], that) );
         _yuitest_coverline("build/widget-icons/widget-icons.js", 40);
i.appendTo( p );
         //p.insertBefore(i, p.get('children').item(0) );
      });
      
   }
   
};



}, '@VERSION@', {"requires": [], "skinnable": true});
