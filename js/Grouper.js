(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    
    WireIt.Grouper = function (layer, baseConfigFunction) {
	this.layer = layer;
	this.baseConfigFunction = baseConfigFunction;
	this.containers = []
	this.setupWidget(Dom.get("groupConfig"));
	this.collapsing = false;
	this.group = new WireIt.Group();
	layer.eventRemoveContainer.subscribe(function(eventName, container) 
	    { 
		if (!this.collapsing)
		    this.remove(container);
	    }, this, true);
    },

    WireIt.Grouper.prototype = {
    
    setupWidget: function(displayDiv)
	{
	    this.display = {};
	    this.display.mainDiv = displayDiv;
	    
	    this.display.buttonsElement = WireIt.cn("div");
	    displayDiv.appendChild(this.display.buttonsElement);
	    
	    var okButton = WireIt.cn("button", {}, {}, "Make Group");
	    okButton.id = "groupConfigOkButton";
	    this.display.buttonsElement.appendChild(okButton);
	    
	    var body = WireIt.cn("div");
	    displayDiv.appendChild(body);
	    
	    var list = WireIt.cn("table", {id: "groupPanelBodyList"});
	    this.display.list = list;
	    body.appendChild(list);
	    
	    var row = WireIt.cn("tr");
	    this.display.listHeadRow = row;
	    
	    list.appendChild(row);
	    row.appendChild(WireIt.cn("th", {}, {}, "Container"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Name"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Visible"));
	    row.appendChild(WireIt.cn("th", {}, {}, "New name"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Show"));
	    	    
	    Event.addListener('groupConfigOkButton','click', function() {
			    alert("ok clicked")
		    }, this, true);
	},
    
    add: function(container) {
		this.containers.push(container);
		this.group.addContainer(container);
		container.addedToGroup()
    },
	
    remove: function(container) {
		this.containers.splice(this.containers.indexOf(container), 1)
		this.group.removeContainer(container);
		container.removedFromGroup();
    },
	
    toggle: function(container) 
    {
	if (this.containers.indexOf(container) == -1)
	    this.add(container)
	else
	    this.remove(container)
    },
    
    collapse: function()
    {
		var configAndWires = this.group.getFullConfigAndWires();
		
		var rows = this.group.generateFieldAndTerminalControls()
		for (var rI in rows)
		{
			var r = rows[cI];
			
			this.display.list.appendChild(r)
		}
		
		var gc = this.layer.addContainer(
			{
				    "xtype": "WireIt.GroupFormContainer",
				    "title": "Group",    

				    "collapsible": true,
				    "fields": [ ],
				    "legend": "Inner group fields",
				    "getBaseConfigFunction" : this.baseConfigFunction,
				    position : configAndWires.center
			}
		    )

		gc.setValue(configAndWires.config);

		this.addExternalWires(gc, configAndWires.wires, configAndWires.config.externalToInternalMap.terminals, this.group.containers);
		
		this.collapsing = true;
		for (var i in this.containers)
		{
		    var elem = this.containers[i]
		    this.layer.removeContainer(elem);
		}
		this.collapsing = false;
		
		this.containers = [];
		this.lastGroupFormContainer = gc;
		
		//this.group = new WireIt.Group();
    },
    

    addExternalWires: function(groupContainer, wireMap, terminalMap, internalContainers)
    {
		var layer = this.layer;
		var getExternalName = function(internalTerminal)
			{
				var internalModuleId = internalContainers.indexOf(internalTerminal.container);
				
				for (var mI in terminalMap)
				{
					var m = terminalMap[mI];
					
					if (m.name == internalTerminal.options.name &&
						m.moduleId == internalModuleId)
						return mI;
				}
				
				throw {"type" : "MappingError", "message" : "Couldn't find internal terminal's external name"};
			}
	
		for (var wI in wireMap)
		{
		    var w = wireMap[wI];
		    
		    var groupFragment = {};
		    groupFragment.moduleId = this.layer.containers.indexOf(groupContainer);
		    groupFragment.terminal = getExternalName(w.groupTerminal);

		    var externalFragment = {};
		    externalFragment.moduleId = this.layer.containers.indexOf(w.externalTerminal.container);
		    externalFragment.terminal = w.externalTerminal.options.name;
		    
		    
		    var wireConfig = { }
		    
		    if (w.groupIsSource)
		    {
				wireConfig.src = groupFragment;
				wireConfig.tgt = externalFragment;
		    }
		    else
		    {
				wireConfig.src = externalFragment;
				wireConfig.tgt = groupFragment;
		    }
		    
		    this.layer.addWire(wireConfig);
		}
    },
   
    expand: function()
    {
		gc.expand();
    }
}
})();