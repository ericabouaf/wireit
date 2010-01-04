/**
 * Display a selectors for keys and auto-update the value field
 * @class inputEx.KeyValueField
 * @constructor
 * @extends inputEx.CombineField
 * @param {Object} searchFormDef InputEx definition object
 */
inputEx.KeyValueField = function(searchFormDef) {
   
   this.nameIndex = {};
   var fieldNames = [], fieldLabels = [];
   for(var i = 0 ; i < searchFormDef.fields.length ; i++) {
      var field =  searchFormDef.fields[i];
      this.nameIndex[field.inputParams.name] = field;
      fieldNames.push(field.inputParams.name);
		fieldLabels.push(field.inputParams.label || field.inputParams.name);
   }
   
   var opts = {
      fields: [
         {type: 'select', inputParams: { selectValues: fieldNames, selectOptions: fieldLabels } },
         searchFormDef.fields[0]
      ],
		parentEl: searchFormDef.parentEl
   };
   
   inputEx.KeyValueField.superclass.constructor.call(this, opts);
};

YAHOO.lang.extend( inputEx.KeyValueField, inputEx.CombineField, {
   
   /**
    * Subscribe the updatedEvt on the key selector
    */
   initEvents: function() {
      inputEx.KeyValueField.superclass.initEvents.call(this);

      this.inputs[0].updatedEvt.subscribe(this.onSelectFieldChange, this, true); 
   },
   
   /**
    * Rebuild the value field
    */
   onSelectFieldChange: function(e, params) {
      var value = params[0];
      var f = this.nameIndex[value];
      var lastInput = this.inputs[this.inputs.length-1];
      var next = this.divEl.childNodes[inputEx.indexOf(lastInput.getEl(), this.divEl.childNodes)+1];
      lastInput.destroy();
      this.inputs.pop();
      var field = this.renderField(f);
      var fieldEl = field.getEl();
   	YAHOO.util.Dom.setStyle(fieldEl, 'float', 'left');
	   
   	this.divEl.insertBefore(fieldEl, next);
   }
   
});

inputEx.registerType("keyvalue", inputEx.KeyValueField, {});

