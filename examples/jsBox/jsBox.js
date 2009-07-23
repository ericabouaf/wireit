/**
 * jsBox
 */
var jsBox = {
   
   language: {
	
	   languageName: "jsBox",
	
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
	      		   {"name": "in", "direction": [0,-1], "offsetPosition": {"left": 82, "top": -15 }, "ddConfig": {
                      "type": "input",
                      "allowedTypes": ["output"]
                   },
                   "nMaxWires": 1
                  }
	      		]
		      }
		   },
		   
		   {
		      "name": "callback",
		      "container": {
		         "xtype": "WireIt.Container",
		         "title": "Callback",
		         "terminals": [
		            {
		               "name": "callbackFunction",
		               "direction": [0,1], "offsetPosition": {"left": 56, "bottom": -15}, "ddConfig": {
                         "type": "output",
                         "allowedTypes": ["input"]
                      },
                      "wireConfig":{"color": "#EEEE11", "bordercolor":"#FFFF00"}
		            },
		             {
   		               "name": "output",
   		               "direction": [0,1], "offsetPosition": {"left": 126, "bottom": -15}, "ddConfig": {
                            "type": "output",
                            "allowedTypes": ["input"]
                         }
   		            }
		         ]
		      }
		   }
		]
	},
   
   /**
    * @method init
    * @static
    */
   init: function() {
   	this.editor = new jsBox.WiringEditor(this.language);

		// Open the infos panel
		editor.accordionView.openPanel(2);
   },
   
   /**
    * Execute the module in the "ExecutionFrame" virtual machine
    * @method run
    * @static
    */
   run: function() {
      var ef = new ExecutionFrame( this.editor.getValue() );
      ef.run();
   }
   
};


/**
 * The wiring editor is overriden to add a button "RUN" to the control bar
 */
jsBox.WiringEditor = function(options) {
   jsBox.WiringEditor.superclass.constructor.call(this, options);
};

YAHOO.lang.extend(jsBox.WiringEditor, WireIt.WiringEditor, {
   
   
   /**
    * Add the "run" button
    */
   renderButtons: function() {
      jsBox.WiringEditor.superclass.renderButtons.call(this);

		// Add the run button
      var toolbar = YAHOO.util.Dom.get('toolbar');
      var runButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
      runButton.on("click", jsBox.run, jsBox, true);
   },

	/**
	 * Customize the load success handler for the composed module list
	 */
	onLoadSuccess: function(wirings) {
		jsBox.WiringEditor.superclass.onLoadSuccess.call(this,wirings);
	
		//  Customize to display composed module in the left list
		this.updateComposedModuleList();
	},
	
	/**
	 * All the saved wirings are reusable modules :
	 */
	updateComposedModuleList: function() {
		
		// to optimize:
		
		// Remove all previous module with the ComposedModule class
		var l = YAHOO.util.Dom.getElementsByClassName("ComposedModule", "div", this.leftEl);
		for(var i = 0 ; i < l.length ; i++) {
			this.leftEl.removeChild(l[i]);
		}
		
		if(YAHOO.lang.isArray(this.pipes)) {
	       for(i = 0 ; i < this.pipes.length ; i++) {
	          var module = this.pipes[i];
	          this.pipesByName[module.name] = module;
	
				// Add the module to the list
             var div = WireIt.cn('div', {className: "WiringEditor-module ComposedModule"});
             div.appendChild( WireIt.cn('span', null, null, module.name) );
             var ddProxy = new WireIt.ModuleProxy(div, this);
             ddProxy._module = {
                name: module.name,
                container: {
                   "xtype": "jsBox.ComposedContainer",
                   "title": module.name
                }
             };
             this.leftEl.appendChild(div);

	       }
	    }
	}
});



/**
 * Container class used by the "jsBox" module (automatically sets terminals depending on the number of arguments)
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
      YAHOO.util.Dom.setStyle(this.textarea, "height", (args[0][1]-70)+"px");
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
      var match = (this.textarea.value).match((/^[ ]*function[ ]*\((.*)\)[ ]*\{/));
   	var sParamList = match ? match[1] : "";
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
         for(var i = this.terminals.length-(curTerminalN-nParams) ; i < this.terminals.length ; i++) {
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








/**
 * ComposedContainer is a class for Container representing Pipes.
 * It automatically generates the inputEx Form from the input Params.
 * @class ComposedContainer
 * @extends WireIt.FormContainer
 * @constructor
 */
jsBox.ComposedContainer = function(options, layer) {
   
   if(!options.fields) {
      
      options.fields = [];
      options.terminals = [];
   
      var pipe = jsBox.editor.getPipeByName(options.title);
      for(var i = 0 ; i < pipe.modules.length ; i++) {
         var m = pipe.modules[i];
         if( m.name == "input") {
            m.value.input.inputParams.wirable = true;
            options.fields.push(m.value.input);
         }
         else if(m.name == "output") {
            options.terminals.push({
               name: m.value.name,
               "direction": [0,1], 
               "offsetPosition": {"left": options.terminals.length*40, "bottom": -15}, 
               "ddConfig": {
                   "type": "output",
                   "allowedTypes": ["input"]
                }
            });
         }
      }
   }
   
   jsBox.ComposedContainer.superclass.constructor.call(this, options, layer);
};
YAHOO.extend(jsBox.ComposedContainer, WireIt.FormContainer);
