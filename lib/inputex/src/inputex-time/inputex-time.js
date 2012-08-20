/**
 * @module inputex-time
 */
YUI.add("inputex-time", function(Y){

   var lang = Y.Lang,
       inputEx = Y.inputEx;

/**
 * A field limited to number inputs (floating)
 * @class inputEx.TimeField
 * @extends inputEx.CombineField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.TimeField = function(options) {
   
   
   var h = [],i, m = [], secs = [], s;
   for(i = 0 ; i < 24 ; i++) { s="";if(i<10){s="0";} s+= i;h.push({ value: s });}
   for(i = 0 ; i < 60 ; i++) { s="";if(i<10){s="0";} s+= i;m.push({ value: s }); secs.push({ value: s });}
   options.fields = [
      {type: 'select', choices: h },
      {type: 'select', choices: m },
      {type: 'select', choices: secs }
   ];
   options.separators = options.separators || [false,":",":",false];
   inputEx.TimeField.superclass.constructor.call(this,options);
};

Y.extend(inputEx.TimeField, inputEx.CombineField, {   
   /**
    * Returns a string like HH:MM:SS
    * @method getValue
    * @return {String} Hour string
    */
   getValue: function() {
      var values = inputEx.TimeField.superclass.getValue.call(this);
      return values.join(':');
   },

   /**
    * Set the value 
    * @method setValue
    * @param {String} str Hour string (format HH:MM:SS)
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(str, sendUpdatedEvt) {
      inputEx.TimeField.superclass.setValue.call(this, str.split(':'), sendUpdatedEvt);
   }

});

// Register this class as "time" type
inputEx.registerType("time", inputEx.TimeField);


}, '3.1.0',{
requires: ['inputex-combine', 'inputex-select']
});
