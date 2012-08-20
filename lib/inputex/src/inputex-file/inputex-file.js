/**
 * @module inputex-file
 */
YUI.add("inputex-file", function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * Create a file input
 * @class inputEx.FileField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 * </ul>
 */
inputEx.FileField = function(options) {
	inputEx.FileField.superclass.constructor.call(this,options);
};
inputEx.FileField._id_count = 0;
Y.extend(inputEx.FileField, inputEx.Field, {
	
   /**
    * Adds size and accept options
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
		inputEx.FileField.superclass.setOptions.call(this, options);
		this.options.size = options.size;
		this.options.accept = options.accept;
	},
	
   /**
    * Render an 'INPUT' DOM node
    * @method renderComponent
    */
   renderComponent: function() {
      
      // Attributes of the input field
      var attributes = {};
      attributes.id = this.divEl.id?this.divEl.id+'-field': ("_inputex_fileid"+(inputEx.FileField._id_count++));
      attributes.type = "file";
      if(this.options.name) attributes.name = this.options.name;
   	if(this.options.size) attributes.size = this.options.size;
   	if(this.options.accept) attributes.accept = this.options.accept;

      // Create the node
      this.el = inputEx.cn('input', attributes);
      
      // Append it to the main element
      this.fieldContainer.appendChild(this.el);
   }

});

// Register this class as "file" type
inputEx.registerType("file", inputEx.FileField);


}, '3.1.0',{
requires: ['inputex-field']
});
