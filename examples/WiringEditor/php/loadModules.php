[
			{
				"name": "Pownce",
				"icon": "http://dev.tarpipe.com/img/pownce.png",
				
				"container": {
				   "xtype": "WireIt.Container",
				   "outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "Flickr",
				"icon": "http://dev.tarpipe.com/img/flickr.png",
				
				"container": {
   				"xtype": "WireIt.Container",
   				"outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "23hq",
				"icon": "http://dev.tarpipe.com/img/23hq.png",
				
				"container": {
   				"xtype": "WireIt.Container",
   				"outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "PhotoBucket",
				"icon": "http://dev.tarpipe.com/img/photobucket.png",
				
				"container": {
   				"xtype": "WireIt.Container"
   				"outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "Tumblr",
				"icon": "http://dev.tarpipe.com/img/tumblr.png",
				
				"container": {
				   "xtype": "WireIt.Container",
				   "outputTerminals": [],
				   "propertiesForm": []
			   }
			},
			{
				"name": "Plurk",
				"icon": "http://dev.tarpipe.com/img/plurk.png",
				
				"container": {
   				"xtype": "WireIt.FormContainer",
   				"outputTerminals": [],
   				"propertiesForm": [],
   				"fields": [ 
   					{"type": "select", "inputParams": {"label": "Title", "name": "title", "selectValues": ["Mr","Mrs","Mme"] } },
   					{"inputParams": {"label": "Firstname", "name": "firstname", "required": true } }, 
   					{"inputParams": {"label": "Lastname", "name": "lastname", "value":"Dupont"} }, 
   					{"type":"email", "inputParams": {"label": "Email", "name": "email", "required": true}}, 
   					{"type":"boolean", "inputParams": {"label": "Happy to be there ?", "name": "happy"}}, 
   					{"type":"url", "inputParams": {"label": "Website", "name":"website"}} 
   				]
				}
			}
		]