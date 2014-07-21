/**
 * @module inout-container
 */

/**
 * Container with left inputs and right outputs
 * @class InOutContainer
 * @extends Container
 * @constructor
 * @param {Object} options
 */

Y.InOutContainer = Y.Base.create("inout-container", Y.Container, [], {

   /**
    * @method renderUI
    */
   renderUI: function () {
      Y.InOutContainer.superclass.renderUI.call(this);
      this._renderInputsOutputs();
   },
   
   /**
    * @method _renderInputsOutputs
    */
   _renderInputsOutputs: function () {

      this.setStdModContent(Y.WidgetStdMod.BODY, "<ul class='inputs'></ul><ul class='outputs'></ul>");

      var bb = this.get('boundingBox'),
          inputsUl = bb.one('ul.inputs'),
          outputsUl = bb.one('ul.outputs'),
          inputs = this.get('inputs'),
          outputs = this.get('outputs'),
          i, n;


      for(i = 0, n = inputs.length ; i < n ; i++) {

         Y.Node.create('<li>'+inputs[i].label+'</li>').appendTo(inputsUl);

         this.add({
            type: 'TerminalInput',
            name: inputs[i].name,
            dir: [-0.3, 0]
         });
      }

      for(i = 0, n = outputs.length; i < n ; i++) {

         Y.Node.create('<li>'+outputs[i].label+'</li>').appendTo(outputsUl);

         this.add({
            type: 'TerminalOutput',
            name: outputs[i].name,
            dir: [0.3, 0]
         });
      }

      Y.later(100, this, function() {

         var i, term;

         for(i = 0 ; i < inputs.length ; i++) {
            this.item(i).align( inputsUl.all('li').item(i) , [Y.WidgetPositionAlign.TC, Y.WidgetPositionAlign.LC] );
         }
         for(i = 0 ; i < outputs.length ; i++) {
            term = this.item(inputs.length + i);
            term.align( outputsUl.all('li').item(i) , [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.RC] );
            term.set('x', term.get('x')+11);
         }
      });
      
   }
   
}, {

   ATTRS: {
      
      resizable: {
         value: false
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
