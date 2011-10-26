/**
 * Gears Adapter (using http://gears.google.com)
 * @class WireIt.WiringEditor.adapters.Gears
 * @static 
 */
WireIt.WiringEditor.adapters.WebStorage = {
	
	config: {
		dbName: 'wirings'
	},
	
	init: function() {
    
	  this.db = openDatabase(this.config.dbName, "0.1", "The Wirings", 20000);
	  if(!this.db)
      throw new Error("Unable to connect to DB :( ");
    this.db.transaction(
        function(tx) {
            tx.executeSql("SELECT COUNT(*) FROM wirings", [], null,
                function(tx, error) {
                    tx.executeSql("CREATE TABLE wirings (name text, working text, language text)", [], null, null);
                }
            );                    
        }
    );
	},
	
	saveWiring: function(val, callbacks) {
    this.db.transaction(
        function(tx) {
            tx.executeSql('SELECT * FROM wirings WHERE name=? AND language=?', [val.name, val.language],
                function(tx, r) {
            	    if( r.rows.length == 0 ) {
              			tx.executeSql('INSERT INTO wirings VALUES (?, ?, ?)', [val.name, JSON.stringify(val.working), val.language],
                        function(tx, result) {
                      		  callbacks.success.call(callbacks.scope, result.rows);
                        }, null);
                  }
                  else {
              			tx.executeSql('UPDATE wirings SET working=? WHERE name=? AND language=?', [JSON.stringify(val.working), val.name, val.language],
                        function(tx, result) {
                      		  callbacks.success.call(callbacks.scope, result.rows);
                        }, null);
                  }
                }, 
                null
            );
        }
    );
	},
	
	deleteWiring: function(val, callbacks) {
    this.db.transaction(
      function(tx) {
          tx.executeSql("DELETE FROM wirings WHERE name=? and language=?", [val.name, val.language],
              function(tx, result) {
            		  callbacks.success.call(callbacks.scope, result.rows);
              }, null);
          }
    );
	},
	
	listWirings: function(val, callbacks) {
    this.db.transaction(
      function(tx) {
          tx.executeSql("SELECT * FROM wirings WHERE language=?", [val.language],
              function(tx, result) {
                  var res= [];
                  for(var i=0;i<result.rows.length; i++) {
                    var resItem= {
                      name : result.rows.item(i).name,
                      language : result.rows.item(i).language,
                      working : JSON.parse(result.rows.item(i).working)
                    };
                    res.push( resItem );
                  }
            		  callbacks.success.call(callbacks.scope, res);
              }, null);
          }
    );
	}
};
