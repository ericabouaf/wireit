YUI.add('container', function(Y) {

/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @extends ContainerBase
 * @constructor
 */
Y.Container = Y.Base.create("container", Y.ContainerBase, [/* TODO: Y.WidgetIcon, Y.WidgetClose */]);

}, '3.5.0pr1', {requires: ['container-base']});
