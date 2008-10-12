/**
 * @fileoverview Define the WireIt.CanvasElement class
 */
(function () {
   
   // Shortcuts
   var Event = YAHOO.util.Event, UA = YAHOO.env.ua;

   /**
    * @class Create a canvas element and wrap cross-browser hacks to resize it
    * @constructor
    */
   WireIt.CanvasElement = function() {
      
      // Create the canvas element
      this.element = document.createElement('canvas');
      
      // excanvas.js for dynamic canvas tags
      if(typeof (G_vmlCanvasManager)!="undefined"){
         this.element = G_vmlCanvasManager.initElement(this.element);
      }
      
   };
   
   WireIt.CanvasElement.prototype = {
      
      /**
       * Get a drawing context
       * @param {String} [mode] Context mode (default "2d")
       * @return {CanvasContext} the context
       */
      getContext: function(mode) {
      	return this.element.getContext(mode || "2d");
      },
      
      /**
       * Set the canvas position and size 
       * @function
       * @param {Number} left Left position
       * @param {Number} top Top position
       * @param {Number} width New width
       * @param {Number} height New height
       */
      SetCanvasRegion: UA.ie ? 
               // IE
               function(left,top,width,height){
                  WireIt.sn(this.element,null,{left:left+"px",top:top+"px",width:width+"px",height:height+"px"});
                  this.getContext().clearRect(0,0,width,height);
               } : 
               ( (UA.webkit || UA.opera) ? 
                  // Webkit (Safari & Chrome) and Opera
                  function(left,top,width,height){
                     var el = this.element;
                     var newCanvas=WireIt.cn("canvas",{className:el.className || el.getAttribute("class"),width:width,height:height},{left:left+"px",top:top+"px"});
                     var listeners=Event.getListeners(el);
                     for(var listener in listeners){
                        var l=listeners[listener];
                        Event.addListener(newCanvas,l.type,l.fn,l.obj,l.adjust);
                     }
                     Event.purgeElement(el);
                     el.parentNode.replaceChild(newCanvas,el);
                     this.element = newCanvas;
                  } :  
                  // Other (Firefox)
                  function(left,top,width,height){
                     WireIt.sn(this.element,{width:width,height:height},{left:left+"px",top:top+"px"});
                  })
   };
   
})();