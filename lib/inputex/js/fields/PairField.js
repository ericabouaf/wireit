(function() {
	
   var inputEx = YAHOO.inputEx;
	
/**
 * @class A meta field to put 2 fields on the same line
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>leftFieldOptions: the left field type definition object (same as groups)</li>
 *    <li>rightFieldOptions: the right field type definition object (same as groups)</li>
 * </ul>
 */
inputEx.PairField = function(options) {
   options.fields = [options.leftFieldOptions || {}, options.rightFieldOptions || {}];
   options.separators = [false, " : ", false];
   inputEx.PairField.superclass.constructor.call(this, options);
};
	
YAHOO.lang.extend( inputEx.PairField, inputEx.CombineField);
	
/**
 * Register this class as "pair" type
 */
inputEx.registerType("pair", inputEx.PairField);
	
})();