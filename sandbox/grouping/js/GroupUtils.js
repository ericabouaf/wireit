(function() {

    /**
    * Contains utility functions to do with groups (also one or two more general ones)
    * @class GroupUtils
    * @namespace WireIt
    */    
    Y.GroupUtils = {
	
	/**
	* Applys the given function to all containers in the group.
	* @method applyToContainers
	* @param {Group} group The group object to work with
	* @param {boolean} deep Whether to recurse down into sub groups applying to their containers as well
	* @param {Function} func The function to apply (takes 1 arg, the container)
	* @param {Object} context The context to call the function with
	*/
	applyToContainers: function(group, deep, func, context)
	{
	    if (!Y.Lang.isValue(context))
		context = this;
	    
	    if (Y.Lang.isValue(group.groupContainer))
		func.call(context, group.groupContainer);
	    else
	    {
		for (var cI in group.containers)
		    func.call(context, group.containers[cI].container)
		    
		if (deep)
		{
		    for (var gI in group.groups)
			Y.GroupUtils.applyToContainers(group.groups[gI].group, deep, func, context);
		}
	    }
	},
    
	/**
	* Gives the argument back or a default if the argument is not a value
	* @param {any} The argument to check
	* @param {any} The default value
	* @return {any} The argument if it is a value or the default
	*/
	valueOr: function(arg, def)
	{
	    return Y.Lang.isValue(arg) ? arg : def;
	},
    
	/**
	* Removes the group's containers and sub groups from the layer
	* @param {Group} The group to remove
	* @param {Layer} The layer to remove them from
	*/
	removeGroupFromLayer : function(group, layer)
	{
	    group.collapsing = true;
	    
	    if (Y.Lang.isValue(group.groupContainer))
		layer.removeContainer(group.groupContainer);
	    else
	    {
		for (var i in group.containers)
		    layer.removeContainer(group.containers[i])
		    
		for (var i in group.groups)
		    Y.GroupUtils.removeGroupFromLayer(group.groups[i], layer);
	    }
	    group.collapsing = false;
	},
    
	/**
	* Gets the outer most group (e.g. if this group is inside another one it gives you that one (or its parent group if it has one etc etc))
	* @param {Group} The group to get the outer group for
	* @param {Function} Optional callback function for each group found (including the given one)
	* @return {WireIt.Group} The outermost group
	*/
	getOuterGroup: function(group, groupCallback)
	{
	    var last = group;
	    var current = last;
	    do
	    {
		last = current;
		current = current.group;
		
		if (Y.Lang.isFunction(groupCallback))
		    groupCallback(last);
	    }
	    while (Y.Lang.isValue(current))
	    
	    return last;
	},
    
	/**
	* Adds all(recurses down) the containers in a group to the given array
	* @param {Group} The group to get the containers from
	* @param {Array} The array to add all the containers to
	*/
	addAllContainers: function(group, containers)
	{
	    if (Y.Lang.isObject(group.groupContainer))
		containers.push(group.groupContainer);
	    else
	    {
		for (var cI in group.containers)
		    containers.push(group.containers[cI].container);

		for (var gI in group.groups)
		    Y.GroupUtils.addAllContainers(group.groups[gI].group, containers)
	    }
	},
    
	/**
	* Removes direct references to group and container objects (replaces with an index), is applied recursively to sub groups
	* @param {WiteIt.Group} group The group to serialise
	* @param {Array} containers The array of containers from the group (for generating indexes)
	* @return {Object} The seriliased group
	*/
	serialiseGroup: function(group, containers)
	{
	    var sGroup = {};
	    sGroup.properties = {};
	    Y.mix(sGroup.properties, group.properties);
	    
	    if (Y.Lang.isValue(group.groupContainer))
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
		    
		    sGroup.groups.push({"group" : Y.GroupUtils.serialiseGroup(g.group, containers), "overrides" : g.overrides});
		}
	    }
	    
	    return sGroup;
	},
    
	/**
	* Get the configuration to pass to a group container
	* @param {Group} group The group to get the config for
	* @param {object} map Optional The group's map (obtained by Y.GroupUtils.getMap(group))
	* @return {object} The collapsed config
	*/
	getCollapsedConfig: function(group, map)
	{
	    if (!Y.Lang.isObject(map))
		map = Y.GroupUtils.getMap(group);
		
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
				Y.mix(fc, fMap.fieldConfig);
				
				fc.name = fMap.externalName;
				fc.label = fMap.externalName;
				Y.mix(fc, fMap.fieldConfig)
				
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
				tc.side = tMap.side;
				
				Y.mix(tc, tMap.terminalConfig);
				
				terminalConfigs.push(tc)
			    }
			}
		    }
		}
	    
	    if (Y.Lang.isValue(map.groupContainerMap))
		generateExternal([map.groupContainerMap])
	    else
	    {
		generateExternal(map.containerMap);
		generateExternal(map.groupMap);
	    }
	    
	    var center = this.workOutCenter(group);
	    
	    return { "fields" : fieldConfigs, "terminals" : terminalConfigs, "position" :  center, "center" : center};
	},
    
	/**
	* Works out the center point of a group
	* @param {Group} group The group to get the center of
	* @return {Array} the x, y position of the center
	*/
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
	    
	    if (Y.Lang.isObject(group.groupContainer))
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
		    
		    setBound(Y.GroupUtils.workOutCenter(g));
		}
	    }
	    return [
		    ((bounds.right + bounds.left)/2),
		    ((bounds.top + bounds.bottom)/2)
		];
	},
    
	getExternalToInternalMap: function(map)
	{
	    var containerMap = {"fields" : {}, "terminals" : {}};
	    var groupMap = {"fields" : {}, "terminals" : {}};
			    
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
    
	/**
	* Set the override options for the group (e.g. rename fields)
	* Currently sets all overrides not just the ones that are actually changed by the user
	* @method getOverridesFromUI
	*/
	getOverridesFromUI: function(containerUIMap, groupUIMap)
	{
	    containerOverrides = [];
	    groupOverrides = [];
	    
	    //for the moment set all overrides
	    for (var cI in containerUIMap)
	    {
		var c = containerUIMap[cI]
		var overrides = {"fields" : {}, "terminals" : {}};
		
		for (var fName in c.fields)
		{
		    var f = c.fields[fName];
		    var o = {}
		    o.visible = f.visible.checked;
		    var rename = f.externalName.value;
		    
		    if (rename.length > 0)
			o.rename = rename;

		    overrides.fields[fName] = o;
		}
		
		
		for (var tName in c.terminals)
		{
		    var t = c.terminals[tName];
		    var o = {}
		    o.visible = t.visible.checked;
		    var rename = t.externalName.value;
		    
		    if (rename.length > 0)
			o.rename = rename;

		    o.side = t.side.value;
		    
		    overrides.terminals[tName] = o;
		}
		
		containerOverrides.push(overrides);
	    }
	    
	    for (var gI in groupUIMap)
	    {
		var g = groupUIMap[cI]
		var overrides = {"fields" : {}, "terminals" : {}};
		
		for (var fName in g.fields)
		{
		    var f = g.fields[fName];
		    var o = {}
		    o.visible = f.visible.checked;
		    var rename = f.externalName.value;
		    
		    if (rename.length > 0)
			o.rename = rename;

		    overrides.fields[fName] = o;
		}
		
		
		for (var tName in g.terminals)
		{
		    var t = g.terminals[tName];
		    var o = {}
		    o.visible = t.visible.checked;
		    var rename = t.externalName.value;
		    
		    if (rename.length > 0)
			o.rename = rename;

		    o.side = t.side.value;

		    overrides.terminals[tName] = o;
		}
	    }
	    
	    return {"containerOverrides" : containerOverrides, "groupOverrides" : groupOverrides};
	},
    
	getMap: function(group)
	{
	    
	    //assume no group container case
	    if (Y.Lang.isValue(group.groupContainer))
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
		    Y.mix(fCopy, fConfig);
		    
		    var fMap = {"fieldConfig" : fCopy};
					    
		    if (this.isFieldExternal(group.groupContainer.form.inputs[fI], inGroup))
		    {
			fMap.externalName = fConfig.name;
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
		
		    if (t.visible && !Y.Lang.isValue(t.externalName))
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
		
		    if (f.visible && !Y.Lang.isValue(f.externalName))
		    {
			
			if (f.fieldConfig.wirable)
			{
			    var mergedUsedNames = {};
			    Y.mix(mergedUsedNames, usedNames.fields);
			    Y.mix(mergedUsedNames, usedNames.terminals);
			    
			    f.externalName = Y.GroupUtils.generateFreshName(fName, mergedUsedNames);
			
			    usedNames.fields[f.externalName] = true;
			    usedNames.terminals[f.externalName] = true;
			}
			else
			{
			    f.externalName = Y.GroupUtils.generateFreshName(fName, usedNames.fields);
			
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
			
			if (Y.Lang.isObject(o) && o.visible)
			{
			    map.visible = true;
			    
			    if (Y.Lang.isValue(o.rename))
			    {
				if (Y.Lang.isValue(usedNames.terminals[o.rename]))
				    throw {"type" : "MappingError", "message" : "Two identical terminal names specified (" + o.rename + ")"}
				
				usedNames.terminals[o.rename] = true;
				
				map.externalName = o.rename;
			    }
			    
			    map.side = o.side;
			}
			
			if (forceVisible(name))
			{
			    map.visible = true;
			    map.forceVisible = true;
			}
			
			terminalMap[name] = map;
		    }
		};
	    
	    var allContainers = [];
	    Y.GroupUtils.addAllContainers(group, allContainers);
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
		
		var terminalConfigs = Y.Lang.isArray(c.options.terminals) ? c.options.terminals : [];
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
		    
		mergeTerminalOverrides(terminalConfigs, os.terminals, usedNames, forceVisible, cm, c.options.title);
		
		containerMap[cI].terminals = cm;
		
	    }
	    
	    //Get default maps (with overrides)
	    for (var gI in group.groups)
	    {
		var go = group.groups[gI];
		var g = go.group;
		var os = go.overrides;
		
		var gm = {};
		
		var map = Y.GroupUtils.getMap(g);
		var terminalConfigs = Y.GroupUtils.getCollapsedConfig(g, map).terminals//TODO: inefficient 
		var forceVisible;
		
		if (Y.Lang.isValue(g.groupContainer))
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
		    var externalToInternalMap = Y.GroupUtils.getExternalToInternalMap(map);
		    
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
		
		
		mergeTerminalOverrides(terminalConfigs, os.terminals, usedNames, forceVisible, gm);
		
		groupMap[gI].terminals = gm;
	    }
	},

	isFieldExternal: function (f, inGroup)
	{
	    if (Y.Lang.isValue(f))
	    {
		return this.isTerminalExternal(f.terminal, inGroup)
	    }
	},
	
	isTerminalExternal: function(terminal, inGroup)
	{
	    if (Y.Lang.isValue(terminal))
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
	    
	    var allContainers = [];
	    Y.GroupUtils.addAllContainers(group, allContainers);
	    var inGroup = function(container)
		    {
			for (var i in allContainers)
			{
			    if (container == allContainers[i])
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
		
		
		if (Y.Lang.isObject(c.form))
		{
		    var fieldConfigs = c.form.inputConfigs
		    var forceVisible = function(name)
			{
			    return self.isFieldExternal.call(self, c.form.inputsNames[name], inGroup);
			}
		    this.mergeFieldOverrides(fieldConfigs, os.fields, usedNames, forceVisible, cm);
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
		
		
		var map = Y.GroupUtils.getMap(g);
		var fieldConfigs = Y.GroupUtils.getCollapsedConfig(g, map).fields//TODO: inefficient since we throw away terminal results then get them again
		var forceVisible;
		
		if (Y.Lang.isValue(g.groupContainer))
		{
		    forceVisible = function(name)
			{
			    return self.isFieldExternal.call(self, g.groupContainer.form.inputsNames[name], inGroup);
			}
		}
		else
		{
		    var forceVisible2;
		    
		    forceVisible2 = function(name, group, map)
			{
			    if (!Y.Lang.isValue(map))
				map = Y.GroupUtils.getMap(group);
				
			    var externalToInternalMap = Y.GroupUtils.getExternalToInternalMap(map);
			    
			    var fMap = externalToInternalMap.containerMap.fields[name]
			    
			    if (Y.Lang.isValue(fMap))
			    {
				var f = group.containers[fMap.containerId].container.form.inputsNames[fMap.name]
			    
				if (self.isFieldExternal.call(self, f, inGroup))
				    return true;
			    }
			    else
			    {
				var fMap = externalToInternalMap.groupMap.fields[name];
				
				if (Y.Lang.isValue(fMap))
				    return forceVisible2(name, group.groups[fMap.containerId].group);
			    }
			    return false;
			}
			
		    forceVisible = function(name) { return forceVisible2(name, g, map); };
		}
		
		this.mergeFieldOverrides(fieldConfigs, os.fields, usedNames, forceVisible, gm);
		
		groupMap[gI] = {}
		groupMap[gI].fields = gm;
	    }
	},
	
	generateFreshName : function(name, usedNames)
	{
	    var used = function(name)
		    {
			    return Y.Lang.isValue(usedNames[name]);
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
		var name = f.name;
		var o = overrides[name];
		
		var map = {fieldConfig : f};
		
		if (Y.Lang.isObject(o) && o.visible)
		{
		    map.visible = true;
		    
		    if (Y.Lang.isValue(o.rename))
		    {
			if (Y.Lang.isValue(usedNames.fields[o.rename]))
			    throw {"type" : "MappingError", "message" : "Two identical field names specified (" + o.rename + ")"}
			
			usedNames.fields[o.rename] = true;
			
			if (f.wirable)
			    usedNames.terminals[name] = true;
			    
			map.externalName = o.rename;
		    }
		}
		
		if (forceVisible(name))
		{
		    map.visible = true;
		    map.forceVisible = true;
		}
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
			    
			    if (fieldConfig.wirable)
				    terminalNamesUsed[name] = true;
		    }
    
	    for (var mI in fieldConfigs)
	    {
		var m = fieldConfigs[mI];
		
		for (var fI in m)
		{
			var f = m[fI];
			var str = new String(mI);
			var str2 = new String(f.name);
			var str3 = str + str2 + '';
			var o = overrides.fields[str3];
			var e = external.fields[str3];
			
			var needNames = {};
			
			if (Y.Lang.isObject(o) && o.visible)
			{
				if (Y.Lang.isValue(o.rename))
				{
					var field = {}
					Y.mix(field, f, {"label" : o.rename, "name" : o.rename});
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
		    var freshName = this.generateNextName(f.name, usedNames);
		    
		    addFieldToUsed(freshName, f);
		    
		    var field = {}
		    Y.mix(field, f);
		    field.name = freshName;
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
			    
			    if (Y.Lang.isObject(o) && o.visible)
			    {
				    if (Y.Lang.isValue(o.rename))
				    {
					    var terminal = {};
					    Y.mix(terminal, t);
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
			Y.mix(terminal, t);
			terminal.name = freshName;
			
			terminals.push(terminal);
		}
		
		return terminals;
	},
	
	generateNextName: function(name, usedNames)
	{
		var used = function(name)
			{
				return Y.Lang.isValue(usedNames[name]);
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
		Y.mix(fullConfig, m.config);
		Y.mix(fullConfig, getBaseConfig(m.name))
		
		if (Y.Lang.isArray(fullConfig.fields))
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
		
		if (Y.Lang.isObject(c.form))
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
		Y.mix(fullConfig, m.config);
		Y.mix(fullConfig, getBaseConfig(m.name))
		
		if (Y.Lang.isArray(fullConfig.terminals))
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

	getInternalModuleConfig: function(containers, center)
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
	
	getWireConfig: function(group, getInternalContainerId, getExternalTerminalName)
	{
		var externalWires = [];
		var internalWires = [];
		
		this.addWireConfig(group, getInternalContainerId, getExternalTerminalName, externalWires, internalWires);
		
		return {"external" : externalWires, "internal" : internalWires};
	},
	
	
	
	addWireConfig: function(group, getInternalContainerId, getExternalTerminalName, externalWires, internalWires, groupIndex)
	{
	    var pushUniqueWireConfig = function(wires, newWire) {
    	  var foundWire= false;
    	  var wire;
    	  for(var w in wires) {
    	      wire= wires[w];
    	      if( wire.src.moduleId == newWire.src.moduleId && 
    	          wire.tgt.moduleId == newWire.tgt.moduleId &&
    	          wire.src.terminal == newWire.src.terminal &&
    	          wire.tgt.terminal == newWire.tgt.terminal) {
    	              foundWire=true;
    	              break;
    	          }
    	  }
    	  if(!foundWire) {
    	      wires.push(newWire);  
          }
    	};
    	
		var addWiresForContainer = function(c, getExternalName)
		    {
			for (var wI in c.wires)
			{
			    var w = c.wires[wI];
			    
			    var srcIndex = getInternalContainerId(w.terminal1.container)
			    var tgtIndex = getInternalContainerId(w.terminal2.container)
			    
			    if (srcIndex != -1 && tgtIndex != -1)
			    {
				    pushUniqueWireConfig(internalWires,{
					    src: {moduleId: srcIndex, terminal: w.terminal1.options.name}, 
					    tgt: {moduleId: tgtIndex, terminal: w.terminal2.options.name}
					});
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
		
		if (!Y.Lang.isValue(groupIndex))
		    groupIndex = 0;
		    
		if (Y.Lang.isValue(group.groupContainer))
		{
		    addWiresForContainer(group.groupContainer, function(name) { return getExternalTerminalName("group", groupIndex, name); });
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
			var g = group.groups[gI].group;
			
			this.addWireConfig(g, getInternalContainerId, getExternalTerminalName, externalWires, internalWires, parseInt(gI)+groupIndex);
		    }
		}
	},
	
	firstTestSucess: function(anarray, atest)
	{
	    var index;
	    for (index = 0; index < anarray.length; index++)
	    {
		if (atest(anarray[index]))
		    return index;
	    }
	    
	    return -1;
	}
    }
})();