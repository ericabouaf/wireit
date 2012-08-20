YUI.add('yide-toolbar', function(Y) {
		
    var toolbar = function(args) {
        toolbar.superclass.constructor.apply(this, arguments);
    }

    toolbar.NAME = "toolbar";

    Y.extend(toolbar, Y.Base, {
        initializer: function(args) {
				
					var toolbar1 = new Y.Toolbar(
						{
							//activeState: true,
							children: [
								{label: 'Add', icon: 'plus'},
								{label: 'Remove', icon: 'minus'},
								{label: 'Config', icon: 'gear'}
							]
						}
					);
				
				toolbar1.render( Y.ide.topLayout.get('contentBox') );
				
				this.toolbar = toolbar1;
        }
    });

   Y.ide.register(toolbar);

}, '3.6.0', {requires: ['yide', 'gallery-aui-toolbar']});