'use strict';

/**
 * @module container
 */

/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @uses WidgetParent
 * @uses WidgetChild
 * @uses WiresDelegate
 * @uses WidgetPositionRelative
 * @uses WidgetTerminals
 * @constructor
 */
Y.Container = Y.Base.create("container", Y.Overlay, [
   Y.WidgetParent,
   Y.WidgetChild,
   Y.WiresDelegate,
   Y.WidgetPositionRelative,
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

   _onResize: function() {
      // On resize, fillHeight, & align terminals & wires
      this._fillHeight();
      this.alignTerminals();
      //this.redrawAllWires();
   },


   /**
    * Click handler for the close icon
    * @method _onCloseClick
    * @private
    */
   _onCloseClick: function () {
      this.destroy();
   },
   
   
   SERIALIZABLE_ATTRS: [ 'relative_x', 'relative_y'],
   
   toJSON: function () {
      var o = {}, a = this;
      Y.Array.each(this.SERIALIZABLE_ATTRS, function (attr) {
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

