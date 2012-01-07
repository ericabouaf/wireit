YUI().use(function(Y) {
   
	var CONFIG = {
		groups: {
			'wireit': {
				base: 'wireit/src/',
				combine: false,
				modules: {
					
					/**
					 * Wire
					 */
					'wire-base': {
					    skinnable: true,
					    requires: ['widget','widget-position']
					},
					'canvas-node': {
					   requires: ['node']
					},
					'canvas-wire': {
					    requires: ['wire-base','canvas-node']
					},
					'bezier-wire': {
					    requires: ['canvas-wire']
					},
					'wire': {
						requires: ['canvas-wire']
					},
					'wires-delegate': {
					    requires: ['wire-base']
					},
					
					
					/**
					 * Terminal
					 */
					'terminal-base': {
						requires: ['widget','widget-child','widget-position','widget-position-align','wires-delegate']
					},
					'terminal-proxy': {
					   requires: ['dd-drag','dd-proxy']
					},
					'scissors': {
					   requires: []
					},
					'terminal': { // aka editable terminal
					    skinnable: true,
						requires: ['terminal-base', 'dd-drop','wire-base','terminal-proxy','scissors','overlay']
					},
					
					
					/**
					 * Container
					 */
					'container-base': {
					   requires: ['overlay','widget-parent','widget-child','dd','resize','terminal','wires-delegate']
					},
					'container': {
					   skinnable: true,
					   requires: ['container-base']
					},
					'image-container': {
						requires: ['container-base']
					},
					'form-container': {
						requires: ['container-base','inputex'],
					},
					
					/**
					 * Layer
					 */
					'layer': {
					  requires: ['widget-parent','container','wires-delegate']
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
					requires: ['gallery-axo-layout', 'gallery-aui-skin-classic','resize'/*,'yide-css'*/]
					},
					'yide-helppanel': {
					   'path': 'yide/helpPanel.js',
					    requires: ['yide', 'gallery-aui-dialog'/*, 'yide-menubar'*/]
					},
					/*'yide-menubar': {
					'path': 'yide/menuBar.js',
					    requires: ['yide', 'yui2-menu']
					},*/
					'yide-tabview': {
						'path': 'yide/tabView.js',
						requires: ['yide','event-delegate','tabview']
					},
					'yide-toolbar': {
						'path': 'yide/toolbar.js',
						requires: ['yide', 'gallery-aui-toolbar']
					},
					'yide-treeview': {
						'path': 'yide/treeView.js',
						requires: ['yide', 'gallery-aui-tree-view']
					},
					'yide-accordionview': {
						'path': 'yide/accordionView.js',
						requires: ['yide', 'gallery-accordion-horiz-vert']
					},
					'yide-layertab': {
						'path': 'yide/tabs/layerTab.js',
						requires: ['yide','layer','bezier-wire','image-container']
					},
					'yide-chartstab': {
						'path': 'yide/tabs/chartsTab.js',
						requires: ['yide','charts']
					},
					'yide-organizationtab': {
						'path': 'yide/tabs/organizationTab.js',
						requires: ['yide','gallery-aui-tree-view']
					}

				}
			}
		}
	};

	if(typeof YUI_config === 'undefined') { YUI_config = {groups: {}}; }
	Y.mix(YUI_config.groups, CONFIG.groups);

});
