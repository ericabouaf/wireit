/**
 * Container represented by an image
 * @class ImageContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} 
 */
WireIt.ImageContainer = function(options, layer) {
   WireIt.ImageContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.ImageContainer, WireIt.Container, {
   
   /**
    * @method setOptions
    */
   setOptions: function(options) {
      WireIt.ImageContainer.superclass.setOptions.call(this, options);
      
      this.options.image = options.image;
      this.options.xtype = "WireIt.ImageContainer";
      
      this.options.className = options.className || "WireIt-Container WireIt-ImageContainer";
      
      // Overwrite default value for options:
      this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;
      this.options.ddHandle = (typeof options.ddHandle == "undefined") ? false : options.ddHandle;
   },
   
   /**
    * @method render
    */
   render: function() {
      WireIt.ImageContainer.superclass.render.call(this);
      YAHOO.util.Dom.setStyle(this.bodyEl, "background-image", "url("+this.options.image+")");
   }
   
});