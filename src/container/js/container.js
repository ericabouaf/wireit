    'use strict';

/**
 * @module container
 */

/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @extends ContainerBase
 */
    Y.Container = Y.Base.create("container", Y.ContainerBase, [Y.WidgetIcons], {
        /**
         * Click handler for the close icon
         * @method _onCloseClick
         * @private
         */
        _onCloseClick: function () {
            this.destroy();
        }

    }, {

        ATTRS: {
            /**
             * Override the default value of WidgetIcons to add the close button
             * @attribute icons
             */
            icons: {
                value: [
                    {title: 'close', click: '_onCloseClick', className: 'ui-silk ui-silk-cancel'}
                ]
            }
        }
    });

