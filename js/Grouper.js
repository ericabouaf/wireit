(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    
    WireIt.Grouper = function (layer, baseConfigFunction) {
	this.layer = layer;
	this.baseConfigFunction = baseConfigFunction;
	this.containers = []
	this.groups = [];
	this.setupWidget(Dom.get("groupConfig"));
	
	//If a container is removed from the layer then remove it from the currently selected groups
	layer.eventRemoveContainer.subscribe(function(eventName, containers) 
	    { 
		this.removeContainer(containers[0]);
	    }, this, true);
	
	//If a container is added to the layer then we want to listen to the focus event so we can show group information
	layer.eventAddContainer.subscribe(function(eventName, container)
	    {
		var display = this.display;
		container[0].eventFocus.subscribe(function(eventName, containers) 
		{ 
		    var container = containers[0];
		    
		    if (lang.isValue(container.group))
		    {
			this.showGroup(container.group);
		    }
		    else
		    {
			this.deselectGroup();
			this.hideGroupConfigure();
		    }
		}, this, true);

	    }, this, true);
	    
	this.rubberband = new WireIt.RubberBand(this);
	
	this.rubberband.style = {};
	this.rubberband.style.position = "absolute";
    },

    WireIt.Grouper.prototype = {

    setupWidget: function(displayDiv)
	{
	    this.display = {};
	    this.display.mainDiv = displayDiv;
	    
	    this.display.buttonsElement = WireIt.cn("div");
	    displayDiv.appendChild(this.display.buttonsElement);
	    
    	    var collapseButton = WireIt.cn("button", {}, {}, "Collapse");
	    collapseButton.id = "groupConfigCollapseButton";
	    this.display.buttonsElement.appendChild(collapseButton);
	    Event.addListener('groupConfigCollapseButton','click', this.groupCollapse, this, true);
	    
	    var groupSelect = WireIt.cn("select");
	    this.display.groupSelect = groupSelect;
	    groupSelect.id = "groupConfigGroupSelect";
	    this.display.buttonsElement.appendChild(groupSelect);
	    
	    Event.addListener('groupConfigGroupSelect','change', function () { this.selectGroup.call(this, groupSelect); } , this, true);
	    
	    var ungroupButton = WireIt.cn("button", {}, {}, "Ungroup");
	    ungroupButton .id = "groupUngroupButton";
	    this.display.buttonsElement.appendChild(ungroupButton);
	    Event.addListener('groupUngroupButton','click', this.unGroup, this, true);
	    
	    
	    var body = WireIt.cn("div");
	    displayDiv.appendChild(body);
	    
	    var list = WireIt.cn("table", {id: "groupPanelBodyList"});
	    this.display.list = list;
	    body.appendChild(list);
	    
	    var row = WireIt.cn("tr");
	    this.display.listHeadRow = row;
	    
	    list.appendChild(row);
	    row.appendChild(WireIt.cn("th", {}, {}, "Name"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Visible"));
	    row.appendChild(WireIt.cn("th", {}, {}, "New name"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Show"));

	    this.hideGroupConfigure();
	},
    
    setDisplay: function (rows)
    {
	this.display.list.innerHTML = "";
	this.display.list.appendChild(this.display.listHeadRow);
	
	for (var rI in rows)
	    this.display.list.appendChild(rows[rI]);
    },
    
    groupCollapse: function()
    {
	if (lang.isValue(this.selectedGroup))
	    this.selectedGroup.collapse();
    },
    
    selectGroup: function(select)
    {
	var index = select.selectedIndex;
	if (index >= 0 && lang.isArray(this.selectedGroups) && index < this.selectedGroups.length)
	{
	    var group = this.selectedGroups[index];
	    this.showGroupConfigure(group);
	}
	else
	{
	    alert("index wrong (" + index + ")");
	}
    },
    
    unGroup: function()
    {
	if (lang.isValue(this.selectedGroup))
	{
	    var selGroup = this.selectedGroup;
	    this.deselectGroup();
	    selGroup.unGroup();
	}
    },
    
    setGroupOptions: function()
    {
	var containerUIMap = this.display.containerUIMap;
	var groupUIMap = this.display.groupUIMap;
	var group = this.selectedGroup;
	
	var checkedOverrides = group.getAndCheckOverrides(containerUIMap, groupUIMap);
	
	if (checkedOverrides.valid)
	    group.setGroupOptions(checkedOverrides.overrides);
	else
	    alert("Validation error, " + checkedOverrides.error.message);
    },
    
    addContainer: function(container) {
	if (lang.isValue(container.group))
	{
	   var group = WireIt.GroupUtils.outerGroup(container.group);
	   
	   this.addGroup(group);
	}
	else if (this.containers.indexOf(container) == -1)
	{
	    this.containers.push(container);
	    
	    container.addedToGroup()	    
	}
    },
	
    removeContainer: function(container, index) {
	if (!lang.isValue(index))
	    index = this.containers.indexOf(container)
	    
	if (index != -1)
	{
	    this.containers.splice(index, 1)
	    //this.group.removeContainer(container);
	    container.removedFromGroup();
	}
	/*else
	    alert("not here");*/
    },
	
    addGroup: function(group)
    {
	if (this.groups.indexOf(group) == -1)
	{
	    this.groups.push(group);
	    var groupSelect = function(g) { WireIt.GroupUtils.applyToContainers(g, true, function(c) { c.addedToGroup() }) };
	    
	    groupSelect(group);
	    
	    group.events.groupEmptied.subscribe(function() { this.removeGroup(group); }, this, true);
	    group.events.containerAdded.subscribe(function(eventName, containers) { containers[0].addedToGroup(); }, this, true);
	    group.events.groupAdded.subscribe(function(eventName, groups) { groupSelect(groups[0]); }, this, true);
	    
	    group.events.containerRemoved.subscribe(function(eventName, containers) { this.addContainer(containers[0]); }, this, true);
	    group.events.groupRemoved.subscribe(function(eventName, groups) { this.addGroup(groups[0]); }, this, true);
	}
    },

    removeGroup: function(group, index)
    {
	if (!lang.isValue(index))
	    index = this.groups.indexOf(group)
	
	if (index != -1)
	{
	    this.groups.splice(index, 1);
	    var containers = [];
	    WireIt.GroupUtils.addAllContainers(group, containers);
	    
	    for (var cI in containers)
		containers[cI].removedFromGroup();
	}
    },

    toggle: function(container) 
    {
	if (lang.isValue(container.group))
	{
	    var group = WireIt.GroupUtils.getOuterGroup(container.group);
	    var index = this.groups.indexOf(group);
	    
	    if (index == -1)
		this.addGroup(group);
	    else
		this.removeGroup(group, index);
	}
	else
	{
	    var index = this.containers.indexOf(container);
	    if (index == -1)
		this.addContainer(container)
	    else
		this.removeContainer(container, index)
	}
    },
    
    makeGroup: function()
    {
	if (this.containers.length > 0 || this.groups.length > 0)
	{
	    var group = new WireIt.Group(this, this.layer);
	    var tempGroups = [];
	    var tempContainers = [];
	    
	    for (var cI in this.containers)
	    {
		var c = this.containers[cI];
	    
		group.addContainer(c);

		tempContainers.push(c);
	    }
	    
	    for (var gI in this.groups)
	    {
		var g = this.groups[gI];

		group.addGroup(g);
		this.layer.removeGroup(g);

		tempGroups.push(g);
	    }
	    
	    for (var tcI in tempContainers)
		this.removeContainer(tempContainers[tcI]);
	    for (var tgI in tempGroups)
		this.removeGroup(tempGroups[tgI]);
		
	    
	    this.layer.groups.push(group);
	    group.events.groupEmptied.subscribe(function() { this.layer.removeGroup.call(this.layer, group); }, this, true);	    
	    
	    this.showGroup(group, true);
	}
    },
    
    showGroup: function(group, forceThisGroup)
    {
	var g;
	if (forceThisGroup)
	    g = group;
	else
	    g = WireIt.GroupUtils.getOuterGroup(group);
	    
	this.showGroupConfigure.call(this, g);
	this.setupSelectedGroups(group);
    },
    
    setupSelectedGroups: function(bottomGroup)
    {
	var selectedGroups = [];
	this.selectedGroups = selectedGroups;
	
	var display = this.display;
	display.groupSelect.innerHTML = "";
	var selectedGroup = this.selectedGroup;
	
	WireIt.GroupUtils.getOuterGroup(bottomGroup, function(current)
	    {
		var option = WireIt.cn("option", {value: "N" + selectedGroups.length}, {}, "N" + selectedGroups.length);
		selectedGroups.push(current);
		
		display.groupSelect.appendChild(option);
		
		if (selectedGroup == current)
		    option.selected = true;
	    }
	    );
    },
    
    showGroupConfigure: function(group, map)
    {
	if (!lang.isValue(group) || lang.isValue(group.groupContainer))
	{
	    hideGroupConfigure(); //TODO: you should be able to modify group mappings while collapsed
	}
	else
	{
	var self = this;
	var ui = group.generateUI(map, function() { self.setGroupOptions.call(self) });
	this.setDisplay(ui.listRows);
	
	this.setSelectedGroup(group);
	this.display.containerUIMap = ui.containerUIMap;
	this.display.groupUIMap = ui.groupUIMap;
	
	group.events.stateChanged.subscribe(function() 
	    {
		this.deselectGroup();
		this.hideGroupConfigure();
	    }, this, true);
	
	this.display.mainDiv.style.display = "block"; //TODO: safter visibility toggle?
	}
    },
    
    hideGroupConfigure: function()
    {
	this.display.mainDiv.style.display = "none";//safter visibility toggle?
    },
    
    setSelectedGroup: function(group)
    {
	this.deselectGroup();
	
	this.selectedGroup = group;
	
	WireIt.GroupUtils.applyToContainers(this.selectedGroup, true, function(c) { c.highlight(); });
    },
    
    deselectGroup: function()
    {
	if (lang.isValue(this.selectedGroup))
	    WireIt.GroupUtils.applyToContainers(this.selectedGroup, true, function(c) { c.dehighlight(); });

	this.selectedGroup = null;
    },
    
    collapse: function(group)
    {
	return group.collapse();
    },
    
   
	generateConfig: function(containers)
	{
		var config = {};
		
		var center = this.workOutCenter(containers);
		config.center = center;
		
		config.group = {};
		config.group.modules = this.getInternalModuleConfig(containers, center);
		config.group.overrides = {} //TODO: might not want to set them to blank
		
		var wires = this.getWireConfig(this.getWires(containers), containers);
		
		config.group.wires = wires.internal;
		
		config.wires = wires.external;
		
		
		return config;
	},
	
	getWires: function(containers)
    {
		var wires = [];
		
		for (var cI in containers)
		{
		    var c = containers[cI];
		    
		    for (var wI in c.wires)
		    {
			var w = c.wires[wI];
			
			if (wires.indexOf(w) == -1) //TODO: is there a nicer way of checking the wire hasn't already been added? if you can't have two wires linking the same terminals maybe make a key from moduleId_Terminal + moduleId_Terminal
			    wires.push(c.wires[wI])
		    }
		}
		
		return wires;
    },
    
    getWireConfig: function(group, getInternalContainerId, getExternalTerminalName)
    {
		var externalWires = [];
		var internalWires = [];
		
		this.addWireConfig(group, getInternalContainerId, getExternalTerminalName, externalWires, internalWires);
		
		return {"external" : externalWires, "internal" : internalWires};
    },
    
    addWireConfig: function(group, getInternalContainerId, getExternalTerminalName, externalWires, internalWires)
    {
		var addWiresForContainer = function(c, getExternalName)
		    {
			for (var wI in c.wires)
			{
			    var w = c.wires[wI];
			    
			    var srcIndex = getInternalContainerId(w.terminal1.container)
			    var tgtIndex = getInternalContainerId(w.terminal2.container)
			    
			    if (srcIndex != -1 && tgtIndex != -1)
			    {
				internalWires.push(
					{
					    src: {moduleId: srcIndex, terminal: w.terminal1.options.name}, 
					    tgt: {moduleId: tgtIndex, terminal: w.terminal2.options.name}
					}
				    );
			    }
			    else
			    {
				var ret = {};
				var et, gt;
				
				if (srcIndex == -1)
				{
				    ret.groupIsSource = false;
				    et = w.terminal1;
				    gt = w.terminal2;
				}
				else
				{
				    ret.groupIsSource = true;
				    et = w.terminal2
				    gt = w.terminal1;
				}
				
				ret.externalName = getExternalName(gt.options.name);
				ret.groupTerminal = gt;
				ret.externalTerminal = et;
			
				externalWires.push(ret);
			    }
			}
		    }
		
		if (lang.isValue(group.groupContainer))
		{
		    addWiresForContainer(group.groupContainer, function(name) { return getExternalTerminalName("group", 0, name); });
		}
		else
		{
		    
		    for (var cI in group.containers)
		    {
			var c = group.containers[cI].container;
			
			addWiresForContainer(c, function(name) { return getExternalTerminalName("container", cI, name); });
		    }
		    
		    for (var gI in group.groups)
		    {
			var g = group.groups[cI].group;
			
			this.addWireConfig(g, getInternalContainerId, getExternalTerminalName, externalWires, internalWires);
		    }
		}
		/*
		for (var wI in wires)
		{
		    var w = wires[wI];
		    
		    var srcIndex = internalContainers.indexOf(w.terminal1.container)
		    var tgtIndex = internalContainers.indexOf(w.terminal2.container)
		    
		    var ret = {};
		    var et, gt;
		    
		    if (srcIndex != -1 && tgtIndex != -1)
		    {
				internalWires.push(
					{
					    src: {moduleId: srcIndex, terminal: w.terminal1.options.name}, 
					    tgt: {moduleId: tgtIndex, terminal: w.terminal2.options.name}
					}
				    );
		    }
		    else 
		    {
				if (srcIndex == -1)
				{
				    ret.groupIsSource = false;
				    et = w.terminal1;
				    gt = w.terminal2;
				}
				else
				{
				    ret.groupIsSource = true;
				    et = w.terminal2
				    gt = w.terminal1;
				}
				
				ret.groupTerminal = gt;
				ret.externalTerminal = et;
			
				externalWires.push(ret);
		    }
		}
		*/
    },
	
	getInternalModuleConfig : function(containers, center)
    {
		var modules = []
		
		for (var cI in containers)
		{
		    var c = containers[cI];
		    var mConfig = c.getConfig();
		    
		    mConfig.position[0] = mConfig.position[0] - center[0];
		    mConfig.position[1] = mConfig.position[1] - center[1];
		    
		    //Add container to group
		    modules.push( {name: c.options.title, value: c.getValue(), config: mConfig});
		}
		
		return modules;
    },
	/*
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
    */

    rubberbandSelect: function()
    {
	for (var cI in this.layer.containers)
	{
	    var c = this.layer.containers[cI];
	    
	    var checkPoints = this.getContainerCorners(c);
	    var inside = true;
	    
	    for (var i in checkPoints)
		inside &= this.rubberband.pointIsInside(checkPoints[i].x, checkPoints[i].y);
		
	    if (inside)
	    {
		this.addContainer(c);
	    }
	}
	
    },
    
    getContainerCorners: function(container)
    {
	var top = container.el.offsetTop;
	var bottom = top+container.el.offsetHeight;
	
	var left = container.el.offsetLeft;
	var right = left+container.el.offsetWidth;
	
	return [
	    {x : left, y: top},
	    {x : left, y: bottom},
	    {x : right, y: top},
	    {x : right, y: bottom}
	];
    },

    workOutCenter: function(containers)
    {
	var bounds = {};
	
	for (var cI in containers)
	{
	    var c = containers[cI]
	    var config = c.getConfig();
	    
	    var left, top;
	    left = config.position[0];
	    top = config.position[1];
	
	    if ((typeof bounds["left"] == "undefined") || bounds["left"] > left)
		bounds["left"] = left;
		
	    if ((typeof bounds["right"] == "undefined") || bounds["right"] < left)
		bounds["right"] = left;

	    if ((typeof bounds["top"] == "undefined") || bounds["top"] > top)
		bounds["top"] = top;

	    if ((typeof bounds["bottom"] == "undefined") || bounds["bottom"] < top)
		bounds["bottom"] = top;
	}
	
	return [
		((bounds.right + bounds.left)/2),
		((bounds.top + bounds.bottom)/2)
	    ];
    },
   
    expand: function()
    {
		gc.expand();
    }
}
})();