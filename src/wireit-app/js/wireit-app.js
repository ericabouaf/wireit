/**
 * @module wireit-app
 */



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

