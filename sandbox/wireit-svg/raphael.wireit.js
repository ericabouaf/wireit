
if(!Array.prototype.compact) {
	Array.prototype.compact = function() {
      var a = [], n = this.length, i;
      for(i = 0 ; i < n ; i++) {
         if(this[i]) {
            a.push(this[i]);
         }
      }
      return a;
   };
}

Raphael.fn.wireit = {
	
	 /**
	  * r.wireit.wire(src,tgt) where src and tgt must be terminals objects
	  */
    wire: function (options) {
	
		var src = options.src, tgt = options.tgt;
		
		src = this.containers[src.container][src.terminal];
		tgt = this.containers[tgt.container][tgt.terminal];
	
		if(!this.wires) { this.wires = []; }
		
		var getPath = function() {
			
			var x = src.attr("cx"), y = src.attr("cy"), zx = tgt.attr("cx"), zy = tgt.attr("cy");
			
			var c1 = src.getPos(x,y,zx,zy),
				 c2 = tgt.getPos(zx,zy,x,y);
			
			return [["M", c1[0], c1[1] ], ["C", c1[2], c1[3], c2[2], c2[3], c2[0], c2[1] ]];
			//return [["M", c1[0], c1[1] ], ["L", c1[2], c1[3], "L", c2[2], c2[3], "L", c2[0], c2[1] ]];
		};
			
		var wire = this.path( getPath() );
		wire.src = src;
		wire.tgt = tgt;
		wire.type = "wire";
		
		if(options.style) { wire.attr(options.style); }
		
		this.wires.push(wire);
		
		// addWire
		src.addWire(wire);
		tgt.addWire(wire);

		// call to reset the wire to the current src/target positions
		wire.update = function() {
			this.attr({path: getPath()});
		};
		
		// removeWire
		wire._remove = wire.remove;
		wire.remove = function() {
			src.removeWire(this);
			tgt.removeWire(this);
			this._remove();
		};
		
		return wire;
	 },
	
	brokenwire: function (options) {

		var src = options.src, tgt = options.tgt;

		src = this.containers[src.container][src.terminal];
		tgt = this.containers[tgt.container][tgt.terminal];

		if(!this.wires) { this.wires = []; }

		var getPath = function() {

			var x = src.attr("cx"), y = src.attr("cy"), zx = tgt.attr("cx"), zy = tgt.attr("cy");

			var c1 = src.getPos(x,y,zx,zy),
				 c2 = tgt.getPos(zx,zy,x,y);

			//return [["M", c1[0], c1[1] ], ["C", c1[2], c1[3], c2[2], c2[3], c2[0], c2[1] ]];
			return [["M", c1[0], c1[1] ], ["L", c1[2], c1[3], "L", c2[2], c2[3], "L", c2[0], c2[1] ]];
		};

		var wire = this.path( getPath() );
		wire.type = "brokenwire";

		if(options.style) { wire.attr(options.style); }

		this.wires.push(wire);

		// addWire
		src.addWire(wire);
		tgt.addWire(wire);

		// call to reset the wire to the current src/target positions
		wire.update = function() {
			this.attr({path: getPath()});
		};

		// removeWire
		wire._remove = wire.remove;
		wire.remove = function() {
			src.removeWire(this);
			tgt.removeWire(this);
			this._remove();
		};

		return wire;
	 },
	
	
	 /**
	  * r.wireit.terminal(x, y)
	  */
    terminal: function (options) {
	
		var x = options.x, y = options.y;
	
		var discattr = {fill: "#fff", stroke: "none"};
	
		var terminal = this.circle(x,y,8).attr(discattr);
	
		terminal.wires = [];
		terminal.proxy = null;
		terminal.editingWire = null;
		
		terminal.attr("title", "hello");
		
		terminal.getPos = function(x,y,zx,zy) {
			return [x,y,x+options.ax,y+options.ay];
		};
		
		var r = this;
		var startDrag = function () {
			var x = this.attr("cx"), 
				 y = this.attr("cy");

			this.proxy = r.wireit.terminal(x,y);
			this.editingWire = r.wireit.wire(this, this.proxy);

		    // storing original coordinates
		    this.ox = this.attr("cx");
		    this.oy = this.attr("cy");
		    this.attr({opacity: 1});
		},
		onDrag = function (dx, dy) {
			 // move will be called with dx and dy
		    this.attr({cx: this.ox + dx, cy: this.oy + dy});
			this.updateAllWires();
				
		},
		endDrag = function () {

			 this.editingWire.remove();
			 this.proxy.remove();

		    // restoring state
		    this.attr({opacity: .5});
		};
		
		terminal.drag(onDrag, startDrag, endDrag);

		terminal.mouseover(function (event) {
		    this.attr({fill: "red"});
		});
		
		terminal.mouseout(function (event) {
			this.attr({fill: "white"});
		});
		
		
		terminal.addWire = function(w) {
			if(!this.wires) { this.wires = []; }
			this.wires.push(w);
		};

		terminal.removeWire = function(w) {
			this.wires[ this.wires.indexOf(w) ] = null;
			this.wires = this.wires.compact();
		};

		terminal.updateAllWires = function() {
			var ws = this.wires;
			for(var i = 0, n = ws.length ; i < n ; i++) {
				ws[i].update();
			}
		};
		
		terminal.update = function(x, y) {
			var X = this.attr("cx") + x,
             Y = this.attr("cy") + y;
			this.attr({cx: X, cy: Y});
		};
	
		return terminal;
	
	 },
	
	
	/**
	 * r.wireit.container(x, y)
	 */
	container: function(options) {
		
		var x = options.style.x, y = options.style.y;
		
		if(!this.containers) { this.containers = []; }
		
		var a = [
				this.rect(x, y, 120, 50, 10),
    			this.text(x+130, y+55, options.label).attr({fill: "#fff", "font-size": 16})
		];
		
		var terminals = [], i, n = options.terminals.length;
		for(i = 0 ; i < n ; i++) {
			var t = options.terminals[i];
			var term = this.wireit[t.type]({x: x+t.x, y: y+t.y, ax: t.ax, ay: t.ay});
			terminals.push(term);
			a.push( term );
		}
		
		var controls = this.set.apply(this, a);
		controls.terminals = terminals;
		
		controls.getOptions = function() {
			return {
				label: options.label,
				terminals: options.terminals
			};
		};
		
		this.containers.push(controls);
				
		var color = Raphael.getColor();
      
		controls.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
		controls.attr(options.style);

		// rect
		controls[0].update = function(x, y) {
			var X = this.attr("cx") + x,
             Y = this.attr("cy") + y;
         this.attr({cx: X, cy: Y});
			controls[1].update(x,y);
			for(var i = 0 ; i < n ; i++) {
				controls[i+2].update(x,y);
			}
		};

		// text
		controls[1].update = function(x, y) {
			var X = this.attr("x") + x,
             Y = this.attr("y") + y;
			this.attr({x: X, y: Y});
		};
		
		// terminal
		/*for(var i = 0 ; i < n ;i++) {
			controls[i+2].update = function(x, y) {
				var X = this.attr("cx") + x,
	             Y = this.attr("cy") + y;
				this.attr({cx: X, cy: Y});
			};
		}*/
      
		 var dragger = function () {
	        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
	        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
	        this.animate({"fill-opacity": .2}, 500);
	    },
	    move = function (dx, dy) {
	        var att = {x: this.ox + dx, y: this.oy + dy};
	        this.attr(att);
	
		    this.update(dx - (this.dx || 0), dy - (this.dy || 0));
          this.dx = dx;
          this.dy = dy;
			
			  controls.updateAllWires();
		
	        r.safari();
	    },
	    up = function () {
          this.dx = this.dy = 0;
	       this.animate({"fill-opacity": 0}, 500);
	    };
		
		controls.updateAllWires = function() {
			controls[2].updateAllWires();
			controls[3].updateAllWires();
		};

		controls[0].drag(move, dragger, up);
		
		controls.type = "container";
		
		return controls;
	},
	
	
	getWiring: function() {
		
		var containers = [];
		for(var i = 0 ; i < this.containers.length ; i++) {
			var container = this.containers[i][0];
			var c = {};
			c.type = "container";//container.type;
			c.style = container.attr();
			
			var otherOptions = this.containers[i].getOptions();
			for(var k in otherOptions) {
				if(otherOptions.hasOwnProperty(k)) {
					c[k] = otherOptions[k];
				}
			}
			containers.push( c );
		}
		
		var wires = [];
		for(var i = 0 ; i < this.wires.length ; i++) {
			var wire = this.wires[i];
			var style = wire.attr();
			delete style["path"];
			var w = {
				style: style
			};
			w.type = wire.type;
			console.log(this.containers[0].terminals, wire.src, wire.tgt);
			w.src = {container: 0, terminal: this.containers[0].terminals.indexOf(wire.src) };
			w.tgt = {container: 1, terminal: this.containers[1].terminals.indexOf(wire.tgt)};
			wires.push( w );
		}
		
		return {
			containers: containers,
			wires: wires
		};
	},

	
	setWiring: function(w) {
		this.wireit.clear();
		
		var containers = w.containers, i, n = containers.length;
		for(i=0;i<n;i++) {
			var c = containers[i];
			this.wireit[c.type].call(this, c);
		}
		
		var wires = w.wires, n = wires.length;
		for(i=0;i<n;i++) {
			var w = wires[i];
			this.wireit[w.type].call(this, w);
		}
	},
	
	clear: function() {
		this.clear();
		this.wires = [];
		this.containers = [];
	}
	
};




window.onload = function () {

    r = Raphael("holder", 620, 420);

		
	r.wireit.setWiring({
		containers: [
			{
				type: 'container',
				style: {
					x: 290,
					y: 180
				},
				label: "yeah",
				terminals: [
					{type: 'terminal', x: 0, y: 25, ax: -150, ay: 0},
					{type: 'terminal', x: 120, y: 25, ax: 150, ay: 0}
				]
			},
			{
				type: 'container',
				style: {
					x: 390,
					y: 40
				},
				label: "yeah2",
				terminals: [
					{type: 'terminal', x: 0, y: 25, ax: -150, ay: 0},
					{type: 'terminal', x: 120, y: 25, ax: 150, ay: 0}
				]
			}
		],
		wires: [
			{
				type: 'wire',
				src: {container: 0, terminal: 2},
				tgt: {container: 1, terminal: 2},
				style: {
					stroke: Raphael.getColor(), 
					"stroke-width":  4, 
					"stroke-linecap": "round"
				}
			},
			{
				type: 'brokenwire',
				src: {container: 0, terminal: 3},
				tgt: {container: 1, terminal: 3},
				style: {
					stroke: Raphael.getColor(), 
					"stroke-width":  4, 
					"stroke-linecap": "round"
				}
			}
		]
	});

	var result = r.wireit.getWiring();
	console.log(result );
	r.wireit.setWiring(result);
	
};
