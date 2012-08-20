
/**
 * Provides a Panel widget, a widget that mimics the functionality of a regular OS window.
 * Comes with Standard Module support, XY Positioning, Alignment Support, Stack (z-index) support,
 * modality, auto-focus and auto-hide functionality, and header/footer button support.
 *
 * @module inputex-panel
 */
YUI.add('inputex-panel', function (Y) {

    /**
     * A basic Panel Widget, with added support from inputEx.Base
     *
     * @class inputEx.Panel
     * @constructor
     * @extends Panel
     * @uses inputEx.Base
     * @param {Object} object The user configuration for the instance.
     */
    Y.inputEx.Panel = Y.Base.create("panel", Y.Panel, [Y.inputEx.Base], {
        /**
         * Hide the panel
         * (Must overide because the favicon on the UrlField stay do not desappear) 
         *
         * @method hide
         */
        hide: function () {
            Y.inputEx.Panel.superclass.hide.apply(this, arguments);
            this.get("field").hide();

        },
        /**
         * Show the panel
         *
         * @method show
         */
        show: function () {
            Y.inputEx.Panel.superclass.show.apply(this, arguments);
            this.get("field").show();

        }
    });

}, '3.1.0', {
    requires: ['inputex', 'panel', 'inputex-base']
});