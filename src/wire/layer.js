YUI.add('layer', function(Y) {

/**
 * WireIt - Wiring javascript library
 * @module wireit
 */
/**
 * Layer :  WidgetParent:  default type "Container", but also "Terminal"
 * Children: Container _wires
 * DataSchema: Editor: DataSource
 * @class Layer
 * @extends Widget
 */
var Layer = Y.Base.create("layer", Y.Widget, [Y.WidgetParent,Y.WiresDelegate], {
	
	renderUI: function() {
	},
	
	bindUI: function() {
		
		var that =this;
		// Event which bubbles from terminals
		this.on('container:addWire', function(e) {
			that.addWire(e.details[0]);
		}, this);
		// TODO:
		this.on('imagecontainer:addWire', function(e) {
			that.addWire(e.details[0]);
		}, this);
		
		this.on('container:removeWire', function(ev,w) {
			that.removeWire(ev.details[0]);
			//console.log("layer:removeWire");
		}, this);
		
	},
	
	syncUI: function() {
		//this._drawWire();
	},
	
	
	// TODO: Y.PersistableWidgetParent
	getPersistentAttrs: function() {
		
		var o = {};
		
		// Children are containers
		o.children = [];
		Y.Array.each(this._items, function(item) {
			o.children.push(item.getPersistentAttrs());
		});
		
		// Wires:
		o.wires = [];
		Y.Array.each(this._wires, function(wire) {
			o.wires.push( wire.target.getPersistentAttrs() );
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

}, '3.0.0a', {requires: ['widget-parent','wires-delegate','container']});
