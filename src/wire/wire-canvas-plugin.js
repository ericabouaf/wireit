YUI.add('wire-canvas-plugin', function(Y) {

/**
 * WireIt - Wiring javascript library
 * @module wireit
 */
/**
 * Plugin for Wire to use a canvas element
 * @class WireCanvasPlugin
 * @extends Plugin.Base
 * @constructor
 * @param {Object} config the configuration for the WireCanvasPlugin attributes
 */
function WireCanvasPlugin(config) {
	WireCanvasPlugin.superclass.constructor.apply(this, arguments);
}

WireCanvasPlugin.NAME = 'WireCanvasPlugin';
WireCanvasPlugin.NS = 'canvas';

WireCanvasPlugin.ATTRS = {
	
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
		validator: Y.Lang.isNumber,
		value: 3
	},
	
	/**
	 * @attribute borderwidth
	 */
	borderwidth: {
		validator: Y.Lang.isNumber,
		value: 1
	}

};

Y.extend(WireCanvasPlugin, Y.PersistablePlugin, {
	
   /**
	 * Hook events to render the canvas
  	 * Automatically called by Base, during construction
    */
   initializer: function(config) { 
	
		//console.log("wire canvas initializer");
	
      // "render" is a widget event 
      this.beforeHostMethod('renderUI', this._renderCanvas);
		
		this.afterHostMethod("renderUI", this._afterRenderUI);
   },

	/**
	 * Listen for attributes changes to redraw the wire
	 */
	_afterRenderUI: function() {
		var host = this.get("host");
		this.after("capChange", host._afterChangeRedraw, host);
		this.after("colorChange", host._afterChangeRedraw, host);
		this.after("bordercolorChange", host._afterChangeRedraw, host);
		this.after("linewidthChange", host._afterChangeRedraw, host);
		this.after("borderwidthChange", host._afterChangeRedraw, host);
	},

	/**
	 * Create the canvas Node using the CanvasNode class
	 */
   _renderCanvas: function() {
		var widget = this.get("host"),
      	 contentBox = widget.get("contentBox");
		//console.log("render canvas");
		
		/**
		 * The canvas element
		 * @property _canvas
		 * @type CanvasNode
		 */
		this._canvas = new Y.CanvasNode();
		contentBox.appendChild( this._canvas );
   },

	/**
	 * remove the canvas element
	 */
	destructor: function() {
		this._canvas.remove();
	}
	
});

Y.WireCanvasPlugin = WireCanvasPlugin;

}, '3.0.0a', {requires: ['wire','persistable-plugin','canvas-node']});
