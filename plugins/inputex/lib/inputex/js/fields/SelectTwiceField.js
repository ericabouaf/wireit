(function () {

	var Event = YAHOO.util.Event, lang = YAHOO.lang;

	/**
	 * Create a select field
	 * @class inputEx.SelectTwiceField
	 * @extends inputEx.Field
	 * @constructor
	 * @param {Object} options Added options:
	 * <ul>
	 *    <li>choices: contains the list of nested choices ([{ value: "", choices: [""] }, { value: "BMW Z Series", choices: ["Z1", "Z3", "Z4", "Z8"] }, ...])</li>
	 *    <li>valueSeperator: </li>
	 * </ul>
	 */
	inputEx.SelectTwiceField = function (options) {
		inputEx.SelectTwiceField.superclass.constructor.call(this, options);
		
		// Hack to init choices in second select (when no default value is provided)
		if (lang.isUndefined(this.options.value)) {
			this.setValue(this.getValue(), false);
		}
	};
	
	lang.extend(inputEx.SelectTwiceField, inputEx.Field, {
		
		
		/**
		 * Set the default values of the options
		 * @param {Object} options Options object as passed to the constructor
		 */
		setOptions: function (options) {
			
			inputEx.SelectTwiceField.superclass.setOptions.call(this, options);
			
			this.options.choices = lang.isArray(options.choices) ? options.choices : [];
			
			this.options.valueSeparator = options.valueSeparator || "_";
			
		},
	
	
		/**
		 * Build two select fields
		 */
		renderComponent: function () {
			
			var i, j, ilength, jlength, currentSubChoices, currentSubChoice, currentValue,
			    testValue, isDuplicateChoice, secondSelectChoices;
			
			
			// object used in updateSecondSelectChoices
			//
			//   * key   : string representing a value in 1st select
			//   * value : array of values available in 2nd select when key is selected in first select
			//
			this.valuesMatching = {};
			
			
			// helper to filter 2nd select choices to find duplicates
			isDuplicateChoice = function(elt, arrElt) {
				elt    = lang.isObject(elt)    ? elt.value    : elt;
				arrElt = lang.isObject(arrElt) ? arrElt.value : arrElt;
				return elt === arrElt;
			};
			
			// collect 2nd level choices + ensure uniqueness of values
			secondSelectChoices = [];
			
			for (i = 0, ilength = this.options.choices.length; i < ilength; i += 1) {
				
				currentValue = lang.isObject(this.options.choices[i]) ? this.options.choices[i].value : this.options.choices[i];
				currentSubChoices = this.options.choices[i].choices;
				
				this.valuesMatching[currentValue] = [];
				
				// maybe no sub choices ???
				if (currentSubChoices) {
					for (j = 0, jlength = currentSubChoices.length; j < jlength; j += 1) {
					
						currentSubChoice = currentSubChoices[j];
					
						testValue = lang.isObject(currentSubChoice) ? currentSubChoice.value : currentSubChoice;
					
						this.valuesMatching[currentValue].push(testValue);
					
						if (inputEx.indexOf(testValue, secondSelectChoices, isDuplicateChoice) === -1) {
							secondSelectChoices.push(currentSubChoices[j]);
						}
					
					}
				}
				
			}
			
			
			// create and store selects
			this.selects = [];
			this.selects.push(new inputEx.SelectField({ choices: this.options.choices }));
			this.selects.push(new inputEx.SelectField({ choices: secondSelectChoices }));
			
			// append <select>s to DOM tree
			this.fieldContainer.appendChild(this.selects[0].getEl());
			this.fieldContainer.appendChild(this.selects[1].getEl());
			
		},
		
		
		initEvents: function () {
			
			inputEx.SelectTwiceField.superclass.initEvents.call(this);
			
			
			// when first select is modified
			this.selects[0].updatedEvt.subscribe(function (e, args) {
				
				this.updateSecondSelectChoices(); // refresh list of choices in second select
				this.selects[1].fireUpdatedEvt(); // trigger global field update (see below)
				
			}, this, true);
			
			
			// when second select is modified
			this.selects[1].updatedEvt.subscribe(function (e, args) {
				
				// set field style
				this.setClassFromState();
				// fire field updatedEvt
				this.fireUpdatedEvt();
				
			}, this, true);
			
		},
		
		
		// adapt choices of 2nd select relatively to 1st select value
		updateSecondSelectChoices: function() {
			
			var i, length, choicesList, secondSelectValues, testValue;
			
			// allowed values in second select
			secondSelectValues = this.valuesMatching[this.selects[0].getValue()];
			
			// all choices in second select
			choicesList = this.selects[1].choicesList;
			
			for (i = 0, length = choicesList.length; i < length; i += 1) {
				
				testValue = choicesList[i].value;
				
				if (inputEx.indexOf(testValue, secondSelectValues) === -1) {
					this.selects[1].hideChoice({ position: i }, false); // no updatedEvt in case of clear (because multiple clear could happen...)
				} else {
					this.selects[1].showChoice({ position: i });
				}
				
			}
			
		},
		
		/**
		 * Set the value
		 * @param {String} value The value to set
		 * @param {boolean} [sendUpdatedEvt] (optional) Whether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
		 */
		setValue: function (value, sendUpdatedEvt) {
			
			var a, firstVal, secondVal, i;
			
			a = value.split(this.options.valueSeparator);
			
			this.selects[0].setValue(a[0], false);
			this.updateSecondSelectChoices();
			this.selects[1].setValue(a[1], false);
			
			// Call Field.setValue to set class and fire updated event
			inputEx.SelectTwiceField.superclass.setValue.call(this, value, sendUpdatedEvt);
		},
		
		
		/**
		 * Return the value
		 * @return {Any} the selected value
		 */
		getValue: function () {
			return this.selects[0].getValue() + this.options.valueSeparator + this.selects[1].getValue();
		},
		
		
		/**
		 * HACK because empty state value is this.options.valueSeparator
		 */
		getState: function() { 
			// if the field is empty :
			if( this.getValue() === this.options.valueSeparator ) {
				return this.options.required ? inputEx.stateRequired : inputEx.stateEmpty;
			}
			return this.validate() ? inputEx.stateValid : inputEx.stateInvalid;
		}
		
	});
	
	// Augment prototype with choice mixin (functions : addChoice, removeChoice, etc.)
	lang.augmentObject(inputEx.SelectTwiceField.prototype, inputEx.mixin.choice);
	
	
	// Register this class as "select" type
	inputEx.registerType("selecttwice", inputEx.SelectTwiceField, [
		{
			type: 'list',
			name: 'choices',
			label: 'Choices',
			elementType: {
				type: 'group',
				fields: [
					{ label: 'Value', name: 'value', value: '' }, // not required to allow '' value (which is default)
					{ label: 'Label', name: 'label' }, // optional : if left empty, label is same as value
					{ 
						type: 'list',
						name: 'choices',
						label: 'Choices',
						elementType: {
							type: 'group',
							fields: [
								{ label: 'Value', name: 'value', value: '' }, // not required to allow '' value (which is default)
								{ label: 'Label', name: 'label' } // optional : if left empty, label is same as value
							]
						},
						value: [],
						required: true
					}
				]
			},
			value: [],
			required: true
		}
	]);

}());