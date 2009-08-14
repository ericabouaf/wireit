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
   //this.addExternalGroupTerminals();
};

YAHOO.lang.extend(WireIt.GroupFormContainer, WireIt.FormContainer, {
   
   /**
    * @method setOptions
    */
   setOptions: function(options) {
      WireIt.GroupFormContainer.superclass.setOptions.call(this, options);
      
      this.options.getBaseConfigFunction = options.getBaseConfigFunction
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
	var mapModuleId = function(offset, moduleId)
	    {
		return parseInt(offset)+parseInt(moduleId);
	    };
	
	var offset = this.layer.containers.length;
	
	var thisConfig = this.getConfig();
	var position = [thisConfig.position[0], thisConfig.position[1]];
	
	for (var mI in this.group.modules)
	{
	    var m = this.group.modules[mI]
	    var baseContainerConfig = this.getBaseConfig(m.name);
	    YAHOO.lang.augmentObject(m.config, baseContainerConfig); //TODO: Might not want to modify the module config here (in case the group can be reshrunk and old vars are used)
	    m.config.title = m.name;
	    var newPos = this.translatePosition(m.config.position, position);
	    m.config.position = newPos;
	    var container = this.layer.addContainer(m.config);
	    //Dom.addClass(container.el, "WiringEditor-module-"+m.name);
	    container.setValue(m.value);
	}
	
	for (var wI in this.group.wires)
	{
	    var w = this.group.wires[wI]

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
		
		var internal = this.group.externalToInternalTerminalMap[t.options.name];
		
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
      //Potentially do fields in the form
      this.removeAllTerminals();
      this.initTerminals(val.terminals);
      this.dd.setTerminals(this.terminals);
   }
   
});
})();