(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    
    WireIt.Group = {
		generateFields: function(fieldConfigs, overrides)
		{
			var fields = [];
			var neededFields = [];
			var terminalNamesUsed  = [];
			
			var addFiledToUsed = function(name, fieldConfig)
				{
					usedNames[name] = true;
					
					if (fieldConfig.inputParams.wirable)
						terminalNamesUsed[name] = true;
				}
		
			for (var fI in fieldConfigs)
			{
				var f = fieldConfigs[fI];
				var o = overrides[fI + f.inputParams.name];
				var needNames = {};
				
				if (lang.isObject(o) && o.visible)
				{
					if (lang.isValue(o.rename))
					{
						var field = {}
						lang.augmentObject(field, f);
						field.inputParams = lang.augmentObject({"label" : o.rename, "name" : o.rename}, field.inputParams);
						fields.push( field );
						usedNames[o.rename] = true;
					}
					else
						neededFields.push(f);
				}
			}
			
			for (var fI in neededFields)
			{
				var f = neededFields[fI];
				var freshName = this.generateNextName(f.inputParams.name, usedNames);
				
				usedNames[freshName] = true;
				
				var field = {}
				lang.augmentObject(field, f);
				field.inputParams.name = freshName;
				fields.push( field );
			}
			
			return {
				"fields" : fields, 
				"usedTerminalNames" : terminalNamesUsed
			}
		},
		
		generateTerminals: function(terminalConfigs, overrides, usedNames)
		{
			var terminals = [];
			
			for (var tI in terminalConfigs)
			{
				var t = terminalConfigs[tI];
				var o = overrides[t.name]
				
				if (lang.isObject(o) && o.visible)
				{
					if (lang.isValue(o.rename))
					{
						var terminal = {};
						lang.augmentObject(terminal, t);
						terminal.name = o.rename;
						//TODO: check if name already used?
						usedNames[o.rename] = true;
						terminals.push(terminal);
					}
					else
					{
						visibleTerminals.push(t);
					}
				}
			}
			
			for (var tI in visibleTerminals)
			{
				var t = visibleTerminals[tI];
				var freshName = this.generateNextName(t.name, usedNames);
				
				usedNames[freshName] = true;
				
				var terminal = {};
				lang.augmentObject(terminal, t);
				terminal.name = freshName;
				
				terminals.push(terminal);
			}
			
			return terminals;
		},
		
		generateNextName: function(name, usedNames)
		{
			var used = function(name)
				{
					return lang.isValue(usedNames[name]);
				};
			
			var freshName = name;
					
			if (used(freshName))
			{
				var i = 1;
				var current = freshName;
			
				do
					freshName = current + i;
					i++;
				while(used(freshName))
			}
			
			usedNames[freshName] = true;
		}
    },

    WireIt.Group.prototype = {
	
	getDefaultConfigAndWires: function(containers)
	{
		var groupConfig = {};
		
		groupConfig.externalToInternalMap = {};

		var visibles = this.workOutVisibleTerminalsAndFields(containers);
		var getDefaultPrefix = function(i) { return containers[i].title + "_"; };
		var resolvedFields = this.mapFields(visibles.fields, getDefaultPrefix);
		groupConfig.externalToInternalMap.fields = resolvedFields.fields;
		groupConfig.externalToInternalMap.terminals = this.mapTerminals(visibles.terminals, getDefaultPrefix, resolvedFields.terminals);
		
		groupConfig.internalToExternalMap.fields = this.getInternalFieldsMap(containers, groupConfig.externalToInternalMap.fields);
		groupConfig.internalToExternalMap.terminals = this.getInternalTerminalMap(containers, groupConfig.externalToInternalMap.terminals);
		
		groupConfig.fields = this.getFieldConfigs(groupConfig.externalToInternalMap.fields, containers);
		groupConfig.terminals = this.getTerminalConfigs(groupConfig.externalToInternalMap.terminals, containers);
		
		groupConfig.internalConfig = {};
		var center = this.workOutCenter(containers);
		groupConfig.internalConfig.modules = this.getInternalModuleConfig(containers, center);
		var wireConfig = this.getWireConfig(this.getWires(containers), containers);
		
		groupConfig.internalConfig.wires = wireConfig.internal;
		
		return {"config": groupConfig, "wires" : wireConfig.external, "center" : center};
	},
	
	getFullConfigAndWires: function()
	{
		var fullConfig = {};
		lang.augmentObject(fullConfig, this.config);
		lang.augmentObject(fullConfig, this.getDefaultConfigAndWires(this.containers));
		
		return fullConfig;
	},
	
	getInternalFieldsMap: function(externalMap, containers)
	{
		var map = {}
	
		for (var cI in containers)
		{
			var c = containers[cI];
			
			if (lang.isObject(c.form))
			{
				for (var fI in c.form.inputConfigs)
				{
					var fConfig = c.form.inputConfigs[fI];
					var name = fConfig.inputParams.name;
					
					map[cI + name] = { "moduleId" : cI, "name" : name, "externalName" : 
				}
			}
		}
	},
	
	getList: function()
	{
		return this.listRows;
	},
	
	addContainer: function(container)
	{
		if (this.containers.indexOf(container) == -1)
			this.containers.push(container);
		//Fire a custom event?
	},
	
	removeContainer: function(container)
	{
		this.containers.splice(this.containers.indexOf(container), 1);
		//Remove config overrides?
		//Fire a custom event?
	},
	
	generateFieldAndTerminalControls: function()
	{
	    this.listRows = [];
	    var configUITerminalMap = [];
	    var configUIFieldMap = [];
	    var layer = this.layer;
	    var self = this;
	    
	    var addRemapInput = function(name, moduleId, moduleTitle, showOn, showCancel, defaultVisible, defaultName, nameReadOnly, visibleReadOnly)
		{
		    var addTds = function(row) {
			    tds = [];
			    
			    for(var i = 0; i < 6; i++)
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
		    visible.disabled = visibleReadOnly
		    
		    var externalName = WireIt.cn("input", {"type" : "text"});
		    externalName.disabled = nameReadOnly;
		    externalName.value = (typeof defaultName == "undefined") ? "" : defaultName
		    
		    
		    
		    var tds = addTds(row);
		    
		    tds[0].innerHTML = moduleTitle;
		    tds[1].innerHTML = name;
		    tds[2].appendChild(visible);
		    tds[3].appendChild(externalName);
		    
		    var sideSelect = WireIt.cn("select");
		    sideSelect.appendChild(WireIt.cn("option", {value: "top"}, {}, "Top"));
		    sideSelect.appendChild(WireIt.cn("option", {value: "bottom"}, {}, "Bottom"));
		    sideSelect.appendChild(WireIt.cn("option", {value: "left"}, {}, "Left"));
		    sideSelect.appendChild(WireIt.cn("option", {value: "right"}, {}, "Right"));
		    
		    tds[4].appendChild(sideSelect);
		    
		    var showButton = WireIt.cn("button", {}, {}, "Show")
		    showButton.onmousedown = showOn
		    showButton.onmouseup = showCancel; 
		    showButton.onmouseout = showCancel;
		    
		    tds[5].appendChild(showButton);
		    this.listRows.push(row)
		    
		    return {"visible": visible, "externalName":  externalName, "moduleId" : moduleId, "internalName" : name, "side" : sideSelect};
		}
	
	
	    var addTerminal = function(t, moduleId, fieldTerminals)
		{
		    showOn = function()
			    { 
				centerLayer(t.container.el, layer.el);
				t.setDropInvitation(true); 
			    };
			    
		    showCancel = function () { t.setDropInvitation(false);  };
		    
		    var visibleReadOnly = false;
		    var defaultVisible = false;
		    var nameReadOnly = false;
		    
		    var fieldTerminal = fieldTerminals[t.options.name];
		    if (!lang.isValue(fieldTerminal))
		    {
			var fragment = addRemapInput(t.options.name, moduleId, t.container.options.title, showOn, showCancel, false,  t.options.name);
		    
			fragment.terminal = t;
			configUITerminalMap.push(fragment);
		    }
		}
	    
	    var addField = function(fieldConfig, moduleId, fieldTerminals)
		{
		    var visibleReadOnly = false;
		    var defaultVisible = false;
		    if (lang.isObject(f.terminal))
		    {
			if (f.terminal.wires.length > 0)
			{
			    var wire = f.terminal.wires[0];
			    if ((self.containers.indexOf(wire.terminal1.container) != -1) && (self.containers.indexOf(wire.terminal2.container) != -1))
			    {
				visibleReadOnly = true;
				defaultVisible = false;
			    }
			}
			    
			fieldTerminals[f.terminal.options.name] = f.terminal;
		    }
		    
		    var fragment = addRemapInput(fieldConfig.name, moduleId, section, defaultVisible,  fieldConfig.name, false, visibleReadOnly);
		    
		    fragment.fieldConfig = fieldConfig;
		    		    
		    configUIFieldMap.push(fragment)
		}
	    
	    for(var cI = 0; cI < this.containers.length; cI++)
	    {
			var c = this.value.containers[cI]
			
			var baseContainerConfig = this.getBaseConfig(m.name);
			var newConfig = YAHOO.lang.JSON.parse( YAHOO.lang.JSON.stringify( m.config ) ) //TODO: nasty deep clone, probably breaks if you have DOM elements in your config or something
			YAHOO.lang.augmentObject(newConfig , baseContainerConfig);

			var fieldTerminals = {};
			
			if (lang.isArray(newConfig.fields))
			{
			    for (var fI in newConfig.fields)
			    {
				var f = newConfig.fields[fI]
				
				addField(f, cI, fieldTerminals)
			    }
			}
			for (var tI in c.terminals)
			{
			    var t = c.terminals[tI]
			    
			    addTerminal(t, cI, fieldTerminals)
			}
	    }
	    
	    this.configUITerminalMap = configUITerminalMap;
	    this.configUIFieldMap = configUIFieldMap;
		
		return listRows;
	},

	workOutVisibleTerminalsAndFields: function(containers)
    {
		var ret = {terminals : [], fields : []};
	
		var terminalHasExternalWire = function(t, internalContainers)
		    {
				for (var wI in t.wires)
				{
				    var w = t.wires[wI];
				    
				    if (internalContainers.indexOf(w.terminal1.container) == -1 || 
					internalContainers.indexOf(w.terminal2.container) == -1)
				    {
					return true;
				    }
				}
				
				return false;
		    }
	
	for (var cI in containers)
	{
	    var c = containers[cI];
	    var containerFields = {};
	    var fieldTerminals = {};
	    var add = false;
	    
	    if (lang.isValue(c.form))
	    {
		for (var fI in c.form.inputs)
		{
		    var f = c.form.inputs[fI];
		    
		    if (lang.isValue(f.terminal))
		    {
			if (terminalHasExternalWire(f.terminal, containers))
			{
			    containerFields[f.options.name] = {"index" : fI, "field" : f};
			    add = true;
			}
		    }
		}
	    }
	    
	    if (add)
		ret.fields[cI] = containerFields
		
		
	    var containerTerminals = {};
	    add = false;
	    
	    for (var tI in c.terminals)
	    {
		var t = c.terminals[tI];
		
		//Make sure the terminal isn't a field terminal
		if (!lang.isValue(containerFields[t.options.name]))
		{
		    if (terminalHasExternalWire(t, containers))
		    {
			containerTerminals[t.options.name] = {"index" : tI, "terminal" : t};
			add = true;
		    }
		}
	    }
	    
	    if (add)
		ret.terminals[cI] = containerTerminals;
	}
	
	return ret;
    },
    
    mapFields: function(containersFields, getDefaultPrefix)
    {
		var usedNames = {};
		var internalToExternal = {};
		
		var used = function(name)
		    {
			return lang.isValue(usedNames[name]);
		    };
		
		for (var cI in containersFields)
		{
		    var cf = containersFields[cI];
		    
		    for (var fI in cf)
		    {
				var cff = cf[fI];
				var f = cff.field;
			    
				var name = f.options.name;
				var externalName = name;
				
				if (used(externalName))
				{
				    externalName = getDefaultPrefix(cI) + name;
				    
				    if (used(externalName))
				    {
					var i = 0;
					var current = externalName;
					
					do
					{
					    externalName = current + i;
					}
					while(used(externalName))
				    }
				}
				
				usedNames[externalName]= {"moduleId" : cI, "name" : name, "type" : "field", "index" : cff.index};
				internalToExternal[cI + name] = {"internalModuleId" : cI, "internalName" : name, "externalName" : externalName}
		    }
		}
		
		return 
			{
				"externalToInternal" : {
					fields: usedNames,
					terminals: usedNames
					},
				"internalToExternal" : internalToExternal
			}
    },
    
    mapTerminals: function(containersTerminals, getDefaultPrefix, fieldTerminals)
    {
		var usedNames = {};
		
		var used = function(name)
		    {
			return lang.isValue(usedNames[name]);
		    };
		
		for (var uI in fieldTerminals)
		{
		    var ft = fieldTerminals[uI];
		    usedNames[uI] = lang.merge(ft);
		}
		
		for (var cI in containersTerminals)
		{
		    var ct = containersTerminals[cI];
		    
		    for (var tI in ct)
		    {
				var tff = ct[tI];
				var t = tff.terminal;
				
				var name = t.options.name;
				var externalName = name;
				
				if (used(externalName))
				{
				    externalName = getDefaultPrefix(cI) + name;
				    
				    if (used(externalName))
				    {
					var i = 0;
					var current = externalName;
					
					do
					{
					    externalName = current + i;
					}
					while(used(externalName))
				    }
				}
				
				usedNames[externalName]= {"moduleId" : cI, "name" : name, "type" : "terminal", "index" : tff.index};
				internalToExternal[cI + name] = {"internalModuleId" : cI, "internalName" : name, "externalName" : externalName};
		    }
		}
		
		return usedNames;
    },
    
    getFieldConfigs: function(fields, containers)
    {
	var fieldConfigs = [];
	
	for (var fName in fields)
	{
	    var map = fields[fName];
	    var c = containers[map.moduleId];
	    
	    var fI = map.index;
	    var fieldConfig = c.form.inputsNames[fI];
	    
	    var config = lang.merge(fieldConfig);
	    config.inputParams = lang.merge(fieldConfig.inputParams);
	    config.inputParams.name = fName;
	    config.inputParams.value = c.form.inputs[fI].getValue();
	
	    fieldConfigs.push(config);
	}
	
	return fieldConfigs;
    },
    
    getTerminalConfigs: function(terminals, containers)
    {
	var terminalConfigs = [];
	
	for (var tName in terminals)
	{
	    var map = terminals[tName];
	    var c = containers[map.moduleId];
	    var t = c.terminals[map.index];
	    
	    var config = {};
	    config.name = tName;
	    config.direction = t.options.direction;
	    config.offsetPosition = {
		    left : 100 /*positionByNumber(nI, N)*/,
		    top : -15
		};
		
	    config.ddConfig = t.options.ddConfig;
	    	    
	    terminalConfigs.push(config);
	}
	
	return terminalConfigs;
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
    
    getWireConfig: function(wires, internalContainers)
    {
		var externalWires = [];
		var internalWires = []
		
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
		
		return {"external" : externalWires, "internal" : internalWires};
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
	
    }
})();