/**
 * A widget-stdmod-level extension that provides ability to render a form within the body
 *
 * @module inputex-base
 */

 YUI.add('inputex-base',function(Y){

/**
 * The inputExBase class provides the hideOn attribute which can
 * be used to hide the widget when certain events occur.
 *
 * @class inputEx.Base
 * @param {Object} config User configuration object
 */
function inputExBase(config) {
    Y.after(this._renderUIInputEx, this, 'renderUI');

    Y.after(this._bindUIInputEx, this, 'bindUI');

    if (this.get("rendered")) {
        this._renderUIInputEx();
    }
}

inputExBase.ATTRS = {
   
   /**
    * inputEx json configuration
    *
    * @attribute inputEx
    * @type Object
    */
   inputEx: {
   },
   
   
   /**
    * Instantiated inputEx field (any type)
    * 
    * @attribute field
    * @type inputEx.Field
    */
   field: {
   }
};

inputExBase.prototype = {

   /**
    * @method _renderUIInputEx
    * @private
    */
   _renderUIInputEx: function() {
     var config = {};
     Y.mix(config, this.get('inputEx') );
     config.parentEl = this.get('contentBox');
     this.set('field', Y.inputEx(config));
   },
   
   /**
    * @method _bindUIInputEx
    * @private
    */
   _bindUIInputEx: function() {
      // Closing all fields when the widget is hidden
      this.on('visibleChange', function(e) {
        if(e.newVal === false) {
          this.get('field').close();
        }
      }, this);
   }

};


Y.inputEx.Base = inputExBase;


}, '3.1.0',{
  requires: ['inputex', 'base']
});


