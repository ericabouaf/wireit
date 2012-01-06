/**
 * JsonRpc Adapter (using ajax)
 * @class Y.WireIt.WiringEditor.adapters.JsonRpc
 * @static 
 */
Y.WireIt.WiringEditor.adapters.JsonRpc = {
	
	config: {
		url: '../../backend/php/WiringEditor.php'
	},
	
	init: function() {
		YAHOO.util.Connect.setDefaultPostHeader('application/json');
	},
	
	saveWiring: function(val, callbacks) {
		
		// Make a copy of the object
		var wiring = {};
		Y.mix(wiring, val);
		
		// Encode the working field as a JSON string
		wiring.working = Y.JSON.stringify(wiring.working);
		
		this._sendJsonRpcRequest("saveWiring", wiring, callbacks);
	},
	
	deleteWiring: function(val, callbacks) {
		this._sendJsonRpcRequest("deleteWiring", val, callbacks);
	},
	
	listWirings: function(val, callbacks) {
		this._sendJsonRpcRequest("listWirings", val, callbacks);
	},
	
	// private method to send a json-rpc request using ajax
	_sendJsonRpcRequest: function(method, value, callbacks) {
		var postData = Y.JSON.stringify({"id":(this._requestId++),"method":method,"params":value,"version":"json-rpc-2.0"});

		YAHOO.util.Connect.asyncRequest('POST', this.config.url, {
			success: function(o) {
				var s = o.responseText,
					 r = Y.JSON.parse(s);
					
				var wirings = r.result;
				
				for(var i = 0 ; i < wirings.length ; i++) {
					wirings[i].working = Y.JSON.parse(wirings[i].working);
				}
					
			 	callbacks.success.call(callbacks.scope, r.result);
			},
			failure: function() {
				callbacks.failure.call(callbacks.scope, r);
			}
		},postData);
	},
	_requestId: 1
};
