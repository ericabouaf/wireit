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
_yuitest_coverage["build/inputex-wirable/inputex-wirable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/inputex-wirable/inputex-wirable.js",
    code: []
};
_yuitest_coverage["build/inputex-wirable/inputex-wirable.js"].code=["YUI.add('inputex-wirable', function (Y, NAME) {","","/**"," * @module inputex-wirable"," */","","   var inputEx = Y.inputEx;","","/**"," * Copy of the original inputEx.Field class that we're gonna override to extend it."," * @class BaseField"," */","inputEx.BaseField = inputEx.Field;","","/**"," * Class to make inputEx Fields \"wirable\".Re-create inputEx.Field adding the wirable properties"," * @class Field"," * @extends inputEx.BaseField"," */","inputEx.Field = function (options) {","   inputEx.Field.superclass.constructor.call(this,options);","};","","Y.extend(inputEx.Field, inputEx.BaseField, {","","   /**","    * Adds a wirable option to every field","    * @method setOptions","    */","   setOptions: function (options) {","      inputEx.Field.superclass.setOptions.call(this, options);","      ","      this.options.wirable = Y.Lang.isUndefined(options.wirable) ? false : options.wirable;","      this.options.container = options.container;","   },","   ","   /**","    * Adds a terminal to each field","    * @method render","    */","   render: function () {","      inputEx.Field.superclass.render.call(this);","      ","      if(this.options.wirable) {","         this.renderTerminal();","      }","   },","   ","   /**","    * Render the associated input terminal","    * @method renderTerminal","    */","   renderTerminal: function () {","","      if(this.options.container) {","         this.terminal = this.options.container.add({","            name: this.options.name, ","            dir: [-1,0],","            alignNode: this.divEl,","            align: {\"points\":['tl', 'lc']}","         }).item(0);","         ","         // Register the events","         this.terminal.on('addWire', this.onAddWire, this, true);","         this.terminal.on('removeWire', this.onRemoveWire, this, true);","      }","      ","    },","","   /**","    * Set the container for this field","    */","   setContainer: function (container) {","      if(!this.options.container) {","         this.renderTerminal();","      }","      this.options.container = container;","      /*if(this.terminal) {","         this.terminal.container = container;","         if( Y.Array.indexOf(container.terminals, this.terminal) == -1 ) {","            container.terminals.push(this.terminal);","         }","      }*/","   },","","   /**","    * also change the terminal name when changing the field name","    */","   setFieldName: function (name) {","      if(this.terminal) {","         this.terminal.name = name;","         this.terminal.el.title = name;","      }","   },","","    /**","     * Remove the input wired state on the ","     * @method onAddWire","     */","    onAddWire: function (e, params) {","       // TODO: this.options.container.onAddWire(e,params);","","       this.disable();","       this.el.value = \"[wired]\";","    },","","    /**","     * Remove the input wired state on the ","     * @method onRemoveWire","     */","    onRemoveWire: function (e, params) { ","       // TODO: this.options.container.onRemoveWire(e,params);","","       this.enable();","       this.el.value = \"\";","    }","","});","","inputEx.Field.groupOptions = inputEx.BaseField.groupOptions.concat([","   { type: 'boolean', label: 'Wirable', name: 'wirable', value: false}","]);","","","","}, '@VERSION@', {\"requires\": [\"terminal\", \"inputex-field\"]});"];
_yuitest_coverage["build/inputex-wirable/inputex-wirable.js"].lines = {"1":0,"7":0,"13":0,"20":0,"21":0,"24":0,"31":0,"33":0,"34":0,"42":0,"44":0,"45":0,"55":0,"56":0,"64":0,"65":0,"74":0,"75":0,"77":0,"90":0,"91":0,"92":0,"103":0,"104":0,"114":0,"115":0,"120":0};
_yuitest_coverage["build/inputex-wirable/inputex-wirable.js"].functions = {"Field:20":0,"setOptions:30":0,"render:41":0,"renderTerminal:53":0,"setContainer:73":0,"setFieldName:89":0,"onAddWire:100":0,"onRemoveWire:111":0,"(anonymous 1):1":0};
_yuitest_coverage["build/inputex-wirable/inputex-wirable.js"].coveredLines = 27;
_yuitest_coverage["build/inputex-wirable/inputex-wirable.js"].coveredFunctions = 9;
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 1);
YUI.add('inputex-wirable', function (Y, NAME) {

/**
 * @module inputex-wirable
 */

   _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 7);
var inputEx = Y.inputEx;

/**
 * Copy of the original inputEx.Field class that we're gonna override to extend it.
 * @class BaseField
 */
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 13);
inputEx.BaseField = inputEx.Field;

/**
 * Class to make inputEx Fields "wirable".Re-create inputEx.Field adding the wirable properties
 * @class Field
 * @extends inputEx.BaseField
 */
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 20);
inputEx.Field = function (options) {
   _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "Field", 20);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 21);
inputEx.Field.superclass.constructor.call(this,options);
};

_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 24);
Y.extend(inputEx.Field, inputEx.BaseField, {

   /**
    * Adds a wirable option to every field
    * @method setOptions
    */
   setOptions: function (options) {
      _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "setOptions", 30);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 31);
inputEx.Field.superclass.setOptions.call(this, options);
      
      _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 33);
this.options.wirable = Y.Lang.isUndefined(options.wirable) ? false : options.wirable;
      _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 34);
this.options.container = options.container;
   },
   
   /**
    * Adds a terminal to each field
    * @method render
    */
   render: function () {
      _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "render", 41);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 42);
inputEx.Field.superclass.render.call(this);
      
      _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 44);
if(this.options.wirable) {
         _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 45);
this.renderTerminal();
      }
   },
   
   /**
    * Render the associated input terminal
    * @method renderTerminal
    */
   renderTerminal: function () {

      _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "renderTerminal", 53);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 55);
if(this.options.container) {
         _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 56);
this.terminal = this.options.container.add({
            name: this.options.name, 
            dir: [-1,0],
            alignNode: this.divEl,
            align: {"points":['tl', 'lc']}
         }).item(0);
         
         // Register the events
         _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 64);
this.terminal.on('addWire', this.onAddWire, this, true);
         _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 65);
this.terminal.on('removeWire', this.onRemoveWire, this, true);
      }
      
    },

   /**
    * Set the container for this field
    */
   setContainer: function (container) {
      _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "setContainer", 73);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 74);
if(!this.options.container) {
         _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 75);
this.renderTerminal();
      }
      _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 77);
this.options.container = container;
      /*if(this.terminal) {
         this.terminal.container = container;
         if( Y.Array.indexOf(container.terminals, this.terminal) == -1 ) {
            container.terminals.push(this.terminal);
         }
      }*/
   },

   /**
    * also change the terminal name when changing the field name
    */
   setFieldName: function (name) {
      _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "setFieldName", 89);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 90);
if(this.terminal) {
         _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 91);
this.terminal.name = name;
         _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 92);
this.terminal.el.title = name;
      }
   },

    /**
     * Remove the input wired state on the 
     * @method onAddWire
     */
    onAddWire: function (e, params) {
       // TODO: this.options.container.onAddWire(e,params);

       _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "onAddWire", 100);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 103);
this.disable();
       _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 104);
this.el.value = "[wired]";
    },

    /**
     * Remove the input wired state on the 
     * @method onRemoveWire
     */
    onRemoveWire: function (e, params) { 
       // TODO: this.options.container.onRemoveWire(e,params);

       _yuitest_coverfunc("build/inputex-wirable/inputex-wirable.js", "onRemoveWire", 111);
_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 114);
this.enable();
       _yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 115);
this.el.value = "";
    }

});

_yuitest_coverline("build/inputex-wirable/inputex-wirable.js", 120);
inputEx.Field.groupOptions = inputEx.BaseField.groupOptions.concat([
   { type: 'boolean', label: 'Wirable', name: 'wirable', value: false}
]);



}, '@VERSION@', {"requires": ["terminal", "inputex-field"]});
