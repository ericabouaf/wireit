YUI.add('terminal-ddgroups', function (Y, NAME) {

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
};

Y.TerminalDDGroups.ATTRS = {
   
   /**
    * drag/drop groups : list of supported terminal types
    * only used if editable is set to true
    * @attribute groups
    */
   groups: {
      value: ['terminal']
   },
   
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
    * create a persisting tooltip with the scissors class
    * listen for click events on the tooltip and call destroyWires
    * @method _renderTooltip
    */
   _renderTooltip: function () {
      
      if(this.get('showGroups')) {
         
         var ddGroupsOverlay = new Y.Overlay({
            render: this.get('boundingBox'),
            bodyContent: this.get('groups').join(',')
         });
         ddGroupsOverlay.set("align", {node: this.get('contentBox'), 
                               points:[Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.BC]});

         ddGroupsOverlay.get('contentBox').addClass( this.getClassName("dd-groups") );
      }
      
   }
   
};



}, '@VERSION@', {"requires": ["terminal-dragedit"]});
