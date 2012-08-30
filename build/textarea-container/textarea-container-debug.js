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
            return this.getStdModNode(Y.WidgetStdMod.BODY).one('textarea').get('value');
         },
         
         setter: function (value) {
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
