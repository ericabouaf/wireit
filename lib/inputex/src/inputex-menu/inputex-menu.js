/**
 * @module inputex-menu
 */
YUI.add("inputex-menu",function(Y){

   var inputEx     = Y.inputEx,
       lang        = Y.Lang,
       substitute  = Y.substitute,
       create      = Y.Node.create,

       VERTICAL    = 'vertical',
       HORIZONTAL  = 'horizontal';

/**
 * Create a menu field
 * @class inputEx.MenuField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>typeInvite      : text to display when no selection made</li>
 *    <li>menuItems       : contains descriptions of menu items</li>
 *    <li>menuTrigger     : (optional, default: 'click') event to trigger menu show, ex: mouseover</li>
 *    <li>menuOrientation : (optional, default: 'vertical') menu orientation, ex: 'horizontal'</li>
 *    <li>menuConfig      : (optional) object used as a config for the MenuNav node plugin</li>
 * </ul>
 */
inputEx.MenuField = function(options) {
   inputEx.MenuField.superclass.constructor.call(this,options);
};

inputEx.MenuField.MENU_TEMPLATE = 
   '<div class="yui3-menu" id="{menu_id}">' +
       '<div class="yui3-menu-content">' +
           '<ul>' +
               '{menu_items}' +
           '</ul>' +
       '</div>' +
   '</div>';

inputEx.MenuField.MENU_ITEM_TEMPLATE = 
   '<li class="{item_class}">' +
      '<a href="{href}" class="{label_class}">{label}</a>' +
      '{submenu}' +
   '</li>';

Y.extend(inputEx.MenuField, inputEx.Field, {
   /**
    * Set the default values of the options
    * @method setOptions
    * @param {Object} options Options object as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.MenuField.superclass.setOptions.call(this,options);

      // Overwrite options:
      this.options.className = options.className ? options.className : 'inputEx-Field inputEx-MenuField';

      // New options
      this.options.typeInvite = options.typeInvite || inputEx.messages.menuTypeInvite;
      this.options.menuTrigger = options.menuTrigger || "click";
      this.options.menuOrientation = options.menuOrientation || VERTICAL;
      this.options.menuItems = options.menuItems;

      // Configuration options for the generated YUI MenuNav node plugin
      this.options.menuConfig = options.menuConfig || {
         autoSubmenuDisplay: (this.options.menuTrigger == 'mouseover')
      };
   },

   /**
    * Build a menu
    * @method renderComponent
    */
   renderComponent: function() {
      // Keep selected value in a hidden field
      this.hiddenEl = inputEx.cn('input', {type: 'hidden', name: this.options.name || '', value: this.options.value || ''});
      this.fieldContainer.appendChild(this.hiddenEl);
      this.renderMenu(this.fieldContainer);
   },

   /**
    * Parse menuItems option to add ids, listeners, etc.
    * @method renderMenu
    */
   renderMenu: function(container) {
      var that = this;

      // Keep corresponding text for each value selectable in the menu
      //   -> will be used to display selection after click
      this._textFromValue = {};

      var renderMenuRecurs = function (id, conf, level) {
         if (level>5) throw new Error("MenuField : too much recursion, menuItems property should be 5 level deep at most.");

         var html = '',
             length = conf.length,
             item,
             templateData,
             i;

         for (i = 0; i < length; i++) {
            item = conf[i];

            if (lang.isUndefined(item.text) && !lang.isUndefined(item.value)) {
               item.text = item.value;
            }
            if (lang.isUndefined(item.value) && !lang.isUndefined(item.text)) {
               item.value = item.text;
            }

            templateData = {
               label:         item.text,
               href:          '#'+item.value,
               submenu:       '',
               label_class:   'yui3-menuitem-content',
               item_class:    ''
            };

            // item with submenu
            if (!lang.isUndefined(item.submenu)) {
               templateData.label_class = 'yui3-menu-label';
               templateData.submenu     = renderMenuRecurs(item.value, item.submenu.itemdata, level+1);
            } else {
               templateData.item_class = 'yui3-menuitem';
               that._textFromValue[item.value] = item.text;
            }

            html += substitute(inputEx.MenuField.MENU_ITEM_TEMPLATE, templateData);
         }

         return substitute(inputEx.MenuField.MENU_TEMPLATE, {
            menu_id:    id,
            menu_items: html
         });

      };

      this._menu = create(renderMenuRecurs(Y.guid(), [{
         text: this.options.typeInvite, 
         submenu: {itemdata: this.options.menuItems}
      }], 0));

      if (this.options.menuOrientation === HORIZONTAL) {
         this._menu.addClass('yui3-menu-horizontal  yui3-menubuttonnav');
      }

      // Retrieve the first label for later use
      this._rootItemLabel = this._menu.one('.yui3-menu-label');
      if (this.options.menuOrientation === HORIZONTAL) {
         this._rootItemLabel.setContent('<em>'+this.options.typeInvite+'</em>');
         this._rootItemLabel = this._rootItemLabel.one('em');
      }

      this._menu.plug(Y.Plugin.NodeMenuNav, this.options.menuConfig);
      this._menu.appendTo(container);
   },

   /**
    * @method initEvents
    */
   initEvents: function() {
      var that = this;

      this._menu.delegate('click', Y.bind(this.onItemClick, this), 'a');

      if (this.options.menuTrigger == 'click') {
         this._menu.menuNav._rootMenu.on(['mousedown', 'click'], function (e) {
            var menuNav = that._menu.menuNav;
            menuNav._toggleSubmenuDisplay.call(menuNav, e);
         }, this._menu.menuNav); 
      }
   },
   
   /**
    * @method onItemClick
    */
   onItemClick: function(e) {
      var target = e.currentTarget,
          href;

      e.preventDefault();

      if (target.hasClass('yui3-menuitem-content')) {
         // Need to pass "2" as a second argument to "getAttribute" for
         // IE otherwise IE will return a fully qualified URL for the
         // value of the "href" attribute.
         // http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
         href = target.getAttribute("href", 2);
         this.setValue(href.substr(href.indexOf('#') + 1), true);

         // Hides submenus
         this._menu.menuNav._hideAllSubmenus(this._menu.menuNav._rootMenu);
      }
   },
   
   /**
    * @method getValue
    */
   getValue: function() {
      return this.hiddenEl.value;
   },

   /**
    * @method setValue
    */
   setValue: function(value, sendUpdatedEvt) {
      // update text
      this._rootItemLabel.setContent(this._textFromValue[value] || this.options.typeInvite);

      // set value
      this.hiddenEl.value = (!!this._textFromValue[value]) ? value : '';
      inputEx.MenuField.superclass.setValue.call(this, value, sendUpdatedEvt);
   }

});

// Register this class as "menu" type
inputEx.registerType("menu", inputEx.MenuField);

}, '3.1.0',{
requires: ['inputex-field', 'node-event-delegate', 'node-menunav', 'substitute']
});

