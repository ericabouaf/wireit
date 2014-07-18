YUI.add('image-container', function (Y, NAME) {

/**
 * @module image-container
 */

/**
 * ImageContainer is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class ImageContainer
 * @extends Container
 * @constructor
 */
Y.ImageContainer = Y.Base.create("image-container", Y.Container, [], {
   
   /**
    * @method renderUI
    */
   renderUI: function () {

      this.image = Y.Node.create('<img src="'+this.get('imageUrl')+'" width="'+this.get('width')+'"  height="'+this.get('height')+'"/>');
      this.image.appendTo( this.get('contentBox') );
      
      Y.ImageContainer.superclass.renderUI.apply(this);

      if(this.resize && this.get('resizePreserveRatio') ) {
         this.resize.plug(Y.Plugin.ResizeConstrained, {
            preserveRatio: true
         });
      }

   },

   /**
    * @method bindUI
    */
   bindUI: function() {

      this.image.after('load', this.alignTerminals, this);

      if(this.resize) {
         this.resize.after('resize:resize', this._onResizeImage, this);
      }

      this.drag.set('handles', [this.image]);

      Y.ImageContainer.superclass.bindUI.apply(this);
   },

   _onResizeImage: function(e) {
      var p = e.details[0].info;
      this.image.set('width',  p.right-p.left);
      this.image.set('height', p.bottom-p.top);
   }
   
}, {

   ATTRS: {

      /**
       * Url of the image you want to render (relative to the script's page)
       * @attribute imageUrl
       */
      imageUrl: {
         value: '',
         setter: function(url) {
            if(this.image) {
              this.image.set('src', url);
            }
         }
      },

      /**
       * Preserve ratio when resized (only if resizable)
       * @attribute resizePreserveRatio
       */
      resizePreserveRatio: {
         value: true
      }

   }
   
});


}, '@VERSION@', {"requires": ["container"], "skinnable": true});
