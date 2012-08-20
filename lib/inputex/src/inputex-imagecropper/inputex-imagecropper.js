/**
 * @module inputex-imagecropper
 */
YUI.add("inputex-imagecropper", function(Y){
   
   var lang    = Y.Lang,
       inputEx = Y.inputEx;

/**
 * Basic image cropper field.
 * Returns an object with the following properties :
 *   - origin <array> [x,y]
 *   - size   <array> [width, height]
 *
 * @class inputEx.ImageCropperField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *   <li>url: image url</li>
 *   <li>ratio: null or array like [width, height]</li>
 *   <li>minSize: null or array like [width, height]</li>
 *   <li>value: object, initial value. See returned value</li>
 *   <li>padding: integer, padding </li>
 * </ul>
 */
inputEx.ImageCropperField = function(options) {
   inputEx.ImageCropperField.superclass.constructor.call(this, options);
};

Y.extend(inputEx.ImageCropperField, inputEx.Field, {
   
   /**
    * Set the default values of the options
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.ImageCropperField.superclass.setOptions.call(this, options);
      this.options.url   = options.url;
      this.options.ratio = lang.isArray(options.ratio) ? (options.ratio[0] / options.ratio[1]) : null;
      this.options.padding = options.padding || 10;
      this.options.minSize = lang.isArray(options.minSize) ? options.minSize : [0,0];
   },

   /**
    * Render
    * @method renderComponent
    */
   renderComponent: function() {
      this.wrapEl = Y.Node.create('<div class="inputEx-ImageCropperField-wrapper" style="padding: '+this.options.padding+'px;" />');
      this.wrapEl.appendTo(this.fieldContainer);
      this.el = Y.Node.create('<img src="'+this.options.url+'" />');
      this.el.appendTo(this.wrapEl);

      this.mask = {};
      this.mask.n       = Y.Node.create('<div class="inputEx-ImageCropperField-mask inputEx-ImageCropperField-mask-n" style="top: 0; left: 0;"></div>').appendTo(this.wrapEl);
      this.mask.s       = Y.Node.create('<div class="inputEx-ImageCropperField-mask inputEx-ImageCropperField-mask-s" style="bottom: 0; left: 0;"></div>').appendTo(this.wrapEl);
      this.mask.e       = Y.Node.create('<div class="inputEx-ImageCropperField-mask inputEx-ImageCropperField-mask-e" style="right: 0; "></div>').appendTo(this.wrapEl);
      this.mask.w       = Y.Node.create('<div class="inputEx-ImageCropperField-mask inputEx-ImageCropperField-mask-w" style="left: 0;  "></div>').appendTo(this.wrapEl);
      this.mask.border  = Y.Node.create('<div class="inputEx-ImageCropperField-mask-border" style="left: 0;"></div>').appendTo(this.wrapEl);

      // Wait for the image to be downloaded, then retrieve its size
      this.el.on('load', function () {
         var region = this.el.get('region');
         this.imageSize = [region.width, region.height];
         this.setValue(this.options.value ? this.options.value : {origin: [0,0], size: this.imageSize}, false);
      }, this);
   },

   /**
    * Set the value
    * @method setValue
    */
   setValue: function (value, sendUpdatedEvt) {

      if (!this.imageSize) {
         return;
      }

      var cleanValue = this._constrain(Y.clone(value));

      var padding = this.options.padding,
          n = padding + cleanValue.origin[1],
          s = padding + cleanValue.origin[1] + cleanValue.size[1],
          e = padding + cleanValue.origin[0] + cleanValue.size[0],
          w = padding + cleanValue.origin[0],
          width  = (padding * 2) + this.imageSize[0],
          height = (padding * 2) + this.imageSize[1];

      this.value = cleanValue;

      this.mask.n.setStyles ({width: width, height: n});
      this.mask.s.setStyles ({width: width, height: height - s});
      this.mask.e.setStyles ({top: n, height: s - n, width: width - e});
      this.mask.w.setStyles ({top: n, height: s - n, width: w});
      this.mask.border.setStyles({top: n - 1, left: w - 1, width: cleanValue.size[0], height: cleanValue.size[1]});

      if(sendUpdatedEvt !== false) {
         this.fireUpdatedEvt();
      }
   },

   /**
    * @method getValue
    */
   getValue: function () {
      return this.value;
   },

   /**
    * @method initEvents
    */
   initEvents: function () {
      this.mask.border.on('mousedown', this._onMouseDown, this);
      this.wrapEl.on('mousedown', this._onMouseDown, this);
   },

   /**
    * @method _onMouseDown
    * @private
    */
   _onMouseDown: function (e) {
      e.halt(true);
      this.dragging    = (e.target === this.mask.border);
      this.imageOrigin = this.el.getXY();

      var clicOrigin = [e.pageX - this.imageOrigin[0],
                        e.pageY - this.imageOrigin[1]];

      if (!this.dragging) {
         this.firstOrigin = null;
         this.setValue({origin: clicOrigin, size: [1,1]}, false);
      }
      else {
         this.firstOrigin = clicOrigin;
      }

      Y.one(document).on('mousemove', this._onMouseMove, this);

      Y.one(document).once('mouseup', function (e) {
         Y.one(document).detach('mousemove', this._onMouseMove);
         this._onMouseMove(e); // setValue one last time
         this.fireUpdatedEvt();
      }, this);
   },

   /**
    * @method _onMouseMove
    * @private
    */
   _onMouseMove: function (e) {
      e.halt(true); // prevent text selection
      var imageOrigin = this.imageOrigin,
          oldOrigin = this.firstOrigin,
          relX = Math.min(this.imageSize[0], Math.max(0, e.pageX - imageOrigin[0])),
          relY = Math.min(this.imageSize[1], Math.max(0, e.pageY - imageOrigin[1])),
          dX = relX - oldOrigin[0],
          dY = relY - oldOrigin[1],
          newSize = [],
          newOrigin = [];

      if (this.dragging) {
         newSize = this.value.size;
         newOrigin[0] = this.value.origin[0] + dX;
         newOrigin[1] = this.value.origin[1] + dY;
         this.firstOrigin = [relX, relY];
      }
      else {
         newSize = [Math.abs(dX), Math.abs(dY)];
         newOrigin[0] = (dX < 0 ? relX : oldOrigin[0]);
         newOrigin[1] = (dY < 0 ? relY : oldOrigin[1]);
      }

      this.setValue({origin: newOrigin, size: newSize}, false);
   },
   
   /**
    * @method _contrain
    * @private
    */
   _constrain: function (value) {
      var r = this.options.ratio,
          i = this.imageSize,
          m = this.options.minSize,
          o = value.origin,
          s = value.size;

      // Match minSize if needed
      if (m) {
         s = [Math.min(i[0], Math.max(m[0], s[0])),
              Math.min(i[1], Math.max(m[1], s[1]))];
      }

      // Adjust size to match the ratio
      if (r) {
        if ((s[0] / s[1]) < r) {
           s[1] = Math.round(s[0] / r);
        }
        else {
           s[0] = Math.round(s[1] * r);
        }
      }

      // Adjust origin in case the size changed
      if (!this.dragging) {
         if (!this.firstOrigin) {
            // firstOrigin refers to the original clic position
            this.firstOrigin = [Math.max(0, Math.min(i[0], o[0])),
                                Math.max(0, Math.min(i[1], o[1]))];
         }
         else {
            if (o[0] < this.firstOrigin[0]) {
               o[0] = this.firstOrigin[0] - s[0];
            }
            if (o[1] < this.firstOrigin[1]) {
               o[1] = this.firstOrigin[1] - s[1];
            }
         }
      }

      // The real crop area origin isn't always equal to firstOrigin
      o[0] = Math.max(0, Math.min(i[0] - s[0], o[0]));
      o[1] = Math.max(0, Math.min(i[1] - s[1], o[1]));

      return {origin: o, size: s};
   }

});

// Register this class as "imagecropper" type
inputEx.registerType("imagecropper", inputEx.ImageCropperField);

}, '3.1.0',{
   requires: ["inputex-field"]
});
