/**
 * Label support for WireIt
 * @module labels-plugin
 */

this.options.label = options.label || "Test";


/**
 * Method to draw the text
 */
drawLabel: function() {
	
	var p1 = this.terminal1.getXY();
   var p2 = this.terminal2.getXY();
   
   // Coefficient multiplicateur de direction
   // 100 par defaut, si distance(p1,p2) < 100, on passe en distance/2
   var coeffMulDirection = this.options.coeffMulDirection;


   var distance=Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
   if(distance < coeffMulDirection){
      coeffMulDirection = distance/2;
   }

   // Calcul des vecteurs directeurs d1 et d2 :
   var d1 = [this.terminal1.options.direction[0]*coeffMulDirection,
             this.terminal1.options.direction[1]*coeffMulDirection];
   var d2 = [this.terminal2.options.direction[0]*coeffMulDirection,
             this.terminal2.options.direction[1]*coeffMulDirection];

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
   // Redimensionnement du canvas
   var margin = [4,4];
   min[0] = min[0]-margin[0];
   min[1] = min[1]-margin[1];
   max[0] = max[0]+margin[0];
   max[1] = max[1]+margin[1];
   var lw = Math.abs(max[0]-min[0]);
   var lh = Math.abs(max[1]-min[1]);

   //this.SetCanvasRegion(min[0],min[1],lw,lh);

   var ctxt = this.getContext();
   for(i = 0 ; i<bezierPoints.length ; i++){
      bezierPoints[i][0] = bezierPoints[i][0]-min[0];
      bezierPoints[i][1] = bezierPoints[i][1]-min[1];
   }

   var fontSize=14;

   var center = {
		x: Math.abs( (bezierPoints[2][0] - bezierPoints[1][0]) / 2),// + (60 * this.terminal2.options.direction[0]),
		y: Math.abs( (bezierPoints[2][1] - bezierPoints[1][1]) / 2)// + (60 * this.terminal2.options.direction[1])
	};
	
    var padding = 8;
    var hp = padding/2;
    /*var tWidth = ctxt.measureText("sans", fontSize,this.options.label) + padding;
    var desc = ctxt.fontDescent("sans",fontSize) + hp;
    var asc = ctxt.fontAscent("sans",fontSize) + hp;
    var tHeight = desc+asc;

    var lastFillStyle = ctxt.fillStyle;
    var lastWidth = ctxt.lineWidth;
    var lastStrokeStyle = ctxt.strokeStyle;

    ctxt.lineWidth=1;
    ctxt.fillStyle = "rgba(255,255,255,0.85)";
    ctxt.fillRect(center.x - hp - (tWidth/2),center.y - hp - tHeight + desc, tWidth, tHeight);

    ctxt.fillStyle = this.options.color;
    ctxt.strokeRect(center.x - hp - (tWidth/2),center.y - hp - tHeight + desc, tWidth, tHeight);*/

    //ctxt.drawTextCenter("sans", fontSize, center.x-hp, center.y-hp, this.options.label);

	ctxt.font = "1em 'arial'";
	ctxt.textAlign = 'left';
	ctxt.textBaseline = 'top';
  	ctxt.fillText(this.options.label, center.x-hp, center.y-hp);


    /*ctxt.fillStyle = lastFillStyle;
    ctxt.lineWidth = lastWidth;
    ctxt.strokeStyle = lastStrokeStyle;*/
},



if(this.options.label) {
	try {
		this.drawLabel();
	}catch(ex) {
		console.log(ex);
	}
}



<script type="text/javascript" src="../../lib/canvas.text.js"></script>