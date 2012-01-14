YUI.add('form-container', function(Y) {

/**
 * Include the form library inputEx + WirableField + FormContainer<br />
 * <br />
 * <b>WARNING</b>: The "WirableField.js" file MUST be loaded AFTER "inputEx/field.js" and BEFORE all other inputEx fields !<br />
 * <br />
 * See the inputEx website for documentation of the fields & forms: <a href='http://neyric.github.com/inputex'>http://neyric.github.com/inputex</a><br />
 *
 * Class used to build a container with inputEx forms
 * @class FormContainer
 * @extends Container
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 * @param {Layer}   layer The Y.Layer (or subclass) instance that contains this container
 */
var FormContainer = Y.Base.create("form-container", Y.Container, [], {

	renderUI: function() {
		FormContainer.superclass.renderUI.call(this);
		this._renderForm();
	},
	
	/**
	 * @method _renderForm
	 * Render the form in the widget body
	 */
	_renderForm: function() {
		
		var that = this;
		Y.on('available', function() {
			
			//var n = that.get('contentBox').one('.inputex-container')
			
			that.form = new Y.inputEx.Group({
			    parentEl: 'inputex-container',
			    fields: that.get('fields')
			});
			
			that.alignTerminals();
			
		}, '#inputex-container');
		
	}
	
}, {

	ATTRS: {
		
		/**
		 * Value of the form
		 * @attribute form
		 */
		form: {
			setter: function(val) {
				if(this.form) {
					return this.form.setValue(val);
				}
			},
			getter: function() {
				if(this.form) {
					return this.form.getValue();
				}
				else {
					return {};
				}
			}
		},
		
		/**
		 * Keep to render the form
		 * @attribute bodyContent
		 */
		bodyContent: {
			value: '<div id="inputex-container" />'
		},
		
		fields: {
			value: []
		},
		
		resizable: {
			value: false
		}
		
	}

});

Y.FormContainer = FormContainer;


	/** 
    * @property legend
    * @description Legend
    * @default null
    * @type String
    */
   //legend: null,

	/** 
    * @property collapsible
    * @description Collapsible
    * @default false
    * @type Boolean
    */
	//collapsible: false,
   
   /**
    * Render the form
    * @method renderForm
    */
   /*renderForm: function() {
	
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
								return Y.Terminal.prototype.getXY.call(this);
							}
							
						};
					}
				}
				
				this.redrawAllWires();
			}, this, true);
		}
   },*/
   
//});

}, '3.5.0pr1', {requires: ['container','inputex-group','inputex-string']});
