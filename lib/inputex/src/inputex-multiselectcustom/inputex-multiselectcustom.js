/**
 * @module inputex-multiselectcustom
 */
YUI.add("inputex-multiselectcustom", function(Y) {
  
  var inputEx = Y.inputEx, lang = Y.Lang;

  /**
 * Create a multi Select field customized
 * @class inputEx.MultiSelectCustomField
 * @extends inputEx.MultiSelectField
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>maxItems: the number of Items</li>
 *    <li>maxItemsAlert: a function executed when the maxItems is reach</li>
 *    <li>listSelectOptions : the options for a select field inside of the custom list</li>
 * </ul>
 */


inputEx.MultiSelectCustomField = function(options) {
  this.options = this.options || {};
  this.listSelectOptions= options.listSelectOptions;
  this.maxItems = options.maxItems; 
  this.maxItemsAlert = options.maxItemsAlert;
  this.classRemoveButton = options.classRemoveButton;  
  inputEx.MultiSelectCustomField.superclass.constructor.call(this,options);
  this.confirmEmpty = options.confirmEmpty;

  
};
Y.extend(inputEx.MultiSelectCustomField, inputEx.MultiSelectField,{
   /**
    * renderComponent : override the MultiSelectField renderComponent function
    * <ul>
    *   <li>Use the custom ddlist </li>
    *   <li>put options for select fields in the ddList Custom</li>
    * </ul>
    */

   renderComponent: function() {
      inputEx.MultiSelectCustomField.superclass.renderComponent.call(this);
      
      this.ddlist = new inputEx.widget.ListCustom({classRemoveButton: this.classRemoveButton,parentEl: this.fieldContainer,listSelectOptions: this.listSelectOptions, maxItems: this.maxItems, uniqueness: true, maxItemsAlert: this.maxItemsAlert});
      this.ddlist.on("listChanged",this.fireUpdatedEvt, this, true);
      this.el.name = ""; // we re-route the html submit features 
      var hiddenAttrs = {
         type: 'hidden',
         value: ''
      };
      if(this.options.name) hiddenAttrs.name = this.options.name;
      this.hiddenEl = inputEx.cn('input', hiddenAttrs);
      this.fieldContainer.appendChild(this.hiddenEl);

   }, 
   getState: function(){
     if (this.confirmEmpty && !this.confirmedEmpty ){
       if (this.getValue().length == 0){
          if (typeof(this.confirmEmpty)  == "string"){
            this.confirmedEmpty = ( confirm(this.confirmEmpty) ? "valid" : "invalid");
          } else if (typeof(this.confirmEmpty)  == "function"){
            this.confirmedEmpty = this.confirmEmpty();
          }
          return this.confirmedEmpty;
        }
      } else if (this.confirmedEmpty) {
        if (this.getValue().length == 0){
          return this.confirmedEmpty
        }
      } else {
        inputEx.MultiSelectCustomField.superclass.getState.call(this);
      }
   },  
  setValue: function(obj, sendUpdatedEvt) {
     var i, length, position, choice, ddlistValue = [];
      
      if (!lang.isArray(obj)) {
        return;
      }
      
      // Re-enable all choices
      for (i = 0, length=this.choicesList.length ; i < length ; i += 1) {
        this.enableChoice(i);
      }
      this.ddlist.setValue(obj,false);
      // disable selected choices and fill ddlist value
      for(i = 0 ; i < obj.length ; i++) {
         position = this.getChoicePosition({ value : obj[i].value || obj[i] });
         choice = this.choicesList[position];
         this.hideChoice({ position: position });
      }
     if(sendUpdatedEvt !== false) {
        // fire update event
         this.fireUpdatedEvt();
      }
  },

     // override to add sendUpdatedEvt option 
  onItemRemoved: function(v,sendUpdatedEvt) {
     this.showChoice({ value : v.value });
     this.el.selectedIndex = 0;
     if(!(sendUpdatedEvt == false)){
        this.fireUpdatedEvt();
     }  
   }, 
   disable: function(){
      inputEx.MultiSelectCustomField.superclass.disable.call(this);
      this.ddlist.disable();
   },
   enable: function(){
      inputEx.MultiSelectCustomField.superclass.enable.call(this);
      this.ddlist.enable();
   },
   clear: function(){
      inputEx.MultiSelectCustomField.superclass.clear.call(this);
      this.ddlist.enable();
      this.setValue([]);
   }
   
});
inputEx.registerType("multiselectcustom", inputEx.MultiSelectCustomField);

}, '3.0.0a',{
  requires: ["inputex-pie-listcustom", "inputex-multiselect"]
})
