/*global YAHOO,WireIt */
/**
 * Container represented by an image
 * @class ImageContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.ImageContainer = function(options, layer) {
   WireIt.ImageContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.ImageContainer, WireIt.Container, {
   /**
    * @method setOptions
    * @param {Object} options the options object
    */
   setOptions: function(options) {
     
      WireIt.ImageContainer.superclass.setOptions.call(this, YAHOO.lang.merge( {
            resizable: false,
            ddHandle: false,
            className: "WireIt-Container WireIt-ImageContainer"
      }, options));
      this.options.xtype = "WireIt.ImageContainer"; //don't allow overriding.
   },
   
   /**
    * @method render
    */
   render: function() {
      WireIt.ImageContainer.superclass.render.call(this);
      YAHOO.util.Dom.setStyle(this.bodyEl, "background-image", "url("+this.options.image+")");
   }
   
});