YUI.add('terminal-groups', function(Y) {

/**
 * @class TerminalGroups
 * @constructor
 * @param {Object} config configuration object
 */
Y.TerminalGroups = function(config) {
	Y.after(this._renderUIgroups, this, "renderUI");
};

Y.TerminalGroups.ATTRS = {
	
	/**
	 * drag/drop groups : list of supported terminal types
	 * only used if editable is set to true
	 */
	groups: {
		value: ['terminal']
	},
	
	showGroups: {
		value: true
	}
	
};

Y.TerminalGroups.prototype = {
	
	_renderUIgroups: function() {
		if( this.get('editable') ) {
			this._renderTooltip();
		}
	},
	
	/**
	 * create a persisting tooltip with the scissors class
	 * listen for click events on the tooltip and call destroyWires
	 */
	_renderTooltip: function() {
		
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

}, '3.5.0pr1a', {requires: ['terminal-dragedit']});
