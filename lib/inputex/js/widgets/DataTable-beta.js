(function() {

   var lang = YAHOO.lang, Dom = YAHOO.util.Dom, Event = YAHOO.util.Event, inputEx = YAHOO.inputEx;

/**
 * @class Create an editable datatable
 * @constructor
 * @param {Object} options Options:
 * <ul>
 *    <li>id</li>
 *    <li>parentEl</li>
 *    <li>editing 'formeditor' (default) or 'celleditor'</li>
 *    <li>tableColumns: (optional) list of visible columns in the datatable</li>
 *    <li>sortable: (optional) are the columns sortable, default true</li>
 *    <li>resizeable: (optional) are the columns resizeable, default true</li>
 *    <li>allowInsert: default true</li>
 *    <li>allowModify: default true</li>
 *    <li>allowDelete: default true</li>
 * </ul>
 */
inputEx.widget.DataTable = function(options) {
   
   // Options
   this.options = options || {};
   this.options.id = this.options.id ||  Dom.generateId();
   this.options.parentEl = lang.isString(options.parentEl) ? Dom.get(options.parentEl) : options.parentEl;
   this.options.editing =  this.options.editing || 'formeditor';
   // + this.options.tableColumns
   this.options.sortable = lang.isUndefined(this.options.sortable) ? true : this.options.sortable;
   this.options.resizeable = lang.isUndefined(this.options.resizeable) ? true : this.options.resizeable;
   this.options.allowInsert = lang.isUndefined(this.options.allowInsert) ? true : this.options.allowInsert;
   this.options.allowModify = lang.isUndefined(this.options.allowModify) ? true : this.options.allowModify;
   this.options.allowDelete = lang.isUndefined(this.options.allowDelete) ? true : this.options.allowDelete;
   
   // Create main container and append it immediatly to the parent DOM element
   this.element = inputEx.cn('div', {id: this.options.id });
   this.options.parentEl.appendChild(this.element);
   
   // Call the rendering method when the container is available
   Event.onAvailable(this.options.id, this.renderDatatable, this, true);
   
   /**
	 * @event
	 * @param {YAHOO.widget.Record} Removed record
	 * @desc YAHOO custom event fired when an item is removed
	 */
 	this.itemRemovedEvt = new YAHOO.util.CustomEvent('itemRemoved', this);

   /**
	 * @event
 	 * @param {YAHOO.widget.Record} Added record
	 * @desc YAHOO custom event fired when an item is added
	 */
 	this.itemAddedEvt = new YAHOO.util.CustomEvent('itemAdded', this);

   /**
	 * @event
 	 * @param {YAHOO.widget.Record} Modified record
	 * @desc YAHOO custom event fired when an item is modified
	 */
 	this.itemModifiedEvt = new YAHOO.util.CustomEvent('itemModified', this);

};

inputEx.widget.DataTable.prototype = {
   
   /**
    * Render the datatable
    */
   renderDatatable: function() {
      
      this.columndefs = this.fieldsToColumndefs(this.options.fields);
      
      this.datatable = new YAHOO.widget.DataTable(this.element,this.columndefs, this.options.datasource, this.options.datatableOpts);
      
      this.datatable.subscribe('cellClickEvent', this.onCellClick, this, true);
      
      // Select the editing method
      if(this.options.editing == "formeditor") {
         this.initFormEditor();
      }
      else if(this.options.editing == "celleditor") {
         this.initCellEditor();
      }
      
      // Insert button
      if ( this.options.allowInsert ){
         this.insertButton = inputEx.cn('button', null, null, inputEx.messages.insertItemText);
         Event.addListener(this.insertButton, 'click', this.onInsertButton, this, true);
         this.options.parentEl.appendChild(this.insertButton);
      }
   },
   
   /**
    * Create an inputEx form next to the datatable.
    * If this.options.editing == "formeditor"
    */
   initFormEditor: function() {
      
      // Subscribe to events for row selection 
      this.datatable.subscribe("rowMouseoverEvent", this.datatable.onEventHighlightRow); 
      this.datatable.subscribe("rowMouseoutEvent", this.datatable.onEventUnhighlightRow); 
      this.datatable.subscribe("rowClickEvent", this.datatable.onEventSelectRow); 
   
      // Listener for row selection
      this.datatable.subscribe("rowSelectEvent", this.onEventSelectRow, this, true); 
   
      // Form container
      this.formContainer = inputEx.cn('div', {className: "inputEx-DataTable-formContainer"}, null, "&nbsp;");
      this.options.parentEl.appendChild(this.formContainer);
   
      // Build the form
      var that = this;
      this.subForm = new inputEx.Form({
         parentEl: this.formContainer,
         fields: this.options.fields,
         legend: this.options.legend,
         buttons: [ 
            { type: 'submit', onClick: function(e) {that.onSaveForm(e); }, value: inputEx.messages.saveText},
            { type: 'button', onClick: function(e) {that.onCancelForm(e);}, value: inputEx.messages.cancelText}
         ]
      });
   
      // Programmatically select the first row 
      this.datatable.selectRow(this.datatable.getTrEl(0));
   
      // Programmatically bring focus to the instance so arrow selection works immediately 
      this.datatable.focus(); 
   
      // Positionning
      var dt = this.datatable.get('element');
      Dom.setStyle(dt, "float", "left");
      
      // Hiding subform
      this.hideSubform();
      
      // Add class to style the popup
      Dom.addClass(this.subForm.divEl, "inputEx-DataTable-formWrapper");
      
      this.options.parentEl.appendChild(inputEx.cn('div', null, {"clear":"both"}));
   },
   
   
   /**
    * Make the datatable inplace editable with inputEx fields
    * If this.options.editing == "celleditor"
    */
   initCellEditor: function() {
      
      // Set up editing flow
      var highlightEditableCell = function(oArgs) {
          var elCell = oArgs.target;
          if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) {
              this.highlightCell(elCell);
          }
      };
      this.datatable.subscribe("cellMouseoverEvent", highlightEditableCell);
      this.datatable.subscribe("cellMouseoutEvent", this.datatable.onEventUnhighlightCell);
   },
   
   /**
    * Handling cell click events
    */
   onCellClick: function(ev,args) {
      var target = Event.getTarget(ev);
      var column = this.datatable.getColumn(target);      
      var rowIndex = this.datatable.getTrIndex(target);
      if (column.key == 'delete') {
         if (confirm(inputEx.messages.confirmDeletion)) {
            var record = this.datatable.getRecord(target);
            if(this.editingNewRecord) {
               this.editingNewRecord = false;
            }
            else {
               this.itemRemovedEvt.fire( record );
            }
            this.datatable.deleteRow(target);
            this.hideSubform();
         }
      }
      else if(column.key == 'modify') {
         // make the form appear
         this.showSubform(rowIndex);
         
      } 
      else {      
         this.datatable.onEventShowCellEditor(ev);
         this.deplaceSubForm(rowIndex);
      }
   },
   
   /**
    * Insert button event handler
    */
   onInsertButton: function(e) {
      
      // Insert a new row
      this.datatable.addRow({});
      
      // Select the new row
      this.datatable.unselectRow(this.selectedRecord);
      var rs = this.datatable.getRecordSet();
      var row = this.datatable.getTrEl(rs.getLength()-1);
      this.datatable.selectRow(row);
      
      if(this.options.editing == "formeditor") {
         this.editingNewRecord = true;
         this.showSubform(rs.getLength()-1);
      }
      
   },
   
   /**
    * Set the subForm value when a row is selected
    */
   onEventSelectRow: function(args) {
      
      if(this.editingNewRecord && this.selectedRecord != args.record) {
         this.removeUnsavedRecord();
         this.editingNewRecord = false;
      }
      
      this.selectedRecord = args.record;
      this.subForm.setValue(this.selectedRecord.getData());
   },
   
   /**
    * Save the form value in the dataset
    */
   onSaveForm: function(e) {
      // Prevent submitting the form
      Event.stopEvent(e);
      
      // Update the record
      var newvalues = this.subForm.getValue();       
      this.datatable.updateRow( this.selectedRecord , newvalues ); 
      
      // Hide the subForm
      this.hideSubform();
      
      if(this.editingNewRecord) {
         // Fire the modify event
         this.itemAddedEvt.fire(this.selectedRecord);
         this.editingNewRecord = false;
      }
      else {
         // Fire the modify event   
         this.itemModifiedEvt.fire(this.selectedRecord);
      }
      
   },
   
   /**
    * Remove the record that has not been saved
    */
   removeUnsavedRecord: function() {
      this.datatable.deleteRow(this.selectedRecord);
   },
   
   /**
    * Cancel row edition
    */
   onCancelForm: function(e) {
      Event.stopEvent(e); 
      this.hideSubform();
      
      if(this.editingNewRecord) {
         this.removeUnsavedRecord();
         this.editingNewRecord = false;
      }
   },
   
   /**
    * Hide the form
    */
   hideSubform: function() {
      Dom.setStyle(this.formContainer, "display", "none");
   },
   
   /**
    * Show the form
    */
   showSubform: function(rowIndex) {
       Dom.setStyle(this.formContainer, "display", "");
       this.deplaceSubForm(rowIndex);
       this.subForm.focus();
   },
   
   /**
    * Deplace the form
    */  
   deplaceSubForm: function(rowIndex) {
       var columnSet = this.datatable.getColumnSet();
       // Hack : it seems that the getTdEl function add a bug for rowIndex == 0
       if ( rowIndex == 0 ) {
           var tableFirstRow = this.datatable.getFirstTrEl();
           Dom.setY(this.formContainer,Dom.getY(tableFirstRow) - 18);
       } else {
           var column = columnSet.keys[columnSet.keys.length-1];           
           var cell = this.datatable.getTdEl({column: column, record: rowIndex});
           Dom.setY(this.formContainer,Dom.getY(cell) - 18);
       }
   },
   /**
    * Convert an inputEx fields definition to a DataTable columns definition
    */
   fieldsToColumndefs: function(fields) {
      var columndefs = [];
    	for(var i = 0 ; i < fields.length ; i++) {
    	   if(!this.options.tableColumns || inputEx.indexOf(fields[i].inputParams.name, this.options.tableColumns) != -1 ) {
    	      columndefs.push( this.fieldToColumndef(fields[i]) );
 	      }
    	}
    	
    	// Adding modify column if we use form editing and if allowModify is true
      if(this.options.editing == "formeditor" && this.options.allowModify ) {
    	   columndefs.push({
    	      key:'modify',
    	      label:' ',
    	      formatter:function(elCell) {
               elCell.innerHTML = inputEx.messages.modifyText;
               elCell.style.cursor = 'pointer';
            }
         });
      }
      
      // Adding delete column
      if(this.options.allowDelete) {
      	 columndefs.push({
      	    key:'delete',
      	    label:' ',
      	    formatter:function(elCell) {
               elCell.innerHTML = inputEx.messages.deleteText;
               elCell.style.cursor = 'pointer';
            }
         });
      }
      
      
    	return columndefs;
   },

   /**
    * Convert a single inputEx field definition to a DataTable column definition
    */
   fieldToColumndef: function(field) {
      var columnDef = {
         key: field.inputParams.name,
         label: field.inputParams.label,
         sortable: this.options.sortable, 
         resizeable: this.options.resizeable
      };

      // In cell editing if the field is listed in this.options.editableFields
      if(this.options.editing && lang.isArray(this.options.editableFields) ) {
         if(inputEx.indexOf(field.inputParams.name, this.options.editableFields) != -1) {
             columnDef.editor = new inputEx.widget.InputExCellEditor(field);
         }
      }
      
      // Field formatter
      if(field.formatter) {
         columnDef.formatter = field.formatter;
      }
      else {
         if(field.type == "date") {
            columnDef.formatter = YAHOO.widget.DataTable.formatDate;
         }
      }
      // TODO: other formatters
      return columnDef;
   }
   
};







/**
 * The InputExCellEditor class provides functionality for inline editing
 * using the inputEx field definition.
 *
 * @class InputExCellEditor
 * @extends YAHOO.widget.BaseCellEditor 
 * @constructor
 * @param {Object} inputExFieldDef InputEx field definition object
 */
inputEx.widget.InputExCellEditor = function(inputExFieldDef) {
    this._inputExFieldDef = inputExFieldDef;
   
    this._sId = "yui-textboxceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    inputEx.widget.InputExCellEditor.superclass.constructor.call(this, "inputEx", {disableBtns:true});
};

// InputExCellEditor extends BaseCellEditor
lang.extend(inputEx.widget.InputExCellEditor, YAHOO.widget.BaseCellEditor,
/**
 * @scope inputEx.widget.InputExCellEditor.prototype
 */
{

   /**
    * Render the inputEx field editor
    */
   renderForm : function() {
   
      // Build the inputEx field
      this._inputExField = inputEx(this._inputExFieldDef);
      this.getContainerEl().appendChild(this._inputExField.getEl());
   
      // Save the cell value at updatedEvt
      this._inputExField.updatedEvt.subscribe(function(e, args) {
         // Hack to NOT close the field at the first updatedEvt (fired when we set the value)
         if(this._updatedEvtForSetValue) {
            this._updatedEvtForSetValue = false;
            return;
         }
         this.save();
      }, this, true);
   
      if(this.disableBtns) {
         // By default this is no-op since enter saves by default
         this.handleDisabledBtns();
      }
   },

   /**
    * Hack to NOT close the field at the first updatedEvt (fired when we set the value)
    */
   show: function() {
      inputEx.widget.InputExCellEditor.superclass.show.call(this); 
      this._updatedEvtForSetValue = true;
   },

   /**
    * Resets InputExCellEditor UI to initial state.
    */
   resetForm : function() {
       this._inputExField.setValue(lang.isValue(this.value) ? this.value.toString() : "");
   },

   /**
    * Sets focus in InputExCellEditor.
    */
   focus : function() {
      this._inputExField.focus();
   },

   /**
    * Returns new value for InputExCellEditor.
    */
   getInputValue : function() {
      return this._inputExField.getValue();
   }

});

// Copy static members to InputExCellEditor class
lang.augmentObject(inputEx.widget.InputExCellEditor, YAHOO.widget.BaseCellEditor);


inputEx.messages.saveText = "Save";
inputEx.messages.cancelText = "Cancel";
inputEx.messages.deleteText = "delete";
inputEx.messages.modifyText = "modify";
inputEx.messages.insertItemText = "Insert";
inputEx.messages.confirmDeletion = "Are you sure?";

})();