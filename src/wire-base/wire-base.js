/**
 * @module wire-base
 */
YUI.add('wire-base', function(Y) {

/**
 * The wire widget
 * The wire is drawn between "src" and "tgt" (so they might be directional).
 *
 * "src" and "tgt" MUST have a "getXY" function
 *
 * "src" and "tgt" MAY additionnaly have the "addWire", "removeWire" methods.
 * Those methods are designed to be used through the Y.WiringsDelegate extension,
 * which provide basic list-handling on wires.
 *
 * @class WireBase
 * @extends Widget
 * @uses WidgetPosition
 * @param {Object} oConfigs The user configuration for the instance.
 */
var WireBase = Y.Base.create("wire-base", Y.Widget, [Y.WidgetPosition], {
	
	/**
	 * Notify the WiresDeletates through addWire
	 * @method initializer
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
	 * @method bindUI
	 */
	bindUI: function() {
		
		this.on("srcChange", this._onSrcChange, this);
		this.on("tgtChange", this._onTgtChange, this);
		
		this.after("srcChange", this._afterChangeRedraw, this);
		this.after("tgtChange", this._afterChangeRedraw, this);
	},
	
	renderUI: function() {
		this.draw();
	},
	
	/**
	 * syncUI just redraws the wire
	 * @method syncUI
	 */
	syncUI: function() {
		this.draw();
	},
	
	/**
	 * call removeWire on WiringsDelegate
	 * @method destructor
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
	* @method draw
    */
   draw: function() {
		//throw new Error("Y.Wire has no draw method. Consider using a plugin such as 'bezier-wire' in your YUI.use statement");
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
			this.draw();
		}
	},
	
	getOtherTerminal: function(term) {
	   return (term == this.get('src')) ? this.get('tgt') : this.get('src');
	},
	
	
	// TODO:
	SERIALIZABLE_ATTRS: ["src","tgt"],
	toJSON: function() {
		return {};
	}
	
});

WireBase.ATTRS = {

	src: {
		value: null
	},
	
	tgt: {
		value: null
	}
	
};

Y.WireBase = WireBase;

}, '3.5.1', {requires: ['widget','widget-position']});
