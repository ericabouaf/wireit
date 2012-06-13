/**
 * @module layer
 */
YUI.add('layer', function(Y) {

/**
 * Layer : Widget to manage collections of wires (through WiresDelegate) and containers (trough WidgetParent)
 * @class Layer
 * @extends Widget
 * @uses WidgetParent
 * @uses WiresDelegate
 */
Y.Layer = Y.Base.create("layer", Y.Widget, [Y.WidgetParent, Y.WiresDelegate], {
	
	/**
	 * Alias method for WidgetParent.removeAll
	 * @method clear
	 */
	clear: function() {
		this.removeAll();
	}
	
}, {
	
	ATTRS: {
		
		defaultChildType: {
			value: 'Container'
		}
		
	}
	
});

}, '3.5.1', {requires: ['widget-parent','container','wires-delegate']});
