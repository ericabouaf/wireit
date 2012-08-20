/**
 * @module inputex-textautotag
 */
 (function() {
  
/**
 * Create a textarea input
 * @class inputEx.TextAutoTag
 * @extends inputEx.Textarea
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>rows: rows attribute</li>
 *	   <li>cols: cols attribute</li>
 * </ul>
 */
 inputEx.TextAutoTag = function(options) {
  inputEx.TextAutoTag.superclass.constructor.call(this,options);
  this.on('updated', this.handleUpdate,this,true);
};
  Y.extend(inputEx.TextAutoTag, inputEx.Textarea, {
                    
      /**
      * Set the specific options (autotagservice)
      * @method setOptions
      * @param {Object} options Options object as passed to the constructor
      */
      setOptions: function(options) {
                    inputEx.TextAutoTag.superclass.setOptions.call(this, options);
                    
                    // options textKey, define the key of the text, in the api request (see getTags)
                    this.textKey = options.textKey || "context";
                    
                    // we cache values to avoid to much request (see doWeRequest)
                    this.tmpWordsCount = 0;
                    this.service = new inputEx.RPC.Service(options.smd || "yuiExtractor.smd",{ success: this.initAutoTag, scope:this });
                    this.autoTagMethodName = options.autoTagMethodName || "requestTags";
                    this.tagEl = typeof(options.tagEl) == "string" ? document.getElementById(options.tagEl): options.tagEl;
      },
      /**
      * @method initAutoTag
      */
      initAutoTag: function(){
        this.serviceReady = true;
      },
      /**
      * @method addTags
      */
      addTags: function(results){
        this.tagEl.appendChild(inputEx.cn("span",null,null,results.ResultSet.Result.join(",")));
      },
      /**
      * Set the specific options (autotagservice)
      * @method getTags
      * @param {Object} options Options object as passed to the constructor
      */      
      getTags: function(text,callback){
        if(this.serviceReady){
              this.service[this.autoTagMethodName]({context: this.getValue()},callback);
        }

      
      },
     /**
      * handleUpadte
      * @method handleUpdate
      */                    
      handleUpdate: function() {
         // TODO : cache function to not call api every time
        var value = this.getValue();
        if (this.doWeRequest(value)){
          var callback = {
            success: function(results) {
                this.addTags(results);
              },
            failure: function(o) {
                    // log or try to understand error
              },
              scope: this
              };          
          this.getTags(value,callback);
        }
        
      },
      /**
      * @method handleResponse
      */     
      handleResponse: function(a,b,c,d){
        console.log(this,"callback",a,b,c,d);
      },
      /**
      * Decide wether or not we request
      * @method doWeRequest
      * @param {string} updated text 
      * @return {boolean}
      */       
      doWeRequest : function(value){
        // count words in value
        var wordsCount = value.split(' ').length;
        if (true){ // five should be changed or passed as parameter
          this.tmpWordsCount = wordsCount;
          return true;
        }
        return false;
      }
});
  
  // Register this class as "text" type
  inputEx.registerType("autotag", inputEx.Textarea);
  
  })();