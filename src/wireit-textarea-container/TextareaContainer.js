/**
 * Form container for a single textarea field which is resizeable. 
 * Important: this class takes the exact same arguments as the FormContainer !
 * You still need to specify the "fields".
 * @class Y.WireIt.TextareaContainer
 * @extends Y.WireIt.FormContainer
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 * @param {WireIt.Layer}   layer The Y.WireIt.Layer (or subclass) instance that contains this container
 */
Y.WireIt.TextareaContainer = function(options, layer) {
         
   Y.WireIt.TextareaContainer.superclass.constructor.call(this, options, layer);
   
   this.ddResize.on('eventResize', function(e, args) {
		var el = this.form.inputs[0].el;
      Y.one(el).setStyle("height", (args[0][1]-48)+"px");
      Y.one(el).setStyle(el, "width", (args[0][0]-17)+"px");
   }, this, true);
};

Y.extend(Y.WireIt.TextareaContainer, Y.WireIt.FormContainer, {

});