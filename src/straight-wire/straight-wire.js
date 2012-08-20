/**
 * @module straight-wire
 */
YUI.add('straight-wire', function(Y) {


//Y.StraightWire = Y.Base.create("straight-wire", Y.CanvasWire, [], {

Y.StraightWire = function(cfg) {
      Y.StraightWire.superclass.constructor.apply(this, arguments);      
};
 Y.StraightWire.NAME = "straightwire";
  Y.extend(Y.StraightWire, Y.WireBase, {
  
	/**
	 * @method initializer
	 */
	initializer: function() {
		Y.StraightWire.superclass.initializer.apply(this, arguments);
		if(this.get('src') && this.get('src').get)
			this.set('srcDir', this.get('src').get('dir') );
		if(this.get('tgt') && this.get('tgt').get)
			this.set('tgtDir', this.get('src').get('dir') );
	},
	
	/**
	 * @method bindUI
	 */
	bindUI: function() {
		Y.StraightWire.superclass.bindUI.call(this);
		
		//this.after("bezierTangentNormChange", this._afterChangeRedraw, this);
		
		this.on('srcChange', function(e) {
			this.set('srcDir', e.newVal.get('dir') );
		}, this);
		
		this.on('tgtChange', function(e) {
			this.set('tgtDir', e.newVal.get('dir') );
		}, this);
		
	},	  
	_draw: function() {
		var src = this.get('src').getXY();
        var tgt = this.get('tgt').getXY();
		
		this.moveTo((src[0]+6), (src[1]+6));
        this.lineTo((tgt[0]+6), (tgt[1]+6));
        this.end();
	}
	
});

Y.StraightWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {
	/**
	 * TODO: normalize ?
	 * @attribute srcDir
	 * @type Array
	 * @default [1,0]
	 */ 
	srcDir: {
		validator: Y.Lang.isArray,
		value: [1,0]
	},
	
	/**
	 * TODO: normalize ?
	 * @attribute tgtDir
	 * @type Array
	 * @default -srcDir
	 */
	tgtDir: {
		validator: Y.Lang.isArray,
		valueFn: function() {
			var d = this.get('srcDir');
			return [-d[0],-d[1]];
		}
	}

});

}, '3.6.0', {requires: ['wire-base']});