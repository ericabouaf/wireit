YUI.add('terminal-scissors', function (Y, NAME) {

/**
 * @module terminal-scissors
 */

/**
 * @class TerminalScissors
 * @constructor
 * @param {Object} config configuration object
 */
Y.TerminalScissors = function (config) {
   
   Y.after(this._renderUIScissors, this, "renderUI");
   Y.after(this._bindUIScissors, this, "bindUI");
   
};

Y.TerminalScissors.ATTRS = {

   /**
    * @attribute dirNormed
    */
   dirNormed: {
      getter: function() {
         var dir = this.get('dir'),
             a = dir[0],
             b = dir[1],
             norm = Math.sqrt(a*a+b*b);
         return [dir[0]/norm, dir[1]/norm];
      }
   },

   /**
    * @attribute scissorsDistance
    */
   scissorsDistance: {
      value: 30
   }

};

Y.TerminalScissors.prototype = {
   
   /**
    * @method _renderUIScissors
    * @private
    */
   _renderUIScissors: function () {
      if( this.get('editable') ) {
         this._renderScissors();
      }
   },
   
   /**
    * @method _bindUIScissors
    * @private
    */
   _bindUIScissors: function () {
      if( this.get('editable') ) {
         this._scissorsOverlay.get('boundingBox').on('click', this.destroyWires, this);
      }
   },
   
   /**
    * @method _renderScissors
    * @private
    */
   _renderScissors: function () {
      this._scissorsOverlay = new Y.Overlay({});
      
      this._scissorsOverlay.get('contentBox').addClass( this.getClassName("scissors") );
      
      var refXY = this.get('xy'),
          normed_dir = this.get('dirNormed'),
          distance = this.get('scissorsDistance');

      this._scissorsOverlay.set('x', refXY[0]+normed_dir[0]*distance-8);
      this._scissorsOverlay.set('y', refXY[1]+normed_dir[1]*distance-8);
      
      this._scissorsOverlay.render( this.get('boundingBox') );
   }
   
};




}, '@VERSION@', {"requires": ["overlay"], "skinnable": true});
