/**
 * Provides a Panel widget, a widget that mimics the functionality of a regular OS window.
 * Comes with Standard Module support, XY Positioning, Alignment Support, Stack (z-index) support,
 * modality, auto-focus and auto-hide functionality, and header/footer button support.
 *
 * @module panel
 */

YUI.add('inputex-panel',function(Y){

/**
 * A basic Panel Widget, with added support from inputEx.Base
 *
 * @class inputEx.Panel
 * @constructor
 * @extends Panel
 * @uses inputEx.Base
 * @param {Object} object The user configuration for the instance.
 */
Y.inputEx.Panel = Y.Base.create("panel", Y.Panel, [Y.inputEx.Base]);

}, '3.0.0a',{
  requires: ['inputex', 'panel','inputex-base']
});
