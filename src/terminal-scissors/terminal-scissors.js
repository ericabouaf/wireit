/**
 * @module terminal-scissors
 */
YUI.add('terminal-scissors', function(Y) {

/**
 * @class TerminalScissors
 * @constructor
 * @param {Object} config configuration object
 */
Y.TerminalScissors = function(config) {
	
	Y.after(this._renderUIScissors, this, "renderUI");
	Y.after(this._bindUIScissors, this, "bindUI");
	
};

Y.TerminalScissors.ATTRS = {};

Y.TerminalScissors.prototype = {
	
	_renderUIScissors: function() {
		if( this.get('editable') ) {
			this._renderScissors();
		}
	},
	
	_bindUIScissors: function() {
		if( this.get('editable') ) {
			this._scissorsOverlay.get('boundingBox').on('click', this.destroyWires, this);
		}
	},
	
	_renderScissors: function() {
		this._scissorsOverlay = new Y.Overlay({});
		
		this._scissorsOverlay.get('contentBox').addClass( this.getClassName("scissors") );
		
		// Position the scissors using 'dir'
		var dir = this.get('dir');
		this._scissorsOverlay.set('x', dir[0]*40);
		this._scissorsOverlay.set('y', dir[1]*40);
		
		this._scissorsOverlay.render( this.get('boundingBox') );
	}
	
};

}, '3.5.1', {requires: ['overlay']});
