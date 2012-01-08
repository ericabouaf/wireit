YUI.add('terminal-base', function(Y) {

/**
 * Terminal is responsible for wire edition
 * @class Terminal
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 * @uses WidgetPosition
 * @uses WidgetPositionAlign
 * @uses WiresDelegate
 * @param {Object} oConfigs The user configuration for the instance.
 */
Y.TerminalBase = Y.Base.create("terminal-base", Y.Widget, [Y.WidgetChild, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WiresDelegate], {
	
	renderUI: function() {
		
		// For Overlay extensions such as Scissors or Groups
		var show = Y.bind(function() {
			this.get('boundingBox').addClass( this.getClassName("show-overlay") );
		}, this);
		var hide = Y.bind(function() {
			this.get('boundingBox').removeClass( this.getClassName("show-overlay") );
		}, this);
		this.get('boundingBox').on('mouseover', function() { Y.later(300, this, show); });
		this.get('boundingBox').on('mouseout', function() { Y.later(300, this, hide); });
		
	},
	
	// override the WiresDelegate behavior which re-fires the event
	// add the connected class
	_onAddWire: function(e) {
		this.get('boundingBox').addClass(  this.getClassName("connected") );
	},
	
	// override the WiresDelegate behavior which re-fires the event
	// Remove the connected class if it has no more wires:
	_onRemoveWire: function(e) {
		if(this._wires.length === 0) {
			this.get('boundingBox').removeClass(  this.getClassName("connected") );
		}
	},
	
	/**
	 * This function is a temporary test. I added the border width while traversing the DOM and
	 * I calculated the offset to center the wire in the terminal just after its creation
	 */
	getXY: function() {
		return this.get('contentBox').getXY();
	},
	
	toJSON: function() {
		return {}; // TODO
	}
	
}, {
	
	ATTRS: {
		
		/**
		 * Vector direction at the terminal
		 * (used by BezierWire ou Scissors)
		 */
		dir: {
			value: [0,1]
		}
	}
	
});

}, '3.5.0pr1a', {requires: ['widget','widget-child','widget-position','widget-position-align','wire-base', 'wires-delegate']});

