YUI().use(function(Y) {
   
	var CONFIG = {
		groups: {
			'inputex': {
				base: 'inputex/src/',
				combine: false,
				modules: {
					'inputex': {
						requires: ['intl', 'pluginhost-base', 'pluginhost-config', 'base-pluginhost', 'node-pluginhost', 'plugin', 'node'],
						skinnable: true,
						lang: ['en','fr','de','es','fr','it','nl']
					},
					// inputEx base
					'inputex-field': {
						requires: ['inputex']
					},
					'inputex-visus': {
						requires: ['inputex','dump']
					},
					'inputex-jsonschema': {
						requires: ['inputex']
					},
					// RPC
					'inputex-rpc': {
						requires: ['json','inputex','io','inputex-jsonschema','jsonp']
					},
					'inputex-smdtester': {
						requires: ['inputex-rpc', 'inputex-jsontreeinspector']
					},
					// Mixins
					'inputex-choice': {
						requires: ['inputex']
					},
					// Widgets
					'inputex-base': {
						requires: ['inputex', 'widget', 'widget-stdmod']
					},
					'inputex-panel': {
						requires: ['inputex', 'panel','inputex-base']
					},
					'inputex-datatable': {
						requires: ['inputex-group', 'inputex-panel','datatable'],
						skinnable: true
					},
					'inputex-ddlist': {
					   requires: ['inputex-field', 'array-extras', 'sortable', 'substitute']
					},
					'inputex-jsontreeinspector': {
						requires: ['inputex'],
						skinnable: true
					},
					'inputex-button': {
						requires: ['inputex']
					},
					// MetaFields
					'inputex-group': {
						requires: ['inputex-field'],
						ix_provides: 'group'
					},
					'inputex-form': {
						requires: ['io-base','inputex-group','json','inputex-button'],
						ix_provides: 'form'
					},
					'inputex-list': {
						requires: ['inputex-field','anim'],
						skinnable: true,
						ix_provides: 'list'
					},
					'inputex-tree': {
						requires: ['inputex-string', 'inputex-list','inputex-inplaceedit'],
						ix_provides: 'tree'
					},
					'inputex-combine': {
						requires: ['inputex-group'],
						ix_provides: 'combine'
					},
					'inputex-inplaceedit': {
						requires: ['inputex-field', 'inputex-button', 'anim','inputex-visus'],
						ix_provides: 'inplaceedit'
					},
					'inputex-lens': {
						requires: ['inputex-group','inputex-inplaceedit'],
						ix_provides: 'lens'
					},
					'inputex-serialize': {
						requires: ['inputex-string','json'],
						ix_provides: 'serialize'
					},
					'inputex-object': {
						requires: ['inputex-list','inputex-combine','inputex-string'],
						ix_provides: 'object'
					},
					// Fields
					'inputex-string': {
						requires: ['inputex-field','event-key'],
						ix_provides: 'string'
					},
					'inputex-uppercase': {
						requires: ['inputex-string'],
						ix_provides: 'uppercase'
					},
					'inputex-autocomplete': {
						requires: ['inputex-string','autocomplete'],
						ix_provides: 'autocomplete'
					},
					'inputex-checkbox': {
						requires: ['inputex-field'],
						ix_provides: 'boolean'
					},
					'inputex-color': {
						requires: ['inputex-field','node-event-delegate','event-outside','overlay'],
						skinnable: true,
						ix_provides: 'color'
					},
					'inputex-date': {
						requires: ['inputex-string'],
						ix_provides: 'date'
					},
					'inputex-datepicker': {
						requires: ['inputex-date','event-outside', 'node-event-delegate','overlay','calendar'],
						ix_provides: 'datepicker'
					},
					'inputex-imagecropper': {
						requires: ['inputex-field'],
						ix_provides: 'imagecropper'
					},
					'inputex-integer': {
						requires: ['inputex-string'],
						ix_provides: 'integer'
					},
					'inputex-datesplit': {
						requires: ['inputex-combine', 'inputex-integer'],
						ix_provides: 'datesplit'
					},
					'inputex-select': {
						requires: ['inputex-field','inputex-choice'],
						ix_provides: 'select'
					},
					'inputex-time': {
						requires: ['inputex-combine', 'inputex-select'],
						ix_provides: 'time'
					},
					'inputex-datetime': {
						requires: ['inputex-datepicker', 'inputex-combine', 'inputex-time'],
						ix_provides: 'datetime'
					},
					'inputex-timeinterval': {
						requires: ['inputex-combine', 'inputex-select'],
						ix_provides: 'timeinterval'
					},
					'inputex-timerange': {
						requires: ['inputex-combine', 'inputex-select'],
						ix_provides: 'timerange'
					},
					'inputex-dsselect': {
						requires: ['inputex-select', 'datasource'],
						ix_provides: 'dsselect'
					},
					'inputex-email': {
						requires: ['inputex-string'],
						ix_provides: 'email'
					},
					'inputex-hidden': {
						requires: ['inputex-field'],
						ix_provides: 'hidden'
					},
					'inputex-keyvalue': {
						requires: ['inputex-combine'],
						ix_provides: 'keyvalue'
					},
					'inputex-keyopvalue': {
						requires: ['inputex-keyvalue'],
						ix_provides: 'keyopvalue'
					},
					'inputex-multiautocomplete': {
						requires: ['inputex-autocomplete','json','inputex-ddlist'],
						ix_provides: 'multiautocomplete'
					},
					'inputex-multiselect': {
						requires: ['inputex-select', 'inputex-ddlist'],
						ix_provides: 'multiselect'
					},
					'inputex-number': {
						requires: ['inputex-string'],
						ix_provides: 'number'
					},
					'inputex-password': {
						requires: ['inputex-string'],
						ix_provides: 'password'
					},
					'inputex-radio': {
						requires: ['selector','event-delegate','inputex-field','inputex-choice','inputex-string'],
						ix_provides: 'radio'
					},
					'inputex-rte': {
						requires: ['inputex-field', 'yui2-editor'],
						ix_provides: 'html'
					},
					'inputex-slider': {
						requires: ['inputex-field', 'slider'],
						ix_provides: 'slider'
					},
					'inputex-textarea': {
						requires: ['inputex-string'],
						ix_provides: 'text'
					},
					'inputex-type': {
						requires: ['inputex-field','inputex-group','inputex-select', 'inputex-list','inputex-string','inputex-checkbox','inputex-integer'],
						skinnable: true,
						ix_provides: 'type'
					},
					'inputex-uneditable': {
						requires: ['inputex-field', 'inputex-visus'],
						ix_provides: 'uneditable'
					},
					'inputex-url': {
						requires: ['inputex-string'],
						ix_provides: 'url'
					},
					'inputex-dateselectmonth': {
						requires: ['inputex-combine', 'inputex-string', 'inputex-select'],
						ix_provides: 'dateselectmonth'
					},
					'inputex-ipv4': {
						requires: ['inputex-string'],
						ix_provides: 'ipv4'
					},
					'inputex-vector': {
						requires: ['inputex-combine'],
						ix_provides: 'vector'
					},
					'inputex-map': {
						requires: ['inputex-field'],
						ix_provides: 'map'
					},
					'inputex-ratingstars': {
						requires: ['inputex-field'],
						skinnable: true,
						ix_provides: 'ratingstars'
					},
					'inputex-ratingstarsform': {
                  requires: ['inputex-ratingstars','inputex-form'],
						ix_provides: 'ratingstarsform'
					},
					'inputex-menu': {
						requires: ['inputex-field', 'node-event-delegate', 'node-menunav', 'substitute'],
						ix_provides: 'menu'
					},
					'inputex-file': {
						requires: ['inputex-field'],
						ix_provides: 'file'
					},
					'inputex-tinymce': {
						requires: ['inputex-field'],
						ix_provides: 'tinymce'
					},
					'inputex-stringavailability' : {
							requires : ["inputex-string","event-key","io","json-parse"],
							skinnable: true
					},
					'inputex-linkedcombo' : {
							requires: ["inputex-select","inputex-choice"]
					}
				}
			}
		}
	};

   if (typeof YUI_config === 'undefined') {
      YUI_config = {groups: {}};
   }
   if (typeof YUI_config.groups === 'undefined') {
      YUI_config.groups = {};
   }
   Y.mix(YUI_config.groups, CONFIG.groups);

   // Loop through all modules
   var modules = YUI_config.groups.inputex.modules,
       allModules = [],
       modulesByType = {};
   for(var moduleName in modules) {
     if (modules.hasOwnProperty(moduleName) ) {
       
       // Build a list of all inputEx modules
       allModules.push(moduleName);
       
       // Build a reverse index on which module provides what type
       if(modules[moduleName].ix_provides) {
          modulesByType[modules[moduleName].ix_provides] = moduleName;
       }
       
     }
   }
   YUI_config.groups.inputex.allModules = allModules;
   YUI_config.groups.inputex.modulesByType = modulesByType;

});
