/**
 * @module straight-wire
 */
YUI.add('straight-wire', function(Y) {

Y.StraightWire = Y.Base.create("straight-wire", Y.CanvasWire, [], {
	
	draw: function() {
		
		var w = this.get('host');
		
		//console.log("Straight draw");
		var src = w.get('src'), tgt = w.get('tgt');
		if( !src || !tgt) {
			return;
		}
		
		var margin = [4,4];
		
		// Get the positions of the terminals
		var p1 = src.getXY();
		var p2 = tgt.getXY();
		
		p1[0]+=15;p1[1]+=15;p2[0]+=15;p2[1]+=15;
		
		var min=[ Math.min(p1[0],p2[0])-margin[0], Math.min(p1[1],p2[1])-margin[1]];
		var max=[ Math.max(p1[0],p2[0])+margin[0], Math.max(p1[1],p2[1])+margin[1]];
		
		// Store the min, max positions to display the label later
		w.min = min;
		w.max = max;      
		
		// Redimensionnement du canvas
		var lw=Math.abs(max[0]-min[0]);
		var lh=Math.abs(max[1]-min[1]);
		
		// Convert points in canvas coordinates
		p1[0] = p1[0]-min[0];
		p1[1] = p1[1]-min[1];
		p2[0] = p2[0]-min[0];
		p2[1] = p2[1]-min[1];
		
		w.set('xy', [ min[0],min[1] ]);
		this.get('canvas').resize(lw,lh);
		
		var ctxt=this.get('canvas').getContext();
		
		// Draw the border
		ctxt.lineCap=this.get('cap');
		ctxt.strokeStyle=this.get('bordercolor');
		ctxt.lineWidth=this.get('linewidth')+this.get('borderwidth')*2;
		ctxt.beginPath();
		ctxt.moveTo(p1[0],p1[1]);
		ctxt.lineTo(p2[0],p2[1]);
		ctxt.stroke();
		
		// Draw the inner bezier curve
		ctxt.lineCap=this.get('cap');
		ctxt.strokeStyle=this.get('color');
		ctxt.lineWidth=this.get('linewidth');
		ctxt.beginPath();
		ctxt.moveTo(p1[0],p1[1]);
		ctxt.lineTo(p2[0],p2[1]);
		ctxt.stroke();
	}
	
});

}, '3.5.1', {requires: ['canvas-wire']});