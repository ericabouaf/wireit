/**
 * jsBox
 */
var jsBox = {
   
   /**
    * @method init
    * @static
    */
   init: function() {
     
     
   	this.editor = new jsBox.WiringEditor({
		   languageName: "jsBox",
   		smdUrl: '../../backend/php/WiringEditor.smd',
   		propertiesFields: [
   			{"type": "string", inputParams: {"name": "name", label: "Title", wirable: false, typeInvite: "Enter a title" } },
   			{"type": "text", inputParams: {"name": "description", label: "Description", wirable: false, cols: 30} }
   		],
   		modules: [
   		   {
   		      "name": "jsBox",
   		      "container": {"xtype": "jsBox.Container"}
   		   },
   		   
   		   {
   		      "name": "comment",
   		      "container": {
   		         "xtype": "WireIt.FormContainer",
   		   		"title": "Comment",
   		   		"fields": [
   		            {"type": "text", "inputParams": {"label": "", "name": "comment", "wirable": false }}
   		         ]
   		      },
   		      "value": {
   		         "input": {
   		            "type":"url","inputParams":{}
   		         }
   		      }
   		   },
   		   
   		   {
   		      "name": "input",
   		      "container": {
   		         "xtype": "WireIt.FormContainer",
   		   		"title": "input",
   		   		"fields": [
   		   			{"type": "type", "inputParams": {"label": "Value", "name": "input", "wirable": false}}
   		   		],
   		   		"terminals": [
	      			   {"name": "out", "direction": [0,1], "offsetPosition": {"left": 86, "bottom": -15}, "ddConfig": {
                         "type": "output",
                         "allowedTypes": ["input"]
                      }
                     }
	      		   ]
   		      }
   		   },
   		   
   		   {
   		      "name": "output",
   		      "container": {
   		         "xtype": "WireIt.FormContainer",
   		   		"title": "output",
   		   		"fields": [ 
   		   			{"type": "string", "inputParams": {"label": "name", "name": "name", "wirable": false}}
   		   		],
      		   	"terminals": [
   	      		   {"name": "in", "direction": [0,-1], "offsetPosition": [82,-15], "ddConfig": {
                         "type": "input",
                         "allowedTypes": ["output"]
                      },
                      "nMaxWires": 1
                     }
   	      		]
   		      }
   		   }
   		]
   	});
 
     
   },
   
   
   /**
    * Static function to run the "program"
    * @method run
    * @static
    */
   run: function() {

      // Clear the previous results
      for(var i = 0; i < this.editor.layer.containers.length; i++) {
         this.editor.layer.containers[i].evalResult = null;
      }

      // Make a list of all the containers that may be run (no input params)
      var modules = [];
      for(var i = 0; i < this.editor.layer.containers.length; i++) {
         if( this.editor.layer.containers[i].mayEval() ) {
            modules.push( this.editor.layer.containers[i] );
         }
      }

      // Eval the "sources" modules 
      for(var i = 0 ; i < modules.length ; i++) {
         modules[i].execute();
      }

   }
   
};


// Init the jsBox editor with a default program
YAHOO.util.Event.onDOMReady( jsBox.init, jsBox, true);




/**
 * The wiring editor is overriden to add a button "RUN" to the control bar
 */
jsBox.WiringEditor = function(options) {
   jsBox.WiringEditor.superclass.constructor.call(this, options);
};

YAHOO.lang.extend(jsBox.WiringEditor, WireIt.WiringEditor, {
   
   renderButtons: function() {
      jsBox.WiringEditor.superclass.renderButtons.call(this);
      var toolbar = YAHOO.util.Dom.get('toolbar');
      var runButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
      runButton.on("click", jsBox.run, jsBox, true);
   }
   
});








/**
 * @class Container
 * @namespace jsBox
 * @constructor
 */
jsBox.Container = function(options, layer) {
         
   jsBox.Container.superclass.constructor.call(this, options, layer);
   
   this.buildTextArea(options.codeText || "function(e) {\n\n  return 0;\n}");
   
   this.createTerminals();
   
   // Reposition the terminals when the jsBox is being resized
   this.ddResize.eventResize.subscribe(function(e, args) {
      this.positionTerminals();
      YAHOO.util.Dom.setStyle(this.textarea, "height", (args[0][1]-30)+"px");
   }, this, true);
};

YAHOO.extend(jsBox.Container, WireIt.Container, {
   
   /**
    * Create the textarea for the javascript code
    * @method buildTextArea
    * @param {String} codeText
    */
   buildTextArea: function(codeText) {

      this.textarea = WireIt.cn('textarea', null, {width: "90%", height: "70px", border: "0", padding: "5px"}, codeText);
      this.setBody(this.textarea);

      YAHOO.util.Event.addListener(this.textarea, 'change', this.createTerminals, this, true);
      
   },
   
   /**
    * Create (and re-create) the terminals with this.nParams input terminals
    * @method createTerminals
    */
   createTerminals: function() {
      
      try {
      
      // Output Terminal
      if(!this.outputTerminal) {
   	   this.outputTerminal = this.addTerminal({xtype: "WireIt.util.TerminalOutput", "name": "out"});      
         this.outputTerminal.jsBox = this;
      }
      
      // Input terminals :
   	var sParamList = (this.textarea.value).match(/^[ ]*function[ ]*\((.*)\)[ ]*{/)[1];
      var params = sParamList.split(',');
      var nParams = (sParamList=="") ? 0 : params.length;
      
      var curTerminalN = this.nParams || 0;
      if(curTerminalN < nParams) {
         // add terminals
         for(var i = curTerminalN ; i < nParams ; i++) {
            var term = this.addTerminal({xtype: "WireIt.util.TerminalInput", "name": "param"+i});
            term.jsBox = this;
            WireIt.sn(term.el, null, {position: "absolute", top: "-15px"});
         }
      }
      else if (curTerminalN > nParams) {
         // remove terminals
         for(var i = nParams ; i < curTerminalN ; i++) {
         	this.terminals[i].remove();
         	this.terminals[i] = null;
         }
         this.terminals = WireIt.compact(this.terminals);
      }
      this.nParams = nParams;
   
      this.positionTerminals();

      // Declare the new terminals to the drag'n drop handler (so the wires are moved around with the container)
      this.dd.setTerminals(this.terminals);
      
      } catch(ex) {
         console.log(ex);
      }
   },
   
   /**
    * Reposition the terminals
    * @method positionTerminals
    */
   positionTerminals: function() {
      var width = WireIt.getIntStyle(this.el, "width");

      var inputsIntervall = Math.floor(width/(this.nParams+1));

      for(var i = 1 ; i < this.terminals.length ; i++) {
         var term = this.terminals[i];
         YAHOO.util.Dom.setStyle(term.el, "left", (inputsIntervall*(i))-15+"px" );
         for(var j = 0 ; j < term.wires.length ; j++) {
            term.wires[j].redraw();
         }
      }
      
      // Output terminal
      WireIt.sn(this.outputTerminal.el, null, {position: "absolute", bottom: "-15px", left: (Math.floor(width/2)-15)+"px"});
      for(var j = 0 ; j < this.outputTerminal.wires.length ; j++) {
         this.outputTerminal.wires[j].redraw();
      }
   },
   
   /**
    * Execute the module
    * @method execute
    */
   execute: function() {

      // Eval each of the parameter functions : 
      var params = [];
      for(var i = 1 ; i < this.terminals.length ; i++) {
         var term = this.terminals[i];
         var otherTerm = term.wires[0].getOtherTerminal(term);
         if(!otherTerm.jsBox.evalResult)
            otherTerm.jsBox.execute();
         params[i] = otherTerm.jsBox.evalResult;
      }
      var code = "var tempJsBoxFunction = ("+this.textarea.value+")";
      eval(code);
      this.evalResult = tempJsBoxFunction.apply(window, params);
   },
   
   /**
    * Returns true if all the input wires have been evaluated, false otherwise
    * @method mayEval
    */
   mayEval: function() {
      // For each input param :
      for(var i = 1 ; i < this.terminals.length ; i++) {
         var term = this.terminals[i];
         if(term.wires.length != 1) return false;
         var otherTerm = term.wires[0].getOtherTerminal(term);
         if(!otherTerm.jsBox) return false;
         if( !otherTerm.jsBox.mayEval() ) return false;
      }
      return true;
   },
   
   /**
    * Extend the getConfig to add the "codeText" property
    * @method getConfig
    */
   getConfig: function() {
      var obj = jsBox.Container.superclass.getConfig.call(this);
      obj.codeText = this.textarea.value;
      return obj;
   }
   
});

