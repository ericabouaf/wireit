/**
 * @module inputex-multiselect
 */
YUI.add("inputex-multiselect", function (Y) {
   
   var inputEx = Y.inputEx,
       lang = Y.Lang;
   
    /**
     * Create a multi select field
     * @class inputEx.MultiSelectField
     * @extends inputEx.SelectField
     * @constructor
     * @param {Object} options Added options:
     * <ul>
     *    <li>choices: contains the list of choices configs ([{value:'usa'}, {value:'fr', label:'France'}])</li>
     * </ul>
     */
    inputEx.MultiSelectField = function (options) {
        inputEx.MultiSelectField.superclass.constructor.call(this, options);
    };

    Y.extend(inputEx.MultiSelectField, inputEx.SelectField, {

        /**
         * Build the DDList
         * @method renderComponent
         */
        renderComponent: function () {

            inputEx.MultiSelectField.superclass.renderComponent.call(this);

            this.ddlist = new inputEx.DDListField({
                parentEl: this.fieldContainer
            });

        },

        /**
         * Register the "change" event
         * @method initEvents
         */
        initEvents: function () {
            Y.on("change", this.onAddNewItem, this.el, this);
            this.ddlist.on("itemRemoved", this.onItemRemoved, this);
            this.ddlist.on("updated", this.fireUpdatedEvt, this);
        },

        /**
         * Re-enable the option element when an item is removed by the user
         * @method onItemRemoved
         */
        onItemRemoved: function (params) {

            this.showChoice({
                value: params
            });
            this.el.selectedIndex = 0;

            this.fireUpdatedEvt();

        },

        /**
         * Add an item to the list when the select changed
         * @method onAddNewItem
         */
        onAddNewItem: function () {

            var value, position, choice;

            if (this.el.selectedIndex !== 0) {
               
               // Get the selector value
               value = inputEx.MultiSelectField.superclass.getValue.call(this);
               
               position = this.getChoicePosition({
                  value: value
               });
               choice = this.choicesList[position];
               
               this.ddlist.addItem({
                  value: value,
                  label: choice.label
               });
               
               // hide choice that has just been selected (+ select first choice)
               this.hideChoice({
                  position: position
               });
               this.el.selectedIndex = 0;
               
               this.fireUpdatedEvt();
               
            }
        },

        /**
         * Set the value of the list
         * @method setValue
         * @param {String} value The value to set
         * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
         */
        setValue: function (value, sendUpdatedEvt) {

            var i, length, position, choice, ddlistValue = [];

            if (!lang.isArray(value)) {
                return;
            }

            // Re-show all choices
            for (i = 0, length = this.choicesList.length; i < length; i += 1) {
                this.showChoice({
                    position: i
                });
            }

            // Hide selected choices and fill ddlist value
            for (i = 0, length = value.length; i < length; i += 1) {

                position = this.getChoicePosition({
                    value: value[i]
                });
                choice = this.choicesList[position];

                ddlistValue.push({
                    value: choice.value,
                    label: choice.label
                });

                this.hideChoice({
                    position: position
                });
            }

            // set ddlist value
            this.ddlist.setValue(ddlistValue);

            // reset select to first choice
            this.el.selectedIndex = 0;

            if (sendUpdatedEvt !== false) {
                // fire update event
                this.fireUpdatedEvt();
            }
        },

        /**
         * Return the value
         * @method getValue
         * @return {Any} an array of selected values
         */
        getValue: function () {
            return this.ddlist.getValue();
        }

    });

    // Register this class as "multiselect" type
    inputEx.registerType("multiselect", inputEx.MultiSelectField);

}, '3.1.0', {
    requires: ["inputex-select", "inputex-ddlist"]
});