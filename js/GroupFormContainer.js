(function() {
   
   var util = YAHOO.util;
   var Dom = util.Dom, Event = util.Event, CSS_PREFIX = "WireIt-";

/**
 * Class used to build a container with inputEx forms
 * @class FormContainer
 * @namespace WireIt
 * @extends WireIt.Container
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.GroupFormContainer = function(options, layer) {
   WireIt.GroupFormContainer.superclass.constructor.call(this, options, layer);
  
   this.getBaseConfig = this.options.getBaseConfigFunction;
   var intermediate = WireIt.Group.generateFields(this.options.groupConfig); //TODO: wrong arguments
   this.options.fields = intermediate.fields;
   this.options.terminals = WireIt.Group.generateTerminals(this.options.groupConfig, intermediate.usedTerminalNames);
};

YAHOO.lang.extend(WireIt.GroupFormContainer, WireIt.FormContainer, {
   
   /**
    * @method setOptions
    */
   setOptions: function(options) {
      WireIt.GroupFormContainer.superclass.setOptions.call(this, options);
      
      this.options.getBaseConfigFunction = options.getBaseConfigFunction
	  this.options.groupConfig = options.groupConfig;
   },

   /**
    * The render method is overrided to call renderForm
    * @method render
    */
   render: function() {
      WireIt.GroupFormContainer.superclass.render.call(this);
      this.renderExpand();
   },

    renderExpand: function() {
	buttonEl = inputEx.cn('button');
	buttonEl.appendChild(document.createTextNode("Expand"));
	Event.addListener(buttonEl, "click", this.expand, this, true);
	
	this.bodyEl.insertBefore(buttonEl, this.bodyEl.childNodes[0]);
    },

    expand: function() 
    {
		var expandedContainers = WireIt.Group.expand(this.options.groupConfig, this, this.layer);
		/*
		var mapModuleId = function(offset, moduleId)
		    {
			return parseInt(offset)+parseInt(moduleId);
		    };
		
		var offset = this.layer.containers.length;
		
		var thisConfig = this.getConfig();
		var position = [thisConfig.position[0], thisConfig.position[1]];
		
		var expandedContainers = [];
		
		for (var mI in this.group.internalConfig.modules)
		{
		    var m = this.group.internalConfig.modules[mI];
		    
		    var baseContainerConfig = this.getBaseConfig(m.name);
		    var newConfig = YAHOO.lang.JSON.parse( YAHOO.lang.JSON.stringify( m.config ) ) //TODO: nasty deep clone, probably breaks if you have DOM elements in your config or something
		    YAHOO.lang.augmentObject(newConfig , baseContainerConfig);
		    newConfig.title = m.name;
		    var newPos = this.translatePosition(newConfig.position, position);
		    newConfig.position = newPos;
		    var container = this.layer.addContainer(newConfig);
		    //Dom.addClass(container.el, "WiringEditor-module-"+m.name);
		    container.setValue(m.value);
		    
		    expandedContainers.push(container);
		}
		
		for (var fName in this.form.inputsNames)
		{
		    var f = this.form.inputsNames[fName];
		    var internal = WireIt.Group.getInternalField(this.options.groupConfig, fName);
		    
		    var container = expandedContainers[internal.moduleId];
		    
		    container.form.inputsNames[internal.name].setValue(f.getValue());
		}
		
		for (var wI in this.group.internalConfig.wires)
		{
		    var w = this.group.internalConfig.wires[wI]

		    this.layer.addWire(
			{
				"src":{
					"moduleId": mapModuleId(offset, w.src.moduleId),
					"terminal": w.src.terminal
				},
				"tgt":{
					"moduleId": mapModuleId(offset, w.tgt.moduleId),
					"terminal": w.tgt.terminal
				}
			}
		    );
		}
		
		
		//Remap current external wires to their corresponding internal containers
		for (var tI in this.terminals)
		{
		    var t = this.terminals[tI]
		    
		    for (var wI in t.wires)
		    {
				var w = t.wires[wI]
				
				var internal = WireIt.Group.getInternalTerminal(this.options.groupConfig, t.options.name);
				
				var wire = {}
				
				var thisC = {"moduleId" : mapModuleId(offset, internal.moduleId), "terminal" : internal.name}
				
				if (w.terminal1 == t)
				{
				    wire.src = thisC
				    wire.tgt = {"moduleId" : this.layer.containers.indexOf(w.terminal2.container), "terminal" : w.terminal2.options.name}
				}
				else
				{
				    wire.tgt = thisC
				    wire.src = {"moduleId" : this.layer.containers.indexOf(w.terminal1.container), "terminal" : w.terminal1.options.name}		    
				}
				
				this.layer.addWire(wire);
		    }
		}

		*/
		this.layer.removeContainer(this);
    },

    translatePosition: function(modulePosition, position)
    {
		return [ Math.max(0, modulePosition[0]+position[0]), Math.max(0, modulePosition[1]+position[1]) ];
    },

   /**
    * @method getValue
    */
   getValue: function() {
      return this.group;
   },
   
   /**
    * @method setValue
    */
   setValue: function(val) {
      this.group = val;
    
      //Terminals
      this.removeAllTerminals();
      this.initTerminals(val.terminals);
      this.dd.setTerminals(this.terminals);
      
    //Fields - have to go after terminal stuff since fields create their own terminals and above stuff would destroy them
      this.options.fields = val.fields;
      this.form.destroy();
      this.renderForm();      
   }
   
});
})();