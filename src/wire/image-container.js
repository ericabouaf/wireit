YUI.add('image-container', function(Y) {

/**
 * ImageContainer is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class ImageContainer
 * @extends Overlay
 * @constructor
 */
var ImageContainer = Y.Base.create("imagecontainer", Y.Overlay, [Y.WidgetParent, Y.WidgetChild, Y.WiresDelegate], {

	renderUI: function() {
		
		var image = Y.Node.create('<img src="http://www.google.fr/images/logos/ps_logo2.png" width="'+this.get('width')+'"  height="'+this.get('height')+'"/>').appendTo( this.get('contentBox') );
		this.image = image;
		
		//console.log( Y.WidgetStdMod.BODY, this._getStdModContent(Y.WidgetStdMod.BODY) );
				
	  	// make the overlay draggable
		this.drag = new Y.DD.Drag({
		  	node: this.get('boundingBox'), 
			handles : [ image ]
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
			preserveRatio: true
    	});*/
		// On resize, fillHeight, & align terminals & wires
		resize.on('resize:resize', function(e) {
			// TODO: fillHeight
			this._fillHeight();
			
			//console.log(e.details[0].info);
			var p = e.details[0].info;
			var w = p.right-p.left;
			var h = p.bottom-p.top;
			//console.log(w+"x"+h);
			
			this.image.set('width',w);
			this.image.set('height',h);
			
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
			//console.log("container:addWire",ev.details[0]);
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
			type: "ImageContainer",
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

Y.ImageContainer = ImageContainer;

}, '3.0.0a', {requires: ['overlay','widget-parent','widget-child','dd','resize','persistable','wires-delegate']});
