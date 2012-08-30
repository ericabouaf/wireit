/**
 * @module terminal-dragedit
 */

/**
 * Extension which makes the wires editable
 * @class TerminalDragEdit
 * @constructor
 * @param {Object} config configuration object
 */
Y.TerminalDragEdit = function (config) {

   Y.after(this._renderUIdragedit, this, "renderUI");
   Y.after(this._bindUIdragedit, this, "bindUI");
   var attrs = {
      "color":{value:"rgb(173,216,230)"},
      "weight":{value:4},
      "opacity":{value:1},
      "dashstyle":{value:"none"},
      "fill":{value:"rgb(255,255,255)"},
      "editwire-class": {value: Y.BezierWire}
   };
   this.addAttrs(attrs, config);   
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
    * @attribute graphic
    */
   graphic: {
      value: null
   },
   
   /**
    * @attribute alwaysSrc
    */
   alwaysSrc: {
      value: false
   }
};

Y.TerminalDragEdit.prototype = {
   
   /**
    * @method _renderUIdragedit
    */
   _renderUIdragedit: function () {
      
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
   
   /**
    * @method _bindUIdragedit
    */
   _bindUIdragedit: function () {
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
   _onDragEditStart: function (ev) {
      // save the position
      this._editwireX = ev.pageX;
      this._editwireY = ev.pageY;
      
      var dir = this.get('dir');
      var that = this;
      
      if(!this.get('graphic')) {
         this.set('graphic', this.get('root').graphic);
      }
      
      this.drag.wire = this.get('graphic').addShape({
         
         type: this.get('editwire-class'),
         
         // TODO: customizable
         stroke: {
            weight: this.get('weight'),
           color: this.get('color'),
           opacity:this.get('opacity'),
           dashstyle:this.get('dashstyle'),
           fill:this.get('fill')
           },
           
           src: { 
              getXY: function () { return [ev.pageX,ev.pageY]; }
           },
           tgt: { 
              getXY: function () { return [that._magnetX || that._editwireX, that._magnetY || that._editwireY]; } 
           },

           srcDir: dir,
           tgtDir: [-dir[0],-dir[1]]

        });
      
      
   },
   
   /**
    * Update the position of the fake target and redraw the wire
    * @method _onDragEditDrag
    * @private
    */
   _onDragEditDrag: function (ev) {
      this._editwireX = ev.pageX;
      this._editwireY = ev.pageY;
      this.drag.wire._draw();
   },
   
   /**
    * on drop hit, set the wire src and tgt terminals
    * @method _onDragEditDrophit
    * @private
    */
   _onDragEditDrophit: function (ev) {
      
      if( this.isValidWireTerminal(ev.drop.terminal) ) {
         if(ev.drop.terminal.alwaysSrc){
            this.drag.wire.set('src', ev.drop.terminal);
            this.drag.wire.set('tgt', this);
         }else{
            this.drag.wire.set('src', this);
            this.drag.wire.set('tgt', ev.drop.terminal);
         }
         
         // Remove the reference to this wire
         this.drag.wire = null;
         
         // Reset the magnet position
         this._magnetX = null;
         this._magnetY = null;
      } else {
         this.drag.wire.destroy();
      }
   },
   
   /**
    * on drop miss, destroy the wire
    * @method _onDragEditDropmiss
    */
   _onDragEditDropmiss: function (ev) {
      this.drag.wire.destroy();
      this.drag.wire = null;
   },
   
   /**
    * @method _onDragEditEnter
    */
   _onDragEditEnter: function (ev) {
      
         var pos = ev.drop.terminal.getXY();
         this._magnetX = pos[0];
         this._magnetY = pos[1];
         
         // TODO: this only works for Bezier...
         this.drag.wire.set('tgtDir', ev.drop.terminal.get('dir'));
      
   },
   
   /**
    * @method _onDragEditExit
    */
   _onDragEditExit: function (ev) {
      this._magnetX = null;
      this._magnetY = null;
   },
   
   /**
    * @method isValidWireTerminal
    */
   isValidWireTerminal: function (DDterminal) {
     if(this.get('parent') !== undefined && (this.get('parent').get('preventSelfWiring'))){
        if (DDterminal._parentNode._node == this._parentNode._node) {
         return false;
        } 
     }
      return true;
   },
   
   /**
    * @method destructor
    */
   destructor: function () {
      
      if(this.drag) {
         this.drag.destroy();
      }
      if(this.drop) {
         this.drop.destroy();
      }
   }
   
};

