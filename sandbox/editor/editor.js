YUI.add("editor", function(Y){

/**
 * The WiringEditor class provides a full page interface 
 * @class WiringEditor
 * @extends WireBaseEditor
 * @constructor
 * @param {Object} options
 */
Y.WireWiringEditor = function(options) {

	 /**
	  * Hash object to reference module definitions by their name
	  * @attribute modulesByName
	  * @type {Object}
	  */
   this.modulesByName = {};
	Y.WireWiringEditor.superclass.constructor.call(this, options);

	 // LoadWirings
	 if( this.adapter.init && Y.Lang.isFunction(this.adapter.init) ) {
			this.adapter.init();
 	 }
	 this.load();
};

Y.extend(Y.WireWiringEditor, Y.WireBaseEditor, {

	 /**
	  * @method setOptions
	  * @param {Object} options
	  */
	 setOptions: function(options) {
    
		Y.WireWiringEditor.superclass.setOptions.call(this, options);
    
	    // Load the modules from options
	    this.modules = options.modules || [];
	    for(var i = 0 ; i < this.modules.length ; i++) {
	       var m = this.modules[i];
	       this.modulesByName[m.name] = m;
	    }

		 this.adapter = options.adapter || Y.WireWiringEditor.adapters.JsonRpc;
     
	    this.options.languageName = options.languageName || 'anonymousLanguage';
     
	    this.options.layerOptions = {};
	    var layerOptions = options.layerOptions || {};
	

	    this.options.layerOptions.parentEl = layerOptions.parentEl ? layerOptions.parentEl : Y.one('center');
	    this.options.layerOptions.layerMap = Y.Lang.isUndefined(layerOptions.layerMap) ? true : layerOptions.layerMap;
	    this.options.layerOptions.layerMapOptions = layerOptions.layerMapOptions || { parentEl: 'layerMap' };

	 	 this.options.modulesAccordionViewParams = Y.mix({
														collapsible: true, 
														expandable: true, // remove this parameter to open only one panel at a time
														width: 'auto', 
														expandItem: 0, 
														animationSpeed: '0.3', 
														animate: true, 
														effect: YAHOO.util.Easing.easeBothStrong
													},options.modulesAccordionViewParams || {});
													
		 // Grouping options
	    var temp = this;
	    var baseConfigFunction = function(name)  { 
				return (name == "Group") ? ({
			    "xtype": "WireIt.GroupFormContainer",
			    "title": "Group",    

			    "collapsible": true,
			    "fields": [ ],
			    "legend": "Inner group fields",
			    "getBaseConfigFunction" : baseConfigFunction
				}) : temp.modulesByName[name].container;
		};

	    this.options.layerOptions.grouper = {"baseConfigFunction": baseConfigFunction };
	
	 },


	/**
	 * Add the rendering of the layer
	 */
  	render: function() {

		 Y.WireWiringEditor.superclass.render.call(this);
	
	    /**
	     * @attribute layer
	     * @type {WireIt.Layer}
	     */
	    this.layer = new Y.Layer(this.options.layerOptions);
		 this.layer.on('eventChanged', this.onLayerChanged, this, true);

		 // Left Accordion
		 this.renderModulesAccordion();

	    // Render module list
	    this.buildModulesList();
  	},

	/**
	 * render the modules accordion in the left panel
	 */
	renderModulesAccordion: function() {
		
		// Create the modules accordion DOM if not found
		if(!Y.one('modulesAccordionView')) {
			Y.one('left').appendChild( Y.WireIt.cn('ul', {id: 'modulesAccordionView'}) );
			var li = Y.WireIt.cn('li');
			li.appendChild(Y.WireIt.cn('h2',null,null,"Main"));
			var d = Y.WireIt.cn('div');
			d.appendChild( Y.WireIt.cn('div', {id: "module-category-main"}) );
			li.appendChild(d);
			Y.one('modulesAccordionView').appendChild(li);
		}
		
		this.modulesAccordionView = new YAHOO.widget.AccordionView('modulesAccordionView', this.options.modulesAccordionViewParams);
		
		// Open all panels
		for(var l = 1, n = this.modulesAccordionView.getPanels().length; l < n ; l++) {
			this.modulesAccordionView.openPanel(l);
		}
	},
	
 
 	/**
  	 * Build the left menu on the left
  	 * @method buildModulesList
  	 */
 	buildModulesList: function() {

     	var modules = this.modules;
     	for(var i = 0 ; i < modules.length ; i++) {
		  	this.addModuleToList(modules[i]);
     	}

     	// Make the layer a drag drop target
     	if(!this.ddTarget) {
       	this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");
       	this.ddTarget._layer = this.layer;
     	}
 	},

 	/**
  	 * Add a module definition to the left list
  	 */
 	addModuleToList: function(module) {
	try {
		var div = Y.WireIt.cn('div', {className: "WiringEditor-module"});
		
		if(module.description) {
			div.title = module.description;
		}
		
      if(module.container.icon) {
         div.appendChild( Y.WireIt.cn('img',{src: module.container.icon}) );
      }
      div.appendChild( Y.WireIt.cn('span', null, null, module.name) );

      var ddProxy = new Y.WireModuleProxy(div, this);
      ddProxy._module = module;

		// Get the category element in the accordion or create a new one
		var category = module.category || "main";
		var el = Y.one("module-category-"+category);
		if( !el ) {
			this.modulesAccordionView.addPanel({
				label: category,
				content: "<div id='module-category-"+category+"'></div>"
			});
			this.modulesAccordionView.openPanel(this.modulesAccordionView._panels.length-1);
			el = Y.one("module-category-"+category);
		}
		
		el.appendChild(div);
	}catch(ex){ console.log(ex);}
 	},
 
 
	getCurrentGrouper: function(editor) {
     	return editor.currentGrouper;
 	},
 
 	/**
  	 * add a module at the given pos
  	 */
	addModule: function(module, pos) {
	    try {
	       if (pos[0] < 0) pos[0] = 0;
	       if (pos[1] < 0) pos[1] = 0;
	       var containerConfig = module.container;
	       containerConfig.position = pos;
	       containerConfig.title = module.name;
	       var temp = this;
	       containerConfig.getGrouper = function() { return temp.getCurrentGrouper(temp); };
	       var container = this.layer.addContainer(containerConfig);
	
			 // Adding the category CSS class name
			 var category = module.category || "main";
			 Y.one(container.el).addClass("WiringEditor-module-category-"+category.replace(/ /g,'-'));
			
			 // Adding the module CSS class name
	       Y.one(container.el).addClass("WiringEditor-module-"+module.name.replace(/ /g,'-'));
	
	    }
	    catch(ex) {
	       this.alert("Error Layer.addContainer: "+ ex.message);
			 if(window.console && Y.Lang.isFunction(console.log)) {
				console.log(ex);
			}
	    }    
	},

 	/**
  	 * save the current module
  	 */
 	save: function() {
  
    	var value = this.getValue();
    
    	if(value.name === "") {
       	this.alert("Please choose a name");
       	return;
    	}

		this.tempSavedWiring = {name: value.name, working: value.working, language: this.options.languageName };
                
    	this.adapter.saveWiring(this.tempSavedWiring, {
       	success: this.saveModuleSuccess,
       	failure: this.saveModuleFailure,
       	scope: this
    	});
 	},

	 /**
	  * saveModule success callback
	  * @method saveModuleSuccess
	  */
	 saveModuleSuccess: function(o) {

		this.markSaved();

	   this.alert("Saved !");

		// TODO: call a saveModuleSuccess callback...
	 },

	 /**
	  * saveModule failure callback
	  * @method saveModuleFailure
	  */
	 saveModuleFailure: function(errorStr) {
	    this.alert("Unable to save the wiring : "+errorStr);
	 },


	 /**
	  * @method onNew
	  */
	 onNew: function() {
	
		if(!this.isSaved()) {
			if( !confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.") ) {
				return;
			}
		}
	
		this.preventLayerChangedEvent = true;
	
	   this.layer.clear(); 

	   this.propertiesForm.clear(false); // false to tell inputEx to NOT send the updatedEvt

		this.markSaved();

		this.preventLayerChangedEvent = false;
	 },

	 /**
	  * @method onDelete
	  */
	 onDelete: function() {
	    if( confirm("Are you sure you want to delete this wiring ?") ) {
       
	      var value = this.getValue();
	 		this.adapter.deleteWiring({name: value.name, language: this.options.languageName},{
	 			success: function(result) {
					this.onNew();
	 				this.alert("Deleted !");
	 			},
				failure: function(errorStr) {
					this.alert("Unable to delete wiring: "+errorStr);
				},
				scope: this
	 		});
       
	    }
	 },

	 /**
	  * @method renderLoadPanel
	  */
	 renderLoadPanel: function() {
	    if( !this.loadPanel) {
	       this.loadPanel = new Y.Panel('WiringEditor-loadPanel', {
	          fixedcenter: true,
	          draggable: true,
	          width: '500px',
	          visible: false,
	          modal: true
	       });
	       this.loadPanel.setHeader("Select the wiring to load");
	       this.loadPanel.setBody("Filter: <input type='text' id='loadFilter' /><div id='loadPanelBody'></div>");
	       this.loadPanel.render(document.body);

			// Listen the keyup event to filter the module list
			Y.Event.onAvailable('loadFilter', function() {
				Y.one('#loadFilter').on("keyup", this.inputFilterTimer, this, true);
			}, this, true);

	    }
	 },

	/**
	 * Method called from each keyup on the search filter in load panel.
	 * The real filtering occurs only after 500ms so that the filter process isn't called too often
	 */
	inputFilterTimer: function() {
		if(this.inputFilterTimeout) {
			clearTimeout(this.inputFilterTimeout);
			this.inputFilterTimeout = null;
		}
		var that = this;
		this.inputFilterTimeout = setTimeout(function() {
				that.updateLoadPanelList(Y.one('loadFilter').value);
		}, 500);
	},


	 /**
	  * @method updateLoadPanelList
	  */
	 updateLoadPanelList: function(filter) {
	
		 this.renderLoadPanel();
	
	    var list = Y.WireIt.cn("ul");
	    if(Y.Lang.isArray(this.pipes)) {
	       for(var i = 0 ; i < this.pipes.length ; i++) {
	          var pipe = this.pipes[i];
	          if(!filter || filter === "" || pipe.name.match(new RegExp(filter,"i")) ) {
		          list.appendChild( Y.WireIt.cn('li',null,{cursor: 'pointer'},pipe.name) );
				}
	       }
	    }
	    var panelBody = Y.one('loadPanelBody');
	
		 // Purge element (remove listeners on panelBody and childNodes recursively)
	    // TODO: YAHOO.util.Event.purgeElement(panelBody, true);

	    panelBody.innerHTML = "";
	    panelBody.appendChild(list);

	    Y.one(list).on('click', function(e,args) {
	    	this.loadPipe(e.target.innerHTML);
	    }, this, true);

	 },

	 /**
	  * Start the loading of the pipes using the adapter
	  * @method load
	  */
	 load: function() {
    
	    this.adapter.listWirings({language: this.options.languageName},{
			success: function(result) {
				this.onLoadSuccess(result);
			},
			failure: function(errorStr) {
				this.alert("Unable to load the wirings: "+errorStr);
			},
			scope: this
		});

	 },

	 /**
	  * @method onLoadSuccess
	  */
	 onLoadSuccess: function(wirings) {
			if( wirings && wirings.length && wirings.length > 0 ) {
				// Reset the internal structure
				this.pipes = wirings;
				this.pipesByName = {};

				// Build the "pipesByName" index
				for(var i = 0 ; i < this.pipes.length ; i++) {
		          this.pipesByName[ this.pipes[i].name] = this.pipes[i];
				}

				this.updateLoadPanelList();

				// Check for autoload param and display the loadPanel otherwise
				if(!this.checkAutoLoad()) {
					 this.loadPanel.show();
				}
			}
	 },
		
	/**
	 * checkAutoLoad looks for the "autoload" URL parameter and open the pipe.
	 * returns true if it loads a Pipe
	 * @method checkAutoLoad
	 */
	checkAutoLoad: function() {
		if(!this.checkAutoLoadOnce) {
			var p = window.location.search.substr(1).split('&');
			var oP = {};
			for(var i = 0 ; i < p.length ; i++) {
				var v = p[i].split('=');
				oP[v[0]]=window.decodeURIComponent(v[1]);
			}
			this.checkAutoLoadOnce = true;
			if(oP.autoload) {
				this.loadPipe(oP.autoload);
				return true;
			}
		}
		return false;
	},

	/**
	 * @method getPipeByName
	 * @param {String} name Pipe's name
	 * @return {Object} return the pipe configuration
	 */
	getPipeByName: function(name) {
	   var n = this.pipes.length,ret;
	   for(var i = 0 ; i < n ; i++) {
	      if(this.pipes[i].name == name) {
			return this.pipes[i].working;
	      }
	   }
	   return null;
	},

	/**
	 * @method loadPipe
	 * @param {String} name Pipe name
	 */
	loadPipe: function(name) {

		if(!this.isSaved()) {
			if( !confirm("Warning: Your work is not saved yet ! Press ok to continue anyway.") ) {
				return;
			}
		}

		try {

			this.preventLayerChangedEvent = true;
			this.loadPanel.hide();

			var wiring = this.getPipeByName(name), i;

			if(!wiring) {
				this.alert("The wiring '"+name+"' was not found.");
				return;
		 	}

		   // TODO: check if current wiring is saved...
		   this.layer.clear();

		   this.propertiesForm.setValue(wiring.properties, false); // the false tells inputEx to NOT fire the updatedEvt

		   if(Y.Lang.isArray(wiring.modules)) {
  
		      // Containers
		      for(i = 0 ; i < wiring.modules.length ; i++) {
		         var m = wiring.modules[i];
		         if(this.modulesByName[m.name]) {
		            var baseContainerConfig = this.modulesByName[m.name].container;
		            Y.mix(m.config, baseContainerConfig); 
		            m.config.title = m.name;
		            var container = this.layer.addContainer(m.config);
		            Y.one(container.el).addClass("WiringEditor-module-"+m.name);
		            container.setValue(m.value);
		         }
		         else {
		            throw new Error("WiringEditor: module '"+m.name+"' not found !");
		         }
		      }
   
		      // Wires
		      if(Y.Lang.isArray(wiring.wires)) {
		          for(i = 0 ; i < wiring.wires.length ; i++) {
		             // On doit chercher dans la liste des terminaux de chacun des modules l'index des terminaux...
		             this.layer.addWire(wiring.wires[i]);
		          }
		      }
		  }
  
		  this.markSaved();
		
		  this.preventLayerChangedEvent = false;

 		}
 		catch(ex) {
    		this.alert(ex);
			if(window.console && Y.Lang.isFunction(console.log)) {
				console.log(ex);
			}
 		}
	},


	onLayerChanged: function() {
		if(!this.preventLayerChangedEvent) {
			this.markUnsaved();
		}
	},

 
	/**
	 * This method return a wiring within the given vocabulary described by the modules list
	 * @method getValue
	 */
	getValue: function() {
  
	  var i;
	  var obj = {modules: [], wires: [], properties: null};

	  for( i = 0 ; i < this.layer.containers.length ; i++) {
	     obj.modules.push( {name: this.layer.containers[i].title, value: this.layer.containers[i].getValue(), config: this.layer.containers[i].getConfig()});
	  }

	  for( i = 0 ; i < this.layer.wires.length ; i++) {
	     var wire = this.layer.wires[i];
		var wireObj = wire.getConfig();
		wireObj.src = {moduleId: Y.Array.indexOf(this.layer.containers, wire.terminal1.container), terminal: wire.terminal1.name };
		wireObj.tgt = {moduleId: Y.Array.indexOf(this.layer.containers, wire.terminal2.container), terminal: wire.terminal2.name };
	     obj.wires.push(wireObj);
	  }
 
	  obj.properties = this.propertiesForm.getValue();
  
	  return {
	     name: obj.properties.name,
	     working: obj
	  };
	}


});


/**
 * WiringEditor Adapters
 * @static
 */
Y.WireWiringEditor.adapters = {};

}, '0.7.0',{
  requires: ['editor-base']
});
