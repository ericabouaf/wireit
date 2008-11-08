(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

 /**
  * WireIt.WiringEditor
  */
 WireIt.WiringEditor = {

    /**
     * init function 
     */
    init: function(config) {
       
       this.config = config;
       
       // Build the layout
       var layout = new widget.Layout({
          units: [
            { position: 'top', height: 50, body: 'top'},
            { position: 'left', width: 250, resize: true, body: 'left', gutter: '5px', collapse: true, 
              collapseSize: 25, header: 'Modules', scroll: true, animate: true },
            { position: 'center', body: 'center', gutter: '5px' }
          ]
       });
       layout.render();

       // Create the layer
       this.layer = new WireIt.Layer({parentEl: Dom.get('center')});

       // Render buttons
       this.renderButtons();
       
       // Load the modules
       this.loadModules();

    },
    
    /**
     * Build the left menu on the left
     */
    buildModulesList: function() {
       
       var dl = WireIt.cn('dl');
       
       var modules = this.modules;
       for(var i = 0 ; i < modules.length ; i++) {
          var module = modules[i];
          var dt = WireIt.cn('dt');
          dt.appendChild( WireIt.cn('img',{src: module.icon}) );
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
     */
    onAddModule: function(e, args) {
       
      var stringId = Event.getTarget(e).id;
      var index = parseInt((stringId.split('_'))[2]);
      var module = this.modules[index];
       
      var moduleConfig = module;
      moduleConfig.position = [300,400];
      moduleConfig.label = module.name;
      try {
         this.layer.addContainer(moduleConfig);
      }
      catch(ex) {
         console.log("Error addContainer", ex.message);
      }
    },

    /**
     * Toolbar
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
     */
    loadModules: function() {
       Connect.asyncRequest('POST', this.config.loadUrl, 
                { success: this.loadModulesSuccess, failure: this.loadModulesFailure, scope: this});
    },

    /**
     * Parse the JSON response 
     */
    loadModulesSuccess: function(o) {
       //var modules,evaledModule;

       // Evaluating http response
       try {
          this.modules = eval('('+o.responseText+')');   
       }
       catch(ex) {
          console.log("Error while javascript evaluation of loadModules results : ", ex);
          return;
       }

       // Evaluating each module and index them by path
       /*for(var i = 0 ; i < modules.length ; i++) {
          try {
             evaledModule = eval('('+modules[i].json+')');
             this.modules[modules[i].path] = evaledModule;
          }
          catch(ex) {
             console.log("Error while evaluating module '"+modules[i].path+"' : ", ex);
          }
       }*/
       
       
       // Build module list
       this.buildModulesList();

    },

    /**
     * An error occured on loadModules :(
     */
    loadModulesFailure: function(o) {
       console.log("Load module failure !!", o);
    },

    /**
     * save the current module
     */
    saveModule: function() {
       var postdata = "path="+this.path;
       postdata += "&parameters="+JSON.stringify(this.parameters);
       if(this.definition) {
          postdata += "&definition="+JSON.stringify(this.definition);
       }
       else {
          postdata += "&definition=";
       }
       Connect.asyncRequest('POST', 'php/saveModule.php', 
                   {success: this.saveModuleSuccess,failure: this.saveModuleFailure}, postdata);
    },

    saveModuleSuccess: function(o) {

    },

    saveModuleFailure: function(o) {
       alert("error while saving! ");
    },





    /**
     * Create a help panel with an iframe to ./help.htmlx
     */
    onHelp: function() {
       /*if( !this.helpPanel) {
          this.helpPanel = new widget.Panel('dfly-helpPanel', {
             draggable: true,
             width: '500px',
             visible: false
          });
          this.helpPanel.setBody("<iframe src='help.html' style='width: 100%; border: 0;'/>");
          this.helpPanel.setHeader("You asked for some help ?");
          this.helpPanel.render(document.body);
          this.helpPanel.center();
       }
       this.helpPanel.show();*/
    },

    onNew: function() {
       this.layer.removeAllContainers();
       //this.layer.setEditingModule(null);
    },

    onDelete: function() {
       /*var moduleToDelete = this.editingModuleInputName.value;
       var m = dfly.ModuleModel.get(moduleToDelete);
       if(m) {
          m.destroy();
       }
       this.onNew();
       dfly.addContainerWindow.removeModuleFromTree(moduleToDelete);*/
    },

    onSave: function() {

       /*var moduleName = this.editingModuleInputName.value;

       var wiring = this.getWiring();
       var parameters = {inputs:[], outputs:[]};

       // Generate the "parameters"
       for(var i = 0 ; i < wiring.containers.length ; i++) {
          var c = wiring.containers[i];

          if(c.moduleName == moduleName) {
             alert('We cannot run recursive modules (yet...). Please remove modules "'+moduleName+'" before saving.');
             return;
          }

          // inputs
          if(c.moduleName == '/system/input') {
             var param = {};
             param.label = c.formValue.name;
             param.type = c.formValue.type.type;
             param.inputParams = {};
             if(c.formValue.type.typeOptions)
             for(var key in c.formValue.type.typeOptions) {
                if(c.formValue.type.typeOptions.hasOwnProperty(key)) {
                   param.inputParams[key] = c.formValue.type.typeOptions[key];
                }
             }
             param.inputParams.name = c.formValue.name;
             parameters.inputs.push(param);
          }
          // outputs
          else if(c.moduleName == '/system/output') {
             var param = {};

             param.name = c.formValue.name;

             parameters.outputs.push(param);
          }
       }

       // Boolean to know if we need to rebuild the module treeView
       var alreadyPresent = !!dfly.ModuleModel.get(moduleName);

       if(alreadyPresent) {
          var m = dfly.ModuleModel.get(moduleName);
          m.definition = wiring;//YAHOO.lang.JSON.stringify(wiring);
          m.parameters = parameters;//YAHOO.lang.JSON.stringify(parameters);
          m.save();
       }
       else {
          var newModule = new dfly.ModuleModel( {
             path: moduleName,
             definition: wiring,//YAHOO.lang.JSON.stringify(wiring),
             parameters: parameters//YAHOO.lang.JSON.stringify(parameters)
          });
          newModule.save();
       }

       // Regenerate the treeview in the addContainerWindow if this is a new module
       if(!alreadyPresent) {
          dfly.addContainerWindow.refreshModuleList();
       }*/
    },

    onLoad: function() {
       //this.addContainerWindow.show(this.loadModule,this);
    }


 };

 // InputEx needs a correct path to this image
 inputEx.spacerUrl = "/inputex/trunk/images/space.gif";

})();
 