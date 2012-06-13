/**
 * @module inputex-url
 */
YUI.add("inputex-url",function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * Adds an url regexp, and display the favicon at this url
 * @class inputEx.UrlField
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 * <ul>
 *   <li>favicon: boolean whether the domain favicon.ico should be displayed or not (default is true, except for https)</li>
 * </ul>
 */
inputEx.UrlField = function(options) {
   inputEx.UrlField.superclass.constructor.call(this,options);
};

Y.extend(inputEx.UrlField, inputEx.StringField, {

   /**
    * Adds the invalid Url message
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.UrlField.superclass.setOptions.call(this, options);

      this.options.className = options.className ? options.className : "inputEx-Field inputEx-UrlField";
      this.options.messages.invalid = inputEx.messages.invalidUrl;
      this.options.favicon = lang.isUndefined(options.favicon) ? (("https:" == document.location.protocol) ? false : true) : options.favicon;
      this.options.size = options.size || 50;

      // validate with url regexp
      this.options.regexp = inputEx.regexps.url;
   },

   /**
    * Adds a img tag before the field to display the favicon
    */
   render: function() {
      inputEx.UrlField.superclass.render.call(this);
      this.el.size = this.options.size;

      if(!this.options.favicon) {
         Y.one(this.el).addClass( 'nofavicon');
      }

      // Create the favicon image tag
      if(this.options.favicon) {
         this.favicon = inputEx.cn('img', {src: inputEx.spacerUrl});
         this.fieldContainer.insertBefore(this.favicon,this.fieldContainer.childNodes[0]);

         // focus field when clicking on favicon
         Y.on("click",function(){this.focus();},this.favicon,this)
      }
   },

   setClassFromState: function() {
      inputEx.UrlField.superclass.setClassFromState.call(this);

      if(this.options.favicon) {
         // try to update with url only if valid url (else pass null to display inputEx.spacerUrl)
         this.updateFavicon((this.previousState == inputEx.stateValid) ? this.getValue() : null);
      }
   },


   updateFavicon: function(url) {
      var newSrc = url ? url.match(/https?:\/\/[^\/]*/)+'/favicon.ico' : inputEx.spacerUrl;
      if(newSrc != this.favicon.src) {

         // Hide the favicon
         inputEx.sn(this.favicon, null, {visibility: 'hidden'});

         // Change the src
         this.favicon.src = newSrc;

         // Set the timer to launch displayFavicon in 1s
         if(this.timer) { clearTimeout(this.timer); }
         var that = this;
         this.timer = setTimeout(function(){that.displayFavicon();}, 1000);
      }
   },

   /**
    * Display the favicon if the icon was found (use of the naturalWidth property)
    */
   displayFavicon: function() {
      inputEx.sn(this.favicon, null, {visibility: (this.favicon.naturalWidth!=0) ? 'visible' : 'hidden'});
   }


});

// Register this class as "url" type
inputEx.registerType("url", inputEx.UrlField, [
   { type: 'boolean', label: 'Display favicon', name:'favicon', value: true}
]);

},'3.0.0a',{
  requires: ["inputex-string"]
});
