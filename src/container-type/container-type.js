YUI.add('container-type', function(Y) {

// -- ContainerType ---------------------------------------------------------------------
Y.ContainerType = Y.Base.create('containerModel', Y.Model, [], {
	// The `id` attribute for this Model will be an alias for `name`.
	idAttribute: 'name'
}, {
	ATTRS: {
		name       : {value: null},
		description: {value: null},
		config   : {value: null}
	}
});


// -- ContainerTypeList -----------------------------------------------------------------
Y.ContainerTypeList = Y.Base.create('containerTypeList', Y.ModelList, [], {
	model: Y.ContainerType
}, {
	ATTRS: {
	}
});


// -- ContainerTypeList View ------------------------------------------------------------
Y.ContainerTypeListView = Y.Base.create('containerTypeListView', Y.View, [], {
	
	template: Y.Handlebars.compile(Y.one('#t-containerType-list').getContent()),
	
	render: function () {
		var containerTypes = this.get('containerTypes'), containerTypesData, content;
		
		containerTypesData = containerTypes.map(function (containerType) {
			var data = containerType.toJSON();
			return data;
		});
		
		content = this.template({containerTypes: containerTypesData});
		this.get('container').setContent(content);
		
		return this;
	}
}, {
	ATTRS: {
		containerTypes: {
			value: new Y.ContainerTypeList()
		}
	}
});

}, '3.5.0pr1a', {requires: ['model', 'model-list', 'json', 'view']});
