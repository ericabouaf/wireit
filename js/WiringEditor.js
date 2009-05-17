(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;


/**
 * Module Proxy handle the drag/dropping from the module list to the layer (in the WiringEditor)
 * @class ModuleProxy
 * @constructor
 * @param {HTMLElement} el
 * @param {WireIt.WiringEditor} WiringEditor
 */
WireIt.ModuleProxy = function(el, WiringEditor) {
   
   this._WiringEditor = WiringEditor;
   
   // Init the DDProxy
   WireIt.ModuleProxy.superclass.constructor.call(this,el, "module", {
        dragElId: "moduleProxy"
    });
    
    this.isTarget = false; 
};
YAHOO.extend(WireIt.ModuleProxy,YAHOO.util.DDProxy, {
   
   /**
    * copy the html and apply selected classes
    * @method startDrag
    */
   startDrag: function(e) {
      WireIt.ModuleProxy.superclass.startDrag.call(this,e);
       var del = this.getDragEl();
       var lel = this.getEl();
       del.innerHTML = lel.innerHTML;
       del.className = lel.className;
   },
   
   /**
    * Override default behavior of DDProxy
    * @method endDrag
    */
   endDrag: function(e) {},
    
   /**
    * Add the module to the WiringEditor on drop on layer
    * @method onDragDrop
    */
   onDragDrop: function(e, ddTargets) { 
      // The layer is the only target :
      var layerTarget = ddTargets[0];
      var layer = ddTargets[0]._layer;
      var del = this.getDragEl();
      var pos = YAHOO.util.Dom.getXY(del);
      var layerPos = YAHOO.util.Dom.getXY(layer.el);
      this._WiringEditor.addModule( this._module ,[pos[0]-layerPos[0], pos[1]-layerPos[1]]);
    }
   
});


/**
 * The WiringEditor class provides a full page interface 
 * @class WiringEditor
 * @constructor
 * @param {Object} options
 */
WireIt.WiringEditor = function(options) {
   
    // set the default options
    this.setOptions(options);
    
    /**
     * Container DOM element
     * @property el
     */
    this.el = Dom.get(options.parentEl);
    
    /**
     * @property helpPanel
     * @type {YAHOO.widget.Panel}
     */
    this.helpPanel = new widget.Panel('helpPanel', {
        fixedcenter: true,
        draggable: true,
        visible: false,
        modal: true
     });
     this.helpPanel.render();
    
    /**
     * @property layout
     * @type {YAHOO.widget.Layout}
     */
    this.layout = new widget.Layout(this.el, this.options.layoutOptions);
    this.layout.render();

    /**
     * @property layer
     * @type {WireIt.Layer}
     */
    this.layer = new WireIt.Layer(this.options.layerOptions);

    // Render module list
    this.buildModulesList();

    // Render buttons
    this.renderButtons();
    
    // Properties Form
    this.renderPropertiesForm();
    
    // Load Service
    this.loadSMD();
    
};

WireIt.WiringEditor.prototype = {

 /**
  * @method setOptions
  * @param {Object} options
  */
 setOptions: function(options) {
    
    /**
     * @property options
     * @type {Object}
     */
    this.options = {};
    
    // Load the modules from options
    this.modules = options.modules || ([]);
    this.modulesByName = {};
    for(var i = 0 ; i < this.modules.length ; i++) {
       var m = this.modules[i];
       this.modulesByName[m.name] = m;
    }

     
    this.options.languageName = options.languageName || 'anonymousLanguage';
     
    this.options.smdUrl = options.smdUrl || 'WiringEditor.smd';
    
    this.options.propertiesFields = options.propertiesFields;
    
    this.options.layoutOptions = options.layoutOptions || {
	        units: [
	          { position: 'top', height: 50, body: 'top'},
	          { position: 'left', width: 200, resize: true, body: 'left', gutter: '5px', collapse: true, 
	            collapseSize: 25, header: 'Modules', scroll: true, animate: true },
	          { position: 'center', body: 'center', gutter: '5px' },
	          { position: 'right', width: 320, resize: true, body: 'right', gutter: '5px', collapse: true, 
	             collapseSize: 25, header: 'Properties', scroll: true, animate: true }
	        ]
	};
     
    this.options.layerOptions = {};
    var layerOptions = options.layerOptions || {};
    this.options.layerOptions.parentEl = layerOptions.parentEl ? layerOptions.parentEl : Dom.get('center');
    this.options.layerOptions.layerMap = YAHOO.lang.isUndefined(layerOptions.layerMap) ? true : layerOptions.layerMap;
    this.options.layerOptions.layerMapOptions = layerOptions.layerMapOptions || { parentEl: 'layerMap' };
 },
 
 /**
  * Render the properties form
  * @method renderPropertiesForm
  */
 renderPropertiesForm: function() {
    this.propertiesForm = new inputEx.Group({
       parentEl: YAHOO.util.Dom.get('propertiesForm'),
       fields: this.options.propertiesFields
    });
 },
 
 /**
  * Build the left menu on the left
  * @method buildModulesList
  */
 buildModulesList: function() {
    
    var left = Dom.get('left');

     var modules = this.modules;
     for(var i = 0 ; i < modules.length ; i++) {
        var module = modules[i];
        var div = WireIt.cn('div', {className: "WiringEditor-module"});
        if(module.container.icon) {
           div.appendChild( WireIt.cn('img',{src: module.container.icon}) );
        }
        div.appendChild( WireIt.cn('span', null, null, module.name) );
        var ddProxy = new WireIt.ModuleProxy(div, this);
        ddProxy._module = module;
        left.appendChild(div);
     }

     // Make the layer a drag drop target
     if(!this.ddTarget) {
       this.ddTarget = new YAHOO.util.DDTarget(this.layer.el, "module");
       this.ddTarget._layer = this.layer;
     }
     
 },
 
 /**
  * add a module at the given pos
  */
 addModule: function(module, pos) {
    try {
       var containerConfig = module.container;
       containerConfig.position = pos;
       containerConfig.title = module.name;
       var container = this.layer.addContainer(containerConfig);
       Dom.addClass(container.el, "WiringEditor-module-"+module.name);
    }
    catch(ex) {
       console.log("Error Layer.addContainer", ex.message);
    }    
 },

 /**
  * Toolbar
  * @method renderButtons
  */
 renderButtons: function() {
    var toolbar = Dom.get('toolbar');
    // Buttons :
    var newButton = new widget.Button({ label:"New", id:"WiringEditor-newButton", container: toolbar });
    newButton.on("click", this.onNew, this, true);

    var loadButton = new widget.Button({ label:"Load", id:"WiringEditor-loadButton", container: toolbar });
    loadButton.on("click", this.onLoad, this, true);

    var saveButton = new widget.Button({ label:"Save", id:"WiringEditor-saveButton", container: toolbar });
    saveButton.on("click", this.onSave, this, true);

    var deleteButton = new widget.Button({ label:"Delete", id:"WiringEditor-deleteButton", container: toolbar });
    deleteButton.on("click", this.onDelete, this, true);

    var helpButton = new widget.Button({ label:"Help", id:"WiringEditor-helpButton", container: toolbar });
    helpButton.on("click", this.onHelp, this, true);
 },


 /**
  * WiringEditor uses a SMD to connect to the backend
  * @method loadSMD
  */
 loadSMD: function() {
    
     this.service = new YAHOO.rpc.Service(this.options.smdUrl,{
 				success: this.onSMDsuccess,
 				failure: this.onSMDfailure,
 				scope: this
 		});
 		
 },
 
 /**
  * callback for loadSMD request
  * @method onSMDsuccess
  */
 onSMDsuccess: function() {
    //console.log("onSMDsuccess",this.service);
 },
 
 /**
  * callback for loadSMD request
  * @method onSMDfailure
  */
 onSMDfailure: function() { 
    //console.log("onSMDfailure", this.service);
 },

 /**
  * save the current module
  * @method saveModule
  */
 saveModule: function() {
    
    var value = this.getValue();
    
    if(value.name == "") {
       alert("Please choose a name");
       return;
    }
                
    this.service.saveWiring({name: value.name, working: JSON.stringify(value.working), language: this.options.languageName }, {
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
    alert("Saved !");
 },

 /**
  * saveModule failure callback
  * @method saveModuleFailure
  */
 saveModuleFailure: function(o) {
    alert("error while saving! ");
 },


 /**
  * Create a help panel
  * @method onHelp
  */
 onHelp: function() {
    this.helpPanel.show();
 },

 /**
  * @method onNew
  */
 onNew: function() {
    this.layer.removeAllContainers();
    
     this.propertiesForm.clear();
 },

 /**
  * @method onDelete
  */
 onDelete: function() {
    if( confirm("Are you sure you want to delete this wiring ?") ) {
       
      var value = this.getValue();
 		this.service.deleteWiring({name: value.name, language: this.options.languageName},{
 			success: function(result) {
 				alert("Deleted !");
 			}
 		});
       
    }
 },

 /**
  * @method onSave
  */
 onSave: function() {
    this.saveModule();
 },

 /**
  * @method renderLoadPanel
  */
 renderLoadPanel: function() {
    if( !this.loadPanel) {
       this.loadPanel = new widget.Panel('WiringEditor-loadPanel', {
          fixedcenter: true,
          draggable: true,
          width: '500px',
          visible: false,
          modal: true
       });
       this.loadPanel.setHeader("Select module");
       this.loadPanel.setBody("<div id='loadPanelBody'></div>");
       this.loadPanel.render(document.body);
    }
 },

 /**
  * @method updateLoadPanelList
  */
 updateLoadPanelList: function() {
    var list = WireIt.cn("ul");
    if(lang.isArray(this.pipes)) {
       for(var i = 0 ; i < this.pipes.length ; i++) {
          var module = this.pipes[i];
          
          this.pipesByName[module.name] = module;
          
          var li = WireIt.cn('li',null,{cursor: 'pointer'},module.name);
          Event.addListener(li, 'click', function(e,args) {
             try {
                this.loadPipe(Event.getTarget(e).innerHTML);
             }
             catch(ex) {
                console.log(ex);
             }
          }, this, true);
          list.appendChild(li);
       }
    }
    var panelBody = Dom.get('loadPanelBody');
    panelBody.innerHTML = "";
    panelBody.appendChild(list);
 },

 /**
  * @method onLoad
  */
 onLoad: function() {
    
    this.service.listWirings({language: this.options.languageName},{
			success: function(result) {
				this.pipes = result.result;
				this.pipesByName = {};
				this.renderLoadPanel();
            this.updateLoadPanelList();
            this.loadPanel.show();
			},
			scope: this
		}
		);

 },
 
 /**
  * @method getPipeByName
  * @param {String} name Pipe's name
  * @return {Object} return the evaled json pipe configuration
  */
 getPipeByName: function(name) {
    var n = this.pipes.length,ret;
    for(var i = 0 ; i < n ; i++) {
       if(this.pipes[i].name == name) {
          // Try to eval working property:
          try {
             ret = JSON.parse(this.pipes[i].working);
             return ret;
          }
          catch(ex) {
             console.log("Unable to eval working json for module "+name);
             return null;
          }
       }
    }
    
    return null;
 },
 
 /**
  * @method loadPipe
  * @param {String} name Pipe name
  */
 loadPipe: function(name) {
    var pipe = this.getPipeByName(name), i;
    
    // TODO: check if current pipe is saved...
    this.layer.removeAllContainers();
    
    this.propertiesForm.setValue(pipe.properties);
    
    if(lang.isArray(pipe.modules)) {
      
       // Containers
       for(i = 0 ; i < pipe.modules.length ; i++) {
          var m = pipe.modules[i];
          if(this.modulesByName[m.name]) {
             var baseContainerConfig = this.modulesByName[m.name].container;
             YAHOO.lang.augmentObject(m.config, baseContainerConfig); 
             m.config.title = m.name;
             var container = this.layer.addContainer(m.config);
             Dom.addClass(container.el, "WiringEditor-module-"+m.name);
             container.setValue(m.value);
          }
          else {
             throw new Error("WiringEditor: module '"+m.name+"' not found !");
          }
       }
       
       // Wires
       if(lang.isArray(pipe.wires)) {
           for(i = 0 ; i < pipe.wires.length ; i++) {
              // On doit chercher dans la liste des terminaux de chacun des modules l'index des terminaux...
              this.layer.addWire(pipe.wires[i]);
           }
        }
     }
     
     this.loadPanel.hide();
 },
 
 
 /**
  * This method return a wiring within the given vocabulary described by the modules list
  * @method getValue
  */
 getValue: function() {
    
   var i;
   var obj = {modules: [], wires: [], properties: null};

   for( i = 0 ; i < this.layer.containers.length ; i++) {
      obj.modules.push( {name: this.layer.containers[i].options.title, value: this.layer.containers[i].getValue(), config: this.layer.containers[i].getConfig()});
   }

   for( i = 0 ; i < this.layer.wires.length ; i++) {
      var wire = this.layer.wires[i];

      var wireObj = { 
         src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.layer.containers), terminal: wire.terminal1.options.name}, 
         tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.layer.containers), terminal: wire.terminal2.options.name}
      };
      obj.wires.push(wireObj);
   }
   
   obj.properties = this.propertiesForm.getValue();
    
   return {
      name: obj.properties.name,
      working: obj
   };
 }


};

})();
   