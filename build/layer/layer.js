YUI.add('layer', function (Y, NAME) {

/**
 * @module layer
 */

/**
 * Layer : Widget to manage collections of wires (through WiresDelegate) and containers (trough WidgetParent)
 * @class Layer
 * @extends Widget
 * @uses WidgetParent
 * @uses WiresDelegate
 */
Y.Layer = Y.Base.create("layer", Y.Widget, [Y.WidgetParent, Y.WiresDelegate], {
   
   initializer: function () {
      
      this.graphic = new Y.Graphic({render: this.get('contentBox') }); 
      
   },
   
   
   /**
    * Alias method for WidgetParent.removeAll
    * @method clear
    */
   clear: function () {
      this.removeAll();
   }
   
}, {
   
   ATTRS: {
      
      defaultChildType: {
         value: 'Container'
      }
      
   }
   
});



}, '@VERSION@', {"requires": ["widget-parent", "container", "wires-delegate"], "skinnable": "true"});
