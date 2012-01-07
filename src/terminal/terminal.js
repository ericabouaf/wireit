YUI.add('terminal', function(Y) {

/**
 * Terminal is responsible for wire edition
 * @class Terminal
 * @constructor
 * @extends Widget
 * @uses WidgetChild
 * @uses WidgetPosition
 * @param {Object} oConfigs The user configuration for the instance.
 */
var Terminal = Y.Base.create("terminal", Y.TerminalBase, [], {

	renderUI: function() {
		
		if( this.get('editable') ) {
			this.get('contentBox').addClass(  this.getClassName("editable") );
			this._makeTooltip();
			this._makeEditable();
		}
	},
	
	bindUI: function() {	
		
		Terminal.superclass.bindUI.call(this);
		
		this.on('removeWire', function() {
			//console.log("terminal removeWire", this._wires.length);
			// Remove the connected class if it has no more wires:
         if(this._wires.length === 0) {
            this.get('boundingBox').removeClass(  this.getClassName("connected") );
         }
		});
		
		this.on('addWire', function() {
			//console.log("terminal addWire", this._wires.length);
			// add the connected class
			this.get('boundingBox').addClass(  this.getClassName("connected") );
		});
		
	},
	
	
	/**
	 * create a persisting tooltip with the scissors class
	 * listen for click events on the tooltip and call destroyWires
	 */
	_makeTooltip: function() {
		
		var show = Y.bind(function() {
			this.get('boundingBox').addClass( this.getClassName("show-overlay") );
		}, this);
		var hide = Y.bind(function() {
			this.get('boundingBox').removeClass( this.getClassName("show-overlay") );
		}, this);
		
		this.get('boundingBox').on('mouseover', show);
		this.get('boundingBox').on('mouseout', hide);
		
		var scissorsOverlay = new Y.Overlay({
		    render: this.get('boundingBox')
		});
		var WidgetPositionAlign = Y.WidgetPositionAlign;
		/* Align top-left corner of overlay, with top-right corner of #align1 */
		scissorsOverlay.set("align", {node: this.get('contentBox'), 
		                      points:[WidgetPositionAlign.TL, WidgetPositionAlign.TR]});

		scissorsOverlay.get('boundingBox').on('click', function(ev) {
			this.destroyWires();
		}, this);
		
		scissorsOverlay.get('contentBox').addClass( this.getClassName("scissors") );

		
		if(this.get('showGroups')) {
			var ddGroupsOverlay = new Y.Overlay({
			   render: this.get('boundingBox'),
				bodyContent: this.get('groups').join(',')
			});
			ddGroupsOverlay.set("align", {node: this.get('contentBox'), 
			                      points:[WidgetPositionAlign.TC, WidgetPositionAlign.BC]});

			ddGroupsOverlay.get('contentBox').addClass( this.getClassName("dd-groups") );
		}
		
	},
	
	_makeEditable: function() {
		
		// Make the contentBox draggable with a DDProxy
		var drag = new Y.DD.Drag({ 
			node: this.get('contentBox'),
         groups: this.get('groups')
		}).plug(Y.Plugin.DDProxy, {
			cloneNode: true,
			moveOnEnd: false
		});
		
		var that = this, x, y, magnetX, magnetY;
		
		// on drag start, create the wire between 2 fake terminals
		drag.on('drag:start', function(ev) {
			// save the position
			x = ev.pageX;	y = ev.pageY;
			//console.log("drag:start");
			
			drag.wire = new Y.BezierWire({
		    	src: { getXY: function() {	return [ev.pageX,ev.pageY]; }	},
		    	tgt: { getXY: function() {	return [magnetX || x, magnetY || y]; } } ,
		
				cfg:{bezierTangentNorm:300}
		  	});
			
			// TODO: this only works for Bezier...
			drag.wire.set('srcDir', this.get('dir'));
			
			// Render the wire into the layer contentBox
			drag.wire.render( document.body ); // that.get('parent').get('parent').get('contentBox')
			
		}, this);
		
		// on drag, redraw the wire
		drag.on('drag:drag', function(ev) {
			x = ev.pageX;
			y = ev.pageY;
			drag.wire.draw();
		});
		// on drop hit, set the wire src and tgt terminals
		drag.on('drag:drophit', function(ev) {
			drag.wire.set('src', that);
			drag.wire.set('tgt', ev.drop.terminal);
		});
		// on drop miss, destroy the wire
		drag.on('drag:dropmiss', function(ev) {
			drag.wire.destroy();
			drag.wire = null;
		});
		drag.on('drag:enter', function(ev) {
			var pos = ev.drop.terminal.getXY();
			magnetX = pos[0];
			magnetY = pos[1];
			
			// TODO: this only works for Bezier...
			drag.wire.set('tgtDir', ev.drop.terminal.get('dir'));
		});
		drag.on('drag:exit', function(ev) {
			magnetX = null;
			magnetY = null;
		});
		
		this.drag = drag;
		
		
		// Create the Drop object
		var drop = new Y.DD.Drop({
			node: this.get('contentBox'),
			groups: this.get('groups')
		});
		drop.terminal = this;
		this.drop = drop;
	},
	
	
	/**
    * This function is a temporary test. I added the border width while traversing the DOM and
    * I calculated the offset to center the wire in the terminal just after its creation
    */
   getXY: function() {
   	return this.get('contentBox').getXY();
   }

}, {
	
	ATTRS: {

		/**
		 * Sets the terminal editable
		 */
		editable: {
			value: true
		},

		/**
		 * drag/drop groups : list of supported terminal types
		 * only used if editable is set to true
		 */
		groups: {
			value: ['terminal']
		},
		
		showGroups: {
			value: true
		},
		
		dir: {
			value: [-1,0]
		}

	}
	
});

Y.Terminal = Terminal;

}, '3.0.0a', {requires: ['terminal-base', 'dd-drop','wire-base','terminal-proxy','scissors','overlay']});

