/**
 * @module inputex-serialize
 */
YUI.add("inputex-serialize", function(Y){

  var lang = Y.Lang,
      inputEx = Y.inputEx;
      
/**
 * SerializeField allows to serialize/deserialize a complex sub-group to a string
 * @class inputEx.SerializeField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options  Standard inputEx options definition
 */
inputEx.SerializeField = function(options) {
   inputEx.SerializeField.superclass.constructor.call(this, options);
   
};

Y.extend(inputEx.SerializeField, inputEx.Field, {
	
	/**
    * Adds some options: subfield & serializer
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.SerializeField.superclass.setOptions.call(this, options);
      this.options.className = options.className || 'inputEx-SerializedField';

		this.options.subfield = options.subfield || {type: 'string'};
		this.options.serializer = options.serializer || "json";
	},
	
   /**
    * Render the subfield
    * @method renderComponent
    */
   renderComponent: function() {
	
      this.subfieldWrapper = inputEx.cn('div', {className: "inputEx-SerializedField-SubFieldWrapper"});
      this.fieldContainer.appendChild( this.subfieldWrapper );
      
		var config = {parentEl: this.subfieldWrapper};
		Y.mix(config, this.options.subfield);
      this.subField = inputEx( config, this);
   },

	/**
	 * Subscribe the subField
	 * @method initEvents
	 */
	initEvents: function() {
      inputEx.SerializeField.superclass.initEvents.call(this); 
      this.subField.on('updated', this.fireUpdatedEvt, this, true);
   },

	/**
	 * Use the subField getValue and serialize it with the selected serializing method
	 * @method getValue
	 */
	getValue: function() {
		var val = this.subField.getValue();
		return this.serialize(val);
	},
	
	/**
	 * Use the deserialize method and set the value of the subField
	 * @method setValue
	 */
	setValue: function(sValue, sendUpdatedEvt) {
		var obj = this.deserialize(sValue);
		this.subField.setValue(obj, sendUpdatedEvt);
	},
	
	/**
	 * Use the configured serializer
	 * @method serialize
	 */
	serialize: function(o) {
		return inputEx.SerializeField.serializers[this.options.serializer].serialize(o);
	},
	
	/**
	 * Use the configured deserializer
	 * @method deserialize
	 */
	deserialize: function(sValue) {
		return inputEx.SerializeField.serializers[this.options.serializer].deserialize(sValue);
	},
	
	/**
	 * Sets the focus on this field
	 * @method focus
	 */
	focus: function() {
		this.subField.focus();
	}
	
});

/**
 * Default serializers for the SerializeField
 * @class inputEx.SerializeField.serializers
 * @static
 */
inputEx.SerializeField.serializers = {

	/**
	 * JSON Serializer
	 * @class inputEx.SerializeField.serializers.json
	 * @static
	 */
	json: {
		
		/**
		 * serialize to JSON
		 * @method serialize
		 * @static
		 */
		serialize: function(o) {
			return Y.JSON.stringify(o);
		},

		/**
		 * deserialize from JSON
		 * @method deserialize
		 * @static
		 */
		deserialize: function(sValue) {
			return Y.JSON.parse(sValue);
		}
	},
	
	/**
	 * XML Serializer (uses the ObjTree library)
    * @class inputEx.SerializeField.serializers.xml
	 * @static
	 */
	xml: {
		
		/**
		 * serialize to XML
		 * @method serialize
		 * @static
		 */
		serialize: function(o) {
			if(!XML || !Y.Lang.isFunction(XML.ObjTree) ) {
				alert("ObjTree.js not loaded.");
				return null;
			}
			var xotree = new XML.ObjTree();
			return xotree.writeXML(o);
		},

		/**
		 * deserialize from XML 
		 * @method deserialize
		 * @static
		 */
		deserialize: function(sValue) {
			if(!XML || !Y.Lang.isFunction(XML.ObjTree) ) {
				alert("ObjTree.js not loaded.");
				return null;
			}
			var xotree = new XML.ObjTree();
         var tree = xotree.parseXML( sValue );
			return tree;
		}
	}/*,
	
	flatten: {
		serialize: function(o) {
			// TODO: 
		},

		deserialize: function(sValue) {
			// TODO: 
		}
	}*/
	
};


// Register this class as "serialize" type
inputEx.registerType("serialize", inputEx.SerializeField, [
	{ type:'type', label: 'SubField', name: 'subfield'},
	{ type:'select', name: 'serializer', label: 'Serializer', choices: [{ value: 'json' }, { value: 'xml' }/*, { value: 'flatten' }*/], value: 'json'}
]);

},'3.1.0',{
  requires: ["inputex-string",'json']
});
