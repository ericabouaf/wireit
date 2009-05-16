(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;

/**
 * @class Create a treeview to inspect a javascript object
 * @constructor
 * @param {String|HTMLElement} parentEl where to append the tree
 * @param {Object} object the object to inspect
 */
inputEx.widget.JsonTreeInspector = function(parentEl, object) {

   this.hash = {}; // Hash to contain the li/value
   
   this.el = inputEx.cn('div');
   this.buildBranch(object, this.el);
   (lang.isString(parentEl) ? Dom.get(parentEl) : parentEl).appendChild(this.el);
};

inputEx.widget.JsonTreeInspector.prototype = {
   
   /**
    * TODO: Expand branches with a maximum depth
    *
   expand: function() {
      
   },*/
   
   /**
    * Build the sub-branch for obj
    */
   buildBranch: function(obj,parentEl) {
      
      var ul = inputEx.cn('ul', {className: 'inputEx-JsonTreeInspector'});
      
      for(var key in obj) {
         if(obj.hasOwnProperty(key)) {
            var value = obj[key];
            
            var id = Dom.generateId();
            var li = inputEx.cn('li', {id: id}, null, key+':');
            this.hash[id] = {value: value, expanded: false};
            
            
            if( lang.isObject(value) || lang.isArray(value) ) {
               if(lang.isArray(value)) {
                  li.appendChild( inputEx.cn('span', null, null, "[ "+value.length+" element"+(value.length > 1 ? 's':'')+"]" ) );
               }
               Dom.addClass(li,'collapsed');
               Event.addListener(li, 'click', this.onItemClick, this, true);
            }
            else {
               var spanContent = '';
               if( lang.isString(value) ) {
                  spanContent = '"'+value+'"';
               }
               else {
                  if(value === null) {
                     spanContent = "null";
                  }
                  else {
                     spanContent = value.toString();
                  }
               }
               li.appendChild( inputEx.cn('span', {className: 'type-'+(value === null ? "null" : (typeof value))}, null, spanContent ) );
            }
            
            
            ul.appendChild(li);
         }
      }
      
      parentEl.appendChild(ul);
      
      return ul;
   },
   
   
   /**
    * When the user click on a node
    */
   onItemClick: function(e, params) {
      Event.stopEvent(e);
      var tgt = Event.getTarget(e);
      var id = tgt.id;
      
      if( !Dom.hasClass(tgt, 'expanded') && !Dom.hasClass(tgt, 'collapsed') ) return;
      
      // Class
      var isExpanded = Dom.hasClass(tgt, 'expanded');
      Dom.replaceClass(tgt, isExpanded ? 'expanded' : 'collapsed' , isExpanded ? 'collapsed':'expanded');
      
      var h = this.hash[id];
      
      if(isExpanded) {
         // hide the sub-branch
         h.expanded.style.display = 'none';
      }
      else {
         if(h.expanded === false) {
            // generate the sub-branch
            h.expanded = this.buildBranch(h.value, tgt);
         }
         // show the sub-branch
         h.expanded.style.display = '';
      }
   }
   
};



})();