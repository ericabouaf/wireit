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
_yuitest_coverage["build/terminal-output/terminal-output.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/terminal-output/terminal-output.js",
    code: []
};
_yuitest_coverage["build/terminal-output/terminal-output.js"].code=["YUI.add('terminal-output', function (Y, NAME) {","","/**"," * @module terminal-output"," */","","/**"," * Class that extends Terminal to differenciate Input/Output terminals"," * @class TerminalOutput"," * @extends Terminal"," * @constructor"," * @param {HTMLElement} parentEl Parent dom element"," * @param {Object} options configuration object"," * @param {Container} container (Optional) Container containing this terminal"," */","Y.TerminalOutput = function (parentEl, options, container) {","   Y.TerminalOutput.superclass.constructor.call(this,parentEl, options, container);","};","Y.extend(Y.TerminalOutput, Y.Terminal, {","   ","   /**","    * @attribute direction","    * @description direction vector of the wires when connected to this terminal","    * @type Array","    * @default [0,1]","    */","   direction: [0,1],","   ","   /**","    * @attribute fakeDirection","    * @description direction vector of the \"editing\" wire when it started from this terminal","    * @type Array","    * @default [0,-1]","    */","   fakeDirection: [0,-1],","   ","   /**","    * @attribute ddConfig","    * @description configuration of the Y.TerminalProxy object","    * @type Object","    * @default  { type: \"output\", allowedTypes: [\"input\"] }   ","    */","   ddConfig: { type: \"output\", allowedTypes: [\"input\"] }   ,","   ","   /**","    * @attribute alwaysSrc","    * @description forces this terminal to be the src terminal in the wire config","    * @type Boolean","    * @default true","    */","   alwaysSrc: true","   ","});","","","}, '@VERSION@', {\"requires\": [\"terminal\"]});"];
_yuitest_coverage["build/terminal-output/terminal-output.js"].lines = {"1":0,"16":0,"17":0,"19":0};
_yuitest_coverage["build/terminal-output/terminal-output.js"].functions = {"TerminalOutput:16":0,"(anonymous 1):1":0};
_yuitest_coverage["build/terminal-output/terminal-output.js"].coveredLines = 4;
_yuitest_coverage["build/terminal-output/terminal-output.js"].coveredFunctions = 2;
_yuitest_coverline("build/terminal-output/terminal-output.js", 1);
YUI.add('terminal-output', function (Y, NAME) {

/**
 * @module terminal-output
 */

/**
 * Class that extends Terminal to differenciate Input/Output terminals
 * @class TerminalOutput
 * @extends Terminal
 * @constructor
 * @param {HTMLElement} parentEl Parent dom element
 * @param {Object} options configuration object
 * @param {Container} container (Optional) Container containing this terminal
 */
_yuitest_coverfunc("build/terminal-output/terminal-output.js", "(anonymous 1)", 1);
_yuitest_coverline("build/terminal-output/terminal-output.js", 16);
Y.TerminalOutput = function (parentEl, options, container) {
   _yuitest_coverfunc("build/terminal-output/terminal-output.js", "TerminalOutput", 16);
_yuitest_coverline("build/terminal-output/terminal-output.js", 17);
Y.TerminalOutput.superclass.constructor.call(this,parentEl, options, container);
};
_yuitest_coverline("build/terminal-output/terminal-output.js", 19);
Y.extend(Y.TerminalOutput, Y.Terminal, {
   
   /**
    * @attribute direction
    * @description direction vector of the wires when connected to this terminal
    * @type Array
    * @default [0,1]
    */
   direction: [0,1],
   
   /**
    * @attribute fakeDirection
    * @description direction vector of the "editing" wire when it started from this terminal
    * @type Array
    * @default [0,-1]
    */
   fakeDirection: [0,-1],
   
   /**
    * @attribute ddConfig
    * @description configuration of the Y.TerminalProxy object
    * @type Object
    * @default  { type: "output", allowedTypes: ["input"] }   
    */
   ddConfig: { type: "output", allowedTypes: ["input"] }   ,
   
   /**
    * @attribute alwaysSrc
    * @description forces this terminal to be the src terminal in the wire config
    * @type Boolean
    * @default true
    */
   alwaysSrc: true
   
});


}, '@VERSION@', {"requires": ["terminal"]});
