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
_yuitest_coverage["build/terminal-ddgroups/terminal-ddgroups.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/terminal-ddgroups/terminal-ddgroups.js",
    code: []
};
_yuitest_coverage["build/terminal-ddgroups/terminal-ddgroups.js"].code=["YUI.add('terminal-ddgroups', function (Y, NAME) {","","/**"," * @module terminal-ddgroups"," */","","/**"," * Extension to add \"groups\" labels when hovering the terminal"," * @class TerminalDDGroups"," * @constructor"," * @param {Object} config configuration object"," */","Y.TerminalDDGroups = function (config) {","   Y.after(this._renderUIgroups, this, \"renderUI\");","};","","Y.TerminalDDGroups.ATTRS = {","   ","   /**","    * drag/drop groups : list of supported terminal types","    * only used if editable is set to true","    * @attribute groups","    */","   groups: {","      value: ['terminal']","   },","   ","   showGroups: {","      value: true","   }","   ","};","","Y.TerminalDDGroups.prototype = {","   ","   _renderUIgroups: function () {","      if( this.get('editable') ) {","         this._renderTooltip();","      }","   },","   ","   /**","    * create a persisting tooltip with the scissors class","    * listen for click events on the tooltip and call destroyWires","    * @method _renderTooltip","    */","   _renderTooltip: function () {","      ","      if(this.get('showGroups')) {","         ","         var ddGroupsOverlay = new Y.Overlay({","            render: this.get('boundingBox'),","            bodyContent: this.get('groups').join(',')","         });","         ddGroupsOverlay.set(\"align\", {node: this.get('contentBox'), ","                               points:[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]});","","         ddGroupsOverlay.get('contentBox').addClass( this.getClassName(\"dd-groups\") );","      }","      ","   }","   ","};","","","","}, '@VERSION@', {\"requires\": [\"terminal-dragedit\"]});"];
_yuitest_coverage["build/terminal-ddgroups/terminal-ddgroups.js"].lines = {"1":0,"13":0,"14":0,"17":0,"34":0,"37":0,"38":0,"49":0,"51":0,"55":0,"58":0};
_yuitest_coverage["build/terminal-ddgroups/terminal-ddgroups.js"].functions = {"TerminalDDGroups:13":0,"_renderUIgroups:36":0,"_renderTooltip:47":0,"(anonymous 1):1":0};
_yuitest_coverage["build/terminal-ddgroups/terminal-ddgroups.js"].coveredLines = 11;
_yuitest_coverage["build/terminal-ddgroups/terminal-ddgroups.js"].coveredFunctions = 4;
_yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 1);
YUI.add('terminal-ddgroups', function (Y, NAME) {

/**
 * @module terminal-ddgroups
 */

/**
 * Extension to add "groups" labels when hovering the terminal
 * @class TerminalDDGroups
 * @constructor
 * @param {Object} config configuration object
 */
_yuitest_coverfunc("build/terminal-ddgroups/terminal-ddgroups.js", "(anonymous 1)", 1);
_yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 13);
Y.TerminalDDGroups = function (config) {
   _yuitest_coverfunc("build/terminal-ddgroups/terminal-ddgroups.js", "TerminalDDGroups", 13);
_yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 14);
Y.after(this._renderUIgroups, this, "renderUI");
};

_yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 17);
Y.TerminalDDGroups.ATTRS = {
   
   /**
    * drag/drop groups : list of supported terminal types
    * only used if editable is set to true
    * @attribute groups
    */
   groups: {
      value: ['terminal']
   },
   
   showGroups: {
      value: true
   }
   
};

_yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 34);
Y.TerminalDDGroups.prototype = {
   
   _renderUIgroups: function () {
      _yuitest_coverfunc("build/terminal-ddgroups/terminal-ddgroups.js", "_renderUIgroups", 36);
_yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 37);
if( this.get('editable') ) {
         _yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 38);
this._renderTooltip();
      }
   },
   
   /**
    * create a persisting tooltip with the scissors class
    * listen for click events on the tooltip and call destroyWires
    * @method _renderTooltip
    */
   _renderTooltip: function () {
      
      _yuitest_coverfunc("build/terminal-ddgroups/terminal-ddgroups.js", "_renderTooltip", 47);
_yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 49);
if(this.get('showGroups')) {
         
         _yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 51);
var ddGroupsOverlay = new Y.Overlay({
            render: this.get('boundingBox'),
            bodyContent: this.get('groups').join(',')
         });
         _yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 55);
ddGroupsOverlay.set("align", {node: this.get('contentBox'), 
                               points:[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]});

         _yuitest_coverline("build/terminal-ddgroups/terminal-ddgroups.js", 58);
ddGroupsOverlay.get('contentBox').addClass( this.getClassName("dd-groups") );
      }
      
   }
   
};



}, '@VERSION@', {"requires": ["terminal-dragedit"]});
