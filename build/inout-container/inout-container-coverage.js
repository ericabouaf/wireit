if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/inout-container/inout-container.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/inout-container/inout-container.js",
    code: []
};
_yuitest_coverage["build/inout-container/inout-container.js"].code=["YUI.add('inout-container', function (Y, NAME) {","","/**"," * @module inout-container"," */","","/**"," * Container with left inputs and right outputs"," * @class InOutContainer"," * @extends Container"," * @constructor"," * @param {Object} options"," * @param {Layer} layer"," */","","Y.InOutContainer = Y.Base.create(\"inout-container\", Y.Container, [], {","","   /**","    * @method renderUI","    */","   renderUI: function () {","      Y.InOutContainer.superclass.renderUI.call(this);","      this._renderInputsOutputs();","   },","   ","   /**","    * @method _renderInputsOutputs","    */","   _renderInputsOutputs: function () {","      ","      var that = this;","      Y.on('available', function () {","         ","         /*","            for(var i = 0 ; i < this.inputs.length ; i++) {","               var input = this.inputs[i];","               this.addTerminal({","                  \"name\": input, ","                  \"direction\": [-1,0], ","                  \"offsetPosition\": {\"left\": -14, \"top\": 3+30*(i+1) }, ","                  \"ddConfig\": {","                     \"type\": \"input\",","                     \"allowedTypes\": [\"output\"]","                  }","               });","               this.bodyEl.appendChild(Y.WireIt.cn('div', null, {lineHeight: \"30px\"}, input));","            }","","            for(i = 0 ; i < this.outputs.length ; i++) {","               var output = this.outputs[i];","               this.addTerminal({","                  \"name\": output, ","                  \"direction\": [1,0], ","                  \"offsetPosition\": {\"right\": -14, \"top\": 3+30*(i+1+this.inputs.length) }, ","                  \"ddConfig\": {","                     \"type\": \"output\",","                     \"allowedTypes\": [\"input\"]","                  },","                  \"alwaysSrc\": true","               });","               this.bodyEl.appendChild(Y.WireIt.cn('div', null, {lineHeight: \"30px\", textAlign: \"right\"}, output));","            }","            */","         ","         ","      }, '#body-container');","      ","   }","   ","}, {","","   ATTRS: {","      ","      ","      /**","       * Keep to render the form","       * @attribute bodyContent","       */","      bodyContent: {","         value: '<div id=\"body-container\" />'","      },","      ","      /**","       * @attribute inputs","       * @description Array of strings for which an Input terminal will be created.","       * @default []","       * @type Array","       */","      inputs: [],","","      /**","       * @attribute outputs","       * @description Array of strings for which an Output terminal will be created.","       * @default []","       * @type Array","       */","      outputs: []","   }","   ","});","","","}, '@VERSION@', {\"requires\": [\"container\"]});"];
_yuitest_coverage["build/inout-container/inout-container.js"].lines = {"1":0,"16":0,"22":0,"23":0,"31":0,"32":0};
_yuitest_coverage["build/inout-container/inout-container.js"].functions = {"renderUI:21":0,"_renderInputsOutputs:29":0,"(anonymous 1):1":0};
_yuitest_coverage["build/inout-container/inout-container.js"].coveredLines = 6;
_yuitest_coverage["build/inout-container/inout-container.js"].coveredFunctions = 3;
_yuitest_coverline("build/inout-container/inout-container.js", 1);
YUI.add('inout-container', function (Y, NAME) {

/**
 * @module inout-container
 */

/**
 * Container with left inputs and right outputs
 * @class InOutContainer
 * @extends Container
 * @constructor
 * @param {Object} options
 * @param {Layer} layer
 */

_yuitest_coverfunc("build/inout-container/inout-container.js", "(anonymous 1)", 1);
_yuitest_coverline("build/inout-container/inout-container.js", 16);
Y.InOutContainer = Y.Base.create("inout-container", Y.Container, [], {

   /**
    * @method renderUI
    */
   renderUI: function () {
      _yuitest_coverfunc("build/inout-container/inout-container.js", "renderUI", 21);
_yuitest_coverline("build/inout-container/inout-container.js", 22);
Y.InOutContainer.superclass.renderUI.call(this);
      _yuitest_coverline("build/inout-container/inout-container.js", 23);
this._renderInputsOutputs();
   },
   
   /**
    * @method _renderInputsOutputs
    */
   _renderInputsOutputs: function () {
      
      _yuitest_coverfunc("build/inout-container/inout-container.js", "_renderInputsOutputs", 29);
_yuitest_coverline("build/inout-container/inout-container.js", 31);
var that = this;
      _yuitest_coverline("build/inout-container/inout-container.js", 32);
Y.on('available', function () {
         
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
       * @attribute bodyContent
       */
      bodyContent: {
         value: '<div id="body-container" />'
      },
      
      /**
       * @attribute inputs
       * @description Array of strings for which an Input terminal will be created.
       * @default []
       * @type Array
       */
      inputs: [],

      /**
       * @attribute outputs
       * @description Array of strings for which an Output terminal will be created.
       * @default []
       * @type Array
       */
      outputs: []
   }
   
});


}, '@VERSION@', {"requires": ["container"]});
