/**
 * @module inputex-datetime
 */
YUI.add("inputex-datetime", function(Y) {

  var lang = Y.Lang,
      inputEx = Y.inputEx;

/**
 * A field limited to number inputs (floating)
 * @class inputEx.DateTimeField
 * @extends inputEx.CombineField
 * @constructor
 * @param {Object} options Added options
 * <ul>
 *    <li>dateFormat: same as DateField (deprecated, use "dateFieldOptions.dateFormat" instead)</li>
 *    <li>dateFieldOptions: options passed to the datepicker field</li>
 *    <li>timeFieldOptions: options passed to the time field</li>
 * </ul>
 */
inputEx.DateTimeField = function(options) {

   var datefield = {type: 'datepicker'},
       timefield = {type: 'time'};

   if(options.dateFieldOptions) {
      Y.mix (datefield, options.dateFieldOptions, true);
   }

   if(options.timeFieldOptions) {
      Y.mix (timefield, options.timeFieldOptions, true);
   }

   if(options.dateFormat) { // backward compatibility
      datefield.dateFormat = options.dateFormat;
   }

   options.fields = [datefield, timefield];

   options.separators = options.separators || [false, "&nbsp;&nbsp;", false];
   inputEx.DateTimeField.superclass.constructor.call(this,options);
};

Y.extend(inputEx.DateTimeField, inputEx.CombineField, {   
   /**
    * Concat the values to return a date
    * @method getValue
    * @return {Date} The javascript Date object
    */
   getValue: function() {
      var d = this.inputs[0].getValue();
      if( d == '' ) return null;
      var a = this.inputs[1].getValue().split(':');
      
      d.setHours(a[0]);
      d.setMinutes(a[1]);
      d.setSeconds(a[2]);
      
      return d;
   },

   /**
    * Set the value of both subfields
    * @method setValue
    * @param {Date} val Date to set
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
    */
   setValue: function(val, sendUpdatedEvt) {
      if(!lang.isObject(val)) {return;}
      var h = val.getHours();
      var m = val.getMinutes();
      var s = val.getSeconds();
      var time = ([(h < 10 ? '0':'')+h, (m < 10 ? '0':'')+m, (s < 10 ? '0':'')+s]).join(':');
      inputEx.DateTimeField.superclass.setValue.call(this, [val, time], sendUpdatedEvt);
   }

});



// Register this class as "time" type
inputEx.registerType("datetime", inputEx.DateTimeField);

}, '3.1.0',{
requires: ['inputex-combine']
});
