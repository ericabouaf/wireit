/**
 * Container class used by the "jsBox" module (automatically sets terminals depending on the number of arguments)
 * @class Container
 * @namespace jsBox
 * @constructor
 */
sawire.jsRunner = function(options, layer) {
         
   sawire.jsRunner.superclass.constructor.call(this, options, layer);
   this.buildTextArea(options.codeText || "function(in1, in2) {\n\n  return 0;\n}");
   
   this.createTerminals();
   
   // Reposition the terminals when the jsBox is being resized
   this.ddResize.on('eventResize', function(e, args) {
      this.positionTerminals();
      var txarea = Y.one(this.textarea);
      txarea.setStyle("height", (this.bodyEl.clientHeight-20)+"px");
      txarea.setStyle("width", (this.bodyEl.clientWidth-20)+"px");
   }, this, true);
};

Y.extend(sawire.jsRunner, Y.Container, {
   
   /**
    * Create the textarea for the javascript code
    * @method buildTextArea
    * @param {String} codeText
    */
   buildTextArea: function(codeText) {

      this.textarea = Y.WireIt.cn('textarea', null, {width: (this.bodyEl.clientWidth-20)+"px", height: (this.bodyEl.clientHeight-20)+"px", resize: "none", border: "0", padding: "5px"}, codeText);
      this.setBody(this.textarea);

      Y.one(this.textarea).on('change', this.createTerminals, this, true);
      
   },
   
   /**
    * Create (and re-create) the terminals with this.nParams input terminals
    * @method createTerminals
    */
   createTerminals: function() {
      
      // Output Terminal
      if(!this.outputTerminal) {
        this.outputTerminal = this.addTerminal({xtype: "Y.TerminalOutput", "name": "out"});
        this.outputTerminal.jsBox = this;
      }
      
      // Input terminals :
      var match = (this.textarea.value).match((/^[ ]*function[ ]*\((.*)\)[ ]*\{/));
      var sParamList = match ? match[1] : "";
      var params = sParamList.split(',');
      var nParams = (sParamList=="") ? 0 : params.length;
      
      var curTerminalN = this.nParams || 0;
      if(curTerminalN < nParams) {
         // add terminals
         for(var i = curTerminalN ; i < nParams ; i++) {
            var term = this.addTerminal({xtype: "Y.TerminalInput", "name": "param"+i});
            //term.jsBox = this;
            Y.WireIt.sn(term.el, null, {position: "absolute", top: "-15px"});
         }
      }
      else if (curTerminalN > nParams) {
         // remove terminals
         for(var i = this.terminals.length-(curTerminalN-nParams) ; i < this.terminals.length ; i++) {
         	this.terminals[i].remove();
         	this.terminals[i] = null;
         }
         this.terminals = Y.WireIt.compact(this.terminals);
      }
      this.nParams = nParams;
   
      this.positionTerminals();

      // Declare the new terminals to the drag'n drop handler (so the wires are moved around with the container)
      this.dd.setTerminals(this.terminals);
   },
   
   /**
    * Reposition the terminals
    * @method positionTerminals
    */
   positionTerminals: function() {
      var width = Y.WireIt.getIntStyle(this.el, "width");

      var inputsIntervall = Math.floor(width/(this.nParams+1));

      for(var i = 1 ; i < this.terminals.length ; i++) {
         var term = this.terminals[i];
         Y.one(term.el).setStyle("left", (inputsIntervall*(i))-15+"px" );
         for(var j = 0 ; j < term.wires.length ; j++) {
            term.wires[j].redraw();
         }
      }
      
      // Output terminal
      Y.WireIt.sn(this.outputTerminal.el, null, {position: "absolute", bottom: "-15px", left: (Math.floor(width/2)-15)+"px"});
      for(var j = 0 ; j < this.outputTerminal.wires.length ; j++) {
         this.outputTerminal.wires[j].redraw();
      }
   },
   
   /**
    * Extend the getConfig to add the "codeText" property
    * @method getConfig
    */
   getConfig: function() {
      var obj = sawire.jsRunner.superclass.getConfig.call(this);
      obj.codeText = this.textarea.value;
      return obj;
   }
   
});
