(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event;

/**
 * @class Create a select field from a datasource
 * @extends inputEx.SelectField
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>selectValues: contains the list of options values</li>
 *	   <li>selectOptions: list of option element texts</li>
 *    <li>multiple: boolean to allow multiple selections</li>
 *    <li>datasource: the datasource</li>
 *    <li>valueKey: value key</li>
 *    <li>labelKey: label key</li>
 * </ul>
 */
inputEx.DSSelectField = function(options) {
	inputEx.DSSelectField.superclass.constructor.call(this,options);
 };
YAHOO.lang.extend(inputEx.DSSelectField, inputEx.SelectField, 
/**
 * @scope inputEx.DSSelectField.prototype   
 */   
{
   /**
    * Setup the additional options for selectfield
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
	setOptions: function(options) {
	   // set this.options.selectValues and this.options.selectOptions
	   if (!YAHOO.lang.isArray(options.selectValues)) { options.selectValues = []; }
	   inputEx.DSSelectField.superclass.setOptions.call(this, options);
	   
	   this.options.valueKey = options.valueKey || "value";
	   this.options.labelKey = options.labelKey || "label";
	   
	   // Create a datasource from selectValues/selectOptions backward compatibility
	   this.options.datasource = options.datasource;
	   if(!this.options.datasource) {
         var items = [];
         for(var i = 0 ; i < this.options.selectValues.length ; i++) {
            items.push({
               value: this.options.selectValues[i],
               label: this.options.selectOptions[i]
            });
         }
         this.options.datasource = new YAHOO.util.DataSource(items);
         this.options.datasource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
         this.options.datasource.responseSchema = { fields: ["value","label"] };
      }
   },
   
   /**
    * Build a select tag with options
    */
   renderComponent: function() {

      this.el = inputEx.cn('select', {name: this.options.name || ''});
      
      if (this.options.multiple) {
         this.el.multiple = true; 
         this.el.size = this.options.selectValues.length;
      }
      
      this.fieldContainer.appendChild(this.el);
      
      // Send the data request
      this.sendDataRequest(null); // TODO: configurable default request ?
   }, 
   
   /**
    * Send the datasource request
    */
   sendDataRequest: function(oRequest) {
      if (!!this.options.datasource) {
         this.options.datasource.sendRequest(oRequest, {success: this.onDatasourceSuccess, failure: this.onDatasourceFailure, scope: this});
      }
   },
   
   /**
    * Insert the options
    */
   populateSelect: function(items) {
      this.el.innerHTML = "";
      this.optionEls = [];
      this.options.selectValues = [];
      this.options.selectOptions = [];

      for( var i = 0 ; i < items.length ; i++) {
         this.addOption({ value:items[i][this.options.valueKey], option:items[i][this.options.labelKey] });
      }
   },
   
   /**
    * Callback for request success 
    */
   onDatasourceSuccess: function(oRequest, oParsedResponse, oPayload) {
      this.populateSelect(oParsedResponse.results);
   },
   
   /**
    * Callback for request failure 
    */
   onDatasourceFailure: function(oRequest, oParsedResponse, oPayload) {
      // TODO
      this.el.innerHTML = "<option>error</option>";
   },
   
   
   /**
    * Set the value
    * @param {String} value The value to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      var index = 0;
      var option;
      for(var i = 0 ; i < this.options.datasource.liveData.length ; i++) {
         if(value === this.options.datasource.liveData[i][this.options.valueKey]) {
            option = this.el.childNodes[i];
		      option.selected = "selected";
         }
      }
      
		// Call Field.setValue to set class and fire updated event
		inputEx.DSSelectField.superclass.setValue.call(this,value, sendUpdatedEvt);
   },
   
   /**
    * Return the value
    * @return {Any} the selected value from the selectValues array
    */
   getValue: function() {
      return this.options.datasource.liveData[this.el.selectedIndex][this.options.valueKey];
   }
   
});

/**
 * Register this class as "dsselect" type
 */
inputEx.registerType("dsselect", inputEx.DSSelectField);

})();