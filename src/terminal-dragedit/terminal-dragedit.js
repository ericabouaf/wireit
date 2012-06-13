/**
 * @module terminal-dragedit
 */
YUI.add('terminal-dragedit', function(Y) {

/**
 * @class TerminalDragEdit
 * @constructor
 * @param {Object} config configuration object
 */
Y.TerminalDragEdit = function(config) {

	Y.after(this._renderUIdragedit, this, "renderUI");
	Y.after(this._bindUIdragedit, this, "bindUI");
	
};

Y.TerminalDragEdit.ATTRS = {
	
	/**
	 * Sets the terminal editable
	 * @attribute editable
	 */
	editable: {
		value: true
	},
	
	/**
	 * target node to render the wire to (generally set to the layer by the container)
	 * @attribute editwire-parent
	 */
	"editwire-parent": {
		value: document.body
	},
	
	"editwire-class": {
		value: Y.BezierWire
	}
	
};

Y.TerminalDragEdit.prototype = {
	
	_renderUIdragedit: function() {
		
		if( this.get('editable') ) {
			this.get('contentBox').addClass(  this.getClassName("editable") );
			
			// Make the contentBox draggable with a DDProxy
			var drag = new Y.DD.Drag({ 
				node: this.get('contentBox'),
	         	groups: this.get('groups')
			}).plug(Y.Plugin.DDProxy, {
				cloneNode: true,
				moveOnEnd: false
			});
			
			this.drag = drag;
			
			// Create the Drop object
			var drop = new Y.DD.Drop({
				node: this.get('contentBox'),
				groups: this.get('groups')
			});
			drop.terminal = this;
			this.drop = drop;
			
		}
		
	},
	
	_bindUIdragedit: function() {
		var drag = this.drag;
		if(drag) {
			drag.on('drag:start',    this._onDragEditStart, this);
			drag.on('drag:drag',     this._onDragEditDrag, this);
			drag.on('drag:drophit',  this._onDragEditDrophit, this);
			drag.on('drag:dropmiss', this._onDragEditDropmiss, this);
			drag.on('drag:enter',    this._onDragEditEnter, this);
			drag.on('drag:exit',     this._onDragEditExit, this);
		}
	},
	
	/**
	 * on drag start, create the wire between 2 fake terminals
	 * @method _onDragEditStart
	 */
	_onDragEditStart: function(ev) {
		
		// save the position
		this._editwireX = ev.pageX;
		this._editwireY = ev.pageY;
		
		var dir = this.get('dir');
		var that = this;
		this.drag.wire = new Y.BezierWire({
			
			src: { 
				getXY: function() { return [ev.pageX,ev.pageY]; }
			},
			tgt: { 
				getXY: function() { return [that._magnetX || that._editwireX, that._magnetY || that._editwireY]; } 
			},
			
			srcDir: dir,
			tgtDir: [-dir[0],-dir[1]],
			
			render: this.get('root').get('contentBox') /*this.get('editwire-parent')*/
		});
	},
	
	// Update the position of the fake target and redraw the wire
	_onDragEditDrag: function(ev) {
		this._editwireX = ev.pageX;
		this._editwireY = ev.pageY;
		this.drag.wire.draw();
	},
	
	// on drop hit, set the wire src and tgt terminals
	_onDragEditDrophit: function(ev) {
		this.drag.wire.set('src', this);
		this.drag.wire.set('tgt', ev.drop.terminal);
		
		// Remove the reference to this wire
		this.drag.wire = null;
		
		// Reset the magnet position
		this._magnetX = null;
		this._magnetY = null;
	},
	
	// on drop miss, destroy the wire
	
	_onDragEditDropmiss: function(ev) {
		this.drag.wire.destroy();
		this.drag.wire = null;
	},
	
	_onDragEditEnter: function(ev) {
		var pos = ev.drop.terminal.getXY();
		this._magnetX = pos[0];
		this._magnetY = pos[1];
		
		// TODO: this only works for Bezier...
		this.drag.wire.set('tgtDir', ev.drop.terminal.get('dir'));
	},
	
	_onDragEditExit: function(ev) {
		this._magnetX = null;
		this._magnetY = null;
	}
	
};

}, '3.5.1', {requires: ['dd-drop', 'dd-drag', 'dd-proxy']});
