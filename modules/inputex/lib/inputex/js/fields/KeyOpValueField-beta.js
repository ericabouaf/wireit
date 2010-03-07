/**
 * Add an SQL operator select field in the middle of a KeyValueField
 * @class inputEx.KeyOpValueField
 * @constructor
 * @extend inputEx.KeyValueField
 * @param {Object} options InputEx definition object with the "availableFields"
 */
inputEx.KeyOpValueField = function(options) {
   inputEx.KeyValueField.superclass.constructor.call(this, options);
};
YAHOO.lang.extend( inputEx.KeyOpValueField, inputEx.KeyValueField, {
	
	/**
	 * Setup the options.fields from the availableFields option
	 */
	setOptions: function(options) {
		
		var selectFieldConfig = this.generateSelectConfig(options.availableFields);
		
		var newOptions = {
			fields: [
				selectFieldConfig,
				{type: 'select', selectValues: options.operators || ["=", ">", "<", ">=", "<=", "!=", "LIKE", "NOT LIKE", "IS NULL", "IS NOT NULL"] },
				this.nameIndex[options.availableFields[0].name]
			]
		};
		
		if(options.operatorLabels) {
			newOptions.fields[1].selectOptions = options.operatorLabels;
		}
		
		YAHOO.lang.augmentObject(newOptions, options);
		
		inputEx.KeyValueField.superclass.setOptions.call(this, newOptions);
	}
	
});

inputEx.registerType("keyopvalue", inputEx.KeyOpValueField, {});
