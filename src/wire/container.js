YUI.add('container', function(Y) {

/**
 * WireIt - Wiring javascript library
 * @module wireit
 */
/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @extends Overlay
 * @constructor
 */
var Container = Y.Base.create("container", Y.Overlay, [Y.WidgetParent, Y.WidgetChild, Y.WiresDelegate], {

	renderUI: function() {
				
	  	// make the overlay draggable
		this.drag = new Y.DD.Drag({
		  	node: this.get('boundingBox'), 
			handles : [ this._findStdModSection(Y.WidgetStdMod.HEADER) ]
	  	});
	
		this.drag.on('drag:drag', function() {
			this.redrawAllWires();
		}, this);
	
	
		// Make the overlay resizable
		var contentBox = this.get('contentBox');
		var resize = new Y.Resize({ 
			node: contentBox,
			handles: 'br'
		});
		/*resize.plug(Y.Plugin.ResizeConstrained, {
			minWidth: 50,
			minHeight: 50,
			maxWidth: 300,
			maxHeight: 300
			//preserveRatio: true
    	});*/
		// On resize, fillHeight, & align terminals & wires
		resize.on('resize:resize', function() {
			// TODO: fillHeight
			this._fillHeight();
			
			this.each(function(term) {
				if(term.get('align')) {	
					term.align( contentBox, ["tl",term.get('align').points[1]]);
				}
			}, this);
			
			this.redrawAllWires();
		}, this);
		
	},
	
	bindUI: function() {
		
		var that =this;
		// Event which bubbles from terminals
		this.on('terminal:addWire', function(ev,w) {
			//console.log("container:addWire", ev.details[0]);
			that.addWire(ev.details[0]);
		}, this);
		
		this.on('terminal:removeWire', function(ev,w) {
			that.removeWire(ev.details[0]);
		}, this);
		
	},
	
	syncUI: function() {
		
		// Align terminals
		var c = this;
		this.each(function(term) {
			if(term.get('align')) {	
				term.align( c.get('contentBox') , ["tl",term.get('align').points[1]]);
			}
		});
		
	},
	
	// TODO: Y.PersistableWidgetParent
	getPersistentAttrs: function() {
		var o = {
			width: this.get('width'),
   		height: this.get('height'),
   		xy: this.get('xy'),
			type: "Container",
			children: []
		};
		Y.Array.each(this._items, function(item) {
			o.children.push(item.getPersistentAttrs());
		});
		return o;
	}

}, {

	ATTRS: {
		defaultChildType: {
			value: 'Terminal'
		},
		
		zIndex: {
			value: 5
		}
	}
	
});

Y.Container = Container;

}, '3.0.0a', {requires: ['overlay','widget-parent','widget-child','dd','resize','persistable','better-plugins-extension','wires-delegate','terminal']});
