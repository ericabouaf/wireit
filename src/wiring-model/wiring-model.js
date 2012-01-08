YUI.add('wiring-model', function(Y) {

function LocalStorageSync(key) {
    var localStorage;

    if (!key) {
        Y.error('No storage key specified.');
    }

    if (Y.config.win.localStorage) {
        localStorage = Y.config.win.localStorage;
    }

    // Try to retrieve existing data from localStorage, if there is any.
    // Otherwise, initialize `data` to an empty object.
    var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

    // Delete a model with the specified id.
    function destroy(id) {
        var modelHash;

        if ((modelHash = data[id])) {
            delete data[id];
            save();
        }

        return modelHash;
    }

    // Generate a unique id to assign to a newly-created model.
    function generateId() {
        var id = '',
            i  = 4;

        while (i--) {
            id += (((1 + Math.random()) * 0x10000) | 0)
                    .toString(16).substring(1);
        }

        return id;
    }

    // Loads a model with the specified id. This method is a little tricky,
    // since it handles loading for both individual models and for an entire
    // model list.
    //
    // If an id is specified, then it loads a single model. If no id is
    // specified then it loads an array of all models. This allows the same sync
    // layer to be used for both the TodoModel and TodoList classes.
    function get(id) {
        return id ? data[id] : Y.Object.values(data);
    }

    // Saves the entire `data` object to localStorage.
    function save() {
        localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
    }

    // Sets the id attribute of the specified model (generating a new id if
    // necessary), then saves it to localStorage.
    function set(model) {
        var hash        = model.toJSON(),
            idAttribute = model.idAttribute;

        if (!Y.Lang.isValue(hash[idAttribute])) {
            hash[idAttribute] = generateId();
        }

        data[hash[idAttribute]] = hash;
        save();

        return hash;
    }

    // Returns a `sync()` function that can be used with either a Model or a
    // ModelList instance.
    return function (action, options, callback) {
        // `this` refers to the Model or ModelList instance to which this sync
        // method is attached.
        var isModel = Y.Model && this instanceof Y.Model;

        switch (action) {
        case 'create': // intentional fallthru
        case 'update':
            callback(null, set(this));
            return;

        case 'read':
            callback(null, get(isModel && this.get('id')));
            return;

        case 'delete':
            callback(null, destroy(isModel && this.get('id')));
            return;
        }
    };
}


// -- WiringModel ---------------------------------------------------------------------
Y.WiringModel = Y.Base.create('wiringModel', Y.Model, [], {
	
	sync: LocalStorageSync('wireit-app'),
	
	// The `id` attribute for this Model will be an alias for `name`.
	//idAttribute: 'name'
}, {
	ATTRS: {
		id: {value: null},
		name       : {value: null},
		containers   : {value: null},
		description: {value: null},
		wires   : {value: 0}
	}
});


// -- WiringModelList ---------------------------------------------------------------------

Y.WiringModelList = Y.Base.create('wiringModelList', Y.ModelList, [], {
	
	sync: LocalStorageSync('wireit-app'),
	
    model    : Y.WiringModel
});



// -- WiringList View ------------------------------------------------------------

Y.WiringListView = Y.Base.create('wiringListView', Y.View, [], {
	
    template: Y.Handlebars.compile(Y.one('#t-wiring-list').getContent()),

    render: function () {
        var wirings = this.get('wirings'),
            wiringsData, content;

        // Iterates over all `Repo` models in the list and retrieves each model
        // instance's data as a simple JSON structs and collects it in an array.
        wiringsData = wirings.map(function (wiring) {

            var data = wiring.toJSON();

            // Add proper pluralized labels for numerical data fields.
            //addLabel(data, 'watchers', 'Watcher');
            //addLabel(data, 'forks', 'Fork');

            return data;
        });

        // Applies the `RepoList` data to the RepoList Template and sets the
        // resulting HTML as the contents of this view's container.
        content = this.template({wirings: wiringsData});
        this.get('container').setContent(content);

        return this;
    }
}, {
	ATTRS: {

	    // These attributes will be used by the app to hold its current state,
	    // and they will be accessed and modified by our route-handlers.
		wirings: {
			value: new Y.WiringModelList()
		}
	}
});

}, '3.5.0pr1a', {requires: ['model', 'model-list', 'json', 'view']});
