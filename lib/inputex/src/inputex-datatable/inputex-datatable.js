YUI.add("inputex-datatable", function (Y) {
/**
 * The inputex-datatable module provides the inputEx.Plugin.InputExDataTable class which is a plugin.
 * @module inputex-datatable
 */

    var inputEx = Y.inputEx,
        MSGS = Y.inputEx.messages;

    // namespace definition
    Y.namespace('inputEx.Plugin');


  /**
   * Provide add/modify/delete functionalities on a dataTable as a plugin
   * @class inputEx.Plugin.InputExDataTable
   * @extends Plugin.Base
   * @constructor
   * @param {Object} configuration object
   */
   inputEx.Plugin.InputExDataTable = function (config) {
      inputEx.Plugin.InputExDataTable.superclass.constructor.call(this, config);
    };

   inputEx.Plugin.InputExDataTable.NS = "InputExDataTable";

    Y.extend(inputEx.Plugin.InputExDataTable, Y.Plugin.Base, {
       
       /**
        * @method initializer
        */
        initializer: function () {

            var host = this.get("host");

            // enrich data (Model instance) with modify and delete attributs
            this.enrichData();
            // enrich DataTable with modify and delete columns
            this.enrichColumns();
            // add a button called "add" in order to add record in the DataTable
            this.addAddButton();
            
            if(!this.get("disableModifyFunc")){
                // handle row modification
                host.delegate("click",this.modifyRecord,"td.inputEx-DataTable-modify", this);
            }
            if(!this.get("disableDeleteFunc")){
                // handle row removal
                host.delegate("click",this.deleteRecord, "td.inputEx-DataTable-delete", this);
            }
        },
        /**
         * add Attributes on the data model depending on the plugin configuration
         *
         * @method enrichData
         * @param {EventFacade} e
         */
        enrichData: function (e) {

            var that = this,
                data = this.get("host").get("data");

            data.each(function (model) {
                if(!this.get("disableModifyFunc")){
                    that.addModifyAttr(model);
                }
                if(!this.get("disableDeleteFunc")){
                    that.addDeleteAttr(model);
                }
            });
        },
        /**
         * add Columns on the DataTable depending on the plugin configuration
         *
         * @method enrichColumns
         */
        enrichColumns: function () {
            if(!this.get("disableModifyFunc")){
                this.addModifyColumn();
            }
            if(!this.get("disableDeleteFunc")){
                this.addDeleteColumn();
            }
        },
        /**
         * Provide the add button in order to add record on the DataTable
         *
         * @method addAddButton
         */
        addAddButton : function(){
            if(!this.get("disableAddFunc")){
            var button = Y.Node.create("<button id='addButton'>"+MSGS.addButtonText+"</button"),
                panel = this.get("panel");
            this.get("host").get("contentBox").append(button);
            button.on("click",function  (e) {
                panel.set("headerContent","Add Item");
                panel.get("field").clear();
                panel.show();
            },this);
            }
        },
        /**
         *
         * @method modifyRecord
         */
        modifyRecord : function(e){
                e.stopPropagation();
                var record = this.get("host").getRecord(e.currentTarget),
                    panel = this.get("panel");
                panel.set("headerContent","Modify Item");
                panel.get('field').setValue(record.getAttrs());
                panel.show();
        },
        /**
         *
         * @method deleteRecord
         */
        deleteRecord : function(e){
                e.stopPropagation();
                var record = this.get("host").getRecord(e.currentTarget);
                if (!this.get("confirmDelete") || confirm(MSGS.confirmDeletion)) {
                    this.get("host").get("data").remove(record);
                }
        },
         /**
         *
         * @method deleteExtraColumns
         */
        deleteExtraColumns : function(){
            if(!this.get("disableModifyFunc")){
                this.removeModifyColumn();
            }
            if(!this.get("disableDeleteFunc")){
                this.removeDeleteColumn();
            }
        },
         /**
         *
         * @method _initPanel
         * @private
         */
        _initPanel: function () {

            var that = this;

            var panel = new Y.inputEx.Panel({
                centered: true,
                width: 500,
                modal: true,
                zIndex: 5,
                visible: false,
                inputEx: that.get("inputEx"),
          
      buttons: [{
          value: "Cancel",
          action: function (e) {
              e.preventDefault();
              panel.hide();
          }
      },{
          value: "Save",
          action: function (e) {
              e.preventDefault();

              var field = that.get("panel").get("field"),
                  fieldValues = field.getValue(),
                  host = that.get("host"),
                  model;

              if (field.validate()) {

                  if (fieldValues.id) {
                      // modification
                      host.get("data").getById(fieldValues.id).setAttrs(fieldValues);
                  } else {
                      // creation
                      fieldValues.id = that.generateId(that.get("idSize"));
                      model = new Y.Model();
                      model.setAttrs(fieldValues);
                      that.addModifyAttr(model);
                      that.addDeleteAttr(model);
                      host.get("data").add(model);
                  }
                  panel.hide();
              }
          }
      }]
            });

            // first the panel needs to be "render" then "show"
            panel.render();
            return panel;

        },
        /**
         *
         * @method destructor
         */
        destructor : function(){

            var that = this,
                data = this.get("host").get("data");

            data.each(function (model) {

                if(!this.get("disableModifyFunc")){
                    that.delModifyAttr(model);
                }
                if(!this.get("disableDeleteFunc")){
                    that.delDeleteAttr(model);
                }

            });
            this.deleteExtraColumns();
            if(!this.get("disableAddFunc")){
                Y.one("#addButton").remove();
            }

            this.get("panel").destroy();
        },
        /**
         * Add the modify attribute on the data model
         *
         * @method addModifyAttr
         */
        addModifyAttr : function(model){model.addAttr("modify");},
        /**
         * Add the delete attribute on the data model
         *
         * @method addDeleteAttr
         */
        addDeleteAttr : function(model){model.addAttr("delete");},
        /**
         * Remove the modify attribute from the data model
         *
         * @method delModifyAttr
         */
        delModifyAttr : function(model){model.removeAttr("modify");},
        /**
         * Remove the modify attribute from the data model
         *
         * @method delDeleteAttr
         */
        delDeleteAttr : function(model){model.removeAttr("delete");},
        /**
         * Add the modify column on the DataTable
         *
         * @method addModifyColumn
         */
        addModifyColumn : function(){
                this.get("host").addColumn({
                key: this.get("modifyColumnLabel"),
                className: "inputEx-DataTable-modify"
            });
        },
        /**
         * Add the delete column on the DataTable
         *
         * @method addDeleteColumn
         */
        addDeleteColumn : function(){
            this.get("host").addColumn({
                key: this.get("deleteColumnLabel"),
                className: "inputEx-DataTable-delete"
            });
        },
        /**
         * Remove the modify column from the DataTable
         *
         * @method removeModifyColumn
         */
        removeModifyColumn : function(){this.get("host").removeColumn("modify");},
        /**
         * Remove the delete column from the DataTable
         *
         * @method removeDeleteColumn
         */
        removeDeleteColumn : function(){this.get("host").removeColumn("delete");},
        generateId : function(size){
            var prefixId = this.get("prefixId"),
                s = size ? size : 5;
            prefixId = prefixId ? prefixId : "";
            return prefixId + Math.floor(Math.random()*Math.pow(10,s));
        }
    }, {
/**
 * Static property used to define the default attribute configuration of
 * the Plugin.
 *
 * @property ATTRS
 * @type {Object}
 * @static
 */
ATTRS: {
    /**
     * This is an inputEx field definition. This is used when a user try to create/modify a record
     *
     * @attribute inputEx
     */
    inputEx: {},
    /**
     * This string is inserted before the generated id
     *
     * @attribute prefixId
     * @type String
     * @example prefixId : "po-" --> id = po-1342561
     */
    prefixId: {
        value: ""
    },
    /**
     * This represents the number of digits used in the id generation
     * 
     * @attribute idSize
     * @type Number
     */
    idSize: {
        value: 5
    },
    /**
     * If true the add functionality is disabled
     *
     * @attribute disableAddFunc
     * @type boolean
     */
    disableAddFunc: {
        value: false
    },

    /**
     * If true the modify functionality is disabled
     * @attribute disableModifyFunc
     * @type boolean
     */
    disableModifyFunc: {
        value: false
    },
    /**
     * If true the delete functionality is disabled
     *
     * @attribute disableDeleteFunc
     * @type boolean
     */
    disableDeleteFunc: {
        value: false
    },
    /**
     * Label of the modify column
     *
     * @attribute modifyColumnLabel
     */
    modifyColumnLabel: {
        value: MSGS.modifyText
    },
    /**
     * Label of the delete column
     *
     * @attribute deleteColumnLabel
     */
    deleteColumnLabel: {
        value: MSGS.deleteText
    },
    /**
     * If true a confirmation will be asked to the user when a delete attempt appear
     *
     * @attribute confirmDelete
     * @type boolean
     */
    confirmDelete: {
        value: true
    },
    /**
     * This panel will be displayed on record creation/modication
     * @attribute panel
     * @type Y.inputEx.Panel
     */
    panel: {
        valueFn: '_initPanel',
        lazyAdd: true
    }
}});

}, "", {requires: ['inputex-group', 'inputex-panel','datatable']});