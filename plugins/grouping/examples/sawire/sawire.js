var sawire= {

	language: {languageName: "myNewLanguage",
	 			   "modules":modules,
           adapter: WireIt.WiringEditor.adapters.WebStorage
	},
   /**
    * @method init
    * @static
    */
   init: function() {
		  this.editor = new sawire.WiringEditor(this.language);  
		  // Open the infos panel
		  this.editor.accordionView.openPanel(2);
   },
};

/**
 * The wiring editor is overriden to add a button "RUN" to the control bar
 */
sawire.WiringEditor = function(options) {
   sawire.WiringEditor.superclass.constructor.call(this, options);
};

YAHOO.lang.extend(sawire.WiringEditor, WireIt.WiringEditor, {
   

   	/**
	 * Customize the load success handler for the composed module list
	 */
	onLoadSuccess: function(wirings) {
		sawire.WiringEditor.superclass.onLoadSuccess.call(this,wirings);
	
		//  Customize to display composed module in the left list
		this.updateComposedModuleList();
	},

  renderButtons: function() {
    sawire.WiringEditor.superclass.renderButtons.call(this);
    var toolbar = YAHOO.util.Dom.get('toolbar');
    // Buttons :
    var newButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
    newButton.on("click", this._run, this, true);
   }, 
   
   /**
    * Execute the module in the "ExecutionFrame" virtual machine
    * @method run
    * @static
    */
   _run: function() {
      var ef = new ExecutionFrame( this.getValue() );
      for(var containerId in this.layer.containers) {
          ExecutionFrame.clearExecutionStateForContainer(this.layer.containers[containerId]);
      }
      ef.run();
   },
  /**
	 * All the saved wirings are reusable modules :
	 */
	updateComposedModuleList: function() {
		
		// to optimize:
		
		// Remove all previous module with the ComposedModule class
/*		var l = YAHOO.util.Dom.getElementsByClassName("ComposedModule", "div", this.leftEl);
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
	    }*/
	}
});