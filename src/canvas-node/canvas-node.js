/**
 * @module canvas-node
 */
YUI.add('canvas-node', function(Y) {

/**
 * TODO: Fix Resize issue on canvas
 * @class CanvasNode
 * @extends Node
 * @constructor
 * @param {DOMElement} node (optional) the dom element
 */
function CanvasNode(node) {
	CanvasNode.superclass.constructor.call(this, node || Y.config.doc.createElement('canvas')	);
}

Y.extend( CanvasNode, Y.Node, {

	getContext: function(mode) {

		// For Server-side usage
		/*if( !Y.Lang.isFunction(this._node.getContext) ) {
			if(this._savedCtx){ return this._savedCtx; }
			var Canvas = require('canvas'), canvas = new Canvas(300, 300), ctx = canvas.getContext('2d');
			this._savedCtx = ctx;
			this._node_canvas = canvas;
			return ctx;
		}*/
		
		return this._node.getContext(mode || "2d");
	},

	resize: Y.UA.ie ? 
            // IE
            function(width,height){
               /*var el = this.get('element');
               WireIt.sn(el,null,{left:left+"px",top:top+"px",width:width+"px",height:height+"px"});
               el.getContext("2d").clearRect(0,0,width,height);
               this._configs.element.value = el;*/
            } : 
            ( (Y.UA.webkit || Y.UA.opera) ? 
               // Webkit (Safari & Chrome) and Opera
               function(width,height){
	
						// recreate the canvas
                  /*var el = this._node;
						var newCanvas = Y.config.doc.createElement('canvas');
						this._node.parentNode.replaceChild(newCanvas, el);
						this._node = newCanvas;*/
						
						this.set('width', width);
						this.set('height', height);
						
                  /*
						var listeners=YAHOO.util.Event.getListeners(el);
                  for(var listener in listeners){
							if(listeners.hasOwnProperty(listener)) {
								var l=listeners[listener];
								YAHOO.util.Event.addListener(newCanvas,l.type,l.fn,l.obj,l.adjust);
							}
                  }
                  YAHOO.util.Event.purgeElement(el);
                  el.parentNode.replaceChild(newCanvas,el);
                  //this.element = newCanvas;
						this._configs.element.value = newCanvas;*/
               } :  
               // Other (Firefox)
               function(width,height){
						this.set('width', width);
						this.set('height', height);
               })
	
});

Y.CanvasNode = CanvasNode;

}, '3.5.1', {requires: ['node']});
