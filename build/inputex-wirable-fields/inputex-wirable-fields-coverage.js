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
_yuitest_coverage["build/inputex-wirable-fields/inputex-wirable-fields.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/inputex-wirable-fields/inputex-wirable-fields.js",
    code: []
};
_yuitest_coverage["build/inputex-wirable-fields/inputex-wirable-fields.js"].code=["YUI.add('inputex-wirable-fields', function (Y, NAME) {","","   ","   var inputEx = Y.inputEx;","   ","// this file ovveride many functions on inputEx fields to make them wirable","","/**"," * setFieldName might change the name of the terminal"," */","inputEx.StringField.prototype.setFieldName = function (name) {","   this.el.name = name;","   if(this.terminal) {","      this.terminal.set('name', name);","      // TODO: this.terminal.el.title = name;","   }","};","","","/**"," * Groups must set the container recursively"," */","inputEx.Group.prototype.setContainer = function (container) {","   ","   inputEx.Group.superclass.setContainer.call(this, container);","   ","   // Group and inherited fields must set this recursively","   if(this.inputs) {","      for(var i = 0 ; i < this.inputs.length ; i++) {","         this.inputs[i].setContainer(container);","      }","   }","   ","};","","","/**"," * List must set the container recursively"," */","inputEx.ListField.prototype.setContainer = function (container) {","   ","   inputEx.ListField.superclass.setContainer.call(this, container);","","   if(this.subFields) {","      for(var i = 0 ; i < this.subFields.length ; i++) {","         this.subFields[i].setContainer(container);","      }","   }","   ","};","","/**"," * setContainer must be called on each new element"," */","inputEx.ListField.prototype._addElement = inputEx.ListField.prototype.addElement;","inputEx.ListField.prototype.addElement = function (value) {","   var f = this._addElement(value);","   f.setContainer(this.options.container);","   return f;","};","","","","}, '@VERSION@', {\"requires\": [\"inputex-wirable\", \"inputex-group\", \"inputex-string\", \"inputex-list\"]});"];
_yuitest_coverage["build/inputex-wirable-fields/inputex-wirable-fields.js"].lines = {"1":0,"4":0,"11":0,"12":0,"13":0,"14":0,"23":0,"25":0,"28":0,"29":0,"30":0,"40":0,"42":0,"44":0,"45":0,"46":0,"55":0,"56":0,"57":0,"58":0,"59":0};
_yuitest_coverage["build/inputex-wirable-fields/inputex-wirable-fields.js"].functions = {"setFieldName:11":0,"setContainer:23":0,"setContainer:40":0,"addElement:56":0,"(anonymous 1):1":0};
_yuitest_coverage["build/inputex-wirable-fields/inputex-wirable-fields.js"].coveredLines = 21;
_yuitest_coverage["build/inputex-wirable-fields/inputex-wirable-fields.js"].coveredFunctions = 5;
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 1);
YUI.add('inputex-wirable-fields', function (Y, NAME) {

   
   _yuitest_coverfunc("build/inputex-wirable-fields/inputex-wirable-fields.js", "(anonymous 1)", 1);
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 4);
var inputEx = Y.inputEx;
   
// this file ovveride many functions on inputEx fields to make them wirable

/**
 * setFieldName might change the name of the terminal
 */
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 11);
inputEx.StringField.prototype.setFieldName = function (name) {
   _yuitest_coverfunc("build/inputex-wirable-fields/inputex-wirable-fields.js", "setFieldName", 11);
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 12);
this.el.name = name;
   _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 13);
if(this.terminal) {
      _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 14);
this.terminal.set('name', name);
      // TODO: this.terminal.el.title = name;
   }
};


/**
 * Groups must set the container recursively
 */
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 23);
inputEx.Group.prototype.setContainer = function (container) {
   
   _yuitest_coverfunc("build/inputex-wirable-fields/inputex-wirable-fields.js", "setContainer", 23);
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 25);
inputEx.Group.superclass.setContainer.call(this, container);
   
   // Group and inherited fields must set this recursively
   _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 28);
if(this.inputs) {
      _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 29);
for(var i = 0 ; i < this.inputs.length ; i++) {
         _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 30);
this.inputs[i].setContainer(container);
      }
   }
   
};


/**
 * List must set the container recursively
 */
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 40);
inputEx.ListField.prototype.setContainer = function (container) {
   
   _yuitest_coverfunc("build/inputex-wirable-fields/inputex-wirable-fields.js", "setContainer", 40);
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 42);
inputEx.ListField.superclass.setContainer.call(this, container);

   _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 44);
if(this.subFields) {
      _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 45);
for(var i = 0 ; i < this.subFields.length ; i++) {
         _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 46);
this.subFields[i].setContainer(container);
      }
   }
   
};

/**
 * setContainer must be called on each new element
 */
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 55);
inputEx.ListField.prototype._addElement = inputEx.ListField.prototype.addElement;
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 56);
inputEx.ListField.prototype.addElement = function (value) {
   _yuitest_coverfunc("build/inputex-wirable-fields/inputex-wirable-fields.js", "addElement", 56);
_yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 57);
var f = this._addElement(value);
   _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 58);
f.setContainer(this.options.container);
   _yuitest_coverline("build/inputex-wirable-fields/inputex-wirable-fields.js", 59);
return f;
};



}, '@VERSION@', {"requires": ["inputex-wirable", "inputex-group", "inputex-string", "inputex-list"]});
