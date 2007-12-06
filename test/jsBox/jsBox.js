
/**
 * @class jsBox
 * @constructor
 */
var jsBox = function(config) {
   
   this.nParams = 1;
   
   // Render the box
	this.render();
	
	// Init the events
	this.initEvents();
	
	this.createTerminals();
	
	
	// Make resizeable
	this.ddResize = new jsBox.DDResize(this);					
	
	// Make Drag/drop !
	this.dd = new WireIt.util.DD(this.terminals,this.el);
	this.dd.setHandleElId(this.ddHandle);
	this.dd.addInvalidHandleId(this.ddResizeHandle);
	
	// Position the bubble
	if(config.position) {
		YAHOO.util.Dom.setXY(this.el, config.position);
	}
};

jsBox.nInstances = 0;

/**
 * Render the dom of a jsBox
 */
jsBox.prototype.render = function() {
   
	// Create the main bubble div
	this.el = WireIt.cn('div', {id: 'jsBox'+jsBox.nInstances++, className: "textbox"});
	
	// Create the drag/drop handle
	this.ddHandle = WireIt.cn('div', {}, {width: "100%", height: "20px", backgroundColor: "red"});
	this.el.appendChild(this.ddHandle);
	
	// Create the resize handle
	this.ddResizeHandle = WireIt.cn('div', {}, {position:"absolute",bottom: "0", right: "0", width: "20px", height: "20px", backgroundColor: "blue"});
	this.el.appendChild(this.ddResizeHandle);
	
	// Create a div to wrap the textarea
	var div = WireIt.cn('div', null, {position: 'relative', display: 'block'});
	this.textarea = WireIt.cn('textarea', null, {width: "100%", margin: "0", /*height: "80%", border: "0",*/ padding: "5px"}, "function(e) {\n\n  return 0;\n}");
	div.appendChild(this.textarea);
	this.el.appendChild(div);
	
	// Append dom to document.body
	document.body.appendChild(this.el);
};

/**
 * Init events :
 */
jsBox.prototype.initEvents = function() {

   YAHOO.util.Event.addListener(this.textarea, 'change', function(e) {
      
      var sParamList = this.textarea.value.match(/^[ ]*function[ ]*\((.*)\)[ ]*{/)[1];
         
      var params = sParamList.split(',');
      
      var nParams = (sParamList == "") ? 0 : parseInt(params.length);
      if( nParams != this.nParams) {
         this.nParams = nParams;
         this.createTerminals(params);
      }
      
   }, this, true);
   
};


/**
 * Create terminals: 
 */
jsBox.prototype.createTerminals = function(labels) {
   
   if(this.terminals) {
      for(var i = 0; i < this.terminals.length ; i++)
         this.terminals[i].remove();
   }
   
	
	// Create the terminals
	this.terminals = [];
   for(var i = 0 ; i < this.nParams ; i++) {
      var term = new WireIt.util.TerminalInput(this.el);
      
      if(labels && labels[i]) {
         term.el.title = labels[i];
      }
      
      this.terminals[this.terminals.length] = term;
      WireIt.sn(term.el, null, {position: "absolute", top: "-15px"});//, left: (inputsIntervall*(i+1))-8+"px"});
   }
   
   var term = new WireIt.util.TerminalOutput(this.el);
   term.jsBox = this;
   this.terminals[this.terminals.length] = term;
   WireIt.sn(term.el, null, {position: "absolute", bottom: "-15px"});//, left: Math.floor(width/2)-8+"px"});
   
   this.positionTerminals();
   
   if(this.dd) {
      this.dd.setTerminals(this.terminals);
   }
   
};

// Position the terminals
jsBox.prototype.positionTerminals = function() {
   
   // Calculate the width
   var widthStr = YAHOO.util.Dom.getStyle(this.el, 'width');
   var width = parseInt( widthStr.substr(0,widthStr.length-2), 10);
   
   var inputsIntervall = Math.floor(width/(this.nParams+1));
   
      console.log("--");
   for(var i = 0 ; i < this.terminals.length-1 ; i++) {
      console.log(i);
      YAHOO.util.Dom.setStyle(this.terminals[i].el, "left", (inputsIntervall*(i+1))-8+"px" );
      if(this.terminals[i].wire)
         this.terminals[i].wire.redraw();
   }
   
   YAHOO.util.Dom.setStyle(this.terminals[this.terminals.length-1].el, "left", Math.floor(width/2)-8+"px");
      
      if(this.terminals[this.terminals.length-1].wire)
         this.terminals[this.terminals.length-1].wire.redraw();
};




jsBox.prototype.eval = function() {
   
   // Eval each of the parameter functions : 
   var params = [];
   for(var i = 0 ; i < this.terminals.length-1 ; i++) {
      var term = this.terminals[i];
      var otherTerm = (term.wire.terminal1 == term) ? term.wire.terminal2 : term.wire.terminal1;
      if(!otherTerm.jsBox.evalResult)
         otherTerm.jsBox.eval();
      params[i] = otherTerm.jsBox.evalResult;
   }
   
   console.log("params: ", params);
   var f = eval( '('+this.textarea.value+')' );
   this.evalResult = f.apply(window, params);
   
   console.log(this.evalResult);
   
};

/**
 * Returns Boolean wether the jsBox can be evaluated
 */
jsBox.prototype.mayEval = function() {
   for(var i = 0 ; i < this.terminals.length-1 ; i++) {
      var term = this.terminals[i];
      if(!term.wire) return false;
      
      var otherTerm = (term.wire.terminal1 == term) ? term.wire.terminal2 : term.wire.terminal1;
      if(!otherTerm.jsBox) return false;
      
      if( !otherTerm.jsBox.mayEval() ) return false;
   }
   return true;
};


var boxes = [];

function addJsBox() {
   
	boxes[boxes.length] = new jsBox({
	   position: [335,60] 
	});
	
};

function run() {
   for(var i = 0; i < boxes.length; i++) {
      if( boxes[i].mayEval() ) {
         if( !boxes[i].evalResult )
            boxes[i].eval();
      }
   }
};











jsBox.DDResize = function(parentJsBox) {
   
   this.parentJsBox = parentJsBox;
   
   jsBox.DDResize.superclass.constructor.apply(this, [parentJsBox.el, parentJsBox.ddResizeHandle]);
   this.setHandleElId(parentJsBox.ddResizeHandle);
};

YAHOO.extend(jsBox.DDResize, YAHOO.util.DragDrop, {

    onMouseDown: function(e) {
        var panel = this.getEl();
        this.startWidth = panel.offsetWidth;
        this.startHeight = panel.offsetHeight;

        this.startPos = [YAHOO.util.Event.getPageX(e),
                         YAHOO.util.Event.getPageY(e)];
    },

    onDrag: function(e) {
        var newPos = [YAHOO.util.Event.getPageX(e),
                      YAHOO.util.Event.getPageY(e)];

        var offsetX = newPos[0] - this.startPos[0];
        var offsetY = newPos[1] - this.startPos[1];

        var newWidth = Math.max(this.startWidth + offsetX, 200);
        var newHeight = Math.max(this.startHeight + offsetY, 100);

        var panel = this.getEl();
        panel.style.width = newWidth + "px";
        panel.style.height = newHeight + "px";
        
        this.parentJsBox.textarea.style.height = (newHeight-40) + "px";
        
        this.parentJsBox.positionTerminals();
    }
});