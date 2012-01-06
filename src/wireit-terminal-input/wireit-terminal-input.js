/*global YUI */
YUI.add("wireit-terminal-input", function(Y){

/**
 * Class that extends Terminal to differenciate Input/Output terminals
 * @class Y.WireIt.TerminalInput
 * @extends Y.WireIt.Terminal
 * @constructor
 * @param {HTMLElement} parentEl Parent dom element
 * @param {Object} options configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
Y.WireIt.TerminalInput = function(parentEl, options, container) {
   Y.WireIt.TerminalInput.superclass.constructor.call(this,parentEl, options, container);
};
Y.extend(Y.WireIt.TerminalInput, Y.WireIt.Terminal, {

	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.TerminalInput"
    * @type String
    */
   xtype: "Y.WireIt.TerminalInput",

	/**
    * @property direction
	 * @description direction vector of the wires when connected to this terminal
    * @type Array
    * @default [0,-1]
    */
	direction: [0,-1],
	
	/**
    * @property fakeDirection
	 * @description direction vector of the "editing" wire when it started from this terminal
    * @type Array
    * @default [0,1]
    */
	fakeDirection: [0,1],
   
	/**
    * @property nMaxWires
	 * @description maximum number of wires for this terminal
    * @type Integer
    * @default 1
    */
	nMaxWires: 1,
	
	/**
    * @property ddConfig
	 * @description configuration of the Y.WireIt.TerminalProxy object
    * @type Object
    * @default { type: "input", allowedTypes: ["output"] }
    */
	ddConfig: { type: "input", allowedTypes: ["output"] }

});

}, '0.7.0',{
  requires: ['wireit-terminal']
});
