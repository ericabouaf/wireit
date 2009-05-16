/**
 * Build a form to run a service !
 * built for yui-rpc
 * @namespace inputEx
 * @method generateServiceForm
 * @param {function} method A method created through YAHOO.rpc.Service
 * @param {Object} formOpts
 */
inputEx.generateServiceForm = function(method, formOpts, callback) {
   
   var options = null;
   if(YAHOO.lang.isObject(formOpts) && YAHOO.lang.isArray(formOpts.fields) ) {
      options = {
         inputParams: formOpts
      };
   }
   // create the form directly from the method params
   else {
      options = inputEx.formForMethod(method);
   	// Add user options from formOpts
      YAHOO.lang.augmentObject(options.inputParams, formOpts, true);
   }
   
   // Add buttons to launch the service
   options.type = "form";
   if(!options.inputParams.buttons) {
      options.inputParams.buttons = [
         {type: 'submit', value: method.name, onClick: function(e) {
            YAHOO.util.Event.stopEvent(e);
            form.showMask();
            method(form.getValue(), {
               success: function(results) {
                  form.hideMask();
                  if(YAHOO.lang.isObject(callback) && YAHOO.lang.isFunction(callback.success)) {
            		   callback.success.call(callback.scope || this, results);
            		}
               },
               failure: function() {
                  form.hideMask();
               }
            });
         }}
      ];
   }
   
   var form = YAHOO.inputEx(options);
   
   return form;
};


/**
 * Return the inputEx form options from a method
 * @namespace inputEx
 * @method formForMethod
 * @param {function} method A method created through YAHOO.rpc.Service
 */
inputEx.formForMethod = function(method) {
   
   // convert the method parameters into a json-schema :
   var schemaIdentifierMap = {};
   schemaIdentifierMap[method.name] = {
       id: method.name,
       type:'object',
       properties:{}
   };
   for(var i = 0 ; i < method._parameters.length ; i++) {
      var p = method._parameters[i];
      schemaIdentifierMap[method.name].properties[p.name] = p;
   }
   
   // Use the builder to build an inputEx form from the json-schema
   var builder = new YAHOO.inputEx.JsonSchema.Builder({
	  'schemaIdentifierMap': schemaIdentifierMap,
	  'defaultOptions':{
	     'showMsg':true
	  }
   });
	var options = builder.schemaToInputEx(schemaIdentifierMap[method.name]);
	
	return options;
};