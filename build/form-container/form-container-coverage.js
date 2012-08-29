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
_yuitest_coverage["build/form-container/form-container.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/form-container/form-container.js",
    code: []
};
_yuitest_coverage["build/form-container/form-container.js"].code=["YUI.add('form-container', function (Y, NAME) {","","/**"," * @module form-container"," */","","/**"," * Include the form library inputEx + WirableField + FormContainer<br />"," * <br />"," * <b>WARNING</b>: The \"WirableField.js\" file MUST be loaded AFTER \"inputEx/field.js\" and BEFORE all other inputEx fields !<br />"," * <br />"," * See the inputEx website for documentation of the fields & forms: <a href='http://neyric.github.com/inputex'>http://neyric.github.com/inputex</a><br />"," *"," * Class used to build a container with inputEx forms"," * @class FormContainer"," * @extends Container"," * @constructor"," * @param {Object}   options  Configuration object (see properties)"," * @param {Layer}   layer The Y.Layer (or subclass) instance that contains this container"," */","Y.FormContainer = Y.Base.create(\"form-container\", Y.Container, [], {","   ","   /**","    * @method renderUI","    */","   renderUI: function () {","      Y.FormContainer.superclass.renderUI.call(this);","      this._renderForm();","   },","   ","   /**","    * Render the form in the widget body","    * @method _renderForm","    */","   _renderForm: function () {","      this.after('bodyContentChange', function () {","         var inputExContainer = this.getStdModNode(Y.WidgetStdMod.BODY).one('.inputex-container')._node;","         ","         var that = this;","         this.form = new Y.inputEx.Group({","             parentEl: inputExContainer,","             fields: (new Y.Array(this.get('fields') ) ).map(function (i) {","                // add the container reference","                 return Y.mix({container: that}, i);","              })","         });","         ","         this.form.setValue(this.get('value'));","         ","         this.alignTerminals();","         ","      }, this);","   },","   ","   SERIALIZABLE_ATTRS: Y.Container.prototype.SERIALIZABLE_ATTRS.concat(['value'])","   ","}, {","","   ATTRS: {","      ","      /**","       * Value of the form","       * @attribute value","       */","      value: {","         setter: function (val) {","            if(this.form) {","               return this.form.setValue(val);","            }","         },","         getter: function () {","            if(this.form) {","               return this.form.getValue();","            }","            else {","               return {};","            }","         }","      },","      ","      /**","       * Keep to render the form","       * @attribute bodyContent","       */","      bodyContent: {","         value: '<div class=\"inputex-container\" />'","      },","      ","      /**","       * @attribute fields","       */","      fields: {","         value: []","      }//,","      ","      /**","       * @attribute resizable","       */","      /*resizable: {","         value: false","      }*/","      ","   }","","});","","   /** ","    * @attribute legend","    * @description Legend","    * @default null","    * @type String","    */","   //legend: null,","","   /** ","    * @attribute collapsible","    * @description Collapsible","    * @default false","    * @type Boolean","    */","   //collapsible: false,","   ","   /**","    * Render the form","    * @method renderForm","    */","   /*renderForm: function () {","   ","      var groupParams = {parentEl: this.bodyEl, fields: this.fields, legend: this.legend, collapsible: this.collapsible};","      this.form = new Y.inputEx.Group(groupParams);","        this.form.setContainer(this);","","         for(var i = 0 ; i < this.form.inputs.length ; i++) {","            var field = this.form.inputs[i];","            field.setContainer(this);","         }","","","      // Redraw all wires when the form is collapsed","      if(this.form.legend) {","         Y.one(this.form.legend).on('click', function () {","            ","            // Override the getXY method on field terminals:","            var that = this;","            for(var i = 0 ; i < this.form.inputs.length ; i++) {","               var field = this.form.inputs[i];","               if(field.terminal) {","                  field.terminal.getXY = function () {","                     if( Y.one(that.form.fieldset).hasClass(\"inputEx-Collapsed\") ) {","                        return that.getXY();","                     }","                     else {","                        return Y.Terminal.prototype.getXY.call(this);","                     }","                     ","                  };","               }","            }","            ","            this.redrawAllWires();","         }, this, true);","      }","   },*/","   ","//});","","","","}, '@VERSION@', {\"requires\": [\"container\", \"inputex-wirable-fields\"], \"skinnable\": true});"];
_yuitest_coverage["build/form-container/form-container.js"].lines = {"1":0,"21":0,"27":0,"28":0,"36":0,"37":0,"39":0,"40":0,"44":0,"48":0,"50":0,"67":0,"68":0,"72":0,"73":0,"76":0};
_yuitest_coverage["build/form-container/form-container.js"].functions = {"renderUI:26":0,"(anonymous 3):42":0,"(anonymous 2):36":0,"_renderForm:35":0,"setter:66":0,"getter:71":0,"(anonymous 1):1":0};
_yuitest_coverage["build/form-container/form-container.js"].coveredLines = 16;
_yuitest_coverage["build/form-container/form-container.js"].coveredFunctions = 7;
_yuitest_coverline("build/form-container/form-container.js", 1);
YUI.add('form-container', function (Y, NAME) {

/**
 * @module form-container
 */

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
_yuitest_coverfunc("build/form-container/form-container.js", "(anonymous 1)", 1);
_yuitest_coverline("build/form-container/form-container.js", 21);
Y.FormContainer = Y.Base.create("form-container", Y.Container, [], {
   
   /**
    * @method renderUI
    */
   renderUI: function () {
      _yuitest_coverfunc("build/form-container/form-container.js", "renderUI", 26);
_yuitest_coverline("build/form-container/form-container.js", 27);
Y.FormContainer.superclass.renderUI.call(this);
      _yuitest_coverline("build/form-container/form-container.js", 28);
this._renderForm();
   },
   
   /**
    * Render the form in the widget body
    * @method _renderForm
    */
   _renderForm: function () {
      _yuitest_coverfunc("build/form-container/form-container.js", "_renderForm", 35);
_yuitest_coverline("build/form-container/form-container.js", 36);
this.after('bodyContentChange', function () {
         _yuitest_coverfunc("build/form-container/form-container.js", "(anonymous 2)", 36);
_yuitest_coverline("build/form-container/form-container.js", 37);
var inputExContainer = this.getStdModNode(Y.WidgetStdMod.BODY).one('.inputex-container')._node;
         
         _yuitest_coverline("build/form-container/form-container.js", 39);
var that = this;
         _yuitest_coverline("build/form-container/form-container.js", 40);
this.form = new Y.inputEx.Group({
             parentEl: inputExContainer,
             fields: (new Y.Array(this.get('fields') ) ).map(function (i) {
                // add the container reference
                 _yuitest_coverfunc("build/form-container/form-container.js", "(anonymous 3)", 42);
_yuitest_coverline("build/form-container/form-container.js", 44);
return Y.mix({container: that}, i);
              })
         });
         
         _yuitest_coverline("build/form-container/form-container.js", 48);
this.form.setValue(this.get('value'));
         
         _yuitest_coverline("build/form-container/form-container.js", 50);
this.alignTerminals();
         
      }, this);
   },
   
   SERIALIZABLE_ATTRS: Y.Container.prototype.SERIALIZABLE_ATTRS.concat(['value'])
   
}, {

   ATTRS: {
      
      /**
       * Value of the form
       * @attribute value
       */
      value: {
         setter: function (val) {
            _yuitest_coverfunc("build/form-container/form-container.js", "setter", 66);
_yuitest_coverline("build/form-container/form-container.js", 67);
if(this.form) {
               _yuitest_coverline("build/form-container/form-container.js", 68);
return this.form.setValue(val);
            }
         },
         getter: function () {
            _yuitest_coverfunc("build/form-container/form-container.js", "getter", 71);
_yuitest_coverline("build/form-container/form-container.js", 72);
if(this.form) {
               _yuitest_coverline("build/form-container/form-container.js", 73);
return this.form.getValue();
            }
            else {
               _yuitest_coverline("build/form-container/form-container.js", 76);
return {};
            }
         }
      },
      
      /**
       * Keep to render the form
       * @attribute bodyContent
       */
      bodyContent: {
         value: '<div class="inputex-container" />'
      },
      
      /**
       * @attribute fields
       */
      fields: {
         value: []
      }//,
      
      /**
       * @attribute resizable
       */
      /*resizable: {
         value: false
      }*/
      
   }

});

   /** 
    * @attribute legend
    * @description Legend
    * @default null
    * @type String
    */
   //legend: null,

   /** 
    * @attribute collapsible
    * @description Collapsible
    * @default false
    * @type Boolean
    */
   //collapsible: false,
   
   /**
    * Render the form
    * @method renderForm
    */
   /*renderForm: function () {
   
      var groupParams = {parentEl: this.bodyEl, fields: this.fields, legend: this.legend, collapsible: this.collapsible};
      this.form = new Y.inputEx.Group(groupParams);
        this.form.setContainer(this);

         for(var i = 0 ; i < this.form.inputs.length ; i++) {
            var field = this.form.inputs[i];
            field.setContainer(this);
         }


      // Redraw all wires when the form is collapsed
      if(this.form.legend) {
         Y.one(this.form.legend).on('click', function () {
            
            // Override the getXY method on field terminals:
            var that = this;
            for(var i = 0 ; i < this.form.inputs.length ; i++) {
               var field = this.form.inputs[i];
               if(field.terminal) {
                  field.terminal.getXY = function () {
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



}, '@VERSION@', {"requires": ["container", "inputex-wirable-fields"], "skinnable": true});
