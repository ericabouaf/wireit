YUI.add('terminal-base', function(Y) {

/**
 * Terminal is responsible for wire edition
 * @class Terminal
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 * @uses WidgetPosition
 * @param {Object} oConfigs The user configuration for the instance.
 */
var TerminalBase = Y.Base.create("terminal-base", Y.Widget, [Y.WidgetChild, Y.WidgetPosition, Y.WidgetPositionAlign, Y.WiresDelegate], {
	
	bindUI: function() {	
		
		this.on('removeWire', function() {
			//console.log("terminal removeWire", this._wires.length);
			// Remove the connected class if it has no more wires:
         if(this._wires.length === 0) {
            this.get('boundingBox').removeClass(  this.getClassName("connected") );
         }
		});
		
		this.on('addWire', function() {
			//console.log("terminal addWire", this._wires.length);
			// add the connected class
			this.get('boundingBox').addClass(  this.getClassName("connected") );
		});
		
	},
	
	
	/**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
    */
   getXY: function() {
   	return this.get('contentBox').getXY();
   },

	toJSON: function() {
		return {};
	}
	
}, {
	
	ATTRS: {

	}
	
});

Y.TerminalBase = TerminalBase;

}, '3.0.0a', {requires: ['widget','widget-child','widget-position','widget-position-align','wires-delegate']});

