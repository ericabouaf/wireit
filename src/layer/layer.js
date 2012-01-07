YUI.add('layer', function(Y) {

/**
 * Layer :  WidgetParent:  default type "Container", but also "Terminal"
 * Children: Container _wires
 * DataSchema: Editor: DataSource
 * @class Layer
 * @extends Widget
 */
var Layer = Y.Base.create("layer", Y.Widget, [Y.WidgetParent, Y.WiresDelegate], {
	
	renderUI: function() {
	},
	
	bindUI: function() {
		
		this.on('terminal:addWire', function(e) {
			var wire = e.details[0].details[0].details[0];
			//console.log("layer <-", wire, e, e._event._yuid);
			this.addWire(wire);
		}, this);
		
		this.on('terminal:removeWire', function(v) {
			var wire = e.details[0].details[0].details[0];
			this.removeWire(wire);
		}, this);
		
		
	},
	
	syncUI: function() {
		//this.draw();
	},
	
	
	// TODO: 
	toJSON: function() {
		
		var o = {};
		
		// Children are containers
		o.children = [];
		Y.Array.each(this._items, function(item) {
			console.log(item);
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

}, '3.0.0a', {requires: ['widget-parent','container','wires-delegate']});
