
YUI_config.groups.wireit.base = '../../src/';
YUI({filter: 'raw'}).use('wireit-wire', 'wireit-bezier-wire', 'wireit-terminal', function(Y) {
   
/**
 * @fileoverview Planar Game
 */
var Nbubbles = 0;
var Bubble = function(position, nTerminals) {
	this.id = 'bubble'+Nbubbles++;
	
	// Create the main bubble div
	this.el = Y.WireIt.cn('div', {id: this.id, className: "bubble"});
	document.body.appendChild(this.el);
	
	// Create the nTerminals terminals
	this.terminals = [];
	for(i = 0 ; i < nTerminals ; i++) {
		this.terminals[i] = new Y.WireIt.Terminal(this.el, {offsetPosition: [2,2], editable: false});
		this.terminals[i]._bubble = this;
	}						
	
	// Make Drag/drop !
	var drag = new Y.DD.Drag({ 
		node: this.el
	});
	var that = this;
	drag.on('drag:drag', function(ev) {
		Y.Array.each(that.terminals, function(t) {
		  t.redrawAllWires();
		});
	});
		
	
	// Position the bubble
	if(position) {
		Y.one(this.el).setXY(position);
	}
	
	// On mousedown:
	Y.one(this.el).on('mousedown', this.onMouseDown, this, true);
	Y.one(this.el).on('mouseup', this.onMouseUp, this, true);
};

Bubble.prototype.onMouseDown = function() {
   for(var i = 0 ; i < this.terminals.length ; i++) {
      var term = this.terminals[i];
      if(term.wires[0]) {
         var otherTerm = term.wires[0].getOtherTerminal(term);
         Y.one(otherTerm._bubble.el).addClass('redBubble');
      }
   }
};

Bubble.prototype.onMouseUp = function() {
   for(var i = 0 ; i < this.terminals.length ; i++) {
      var term = this.terminals[i];
      if(term.wires[0]) {
         var otherTerm = term.wires[0].getOtherTerminal(term);
         Y.one(otherTerm._bubble.el).removeClass('redBubble');
      }
   }
};


var planarGame = {
	bubbles: [],
	wires: [],
	
	level: 1,
	
	init: function() {
	   // Init the check routine on button click
	   Y.one('#checkButton').on('click', this.check, this, true);
	},

	loadLevel: function(level) {
	   
	   Y.one('#levelContainer').innerHTML = level;
	   
	   var c = level+1;
	   
	   var w = Y.DOM.viewportRegion().width;
	   var h = Y.DOM.viewportRegion().height;
	   
	   var nTerminals = c*c;
		var center = [h/2,w/2];
		var radius = Math.min(w,h)/2-40;
		var angle = 2*3.14159/nTerminals;
		var bubblesTerminals = [];
	   
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
	      
	         // dernière ligne
	         if(i == c-1) {
	            // Si je ne suis pas la cellule en bas à droite
	            if( j != c-1) {
	               // Ajoute que celui à j+1
   	            liaisons.push([n,n+1]);
	            }
	         }
	         // dernière colonne
	         else if(j == c-1) {
	            // Ajoute que celui du bas
      	      liaisons.push([n,n+c]);
	         }
	         else {
	            
	            if(i==0 || j==0) {
   	            liaisons.push([n,n+1]);
         	      liaisons.push([n,n+c]);
	            }
	            else {
	               // Ajoute les deux nodes à i+1 et j+1
   	            if( Math.floor(Math.random()*4) > 0 ) {
         	         liaisons.push([n,n+c]);
      	         }
      	         if( Math.floor(Math.random()*4) > 0 ) {
      	            liaisons.push([n,n+1]);
   	            }
	            }
	            
	            
	         }
	         
	         // Create random list position 
	         var position = [ center[0]+radius*Math.cos(angle*rand[n]+0.1),  center[1]+radius*Math.sin(angle*rand[n]+0.1) ];
	         
	         this.bubbles[n] = new Bubble( position, 4);
   			bubblesTerminals[n] = 0;
   			
	      }
	   }
	   
	   
	   // Crée les fils
	   var nWires = 0;
	   for(var i = 0 ; i < liaisons.length ; i++ ) {
	      
	      var src = liaisons[i][0];
	      var tgt = liaisons[i][1];
	      
	      this.wires[nWires] = new Y.WireIt.Wire( this.bubbles[src].terminals[ bubblesTerminals[src]++] ,
			 											   this.bubbles[tgt].terminals[ bubblesTerminals[tgt]++], 
														   document.body, {width: 1, bordercolor: "#b0b0b0"});
		   this.wires[nWires].redraw();
		   nWires++;
	   }
	   
	   
	},
	
	clear: function() {
		
		for(var i = 0 ; i < this.wires.length ; i++) {
		   this.wires[i].remove();
		}
		this.wires = [];
		
		for( i = 0 ; i < this.bubbles.length ; i++) {
		   document.body.removeChild(this.bubbles[i].el);
		}
		this.bubbles = [];
	},
	
	// Check the cross of the following wires
	check: function() {
	   
	   var nErrors = 0;
	   
		// Set all the wires to blue
		for(var i = 0 ; i < this.wires.length ; i++) {
			this.wires[i].color = "blue";
		}	
		for(var i = 0 ; i < this.wires.length ; i++) {
			for( var k = i+1 ; k < this.wires.length ; k++) {
			 	if( this.checkCross(this.wires[i], this.wires[k]) ) {
			 	   nErrors++;
					this.wires[i].color = "red";
					this.wires[k].color = "red";
				}
			}
			this.wires[i].redraw();
		}
		
		if(nErrors > 0) {
		   //alert("Errors !");
		}
		else {
		   this.clear();
		   this.level++;
		   this.loadLevel(this.level);
		}
		
	},
	
	// Return true if 2 wires cross
	checkCross: function(wire1, wire2) {
		var term11 = Y.one(wire1.terminal1.el).getXY();
		var term12 = Y.one(wire1.terminal2.el).getXY();
		var term21 = Y.one(wire2.terminal1.el).getXY();
		var term22 = Y.one(wire2.terminal2.el).getXY();
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
planarGame.loadLevel(2);


});