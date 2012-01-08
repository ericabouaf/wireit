YUI.add("inout-container", function(Y){

/**
 * Container with left inputs and right outputs
 * @class InOutContainer
 * @extends Y.WireContainer
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */

var InOutContainer = Y.Base.create("inout-container", Y.Container, [], {

	renderUI: function() {
		InOutContainer.superclass.renderUI.call(this);
		this._renderInputsOutputs();
	},
	
	_renderInputsOutputs: function() {
		
		var that = this;
		Y.on('available', function() {
			
			/*
				for(var i = 0 ; i < this.inputs.length ; i++) {
					var input = this.inputs[i];
					this.addTerminal({
						"name": input, 
						"direction": [-1,0], 
						"offsetPosition": {"left": -14, "top": 3+30*(i+1) }, 
						"ddConfig": {
							"type": "input",
							"allowedTypes": ["output"]
						}
					});
					this.bodyEl.appendChild(Y.WireIt.cn('div', null, {lineHeight: "30px"}, input));
				}

				for(i = 0 ; i < this.outputs.length ; i++) {
					var output = this.outputs[i];
					this.addTerminal({
						"name": output, 
						"direction": [1,0], 
						"offsetPosition": {"right": -14, "top": 3+30*(i+1+this.inputs.length) }, 
						"ddConfig": {
							"type": "output",
							"allowedTypes": ["input"]
						},
						"alwaysSrc": true
					});
					this.bodyEl.appendChild(Y.WireIt.cn('div', null, {lineHeight: "30px", textAlign: "right"}, output));
				}
				*/
			
			
		}, '#body-container');
		
	}
	
}, {

	ATTRS: {
		
		
		/**
		 * Keep to render the form
		 */
		bodyContent: {
			value: '<div id="body-container" />'
		},
		
		/**
		 * @property inputs
		 * @description Array of strings for which an Input terminal will be created.
		 * @default []
		 * @type Array
		 */
		inputs: [],

		/**
		 * @property outputs
		 * @description Array of strings for which an Output terminal will be created.
		 * @default []
		 * @type Array
		 */
	   outputs: []
	}
	
});

Y.InOutContainer = InOutContainer;



}, '0.7.0',{
  requires: ['container']
});
