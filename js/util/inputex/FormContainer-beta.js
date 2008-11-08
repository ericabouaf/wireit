   
/**
 * @class Class used to build a container with inputEx forms
 * @extends WireIt.Container
 * @constructor
 * @param {Object}   config      Configuration object (see properties)
 * @param {WireIt.Layer}   layer The WireIt.Layer (or subclass) instance that contains this container
 */
WireIt.FormContainer = function(config, layer) {
   WireIt.FormContainer.superclass.constructor.call(this, config, layer);
};

YAHOO.lang.extend(WireIt.FormContainer, WireIt.Container, 
/**
 * @scope WireIt.FormContainer
 */
{
   render: function() {
      WireIt.FormContainer.superclass.render.call(this);
      this.renderForm();
   },
   
   renderForm: function() {
      for(var i = 0 ; i < this.config.fields.length ; i++) {
         this.config.fields[i].inputParams.container = this;
      }
      var groupParams = {parentEl: this.bodyEl, fields: this.config.fields, legend: this.config.legend};
      this.form = new YAHOO.inputEx.Group(groupParams);
   }
   
});

