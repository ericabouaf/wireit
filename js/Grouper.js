(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    
    WireIt.Grouper = function (layer, baseConfigFunction) {
	this.layer = layer;
	this.baseConfigFunction = baseConfigFunction;
	this.containers = []
	this.setupPanel();
	this.collapsing = false;
	layer.eventRemoveContainer.subscribe(function(eventName, container) 
	    { 
		if (!this.collapsing)
		    this.remove(container);
	    }, this, true);
    },

    WireIt.Grouper.prototype = {
    
    setupPanel: function() {
	this.panel = {};
	
	var pel = new widget.Panel('WiringEditor-grouperPanel', {
		fixedcenter: true,
		draggable: true,
		width: '500px',
		visible: false,
		modal: true
	    });
	this.panel.panelElement = pel;
	
	pel.setHeader("Grouping");
	
	var outer = WireIt.cn("span");
	pel.setBody(outer);
	
	this.panel.buttonsElement = WireIt.cn("div");
	outer.appendChild(this.panel.buttonsElement);
	
	var okButton = WireIt.cn("button", {}, {}, "Make Group");
	okButton.id = "groupPanelOkButton";
	this.panel.buttonsElement.appendChild(okButton);
	
	var body = WireIt.cn("div");
	outer.appendChild(body);
	
	var list = WireIt.cn("table", {id: "groupPanelBodyList"});
	this.panel.list = list;
	body.appendChild(list);
	
	var row = WireIt.cn("tr");
	this.panel.listHeadRow = row;
	
	list.appendChild(row);
	row.appendChild(WireIt.cn("th", {}, {}, "Container"));
	row.appendChild(WireIt.cn("th", {}, {}, "Name"));
	row.appendChild(WireIt.cn("th", {}, {}, "Visible"));
	row.appendChild(WireIt.cn("th", {}, {}, "New name"));
	row.appendChild(WireIt.cn("th", {}, {}, "Show"));
	
	pel.render(document.body);
	
	Event.addListener('groupPanelOkButton','click', function() {
			this.collapse2()
		}, this, true);
    },
    
    add: function(container) {
	this.containers.push(container)
	container.addedToGroup()
    },
	
    remove: function(container) {
	this.containers.splice(this.containers.indexOf(container), 1)
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
	
	
	if (this.containers.length == 0)
	{
	    alert("No containers selected, use the G in the top right corner to select containers");
	    return;
	}
	
	var list = this.panel.list;
	var configUITerminalMap = [];
	var configUIFieldMap = [];
	var layer = this.layer;
	
	var centerLayer = function (elem, layerElem)
		{

		    layerElem.scrollTop = elem.offsetTop+elem.offsetHeight-(layerElem.offsetHeight/2);
		    layerElem.scrollLeft = elem.offsetLeft+elem.offsetWidth-(layerElem.offsetWidth/2);
		}
	
	var addRemapInput = function(name, moduleId, moduleTitle, showOn, showCancel, defaultVisible, defaultName)
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
		
		var visible = WireIt.cn("input", {"type" : "checkbox"});
		visible.checked = (typeof defaultVisible == "undefined") ? "" : defaultVisible;
		
		var externalName = WireIt.cn("input", {"type" : "text"});
		externalName.value = (typeof defaultName == "undefined") ? "" : defaultName
		
		var tds = addTds(row);
		
		tds[0].innerHTML = moduleTitle;
		tds[1].innerHTML = name;
		tds[2].appendChild(visible);
		tds[3].appendChild(externalName);
		
		var showButton = WireIt.cn("button", {}, {}, "Show")
		showButton.onmousedown = showOn
		showButton.onmouseup = showCancel; 
		showButton.onmouseout = showCancel;
		
		tds[4].appendChild(showButton);
		list.appendChild(row)
		
		return {"visible": visible, "externalName":  externalName, "moduleId" : moduleId, "internalName" : name};
	    }
	
	
	var addTerminal = function(t, moduleId)
	    {
		showOn = function()
			{ 
			    centerLayer(t.container.el, layer.el);
			    t.setDropInvitation(true); 
			};
			
		showCancel = function () { t.setDropInvitation(false);  };
		var fragment = addRemapInput(t.options.name, moduleId, t.container.options.title, showOn, showCancel, false,  t.options.name);
		
		fragment.terminal = t;
		configUITerminalMap.push(fragment);
	    }
	
	var addField = function(field, moduleId)
	    {
		var bg = field.divEl.style.backgroundColor;
		    
		showOn = function()
		    { 
			centerLayer(field.options.container.el, layer.el);
			field.divEl.style.backgroundColor = "yellow"; 
		    };
		showCancel = function () { field.divEl.style.backgroundColor = bg;  };
		
		var fragment = addRemapInput(field.options.name, moduleId, field.options.container.options.title, showOn, showCancel, false,  field.options.name);
		
		fragment.field = field;
		configUIFieldMap.push(fragment)
	    }
	
	this.panel.list.innerHTML = "";
	this.panel.list.appendChild(this.panel.listHeadRow);
	
	for(var cI = 0; cI < this.containers.length; cI++)
	{
	    var c = this.containers[cI]
	    
	    if ((typeof c.form) == "object")
	    {
		for (var fI in c.form.inputs)
		{
		    var f = c.form.inputs[fI]
		    
		    addField(f, cI)
		}
	    }
	    for (var tI in c.terminals)
	    {
		var t = c.terminals[tI]
		
		addTerminal(t, cI)
	    }
	}
	
	this.configUITerminalMap = configUITerminalMap;
	this.configUIFieldMap = configUIFieldMap;
	
	console.log("from collapse");
	console.log(this);
	this.panel.panelElement.show();
    },
    
    collapse2: function()
    {
	try
	{
	    var mappingConfig = this.processMappingConfig();
	
	
	    var working = this.groupConfig(this.containers, mappingConfig)
	    
	    if (working.wires.cut.length > 0)
	    {
		var sure = confirm("Some wires linking to external containers are not visible, they will be cut.\nAre you sure you want to proceed?");
		if (!sure)
		    return;
	    }
		
	    var gc = this.layer.addContainer(
		{
			    "xtype": "WireIt.GroupFormContainer",
			    "title": "Group",    

			    "collapsible": true,
			    "fields": [ ],
			    "legend": "Inner group fields",
			    "getBaseConfigFunction" : this.baseConfigFunction,
			    position : working.container.position
		}
	    )

	    gc.setValue(working.group);

	    this.addExternalWires(gc, working.wires.external);
	    
	    this.collapsing = true;
	    for (var i in this.containers)
	    {
		var elem = this.containers[i]
		this.layer.removeContainer(elem);
	    }
	    this.collapsing = false;
	    
	    this.containers = [];
	    this.configUITerminalMap = [];
	    this.lastGroupFormContainer = gc;
	    this.panel.panelElement.hide();
	}
	catch (ex)
	{
	    if ((typeof(ex) == "object") && (typeof ex.type != "undefined"))
	    {
		if (ex.type == "TerminalMappingError")
		{
		    alert(ex.message);
		    return;
		}
	    }
	    
	    throw ex
	}
    },
    
    processMappingConfig: function()
    {
	var positionByNumber = function(n,N) {
			// n is expected to run from 0 to N-1, where N is the number of terminals on an edge
			var terminal_width = 30;
			var range = terminal_width * (N-1);
			var half_range = range / 2;
			var pos = 250 / 2;
			pos -= half_range - n*terminal_width;
			var offset = terminal_width / 2;
			return pos-offset; // position in centre of terminal
		};
	
	var config = { "terminals" : [] }
	var visibleNames = {};
	var list = this.panel.list;
	
	console.log("terminal map thing is ")
	console.log(this.configUITerminalMap);
	
	var i, N;
	N = this.configUITerminalMap.length;
	for (var nI = 0; nI < N; nI++)
	{
	    var tMap = this.configUITerminalMap[nI];
	    var t = tMap.terminal;
	    
	    console.log("On node " + nI + " and the terminal is: ");
	    console.log(t);
	    
	    var terminalConfig = {}
	    var name = tMap.externalName.value;
	    var visible = tMap.visible.checked;
	    
	    if (visible)
	    {
		if (name == null || name.length == 0)
		    throw {"type" : "TerminalMappingError", "message" : "External terminal name was blank (" + tMap.internalName + ")"}
		
		if ((typeof visibleNames[name]) != "undefined")
		    throw {"type": "TerminalMappingError", "message": "Duplicate terminal name (" + name + ")"}
		else
		    visibleNames[name] = true;
	    }
	    
	    terminalConfig.terminal = t;
	    terminalConfig.moduleId = tMap.moduleId;
	    terminalConfig.external = visible;
	    terminalConfig.config = {};
	    terminalConfig.config.name = name;
	    terminalConfig.config.direction = t.options.direction;
	    terminalConfig.config.offsetPosition = {
		    left : positionByNumber(nI, N),
		    top : -15
		};
		
	    terminalConfig.config.ddConfig = t.options.ddConfig;
	    
	    
	    
	    config.terminals.push(terminalConfig);
	}
	
	return config;
    },
    
    addExternalWires: function(groupContainer, wireMap)
    {
	for (var wI in wireMap)
	{
	    var w = wireMap[wI];
	    
	    groupFragment = {};
	    groupFragment.moduleId = this.layer.containers.indexOf(groupContainer);
	    groupFragment.terminal = w.groupTerminalName;
	    
	    var wireConfig = { }
	    
	    if (w.groupIsSource)
	    {
		wireConfig.src = groupFragment;
		wireConfig.tgt = w.external;
	    }
	    else
	    {
		wireConfig.src = w.external;
		wireConfig.tgt = groupFragment;
	    }
	    
	    this.layer.addWire(wireConfig);
	}
    },
    
    groupConfig: function(containers, config)
    {
	var getWireType = function(wire, layer)
	    //Pre: the wire is connected to at least 1 interal container
	    {
		var srcExternal = (containers.indexOf(wire.terminal1.container) == -1)
		var tgtExternal = (containers.indexOf(wire.terminal2.container) == -1)
		
		var ret = {};
		var et;
		if (srcExternal)
		{
		    ret.groupIsSource = false;
		    et = wire.terminal1
		} 
		else if (tgtExternal)
		{
		    ret.groupIsSource = true;
		    et = wire.terminal2
		} 
		else
		{
		    return {"internal" : true}
		}
		
		ret.external = {};
		ret.external.moduleId = layer.containers.indexOf(et.container);
		ret.external.terminal = et.options.name;
		
		return ret;
	    }
	    
	var externalWires = [];
	var cutWires = [];
	var group = {wires : [], modules: [], externalToInternalTerminalMap : {}, terminals : []};
	var terminals = group.terminals;
	
	var center = this.workOutCenter(containers);
		
	for (var cI in containers)
	{
	    var c = containers[cI];
	    var mConfig = c.getConfig();
	    
	    mConfig.position[0] = mConfig.position[0] - center[0];
	    mConfig.position[1] = mConfig.position[1] - center[1];
	    
	    //Add container to group
	    group.modules.push( {name: c.options.title, value: c.getValue(), config: mConfig});
	}
	
	
	for (var tI in config.terminals)
	{
	    var tConfig = config.terminals[tI]
	    var t = tConfig.terminal;
	    if (tConfig.external)
	    {
		terminals.push(tConfig.config);
		group.externalToInternalTerminalMap[tConfig.config.name] = {moduleId : tConfig.moduleId, name: t.options.name}
	    }
	    
	    for (var wI in t.wires)
	    {
		var w = t.wires[wI];
		
		var wType = getWireType(w, this.layer);
		
		if (wType.internal)
		{
		    var wireObj = { 
			src: {moduleId: WireIt.indexOf(w.terminal1.container, containers), terminal: w.terminal1.options.name}, 
			tgt: {moduleId: WireIt.indexOf(w.terminal2.container, containers), terminal: w.terminal2.options.name}
		    };
		    
		    group.wires.push(wireObj);
		}
		else
		{
		    var wireFragment = {groupTerminalName : tConfig.config.name, groupIsSource : wType.groupIsSource, "external" : wType.external}
		    if (tConfig.external)
			externalWires.push(wireFragment);
		    else
			cutWires.push(wireFragment);
		}
		
	    }
	}
	
	return {
		"container" : {"position" : center},
		"group" : group,
		"wires" : {"external" : externalWires, "cut" : cutWires}
	    };
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