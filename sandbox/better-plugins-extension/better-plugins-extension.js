YUI.add('better-plugins-extension', function(Y) {

/**
 * It is already possible in YUI to instanciate Y.Base derivated classes like this :
 *    
 *    new Y.MyBaseClass({
 *       ...,
 *       plugins: [
 *          {fn: Y.WireBezierPlugin, cfg:{} }
 *      ]
 *    })
 *
 *
 */
Y.BetterPluginsExtension = function(config) {};


Y.BetterPluginsExtension.prototype = {
	
	/**
	 * List of plugins configuration to use as default plugin.options
	 * You can override this in your class
	 * DEFAULT_PLUGINS: [
	 *   { ns: "WireBezierPlugin", cfg:{bezierTangentNorm: 30} }
	 * ]
	 * 
	 */
	DEFAULT_PLUGINS: [],
	
	/**
	 * Set default plugins config
	 */
	_initPlugins: function(config) {
	   
	   // TODO: not quite sure of this condition...
		if(!config || !config.plugins || config.plugins.length === 0) {
			config = {
				plugins: this.DEFAULT_PLUGINS
			};
			//console.log("better-plugins _initPlugins", config);
		}
		Y.Base.prototype._initPlugins.call(this, config);
	},
	
	/**
	 * Populates the "fn" plugin prototype from the "ns" string (like Children "type" attribute)
	 */
	plug: function(Plugin) {
		
		// Check "Plugin" is an object with "ns" string attribute
		if (Plugin && 
		    !Y.Lang.isArray(Plugin) && 
		    !Y.Lang.isFunction(Plugin) && 
			 !Y.Lang.isFunction(Plugin.fn) &&
		    Y.Lang.isString(Plugin.ns) ) {
				// Check Y[ns] is a plugin prototype
		   	if( Y.Lang.isFunction(Y[Plugin.ns]) ) {
		     		Plugin.fn = Y[Plugin.ns];
		   	}
		   	else {
		   	   console.log("Plugin '"+Plugin.ns+"' not found in Y");
		   	}
		}

 		Y.Base.prototype.plug.call(this, Plugin);
	}
	
};

}, '3.0.0a', {requires: ['plugin','widget']});
