/**
 * @module inputex-ipv4
 */
YUI.add("inputex-ipv4",function(Y){
	
   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * Adds an IPv4 address regexp
 * @class inputEx.IPv4Field
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.IPv4Field = function(options) {
	inputEx.IPv4Field.superclass.constructor.call(this,options);
};
Y.extend(inputEx.IPv4Field, inputEx.StringField, {
   
   /**
    * set IPv4 regexp and invalid string
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.IPv4Field.superclass.setOptions.call(this, options);
      this.options.messages.invalid = inputEx.messages.invalidIPv4;
      this.options.regexp = /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/;
   }
  
});

// Register this class as "IPv4" type
inputEx.registerType("IPv4", inputEx.IPv4Field, []);

},'3.1.0',{
  requires: ["inputex-string"]
});
