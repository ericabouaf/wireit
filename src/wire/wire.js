YUI.add('wire', function(Y) {

/**
 * WireIt - Wiring javascript library
 * @module wireit
 */
/**
 * The wire widget that uses a canvas to render. 
 * The wire is drawn between "src" and "tgt" (so they might be directional).
 *
 * "src" and "tgt" MUST have a "getXY" function
 *
 * "src" and "tgt" MAY additionnaly have the "addWire", "removeWire" methods.
 * Those methods are designed to be used through the WiringsDelegate extension,
 * which provide basic list-handling on wires.
 *
 * @class Wire
 * @constructor
 * @extends Widget
 * @uses WidgetPosition
 * @param {Object} oConfigs The user configuration for the instance.
 */
var Wire = Y.Base.create("wire", Y.Widget, [Y.WidgetPosition,Y.Persistable,Y.BetterPluginsExtension], {
	
	/**
	 * Notify the WiresDeletates through addWire
	 */
	initializer: function() {
		var src = this.get('src'), tgt = this.get('tgt');
		
		if(src && Y.Lang.isFunction(src.addWire) ) {
			src.addWire(this);
		}
		if(tgt && Y.Lang.isFunction(tgt.addWire) ) {
			tgt.addWire(this);
		}
	},
	
	/**
	 * Listen for src/tgt changes
	 */
	bindUI: function() {
		
		this.on("srcChange", this._onSrcChange);
		this.on("tgtChange", this._onTgtChange);
		
		this.after("srcChange", this._afterChangeRedraw);
		this.after("tgtChange", this._afterChangeRedraw);
	},
	
	renderUI: function() {
		this._drawWire();
	},
	
	/**
	 * syncUI just redraws the wire
	 */
	syncUI: function() {
		this._drawWire();
	},
	
	/**
	 * call removeWire on WiringsDelegate
	 */
	destructor: function() {
		var src = this.get('src'), tgt = this.get('tgt');
		
		if(src && Y.Lang.isFunction(src.removeWire) ) {
			src.removeWire(this);
		}
		if(tgt && Y.Lang.isFunction(tgt.removeWire) ) {
			tgt.removeWire(this);
		}
	},
	
   /**
    * Drawing method. Meant to be overriden by a plugin
    */
   _drawWire: function() {
		//throw new Error("Y.Wire has no _drawWire method. Consider using a plugin such as 'wire-bezier-plugin' in your YUI.use statement");
	},
	
		
	_onEndpointChange: function(e) {
		// remove this wire from the list of the previous src/tgt item
		if(e.prevVal && Y.Lang.isFunction(e.prevVal.removeWire) ) {
			e.prevVal.removeWire(this);
		}
		
		// add this wire to the list of the new src/tgt item
		if(e.newVal && Y.Lang.isFunction(e.newVal.addWire)) {
			e.newVal.addWire(this);
		}
	},
	
	_onSrcChange: function(e) {
		this._onEndpointChange(e);
	},
	
	_onTgtChange: function(e) {
		this._onEndpointChange(e);
	},
	
	_afterChangeRedraw: function() {
		if( this.get('rendered') ) {
			this._drawWire();
		}
	},
	
	getOtherTerminal: function(term) {
	   return (term == this.get('src')) ? this.get('tgt') : this.get('src');
	},
	
	DEFAULT_PLUGINS: [ 
		{ ns: "WireBezierPlugin", cfg:{bezierTangentNorm: 30} }
	],
	
	PERSISTENT_ATTRS: ["src"]
	
});

Wire.NAME = "wire";

Wire.ATTRS = {
	
	CSS_PREFIX: "wireit",

	src: {
		value: null
	},
	
	tgt: {
		value: null
	}
	
};

Y.Wire = Wire;

}, '3.0.0a', {requires: ['widget','widget-position','persistable','better-plugins-extension']});
