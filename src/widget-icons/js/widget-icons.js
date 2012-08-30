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
      
      var p = this.get('contentBox'),
          that= this;
          
      Y.Array.each( this.get('icons'), function (icon) {
         var i = Y.Node.create('<span class="'+that.getClassName('icon')+' '+icon.className+'" title="'+icon.title+'"></span>');
         i.on('click', Y.bind(that[icon.click], that) );
         i.appendTo( p );
         //p.insertBefore(i, p.get('children').item(0) );
      });
      
   }
   
};

