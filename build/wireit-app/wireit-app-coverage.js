if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/wireit-app/wireit-app.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/wireit-app/wireit-app.js",
    code: []
};
_yuitest_coverage["build/wireit-app/wireit-app.js"].code=["YUI.add('wireit-app', function (Y, NAME) {","","/**"," * @module wireit-app"," */","","// -- LocalStorageSync ---------------------------------------------------------------------","// Saves WiringModel","function LocalStorageSync(key) {","    var localStorage;","","    if (!key) {","        Y.error('No storage key specified.');","    }","","    if (Y.config.win.localStorage) {","        localStorage = Y.config.win.localStorage;","    }","","    // Try to retrieve existing data from localStorage, if there is any.","    // Otherwise, initialize `data` to an empty object.","    var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');","","    // Delete a model with the specified id.","    function destroy(id) {","        var modelHash;","","        if ((modelHash = data[id])) {","            delete data[id];","            save();","        }","","        return modelHash;","    }","","    // Generate a unique id to assign to a newly-created model.","    function generateId() {","        var id = '',","            i  = 4;","","        while (i--) {","            id += (((1 + Math.random()) * 0x10000) | 0)","                    .toString(16).substring(1);","        }","","        return id;","    }","","    // Loads a model with the specified id. This method is a little tricky,","    // since it handles loading for both individual models and for an entire","    // model list.","    //","    // If an id is specified, then it loads a single model. If no id is","    // specified then it loads an array of all models. This allows the same sync","    // layer to be used for both the TodoModel and TodoList classes.","    function get(id) {","        return id ? data[id] : Y.Object.values(data);","    }","","    // Saves the entire `data` object to localStorage.","    function save() {","        localStorage && localStorage.setItem(key, Y.JSON.stringify(data));","    }","","    // Sets the id attribute of the specified model (generating a new id if","    // necessary), then saves it to localStorage.","    function set(model) {","        var hash        = model.toJSON(),","            idAttribute = model.idAttribute;","","        if (!Y.Lang.isValue(hash[idAttribute])) {","            hash[idAttribute] = generateId();","        }","","        data[hash[idAttribute]] = hash;","        save();","","        return hash;","    }","","    // Returns a `sync()` function that can be used with either a Model or a","    // ModelList instance.","    return function (action, options, callback) {","        // `this` refers to the Model or ModelList instance to which this sync","        // method is attached.","        var isModel = Y.Model && this instanceof Y.Model;","","        switch (action) {","        case 'create': // intentional fallthru","        case 'update':","            callback(null, set(this));","            return;","","        case 'read':","            callback(null, get(isModel && this.get('id')));","            return;","","        case 'delete':","            callback(null, destroy(isModel && this.get('id')));","            return;","        }","    };","}","","","// -- WiringModel ---------------------------------------------------------------------","Y.WiringModel = Y.Base.create('wiringModel', Y.Model, [], {","   sync: LocalStorageSync('wireit-app')","}, {","   ATTRS: {","      id: {value: null},","      name       : {value: ''},","      containers   : {value: []},","      description: {value: ''},","      wires   : {value: []}","   }","});","","","// -- WiringModelList ---------------------------------------------------------------------","","Y.WiringModelList = Y.Base.create('wiringModelList', Y.ModelList, [], {","   sync: LocalStorageSync('wireit-app'),","    model    : Y.WiringModel","});","","// -- WiringList View ------------------------------------------------------------","","Y.WiringListView = Y.Base.create('wiringListView', Y.View, [], {","   ","   template: Y.Handlebars.compile(Y.one('#t-wiring-list').getContent()),","   ","   initializer: function () {","      ","      //console.log('WiringListView init');","      ","      /*var list = this.get('modelList');","      ","      // Re-render this view when a model is added to or removed from the model list.","      list.after(['add', 'remove', 'reset'], this._test, this);","      ","      // We'll also re-render the view whenever the data of one of the models in the list changes.","      list.after('*:change', this._test, this);*/","   },","   ","   /*_test: function () {","      console.log('_test');","   },*/","   ","   render: function () {","      ","      //console.log('WiringListView render');","      ","      var content = this.template({wirings: this.get('modelList').toJSON() });","      this.get('container').setContent(content);","      return this;","   }","});","","","// -- ContainerType ---------------------------------------------------------------------","Y.ContainerType = Y.Base.create('containerModel', Y.Model, [], {","   // The `id` attribute for this Model will be an alias for `name`.","   idAttribute: 'name'","}, {","   ATTRS: {","      name       : {value: null},","      description: {value: null},","      config   : {value: null}","   }","});","","// -- ContainerTypeList -----------------------------------------------------------------","Y.ContainerTypeList = Y.Base.create('containerTypeList', Y.ModelList, [], {","   model: Y.ContainerType","});","","// -- Editor View ------------------------------------------------------------","Y.EditorView = Y.Base.create('editorView', Y.View, [], {","   ","   template: Y.Handlebars.compile(Y.one('#t-editor').getContent()),","   ","   events: {","      '#wiring-save-btn': {click: 'saveWiring'}","   },","   ","   render: function () {","      ","      var content = this.template({","         containerTypes: this.get('containerTypes').toJSON()","      });","      this.get('container').setContent(content);","      ","      ","      // Make items draggable to the layer","      var that = this;","      this.get('container').all('.containerType-name').each(function (node) {","         ","         var drag = new Y.DD.Drag({ ","            node: node,","            groups: ['containerType']","         }).plug(Y.Plugin.DDProxy, {","            cloneNode: true,","            moveOnEnd: false","         });","         drag._containerTypeName = node._node.innerHTML;","         ","         // On drom, add it to the layer","         drag.on('drag:drophit',  function (ev) {","            that._addContainerFromName(ev.drag._containerTypeName, {","               x: ev.drag.lastXY[0],","               y: ev.drag.lastXY[1]","            });","         });","         ","         ","      });","      ","      this._renderLayer();","      ","      return this;","   },","   ","   _renderLayer: function () {","      ","      this.layer = new Y.Layer({","         //width: 900,","         height: 500","      });","      ","      // Create the Drop object","      var drop = new Y.DD.Drop({","         node: this.layer.get('contentBox'),","         groups: ['containerType']","      });","      //drop.layer = this.layer;","      ","      var wiring = this.get('model');","      if(wiring) {","         this.setWiring( wiring );","      }","      ","      this.layer.render( this.get('container').one('#layer-container') );","      ","   },","   ","   saveWiring: function (e) {","      var o = {","         name: Y.one('#wiring-name').get('value') || 'Unnamed'","      };","      ","      // Children are containers","      o.containers = [];","      Y.Array.each(this.layer._items, function (item) {","         o.containers.push({","            containerType: item.containerTypeName,","            config: item.toJSON()","         });","      });","      ","      // Wires:","      o.wires = [];","      var layer = this.layer;","      Y.Array.each(this.layer._wires, function (wire) {","         ","         var src = wire.get('src');","         var tgt = wire.get('tgt');","         ","         o.wires.push( {","            src: { container: layer._items.indexOf( src.get('parent') ), terminal: src.get('name') },","            tgt: { container: layer._items.indexOf( tgt.get('parent') ), terminal: tgt.get('name') },","            config: wire.toJSON()","         });","      });","      ","      ","      if( this.get('model') ) {","         this.get('model').setAttrs(o);","      }","      else {","         this.set('model', new Y.WiringModel(o) );","      }","      ","      this.get('model').save();","      ","      // TODO: add only one message","      var s = Y.Node.create('<div class=\"alert-message warning\" style=\"width: 300px; z-index: 10001;\"><p>Saved !</p></div>').appendTo(document.body);","      var anim = new Y.Anim({","          node: s,","          duration: 0.5,","          easing: Y.Easing.easeOut,","         from: { xy: [400, -50] },","         to: { xy: [400, 2] }","      });","      anim.on('end', function () {","         Y.later(1000, this, function () {","            (new Y.Anim({","                node: s,","                duration: 0.5,","                easing: Y.Easing.easeOut,","               to: { xy: [400, -50] }","            })).run();","         });","      });","      anim.run();","      ","      ","   },","   ","   setWiring: function (wiring) {","      ","      var that = this;","      ","      var layer = this.layer;","      ","      Y.Array.each( wiring.get('containers'), function (container) {","         ","         that._addContainerFromName(container.containerType,  container.config);","         ","         Y.on('available', function (el) {","            Y.one('#wiring-name').set('value', wiring.get('name') );","         }, '#wiring-name');","         ","      });","      ","      Y.Array.each( wiring.get('wires'), function (wire) {","         ","         // prevent bad configs...","         if(!wire.src || !wire.tgt) return;","         ","         var srcContainer = layer.item(wire.src.container);","         var srcTerminal = srcContainer.getTerminal(wire.src.terminal);","         ","         var tgtContainer = layer.item(wire.tgt.container);","         var tgtTerminal = tgtContainer.getTerminal(wire.tgt.terminal);","         ","         // TODO: wire.config;","         ","         var w = layer.graphic.addShape({","            type: Y.BezierWire,","            stroke: {","                weight: 4,","                color: \"rgb(173,216,230)\" ","            },","","","            src: srcTerminal,","            tgt: tgtTerminal","","         });","         ","      });","      ","      // TODO: this is awful ! But we need to wait for everything to render & position","      Y.later(1000, this, function () {","         layer.redrawAllWires();","      });","      ","   },","   ","   _addContainerFromName: function (containerTypeName, containerConfig) {","      var containerType = this.get('containerTypes').getById(containerTypeName);","      var containerConf = Y.mix({}, containerType.get('config'));","      containerConf = Y.mix(containerConf, containerConfig);","      this.layer.add(containerConf);","      var container =  this.layer.item(this.layer.size()-1);","      container.containerTypeName = containerTypeName;","   }","   ","}, {","   ATTRS: {","      containerTypes: {","         value: null","      }","   }","});","","// -- WireIt App ---------------------------------------------------------","Y.WireItApp = new Y.Base.create('contributorsApp', Y.App, [], {","   ","   views: {","      editorPage: {","         type: Y.EditorView","      },","      wiringListPage: {","         type: Y.WiringListView","      }","   },","   ","   initializer: function () {","      ","      // show indication that the app is busy loading data.","      this.on('navigate', this.indicateLoading);","      ","      this.once('ready', function (e) {","         if (this.hasRoute(this.getPath())) {","            this.dispatch();","         } else {","            this.showWiringListPage();","         }","      });","   },","   ","   // -- Event Handlers -------------------------------------------------------","   ","   indicateLoading: function (e) {","      this.get('activeView').get('container').addClass('loading');","   },","   ","   // -- Route Handlers -------------------------------------------------------","   ","   handleWiring: function (req, res, next) {","      var wiringId = req.params.wiring,","         wirings = this.get('modelList'),","         wiring = wirings.getById(wiringId);","      ","      this.set('wiring', wiring);","      ","      next();","   },","","   showEditorPage: function () {","      this.showView('editorPage', {","         containerTypes: this.get('containerTypes'),","         wirings: this.get('modelList'),","         model: this.get('wiring')","      });","   },","   ","   blankEditorPage: function () {","      this.showView('editorPage', {","         containerTypes: this.get('containerTypes'),","         wirings: this.get('modelList'),","         model: null","      });","   },","   ","   showWiringListPage: function () {","      ","      //this.get('modelList').load();","      ","      var wirings = new Y.WiringModelList();","      wirings.load();","      this.set('modelList', wirings);","      ","      this.showView('wiringListPage', {","         modelList: this.get('modelList')","      });","   }","","}, {","   ATTRS: {","      ","      containerTypes: {","         value: new Y.ContainerTypeList()","      },","      ","      modelList: {","         value: new Y.WiringModelList()","      },","      ","      wiring: {","         value: null","      },","      ","      routes: {","         value: [","            {path: '/', callback: 'showWiringListPage'},","            {path: '/wirings/:wiring/*', callback: 'handleWiring'},","            {path: '/wirings/:wiring/edit', callback: 'showEditorPage'},","            {path: '/wirings/new', callback: 'blankEditorPage'}","         ]","      }","   }","});","","","","}, '@VERSION@', {\"requires\": [\"app\", \"handlebars\", \"model\", \"model-list\", \"json\", \"view\", \"layer\", \"bezier-wire\", \"anim\"]});"];
_yuitest_coverage["build/wireit-app/wireit-app.js"].lines = {"1":0,"9":0,"10":0,"12":0,"13":0,"16":0,"17":0,"22":0,"25":0,"26":0,"28":0,"29":0,"30":0,"33":0,"37":0,"38":0,"41":0,"42":0,"46":0,"56":0,"57":0,"61":0,"62":0,"67":0,"68":0,"71":0,"72":0,"75":0,"76":0,"78":0,"83":0,"86":0,"88":0,"91":0,"92":0,"95":0,"96":0,"99":0,"100":0,"107":0,"122":0,"129":0,"154":0,"155":0,"156":0,"162":0,"174":0,"179":0,"189":0,"192":0,"196":0,"197":0,"199":0,"206":0,"209":0,"210":0,"219":0,"221":0,"226":0,"232":0,"238":0,"239":0,"240":0,"243":0,"248":0,"253":0,"254":0,"255":0,"262":0,"263":0,"264":0,"266":0,"267":0,"269":0,"277":0,"278":0,"281":0,"284":0,"287":0,"288":0,"295":0,"296":0,"297":0,"305":0,"312":0,"314":0,"316":0,"318":0,"320":0,"321":0,"326":0,"329":0,"331":0,"332":0,"334":0,"335":0,"339":0,"355":0,"356":0,"362":0,"363":0,"364":0,"365":0,"366":0,"367":0,"379":0,"393":0,"395":0,"396":0,"397":0,"399":0,"407":0,"413":0,"417":0,"419":0,"423":0,"431":0,"442":0,"443":0,"444":0,"446":0};
_yuitest_coverage["build/wireit-app/wireit-app.js"].functions = {"destroy:25":0,"generateId:37":0,"get:56":0,"save:61":0,"set:67":0,"(anonymous 2):83":0,"LocalStorageSync:9":0,"render:150":0,"(anonymous 4):209":0,"(anonymous 3):197":0,"render:187":0,"_renderLayer:224":0,"(anonymous 5):254":0,"(anonymous 6):264":0,"(anonymous 8):296":0,"(anonymous 7):295":0,"saveWiring:247":0,"(anonymous 10):320":0,"(anonymous 9):316":0,"(anonymous 11):326":0,"(anonymous 12):355":0,"setWiring:310":0,"_addContainerFromName:361":0,"(anonymous 13):395":0,"initializer:390":0,"indicateLoading:406":0,"handleWiring:412":0,"showEditorPage:422":0,"blankEditorPage:430":0,"showWiringListPage:438":0,"(anonymous 1):1":0};
_yuitest_coverage["build/wireit-app/wireit-app.js"].coveredLines = 121;
_yuitest_coverage["build/wireit-app/wireit-app.js"].coveredFunctions = 31;
_yuitest_coverline("build/wireit-app/wireit-app.js", 1);
YUI.add('wireit-app', function (Y, NAME) {

/**
 * @module wireit-app
 */

// -- LocalStorageSync ---------------------------------------------------------------------
// Saves WiringModel
_yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 1)", 1);
_yuitest_coverline("build/wireit-app/wireit-app.js", 9);
function LocalStorageSync(key) {
    _yuitest_coverfunc("build/wireit-app/wireit-app.js", "LocalStorageSync", 9);
_yuitest_coverline("build/wireit-app/wireit-app.js", 10);
var localStorage;

    _yuitest_coverline("build/wireit-app/wireit-app.js", 12);
if (!key) {
        _yuitest_coverline("build/wireit-app/wireit-app.js", 13);
Y.error('No storage key specified.');
    }

    _yuitest_coverline("build/wireit-app/wireit-app.js", 16);
if (Y.config.win.localStorage) {
        _yuitest_coverline("build/wireit-app/wireit-app.js", 17);
localStorage = Y.config.win.localStorage;
    }

    // Try to retrieve existing data from localStorage, if there is any.
    // Otherwise, initialize `data` to an empty object.
    _yuitest_coverline("build/wireit-app/wireit-app.js", 22);
var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

    // Delete a model with the specified id.
    _yuitest_coverline("build/wireit-app/wireit-app.js", 25);
function destroy(id) {
        _yuitest_coverfunc("build/wireit-app/wireit-app.js", "destroy", 25);
_yuitest_coverline("build/wireit-app/wireit-app.js", 26);
var modelHash;

        _yuitest_coverline("build/wireit-app/wireit-app.js", 28);
if ((modelHash = data[id])) {
            _yuitest_coverline("build/wireit-app/wireit-app.js", 29);
delete data[id];
            _yuitest_coverline("build/wireit-app/wireit-app.js", 30);
save();
        }

        _yuitest_coverline("build/wireit-app/wireit-app.js", 33);
return modelHash;
    }

    // Generate a unique id to assign to a newly-created model.
    _yuitest_coverline("build/wireit-app/wireit-app.js", 37);
function generateId() {
        _yuitest_coverfunc("build/wireit-app/wireit-app.js", "generateId", 37);
_yuitest_coverline("build/wireit-app/wireit-app.js", 38);
var id = '',
            i  = 4;

        _yuitest_coverline("build/wireit-app/wireit-app.js", 41);
while (i--) {
            _yuitest_coverline("build/wireit-app/wireit-app.js", 42);
id += (((1 + Math.random()) * 0x10000) | 0)
                    .toString(16).substring(1);
        }

        _yuitest_coverline("build/wireit-app/wireit-app.js", 46);
return id;
    }

    // Loads a model with the specified id. This method is a little tricky,
    // since it handles loading for both individual models and for an entire
    // model list.
    //
    // If an id is specified, then it loads a single model. If no id is
    // specified then it loads an array of all models. This allows the same sync
    // layer to be used for both the TodoModel and TodoList classes.
    _yuitest_coverline("build/wireit-app/wireit-app.js", 56);
function get(id) {
        _yuitest_coverfunc("build/wireit-app/wireit-app.js", "get", 56);
_yuitest_coverline("build/wireit-app/wireit-app.js", 57);
return id ? data[id] : Y.Object.values(data);
    }

    // Saves the entire `data` object to localStorage.
    _yuitest_coverline("build/wireit-app/wireit-app.js", 61);
function save() {
        _yuitest_coverfunc("build/wireit-app/wireit-app.js", "save", 61);
_yuitest_coverline("build/wireit-app/wireit-app.js", 62);
localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
    }

    // Sets the id attribute of the specified model (generating a new id if
    // necessary), then saves it to localStorage.
    _yuitest_coverline("build/wireit-app/wireit-app.js", 67);
function set(model) {
        _yuitest_coverfunc("build/wireit-app/wireit-app.js", "set", 67);
_yuitest_coverline("build/wireit-app/wireit-app.js", 68);
var hash        = model.toJSON(),
            idAttribute = model.idAttribute;

        _yuitest_coverline("build/wireit-app/wireit-app.js", 71);
if (!Y.Lang.isValue(hash[idAttribute])) {
            _yuitest_coverline("build/wireit-app/wireit-app.js", 72);
hash[idAttribute] = generateId();
        }

        _yuitest_coverline("build/wireit-app/wireit-app.js", 75);
data[hash[idAttribute]] = hash;
        _yuitest_coverline("build/wireit-app/wireit-app.js", 76);
save();

        _yuitest_coverline("build/wireit-app/wireit-app.js", 78);
return hash;
    }

    // Returns a `sync()` function that can be used with either a Model or a
    // ModelList instance.
    _yuitest_coverline("build/wireit-app/wireit-app.js", 83);
return function (action, options, callback) {
        // `this` refers to the Model or ModelList instance to which this sync
        // method is attached.
        _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 2)", 83);
_yuitest_coverline("build/wireit-app/wireit-app.js", 86);
var isModel = Y.Model && this instanceof Y.Model;

        _yuitest_coverline("build/wireit-app/wireit-app.js", 88);
switch (action) {
        case 'create': // intentional fallthru
        case 'update':
            _yuitest_coverline("build/wireit-app/wireit-app.js", 91);
callback(null, set(this));
            _yuitest_coverline("build/wireit-app/wireit-app.js", 92);
return;

        case 'read':
            _yuitest_coverline("build/wireit-app/wireit-app.js", 95);
callback(null, get(isModel && this.get('id')));
            _yuitest_coverline("build/wireit-app/wireit-app.js", 96);
return;

        case 'delete':
            _yuitest_coverline("build/wireit-app/wireit-app.js", 99);
callback(null, destroy(isModel && this.get('id')));
            _yuitest_coverline("build/wireit-app/wireit-app.js", 100);
return;
        }
    };
}


// -- WiringModel ---------------------------------------------------------------------
_yuitest_coverline("build/wireit-app/wireit-app.js", 107);
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

_yuitest_coverline("build/wireit-app/wireit-app.js", 122);
Y.WiringModelList = Y.Base.create('wiringModelList', Y.ModelList, [], {
   sync: LocalStorageSync('wireit-app'),
    model    : Y.WiringModel
});

// -- WiringList View ------------------------------------------------------------

_yuitest_coverline("build/wireit-app/wireit-app.js", 129);
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
      
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "render", 150);
_yuitest_coverline("build/wireit-app/wireit-app.js", 154);
var content = this.template({wirings: this.get('modelList').toJSON() });
      _yuitest_coverline("build/wireit-app/wireit-app.js", 155);
this.get('container').setContent(content);
      _yuitest_coverline("build/wireit-app/wireit-app.js", 156);
return this;
   }
});


// -- ContainerType ---------------------------------------------------------------------
_yuitest_coverline("build/wireit-app/wireit-app.js", 162);
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
_yuitest_coverline("build/wireit-app/wireit-app.js", 174);
Y.ContainerTypeList = Y.Base.create('containerTypeList', Y.ModelList, [], {
   model: Y.ContainerType
});

// -- Editor View ------------------------------------------------------------
_yuitest_coverline("build/wireit-app/wireit-app.js", 179);
Y.EditorView = Y.Base.create('editorView', Y.View, [], {
   
   template: Y.Handlebars.compile(Y.one('#t-editor').getContent()),
   
   events: {
      '#wiring-save-btn': {click: 'saveWiring'}
   },
   
   render: function () {
      
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "render", 187);
_yuitest_coverline("build/wireit-app/wireit-app.js", 189);
var content = this.template({
         containerTypes: this.get('containerTypes').toJSON()
      });
      _yuitest_coverline("build/wireit-app/wireit-app.js", 192);
this.get('container').setContent(content);
      
      
      // Make items draggable to the layer
      _yuitest_coverline("build/wireit-app/wireit-app.js", 196);
var that = this;
      _yuitest_coverline("build/wireit-app/wireit-app.js", 197);
this.get('container').all('.containerType-name').each(function (node) {
         
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 3)", 197);
_yuitest_coverline("build/wireit-app/wireit-app.js", 199);
var drag = new Y.DD.Drag({ 
            node: node,
            groups: ['containerType']
         }).plug(Y.Plugin.DDProxy, {
            cloneNode: true,
            moveOnEnd: false
         });
         _yuitest_coverline("build/wireit-app/wireit-app.js", 206);
drag._containerTypeName = node._node.innerHTML;
         
         // On drom, add it to the layer
         _yuitest_coverline("build/wireit-app/wireit-app.js", 209);
drag.on('drag:drophit',  function (ev) {
            _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 4)", 209);
_yuitest_coverline("build/wireit-app/wireit-app.js", 210);
that._addContainerFromName(ev.drag._containerTypeName, {
               x: ev.drag.lastXY[0],
               y: ev.drag.lastXY[1]
            });
         });
         
         
      });
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 219);
this._renderLayer();
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 221);
return this;
   },
   
   _renderLayer: function () {
      
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "_renderLayer", 224);
_yuitest_coverline("build/wireit-app/wireit-app.js", 226);
this.layer = new Y.Layer({
         //width: 900,
         height: 500
      });
      
      // Create the Drop object
      _yuitest_coverline("build/wireit-app/wireit-app.js", 232);
var drop = new Y.DD.Drop({
         node: this.layer.get('contentBox'),
         groups: ['containerType']
      });
      //drop.layer = this.layer;
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 238);
var wiring = this.get('model');
      _yuitest_coverline("build/wireit-app/wireit-app.js", 239);
if(wiring) {
         _yuitest_coverline("build/wireit-app/wireit-app.js", 240);
this.setWiring( wiring );
      }
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 243);
this.layer.render( this.get('container').one('#layer-container') );
      
   },
   
   saveWiring: function (e) {
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "saveWiring", 247);
_yuitest_coverline("build/wireit-app/wireit-app.js", 248);
var o = {
         name: Y.one('#wiring-name').get('value') || 'Unnamed'
      };
      
      // Children are containers
      _yuitest_coverline("build/wireit-app/wireit-app.js", 253);
o.containers = [];
      _yuitest_coverline("build/wireit-app/wireit-app.js", 254);
Y.Array.each(this.layer._items, function (item) {
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 5)", 254);
_yuitest_coverline("build/wireit-app/wireit-app.js", 255);
o.containers.push({
            containerType: item.containerTypeName,
            config: item.toJSON()
         });
      });
      
      // Wires:
      _yuitest_coverline("build/wireit-app/wireit-app.js", 262);
o.wires = [];
      _yuitest_coverline("build/wireit-app/wireit-app.js", 263);
var layer = this.layer;
      _yuitest_coverline("build/wireit-app/wireit-app.js", 264);
Y.Array.each(this.layer._wires, function (wire) {
         
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 6)", 264);
_yuitest_coverline("build/wireit-app/wireit-app.js", 266);
var src = wire.get('src');
         _yuitest_coverline("build/wireit-app/wireit-app.js", 267);
var tgt = wire.get('tgt');
         
         _yuitest_coverline("build/wireit-app/wireit-app.js", 269);
o.wires.push( {
            src: { container: layer._items.indexOf( src.get('parent') ), terminal: src.get('name') },
            tgt: { container: layer._items.indexOf( tgt.get('parent') ), terminal: tgt.get('name') },
            config: wire.toJSON()
         });
      });
      
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 277);
if( this.get('model') ) {
         _yuitest_coverline("build/wireit-app/wireit-app.js", 278);
this.get('model').setAttrs(o);
      }
      else {
         _yuitest_coverline("build/wireit-app/wireit-app.js", 281);
this.set('model', new Y.WiringModel(o) );
      }
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 284);
this.get('model').save();
      
      // TODO: add only one message
      _yuitest_coverline("build/wireit-app/wireit-app.js", 287);
var s = Y.Node.create('<div class="alert-message warning" style="width: 300px; z-index: 10001;"><p>Saved !</p></div>').appendTo(document.body);
      _yuitest_coverline("build/wireit-app/wireit-app.js", 288);
var anim = new Y.Anim({
          node: s,
          duration: 0.5,
          easing: Y.Easing.easeOut,
         from: { xy: [400, -50] },
         to: { xy: [400, 2] }
      });
      _yuitest_coverline("build/wireit-app/wireit-app.js", 295);
anim.on('end', function () {
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 7)", 295);
_yuitest_coverline("build/wireit-app/wireit-app.js", 296);
Y.later(1000, this, function () {
            _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 8)", 296);
_yuitest_coverline("build/wireit-app/wireit-app.js", 297);
(new Y.Anim({
                node: s,
                duration: 0.5,
                easing: Y.Easing.easeOut,
               to: { xy: [400, -50] }
            })).run();
         });
      });
      _yuitest_coverline("build/wireit-app/wireit-app.js", 305);
anim.run();
      
      
   },
   
   setWiring: function (wiring) {
      
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "setWiring", 310);
_yuitest_coverline("build/wireit-app/wireit-app.js", 312);
var that = this;
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 314);
var layer = this.layer;
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 316);
Y.Array.each( wiring.get('containers'), function (container) {
         
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 9)", 316);
_yuitest_coverline("build/wireit-app/wireit-app.js", 318);
that._addContainerFromName(container.containerType,  container.config);
         
         _yuitest_coverline("build/wireit-app/wireit-app.js", 320);
Y.on('available', function (el) {
            _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 10)", 320);
_yuitest_coverline("build/wireit-app/wireit-app.js", 321);
Y.one('#wiring-name').set('value', wiring.get('name') );
         }, '#wiring-name');
         
      });
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 326);
Y.Array.each( wiring.get('wires'), function (wire) {
         
         // prevent bad configs...
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 11)", 326);
_yuitest_coverline("build/wireit-app/wireit-app.js", 329);
if(!wire.src || !wire.tgt) {return;}
         
         _yuitest_coverline("build/wireit-app/wireit-app.js", 331);
var srcContainer = layer.item(wire.src.container);
         _yuitest_coverline("build/wireit-app/wireit-app.js", 332);
var srcTerminal = srcContainer.getTerminal(wire.src.terminal);
         
         _yuitest_coverline("build/wireit-app/wireit-app.js", 334);
var tgtContainer = layer.item(wire.tgt.container);
         _yuitest_coverline("build/wireit-app/wireit-app.js", 335);
var tgtTerminal = tgtContainer.getTerminal(wire.tgt.terminal);
         
         // TODO: wire.config;
         
         _yuitest_coverline("build/wireit-app/wireit-app.js", 339);
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
      _yuitest_coverline("build/wireit-app/wireit-app.js", 355);
Y.later(1000, this, function () {
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 12)", 355);
_yuitest_coverline("build/wireit-app/wireit-app.js", 356);
layer.redrawAllWires();
      });
      
   },
   
   _addContainerFromName: function (containerTypeName, containerConfig) {
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "_addContainerFromName", 361);
_yuitest_coverline("build/wireit-app/wireit-app.js", 362);
var containerType = this.get('containerTypes').getById(containerTypeName);
      _yuitest_coverline("build/wireit-app/wireit-app.js", 363);
var containerConf = Y.mix({}, containerType.get('config'));
      _yuitest_coverline("build/wireit-app/wireit-app.js", 364);
containerConf = Y.mix(containerConf, containerConfig);
      _yuitest_coverline("build/wireit-app/wireit-app.js", 365);
this.layer.add(containerConf);
      _yuitest_coverline("build/wireit-app/wireit-app.js", 366);
var container =  this.layer.item(this.layer.size()-1);
      _yuitest_coverline("build/wireit-app/wireit-app.js", 367);
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
_yuitest_coverline("build/wireit-app/wireit-app.js", 379);
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
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "initializer", 390);
_yuitest_coverline("build/wireit-app/wireit-app.js", 393);
this.on('navigate', this.indicateLoading);
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 395);
this.once('ready', function (e) {
         _yuitest_coverfunc("build/wireit-app/wireit-app.js", "(anonymous 13)", 395);
_yuitest_coverline("build/wireit-app/wireit-app.js", 396);
if (this.hasRoute(this.getPath())) {
            _yuitest_coverline("build/wireit-app/wireit-app.js", 397);
this.dispatch();
         } else {
            _yuitest_coverline("build/wireit-app/wireit-app.js", 399);
this.showWiringListPage();
         }
      });
   },
   
   // -- Event Handlers -------------------------------------------------------
   
   indicateLoading: function (e) {
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "indicateLoading", 406);
_yuitest_coverline("build/wireit-app/wireit-app.js", 407);
this.get('activeView').get('container').addClass('loading');
   },
   
   // -- Route Handlers -------------------------------------------------------
   
   handleWiring: function (req, res, next) {
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "handleWiring", 412);
_yuitest_coverline("build/wireit-app/wireit-app.js", 413);
var wiringId = req.params.wiring,
         wirings = this.get('modelList'),
         wiring = wirings.getById(wiringId);
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 417);
this.set('wiring', wiring);
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 419);
next();
   },

   showEditorPage: function () {
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "showEditorPage", 422);
_yuitest_coverline("build/wireit-app/wireit-app.js", 423);
this.showView('editorPage', {
         containerTypes: this.get('containerTypes'),
         wirings: this.get('modelList'),
         model: this.get('wiring')
      });
   },
   
   blankEditorPage: function () {
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "blankEditorPage", 430);
_yuitest_coverline("build/wireit-app/wireit-app.js", 431);
this.showView('editorPage', {
         containerTypes: this.get('containerTypes'),
         wirings: this.get('modelList'),
         model: null
      });
   },
   
   showWiringListPage: function () {
      
      //this.get('modelList').load();
      
      _yuitest_coverfunc("build/wireit-app/wireit-app.js", "showWiringListPage", 438);
_yuitest_coverline("build/wireit-app/wireit-app.js", 442);
var wirings = new Y.WiringModelList();
      _yuitest_coverline("build/wireit-app/wireit-app.js", 443);
wirings.load();
      _yuitest_coverline("build/wireit-app/wireit-app.js", 444);
this.set('modelList', wirings);
      
      _yuitest_coverline("build/wireit-app/wireit-app.js", 446);
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



}, '@VERSION@', {"requires": ["app", "handlebars", "model", "model-list", "json", "view", "layer", "bezier-wire", "anim"]});
