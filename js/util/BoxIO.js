/**
 * @fileoverview Contains an helpful classe to create Input/Output boxes
 *
 *  TODO: add a Prevent Loop ?
 *        -config is weird beacause we don't pass the data...
 */
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
         var term = new WireIt.util.TerminalInput(this.el, terminals.inputs[i]);
         this.terminals[this.terminals.length] = term;
         WireIt.sn(term.el, null, {position: "absolute", top: "-15px", left: (inputsIntervall*(i+1))-15+"px"});
      }
   }
   if(terminals.outputs) {
      var outputsIntervall = Math.floor(width/(terminals.outputs.length+1));
      for(var i = 0 ; i < terminals.outputs.length ; i++) {
         var term = new WireIt.util.TerminalOutput(this.el, terminals.outputs[i]);
         this.terminals[this.terminals.length] = term;
         WireIt.sn(term.el, null, {position: "absolute", bottom: "-15px", left: (outputsIntervall*(i+1))-15+"px"});
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

