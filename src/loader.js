YUI().use(function(Y) {
   
	var CONFIG = {
		groups: {
			'wireit': {
				base: 'wireit/src/',
				combine: false,
				modules: {
					
					// Wire
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
					
					
					// Terminal
					'terminal-base': {
						requires: ['widget','widget-child','widget-position','widget-position-align','wire-base', 'wires-delegate']
					},
					'terminal-dragedit': {
						requires: ['dd-drop', 'dd-drag','dd-proxy']
					},
					'terminal-scissors': {
						requires: ['overlay']
					},
					'terminal-ddgroups': {
						requires: ['terminal-dragedit']
					},
					'terminal': { // aka editable terminal
					    skinnable: true,
						requires: ['terminal-base', 'terminal-dragedit', 'terminal-scissors', 'terminal-ddgroups']
					},
					
					
					// Container
					'widget-icons': {
						requires: ['silk-sprites']
					},
					'container-base': {
					   requires: ['overlay','widget-parent','widget-child','dd','resize','terminal','wires-delegate']
					},
					'container': {
					   skinnable: true,
					   requires: ['container-base','widget-icons']
					},
					'image-container': {
						requires: ['container-base']
					},
					'inputex-wirable': {
					   requires: ['terminal','inputex-field']
					},
					'inputex-wirable-fields': {
					   requires: ['inputex-wirable','inputex-group','inputex-string','inputex-list']
					},
					'form-container': {
					   skinnable: true,
						requires: ['container','inputex-wirable-fields']
					},
					'inout-container': {
						requires: ['container']
					},
					'textarea-container': {
					   skinnable: true,
						requires: ['container']
					},
					
					// Layer
					'layer': {
						skinnable: true,
						requires: ['widget-parent','container','wires-delegate']
					},
					
					
					// App
					'wireit-app': {
						requires: ['app', 'handlebars', 'model', 'model-list', 'json', 'view', 'layer', 'bezier-wire', 'anim']
					},
					
					
					// Other
					'silk-sprites': {
						type: 'css',
						skinnable: true
					}
					
				}
			}
		}
	};

	if(typeof YUI_config === 'undefined') { 
	   YUI_config = {groups: {}}; 
	}
	else if(YUI_config.groups.inputex) {
	   
	   // inputex-wirable trick
	   // replace all 'inputex-field' dependencies in inputEx by 'inputex-wirable'
	   for(var k in YUI_config.groups.inputex.modules) {
	      if(YUI_config.groups.inputex.modules.hasOwnProperty(k)) {
   	      var m = YUI_config.groups.inputex.modules[k];
            if(m.requires) {
               var index = m.requires.indexOf('inputex-field');
               if(index != -1) {
                  m.requires[index] = 'inputex-wirable';
               }
            }
	      }
	   }
	   
	}
	Y.mix(YUI_config.groups, CONFIG.groups);

});
