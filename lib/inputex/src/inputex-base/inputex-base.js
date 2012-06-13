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
 * @class inputExBase
 * @param {Object} config User configuration object
 */
function inputExBase(config) {
    Y.after(this._renderUIInputEx, this, 'renderUI');

    if (this.get("rendered")) {
        this._renderUIInputEx();
    }
}

/**
* Static property used to define the default attribute 
* configuration introduced by inputExBase.
*
* @property inputExBase.ATTRS
* @static
* @type Object
*/
inputExBase.ATTRS = {
   inputEx: {
   },
   field: {
   }
};

inputExBase.prototype = {

   _renderUIInputEx: function() {
     var config = {};
     Y.mix(config, this.get('inputEx') );
     config.parentEl = this.get('contentBox');
     this.set('field', Y.inputEx(config));
   }
};


Y.inputEx.Base = inputExBase;


}, '3.0.0a',{
  requires: ['inputex', 'base']
});


