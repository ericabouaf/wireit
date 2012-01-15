YUI.add("ellipselabel-container", function(Y){

/**
 * Draw an Ellipse and add an editable label
 * @class EllipseLabelContainer
 * @extends Container
 * @constructor
 * @param {Object} options
 * @param {Layer} layer
 */
Y.EllipseLabelContainer = function(options, layer) {
   Y.EllipseLabelContainer.superclass.constructor.call(this, options, layer);
};

Y.extend(Y.EllipseLabelContainer, Y.CanvasContainer, {
	
	
	/** 
    * @attribute xtype
    * @description String representing this class for exporting as JSON
    * @default "WireIt.CanvasContainer"
    * @type String
    */
   xtype: "Y.CanvasContainer",

	
	/** 
    * @attribute className
    * @description CSS class name for the container element
    * @default ""WireIt-Container WireIt-CanvasContainer WireIt-EllipseLabelContainer"
    * @type String
    */
	className: "WireIt-Container WireIt-CanvasContainer WireIt-EllipseLabelContainer",
	
	/** 
    * @attribute label
    * @description Label String
    * @default "not set"
    * @type String
    */
   label: "not set",
	
	render: function() {
		
		Y.EllipseLabelContainer.superclass.render.call(this);
      
		
		this.labelField = new Y.inputEx.InPlaceEdit({parentEl: this.bodyEl, editorField: {type: 'string'}, animColors:{from:"#FFFF99" , to:"#DDDDFF"} });
		this.labelField.setValue(this.label);
		
		this.labelField.divEl.style.position = 'absolute';
		this.labelField.divEl.style.top = '50px';
		this.labelField.divEl.style.left = '75px';
	}
	
});

}, '0.7.0',{
  requires: ['container']
});
