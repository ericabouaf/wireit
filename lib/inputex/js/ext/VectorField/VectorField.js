(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class A field limited to number inputs (floating)
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.VectorField = function(options) {
   inputEx.VectorField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.VectorField, inputEx.CombineField, 
/**
 * @scope inputEx.VectorField.prototype   
 */
{  
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

/**
 * Register this class as "2Dvector" type
 */
inputEx.registerType("vector", inputEx.VectorField);

})();