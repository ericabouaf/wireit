(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    
    WireIt.Group = function (value, displayDiv) {
	this.value = value;
	
	this.setupDisplay(displayDiv);
	
	for (var cI in this.value.containers)
	{
	    var c = this.value.containers[cI];

	    c.eventFocus.subscribe(this.onContainerFocus, this, true);
	}
    },

    WireIt.Group.prototype = {
	
	setupDisplay: function(displayDiv)
	{
	    this.display = {};
	    this.display.mainDiv = displayDiv;
	    
	    this.display.buttonsElement = WireIt.cn("div");
	    displayDiv.appendChild(this.panel.buttonsElement);
	    
	    var okButton = WireIt.cn("button", {}, {}, "Make Group");
	    okButton.id = "groupPanelOkButton";
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
	    	    
	    Event.addListener('groupPanelOkButton','click', function() {
			    alert("ok clicked")
		    }, this, true);
	},
	
	onContainerFocus: function(eventName, container)
	{
	    this.addAvailableFields();
	    this.addAvailableTerminals();
	    
	    this.setCurrentFieldConfigs();
	    this.setCurrentTerminalConfigs();
	},
	
	addAvailableFields: function()
	{
	    var list = this.display.list;
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
		    list.appendChild(row)
		    
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
	    
	    var addField = function(field, fieldConfig, moduleId, fieldTerminals)
		{
		    var bg = field.divEl.style.backgroundColor;
			
		    showOn = function()
			{ 
			    centerLayer(field.options.container.el, layer.el);
			    field.divEl.style.backgroundColor = "yellow"; 
			};
		    showCancel = function () { field.divEl.style.backgroundColor = bg;  };
		    
		    
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
		    
		    var fragment = addRemapInput(field.options.name, moduleId, field.options.container.options.title, showOn, showCancel, defaultVisible,  field.options.name, false, visibleReadOnly);
		    
		    fragment.fieldConfig = fieldConfig;
		    fragment.field = field;
		    
		    configUIFieldMap.push(fragment)
		}
	    
	    this.display.list.innerHTML = "";
	    this.display.list.appendChild(this.panel.listHeadRow);
	    
	    for(var cI = 0; cI < this.value.containers.length; cI++)
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
	},

    }
})();