[

   {
      "name": "FormContainer",
      "container": {
   		"xtype": "WireIt.FormContainer",
   		"title": "WireIt.FormContainer demo",    
   		"icon": "http://dev.tarpipe.com/img/flickr.png",
   				
   		"collapsible": true,
   		"fields": [ 
   			{"type": "select", "inputParams": {"label": "Title", "name": "title", "selectValues": ["Mr","Mrs","Mme"] } },
   			{"inputParams": {"label": "Firstname", "name": "firstname", "required": true } }, 
   			{"inputParams": {"label": "Lastname", "name": "lastname", "value":"Dupont"} }, 
   			{"type":"email", "inputParams": {"label": "Email", "name": "email", "required": true}}, 
   			{"type":"boolean", "inputParams": {"label": "Happy to be there ?", "name": "happy"}}, 
   			{"type":"url", "inputParams": {"label": "Website", "name":"website", "size": 25}} 
   		],
   		"legend": "Tell us about yourself..."
   	}
   },

      {
         "name": "AND gate",
         "container": {
      		"xtype":"WireIt.ImageContainer", 
      		"image": "../logicGates/images/gate_and.png",
      		"icon": "http://dev.tarpipe.com/img/tumblr.png",
      		"terminals": [
      			{"name": "_INPUT1", "direction": [-1,0], "offsetPosition": [-3,2]},
      			{"name": "_INPUT2", "direction": [-1,0], "offsetPosition": [-3,37]},
      			{"name": "_OUTPUT", "direction": [1,0], "offsetPosition": [103,20]}
      		]
      	},
      },

	
			{
				"name": "Bubble",
				"container": {
         		"xtype":"WireIt.ImageContainer", 
         		"className": "WireIt-Container WireIt-ImageContainer Bubble",
            	"icon": "http://dev.tarpipe.com/img/photobucket.png",
         		"image": "../images/bubble.png",
         		"terminals": [
         				{"direction": [-1,-1], "offsetPosition": [-10,-10]},
         				{"direction": [1,-1], "offsetPosition": [25,-10]},
         				{"direction": [-1,1], "offsetPosition": [-10,25]},
         				{"direction": [1,1], "offsetPosition": [25,25]}
         		]
         	}
	      },
	
			{
				"name": "Plurk",
				"container": {
   				"icon": "http://dev.tarpipe.com/img/plurk.png",
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
			}
		]