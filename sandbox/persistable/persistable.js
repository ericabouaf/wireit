/**
 * TODO: split this class into persistable and a module 'default-plugins'
 */
YUI.add('persistable', function(Y) {

/**
 * Persistable is an exstension for Y.Widget to save a subset of attributes, to save
 * the state of the widget. It also saves the loaded plugin
 */
Y.Persistable = function(config) {};

//Y.Persistable.ATTRS = {};

Y.Persistable.prototype = {
	
	/**
	 * Expose only partial attributes (persistent ones only)
 	 * and add plugins attribute to form a JSON-compatible structure using the "ns" hack
	 * 
	 */
	// SERIALIZABLE
	PERSISTENT_ATTRS: [],
	
	/**
	 * Expose only partial attributes (persistent ones only)
	 * and add plugins attribute to form a JSON-compatible structure using the "ns" hack
	 */	
	getPersistentAttrs: function() {
		
		var o = {}, k, p;
		
		// standard persistent parameters filters
		Y.Array.each(this.PERSISTENT_ATTRS, function(attr) {
			o[attr] = this.get(attr);
		}, this);
		
		// Support for the BetterPluginsExtension : save plugins with persistable attributes
		o.plugins = [];
		for( k in this._plugins) {
			if(this._plugins.hasOwnProperty(k)) {
				p = { ns: this._plugins[k].NS };
				p.cfg = this[p.ns].getPersistentAttrs();
				o.plugins.push(p);
			}
		}
		return o;
	}
	
};
}, '3.0.0a', {requires: ['plugin']});
