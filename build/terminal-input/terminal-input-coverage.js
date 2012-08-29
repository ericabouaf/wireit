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
_yuitest_coverage["build/terminal-input/terminal-input.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/terminal-input/terminal-input.js",
    code: []
};
_yuitest_coverage["build/terminal-input/terminal-input.js"].code=["YUI.add('terminal-input', function (Y, NAME) {","","/**"," * @module terminal-input"," */","","/**"," * Class that extends Terminal to differenciate Input/Output terminals"," * @class TerminalInput"," * @extends Terminal"," * @constructor"," * @param {HTMLElement} parentEl Parent dom element"," * @param {Object} options configuration object"," * @param {Container} container (Optional) Container containing this terminal"," */","Y.TerminalInput = function (parentEl, options, container) {","   Y.TerminalInput.superclass.constructor.call(this,parentEl, options, container);","};","Y.extend(Y.TerminalInput, Y.Terminal, {","   ","   /**","    * @attribute nMaxWires","    * @description maximum number of wires for this terminal","    * @type Integer","    * @default 1","    */","   nMaxWires: 1,","   ","   /**","    * @attribute ddConfig","    * @description configuration of the Y.TerminalProxy object","    * @type Object","    * @default { type: \"input\", allowedTypes: [\"output\"] }","    */","   ddConfig: { type: \"input\", allowedTypes: [\"output\"] }","});","","","","}, '@VERSION@', {\"requires\": [\"terminal\"]});"];
_yuitest_coverage["build/terminal-input/terminal-input.js"].lines = {"1":0,"16":0,"17":0,"19":0};
_yuitest_coverage["build/terminal-input/terminal-input.js"].functions = {"TerminalInput:16":0,"(anonymous 1):1":0};
_yuitest_coverage["build/terminal-input/terminal-input.js"].coveredLines = 4;
_yuitest_coverage["build/terminal-input/terminal-input.js"].coveredFunctions = 2;
_yuitest_coverline("build/terminal-input/terminal-input.js", 1);
YUI.add('terminal-input', function (Y, NAME) {

/**
 * @module terminal-input
 */

/**
 * Class that extends Terminal to differenciate Input/Output terminals
 * @class TerminalInput
 * @extends Terminal
 * @constructor
 * @param {HTMLElement} parentEl Parent dom element
 * @param {Object} options configuration object
 * @param {Container} container (Optional) Container containing this terminal
 */
_yuitest_coverfunc("build/terminal-input/terminal-input.js", "(anonymous 1)", 1);
_yuitest_coverline("build/terminal-input/terminal-input.js", 16);
Y.TerminalInput = function (parentEl, options, container) {
   _yuitest_coverfunc("build/terminal-input/terminal-input.js", "TerminalInput", 16);
_yuitest_coverline("build/terminal-input/terminal-input.js", 17);
Y.TerminalInput.superclass.constructor.call(this,parentEl, options, container);
};
_yuitest_coverline("build/terminal-input/terminal-input.js", 19);
Y.extend(Y.TerminalInput, Y.Terminal, {
   
   /**
    * @attribute nMaxWires
    * @description maximum number of wires for this terminal
    * @type Integer
    * @default 1
    */
   nMaxWires: 1,
   
   /**
    * @attribute ddConfig
    * @description configuration of the Y.TerminalProxy object
    * @type Object
    * @default { type: "input", allowedTypes: ["output"] }
    */
   ddConfig: { type: "input", allowedTypes: ["output"] }
});



}, '@VERSION@', {"requires": ["terminal"]});
