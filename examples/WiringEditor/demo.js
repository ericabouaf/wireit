var demoLanguage = {
	
	// Set a unique name for the language
	languageName: "meltingpotDemo",

	// inputEx fields for pipes properties
	propertiesFields: [
		// default fields (the "name" field is required by the WiringEditor):
		{"type": "string", inputParams: {"name": "name", label: "Title", typeInvite: "Enter a title" } },
		{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30} },
		
		// Additional fields
		{"type": "boolean", inputParams: {"name": "isTest", value: true, label: "Test"}},
		{"type": "select", inputParams: {"name": "category", label: "Category", selectValues: ["Demo", "Test", "Other"]} }
	],
	
	// List of node types definition
	modules: [
	
	   {
	      "name": "FormContainer",
	      "container": {
	   		"xtype": "WireIt.FormContainer",
	   		"title": "WireIt.FormContainer demo",    
	   		"icon": "../../res/icons/application_edit.png",

	   		"collapsible": true,
	   		"fields": [ 
	   			{"type": "select", "inputParams": {"label": "Title", "name": "title", "selectValues": ["Mr","Mrs","Mme"] } },
	   			{"inputParams": {"label": "Firstname", "name": "firstname", "required": true } }, 
	   			{"inputParams": {"label": "Lastname", "name": "lastname", "value":"Dupont"} }, 
	   			{"type":"email", "inputParams": {"label": "Email", "name": "email", "required": true, "wirable": true}}, 
	   			{"type":"boolean", "inputParams": {"label": "Happy to be there ?", "name": "happy"}}, 
	   			{"type":"url", "inputParams": {"label": "Website", "name":"website", "size": 25}} 
	   		],
	   		"legend": "Tell us about yourself..."
	   	}
	   },
	
		{
	      "name": "comment",
	
	      "container": {
	         "xtype": "WireIt.FormContainer",
				"icon": "../../res/icons/comment.png",
	   		"title": "Comment",
	   		"fields": [
	            {"type": "text", "inputParams": {"label": "", "name": "comment", "wirable": false }}
	         ]
	      },
	      "value": {
	         "input": {
	            "type":"url","inputParams":{}
	         }
	      }
	   },

	      {
	         "name": "AND gate",
	         "container": {
	      		"xtype":"WireIt.ImageContainer", 
	      		"image": "../logicGates/images/gate_and.png",
	      		"icon": "../../res/icons/arrow_join.png",
	      		"terminals": [
	      			{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 2 }},
	      			{"name": "_INPUT2", "direction": [-1,0], "offsetPosition": {"left": -3, "top": 37 }},
	      			{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": {"left": 103, "top": 20 }}
	      		]
	      	}
	      },


				{
					"name": "Bubble",
					"container": {
	         		"xtype":"WireIt.ImageContainer", 
	         		"className": "WireIt-Container WireIt-ImageContainer Bubble",
	            	"icon": "../../res/icons/color_wheel.png",
	         		"image": "../images/bubble.png",
	         		"terminals": [
	         				{"direction": [-1,-1], "offsetPosition": {"left": -10, "top": -10 }, "name": "tl"},
	         				{"direction": [1,-1], "offsetPosition": {"left": 25, "top": -10 }, "name": "tr"},
	         				{"direction": [-1,1], "offsetPosition": {"left": -10, "top": 25 }, "name": "bl"},
	         				{"direction": [1,1], "offsetPosition": {"left": 25, "top": 25 }, "name": "br"}
	         		]
	         	}
		      },

				{
					"name": "Other form module",
					"container": {
	   				"icon": "../../res/icons/application_edit.png",
	   				"xtype": "WireIt.FormContainer",
	   				"outputTerminals": [],
	   				"propertiesForm": [],
	   				"fields": [ 
	   					{"type": "select", "inputParams": {"label": "Title", "name": "title", "selectValues": ["Mr","Mrs","Mme"] } },
	   					{"inputParams": {"label": "Firstname", "name": "firstname", "required": true } }, 
	   					{"inputParams": {"label": "Lastname", "name": "lastname", "value":"Dupont"} }, 
	   					{"type":"email", "inputParams": {"label": "Email", "name": "email", "required": true}}, 
	   					{"type":"boolean", "inputParams": {"label": "Happy to be there ?", "name": "happy"}}, 
	   					{"type":"url", "inputParams": {"label": "Website", "name":"website", "size": 25}} 
	   				]
					}
				},

				{
	            "name": "PostContainer",
	            "container": {
	         		"xtype": "WireIt.FormContainer",
	         		"title": "Post",    
	         		"icon": "../../res/icons/comments.png",

	         		"fields": [ 

	         		   {"type": "inplaceedit", "inputParams": {
										"name": "post",
	         		      "editorField":{"type":"text", "inputParams": {} },  
	         		      "animColors":{"from":"#FFFF99" , "to":"#DDDDFF"}
	         		   }},

	         			{"type": "list", "inputParams": {
	         			   "label": "Comments", "name": "comments", "wirable": false,
	         			   "elementType": {"type":"string", "inputParams": { "wirable": false } }
	         			   } 
	         			}

	         		],

	         		   	"terminals": [
	               			{"name": "SOURCES", "direction": [0,-1], "offsetPosition": {"left": 100, "top": -15 }},
	               			{"name": "FOLLOWUPS", "direction": [0,1], "offsetPosition": {"left": 100, "bottom": -15}}
	               			]
	         	}
	         },
	
	
				{
		         "name": "InOut test",
		         "container": {
		      		"xtype":"WireIt.InOutContainer", 
		      		"icon": "../../res/icons/arrow_right.png",
						"inputs": ["text1", "text2", "option1"],
						"outputs": ["result", "error"]
		      	}
		      }
				
			]

};