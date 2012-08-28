/**
 * @module container-base
 */

/**
 * ContainerBase is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class ContainerBase
 * @extends Overlay
 * @uses WidgetParent
 * @uses WidgetChild
 * @uses WiresDelegate
 * @constructor
 */
var ContainerBase = Y.Base.create('container-base', Y.Overlay, [Y.WidgetParent, Y.WidgetChild, Y.WiresDelegate], {
   
   /**
    * @method renderUI
    */
   renderUI: function () {
      
      // make the overlay draggable
      this.drag = new Y.DD.Drag({
         node: this.get('boundingBox'), 
         handles : [ this._findStdModSection(Y.WidgetStdMod.HEADER) ]
      });
      
      this.drag.on('drag:drag', function () {
         this.redrawAllWires();
      }, this);
      
      // Make the overlay resizable
      if(this.get('resizable')) {
         var contentBox = this.get('contentBox');
         var resize = new Y.Resize({ 
            node: contentBox,
            handles: 'br'
         });
         /*resize.plug(Y.Plugin.ResizeConstrained, {
            minWidth: 50,
            minHeight: 50,
            maxWidth: 300,
            maxHeight: 300
            //preserveRatio: true
          });*/
         // On resize, fillHeight, & align terminals & wires
         resize.on('resize:resize', function () {
            // TODO: fillHeight
            this._fillHeight();
            this.alignTerminals();
            this.redrawAllWires();
         }, this);
         
         this.resize = resize;
      }
      
      // TODO: this is awful ! But we need to wait for everything to render & position
      Y.later(200, this, function () {
         this.alignTerminals();
      });
      
   },
   
   /**
    * @method alignTerminals
    */
   alignTerminals: function () {
      var contentBox = this.get('contentBox');
      this.each(function (term) {
         if(term.get('align')) {
            term.align( term.get('alignNode') || contentBox, ['tl',term.get('align').points[1]]);
         }
      }, this);
   },
   
   /**
    * @method syncUI
    */
   syncUI: function () {
      
      // Align terminals
      var c = this;
      this.each(function (term) {
         if(term.get('align')) {   
            term.align( c.get('contentBox') , ['tl',term.get('align').points[1]]);
         }
      });
      
   },
   
   SERIALIZABLE_ATTRS: ['x','y'],
   
   toJSON: function () {
      var o = {}, a = this;
      Y.Array.each(this.SERIALIZABLE_ATTRS, function (attr) {
         o[attr] = a.get(attr);
      });
      
      return o;
   },
   
   /**
    * Get a terminal by name
    * @method getTerminal
    */
   getTerminal: function (name) {
      return Y.Array.find(this._items, function (item) {
         if(item.get('name') == name) {
            return true;
         }
      });
   },
   
   destructor: function () {

      this.drag.destroy();
      
      if(this.resize) {
         this.resize.destroy();
      }
   }

}, {

   ATTRS: {
      
      /**
       * @attribute defaultChildType
       */
      defaultChildType: {
         value: 'Terminal'
      },
      
      /**
       * @attribute zIndex
       */
      zIndex: {
         value: 5
      },
      
      /**
       * @attribute resizable
       */
      resizable: {
         value: true
      },
      
      /**
       * @attribute fillHeight
       */
      fillHeight: {
         value: true
      },
      
      x: {
         getter: function () {
            var left = this.get('boundingBox').getStyle('left');
            return parseInt(left.substr(0,left.length-2),10);
         }
      },
      
      y: {
         getter: function () {
            var top = this.get('boundingBox').getStyle('top');
            return parseInt(top.substr(0,top.length-2),10);
         }
      },
      
      preventSelfWiring: {
         value: true
      }
      
   },
   
   EIGHT_POINTS: [
      { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },
      { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },
      { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },
      { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },
      { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },
      { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },
      { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' },
      { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }
   ],

   FOUR_CORNERS: [
      { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },
      { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },
      { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },
      { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }
   ],

   FOUR_EDGES: [
      { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },
      { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },
      { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },
      { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' }
   ]
   
});

Y.ContainerBase = ContainerBase;

