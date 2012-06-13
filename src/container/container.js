/**
 * @module container
 */
YUI.add('container', function(Y) {

/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @extends ContainerBase
 * @constructor
 */
Y.Container = Y.Base.create("container", Y.ContainerBase, [Y.WidgetIcons], {
	
	_onCloseClick: function() {
		this.destroy();
	}
	
}, {
	
	ATTRS: {
		
		icons: {
			value: [
			    {title: 'close', click: '_onCloseClick', className: 'ui-silk ui-silk-cancel'}
			]
		}
		
	}
	
});

}, '3.5.1', {requires: ['container-base', 'widget-icons']});
