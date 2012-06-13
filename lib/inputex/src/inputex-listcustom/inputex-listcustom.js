/**
 * @module inputex-pie-listcustom
 */
YUI.add("inputex-pie-listcustom", function(Y) {

   var inputEx = Y.inputEx;
   
inputEx.widget.ListCustom = function(options) {
  this.options = {};
  this.listSelectOptions = options.listSelectOptions;
  this.maxItems = options.maxItems;
  this.animColors = options.animColors || false;
  this.maxItemsAlert = options.maxItemsAlert;
  this.uniqueness = options.uniqueness || false;
  this.disabled = false;
  this.classRemoveButton = options.classRemoveButton;
  inputEx.widget.ListCustom.superclass.constructor.call(this,options);
  this.publish("listChanged");
  this.selects = [];
};

Y.extend(inputEx.widget.ListCustom,inputEx.widget.DDList,{
/**
    * Add an item to the list
    * @param {String|Object} item Either a string with the given value or an object with "label" and "value" attributes
    */
   addItem: function(item) {
      if (this.disabled){
        return false;
      }
      if (this.maxItems && this.items.length >= this.maxItems){
        this.maxItemsAlert ? this.maxItemsAlert.call() : alert("You're limited to "+this.maxItems+" items");
        return; 
      }

      var iCopy = {};
      iCopy.label = (typeof item == "object") ? item.label : item ;
      iCopy.value = (typeof item == "object") ? item.value : item ;
      var li = inputEx.cn('li', {className: 'inputEx-DDList-item'});
      iCopy.span = inputEx.cn('span', null, null,  iCopy.label)

      if(this.listSelectOptions){
        var select = new inputEx.SelectField(this.listSelectOptions); 
        select.on("updated",function(){
           this.fire("listChanged");
        },this,true)
        this.selects.push(select);
        li.appendChild(select.el);
        iCopy.getValue = function(){
          return {select: select.getValue(), label: this.label, value: this.value};
        }
        iCopy.setValue = function(obj, sendUpdatedEvt){
          var label = (typeof obj == "object") ? obj.label : obj;
          var value = (typeof obj == "object") ? obj.value : obj;
          var selectValue = (typeof obj == "object") ? obj.selectValue : obj;
          this.span.innerHTML = label;
          this.label = label;
          this.value = value;
          select.setValue(selectValue, sendUpdatedEvt);
        }
      } else {
        iCopy.getValue = function(){
          result = {};
          if(this.value) result.value = this.value;
          if(this.label) result.label = this.label;
          return result;
        }       
        iCopy.setValue = function(obj, sendUpdatedEvt){
          this.label = (typeof obj == "object") ? obj.label : obj ;
          this.value = (typeof obj == "object") ? obj.value : obj ;
          this.span.innerHTML = this.label;
        }
      } 
      if (this.uniqueness){
        var newValue = iCopy.getValue();
        var values = [];
        for (var i = 0; i < this.items.length; i++){
          var obj = this.items[i].getValue();
          if (newValue.label === obj.label && newValue.value === obj.value){
            // this object is already in the listCustom
            return;
          }
        }
      }     
      
      li.appendChild(iCopy.span);
      if(this.animColors){
        this.buildAnim(li).run();
      }
 

      // Option for the "remove" link (default: true)
    if(!!this.options.allowDelete){
      var removeLink = inputEx.cn('div', {id: iCopy.value+"-Close" ,className: this.classRemoveButton || "removeButton"}, null, ""); 
        li.appendChild( removeLink );
        Y.on('click', this.onRemove,removeLink, this);
      }
      // Don't want any drag and drop
      //var dditem = new inputEx.widget.DDListItem(li);
      //
      
      this.items.push( iCopy );

      this.ul.appendChild(li);
   },
   disable: function(){

      var selects = this.selects;
      for (var i = 0; i< selects.length; i++){
        selects[i].disable();
      }
      var items = this.items;
      for (var i = 0; i< items.length; i++){
        var yEl = Y.one(items[i].value+"-Close");
        yEl.addClass("hidden")
        Y.detach("click", this.onClose, yEl, this, true);
      }
      this.disabled = true;
   },
   onRemove: function(e){
           var a = e.target._node;
           var li = a.parentNode;
           this.removeItem( inputEx.indexOf(li,this.ul.childNodes) );
   },
   enable: function(){

      var selects = this.selects;
      for (var i = 0; i< selects.length; i++){
        selects[i].enable();
      }
      var items = this.items;
      for (var i = 0; i< items.length; i++){
        var yEl = Y.one(items[i].value+"-Close");
        if(yEl){
          yEl.removeClass("hidden");
        }
        Y.on("click", this.onClose, yEl, this, true);
      }  
      this.disabled = false;
   },
   getValue: function(){
     var results = [];
     for(var i = 0; i < this.items.length; i++){
       results.push(this.items[i].getValue());
     }
     return results;
   },
   setValue: function(objs, sendUpdatedEvt){    
      if (this.disabled){
        return false;
      }
      if(this.items.length > objs.length){
        // we copy the length value to avoid for-bugs
        var l = this.items.length;
        for (var i = 0; i< l -objs.length; i++){
          this.removeItem(l-1-i, sendUpdatedEvt);
        }
      }

      for (var i = 0; i < objs.length; i++){
        if (this.items[i]){
         this.items[i].setValue(objs[i], sendUpdatedEvt);
        } else {
         this.addItem(objs[i], sendUpdatedEvt);
        }
      } 
   },
   // override to add sendUpdatedEvt option 
   removeItem: function(index, sendUpdatedEvt) {
     var itemValue = this._removeItem(index);
     // Fire the itemRemoved Event
     this.fire("itemRemoved",itemValue, sendUpdatedEvt);
  },
  buildAnim: function(el){
    var node = Y.one(el);
 
    var anim = new Y.Anim(Y.mix({
      node: node,
      duration:0.5
    },this.animColors));
    anim.on("end", function(){node.setStyle("background","transparent")})
    return anim;
  }
}); 

}, '3.0.0a',{
  requires: ["sortable","anim"]
});
