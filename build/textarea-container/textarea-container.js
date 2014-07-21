YUI.add('textarea-container', function (Y, NAME) {

/**
 * @module textarea-container
 */

/**
 * Form container for a single textarea field which is resizeable.
 * You still need to specify the "fields".
 * @class TextareaContainer
 * @extends Container
 * @constructor
 * @param {Object}   options  Configuration object (see properties)
 */

Y.TextareaContainer = Y.Base.create("textarea-container", Y.Container, [], {
   

   SERIALIZABLE_ATTRS: function() {
      return Y.TextareaContainer.superclass.SERIALIZABLE_ATTRS.call(this).concat(['value']);
   },
   
   renderUI: function() {
      Y.TextareaContainer.superclass.renderUI.call(this);

      this.setStdModContent(Y.WidgetStdMod.BODY, "<textarea></textarea>");

      this._bodyNode = this.getStdModNode(Y.WidgetStdMod.BODY);
      this._textarea = this._bodyNode.one('textarea');
   },

   bindUI: function() {

      Y.TextareaContainer.superclass.bindUI.call(this);

      if(this.resize) {
         this.resize.after('resize:resize', this._afterResizeTextarea, this);
      }
   },

   _fillTextareaSize: function() {
      this.fillHeight(this._bodyNode);

      var region = this._bodyNode.get('region');

      this._textarea.setStyle('height', region.height);
      this._textarea.setStyle('width', region.width);
   },

   _afterResizeTextarea: function(e) {
      this._fillTextareaSize();
   },

   syncUI: function() {
      Y.TextareaContainer.superclass.syncUI.call(this);

      this.getStdModNode(Y.WidgetStdMod.BODY).one('textarea').set( this.get('value') );

      Y.later(0, this, function() {
         this._fillTextareaSize();
      });
   }
   
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
            this.getStdModNode(Y.WidgetStdMod.BODY).one('textarea').set('value', value);
         }
      }
      
   }
   
});



}, '@VERSION@', {"requires": ["container"]});
