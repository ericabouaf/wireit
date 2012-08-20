YUI.add('yide-menubar', function(Y) {
		
    var menuBar = function(args) {
        menuBar.superclass.constructor.apply(this, arguments);
    }

    menuBar.NAME = "menuBar";

    Y.extend(menuBar, Y.Base, {
        initializer: function(args) {

	       var oMenuBar = new YAHOO.widget.MenuBar("menuContainer2", { 
	       	autosubmenudisplay: true, 
 				hidedelay: 750, 
	   		lazyload: true });

			 this.oMenuBar = oMenuBar;

	       oMenuBar.addItems([
	           { text: "File" },
	           { text: "Edit" },
	           { text: "View" },
	           { text: "Windows" }
	       ]);

	       var aSubmenuData = [
	           {
	               id: "file", 
	               itemdata: [ 
	                   { text: "New" },
	                   { text: "Open" },
	                   { text: "Save" },
	                   { text: "Save as" },
	                   { text: "Save all" },
	                   { text: "Settings" },
	                   { text: "Exit" }
	               ]
	           },

	           {
	               id: "edit", 
	               itemdata: [
	                   { text: "Undo" },
	                   { text: "Redo" },
	                   { text: "Cut" },
	                   { text: "Copy" },
	                   { text: "Paste" },
	                   { text: "Search" }
	               ]    
	           },

	           {
	               id: "view", 
	               itemdata: [
	                   { text: "Syntax Highlighting" }              
	               ] 
	           },
	           {
	               id: "windows",
	               itemdata: [
	                   { text: "Close tabs" }
	               ]
	           }                    
	       ];

	       oMenuBar.subscribe("beforeRender", function () {
			          var nSubmenus = aSubmenuData.length, i;
	           if (this.getRoot() == this) {
				          for (i = 0; i < nSubmenus; i++) {
	             	this.getItem(i).cfg.setProperty("submenu", aSubmenuData[i]);
				          }
	           }
	       });

	        oMenuBar.render('menuContainer');

        }
    });

   Y.ide.register(menuBar);

}, '3.6.0', {requires: ['yide', 'yui2-menu']});