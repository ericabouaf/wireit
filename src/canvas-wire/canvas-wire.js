/**
 * @module canvas-wire
 */
YUI.add('canvas-wire', function(Y) {

/**
 * Plugin for Wire to use a canvas element to render the wire
 * @class CanvasWire
 * @extends WireBase
 * @param {Object} config the configuration for the WireCanvasPlugin attributes
 */
var CanvasWire = Y.Base.create("canvaswire", Y.WireBase, [], {
	
	/**
	 * @method bindUI
	 */
	bindUI: function() {
		CanvasWire.superclass.bindUI.call(this);
		
		this.after("capChange", this._afterChangeRedraw, this);
		this.after("colorChange", this._afterChangeRedraw, this);
		this.after("bordercolorChange", this._afterChangeRedraw, this);
		this.after("linewidthChange", this._afterChangeRedraw, this);
		this.after("borderwidthChange", this._afterChangeRedraw, this);
	},
	
	/**
	 * @method renderUI
	 */
	renderUI: function() {
		this._renderCanvas();
		this.draw();
	},
	
	/**
	 * @method _renderCanvas
	 */
	_renderCanvas: function() {
		var canvas = new Y.CanvasNode();
		this.set('canvas', canvas);
		
		var contentBox = this.get("contentBox");
		contentBox.appendChild( canvas );
	},
	
	/**
	 * @method destructor
	 */
	destructor: function() {
		this.get('canvas').remove();
	}
	
});

CanvasWire.ATTRS = {
	
	/**
	 * Y.CanvasNode instance
	 * @attribute canvas
	 */
	canvas: {
		value: null
	},
	
	/**
	 * cap attribute of the line ("round","butt", or "square")
	 * @attribute cap
	 * @type String
	 * @default "round"
	 */
	cap: {
		validator: Y.Lang.isString,
		value: 'round'
	},
	
	/**
	 * @attribute color
	 */
	color: {
		validator: Y.Lang.isString,
		value: 'rgb(173,216,230)'
	},
	
	/**
	 * @attribute bordercolor
	 */
	bordercolor: {
		validator: Y.Lang.isString,
		value: '#0000ff'
	},
	
	/**
	 * @attribute linewidth
	 */
	linewidth: {
		setter: function(val) {
			return parseInt(val, 10);
		},
		value: 3
	},
	
	/**
	 * @attribute borderwidth
	 */
	borderwidth: {
		setter: function(val) {
			return parseInt(val, 10);
		},
		value: 1
	}

};

Y.CanvasWire = CanvasWire;

}, '3.5.1', {requires: ['wire-base','canvas-node']});
