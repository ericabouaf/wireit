YUI.add('widget-icons', function (Y, NAME) {

/**
 * @module widget-icons
 */

/**
 * @class WidgetIcons
 * @constructor
 * @param {Object} config configuration object
 */
Y.WidgetIcons = function (config) {
   Y.after(this._renderUIicons, this, "renderUI");
};

Y.WidgetIcons.ATTRS = {
   
   /**
    * Set of icons
    * @attribute icons
    */
   icons: {
      value: []
   }
   
};

Y.WidgetIcons.prototype = {
   
   _renderUIicons: function () {
      
      /*var p = this.get('contentBox'),
          that = this;*/
          
      Y.Array.each( this.get('icons'), Y.bind(this._renderUIicon, this));
      
   },

   _renderUIicon: function(icon) {
      var i = Y.Node.create('<span class="yui3-widget-icons-icon '+this.getClassName('icon')+' '+icon.className+'" title="'+icon.title+'"></span>');
      i.on('click', Y.bind(this[icon.click], this) );
      i.appendTo( this.get('contentBox') );
   }
   
};



}, '@VERSION@', {"requires": [], "skinnable": true});
