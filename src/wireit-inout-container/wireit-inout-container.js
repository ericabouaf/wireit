/*global YUI */

YUI.add("wireit-inout-container", function(Y){

/**
 * Container with left inputs and right outputs
 * @class InOutContainer
 * @extends Y.WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
Y.WireIt.InOutContainer = function(options, layer) {
   Y.WireIt.InOutContainer.superclass.constructor.call(this, options, layer);
};

Y.extend(Y.WireIt.InOutContainer, Y.WireIt.Container, {

	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.ImageContainer"
    * @type String
    */
   xtype: "Y.WireIt.InOutContainer",   

	/** 
    * @property resizable
    * @description boolean that makes the container resizable
    * @default false
    * @type Boolean
    */
	resizable: false,

	/** 
    * @property className
    * @description CSS class name for the container element
    * @default "WireIt-Container WireIt-ImageContainer"
    * @type String
    */
	className: "WireIt-Container WireIt-InOutContainer",


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
   outputs: [],

   
	/**
	 * @method render
	 */
   render: function() {
      Y.WireIt.InOutContainer.superclass.render.call(this);

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
		
   }
   
});

}, '0.7.0',{
  requires: ['wireit-container']
});
