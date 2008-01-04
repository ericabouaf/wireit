/**
 * @fileoverview Set the WireIt namespace ; DOM and Canvas helpers
 */

var WireIt = {};

// WireIt.util namespace
WireIt.util = {};

/**
 * Functions used to create nodes
 * and set node attributes
 */
WireIt.sn = function(el,domAttributes,styleAttributes){
   if(!el) { return; }
   
   if(domAttributes){
      for(var i in domAttributes){
         var domAttribute = domAttributes[i];
         if(typeof (domAttribute)=="function"){
            continue;
         }
         if(YAHOO.env.ua.ie && i=="type" && (el.tagName=="INPUT"||el.tagName=="SELECT") ){
            continue;
         }
         if(i=="className"){
            i="class";
            el.className=domAttribute;
         }
         if(domAttribute!==el.getAttribute(i)){
            try{
               if(domAttribute===false){
                  el.removeAttribute(i);
               }else{
                  el.setAttribute(i,domAttribute);
               }
            }
            catch(err){
               console.log("WARNING: WireIt.sn failed for "+el.tagName+", attr "+i+", val "+domAttribute);
            }
         }
      }
   }
       
   if(styleAttributes){
      for(var i in styleAttributes){
         if(typeof (styleAttributes[i])=="function"){
            continue;
         }
         if(el.style[i]!=styleAttributes[i]){
            el.style[i]=styleAttributes[i];
         }
      }
   }
};


/**
 * Create Node
 */
WireIt.cn = function(tag, domAttributes, styleAttributes, innerHTML){
   var el=document.createElement(tag);
   this.sn(el,domAttributes,styleAttributes);
   if(innerHTML){
      el.innerHTML = innerHTML;
   }
   return el;
};
   
   
/**
 * Canvas functions
 */ 
WireIt.SetCanvasRegionIE = function(el,left,top,lw,lh){
   this.sn(el,null,{left:left+"px",top:top+"px",width:lw+"px",height:lh+"px"});
   el.getContext("2d").clearRect(0,0,lw,lh);
   return el;
};


WireIt.SetCanvasRegionSafari = function(canvasEl,left,top,lw,lh){
   var canvasClass=canvasEl.className;
   if(!canvasClass){
      canvasClass=canvasEl.getAttribute("class");
   }
   var newCanvas=this.cn("canvas",{className:canvasClass,width:lw,height:lh},{left:left+"px",top:top+"px"});
   var listeners=YAHOO.util.Event.getListeners(canvasEl);
   for(var listener in listeners){
      var l=listeners[listener];
      YAHOO.util.Event.addListener(newCanvas,l.type,l.fn,l.obj,l.adjust);
   }
   YAHOO.util.Event.purgeElement(canvasEl);
   canvasEl.parentNode.replaceChild(newCanvas,canvasEl);
   return newCanvas;
};

WireIt.SetCanvasRegionDefault = function(canvasEl,left,top,lw,lh){
   this.sn(canvasEl,{width:lw,height:lh},{left:left+"px",top:top+"px"});
   return canvasEl;
};


WireIt.SetCanvasSize = function(canvasEl,lw,lh){
   if(YAHOO.env.ua.webkit || YAHOO.env.ua.opera){
      var canvasClass=canvasEl.className;
      if(!canvasClass){
         canvasClass=canvasEl.getAttribute("class");
      }
      var newCanvas=this.cn("canvas",{className:canvasClass,width:lw,height:lh});
      canvasEl.parentNode.replaceChild(newCanvas,canvasEl);
      return newCanvas;
   }
   sn(canvasEl,{width:lw,height:lh},{width:lw+"px",height:lh+"px"});
   if(canvasEl.getContext){
      canvasEl.getContext("2d").clearRect(0,0,lw,lh);
   }
   return canvasEl;
};
      

/**
 * This function sets the position and size of a canvas element accross all browsers.
 */
WireIt.SetCanvasRegion = YAHOO.env.ua.ie ? WireIt.SetCanvasRegionIE : ( (YAHOO.env.ua.webkit || YAHOO.env.ua.opera) ? WireIt.SetCanvasRegionSafari :  WireIt.SetCanvasRegionDefault);


if(!Array.prototype.indexOf) {
   /**
    * The method Array.indexOf doesn't exist on IE :(
    */
   Array.prototype.indexOf = function(el) {
      for(var i = 0 ;i < this.length ; i++) {
         if(this[i] == el) return i;
      }
      return -1;
   };
}

if(!Array.prototype.compact) {
   /**
    * Compact
    */
   Array.prototype.compact = function() {
      var n = []
      for(var i = 0 ; i < this.length ; i++) {
         if(this[i]) {
            n.push(this[i]);
         }
      }
      return n;
   };
}

