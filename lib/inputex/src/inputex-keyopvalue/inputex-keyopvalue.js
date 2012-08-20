/**
 * @module inputex-keyopvalue
 */
YUI.add("inputex-keyopvalue",function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx;


/**
 * Add an SQL operator select field in the middle of a KeyValueField
 * @class inputEx.KeyOpValueField
 * @constructor
 * @extends inputEx.KeyValueField
 * @param {Object} options InputEx definition object with the "availableFields"
 */
inputEx.KeyOpValueField = function (options) {
   inputEx.KeyOpValueField.superclass.constructor.call(this, options);
};

Y.extend(inputEx.KeyOpValueField, inputEx.KeyValueField, {
	
	/**
	 * Setup the options.fields from the availableFields option
	 * @method setOptions
	 */
	setOptions: function (options) {
		
		var selectFieldConfig, operators, labels, selectOptions, newOptions, i, length;
		
		selectFieldConfig = this.generateSelectConfig(options.availableFields);
		
		operators = options.operators || ["=", ">", "<", ">=", "<=", "!=", "LIKE", "NOT LIKE", "IS NULL", "IS NOT NULL"];
		labels = options.operatorLabels || operators;
		
		selectOptions = [];
		
		for (i = 0, length = operators.length; i < length; i += 1) {
			selectOptions.push({ value: operators[i], label: labels[i] });
		}
		
		newOptions = {
			fields: [
				selectFieldConfig,
				{type: 'select', choices: selectOptions},
				this.nameIndex[options.availableFields[0].name]
			]
		};
		
		Y.mix(newOptions, options);
		
		inputEx.KeyValueField.superclass.setOptions.call(this, newOptions);
	}
	
});

inputEx.registerType("keyopvalue", inputEx.KeyOpValueField, {});

},'3.1.0',{
  requires: ['inputex-keyvalue']
});
