(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    
    WireIt.Group = {
	
	    getOuterGroup: function(group)
	    {
		var last = group;
		var current = last;
		do
		{
		    last = current;
		    current = current.group;
		}
		while (lang.isValue(current))
		
		return last;
	    },
	
	    addAllContainers: function(group, containers)
	    {
		if (lang.isObject(group.groupContainer))
		    containers.push(group.groupContainer);
		else
		{
		    for (var cI in group.containers)
			containers.push(group.containers[cI].container);

		    for (var gI in group.groups)
			WireIt.Group.addAllContainers(group.groups[gI].group, containers)
		}
	    },
	
	    serialiseGroup: function(group, containers)
	    {
		var sGroup = {};
		sGroup.properties = {};
		lang.augmentObject(sGroup.properties, group.properties);
		
		if (lang.isValue(group.groupContainer))
		{
		    sGroup.groupContainer = containers.indexOf(group.groupContainer);
		}
		else
		{
		    sGroup.containers = []
		    sGroup.groups = []
		    for (var cI in group.containers)
			sGroup.containers.push({"container" : containers.indexOf(group.containers[cI].container), "overrides" : group.containers[cI].overrides}) //TODO: check if index is -1?

		    for (var gI in group.groups)
		    {
			var g = group.groups[gI];
			
			sGroup.groups.push({"group" : WireIt.Group.serialiseGroup(g.group, containers), "overrides" : g.overrides});
		    }
		}
		
		return sGroup;
	    },
	
	    getCollapsedConfig: function(group, map)
	    {
		if (!lang.isObject(map))
		    map = WireIt.Group.getMap(group);
		    
		var fieldConfigs = [];
		var terminalConfigs = [];
		var generateExternal = function(ftMap)
		    {
			for (var cI in ftMap)
			{
			    var c = ftMap[cI];
			    
			    for (var fName in c.fields)
			    {
				var fMap = c.fields[fName];
				
				if (fMap.visible)
				{
				    var fc = {};
				    lang.augmentObject(fc, fMap.fieldConfig);
				    
				    fc.inputParams = {};
				    fc.inputParams.name = fMap.externalName;
				    fc.inputParams.label = fMap.externalName;
				    lang.augmentObject(fc.inputParams, fMap.fieldConfig.inputParams)
				    
				    fieldConfigs.push(fc);
				}
			    }
			
			    for (var tName in c.terminals)
			    {
				var tMap = c.terminals[tName];
				
				if (tMap.visible)
				{
				    var tc = {};
				    tc.name = tMap.externalName;
				    lang.augmentObject(tc, tMap.terminalConfig);
				    
				    terminalConfigs.push(tc)
				}
			    }
			}
		    }
		
		if (lang.isValue(map.groupContainerMap))
		    generateExternal([map.groupContainerMap])
		else
		{
		    generateExternal(map.containerMap);
		    generateExternal(map.groupMap);
		}
		
		var center = this.workOutCenter(group);
		
		return { "fields" : fieldConfigs, "terminals" : terminalConfigs, "position" :  center, "center" : center};
	    },
	
	    workOutCenter: function(group)
	    {
		var bounds = {};
		
		var setBound = function(position)
		    {
			var left, top;
			left = position[0];
			top = position[1];
			
			if ((typeof bounds["left"] == "undefined") || bounds["left"] > left)
			    bounds["left"] = left;
			    
			if ((typeof bounds["right"] == "undefined") || bounds["right"] < left)
			    bounds["right"] = left;

			if ((typeof bounds["top"] == "undefined") || bounds["top"] > top)
			    bounds["top"] = top;

			if ((typeof bounds["bottom"] == "undefined") || bounds["bottom"] < top)
			    bounds["bottom"] = top;
		    }
		
		if (lang.isObject(group.groupContainer))
		{
		    setBound(group.groupContainer.getConfig().position)
		}
		else
		{
		    for (var cI in group.containers)
		    {
			var c = group.containers[cI].container;
			var config = c.getConfig();
			
			setBound(config.position);
		    }
		    
		    for (var gI in group.groups)
		    {
			var g = group.groups[gI].group;
			
			setBound(WireIt.Group.workOutCenter(g));
		    }
		}
		return [
			((bounds.right + bounds.left)/2),
			((bounds.top + bounds.bottom)/2)
		    ];
	    },
	
	    getExternalToInteralMap: function(map)
	    {
		var containerMap = {"fields" : {}, "terminals" : {}};
		var groupMap = {"fields" : {}, "terminals" : {}};
		
		var flattened = []
		//flatten
		for (var cI in map.containerMap)
		{
		    flattened.push(map.containerMap[cI])
		}
		
		for (var cI in map.containerMap)
		{
		    var c = map.containerMap[cI];
		 
		    for (var fName in c.fields)
		    {
			var f= c.fields[fName];
			
			if (f.visible)
			    containerMap.fields[f.externalName] = {"containerId" : cI, "name" : fName}
		    }
		    
		    for (var tName in c.terminals)
		    {
			var t= c.terminals[tName];
			
			if (t.visible)
			    containerMap.terminals[t.externalName] = {"containerId" : cI, "name" : tName}
		    }
		}
		
		for (var cI in map.groupMap)
		{
		    var c = map.groupMap[cI];
		 
		    for (var fName in c.fields)
		    {
			var f= c.fields[fName];
			
			if (f.visible)
			    groupMap.fields[f.externalName] = {"containerId" : cI, "name" : fName}
		    }
		    
		    for (var tName in c.terminals)
		    {
			var t= c.terminals[tName];
			
			if (t.visible)
			    groupMap.terminals[t.externalName] = {"containerId" : cI, "name" : tName}
		    }
		}
		
		return {"containerMap" : containerMap, "groupMap" : groupMap};
	    },
	
	    getMap: function(group)
	    {
		
		//assume no group container case
		if (lang.isValue(group.groupContainer))
		{
		    var map = {"fields" : [], "terminals" : []};
		    
		    var inGroup = function(container)
			{
			    return container == group.groupContainer;
			};
		    
		    for (var fI in group.groupContainer.form.inputConfigs)
		    {
			var fConfig = group.groupContainer.form.inputConfigs[fI];
			var fCopy = {}
			lang.augmentObject(fCopy, fConfig);
			fCopy.inputParams = {};
			lang.augmentObject(fCopy.inputParams, fConfig.inputParams);
			
			var fMap = {"fieldConfig" : fCopy};
						
			if (this.isFieldExternal(group.groupContainer.form.inputs[fI], inGroup))
			{
			    fMap.externalName = fConfig.inputParams.name;
			    fMap.visible = true;
			}
		    
			map.fields.push(fMap);
		    }
		    
		    for (var tI in group.groupContainer.options.terminals)
		    {
			var tConfig = group.groupContainer.options.terminals[tI];
			
			var tMap = {"terminalConfig" : tConfig};
			
			if (this.isTerminalExternal(group.groupContainer.terminals[tI], inGroup))
			{
			    tMap.visible = true;
			    tMap.externalName = tConfig.name;
			}
			
			map.terminals.push(tMap);
		    }
		    
		    return { "groupContainerMap" : map };
		}
		
		var usedNames = {terminals : {}, fields : {}};
		var containerMap = {};
		var groupMap = {};

		this.generateFieldMap(group, usedNames, containerMap, groupMap);
		this.generateTerminalMap(group, usedNames, containerMap, groupMap);
		
		this.generateDefaultFieldNames(containerMap, usedNames);
		this.generateDefaultFieldNames(groupMap, usedNames);

		this.generateDefaultTerminalNames(containerMap, usedNames);
		this.generateDefaultTerminalNames(groupMap, usedNames);
		
		return { "containerMap" : containerMap, "groupMap" : groupMap };
	    },

	    generateDefaultTerminalNames : function(map, usedNames)
	    {
		for (var cI in map)
		{
		    var c = map[cI];
		    
		    for (var tName in c.terminals)
		    {
			var t = c.terminals[tName];
		    
			if (t.visible && !lang.isValue(t.externalName))
			{
			    t.externalName = this.generateFreshName(tName, usedNames.terminals);
			    
			    usedNames.terminals[t.externalName] = true;
			}
		    }
		}
	    },

	    generateDefaultFieldNames : function(map, usedNames)
	    {
		for (var cI in map)
		{
		    var c = map[cI];
		    
		    for (var fName in c.fields)
		    {
			var f = c.fields[fName];
		    
			if (f.visible && !lang.isValue(f.externalName))
			{
			    
			    if (f.fieldConfig.inputParams.wirable)
			    {
				var mergedUsedNames = {};
				lang.augmentObject(mergedUsedNames, usedNames.fields);
				lang.augmentObject(mergedUsedNames, usedNames.terminals);
				
				f.externalName = this.generateFreshName(fName, mergedUsedNames);
			    
				usedNames.fields[f.externalName] = true;
				usedNames.terminals[f.externalName] = true;
			    }
			    else
			    {
				f.externalName = generateFreshName(fName, usedNames.fields);
			    
				usedNames.fields[f.externalName] = true;
			    }
			}
		    }
		}
	    },

	    generateTerminalMap: function(group, usedNames, containerMap, groupMap)
	    {
		var self = this;
		
		var mergeTerminalOverrides = function(terminalConfigs, overrides, usedNames, forceVisible, terminalMap)
		    {
			for (var tI in terminalConfigs)
			{
			    var t = terminalConfigs[tI];
			    var name = t.name;
			    var o = overrides[name];
			    
			    var map = {terminalConfig : t};
			    
			    if (lang.isObject(o) && o.visible)
			    {
				map.visible = true;
				
				if (lang.isValue(o.rename))
				{
				    usedNames.terminals[o.rename] = true;
				    
				    map.externalName = o.rename;
				}
			    }
			    else if (forceVisible(name))
				map.visible = true;
			    
			    terminalMap[name] = map;
			}
		    };
		
		var allContainers = [];
		WireIt.Group.addAllContainers(group, allContainers);
		var inGroup = function(container)
		    {
			for (var i in allContainers)
			{
			    if (container == allContainers[i]) //TODO: doesn't take into account expanded but in group containers?
				return true;
			}
			
			return false;
		    };
		
		//Get default maps (with overrides)
		for (var cI in group.containers)
		{
		    var co = group.containers[cI];
		    var c = co.container;
		    var os = co.overrides;
		    
		    var cm = {};
		    
		    var terminalConfigs = lang.isArray(c.options.terminals) ? c.options.terminals : [];
		    var forceVisible = function(name)
			{
			    var terminal;
			    for (var tI in c.terminals)
			    {
				var t = c.terminals[tI];
				
				if (t.options.name == name)
				{
				    terminal = t;
				    break;
				}
			    }
			    
			    return self.isTerminalExternal(terminal, inGroup);
			}
			
		    mergeTerminalOverrides(terminalConfigs, os, usedNames, forceVisible, cm);
		    
		    containerMap[cI].terminals = cm;
		    
		}
		
		//Get default maps (with overrides)
		for (var gI in group.groups)
		{
		    var go = group.groups[gI];
		    var g = go.group;
		    var os = go.overrides;
		    
		    var gm = {};
		    
		    var map = WireIt.Group.getMap(g);
		    var terminalConfigs = WireIt.Group.getCollapsedConfig(g, map).terminals//TODO: inefficient 
		    var forceVisible;
		    
		    if (lang.isValue(g.groupContainer))
		    {
			forceVisible = function(name)
			    {
				var terminal;
				for (var tI in g.groupContainer.terminals)
				{
				    var t = g.groupContainer.terminals[tI];
				    
				    if (t.options.name == name)
				    {
					terminal = t;
					break;
				    }
				}
				
				return self.isTerminalExternal(terminal, inGroup);
			    }
		    }
		    else
		    {
			var externalToInternalMap = WireIt.Group.getExternalToInteralMap(map);
			
			forceVisible = function(name)
			    {
				for (var tName in externalToInternalMap.containerMap.terminals)
				{
				    var tMap = externalToInternalMap.containerMap.terminals[tName]
				
				    var terminal;
				    for (var tI in g.containers[tMap.containerId].terminals)
				    {
					var t = g.containers[tMap.containerId].terminals[tI];
					
					if (t.options.name == name)
					{
					    terminal = t;
					    break;
					}
				    }
				
				    if (self.isTerminalExternal(terminal, inGroup))
					return true;
				}
				
				return false;
			    }
		    }
		    
		    
		    mergeTerminalOverrides(terminalConfigs, os, usedNames, forceVisible, gm);
		    
		    groupMap[gI].terminals = gm;
		}
	    },

	    isFieldExternal: function (f, inGroup)
	    {
		if (lang.isValue(f))
		{
		    return this.isTerminalExternal(f.terminal, inGroup)
		}
	    },
	    
	    isTerminalExternal: function(terminal, inGroup)
	    {
		if (lang.isValue(terminal))
		{
		    for (var wI in terminal.wires)
		    {
			var w = terminal.wires[wI];
			
			if ((w.terminal1 != terminal && !inGroup(w.terminal1.container)) ||
			    (w.terminal2 != terminal && !inGroup(w.terminal2.container)))
			{
			    return true;
			}
		    }
		}
		
		return false;
	    },
	    
	    generateFieldMap: function(group, usedNames, containerMap, groupMap)
	    {
		var self = this;
		
		//Get default maps (with overrides)
		for (var cI in group.containers)
		{
		    var co = group.containers[cI];
		    var c = co.container;
		    var os = co.overrides;
		    
		    var cm = {};
		    var allContainers = [];
		    WireIt.Group.addAllContainers(group, allContainers);
		    
		    var inGroup = function(container)
			{
			    for (var i in allContainers)
			    {
				if (container == allContainers[i])
				    return true;
			    }
			    
			    return false;
			};
		    
		    if (lang.isObject(c.form))
		    {
			var fieldConfigs = c.form.inputConfigs
			var forceVisible = function(name)
			    {
				return self.isFieldExternal.call(self, c.form.inputsNames[name], inGroup);
			    }
			this.mergeFieldOverrides(fieldConfigs, os, usedNames, forceVisible, cm);
		    }
		    containerMap[cI] = {};
		    
		    containerMap[cI].fields = cm;
		}
		
		//Get default maps (with overrides)
		for (var gI in group.groups)
		{
		    var go = group.groups[gI];
		    var g = go.group;
		    var os = go.overrides;
		    
		    var gm = {};
		    
		    
		    var map = WireIt.Group.getMap(g);
		    var fieldConfigs = WireIt.Group.getCollapsedConfig(g, map).fields//TODO: inefficient since we throw away terminal results then get them again
		    var forceVisible;
		    
		    if (lang.isValue(g.groupContainer))
		    {
			forceVisible = function(name)
			    {
				return self.isFieldExternal.call(self, g.groupContainer.form.inputsNames[name], inGroup);
			    }
		    }
		    else
		    {
			var externalToInternalMap = WireIt.Group.getExternalToInteralMap(map);
			//TODO: is this right???
			forceVisible = function(name)
			    {
				for (var fName in externalToInternalMap.containerMap.fields)
				{
				    var fMap = externalToInternalMap.containerMap.fields[fName]
				
				    var f = g.containers[fMap.containerId].container.form.inputsNames[fMap.name]
				
				    if (self.isFieldExternal.call(this, f, inGroup))
					return true;
				}
				
				return false;
			    }
		    }
		    
		    this.mergeFieldOverrides(fieldConfigs, os, usedNames, forceVisible, gm);
		    
		    groupMap[gI] = {}
		    groupMap[gI].fields = gm;
		}
	    },
	    
	    generateFreshName : function(name, usedNames)
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
			{
				freshName = current + i;
				i++;
			}
			while(used(freshName))
		}
		
		usedNames[freshName] = true;
		
		return freshName;
	    },

	    mergeFieldOverrides : function(fieldConfigs, overrides, usedNames, forceVisible, fieldMap)
	    {
		for (var fI in fieldConfigs)
		{
		    var f = fieldConfigs[fI];
		    var name = f.inputParams.name;
		    var o = overrides[name];
		    
		    var map = {fieldConfig : f};
		    
		    if (lang.isObject(o) && o.visible)
		    {
			map.visible = true;
			
			if (lang.isValue(o.rename))
			{
			    usedNames.fields[o.rename] = true;
			    
			    if (f.inputParams.wirable)
				userNames.terminals[name] = true;
				
			    map.externalName = o.rename;
			}
		    }
		    else if (forceVisible(name))
			map.visible = true;
		    
		    fieldMap[name] = map;
		}
	    },

		generateFields: function(fieldConfigs, overrides, external)
		{
		    var fields = [];
		    var neededFields = [];
		    var terminalNamesUsed  = [];
		    var usedNames = {};
		    
		    var addFieldToUsed = function(name, fieldConfig)
			    {
				    usedNames[name] = true;
				    
				    if (fieldConfig.inputParams.wirable)
					    terminalNamesUsed[name] = true;
			    }
	    
		    for (var mI in fieldConfigs)
		    {
			var m = fieldConfigs[mI];
			
			for (var fI in m)
			{
				var f = m[fI];
				var str = new String(mI);
				var str2 = new String(f.inputParams.name);
				var str3 = str + str2 + '';
				var o = overrides.fields[str3];
				var e = external.fields[str3];
				
				var needNames = {};
				
				if (lang.isObject(o) && o.visible)
				{
					if (lang.isValue(o.rename))
					{
						var field = {}
						lang.augmentObject(field, f);
						field.inputParams = lang.augmentObject({"label" : o.rename, "name" : o.rename}, field.inputParams);
						fields.push( field );
						addFieldToUsed(o.rename, f);
					}
					else
					    neededFields.push(f);
				}
				else if (e)
				    neededFields.push(f);
			}
		    }
		    
		    for (var fI in neededFields)
		    {
			    var f = neededFields[fI];
			    var freshName = this.generateNextName(f.inputParams.name, usedNames);
			    
			    addFieldToUsed(freshName, f);
			    
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
		
		generateTerminals: function(terminalConfigs, overrides, external, usedNames)
		{
			var terminals = [];
			var visibleTerminals = [];
			for (var mI in terminalConfigs)
			{
			    var m = terminalConfigs[mI];
			    
			    for (var tI in m)
			    {
				    var t = m[tI];
				    var o = overrides.terminals[mI + t.name]
				    var e = external.terminals[mI + t.name];
				    
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
				    else if (e)
					visibleTerminals.push(t);
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
				{
					freshName = current + i;
					i++;
				}
				while(used(freshName))
			}
			
			usedNames[freshName] = true;
			
			return freshName;
		},
		
		getExternalTerminalName: function(name, moduleId, fieldConfigs, terminalConfigs)
		{
		    for (var mI in terminalMap)
		    {
			    var m = terminalMap[mI];
			    
			    if (m.name == internalTerminal.options.name &&
				    m.moduleId == internalModuleId)
				    return mI;
		    }
		    
		    throw {"type" : "MappingError", "message" : "Couldn't find internal terminal's external name"};
		},
		
		fieldConfigsFromModules: function(modules, getBaseConfig)
		{
		    var config = {};
		    
		    for (var mI in modules)
		    {
			var m = modules[mI];
			var fullConfig = {};
			lang.augmentObject(fullConfig, m.config);
			lang.augmentObject(fullConfig, getBaseConfig(m.name))
			
			if (lang.isArray(fullConfig.fields))
			{
			    var fields = [];
			    
			    for (var fI in fullConfig.fields)
			    {
				var f = fullConfig.fields[fI];
				
				fields.push(f);
			    }
			    
			    config[mI] = fields;
			}
		    }
		    
		    return config;
		},
		
		fieldConfigsFromContainers: function(containers)
		{
		    var config = {};
		    
		    for (var cI in containers)
		    {
			var c = containers[cI];
			
			if (lang.isObject(c.form))
			{
			    var fields = [];
			    
			    for (var fI in c.form.inputConfigs)
			    {
				var f = c.form.inputConfigs[fI];
				
				fields.push(f);
			    }
			    
			    config[cI] = fields;
			}
		    }
		    
		    return config;
		},
		
		terminalConfigsFromModules: function(modules, getBaseConfig)
		{
		    var config = {};
		    
		    for (var mI in modules)
		    {
			var m = modules[mI];
			var fullConfig = {};
			lang.augmentObject(fullConfig, m.config);
			lang.augmentObject(fullConfig, getBaseConfig(m.name))
			
			if (lang.isArray(fullConfig.terminals))
			{
			    var terminals = [];
			    
			    for (var tI in fullConfig.terminals)
			    {
				var t = fullConfig.terminals[tI];
				
				terminals.push(t);
			    }
			    
			    config[mI] = terminals;
			}
		    }
		    
		    return config;
		},
		
    }/*,

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
		    left : 100 /*positionByNumber(nI, N),
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
	
    } */ 
})();