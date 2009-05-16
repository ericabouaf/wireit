(function() {
/**
 * Add inputEx modules to a YUI loader
 * @static
 * @param {YUILoader} yuiLoader YUI Loader instance
 * @param {String} inputExPath (optional) inputExPath
 */
YAHOO.addInputExModules = function(yuiLoader, inputExPath) {
	var pathToInputEx = inputExPath || '../';
	var modules = [
	   // inputEx base
		{
			name: 'inputex-css',
			type: 'css',
			fullpath: pathToInputEx+'css/inputEx.css',
			requires: ['reset', 'fonts']
		},
   	{
   	   name: 'inputex',
   	   type: 'js',
   	   fullpath: pathToInputEx+'js/inputex.js',
   	 	varName: 'inputEx',
   		requires: ['yahoo', 'dom', 'event', 'inputex-css']
   	},
		{
			name: 'inputex-field',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/Field.js',
	  	   varName: 'inputEx.Field',
			requires: ['inputex']
		},
      {
			name: 'inputex-visus',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/Visus.js',
	  	   varName: 'inputEx.visus',
			requires: ['inputex']
		},
		{
 			name: 'inputex-jsonschema',
 			type: 'js',
 	  	   fullpath: pathToInputEx+'js/json-schema.js',
 	  	   varName: 'inputEx.JsonSchema',
 			requires: ['inputex']
 		},
 		// RPC
 		{
 			name: 'yui-rpc',
 			type: 'js',
 	  	   fullpath: pathToInputEx+'lib/yui-rpc.js',
 	  	   varName: 'YAHOO.rpc',
 			requires: ['yahoo','connection']
 		},
 		{
 			name: 'inputex-rpc',
 			type: 'js',
 	  	   fullpath: pathToInputEx+'js/rpc/inputex-rpc.js',
 	  	   varName: 'YAHOO.rpc',
 			requires: ['yui-rpc','inputex-jsonschema']
 		},
		// Widgets
		{
 			name: 'inputex-ddlist',
 			type: 'js',
 	  	   fullpath: pathToInputEx+'js/widgets/ddlist.js',
 	  	   varName: 'inputEx.widget.DDList',
 			requires: ['inputex', 'dragdrop']
 		},
 		{
 			name: 'inputex-dialog',
 			type: 'js',
 	  	   fullpath: pathToInputEx+'js/widgets/Dialog-beta.js',
 	  	   varName: 'inputEx.widget.Dialog',
 			requires: ['inputex', 'dragdrop', 'container']
 		},
 		
		// MetaFields
		{
			name: 'inputex-group',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/Group.js',
	  	   varName: 'inputEx.Group',
			requires: ['inputex-field']
		},
		{
			name: 'inputex-form',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/Form.js',
	  	   varName: 'inputEx.Form',
			requires: ['inputex-group']
		},
		{
			name: 'inputex-listfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/ListField.js',
	  	   varName: 'inputEx.ListField',
			requires: ['inputex-field']
		},
		{
			name: 'inputex-treefield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/TreeField.js',
	  	   varName: 'inputEx.TreeField',
			requires: ['inputex-listfield']
		},
		{
			name: 'inputex-combinefield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/CombineField.js',
	  	   varName: 'inputEx.CombineField',
			requires: ['inputex-field']
		},
		{
			name: 'inputex-inplaceedit',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/InPlaceEdit.js',
	  	   varName: 'inputEx.InPlaceEdit',
			requires: ['inputex-field', 'animation']
		},
		
		// Fields
		{
			name: 'inputex-stringfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/StringField.js',
	  	   varName: 'inputEx.StringField',
			requires: ['inputex-field']
		},
		{
		   name: 'inputex-autocomplete',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/AutoComplete.js',
	  	   varName: 'inputEx.AutoComplete',
			requires: ['inputex-stringfield', 'autocomplete']
		},
		{
		   name: 'inputex-checkbox',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/CheckBox.js',
	  	   varName: 'inputEx.CheckBox',
			requires: ['inputex-field']
		},
		{
		   name: 'inputex-colorfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/ColorField.js',
	  	   varName: 'inputEx.ColorField',
			requires: ['inputex-field']
		},
		{
		   name: 'inputex-datefield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/DateField.js',
	  	   varName: 'inputEx.DateField',
			requires: ['inputex-stringfield']
		},
		{
		   name: 'inputex-datepickerfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/DatePickerField.js',
	  	   varName: 'inputEx.DatePickerField',
			requires: ['inputex-datefield', 'calendar', 'container']
		},
		{
		   name: 'inputex-integerfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/IntegerField.js',
	  	   varName: 'inputEx.IntegerField',
			requires: ['inputex-stringfield']
		},
		{
		   name: 'inputex-datesplitfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/DateSplitField.js',
	  	   varName: 'inputEx.DateSplitField',
			requires: ['inputex-combinefield', 'inputex-integerfield']
		},
		{
			name: 'inputex-selectfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/SelectField.js',
	  	   varName: 'inputEx.SelectField',
			requires: ['inputex-field']
		},
		{
		   name: 'inputex-timefield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/TimeField.js',
	  	   varName: 'inputEx.TimeField',
			requires: ['inputex-combinefield', 'inputex-selectfield']
		},
		{
		   name: 'inputex-datetimefield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/DateTimeField.js',
	  	   varName: 'inputEx.DateTimeField',
			requires: ['inputex-combinefield', 'inputex-datepickerfield', 'inputex-timefield']
		},
		{
		   name: 'inputex-dsselectfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/DSSelectField.js',
	  	   varName: 'inputEx.DSSelectField',
			requires: ['inputex-selectfield', 'datasource']
		},
		{
			name: 'inputex-emailfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/EmailField.js',
	  	   varName: 'inputEx.EmailField',
			requires: ['inputex-stringfield']
		},
		{
		   name: 'inputex-hiddenfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/HiddenField.js',
	  	   varName: 'inputEx.HiddenField',
			requires: ['inputex-field']
		},
      {
		   name: 'inputex-multiautocomplete',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/MultiAutoComplete.js',
	  	   varName: 'inputEx.MultiAutoComplete',
			requires: ['inputex-autocomplete', 'inputex-ddlist']
      },
      {
		   name: 'inputex-multiselectfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/MultiSelectField.js',
	  	   varName: 'inputEx.MultiSelectField',
			requires: ['inputex-selectfield', 'inputex-ddlist']
      },
      {
		   name: 'inputex-numberfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/NumberField.js',
	  	   varName: 'inputEx.NumberField',
			requires: ['inputex-stringfield']
		},
 		{
		   name: 'inputex-passwordfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/PasswordField.js',
	  	   varName: 'inputEx.PasswordField',
			requires: ['inputex-stringfield']
		},
 		{
		   name: 'inputex-radiofield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/RadioField.js',
	  	   varName: 'inputEx.RadioField',
			requires: ['inputex-field']
		},
		{
		   name: 'inputex-rtefield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/RTEField.js',
	  	   varName: 'inputEx.RTEField',
			requires: ['inputex-field', 'editor']
		},
		{
		   name: 'inputex-sliderfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/SliderField.js',
	  	   varName: 'inputEx.SliderField',
			requires: ['inputex-field', 'slider']
		},
		{
		   name: 'inputex-textarea',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/Textarea.js',
	  	   varName: 'inputEx.Textarea',
			requires: ['inputex-field']
		},
		{
		   name: 'inputex-typefield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/TypeField.js',
	  	   varName: 'inputEx.TypeField',
			requires: ['inputex-field']
		},
		{
		   name: 'inputex-uneditable',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/UneditableField.js',
	  	   varName: 'inputEx.UneditableField',
			requires: ['inputex-field', 'inputex-visus']
		},
		{
			name: 'inputex-urlfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/UrlField.js',
	  	   varName: 'inputEx.UrlField',
			requires: ['inputex-stringfield']
		},
 		
 		// Ext fields
 		{
  			name: 'inputex-birthdatefield',
  			type: 'js',
  	  	   fullpath: pathToInputEx+'js/ext/BirthdateField/BirthdateField.js',
  	  	   varName: 'inputEx.BirthdateField',
  			requires: ['inputex-combinefield', 'inputex-stringfield', 'inputex-selectfield']
  		},
  		{
  			name: 'inputex-ipv4field',
  			type: 'js',
  	  	   fullpath: pathToInputEx+'js/ext/IPv4Field/IPv4Field.js',
  	  	   varName: 'inputEx.IPv4Field',
  			requires: ['inputex-stringfield']
  		},
  		{
  			name: 'inputex-vectorfield',
  			type: 'js',
  	  	   fullpath: pathToInputEx+'js/ext/VectorField/VectorField.js',
  	  	   varName: 'inputEx.VectorField',
  			requires: ['inputex-combinefield']
  		},
  		{
  			name: 'inputex-mapfield',
  			type: 'js',
  	  	   fullpath: pathToInputEx+'js/ext/MapField/MapField.js',
  	  	   varName: 'inputEx.MapField',
  			requires: ['inputex-field']
  		},
  		// Locals
  		{
  		   name: 'inputex-lang-fr',
  			type: 'js',
  	  	   fullpath: pathToInputEx+'js/locals/fr.js',
  	  	   varName: 'inputEx.lang_fr',
  			requires: ['inputex']
  		},
  		{
        	name: 'inputex-lang-it',
        	type: 'js',
        	fullpath: pathToInputEx+'js/locals/it.js',
        	varName: 'inputEx.lang_it',
         requires: ['inputex']
      }
	];
	for(var i = 0 ; i < modules.length ; i++) {
		yuiLoader.addModule(modules[i]);
	}
};

})();