(function() {
   
   var inputEx = YAHOO.inputEx, Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;
   
/**
 * @class Create a Dialog from an inputEx field definition
 * @constructor
 * @param {Object} options Config object, options are :
 * <ul>
 *   <li>inputExDef: an inputEx type definition (ex: {type: 'form', inputParams: {fields: [...]}})</li>
 *   <li>id: an optional id for the dialog</li>
 *   <li>parentEl: optional parentEl (default document.body)</li>
 *   <li>title: the dialog title</li>
 *   <li>panelConfig: the YAHOO.widget.Panel userConfig object</li>
 * </ul>
 */
inputEx.widget.Dialog = function(options) {

   // options
   this._inputExOptions = {};
   this._inputExOptions.id = options.id || Dom.generateId();
   this._inputExOptions.parentEl = options.parentEl || document.body;
   this._inputExOptions.title = options.title || 'Please fill in the form';
   this._inputExOptions.panelConfig = options.panelConfig || {
		constraintoviewport: true, 
		underlay:"shadow", 
		close:true, 
		fixedcenter: true,
		visible:false, 
		draggable:true
	};
	this._inputExOptions.inputExDef = options.inputExDef;

   inputEx.widget.Dialog.superclass.constructor.call(this, this._inputExOptions.id, this._inputExOptions.panelConfig);
   
   // Generate an id for a div inside the panel body
   this._inputExBodyId = Dom.generateId();
   
	this.setHeader(this._inputExOptions.title);
	this.setBody("<div id='"+this._inputExBodyId+"'></div>");
	
	Event.onAvailable(this._inputExBodyId, this.buildForm, this, true);
	
	this.render(this._inputExOptions.parentEl);
};

YAHOO.lang.extend(inputEx.widget.Dialog, YAHOO.widget.Panel, 
/**
 * @scope inputEx.widget.Dialog
 */
{
   /**
    * render the inputExDef as a inputEx field
    */
   buildForm: function() {
      this._inputExOptions.inputExDef.inputParams.parentEl = this._inputExBodyId;
      this._inputExFieldInstance = inputEx(this._inputExOptions.inputExDef);
      this._inputExFieldInstance._inputExDialog = this;
      this.center();
   },
   
   /**
    * Return the inputEx field instance created
    * @return {inputEx.Field} the field instance
    */
   getForm: function() {
      return this._inputExFieldInstance;
   },
   
   /**
    * Shortcut to get value
    * @return {Any} the field value
    */
   getValue: function() {
      return this.getForm().getValue();
   },
   
   
   /**
    * Shortcut to set value
    * @param {Any} value The value to set on the field
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      this.getForm().setValue(value, sendUpdatedEvt);
   }
   
});
   
})();