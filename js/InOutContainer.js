/**
 * Container with left inputs and right outputs
 * @class InOutContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.InOutContainer = function(options, layer) {
   WireIt.InOutContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.InOutContainer, WireIt.Container, {
   
   /**
    * @method setOptions
    * @param {Object} options the options object
    */
   setOptions: function(options) {
      WireIt.InOutContainer.superclass.setOptions.call(this, options);
      
      this.options.xtype = "WireIt.InOutContainer";
      
      this.options.className = options.className || "WireIt-Container WireIt-InOutContainer";
      
      // Overwrite default value for options:
      this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;

		this.options.inputs = options.inputs || [];
		this.options.outputs = options.outputs || [];

   },
   
   render: function() {
      WireIt.InOutContainer.superclass.render.call(this);

		for(var i = 0 ; i < this.options.inputs.length ; i++) {
			var input = this.options.inputs[i];
			this.options.terminals.push({
				"name": input, 
				"direction": [-1,0], 
				"offsetPosition": {"left": -14, "top": 3+30*(i+1) }, 
				"ddConfig": {
             	"type": "input",
             	"allowedTypes": ["output"]
          	}
 			});
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px"}, input));
		}
		
		for(i = 0 ; i < this.options.outputs.length ; i++) {
			var output = this.options.outputs[i];
			this.options.terminals.push({
				"name": output, 
				"direction": [1,0], 
				"offsetPosition": {"right": -14, "top": 3+30*(i+1+this.options.inputs.length) }, 
				"ddConfig": {
             "type": "output",
             "allowedTypes": ["input"]
          	},
				"alwaysSrc": true
			});
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px", textAlign: "right"}, output));
		}
		
   }
   
});