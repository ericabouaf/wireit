/**
 * @fileoverview Set the WireIt namespace ; DOM and Canvas helpers
 */

var WireIt = {
   
   // WireIt.util namespace 
   util: {},
   
   /**
    * Get the User Agent
    */
   ua: {
      isGecko:/Gecko/.test(navigator.userAgent),
      isIE:/MSIE/.test(navigator.userAgent),
      isKHTML:/Konqueror|Safari|KHTML/.test(navigator.userAgent),
      isOpera:/Opera/.test(navigator.userAgent),
      isSafari:/AppleWebKit/.test(navigator.appVersion),
      myUA:function(){
         if(this.isIE){
            return "IE";
         }
         if(this.isSafari){
            return "Safari";
         }
         if(this.isGecko){
            return "Gecko";
         }
         if(this.isKHTML){
            return "KHTML";
         }
         if(this.isOpera){
            return "Opera";
         }
         return "undefined";
      }
   },
   
   
   /**
    * Functions used to create nodes
    * and set node attributes
    */
   sn: function(el,domAttributes,styleAttributes){
       if(!el){
          return;
       }
       if(domAttributes){
          for(var i in domAttributes){
             var domAttribute = domAttributes[i];
             if(typeof (domAttribute)=="function"){
                continue;
             }
             if(WireIt.ua.isIE&&i=="type"&&(el.tagName=="INPUT"||el.tagName=="SELECT")){
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
                   //console.log("WARNING: Couldnt sn for "+el.tagName+", attr "+i+", val "+domAttribute);
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
    },

   /**
    * Create Node
    */
   cn: function(tag, domAttributes, styleAttributes, innerHTML){
      var el=document.createElement(tag);
      this.sn(el,domAttributes,styleAttributes);
      if(innerHTML){
         el.innerHTML = innerHTML;
      }
      return el;
   },
   
   
   /**
    * Canvas functions
    */ 
   SetCanvasRegionIE: function(el,left,top,lw,lh){
      this.sn(el,null,{left:left+"px",top:top+"px",width:lw+"px",height:lh+"px"});
      el.getContext("2d").clearRect(0,0,lw,lh);
      return el;
   },

   SetCanvasRegionSafari: function(canvasEl,left,top,lw,lh){
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
   },

   SetCanvasRegionDefault: function(canvasEl,left,top,lw,lh){
      this.sn(canvasEl,{width:lw,height:lh},{left:left+"px",top:top+"px"});
      return canvasEl;
   },

   SetCanvasSize: function(canvasEl,lw,lh){
      if(WireIt.ua.isSafari||WireIt.ua.isOpera){
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
   }
      
};

// Set the function SetCanvasRegion depending on the browser
WireIt.SetCanvasRegion = WireIt.ua.isIE ? WireIt.SetCanvasRegionIE : ( (WireIt.ua.isSafari||WireIt.ua.isOpera) ? WireIt.SetCanvasRegionSafari :  WireIt.SetCanvasRegionDefault);

// This function does not exist in IE !!!
if(!Array.prototype.indexOf) {
   Array.prototype.indexOf = function(el) {
      for(var i = 0 ;i < this.length ; i++) {
         if(this[i] == el) return i;
      }
      return -1;
   };
}


