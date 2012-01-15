/**
 * WireIt editor
 */
YUI.add("editor-base", function(Y){

/**
 * The BaseEditor class provides a full page interface 
 * @class BaseEditor	
 * @constructor
 * @param {Object} options (layoutOptions,propertiesFields,accordionViewParams)
 */
Y.WireBaseEditor = function(options) {
	
	/**
    * Container DOM element
    * @attribute el
    */
   this.el = Y.one(options.parentEl);
	
	// set the default options
   this.setOptions(options);

   // Rendering
   this.render();
	
};

/**
 * Default options for the BaseEditor
 */
Y.WireBaseEditor.defaultOptions = {
	layoutOptions: {
	 	units: [
	   	{ position: 'top', height: 57, body: 'top'},
	      { position: 'left', width: 200, resize: true, body: 'left', gutter: '5px', collapse: true, 
	        collapseSize: 25, header: 'Modules', scroll: true, animate: true },
	      { position: 'center', body: 'center', gutter: '5px' },
	      { position: 'right', width: 320, resize: true, body: 'right', gutter: '5px', collapse: true, 
	        collapseSize: 25, /*header: 'Properties', scroll: true,*/ animate: true }
	   ]
	},

	propertiesFields: [
		{"type": "string", "name": "name", label: "Title", typeInvite: "Enter a title" },
		{"type": "text", "name": "description", label: "Description", cols: 30, rows: 4}
	],
	
	accordionViewParams: {
		collapsible: true, 
		expandable: true, // remove this parameter to open only one panel at a time
		width: 'auto', 
		expandItem: 0, 
		animationSpeed: '0.3', 
		animate: true, 
		effect: YAHOO.util.Easing.easeBothStrong
	}
};

Y.WireBaseEditor.prototype = {

	/**
	 * @method setOptions
	 * @param {Object} options
	 */
	setOptions: function(options) {

	    /**
	     * @attribute options
	     * @type {Object}
	     */
	    this.options = {};
	
		 // inputEx configuration of fields in the properties panel
	    this.options.propertiesFields = options.propertiesFields || Y.WireBaseEditor.defaultOptions.propertiesFields;

		 // YUI layout options
	    this.options.layoutOptions = options.layoutOptions || Y.WireBaseEditor.defaultOptions.layoutOptions;
		
		 // AccordionView
	 	 this.options.accordionViewParams = options.accordionViewParams || Y.WireBaseEditor.defaultOptions.accordionViewParams;
	},
	
	/**
	 * Render the layout & panels
	 */
  	render: function() {

		 // Render the help panel
	    this.renderHelpPanel();

	    /**
	     * @attribute layout
	     * @type {YAHOO.widget.Layout}
	     */
	    this.layout = new YAHOO.widget.Layout(this.el, this.options.layoutOptions);
	    this.layout.render();

		 // Right accordion
	    this.renderPropertiesAccordion();

	    // Render buttons
	    this.renderButtons();

	 	 // Saved status
		 this.renderSavedStatus();

	    // Properties Form
	    this.renderPropertiesForm();

  },

	/**
	 * Render the help dialog
	 */
	renderHelpPanel: function() {
	   
	    this.helpPanel = new Y.Panel('helpPanel', {
	        fixedcenter: true,
	        draggable: true,
	        visible: false,
	        modal: true
	     });
	     this.helpPanel.render();
	},

	/**
	 * Render the alert panel
	 */
 	renderAlertPanel: function() {
		
		this.alertPanel = new Y.Panel('WiringEditor-alertPanel', {
         fixedcenter: true,
         draggable: true,
         width: '500px',
         visible: false,
         modal: true
      });
      this.alertPanel.setHeader("Message");
      this.alertPanel.setBody("<div id='alertPanelBody'></div><button id='alertPanelButton'>Ok</button>");
      this.alertPanel.render(document.body);
		Y.one('#alertPanelButton').on('click', function() {
			this.alertPanel.hide();
		}, this, true);
	},
	
	 /**
	  * Toolbar
	  * @method renderButtons
	  */
	 renderButtons: function() {
	    var toolbar = Y.one('toolbar');
	    // Buttons :
	    var newButton = new YAHOO.widget.Button({ label:"New", id:"WiringEditor-newButton", container: toolbar });
	    newButton.on("click", this.onNew, this, true);

	    var loadButton = new YAHOO.widget.Button({ label:"Load", id:"WiringEditor-loadButton", container: toolbar });
	    loadButton.on("click", this.load, this, true);

	    var saveButton = new YAHOO.widget.Button({ label:"Save", id:"WiringEditor-saveButton", container: toolbar });
	    saveButton.on("click", this.onSave, this, true);

	    var deleteButton = new YAHOO.widget.Button({ label:"Delete", id:"WiringEditor-deleteButton", container: toolbar });
	    deleteButton.on("click", this.onDelete, this, true);

	    var helpButton = new YAHOO.widget.Button({ label:"Help", id:"WiringEditor-helpButton", container: toolbar });
	    helpButton.on("click", this.onHelp, this, true);
	 },


	/**
	 * @method renderSavedStatus
	 */
	renderSavedStatus: function() {
		this.savedStatusEl = Y.WireIt.cn('div', {className: 'savedStatus', title: 'Not saved'}, {display: 'none'}, "*");
		Y.one('toolbar').appendChild(this.savedStatusEl);
	},

	 /**
	  * @method onSave
	  */
	 onSave: function() {
	    this.save();
	 },

	/**
	 * Save method (empty)
	 */
	save: function() {
		// override
	},

	/**
	 * Displays a message
	 */
	alert: function(txt) {
		if(!this.alertPanel){ this.renderAlertPanel(); }
		Y.one('alertPanelBody').innerHTML = txt;
		this.alertPanel.show();
	},

	 /**
	  * Create a help panel
	  * @method onHelp
	  */
	 onHelp: function() {
	    this.helpPanel.show();
	 },

	
	/**
	 * Render the accordion using yui-accordion
  	 */
	renderPropertiesAccordion: function() {
		this.accordionView = new YAHOO.widget.AccordionView('accordionView', this.options.accordionViewParams);
	},
 
	 /**
	  * Render the properties form
	  * @method renderPropertiesForm
	  */
	 renderPropertiesForm: function() {
	    this.propertiesForm = new Y.inputEx.Group({
	       parentEl: Y.one('#propertiesForm'),
	       fields: this.options.propertiesFields
	    });

		this.propertiesForm.on('updatedEvt', function() {
			this.markUnsaved();
		}, this, true);
	 },

	/** 
	 * Hide the save indicator
	 */
	markSaved: function() {
		this.savedStatusEl.style.display = 'none';
	},
	
	/** 
	 * Show the save indicator
	 */
	markUnsaved: function() {
		this.savedStatusEl.style.display = '';
	},

	/** 
	 * Is saved ?
	 */
	isSaved: function() {
		return (this.savedStatusEl.style.display == 'none');
	}
	
};

}, '0.7.0',{
  requires: ['panel']
});
