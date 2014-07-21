/**
 * @module terminal-ddgroups
 */

/**
 * Extension to add "groups" labels when hovering the terminal
 * @class TerminalDDGroups
 * @constructor
 * @param {Object} config configuration object
 */
Y.TerminalDDGroups = function (config) {
   Y.after(this._renderUIgroups, this, "renderUI");
   Y.after(this._showOverlayDDGroups, this, "_showOverlay");
};

Y.TerminalDDGroups.ATTRS = {
   
   showGroups: {
      value: true
   }
   
};

Y.TerminalDDGroups.prototype = {
   
   _renderUIgroups: function () {
      if( this.get('editable') ) {
         this._renderTooltip();
      }
   },
   
   /**
    * create a persisting tooltip with the dd-groups class
    * @method _renderTooltip
    */
   _renderTooltip: function () {
      
      if(this.get('showGroups')) {
         
         this._ddGroupsOverlay = new Y.Overlay({
            render: this.get('boundingBox'),
            bodyContent: this.get('ddGroupsDrag').join(',')
         });

         this._ddGroupsOverlay.get('contentBox').addClass( this.getClassName("dd-groups") );

      }
      
   },

   _showOverlayDDGroups: function() {
      this._ddGroupsOverlay.align( this.get('contentBox'), [Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC] );
   }
   
};

