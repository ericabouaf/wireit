

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
         drag._containerTypeName = node._node.attributes["app-container-name"].value; //node._node.innerHTML;
         
         // On drom, add it to the layer
         drag.on('drag:drophit',  function (ev) {
            var p = that.layer.get('boundingBox').getXY();
            that._addContainerFromName(ev.drag._containerTypeName, {
               x: ev.drag.lastXY[0] - p[0],
               y: ev.drag.lastXY[1] - p[1]
            });
         }, this);
         
         
      });
      
      this._renderLayer();
      
      return this;
   },
   
   _renderLayer: function () {
      
      this.layer = new Y.Layer({
         height: 500
      });
      
      // Create the Drop object
      var drop = new Y.DD.Drop({
         node: this.layer.get('contentBox'),
         groups: ['containerType']
      });
      
      this.layer.render( this.get('container').one('#layer-container') );

      var wiring = this.get('model');
      if(wiring) {
         this.setWiring( wiring );
      }
      
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
      
      var that = this,
          layer = this.layer;

      Y.Array.each( wiring.get('containers'), function (container) {
         
         that._addContainerFromName(container.containerType,  container.config);
         
         Y.on('available', function (el) {
            Y.one('#wiring-name').set('value', wiring.get('name') );
         }, '#wiring-name');
         
      });


      Y.Array.each( wiring.get('wires'), function (wire) {

         // prevent bad configs...
         if(!wire.src || !wire.tgt) return;
         
         var srcContainer = layer.item(wire.src.container),
             srcTerminal = srcContainer.getTerminal(wire.src.terminal),
         
             tgtContainer = layer.item(wire.tgt.container),
             tgtTerminal = tgtContainer.getTerminal(wire.tgt.terminal);
         
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
      Y.later(200, this, function () {
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
