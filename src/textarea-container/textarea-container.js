/**
 * @module textarea-container
 */

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
Y.WireTextareaContainer = function(options, layer) {
         
   Y.WireTextareaContainer.superclass.constructor.call(this, options, layer);
   
   this.ddResize.on('eventResize', function(e, args) {
		var el = this.form.inputs[0].el;
      Y.one(el).setStyle("height", (args[0][1]-48)+"px");
      Y.one(el).setStyle(el, "width", (args[0][0]-17)+"px");
   }, this, true);
};

Y.extend(Y.WireTextareaContainer, Y.WireFormContainer, {

});