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
Y.TerminalOutput = function (parentEl, options, container) {
   Y.TerminalOutput.superclass.constructor.call(this,parentEl, options, container);
};
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
