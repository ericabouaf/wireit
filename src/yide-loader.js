YUI().use(function(Y) {

	/**
 	* YUI 3 module metadata
 	* @module wireit-loader
	 */
	var CONFIG = {
		groups: {
			'wireit': {
				base: '../src/',
				combine: false,
				modules: {
					 'canvas-node': {
					    'path': 'wire/canvas-node.js',
 				       'requires': ['node']
					 },
					 'container': {
 					    'path': 'wire/container.js',
  				       'requires': ['overlay','widget-parent','widget-child','dd','resize','persistable','better-plugins-extension','wires-delegate','terminal']
 					 },
 					 'image-container': {
  					    'path': 'wire/image-container.js',
   				       'requires': ['overlay','widget-parent','widget-child','dd','resize','persistable','better-plugins-extension','wires-delegate']
  					 },
  					 'layer': {
  					    'path': 'wire/layer.js',
   				       'requires': ['widget-parent','wires-delegate','container']
  					 },
  					 'persistable-plugin': {
 				        'path': 'wire/persistable-plugin.js',
 				        'requires': ['plugin']
 				    },
					 'persistable': {
				        'path': 'wire/persistable.js',
				        'requires': ['plugin']
				    },
				    'better-plugins-extension': {
  				        'path': 'wire/better-plugins-extension.js',
  				        'requires': ['plugin','widget']
  				    },
				    'terminal': {
 				        'path': 'wire/terminal.js',
  				        'requires': ['widget','widget-child','widget-position','persistable','better-plugins-extension','wires-delegate','widget-position-align']
 				    },
 				    'wire-bezier-plugin': {
 				        'path': 'wire/wire-bezier-plugin.js',
  				        'requires': ['wire','wire-canvas-plugin']
 				    },
 				    'wire-canvas-plugin': {
  				        'path': 'wire/wire-canvas-plugin.js',
   				        'requires': ['wire','persistable-plugin','canvas-node']
  				    },
  				    'wire-label-plugin': {
  				        'path': 'wire/wire-label-plugin.js',
   				        'requires': ['wire']
  				    },
  				    'wire-straight-plugin': {
  				        'path': 'wire/wire-straight-plugin.js',
   				     'requires': ['wire','wire-canvas-plugin']
  				    },
				    'wire': {
				        'path': 'wire/wire.js',
  				        skinnable: true,
 				        'requires': ['widget','widget-position','persistable','better-plugins-extension']
				    },
				    'wires-delegate': {
 				        'path': 'wire/wires-delegate.js',
  				        'requires': ['wire']
 				    }, 
 				    /**
 				     * IDE
 				     */
 				    /*'yide-css': {
  				       'path': 'yide/assets/ide-core.css',
    				    'type': 'css'
  				    },*/
  				    'yide': {
 				       'path': 'yide/core.js',
 				       skinnable: true,
   				    'requires': ['gallery-axo-layout', 'gallery-aui-skin-classic','resize'/*,'yide-css'*/]
 				    },
 				    'yide-helppanel': {
  				       'path': 'yide/helpPanel.js',
    				    'requires': ['yide', 'gallery-aui-dialog'/*, 'yide-menubar'*/]
  				    },
  				    /*'yide-menubar': {
   				    'path': 'yide/menuBar.js',
     				    'requires': ['yide', 'yui2-menu']
   				},*/
   				'yide-tabview': {
   				    'path': 'yide/tabView.js',
     				    'requires': ['yide','event-delegate','tabview']
   				},
   				'yide-toolbar': {
   				    'path': 'yide/toolbar.js',
     				    'requires': ['yide', 'gallery-aui-toolbar']
   				},
   				'yide-treeview': {
   				    'path': 'yide/treeView.js',
     				    'requires': ['yide', 'gallery-aui-tree-view']
   				},
   				'yide-accordionview': {
   				    'path': 'yide/accordionView.js',
     				    'requires': ['yide', 'gallery-accordion-horiz-vert']
   				},
   				'yide-layertab': {
   				   'path': 'yide/tabs/layerTab.js',
     				   'requires': ['yide','layer','wire-bezier-plugin','image-container']
   				},
      			'yide-chartstab': {
      			   'path': 'yide/tabs/chartsTab.js',
        			   'requires': ['yide','charts']
      			},
      			'yide-organizationtab': {
      			   'path': 'yide/tabs/organizationTab.js',
        			   'requires': ['yide','gallery-aui-tree-view']
      			}
				}
			}
		}
	};

	if(typeof YUI_config === 'undefined') { YUI_config = {}; }
	Y.mix(YUI_config, CONFIG);

});