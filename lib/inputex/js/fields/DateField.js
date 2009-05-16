(function() {
	
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
	
/**
 * @class A Date Field. 
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options Add the folowing options: 
 * <ul>
 *	   <li>dateFormat: default to 'm/d/Y'</li>
 * </ul>
 */
inputEx.DateField = function(options) {
	inputEx.DateField.superclass.constructor.call(this,options);
};
	
lang.extend(inputEx.DateField, inputEx.StringField, 
/**
 * @scope inputEx.DateField.prototype   
 */   
{
	/**
	 * Adds the 'inputEx-DateField' default className
	 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
	 */
   setOptions: function(options) {
   	inputEx.DateField.superclass.setOptions.call(this, options);
   	
   	// Overwrite options
   	this.options.className = options.className ? options.className : 'inputEx-Field inputEx-DateField';
   	this.options.messages.invalid = inputEx.messages.invalidDate;
   	
   	// Added options
   	this.options.dateFormat = options.dateFormat || inputEx.messages.defaultDateFormat;
   },
	   
	/**
	 * Specific Date validation depending of the 'format' option
	 */
	validate: function() {
	   var value = this.el.value;
	   var ladate = value.split("/");
	   if( ladate.length != 3) { return false; }
	   if ( isNaN(parseInt(ladate[0],10)) || isNaN(parseInt(ladate[1],10)) || isNaN(parseInt(ladate[2],10))) { return false; }
	   var formatSplit = this.options.dateFormat.split("/");
	   var yearIndex = inputEx.indexOf('Y',formatSplit);
	   if (ladate[yearIndex].length!=4) { return false; } // Avoid 3-digits years...
	   var d = parseInt(ladate[ inputEx.indexOf('d',formatSplit) ],10);
	   var Y = parseInt(ladate[yearIndex],10);
	   var m = parseInt(ladate[ inputEx.indexOf('m',formatSplit) ],10)-1;
	   var unedate = new Date(Y,m,d);
	   var annee = unedate.getFullYear();
	   return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
	},
	
	   
	/**
	 * Format the date according to options.dateFormat
	 * @param {Date} val Date to set
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(val, sendUpdatedEvt) {
	
	   // Don't try to parse a date if there is no date
	   if( val === '' ) {
	      inputEx.DateField.superclass.setValue.call(this, '', sendUpdatedEvt);
	      return;
	   }
	   var str = "";
	   // DATETIME
	   if (val instanceof Date) {
	      str = this.options.dateFormat.replace('Y',val.getFullYear());
	      var m = val.getMonth()+1;
	      str = str.replace('m', ((m < 10)? '0':'')+m);
	      var d = val.getDate();
	      str = str.replace('d', ((d < 10)? '0':'')+d);
	   } 
	   // else date must match this.options.dateFormat
	   else {
	     str = val;
	   }
	
	   inputEx.DateField.superclass.setValue.call(this, str, sendUpdatedEvt);
	},
	   
	/**
	 * Return value in DATETIME format (use getFormattedValue() to have 04/10/2002-like format)
	 * @return {Date} The javascript Date object
	 */
	getValue: function() {
	   // let parent class function check if typeInvite, etc...
	   var value = inputEx.DateField.superclass.getValue.call(this);

	   // Hack to validate if field not required and empty
	   if (value === '') { return '';}
	   
	   //var ladate = this.el.value.split("/");
	   var ladate = value.split("/");
	   var formatSplit = this.options.dateFormat.split('/');
	   var d = parseInt(ladate[ inputEx.indexOf('d',formatSplit) ],10);
	   var Y = parseInt(ladate[ inputEx.indexOf('Y',formatSplit) ],10);
	   var m = parseInt(ladate[ inputEx.indexOf('m',formatSplit) ],10)-1;
	   return (new Date(Y,m,d));
	}

});
	
// Specific message for the container
inputEx.messages.invalidDate = "Invalid date, ex: 03/27/2008";
	
/**
 * Register this class as "date" type
 */
inputEx.registerType("date", inputEx.DateField);
	
})();