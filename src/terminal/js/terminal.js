/**
 * @module terminal
 */

'use strict';

/**
 * Terminal is responsible for wire edition
 *
 * @class Terminal
 * @extends Widget
 * @uses WidgetChild
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WiresDelegate
 * @uses TerminalDragEdit
 * @uses TerminalScissors
 * @uses TerminalDDGroups
 * @constructor
 * @param {Object} oConfigs The user configuration for the instance.
 */
Y.Terminal = Y.Base.create("terminal", Y.Widget, [
   Y.WidgetChild,
   Y.WidgetPosition,
   Y.WidgetPositionAlign,
   Y.WiresDelegate,
   Y.TerminalDragEdit,
   Y.TerminalScissors,
   Y.TerminalDDGroups
], {


   syncUI: function () {
      this._syncOffset();
   },

   _syncOffset: function() {
      var offset = this.get('offset');
      if(offset) {
         this._posNode.setStyle('left', offset[0]);
         this._posNode.setStyle('top',  offset[1]);
         this.syncXY();
      }
   },

   bindUI: function() {
      var bb = this.get('boundingBox');
      bb.on('mouseover', this._onMouseOver, this);
      bb.on('mouseout', this._onMouseOut, this);
   },

   _onMouseOver: function() {
      Y.later(300, this, this._showOverlay);
   },

   _showOverlay: function() {
      this.get('boundingBox').addClass( this.getClassName("show-overlay") );
   },

   _onMouseOut: function() {
      Y.later(300, this, this._hideOverlay);
   },

   _hideOverlay: function() {
      var bb = this.get('boundingBox');
      // because of the timer, the widget may have been destroyed
      if(bb) {
         bb.removeClass( this.getClassName("show-overlay") );
      }
   },
   
   // override the WiresDelegate behavior which re-fires the event
   // add the connected class
   _onAddWire: function (e) {
      this.get('boundingBox').addClass(  this.getClassName("connected") );
   },
   
   // override the WiresDelegate behavior which re-fires the event
   // Remove the connected class if it has no more wires:
   _onRemoveWire: function (e) {
      if(this._wires.length === 0) {
         this.get('boundingBox').removeClass(  this.getClassName("connected") );
      }
   },
   
   /**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
    * @method getXY
    */
   getXY: function () {
      var container = this.get('parent'),
          layer = container.get('parent'),
          layerXY = layer.get('boundingBox').getXY(),
          absXY = this.get('contentBox').getXY();

      return [absXY[0]-layerXY[0] + 15/2 , absXY[1]-layerXY[1] + 15/2];
   }

}, {
   
   ATTRS: {
      
      /**
       * @attribute name
       */
      name: {
         value: null
      },
      
      /**
       * Vector direction at the terminal
       * (used by BezierWire ou Scissors)
       * @attribute dir
       */
      dir: {
         value: [0,1]
      },
      
      alignNode: {
         value: null
      },

      /**
       * @attribute offset
       */
      offset: {
         value: null,
         validator: function(val) {
            return this._validateXY(val);
         }
      }
      
   }
   
});
