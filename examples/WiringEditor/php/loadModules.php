[
			{
				"name": "Pownce",
				"container": {
   				"icon": "http://dev.tarpipe.com/img/pownce.png",
				   "xtype": "WireIt.Container",
				   "outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "Flickr",
				"container": {
   				"icon": "http://dev.tarpipe.com/img/flickr.png",
   				"xtype": "WireIt.Container",
   				"outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "23hq",
				"container": {
   				"icon": "http://dev.tarpipe.com/img/23hq.png",
   				"xtype": "WireIt.Container",
   				"outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "PhotoBucket",
				"container": {
   				"icon": "http://dev.tarpipe.com/img/photobucket.png",
   				"xtype": "WireIt.Container",
   				"outputTerminals": [],
   				"propertiesForm": []
				}
			},
			{
				"name": "Tumblr",
				"container": {
   				"icon": "http://dev.tarpipe.com/img/tumblr.png",
				   "xtype": "WireIt.Container",
				   "outputTerminals": [],
				   "propertiesForm": []
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