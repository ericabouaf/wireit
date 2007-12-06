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
      //if( el.getContext ) {
         el.getContext("2d").clearRect(0,0,lw,lh);
      /*}
      else {
         //console.log(el);
      }*/
      return el;
   },

   SetCanvasRegionSafari: function(_6c,_6d,top,lw,lh){
      var _71=_6c.className;
      if(!_71){
         _71=_6c.getAttribute("class");
      }
      var _72=this.cn("canvas",{className:_71,width:lw,height:lh},{left:_6d+"px",top:top+"px"});
      var _73=YAHOO.util.Event.getListeners(_6c);
      for(var _74 in _73){
         var l=_73[_74];
         YAHOO.util.Event.addListener(_72,l.type,l.fn,l.obj,l.adjust);
      }
      YAHOO.util.Event.purgeElement(_6c);
      _6c.parentNode.replaceChild(_72,_6c);
      return _72;
   },

   SetCanvasRegionDefault: function(_76,_77,top,lw,lh){
      this.sn(_76,{width:lw,height:lh},{left:_77+"px",top:top+"px"});
      return _76;
   },

   SetCanvasSize: function(_7b,lw,lh){
      if(WireIt.ua.isSafari||WireIt.ua.isOpera){
         var _7e=_7b.className;
         if(!_7e){
            _7e=_7b.getAttribute("class");
         }
         var _7f=this.cn("canvas",{className:_7e,width:lw,height:lh});
         _7b.parentNode.replaceChild(_7f,_7b);
         return _7f;
      }
      sn(_7b,{width:lw,height:lh},{width:lw+"px",height:lh+"px"});
      if(_7b.getContext){
         _7b.getContext("2d").clearRect(0,0,lw,lh);
      }
      return _7b;
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


