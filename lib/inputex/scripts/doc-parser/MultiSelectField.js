(function() {

/**
 * Create a multi select field
 * @class inputEx.MultiSelectField
 * @extends inputEx.SelectField
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>selectValues: contains the list of options values</li>
 *	   <li>selectOptions: list of option element texts</li>
 * </ul>
 */
inputEx.MultiSelectField = function(options) {
	inputEx.MultiSelectField.superclass.constructor.call(this,options);
 };
YAHOO.lang.extend(inputEx.MultiSelectField, inputEx.SelectField,{
   
   /**
    * Build the DDList
    */
   renderComponent: function() {
      inputEx.MultiSelectField.superclass.renderComponent.call(this);
      
      this.ddlist = new inputEx.widget.DDList({parentEl: this.fieldContainer});
   },  
   
   /**
    * Register the "change" event
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.el,"change", this.onAddNewItem, this, true);
      this.ddlist.itemRemovedEvt.subscribe(this.onItemRemoved, this, true);
      this.ddlist.listReorderedEvt.subscribe(this.fireUpdatedEvt, this, true);
   },
   
   /**
    * Re-enable the option element when an item is removed by the user
    */
   onItemRemoved: function(e,params) {
      var itemValue = params[0];
      var index = inputEx.indexOf(itemValue, this.options.selectValues);
      this.el.childNodes[index].disabled = false;
      this.fireUpdatedEvt();
   },
   
   /**
    * Add an item to the list when the select changed
    */
   onAddNewItem: function() {
      if(this.el.selectedIndex !== 0) {
         
         // Add the value to the ddlist
         this.ddlist.addItem({value: this.options.selectValues[this.el.selectedIndex], label: this.options.selectOptions[this.el.selectedIndex]});
         
         // mark option disabled
         this.el.childNodes[this.el.selectedIndex].disabled = true;
      
         // Return to the first Element
         this.el.selectedIndex = 0;
         
         this.fireUpdatedEvt();
      }
   },
   
   /**
    * Set the value of the list
    * @param {String} value The value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      
      var i, length, index, label, ddlistValue = [];
      
      if (!YAHOO.lang.isArray(value)) { return; }
      
      // Re-enable all options
      for(i = 0, length=this.el.childNodes.length ; i < length ; i++) {
         this.el.childNodes[i].disabled = false;
      }
      
      // disable selected options and fill ddlist value
      for(i = 0, length=value.length ; i < length ; i++) {
         
         index = inputEx.indexOf(value[i], this.options.selectValues);
         label = this.options.selectOptions[index];
         ddlistValue.push({value: value[i], label: label});
         
         this.el.childNodes[index].disabled = true;
      }
      
      // set ddlist value
      this.ddlist.setValue(ddlistValue);
      
	   
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
   },
   
   /**
    * Return the value
    * @return {Any} the selected value from the selectValues array
    */
   getValue: function() {
      return this.ddlist.getValue();
   }
   
});

// Register this class as "multiselect" type
inputEx.registerType("multiselect", inputEx.MultiSelectField);

})();