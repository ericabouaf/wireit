(function() {

/**
 * A field limited to number inputs (floating)
 * @class inputEx.VectorField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.VectorField = function(options) {
   inputEx.VectorField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.VectorField, inputEx.CombineField, {  
   /**
    * Additional options for VectorField (dimension, size)
    */ 
   setOptions: function(options) {
      inputEx.VectorField.superclass.setOptions.call(this, options);
     
      this.options.dimension = options.dimension || 2;
      this.options.size = options.size || 3;
     
      this.options.fields = [];
      for(var i = 0 ; i < this.options.dimension ; i++) {
         this.options.fields.push({type: 'number', inputParams: {size: this.options.size} });
      }
   }
});

// Register this class as "2Dvector" type
inputEx.registerType("vector", inputEx.VectorField, [
   { type: 'integer', inputParams: { label: 'Dimension', name:'dimension', value: 2}},
   { type: 'integer', inputParams: { label: 'Size', name:'size', value: 3}},
   { type: 'list', inputParams: {name: 'separators', label: 'Separators', required: true } }
]);

})();