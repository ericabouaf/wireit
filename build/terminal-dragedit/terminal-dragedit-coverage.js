if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/terminal-dragedit/terminal-dragedit.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/terminal-dragedit/terminal-dragedit.js",
    code: []
};
_yuitest_coverage["build/terminal-dragedit/terminal-dragedit.js"].code=["YUI.add('terminal-dragedit', function (Y, NAME) {","","/**"," * @module terminal-dragedit"," */","","/**"," * Extension which makes the wires editable"," * @class TerminalDragEdit"," * @constructor"," * @param {Object} config configuration object"," */","Y.TerminalDragEdit = function (config) {","","   Y.after(this._renderUIdragedit, this, \"renderUI\");","   Y.after(this._bindUIdragedit, this, \"bindUI\");","   var attrs = {","      \"color\":{value:\"rgb(173,216,230)\"},","      \"weight\":{value:4},","      \"opacity\":{value:1},","      \"dashstyle\":{value:\"none\"},","      \"fill\":{value:\"rgb(255,255,255)\"},","      \"editwire-class\": {value: Y.BezierWire}","   };","   this.addAttrs(attrs, config);   ","};","","Y.TerminalDragEdit.ATTRS = {","   ","   /**","    * Sets the terminal editable","    * @attribute editable","    */","   editable: {","      value: true","   },","   ","   /**","    * @attribute graphic","    */","   graphic: {","      value: null","   },","   ","   /**","    * @attribute alwaysSrc","    */","   alwaysSrc: {","      value: false","   }","};","","Y.TerminalDragEdit.prototype = {","   ","   /**","    * @method _renderUIdragedit","    */","   _renderUIdragedit: function () {","      ","      if( this.get('editable') ) {","         this.get('contentBox').addClass(  this.getClassName(\"editable\") );","         ","         // Make the contentBox draggable with a DDProxy","         var drag = new Y.DD.Drag({ ","            node: this.get('contentBox'),","               groups: this.get('groups')","         }).plug(Y.Plugin.DDProxy, {","            cloneNode: true,","            moveOnEnd: false","         });","         ","         this.drag = drag;","         ","         // Create the Drop object","         var drop = new Y.DD.Drop({","            node: this.get('contentBox'),","            groups: this.get('groups')","         });","         drop.terminal = this;","         this.drop = drop;","         ","      }","      ","   },","   ","   /**","    * @method _bindUIdragedit","    */","   _bindUIdragedit: function () {","      var drag = this.drag;","      if(drag) {","         drag.on('drag:start',    this._onDragEditStart, this);","         drag.on('drag:drag',     this._onDragEditDrag, this);","         drag.on('drag:drophit',  this._onDragEditDrophit, this);","         drag.on('drag:dropmiss', this._onDragEditDropmiss, this);","         drag.on('drag:enter',    this._onDragEditEnter, this);","         drag.on('drag:exit',     this._onDragEditExit, this);","      }","   },","   ","   /**","    * on drag start, create the wire between 2 fake terminals","    * @method _onDragEditStart","    */","   _onDragEditStart: function (ev) {","      // save the position","      this._editwireX = ev.pageX;","      this._editwireY = ev.pageY;","      ","      var dir = this.get('dir');","      var that = this;","      ","      if(!this.get('graphic')) {","         this.set('graphic', this.get('root').graphic);","      }","      ","      this.drag.wire = this.get('graphic').addShape({","         ","         type: this.get('editwire-class'),","         ","         // TODO: customizable","         stroke: {","            weight: this.get('weight'),","           color: this.get('color'),","           opacity:this.get('opacity'),","           dashstyle:this.get('dashstyle'),","           fill:this.get('fill')","           },","           ","           src: { ","              getXY: function () { return [ev.pageX,ev.pageY]; }","           },","           tgt: { ","              getXY: function () { return [that._magnetX || that._editwireX, that._magnetY || that._editwireY]; } ","           },","","           srcDir: dir,","           tgtDir: [-dir[0],-dir[1]]","","        });","      ","      ","   },","   ","   /**","    * Update the position of the fake target and redraw the wire","    * @method _onDragEditDrag","    * @private","    */","   _onDragEditDrag: function (ev) {","      this._editwireX = ev.pageX;","      this._editwireY = ev.pageY;","      this.drag.wire._draw();","   },","   ","   /**","    * on drop hit, set the wire src and tgt terminals","    * @method _onDragEditDrophit","    * @private","    */","   _onDragEditDrophit: function (ev) {","      ","      if( this.isValidWireTerminal(ev.drop.terminal) ) {","         if(ev.drop.terminal.alwaysSrc){","            this.drag.wire.set('src', ev.drop.terminal);","            this.drag.wire.set('tgt', this);","         }else{","            this.drag.wire.set('src', this);","            this.drag.wire.set('tgt', ev.drop.terminal);","         }","         ","         // Remove the reference to this wire","         this.drag.wire = null;","         ","         // Reset the magnet position","         this._magnetX = null;","         this._magnetY = null;","      } else {","         this.drag.wire.destroy();","      }","   },","   ","   /**","    * on drop miss, destroy the wire","    * @method _onDragEditDropmiss","    */","   _onDragEditDropmiss: function (ev) {","      this.drag.wire.destroy();","      this.drag.wire = null;","   },","   ","   /**","    * @method _onDragEditEnter","    */","   _onDragEditEnter: function (ev) {","      ","         var pos = ev.drop.terminal.getXY();","         this._magnetX = pos[0];","         this._magnetY = pos[1];","         ","         // TODO: this only works for Bezier...","         this.drag.wire.set('tgtDir', ev.drop.terminal.get('dir'));","      ","   },","   ","   /**","    * @method _onDragEditExit","    */","   _onDragEditExit: function (ev) {","      this._magnetX = null;","      this._magnetY = null;","   },","   ","   /**","    * @method isValidWireTerminal","    */","   isValidWireTerminal: function (DDterminal) {","     if(this.get('parent') !== undefined && (this.get('parent').get('preventSelfWiring'))){","        if (DDterminal._parentNode._node == this._parentNode._node) {","         return false;","        } ","     }","      return true;","   },","   ","   /**","    * @method destructor","    */","   destructor: function () {","      ","      if(this.drag) {","         this.drag.destroy();","      }","      if(this.drop) {","         this.drop.destroy();","      }","   }","   ","};","","","","}, '@VERSION@', {\"requires\": [\"bezier-wire\", \"dd-drop\", \"dd-drag\", \"dd-proxy\"]});"];
_yuitest_coverage["build/terminal-dragedit/terminal-dragedit.js"].lines = {"1":0,"13":0,"15":0,"16":0,"17":0,"25":0,"28":0,"53":0,"60":0,"61":0,"64":0,"72":0,"75":0,"79":0,"80":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"107":0,"108":0,"110":0,"111":0,"113":0,"114":0,"117":0,"131":0,"134":0,"151":0,"152":0,"153":0,"163":0,"164":0,"165":0,"166":0,"168":0,"169":0,"173":0,"176":0,"177":0,"179":0,"188":0,"189":0,"197":0,"198":0,"199":0,"202":0,"210":0,"211":0,"218":0,"219":0,"220":0,"223":0,"231":0,"232":0,"234":0,"235":0};
_yuitest_coverage["build/terminal-dragedit/terminal-dragedit.js"].functions = {"TerminalDragEdit:13":0,"_renderUIdragedit:58":0,"_bindUIdragedit:89":0,"getXY:131":0,"getXY:134":0,"_onDragEditStart:105":0,"_onDragEditDrag:150":0,"_onDragEditDrophit:161":0,"_onDragEditDropmiss:187":0,"_onDragEditEnter:195":0,"_onDragEditExit:209":0,"isValidWireTerminal:217":0,"destructor:229":0,"(anonymous 1):1":0};
_yuitest_coverage["build/terminal-dragedit/terminal-dragedit.js"].coveredLines = 61;
_yuitest_coverage["build/terminal-dragedit/terminal-dragedit.js"].coveredFunctions = 14;
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 1);
YUI.add('terminal-dragedit', function (Y, NAME) {

/**
 * @module terminal-dragedit
 */

/**
 * Extension which makes the wires editable
 * @class TerminalDragEdit
 * @constructor
 * @param {Object} config configuration object
 */
_yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "(anonymous 1)", 1);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 13);
Y.TerminalDragEdit = function (config) {

   _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "TerminalDragEdit", 13);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 15);
Y.after(this._renderUIdragedit, this, "renderUI");
   _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 16);
Y.after(this._bindUIdragedit, this, "bindUI");
   _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 17);
var attrs = {
      "color":{value:"rgb(173,216,230)"},
      "weight":{value:4},
      "opacity":{value:1},
      "dashstyle":{value:"none"},
      "fill":{value:"rgb(255,255,255)"},
      "editwire-class": {value: Y.BezierWire}
   };
   _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 25);
this.addAttrs(attrs, config);   
};

_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 28);
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

_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 53);
Y.TerminalDragEdit.prototype = {
   
   /**
    * @method _renderUIdragedit
    */
   _renderUIdragedit: function () {
      
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_renderUIdragedit", 58);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 60);
if( this.get('editable') ) {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 61);
this.get('contentBox').addClass(  this.getClassName("editable") );
         
         // Make the contentBox draggable with a DDProxy
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 64);
var drag = new Y.DD.Drag({ 
            node: this.get('contentBox'),
               groups: this.get('groups')
         }).plug(Y.Plugin.DDProxy, {
            cloneNode: true,
            moveOnEnd: false
         });
         
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 72);
this.drag = drag;
         
         // Create the Drop object
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 75);
var drop = new Y.DD.Drop({
            node: this.get('contentBox'),
            groups: this.get('groups')
         });
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 79);
drop.terminal = this;
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 80);
this.drop = drop;
         
      }
      
   },
   
   /**
    * @method _bindUIdragedit
    */
   _bindUIdragedit: function () {
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_bindUIdragedit", 89);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 90);
var drag = this.drag;
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 91);
if(drag) {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 92);
drag.on('drag:start',    this._onDragEditStart, this);
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 93);
drag.on('drag:drag',     this._onDragEditDrag, this);
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 94);
drag.on('drag:drophit',  this._onDragEditDrophit, this);
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 95);
drag.on('drag:dropmiss', this._onDragEditDropmiss, this);
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 96);
drag.on('drag:enter',    this._onDragEditEnter, this);
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 97);
drag.on('drag:exit',     this._onDragEditExit, this);
      }
   },
   
   /**
    * on drag start, create the wire between 2 fake terminals
    * @method _onDragEditStart
    */
   _onDragEditStart: function (ev) {
      // save the position
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_onDragEditStart", 105);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 107);
this._editwireX = ev.pageX;
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 108);
this._editwireY = ev.pageY;
      
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 110);
var dir = this.get('dir');
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 111);
var that = this;
      
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 113);
if(!this.get('graphic')) {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 114);
this.set('graphic', this.get('root').graphic);
      }
      
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 117);
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
              getXY: function () { _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "getXY", 131);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 131);
return [ev.pageX,ev.pageY]; }
           },
           tgt: { 
              getXY: function () { _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "getXY", 134);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 134);
return [that._magnetX || that._editwireX, that._magnetY || that._editwireY]; } 
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
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_onDragEditDrag", 150);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 151);
this._editwireX = ev.pageX;
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 152);
this._editwireY = ev.pageY;
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 153);
this.drag.wire._draw();
   },
   
   /**
    * on drop hit, set the wire src and tgt terminals
    * @method _onDragEditDrophit
    * @private
    */
   _onDragEditDrophit: function (ev) {
      
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_onDragEditDrophit", 161);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 163);
if( this.isValidWireTerminal(ev.drop.terminal) ) {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 164);
if(ev.drop.terminal.alwaysSrc){
            _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 165);
this.drag.wire.set('src', ev.drop.terminal);
            _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 166);
this.drag.wire.set('tgt', this);
         }else{
            _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 168);
this.drag.wire.set('src', this);
            _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 169);
this.drag.wire.set('tgt', ev.drop.terminal);
         }
         
         // Remove the reference to this wire
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 173);
this.drag.wire = null;
         
         // Reset the magnet position
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 176);
this._magnetX = null;
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 177);
this._magnetY = null;
      } else {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 179);
this.drag.wire.destroy();
      }
   },
   
   /**
    * on drop miss, destroy the wire
    * @method _onDragEditDropmiss
    */
   _onDragEditDropmiss: function (ev) {
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_onDragEditDropmiss", 187);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 188);
this.drag.wire.destroy();
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 189);
this.drag.wire = null;
   },
   
   /**
    * @method _onDragEditEnter
    */
   _onDragEditEnter: function (ev) {
      
         _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_onDragEditEnter", 195);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 197);
var pos = ev.drop.terminal.getXY();
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 198);
this._magnetX = pos[0];
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 199);
this._magnetY = pos[1];
         
         // TODO: this only works for Bezier...
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 202);
this.drag.wire.set('tgtDir', ev.drop.terminal.get('dir'));
      
   },
   
   /**
    * @method _onDragEditExit
    */
   _onDragEditExit: function (ev) {
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "_onDragEditExit", 209);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 210);
this._magnetX = null;
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 211);
this._magnetY = null;
   },
   
   /**
    * @method isValidWireTerminal
    */
   isValidWireTerminal: function (DDterminal) {
     _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "isValidWireTerminal", 217);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 218);
if(this.get('parent') !== undefined && (this.get('parent').get('preventSelfWiring'))){
        _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 219);
if (DDterminal._parentNode._node == this._parentNode._node) {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 220);
return false;
        } 
     }
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 223);
return true;
   },
   
   /**
    * @method destructor
    */
   destructor: function () {
      
      _yuitest_coverfunc("build/terminal-dragedit/terminal-dragedit.js", "destructor", 229);
_yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 231);
if(this.drag) {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 232);
this.drag.destroy();
      }
      _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 234);
if(this.drop) {
         _yuitest_coverline("build/terminal-dragedit/terminal-dragedit.js", 235);
this.drop.destroy();
      }
   }
   
};



}, '@VERSION@', {"requires": ["bezier-wire", "dd-drop", "dd-drag", "dd-proxy"]});
