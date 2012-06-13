/**
 * @module inputex-datatable
 */
YUI.add("inputex-datatable", function(Y) {

 var MSGS = Y.inputEx.messages;

 function DatatableInputex() {
     DatatableInputex.superclass.constructor.apply(this, arguments);
 }

 /////////////////////////////////////////////////////////////////////////////
 //
 // STATIC PROPERTIES
 //
 /////////////////////////////////////////////////////////////////////////////
 Y.mix(DatatableInputex, {

     /**
  * The namespace for the plugin. This will be the property on the host which
  * references the plugin instance.
  *
  * @property NS
  * @type String
  * @static
  * @final
  * @value "inputex"
  */
     NS: "inputex",

     /**
  * Class name.
  *
  * @property NAME
  * @type String
  * @static
  * @final
  * @value "datatableInputex"
  */
     NAME: "datatableInputex",

     /////////////////////////////////////////////////////////////////////////////
     //
     // ATTRIBUTES
     //
     /////////////////////////////////////////////////////////////////////////////
     ATTRS: {
        
        // The Y.inputEx.Panel instance to add/modify
         panel: {
            valueFn: '_initPanel',
            lazyAdd: true
         },
         
         inputEx: {
            value: null
         },

         mode: {
            value: null,
         },

         modifyColumnLabel: {
             value: MSGS.modifyText
         },
         
         deleteColumnLabel: {
             value: MSGS.deleteText
         },

         deleteColumn: {
             value: null
         },

         confirmDelete: {
             value: true
         },
         
         // a pointer to the record being modified
         modifyRecord: {
            
         },
         
         deleteTemplate: {
            // TODO
         }
     },


     /////////////////////////////////////////////////////////////////////////////
     //
     // STATIC METHODS
     //
     /////////////////////////////////////////////////////////////////////////////

     /**
  * Convert an inputEx fields definition to a DataTable columns definition
  */
     fieldsToColumndefs: function(fields) {
         var columndefs = [];
         for (var i = 0; i < fields.length; i++) {
             columndefs.push(this.fieldToColumndef(fields[i]));
         }
         return columndefs;
     },

     /**
  * Convert a single inputEx field definition to a DataTable column definition
  */
     fieldToColumndef: function(field) {

         var key,
         label,
         colmunDef;

         key = field.name;
         label = field.label;

         columnDef = {
             key: key,
             label: label,
             sortable: true,
             resizeable: true
         };

         // Field formatter
         if (field.type == "date") {
             columnDef.formatter = YAHOO.widget.DataTable.formatDate;
         }
         else if (field.type == "integer" || field.type == "number") {
             columnDef.formatter = YAHOO.widget.DataTable.formatNumber;
             /*columnDef.sortOptions = {
				defaultDir: "asc",
				sortFunction: // TODO: sort numbers !!!
			}*/
         }
         // TODO: other formatters
         return columnDef;
     }

 });




 /////////////////////////////////////////////////////////////////////////////
 //
 // PROTOTYPE
 //
 /////////////////////////////////////////////////////////////////////////////
 Y.extend(DatatableInputex, Y.Plugin.Base, {

     /////////////////////////////////////////////////////////////////////////////
     //
     // METHODS
     //
     /////////////////////////////////////////////////////////////////////////////
     /**
 * Initializer.
 *
 * @method initializer
 * @param config {Object} Config object.
 * @private
 */
     initializer: function(config) {
         var dt = this.get("host");

         this.doAfter("renderUI", this._afterRenderUI);


         this.doAfter("_addTheadTrNode", this._afterAddTheadTrNode);
         this.doAfter("_createTbodyTrNode", this._afterCreateTbodyTrNode);

         this.publish("addRow");

         this.publish("modifyRow");

         this.publish("deleteRow");

         // Attach trigger handlers
         dt.delegate("click", Y.bind(this._onRemoveLabelClick, this), "td.delete_column");
         dt.delegate("click", Y.bind(this._onModifyLabelClick, this), "td.modify_column");
         
     },

     _afterRenderUI: function() {
         this._renderAddButton();
     },

     _renderAddButton: function() {
         var button = Y.Node.create("<button>"+MSGS.addButtonText+"</button");

         button.on('click', Y.bind(this._onAddButtonClick, this));

         button.appendTo(this.get('host').get("contentBox"));
     },

     _onAddButtonClick: function(e) {
         
         this.set('mode','add');
         
         this.get('panel').get('field').clear();
         this.showPanel();
     },

     _initPanel: function() {
        
        var that = this;
        
         var panel = new Y.inputEx.Panel({
             centered: true,
             width: 500,
             modal: true,
             zIndex: 5,
             visible: false,
             inputEx: this.get('inputEx'),
             headerContent: "AddItem",

             buttons: [
             {
                 value: "Save",
                 action: function(e) {
                     e.preventDefault();
                     panel.hide();

                     var evt = (that.get('mode') == 'modify') ? 'modifyRow' : 'addRow';
                     
                     that.fire(evt, {
                        data: panel.get('field').getValue()
                     });
                 },
                 section: Y.WidgetStdMod.FOOTER
             },
             {
                 value: "Cancel",
                 action: function(e) {
                     e.preventDefault();
                     panel.hide();
                 },
                 section: Y.WidgetStdMod.FOOTER
             }
             ]
         });
         panel.render();
         
         //this.set('panel', panel);
         return panel;
     },

     showPanel: function() {
         /*if (!this.get('panel')) {
             this._renderPanel();
         }*/
         this.get('panel').show();
     },


     /**
   * Add a "delete" column to the datatable
   */
     _afterAddTheadTrNode: function(o, isFirst, isLast) {
         if (isFirst) {

             var dt = this.get("host");


             // Modify column

             var modifyColumn = new Y.Column({
                 label: this.get('modifyColumnLabel'),
                 key: "modify_column"
                 // formatter ?
             });

             dt._addTheadThNode({
                 value: modifyColumn.get("label"),
                 column: modifyColumn,
                 tr: o.tr
             });
             
             this.set('modifyColumn', modifyColumn);

             // Delete column

             var deleteColumn = new Y.Column({
                 label: this.get('deleteColumnLabel'),
                 key: "delete_column"
                 // formatter ?
             });

             dt._addTheadThNode({
                 value: deleteColumn.get("label"),
                 column: deleteColumn,
                 tr: o.tr
             });

             this.set('deleteColumn', deleteColumn);
         }
     },


     /**
   * Add the remove column to the table
   * Create the TD node to delete
   */
     _afterCreateTbodyTrNode: function(a) {
         var dt = this.get("host");

         this._createModifyColumn(a);
         this._createDeleteColumn(a);
      },

      _createDeleteColumn: function(a) {
         // Delete column

         var o = {};
         o.headers = a.column.headers;
         o.value = "delete"; // TODO: use template
         o.classnames = a.classnames + " delete_column";

         var t = Y.Lang.sub(Y.DataTable.Base.prototype.tdTemplate, o);

         o.td = Y.Node.create(t);

         // save a reference to the record
         o.td.record = a.record;

         o.td.tr = a.tr;

         a.tr.appendChild(o.td);
     },
     
     _createModifyColumn: function(a) {
        
              var dt = this.get("host");
        // Modify column

        var o = {};
        o.headers = a.column.headers;
        o.value = "modify"; // TODO: use template
        o.classnames = a.classnames + " modify_column";

        var t = Y.Lang.sub(Y.DataTable.Base.prototype.tdTemplate, o);

        o.td = Y.Node.create(t);

        // save a reference to the record
        o.td.record = a.record;

        o.td.tr = a.tr;

        a.tr.appendChild(o.td);
     },


     _onModifyLabelClick: function(e) {
        
        var td = e.currentTarget,
        tr = td.tr,
        record = td.record,
        dt = this.get('host'),
        rs = dt.get('recordset');
        
        this.set('mode','modify');
        this.set('modifyRecord', record);
        
        var data = record.get("data");
        this.get('panel').get('field').setValue(data);
        
        this.showPanel();
     },

     /**
   * Send the remove event
   */
     _onRemoveLabelClick: function(e) {

         if (!this.get('confirmDelete') || confirm(MSGS.confirmDeletion)) {
             this.fire("deleteRow", e);
         }

     },

     /**
   * Remove the Record from the record set
   */
     confirmDelete: function(e) {

         var td = e.currentTarget,
         tr = td.tr,
         record = td.record,
         dt = this.get('host'),
         rs = dt.get('recordset');

         // Remove the record from the recordset
         rs.remove(rs.indexOf(record));

         // Remove the row from the table
         tr.remove();
     },
     
     
     addRow: function(data) {
        
        var dt = this.get('host'),
            rs = dt.get('recordset');
        
        rs.add(data);
        
        // Only add tr ?
        dt._uiSetRecordset( rs );
     },
     
     modifyRow: function(data, details) {
       
          var dt = this.get('host'),
              rs = dt.get('recordset');

         var record = this.get('modifyRecord');

         record.set('data', data);
         
         // TODO: update tr only ?
         dt._uiSetRecordset( rs );
     }


 });

 Y.namespace("Plugin").DatatableInputex = DatatableInputex;



},
'3.0.0a', {
    requires: ['inputex-group', 'inputex-panel', 'datatable']
});
