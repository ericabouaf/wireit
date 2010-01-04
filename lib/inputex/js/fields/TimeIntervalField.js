(function() {

   var Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * A field limited to number inputs (floating)
 * @class inputEx.TimeIntervalField
 * @extends inputEx.CombineField
 * @constructor
 * @param {Object} options Added options
 * <ul>
 *    <li>unit: inputEx.TimeIntervalField.units.MYUNIT (SECOND,MINUTE,HOUR,DAY,MONTH,YEAR)</li>
 * </ul>
 */
inputEx.TimeIntervalField = function(options) {
   inputEx.TimeIntervalField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.TimeIntervalField, inputEx.CombineField, {   
   
   /**
    * Additional options
    */
   setOptions: function(options) {
      
      inputEx.TimeIntervalField.superclass.setOptions.call(this,options);
      
      var units = inputEx.TimeIntervalField.units;
      var unitsStr = inputEx.messages.timeUnits;
      
      this.options.unit = options.unit || units.SECOND;
      
      
      var n=[]; for(var i=1;i<=60;i++){ n.push(i); }
      
      this.options.fields = options.fields || [
         {type: 'select', inputParams: { selectValues: n }},
         {type: 'select', inputParams: { 
            selectOptions: [unitsStr.SECOND, unitsStr.MINUTE, unitsStr.HOUR, unitsStr.DAY, unitsStr.MONTH, unitsStr.YEAR], 
            selectValues: [units.SECOND, units.MINUTE, units.HOUR, units.DAY, units.MONTH, units.YEAR] 
         } }
      ];
      
      this.options.separators = options.separators || [false, "&nbsp;&nbsp;", false];
   },
   
   /**
    * Concat the values to return a date
    * @return {Integer} the time interval in the field unit
    */
   getValue: function() {
      var v = inputEx.TimeIntervalField.superclass.getValue.call(this);
      return (parseInt(v[0],10)*v[1])/this.options.unit;
   },

   /**
    * Set the value of both subfields
    * @param {Number} val The time interval integer (with the given unit)
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(val, sendUpdatedEvt) {
      var seconds = (typeof val == "string" ? parseFloat(val,10) : val)*this.options.unit;
      var units = inputEx.TimeIntervalField.units;
      var selectedUnit,n;
      
      if(seconds < units.SECOND) {
         selectedUnit = units.SECOND;
         n=1;
      }
      else {
         if(seconds >= units.SECOND && seconds < units.MINUTE) {
            selectedUnit = units.SECOND;
         }
         else if(seconds >= units.MINUTE && seconds < units.HOUR) {
            selectedUnit = units.MINUTE;
         }
         else if(seconds >= units.HOUR && seconds < units.DAY) {
            selectedUnit = units.HOUR;
         }
         else if(seconds >= units.DAY && seconds < units.MONTH) {
            selectedUnit = units.DAY;
         }
         else if(seconds >= units.MONTH && seconds < units.YEAR) {
            selectedUnit = units.MONTH;
         }
         else { // seconds >= units.YEAR
            selectedUnit = units.YEAR;
         }
         n=Math.floor(seconds/selectedUnit);
      }
      
      inputEx.TimeIntervalField.superclass.setValue.call(this, [n, selectedUnit], sendUpdatedEvt);
   }

});

inputEx.TimeIntervalField.units = {
   SECOND: 1,
   MINUTE: 60,
   HOUR: 3600,
   DAY: 86400,
   MONTH: 2592000,
   YEAR: 31536000
};

inputEx.messages.timeUnits = {
   SECOND: "seconds",
   MINUTE: "minutes",
   HOUR: "hours",
   DAY: "days",
   MONTH: "months",
   YEAR: "years"
};

// Register this class as "timeinterval" type
inputEx.registerType("timeinterval", inputEx.TimeIntervalField);

})();