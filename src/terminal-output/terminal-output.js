YUI.add("terminal-output", function(Y){

/**
 * Class that extends Terminal to differenciate Input/Output terminals
 * @class Y.WireTerminalOutput
 * @extends Y.WireTerminal
 * @constructor
 * @param {HTMLElement} parentEl Parent dom element
 * @param {Object} options configuration object
 * @param {WireIt.Container} container (Optional) Container containing this terminal
 */
Y.WireTerminalOutput = function(parentEl, options, container) {
   Y.WireTerminalOutput.superclass.constructor.call(this,parentEl, options, container);
};
Y.extend(Y.WireTerminalOutput, Y.WireTerminal, {

	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.TerminalOutput"
    * @type String
    */
   xtype: "Y.WireTerminalOutput",

	/**
    * @property direction
	 * @description direction vector of the wires when connected to this terminal
    * @type Array
    * @default [0,1]
    */
	direction: [0,1],
	
	/**
    * @property fakeDirection
	 * @description direction vector of the "editing" wire when it started from this terminal
    * @type Array
    * @default [0,-1]
    */
	fakeDirection: [0,-1],
   
	/**
    * @property ddConfig
	 * @description configuration of the Y.WireTerminalProxy object
    * @type Object
    * @default  { type: "output", allowedTypes: ["input"] }   
    */
	ddConfig: { type: "output", allowedTypes: ["input"] }   ,
	
	/**
    * @property alwaysSrc
	 * @description forces this terminal to be the src terminal in the wire config
    * @type Boolean
    * @default true
    */
	alwaysSrc: true
   
});

}, '0.7.0',{
  requires: ['terminal']
});
