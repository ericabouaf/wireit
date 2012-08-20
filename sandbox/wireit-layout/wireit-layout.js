/**
 * Layout Plugin
 * TODO: provide an AbstractLayout Class
 * @module layout-plugin
 */

YUI.add("layout", function(Y){


/**
 * Calculate the new position for the given layout and animate the layer to this position
 */
Y.Layer.prototype.layoutAnim = function( sLayout, duration) {
	
	var layout = new Y.Layout[sLayout || "Spring"](this);
	
	var newPositions = layout.run(),
	 	 n = this.containers.length;
	
	for(var i = 0 ; i < n ; i++) {
		var c = this.containers[i],
			 p = newPositions[i],
		anim = new Y.Anim({
		   node: c.el, 
		   to: {  left:  p[0] , top:  p[1] }, 
		   duration: duration || 1
		});
		   
		   
	   anim.on('tween', function() {
       Y.Array.each(c.terminals, function(t) {
      		  t.redrawAllWires();
       		});
          });
          
		anim.run();
	}	
	
	delete layout;
};

/**
 * Start a dynamic layout
 */
Y.Layer.prototype.startDynamicLayout = function( sLayout, interval) {
	
	if(this.dynamicLayout) {
		this.stopDynamicLayout();
	}
	
	this.dynamicLayout = new Y.Layout[sLayout || "Spring"](this);

	var that = this;
	this.dynamicTimer = setInterval(function() { 
		that._runDynamicLayout(); 
	}, interval || 50);
	
	this._runDynamicLayout();
};

Y.Layer.prototype._runDynamicLayout = function( ) {
	
	var newPositions = this.dynamicLayout.run(),
	    n = this.containers.length;

	for(var i = 0 ; i < n ; i++) {
		var c = this.containers[i],
			 p = newPositions[i];
			
			// TODO: this test should be: isDragging && container focused
			if(! Y.one(c.el).hasClass("WireIt-Container-focused") ) {
				c.el.style.left = p[0]+"px";
				c.el.style.top = p[1]+"px";
				c.redrawAllWires();
			}
	}

};


/**
 * Stop the dynamic layout
 */
Y.Layer.prototype.stopDynamicLayout = function() {
	clearInterval(this.dynamicTimer);
	this.dynamicTimer = null;
	this.dynamicLayout = null;
};




/**
 * @static
 */
Y.Layout = {};
	
	
/** 
 * Spring Layout (TODO: use different eges k)
 * @class Layout.Spring
 * @constructor
 */
Y.Layout.Spring = function(layer) {	
	this.layer = layer;
	this.init();
};

Y.Layout.Spring.prototype = {
		
	/**
	 * Init the default structure
	 */
	init: function() {
		
		this.nodes = [];
		this.edges = [];
		
		// Extract wires
		for(var i = 0 ; i < this.layer.wires.length ; i++) {
			var wire = this.layer.wires[i];
			this.edges.push([this.layer.containers.indexOf(wire.terminal1.container), this.layer.containers.indexOf(wire.terminal2.container) ]);
		}	
		
	},
	
	/**
	 * TODO: split iterations into "step" method
	 */
	run: function() {
		
		var i, j, l;
		
		// Extract nodes positions
		this.nodes = [];
		for( i = 0 ; i < this.layer.containers.length ; i++) {
			var pos = this.layer.containers[i].terminals[0].getXY();
			
			this.nodes.push({
				layoutPosX: (pos[0]-400)/200,
		      layoutPosY: (pos[1]-400)/200,
		      layoutForceX: 0,
		      layoutForceY: 0
			});
		}
		
		// Spring layout parameters
	   var iterations = 100,
			 maxRepulsiveForceDistance = 6,
			 k = 0.3,
			 c = 0.01;
		
		var d,dx,dy,d2,node,node1,node2;
		
		 // Iterations
	    for (l = 0; l < iterations; l++) {
	    		    
				// Forces on nodes due to node-node repulsions
			   for (i = 0; i < this.nodes.length; i++) {
			   	node1 = this.nodes[i];
			      for (j = i + 1; j < this.nodes.length; j++) {
			      	node2 = this.nodes[j];
						dx = node2.layoutPosX - node1.layoutPosX;
						dy = node2.layoutPosY - node1.layoutPosY;
						d2 = dx * dx + dy * dy;
						if(d2 < 0.01) {
							dx = 0.1 * Math.random() + 0.1;
							dy = 0.1 * Math.random() + 0.1;
							d2 = dx * dx + dy * dy;
						}
						d = Math.sqrt(d2);
						if(d < maxRepulsiveForceDistance) {
							var repulsiveForce = k * k / d;
							node2.layoutForceX += repulsiveForce * dx / d;
							node2.layoutForceY += repulsiveForce * dy / d;
							node1.layoutForceX -= repulsiveForce * dx / d;
							node1.layoutForceY -= repulsiveForce * dy / d;
						}
					}
				}
			
			
			    // Forces on this.nodes due to edge attractions
			    for (i = 0; i < this.edges.length; i++) {
			        var edge = this.edges[i];
					  node1 = this.nodes[ edge[0] ];
			        node2 = this.nodes[ edge[1] ];

			        dx = node2.layoutPosX - node1.layoutPosX;
			        dy = node2.layoutPosY - node1.layoutPosY;
			        d2 = dx * dx + dy * dy;
			        if(d2 < 0.01) {
			         	dx = 0.1 * Math.random() + 0.1;
			            dy = 0.1 * Math.random() + 0.1;
			            d2 = dx * dx + dy * dy;
			        }
			        d = Math.sqrt(d2);
			        if(d > maxRepulsiveForceDistance) {
			                d = maxRepulsiveForceDistance;
			                d2 = d * d;
			        }
			        var attractiveForce = (d2 - k * k) / k;

			        node2.layoutForceX -= attractiveForce * dx / d;
			        node2.layoutForceY -= attractiveForce * dy / d;
			        node1.layoutForceX += attractiveForce * dx / d;
			        node1.layoutForceY += attractiveForce * dy / d;
			    }

			    // Move by the given force
			    for (i = 0; i < this.nodes.length; i++) {
			    	node = this.nodes[i];
			      var xmove = c * node.layoutForceX;
			      var ymove = c * node.layoutForceY;

			      node.layoutPosX += xmove;
			      node.layoutPosY += ymove;
			      node.layoutForceX = 0;
			      node.layoutForceY = 0;
			    }
	    }
	
		 var newPositions = [];
		 for( i = 0 ; i < this.layer.containers.length ; i++) {
			node = this.nodes[i];
			newPositions.push([node.layoutPosX*200+400-40, node.layoutPosY*200+400-20]);
		 }
		 return newPositions;
		
	}
	
	
	
};

}, '0.7.0',{
  requires: ['wireit']
});
