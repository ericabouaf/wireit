/**
 * Include the form library inputEx + WirableField + FormContainer<br />
 * <br />
 * <b>WARNING</b>: The "WirableField.js" file MUST be loaded AFTER "inputEx/field.js" and BEFORE all other inputEx fields !<br />
 * <br />
 * See the inputEx website for documentation of the fields & forms: <a href='http://neyric.github.com/inputex'>http://neyric.github.com/inputex</a><br />
 *
 * @module inputex-plugin
 */
/**
 * Class used to build a container with inputEx forms
 * @class FormContainer
 * @namespace WireIt
 * @extends Y.WireIt.Container
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 * @param {WireIt.Layer}   layer The Y.WireIt.Layer (or subclass) instance that contains this container
 */
Y.WireIt.FormContainer = function(options, layer) {
   Y.WireIt.FormContainer.superclass.constructor.call(this, options, layer);
};

Y.extend(Y.WireIt.FormContainer, Y.WireIt.Container, {
	
	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.FormContainer"
    * @type String
    */
   xtype: "Y.WireIt.FormContainer", 

	/** 
    * @property fields
    * @description List of inputEx field definitions
    * @default []
    * @type Array
    */
   fields: [],

	/** 
    * @property legend
    * @description Legend
    * @default null
    * @type String
    */
   legend: null,

	/** 
    * @property collapsible
    * @description Collapsible
    * @default false
    * @type Boolean
    */
	collapsible: false,
   
   /**
    * The render method is overrided to call renderForm
    * @method render
    */
   render: function() {
      Y.WireIt.FormContainer.superclass.render.call(this);
      this.renderForm();
   },
   
   /**
    * Render the form
    * @method renderForm
    */
   renderForm: function() {
	
      var groupParams = {parentEl: this.bodyEl, fields: this.fields, legend: this.legend, collapsible: this.collapsible};
      this.form = new Y.inputEx.Group(groupParams);
		  this.form.setContainer(this);

			for(var i = 0 ; i < this.form.inputs.length ; i++) {
				var field = this.form.inputs[i];
				field.setContainer(this);
			}


		// Redraw all wires when the form is collapsed
		if(this.form.legend) {
			Y.one(this.form.legend).on('click', function() {
				
				// Override the getXY method on field terminals:
				var that = this;
				for(var i = 0 ; i < this.form.inputs.length ; i++) {
					var field = this.form.inputs[i];
					if(field.terminal) {
						field.terminal.getXY = function() {
							if( Y.one(that.form.fieldset).hasClass("inputEx-Collapsed") ) {
								return that.getXY();
							}
							else {
								return Y.WireIt.Terminal.prototype.getXY.call(this);
							}
							
						};
					}
				}
				
				this.redrawAllWires();
			}, this, true);
		}
   },
   
   /**
    * @method getValue
    */
   getValue: function() {
      return this.form.getValue();
   },
   
   /**
    * @method setValue
    */
   setValue: function(val) {
      this.form.setValue(val);
   }
});
