/**
 * WireIt Builder
 */
WireIt.Builder = {
	
	init: function() {
		   
		// LoadPanel
		this.loadPanel = new YAHOO.widget.Panel('loadPanel', {fixedcenter: true, draggable: true, width: '500px', visible: false, modal: true });
      this.loadPanel.setHeader("WireIt Language Builder: Available languages");
      this.loadPanel.setBody("<div id='languageList'>Loading...</div>");
      this.loadPanel.render(document.body);
      this.loadPanel.show();
   
      // Buttons
      var toolbar = YAHOO.util.Dom.get('toolbar');
      var newButton = new YAHOO.widget.Button({ label:"New", id:"WireItBuilder-newButton", container: toolbar });
      newButton.on("click", function() {
         this.form.clear();
         this.form.setValue({
            "smdUrl": "../../backend/php/WiringEditor.smd"
         });
      }, this, true);
  		var loadButton = new YAHOO.widget.Button({ label:"Load", id:"WireItBuilder-loadButton", container: toolbar });
      loadButton.on("click", this.onLoad, this, true);   
	   var saveButton = new YAHOO.widget.Button({ label:"Save", id:"WireItBuilder-saveButton", container: toolbar });
      saveButton.on("click", this.onSave, this, true);
	   var createButton = new YAHOO.widget.Button({ label:"Run", id:"WireItBuilder-runButton", container: toolbar });
      createButton.on("click", (function() { 
         this.generateWiringEditor(this.form.getValue()); 
      }), this, true);

      // Language Form
  		this.formDef.inputParams.parentEl = 'formContainer';
  		this.form = inputEx(this.formDef);  
		
		// Load backend services
		this.service = new YAHOO.rpc.Service("builder.smd",{ success: this.onLoad, scope: this });	
	},
	
	
	onLoad: function() {
	   var listContainer = YAHOO.util.Dom.get('languageList');
		listContainer.innerHTML = "Loading...";
		this.loadPanel.show();
	   
	   this.service.listLanguages({},{ success: function(result) { this.populateLanguageList(result.result); }, scope: this});
	},
	
	populateLanguageList: function(languages) {
	   this.languages = languages;
		var listContainer = YAHOO.util.Dom.get('languageList');
		listContainer.innerHTML = "";
		for(var i = 0 ; i < languages.length ; i++) {
		   var l = languages[i];
		   listContainer.appendChild( this.generateLanguageItem(l,i) );
		}
	},
	
	generateLanguageItem: function(l,i) {
	   var div = WireIt.cn('div', {className: 'language', id: 'language-'+i}, null, "<span class='languageName'>"+l.name+"</span> <span class='wiringsCount'>"+l.wirings+" wirings</span>");
	   YAHOO.util.Event.addListener(div, 'click', this.onLoadLanguage, this, true);
	   var runLink = WireIt.cn('a', null, null, "run");
	   YAHOO.util.Event.addListener(runLink, 'click', function(e) {
	      YAHOO.util.Event.stopEvent(e);
	      this.generateWiringEditor( YAHOO.lang.JSON.parse(l.language) );
	   }, this, true);
	   div.appendChild(runLink);
	   return div;
	},
	
	onLoadLanguage: function(e,params) {
	   var tgt = YAHOO.util.Event.getTarget(e);
	   if(!tgt.id) tgt = tgt.parentNode;
	   var index = parseInt(tgt.id.split('-')[1]);
	   var lang = this.languages[index];
	   
	   this.loadPanel.hide();
	   try {
	      var value = YAHOO.lang.JSON.parse(lang.language);
      }
      catch(ex) {
         alert("Unable to parse language: "+ex.message);
      }
      
      try {
		   this.form.clear();
		   this.form.setValue(value, false);
      }
      catch(ex) {
         alert("Unable to load language: "+ex.message);
      }
	},
	
	onSave: function() {
	   var val = this.form.getValue();
	   this.service.saveLanguage({
	      name: val.languageName,
	      language: YAHOO.lang.JSON.stringify(val)
	   },{ success: function() { alert("Saved !"); }, scope: this});
	},
	
	generateWiringEditor: function(languageDef) {
		
		var html = [
			"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">",
			"<html><head>",
			"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>",
			"<title>WireIt - "+languageDef.languageName+" language</title>",
			"<link rel='stylesheet' type='text/css' href='../../lib/yui/reset-fonts-grids/reset-fonts-grids.css' />",
			"<link rel='stylesheet' type='text/css' href='../../lib/yui/assets/skins/sam/skin.css' />",
			"<link type='text/css' rel='stylesheet' href='../../lib/inputex/css/inputEx.css' />",
			"<link rel='stylesheet' type='text/css' href='../../css/WireIt.css' />",
			"<link rel='stylesheet' type='text/css' href='../../css/WireItEditor.css' />",
			"<style>"+languageDef.additionalCss+"</style>",
			"<scr"+"ipt type='text/javascript' src='../../lib/yui/utilities/utilities.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../lib/yui/resize/resize-min.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../lib/yui/layout/layout-min.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../lib/yui/container/container-min.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../lib/yui/json/json-min.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../lib/yui/button/button-min.js'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/inputex.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/Field.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/util/inputex/WirableField-beta.js'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/Group.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/Visus.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/StringField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/Textarea.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/SelectField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/EmailField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/IntegerField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/NumberField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/UrlField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/ListField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/CheckBox.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/ColorField.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/InPlaceEdit.js'  type='text/javascript'></scr"+"ipt>",
			"<scr"+"ipt src='../../lib/inputex/js/fields/TypeField.js'  type='text/javascript'></scr"+"ipt>",
			"<!--[if IE]><script type='text/javascript' src='../../lib/excanvas.js'></scr"+"ipt><![endif]-->",
			"<scr"+"ipt type='text/javascript' src='../../js/WireIt.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/CanvasElement.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/Wire.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/Terminal.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/util/DD.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/util/DDResize.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/Container.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/Layer.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/util/inputex/FormContainer-beta.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/ImageContainer.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/LayerMap.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/BaseEditor.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/ModuleProxy.js'></scr"+"ipt>",
			"<scr"+"ipt type='text/javascript' src='../../js/WiringEditor.js'></scr"+"ipt>",
			"<scr"+"ipt>",
			"inputEx.spacerUrl = '/inputex/trunk/images/space.gif';",
			"var myLanguage = "+YAHOO.lang.JSON.stringify(languageDef)+";",
			"</scr"+"ipt>",
			(languageDef.additionalScripts == "") ? 
			      "<scr"+"ipt>\nYAHOO.util.Event.onDOMReady( function() {\n	new WireIt.WiringEditor(myLanguage);\n});\n</scr"+"ipt>" : 
			      languageDef.additionalScripts,
			"</head>",
			"<body class='yui-skin-sam'>",
			
			"	<div id='top'>",
			"		<div class='logo'>"+languageDef.languageName+"</a></div>",
			"		<div id='toolbar'></div>",
			"		<div class='topright'>",
			"			<span>Hello there !</span> | ",
			"			<a href='../..'>back to WireIt</a>",
			"		</div>",
			"	</div>",
			
			"	<div id='left'>",
			"	</div>",
			
			"	<div id='right'>",
			"		<h2>Properties</h2>",
			"		<div id='propertiesForm'></div>",
			"		<h2>Minimap</h2>",
			"		<div id='layerMap'></div>",
			"	</div>",
			
			"	<div id='center'>",
			"	</div>",

			"	<div id='helpPanel'>",
			"	    <div class='hd'>Help</div>",
			"	    <div class='bd' style='text-align: left;'>",
			languageDef.helpContent,
			"	    </div>",
			"	</div>",
			"</body>",
			"</html>"
		];

	   var formPage = window.open("",languageDef.languageName);
	   formPage.document.write(html.join("\n"));
	   formPage.document.close();
	},

   // inputEx form Definition
   formDef: {
   	"type": "group",
   	"inputParams": {
			
   			"fields" : [
   				{
   					"type": "string",
   					"inputParams": {
   						"label": "Language Name",
   						"name": "languageName"
   					}
   				},
   				{
   					//"type": "string",
   					"type": "hidden",
   					"inputParams": {
   						"label": "SMD url",
   						"name": "smdUrl",
   						"value": "../../backend/php/WiringEditor.smd"
   					}
   				},
   				{
   					"type": "list",
   					"inputParams": {
   						"name": "propertiesFields",
   						"label": "Properties",
   						"elementType": {
   							"type": "type",
   							"inputParams": {
   							}
   						}
   					}
   				},
   				{
   					"type" : "list",
   					"inputParams" : {
   						"label" : "Modules",
   						"name" : "modules",
   						"listAddLabel": "Add a new module",
   						"sortable": true,
   						"elementType" : {
   							"type" : "group",
   							"inputParams" : {
   								"legend" : "",
   								"fields" : [
   									{
   										"type" : "string",
   										"inputParams" : {
   											"label" : "Name",
   											"name" : "name",
   											"typeInvite" : "name",
   											"value" : ""
   										}
   									},
   									{
   										"type" : "group",
   										"inputParams" : {
   											"className": "inputEx-Group WireIt-Container-Group",
   											"legend" : "Container options",
   								   		"collapsible": true,
   											"collapsed": true,
   											"name": "container",
   											"fields" : [
   												{
   													"type" : "select",
   													"inputParams" : {
   														"label" : "Type",
   														"name" : "xtype",
   														"selectValues" : [
   															"WireIt.Container",
   															"WireIt.ImageContainer",
   															"WireIt.FormContainer"
   														],
   														"selectOptions" : [

   														],
   														"value" : "WireIt.Container"
   													}
   												},
   												{
   													"type" : "string",
   													"inputParams" : {
   														"label" : "Image",
   														"name" : "image",
   														"value" : ""
   													}
   												},
   												{
   													"type" : "url",
   													"inputParams" : {
   														"label" : "Icon",
   														"name" : "icon"
   													}
   												},
   												{
   													"type" : "list",
   													"inputParams" : {
   														"label" : "Fields",
   														"name" : "fields",
   														"elementType": {
   															"type": "type",
   															"inputParams": {
   															}
   														}
   													}
   												},
   												{
   													"type" : "list",
   													"inputParams" : {
   														"label" : "Terminals",
   														"name" : "terminals",
   														"elementType" : {
   															"type" : "group",
   															"inputParams" : {
   																"legend" : "Terminal",
   														   	"collapsible": true,
   																"collapsed": true,
   																"fields" : [
   																	{
   																		"type" : "string",
   																		"inputParams" : {
   																			"label" : "Name",
   																			"name" : "name"
   																		}
   																	},
   																	{
   																		"type" : "vector",
   																		"inputParams" : {
   																			"label" : "Direction",
   																			"name" : "direction"
   																		}
   																	},
   																	{
   																		"type": "group",
   																		"inputParams": {
   																		   "legend": "Position",
   																			"name" : "offsetPosition",
   																			"fields": [
   																				{"type": "integer", "inputParams": {"name": "top", "label": "top", "negative":true} },
   																				{"type": "integer", "inputParams": {"name": "right", "label": "right", "negative":true} },
   																				{"type": "integer", "inputParams": {"name": "bottom", "label": "bottom", "negative":true} },
   																				{"type": "integer", "inputParams": {"name": "left", "label": "left", "negative":true} }
   																			]
   																		}
   																	},
   																	{
																			"type": "integer",
																			"inputParams": {
																				"name": "nMaxWires",
																				"label": "Maximum wire number",
																				"size": "5"
																			}
																		},
   																	{
   																		"type": "group",
   																		"inputParams": {
   																			"name": "ddConfig",
   																			"fields": [
   																				{
   																					"type": "string",
   																					"inputParams": {
   																						"name": "type",
   																						"label": "Terminal type"
   																					}
   																				},
   																				{
   																					"type": "list",
   																					"inputParams": {
   																						"name": "allowedTypes",
   																						"label": "Allowed types",
   																						"elementType": {
   																							"type":"string",
   																							"inputParams":{}
   																						}
   																					}
   																				}
   																			]
   																		}
   																	}
   																],
   																"value" : {
   																	"name" : "",
   																	"direction" : ["",""],
   																	"offsetPosition" : ["",""]
   																}
   															}
   														},
   														"value" : []
   													}
   												}
   											],
   											"value" : {
   												"xtype" : "WireIt.Container",
   												"image" : "",
   												"terminals" : []
   											}
   										}
   									}
   								]
   							}
   						},
   						"value" : []
   					}
   				},
				
   				{
   					"type": "text",
   					"inputParams": {
   						"name": "additionalCss",
   						"label": "Additional CSS",
   						"rows": 10,
   						"cols": 80
   					}
   				},
				
   				{
   				   "type": "text",
   				   "inputParams": {
   				      "name": "additionalScripts",
   				      "label": "Additional scripts",
   				      "rows": 10,
   						"cols": 80
   				   }
   				},
   				
   				{
   				   "type": "html",
   				   "inputParams": {
   				      "name": "helpContent",
   				      "label": "Help Content"
   				   }
   				}
   			]
   		}
   }

};
YAHOO.util.Event.onDOMReady(WireIt.Builder.init, WireIt.Builder, true);
