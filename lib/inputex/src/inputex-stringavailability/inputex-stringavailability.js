/**
 * @module inputex-stringavailability
 */

 YUI.add("inputex-stringavailability",function(Y){


  var lang=Y.Lang,
      inputEx = Y.inputEx;

/**
 * String field that sends an Ajax request to check if it is available
 * it can be useful for email availability for example
 * @class inputEx.StringAvailability
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options 
 */
inputEx.StringAvailability = function(options) {
   inputEx.StringAvailability.superclass.constructor.call(this,options);
};

Y.extend(inputEx.StringAvailability, inputEx.StringField, {

   /**
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
    setOptions: function(options) {
      inputEx.StringAvailability.superclass.setOptions.call(this, options);
      
      // Server URI
      this.options.uri = options.uri;

      // Messages
      this.options.messages.stringLoading = (options.messages && options.messages.stringLoading) ? options.messages.stringLoading : inputEx.messages.stringLoading;
      this.options.messages.stringAvailable = (options.messages && options.messages.stringAvailable) ? options.messages.stringAvailable : inputEx.messages.stringAvailable;
      this.options.messages.stringUnAvailable = (options.messages && options.messages.stringUnAvailable) ? options.messages.stringUnAvailable : inputEx.messages.stringUnAvailable;
      this.options.messages.errorDataText = (options.messages && options.messages.errorDataText) ? options.messages.errorDataText : inputEx.messages.errorDataText;
      
      // Must hide default Msg to do it custom
      this.options.showMsg = false;
      
      // Status of AJAX
      this.isRequesting = false;
   },
   
   /**
    * @method render
    */
   render: function() {
      inputEx.StringAvailability.superclass.render.call(this);
      
      // Must do it after renderComponent else this.fieldContainer isn't attached to a DOM element
      // DOM.insertAfter(this.availabilityDiv, this.fieldContainer);

      Y.one(this.fieldContainer).insert(this.availabilityDiv,'after');

      

   },
   
   /**
    * @method renderComponent
    */
   renderComponent: function() {
      inputEx.StringAvailability.superclass.renderComponent.call(this);    
      
      this.availabilityDiv = inputEx.cn('div', {'className':'availabilityDiv'});
      this.availabilityDivIcon = inputEx.cn('div', {'className':'icon'});
      this.availabilityDivText = inputEx.cn('div', {'className':'text'});
      
      this.availabilityDiv.appendChild(this.availabilityDivIcon);
      this.availabilityDiv.appendChild(this.availabilityDivText);
      this.availabilityDiv.appendChild(inputEx.cn('div', {'className':'clear'}));
      
   },
   
   /**
    * @method initEvents
    */
   initEvents: function() {
      inputEx.StringAvailability.superclass.initEvents.call(this);
   },

   /**
    * @method onKeyPress
    */
   onKeyPress: function(e) {
      // Dont listen for TAB key
      if ( e.keyCode === 9 ) { return; }
      
      this.isRequesting = true;
      
      // Must do this to wait that value is updated (for the getValue())
      lang.later(0, this, function(){

      // If field is empty
      if(this.getValue() === ''){
         this.stopTimer();
         this.setAvailabilityState(this.options.required ? "required" : "none");
         return;
      }

      this.resetTimer();
      this.setAvailabilityState("loading");
      
   });
   },
   
   /**
    * @method resetTimer
    */
   resetTimer: function() {
      this.stopTimer();
      this.startTimer();
   },
   
   /**
    * @method startTimer
    */
   startTimer: function() {
      var that = this;
      this.timerId = setTimeout(function(){
         that.getAvailability(that.getValue());
      },500);
   },
   
   /**
    * @method stopTimer
    */
   stopTimer: function() {
      if(this.timerId){
         clearTimeout(this.timerId);
         delete this.timerId;
      }
   },
   
   /**
    * What to do when the string is available
    * @method onAvailable
    */
    onAvailable: function(){
      this.setAvailabilityState("available");
      this.isAvailable = true;
      this.isRequesting = false;
   },
   
   /**
    * What to do when the string is NOT available
    * @method onUnavailable
    */
    onUnavailable: function(){
      this.setAvailabilityState("unavailable");
      this.isAvailable = false;
      this.isRequesting = false;
   },
   /**
    * Problem during the request
    * @method onFailure
    */
   onFailure : function(){
      this.setAvailabilityState("fail");
      this.isAvailable = false;
      this.isRequesting = false;
   },

   /**
    * @method setAvailabilityState
    */
   setAvailabilityState: function(state) {

      if(state === "none"){
         this.availabilityDivText.innerHTML = '';
         Y.one(this.availabilityDiv).set('className','availabilityDiv');
         this.availabilityDiv.style.display = 'none';
         return;
      }
      else if(state === "loading"){
         this.availabilityDivText.innerHTML = this.options.messages.stringLoading;
      }
      else if(state === "available"){
         this.availabilityDivText.innerHTML = this.options.messages.stringAvailable;
      }
      else if(state === "unavailable"){
         this.availabilityDivText.innerHTML = this.options.messages.stringUnAvailable;
      }
      else if(state === "required"){
         this.availabilityDivText.innerHTML = this.options.messages.required;
      }
      else if(state === "fail"){
         this.availabilityDivText.innerHTML = this.options.messages.errorDataText;
      }
      
      // DOM.setAttribute(this.availabilityDiv, 'class', 'availabilityDiv '+state);
      Y.one(this.availabilityDiv).set('className','availabilityDiv'+' '+state);
      this.availabilityDiv.style.display = 'block';
      
   },
   
   /**
    * @method setClassFromState
    */
   setClassFromState: function(){
      inputEx.StringAvailability.superclass.setClassFromState.call(this);
      
      var state = this.getState();
      
      if(state === "required"){
         this.setAvailabilityState(state);
      }
   },
   
   /**
    * @method validate
    */
   validate: function() {

      // If AJAX request running
      if ( !!this.isRequesting ) { return false; }
      
      var valid = inputEx.StringAvailability.superclass.validate.call(this);
      if(!lang.isUndefined(this.isAvailable)){
         valid = this.isAvailable && valid;
      }
      
      return valid;
   },
   
   /**
    * Perform the Ajax request
    * @method getAvailability
    */
    getAvailability: function(string) {

var   that = this,
      requestConfiguration = {
         data : {
            "availabilityRequest" : string
         },
         on : {
             success: function(id, o) {   

            var obj = Y.JSON.parse(o.responseText);
            
            if(obj === "true" || !!obj){
               that.onAvailable();
            }
            else if(obj === "false" || !obj){
               that.onUnavailable();
            }
         },
         failure: function(id, o) {
            // TODO ?
            that.onFailure(o);
         }
         }
      };

      Y.io(this.options.uri,requestConfiguration);

   }
});

// Register this class as "string-availability" type
inputEx.registerType("string-availability", inputEx.StringAvailability);   


},'3.1.0',{requires : ["inputex-string","event-key","io","json-parse"]});