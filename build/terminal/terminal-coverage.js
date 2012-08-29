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
_yuitest_coverage["build/terminal/terminal.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/terminal/terminal.js",
    code: []
};
_yuitest_coverage["build/terminal/terminal.js"].code=["YUI.add('terminal', function (Y, NAME) {","","/**"," * @module terminal"," */","","    'use strict';","","/**"," * Terminal is responsible for wire edition"," * "," * @class Terminal"," * @extends TerminalBase"," * @uses TerminalDragEdit"," * @uses TerminalScissors"," * @uses TerminalDDGroups"," * @constructor"," * @param {Object} oConfigs The user configuration for the instance."," */","    Y.Terminal = Y.Base.create(\"terminal\", Y.TerminalBase, [Y.TerminalDragEdit, Y.TerminalScissors, Y.TerminalDDGroups]);","","","","","}, '@VERSION@', {\"requires\": [\"terminal-base\", \"terminal-dragedit\", \"terminal-scissors\", \"terminal-ddgroups\"], \"skinnable\": true});"];
_yuitest_coverage["build/terminal/terminal.js"].lines = {"1":0,"7":0,"20":0};
_yuitest_coverage["build/terminal/terminal.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/terminal/terminal.js"].coveredLines = 3;
_yuitest_coverage["build/terminal/terminal.js"].coveredFunctions = 1;
_yuitest_coverline("build/terminal/terminal.js", 1);
YUI.add('terminal', function (Y, NAME) {

/**
 * @module terminal
 */

    _yuitest_coverfunc("build/terminal/terminal.js", "(anonymous 1)", 1);
_yuitest_coverline("build/terminal/terminal.js", 7);
'use strict';

/**
 * Terminal is responsible for wire edition
 * 
 * @class Terminal
 * @extends TerminalBase
 * @uses TerminalDragEdit
 * @uses TerminalScissors
 * @uses TerminalDDGroups
 * @constructor
 * @param {Object} oConfigs The user configuration for the instance.
 */
    _yuitest_coverline("build/terminal/terminal.js", 20);
Y.Terminal = Y.Base.create("terminal", Y.TerminalBase, [Y.TerminalDragEdit, Y.TerminalScissors, Y.TerminalDDGroups]);




}, '@VERSION@', {"requires": ["terminal-base", "terminal-dragedit", "terminal-scissors", "terminal-ddgroups"], "skinnable": true});
