YUI.add("layer-container", function(Y){

/**
 *
 * Will require a special getWiring method which handles LayerContainers
 *
 * Container that has a Layer
 * @class LayerContainer
 * @extends Container
 * @constructor
 * @param {Object} options
 * @param {Layer} layer
 */
Y.LayerContainer = function(options, layer) {
   Y.LayerContainer.superclass.constructor.call(this, options, layer);
};

Y.extend(Y.LayerContainer, Y.Container, {
	
	/** 
    * @attribute xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.LayerContainer"
    * @type String
    */
   xtype: "Y.LayerContainer",
	
	/** 
    * @attribute ddHandle
    * @description (only if draggable) boolean indicating we use a handle for drag'n drop
    * @default false
    * @type Boolean
    */
	ddHandle: true,
	
	/** 
    * @attribute className
    * @description CSS class name for the container element
    * @default ""WireIt-Container WireIt-LayerContainer"
    * @type String
    */
	className: "WireIt-Container WireIt-LayerContainer",
	
	/** 
    * @attribute width
    * @description initial width of the container
    * @default 200
    * @type Integer
    */
	width: 200,
	
	/** 
    * @attribute height
    * @description initial height of the container
    * @default 100
    * @type Integer
    */
	height: 300,

   
   /**
 	 * Render a Y.Layer inside !
    * @method render
    */
   render: function() {
      Y.LayerContainer.superclass.render.call(this);

 		this.subLayer = new Y.Layer({layerMap: false, parentEl: this.bodyEl});

		var layerContainer = this;
		this.subLayer.on('eventAddContainer', function(e,params) {
			var container = params[0];
			var terminals = container.terminals;
			
			for(var i = 0 ; i < terminals.length ; i++) {
				var term = terminals[i];
				
				term._getXY = term.getXY;
				term.getXY = function() {
					var relative_pos = this._getXY();
					var container_pos = layerContainer.getXY();
					return [relative_pos[0]+container_pos[0],relative_pos[1]+container_pos[1]];
				};
			}
		});
		
		
		this.subLayer.setWiring({
			containers: [
	
				{
					position:[20,30],
					"xtype":"Y.Container", 
					title: "input",
					width: 100,
	 				"terminals": [
	 					{"name": "in", direction: [0,-1], offsetPosition: {top: -5, left: 40} },
						{"name": "out", direction: [0,1], offsetPosition: {bottom: -15, left: 40} }
	 				]
				},
				{
					position:[40,110],
					"xtype":"Y.Container", 
					title: "input",
					width: 100,
	 				"terminals": [
	 					{"name": "in", direction: [0,-1], offsetPosition: {top: -5, left: 40} },
						{"name": "out", direction: [0,1], offsetPosition: {bottom: -15, left: 40} }
	 				]
				}
			],	
			wires: [
			{
	        "xtype": "WireIt.BezierWire",
	        "src": {
	            "moduleId": 0,
	            "terminal": "out"
	        },
	        "tgt": {
	            "moduleId": 1,
	            "terminal": "in"
	        }
	    }
			]
		});

   },

	makeDraggable: function() {
		// Use the drag'n drop utility to make the container draggable
	   this.dd = new Y.LayerContainer.DD(this.terminals,this.subLayer, this.el);
	
		// Set minimum constraint on Drag Drop to the top left corner of the layer (minimum position is 0,0)
		this.dd.setXConstraint(this.position[0]);
		this.dd.setYConstraint(this.position[1]);
	   
	   // Sets ddHandle as the drag'n drop handle
	   if(this.ddHandle) {
			this.dd.setHandleElId(this.ddHandle);
	   }
	   
	   // Mark the resize handle as an invalid drag'n drop handle and vice versa
	   if(this.resizable) {
			this.dd.addInvalidHandleId(this.ddResizeHandle);
			this.ddResize.addInvalidHandleId(this.ddHandle);
	   }
	}

});




Y.LayerContainer.DD = function( terminals, subLayer, id, sGroup, config) {
   if(!terminals) {
      throw new Error("WireIt.LayerContainer.DD needs at least terminals and id");
   }
   /**
    * List of the contained terminals
    * @attribute _WireItTerminals
    * @type {Array}
    */
   this._WireItTerminals = terminals;

	this._subLayer = subLayer;
   
   Y.LayerContainer.DD.superclass.constructor.call(this, id, sGroup, config);
};

Y.extend(Y.LayerContainer.DD, YAHOO.util.DD, {

   /**
    * Override YAHOO.util.DD.prototype.onDrag to redraw the wires
    * @method onDrag
    */
   onDrag: function(e) {
      // Make sure terminalList is an array
      var terminalList = Y.Lang.isArray(this._WireItTerminals) ? this._WireItTerminals : (this._WireItTerminals.isWireItTerminal ? [this._WireItTerminals] : []);
      // Redraw all the wires
      for(var i = 0 ; i < terminalList.length ; i++) {
			terminalList[i].redrawAllWires();
      }

		for(i = 0 ; i < this._subLayer.containers.length ; i++) {
			var c = this._subLayer.containers[i];
			for(var j = 0 ; j < c.terminals.length ; j++) {
				c.terminals[j].redrawAllWires();
	      }
		}
		
   },

   /**
    * In case you change the terminals since you created the Y.LayerContainer.DD:
    * @method setTerminals
    */
   setTerminals: function(terminals) {
      this._WireItTerminals = terminals;
   }
   
});

}, '0.7.0',{
  requires: ['container']
});
