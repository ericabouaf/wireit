/**
 * @module wireit-app
 */

// -- WiringModel ---------------------------------------------------------------------
Y.WiringModel = Y.Base.create('wiringModel', Y.Model, [], {
   sync: LocalStorageSync('wireit-app')
}, {
   ATTRS: {
      id: {value: null},
      name       : {value: ''},
      containers   : {value: []},
      description: {value: ''},
      wires   : {value: []}
   }
});


// -- WiringModelList ---------------------------------------------------------------------

Y.WiringModelList = Y.Base.create('wiringModelList', Y.ModelList, [], {
   sync: LocalStorageSync('wireit-app'),
    model    : Y.WiringModel
});

// -- WiringList View ------------------------------------------------------------

Y.WiringListView = Y.Base.create('wiringListView', Y.View, [], {
   
   template: Y.Handlebars.compile(Y.one('#t-wiring-list').getContent()),
   
   initializer: function () {
      
      //console.log('WiringListView init');
      
      /*var list = this.get('modelList');
      
      // Re-render this view when a model is added to or removed from the model list.
      list.after(['add', 'remove', 'reset'], this._test, this);
      
      // We'll also re-render the view whenever the data of one of the models in the list changes.
      list.after('*:change', this._test, this);*/
   },
   
   /*_test: function () {
      console.log('_test');
   },*/
   
   render: function () {
      
      //console.log('WiringListView render');
      
      var content = this.template({wirings: this.get('modelList').toJSON() });
      this.get('container').setContent(content);
      return this;
   }
});


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
});

// -- Editor View ------------------------------------------------------------
Y.EditorView = Y.Base.create('editorView', Y.View, [], {
   
   template: Y.Handlebars.compile(Y.one('#t-editor').getContent()),
   
   events: {
      '#wiring-save-btn': {click: 'saveWiring'}
   },
   
   render: function () {
      
      var content = this.template({
         containerTypes: this.get('containerTypes').toJSON()
      });
      this.get('container').setContent(content);
      
      
      // Make items draggable to the layer
      var that = this;
      this.get('container').all('.containerType-name').each(function (node) {
         
         var drag = new Y.DD.Drag({ 
            node: node,
            groups: ['containerType']
         }).plug(Y.Plugin.DDProxy, {
            cloneNode: true,
            moveOnEnd: false
         });
         drag._containerTypeName = node._node.innerHTML;
         
         // On drom, add it to the layer
         drag.on('drag:drophit',  function (ev) {
            that._addContainerFromName(ev.drag._containerTypeName, {
               x: ev.drag.lastXY[0],
               y: ev.drag.lastXY[1]
            });
         });
         
         
      });
      
      this._renderLayer();
      
      return this;
   },
   
   _renderLayer: function () {
      
      this.layer = new Y.Layer({
         //width: 900,
         height: 500
      });
      
      // Create the Drop object
      var drop = new Y.DD.Drop({
         node: this.layer.get('contentBox'),
         groups: ['containerType']
      });
      //drop.layer = this.layer;
      
      var wiring = this.get('model');
      if(wiring) {
         this.setWiring( wiring );
      }
      
      this.layer.render( this.get('container').one('#layer-container') );
      
   },
   
   saveWiring: function (e) {
      var o = {
         name: Y.one('#wiring-name').get('value') || 'Unnamed'
      };
      
      // Children are containers
      o.containers = [];
      Y.Array.each(this.layer._items, function (item) {
         o.containers.push({
            containerType: item.containerTypeName,
            config: item.toJSON()
         });
      });
      
      // Wires:
      o.wires = [];
      var layer = this.layer;
      Y.Array.each(this.layer._wires, function (wire) {
         
         var src = wire.get('src');
         var tgt = wire.get('tgt');
         
         o.wires.push( {
            src: { container: layer._items.indexOf( src.get('parent') ), terminal: src.get('name') },
            tgt: { container: layer._items.indexOf( tgt.get('parent') ), terminal: tgt.get('name') },
            config: wire.toJSON()
         });
      });
      
      
      if( this.get('model') ) {
         this.get('model').setAttrs(o);
      }
      else {
         this.set('model', new Y.WiringModel(o) );
      }
      
      this.get('model').save();
      
      // TODO: add only one message
      var s = Y.Node.create('<div class="alert-message bg-warning" style="width: 300px; z-index: 10001;"><p>Saved !</p></div>').appendTo(document.body);
      var anim = new Y.Anim({
          node: s,
          duration: 0.5,
          easing: Y.Easing.easeOut,
         from: { xy: [400, -50] },
         to: { xy: [400, 2] }
      });
      anim.on('end', function () {
         Y.later(1000, this, function () {
            (new Y.Anim({
                node: s,
                duration: 0.5,
                easing: Y.Easing.easeOut,
               to: { xy: [400, -50] }
            })).run();
         });
      });
      anim.run();
      
      
   },
   
   setWiring: function (wiring) {
      
      var that = this;
      
      var layer = this.layer;
      
      Y.Array.each( wiring.get('containers'), function (container) {
         
         that._addContainerFromName(container.containerType,  container.config);
         
         Y.on('available', function (el) {
            Y.one('#wiring-name').set('value', wiring.get('name') );
         }, '#wiring-name');
         
      });
      
      Y.Array.each( wiring.get('wires'), function (wire) {
         
         // prevent bad configs...
         if(!wire.src || !wire.tgt) return;
         
         var srcContainer = layer.item(wire.src.container);
         var srcTerminal = srcContainer.getTerminal(wire.src.terminal);
         
         var tgtContainer = layer.item(wire.tgt.container);
         var tgtTerminal = tgtContainer.getTerminal(wire.tgt.terminal);
         
         // TODO: wire.config;
         
         var w = layer.graphic.addShape({
            type: Y.BezierWire,
            stroke: {
                weight: 4,
                color: "rgb(173,216,230)" 
            },


            src: srcTerminal,
            tgt: tgtTerminal

         });
         
      });
      
      // TODO: this is awful ! But we need to wait for everything to render & position
      Y.later(1000, this, function () {
         layer.redrawAllWires();
      });
      
   },
   
   _addContainerFromName: function (containerTypeName, containerConfig) {
      var containerType = this.get('containerTypes').getById(containerTypeName);
      var containerConf = Y.mix({}, containerType.get('config'));
      containerConf = Y.mix(containerConf, containerConfig);
      this.layer.add(containerConf);
      var container =  this.layer.item(this.layer.size()-1);
      container.containerTypeName = containerTypeName;
   }
   
}, {
   ATTRS: {
      containerTypes: {
         value: null
      }
   }
});

// -- WireIt App ---------------------------------------------------------
Y.WireItApp = new Y.Base.create('contributorsApp', Y.App, [], {
   
   views: {
      editorPage: {
         type: Y.EditorView
      },
      wiringListPage: {
         type: Y.WiringListView
      }
   },
   
   initializer: function () {
      
      // show indication that the app is busy loading data.
      this.on('navigate', this.indicateLoading);
      
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
         wirings = this.get('modelList'),
         wiring = wirings.getById(wiringId);
      
      this.set('wiring', wiring);
      
      next();
   },

   showEditorPage: function () {
      this.showView('editorPage', {
         containerTypes: this.get('containerTypes'),
         wirings: this.get('modelList'),
         model: this.get('wiring')
      });
   },
   
   blankEditorPage: function () {
      this.showView('editorPage', {
         containerTypes: this.get('containerTypes'),
         wirings: this.get('modelList'),
         model: null
      });
   },
   
   showWiringListPage: function () {
      
      //this.get('modelList').load();
      
      var wirings = new Y.WiringModelList();
      wirings.load();
      this.set('modelList', wirings);
      
      this.showView('wiringListPage', {
         modelList: this.get('modelList')
      });
   }

}, {
   ATTRS: {
      
      containerTypes: {
         value: new Y.ContainerTypeList()
      },
      
      modelList: {
         value: new Y.WiringModelList()
      },
      
      wiring: {
         value: null
      },
      
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

