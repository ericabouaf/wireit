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
  
   this.group = {wires : [], modules: [], externalToInternalTerminalMap : {}};
   this.addExternalGroupTerminals();
};

YAHOO.lang.extend(WireIt.GroupFormContainer, WireIt.FormContainer, {
   
   /**
    * @method setOptions
    */
   setOptions: function(options) {
      WireIt.GroupFormContainer.superclass.setOptions.call(this, options);
      
      //this.options.groupWorking = options.groupWorking;
      this.options.groupContainers = options.groupContainers;
      this.options.getBaseConfigFunction = options.getBaseConfigFunction
   },
   
   addExternalGroupTerminals: function() {
       var positionByNumber = function(n,N) {
			// n is expected to run from 0 to N-1, where N is the number of terminals on an edge
			var terminal_width = 30;
			var range = terminal_width * (N-1);
			var half_range = range / 2;
			var pos = 100 / 2;
			pos -= half_range - n*terminal_width;
			var offset = terminal_width / 2;
			return pos-offset; // position in centre of terminal
		};
       
       
       outerTerminals = []
       thisIsSource = []
       for (var cI in this.options.groupContainers)
       {
	   var c = this.options.groupContainers[cI];
	   
	   //Add container to group
	   this.group.modules.push( {name: c.options.title, value: c.getValue(), config: c.getConfig()});
	   
	   for (var wI in c.wires)
	   {
	       var w = c.wires[wI]
	       var srcContainer = w.terminal1.container;
       
		//Handle wires going to inputs (check the dflyname property)
	       if (srcContainer == c)
	       {
		   var targetTerminal = w.terminal2
		   if (this.options.groupContainers.indexOf(targetTerminal.container) == -1)
		   {
		    var t = w.terminal1
		    
		    //Do stuff
			terminal =  {
			    name: t.options.name + "_" + outerTerminals.length,
			    direction: t.options.direction,
	/*				    offsetPosition: {
				    left: positionByNumber(i,N),
				    top: -15
			    }, */
			    ddConfig: t.options.ddConfig
			}
		    
			outerTerminals.push({"terminal": terminal, "isSource" : true, "otherTerminal" : w.terminal2})
			
			this.group.externalToInternalTerminalMap[terminal.name] = {moduleId : cI, name: t.options.name}
		   }
		   else
		   {
		       //The wire is internal so add to group
		       
			var wireObj = { 
			    src: {moduleId: WireIt.indexOf(w.terminal1.container, this.options.groupContainers), terminal: w.terminal1.options.name}, 
			    tgt: {moduleId: WireIt.indexOf(w.terminal2.container, this.options.groupContainers), terminal: w.terminal2.options.name}
			};
			this.group.wires.push(wireObj);
		    }
	       } 
	       else if (this.options.groupContainers.indexOf(srcContainer) == -1)
	       {
		   var t = w.terminal2;
		   
		   //Do other outer linking stuff
		   terminal =  {
				    name: t.options.name + "_" + outerTerminals.length,
				    direction: t.options.direction,
/*				    offsetPosition: {
					    left: positionByNumber(i,N),
					    top: -15
				    }, */
				    ddConfig: t.options.ddConfig
				}
		
		    outerTerminals.push({"terminal": terminal, "isSource" : false, "otherTerminal" : w.terminal1})
		    this.group.externalToInternalTerminalMap[terminal.name] = {moduleId : cI, name: t.options.name}
	       }//Do nothing for non source terminals
	   }
       }
       
       var i, N;
       N = outerTerminals.length;
       this.wiring = []
       for (i = 0; i < N; i++)
       {
	   var ot = outerTerminals[i];

	   ot.terminal.offsetPosition = {
						left: positionByNumber(i,N),
						top: -15
					};
	  
	   var fullTerminal = this.addTerminal(ot.terminal);
	   
	   wire = {}
	   if (ot.isSource)
	   {
	       wire.target = ot.otherTerminal;
	       wire.source = fullTerminal;
	   }
	   else
	   {
	       wire.source = ot.otherTerminal;
	       wire.target = fullTerminal;	       
	   }
	   
	   this.wiring.push(wire)
       }

   },

    addWires: function() {

       for (var i in this.wiring)
       {
	   var w = this.wiring[i];
	   var sourceModuleId = this.layer.containers.indexOf(w.source.container);
	   var targetModuleId = this.layer.containers.indexOf(w.target.container)
	   
	    this.layer.addWire(
		{
		    "src":{
			    "moduleId": sourceModuleId,
			    "terminal": w.source.options.name
		    },
		    "tgt":{
			    "moduleId": targetModuleId,
			    "terminal": w.target.options.name
		    }
		}
	    );
       }
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
	
	for (var mI in this.group.modules)
	{
	    var m = this.group.modules[mI]
	    var baseContainerConfig = this.getBaseConfig(m.name)
	    YAHOO.lang.augmentObject(m.config, baseContainerConfig); 
	    m.config.title = m.name;
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

   /**
    * @method getValue
    */
   getValue: function() {
      return this.form.getValue();
   },
   
   /**
    * @method setValue
    */
   setValue: function(val) {
      this.form.setValue(val);
   }
   
});
})();