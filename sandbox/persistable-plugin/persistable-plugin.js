YUI.add('persistable-plugin', function(Y) {

Y.PersistablePlugin = function(config) {
	Y.PersistablePlugin.superclass.constructor.call(this, config);
};

//Y.PersistablePlugin.ATTRS = {};

Y.extend( Y.PersistablePlugin, Y.Plugin.Base, {
	
	PERSISTENT_ATTRS: [],

	getPersistentAttrs: function() {
		var o = {}; 
		Y.Array.each(this.PERSISTENT_ATTRS, function(attr) {
			o[attr] = this.get(attr);
		}, this);
		return o;
	}

});

}, '3.5.0pr1a', {requires: ['plugin']});
