(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event;

/**
 * @class Create a file input
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 * </ul>
 */
inputEx.FileField = function(options) {
	inputEx.FileField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FileField, inputEx.Field, 
/**
 * @scope inputEx.FileField.prototype   
 */   
{
   /**
    * Render an 'INPUT' DOM node
    */
   renderComponent: function() {
      
      // Attributes of the input field
      var attributes = {};
      attributes.id = this.divEl.id?this.divEl.id+'-field':YAHOO.util.Dom.generateId();
      attributes.type = "file";
      if(this.options.name) attributes.name = this.options.name;
   
      // Create the node
      this.el = inputEx.cn('input', attributes);
      
      // Append it to the main element
      this.fieldContainer.appendChild(this.el);
   }

});

/**
 * Register this class as "file" type
 */
inputEx.registerType("file", inputEx.FileField);

})();