(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    
    WireIt.Grouper = function (layer, baseConfigFunction) {
	this.layer = layer;
	this.baseConfigFunction = baseConfigFunction;
	this.containers = []
	this.groups = [];
	this.setupWidget(Dom.get("groupConfig"));
	this.collapsing = false;
	
	//If a container is removed from the layer then remove it from the currently selected groups
	layer.eventRemoveContainer.subscribe(function(eventName, containers) 
	    { 
		if (!this.collapsing)
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
			var group = container.group;
			if (lang.isValue(group.group))
			    group = group.group;
			
			this.showGroupConfigure.call(this, group);
			this.setupSelectedGroups(container.group);
			
			this.display.mainDiv.style.display = "block"; //TODO: safter visibility toggle?
		    }
		    else
		    {
			this.display.mainDiv.style.display = "none";//safter visibility toggle?
		    }
		}, this, true);

	    }, this, true);
    },

    WireIt.Grouper.prototype = {
    
    setupWidget: function(displayDiv)
	{
	    this.display = {};
	    this.display.mainDiv = displayDiv;
	    
	    this.display.buttonsElement = WireIt.cn("div");
	    displayDiv.appendChild(this.display.buttonsElement);
	    
	    var okButton = WireIt.cn("button", {}, {}, "Save");
	    okButton.id = "groupConfigOkButton";
	    this.display.buttonsElement.appendChild(okButton);
	    Event.addListener('groupConfigOkButton','click', this.setGroupOptions, this, true);
	    
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
	    row.appendChild(WireIt.cn("th", {}, {}, "Container"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Name"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Visible"));
	    row.appendChild(WireIt.cn("th", {}, {}, "New name"));
	    row.appendChild(WireIt.cn("th", {}, {}, "Show"));
	    	    
	    /* function() {
			var index = prompt("Collapse which group?", 0);
			
			this.collapse(this.layer.groups[index])
		    }*/
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
	    this.collapse(this.selectedGroup);
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
	    alert("index wrong (" + index);
	}
    },
    
    unGroup: function()
    {
	if (lang.isValue(this.selectedGroup))
	{
	    if (lang.isValue(this.selectedGroup.groupContainer))
	    {
		this.selectedGroup.groupContainer.group = null
	    }
	    else
	    {
		for (var cI in this.selectedGroup.containers)
		{
		    var co = this.selectedGroup.containers[cI];
		    
		    if (lang.isValue(this.selectedGroup.group))
			WireIt.Group.addContainer(this.selectedGroup.group, co.container, co.overrides);
		    else
			c.container.group = null;
		}
		
		for (var gI in this.selectedGroup.groups)
		{
		    var go = this.selectedGroup.groups[gI];
		    
		    if (lang.isValue(this.selectedGroup.group))
			WireIt.Group.addGroup(this.selectedGroup.group, go.group, go.overrides);
		    else
			c.group.group = null;
		}
	    }
	    
	    if (lang.isValue(this.selectedGroup.group))
	    {
		this.selectedGroup.group.groups.splice(this.selectedGroup.group.groups.indexOf(this.selectedGroup), 1);
		this.selectedGroup.group = null;
	    }
	    else
		this.layer.groups.splice(this.layer.groups.indexOf(this.selectedGroup), 1);
	}
    },
    
    setGroupOptions: function()
    {
	var containerUIMap = this.display.containerUIMap;
	var groupUIMap = this.display.groupUIMap;
	var group = this.selectedGroup;
	
	//for the moment set all overrides
	for (var cI in containerUIMap)
	{
	    var c = containerUIMap[cI]
	    
	    for (var fName in c.fields)
	    {
		var f = c.fields[fName];
		var o = {}
		o.visible = f.visible.checked;
		var rename = f.externalName.value;
		
		if (rename.length > 0)
		    o.rename = rename;
				
		group.containers[cI].overrides.fields[fName] = o;
	    }
	    
	    
	    for (var tName in c.terminals)
	    {
		var t = c.terminals[tName];
		var o = {}
		o.visible = t.visible.checked;
		var rename = t.externalName.value;
		
		if (rename.length > 0)
		    o.rename = rename;
				
		group.containers[cI].overrides.terminals[tName] = o;
	    }
	}
	
	for (var gI in groupUIMap)
	{
	    var g = groupUIMap[cI]
	    
	    for (var fName in g.fields)
	    {
		var f = g.fields[fName];
		var o = {}
		o.visible = f.visible.checked;
		var rename = f.externalName.value;
		
		if (rename.length > 0)
		    o.rename = rename;
				
		group.groups[cI].overrides.fields[fName] = o;
	    }
	    
	    
	    for (var tName in g.terminals)
	    {
		var t = g.terminals[tName];
		var o = {}
		o.visible = t.visible.checked;
		var rename = t.externalName.value;
		
		if (rename.length > 0)
		    o.rename = rename;
				
		group.groups[cI].overrides.terminals[tName] = o;
	    }
	}
    },
    
    addContainer: function(container) {
	if (lang.isValue(container.group))
	{
	   var group = WireIt.Group.outerGroup(container.group);
	   
	   this.groups.push(group);
	   var containers = [];
	   var allContainers = WireIt.Group.addAllContainers(group, containers);
	   
	   for (var cI in containers)
	       containers[cI].addedToGroup();
	}
	else
	{
	    this.containers.push(container);
	    container.addedToGroup()	    
	}
    },
	
    removeContainer: function(container, index) {
	if (!lang.isValue(index))
	    index = this.containers.indexOf(container)
	    
	this.containers.splice(index, 1)
	//this.group.removeContainer(container);
	container.removedFromGroup();
    },
	
    addGroup: function(group)
    {
	this.groups.push(group);
	var containers = [];
	WireIt.Group.addAllContainers(group, containers);
	
	for (var cI in containers)
	    containers[cI].addedToGroup();
    },

    removeGroup: function(group, index)
    {
	this.groups.splice(index, 1);
	var containers = [];
	WireIt.Group.addAllContainers(group, containers);
	
	for (var cI in containers)
	    containers[cI].removedFromGroup();
    },

    toggle: function(container) 
    {
	if (lang.isValue(container.group))
	{
	    var group = WireIt.Group.getOuterGroup(container.group);
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
	var group = {containers : [], groups : [], properties : {}};
	var tempGroups = [];
	var tempContainers = [];
	
	for (var cI in this.containers)
	{
	    var c = this.containers[cI];
	
	    WireIt.Group.addContainer(group, c);

	    tempContainers.push(c);
	}
	
	for (var gI in this.groups)
	{
	    var g = this.groups[gI];

	    WireIt.Group.addGroup(group, g);

	    tempGroups.push(g);
	}
	
	for (var tcI in tempContainers)
	    this.removeContainer(tempContainers[tcI], this.containers.indexOf(tcI));
	for (var tgI in tempGroups)
	    this.removeGroup(tempGroups[tgI], this.groups.indexOf(tgI));
	    
	
	this.layer.groups.push(group);
	
	//this.containers = [];
	
	//this.collapse(group);
	
	
	/*
	WireIt.Group.serialiseGroup(group, this.layer.containers);
	
	var map = WireIt.Group.getMap(group);
	
	console.log(fieldConfigs)
	console.log(terminalConfigs);

	
	var things = this.generateFieldAndTerminalControls(map);
	
	for (var r in things.listRows)
	    this.display.list.appendChild(things.listRows[r])
	
	*/
	
    },
    
    setupSelectedGroups: function(bottomGroup)
    {
	var selectedGroups = [];
	this.selectedGroups = selectedGroups;
	
	var display = this.display;
	display.groupSelect.innerHTML = "";
	var selectedGroup = this.selectedGroup;
	
	WireIt.Group.getOuterGroup(bottomGroup, function(current)
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
	if (!lang.isValue(map))
	    map = WireIt.Group.getMap(group)
	
	var things = this.generateFieldAndTerminalControls(map, group);
	this.setDisplay(things.listRows);
	
	this.setSelectedGroup(group);
	this.display.containerUIMap = things.containerUIMap;
	this.display.groupUIMap = things.groupUIMap;
    },
    
    setSelectedGroup: function(group)
    {
	if (lang.isValue(this.selectedGroup))
	    WireIt.Group.applyToContainers(this.selectedGroup, true, function(c) { c.dehighlight(); });
	
	this.selectedGroup = group;
	
	WireIt.Group.applyToContainers(this.selectedGroup, true, function(c) { c.highlight(); });
    },
    
    collapse: function(group, expanded)
    {
	if (lang.isValue(group.groupContainer))
	    return group.groupContainer; //This group is already collapsed
	
	var hi = "bye";
	var popoporujrnr
	for (popoporujrnr in group.groups)
	{
	    this.collapse(group.groups[popoporujrnr].group, true);
	    
	    var eropuzshbdfkbrwekjsdxn = 7;
	}
	
	var map = WireIt.Group.getMap(group);
	var collapsedConfig = WireIt.Group.getCollapsedConfig(group, map);
	var containers = [];
	WireIt.Group.addAllContainers(group, containers);
	var sGroup = WireIt.Group.serialiseGroup(group, containers);
	
	var modules = this.getInternalModuleConfig(containers, collapsedConfig.center);
	var getInternalContainerId = function(container)
	    {
		return containers.indexOf(container);
	    }
	
	var getExternalTerminalName = function(type, index, name)
	    {
		var submap;
		
		if (type == "container")
		    submap = map.containerMap;
		else
		    submap = map.groupMap;

		
		var terminal = submap[index].terminals[name];
		
		if (lang.isObject(terminal))
		    return terminal.externalName;
		else
		{
		    var field = submap[index].fields[name]
		    
		    if (lang.isObject(field) && field.fieldConfig.inputParams.wirable)
			return field.externalName;
		}
		   
	    };
	
	var wires = this.getWireConfig(group, getInternalContainerId, getExternalTerminalName);

	var gc = this.layer.addContainer(
				{
					    "xtype": "WireIt.GroupFormContainer",
					    "title": "Group",    

					    "collapsible": true,
					    "fields": collapsedConfig.fields,
					    "terminals" : collapsedConfig.terminals,
					    "legend": "Inner group fields",
					    "getBaseConfigFunction" : this.baseConfigFunction,
					    groupConfig : {"group" : sGroup, "center": collapsedConfig.center, "modules" : modules, "wires" : wires.internal, "map" : WireIt.Group.getExternalToInternalMap(map)},
					    position : collapsedConfig.position
				}
			)
	
	this.addExternalWires(gc, wires.external);
//TODO: place in tempory vars since removing from layer could remove from group in future

	var index;
	for (index in group.containers)
	    this.layer.removeContainer(group.containers[index].container);
	    
	    
	for (index in group.groups)
	    this.removeGroupFromLayer(group.groups[index].group)

	gc.group = group
	group.containers = null;
	group.groups = null;
	group.groupContainer = gc;
	group.properties.expanded = lang.isValue(expanded) ? expanded : false;
	return gc;
    },
    
    removeGroupFromLayer: function(group)
    {
	var index = this.layer.groups.indexOf(group);
	
	if (index != -1)
	    this.layer.groups.splice(index, 1);
	
	if (lang.isValue(group.groupContainer))
	{
	    this.layer.removeContainer(group.groupContainer)
	}
	else
	{
	    for (var i in group.containers)
	    {
		var elem = group.containers[i].container
		this.layer.removeContainer(elem);
	    }
	
	    for (var i in group.groups)
	    {
		var g = group.groups[i].group;
		this.removeGroupFromLayer(g);
	    }
	}
    },
    
    
    generateFieldAndTerminalControls: function(map, group)
    {
	listRows = [];
	var configUITerminalMap = {};
	var configUIFieldMap = {};
	var layer = this.layer;
	var self = this;
	
	var addRemapInput = function(name, moduleId, showOn, showCancel, defaultVisible, defaultName, nameReadOnly, visibleReadOnly)
	    {
		var addTds = function(row) {
			tds = [];
			
			for(var i = 0; i < 5; i++)
			{
			    var td = WireIt.cn("td")
			    tds.push(td);
			    row.appendChild(td);
			}
			
			return tds;
		    }
		
		var row = WireIt.cn("tr")
		row.onmouseover = showOn
		row.onmouseout = showCancel
		
		var focusable = []
		
		var visible = WireIt.cn("input", {"type" : "checkbox"});
		visible.checked = (typeof defaultVisible == "undefined") ? "" : defaultVisible;
		visible.disabled = visibleReadOnly
		focusable.push(visible);
		
		var externalName = WireIt.cn("input", {"type" : "text"});
		externalName.disabled = nameReadOnly;
		externalName.value = (typeof defaultName == "undefined") ? "" : defaultName
		
		focusable.push(externalName);
		
		var tds = addTds(row);
		
		tds[0].innerHTML = "TITLE";
		tds[1].innerHTML = name;
		tds[2].appendChild(visible);
		tds[3].appendChild(externalName);
		
		var sideSelect = WireIt.cn("select");
		sideSelect.appendChild(WireIt.cn("option", {value: "top"}, {}, "Top"));
		sideSelect.appendChild(WireIt.cn("option", {value: "bottom"}, {}, "Bottom"));
		sideSelect.appendChild(WireIt.cn("option", {value: "left"}, {}, "Left"));
		sideSelect.appendChild(WireIt.cn("option", {value: "right"}, {}, "Right"));
		
		focusable.push(sideSelect)
		
		tds[4].appendChild(sideSelect);
		/*
		var showButton = WireIt.cn("button", {}, {}, "Show")
		showButton.onmousedown = showOn
		showButton.onmouseup = showCancel; 
		showButton.onmouseout = showCancel;
		
		tds[5].appendChild(showButton);*/
		listRows.push(row)

		for (var i in focusable)
		{
		    var f = focusable[i];
		    f.onfocus = showOn
		    f.onblur = showCancel
		}

		return {"visible": visible, "externalName":  externalName, "side" : sideSelect};
	    }
    
    
	var addTerminal = function(internalName, tMap, moduleId, fieldTerminals, showOn, showOff)
	    {
		var visibleReadOnly = false;
		var defaultVisible = false;
		var nameReadOnly = false;
		
		var fieldTerminal = fieldTerminals[internalName];
		if (!lang.isValue(fieldTerminal))
		{
		    var fragment = addRemapInput(internalName, moduleId, function() { showOn(moduleId) }, function() { showOff(moduleId) }, tMap.visible,  lang.isValue(tMap.externalName) ? tMap.externalName : "");
		
		    //if (!lang.isValue(configUITerminalMap[moduleId]))
		    // configUITerminalMap[moduleId] = {};
			
		    //configUITerminalMap[moduleId][internalName] = fragment;
		    return fragment;
		}
	    }
	
	var addField = function(internalName, fMap, moduleId, fieldTerminals, showOn, showOff)
	    {
		var visibleReadOnly = false;
		var defaultVisible = false;
		if (fMap.fieldConfig.inputParams.wirable)
		{
		    fieldTerminals[internalName] = true;
		}
		
		var fragment = addRemapInput(internalName, moduleId, function() { showOn(moduleId) }, function() { showOff(moduleId) }, fMap.visible, lang.isValue(fMap.externalName) ? fMap.externalName : "");
		
		//if (!lang.isValue(configUIFieldMap[moduleId]))
		//	configUIFieldMap[moduleId] = {};
			
		//configUIFieldMap[moduleId][internalName] = fragment
		return fragment
	    }
	
	var containerUIMap = [];
	var groupUIMap = [];
	
	var addControls = function (fieldsAndTerminals, results, showOnByIndex, showOffByIndex)
	{
	    for (var cI in fieldsAndTerminals)
	    {
		var c = fieldsAndTerminals[cI];
		var fieldTerminals = {};
		var index = cI;
		
		var fields = {}
		var terminals = {}
		
		for (var fName in c.fields)
		{
		    var fMap = c.fields[fName];
		    
		    fields[fName] = addField(fName, fMap, cI, fieldTerminals, showOnByIndex, showOffByIndex);
		}
		
		for (var tName in c.terminals)
		{
		    var tMap = c.terminals[tName];
		    
		    var tFragment = addTerminal(tName, tMap, cI, fieldTerminals, showOnByIndex, showOffByIndex);
		    
		    if (lang.isValue(tFragment))
			terminals[tName] = tFragment;
		}
		
		results.push({"fields" : fields, "terminals" : terminals});
	    }
	};
	
	
	addControls(map.containerMap, containerUIMap, function(index) 
	    { 
		self.layer.setSuperHighlighted([group.containers[index].container]) 
	    }, function(index) 
		{ 
		    self.layer.unsetSuperHighlighted(); 
		}
	    );
	    
	addControls(map.groupMap, groupUIMap, function(index) 
	    { 
		var containers = [];
		WireIt.Group.applyToContainers(group.groups[index].group, true, function(c) { containers.push(c) });
		self.layer.setSuperHighlighted(containers);
		
	    }, function(index) 
		{ 
		    self.layer.unsetSuperHighlighted();
		}
	    );
	
	//this.configUITerminalMap = configUITerminalMap;
	//this.configUIFieldMap = configUIFieldMap;
	    
	return { 
		"listRows" : listRows,
		"containerUIMap": containerUIMap,
		"groupUIMap": groupUIMap
	    };
    },
    /*
	collapse: function()
	{
		var config = this.generateConfig(this.containers);
		var gc = this.layer.addContainer(
				{
					    "xtype": "WireIt.GroupFormContainer",
					    "title": "Group",    

					    "collapsible": true,
					    "fields": [ ],
					    "legend": "Inner group fields",
					    "getBaseConfigFunction" : this.baseConfigFunction,
					    groupConfig : config.group,
					    position : config.center
				}
			)
			
		var fieldConfigs = WireIt.Group.fieldConfigsFromModules(config.group.modules, this.baseConfigFunction);
		var terminalConfigs = WireIt.Group.terminalConfigsFromModules(config.group.modules, this.baseConfigFunction);
		
		var getExternalTerminalName = function(name, moduleId)
		    {
			WireIt.Group.getExternalTerminalName(name, moduleId, fieldConfigs, terminalConfigs);
		    };
			
		this.addExternalWires(gc, config.wires, this.containers, getExternalTerminalName);
		
		
		this.collapsing = true;
		for (var i in this.containers)
		{
		    var elem = this.containers[i]
		    this.layer.removeContainer(elem);
		}
		this.collapsing = false;
		
		this.containers = [];
		this.lastGroupFormContainer = gc;
	},
	*/
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

    addExternalWires: function(groupContainer, wireMap)
    {
		var layer = this.layer;
	
		for (var wI in wireMap)
		{
		    var w = wireMap[wI];
		    
		    var groupFragment = {};
		    groupFragment.moduleId = this.layer.containers.indexOf(groupContainer);
		    groupFragment.terminal = w.externalName;

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