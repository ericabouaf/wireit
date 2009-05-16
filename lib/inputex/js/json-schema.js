(function() {
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;
 
/**
 * Namespace containing utility functions for conversion between inputEx JSON format and JSON Schema
 *
 * based on "Json Schema Proposal Working Draft":
 * http://groups.google.com/group/json-schema/web/json-schema-proposal-working-draft
 * The proposal is still under discussion and the implementation is very minimalist.
 *
 *
 * TODO:
 *    - we should provide a lot of json schema examples and instances that should/should not validate
 *    - use the $ref (async calls => provide callbacks to methods)
 *    - Inheritance
 *
 * Limitations:
 *    - ??? Please do not trust inputEx: the getValue may return a value which do NOT validate the schema (provide an example ?)
 *    - no tuple typing for arrays
 *    - no "Union type definition"
 *
 * @class JsonSchema
 * @static
 * @namespace inputEx
 */
inputEx.JsonSchema = {
   
   /**
    * Convert the inputEx JSON fields to a JSON schema
    */
   inputExToSchema: function(inputExJson) {
      // TODO :P
   }

};


/**
 * 
 * @class Builder
 * @namespace inputEx.JsonSchema
 */
inputEx.JsonSchema.Builder = function(options) {
	
	var options = options || {};
	this.options  = options; 
	
	/**
	 * specify how other schema properties are mapped to inputParam properties
	 */
	this.schemaToParamMap = options.schemaToParamMap || {
		'title':'label',
		'description':'description',
		'_inputex':null	// null value means copy child key/value pairs into inputParams directly
	};
	
	/**
	 * @property referenceResolver
	 */
	this.referenceResolver = options.referenceResolver || null;
	
	/**
	 * options to be applied to inputParams unless already specified
	 * @property defaultOptions
	 */
	this.defaultOptions = options.defaultOptions || {};	
	
	/**
	 * key is reference, value is schema
	 * @property schemaIdentifierMap
	 */
	this.schemaIdentifierMap = options.schemaIdentifierMap || {};
};

inputEx.JsonSchema.Builder.prototype = {
   
   /** 
 	 * return a schema based on the reference value
 	 * default is to look up in map
 	 * @method defaultReferenceResolver
    */
	defaultReferenceResolver:function(reference) {
		return this.schemaIdentifierMap[reference] || null;
	},
	
	/**
	 * Convert a JSON schema to inputEx JSON
	 * @method schemaToInputEx
	 * @param {JSONSchema} p
	 */
	schemaToInputEx:function(p, propertyName) {
	
	   var fieldDef = {inputParams: { label: propertyName, name: propertyName} };
	   var schemaMap = this.schemaToParamMap;
    	var referencedSchema = p["$ref"]; 
	    
	    if(referencedSchema){
	    	var new_schema = null;
	    	if(this.referenceResolver) {
		       new_schema = this.referenceResolver(referencedSchema);
		    }
	    	if(new_schema === null) {
	    		new_schema = this.defaultReferenceResolver(referencedSchema);
	    	}
	    	if(new_schema === null) {
	    		throw "Schema for property :"+propertyName+" $references "+referencedSchema+', not found';
	    	}
	    	// copy options into new schema, for example we can overide presentation
	    	// of a defined schema depending on where it is used
	    	new_schema = lang.merge(new_schema);	// copy new_schema
	    	
	    	for(var pk in p) {
	    		if(p.hasOwnProperty(pk) && lang.isUndefined(new_schema[pk]) && pk != '$ref') {
	    			new_schema[pk] = p[pk];
	    		}
	    	}
	    	p = new_schema;
	    }

	    if(!p.optional) {
	    	fieldDef.inputParams.required = true;
	    }

	    for(var key in schemaMap) {
	        if(schemaMap.hasOwnProperty(key)) {
	      	  var paramName = schemaMap[key]; 
	      	  var v = p[key];
	      	  if(!lang.isUndefined(v)) {
	      		  if(paramName === null) {
	      			  // copy / merge values from v directly into inputParams
	      			  if(lang.isObject(v)) {
	      				  // v must be an object, copy key/value pairs into inputParams
	      				  for(var vkey in v) {
	      					  if(v.hasOwnProperty(vkey)) {
	      						  fieldDef.inputParams[vkey] = v[vkey];
	      					  }
	      				  }
	      			  }
	      		  } else {
	      			  fieldDef.inputParams[paramName] = v;
	      		  }
	      	  }
	        }
	    }
	    if(p.type) {	       
	       var type = p.type;
	       
	       // If type is a "Union type definition", we'll use the first type for the field
	       // "array" <=>  [] <=> ["any"]
	       if(lang.isArray(type)) {
	          if(type.length === 0 || (type.length == 1 && type[0] == "any") ) {
	             type = "array";
	          }
	          else {
	             type = type[0];
	          }
	       }
	       else if(lang.isObject(type) ) {
	          // What do we do ??
	          //console.log("type is an object !!");
	       }
	       
	       fieldDef.type = type;
	       
	       // default value
	       if( !lang.isUndefined(p["default"]) ) {
	          fieldDef.inputParams.value = p["default"];
	       }
	    
	       if(type == "array" ) {
	          fieldDef.type = "list";
	          if(lang.isObject(p.items) && !lang.isArray(p.items)) {
	        	  // when items is an object, it's a schema that describes each item in the list
	        	  fieldDef.inputParams.elementType = this.schemaToInputEx(p.items, propertyName);
	          }
	       }
	       else if(type == "object" ) {
	          fieldDef.type = "group";
	          if(p.title && lang.isUndefined(fieldDef.inputParams.legend)) {
	        	  fieldDef.inputParams.legend = p.title; 
	          }
	          //fieldDef.inputParams = this.schemaToInputEx(p, propertyName);
	          //fieldDef.inputParams = this._parseSchemaProperty(p, propertyName);
	          var fields = [];
	          if(propertyName) {
	        	  fieldDef.inputParams.name = propertyName;
	          }
	
	          for(var key in p.properties) {
	             if(p.properties.hasOwnProperty(key)) {
	                fields.push( this.schemaToInputEx(p.properties[key], key) );
	             }
	          }
	
	          fieldDef.inputParams.fields = fields;
	          
	       }
	       else if(type == "string" && p["enum"] ) {
	          fieldDef.type = "select";
	          
	          if(p.options) {
  	             fieldDef.inputParams.selectOptions = [];
     	          fieldDef.inputParams.selectValues = [];
	             for(var i = 0 ; i < p.options.length ; i++) {
	                var o = p.options[i];
	                fieldDef.inputParams.selectOptions[i] = o.label;
	                fieldDef.inputParams.selectValues[i] = o.value;
	             }
             }
             else {
    	          fieldDef.inputParams.selectValues = p["enum"];
             }
	       }
	       else if(type == "string") {
	    	  if(!lang.isUndefined(p.pattern) && lang.isUndefined(fieldDef.inputParams.regexp)) {
	    		  if(lang.isString(p.pattern)) {
	    			  fieldDef.inputParams.regexp = new RegExp(p.pattern);
	    		  } else {
	    			  fieldDef.inputParams.regexp = p.pattern;
	    		  }
	    	  }
	    	  if(!lang.isUndefined(p.maxLength) && lang.isUndefined(fieldDef.inputParams.maxLength)) {
	    		  fieldDef.inputParams.maxLength = p.maxLength; 
	    	  }

	    	  if(!lang.isUndefined(p.minLength) && lang.isUndefined(fieldDef.inputParams.minLength)) {
	    		  fieldDef.inputParams.minLength = p.minLength; 
	    	  }

	    	  if(!lang.isUndefined(p.readonly) && lang.isUndefined(fieldDef.inputParams.readonly)) {
	    		  fieldDef.inputParams.readonly = p.readonly; 
	    	  }

           // According to http://groups.google.com/group/json-schema/web/json-schema-possible-formats
	          if( p.format ) {
	             if(p.format == "html") {
	                fieldDef.type = "html";
	             } else if(p.format == "date") {
	                fieldDef.type = "date";
	                fieldDef.inputParams.tooltipIcon = true;
	             } else if(p.format == 'url') {
	            	 fieldDef.type = 'url';
	             } else if(p.format == 'email') {
	            	 fieldDef.type = 'email';
	             } else if(p.format == 'text') {
	            	 fieldDef.type = 'text';
	             } else if(p.format == 'time') {
	                fieldDef.type = 'time';
	             } else if(p.format == 'ip-address') {
    	             fieldDef.type = 'IPv4';
    	          } else if(p.format == 'color') {
    	             fieldDef.type = 'color';
    	          }
	          }
	       }
	    }
	    
	    // Add the defaultOptions
	    for(var kk in this.defaultOptions) {
	        if(this.defaultOptions.hasOwnProperty(kk) && lang.isUndefined(fieldDef.inputParams[kk])) {
	        	fieldDef.inputParams[kk] = this.defaultOptions[kk]; 
	        }	    	
	    }
	    return fieldDef;
	},

   /**
    * Create an inputEx Json form definition from a json schema instance object
    * Respect the "Self-Defined Schema Convention"
    * @method formFromInstance
    */
   formFromInstance: function(instanceObject) {
      if(!instanceObject || !instanceObject["$schema"]) {
         throw new Error("Invalid json schema instance object. Object must have a '$schema' property.");
      }
      
      var formDef = this.schemaToInputEx(instanceObject["$schema"]);
      
      // Set the default value of each property to the instance value
      for(var i = 0 ; i < formDef.fields.length ; i++) {
         var fieldName = formDef.fields[i].inputParams.name;
         formDef.fields[i].inputParams.value = instanceObject[fieldName];
      }
      
      return formDef;
   }
   
};




})();