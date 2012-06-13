/**
 * @module inputex-multiautocompletecustom
 */
YUI.add("inputex-multiautocompletecustom",function(Y){

  var inputEx = Y.inputEx;
  
    /**
   * Create a multi autocomplete field customized
   * @class inputEx.MultiAutoCompleteCustom
   * @extends inputEx.MultiAutoComplete
   * @constructor
   * @param {Object} options Added options:
   * <ul>
   *    <li>maxItems: the number of Items</li>
   *    <li>maxItemsAlert: a function executed when the maxItems is reach</li>
   * </ul>
   */
  
  inputEx.MultiAutoCompleteCustom = function(options) {
    this.options = {};
    this.maxItems = options.maxItems; 
    this.maxItemsAlert = options.maxItemsAlert;
    this.animColors = options.animColors;
    this.uniqueness = options.uniqueness;
    // hack to avoid to reset the field after a blur event, we store the value into this variable
    this.lastElemValue = "";
    this.labelAddButton = options.labelAddButton || "Add";
    
    this.classRemoveButton = options.classRemoveButton || "removeButton";
    inputEx.MultiAutoCompleteCustom.superclass.constructor.call(this,options);

  };
  Y.extend(inputEx.MultiAutoCompleteCustom, inputEx.MultiAutoComplete,{
     /**
      * renderComponent : override the MultiAutocomplete renderComponent function
      * <ul>
      *   <li>Use the custom ddlist </li>
      *   <li>render a Button "Add" to add non-autocomplete elements to the list</li>
      * </ul>
      */

    renderComponent: function() {
      inputEx.MultiAutoComplete.superclass.renderComponent.call(this);
      this.buttonAdd = inputEx.cn('div',{className: "addButton"},{},this.labelAddButton);
      Y.on('click',this.onAdd, this.buttonAdd,this)
      this.el.parentNode.appendChild(this.buttonAdd);

      this.ddlist = new inputEx.widget.ListCustom({
         parentEl: this.fieldContainer,
         maxItems: this.maxItems, 
         classRemoveButton: this.classRemoveButton,
         maxItemsAlert: this.maxItemsAlert, 
         animColors: this.animColors,
         uniqueness: this.uniqueness });
      this.ddlist.on("itemRemoved",function() {
         this.setClassFromState();
         this.fireUpdatedEvt();
      }, this);
      this.ddlist.on("listReordered",this.fireUpdatedEvt, this);
    },    
    /**
    * onAdd : fired when someone click on the field button
    * <ul>
    *   <li>Add an element to the list from the value of the field </li>
    * </ul>
    */
    onAdd:function(e,a){
      if (this.el.value == "") return;
      if (this.el.value.split(",").length != 1){
        var values =  this.el.value.split(",");
        for( var i = 0 ; i< values.length; i++){
          this.ddlist.addItem({label: values[i], value: values[i]});
        }
      } else {
        this.ddlist.addItem({label: this.el.value, value: this.el.value});
      }
      this.el.value = "";
      this.lastElemValue = "";
      this.hiddenEl.value = this.stringifyValue();
      this.fireUpdatedEvt();
    },
    clear: function(){
      this.lastElemValue = "";
      this.el.value = "";
      this.setValue([]);
    },
      /**
    * onChange : Override the onChange of MultiAutoocmplete to fix a bug with the blurEvent in InputEx 0.5.0
    * <ul>
    *   <li>Add an element to the list from the value of the field </li>
    * </ul>
    */
    onChange: function(e) {
      this.setClassFromState();
      // Clear the field when no value 
      if (this.lastElemValue != this.el.value) this.lastElemValue = this.el.value;
      this.hiddenEl.value = this.stringifyValue();
    },
      /**
    * onBlur : Override the onBlur of MultiAutocomplete to fix a bug with the blurEvent in InputEx 0.5.0
    */   
    onBlur: function(e){
     //the onBlur from an old version of inputex took in the AutoComplete.js file
     if (this.lastElemValue != this.el.value && this.el.value != this.options.typeInvite) this.el.value = this.lastElemValue;
     
     if(this.el.value == '' && this.options.typeInvite) {
        Y.one(this.divEl).addClass( "inputEx-typeInvite");
        this.el.value = this.options.typeInvite;
     }  else if (e.target.ac){ 
             return; //do nothing
     } else if(this.el.value !== ''){
       this.onAdd();
     }
    },
     
    onKeyPress: function(e){
      if(e.keyCode == 13){
        e.halt();
         this.onAdd();
      }
    }
  });
  inputEx.registerType("multiautocompletecustom", inputEx.MultiAutoCompleteCustom);
},'3.0.0a', {
  requires: ["inputex-multiautocomplete","inputex-pie-listcustom"]
});
