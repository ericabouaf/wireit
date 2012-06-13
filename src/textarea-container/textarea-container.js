/**
 * @module textarea-container
 */
YUI.add("textarea-container", function(Y){

/**
 * Form container for a single textarea field which is resizeable. 
 * Important: this class takes the exact same arguments as the FormContainer !
 * You still need to specify the "fields".
 * @class Y.WireTextareaContainer
 * @extends WireFormContainer
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 * @param {Layer}   layer The Y.Layer (or subclass) instance that contains this container
 */

Y.TextareaContainer = Y.Base.create("textarea-container", Y.Container, [], {
	
	
	
	/**
	 * @method renderUI
	 */
	/*renderUI: function() {
		Y.TextareaContainer.superclass.renderUI.call(this);
		this._renderTextarea();
	},
	
	
	_renderTextarea: function() {
		
		
	},*/
	
	SERIALIZABLE_ATTRS: Y.Container.prototype.SERIALIZABLE_ATTRS.concat(['value'])
	
	
	/*
	
   this.ddResize.on('eventResize', function(e, args) {
		var el = this.form.inputs[0].el;
      Y.one(el).setStyle("height", (args[0][1]-48)+"px");
      Y.one(el).setStyle(el, "width", (args[0][0]-17)+"px");
   }, this, true);
*/
	
}, {
	
	ATTRS: {
		
		value: {
			getter: function() {
				return this.getStdModNode(Y.WidgetStdMod.BODY).one('textarea').get('value');
			},
			
			setter: function(value) {
				this.set('bodyContent', '<textarea>'+value+'</textarea>')
			}
		},
		
		/**
		 * Keep to render the textarea
		 * @attribute bodyContent
		 */
		bodyContent: {
			value: '<textarea />'
		},
		
		
		resizable: {
			value: false
		}
	}
	
});


}, '3.5.1', { requires: ['container']} );
