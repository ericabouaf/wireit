/**
 * @fileoverview Contains 2 helpful classes to create Input/Output boxes
 */

 /**
  * Class that extends Terminal to differenciate Input/Output terminals
  * @class WireIt.util.TerminalIO
  * @extends WireIt.Terminal
  * @constructor
  * @param {DOMEl} parentEl Parent dom element
  */
WireIt.util.TerminalIO = function(parentEl, terminalConfig) {
   WireIt.util.TerminalIO.superclass.constructor.call(this,parentEl, terminalConfig);
   if (terminalConfig.type == "input") {
      this.terminalConfig.direction = [0,-1];
      this.terminalConfig.fakeDirection = [0,1];
   }
   else if (terminalConfig.type == "output") {
      this.terminalConfig.direction = [0,1];
      this.terminalConfig.fakeDirection = [0,-1];
   }
};
YAHOO.extend(WireIt.util.TerminalIO, WireIt.Terminal);
/**
 * Override WireIt.Terminal.prototype.isValidWireTerminal to connect only to other types of terminal
 * @param {Object} terminal Terminal to check
 * @returns {Boolean} True if this terminal and the argument terminal can be wired together.
 */
WireIt.util.TerminalIO.prototype.isValidWireTerminal = function(terminal) {
   return terminal.isWireItTerminal && terminal.terminalConfig.type != this.terminalConfig.type;
};


/**
 * Box that contains input and output terminals
 * @class WireIt.util.BoxIO
 * @constructor
 * @param {String} id Id of the created DIV element
 * @param {Object} terminals {inputs: [...], outputs: [...] } Object that contains 2 list of TerminalsIO configs
 */
WireIt.util.BoxIO = function(id, terminals) {
   
   /**
    * Id of the created DIV element
    */
   this.id = id;
   
   this.render();
   
   // Calculate the width
   var widthStr = YAHOO.util.Dom.getStyle(this.el, 'width');
   var width = parseInt( widthStr.substr(0,widthStr.length-2), 10);
   
   /**
    * List of all the associated terminals
    */
   this.terminals = [];
   if(terminals.inputs) {
      var inputsIntervall = Math.floor(width/(terminals.inputs.length+1));
      for(var i = 0 ; i < terminals.inputs.length ; i++) {
         var term = new WireIt.util.TerminalIO(this.el, terminals.inputs[i]);
         this.terminals[this.terminals.length] = term;
         WireIt.sn(term.terminalEl, null, {position: "absolute", top: "-9px", left: (inputsIntervall*(i+1))-8+"px"});
      }
   }
   if(terminals.outputs) {
      var outputsIntervall = Math.floor(width/(terminals.outputs.length+1));
      for(var i = 0 ; i < terminals.outputs.length ; i++) {
         var term = new WireIt.util.TerminalIO(this.el, terminals.outputs[i]);
         this.terminals[this.terminals.length] = term;
         WireIt.sn(term.terminalEl, null, {position: "absolute", bottom: "-9px", left: (outputsIntervall*(i+1))-8+"px"});
      }
   }
   
	new WireIt.util.DD(this.terminals,this.el);
	
};

/**
 * Render the BoxIO
 */
WireIt.util.BoxIO.prototype.render = function() {
   
   /**
    * Reference to the created DIV element
    */
	this.el = WireIt.cn('div', {id: this.id, className: "WireIt-BoxIO"});
	document.body.appendChild(this.el);
	
};

