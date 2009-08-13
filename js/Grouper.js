(function() {
    WireIt.Grouper = function (layer, baseConfigFunction) {
	this.layer = layer;
	this.baseConfigFunction = baseConfigFunction;
    },

    WireIt.Grouper.prototype = {
    containers : [],
    
    add: function(container) {
	this.containers.push(container)
	container.addedToGroup()
    },
	
    remove: function(container) {
	this.containers.splice(this.containers.indexOf(container), 1)
	container.removedFromGroup();
    },
	
    toggle: function(container) {
	if (this.containers.indexOf(container) == -1)
	    this.add(container)
	else
	    this.remove(container)
    },
    
    collapse: function()
    {
	var gc = this.layer.addContainer(
	    {
	   		"xtype": "WireIt.GroupFormContainer",
	   		"title": "Group",    

	   		"collapsible": true,
	   		"fields": [ ],
	   		"legend": "Inner group fields",
			"groupContainers" : this.containers,
			"getBaseConfigFunction" : this.baseConfigFunction
	    }
	)
	
	gc.addWires();
	
	if (this.containers.length > 0)
	{
	    for (var i in this.containers)
	    {
		var elem = this.containers[i]
		
		this.layer.removeContainer(elem);
	    }
	}
	
	this.containers = []
	this.lastGroupFormContainer = gc;
    },
    
    expand: function()
    {
	gc.expand();
    }
}
})();