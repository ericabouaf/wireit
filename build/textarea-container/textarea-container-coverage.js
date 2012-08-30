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
_yuitest_coverage["build/textarea-container/textarea-container.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/textarea-container/textarea-container.js",
    code: []
};
_yuitest_coverage["build/textarea-container/textarea-container.js"].code=["YUI.add('textarea-container', function (Y, NAME) {","","/**"," * @module textarea-container"," */","","/**"," * Form container for a single textarea field which is resizeable. "," * Important: this class takes the exact same arguments as the FormContainer !"," * You still need to specify the \"fields\"."," * @class TextareaContainer"," * @extends FormContainer"," * @constructor"," * @param {Object}   options  Configuration object (see properties)"," */","","Y.TextareaContainer = Y.Base.create(\"textarea-container\", Y.Container, [], {","   ","   SERIALIZABLE_ATTRS: Y.Container.prototype.SERIALIZABLE_ATTRS.concat(['value'])","   ","   ","   /*","   ","   this.ddResize.on('eventResize', function (e, args) {","      var el = this.form.inputs[0].el;","      Y.one(el).setStyle(\"height\", (args[0][1]-48)+\"px\");","      Y.one(el).setStyle(el, \"width\", (args[0][0]-17)+\"px\");","   }, this, true);","*/","   ","}, {","   ","   ATTRS: {","      ","      /**","       * Value of the textarea","       * @attribute value","       */","      value: {","         getter: function () {","            return this.getStdModNode(Y.WidgetStdMod.BODY).one('textarea').get('value');","         },","         ","         setter: function (value) {","            this.set('bodyContent', '<textarea>'+value+'</textarea>');","         }","      },","      ","      /**","       * Keep to render the textarea","       * @attribute bodyContent","       */","      bodyContent: {","         value: '<textarea />'","      }","      ","   }","   ","});","","","","}, '@VERSION@', {\"requires\": [\"container\"]});"];
_yuitest_coverage["build/textarea-container/textarea-container.js"].lines = {"1":0,"17":0,"41":0,"45":0};
_yuitest_coverage["build/textarea-container/textarea-container.js"].functions = {"getter:40":0,"setter:44":0,"(anonymous 1):1":0};
_yuitest_coverage["build/textarea-container/textarea-container.js"].coveredLines = 4;
_yuitest_coverage["build/textarea-container/textarea-container.js"].coveredFunctions = 3;
_yuitest_coverline("build/textarea-container/textarea-container.js", 1);
YUI.add('textarea-container', function (Y, NAME) {

/**
 * @module textarea-container
 */

/**
 * Form container for a single textarea field which is resizeable. 
 * Important: this class takes the exact same arguments as the FormContainer !
 * You still need to specify the "fields".
 * @class TextareaContainer
 * @extends FormContainer
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 */

_yuitest_coverfunc("build/textarea-container/textarea-container.js", "(anonymous 1)", 1);
_yuitest_coverline("build/textarea-container/textarea-container.js", 17);
Y.TextareaContainer = Y.Base.create("textarea-container", Y.Container, [], {
   
   SERIALIZABLE_ATTRS: Y.Container.prototype.SERIALIZABLE_ATTRS.concat(['value'])
   
   
   /*
   
   this.ddResize.on('eventResize', function (e, args) {
      var el = this.form.inputs[0].el;
      Y.one(el).setStyle("height", (args[0][1]-48)+"px");
      Y.one(el).setStyle(el, "width", (args[0][0]-17)+"px");
   }, this, true);
*/
   
}, {
   
   ATTRS: {
      
      /**
       * Value of the textarea
       * @attribute value
       */
      value: {
         getter: function () {
            _yuitest_coverfunc("build/textarea-container/textarea-container.js", "getter", 40);
_yuitest_coverline("build/textarea-container/textarea-container.js", 41);
return this.getStdModNode(Y.WidgetStdMod.BODY).one('textarea').get('value');
         },
         
         setter: function (value) {
            _yuitest_coverfunc("build/textarea-container/textarea-container.js", "setter", 44);
_yuitest_coverline("build/textarea-container/textarea-container.js", 45);
this.set('bodyContent', '<textarea>'+value+'</textarea>');
         }
      },
      
      /**
       * Keep to render the textarea
       * @attribute bodyContent
       */
      bodyContent: {
         value: '<textarea />'
      }
      
   }
   
});



}, '@VERSION@', {"requires": ["container"]});
