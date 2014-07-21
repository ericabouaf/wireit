YUI.add('container', function (Y, NAME) {

'use strict';

/**
 * @module container
 */

/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @extends Widget
 * @uses WidgetStdMod
 * @uses WidgetStack
 * @uses WidgetParent
 * @uses WidgetChild
 * @uses WiresDelegate
 * @uses WidgetTerminals
 * @uses WidgetIcons
 * @constructor
 */
Y.Container = Y.Base.create("container", Y.Widget, [
   Y.WidgetStdMod,
   Y.WidgetStack,
   Y.WidgetParent,
   Y.WidgetChild,
   Y.WiresDelegate,
   Y.WidgetTerminals,
   Y.WidgetIcons
], {

   /**
    * @method renderUI
    */
   renderUI: function () {
      this._renderDrag();
      this._renderResize();
   },

   bindUI: function() {

      if(this.resize) {
         this.resize.on('resize:resize', this._onResize, this);
      }

      this.drag.on('drag:drag', function () {
         this.redrawAllWires();
      }, this);

   },

   syncUI: function() {
      // waiting for the next tick to align the terminals
      Y.later(0, this, function() {
         this.alignTerminals();
      });
   },

   _renderDrag: function() {
      // make the overlay draggable
      this.drag = new Y.DD.Drag({
         node: this.get('boundingBox'),
         handles : [ this._findStdModSection(Y.WidgetStdMod.HEADER) ]
      });
   },

   _renderResize: function() {

      // Make the overlay resizable
      if(!this.get('resizable')) {
         return;
      }

      this.resize = new Y.Resize({
         node: this.get('contentBox'),
         handles: 'br' // bottom-right
      });
       
   },

   _onResize: function(e) {
      // On resize, fillHeight, & align terminals & wires
      this._fillHeight();
      this.alignTerminals();

      // Set width & height
      var region = this.get('boundingBox').get('region');
      this.set('width', e.details[0].info.offsetWidth);
      this.set('height', e.details[0].info.offsetHeight);
   },


   /**
    * Click handler for the close icon
    * @method _onCloseClick
    * @private
    */
   _onCloseClick: function () {
      this.destroy();
   },
   
   
   SERIALIZABLE_ATTRS: function() {
      var attrs = ['x', 'y'];
      if(this.get('resizable')) {
         attrs.push('width');
         attrs.push('height');
      }
      return attrs;
   },
   
   toJSON: function () {
      var o = {},
          a = this;
      Y.Array.each(this.SERIALIZABLE_ATTRS(), function (attr) {
         o[attr] = a.get(attr);
      });
      return o;
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
       * Relative left position (in the layer referential)
       * @attribute x
       */
      x: {
         lazyAdd: false,
         getter: function() {
            return parseInt(this.get('boundingBox').getStyle('left'),10);
         },
         setter: function(val) {
            this.get('boundingBox').setStyle('left', val);
         },
         validator: function(val) {
            return Y.Lang.isNumber(val);
         }
      },

      /**
       * Relative top position (in the layer referential)
       * @attribute y
       */
      y: {
         lazyAdd: false,
         getter: function() {
            return parseInt(this.get('boundingBox').getStyle('top'),10);
         },
         setter: function(val) {
            this.get('boundingBox').setStyle('top', val);
         },
         validator: function(val) {
            return Y.Lang.isNumber(val);
         }
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
      
      preventSelfWiring: {
         value: true
      },

      /**
       * Override the default value of WidgetIcons to add the close button
       * @attribute icons
       */
      icons: {
         value: [
            {title: 'close', click: '_onCloseClick', className: 'ui-silk ui-silk-cancel'}
         ]
      }
   }
   
});



}, '@VERSION@', {
    "requires": [
        "widget-stdmod",
        "widget-stack",
        "widget-parent",
        "widget-child",
        "dd",
        "resize",
        "wires-delegate",
        "widget-terminals",
        "widget-icons"
    ],
    "skinnable": true
});
