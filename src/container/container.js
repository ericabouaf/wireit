YUI.add('container', function(Y) {

/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @extends Overlay
 * @constructor
 */
var Container = Y.Base.create("container", Y.ContainerBase, [], {

}, {

	ATTRS: {
		fillHeight: {
			value: true
		}
	}

});

Y.Container = Container;

}, '3.0.0a', {requires: ['container-base']});
