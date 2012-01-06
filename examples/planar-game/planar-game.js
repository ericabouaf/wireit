YUI_config.groups.wireit.base = '../../src/';

YUI({combine: false,filter: 'raw'}).use("array-extras", "dd", "wire",'wire-straight-plugin', "terminal", function(Y) {
	
	window.Y = Y;
	
	// Set the WireStraightPlugin as the default plugin for wire
   Y.Wire.prototype.DEFAULT_PLUGINS = [ {ns:"WireStraightPlugin" } ];
   
   Y.WireCanvasPlugin.ATTRS.color.value = 'rgb(173,0,0)';
	
	var planarGame = {
		bubbles: [],
		wires: [],

		level: 1,

		init: function() {
		   
		   // Init the check routine on button click
		   this.checkButton = Y.one('#checkButton');
		   //this.checkButton.disable();
		   this.checkButton.on('click',this.nextLevel, this);
		   
		   planarGame.loadLevel(this.level);
		},
		
		nextLevel: function() {
		   
         Y.Array.each(this.wires, function(w) { w.destroy(); });
         Y.Array.each(this.bubbles, function(b) { b.destroy(); });

         this.level++;
			this.loadLevel(this.level);
		},

		loadLevel: function(level) {

		   Y.one('#levelContainer').innerHTML = level;

		   var c = level+2;

		   var w = Y.DOM.viewportRegion().width;
		   var h = Y.DOM.viewportRegion().height;

		   var nTerminals = c*c;
			var center = [w/2,h/2];
			
			var radius = Math.min(w,h)/2-40;
			var angle = 2*3.14159/nTerminals;

         // Random hash for positionning the terminals in circle
		   var rand = [];
		   for(k=0;k < c*c ; k++) {
		      rand[k] = k;
		   }
		   for(k=0;k<c*c; k++) {
		      var pos1 = k;
		      var pos2 = Math.floor(Math.random()*(c*c-1));
		      // [a,b] =[b,a]
		      var temp = rand[pos2];
		      rand[pos2] = rand[pos1];
		      rand[pos1] = temp;
		   }

		   // LEVEL GENERATION :
		   var liaisons = [];
		   for(var i = 0 ; i < c ; i++) {
		      for(var j = 0 ; j < c ; j++) {
		         var n = i*c+j;

		         // last line
		         if(i == c-1) {
		            // if not top right
		            if( j != c-1) {
	   	            liaisons.push([n,n+1]);
		            }
		         }
		         // last column
		         else if(j == c-1) {
	      	      liaisons.push([n,n+c]);
		         }
		         else {
		            // first line or column
		            if(i==0 || j==0) {
	   	            liaisons.push([n,n+1]);
	         	      liaisons.push([n,n+c]);
		            }
		            else {
		               // randomly add liaisons
	   	            if( Math.floor(Math.random()*4) > 0 ) {
	         	         liaisons.push([n,n+c]);
	      	         }
	      	         if( Math.floor(Math.random()*4) > 0 ) {
	      	            liaisons.push([n,n+1]);
	   	            }
		            }


		         }
		
		
		         // Create an uneditable terminal
					var term = new Y.Terminal({
					   
					   // TODO: we should not even use Terminal in the first place
						editable: false,
						
   				  	// position of the terminal in a random position in a circle
						xy: [ 
						   center[0]+radius*Math.cos(angle*rand[n]+0.1),  
						   center[1]+radius*Math.sin(angle*rand[n]+0.1) 
						],
						
						render: document.body
					});
					
					// Make the terminal draggable
					var drag = new Y.DD.Drag({ node: term.get('boundingBox') });
					drag.term = term;
					// redraw all wires connected when the terminal is dragged
					drag.on('drag:drag', function(ev) {
						ev.target.term.redrawAllWires();
					});
					
					var that = this;
            	drag.on('drag:start', function() {
            	   Y.Array.each(this.getConnected(), function(b) {
            	      b.get('boundingBox').addClass('connected-to-dragged');
            	   });
               }, term, true);
               
            	drag.on('drag:end', function() {
                  Y.Array.each(this.getConnected(), function(b) {
            	      b.get('boundingBox').removeClass('connected-to-dragged');
            	   });
            	   that.check();
            	   
               }, term, true);
					
		         this.bubbles[n] = term;

		      }
		   }
		

		   // Create the Wires
		   this.wires = Y.Array.map(liaisons,function(l){
		      return new Y.Wire({
				   src: this.bubbles[l[0]],
				   tgt: this.bubbles[l[1]],
				   render: document.body
				});
		   }, this);
		   

		},


		// Check the cross of the following wires
		check: function() {

			// Set all the wires to blue
			Y.Array.each(this.wires, function(w) {
				w.Straight.set('color',"blue");
			});
			
			// check all non-ordered pairs of wires for intersection
		   var hasError = false;
			for(var i = 0 ; i < this.wires.length ; i++) {
				for( var k = i+1 ; k < this.wires.length ; k++) {
				 	if( this.checkCross(this.wires[i], this.wires[k]) ) {
				 	   hasError = true;
						this.wires[i].Straight.set('color',"red");
						this.wires[k].Straight.set('color',"red");
					}
				}
				this.wires[i].syncUI();
			}

         return !hasError;
		},

		// Return true if 2 wires cross
		checkCross: function(wire1, wire2) {
			var term11 = wire1.get('src').getXY();
			var term12 = wire1.get('tgt').getXY();
			var term21 = wire2.get('src').getXY();
			var term22 = wire2.get('tgt').getXY();
			var X1 = term11[0]; var Y1 = term11[1];
			var X2 = term12[0]; var Y2 = term12[1];
			var X3 = term21[0]; var Y3 = term21[1];
			var X4 = term22[0]; var Y4 = term22[1];
			if( ((Y1 - Y2) * (X3 - X4) - (Y3 - Y4) * (X1 - X2)) == 0 || X1 == X2) return false;
			// Calcul du point d'intersection
			var Xi = ((X3*Y4-X4*Y3)*(X1-X2)-(X1*Y2-X2*Y1)*(X3-X4))/((Y1-Y2)*(X3-X4)-(Y3-Y4)*(X1-X2));
			var Yi = Xi*((Y1-Y2)/(X1-X2))+((X1*Y2-X2*Y1)/(X1-X2));
			return ( Math.min(X1,X2) < Xi && Xi < Math.max(X1,X2) && Math.min(X3,X4) < Xi && Xi < Math.max(X3,X4) );
		}

	};
	
   planarGame.init();
});