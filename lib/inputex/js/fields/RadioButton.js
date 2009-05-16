(function() {
    var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

    /**
     * @class Create a YUI Radio button. Here are the added options :
     * <ul>
     *    <li>choices: list of choices (array of string)</li>
     *    <li>values: list of returned values (array )</li>
     *    <li>allowAny: add an option with a string field</li>
     * </ul>
     * @extends inputEx.RadioField
     * @constructor
     * @param {Object} options inputEx.Field options object
     */
    inputEx.RadioButton = function(options) {
        inputEx.RadioButton.superclass.constructor.call(this, options);
    };

    lang.extend(inputEx.RadioButton, inputEx.RadioField,
        /**
         * @scope inputEx.RadioButton.prototype
         */
    {
      

    });

    /**
     * Register this class as "radio" type
     */
    inputEx.registerType("radiobutton", inputEx.RadioButton);

})();