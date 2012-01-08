YUI.add('layer', function(Y) {

/**
 * Layer :  WidgetParent and WiresDelegate
 * Children: Container _wires
 * DataSchema: Editor: DataSource
 * @class Layer
 * @extends Widget
 */
var Layer = Y.Base.create("layer", Y.Widget, [Y.WidgetParent, Y.WiresDelegate], {
	
	clear: function() {
		// TODO !
	},
	
	fromJSON: function(config) {
		
		this.clear();
		
		var self = this;
		Y.Array.each(config.containers, function(c) {
			self.add(c);
		});
		
		// TODO: Wires
		
	},
	
	// TODO: 
	toJSON: function() {
		
		var o = {};
		
		// Children are containers
		o.children = [];
		Y.Array.each(this._items, function(item) {
			//console.log(item);
			o.children.push(item.toJSON());
		});
		
		// Wires:
		o.wires = [];
		Y.Array.each(this._wires, function(wire) {
			o.wires.push( wire.toJSON() );
		});
		
		return o;
	}
	
}, {
	
	ATTRS: {
		
		defaultChildType: {
			value: 'Container'
		}
		
	}
	
});

Y.Layer = Layer;

}, '3.5.0pr1a', {requires: ['widget-parent','container','wires-delegate']});
