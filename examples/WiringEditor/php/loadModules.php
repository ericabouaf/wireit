[
			{
				"name": "Pownce",
				"icon": "http://dev.tarpipe.com/img/pownce.png",
				"outputTerminals": [],
				"propertiesForm": [],
				"xtype": "WireIt.Container",
				"interfaceOptions": {}
			},
			{
				"name": "Flickr",
				"icon": "http://dev.tarpipe.com/img/flickr.png",
				"outputTerminals": [],
				"propertiesForm": [],
				"xtype": "WireIt.Container",
				"interfaceOptions": {}
			},
			{
				"name": "23hq",
				"icon": "http://dev.tarpipe.com/img/23hq.png",
				"outputTerminals": [],
				"propertiesForm": [],
				"xtype": "WireIt.Container",
				"interfaceOptions": {}
			},
			{
				"name": "PhotoBucket",
				"icon": "http://dev.tarpipe.com/img/photobucket.png",
				"outputTerminals": [],
				"propertiesForm": [],
				"xtype": "WireIt.Container",
				"interfaceOptions": {}
			},
			{
				"name": "Tumblr",
				"icon": "http://dev.tarpipe.com/img/tumblr.png",
				"outputTerminals": [],
				"propertiesForm": [],
				"xtype": "WireIt.Container",
				"interfaceOptions": {}
			},
			{
				"name": "Plurk",
				"icon": "http://dev.tarpipe.com/img/plurk.png",
				"outputTerminals": [],
				"propertiesForm": [],
				"xtype": "WireIt.FormContainer",
				"fields": [ 
					{"type": "select", "inputParams": {"label": "Title", "name": "title", "selectValues": ["Mr","Mrs","Mme"] } },
					{"inputParams": {"label": "Firstname", "name": "firstname", "required": true } }, 
					{"inputParams": {"label": "Lastname", "name": "lastname", "value":"Dupont"} }, 
					{"type":"email", "inputParams": {"label": "Email", "name": "email", "required": true}}, 
					{"type":"boolean", "inputParams": {"label": "Happy to be there ?", "name": "happy"}}, 
					{"type":"url", "inputParams": {"label": "Website", "name":"website"}} 
				],
				"interfaceOptions": {}
			}
		]