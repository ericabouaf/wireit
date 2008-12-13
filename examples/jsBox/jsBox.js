/**
 * jsBox
 */
var jsBox = {
   
   /**
    * @method init
    * @static
    */
   init: function() {
      
      this.jsBoxLayer = new WireIt.Layer({layerMap: true});

      this.jsBoxLayer.el.appendChild( WireIt.cn('p', null, {margin: "10px"}, "This application is an example of the <a href='http://javascript.neyric.com/wireit'>WireIt library</a>.<br />Each box contains a javascript function. The number of input terminals is automatically updated when you edit the function.<br />When you press 'Run', all the functions without input parameters are exectued. Then, the other modules are executed sequentially.") );

      var addBoxButton = WireIt.cn('button', null, {margin: "10px"}, "Add box");
      YAHOO.util.Event.addListener(addBoxButton, 'click', this.addModule, this, true);


      var addRunButton = WireIt.cn('button', null, {margin: "10px"}, "Run !");
      YAHOO.util.Event.addListener(addRunButton, 'click', this.run, this, true);


      var addExportButton = WireIt.cn('button', null, {margin: "10px"}, "Export config");
      YAHOO.util.Event.addListener(addExportButton, 'click', function() { 

            myPanel = new YAHOO.widget.Panel("exportWindow", { 
         	    width:"400px",  
         	    modal: true,
         	    fixedcenter: true,  
         	    constraintoviewport: true,  
         	    close:true,  
         	    draggable:true} ); 

            myPanel.setHeader("JSON export"); 
            myPanel.setBody( "<div style='overflow: auto;'>"+YAHOO.lang.JSON.stringify( jsBox.jsBoxLayer.getWiring() )+"</div>" );
            myPanel.render(document.body);

            myPanel.show();
      });

      this.jsBoxLayer.el.appendChild(addBoxButton);
      this.jsBoxLayer.el.appendChild(addRunButton);
      this.jsBoxLayer.el.appendChild(addExportButton);

      this.jsBoxLayer.setWiring({"containers":[{"codeText":"function() {\n return 3;\n}","position":[280,140],"xtype":"jsBox.Container"},{"codeText":"function() {\n return 6;\n}","position":[500,150],"xtype":"jsBox.Container"},{"codeText":"function(a,b) {\n return a*b;\n}","position":[400,280],"xtype":"jsBox.Container"},{"codeText":"function(result) {\n alert('the result is '+result);\n}","position":[450,440],"xtype":"jsBox.Container"}],"wires":[{"src":{"moduleId":0,"terminalId":0},"tgt":{"moduleId":2,"terminalId":0}},{"src":{"moduleId":1,"terminalId":0},"tgt":{"moduleId":2,"terminalId":1}},{"src":{"moduleId":2,"terminalId":2},"tgt":{"moduleId":3,"terminalId":0}}]});

   },
   
   
   /**
    * Static function to run the "program"
    * @method run
    * @static
    */
   run: function() {

      // Clear the previous results
      for(var i = 0; i < this.jsBoxLayer.containers.length; i++) {
         this.jsBoxLayer.containers[i].evalResult = null;
      }

      // Make a list of all the containers that may be run (no input params)
      var modules = [];
      for(var i = 0; i < this.jsBoxLayer.containers.length; i++) {
         if( this.jsBoxLayer.containers[i].mayEval() ) {
            modules.push( this.jsBoxLayer.containers[i] );
         }
      }

      // Eval the "sources" modules 
      for(var i = 0 ; i < modules.length ; i++) {
         modules[i].execute();
      }

   },

   /**
    * Adds a jsBox to the layer
    * @method addModule
    * @static
    */
   addModule: function () {
      jsBox.jsBoxLayer.addContainer({xtype: "jsBox.Container"});
   },
   
   /**
    * Parse the textarea code to get the number of input parameters
    * @method getNbrInputs
    * @param {String} functionString
    */
   getNbrInputs: function(functionString) {
      var sParamList = functionString.match(/^[ ]*function[ ]*\((.*)\)[ ]*{/)[1];
      var params = sParamList.split(',');
      var nParams = (sParamList == "") ? 0 : parseInt(params.length);
      return nParams;
   },
   
};


// Init the jsBox layer with a default program
YAHOO.util.Event.addListener(window, "load", jsBox.init, jsBox, true);


/**
 * @class Container
 * @namespace jsBox
 * @constructor
 */
jsBox.Container = function(options, layer) {
         
   jsBox.Container.superclass.constructor.call(this, options, layer);
   
   this.buildTextArea(options.codeText || "function(e) {\n\n  return 0;\n}");
   
   this.nParams = jsBox.getNbrInputs(this.textarea.value);
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

      this.textarea = WireIt.cn('textarea', null, {width: "100%", height: "70px", border: "0", padding: "5px"}, codeText);
      this.setBody(this.textarea);

      YAHOO.util.Event.addListener(this.textarea, 'change', function() {
         var nParams = this.getNbrInputs();
         if( nParams != this.nParams) {
            this.nParams = nParams;
            this.createTerminals();
         }
      }, this, true);
      
   },
   
   /**
    * Create (and re-create) the terminals with this.nParams input terminals
    * @method createTerminals
    */
   createTerminals: function() {
      
   	// Remove all the existing terminals
   	this.removeAllTerminals();
   	
      for(var i = 0 ; i < this.nParams ; i++) {
      	var term = this.addTerminal({xtype: "WireIt.util.TerminalInput"});
         term.jsBox = this;
         WireIt.sn(term.el, null, {position: "absolute", top: "-15px"});
      }

   	var term = this.addTerminal({xtype: "WireIt.util.TerminalOutput"});      
      term.jsBox = this;
      WireIt.sn(term.el, null, {position: "absolute", bottom: "-15px"});
   
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

      for(var i = 0 ; i < this.terminals.length-1 ; i++) {
         YAHOO.util.Dom.setStyle(this.terminals[i].el, "left", (inputsIntervall*(i+1))-15+"px" );
         
         for(var j = 0 ; j < this.terminals[i].wires.length ; j++) {
            this.terminals[i].wires[j].redraw();
         }
      }

      YAHOO.util.Dom.setStyle(this.terminals[this.terminals.length-1].el, "left", (Math.floor(width/2)-15)+"px");

      for(var j = 0 ; j < this.terminals[this.terminals.length-1].wires.length ; j++) {
         this.terminals[this.terminals.length-1].wires[j].redraw();
      }
   },
   
   /**
    * Execute the module
    * @method execute
    */
   execute: function() {

      // Eval each of the parameter functions : 
      var params = [];
      for(var i = 0 ; i < this.terminals.length-1 ; i++) {
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
      for(var i = 0 ; i < this.terminals.length-1 ; i++) {
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

