YUI.add('widget-terminals', function (Y, NAME) {

/**
 * WidgetTerminals: manages child terminals.
 *
 * The host must use WidgetParent and WiresDelegate
 *
 */
Y.WidgetTerminals = function(config) {
  Y.after(this._syncUITerminals, this, "syncUI");
};

Y.WidgetTerminals.ATTRS = {

	/**
     * @attribute defaultChildType
     */
    defaultChildType: {
        value: 'Terminal'
    }

};

Y.WidgetTerminals.prototype = {

  _syncUITerminals: function() {
    this.alignTerminals();
  },

   /**
    * @method alignTerminals
    */
   alignTerminals: function () {
      var contentBox = this.get('contentBox');
      this.each(function (term) {
         if(term.get('align')) {
            term.align( term.get('alignNode') || contentBox, ['tl',term.get('align').points[1]]);
         }
      }, this);

      this.redrawAllWires();
   },


   /**
    * Get a terminal by name
    * @method getTerminal
    */
   getTerminal: function (name) {
      return Y.Array.find(this._items, function (item) {
         if(item.get('name') === name) {
            return true;
         }
      });
   }

};



Y.WidgetTerminals.EIGHT_POINTS = [
    { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },
    { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },
    { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },
    { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },
    { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },
    { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },
    { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' },
    { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }
 ];

Y.WidgetTerminals.FOUR_CORNERS = [
    { align: {points:['tl', 'tl']}, dir: [-0.5, -0.5], name: 'tl' },
    { align: {points:['tl', 'tr']}, dir: [0.5, -0.5], name: 'tr' },
    { align: {points:['tl', 'br']}, dir: [0.5, 0.5], name: 'br' },
    { align: {points:['tl', 'bl']}, dir: [-0.5, 0.5], name: 'bl' }
 ];

Y.WidgetTerminals.FOUR_EDGES = [
    { align: {points:['tl', 'tc']}, dir: [0, -1], name: 'tc' },
    { align: {points:['tl', 'lc']}, dir: [-1, 0], name: 'lc' },
    { align: {points:['tl', 'rc']}, dir: [1, 0], name: 'rc' },
    { align: {points:['tl', 'bc']}, dir: [0,1], name: 'bc' }
 ];
 


}, '@VERSION@', {"requires": ["terminal"]});
