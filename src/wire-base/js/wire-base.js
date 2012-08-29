/**
 * @module wire-base
 */

/**
 * The wire widget
 * The wire is drawn between "src" and "tgt" (so they might be directional).
 *
 * "src" and "tgt" MUST have a "getXY" function
 *
 * "src" and "tgt" MAY additionnaly have the "addWire", "removeWire" methods.
 * Those methods are designed to be used through the Y.WiringsDelegate extension,
 * which provide basic list-handling on wires.
 *
 * @class WireBase
 * @extends Path
 * @param {Object} oConfigs The user configuration for the instance.
 */
Y.WireBase = function (cfg) {
   Y.WireBase.superclass.constructor.apply(this, arguments);
};

Y.WireBase.NAME = "wirebase";

Y.extend(Y.WireBase, Y.Path, {
   
   /**
    * Notify the WiresDeletates through addWire
    * @method initializer
    */
   initializer: function () {
      
      Y.WireBase.superclass.initializer.apply(this, arguments);
      
      var src = this.get('src'), tgt = this.get('tgt');
      
      if(src && src.get) {
         this.set('srcDir', src.get('dir') );
      }
      
      if(tgt && tgt.get) {
         this.set('tgtDir', tgt.get('dir') );
      }
      
      if(src && Y.Lang.isFunction (src.addWire) ) {
         src.addWire(this);
      }
      if(tgt && Y.Lang.isFunction (tgt.addWire) ) {
         tgt.addWire(this);
      }
      
   },
   
   
   /**
    * @method bindUI
    */
   bindUI: function () {
      Y.ArrowWire.superclass.bindUI.call(this);
      
      //this.after("bezierTangentNormChange", this._afterChangeRedraw, this);
      
      this.on('srcChange', function (e) {
         this.set('srcDir', e.newVal.get('dir') );
      }, this);
      
      this.on('tgtChange', function (e) {
         this.set('tgtDir', e.newVal.get('dir') );
      }, this);
      
   },
   
   
   /**
    * call removeWire on WiringsDelegate
    * @method destroy
    */
   destroy: function () {
      
      Y.WireBase.superclass.destroy.apply(this, arguments);
      
      var src = this.get('src'), tgt = this.get('tgt');
      
      if(src && Y.Lang.isFunction (src.removeWire) ) {
         src.removeWire(this);
      }
      if(tgt && Y.Lang.isFunction (tgt.removeWire) ) {
         tgt.removeWire(this);
      }
   },
   
   /**
    * Drawing method. Meant to be overriden by a plugin
    * @method _draw
    * @private
    */
   _draw: function () {
      //throw new Error("Y.Wire has no draw method. Consider using a plugin such as 'bezier-wire' in your YUI.use statement");
   },
   
   getOtherTerminal: function (term) {
      return (term == this.get('src')) ? this.get('tgt') : this.get('src');
   },
   
   // TODO:
   SERIALIZABLE_ATTRS: ["src","tgt"],
   toJSON: function () {
      return {};
   }
   
});


Y.WireBase.ATTRS = Y.merge(Y.Path.ATTRS, {
   
   /**
    * @attribute src
    */
   src: {
      value: null,
      setter: function (val) {
         //console.log("src setter", val, this);
         
         // remove this wire from the list of the previous src/tgt item
         // TODO: prev value
         /*if(e.prevVal && Y.Lang.isFunction (e.prevVal.removeWire) ) {
            e.prevVal.removeWire(this);
         }*/
         
         if(val && Y.Lang.isFunction (val.addWire) ) {
            val.addWire(this);
         }
         
         return val;
      }
   },
   
   /**
    * @attribute tgt
    */
   tgt: {
      value: null,
      setter: function (val) {
         //console.log("tgt setter", val, this);
         
         
         // remove this wire from the list of the previous src/tgt item
         // TODO: prev value
         /*if(e.prevVal && Y.Lang.isFunction (e.prevVal.removeWire) ) {
            e.prevVal.removeWire(this);
         }*/
         
         
         if(val && Y.Lang.isFunction (val.addWire) ) {
            val.addWire(this);
         }
         
         return val;
      }
   },
   
   /**
    * 
    * @attribute srcDir
    * @type Array
    * @default [1,0]
    */ 
   srcDir: {
      validator: Y.Lang.isArray,
      value: [1,0]
      // TODO: normalize ?
   },
   
   /**
    * TODO: normalize ?
    * @attribute tgtDir
    * @type Array
    * @default -srcDir
    */
   tgtDir: {
      validator: Y.Lang.isArray,
      valueFn: function () {
         var d = this.get('srcDir');
         return [-d[0],-d[1]];
      }
      // TODO: normalize ?
   }
   
});
