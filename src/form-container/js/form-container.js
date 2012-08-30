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
Y.FormContainer = Y.Base.create("form-container", Y.Container, [], {
   
   /**
    * @method renderUI
    */
   renderUI: function () {
      Y.FormContainer.superclass.renderUI.call(this);
      this._renderForm();
   },
   
   /**
    * Render the form in the widget body
    * @method _renderForm
    */
   _renderForm: function () {
      this.after('bodyContentChange', function () {
         var inputExContainer = this.getStdModNode(Y.WidgetStdMod.BODY).one('.inputex-container')._node;
         
         var that = this;
         this.form = new Y.inputEx.Group({
             parentEl: inputExContainer,
             fields: (new Y.Array(this.get('fields') ) ).map(function (i) {
                // add the container reference
                 return Y.mix({container: that}, i);
              })
         });
         
         this.form.setValue(this.get('value'));
         
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
            if(this.form) {
               return this.form.setValue(val);
            }
         },
         getter: function () {
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

