YUI.add('inputex-ddlist', function (Y) {

   var lang       = Y.Lang,
       inputEx    = Y.inputEx,
       create     = Y.Node.create,
       substitute = Y.substitute,
       DDListField;

   /**
    * Create a sortable list field with drag and drop
    *
    * @class DDListField
    * @extends inputEx.Field
    * @constructor
    * @param {Object} options Added options:
    * <ul>
    *	   <li>items: list of option elements configurations</li>
    *    <li>name: hidden inputs name</li>
    *    <li>valueKey: value key</li>
    *    <li>labelKey: label key</li>
    * </ul>
    */
   DDListField = function (options) {
      DDListField.superclass.constructor.call(this, options);
   };

   DDListField.LIST_TEMPLATE = '<ul class="inputEx-ddlist">{items}</ul>';

   DDListField.LIST_ITEM_CLASS = 'inputEx-ddlist-item';

   DDListField.LIST_ITEM_TEMPLATE =
      '<li class="{class}">' +
         '<span class="inputEx-ddlist-item-label">{label}</span>' +
         '<input type="hidden" name="{name}" value="{value}" />' +
      '</li>';

   Y.extend(DDListField, inputEx.Field, {

      setOptions: function (options) {
         DDListField.superclass.setOptions.call(this, options);

         this.options.items    = lang.isArray(options.items) ? options.items : [];
         this.options.valueKey = options.valueKey || "value";
         this.options.labelKey = options.labelKey || "label";
         this.options.name     = options.name || Y.guid();

         if (this.options.name.substr(-2) !== '[]') {
            this.options.name += '[]';
         }
      },

      renderComponent: function () {
         var html, ul;

         html = Y.Array.reduce(this.options.items, '', this.renderListItem, this);
         html = substitute(DDListField.LIST_TEMPLATE, {items: html});

         ul = create(html);
         ul.appendTo(this.fieldContainer);

         this.sortable = new Y.Sortable({
            container: ul,
            nodes:     '.' + DDListField.LIST_ITEM_CLASS,
            opacity:   '.1'
         });
      },

      renderListItem: function (previousValue, currentValue) {
         return previousValue + substitute(DDListField.LIST_ITEM_TEMPLATE, {
            'class': DDListField.LIST_ITEM_CLASS,
            'value': currentValue[this.options.valueKey],
            'label': currentValue[this.options.labelKey],
            'name':  this.options.name
         });
      },

      addItem: function (item) {
         // TODO
         
         this.sortable.sync();
      },

      removeItem: function (item) {
         // TODO

         this.sortable.sync();
      },

      getValue: function () {
         return Y.one(this.fieldContainer)
                 .all('.'+DDListField.LIST_ITEM_CLASS+' input')
                 .get('value');
      }

   });

   inputEx.DDListField = DDListField;
   inputEx.registerType("ddlist", DDListField);

}, '3.0.0a', {
   requires: ['inputex-field', 'array-extras', 'sortable', 'substitute']
});
