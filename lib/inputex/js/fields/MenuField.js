(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class Create a menu field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>menuItems : contains descriptions of menu items</li>
 *	   <li>menuTrigger : event to trigger menu show</li>
 *    <li>menuInvite : text to display when no selection made</li>
 *    <li>menuPosition : array of corners positions (syntax : ['menu popup corner','invite div corner'])</li>
 * </ul>
 */
inputEx.MenuField = function(options) {
	inputEx.MenuField.superclass.constructor.call(this,options);
};

lang.extend(inputEx.MenuField, inputEx.Field,
/**
 * @scope inputEx.MenuField.prototype
 */
{
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
	setOptions: function(options) {
	   inputEx.MenuField.superclass.setOptions.call(this,options);
	   
	   // Overwrite options:
	   this.options.className = options.className ? options.className : 'inputEx-Field inputEx-MenuField';
	   
	   // New options
	   this.options.menuInvite = options.menuInvite || inputEx.messages.menuInvite;
	   this.options.menuTrigger = options.menuTrigger || "click";
	   this.options.menuPosition = options.menuPosition || ["tl","tr"];
	   this.options.menuItems = options.menuItems;
	},
	
	
	/**
    * Build a menu
    */
   renderComponent: function() {
      
      // Div to display the invite, then the selected text
      this.el = inputEx.cn('div', {className:'inputEx-Result'}, null, this.options.menuInvite);
      YAHOO.util.Dom.addClass(this.el, (this.options.menuPosition[1] == "tr") ? "inputEx-RightArrow" : "inputEx-DownArrow");
      this.fieldContainer.appendChild(this.el);
      
      // Keep selected value in a hidden field
	   this.hiddenEl = inputEx.cn('input', {type: 'hidden', name: this.options.name || '', value: this.options.value || ''});
	   this.fieldContainer.appendChild(this.hiddenEl);
	   
	   // Init Menu
	   this.initMenu();
   },
   
   
   // Parse menuItems option to add ids, listeners, etc.
	initMenuItems: function() {
	   
	   // Keep corresponding text for each value selectable in the menu
	   //   -> will be used to display selection after click
	   this._textFromValue = {};
	   
	   var that = this;
	   
	   /*
	   * Recursive function to edit a level of menuItems
	   *
	   * args :
	   *   -> conf : an array of menuItems
	   *   -> level : how deeply nested are these menuItems (4 is max)
	   */
	   function levelInit(conf,level) {
	      if (level>4) throw new Error("MenuField : too much recursion, menuItems property should be 5 level deep at most.");
	      
	      var item;
	      for (var i=0, length = conf.length; i < length; i++) {
	         item = conf[i];
            
            // item with submenu
            //   -> explore deeper
	         if (!YAHOO.lang.isUndefined(item.submenu)) {
	            
	            // ensure there is an id on submenu (else submenu is not created)
	            if (YAHOO.lang.isUndefined(item.submenu.id)) {
	               item.submenu.id = YAHOO.util.Dom.generateId();
	            }
	            
	            // continue one level deeper
	            levelInit(item.submenu.itemdata,level+1);
	            
	         // item without submenu
	         //   -> add click listener to this item
	         //   -> pass selected value to the listener (as the 3rd argument)
	         } else {
	            that._textFromValue[item.value] = item.text;
	            item.onclick = {fn:function() {that.onItemClick.apply(that,arguments);},obj:item.value};
	         }
	      }
	   };
	   
	   levelInit(this.options.menuItems,0);
	   
	},
	
	
   initMenu: function() {
	   this.initMenuItems(); // edit this.options.menuItems
	   
      this.menuContainer = inputEx.cn('div');
	   this.fieldContainer.appendChild(this.menuContainer);
	   
	   var context = [this.el].concat(this.options.menuPosition);
	   
      this.menu = new YAHOO.widget.Menu(YAHOO.util.Dom.generateId(),{context:context});
      this.menu.addItems(this.options.menuItems);
      this.menu.render(this.menuContainer);
   },
   
   
   initEvents: function() {
      this.menu.subscribe("show", this.menu.focus);
      
      // Listener to show menu
      YAHOO.util.Event.addListener(this.el, this.options.menuTrigger, function() {
         if (!this.menu.cfg.getProperty("visible")) {
            this.menu.align();
            this.menu.show();
         }
      }, null, this);
   },
   
   
   onItemClick: function(p_sType, p_aArgs, p_Value) {
      this.setValue(p_Value,true);
   },
   
   
   getValue: function() {
      return this.hiddenEl.value;
   },
   
   
   setValue: function(value, sendUpdatedEvt) {
      // update text
      this.el.innerHTML = this._textFromValue[value] || this.options.menuInvite;
      
      // set value
      this.hiddenEl.value = (!!this._textFromValue[value]) ? value : '';
	   inputEx.MenuField.superclass.setValue.call(this,value, sendUpdatedEvt);
   }
   
});

inputEx.messages.menuInvite = "Click here to select";

/**
 * Register this class as "menu" type
 */
inputEx.registerType("menu", inputEx.MenuField);

})();