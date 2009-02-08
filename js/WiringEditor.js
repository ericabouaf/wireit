(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

/**
 * The WiringEditor class provides a full page interface 
 * @class WiringEditor
 * @constructor
 * @param {Object} options
 */
WireIt.WiringEditor = function(options) {
   try {
    // set the default options
    this.setOptions(options);
    
    /**
     * Container DOM element
     * @property el
     */
    this.el = Dom.get(options.parentEl);
    
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

    // Render buttons
    this.renderButtons();
    
    // Properties Form
    this.renderPropertiesForm();
    
    // Load the modules from options
    if(options.modules) {
       this.modules = options.modules;
       this.buildModulesList();
    }
    // Load module with ajax request
    else if(this.options.loadUrl) {
       this.loadModules();
    }
   
   } catch(ex) {
      console.log(ex);
   }
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

    this.options.loadUrl = options.loadUrl;
    this.options.saveUrl = options.saveUrl;
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
    
    var dl = WireIt.cn('dl');
    
    var modules = this.modules;
    for(var i = 0 ; i < modules.length ; i++) {
       var module = modules[i];
       var dt = WireIt.cn('dt');
       dt.appendChild( WireIt.cn('img',{src: module.container.icon}) );
       var dd = WireIt.cn('dd');
       var a = WireIt.cn('a', {href: '#', id: 'menu_module_'+i}, null, module.name);
       Event.addListener(a, 'click', this.onAddModule, this, true);
       dd.appendChild(a);
       dl.appendChild(dt);
       dl.appendChild(dd);
    }
    
    Dom.get('left').appendChild(dl);
    this.dl = dl;
 },

 /**
  * Callback called when we want to add a module in the layer
  * @method onAddModule
  */
 onAddModule: function(e, args) {
    
   var stringId = Event.getTarget(e).id;
   var index = parseInt((stringId.split('_'))[2]);
   var module = this.modules[index];
    
   var moduleConfig = module;
   
   var containerConfig = moduleConfig.container;
   containerConfig.position = [200,200];
   containerConfig.title = module.name;
   try {
      var container = this.layer.addContainer(containerConfig);
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
  * Ajax request to load the modules
  * @method loadModules
  */
 loadModules: function() {
    Connect.asyncRequest('POST', this.options.loadUrl, 
             { success: this.loadModulesSuccess, failure: this.loadModulesFailure, scope: this});
 },

 /**
  * Parse the JSON response 
  * @method loadModulesSuccess
  */
 loadModulesSuccess: function(o) {
    try {
       /**
        * @property modules
        */
       this.modules = YAHOO.lang.JSON.parse(o.responseText);
    }
    catch(ex) {
       console.log("Error while javascript evaluation of loadModules results : ", ex);
       return;
    }
    
    // Build module list
    this.buildModulesList();
 },

 /**
  * An error occured on loadModules :(
  * @method loadModulesFailure
  */
 loadModulesFailure: function(o) {
    console.log("Load module failure !!", o);
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
    
    var postdata = JSON.stringify(value);
    
    Connect.asyncRequest('POST', this.options.saveUrl, 
                {success: this.saveModuleSuccess,failure: this.saveModuleFailure}, postdata);
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
      if( !this.helpPanel) {
       this.helpPanel = new widget.Panel('dfly-helpPanel', {
          draggable: true,
          width: '500px',
          visible: false,
          modal: true
       });
       this.helpPanel.setBody("<p>Some help here</p>");
       this.helpPanel.setHeader("You asked for some help ?");
       this.helpPanel.render(document.body);
       this.helpPanel.center();
    }
    this.helpPanel.show();
 },

 /**
  * @method onNew
  */
 onNew: function() {
    this.layer.removeAllContainers();
 },

 /**
  * @method onDelete
  */
 onDelete: function() {
    if( confirm("Are you sure you want to delete this wiring ?") ) {
       
       Connect.asyncRequest('POST', this.options.deleteUrl, 
                 { success: this.loadModulesSuccess, failure: this.loadModulesFailure, scope: this});
       
    }
 },

 /**
  * @method onSave
  */
 onSave: function() {
    this.saveModule();
 },

 /**
  * @method onLoad
  */
 onLoad: function() {
    alert("not implemented");
 },
 
 /**
  * This method return a wiring within the given vocabulary described by the modules list
  * @method getValue
  */
 getValue: function() {
    
   var i;
   var obj = {modules: [], wires: []};

   for( i = 0 ; i < this.layer.containers.length ; i++) {
      obj.modules.push( {name: this.layer.containers[i].options.title, value: this.layer.containers[i].getValue(), config: this.layer.containers[i].getConfig()});
   }

   for( i = 0 ; i < this.layer.wires.length ; i++) {
      var wire = this.layer.wires[i];

      var wireObj = { 
         src: {moduleId: WireIt.indexOf(wire.terminal1.container, this.layer.containers), terminalId: wire.terminal1.options.name}, 
         tgt: {moduleId: WireIt.indexOf(wire.terminal2.container, this.layer.containers), terminalId: wire.terminal2.options.name} 
      };
      obj.wires.push(wireObj);
   }
   
   var propertiesValue = this.propertiesForm.getValue();
    
   return {
      name: propertiesValue.name,
      working: obj
   };
 },
 
 /**
  * @method setValue
  */
 setValue: function(val) {
    
    //this.layer.setWiring();
    
 }


};

})();
 