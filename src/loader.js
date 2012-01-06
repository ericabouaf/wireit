YUI().use(function(Y) {
   
	var CONFIG = {
		groups: {
			'wireit': {
				base: 'wireit/src/',
				combine: false,
				modules: {
				   'wireit': {
				      requires: ['node']
				   },
				   'wireit-wire': {
						requires: ['wireit','wireit-canvas-element']
					},
				   'wireit-terminal': {
						requires: ['dd-drop','wireit','wireit-wire','wireit-terminal-proxy','wireit-scissors']
					},
					'wireit-canvas-element': {
					   requires: ['wireit']
					},
					'wireit-terminal-proxy': {
					   requires: ['wireit','dd-drag','dd-proxy']
					},
					'wireit-scissors': {
					   requires: ['wireit']
					},
					'wireit-bezier-wire': {
					   requires: ['wireit-wire']
					},
					'wireit-bezierarrow-wire': {
					   requires: ['wireit-wire']
					},
					'wireit-arrow-wire': {
					   requires: ['wireit-wire']
					},
					'wireit-canvas-container': {
					   requires: ['wireit-container']
					},
					'wireit-container': {
					   requires: ['wireit-terminal']
					},
					'wireit-layer': {
					   requires: ['wireit-container']
					}
				}
			}
		}
	};

	if(typeof YUI_config === 'undefined') { YUI_config = {groups: {}}; }
	Y.mix(YUI_config.groups, CONFIG.groups);

   // Loop through all modules
   /*var modules = YUI_config.groups.wireit.modules,
       allModules = [],
       modulesByType = {};
   for(var moduleName in modules) {
     if (modules.hasOwnProperty(moduleName) ) {
       
       // Build a list of all wireit modules
       allModules.push(moduleName);
       
       // Build a reverse index on which module provides what type
       if(modules[moduleName].ix_provides) {
          modulesByType[modules[moduleName].ix_provides] = moduleName;
       }
       
     }
   }
   YUI_config.groups.wireit.allModules = allModules;
   YUI_config.groups.wireit.modulesByType = modulesByType;*/

});
