/**
 * Used by InPlaceEdit and Uneditable fields
 * @module inputex-visus
 */
YUI.add("inputex-visus",function(Y){
   
   var lang = Y.Lang,
       inputEx = Y.inputEx;
/**
 * Contains the various visualization methods
 * @class inputEx.visus
 * @static
 */
inputEx.visus = {
  
  /**
   * Use the trimpath-template engine
   * see http://code.google.com/p/trimpath/wiki/JavaScriptTemplates for syntax
   * options = {visuType: 'trimpath', template: "String template"}
   */
  trimpath: function(options, data) {
      if(!TrimPath) { alert('TrimPath is not on the page. Please load inputex/lib/trimpath-template.js'); return null; }
      var tpl = TrimPath.parseTemplate(options.template);
     	var ret = tpl.process(data);
     	return ret;
  },
  
  /**
   * Use a rendering function
   * options = {visuType: 'func', func: function(data) { ...code here...} }
   * @method func
   */
  "func": function(options, data) {
     return options.func(data);
  },
  
  /**
   * Use Y.Lang.dump
   * options = {visuType: 'dump'}
   */
  dump: function(options, data) {
     return Y.dump(data);
  }
   
};

/**
 * Render 'data' using a visualization function described by 'visuOptions'
 * @static
 * @param {Object} visuOptions The visu parameters object with: visuType: 'myType', ...args...
 * @param {Object} data The input data to send to the template
 * @param {HTMLElement || String} parentEl optional Set the result as content of parentEl
 * @return {HTMLElement || String} Either the inserted HTMLElement or the String set to parentEl.innerHTML
 */
inputEx.renderVisu = function(visuOptions,data, parentEl) {
   
   var opts = visuOptions || {};
   var visuType = opts.visuType || 'dump';
   
   if( !inputEx.visus.hasOwnProperty(visuType) ) {
      throw new Error("inputEx: no visu for visuType: "+visuType);
   }
   
   var f = inputEx.visus[visuType];
   if( !lang.isFunction(f) ) {
      throw new Error("inputEx: no visu for visuType: "+visuType);
   }
   
   var v = null;
   try {
      v = f(opts,data);
   }
   catch(ex) {
      throw new Error("inputEx: error while running visu "+visuType+" : "+ex.message);
   }
   
   // Get the node
   var node = null;
   if(parentEl) {
      if(lang.isString(parentEl)) {
         node = Y.one(parentEl);
      }
      else {
         node = parentEl;
      }
   }
   
   // Insert it
   if(node) {
      if(Y.Lang.isObject(v) && v.tagName ) {
         node.innerHTML = "";
         node.appendChild(v);
      }
      else {
         node.innerHTML = v;
      }
   }
   
   return v;
};

},'3.0.0a',{
  requires: ["inputex","dump"]
});
