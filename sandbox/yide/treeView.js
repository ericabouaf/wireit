YUI.add('yide-treeview', function(Y) {
		
    var treeview = function(args) {
        treeview.superclass.constructor.apply(this, arguments);
    }

    treeview.NAME = "treeview";

    Y.extend(treeview, Y.Base, {
        initializer: function(args) {	
				
				var tree2 = new Y.TreeViewDD({
						boundingBox: '#tree2',
						io: {
							url: 'assets/content.html'
						},
						children: [
							{ label: 'Folder 1', children: [ { label: 'file' }, { label: 'file' }, { label: 'file' } ] },
							{ label: 'Folder 2', expanded: true, children: [ { label: 'file' }, { label: 'file' } ] },
							{ label: 'Folder 3', children: [ { label: 'file' } ] },
							{ label: 'Folder 4', expanded: true, children: [ { label: 'Folder 4-1', expanded: true, children: [ { label: 'file' } ] } ] },
							{ label: 'Folder 5', type: 'io', expanded: false }
						],
						type: 'file',
						width: 200
					});
					
				tree2.render( Y.ide.leftLayout.get('contentBox') );				
					
				console.log(Y.ide.leftLayout.getAttrs());
        }
    });

   Y.ide.register(treeview);

}, '3.6.0', {requires: ['yide', 'gallery-aui-tree-view']});
