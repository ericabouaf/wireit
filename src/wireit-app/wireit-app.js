YUI.add('wireit-app', function(Y) {

// -- Editor View ------------------------------------------------------------
Y.EditorView = Y.Base.create('editorView', Y.View, [], {
	initializer: function () {
		this.containerTypeListView = new Y.ContainerTypeListView({containerTypes: this.get('containerTypes') });
	},
	
	create: function (container) {
		// Adds CSS class to the container node.
		return Y.one(container).addClass('editor');
	},
	
	render: function () {
		
		// A document fragment is created to hold the resulting HTML created
		// from rendering to two sub-views.
		var content = Y.one(Y.config.doc.createDocumentFragment());
		
		// This renders each of the two sub-views into the document fragment,
		// then sets the fragment as the contents of this view's container.
		content.append(this.containerTypeListView.render().get('container'));
		this.get('container').setContent(content);
		
		
		// Make items draggable to the layer
		var that = this;
		this.containerTypeListView.get('container').all('.containerType-name').each(function(node) {
			
			var drag = new Y.DD.Drag({ 
				node: node,
				groups: ['containerType']
			}).plug(Y.Plugin.DDProxy, {
				cloneNode: true,
				moveOnEnd: false
			});
			drag._containerTypeName = node._node.innerHTML;
			
			// On drom, add it to the layer
			drag.on('drag:drophit',  function(ev) {
				that._addContainerFromName(ev.drag._containerTypeName, {
					x: ev.drag.lastXY[0],
					y: ev.drag.lastXY[1]
				});
			});
			
			
		});
		
		
		
		
		Y.Node.create('<a href="#/">List</a>').appendTo( this.get('container') );
		
		Y.Node.create('<input id="wiring-name" />').appendTo( this.get('container') );
		
		Y.Node.create('<a>Save</a>').appendTo( this.get('container') ).on('click', function() {
			var wiring = this.get('wiring') || new Y.WiringModel({});
			wiring.set('name', Y.one('#wiring-name').get('value') || 'Unnamed');
			
			var layer = this.layer,
				layerConf = layer.toJSON();
			wiring.set('containers', []); // TODO
			wiring.set('wires', []); // TODO
			
			wiring.save();
			
		}, this);
		
		this.layer = new Y.Layer({
			width: 900,
			height: 500
		});
		
		// Create the Drop object
		var drop = new Y.DD.Drop({
			node: this.layer.get('contentBox'),
			groups: ['containerType']
		});
		//drop.layer = this.layer;
		
		var wiring = this.get('wiring');
		if(wiring) {
			this.setWiring( wiring );
		}
		
		this.layer.render( this.get('container') );
		
		return this;
	},
	
	setWiring: function(wiring) {
		
		var that = this;
		
		Y.Array.each( wiring.get('containers'), function(container) {
			
			that._addContainerFromName(container.containerType,  container.config);
			
			Y.on('available', function(el) {
				Y.one('#wiring-name').set('value', wiring.get('name') );
			}, '#wiring-name');
			
		});
		
	},
	
	_addContainerFromName: function(containerTypeName, containerConfig) {
		var containerType = this.get('containerTypes').getById(containerTypeName);
		
		var containerConf = Y.mix({}, containerType.get('config'));
		
		containerConf = Y.mix(containerConf, containerConfig);
		
		this.layer.add(containerConf);
	}
	
}, {
	ATTRS: {
		containerTypes: {
			value: null
		},
		
		wiring: {
			value: null
		}
	}
});

// -- WireIt App ---------------------------------------------------------
Y.WireItApp = new Y.Base.create('contributorsApp', Y.App, [], {
	
	// This is where we can declare our page-level views and define the
	// relationship between the "pages" of our application. We can later use the
	// `showView()` method to create and display these views.
	views: {
		editorPage: {
			type: Y.EditorView
		},
		wiringListPage: {
			type: Y.WiringListView
		}
	},
	
	initializer: function () {
		// When a user navigates to different "pages" within our app, the
		// `navigate` event will fire; we can listen to this event and show some
		// indication that the app is busy loading data.
		this.on('navigate', this.indicateLoading);
		
		// Here we register a listener for the `HomePageView`'s `changeUser`
		// event. When the `HomePageView` is the `activeView`, its events will
		// bubble up to this app instance.
		//this.on('homePageView:changeUser', this.navigateToUser);
		
		// Once our app is ready, we'll either dispatch to our route-handlers if
		// the current URL matches one of our routes, or we'll simply show the
		// `HomePageView`.
		this.once('ready', function (e) {
			if (this.hasRoute(this.getPath())) {
				this.dispatch();
			} else {
				this.showWiringListPage();
			}
		});
	},
	
	// -- Event Handlers -------------------------------------------------------
	
	indicateLoading: function (e) {
		this.get('activeView').get('container').addClass('loading');
	},
	
	// -- Route Handlers -------------------------------------------------------
	
	handleWiring: function (req, res, next) {
		var wiringId = req.params.wiring,
			wirings = this.get('wirings'),
			wiring = wirings.getById(wiringId);
		
		this.set('wiring', wiring);
		
		next();
	},

	showEditorPage: function() {
		this.showView('editorPage', {
			containerTypes: this.get('containerTypes'),
			wirings: this.get('wirings'),
			wiring: this.get('wiring')
		});
	},
	
	blankEditorPage: function() {
		this.showView('editorPage', {
			containerTypes: this.get('containerTypes'),
			wirings: this.get('wirings'),
			wiring: null
		});
	},
	
	showWiringListPage: function() {
		this.showView('wiringListPage', {
			wirings: this.get('wirings')
		});
	}

}, {
	ATTRS: {
		
		containerTypes: {
			value: new Y.ContainerTypeList()
		},
		
		wirings: {
			value: new Y.WiringModelList()
		},
		
		wiring: {
			value: null
		},
		
		// Our app will use more advanced routing features where multiple
		// route-handlers will be used to fulfill a "request", allowing us to
		// encapsulate and reuse our data processing logic. Note: the order the
		// route-handlers are defined in is significant.
		routes: {
			value: [
				{path: '/', callback: 'showWiringListPage'},
				{path: '/wirings/:wiring/*', callback: 'handleWiring'},
				{path: '/wirings/:wiring/edit', callback: 'showEditorPage'},
				
				{path: '/wirings/new', callback: 'blankEditorPage'}
			]
		}
	}
});


}, '3.5.0pr1a', {requires: ['app', 'handlebars', 'container-type', 'wiring-model', 'layer', 'bezier-wire']});
