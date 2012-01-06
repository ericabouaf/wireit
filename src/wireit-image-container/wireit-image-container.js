/*global YUI */

YUI.add("wireit-image-container", function(Y){

/**
 * Container represented by an image
 * @class ImageContainer
 * @extends Y.WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
Y.WireIt.ImageContainer = function(options, layer) {
   Y.WireIt.ImageContainer.superclass.constructor.call(this, options, layer);
};

Y.extend(Y.WireIt.ImageContainer, Y.WireIt.Container, {
	
	/** 
    * @property xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.ImageContainer"
    * @type String
    */
   xtype: "Y.WireIt.ImageContainer",
	
	/** 
    * @property resizable
    * @description boolean that makes the container resizable
    * @default false
    * @type Boolean
    */
	resizable: false,
	
	/** 
    * @property ddHandle
    * @description (only if draggable) boolean indicating we use a handle for drag'n drop
    * @default false
    * @type Boolean
    */
	ddHandle: false,
	
	/** 
    * @property className
    * @description CSS class name for the container element
    * @default ""WireIt-Container WireIt-ImageContainer"
    * @type String
    */
	className: "WireIt-Container WireIt-ImageContainer",
	
	/** 
    * @property image
    * @description image url
    * @default null
    * @type String
    */
	image: null,
   
   /**
 	 * Add the image property as a background image for the container
    * @method render
    */
   render: function() {
      Y.WireIt.ImageContainer.superclass.render.call(this);
      Y.one(this.bodyEl).setStyle("backgroundImage", "url("+this.image+")");
   }
   
});

}, '0.7.0',{
  requires: ['wireit-container']
});
