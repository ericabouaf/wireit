/**
 * @module straight-wire
 */
YUI.add('arrow-wire', function(Y) {


Y.ArrowWire = function(cfg) {
      Y.ArrowWire.superclass.constructor.apply(this, arguments);      
};
 Y.ArrowWire.NAME = "arrowwire";
  Y.extend(Y.ArrowWire, Y.WireBase, {
  
	/**
	 * @method initializer
	 */
	initializer: function() {
		Y.ArrowWire.superclass.initializer.apply(this, arguments);
		if(this.get('src') && this.get('src').get)
			this.set('srcDir', this.get('src').get('dir') );
		if(this.get('tgt') && this.get('tgt').get)
			this.set('tgtDir', this.get('src').get('dir') );
	},
	
	/**
	 * @method bindUI
	 */
	bindUI: function() {
		Y.ArrowWire.superclass.bindUI.call(this);
		
		//this.after("bezierTangentNormChange", this._afterChangeRedraw, this);
		
		this.on('srcChange', function(e) {
			this.set('srcDir', e.newVal.get('dir') );
		}, this);
		
		this.on('tgtChange', function(e) {
			this.set('tgtDir', e.newVal.get('dir') );
		}, this);
		
	},	  
	_draw: function() {
		
		var d = 7; // arrow width/2
		var redim = d+3; //we have to make the canvas a little bigger because of arrows
		var margin=[4+redim,4+redim];
	  
		var src = this.get('src').getXY();
        var tgt = this.get('tgt').getXY();
		
		var distance=Math.sqrt(Math.pow(src[0]-tgt[0],2)+Math.pow(src[1]-tgt[1],2));
		this.moveTo((src[0]+6), (src[1]+6));
        this.lineTo((tgt[0]+6), (tgt[1]+6));
        
		console.log(this);
		  	/* start drawing arrows */

		var t1 = src;
		var t2 = tgt;

		var z = [0,0]; //point on the wire with constant distance (dlug) from terminal2
		var dlug = 20; //arrow length
		var t = (distance == 0) ? 0 : 1-(dlug/distance);
		z[0] = Math.abs( t1[0] +  t*(t2[0]-t1[0]) );
		z[1] = Math.abs( t1[1] + t*(t2[1]-t1[1]) );	

		//line which connects the terminals: y=ax+b
		var W = t1[0] - t2[0];
		var Wa = t1[1] - t2[1];
		var Wb = t1[0]*t2[1] - t1[1]*t2[0];
		if (W !== 0) {
			a = Wa/W;
			b = Wb/W;
		}
		else {
			a = 0;
		}
		//line perpendicular to the main line: y = aProst*x + b
		if (a == 0) {
			aProst = 0;
		}
		else {
			aProst = -1/a;
		}
		bProst = z[1] - aProst*z[0]; //point z lays on this line

		//we have to calculate coordinates of 2 points, which lay on perpendicular line and have the same distance (d) from point z
		var A = 1 + Math.pow(aProst,2);
		var B = 2*aProst*bProst - 2*z[0] - 2*z[1]*aProst;
		var C = -2*z[1]*bProst + Math.pow(z[0],2) + Math.pow(z[1],2) - Math.pow(d,2) + Math.pow(bProst,2);
		var delta = Math.pow(B,2) - 4*A*C;
		if (delta < 0) { return; }
		   
		var x1 = (-B + Math.sqrt(delta)) / (2*A);
		var x2 = (-B - Math.sqrt(delta)) / (2*A);	 
		var y1 = aProst*x1 + bProst;
		var y2 = aProst*x2 + bProst;
		
		if(t1[1] == t2[1]) {
			  var o = (t1[0] > t2[0]) ? 1 : -1;
			   x1 = t2[0]+o*dlug;
			   x2 = x1;
			   y1 -= d;
			   y2 += d;
		}   	

		//triangle fill
		//this.fillStyle = this.options.color;
		//this.beginPath();
		/*this.moveTo(t2[0],t2[1]);
		this.lineTo(x1,y1);
		this.lineTo(x2,y2);*/
		//this.fill();

			
		//triangle border	
		//this.strokeStyle = this.options.bordercolor;
		//this.lineWidth = this.options.borderwidth;
		//this.beginPath();
		this.moveTo(t2[0]+6,t2[1]+6);
		this.lineTo(x1+6,y1+6);
		this.moveTo(t2[0]+6,t2[1]+6);
		this.lineTo(x2+6,y2+6);
		this.end();
		//this.lineTo(t2[0]+6,t2[1]+6);
		//this.stroke();
	
	}
	
	
});

Y.ArrowWire.ATTRS = Y.merge(Y.WireBase.ATTRS, {
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