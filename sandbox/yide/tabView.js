YUI.add('yide-tabview', function(Y) {
   
   /**
    * Removeable (or closable) Tabs
    */
   var Removeable = function(config) {
      Removeable.superclass.constructor.apply(this, arguments);
   };

   Removeable.NAME = 'removeableTabs';
   Removeable.NS = 'removeable';

   Y.extend(Removeable, Y.Plugin.Base, {
       REMOVE_TEMPLATE: '<a class="yui3-tab-remove" title="remove tab">x</a>',

       initializer: function(config) {
           var tabview = this.get('host'),
               cb = tabview.get('contentBox');

           cb.addClass('yui3-tabview-removeable');
           cb.delegate('click', this.onRemoveClick, '.yui3-tab-remove', this);

           // Tab events bubble to TabView
           tabview.after('tab:render', this.afterTabRender, this);
       },

       afterTabRender: function(e) {
           // boundingBox is the Tab's LI
           e.target.get('boundingBox').append(this.REMOVE_TEMPLATE);
       },

       onRemoveClick: function(e) {
           e.stopPropagation();
           var tab = Y.Widget.getByNode(e.target);
           tab.remove();
       }
   });
   
	
	
	/**
	 * The tabView controller
	 */	
    var tabView = function(args) {
        tabView.superclass.constructor.apply(this, arguments);
    }

    tabView.NAME = "tabView";

    Y.extend(tabView, Y.Base, {
        initializer: function(args) {
	
				var tabview = new Y.TabView({
				        children: [{
				            label: 'Home',
				            content: '<p>Home0 content</p>'
				        }],
				        
				        plugins: [Removeable]
				});
				    
				tabview.render( Y.ide.centerLayout.get('contentBox') );
				
				Y.ide.centerLayout.after('heightChange', function(e) {
				   var s = e.newVal.substr(0,e.newVal.length-2);
				   var h = parseInt(s,10)-55;
				   Y.ide.tabView.tabview.get('panelNode').setStyle('height', h);
				});
				
				this.tabview = tabview;
        }
    });
    
    

   Y.ide.register(tabView);

}, '3.6.0', {requires: ['yide','event-delegate','tabview']});
