(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class A field limited to number inputs (floating)
 * @extends inputEx.CombineField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.TimeField = function(options) {
   
   
   var h = [];
   for(var i = 0 ; i < 24 ; i++) { var s="";if(i<10){s="0";} s+= i;h.push(s);}
   var m = [];
   var secs = [];
   for(var i = 0 ; i < 60 ; i++) { var s="";if(i<10){s="0";} s+= i;m.push(s);secs.push(s);}
   options.fields = [
      {type: 'select', inputParams: {selectOptions: h, selectValues: h} },
      {type: 'select', inputParams: {selectOptions: m, selectValues: m} },
      {type: 'select', inputParams: {selectOptions: secs, selectValues: secs} }
   ];
   options.separators = options.separators || [false,":",":",false];
   inputEx.TimeField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.TimeField, inputEx.CombineField, 
/**
 * @scope inputEx.TimeField.prototype   
 */
{   
   /**
    * Returns a string like HH:MM:SS
    * @return {String} Hour string
    */
   getValue: function() {
      var values = inputEx.TimeField.superclass.getValue.call(this);
      return values.join(':');
   },

   /**
    * Set the value 
    * @param {String} str Hour string (format HH:MM:SS)
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(str, sendUpdatedEvt) {
      inputEx.TimeField.superclass.setValue.call(this, str.split(':'), sendUpdatedEvt);
   }

});

/**
 * Register this class as "time" type
 */
inputEx.registerType("time", inputEx.TimeField);

})();