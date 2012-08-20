YUI.add('yide-helppanel', function(Y) {

    var helpPanel = function(args) {
        helpPanel.superclass.constructor.apply(this, arguments);
    }

    helpPanel.NAME = "helpPanel";

    Y.extend(helpPanel, Y.Base, {
        initializer: function(args) {
								
				var dialog1 = new Y.Dialog({
	      		title: 'Help',
	      		bodyContent: 'Here the contextuel help !<br /><br />Welcome, <br />This is a small test',
	      		draggable: true,
	      		constrain2view: true,
	          	centered: true,
	      		width: 400,
	      		height: 250,
	      		modal: true
	      	}).render();
				
				dialog1.hide();
		
				// Adding an item to the menu
				/*Y.ide.menuBar.oMenuBar.addItems([
		           { text: "Help", onclick: { fn: function() { dialog1.show(); } } }
				]);*/
		
				// Adding an item to the toolbar
				Y.ide.toolbar.toolbar.add( {label: 'Help', icon: 'help', activeState: true, handler: { fn: function() { dialog1.show(); } } } );
				
        }
    });

   Y.ide.register(helpPanel);

}, '3.6.0', {requires: ['yide', 'gallery-aui-dialog'/*, 'yide-menubar'*/]});
