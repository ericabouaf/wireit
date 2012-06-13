/**
 * @module bezier-wire
 */
YUI.add('bezier-wire', function(Y) {
	
/**
 * Extend CanvasWire to draw a bezier curve using a canvas
 * @class BezierWire
 * @extends CanvasWire
 * @constructor
 * @param {Object} config the configuration for the BezierWire attributes
 */
Y.BezierWire = Y.Base.create("bezier-wire", Y.CanvasWire, [], {
	
	/**
	 * @method initializer
	 */
	initializer: function() {
		
		if(this.get('src') && this.get('src').get)
			this.set('srcDir', this.get('src').get('dir') );
		if(this.get('tgt') && this.get('tgt').get)
			this.set('tgtDir', this.get('src').get('dir') );
	},
	
	/**
	 * @method bindUI
	 */
	bindUI: function() {
		Y.BezierWire.superclass.bindUI.call(this);
		
		this.after("bezierTangentNormChange", this._afterChangeRedraw, this);
		
		this.on('srcChange', function(e) {
			this.set('srcDir', e.newVal.get('dir') );
		}, this);
		
		this.on('tgtChange', function(e) {
			this.set('tgtDir', e.newVal.get('dir') );
		}, this);
		
	},
	
	/**
	 * Draw the bezier curve.
	 * The canvas is made bigger to contain the curls
	 * @method draw
	 */
	draw: function() {
	
		if(!this.get('canvas')) {
			return;
		}
		
		var src = this.get('src'), tgt = this.get('tgt');
		if( !src || !tgt) {
			return;
		}
		
		// Get the positions of the terminals
		var p1 = src.getXY(),
			p2 = tgt.getXY();
		
		// Coefficient multiplicateur de direction
		// 100 par defaut, si distance(p1,p2) < 100, on passe en distance/2
		var coeffMulDirection = this.get('bezierTangentNorm');
		
		var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
		if(distance < coeffMulDirection){
			coeffMulDirection = distance/2;
		}
		
		// Calcul des vecteurs directeurs d1 et d2 :
		var d1 = [this.get('srcDir')[0]*coeffMulDirection,
				this.get('srcDir')[1]*coeffMulDirection];
		var d2 = [this.get('tgtDir')[0]*coeffMulDirection,
				this.get('tgtDir')[1]*coeffMulDirection];
		
		var bezierPoints=[];
		bezierPoints[0] = p1;
		bezierPoints[1] = [p1[0]+d1[0],p1[1]+d1[1]];
		bezierPoints[2] = [p2[0]+d2[0],p2[1]+d2[1]];
		bezierPoints[3] = p2;
		var min = [p1[0],p1[1]];
		var max = [p1[0],p1[1]];
		for(var i=1 ; i<bezierPoints.length ; i++){
			var p = bezierPoints[i];
			if(p[0] < min[0]){
				min[0] = p[0];
			}
			if(p[1] < min[1]){
				min[1] = p[1];
			}
			if(p[0] > max[0]){
				max[0] = p[0];
			}
			if(p[1] > max[1]){
				max[1] = p[1];
			}
		}
		
		// New canvas size
		var margin = [10,10];
		min[0] = min[0]-margin[0];
		min[1] = min[1]-margin[1];
		max[0] = max[0]+margin[0];
		max[1] = max[1]+margin[1];
		var lw = Math.abs(max[0]-min[0]);
		var lh = Math.abs(max[1]-min[1]);
		
		// Store the min, max positions to display the label later
		// w.min = min;
		// w.max = max;
		
		//w.SetCanvasRegion(min[0],min[1],lw,lh);
		
		this.get('canvas').resize(lw,lh);
		this.set('xy', [ min[0] +15 ,min[1]+15 ]);
		
		var ctxt=this.get('canvas').getContext();
		
		// TODO: extract: 
		// Server-side
		/*var Canvas = require('canvas'), canvas = new Canvas(300, 300), ctxt = canvas.getContext('2d');
		this._ccc = canvas;*/
		
		for(i = 0 ; i<bezierPoints.length ; i++){
			bezierPoints[i][0] = bezierPoints[i][0]-min[0];
			bezierPoints[i][1] = bezierPoints[i][1]-min[1];
		}
		
		// Draw the border
		ctxt.lineCap = this.get('cap');
		ctxt.strokeStyle = this.get('bordercolor');
		ctxt.lineWidth = this.get('linewidth')+this.get('borderwidth')*2;
		ctxt.beginPath();
		ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
		ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
		ctxt.stroke();
		
		// Draw the inner bezier curve
		ctxt.lineCap = this.get('cap');
		ctxt.strokeStyle = this.get('color');
		ctxt.lineWidth = this.get('linewidth');
		ctxt.beginPath();
		ctxt.moveTo(bezierPoints[0][0],bezierPoints[0][1]);
		ctxt.bezierCurveTo(bezierPoints[1][0],bezierPoints[1][1],bezierPoints[2][0],bezierPoints[2][1],bezierPoints[3][0],bezierPoints[3][1]);
		ctxt.stroke();
		
	},
	
	SERIALIZABLE_ATTRS: ["color","width","bezierTangentNorm"]
	
});

Y.BezierWire.ATTRS = {
	
	/** 
	 * Norm of the tangeant vector at the endpoints.
	 * @attribute bezierTangentNorm
	 * @default 100
	 * @type Integer
	 */
	bezierTangentNorm: {
		setter: function(val) {
			return parseInt(val, 10);
		},
		value: 200
	},
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

};

}, '3.5.1', {requires: ['canvas-wire']});
