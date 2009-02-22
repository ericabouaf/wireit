/**
 * Provide SMD support 
 * http://groups.google.com/group/json-schema/web/service-mapping-description-proposal
 * Not implemented: REST envelope, TCP/IP transport 
 *
 * @namespace YAHOO.rpc
 */
YAHOO.namespace("rpc");

(function() {
   
   var rpc = YAHOO.rpc, lang = YAHOO.lang, util = YAHOO.util;

/**
 * Take a string as a url to retrieve an smd or an object that is an smd or partial smd to use 
 * as a definition for the service
 * @class YAHOO.rpc.Service
 * @constructor
 */
YAHOO.rpc.Service = function(smd, callback) {

   if( lang.isString(smd) ) {
      this.smdUrl = smd;
      this.fetch(smd, callback);
   }
   else if( lang.isObject(smd) ) {
      this._smd = smd;
      this.process(callback);
   }
   else {
      throw new Error("smd should be an object or an url");
   }
   
};


YAHOO.rpc.Service.prototype = {
   
   /**
    * Generate the function from a service definition
    * @method _generateService
    * @param {String} serviceName
    * @param {Method definition} method
    */
   _generateService: function(serviceName, method) {
      
      if(this[method]){
			throw new Error("WARNING: "+ serviceName+ " already exists for service. Unable to generate function");
		}
		method.name = serviceName;
	
		var self = this;
		var func = function(data, opts) {
		   var envelope = rpc.Envelope[method.envelope || self._smd.envelope];
		   var callback = {
   	      success: function(o) {
               var results = envelope.deserialize(o);
      	      opts.success.call(opts.scope || self,results);
   	      },
   	      failure: function(o) {
   	         if(lang.isFunction(opts.failure) ) {
   	            opts.failure.call(opts.scope || self, {error: "unable to transport"});
   	         }
   	      },
   	      scope: self
   	   };
   	   
   	   
   	   var params = {};
   	   if(self._smd.additionalParameters && lang.isArray(self._smd.parameters) ) {
   	      for(var i = 0 ; i < self._smd.parameters.length ; i++) {
   	         var p = self._smd.parameters[i];
   	         params[p.name] = p["default"];
   	      }
   	   }
   	   lang.augmentObject(params, data, true);
   	   
   	   var url = method.target || self._smd.target;
   	   var urlRegexp = /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i;
   	   if(!url.match(urlRegexp) && url != self._smd.target) {
   	      url = self._smd.target+url;
   	   }
   	   
	      if( !!this.smdUrl && !url.match(urlRegexp) ) {
   	      // URL is still relative !
   	      var a=this.smdUrl.split('/');
   	      a[a.length-1]="";
   	      url = a.join("/")+url;
   	   }
   	   
   	   
         var r = {
            target: url,
            callback: callback,
            data: params,
            origData: data,
            opts: opts,
            callbackParamName: method.callbackParamName || self._smd.callbackParamName,
            transport: method.transport || self._smd.transport
         };
   	   var serialized = envelope.serialize(self._smd, method, params);
         lang.augmentObject(r, serialized, true);
         
   	   rpc.Transport[r.transport].call(self, r ); 
		};
		
		func.name = serviceName;
		func.description = method.description;
		func._parameters = method.parameters;
		
		return func;
   },
   
   /**
    * Process the SMD definition
    * @method process
    */
   process: function(callback) {
      
      var serviceDefs = this._smd.services;
      
      // Generate the methods to this object
		for(var serviceName in serviceDefs){
		   if( serviceDefs.hasOwnProperty(serviceName) ) {
		      
		      // Get the object that will contain the method.
		      // handles "namespaced" services by breaking apart by '.'
			   var current = this;
			   var pieces = serviceName.split("."); 
			   for(var i=0; i< pieces.length-1; i++){
				   current = current[pieces[i]] || (current[pieces[i]] = {});
			   }
			   
			   current[pieces[pieces.length-1]] =	this._generateService(serviceName, serviceDefs[serviceName]);
		   }
		}
		
		// call the success handler
		if(lang.isObject(callback) && lang.isFunction(callback.success)) {
		   callback.success.call(callback.scope || this);
		}
		
   },
   
   /**
    * Download the SMD at the given url
    * @method fetch
    * @param {String} Absolute or relative url
    */
   fetch: function(url, callback) {
      
      /**
       * TODO: if url is not in the same domain, we should use jsonp !
       */
      
      util.Connect.asyncRequest('GET', url, { 
         success: function(o) {
            try {
               this._smd = lang.JSON.parse(o.responseText);
               this.process(callback);
            }
            catch(ex) {
               if(lang.isObject(console) && lang.isFunction(console.log))
                  console.log(ex);
               if( lang.isFunction(callback.failure) ) {
                  callback.failure.call(callback.scope || this, {error: ex});
               }
            }
         }, 
         failure: function(o) {
            if( lang.isFunction(callback.failure) ) {
               callback.failure.call(callback.scope || this, {error: "unable to fetch url "+url});
            }
         },
         scope: this
      });
   }
   
    
};




YAHOO.rpc.Service._requestId = 1;


/**
 * @namespace YAHOO.rpc.Transport
 */
YAHOO.rpc.Transport = {
   
   "POST": function(r) {
      return util.Connect.asyncRequest('POST', r.target, r.callback, r.data );
   },
   
   "GET": function(r) {
      return util.Connect.asyncRequest('GET', r.target + (r.data ? '?'+  r.data : ''), r.callback, '');
   },
   
   "REST": function(r) {
      // TODO
   },
   
   jsonp_id: 0,
   "JSONP": function(r) {
		r.callbackParamName = r.callbackParamName || "callback";
		var fctName = encodeURIComponent("YAHOO.rpc.Transport.JSONP.jsonpCallback"+YAHOO.rpc.Transport.jsonp_id);
		YAHOO.rpc.Transport["JSONP"]["jsonpCallback"+YAHOO.rpc.Transport.jsonp_id] = function(results) {
      	if(lang.isObject(r.callback) && lang.isFunction(r.callback.success)) {
      	   r.callback.success.call(r.callback.scope || this, results);
      	}
		};
   	YAHOO.rpc.Transport.jsonp_id+=1;
      return util.Get.script( r.target + ((r.target.indexOf("?") == -1) ? '?' : '&') + r.data + "&"+r.callbackParamName+"="+fctName);
   },
   
   "TCP/IP": function(r) {
      throw new Error("TCP/IP transport not implemented !");
   }
   
};


/**
 * @namespace YAHOO.rpc.Envelope
 */
YAHOO.rpc.Envelope = {
   
   "URL":  {
         serialize: function(smd, method, data) {
            var eURI = encodeURIComponent;
            var params = [];
            for(var name in data){
         	   if(data.hasOwnProperty(name)){
            	   var value = data[name];
            		if(lang.isArray(value)){
            			for(var i=0; i < value.length; i++){
            				params.push(eURI(name)+"="+eURI(value[i]));
            			}
            		}else{
            			params.push(eURI(name)+"="+eURI(value));
            		}
            	}
            }
            return {
   				data: params.join("&")
            };   
         },
         deserialize: function(results) {
            return results;
         }
   },
   
   "PATH": {
        serialize: function(smd, method, data) {
     			var target = method.target || smd.target, i;
     			if(lang.isArray(data)){
     				for(i = 0; i < data.length;i++){
     					target += '/' + data[i];
     				}
     			}else{
     				for(i in data){
     				   if(data.hasOwnProperty(i)) {
     					   target += '/' + i + '/' + data[i];
  					   }
     				}
     			}
           return {
              data: '',
              target: target
           };   
        },
        deserialize: function(results) {
           return results;
        }
    },
    
   "JSON": {
       serialize: function(smd, method, data) {
          return {
             data: lang.JSON.stringify(data)
          };   
       },
       deserialize: function(results) {
          return results;
       }
    },
   
   "JSON-RPC-1.0":  {
       serialize: function(smd, method, data) {
          return {
             data: lang.JSON.stringify({
       	      "id": rpc.Service._requestId++,
       	      "method": method.name,
       	      "params": data
       	   })
          };   
       },
       deserialize: function(results) {
          return lang.JSON.parse(results.responseText);
       }
    },
   
   "JSON-RPC-2.0": {
      serialize: function(smd, method, data) {
         return {
            data: lang.JSON.stringify({
      	      "id": rpc.Service._requestId++,
      	      "method": method.name,
      	      "version": "json-rpc-2.0",
      	      "params": data
      	   })
         };   
      },
      deserialize: function(results) {
         return lang.JSON.parse(results.responseText);
      }
   }
   
};

})();
