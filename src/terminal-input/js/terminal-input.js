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
Y.TerminalInput = function (parentEl, options, container) {
   Y.TerminalInput.superclass.constructor.call(this,parentEl, options, container);
};
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

