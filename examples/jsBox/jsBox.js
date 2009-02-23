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
   		   			{"type": "type", "inputParams": {"label": "Value", "name": "input", "wirable": false, "value": { "type":"string","inputParams":{"typeInvite": "input name"}} }}
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

      try {

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
         
         console.log("module may eval", modules);

         // Eval the "sources" modules 
         for(var i = 0 ; i < modules.length ; i++) {
            modules[i].execute();
         }
         
      }
      catch(ex) {
         console.log("Error while running: ", ex);
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
 * Running methods for "input" modules
 */
WireIt.Container.prototype.execute = function() {
   
   //console.log("execute", this.options.title);
   
   var term;
   
   if(this.options.title == "input") {
      
      this.evalResult = this.form.inputsNames.input.fieldValue.getValue();
   
      // Execute the linked output wires
      var term = this.terminals[0];
   
      
   }
   else if(this.options.title == "jsBox") {
      
      // Eval each of the parameter functions : 
      var params = [];
      for(var i = 1 ; i < this.terminals.length ; i++) {
         var inputTerm = this.terminals[i];
         var otherTerm = inputTerm.wires[0].getOtherTerminal(inputTerm);
         if(!otherTerm.container.evalResult) {
            otherTerm.container.execute();
         }
         params[i-1] = otherTerm.container.evalResult;
      }
      var code = "var tempJsBoxFunction = ("+this.textarea.value+")";
      eval(code);
      this.evalResult = tempJsBoxFunction.apply(window, params);
      
      term = this.terminals[0];
   }
   
   // Execute the modules linked to the ouput
   for(var i = 0 ; i < term.wires.length ; i++) {
      var wire = term.wires[i];
      var container = wire.getOtherTerminal(term).container;
      if( container.mayEval() ) {
         container.execute();
      }
   }
   
};

WireIt.Container.prototype.mayEval = function() {
   
   //console.log("mayEval", this.options.title);
      
   if(this.options.title == "input") {
      return true;
   }
   else if(this.options.title == "jsBox") {
      
       // For each input param :
      for(var i = 1 ; i < this.terminals.length ; i++) {
         var term = this.terminals[i];
         if(term.wires.length != 1) return false;
         var otherTerm = term.wires[0].getOtherTerminal(term);
         if(!otherTerm.container) return false;
         if( otherTerm.container.evalResult == null) return false;
      }
      return true;
      
   }
   return false;
};


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
            //term.jsBox = this;
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
    * Extend the getConfig to add the "codeText" property
    * @method getConfig
    */
   getConfig: function() {
      var obj = jsBox.Container.superclass.getConfig.call(this);
      obj.codeText = this.textarea.value;
      return obj;
   }
   
});

