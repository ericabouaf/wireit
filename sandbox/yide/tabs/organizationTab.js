YUI.add('yide-organizationtab', function(Y) {

   
   /**
    *  OrganizationTab
    */
   Y.OrganizationTab = function() {
      Y.OrganizationTab.superclass.constructor.apply(this, arguments);
      
      this.after('render', this.renderTreeview, this, true);
   };
   
   Y.extend(Y.OrganizationTab, Y.Tab, {
      
      renderTreeview: function() {
         
         
         
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
				
			tree2.render(this.get('panelNode') );
         
         
      }
      
   });
   
   Y.OrganizationTab.NAME = "tab";


}, '3.6.0', {requires: ['yide', 'gallery-aui-tree-view']});
