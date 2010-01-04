/**
 * Creates a form to test various SMD files
 * @class inputEx.RPC.SMDTester
 */
inputEx.RPC.SMDTester = function(parentEl, smdList) {
	
	this.el = YAHOO.util.Dom.get(parentEl);
	
	var selectStr = 'select smd';
	inputEx({
		type: 'select',
		inputParams: {
			label: "SMD",
			parentEl: this.el,
			selectValues: [selectStr].concat(smdList), 
			description: "Select the Service Mapping Description file"
		}
	}).updatedEvt.subscribe(function(e, params) {
			var smdFile = params[0];
			if(smdFile != selectStr) {
				this.loadSMD(smdFile);
			}
			/*else {
				// TODO: clear the form ?
			}*/
	}, this, true);
	
	this.smdDescriptionEl = inputEx.cn('p');
	this.el.appendChild( this.smdDescriptionEl );
	
	this.serviceMethodEl = inputEx.cn('div');
	this.el.appendChild( this.serviceMethodEl );
	
	this.methodDescriptionEl = inputEx.cn('p');
	this.el.appendChild( this.methodDescriptionEl );
	
	this.formContainerEl = inputEx.cn('div');
	this.el.appendChild( this.formContainerEl );
	
	
	this.treeContainerEl = inputEx.cn('div');
	this.treeContainerEl.appendChild( inputEx.cn('p', null, null, 'Results :') );
	this.el.appendChild( this.treeContainerEl );
};
	
inputEx.RPC.SMDTester.prototype = {
	
	/**
	 * When the user select a SMD in the select
	 */
	loadSMD: function(smdFile) {

	  	this.serviceMethodEl.innerHTML = "";
		this.formContainerEl.innerHTML = "";
		
		this.service = new inputEx.RPC.Service(smdFile,{ success: this.onServiceLoaded,	scope: this});
	},
	
	/**
	 * When the SMD has been loaded
	 */
	onServiceLoaded: function() {
		
		// Set SMD Description :
		this.smdDescriptionEl.innerHTML = (YAHOO.lang.isString(this.service._smd.description)) ? this.service._smd.description : "";
		
		// Method Select
		var selectStr = 'select a method';
		var genMethods = [selectStr];
		for(var key in this.service) {
			if(this.service.hasOwnProperty(key) && YAHOO.lang.isFunction(this.service[key])) {
				genMethods.push(key);
			}
		}	
		var select = inputEx({
				type: 'select',
				inputParams: {
					parentEl: this.serviceMethodEl,
					selectValues: genMethods,
					label: 'Method',
					description: "Select the method"
				}
		});
		
		select.updatedEvt.subscribe(function(e, params) {
			var methodName = params[0];
			if(methodName != selectStr) this.onServiceMethod(methodName);
		}, this, true);
		
		if(genMethods.length == 2) {
			select.setValue(genMethods[1]);
		}
		
	},
	
	/**
	 * When a method has been selected :
	 */
	onServiceMethod: function(methodName) {
		
		// Set Method Description :
		this.methodDescriptionEl.innerHTML = (YAHOO.lang.isString(this.service[methodName].description)) ? this.service[methodName].description : "";
		
		// generate the form for the given method
		this.formContainerEl.innerHTML = "";
		inputEx.RPC.generateServiceForm(this.service[methodName], { parentEl: this.formContainerEl }, {
			success: function(results) {
					this.treeContainerEl.innerHTML = "";
					new inputEx.widget.JsonTreeInspector(this.treeContainerEl, results);
			},
			scope: this
		});
	}
	
};
