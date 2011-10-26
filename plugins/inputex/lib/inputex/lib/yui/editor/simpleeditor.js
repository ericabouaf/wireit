/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
(function() {
var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang;
    /**
     * @module editor    
     * @description <p>Creates a rich custom Toolbar Button. Primarily used with the Rich Text Editor's Toolbar</p>
     * @class ToolbarButtonAdvanced
     * @namespace YAHOO.widget
     * @requires yahoo, dom, element, event, container_core, menu, button
     * 
     * Provides a toolbar button based on the button and menu widgets.
     * @constructor
     * @class ToolbarButtonAdvanced
     * @param {String/HTMLElement} el The element to turn into a button.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */
    if (YAHOO.widget.Button) {
        YAHOO.widget.ToolbarButtonAdvanced = YAHOO.widget.Button;
        /**
        * @property buttonType
        * @private
        * @description Tells if the Button is a Rich Button or a Simple Button
        */
        YAHOO.widget.ToolbarButtonAdvanced.prototype.buttonType = 'rich';
        /**
        * @method checkValue
        * @param {String} value The value of the option that we want to mark as selected
        * @description Select an option by value
        */
        YAHOO.widget.ToolbarButtonAdvanced.prototype.checkValue = function(value) {
            var _menuItems = this.getMenu().getItems();
            if (_menuItems.length === 0) {
                this.getMenu()._onBeforeShow();
                _menuItems = this.getMenu().getItems();
            }
            for (var i = 0; i < _menuItems.length; i++) {
                _menuItems[i].cfg.setProperty('checked', false);
                if (_menuItems[i].value == value) {
                    _menuItems[i].cfg.setProperty('checked', true);
                }
            }      
        };
    } else {
        YAHOO.widget.ToolbarButtonAdvanced = function() {};
    }


    /**
     * @description <p>Creates a basic custom Toolbar Button. Primarily used with the Rich Text Editor's Toolbar</p><p>Provides a toolbar button based on the button and menu widgets, &lt;select&gt; elements are used in place of menu's.</p>
     * @class ToolbarButton
     * @namespace YAHOO.widget
     * @requires yahoo, dom, element, event
     * @extends YAHOO.util.Element
     * 
     * 
     * @constructor
     * @param {String/HTMLElement} el The element to turn into a button.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */

    YAHOO.widget.ToolbarButton = function(el, attrs) {
        
        if (Lang.isObject(arguments[0]) && !Dom.get(el).nodeType) {
            attrs = el;
        }
        var local_attrs = (attrs || {});

        var oConfig = {
            element: null,
            attributes: local_attrs
        };

        if (!oConfig.attributes.type) {
            oConfig.attributes.type = 'push';
        }
        
        oConfig.element = document.createElement('span');
        oConfig.element.setAttribute('unselectable', 'on');
        oConfig.element.className = 'yui-button yui-' + oConfig.attributes.type + '-button';
        oConfig.element.innerHTML = '<span class="first-child"><a href="#">LABEL</a></span>';
        oConfig.element.firstChild.firstChild.tabIndex = '-1';
        oConfig.attributes.id = (oConfig.attributes.id || Dom.generateId());
        oConfig.element.id = oConfig.attributes.id;

        YAHOO.widget.ToolbarButton.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
    };

    YAHOO.extend(YAHOO.widget.ToolbarButton, YAHOO.util.Element, {
        /**
        * @property buttonType
        * @private
        * @description Tells if the Button is a Rich Button or a Simple Button
        */
        buttonType: 'normal',
        /**
        * @method _handleMouseOver
        * @private
        * @description Adds classes to the button elements on mouseover (hover)
        */
        _handleMouseOver: function() {
            if (!this.get('disabled')) {
                this.addClass('yui-button-hover');
                this.addClass('yui-' + this.get('type') + '-button-hover');
            }
        },
        /**
        * @method _handleMouseOut
        * @private
        * @description Removes classes from the button elements on mouseout (hover)
        */
        _handleMouseOut: function() {
            this.removeClass('yui-button-hover');
            this.removeClass('yui-' + this.get('type') + '-button-hover');
        },
        /**
        * @method checkValue
        * @param {String} value The value of the option that we want to mark as selected
        * @description Select an option by value
        */
        checkValue: function(value) {
            if (this.get('type') == 'menu') {
                var opts = this._button.options;
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].value == value) {
                        opts.selectedIndex = i;
                    }
                }
            }
        },
        /** 
        * @method init
        * @description The ToolbarButton class's initialization method
        */        
        init: function(p_oElement, p_oAttributes) {
            YAHOO.widget.ToolbarButton.superclass.init.call(this, p_oElement, p_oAttributes);

            this.on('mouseover', this._handleMouseOver, this, true);
            this.on('mouseout', this._handleMouseOut, this, true);
            this.on('click', function(ev) {
                Event.stopEvent(ev);
                return false;
            }, this, true);
        },
        /**
        * @method initAttributes
        * @description Initializes all of the configuration attributes used to create 
        * the toolbar.
        * @param {Object} attr Object literal specifying a set of 
        * configuration attributes used to create the toolbar.
        */        
        initAttributes: function(attr) {
            YAHOO.widget.ToolbarButton.superclass.initAttributes.call(this, attr);
            /**
            * @attribute value
            * @description The value of the button
            * @type String
            */            
            this.setAttributeConfig('value', {
                value: attr.value
            });
            /**
            * @attribute menu
            * @description The menu attribute, see YAHOO.widget.Button
            * @type Object
            */            
            this.setAttributeConfig('menu', {
                value: attr.menu || false
            });
            /**
            * @attribute type
            * @description The type of button to create: push, menu, color, select, spin
            * @type String
            */            
            this.setAttributeConfig('type', {
                value: attr.type,
                writeOnce: true,
                method: function(type) {
                    var el, opt;
                    if (!this._button) {
                        this._button = this.get('element').getElementsByTagName('a')[0];
                    }
                    switch (type) {
                        case 'select':
                        case 'menu':
                            el = document.createElement('select');
                            el.id = this.get('id');
                            var menu = this.get('menu');
                            for (var i = 0; i < menu.length; i++) {
                                opt = document.createElement('option');
                                opt.innerHTML = menu[i].text;
                                opt.value = menu[i].value;
                                if (menu[i].checked) {
                                    opt.selected = true;
                                }
                                el.appendChild(opt);
                            }
                            this._button.parentNode.replaceChild(el, this._button);
                            Event.on(el, 'change', this._handleSelect, this, true);
                            this._button = el;
                            break;
                    }
                }
            });

            /**
            * @attribute disabled
            * @description Set the button into a disabled state
            * @type String
            */            
            this.setAttributeConfig('disabled', {
                value: attr.disabled || false,
                method: function(disabled) {
                    if (disabled) {
                        this.addClass('yui-button-disabled');
                        this.addClass('yui-' + this.get('type') + '-button-disabled');
                    } else {
                        this.removeClass('yui-button-disabled');
                        this.removeClass('yui-' + this.get('type') + '-button-disabled');
                    }
                    if ((this.get('type') == 'menu') || (this.get('type') == 'select')) {
                        this._button.disabled = disabled;
                    }
                }
            });

            /**
            * @attribute label
            * @description The text label for the button
            * @type String
            */            
            this.setAttributeConfig('label', {
                value: attr.label,
                method: function(label) {
                    if (!this._button) {
                        this._button = this.get('element').getElementsByTagName('a')[0];
                    }
                    if (this.get('type') == 'push') {
                        this._button.innerHTML = label;
                    }
                }
            });

            /**
            * @attribute title
            * @description The title of the button
            * @type String
            */            
            this.setAttributeConfig('title', {
                value: attr.title
            });

            /**
            * @config container
            * @description The container that the button is rendered to, handled by Toolbar
            * @type String
            */            
            this.setAttributeConfig('container', {
                value: null,
                writeOnce: true,
                method: function(cont) {
                    this.appendTo(cont);
                }
            });

        },
        /** 
        * @private
        * @method _handleSelect
        * @description The event fired when a change event gets fired on a select element
        * @param {Event} ev The change event.
        */        
        _handleSelect: function(ev) {
            var tar = Event.getTarget(ev);
            var value = tar.options[tar.selectedIndex].value;
            this.fireEvent('change', {type: 'change', value: value });
        },
        /** 
        * @method getMenu
        * @description A stub function to mimic YAHOO.widget.Button's getMenu method
        */        
        getMenu: function() {
            return this.get('menu');
        },
        /** 
        * @method destroy
        * @description Destroy the button
        */        
        destroy: function() {
            Event.purgeElement(this.get('element'), true);
            this.get('element').parentNode.removeChild(this.get('element'));
            //Brutal Object Destroy
            for (var i in this) {
                if (Lang.hasOwnProperty(this, i)) {
                    this[i] = null;
                }
            }       
        },
        /** 
        * @method fireEvent
        * @description Overridden fireEvent method to prevent DOM events from firing if the button is disabled.
        */        
        fireEvent: function(p_sType, p_aArgs) {
            //  Disabled buttons should not respond to DOM events
            if (this.DOM_EVENTS[p_sType] && this.get('disabled')) {
                Event.stopEvent(p_aArgs);
                return;
            }
        
            YAHOO.widget.ToolbarButton.superclass.fireEvent.call(this, p_sType, p_aArgs);
        },
        /**
        * @method toString
        * @description Returns a string representing the toolbar.
        * @return {String}
        */        
        toString: function() {
            return 'ToolbarButton (' + this.get('id') + ')';
        }
        
    });
})();
/**
 * @module editor
 * @description <p>Creates a rich Toolbar widget based on Button. Primarily used with the Rich Text Editor</p>
 * @namespace YAHOO.widget
 * @requires yahoo, dom, element, event, toolbarbutton
 * @optional container_core, dragdrop
 */
(function() {
var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang;
    
    var getButton = function(id) {
        var button = id;
        if (Lang.isString(id)) {
            button = this.getButtonById(id);
        }
        if (Lang.isNumber(id)) {
            button = this.getButtonByIndex(id);
        }
        if ((!(button instanceof YAHOO.widget.ToolbarButton)) && (!(button instanceof YAHOO.widget.ToolbarButtonAdvanced))) {
            button = this.getButtonByValue(id);
        }
        if ((button instanceof YAHOO.widget.ToolbarButton) || (button instanceof YAHOO.widget.ToolbarButtonAdvanced)) {
            return button;
        }
        return false;
    };

    /**
     * Provides a rich toolbar widget based on the button and menu widgets
     * @constructor
     * @class Toolbar
     * @extends YAHOO.util.Element
     * @param {String/HTMLElement} el The element to turn into a toolbar.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */
    YAHOO.widget.Toolbar = function(el, attrs) {
        
        if (Lang.isObject(arguments[0]) && !Dom.get(el).nodeType) {
            attrs = el;
        }
        var local_attrs = {};
        if (attrs) {
            Lang.augmentObject(local_attrs, attrs); //Break the config reference
        }
        

        var oConfig = {
            element: null,
            attributes: local_attrs
        };
        
        
        if (Lang.isString(el) && Dom.get(el)) {
            oConfig.element = Dom.get(el);
        } else if (Lang.isObject(el) && Dom.get(el) && Dom.get(el).nodeType) {  
            oConfig.element = Dom.get(el);
        }
        

        if (!oConfig.element) {
            oConfig.element = document.createElement('DIV');
            oConfig.element.id = Dom.generateId();
            
            if (local_attrs.container && Dom.get(local_attrs.container)) {
                Dom.get(local_attrs.container).appendChild(oConfig.element);
            }
        }
        

        if (!oConfig.element.id) {
            oConfig.element.id = ((Lang.isString(el)) ? el : Dom.generateId());
        }
        
        var fs = document.createElement('fieldset');
        var lg = document.createElement('legend');
        lg.innerHTML = 'Toolbar';
        fs.appendChild(lg);
        
        var cont = document.createElement('DIV');
        oConfig.attributes.cont = cont;
        Dom.addClass(cont, 'yui-toolbar-subcont');
        fs.appendChild(cont);
        oConfig.element.appendChild(fs);

        oConfig.element.tabIndex = -1;

        
        oConfig.attributes.element = oConfig.element;
        oConfig.attributes.id = oConfig.element.id;

        this._configuredButtons = [];

        YAHOO.widget.Toolbar.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
         
    };

    YAHOO.extend(YAHOO.widget.Toolbar, YAHOO.util.Element, {
        /**
        * @protected
        * @property _configuredButtons
        * @type Array
        */
        _configuredButtons: null,
        /**
        * @method _addMenuClasses
        * @private
        * @description This method is called from Menu's renderEvent to add a few more classes to the menu items
        * @param {String} ev The event that fired.
        * @param {Array} na Array of event information.
        * @param {Object} o Button config object. 
        */
        _addMenuClasses: function(ev, na, o) {
            Dom.addClass(this.element, 'yui-toolbar-' + o.get('value') + '-menu');
            if (Dom.hasClass(o._button.parentNode.parentNode, 'yui-toolbar-select')) {
                Dom.addClass(this.element, 'yui-toolbar-select-menu');
            }
            var items = this.getItems();
            for (var i = 0; i < items.length; i++) {
                Dom.addClass(items[i].element, 'yui-toolbar-' + o.get('value') + '-' + ((items[i].value) ? items[i].value.replace(/ /g, '-').toLowerCase() : items[i]._oText.nodeValue.replace(/ /g, '-').toLowerCase()));
                Dom.addClass(items[i].element, 'yui-toolbar-' + o.get('value') + '-' + ((items[i].value) ? items[i].value.replace(/ /g, '-') : items[i]._oText.nodeValue.replace(/ /g, '-')));
            }
        },
        /** 
        * @property buttonType
        * @description The default button to use
        * @type Object
        */
        buttonType: YAHOO.widget.ToolbarButton,
        /** 
        * @property dd
        * @description The DragDrop instance associated with the Toolbar
        * @type Object
        */
        dd: null,
        /** 
        * @property _colorData
        * @description Object reference containing colors hex and text values.
        * @type Object
        */
        _colorData: {
/* {{{ _colorData */
    '#111111': 'Obsidian',
    '#2D2D2D': 'Dark Gray',
    '#434343': 'Shale',
    '#5B5B5B': 'Flint',
    '#737373': 'Gray',
    '#8B8B8B': 'Concrete',
    '#A2A2A2': 'Gray',
    '#B9B9B9': 'Titanium',
    '#000000': 'Black',
    '#D0D0D0': 'Light Gray',
    '#E6E6E6': 'Silver',
    '#FFFFFF': 'White',
    '#BFBF00': 'Pumpkin',
    '#FFFF00': 'Yellow',
    '#FFFF40': 'Banana',
    '#FFFF80': 'Pale Yellow',
    '#FFFFBF': 'Butter',
    '#525330': 'Raw Siena',
    '#898A49': 'Mildew',
    '#AEA945': 'Olive',
    '#7F7F00': 'Paprika',
    '#C3BE71': 'Earth',
    '#E0DCAA': 'Khaki',
    '#FCFAE1': 'Cream',
    '#60BF00': 'Cactus',
    '#80FF00': 'Chartreuse',
    '#A0FF40': 'Green',
    '#C0FF80': 'Pale Lime',
    '#DFFFBF': 'Light Mint',
    '#3B5738': 'Green',
    '#668F5A': 'Lime Gray',
    '#7F9757': 'Yellow',
    '#407F00': 'Clover',
    '#8A9B55': 'Pistachio',
    '#B7C296': 'Light Jade',
    '#E6EBD5': 'Breakwater',
    '#00BF00': 'Spring Frost',
    '#00FF80': 'Pastel Green',
    '#40FFA0': 'Light Emerald',
    '#80FFC0': 'Sea Foam',
    '#BFFFDF': 'Sea Mist',
    '#033D21': 'Dark Forrest',
    '#438059': 'Moss',
    '#7FA37C': 'Medium Green',
    '#007F40': 'Pine',
    '#8DAE94': 'Yellow Gray Green',
    '#ACC6B5': 'Aqua Lung',
    '#DDEBE2': 'Sea Vapor',
    '#00BFBF': 'Fog',
    '#00FFFF': 'Cyan',
    '#40FFFF': 'Turquoise Blue',
    '#80FFFF': 'Light Aqua',
    '#BFFFFF': 'Pale Cyan',
    '#033D3D': 'Dark Teal',
    '#347D7E': 'Gray Turquoise',
    '#609A9F': 'Green Blue',
    '#007F7F': 'Seaweed',
    '#96BDC4': 'Green Gray',
    '#B5D1D7': 'Soapstone',
    '#E2F1F4': 'Light Turquoise',
    '#0060BF': 'Summer Sky',
    '#0080FF': 'Sky Blue',
    '#40A0FF': 'Electric Blue',
    '#80C0FF': 'Light Azure',
    '#BFDFFF': 'Ice Blue',
    '#1B2C48': 'Navy',
    '#385376': 'Biscay',
    '#57708F': 'Dusty Blue',
    '#00407F': 'Sea Blue',
    '#7792AC': 'Sky Blue Gray',
    '#A8BED1': 'Morning Sky',
    '#DEEBF6': 'Vapor',
    '#0000BF': 'Deep Blue',
    '#0000FF': 'Blue',
    '#4040FF': 'Cerulean Blue',
    '#8080FF': 'Evening Blue',
    '#BFBFFF': 'Light Blue',
    '#212143': 'Deep Indigo',
    '#373E68': 'Sea Blue',
    '#444F75': 'Night Blue',
    '#00007F': 'Indigo Blue',
    '#585E82': 'Dockside',
    '#8687A4': 'Blue Gray',
    '#D2D1E1': 'Light Blue Gray',
    '#6000BF': 'Neon Violet',
    '#8000FF': 'Blue Violet',
    '#A040FF': 'Violet Purple',
    '#C080FF': 'Violet Dusk',
    '#DFBFFF': 'Pale Lavender',
    '#302449': 'Cool Shale',
    '#54466F': 'Dark Indigo',
    '#655A7F': 'Dark Violet',
    '#40007F': 'Violet',
    '#726284': 'Smoky Violet',
    '#9E8FA9': 'Slate Gray',
    '#DCD1DF': 'Violet White',
    '#BF00BF': 'Royal Violet',
    '#FF00FF': 'Fuchsia',
    '#FF40FF': 'Magenta',
    '#FF80FF': 'Orchid',
    '#FFBFFF': 'Pale Magenta',
    '#4A234A': 'Dark Purple',
    '#794A72': 'Medium Purple',
    '#936386': 'Cool Granite',
    '#7F007F': 'Purple',
    '#9D7292': 'Purple Moon',
    '#C0A0B6': 'Pale Purple',
    '#ECDAE5': 'Pink Cloud',
    '#BF005F': 'Hot Pink',
    '#FF007F': 'Deep Pink',
    '#FF409F': 'Grape',
    '#FF80BF': 'Electric Pink',
    '#FFBFDF': 'Pink',
    '#451528': 'Purple Red',
    '#823857': 'Purple Dino',
    '#A94A76': 'Purple Gray',
    '#7F003F': 'Rose',
    '#BC6F95': 'Antique Mauve',
    '#D8A5BB': 'Cool Marble',
    '#F7DDE9': 'Pink Granite',
    '#C00000': 'Apple',
    '#FF0000': 'Fire Truck',
    '#FF4040': 'Pale Red',
    '#FF8080': 'Salmon',
    '#FFC0C0': 'Warm Pink',
    '#441415': 'Sepia',
    '#82393C': 'Rust',
    '#AA4D4E': 'Brick',
    '#800000': 'Brick Red',
    '#BC6E6E': 'Mauve',
    '#D8A3A4': 'Shrimp Pink',
    '#F8DDDD': 'Shell Pink',
    '#BF5F00': 'Dark Orange',
    '#FF7F00': 'Orange',
    '#FF9F40': 'Grapefruit',
    '#FFBF80': 'Canteloupe',
    '#FFDFBF': 'Wax',
    '#482C1B': 'Dark Brick',
    '#855A40': 'Dirt',
    '#B27C51': 'Tan',
    '#7F3F00': 'Nutmeg',
    '#C49B71': 'Mustard',
    '#E1C4A8': 'Pale Tan',
    '#FDEEE0': 'Marble'
/* }}} */
        },
        /** 
        * @property _colorPicker
        * @description The HTML Element containing the colorPicker
        * @type HTMLElement
        */
        _colorPicker: null,
        /** 
        * @property STR_COLLAPSE
        * @description String for Toolbar Collapse Button
        * @type String
        */
        STR_COLLAPSE: 'Collapse Toolbar',
        /** 
        * @property STR_EXPAND
        * @description String for Toolbar Collapse Button - Expand
        * @type String
        */
        STR_EXPAND: 'Expand Toolbar',
        /** 
        * @property STR_SPIN_LABEL
        * @description String for spinbutton dynamic label. Note the {VALUE} will be replaced with YAHOO.lang.substitute
        * @type String
        */
        STR_SPIN_LABEL: 'Spin Button with value {VALUE}. Use Control Shift Up Arrow and Control Shift Down arrow keys to increase or decrease the value.',
        /** 
        * @property STR_SPIN_UP
        * @description String for spinbutton up
        * @type String
        */
        STR_SPIN_UP: 'Click to increase the value of this input',
        /** 
        * @property STR_SPIN_DOWN
        * @description String for spinbutton down
        * @type String
        */
        STR_SPIN_DOWN: 'Click to decrease the value of this input',
        /** 
        * @property _titlebar
        * @description Object reference to the titlebar
        * @type HTMLElement
        */
        _titlebar: null,
        /** 
        * @property browser
        * @description Standard browser detection
        * @type Object
        */
        browser: YAHOO.env.ua,
        /**
        * @protected
        * @property _buttonList
        * @description Internal property list of current buttons in the toolbar
        * @type Array
        */
        _buttonList: null,
        /**
        * @protected
        * @property _buttonGroupList
        * @description Internal property list of current button groups in the toolbar
        * @type Array
        */
        _buttonGroupList: null,
        /**
        * @protected
        * @property _sep
        * @description Internal reference to the separator HTML Element for cloning
        * @type HTMLElement
        */
        _sep: null,
        /**
        * @protected
        * @property _sepCount
        * @description Internal refernce for counting separators, so we can give them a useful class name for styling
        * @type Number
        */
        _sepCount: null,
        /**
        * @protected
        * @property draghandle
        * @type HTMLElement
        */
        _dragHandle: null,
        /**
        * @protected
        * @property _toolbarConfigs
        * @type Object
        */
        _toolbarConfigs: {
            renderer: true
        },
        /**
        * @protected
        * @property CLASS_CONTAINER
        * @description Default CSS class to apply to the toolbar container element
        * @type String
        */
        CLASS_CONTAINER: 'yui-toolbar-container',
        /**
        * @protected
        * @property CLASS_DRAGHANDLE
        * @description Default CSS class to apply to the toolbar's drag handle element
        * @type String
        */
        CLASS_DRAGHANDLE: 'yui-toolbar-draghandle',
        /**
        * @protected
        * @property CLASS_SEPARATOR
        * @description Default CSS class to apply to all separators in the toolbar
        * @type String
        */
        CLASS_SEPARATOR: 'yui-toolbar-separator',
        /**
        * @protected
        * @property CLASS_DISABLED
        * @description Default CSS class to apply when the toolbar is disabled
        * @type String
        */
        CLASS_DISABLED: 'yui-toolbar-disabled',
        /**
        * @protected
        * @property CLASS_PREFIX
        * @description Default prefix for dynamically created class names
        * @type String
        */
        CLASS_PREFIX: 'yui-toolbar',
        /** 
        * @method init
        * @description The Toolbar class's initialization method
        */
        init: function(p_oElement, p_oAttributes) {
            YAHOO.widget.Toolbar.superclass.init.call(this, p_oElement, p_oAttributes);
        },
        /**
        * @method initAttributes
        * @description Initializes all of the configuration attributes used to create 
        * the toolbar.
        * @param {Object} attr Object literal specifying a set of 
        * configuration attributes used to create the toolbar.
        */
        initAttributes: function(attr) {
            YAHOO.widget.Toolbar.superclass.initAttributes.call(this, attr);
            this.addClass(this.CLASS_CONTAINER);

            /**
            * @attribute buttonType
            * @description The buttonType to use (advanced or basic)
            * @type String
            */
            this.setAttributeConfig('buttonType', {
                value: attr.buttonType || 'basic',
                writeOnce: true,
                validator: function(type) {
                    switch (type) {
                        case 'advanced':
                        case 'basic':
                            return true;
                    }
                    return false;
                },
                method: function(type) {
                    if (type == 'advanced') {
                        if (YAHOO.widget.Button) {
                            this.buttonType = YAHOO.widget.ToolbarButtonAdvanced;
                        } else {
                            this.buttonType = YAHOO.widget.ToolbarButton;
                        }
                    } else {
                        this.buttonType = YAHOO.widget.ToolbarButton;
                    }
                }
            });


            /**
            * @attribute buttons
            * @description Object specifying the buttons to include in the toolbar
            * Example:
            * <code><pre>
            * {
            *   { id: 'b3', type: 'button', label: 'Underline', value: 'underline' },
            *   { type: 'separator' },
            *   { id: 'b4', type: 'menu', label: 'Align', value: 'align',
            *       menu: [
            *           { text: "Left", value: 'alignleft' },
            *           { text: "Center", value: 'aligncenter' },
            *           { text: "Right", value: 'alignright' }
            *       ]
            *   }
            * }
            * </pre></code>
            * @type Array
            */
            
            this.setAttributeConfig('buttons', {
                value: [],
                writeOnce: true,
                method: function(data) {
                    var i, button, buttons, len, b;
                    for (i in data) {
                        if (Lang.hasOwnProperty(data, i)) {
                            if (data[i].type == 'separator') {
                                this.addSeparator();
                            } else if (data[i].group !== undefined) {
                                buttons = this.addButtonGroup(data[i]);
                                if (buttons) {
                                    len = buttons.length;
                                    for(b = 0; b < len; b++) {
                                        if (buttons[b]) {
                                            this._configuredButtons[this._configuredButtons.length] = buttons[b].id;
                                        }
                                    }
                                }
                                
                            } else {
                                button = this.addButton(data[i]);
                                if (button) {
                                    this._configuredButtons[this._configuredButtons.length] = button.id;
                                }
                            }
                        }
                    }
                }
            });

            /**
            * @attribute disabled
            * @description Boolean indicating if the toolbar should be disabled. It will also disable the draggable attribute if it is on.
            * @default false
            * @type Boolean
            */
            this.setAttributeConfig('disabled', {
                value: false,
                method: function(disabled) {
                    if (this.get('disabled') === disabled) {
                        return false;
                    }
                    if (disabled) {
                        this.addClass(this.CLASS_DISABLED);
                        this.set('draggable', false);
                        this.disableAllButtons();
                    } else {
                        this.removeClass(this.CLASS_DISABLED);
                        if (this._configs.draggable._initialConfig.value) {
                            //Draggable by default, set it back
                            this.set('draggable', true);
                        }
                        this.resetAllButtons();
                    }
                }
            });

            /**
            * @config cont
            * @description The container for the toolbar.
            * @type HTMLElement
            */
            this.setAttributeConfig('cont', {
                value: attr.cont,
                readOnly: true
            });


            /**
            * @attribute grouplabels
            * @description Boolean indicating if the toolbar should show the group label's text string.
            * @default true
            * @type Boolean
            */
            this.setAttributeConfig('grouplabels', {
                value: ((attr.grouplabels === false) ? false : true),
                method: function(grouplabels) {
                    if (grouplabels) {
                        Dom.removeClass(this.get('cont'), (this.CLASS_PREFIX + '-nogrouplabels'));
                    } else {
                        Dom.addClass(this.get('cont'), (this.CLASS_PREFIX + '-nogrouplabels'));
                    }
                }
            });
            /**
            * @attribute titlebar
            * @description Boolean indicating if the toolbar should have a titlebar. If
            * passed a string, it will use that as the titlebar text
            * @default false
            * @type Boolean or String
            */
            this.setAttributeConfig('titlebar', {
                value: false,
                method: function(titlebar) {
                    if (titlebar) {
                        if (this._titlebar && this._titlebar.parentNode) {
                            this._titlebar.parentNode.removeChild(this._titlebar);
                        }
                        this._titlebar = document.createElement('DIV');
                        this._titlebar.tabIndex = '-1';
                        Event.on(this._titlebar, 'focus', function() {
                            this._handleFocus();
                        }, this, true);
                        Dom.addClass(this._titlebar, this.CLASS_PREFIX + '-titlebar');
                        if (Lang.isString(titlebar)) {
                            var h2 = document.createElement('h2');
                            h2.tabIndex = '-1';
                            h2.innerHTML = '<a href="#" tabIndex="0">' + titlebar + '</a>';
                            this._titlebar.appendChild(h2);
                            Event.on(h2.firstChild, 'click', function(ev) {
                                Event.stopEvent(ev);
                            });
                            Event.on([h2, h2.firstChild], 'focus', function() {
                                this._handleFocus();
                            }, this, true);
                        }
                        if (this.get('firstChild')) {
                            this.insertBefore(this._titlebar, this.get('firstChild'));
                        } else {
                            this.appendChild(this._titlebar);
                        }
                        if (this.get('collapse')) {
                            this.set('collapse', true);
                        }
                    } else if (this._titlebar) {
                        if (this._titlebar && this._titlebar.parentNode) {
                            this._titlebar.parentNode.removeChild(this._titlebar);
                        }
                    }
                }
            });


            /**
            * @attribute collapse
            * @description Boolean indicating if the the titlebar should have a collapse button.
            * The collapse button will not remove the toolbar, it will minimize it to the titlebar
            * @default false
            * @type Boolean
            */
            this.setAttributeConfig('collapse', {
                value: false,
                method: function(collapse) {
                    if (this._titlebar) {
                        var collapseEl = null;
                        var el = Dom.getElementsByClassName('collapse', 'span', this._titlebar);
                        if (collapse) {
                            if (el.length > 0) {
                                //There is already a collapse button
                                return true;
                            }
                            collapseEl = document.createElement('SPAN');
                            collapseEl.innerHTML = 'X';
                            collapseEl.title = this.STR_COLLAPSE;

                            Dom.addClass(collapseEl, 'collapse');
                            this._titlebar.appendChild(collapseEl);
                            Event.addListener(collapseEl, 'click', function() {
                                if (Dom.hasClass(this.get('cont').parentNode, 'yui-toolbar-container-collapsed')) {
                                    this.collapse(false); //Expand Toolbar
                                } else {
                                    this.collapse(); //Collapse Toolbar
                                }
                            }, this, true);
                        } else {
                            collapseEl = Dom.getElementsByClassName('collapse', 'span', this._titlebar);
                            if (collapseEl[0]) {
                                if (Dom.hasClass(this.get('cont').parentNode, 'yui-toolbar-container-collapsed')) {
                                    //We are closed, reopen the titlebar..
                                    this.collapse(false); //Expand Toolbar
                                }
                                collapseEl[0].parentNode.removeChild(collapseEl[0]);
                            }
                        }
                    }
                }
            });

            /**
            * @attribute draggable
            * @description Boolean indicating if the toolbar should be draggable.  
            * @default false
            * @type Boolean
            */

            this.setAttributeConfig('draggable', {
                value: (attr.draggable || false),
                method: function(draggable) {
                    if (draggable && !this.get('titlebar')) {
                        if (!this._dragHandle) {
                            this._dragHandle = document.createElement('SPAN');
                            this._dragHandle.innerHTML = '|';
                            this._dragHandle.setAttribute('title', 'Click to drag the toolbar');
                            this._dragHandle.id = this.get('id') + '_draghandle';
                            Dom.addClass(this._dragHandle, this.CLASS_DRAGHANDLE);
                            if (this.get('cont').hasChildNodes()) {
                                this.get('cont').insertBefore(this._dragHandle, this.get('cont').firstChild);
                            } else {
                                this.get('cont').appendChild(this._dragHandle);
                            }
                            this.dd = new YAHOO.util.DD(this.get('id'));
                            this.dd.setHandleElId(this._dragHandle.id);
                            
                        }
                    } else {
                        if (this._dragHandle) {
                            this._dragHandle.parentNode.removeChild(this._dragHandle);
                            this._dragHandle = null;
                            this.dd = null;
                        }
                    }
                    if (this._titlebar) {
                        if (draggable) {
                            this.dd = new YAHOO.util.DD(this.get('id'));
                            this.dd.setHandleElId(this._titlebar);
                            Dom.addClass(this._titlebar, 'draggable');
                        } else {
                            Dom.removeClass(this._titlebar, 'draggable');
                            if (this.dd) {
                                this.dd.unreg();
                                this.dd = null;
                            }
                        }
                    }
                },
                validator: function(value) {
                    var ret = true;
                    if (!YAHOO.util.DD) {
                        ret = false;
                    }
                    return ret;
                }
            });

        },
        /**
        * @method addButtonGroup
        * @description Add a new button group to the toolbar. (uses addButton)
        * @param {Object} oGroup Object literal reference to the Groups Config (contains an array of button configs as well as the group label)
        */
        addButtonGroup: function(oGroup) {
            if (!this.get('element')) {
                this._queue[this._queue.length] = ['addButtonGroup', arguments];
                return false;
            }
            
            if (!this.hasClass(this.CLASS_PREFIX + '-grouped')) {
                this.addClass(this.CLASS_PREFIX + '-grouped');
            }
            var div = document.createElement('DIV');
            Dom.addClass(div, this.CLASS_PREFIX + '-group');
            Dom.addClass(div, this.CLASS_PREFIX + '-group-' + oGroup.group);
            if (oGroup.label) {
                var label = document.createElement('h3');
                label.innerHTML = oGroup.label;
                div.appendChild(label);
            }
            if (!this.get('grouplabels')) {
                Dom.addClass(this.get('cont'), this.CLASS_PREFIX, '-nogrouplabels');
            }

            this.get('cont').appendChild(div);

            //For accessibility, let's put all of the group buttons in an Unordered List
            var ul = document.createElement('ul');
            div.appendChild(ul);

            if (!this._buttonGroupList) {
                this._buttonGroupList = {};
            }
            
            this._buttonGroupList[oGroup.group] = ul;

            //An array of the button ids added to this group
            //This is used for destruction later...
            var addedButtons = [],
                button;
            

            for (var i = 0; i < oGroup.buttons.length; i++) {
                var li = document.createElement('li');
                li.className = this.CLASS_PREFIX + '-groupitem';
                ul.appendChild(li);
                if ((oGroup.buttons[i].type !== undefined) && oGroup.buttons[i].type == 'separator') {
                    this.addSeparator(li);
                } else {
                    oGroup.buttons[i].container = li;
                    button = this.addButton(oGroup.buttons[i]);
                    if (button) {
                        addedButtons[addedButtons.length]  = button.id;
                    }
                }
            }
            return addedButtons;
        },
        /**
        * @method addButtonToGroup
        * @description Add a new button to a toolbar group. Buttons supported:
        *   push, split, menu, select, color, spin
        * @param {Object} oButton Object literal reference to the Button's Config
        * @param {String} group The Group identifier passed into the initial config
        * @param {HTMLElement} after Optional HTML element to insert this button after in the DOM.
        */
        addButtonToGroup: function(oButton, group, after) {
            var groupCont = this._buttonGroupList[group],
                li = document.createElement('li');

            li.className = this.CLASS_PREFIX + '-groupitem';
            oButton.container = li;
            this.addButton(oButton, after);
            groupCont.appendChild(li);
        },
        /**
        * @method addButton
        * @description Add a new button to the toolbar. Buttons supported:
        *   push, split, menu, select, color, spin
        * @param {Object} oButton Object literal reference to the Button's Config
        * @param {HTMLElement} after Optional HTML element to insert this button after in the DOM.
        */
        addButton: function(oButton, after) {
            if (!this.get('element')) {
                this._queue[this._queue.length] = ['addButton', arguments];
                return false;
            }
            if (!this._buttonList) {
                this._buttonList = [];
            }
            if (!oButton.container) {
                oButton.container = this.get('cont');
            }

            if ((oButton.type == 'menu') || (oButton.type == 'split') || (oButton.type == 'select')) {
                if (Lang.isArray(oButton.menu)) {
                    for (var i in oButton.menu) {
                        if (Lang.hasOwnProperty(oButton.menu, i)) {
                            var funcObject = {
                                fn: function(ev, x, oMenu) {
                                    if (!oButton.menucmd) {
                                        oButton.menucmd = oButton.value;
                                    }
                                    oButton.value = ((oMenu.value) ? oMenu.value : oMenu._oText.nodeValue);
                                },
                                scope: this
                            };
                            oButton.menu[i].onclick = funcObject;
                        }
                    }
                }
            }
            var _oButton = {}, skip = false;
            for (var o in oButton) {
                if (Lang.hasOwnProperty(oButton, o)) {
                    if (!this._toolbarConfigs[o]) {
                        _oButton[o] = oButton[o];
                    }
                }
            }
            if (oButton.type == 'select') {
                _oButton.type = 'menu';
            }
            if (oButton.type == 'spin') {
                _oButton.type = 'push';
            }
            if (_oButton.type == 'color') {
                if (YAHOO.widget.Overlay) {
                    _oButton = this._makeColorButton(_oButton);
                } else {
                    skip = true;
                }
            }
            if (_oButton.menu) {
                if ((YAHOO.widget.Overlay) && (oButton.menu instanceof YAHOO.widget.Overlay)) {
                    oButton.menu.showEvent.subscribe(function() {
                        this._button = _oButton;
                    });
                } else {
                    for (var m = 0; m < _oButton.menu.length; m++) {
                        if (!_oButton.menu[m].value) {
                            _oButton.menu[m].value = _oButton.menu[m].text;
                        }
                    }
                    if (this.browser.webkit) {
                        _oButton.focusmenu = false;
                    }
                }
            }
            if (skip) {
                oButton = false;
            } else {
                //Add to .get('buttons') manually
                this._configs.buttons.value[this._configs.buttons.value.length] = oButton;
                
                var tmp = new this.buttonType(_oButton);
                tmp.get('element').tabIndex = '-1';
                tmp.get('element').setAttribute('role', 'button');
                tmp._selected = true;
                
                if (this.get('disabled')) {
                    //Toolbar is disabled, disable the new button too!
                    tmp.set('disabled', true);
                }
                if (!oButton.id) {
                    oButton.id = tmp.get('id');
                }
                
                if (after) {
                    var el = tmp.get('element');
                    var nextSib = null;
                    if (after.get) {
                        nextSib = after.get('element').nextSibling;
                    } else if (after.nextSibling) {
                        nextSib = after.nextSibling;
                    }
                    if (nextSib) {
                        nextSib.parentNode.insertBefore(el, nextSib);
                    }
                }
                tmp.addClass(this.CLASS_PREFIX + '-' + tmp.get('value'));

                var icon = document.createElement('span');
                icon.className = this.CLASS_PREFIX + '-icon';
                tmp.get('element').insertBefore(icon, tmp.get('firstChild'));
                if (tmp._button.tagName.toLowerCase() == 'button') {
                    tmp.get('element').setAttribute('unselectable', 'on');
                    //Replace the Button HTML Element with an a href if it exists
                    var a = document.createElement('a');
                    a.innerHTML = tmp._button.innerHTML;
                    a.href = '#';
                    a.tabIndex = '-1';
                    Event.on(a, 'click', function(ev) {
                        Event.stopEvent(ev);
                    });
                    tmp._button.parentNode.replaceChild(a, tmp._button);
                    tmp._button = a;
                }

                if (oButton.type == 'select') {
                    if (tmp._button.tagName.toLowerCase() == 'select') {
                        icon.parentNode.removeChild(icon);
                        var iel = tmp._button,
                            parEl = tmp.get('element');
                        parEl.parentNode.replaceChild(iel, parEl);
                        //The 'element' value is currently the orphaned element
                        //In order for "destroy" to execute we need to get('element') to reference the correct node.
                        //I'm not sure if there is a direct approach to setting this value.
                        tmp._configs.element.value = iel;
                    } else {
                        //Don't put a class on it if it's a real select element
                        tmp.addClass(this.CLASS_PREFIX + '-select');
                    }
                }
                if (oButton.type == 'spin') {
                    if (!Lang.isArray(oButton.range)) {
                        oButton.range = [ 10, 100 ];
                    }
                    this._makeSpinButton(tmp, oButton);
                }
                tmp.get('element').setAttribute('title', tmp.get('label'));
                if (oButton.type != 'spin') {
                    if ((YAHOO.widget.Overlay) && (_oButton.menu instanceof YAHOO.widget.Overlay)) {
                        var showPicker = function(ev) {
                            var exec = true;
                            if (ev.keyCode && (ev.keyCode == 9)) {
                                exec = false;
                            }
                            if (exec) {
                                if (this._colorPicker) {
                                    this._colorPicker._button = oButton.value;
                                }
                                var menuEL = tmp.getMenu().element;
                                if (Dom.getStyle(menuEL, 'visibility') == 'hidden') {
                                    tmp.getMenu().show();
                                } else {
                                    tmp.getMenu().hide();
                                }
                            }
                            YAHOO.util.Event.stopEvent(ev);
                        };
                        tmp.on('mousedown', showPicker, oButton, this);
                        tmp.on('keydown', showPicker, oButton, this);
                        
                    } else if ((oButton.type != 'menu') && (oButton.type != 'select')) {
                        tmp.on('keypress', this._buttonClick, oButton, this);
                        tmp.on('mousedown', function(ev) {
                            YAHOO.util.Event.stopEvent(ev);
                            this._buttonClick(ev, oButton);
                        }, oButton, this);
                        tmp.on('click', function(ev) {
                            YAHOO.util.Event.stopEvent(ev);
                        });
                    } else {
                        //Stop the mousedown event so we can trap the selection in the editor!
                        tmp.on('mousedown', function(ev) {
                            YAHOO.util.Event.stopEvent(ev);
                        });
                        tmp.on('click', function(ev) {
                            YAHOO.util.Event.stopEvent(ev);
                        });
                        tmp.on('change', function(ev) {
                            if (!ev.target) {
                                if (!oButton.menucmd) {
                                    oButton.menucmd = oButton.value;
                                }
                                oButton.value = ev.value;
                                this._buttonClick(ev, oButton);
                            }
                        }, this, true);

                        var self = this;
                        //Hijack the mousedown event in the menu and make it fire a button click..
                        tmp.on('appendTo', function() {
                            var tmp = this;
                            if (tmp.getMenu() && tmp.getMenu().mouseDownEvent) {
                                tmp.getMenu().mouseDownEvent.subscribe(function(ev, args) {
                                    var oMenu = args[1];
                                    YAHOO.util.Event.stopEvent(args[0]);
                                    tmp._onMenuClick(args[0], tmp);
                                    if (!oButton.menucmd) {
                                        oButton.menucmd = oButton.value;
                                    }
                                    oButton.value = ((oMenu.value) ? oMenu.value : oMenu._oText.nodeValue);
                                    self._buttonClick.call(self, args[1], oButton);
                                    tmp._hideMenu();
                                    return false;
                                });
                                tmp.getMenu().clickEvent.subscribe(function(ev, args) {
                                    YAHOO.util.Event.stopEvent(args[0]);
                                });
                                tmp.getMenu().mouseUpEvent.subscribe(function(ev, args) {
                                    YAHOO.util.Event.stopEvent(args[0]);
                                });
                            }
                        });
                        
                    }
                } else {
                    //Stop the mousedown event so we can trap the selection in the editor!
                    tmp.on('mousedown', function(ev) {
                        YAHOO.util.Event.stopEvent(ev);
                    });
                    tmp.on('click', function(ev) {
                        YAHOO.util.Event.stopEvent(ev);
                    });
                }
                if (this.browser.ie) {
                    /*
                    //Add a couple of new events for IE
                    tmp.DOM_EVENTS.focusin = true;
                    tmp.DOM_EVENTS.focusout = true;
                    
                    //Stop them so we don't loose focus in the Editor
                    tmp.on('focusin', function(ev) {
                        YAHOO.util.Event.stopEvent(ev);
                    }, oButton, this);
                    
                    tmp.on('focusout', function(ev) {
                        YAHOO.util.Event.stopEvent(ev);
                    }, oButton, this);
                    tmp.on('click', function(ev) {
                        YAHOO.util.Event.stopEvent(ev);
                    }, oButton, this);
                    */
                }
                if (this.browser.webkit) {
                    //This will keep the document from gaining focus and the editor from loosing it..
                    //Forcefully remove the focus calls in button!
                    tmp.hasFocus = function() {
                        return true;
                    };
                }
                this._buttonList[this._buttonList.length] = tmp;
                if ((oButton.type == 'menu') || (oButton.type == 'split') || (oButton.type == 'select')) {
                    if (Lang.isArray(oButton.menu)) {
                        var menu = tmp.getMenu();
                        if (menu && menu.renderEvent) {
                            menu.renderEvent.subscribe(this._addMenuClasses, tmp);
                            if (oButton.renderer) {
                                menu.renderEvent.subscribe(oButton.renderer, tmp);
                            }
                        }
                    }
                }
            }
            return oButton;
        },
        /**
        * @method addSeparator
        * @description Add a new button separator to the toolbar.
        * @param {HTMLElement} cont Optional HTML element to insert this button into.
        * @param {HTMLElement} after Optional HTML element to insert this button after in the DOM.
        */
        addSeparator: function(cont, after) {
            if (!this.get('element')) {
                this._queue[this._queue.length] = ['addSeparator', arguments];
                return false;
            }
            var sepCont = ((cont) ? cont : this.get('cont'));
            if (!this.get('element')) {
                this._queue[this._queue.length] = ['addSeparator', arguments];
                return false;
            }
            if (this._sepCount === null) {
                this._sepCount = 0;
            }
            if (!this._sep) {
                this._sep = document.createElement('SPAN');
                Dom.addClass(this._sep, this.CLASS_SEPARATOR);
                this._sep.innerHTML = '|';
            }
            var _sep = this._sep.cloneNode(true);
            this._sepCount++;
            Dom.addClass(_sep, this.CLASS_SEPARATOR + '-' + this._sepCount);
            if (after) {
                var nextSib = null;
                if (after.get) {
                    nextSib = after.get('element').nextSibling;
                } else if (after.nextSibling) {
                    nextSib = after.nextSibling;
                } else {
                    nextSib = after;
                }
                if (nextSib) {
                    if (nextSib == after) {
                        nextSib.parentNode.appendChild(_sep);
                    } else {
                        nextSib.parentNode.insertBefore(_sep, nextSib);
                    }
                }
            } else {
                sepCont.appendChild(_sep);
            }
            return _sep;
        },
        /**
        * @method _createColorPicker
        * @private
        * @description Creates the core DOM reference to the color picker menu item.
        * @param {String} id the id of the toolbar to prefix this DOM container with.
        */
        _createColorPicker: function(id) {
            if (Dom.get(id + '_colors')) {
               Dom.get(id + '_colors').parentNode.removeChild(Dom.get(id + '_colors'));
            }
            var picker = document.createElement('div');
            picker.className = 'yui-toolbar-colors';
            picker.id = id + '_colors';
            picker.style.display = 'none';
            Event.on(window, 'load', function() {
                document.body.appendChild(picker);
            }, this, true);

            this._colorPicker = picker;

            var html = '';
            for (var i in this._colorData) {
                if (Lang.hasOwnProperty(this._colorData, i)) {
                    html += '<a style="background-color: ' + i + '" href="#">' + i.replace('#', '') + '</a>';
                }
            }
            html += '<span><em>X</em><strong></strong></span>';
            window.setTimeout(function() {
                picker.innerHTML = html;
            }, 0);

            Event.on(picker, 'mouseover', function(ev) {
                var picker = this._colorPicker;
                var em = picker.getElementsByTagName('em')[0];
                var strong = picker.getElementsByTagName('strong')[0];
                var tar = Event.getTarget(ev);
                if (tar.tagName.toLowerCase() == 'a') {
                    em.style.backgroundColor = tar.style.backgroundColor;
                    strong.innerHTML = this._colorData['#' + tar.innerHTML] + '<br>' + tar.innerHTML;
                }
            }, this, true);
            Event.on(picker, 'focus', function(ev) {
                Event.stopEvent(ev);
            });
            Event.on(picker, 'click', function(ev) {
                Event.stopEvent(ev);
            });
            Event.on(picker, 'mousedown', function(ev) {
                Event.stopEvent(ev);
                var tar = Event.getTarget(ev);
                if (tar.tagName.toLowerCase() == 'a') {
                    var retVal = this.fireEvent('colorPickerClicked', { type: 'colorPickerClicked', target: this, button: this._colorPicker._button, color: tar.innerHTML, colorName: this._colorData['#' + tar.innerHTML] } );
                    if (retVal !== false) {
                        var info = {
                            color: tar.innerHTML,
                            colorName: this._colorData['#' + tar.innerHTML],
                            value: this._colorPicker._button 
                        };
                    
                        this.fireEvent('buttonClick', { type: 'buttonClick', target: this.get('element'), button: info });
                    }
                    this.getButtonByValue(this._colorPicker._button).getMenu().hide();
                }
            }, this, true);
        },
        /**
        * @method _resetColorPicker
        * @private
        * @description Clears the currently selected color or mouseover color in the color picker.
        */
        _resetColorPicker: function() {
            var em = this._colorPicker.getElementsByTagName('em')[0];
            var strong = this._colorPicker.getElementsByTagName('strong')[0];
            em.style.backgroundColor = 'transparent';
            strong.innerHTML = '';
        },
        /**
        * @method _makeColorButton
        * @private
        * @description Called to turn a "color" button into a menu button with an Overlay for the menu.
        * @param {Object} _oButton <a href="YAHOO.widget.ToolbarButton.html">YAHOO.widget.ToolbarButton</a> reference
        */
        _makeColorButton: function(_oButton) {
            if (!this._colorPicker) {   
                this._createColorPicker(this.get('id'));
            }
            _oButton.type = 'color';
            _oButton.menu = new YAHOO.widget.Overlay(this.get('id') + '_' + _oButton.value + '_menu', { visible: false, position: 'absolute', iframe: true });
            _oButton.menu.setBody('');
            _oButton.menu.render(this.get('cont'));
            Dom.addClass(_oButton.menu.element, 'yui-button-menu');
            Dom.addClass(_oButton.menu.element, 'yui-color-button-menu');
            _oButton.menu.beforeShowEvent.subscribe(function() {
                _oButton.menu.cfg.setProperty('zindex', 5); //Re Adjust the overlays zIndex.. not sure why.
                _oButton.menu.cfg.setProperty('context', [this.getButtonById(_oButton.id).get('element'), 'tl', 'bl']); //Re Adjust the overlay.. not sure why.
                //Move the DOM reference of the color picker to the Overlay that we are about to show.
                this._resetColorPicker();
                var _p = this._colorPicker;
                if (_p.parentNode) {
                    _p.parentNode.removeChild(_p);
                }
                _oButton.menu.setBody('');
                _oButton.menu.appendToBody(_p);
                this._colorPicker.style.display = 'block';
            }, this, true);
            return _oButton;
        },
        /**
        * @private
        * @method _makeSpinButton
        * @description Create a button similar to an OS Spin button.. It has an up/down arrow combo to scroll through a range of int values.
        * @param {Object} _button <a href="YAHOO.widget.ToolbarButton.html">YAHOO.widget.ToolbarButton</a> reference
        * @param {Object} oButton Object literal containing the buttons initial config
        */
        _makeSpinButton: function(_button, oButton) {
            _button.addClass(this.CLASS_PREFIX + '-spinbutton');
            var self = this,
                _par = _button._button.parentNode.parentNode, //parentNode of Button Element for appending child
                range = oButton.range,
                _b1 = document.createElement('a'),
                _b2 = document.createElement('a');
                _b1.href = '#';
                _b2.href = '#';
                _b1.tabIndex = '-1';
                _b2.tabIndex = '-1';
            
            //Setup the up and down arrows
            _b1.className = 'up';
            _b1.title = this.STR_SPIN_UP;
            _b1.innerHTML = this.STR_SPIN_UP;
            _b2.className = 'down';
            _b2.title = this.STR_SPIN_DOWN;
            _b2.innerHTML = this.STR_SPIN_DOWN;

            //Append them to the container
            _par.appendChild(_b1);
            _par.appendChild(_b2);
            
            var label = YAHOO.lang.substitute(this.STR_SPIN_LABEL, { VALUE: _button.get('label') });
            _button.set('title', label);

            var cleanVal = function(value) {
                value = ((value < range[0]) ? range[0] : value);
                value = ((value > range[1]) ? range[1] : value);
                return value;
            };

            var br = this.browser;
            var tbar = false;
            var strLabel = this.STR_SPIN_LABEL;
            if (this._titlebar && this._titlebar.firstChild) {
                tbar = this._titlebar.firstChild;
            }
            
            var _intUp = function(ev) {
                YAHOO.util.Event.stopEvent(ev);
                if (!_button.get('disabled') && (ev.keyCode != 9)) {
                    var value = parseInt(_button.get('label'), 10);
                    value++;
                    value = cleanVal(value);
                    _button.set('label', ''+value);
                    var label = YAHOO.lang.substitute(strLabel, { VALUE: _button.get('label') });
                    _button.set('title', label);
                    if (!br.webkit && tbar) {
                        //tbar.focus(); //We do this for accessibility, on the re-focus of the element, a screen reader will re-read the title that was just changed
                        //_button.focus();
                    }
                    self._buttonClick(ev, oButton);
                }
            };

            var _intDown = function(ev) {
                YAHOO.util.Event.stopEvent(ev);
                if (!_button.get('disabled') && (ev.keyCode != 9)) {
                    var value = parseInt(_button.get('label'), 10);
                    value--;
                    value = cleanVal(value);

                    _button.set('label', ''+value);
                    var label = YAHOO.lang.substitute(strLabel, { VALUE: _button.get('label') });
                    _button.set('title', label);
                    if (!br.webkit && tbar) {
                        //tbar.focus(); //We do this for accessibility, on the re-focus of the element, a screen reader will re-read the title that was just changed
                        //_button.focus();
                    }
                    self._buttonClick(ev, oButton);
                }
            };

            var _intKeyUp = function(ev) {
                if (ev.keyCode == 38) {
                    _intUp(ev);
                } else if (ev.keyCode == 40) {
                    _intDown(ev);
                } else if (ev.keyCode == 107 && ev.shiftKey) {  //Plus Key
                    _intUp(ev);
                } else if (ev.keyCode == 109 && ev.shiftKey) {  //Minus Key
                    _intDown(ev);
                }
            };

            //Handle arrow keys..
            _button.on('keydown', _intKeyUp, this, true);

            //Listen for the click on the up button and act on it
            //Listen for the click on the down button and act on it
            Event.on(_b1, 'mousedown',function(ev) {
                Event.stopEvent(ev);
            }, this, true);
            Event.on(_b2, 'mousedown', function(ev) {
                Event.stopEvent(ev);
            }, this, true);
            Event.on(_b1, 'click', _intUp, this, true);
            Event.on(_b2, 'click', _intDown, this, true);
        },
        /**
        * @protected
        * @method _buttonClick
        * @description Click handler for all buttons in the toolbar.
        * @param {String} ev The event that was passed in.
        * @param {Object} info Object literal of information about the button that was clicked.
        */
        _buttonClick: function(ev, info) {
            var doEvent = true;
            
            if (ev && ev.type == 'keypress') {
                if (ev.keyCode == 9) {
                    doEvent = false;
                } else if ((ev.keyCode === 13) || (ev.keyCode === 0) || (ev.keyCode === 32)) {
                } else {
                    doEvent = false;
                }
            }

            if (doEvent) {
                var fireNextEvent = true,
                    retValue = false;
                    
                info.isSelected = this.isSelected(info.id);

                if (info.value) {
                    retValue = this.fireEvent(info.value + 'Click', { type: info.value + 'Click', target: this.get('element'), button: info });
                    if (retValue === false) {
                        fireNextEvent = false;
                    }
                }
                
                if (info.menucmd && fireNextEvent) {
                    retValue = this.fireEvent(info.menucmd + 'Click', { type: info.menucmd + 'Click', target: this.get('element'), button: info });
                    if (retValue === false) {
                        fireNextEvent = false;
                    }
                }
                if (fireNextEvent) {
                    this.fireEvent('buttonClick', { type: 'buttonClick', target: this.get('element'), button: info });
                }

                if (info.type == 'select') {
                    var button = this.getButtonById(info.id);
                    if (button.buttonType == 'rich') {
                        var txt = info.value;
                        for (var i = 0; i < info.menu.length; i++) {
                            if (info.menu[i].value == info.value) {
                                txt = info.menu[i].text;
                                break;
                            }
                        }
                        button.set('label', '<span class="yui-toolbar-' + info.menucmd + '-' + (info.value).replace(/ /g, '-').toLowerCase() + '">' + txt + '</span>');
                        var _items = button.getMenu().getItems();
                        for (var m = 0; m < _items.length; m++) {
                            if (_items[m].value.toLowerCase() == info.value.toLowerCase()) {
                                _items[m].cfg.setProperty('checked', true);
                            } else {
                                _items[m].cfg.setProperty('checked', false);
                            }
                        }
                    }
                }
                if (ev) {
                    Event.stopEvent(ev);
                }
            }
        },
        /**
        * @private
        * @property _keyNav
        * @description Flag to determine if the arrow nav listeners have been attached
        * @type Boolean
        */
        _keyNav: null,
        /**
        * @private
        * @property _navCounter
        * @description Internal counter for walking the buttons in the toolbar with the arrow keys
        * @type Number
        */
        _navCounter: null,
        /**
        * @private
        * @method _navigateButtons
        * @description Handles the navigation/focus of toolbar buttons with the Arrow Keys
        * @param {Event} ev The Key Event
        */
        _navigateButtons: function(ev) {
            switch (ev.keyCode) {
                case 37:
                case 39:
                    if (ev.keyCode == 37) {
                        this._navCounter--;
                    } else {
                        this._navCounter++;
                    }
                    if (this._navCounter > (this._buttonList.length - 1)) {
                        this._navCounter = 0;
                    }
                    if (this._navCounter < 0) {
                        this._navCounter = (this._buttonList.length - 1);
                    }
                    if (this._buttonList[this._navCounter]) {
                        var el = this._buttonList[this._navCounter].get('element');
                        if (this.browser.ie) {
                            el = this._buttonList[this._navCounter].get('element').getElementsByTagName('a')[0];
                        }
                        if (this._buttonList[this._navCounter].get('disabled')) {
                            this._navigateButtons(ev);
                        } else {
                            el.focus();
                        }
                    }
                    break;
            }
        },
        /**
        * @private
        * @method _handleFocus
        * @description Sets up the listeners for the arrow key navigation
        */
        _handleFocus: function() {
            if (!this._keyNav) {
                var ev = 'keypress';
                if (this.browser.ie) {
                    ev = 'keydown';
                }
                Event.on(this.get('element'), ev, this._navigateButtons, this, true);
                this._keyNav = true;
                this._navCounter = -1;
            }
        },
        /**
        * @method getButtonById
        * @description Gets a button instance from the toolbar by is Dom id.
        * @param {String} id The Dom id to query for.
        * @return {<a href="YAHOO.widget.ToolbarButton.html">YAHOO.widget.ToolbarButton</a>}
        */
        getButtonById: function(id) {
            var len = this._buttonList.length;
            for (var i = 0; i < len; i++) {
                if (this._buttonList[i] && this._buttonList[i].get('id') == id) {
                    return this._buttonList[i];
                }
            }
            return false;
        },
        /**
        * @method getButtonByValue
        * @description Gets a button instance or a menuitem instance from the toolbar by it's value.
        * @param {String} value The button value to query for.
        * @return {<a href="YAHOO.widget.ToolbarButton.html">YAHOO.widget.ToolbarButton</a> or <a href="YAHOO.widget.MenuItem.html">YAHOO.widget.MenuItem</a>}
        */
        getButtonByValue: function(value) {
            var _buttons = this.get('buttons');
            if (!_buttons) {
                return false;
            }
            var len = _buttons.length;
            for (var i = 0; i < len; i++) {
                if (_buttons[i].group !== undefined) {
                    for (var m = 0; m < _buttons[i].buttons.length; m++) {
                        if ((_buttons[i].buttons[m].value == value) || (_buttons[i].buttons[m].menucmd == value)) {
                            return this.getButtonById(_buttons[i].buttons[m].id);
                        }
                        if (_buttons[i].buttons[m].menu) { //Menu Button, loop through the values
                            for (var s = 0; s < _buttons[i].buttons[m].menu.length; s++) {
                                if (_buttons[i].buttons[m].menu[s].value == value) {
                                    return this.getButtonById(_buttons[i].buttons[m].id);
                                }
                            }
                        }
                    }
                } else {
                    if ((_buttons[i].value == value) || (_buttons[i].menucmd == value)) {
                        return this.getButtonById(_buttons[i].id);
                    }
                    if (_buttons[i].menu) { //Menu Button, loop through the values
                        for (var j = 0; j < _buttons[i].menu.length; j++) {
                            if (_buttons[i].menu[j].value == value) {
                                return this.getButtonById(_buttons[i].id);
                            }
                        }
                    }
                }
            }
            return false;
        },
        /**
        * @method getButtonByIndex
        * @description Gets a button instance from the toolbar by is index in _buttonList.
        * @param {Number} index The index of the button in _buttonList.
        * @return {<a href="YAHOO.widget.ToolbarButton.html">YAHOO.widget.ToolbarButton</a>}
        */
        getButtonByIndex: function(index) {
            if (this._buttonList[index]) {
                return this._buttonList[index];
            } else {
                return false;
            }
        },
        /**
        * @method getButtons
        * @description Returns an array of buttons in the current toolbar
        * @return {Array}
        */
        getButtons: function() {
            return this._buttonList;
        },
        /**
        * @method disableButton
        * @description Disables a button in the toolbar.
        * @param {String/Number} id Disable a button by it's id, index or value.
        * @return {Boolean}
        */
        disableButton: function(id) {
            var button = getButton.call(this, id);
            if (button) {
                button.set('disabled', true);
            } else {
                return false;
            }
        },
        /**
        * @method enableButton
        * @description Enables a button in the toolbar.
        * @param {String/Number} id Enable a button by it's id, index or value.
        * @return {Boolean}
        */
        enableButton: function(id) {
            if (this.get('disabled')) {
                return false;
            }
            var button = getButton.call(this, id);
            if (button) {
                if (button.get('disabled')) {
                    button.set('disabled', false);
                }
            } else {
                return false;
            }
        },
        /**
        * @method isSelected
        * @description Tells if a button is selected or not.
        * @param {String/Number} id A button by it's id, index or value.
        * @return {Boolean}
        */
        isSelected: function(id) {
            var button = getButton.call(this, id);
            if (button) {
                return button._selected;
            }
            return false;
        },
        /**
        * @method selectButton
        * @description Selects a button in the toolbar.
        * @param {String/Number} id Select a button by it's id, index or value.
        * @param {String} value If this is a Menu Button, check this item in the menu
        * @return {Boolean}
        */
        selectButton: function(id, value) {
            var button = getButton.call(this, id);
            if (button) {
                button.addClass('yui-button-selected');
                button.addClass('yui-button-' + button.get('value') + '-selected');
                button._selected = true;
                if (value) {
                    if (button.buttonType == 'rich') {
                        var _items = button.getMenu().getItems();
                        for (var m = 0; m < _items.length; m++) {
                            if (_items[m].value == value) {
                                _items[m].cfg.setProperty('checked', true);
                                button.set('label', '<span class="yui-toolbar-' + button.get('value') + '-' + (value).replace(/ /g, '-').toLowerCase() + '">' + _items[m]._oText.nodeValue + '</span>');
                            } else {
                                _items[m].cfg.setProperty('checked', false);
                            }
                        }
                    }
                }
            } else {
                return false;
            }
        },
        /**
        * @method deselectButton
        * @description Deselects a button in the toolbar.
        * @param {String/Number} id Deselect a button by it's id, index or value.
        * @return {Boolean}
        */
        deselectButton: function(id) {
            var button = getButton.call(this, id);
            if (button) {
                button.removeClass('yui-button-selected');
                button.removeClass('yui-button-' + button.get('value') + '-selected');
                button.removeClass('yui-button-hover');
                button._selected = false;
            } else {
                return false;
            }
        },
        /**
        * @method deselectAllButtons
        * @description Deselects all buttons in the toolbar.
        * @return {Boolean}
        */
        deselectAllButtons: function() {
            var len = this._buttonList.length;
            for (var i = 0; i < len; i++) {
                this.deselectButton(this._buttonList[i]);
            }
        },
        /**
        * @method disableAllButtons
        * @description Disables all buttons in the toolbar.
        * @return {Boolean}
        */
        disableAllButtons: function() {
            if (this.get('disabled')) {
                return false;
            }
            var len = this._buttonList.length;
            for (var i = 0; i < len; i++) {
                this.disableButton(this._buttonList[i]);
            }
        },
        /**
        * @method enableAllButtons
        * @description Enables all buttons in the toolbar.
        * @return {Boolean}
        */
        enableAllButtons: function() {
            if (this.get('disabled')) {
                return false;
            }
            var len = this._buttonList.length;
            for (var i = 0; i < len; i++) {
                this.enableButton(this._buttonList[i]);
            }
        },
        /**
        * @method resetAllButtons
        * @description Resets all buttons to their initial state.
        * @param {Object} _ex Except these buttons
        * @return {Boolean}
        */
        resetAllButtons: function(_ex) {
            if (!Lang.isObject(_ex)) {
                _ex = {};
            }
            if (this.get('disabled') || !this._buttonList) {
                return false;
            }
            var len = this._buttonList.length;
            for (var i = 0; i < len; i++) {
                var _button = this._buttonList[i];
                if (_button) {
                    var disabled = _button._configs.disabled._initialConfig.value;
                    if (_ex[_button.get('id')]) {
                        this.enableButton(_button);
                        this.selectButton(_button);
                    } else {
                        if (disabled) {
                            this.disableButton(_button);
                        } else {
                            this.enableButton(_button);
                        }
                        this.deselectButton(_button);
                    }
                }
            }
        },
        /**
        * @method destroyButton
        * @description Destroy a button in the toolbar.
        * @param {String/Number} id Destroy a button by it's id or index.
        * @return {Boolean}
        */
        destroyButton: function(id) {
            var button = getButton.call(this, id);
            if (button) {
                var thisID = button.get('id'),
                    new_list = [], i = 0,
                    len = this._buttonList.length;

                button.destroy();
                
                for (i = 0; i < len; i++) {
                    if (this._buttonList[i].get('id') != thisID) {
                        new_list[new_list.length]= this._buttonList[i];
                    }
                }

                this._buttonList = new_list;
            } else {
                return false;
            }
        },
        /**
        * @method destroy
        * @description Destroys the toolbar, all of it's elements and objects.
        * @return {Boolean}
        */
        destroy: function() {
            var len = this._configuredButtons.length, j, i;
            for(b = 0; b < len; b++) {
                this.destroyButton(this._configuredButtons[b]);
            }

            this._configuredButtons = null;
        
            this.get('element').innerHTML = '';
            this.get('element').className = '';
            //Brutal Object Destroy
            for (i in this) {
                if (Lang.hasOwnProperty(this, i)) {
                    this[i] = null;
                }
            }
            return true;
        },
        /**
        * @method collapse
        * @description Programatically collapse the toolbar.
        * @param {Boolean} collapse True to collapse, false to expand.
        */
        collapse: function(collapse) {
            var el = Dom.getElementsByClassName('collapse', 'span', this._titlebar);
            if (collapse === false) {
                Dom.removeClass(this.get('cont').parentNode, 'yui-toolbar-container-collapsed');
                if (el[0]) {
                    Dom.removeClass(el[0], 'collapsed');
                    el[0].title = this.STR_COLLAPSE;
                }
                this.fireEvent('toolbarExpanded', { type: 'toolbarExpanded', target: this });
            } else {
                if (el[0]) {
                    Dom.addClass(el[0], 'collapsed');
                    el[0].title = this.STR_EXPAND;
                }
                Dom.addClass(this.get('cont').parentNode, 'yui-toolbar-container-collapsed');
                this.fireEvent('toolbarCollapsed', { type: 'toolbarCollapsed', target: this });
            }
        },
        /**
        * @method toString
        * @description Returns a string representing the toolbar.
        * @return {String}
        */
        toString: function() {
            return 'Toolbar (#' + this.get('element').id + ') with ' + this._buttonList.length + ' buttons.';
        }
    });
/**
* @event buttonClick
* @param {Object} o The object passed to this handler is the button config used to create the button.
* @description Fires when any botton receives a click event. Passes back a single object representing the buttons config object. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event valueClick
* @param {Object} o The object passed to this handler is the button config used to create the button.
* @description This is a special dynamic event that is created and dispatched based on the value property
* of the button config. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* Example:
* <code><pre>
* buttons : [
*   { type: 'button', value: 'test', value: 'testButton' }
* ]</pre>
* </code>
* With the valueClick event you could subscribe to this buttons click event with this:
* tbar.in('testButtonClick', function() { alert('test button clicked'); })
* @type YAHOO.util.CustomEvent
*/
/**
* @event toolbarExpanded
* @description Fires when the toolbar is expanded via the collapse button. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event toolbarCollapsed
* @description Fires when the toolbar is collapsed via the collapse button. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
})();
/**
 * @module editor
 * @description <p>The Rich Text Editor is a UI control that replaces a standard HTML textarea; it allows for the rich formatting of text content, including common structural treatments like lists, formatting treatments like bold and italic text, and drag-and-drop inclusion and sizing of images. The Rich Text Editor's toolbar is extensible via a plugin architecture so that advanced implementations can achieve a high degree of customization.</p>
 * @namespace YAHOO.widget
 * @requires yahoo, dom, element, event, toolbar
 * @optional animation, container_core, resize, dragdrop
 */

(function() {
var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang,
    Toolbar = YAHOO.widget.Toolbar;

    /**
     * The Rich Text Editor is a UI control that replaces a standard HTML textarea; it allows for the rich formatting of text content, including common structural treatments like lists, formatting treatments like bold and italic text, and drag-and-drop inclusion and sizing of images. The Rich Text Editor's toolbar is extensible via a plugin architecture so that advanced implementations can achieve a high degree of customization.
     * @constructor
     * @class SimpleEditor
     * @extends YAHOO.util.Element
     * @param {String/HTMLElement} el The textarea element to turn into an editor.
     * @param {Object} attrs Object liternal containing configuration parameters.
    */
    
    YAHOO.widget.SimpleEditor = function(el, attrs) {
        
        var o = {};
        if (Lang.isObject(el) && (!el.tagName) && !attrs) {
            Lang.augmentObject(o, el); //Break the config reference
            el = document.createElement('textarea');
            this.DOMReady = true;
            if (o.container) {
                var c = Dom.get(o.container);
                c.appendChild(el);
            } else {
                document.body.appendChild(el);
            }
        } else {
            if (attrs) {
                Lang.augmentObject(o, attrs); //Break the config reference
            }
        }

        var oConfig = {
            element: null,
            attributes: o
        }, id = null;

        if (Lang.isString(el)) {
            id = el;
        } else {
            if (oConfig.attributes.id) {
                id = oConfig.attributes.id;
            } else {
                this.DOMReady = true;
                id = Dom.generateId(el);
            }
        }
        oConfig.element = el;

        var element_cont = document.createElement('DIV');
        oConfig.attributes.element_cont = new YAHOO.util.Element(element_cont, {
            id: id + '_container'
        });
        var div = document.createElement('div');
        Dom.addClass(div, 'first-child');
        oConfig.attributes.element_cont.appendChild(div);
        
        if (!oConfig.attributes.toolbar_cont) {
            oConfig.attributes.toolbar_cont = document.createElement('DIV');
            oConfig.attributes.toolbar_cont.id = id + '_toolbar';
            div.appendChild(oConfig.attributes.toolbar_cont);
        }
        var editorWrapper = document.createElement('DIV');
        div.appendChild(editorWrapper);
        oConfig.attributes.editor_wrapper = editorWrapper;

        YAHOO.widget.SimpleEditor.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
    };


    YAHOO.extend(YAHOO.widget.SimpleEditor, YAHOO.util.Element, {
        /**
        * @private
        * @property _resizeConfig
        * @description The default config for the Resize Utility
        */
        _resizeConfig: {
            handles: ['br'],
            autoRatio: true,
            status: true,
            proxy: true,
            useShim: true,
            setSize: false
        },
        /**
        * @private
        * @method _setupResize
        * @description Creates the Resize instance and binds its events.
        */
        _setupResize: function() {
            if (!YAHOO.util.DD || !YAHOO.util.Resize) { return false; }
            if (this.get('resize')) {
                var config = {};
                Lang.augmentObject(config, this._resizeConfig); //Break the config reference
                this.resize = new YAHOO.util.Resize(this.get('element_cont').get('element'), config);
                this.resize.on('resize', function(args) {
                    var anim = this.get('animate');
                    this.set('animate', false);
                    this.set('width', args.width + 'px');
                    var h = args.height,
                        th = (this.toolbar.get('element').clientHeight + 2),
                        dh = 0;
                    if (this.dompath) {
                        dh = (this.dompath.clientHeight + 1); //It has a 1px top border..
                    }
                    var newH = (h - th - dh);
                    this.set('height', newH + 'px');
                    this.get('element_cont').setStyle('height', '');
                    this.set('animate', anim);
                }, this, true);
            }
        },
        /**
        * @property resize
        * @description A reference to the Resize object
        * @type YAHOO.util.Resize
        */
        resize: null,
        /**
        * @private
        * @method _setupDD
        * @description Sets up the DD instance used from the 'drag' config option.
        */
        _setupDD: function() {
            if (!YAHOO.util.DD) { return false; }
            if (this.get('drag')) {
                var d = this.get('drag'),
                    dd = YAHOO.util.DD;
                if (d === 'proxy') {
                    dd = YAHOO.util.DDProxy;
                }

                this.dd = new dd(this.get('element_cont').get('element'));
                this.toolbar.addClass('draggable'); 
                this.dd.setHandleElId(this.toolbar._titlebar); 
            }
        },
        /**
        * @property dd
        * @description A reference to the DragDrop object.
        * @type YAHOO.util.DD/YAHOO.util.DDProxy
        */
        dd: null,
        /**
        * @private
        * @property _lastCommand
        * @description A cache of the last execCommand (used for Undo/Redo so they don't mark an undo level)
        * @type String
        */
        _lastCommand: null,
        _undoNodeChange: function() {},
        _storeUndo: function() {},
        /**
        * @private
        * @method _checkKey
        * @description Checks a keyMap entry against a key event
        * @param {Object} k The _keyMap object
        * @param {Event} e The Mouse Event
        * @return {Boolean}
        */
        _checkKey: function(k, e) {
            var ret = false;
            if ((e.keyCode === k.key)) {
                if (k.mods && (k.mods.length > 0)) {
                    var val = 0;
                    for (var i = 0; i < k.mods.length; i++) {
                        if (this.browser.mac) {
                            if (k.mods[i] == 'ctrl') {
                                k.mods[i] = 'meta';
                            }
                        }
                        if (e[k.mods[i] + 'Key'] === true) {
                            val++;
                        }
                    }
                    if (val === k.mods.length) {
                        ret = true;
                    }
                } else {
                    ret = true;
                }
            }
            return ret;
        },
        /**
        * @private
        * @property _keyMap
        * @description Named key maps for various actions in the Editor. Example: <code>CLOSE_WINDOW: { key: 87, mods: ['shift', 'ctrl'] }</code>. 
        * This entry shows that when key 87 (W) is found with the modifiers of shift and control, the window will close. You can customize this object to tweak keyboard shortcuts.
        * @type {Object/Mixed}
        */
        _keyMap: {
            SELECT_ALL: {
                key: 65, //A key
                mods: ['ctrl']
            },
            CLOSE_WINDOW: {
                key: 87, //W key
                mods: ['shift', 'ctrl']
            },
            FOCUS_TOOLBAR: {
                key: 27,
                mods: ['shift']
            },
            FOCUS_AFTER: {
                key: 27
            },
            FONT_SIZE_UP: {
                key: 38,
                mods: ['shift', 'ctrl']
            },
            FONT_SIZE_DOWN: {
                key: 40,
                mods: ['shift', 'ctrl']
            },
            CREATE_LINK: {
                key: 76,
                mods: ['shift', 'ctrl']
            },
            BOLD: {
                key: 66,
                mods: ['shift', 'ctrl']
            },
            ITALIC: {
                key: 73,
                mods: ['shift', 'ctrl']
            },
            UNDERLINE: {
                key: 85,
                mods: ['shift', 'ctrl']
            },
            UNDO: {
                key: 90,
                mods: ['ctrl']
            },
            REDO: {
                key: 90,
                mods: ['shift', 'ctrl']
            },
            JUSTIFY_LEFT: {
                key: 219,
                mods: ['shift', 'ctrl']
            },
            JUSTIFY_CENTER: {
                key: 220,
                mods: ['shift', 'ctrl']
            },
            JUSTIFY_RIGHT: {
                key: 221,
                mods: ['shift', 'ctrl']
            }
        },
        /**
        * @private
        * @method _cleanClassName
        * @description Makes a useable classname from dynamic data, by dropping it to lowercase and replacing spaces with -'s.
        * @param {String} str The classname to clean up
        * @return {String}
        */
        _cleanClassName: function(str) {
            return str.replace(/ /g, '-').toLowerCase();
        },
        /**
        * @property _textarea
        * @description Flag to determine if we are using a textarea or an HTML Node.
        * @type Boolean
        */
        _textarea: null,
        /**
        * @property _docType
        * @description The DOCTYPE to use in the editable container.
        * @type String
        */
        _docType: '<!DOCTYPE HTML PUBLIC "-/'+'/W3C/'+'/DTD HTML 4.01/'+'/EN" "http:/'+'/www.w3.org/TR/html4/strict.dtd">',
        /**
        * @property editorDirty
        * @description This flag will be set when certain things in the Editor happen. It is to be used by the developer to check to see if content has changed.
        * @type Boolean
        */
        editorDirty: null,
        /**
        * @property _defaultCSS
        * @description The default CSS used in the config for 'css'. This way you can add to the config like this: { css: YAHOO.widget.SimpleEditor.prototype._defaultCSS + 'ADD MYY CSS HERE' }
        * @type String
        */
        _defaultCSS: 'html { height: 95%; } body { padding: 7px; background-color: #fff; font: 13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small; } a, a:visited, a:hover { color: blue !important; text-decoration: underline !important; cursor: text !important; } .warning-localfile { border-bottom: 1px dashed red !important; } .yui-busy { cursor: wait !important; } img.selected { border: 2px dotted #808080; } img { cursor: pointer !important; border: none; } body.ptags.webkit div.yui-wk-p { margin: 11px 0; } body.ptags.webkit div.yui-wk-div { margin: 0; }',
        /**
        * @property _defaultToolbar
        * @private
        * @description Default toolbar config.
        * @type Object
        */
        _defaultToolbar: null,
        /**
        * @property _lastButton
        * @private
        * @description The last button pressed, so we don't disable it.
        * @type Object
        */
        _lastButton: null,
        /**
        * @property _baseHREF
        * @private
        * @description The base location of the editable page (this page) so that relative paths for image work.
        * @type String
        */
        _baseHREF: function() {
            var href = document.location.href;
            if (href.indexOf('?') !== -1) { //Remove the query string
                href = href.substring(0, href.indexOf('?'));
            }
            href = href.substring(0, href.lastIndexOf('/')) + '/';
            return href;
        }(),
        /**
        * @property _lastImage
        * @private
        * @description Safari reference for the last image selected (for styling as selected).
        * @type HTMLElement
        */
        _lastImage: null,
        /**
        * @property _blankImageLoaded
        * @private
        * @description Don't load the blank image more than once..
        * @type Boolean
        */
        _blankImageLoaded: null,
        /**
        * @property _fixNodesTimer
        * @private
        * @description Holder for the fixNodes timer
        * @type Date
        */
        _fixNodesTimer: null,
        /**
        * @property _nodeChangeTimer
        * @private
        * @description Holds a reference to the nodeChange setTimeout call
        * @type Number
        */
        _nodeChangeTimer: null,
        /**
        * @property _nodeChangeDelayTimer
        * @private
        * @description Holds a reference to the nodeChangeDelay setTimeout call
        * @type Number
        */
        _nodeChangeDelayTimer: null,
        /**
        * @property _lastNodeChangeEvent
        * @private
        * @description Flag to determine the last event that fired a node change
        * @type Event
        */
        _lastNodeChangeEvent: null,
        /**
        * @property _lastNodeChange
        * @private
        * @description Flag to determine when the last node change was fired
        * @type Date
        */
        _lastNodeChange: 0,
        /**
        * @property _rendered
        * @private
        * @description Flag to determine if editor has been rendered or not
        * @type Boolean
        */
        _rendered: null,
        /**
        * @property DOMReady
        * @private
        * @description Flag to determine if DOM is ready or not
        * @type Boolean
        */
        DOMReady: null,
        /**
        * @property _selection
        * @private
        * @description Holder for caching iframe selections
        * @type Object
        */
        _selection: null,
        /**
        * @property _mask
        * @private
        * @description DOM Element holder for the editor Mask when disabled
        * @type Object
        */
        _mask: null,
        /**
        * @property _showingHiddenElements
        * @private
        * @description Status of the hidden elements button
        * @type Boolean
        */
        _showingHiddenElements: null,
        /**
        * @property currentWindow
        * @description A reference to the currently open EditorWindow
        * @type Object
        */
        currentWindow: null,
        /**
        * @property currentEvent
        * @description A reference to the current editor event
        * @type Event
        */
        currentEvent: null,
        /**
        * @property operaEvent
        * @private
        * @description setTimeout holder for Opera and Image DoubleClick event..
        * @type Object
        */
        operaEvent: null,
        /**
        * @property currentFont
        * @description A reference to the last font selected from the Toolbar
        * @type HTMLElement
        */
        currentFont: null,
        /**
        * @property currentElement
        * @description A reference to the current working element in the editor
        * @type Array
        */
        currentElement: null,
        /**
        * @property dompath
        * @description A reference to the dompath container for writing the current working dom path to.
        * @type HTMLElement
        */
        dompath: null,
        /**
        * @property beforeElement
        * @description A reference to the H2 placed before the editor for Accessibilty.
        * @type HTMLElement
        */
        beforeElement: null,
        /**
        * @property afterElement
        * @description A reference to the H2 placed after the editor for Accessibilty.
        * @type HTMLElement
        */
        afterElement: null,
        /**
        * @property invalidHTML
        * @description Contains a list of HTML elements that are invalid inside the editor. They will be removed when they are found. If you set the value of a key to "{ keepContents: true }", then the element will be replaced with a yui-non span to be filtered out when cleanHTML is called. The only tag that is ignored here is the span tag as it will force the Editor into a loop and freeze the browser. However.. all of these tags will be removed in the cleanHTML routine.
        * @type Object
        */
        invalidHTML: {
            form: true,
            input: true,
            button: true,
            select: true,
            link: true,
            html: true,
            body: true,
            iframe: true,
            script: true,
            style: true,
            textarea: true
        },
        /**
        * @property toolbar
        * @description Local property containing the <a href="YAHOO.widget.Toolbar.html">YAHOO.widget.Toolbar</a> instance
        * @type <a href="YAHOO.widget.Toolbar.html">YAHOO.widget.Toolbar</a>
        */
        toolbar: null,
        /**
        * @private
        * @property _contentTimer
        * @description setTimeout holder for documentReady check
        */
        _contentTimer: null,
        /**
        * @private
        * @property _contentTimerMax
        * @description The number of times the loaded content should be checked before giving up. Default: 500
        */
        _contentTimerMax: 500,
        /**
        * @private
        * @property _contentTimerCounter
        * @description Counter to check the number of times the body is polled for before giving up
        * @type Number
        */
        _contentTimerCounter: 0,
        /**
        * @private
        * @property _disabled
        * @description The Toolbar items that should be disabled if there is no selection present in the editor.
        * @type Array
        */
        _disabled: [ 'createlink', 'fontname', 'fontsize', 'forecolor', 'backcolor' ],
        /**
        * @private
        * @property _alwaysDisabled
        * @description The Toolbar items that should ALWAYS be disabled event if there is a selection present in the editor.
        * @type Object
        */
        _alwaysDisabled: { undo: true, redo: true },
        /**
        * @private
        * @property _alwaysEnabled
        * @description The Toolbar items that should ALWAYS be enabled event if there isn't a selection present in the editor.
        * @type Object
        */
        _alwaysEnabled: { },
        /**
        * @private
        * @property _semantic
        * @description The Toolbar commands that we should attempt to make tags out of instead of using styles.
        * @type Object
        */
        _semantic: { 'bold': true, 'italic' : true, 'underline' : true },
        /**
        * @private
        * @property _tag2cmd
        * @description A tag map of HTML tags to convert to the different types of commands so we can select the proper toolbar button.
        * @type Object
        */
        _tag2cmd: {
            'b': 'bold',
            'strong': 'bold',
            'i': 'italic',
            'em': 'italic',
            'u': 'underline',
            'sup': 'superscript',
            'sub': 'subscript',
            'img': 'insertimage',
            'a' : 'createlink',
            'ul' : 'insertunorderedlist',
            'ol' : 'insertorderedlist'
        },

        /**
        * @private _createIframe
        * @description Creates the DOM and YUI Element for the iFrame editor area.
        * @param {String} id The string ID to prefix the iframe with
        * @return {Object} iFrame object
        */
        _createIframe: function() {
            var ifrmDom = document.createElement('iframe');
            ifrmDom.id = this.get('id') + '_editor';
            var config = {
                border: '0',
                frameBorder: '0',
                marginWidth: '0',
                marginHeight: '0',
                leftMargin: '0',
                topMargin: '0',
                allowTransparency: 'true',
                width: '100%'
            };
            if (this.get('autoHeight')) {
                config.scrolling = 'no';
            }
            for (var i in config) {
                if (Lang.hasOwnProperty(config, i)) {
                    ifrmDom.setAttribute(i, config[i]);
                }
            }
            var isrc = 'javascript:;';
            if (this.browser.ie) {
                //isrc = 'about:blank';
                //TODO - Check this, I have changed it before..
                isrc = 'javascript:false;';
            }
            ifrmDom.setAttribute('src', isrc);
            var ifrm = new YAHOO.util.Element(ifrmDom);
            ifrm.setStyle('visibility', 'hidden');
            return ifrm;
        },
        /**
        * @private _isElement
        * @description Checks to see if an Element reference is a valid one and has a certain tag type
        * @param {HTMLElement} el The element to check
        * @param {String} tag The tag that the element needs to be
        * @return {Boolean}
        */
        _isElement: function(el, tag) {
            if (el && el.tagName && (el.tagName.toLowerCase() == tag)) {
                return true;
            }
            if (el && el.getAttribute && (el.getAttribute('tag') == tag)) {
                return true;
            }
            return false;
        },
        /**
        * @private _hasParent
        * @description Checks to see if an Element reference or one of it's parents is a valid one and has a certain tag type
        * @param {HTMLElement} el The element to check
        * @param {String} tag The tag that the element needs to be
        * @return HTMLElement
        */
        _hasParent: function(el, tag) {
            if (!el || !el.parentNode) {
                return false;
            }
            
            while (el.parentNode) {
                if (this._isElement(el, tag)) {
                    return el;
                }
                if (el.parentNode) {
                    el = el.parentNode;
                } else {
                    return false;
                }
            }
            return false;
        },
        /**
        * @private
        * @method _getDoc
        * @description Get the Document of the IFRAME
        * @return {Object}
        */
        _getDoc: function() {
            var value = false;
            try {
                if (this.get('iframe').get('element').contentWindow.document) {
                    value = this.get('iframe').get('element').contentWindow.document;
                    return value;
                }
            } catch (e) {
                return false;
            }
        },
        /**
        * @private
        * @method _getWindow
        * @description Get the Window of the IFRAME
        * @return {Object}
        */
        _getWindow: function() {
            return this.get('iframe').get('element').contentWindow;
        },
        /**
        * @method focus
        * @description Attempt to set the focus of the iframes window.
        */
        focus: function() {
            this._getWindow().focus();
        },
        /**
        * @private
        * @depreciated - This should not be used, moved to this.focus();
        * @method _focusWindow
        * @description Attempt to set the focus of the iframes window.
        */
        _focusWindow: function() {
            this.focus();
        },
        /**
        * @private
        * @method _hasSelection
        * @description Determines if there is a selection in the editor document.
        * @return {Boolean}
        */
        _hasSelection: function() {
            var sel = this._getSelection();
            var range = this._getRange();
            var hasSel = false;

            if (!sel || !range) {
                return hasSel;
            }

            //Internet Explorer
            if (this.browser.ie || this.browser.opera) {
                if (range.text) {
                    hasSel = true;
                }
                if (range.html) {
                    hasSel = true;
                }
            } else {
                if (this.browser.webkit) {
                    if (sel+'' !== '') {
                        hasSel = true;
                    }
                } else {
                    if (sel && (sel.toString() !== '') && (sel !== undefined)) {
                        hasSel = true;
                    }
                }
            }
            return hasSel;
        },
        /**
        * @private
        * @method _getSelection
        * @description Handles the different selection objects across the A-Grade list.
        * @return {Object} Selection Object
        */
        _getSelection: function() {
            var _sel = null;
            if (this._getDoc() && this._getWindow()) {
                if (this._getDoc().selection) {
                    _sel = this._getDoc().selection;
                } else {
                    _sel = this._getWindow().getSelection();
                }
                //Handle Safari's lack of Selection Object
                if (this.browser.webkit) {
                    if (_sel.baseNode) {
                            this._selection = {};
                            this._selection.baseNode = _sel.baseNode;
                            this._selection.baseOffset = _sel.baseOffset;
                            this._selection.extentNode = _sel.extentNode;
                            this._selection.extentOffset = _sel.extentOffset;
                    } else if (this._selection !== null) {
                        _sel = this._getWindow().getSelection();
                        _sel.setBaseAndExtent(
                            this._selection.baseNode,
                            this._selection.baseOffset,
                            this._selection.extentNode,
                            this._selection.extentOffset);
                        this._selection = null;
                    }
                }
            }
            return _sel;
        },
        /**
        * @private
        * @method _selectNode
        * @description Places the highlight around a given node
        * @param {HTMLElement} node The node to select
        */
        _selectNode: function(node, collapse) {
            if (!node) {
                return false;
            }
            var sel = this._getSelection(),
                range = null;

            if (this.browser.ie) {
                try { //IE freaks out here sometimes..
                    range = this._getDoc().body.createTextRange();
                    range.moveToElementText(node);
                    range.select();
                } catch (e) {
                }
            } else if (this.browser.webkit) {
                if (collapse) {
				    sel.setBaseAndExtent(node, 1, node, node.innerText.length);
                } else {
				    sel.setBaseAndExtent(node, 0, node, node.innerText.length);
                }
            } else if (this.browser.opera) {
                sel = this._getWindow().getSelection();
                range = this._getDoc().createRange();
                range.selectNode(node);
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                range = this._getDoc().createRange();
                range.selectNodeContents(node);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            //TODO - Check Performance
            this.nodeChange();
        },
        /**
        * @private
        * @method _getRange
        * @description Handles the different range objects across the A-Grade list.
        * @return {Object} Range Object
        */
        _getRange: function() {
            var sel = this._getSelection();

            if (sel === null) {
                return null;
            }

            if (this.browser.webkit && !sel.getRangeAt) {
                var _range = this._getDoc().createRange();
                try {
                    _range.setStart(sel.anchorNode, sel.anchorOffset);
                    _range.setEnd(sel.focusNode, sel.focusOffset);
                } catch (e) {
                    _range = this._getWindow().getSelection()+'';
                }
                return _range;
            }

            if (this.browser.ie || this.browser.opera) {
                try {
                    return sel.createRange();
                } catch (e2) {
                    return null;
                }
            }

            if (sel.rangeCount > 0) {
                return sel.getRangeAt(0);
            }
            return null;
        },
        /**
        * @private
        * @method _setDesignMode
        * @description Sets the designMode property of the iFrame document's body.
        * @param {String} state This should be either on or off
        */
        _setDesignMode: function(state) {
            if (this.get('setDesignMode')) {
                try {
                    this._getDoc().designMode = ((state.toLowerCase() == 'off') ? 'off' : 'on');
                } catch(e) { }
            }
        },
        /**
        * @private
        * @method _toggleDesignMode
        * @description Toggles the designMode property of the iFrame document on and off.
        * @return {String} The state that it was set to.
        */
        _toggleDesignMode: function() {
            var _dMode = this._getDoc().designMode,
                _state = ((_dMode.toLowerCase() == 'on') ? 'off' : 'on');
            this._setDesignMode(_state);
            return _state;
        },
        /**
        * @private
        * @property _focused
        * @description Holder for trapping focus/blur state and prevent double events
        * @type Boolean
        */
        _focused: null,
        /**
        * @private
        * @method _handleFocus
        * @description Handles the focus of the iframe. Note, this is window focus event, not an Editor focus event.
        * @param {Event} e The DOM Event
        */
        _handleFocus: function(e) {
            if (!this._focused) {
                this._focused = true;
                this.fireEvent('editorWindowFocus', { type: 'editorWindowFocus', target: this });
            }
        },
        /**
        * @private
        * @method _handleBlur
        * @description Handles the blur of the iframe. Note, this is window blur event, not an Editor blur event.
        * @param {Event} e The DOM Event
        */
        _handleBlur: function(e) {
            if (this._focused) {
                this._focused = false;
                this.fireEvent('editorWindowBlur', { type: 'editorWindowBlur', target: this });
            }
        },
        /**
        * @private
        * @method _initEditorEvents
        * @description This method sets up the listeners on the Editors document.
        */
        _initEditorEvents: function() {
            //Setup Listeners on iFrame
            var doc = this._getDoc(),
                win = this._getWindow();

            Event.on(doc, 'mouseup', this._handleMouseUp, this, true);
            Event.on(doc, 'mousedown', this._handleMouseDown, this, true);
            Event.on(doc, 'click', this._handleClick, this, true);
            Event.on(doc, 'dblclick', this._handleDoubleClick, this, true);
            Event.on(doc, 'keypress', this._handleKeyPress, this, true);
            Event.on(doc, 'keyup', this._handleKeyUp, this, true);
            Event.on(doc, 'keydown', this._handleKeyDown, this, true);
            /* TODO -- Everyone but Opera works here..
            Event.on(doc, 'paste', function() {
            }, this, true);
            */
 
            //Focus and blur..
            Event.on(win, 'focus', this._handleFocus, this, true);
            Event.on(win, 'blur', this._handleBlur, this, true);
        },
        /**
        * @private
        * @method _removeEditorEvents
        * @description This method removes the listeners on the Editors document (for disabling).
        */
        _removeEditorEvents: function() {
            //Remove Listeners on iFrame
            var doc = this._getDoc(),
                win = this._getWindow();

            Event.removeListener(doc, 'mouseup', this._handleMouseUp, this, true);
            Event.removeListener(doc, 'mousedown', this._handleMouseDown, this, true);
            Event.removeListener(doc, 'click', this._handleClick, this, true);
            Event.removeListener(doc, 'dblclick', this._handleDoubleClick, this, true);
            Event.removeListener(doc, 'keypress', this._handleKeyPress, this, true);
            Event.removeListener(doc, 'keyup', this._handleKeyUp, this, true);
            Event.removeListener(doc, 'keydown', this._handleKeyDown, this, true);

            //Focus and blur..
            Event.removeListener(win, 'focus', this._handleFocus, this, true);
            Event.removeListener(win, 'blur', this._handleBlur, this, true);
        },
        _fixWebkitDivs: function() {
            if (this.browser.webkit) {
                var divs = this._getDoc().body.getElementsByTagName('div');
                Dom.addClass(divs, 'yui-wk-div');
            }
        },
        /**
        * @private
        * @method _initEditor
        * @param {Boolean} raw Don't add events.
        * @description This method is fired from _checkLoaded when the document is ready. It turns on designMode and set's up the listeners.
        */
        _initEditor: function(raw) {
            if (this._editorInit) {
                return;
            }
            this._editorInit = true;
            if (this.browser.ie) {
                this._getDoc().body.style.margin = '0';
            }
            if (!this.get('disabled')) {
                this._setDesignMode('on');
                this._contentTimerCounter = 0;
            }
            if (!this._getDoc().body) {
                this._contentTimerCounter = 0;
                this._editorInit = false;
                this._checkLoaded();
                return false;
            }
            
            if (!raw) {
                this.toolbar.on('buttonClick', this._handleToolbarClick, this, true);
            }
            if (!this.get('disabled')) {
                this._initEditorEvents();
                this.toolbar.set('disabled', false);
            }

            if (raw) {
                this.fireEvent('editorContentReloaded', { type: 'editorreloaded', target: this });
            } else {
                this.fireEvent('editorContentLoaded', { type: 'editorLoaded', target: this });
            }
            this._fixWebkitDivs();
            if (this.get('dompath')) {
                var self = this;
                setTimeout(function() {
                    self._writeDomPath.call(self);
                    self._setupResize.call(self);
                }, 150);
            }
            var br = [];
            for (var i in this.browser) {
                if (this.browser[i]) {
                    br.push(i);
                }
            }
            if (this.get('ptags')) {
                br.push('ptags');
            }
            Dom.addClass(this._getDoc().body, br.join(' '));
            this.nodeChange(true);
        },
        /**
        * @private
        * @method _checkLoaded
        * @param {Boolean} raw Don't add events.
        * @description Called from a setTimeout loop to check if the iframes body.onload event has fired, then it will init the editor.
        */
        _checkLoaded: function(raw) {
            this._editorInit = false;
            this._contentTimerCounter++;
            if (this._contentTimer) {
                clearTimeout(this._contentTimer);
            }
            if (this._contentTimerCounter > this._contentTimerMax) {
                return false;
            }
            var init = false;
            try {
                if (this._getDoc() && this._getDoc().body) {
                    if (this.browser.ie) {
                        if (this._getDoc().body.readyState == 'complete') {
                            init = true;
                        }
                    } else {
                        if (this._getDoc().body._rteLoaded === true) {
                            init = true;
                        }
                    }
                }
            } catch (e) {
                init = false;
            }

            if (init === true) {
                //The onload event has fired, clean up after ourselves and fire the _initEditor method
                this._initEditor(raw);
            } else {
                var self = this;
                this._contentTimer = setTimeout(function() {
                    self._checkLoaded.call(self, raw);
                }, 20);
            }
        },
        /**
        * @private
        * @method _setInitialContent
        * @param {Boolean} raw Don't add events.
        * @description This method will open the iframes content document and write the textareas value into it, then start the body.onload checking.
        */
        _setInitialContent: function(raw) {

            var value = ((this._textarea) ? this.get('element').value : this.get('element').innerHTML),
                doc = null;

            if (value === '') {
                value = '<br>';
            }

            var html = Lang.substitute(this.get('html'), {
                TITLE: this.STR_TITLE,
                CONTENT: this._cleanIncomingHTML(value),
                CSS: this.get('css'),
                HIDDEN_CSS: ((this.get('hiddencss')) ? this.get('hiddencss') : '/* No Hidden CSS */'),
                EXTRA_CSS: ((this.get('extracss')) ? this.get('extracss') : '/* No Extra CSS */')
            }),
            check = true;

            html = html.replace(/RIGHT_BRACKET/gi, '{');
            html = html.replace(/LEFT_BRACKET/gi, '}');

            if (document.compatMode != 'BackCompat') {
                html = this._docType + "\n" + html;
            } else {
            }

            if (this.browser.ie || this.browser.webkit || this.browser.opera || (navigator.userAgent.indexOf('Firefox/1.5') != -1)) {
                //Firefox 1.5 doesn't like setting designMode on an document created with a data url
                try {
                    //Adobe AIR Code
                    if (this.browser.air) {
                        doc = this._getDoc().implementation.createHTMLDocument();
                        var origDoc = this._getDoc();
                        origDoc.open();
                        origDoc.close();
                        doc.open();
                        doc.write(html);
                        doc.close();
                        var node = origDoc.importNode(doc.getElementsByTagName("html")[0], true);
                        origDoc.replaceChild(node, origDoc.getElementsByTagName("html")[0]);
                        origDoc.body._rteLoaded = true;
                    } else {
                        doc = this._getDoc();
                        doc.open();
                        doc.write(html);
                        doc.close();
                    }
                } catch (e) {
                    //Safari will only be here if we are hidden
                    check = false;
                }
            } else {
                //This keeps Firefox 2 from writing the iframe to history preserving the back buttons functionality
                this.get('iframe').get('element').src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
            }
            this.get('iframe').setStyle('visibility', '');
            if (check) {
                this._checkLoaded(raw);
            }            
        },
        /**
        * @private
        * @method _setMarkupType
        * @param {String} action The action to take. Possible values are: css, default or semantic
        * @description This method will turn on/off the useCSS execCommand.
        */
        _setMarkupType: function(action) {
            switch (this.get('markup')) {
                case 'css':
                    this._setEditorStyle(true);
                    break;
                case 'default':
                    this._setEditorStyle(false);
                    break;
                case 'semantic':
                case 'xhtml':
                    if (this._semantic[action]) {
                        this._setEditorStyle(false);
                    } else {
                        this._setEditorStyle(true);
                    }
                    break;
            }
        },
        /**
        * Set the editor to use CSS instead of HTML
        * @param {Booleen} stat True/False
        */
        _setEditorStyle: function(stat) {
            try {
                this._getDoc().execCommand('useCSS', false, !stat);
            } catch (ex) {
            }
        },
        /**
        * @private
        * @method _getSelectedElement
        * @description This method will attempt to locate the element that was last interacted with, either via selection, location or event.
        * @return {HTMLElement} The currently selected element.
        */
        _getSelectedElement: function() {
            var doc = this._getDoc(),
                range = null,
                sel = null,
                elm = null,
                check = true;

            if (this.browser.ie) {
                this.currentEvent = this._getWindow().event; //Event utility assumes window.event, so we need to reset it to this._getWindow().event;
                range = this._getRange();
                if (range) {
                    elm = range.item ? range.item(0) : range.parentElement();
                    if (this._hasSelection()) {
                        //TODO
                        //WTF.. Why can't I get an element reference here?!??!
                    }
                    if (elm === doc.body) {
                        elm = null;
                    }
                }
                if ((this.currentEvent !== null) && (this.currentEvent.keyCode === 0)) {
                    elm = Event.getTarget(this.currentEvent);
                }
            } else {
                sel = this._getSelection();
                range = this._getRange();

                if (!sel || !range) {
                    return null;
                }
                //TODO
                if (!this._hasSelection() && this.browser.webkit3) {
                    //check = false;
                }
                if (this.browser.gecko) {
                    //Added in 2.6.0
                    if (range.startContainer) {
                        if (range.startContainer.nodeType === 3) {
                            elm = range.startContainer.parentNode;
                        } else if (range.startContainer.nodeType === 1) {
                            elm = range.startContainer;
                        }
                        //Added in 2.7.0
                        if (this.currentEvent) {
                            var tar = Event.getTarget(this.currentEvent);
                            if (!this._isElement(tar, 'html')) {
                                if (elm !== tar) {
                                    elm = tar;
                                }
                            }
                        }
                    }
                }
                
                if (check) {
                    if (sel.anchorNode && (sel.anchorNode.nodeType == 3)) {
                        if (sel.anchorNode.parentNode) { //next check parentNode
                            elm = sel.anchorNode.parentNode;
                        }
                        if (sel.anchorNode.nextSibling != sel.focusNode.nextSibling) {
                            elm = sel.anchorNode.nextSibling;
                        }
                    }
                    if (this._isElement(elm, 'br')) {
                        elm = null;
                    }
                    if (!elm) {
                        elm = range.commonAncestorContainer;
                        if (!range.collapsed) {
                            if (range.startContainer == range.endContainer) {
                                if (range.startOffset - range.endOffset < 2) {
                                    if (range.startContainer.hasChildNodes()) {
                                        elm = range.startContainer.childNodes[range.startOffset];
                                    }
                                }
                            }
                        }
                    }
               }
            }
            
            if (this.currentEvent !== null) {
                try {
                    switch (this.currentEvent.type) {
                        case 'click':
                        case 'mousedown':
                        case 'mouseup':
                            if (this.browser.webkit) {
                                elm = Event.getTarget(this.currentEvent);
                            }
                            break;
                        default:
                            //Do nothing
                            break;
                    }
                } catch (e) {
                }
            } else if ((this.currentElement && this.currentElement[0]) && (!this.browser.ie)) {
                //TODO is this still needed?
                //elm = this.currentElement[0];
            }


            if (this.browser.opera || this.browser.webkit) {
                if (this.currentEvent && !elm) {
                    elm = YAHOO.util.Event.getTarget(this.currentEvent);
                }
            }
            if (!elm || !elm.tagName) {
                elm = doc.body;
            }
            if (this._isElement(elm, 'html')) {
                //Safari sometimes gives us the HTML node back..
                elm = doc.body;
            }
            if (this._isElement(elm, 'body')) {
                //make sure that body means this body not the parent..
                elm = doc.body;
            }
            if (elm && !elm.parentNode) { //Not in document
                elm = doc.body;
            }
            if (elm === undefined) {
                elm = null;
            }
            return elm;
        },
        /**
        * @private
        * @method _getDomPath
        * @description This method will attempt to build the DOM path from the currently selected element.
        * @param HTMLElement el The element to start with, if not provided _getSelectedElement is used
        * @return {Array} An array of node references that will create the DOM Path.
        */
        _getDomPath: function(el) {
            if (!el) {
			    el = this._getSelectedElement();
            }
			var domPath = [];
            while (el !== null) {
                if (el.ownerDocument != this._getDoc()) {
                    el = null;
                    break;
                }
                //Check to see if we get el.nodeName and nodeType
                if (el.nodeName && el.nodeType && (el.nodeType == 1)) {
                    domPath[domPath.length] = el;
                }

                if (this._isElement(el, 'body')) {
                    break;
                }

                el = el.parentNode;
            }
            if (domPath.length === 0) {
                if (this._getDoc() && this._getDoc().body) {
                    domPath[0] = this._getDoc().body;
                }
            }
            return domPath.reverse();
        },
        /**
        * @private
        * @method _writeDomPath
        * @description Write the current DOM path out to the dompath container below the editor.
        */
        _writeDomPath: function() { 
            var path = this._getDomPath(),
                pathArr = [],
                classPath = '',
                pathStr = '';

            for (var i = 0; i < path.length; i++) {
                var tag = path[i].tagName.toLowerCase();
                if ((tag == 'ol') && (path[i].type)) {
                    tag += ':' + path[i].type;
                }
                if (Dom.hasClass(path[i], 'yui-tag')) {
                    tag = path[i].getAttribute('tag');
                }
                if ((this.get('markup') == 'semantic') || (this.get('markup') == 'xhtml')) {
                    switch (tag) {
                        case 'b': tag = 'strong'; break;
                        case 'i': tag = 'em'; break;
                    }
                }
                if (!Dom.hasClass(path[i], 'yui-non')) {
                    if (Dom.hasClass(path[i], 'yui-tag')) {
                        pathStr = tag;
                    } else {
                        classPath = ((path[i].className !== '') ? '.' + path[i].className.replace(/ /g, '.') : '');
                        if ((classPath.indexOf('yui') != -1) || (classPath.toLowerCase().indexOf('apple-style-span') != -1)) {
                            classPath = '';
                        }
                        pathStr = tag + ((path[i].id) ? '#' + path[i].id : '') + classPath;
                    }
                    switch (tag) {
                        case 'body':
                            pathStr = 'body';
                            break;
                        case 'a':
                            if (path[i].getAttribute('href', 2)) {
                                pathStr += ':' + path[i].getAttribute('href', 2).replace('mailto:', '').replace('http:/'+'/', '').replace('https:/'+'/', ''); //May need to add others here ftp
                            }
                            break;
                        case 'img':
                            var h = path[i].height;
                            var w = path[i].width;
                            if (path[i].style.height) {
                                h = parseInt(path[i].style.height, 10);
                            }
                            if (path[i].style.width) {
                                w = parseInt(path[i].style.width, 10);
                            }
                            pathStr += '(' + w + 'x' + h + ')';
                        break;
                    }

                    if (pathStr.length > 10) {
                        pathStr = '<span title="' + pathStr + '">' + pathStr.substring(0, 10) + '...' + '</span>';
                    } else {
                        pathStr = '<span title="' + pathStr + '">' + pathStr + '</span>';
                    }
                    pathArr[pathArr.length] = pathStr;
                }
            }
            var str = pathArr.join(' ' + this.SEP_DOMPATH + ' ');
            //Prevent flickering
            if (this.dompath.innerHTML != str) {
                this.dompath.innerHTML = str;
            }
        },
        /**
        * @private
        * @method _fixNodes
        * @description Fix href and imgs as well as remove invalid HTML.
        */
        _fixNodes: function() {
            try {
                var doc = this._getDoc(),
                    els = [];

                for (var v in this.invalidHTML) {
                    if (YAHOO.lang.hasOwnProperty(this.invalidHTML, v)) {
                        if (v.toLowerCase() != 'span') {
                            var tags = doc.body.getElementsByTagName(v);
                            if (tags.length) {
                                for (var i = 0; i < tags.length; i++) {
                                    els.push(tags[i]);
                                }
                            }
                        }
                    }
                }
                for (var h = 0; h < els.length; h++) {
                    if (els[h].parentNode) {
                        if (Lang.isObject(this.invalidHTML[els[h].tagName.toLowerCase()]) && this.invalidHTML[els[h].tagName.toLowerCase()].keepContents) {
                            this._swapEl(els[h], 'span', function(el) {
                                el.className = 'yui-non';
                            });
                        } else {
                            els[h].parentNode.removeChild(els[h]);
                        }
                    }
                }
                var imgs = this._getDoc().getElementsByTagName('img');
                Dom.addClass(imgs, 'yui-img');
            } catch(e) {}
        },
        /**
        * @private
        * @method _isNonEditable
        * @param Event ev The Dom event being checked
        * @description Method is called at the beginning of all event handlers to check if this element or a parent element has the class yui-noedit (this.CLASS_NOEDIT) applied.
        * If it does, then this method will stop the event and return true. The event handlers will then return false and stop the nodeChange from occuring. This method will also
        * disable and enable the Editor's toolbar based on the noedit state.
        * @return Boolean
        */
        _isNonEditable: function(ev) {
            if (this.get('allowNoEdit')) {
                var el = Event.getTarget(ev);
                if (this._isElement(el, 'html')) {
                    el = null;
                }
                var path = this._getDomPath(el);
                for (var i = (path.length - 1); i > -1; i--) {
                    if (Dom.hasClass(path[i], this.CLASS_NOEDIT)) {
                        //if (this.toolbar.get('disabled') === false) {
                        //    this.toolbar.set('disabled', true);
                        //}
                        try {
                             this._getDoc().execCommand('enableObjectResizing', false, 'false');
                        } catch (e) {}
                        this.nodeChange();
                        Event.stopEvent(ev);
                        return true;
                    }
                }
                //if (this.toolbar.get('disabled') === true) {
                    //Should only happen once..
                    //this.toolbar.set('disabled', false);
                    try {
                         this._getDoc().execCommand('enableObjectResizing', false, 'true');
                    } catch (e2) {}
                //}
            }
            return false;
        },
        /**
        * @private
        * @method _setCurrentEvent
        * @param {Event} ev The event to cache
        * @description Sets the current event property
        */
        _setCurrentEvent: function(ev) {
            this.currentEvent = ev;
        },
        /**
        * @private
        * @method _handleClick
        * @param {Event} ev The event we are working on.
        * @description Handles all click events inside the iFrame document.
        */
        _handleClick: function(ev) {
            var ret = this.fireEvent('beforeEditorClick', { type: 'beforeEditorClick', target: this, ev: ev });
            if (ret === false) {
                return false;
            }
            if (this._isNonEditable(ev)) {
                return false;
            }
            this._setCurrentEvent(ev);
            if (this.currentWindow) {
                this.closeWindow();
            }
            if (this.currentWindow) {
                this.closeWindow();
            }
            if (this.browser.webkit) {
                var tar =Event.getTarget(ev);
                if (this._isElement(tar, 'a') || this._isElement(tar.parentNode, 'a')) {
                    Event.stopEvent(ev);
                    this.nodeChange();
                }
            } else {
                this.nodeChange();
            }
            this.fireEvent('editorClick', { type: 'editorClick', target: this, ev: ev });
        },
        /**
        * @private
        * @method _handleMouseUp
        * @param {Event} ev The event we are working on.
        * @description Handles all mouseup events inside the iFrame document.
        */
        _handleMouseUp: function(ev) {
            var ret = this.fireEvent('beforeEditorMouseUp', { type: 'beforeEditorMouseUp', target: this, ev: ev });
            if (ret === false) {
                return false;
            }
            if (this._isNonEditable(ev)) {
                return false;
            }
            //Don't set current event for mouseup.
            //It get's fired after a menu is closed and gives up a bogus event to work with
            //this._setCurrentEvent(ev);
            var self = this;
            if (this.browser.opera) {
                /*
                * @knownissue Opera appears to stop the MouseDown, Click and DoubleClick events on an image inside of a document with designMode on..
                * @browser Opera
                * @description This work around traps the MouseUp event and sets a timer to check if another MouseUp event fires in so many seconds. If another event is fired, they we internally fire the DoubleClick event.
                */
                var sel = Event.getTarget(ev);
                if (this._isElement(sel, 'img')) {
                    this.nodeChange();
                    if (this.operaEvent) {
                        clearTimeout(this.operaEvent);
                        this.operaEvent = null;
                        this._handleDoubleClick(ev);
                    } else {
                        this.operaEvent = window.setTimeout(function() {
                            self.operaEvent = false;
                        }, 700);
                    }
                }
            }
            //This will stop Safari from selecting the entire document if you select all the text in the editor
            if (this.browser.webkit || this.browser.opera) {
                if (this.browser.webkit) {
                    Event.stopEvent(ev);
                }
            }
            this.nodeChange();
            this.fireEvent('editorMouseUp', { type: 'editorMouseUp', target: this, ev: ev });
        },
        /**
        * @private
        * @method _handleMouseDown
        * @param {Event} ev The event we are working on.
        * @description Handles all mousedown events inside the iFrame document.
        */
        _handleMouseDown: function(ev) {
            var ret = this.fireEvent('beforeEditorMouseDown', { type: 'beforeEditorMouseDown', target: this, ev: ev });
            if (ret === false) {
                return false;
            }
            if (this._isNonEditable(ev)) {
                return false;
            }
            this._setCurrentEvent(ev);
            var sel = Event.getTarget(ev);
            if (this.browser.webkit && this._hasSelection()) {
                var _sel = this._getSelection();
                if (!this.browser.webkit3) {
                    _sel.collapse(true);
                } else {
                    _sel.collapseToStart();
                }
            }
            if (this.browser.webkit && this._lastImage) {
                Dom.removeClass(this._lastImage, 'selected');
                this._lastImage = null;
            }
            if (this._isElement(sel, 'img') || this._isElement(sel, 'a')) {
                if (this.browser.webkit) {
                    Event.stopEvent(ev);
                    if (this._isElement(sel, 'img')) {
                        Dom.addClass(sel, 'selected');
                        this._lastImage = sel;
                    }
                }
                if (this.currentWindow) {
                    this.closeWindow();
                }
                this.nodeChange();
            }
            this.fireEvent('editorMouseDown', { type: 'editorMouseDown', target: this, ev: ev });
        },
        /**
        * @private
        * @method _handleDoubleClick
        * @param {Event} ev The event we are working on.
        * @description Handles all doubleclick events inside the iFrame document.
        */
        _handleDoubleClick: function(ev) {
            var ret = this.fireEvent('beforeEditorDoubleClick', { type: 'beforeEditorDoubleClick', target: this, ev: ev });
            if (ret === false) {
                return false;
            }
            if (this._isNonEditable(ev)) {
                return false;
            }
            this._setCurrentEvent(ev);
            var sel = Event.getTarget(ev);
            if (this._isElement(sel, 'img')) {
                this.currentElement[0] = sel;
                this.toolbar.fireEvent('insertimageClick', { type: 'insertimageClick', target: this.toolbar });
                this.fireEvent('afterExecCommand', { type: 'afterExecCommand', target: this });
            } else if (this._hasParent(sel, 'a')) { //Handle elements inside an a
                this.currentElement[0] = this._hasParent(sel, 'a');
                this.toolbar.fireEvent('createlinkClick', { type: 'createlinkClick', target: this.toolbar });
                this.fireEvent('afterExecCommand', { type: 'afterExecCommand', target: this });
            }
            this.nodeChange();
            this.fireEvent('editorDoubleClick', { type: 'editorDoubleClick', target: this, ev: ev });
        },
        /**
        * @private
        * @method _handleKeyUp
        * @param {Event} ev The event we are working on.
        * @description Handles all keyup events inside the iFrame document.
        */
        _handleKeyUp: function(ev) {
            var ret = this.fireEvent('beforeEditorKeyUp', { type: 'beforeEditorKeyUp', target: this, ev: ev });
            if (ret === false) {
                return false;
            }
            if (this._isNonEditable(ev)) {
                return false;
            }
            this._storeUndo();
            this._setCurrentEvent(ev);
            switch (ev.keyCode) {
                case this._keyMap.SELECT_ALL.key:
                    if (this._checkKey(this._keyMap.SELECT_ALL, ev)) {
                        this.nodeChange();
                    }
                    break;
                case 32: //Space Bar
                case 35: //End
                case 36: //Home
                case 37: //Left Arrow
                case 38: //Up Arrow
                case 39: //Right Arrow
                case 40: //Down Arrow
                case 46: //Forward Delete
                case 8: //Delete
                case this._keyMap.CLOSE_WINDOW.key: //W key if window is open
                    if ((ev.keyCode == this._keyMap.CLOSE_WINDOW.key) && this.currentWindow) {
                        if (this._checkKey(this._keyMap.CLOSE_WINDOW, ev)) {
                            this.closeWindow();
                        }
                    } else {
                        if (!this.browser.ie) {
                            if (this._nodeChangeTimer) {
                                clearTimeout(this._nodeChangeTimer);
                            }
                            var self = this;
                            this._nodeChangeTimer = setTimeout(function() {
                                self._nodeChangeTimer = null;
                                self.nodeChange.call(self);
                            }, 100);
                        } else {
                            this.nodeChange();
                        }
                        this.editorDirty = true;
                    }
                    break;
            }
            this.fireEvent('editorKeyUp', { type: 'editorKeyUp', target: this, ev: ev });
        },
        /**
        * @private
        * @method _handleKeyPress
        * @param {Event} ev The event we are working on.
        * @description Handles all keypress events inside the iFrame document.
        */
        _handleKeyPress: function(ev) {
            var ret = this.fireEvent('beforeEditorKeyPress', { type: 'beforeEditorKeyPress', target: this, ev: ev });
            if (ret === false) {
                return false;
            }

            if (this.get('allowNoEdit')) {
                //if (ev && ev.keyCode && ((ev.keyCode == 46) || ev.keyCode == 63272)) {
                if (ev && ev.keyCode && (ev.keyCode == 63272)) {
                    //Forward delete key
                    Event.stopEvent(ev);
                }
            }
            if (this._isNonEditable(ev)) {
                return false;
            }
            this._setCurrentEvent(ev);
            this._storeUndo();
            if (this.browser.opera) {
                if (ev.keyCode === 13) {
                    var tar = this._getSelectedElement();
                    if (!this._isElement(tar, 'li')) {
                        this.execCommand('inserthtml', '<br>');
                        Event.stopEvent(ev);
                    }
                }
            }
            if (this.browser.webkit) {
                if (!this.browser.webkit3) {
                    if (ev.keyCode && (ev.keyCode == 122) && (ev.metaKey)) {
                        //This is CMD + z (for undo)
                        if (this._hasParent(this._getSelectedElement(), 'li')) {
                            Event.stopEvent(ev);
                        }
                    }
                }
                this._listFix(ev);
            }
            this._fixListDupIds();
            this.fireEvent('editorKeyPress', { type: 'editorKeyPress', target: this, ev: ev });
        },
        /**
        * @private
        * @method _handleKeyDown
        * @param {Event} ev The event we are working on.
        * @description Handles all keydown events inside the iFrame document.
        */
        _handleKeyDown: function(ev) {
            var ret = this.fireEvent('beforeEditorKeyDown', { type: 'beforeEditorKeyDown', target: this, ev: ev });
            if (ret === false) {
                return false;
            }
            var tar = null, _range = null;
            if (this._isNonEditable(ev)) {
                return false;
            }
            this._setCurrentEvent(ev);
            if (this.currentWindow) {
                this.closeWindow();
            }
            if (this.currentWindow) {
                this.closeWindow();
            }
            var doExec = false,
                action = null,
                value = null,
                exec = false;


            switch (ev.keyCode) {
                case this._keyMap.FOCUS_TOOLBAR.key:
                    if (this._checkKey(this._keyMap.FOCUS_TOOLBAR, ev)) {
                        var h = this.toolbar.getElementsByTagName('h2')[0];
                        if (h && h.firstChild) {
                            h.firstChild.focus();
                        }
                    } else if (this._checkKey(this._keyMap.FOCUS_AFTER, ev)) {
                        //Focus After Element - Esc
                        this.afterElement.focus();
                    }
                    Event.stopEvent(ev);
                    doExec = false;
                    break;
                //case 76: //L
                case this._keyMap.CREATE_LINK.key: //L
                    if (this._hasSelection()) {
                        if (this._checkKey(this._keyMap.CREATE_LINK, ev)) {
                            var makeLink = true;
                            if (this.get('limitCommands')) {
                                if (!this.toolbar.getButtonByValue('createlink')) {
                                    makeLink = false;
                                }
                            }
                            if (makeLink) {
                                this.execCommand('createlink', '');
                                this.toolbar.fireEvent('createlinkClick', { type: 'createlinkClick', target: this.toolbar });
                                this.fireEvent('afterExecCommand', { type: 'afterExecCommand', target: this });
                                doExec = false;
                            }
                        }
                    }
                    break;
                //case 90: //Z
                case this._keyMap.UNDO.key:
                case this._keyMap.REDO.key:
                    if (this._checkKey(this._keyMap.REDO, ev)) {
                        action = 'redo';
                        doExec = true;
                    } else if (this._checkKey(this._keyMap.UNDO, ev)) {
                        action = 'undo';
                        doExec = true;
                    }
                    break;
                //case 66: //B
                case this._keyMap.BOLD.key:
                    if (this._checkKey(this._keyMap.BOLD, ev)) {
                        action = 'bold';
                        doExec = true;
                    }
                    break;
                case this._keyMap.FONT_SIZE_UP.key:
                case this._keyMap.FONT_SIZE_DOWN.key:
                    var uk = false, dk = false;
                    if (this._checkKey(this._keyMap.FONT_SIZE_UP, ev)) {
                        uk = true;
                    }
                    if (this._checkKey(this._keyMap.FONT_SIZE_DOWN, ev)) {
                        dk = true;
                    }
                    if (uk || dk) {
                        var fs_button = this.toolbar.getButtonByValue('fontsize'),
                            label = parseInt(fs_button.get('label'), 10),
                            newValue = (label + 1);

                        if (dk) {
                            newValue = (label - 1);
                        }

                        action = 'fontsize';
                        value = newValue + 'px';
                        doExec = true;
                    }
                    break;
                //case 73: //I
                case this._keyMap.ITALIC.key:
                    if (this._checkKey(this._keyMap.ITALIC, ev)) {
                        action = 'italic';
                        doExec = true;
                    }
                    break;
                //case 85: //U
                case this._keyMap.UNDERLINE.key:
                    if (this._checkKey(this._keyMap.UNDERLINE, ev)) {
                        action = 'underline';
                        doExec = true;
                    }
                    break;
                case 9:
                    if (this.browser.ie) {
                        //Insert a tab in Internet Explorer
                        _range = this._getRange();
                        tar = this._getSelectedElement();
                        if (!this._isElement(tar, 'li')) {
                            if (_range) {
                                _range.pasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                                _range.collapse(false);
                                _range.select();
                            }
                            Event.stopEvent(ev);
                        }
                    }
                    //Firefox 3 code
                    if (this.browser.gecko > 1.8) {
                        tar = this._getSelectedElement();
                        if (this._isElement(tar, 'li')) {
                            if (ev.shiftKey) {
                                this._getDoc().execCommand('outdent', null, '');
                            } else {
                                this._getDoc().execCommand('indent', null, '');
                            }
                            
                        } else if (!this._hasSelection()) {
                            this.execCommand('inserthtml', '&nbsp;&nbsp;&nbsp;&nbsp;');
                        }
                        Event.stopEvent(ev);
                    }
                    break;
                case 13:
                    var p = null, i = 0;
                    if (this.get('ptags') && !ev.shiftKey) {
                        if (this.browser.gecko) {
                            tar = this._getSelectedElement();
                            if (!this._hasParent(tar, 'li')) {
                                if (this._hasParent(tar, 'p')) {
                                    p = this._getDoc().createElement('p');
                                    p.innerHTML = '&nbsp;';
                                    Dom.insertAfter(p, tar);
                                    this._selectNode(p.firstChild);
                                } else if (this._isElement(tar, 'body')) {
                                    this.execCommand('insertparagraph', null);
                                    var ps = this._getDoc().body.getElementsByTagName('p');
                                    for (i = 0; i < ps.length; i++) {
                                        if (ps[i].getAttribute('_moz_dirty') !== null) {
                                            p = this._getDoc().createElement('p');
                                            p.innerHTML = '&nbsp;';
                                            Dom.insertAfter(p, ps[i]);
                                            this._selectNode(p.firstChild);
                                            ps[i].removeAttribute('_moz_dirty');
                                        }
                                    }
                                } else {
                                    doExec = true;
                                    action = 'insertparagraph';
                                }
                                Event.stopEvent(ev);
                            }
                        }
                        if (this.browser.webkit) {
                            tar = this._getSelectedElement();
                            if (!this._hasParent(tar, 'li')) {
                                this.execCommand('insertparagraph', null);
                                var divs = this._getDoc().body.getElementsByTagName('div');
                                for (i = 0; i < divs.length; i++) {
                                    if (!Dom.hasClass(divs[i], 'yui-wk-div')) {
                                        Dom.addClass(divs[i], 'yui-wk-p');
                                    }
                                }
                                Event.stopEvent(ev);
                            }
                        }
                    } else {
                        if (this.browser.webkit) {
                            tar = this._getSelectedElement();
                            if (!this._hasParent(tar, 'li')) {
                                if (this.browser.webkit4) {
                                    this.execCommand('insertlinebreak');
                                } else {
                                    this.execCommand('inserthtml', '<var id="yui-br"></var>');
                                    var holder = this._getDoc().getElementById('yui-br'),
                                        br = this._getDoc().createElement('br'),
                                        caret = this._getDoc().createElement('span');

                                    holder.parentNode.replaceChild(br, holder);
                                    caret.className = 'yui-non';
                                    caret.innerHTML = '&nbsp;';
                                    Dom.insertAfter(caret, br);
                                    this._selectNode(caret);
                                }
                                Event.stopEvent(ev);
                            }
                        }
                        if (this.browser.ie) {
                            //Insert a <br> instead of a <p></p> in Internet Explorer
                            _range = this._getRange();
                            tar = this._getSelectedElement();
                            if (!this._isElement(tar, 'li')) {
                                if (_range) {
                                    _range.pasteHTML('<br>');
                                    _range.collapse(false);
                                    _range.select();
                                }
                                Event.stopEvent(ev);
                            }
                        }
                    }
                    break;
            }
            if (this.browser.ie) {
                this._listFix(ev);
            }
            if (doExec && action) {
                this.execCommand(action, value);
                Event.stopEvent(ev);
                this.nodeChange();
            }
            this._storeUndo();
            this.fireEvent('editorKeyDown', { type: 'editorKeyDown', target: this, ev: ev });
        },
        /**
        * @private
        * @property _fixListRunning
        * @type Boolean
        * @description Keeps more than one _fixListDupIds from running at the same time.
        */
        _fixListRunning: null,
        /**
        * @private
        * @method _fixListDupIds
        * @description Some browsers will duplicate the id of an LI when created in designMode.
        * This method will fix the duplicate id issue. However it will only preserve the first element 
        * in the document list with the unique id. 
        */
        _fixListDupIds: function() {
            if (this._fixListRunning) {
                return false;
            }
            if (this._getDoc()) {
                this._fixListRunning = true;
                var lis = this._getDoc().body.getElementsByTagName('li'),
                    i = 0, ids = {};
                for (i = 0; i < lis.length; i++) {
                    if (lis[i].id) {
                        if (ids[lis[i].id]) {
                            lis[i].id = '';
                        }
                        ids[lis[i].id] = true;
                    }
                }
                this._fixListRunning = false;
            }
        },
        /**
        * @private
        * @method _listFix
        * @param {Event} ev The event we are working on.
        * @description Handles the Enter key, Tab Key and Shift + Tab keys for List Items.
        */
        _listFix: function(ev) {
            var testLi = null, par = null, preContent = false, range = null;
            //Enter Key
            if (this.browser.webkit) {
                if (ev.keyCode && (ev.keyCode == 13)) {
                    if (this._hasParent(this._getSelectedElement(), 'li')) {
                        var tar = this._hasParent(this._getSelectedElement(), 'li');
                        if (tar.previousSibling) {
                            if (tar.firstChild && (tar.firstChild.length == 1)) {
                                this._selectNode(tar);
                            }
                        }
                    }
                }
            }
            //Shift + Tab Key
            if (ev.keyCode && ((!this.browser.webkit3 && (ev.keyCode == 25)) || ((this.browser.webkit3 || !this.browser.webkit) && ((ev.keyCode == 9) && ev.shiftKey)))) {
                testLi = this._getSelectedElement();
                if (this._hasParent(testLi, 'li')) {
                    testLi = this._hasParent(testLi, 'li');
                    if (this._hasParent(testLi, 'ul') || this._hasParent(testLi, 'ol')) {
                        par = this._hasParent(testLi, 'ul');
                        if (!par) {
                            par = this._hasParent(testLi, 'ol');
                        }
                        if (this._isElement(par.previousSibling, 'li')) {
                            par.removeChild(testLi);
                            par.parentNode.insertBefore(testLi, par.nextSibling);
                            if (this.browser.ie) {
                                range = this._getDoc().body.createTextRange();
                                range.moveToElementText(testLi);
                                range.collapse(false);
                                range.select();
                            }
                            if (this.browser.webkit) {
                                this._selectNode(testLi.firstChild);
                            }
                            Event.stopEvent(ev);
                        }
                    }
                }
            }
            //Tab Key
            if (ev.keyCode && ((ev.keyCode == 9) && (!ev.shiftKey))) {
                var preLi = this._getSelectedElement();
                if (this._hasParent(preLi, 'li')) {
                    preContent = this._hasParent(preLi, 'li').innerHTML;
                }
                if (this.browser.webkit) {
                    this._getDoc().execCommand('inserttext', false, '\t');
                }
                testLi = this._getSelectedElement();
                if (this._hasParent(testLi, 'li')) {
                    par = this._hasParent(testLi, 'li');
                    var newUl = this._getDoc().createElement(par.parentNode.tagName.toLowerCase());
                    if (this.browser.webkit) {
                        var span = Dom.getElementsByClassName('Apple-tab-span', 'span', par);
                        //Remove the span element that Safari puts in
                        if (span[0]) {
                            par.removeChild(span[0]);
                            par.innerHTML = Lang.trim(par.innerHTML);
                            //Put the HTML from the LI into this new LI
                            if (preContent) {
                                par.innerHTML = '<span class="yui-non">' + preContent + '</span>&nbsp;';
                            } else {
                                par.innerHTML = '<span class="yui-non">&nbsp;</span>&nbsp;';
                            }
                        }
                    } else {
                        if (preContent) {
                            par.innerHTML = preContent + '&nbsp;';
                        } else {
                            par.innerHTML = '&nbsp;';
                        }
                    }

                    par.parentNode.replaceChild(newUl, par);
                    newUl.appendChild(par);
                    if (this.browser.webkit) {
                        this._getSelection().setBaseAndExtent(par.firstChild, 1, par.firstChild, par.firstChild.innerText.length);
                        if (!this.browser.webkit3) {
                            par.parentNode.parentNode.style.display = 'list-item';
                            setTimeout(function() {
                                par.parentNode.parentNode.style.display = 'block';
                            }, 1);
                        }
                    } else if (this.browser.ie) {
                        range = this._getDoc().body.createTextRange();
                        range.moveToElementText(par);
                        range.collapse(false);
                        range.select();
                    } else {
                        this._selectNode(par);
                    }
                    Event.stopEvent(ev);
                }
                if (this.browser.webkit) {
                    Event.stopEvent(ev);
                }
                this.nodeChange();
            }
        },
        /**
        * @method nodeChange
        * @param {Boolean} force Optional paramenter to skip the threshold counter
        * @description Handles setting up the toolbar buttons, getting the Dom path, fixing nodes.
        */
        nodeChange: function(force) {
            var NCself = this;
            this._storeUndo();
            if (this.get('nodeChangeDelay')) {
                this._nodeChangeDelayTimer = window.setTimeout(function() {
                    NCself._nodeChangeDelayTimer = null;
                    NCself._nodeChange.apply(NCself, arguments);
                }, 0);
            } else {
                this._nodeChange();
            }
        },
        /**
        * @private
        * @method _nodeChange
        * @param {Boolean} force Optional paramenter to skip the threshold counter
        * @description Fired from nodeChange in a setTimeout.
        */
        _nodeChange: function(force) {
            var threshold = parseInt(this.get('nodeChangeThreshold'), 10),
                thisNodeChange = Math.round(new Date().getTime() / 1000),
                self = this;

            if (force === true) {
                this._lastNodeChange = 0;
            }
            
            if ((this._lastNodeChange + threshold) < thisNodeChange) {
                if (this._fixNodesTimer === null) {
                    this._fixNodesTimer = window.setTimeout(function() {
                        self._fixNodes.call(self);
                        self._fixNodesTimer = null;
                    }, 0);
                }
            }
            this._lastNodeChange = thisNodeChange;
            if (this.currentEvent) {
                try {
                    this._lastNodeChangeEvent = this.currentEvent.type;
                } catch (e) {}
            }

            var beforeNodeChange = this.fireEvent('beforeNodeChange', { type: 'beforeNodeChange', target: this });
            if (beforeNodeChange === false) {
                return false;
            }
            if (this.get('dompath')) {
                window.setTimeout(function() {
                    self._writeDomPath.call(self);
                }, 0);
            }
            //Check to see if we are disabled before continuing
            if (!this.get('disabled')) {
                if (this.STOP_NODE_CHANGE) {
                    //Reset this var for next action
                    this.STOP_NODE_CHANGE = false;
                    return false;
                } else {
                    var sel = this._getSelection(),
                        range = this._getRange(),
                        el = this._getSelectedElement(),
                        fn_button = this.toolbar.getButtonByValue('fontname'),
                        fs_button = this.toolbar.getButtonByValue('fontsize'),
                        undo_button = this.toolbar.getButtonByValue('undo'),
                        redo_button = this.toolbar.getButtonByValue('redo');

                    //Handle updating the toolbar with active buttons
                    var _ex = {};
                    if (this._lastButton) {
                        _ex[this._lastButton.id] = true;
                        //this._lastButton = null;
                    }
                    if (!this._isElement(el, 'body')) {
                        if (fn_button) {
                            _ex[fn_button.get('id')] = true;
                        }
                        if (fs_button) {
                            _ex[fs_button.get('id')] = true;
                        }
                    }
                    if (redo_button) {
                        delete _ex[redo_button.get('id')];
                    }
                    this.toolbar.resetAllButtons(_ex);

                    //Handle disabled buttons
                    for (var d = 0; d < this._disabled.length; d++) {
                        var _button = this.toolbar.getButtonByValue(this._disabled[d]);
                        if (_button && _button.get) {
                            if (this._lastButton && (_button.get('id') === this._lastButton.id)) {
                                //Skip
                            } else {
                                if (!this._hasSelection() && !this.get('insert')) {
                                    switch (this._disabled[d]) {
                                        case 'fontname':
                                        case 'fontsize':
                                            break;
                                        default:
                                            //No Selection - disable
                                            this.toolbar.disableButton(_button);
                                    }
                                } else {
                                    if (!this._alwaysDisabled[this._disabled[d]]) {
                                        this.toolbar.enableButton(_button);
                                    }
                                }
                                if (!this._alwaysEnabled[this._disabled[d]]) {
                                    this.toolbar.deselectButton(_button);
                                }
                            }
                        }
                    }
                    var path = this._getDomPath();
                    var tag = null, cmd = null;
                    for (var i = 0; i < path.length; i++) {
                        tag = path[i].tagName.toLowerCase();
                        if (path[i].getAttribute('tag')) {
                            tag = path[i].getAttribute('tag').toLowerCase();
                        }
                        cmd = this._tag2cmd[tag];
                        if (cmd === undefined) {
                            cmd = [];
                        }
                        if (!Lang.isArray(cmd)) {
                            cmd = [cmd];
                        }

                        //Bold and Italic styles
                        if (path[i].style.fontWeight.toLowerCase() == 'bold') {
                            cmd[cmd.length] = 'bold';
                        }
                        if (path[i].style.fontStyle.toLowerCase() == 'italic') {
                            cmd[cmd.length] = 'italic';
                        }
                        if (path[i].style.textDecoration.toLowerCase() == 'underline') {
                            cmd[cmd.length] = 'underline';
                        }
                        if (path[i].style.textDecoration.toLowerCase() == 'line-through') {
                            cmd[cmd.length] = 'strikethrough';
                        }
                        if (cmd.length > 0) {
                            for (var j = 0; j < cmd.length; j++) {
                                this.toolbar.selectButton(cmd[j]);
                                this.toolbar.enableButton(cmd[j]);
                            }
                        }
                        //Handle Alignment
                        switch (path[i].style.textAlign.toLowerCase()) {
                            case 'left':
                            case 'right':
                            case 'center':
                            case 'justify':
                                var alignType = path[i].style.textAlign.toLowerCase();
                                if (path[i].style.textAlign.toLowerCase() == 'justify') {
                                    alignType = 'full';
                                }
                                this.toolbar.selectButton('justify' + alignType);
                                this.toolbar.enableButton('justify' + alignType);
                                break;
                        }
                    }
                    //After for loop

                    //Reset Font Family and Size to the inital configs
                    if (fn_button) {
                        var family = fn_button._configs.label._initialConfig.value;
                        fn_button.set('label', '<span class="yui-toolbar-fontname-' + this._cleanClassName(family) + '">' + family + '</span>');
                        this._updateMenuChecked('fontname', family);
                    }

                    if (fs_button) {
                        fs_button.set('label', fs_button._configs.label._initialConfig.value);
                    }

                    var hd_button = this.toolbar.getButtonByValue('heading');
                    if (hd_button) {
                        hd_button.set('label', hd_button._configs.label._initialConfig.value);
                        this._updateMenuChecked('heading', 'none');
                    }
                    var img_button = this.toolbar.getButtonByValue('insertimage');
                    if (img_button && this.currentWindow && (this.currentWindow.name == 'insertimage')) {
                        this.toolbar.disableButton(img_button);
                    }
                    if (this._lastButton && this._lastButton.isSelected) {
                        this.toolbar.deselectButton(this._lastButton.id);
                    }
                    this._undoNodeChange();
                }
            }

            this.fireEvent('afterNodeChange', { type: 'afterNodeChange', target: this });
        },
        /**
        * @private
        * @method _updateMenuChecked
        * @param {Object} button The command identifier of the button you want to check
        * @param {String} value The value of the menu item you want to check
        * @param {<a href="YAHOO.widget.Toolbar.html">YAHOO.widget.Toolbar</a>} The Toolbar instance the button belongs to (defaults to this.toolbar) 
        * @description Gets the menu from a button instance, if the menu is not rendered it will render it. It will then search the menu for the specified value, unchecking all other items and checking the specified on.
        */
        _updateMenuChecked: function(button, value, tbar) {
            if (!tbar) {
                tbar = this.toolbar;
            }
            var _button = tbar.getButtonByValue(button);
            _button.checkValue(value);
        },
        /**
        * @private
        * @method _handleToolbarClick
        * @param {Event} ev The event that triggered the button click
        * @description This is an event handler attached to the Toolbar's buttonClick event. It will fire execCommand with the command identifier from the Toolbar Button.
        */
        _handleToolbarClick: function(ev) {
            var value = '';
            var str = '';
            var cmd = ev.button.value;
            if (ev.button.menucmd) {
                value = cmd;
                cmd = ev.button.menucmd;
            }
            this._lastButton = ev.button;
            if (this.STOP_EXEC_COMMAND) {
                this.STOP_EXEC_COMMAND = false;
                return false;
            } else {
                this.execCommand(cmd, value);
                if (!this.browser.webkit) {
                     var Fself = this;
                     setTimeout(function() {
                         Fself.focus.call(Fself);
                     }, 5);
                 }
            }
            Event.stopEvent(ev);
        },
        /**
        * @private
        * @method _setupAfterElement
        * @description Creates the accessibility h2 header and places it after the iframe in the Dom for navigation.
        */
        _setupAfterElement: function() {
            if (!this.beforeElement) {
                this.beforeElement = document.createElement('h2');
                this.beforeElement.className = 'yui-editor-skipheader';
                this.beforeElement.tabIndex = '-1';
                this.beforeElement.innerHTML = this.STR_BEFORE_EDITOR;
                this.get('element_cont').get('firstChild').insertBefore(this.beforeElement, this.toolbar.get('nextSibling'));
            }
            if (!this.afterElement) {
                this.afterElement = document.createElement('h2');
                this.afterElement.className = 'yui-editor-skipheader';
                this.afterElement.tabIndex = '-1';
                this.afterElement.innerHTML = this.STR_LEAVE_EDITOR;
                this.get('element_cont').get('firstChild').appendChild(this.afterElement);
            }
        },
        /**
        * @private
        * @method _disableEditor
        * @param {Boolean} disabled Pass true to disable, false to enable
        * @description Creates a mask to place over the Editor.
        */
        _disableEditor: function(disabled) {
            var iframe, par, html, height;
            if (!this.get('disabled_iframe')) {
                iframe = this._createIframe();
                iframe.set('id', 'disabled_' + this.get('iframe').get('id'));
                iframe.setStyle('height', '100%');
                iframe.setStyle('display', 'none');
                iframe.setStyle('visibility', 'visible');
                this.set('disabled_iframe', iframe);
                par = this.get('iframe').get('parentNode');
                par.appendChild(iframe.get('element'));
            }
            if (!iframe) {
                iframe = this.get('disabled_iframe');
            }
            if (disabled) {
                this._orgIframe = this.get('iframe');

                if (this.toolbar) {
                    this.toolbar.set('disabled', true);
                }

                html = this.getEditorHTML();
                height = this.get('iframe').get('offsetHeight');
                iframe.setStyle('visibility', '');
                iframe.setStyle('position', '');
                iframe.setStyle('top', '');
                iframe.setStyle('left', '');
                this._orgIframe.setStyle('visibility', 'hidden');
                this._orgIframe.setStyle('position', 'absolute');
                this._orgIframe.setStyle('top', '-99999px');
                this._orgIframe.setStyle('left', '-99999px');
                this.set('iframe', iframe);
                this._setInitialContent(true);
                
                if (!this._mask) {
                    this._mask = document.createElement('DIV');
                    Dom.addClass(this._mask, 'yui-editor-masked');
                    if (this.browser.ie) {
                        this._mask.style.height = height + 'px';
                    }
                    this.get('iframe').get('parentNode').appendChild(this._mask);
                }
                this.on('editorContentReloaded', function() {
                    this._getDoc().body._rteLoaded = false;
                    this.setEditorHTML(html);
                    iframe.setStyle('display', 'block');
                    this.unsubscribeAll('editorContentReloaded');
                });
            } else {
                if (this._mask) {
                    this._mask.parentNode.removeChild(this._mask);
                    this._mask = null;
                    if (this.toolbar) {
                        this.toolbar.set('disabled', false);
                    }
                    iframe.setStyle('visibility', 'hidden');
                    iframe.setStyle('position', 'absolute');
                    iframe.setStyle('top', '-99999px');
                    iframe.setStyle('left', '-99999px');
                    this._orgIframe.setStyle('visibility', '');
                    this._orgIframe.setStyle('position', '');
                    this._orgIframe.setStyle('top', '');
                    this._orgIframe.setStyle('left', '');
                    this.set('iframe', this._orgIframe);

                    this.focus();
                    var self = this;
                    window.setTimeout(function() {
                        self.nodeChange.call(self);
                    }, 100);
                }
            }
        },
        /**
        * @property SEP_DOMPATH
        * @description The value to place in between the Dom path items
        * @type String
        */
        SEP_DOMPATH: '<',
        /**
        * @property STR_LEAVE_EDITOR
        * @description The accessibility string for the element after the iFrame
        * @type String
        */
        STR_LEAVE_EDITOR: 'You have left the Rich Text Editor.',
        /**
        * @property STR_BEFORE_EDITOR
        * @description The accessibility string for the element before the iFrame
        * @type String
        */
        STR_BEFORE_EDITOR: 'This text field can contain stylized text and graphics. To cycle through all formatting options, use the keyboard shortcut Shift + Escape to place focus on the toolbar and navigate between options with your arrow keys. To exit this text editor use the Escape key and continue tabbing. <h4>Common formatting keyboard shortcuts:</h4><ul><li>Control Shift B sets text to bold</li> <li>Control Shift I sets text to italic</li> <li>Control Shift U underlines text</li> <li>Control Shift L adds an HTML link</li></ul>',
        /**
        * @property STR_TITLE
        * @description The Title of the HTML document that is created in the iFrame
        * @type String
        */
        STR_TITLE: 'Rich Text Area.',
        /**
        * @property STR_IMAGE_HERE
        * @description The text to place in the URL textbox when using the blankimage.
        * @type String
        */
        STR_IMAGE_HERE: 'Image URL Here',
        /**
        * @property STR_IMAGE_URL
        * @description The label string for Image URL
        * @type String
        */
        STR_IMAGE_URL: 'Image URL',        
        /**
        * @property STR_LINK_URL
        * @description The label string for the Link URL.
        * @type String
        */
        STR_LINK_URL: 'Link URL',
        /**
        * @protected
        * @property STOP_EXEC_COMMAND
        * @description Set to true when you want the default execCommand function to not process anything
        * @type Boolean
        */
        STOP_EXEC_COMMAND: false,
        /**
        * @protected
        * @property STOP_NODE_CHANGE
        * @description Set to true when you want the default nodeChange function to not process anything
        * @type Boolean
        */
        STOP_NODE_CHANGE: false,
        /**
        * @protected
        * @property CLASS_NOEDIT
        * @description CSS class applied to elements that are not editable.
        * @type String
        */
        CLASS_NOEDIT: 'yui-noedit',
        /**
        * @protected
        * @property CLASS_CONTAINER
        * @description Default CSS class to apply to the editors container element
        * @type String
        */
        CLASS_CONTAINER: 'yui-editor-container',
        /**
        * @protected
        * @property CLASS_EDITABLE
        * @description Default CSS class to apply to the editors iframe element
        * @type String
        */
        CLASS_EDITABLE: 'yui-editor-editable',
        /**
        * @protected
        * @property CLASS_EDITABLE_CONT
        * @description Default CSS class to apply to the editors iframe's parent element
        * @type String
        */
        CLASS_EDITABLE_CONT: 'yui-editor-editable-container',
        /**
        * @protected
        * @property CLASS_PREFIX
        * @description Default prefix for dynamically created class names
        * @type String
        */
        CLASS_PREFIX: 'yui-editor',
        /** 
        * @property browser
        * @description Standard browser detection
        * @type Object
        */
        browser: function() {
            var br = YAHOO.env.ua;
            //Check for webkit3
            if (br.webkit >= 420) {
                br.webkit3 = br.webkit;
            } else {
                br.webkit3 = 0;
            }
            if (br.webkit >= 530) {
                br.webkit4 = br.webkit;
            } else {
                br.webkit4 = 0;
            }
            br.mac = false;
            //Check for Mac
            if (navigator.userAgent.indexOf('Macintosh') !== -1) {
                br.mac = true;
            }

            return br;
        }(),
        /** 
        * @method init
        * @description The Editor class' initialization method
        */
        init: function(p_oElement, p_oAttributes) {

            if (!this._defaultToolbar) {
                this._defaultToolbar = {
                    collapse: true,
                    titlebar: 'Text Editing Tools',
                    draggable: false,
                    buttons: [
                        { group: 'fontstyle', label: 'Font Name and Size',
                            buttons: [
                                { type: 'select', label: 'Arial', value: 'fontname', disabled: true,
                                    menu: [
                                        { text: 'Arial', checked: true },
                                        { text: 'Arial Black' },
                                        { text: 'Comic Sans MS' },
                                        { text: 'Courier New' },
                                        { text: 'Lucida Console' },
                                        { text: 'Tahoma' },
                                        { text: 'Times New Roman' },
                                        { text: 'Trebuchet MS' },
                                        { text: 'Verdana' }
                                    ]
                                },
                                { type: 'spin', label: '13', value: 'fontsize', range: [ 9, 75 ], disabled: true }
                            ]
                        },
                        { type: 'separator' },
                        { group: 'textstyle', label: 'Font Style',
                            buttons: [
                                { type: 'push', label: 'Bold CTRL + SHIFT + B', value: 'bold' },
                                { type: 'push', label: 'Italic CTRL + SHIFT + I', value: 'italic' },
                                { type: 'push', label: 'Underline CTRL + SHIFT + U', value: 'underline' },
                                { type: 'push', label: 'Strike Through', value: 'strikethrough' },
                                { type: 'separator' },
                                { type: 'color', label: 'Font Color', value: 'forecolor', disabled: true },
                                { type: 'color', label: 'Background Color', value: 'backcolor', disabled: true }
                                
                            ]
                        },
                        { type: 'separator' },
                        { group: 'indentlist', label: 'Lists',
                            buttons: [
                                { type: 'push', label: 'Create an Unordered List', value: 'insertunorderedlist' },
                                { type: 'push', label: 'Create an Ordered List', value: 'insertorderedlist' }
                            ]
                        },
                        { type: 'separator' },
                        { group: 'insertitem', label: 'Insert Item',
                            buttons: [
                                { type: 'push', label: 'HTML Link CTRL + SHIFT + L', value: 'createlink', disabled: true },
                                { type: 'push', label: 'Insert Image', value: 'insertimage' }
                            ]
                        }
                    ]
                };
            }

            YAHOO.widget.SimpleEditor.superclass.init.call(this, p_oElement, p_oAttributes);
            YAHOO.widget.EditorInfo._instances[this.get('id')] = this;


            this.currentElement = [];
            this.on('contentReady', function() {
                this.DOMReady = true;
                this.fireQueue();
            }, this, true);

        },
        /**
        * @method initAttributes
        * @description Initializes all of the configuration attributes used to create 
        * the editor.
        * @param {Object} attr Object literal specifying a set of 
        * configuration attributes used to create the editor.
        */
        initAttributes: function(attr) {
            YAHOO.widget.SimpleEditor.superclass.initAttributes.call(this, attr);
            var self = this;

            /**
            * @config setDesignMode
            * @description Should the Editor set designMode on the document. Default: true.
            * @default true
            * @type Boolean
            */
            this.setAttributeConfig('setDesignMode', {
                value: ((attr.setDesignMode === false) ? false : true)
            });
            /**
            * @config nodeChangeDelay
            * @description Do we wrap the nodeChange method in a timeout for performance. Default: true.
            * @default true
            * @type Boolean
            */
            this.setAttributeConfig('nodeChangeDelay', {
                value: ((attr.nodeChangeDelay === false) ? false : true)
            });
            /**
            * @config maxUndo
            * @description The max number of undo levels to store.
            * @default 30
            * @type Number
            */
            this.setAttributeConfig('maxUndo', {
                writeOnce: true,
                value: attr.maxUndo || 30
            });

            /**
            * @config ptags
            * @description If true, the editor uses &lt;P&gt; tags instead of &lt;br&gt; tags. (Use Shift + Enter to get a &lt;br&gt;)
            * @default false
            * @type Boolean
            */
            this.setAttributeConfig('ptags', {
                writeOnce: true,
                value: attr.ptags || false
            });
            /**
            * @config insert
            * @description If true, selection is not required for: fontname, fontsize, forecolor, backcolor.
            * @default false
            * @type Boolean
            */
            this.setAttributeConfig('insert', {
                writeOnce: true,
                value: attr.insert || false,
                method: function(insert) {
                    if (insert) {
                        var buttons = {
                            fontname: true,
                            fontsize: true,
                            forecolor: true,
                            backcolor: true
                        };
                        var tmp = this._defaultToolbar.buttons;
                        for (var i = 0; i < tmp.length; i++) {
                            if (tmp[i].buttons) {
                                for (var a = 0; a < tmp[i].buttons.length; a++) {
                                    if (tmp[i].buttons[a].value) {
                                        if (buttons[tmp[i].buttons[a].value]) {
                                            delete tmp[i].buttons[a].disabled;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            /**
            * @config container
            * @description Used when dynamically creating the Editor from Javascript with no default textarea.
            * We will create one and place it in this container. If no container is passed we will append to document.body.
            * @default false
            * @type HTMLElement
            */
            this.setAttributeConfig('container', {
                writeOnce: true,
                value: attr.container || false
            });
            /**
            * @config plainText
            * @description Process the inital textarea data as if it was plain text. Accounting for spaces, tabs and line feeds.
            * @default false
            * @type Boolean
            */
            this.setAttributeConfig('plainText', {
                writeOnce: true,
                value: attr.plainText || false
            });
            /**
            * @private
            * @config iframe
            * @description Internal config for holding the iframe element.
            * @default null
            * @type HTMLElement
            */
            this.setAttributeConfig('iframe', {
                value: null
            });
            /**
            * @private
            * @config disabled_iframe
            * @description Internal config for holding the iframe element used when disabling the Editor.
            * @default null
            * @type HTMLElement
            */
            this.setAttributeConfig('disabled_iframe', {
                value: null
            });
            /**
            * @private
            * @depreciated - No longer used, should use this.get('element')
            * @config textarea
            * @description Internal config for holding the textarea element (replaced with element).
            * @default null
            * @type HTMLElement
            */
            this.setAttributeConfig('textarea', {
                value: null,
                writeOnce: true
            });
            /**
            * @config nodeChangeThreshold
            * @description The number of seconds that need to be in between nodeChange processing
            * @default 3
            * @type Number
            */            
            this.setAttributeConfig('nodeChangeThreshold', {
                value: attr.nodeChangeThreshold || 3,
                validator: YAHOO.lang.isNumber
            });
            /**
            * @config allowNoEdit
            * @description Should the editor check for non-edit fields. It should be noted that this technique is not perfect. If the user does the right things, they will still be able to make changes.
            * Such as highlighting an element below and above the content and hitting a toolbar button or a shortcut key.
            * @default false
            * @type Boolean
            */            
            this.setAttributeConfig('allowNoEdit', {
                value: attr.allowNoEdit || false,
                validator: YAHOO.lang.isBoolean
            });
            /**
            * @config limitCommands
            * @description Should the Editor limit the allowed execCommands to the ones available in the toolbar. If true, then execCommand and keyboard shortcuts will fail if they are not defined in the toolbar.
            * @default false
            * @type Boolean
            */            
            this.setAttributeConfig('limitCommands', {
                value: attr.limitCommands || false,
                validator: YAHOO.lang.isBoolean
            });
            /**
            * @config element_cont
            * @description Internal config for the editors container
            * @default false
            * @type HTMLElement
            */
            this.setAttributeConfig('element_cont', {
                value: attr.element_cont
            });
            /**
            * @private
            * @config editor_wrapper
            * @description The outter wrapper for the entire editor.
            * @default null
            * @type HTMLElement
            */
            this.setAttributeConfig('editor_wrapper', {
                value: attr.editor_wrapper || null,
                writeOnce: true
            });
            /**
            * @attribute height
            * @description The height of the editor iframe container, not including the toolbar..
            * @default Best guessed size of the textarea, for best results use CSS to style the height of the textarea or pass it in as an argument
            * @type String
            */
            this.setAttributeConfig('height', {
                value: attr.height || Dom.getStyle(self.get('element'), 'height'),
                method: function(height) {
                    if (this._rendered) {
                        //We have been rendered, change the height
                        if (this.get('animate')) {
                            var anim = new YAHOO.util.Anim(this.get('iframe').get('parentNode'), {
                                height: {
                                    to: parseInt(height, 10)
                                }
                            }, 0.5);
                            anim.animate();
                        } else {
                            Dom.setStyle(this.get('iframe').get('parentNode'), 'height', height);
                        }
                    }
                }
            });
            /**
            * @config autoHeight
            * @description Remove the scrollbars from the edit area and resize it to fit the content. It will not go any lower than the current config height.
            * @default false
            * @type Boolean || Number
            */
            this.setAttributeConfig('autoHeight', {
                value: attr.autoHeight || false,
                method: function(a) {
                    if (a) {
                        if (this.get('iframe')) {
                            this.get('iframe').get('element').setAttribute('scrolling', 'no');
                        }
                        this.on('afterNodeChange', this._handleAutoHeight, this, true);
                        this.on('editorKeyDown', this._handleAutoHeight, this, true);
                        this.on('editorKeyPress', this._handleAutoHeight, this, true);
                    } else {
                        if (this.get('iframe')) {
                            this.get('iframe').get('element').setAttribute('scrolling', 'auto');
                        }
                        this.unsubscribe('afterNodeChange', this._handleAutoHeight);
                        this.unsubscribe('editorKeyDown', this._handleAutoHeight);
                        this.unsubscribe('editorKeyPress', this._handleAutoHeight);
                    }
                }
            });
            /**
            * @attribute width
            * @description The width of the editor container.
            * @default Best guessed size of the textarea, for best results use CSS to style the width of the textarea or pass it in as an argument
            * @type String
            */            
            this.setAttributeConfig('width', {
                value: attr.width || Dom.getStyle(this.get('element'), 'width'),
                method: function(width) {
                    if (this._rendered) {
                        //We have been rendered, change the width
                        if (this.get('animate')) {
                            var anim = new YAHOO.util.Anim(this.get('element_cont').get('element'), {
                                width: {
                                    to: parseInt(width, 10)
                                }
                            }, 0.5);
                            anim.animate();
                        } else {
                            this.get('element_cont').setStyle('width', width);
                        }
                    }
                }
            });
                        
            /**
            * @attribute blankimage
            * @description The URL for the image placeholder to put in when inserting an image.
            * @default The yahooapis.com address for the current release + 'assets/blankimage.png'
            * @type String
            */            
            this.setAttributeConfig('blankimage', {
                value: attr.blankimage || this._getBlankImage()
            });
            /**
            * @attribute css
            * @description The Base CSS used to format the content of the editor
            * @default <code><pre>html {
                height: 95%;
            }
            body {
                height: 100%;
                padding: 7px; background-color: #fff; font:13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small;
            }
            a {
                color: blue;
                text-decoration: underline;
                cursor: pointer;
            }
            .warning-localfile {
                border-bottom: 1px dashed red !important;
            }
            .yui-busy {
                cursor: wait !important;
            }
            img.selected { //Safari image selection
                border: 2px dotted #808080;
            }
            img {
                cursor: pointer !important;
                border: none;
            }
            </pre></code>
            * @type String
            */            
            this.setAttributeConfig('css', {
                value: attr.css || this._defaultCSS,
                writeOnce: true
            });
            /**
            * @attribute html
            * @description The default HTML to be written to the iframe document before the contents are loaded (Note that the DOCTYPE attr will be added at render item)
            * @default This HTML requires a few things if you are to override:
                <p><code>{TITLE}, {CSS}, {HIDDEN_CSS}, {EXTRA_CSS}</code> and <code>{CONTENT}</code> need to be there, they are passed to YAHOO.lang.substitute to be replace with other strings.<p>
                <p><code>onload="document.body._rteLoaded = true;"</code> : the onload statement must be there or the editor will not finish loading.</p>
                <code>
                <pre>
                &lt;html&gt;
                    &lt;head&gt;
                        &lt;title&gt;{TITLE}&lt;/title&gt;
                        &lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
                        &lt;style&gt;
                        {CSS}
                        &lt;/style&gt;
                        &lt;style&gt;
                        {HIDDEN_CSS}
                        &lt;/style&gt;
                        &lt;style&gt;
                        {EXTRA_CSS}
                        &lt;/style&gt;
                    &lt;/head&gt;
                &lt;body onload="document.body._rteLoaded = true;"&gt;
                {CONTENT}
                &lt;/body&gt;
                &lt;/html&gt;
                </pre>
                </code>
            * @type String
            */            
            this.setAttributeConfig('html', {
                value: attr.html || '<html><head><title>{TITLE}</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><base href="' + this._baseHREF + '"><style>{CSS}</style><style>{HIDDEN_CSS}</style><style>{EXTRA_CSS}</style></head><body onload="document.body._rteLoaded = true;">{CONTENT}</body></html>',
                writeOnce: true
            });

            /**
            * @attribute extracss
            * @description Extra user defined css to load after the default SimpleEditor CSS
            * @default ''
            * @type String
            */            
            this.setAttributeConfig('extracss', {
                value: attr.extracss || '',
                writeOnce: true
            });

            /**
            * @attribute handleSubmit
            * @description Config handles if the editor will attach itself to the textareas parent form's submit handler.
            If it is set to true, the editor will attempt to attach a submit listener to the textareas parent form.
            Then it will trigger the editors save handler and place the new content back into the text area before the form is submitted.
            * @default false
            * @type Boolean
            */            
            this.setAttributeConfig('handleSubmit', {
                value: attr.handleSubmit || false,
                method: function(exec) {
                    if (this.get('element').form) {
                        if (!this._formButtons) {
                            this._formButtons = [];
                        }
                        if (exec) {
                            Event.on(this.get('element').form, 'submit', this._handleFormSubmit, this, true);
                            var i = this.get('element').form.getElementsByTagName('input');
                            for (var s = 0; s < i.length; s++) {
                                var type = i[s].getAttribute('type');
                                if (type && (type.toLowerCase() == 'submit')) {
                                    Event.on(i[s], 'click', this._handleFormButtonClick, this, true);
                                    this._formButtons[this._formButtons.length] = i[s];
                                }
                            }
                        } else {
                            Event.removeListener(this.get('element').form, 'submit', this._handleFormSubmit);
                            if (this._formButtons) {
                                Event.removeListener(this._formButtons, 'click', this._handleFormButtonClick);
                            }
                        }
                    }
                }
            });
            /**
            * @attribute disabled
            * @description This will toggle the editor's disabled state. When the editor is disabled, designMode is turned off and a mask is placed over the iframe so no interaction can take place.
            All Toolbar buttons are also disabled so they cannot be used.
            * @default false
            * @type Boolean
            */

            this.setAttributeConfig('disabled', {
                value: false,
                method: function(disabled) {
                    if (this._rendered) {
                        this._disableEditor(disabled);
                    }
                }
            });
            /**
            * @config saveEl
            * @description When save HTML is called, this element will be updated as well as the source of data.
            * @default element
            * @type HTMLElement
            */
            this.setAttributeConfig('saveEl', {
                value: this.get('element')
            });
            /**
            * @config toolbar_cont
            * @description Internal config for the toolbars container
            * @default false
            * @type Boolean
            */
            this.setAttributeConfig('toolbar_cont', {
                value: null,
                writeOnce: true
            });
            /**
            * @attribute toolbar
            * @description The default toolbar config.
            * @type Object
            */            
            this.setAttributeConfig('toolbar', {
                value: attr.toolbar || this._defaultToolbar,
                writeOnce: true,
                method: function(toolbar) {
                    if (!toolbar.buttonType) {
                        toolbar.buttonType = this._defaultToolbar.buttonType;
                    }
                    this._defaultToolbar = toolbar;
                }
            });
            /**
            * @attribute animate
            * @description Should the editor animate window movements
            * @default false unless Animation is found, then true
            * @type Boolean
            */            
            this.setAttributeConfig('animate', {
                value: ((attr.animate) ? ((YAHOO.util.Anim) ? true : false) : false),
                validator: function(value) {
                    var ret = true;
                    if (!YAHOO.util.Anim) {
                        ret = false;
                    }
                    return ret;
                }
            });
            /**
            * @config panel
            * @description A reference to the panel we are using for windows.
            * @default false
            * @type Boolean
            */            
            this.setAttributeConfig('panel', {
                value: null,
                writeOnce: true,
                validator: function(value) {
                    var ret = true;
                    if (!YAHOO.widget.Overlay) {
                        ret = false;
                    }
                    return ret;
                }               
            });
            /**
            * @attribute focusAtStart
            * @description Should we focus the window when the content is ready?
            * @default false
            * @type Boolean
            */            
            this.setAttributeConfig('focusAtStart', {
                value: attr.focusAtStart || false,
                writeOnce: true,
                method: function(fs) {
                    if (fs) {
                        this.on('editorContentLoaded', function() {
                            var self = this;
                            setTimeout(function() {
                                self.focus.call(self);
                                self.editorDirty = false;
                            }, 400);
                        }, this, true);
                    }
                }
            });
            /**
            * @attribute dompath
            * @description Toggle the display of the current Dom path below the editor
            * @default false
            * @type Boolean
            */            
            this.setAttributeConfig('dompath', {
                value: attr.dompath || false,
                method: function(dompath) {
                    if (dompath && !this.dompath) {
                        this.dompath = document.createElement('DIV');
                        this.dompath.id = this.get('id') + '_dompath';
                        Dom.addClass(this.dompath, 'dompath');
                        this.get('element_cont').get('firstChild').appendChild(this.dompath);
                        if (this.get('iframe')) {
                            this._writeDomPath();
                        }
                    } else if (!dompath && this.dompath) {
                        this.dompath.parentNode.removeChild(this.dompath);
                        this.dompath = null;
                    }
                }
            });
            /**
            * @attribute markup
            * @description Should we try to adjust the markup for the following types: semantic, css, default or xhtml
            * @default "semantic"
            * @type String
            */            
            this.setAttributeConfig('markup', {
                value: attr.markup || 'semantic',
                validator: function(markup) {
                    switch (markup.toLowerCase()) {
                        case 'semantic':
                        case 'css':
                        case 'default':
                        case 'xhtml':
                        return true;
                    }
                    return false;
                }
            });
            /**
            * @attribute removeLineBreaks
            * @description Should we remove linebreaks and extra spaces on cleanup
            * @default false
            * @type Boolean
            */            
            this.setAttributeConfig('removeLineBreaks', {
                value: attr.removeLineBreaks || false,
                validator: YAHOO.lang.isBoolean
            });
            
            /**
            * @config drag
            * @description Set this config to make the Editor draggable, pass 'proxy' to make use YAHOO.util.DDProxy.
            * @type {Boolean/String}
            */
            this.setAttributeConfig('drag', {
                writeOnce: true,
                value: attr.drag || false
            });

            /**
            * @config resize
            * @description Set this to true to make the Editor Resizable with YAHOO.util.Resize. The default config is available: myEditor._resizeConfig
            * Animation will be ignored while performing this resize to allow for the dynamic change in size of the toolbar.
            * @type Boolean
            */
            this.setAttributeConfig('resize', {
                writeOnce: true,
                value: attr.resize || false
            });

            /**
            * @config filterWord
            * @description Attempt to filter out MS Word HTML from the Editor's output.
            * @type Boolean
            */
            this.setAttributeConfig('filterWord', {
                value: attr.filterWord || false,
                validator: YAHOO.lang.isBoolean
            });

        },
        /**
        * @private
        * @method _getBlankImage
        * @description Retrieves the full url of the image to use as the blank image.
        * @return {String} The URL to the blank image
        */
        _getBlankImage: function() {
            if (!this.DOMReady) {
                this._queue[this._queue.length] = ['_getBlankImage', arguments];
                return '';
            }
            var img = '';
            if (!this._blankImageLoaded) {
                if (YAHOO.widget.EditorInfo.blankImage) {
                    this.set('blankimage', YAHOO.widget.EditorInfo.blankImage);
                    this._blankImageLoaded = true;
                } else {
                    var div = document.createElement('div');
                    div.style.position = 'absolute';
                    div.style.top = '-9999px';
                    div.style.left = '-9999px';
                    div.className = this.CLASS_PREFIX + '-blankimage';
                    document.body.appendChild(div);
                    img = YAHOO.util.Dom.getStyle(div, 'background-image');
                    img = img.replace('url(', '').replace(')', '').replace(/"/g, '');
                    //Adobe AIR Code
                    img = img.replace('app:/', '');             
                    this.set('blankimage', img);
                    this._blankImageLoaded = true;
                    div.parentNode.removeChild(div);
                    YAHOO.widget.EditorInfo.blankImage = img;
                }
            } else {
                img = this.get('blankimage');
            }
            return img;
        },
        /**
        * @private
        * @method _handleAutoHeight
        * @description Handles resizing the editor's height based on the content
        */
        _handleAutoHeight: function() {
            var doc = this._getDoc(),
                body = doc.body,
                docEl = doc.documentElement;

            var height = parseInt(Dom.getStyle(this.get('editor_wrapper'), 'height'), 10);
            var newHeight = body.scrollHeight;
            if (this.browser.webkit) {
                newHeight = docEl.scrollHeight;
            }
            if (newHeight < parseInt(this.get('height'), 10)) {
                newHeight = parseInt(this.get('height'), 10);
            }
            if ((height != newHeight) && (newHeight >= parseInt(this.get('height'), 10))) {   
                var anim = this.get('animate');
                this.set('animate', false);
                this.set('height', newHeight + 'px');
                this.set('animate', anim);
                if (this.browser.ie) {
                    //Internet Explorer needs this
                    this.get('iframe').setStyle('height', '99%');
                    this.get('iframe').setStyle('zoom', '1');
                    var self = this;
                    window.setTimeout(function() {
                        self.get('iframe').setStyle('height', '100%');
                    }, 1);
                }
            }
        },
        /**
        * @private
        * @property _formButtons
        * @description Array of buttons that are in the Editor's parent form (for handleSubmit)
        * @type Array
        */
        _formButtons: null,
        /**
        * @private
        * @property _formButtonClicked
        * @description The form button that was clicked to submit the form.
        * @type HTMLElement
        */
        _formButtonClicked: null,
        /**
        * @private
        * @method _handleFormButtonClick
        * @description The click listener assigned to each submit button in the Editor's parent form.
        * @param {Event} ev The click event
        */
        _handleFormButtonClick: function(ev) {
            var tar = Event.getTarget(ev);
            this._formButtonClicked = tar;
        },
        /**
        * @private
        * @method _handleFormSubmit
        * @description Handles the form submission.
        * @param {Object} ev The Form Submit Event
        */
        _handleFormSubmit: function(ev) {
            this.saveHTML();

            var form = this.get('element').form,
                tar = this._formButtonClicked || false;

            Event.removeListener(form, 'submit', this._handleFormSubmit);
            if (YAHOO.env.ua.ie) {
                //form.fireEvent("onsubmit");
                if (tar && !tar.disabled) {
                    tar.click();
                }
            } else {  // Gecko, Opera, and Safari
                if (tar && !tar.disabled) {
                    tar.click();
                }
                var oEvent = document.createEvent("HTMLEvents");
                oEvent.initEvent("submit", true, true);
                form.dispatchEvent(oEvent);
                if (YAHOO.env.ua.webkit) {
                    if (YAHOO.lang.isFunction(form.submit)) {
                        form.submit();
                    }
                }
            }
            //2.6.0
            //Removed this, not need since removing Safari 2.x
            //Event.stopEvent(ev);
        },
        /**
        * @private
        * @method _handleFontSize
        * @description Handles the font size button in the toolbar.
        * @param {Object} o Object returned from Toolbar's buttonClick Event
        */
        _handleFontSize: function(o) {
            var button = this.toolbar.getButtonById(o.button.id);
            var value = button.get('label') + 'px';
            this.execCommand('fontsize', value);
            return false;
        },
        /**
        * @private
        * @description Handles the colorpicker buttons in the toolbar.
        * @param {Object} o Object returned from Toolbar's buttonClick Event
        */
        _handleColorPicker: function(o) {
            var cmd = o.button;
            var value = '#' + o.color;
            if ((cmd == 'forecolor') || (cmd == 'backcolor')) {
                this.execCommand(cmd, value);
            }
        },
        /**
        * @private
        * @method _handleAlign
        * @description Handles the alignment buttons in the toolbar.
        * @param {Object} o Object returned from Toolbar's buttonClick Event
        */
        _handleAlign: function(o) {
            var cmd = null;
            for (var i = 0; i < o.button.menu.length; i++) {
                if (o.button.menu[i].value == o.button.value) {
                    cmd = o.button.menu[i].value;
                }
            }
            var value = this._getSelection();

            this.execCommand(cmd, value);
            return false;
        },
        /**
        * @private
        * @method _handleAfterNodeChange
        * @description Fires after a nodeChange happens to setup the things that where reset on the node change (button state).
        */
        _handleAfterNodeChange: function() {
            var path = this._getDomPath(),
                elm = null,
                family = null,
                fontsize = null,
                validFont = false,
                fn_button = this.toolbar.getButtonByValue('fontname'),
                fs_button = this.toolbar.getButtonByValue('fontsize'),
                hd_button = this.toolbar.getButtonByValue('heading');

            for (var i = 0; i < path.length; i++) {
                elm = path[i];

                var tag = elm.tagName.toLowerCase();


                if (elm.getAttribute('tag')) {
                    tag = elm.getAttribute('tag');
                }

                family = elm.getAttribute('face');
                if (Dom.getStyle(elm, 'font-family')) {
                    family = Dom.getStyle(elm, 'font-family');
                    //Adobe AIR Code
                    family = family.replace(/'/g, '');                    
                }

                if (tag.substring(0, 1) == 'h') {
                    if (hd_button) {
                        for (var h = 0; h < hd_button._configs.menu.value.length; h++) {
                            if (hd_button._configs.menu.value[h].value.toLowerCase() == tag) {
                                hd_button.set('label', hd_button._configs.menu.value[h].text);
                            }
                        }
                        this._updateMenuChecked('heading', tag);
                    }
                }
            }

            if (fn_button) {
                for (var b = 0; b < fn_button._configs.menu.value.length; b++) {
                    if (family && fn_button._configs.menu.value[b].text.toLowerCase() == family.toLowerCase()) {
                        validFont = true;
                        family = fn_button._configs.menu.value[b].text; //Put the proper menu name in the button
                    }
                }
                if (!validFont) {
                    family = fn_button._configs.label._initialConfig.value;
                }
                var familyLabel = '<span class="yui-toolbar-fontname-' + this._cleanClassName(family) + '">' + family + '</span>';
                if (fn_button.get('label') != familyLabel) {
                    fn_button.set('label', familyLabel);
                    this._updateMenuChecked('fontname', family);
                }
            }

            if (fs_button) {
                fontsize = parseInt(Dom.getStyle(elm, 'fontSize'), 10);
                if ((fontsize === null) || isNaN(fontsize)) {
                    fontsize = fs_button._configs.label._initialConfig.value;
                }
                fs_button.set('label', ''+fontsize);
            }
            
            if (!this._isElement(elm, 'body') && !this._isElement(elm, 'img')) {
                this.toolbar.enableButton(fn_button);
                this.toolbar.enableButton(fs_button);
                this.toolbar.enableButton('forecolor');
                this.toolbar.enableButton('backcolor');
            }
            if (this._isElement(elm, 'img')) {
                if (YAHOO.widget.Overlay) {
                    this.toolbar.enableButton('createlink');
                }
            }
            if (this._hasParent(elm, 'blockquote')) {
                this.toolbar.selectButton('indent');
                this.toolbar.disableButton('indent');
                this.toolbar.enableButton('outdent');
            }
            if (this._hasParent(elm, 'ol') || this._hasParent(elm, 'ul')) {
                this.toolbar.disableButton('indent');
            }
            this._lastButton = null;
            
        },
        /**
        * @private
        * @method _handleInsertImageClick
        * @description Opens the Image Properties Window when the insert Image button is clicked or an Image is Double Clicked.
        */
        _handleInsertImageClick: function() {
            if (this.get('limitCommands')) {
                if (!this.toolbar.getButtonByValue('insertimage')) {
                    return false;
                }
            }
        
            this.toolbar.set('disabled', true); //Disable the toolbar when the prompt is showing
            var _handleAEC = function() {
                var el = this.currentElement[0],
                    src = 'http://';
                if (!el) {
                    el = this._getSelectedElement();
                }
                if (el) {
                    if (el.getAttribute('src')) {
                        src = el.getAttribute('src', 2);
                        if (src.indexOf(this.get('blankimage')) != -1) {
                            src = this.STR_IMAGE_HERE;
                        }
                    }
                }
                var str = prompt(this.STR_IMAGE_URL + ': ', src);
                if ((str !== '') && (str !== null)) {
                    el.setAttribute('src', str);
                } else if (str === '') {
                    el.parentNode.removeChild(el);
                    this.currentElement = [];
                    this.nodeChange();
                } else if ((str === null)) {
                    src = el.getAttribute('src', 2);
                    if (src.indexOf(this.get('blankimage')) != -1) {
                        el.parentNode.removeChild(el);
                        this.currentElement = [];
                        this.nodeChange();
                    }
                }
                this.closeWindow();
                this.toolbar.set('disabled', false);
                this.unsubscribe('afterExecCommand', _handleAEC, this, true);
            };
            this.on('afterExecCommand', _handleAEC, this, true);
        },
        /**
        * @private
        * @method _handleInsertImageWindowClose
        * @description Handles the closing of the Image Properties Window.
        */
        _handleInsertImageWindowClose: function() {
            this.nodeChange();
        },
        /**
        * @private
        * @method _isLocalFile
        * @param {String} url THe url/string to check
        * @description Checks to see if a string (href or img src) is possibly a local file reference..
        */
        _isLocalFile: function(url) {
            if ((url) && (url !== '') && ((url.indexOf('file:/') != -1) || (url.indexOf(':\\') != -1))) {
                return true;
            }
            return false;
        },
        /**
        * @private
        * @method _handleCreateLinkClick
        * @description Handles the opening of the Link Properties Window when the Create Link button is clicked or an href is doubleclicked.
        */
        _handleCreateLinkClick: function() {
            if (this.get('limitCommands')) {
                if (!this.toolbar.getButtonByValue('createlink')) {
                    return false;
                }
            }
        
            this.toolbar.set('disabled', true); //Disable the toolbar when the prompt is showing

            var _handleAEC = function() {
                var el = this.currentElement[0],
                    url = '';

                if (el) {
                    if (el.getAttribute('href', 2) !== null) {
                        url = el.getAttribute('href', 2);
                    }
                }
                var str = prompt(this.STR_LINK_URL + ': ', url);
                if ((str !== '') && (str !== null)) {
                    var urlValue = str;
                    if ((urlValue.indexOf(':/'+'/') == -1) && (urlValue.substring(0,1) != '/') && (urlValue.substring(0, 6).toLowerCase() != 'mailto')) {
                        if ((urlValue.indexOf('@') != -1) && (urlValue.substring(0, 6).toLowerCase() != 'mailto')) {
                            //Found an @ sign, prefix with mailto:
                            urlValue = 'mailto:' + urlValue;
                        } else {
                            /* :// not found adding */
                            if (urlValue.substring(0, 1) != '#') {
                                //urlValue = 'http:/'+'/' + urlValue;
                            }
                        }
                    }
                    el.setAttribute('href', urlValue);
                } else if (str !== null) {
                    var _span = this._getDoc().createElement('span');
                    _span.innerHTML = el.innerHTML;
                    Dom.addClass(_span, 'yui-non');
                    el.parentNode.replaceChild(_span, el);
                }
                this.closeWindow();
                this.toolbar.set('disabled', false);
                this.unsubscribe('afterExecCommand', _handleAEC, this, true);
            };
            this.on('afterExecCommand', _handleAEC, this);

        },
        /**
        * @private
        * @method _handleCreateLinkWindowClose
        * @description Handles the closing of the Link Properties Window.
        */
        _handleCreateLinkWindowClose: function() {
            this.nodeChange();
            this.currentElement = [];
        },
        /**
        * @method render
        * @description Calls the private method _render in a setTimeout to allow for other things on the page to continue to load.
        */
        render: function() {
            if (this._rendered) {
                return false;
            }
            if (!this.DOMReady) {
                this._queue[this._queue.length] = ['render', arguments];
                return false;
            }
            if (this.get('element')) {
                if (this.get('element').tagName) {
                    this._textarea = true;
                    if (this.get('element').tagName.toLowerCase() !== 'textarea') {
                        this._textarea = false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
            this._rendered = true;
            var self = this;
            window.setTimeout(function() {
                self._render.call(self);
            }, 4);
        },
        /**
        * @private
        * @method _render
        * @description Causes the toolbar and the editor to render and replace the textarea.
        */
        _render: function() {
            var self = this;
            this.set('textarea', this.get('element'));

            this.get('element_cont').setStyle('display', 'none');
            this.get('element_cont').addClass(this.CLASS_CONTAINER);
            
            this.set('iframe', this._createIframe());

            window.setTimeout(function() {
                self._setInitialContent.call(self);
            }, 10);

            this.get('editor_wrapper').appendChild(this.get('iframe').get('element'));

            if (this.get('disabled')) {
                this._disableEditor(true);
            }

            var tbarConf = this.get('toolbar');
            //Create Toolbar instance
            if (tbarConf instanceof Toolbar) {
                this.toolbar = tbarConf;
                //Set the toolbar to disabled until content is loaded
                this.toolbar.set('disabled', true);
            } else {
                //Set the toolbar to disabled until content is loaded
                tbarConf.disabled = true;
                this.toolbar = new Toolbar(this.get('toolbar_cont'), tbarConf);
            }

            this.fireEvent('toolbarLoaded', { type: 'toolbarLoaded', target: this.toolbar });

            
            this.toolbar.on('toolbarCollapsed', function() {
                if (this.currentWindow) {
                    this.moveWindow();
                }
            }, this, true);
            this.toolbar.on('toolbarExpanded', function() {
                if (this.currentWindow) {
                    this.moveWindow();
                }
            }, this, true);
            this.toolbar.on('fontsizeClick', this._handleFontSize, this, true);
            
            this.toolbar.on('colorPickerClicked', function(o) {
                this._handleColorPicker(o);
                return false; //Stop the buttonClick event
            }, this, true);

            this.toolbar.on('alignClick', this._handleAlign, this, true);
            this.on('afterNodeChange', this._handleAfterNodeChange, this, true);
            this.toolbar.on('insertimageClick', this._handleInsertImageClick, this, true);
            this.on('windowinsertimageClose', this._handleInsertImageWindowClose, this, true);
            this.toolbar.on('createlinkClick', this._handleCreateLinkClick, this, true);
            this.on('windowcreatelinkClose', this._handleCreateLinkWindowClose, this, true);
            

            //Replace Textarea with editable area
            this.get('parentNode').replaceChild(this.get('element_cont').get('element'), this.get('element'));

            
            this.setStyle('visibility', 'hidden');
            this.setStyle('position', 'absolute');
            this.setStyle('top', '-9999px');
            this.setStyle('left', '-9999px');
            this.get('element_cont').appendChild(this.get('element'));
            this.get('element_cont').setStyle('display', 'block');


            Dom.addClass(this.get('iframe').get('parentNode'), this.CLASS_EDITABLE_CONT);
            this.get('iframe').addClass(this.CLASS_EDITABLE);

            //Set height and width of editor container
            this.get('element_cont').setStyle('width', this.get('width'));
            Dom.setStyle(this.get('iframe').get('parentNode'), 'height', this.get('height'));

            this.get('iframe').setStyle('width', '100%'); //WIDTH
            this.get('iframe').setStyle('height', '100%');

            this._setupDD();

            window.setTimeout(function() {
                self._setupAfterElement.call(self);
            }, 0);
            this.fireEvent('afterRender', { type: 'afterRender', target: this });
        },
        /**
        * @method execCommand
        * @param {String} action The "execCommand" action to try to execute (Example: bold, insertimage, inserthtml)
        * @param {String} value (optional) The value for a given action such as action: fontname value: 'Verdana'
        * @description This method attempts to try and level the differences in the various browsers and their support for execCommand actions
        */
        execCommand: function(action, value) {
            var beforeExec = this.fireEvent('beforeExecCommand', { type: 'beforeExecCommand', target: this, args: arguments });
            if ((beforeExec === false) || (this.STOP_EXEC_COMMAND)) {
                this.STOP_EXEC_COMMAND = false;
                return false;
            }
            this._lastCommand = action;
            this._setMarkupType(action);
            if (this.browser.ie) {
                this._getWindow().focus();
            }
            var exec = true;
            
            if (this.get('limitCommands')) {
                if (!this.toolbar.getButtonByValue(action)) {
                    exec = false;
                }
            }

            this.editorDirty = true;
            
            if ((typeof this['cmd_' + action.toLowerCase()] == 'function') && exec) {
                var retValue = this['cmd_' + action.toLowerCase()](value);
                exec = retValue[0];
                if (retValue[1]) {
                    action = retValue[1];
                }
                if (retValue[2]) {
                    value = retValue[2];
                }
            }
            if (exec) {
                try {
                    this._getDoc().execCommand(action, false, value);
                } catch(e) {
                }
            } else {
            }
            this.on('afterExecCommand', function() {
                this.unsubscribeAll('afterExecCommand');
                this.nodeChange();
            }, this, true);
            this.fireEvent('afterExecCommand', { type: 'afterExecCommand', target: this });
            
        },
    /* {{{  Command Overrides */

        /**
        * @method cmd_bold
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('bold') is used.
        */
        cmd_bold: function(value) {
            if (!this.browser.webkit) {
                var el = this._getSelectedElement();
                if (el && this._isElement(el, 'span') && this._hasSelection()) {
                    if (el.style.fontWeight == 'bold') {
                        el.style.fontWeight = '';
                        var b = this._getDoc().createElement('b'),
                        par = el.parentNode;
                        par.replaceChild(b, el);
                        b.appendChild(el);
                    }
                }
            }
            return [true];
        },
        /**
        * @method cmd_italic
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('italic') is used.
        */

        cmd_italic: function(value) {
            if (!this.browser.webkit) {
                var el = this._getSelectedElement();
                if (el && this._isElement(el, 'span') && this._hasSelection()) {
                    if (el.style.fontStyle == 'italic') {
                        el.style.fontStyle = '';
                        var i = this._getDoc().createElement('i'),
                        par = el.parentNode;
                        par.replaceChild(i, el);
                        i.appendChild(el);
                    }
                }
            }
            return [true];
        },


        /**
        * @method cmd_underline
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('underline') is used.
        */
        cmd_underline: function(value) {
            if (!this.browser.webkit) {
                var el = this._getSelectedElement();
                if (el && this._isElement(el, 'span')) {
                    if (el.style.textDecoration == 'underline') {
                        el.style.textDecoration = 'none';
                    } else {
                        el.style.textDecoration = 'underline';
                    }
                    return [false];
                }
            }
            return [true];
        },
        /**
        * @method cmd_backcolor
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('backcolor') is used.
        */
        cmd_backcolor: function(value) {
            var exec = true,
                el = this._getSelectedElement(),
                action = 'backcolor';

            if (this.browser.gecko || this.browser.opera) {
                this._setEditorStyle(true);
                action = 'hilitecolor';
            }

            if (!this._isElement(el, 'body') && !this._hasSelection()) {
                el.style.backgroundColor = value;
                this._selectNode(el);
                exec = false;
            } else {
                if (this.get('insert')) {
                    el = this._createInsertElement({ backgroundColor: value });
                } else {
                    this._createCurrentElement('span', { backgroundColor: value, color: el.style.color, fontSize: el.style.fontSize, fontFamily: el.style.fontFamily });
                    this._selectNode(this.currentElement[0]);
                }
                exec = false;
            }

            return [exec, action];
        },
        /**
        * @method cmd_forecolor
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('forecolor') is used.
        */
        cmd_forecolor: function(value) {
            var exec = true,
                el = this._getSelectedElement();
                
                if (!this._isElement(el, 'body') && !this._hasSelection()) {
                    Dom.setStyle(el, 'color', value);
                    this._selectNode(el);
                    exec = false;
                } else {
                    if (this.get('insert')) {
                        el = this._createInsertElement({ color: value });
                    } else {
                        this._createCurrentElement('span', { color: value, fontSize: el.style.fontSize, fontFamily: el.style.fontFamily, backgroundColor: el.style.backgroundColor });
                        this._selectNode(this.currentElement[0]);
                    }
                    exec = false;
                }
                return [exec];
        },
        /**
        * @method cmd_unlink
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('unlink') is used.
        */
        cmd_unlink: function(value) {
            this._swapEl(this.currentElement[0], 'span', function(el) {
                el.className = 'yui-non';
            });
            return [false];
        },
        /**
        * @method cmd_createlink
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('createlink') is used.
        */
        cmd_createlink: function(value) {
            var el = this._getSelectedElement(), _a = null;
            if (this._hasParent(el, 'a')) {
                this.currentElement[0] = this._hasParent(el, 'a');
            } else if (this._isElement(el, 'li')) {
                _a = this._getDoc().createElement('a');
                _a.innerHTML = el.innerHTML;
                el.innerHTML = '';
                el.appendChild(_a);
                this.currentElement[0] = _a;
            } else if (!this._isElement(el, 'a')) {
                this._createCurrentElement('a');
                _a = this._swapEl(this.currentElement[0], 'a');
                this.currentElement[0] = _a;
            } else {
                this.currentElement[0] = el;
            }
            return [false];
        },
        /**
        * @method cmd_insertimage
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('insertimage') is used.
        */
        cmd_insertimage: function(value) {
            var exec = true, _img = null, action = 'insertimage',
                el = this._getSelectedElement();

            if (value === '') {
                value = this.get('blankimage');
            }

            /*
            * @knownissue Safari Cursor Position
            * @browser Safari 2.x
            * @description The issue here is that we have no way of knowing where the cursor position is
            * inside of the iframe, so we have to place the newly inserted data in the best place that we can.
            */
            
            if (this._isElement(el, 'img')) {
                this.currentElement[0] = el;
                exec = false;
            } else {
                if (this._getDoc().queryCommandEnabled(action)) {
                    this._getDoc().execCommand(action, false, value);
                    var imgs = this._getDoc().getElementsByTagName('img');
                    for (var i = 0; i < imgs.length; i++) {
                        if (!YAHOO.util.Dom.hasClass(imgs[i], 'yui-img')) {
                            YAHOO.util.Dom.addClass(imgs[i], 'yui-img');
                            this.currentElement[0] = imgs[i];
                        }
                    }
                    exec = false;
                } else {
                    if (el == this._getDoc().body) {
                        _img = this._getDoc().createElement('img');
                        _img.setAttribute('src', value);
                        YAHOO.util.Dom.addClass(_img, 'yui-img');
                        this._getDoc().body.appendChild(_img);
                    } else {
                        this._createCurrentElement('img');
                        _img = this._getDoc().createElement('img');
                        _img.setAttribute('src', value);
                        YAHOO.util.Dom.addClass(_img, 'yui-img');
                        this.currentElement[0].parentNode.replaceChild(_img, this.currentElement[0]);
                    }
                    this.currentElement[0] = _img;
                    exec = false;
                }
            }
            return [exec];
        },
        /**
        * @method cmd_inserthtml
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('inserthtml') is used.
        */
        cmd_inserthtml: function(value) {
            var exec = true, action = 'inserthtml', _span = null, _range = null;
            /*
            * @knownissue Safari cursor position
            * @browser Safari 2.x
            * @description The issue here is that we have no way of knowing where the cursor position is
            * inside of the iframe, so we have to place the newly inserted data in the best place that we can.
            */
            if (this.browser.webkit && !this._getDoc().queryCommandEnabled(action)) {
                this._createCurrentElement('img');
                _span = this._getDoc().createElement('span');
                _span.innerHTML = value;
                this.currentElement[0].parentNode.replaceChild(_span, this.currentElement[0]);
                exec = false;
            } else if (this.browser.ie) {
                _range = this._getRange();
                if (_range.item) {
                    _range.item(0).outerHTML = value;
                } else {
                    _range.pasteHTML(value);
                }
                exec = false;                    
            }
            return [exec];
        },
        /**
        * @method cmd_list
        * @param tag The tag of the list you want to create (eg, ul or ol)
        * @description This is a combined execCommand override method. It is called from the cmd_insertorderedlist and cmd_insertunorderedlist methods.
        */
        cmd_list: function(tag) {
            var exec = true, list = null, li = 0, el = null, str = '',
                selEl = this._getSelectedElement(), action = 'insertorderedlist';
                if (tag == 'ul') {
                    action = 'insertunorderedlist';
                }
            /*
            * @knownissue Safari 2.+ doesn't support ordered and unordered lists
            * @browser Safari 2.x
            * The issue with this workaround is that when applied to a set of text
            * that has BR's in it, Safari may or may not pick up the individual items as
            * list items. This is fixed in WebKit (Safari 3)
            * 2.6.0: Seems there are still some issues with List Creation and Safari 3, reverting to previously working Safari 2.x code
            */
            //if ((this.browser.webkit && !this._getDoc().queryCommandEnabled(action))) {
            if ((this.browser.webkit && !this.browser.webkit4) || (this.browser.opera)) {
                if (this._isElement(selEl, 'li') && this._isElement(selEl.parentNode, tag)) {
                    el = selEl.parentNode;
                    list = this._getDoc().createElement('span');
                    YAHOO.util.Dom.addClass(list, 'yui-non');
                    str = '';
                    var lis = el.getElementsByTagName('li'), p_tag = ((this.browser.opera && this.get('ptags')) ? 'p' : 'div');
                    for (li = 0; li < lis.length; li++) {
                        str += '<' + p_tag + '>' + lis[li].innerHTML + '</' + p_tag + '>';
                    }
                    list.innerHTML = str;
                    this.currentElement[0] = el;
                    this.currentElement[0].parentNode.replaceChild(list, this.currentElement[0]);
                } else {
                    this._createCurrentElement(tag.toLowerCase());
                    list = this._getDoc().createElement(tag);
                    for (li = 0; li < this.currentElement.length; li++) {
                        var newli = this._getDoc().createElement('li');
                        newli.innerHTML = this.currentElement[li].innerHTML + '<span class="yui-non">&nbsp;</span>&nbsp;';
                        list.appendChild(newli);
                        if (li > 0) {
                            this.currentElement[li].parentNode.removeChild(this.currentElement[li]);
                        }
                    }
                    var b_tag = ((this.browser.opera) ? '<BR>' : '<br>'),
                    items = list.firstChild.innerHTML.split(b_tag), i, item;
                    if (items.length > 0) {
                        list.innerHTML = '';
                        for (i = 0; i < items.length; i++) {
                            item = this._getDoc().createElement('li');
                            item.innerHTML = items[i];
                            list.appendChild(item);
                        }
                    }

                    this.currentElement[0].parentNode.replaceChild(list, this.currentElement[0]);
                    this.currentElement[0] = list;
                    var _h = this.currentElement[0].firstChild;
                    _h = Dom.getElementsByClassName('yui-non', 'span', _h)[0];
                    if (this.browser.webkit) {
                        this._getSelection().setBaseAndExtent(_h, 1, _h, _h.innerText.length);
                    }
                }
                exec = false;
            } else {
                el = this._getSelectedElement();
                if (this._isElement(el, 'li') && this._isElement(el.parentNode, tag) || (this.browser.ie && this._isElement(this._getRange().parentElement, 'li')) || (this.browser.ie && this._isElement(el, 'ul')) || (this.browser.ie && this._isElement(el, 'ol'))) { //we are in a list..
                    if (this.browser.ie) {
                        if ((this.browser.ie && this._isElement(el, 'ul')) || (this.browser.ie && this._isElement(el, 'ol'))) {
                            el = el.getElementsByTagName('li')[0];
                        }
                        str = '';
                        var lis2 = el.parentNode.getElementsByTagName('li');
                        for (var j = 0; j < lis2.length; j++) {
                            str += lis2[j].innerHTML + '<br>';
                        }
                        var newEl = this._getDoc().createElement('span');
                        newEl.innerHTML = str;
                        el.parentNode.parentNode.replaceChild(newEl, el.parentNode);
                    } else {
                        this.nodeChange();
                        this._getDoc().execCommand(action, '', el.parentNode);
                        this.nodeChange();
                    }
                    exec = false;
                }
                if (this.browser.opera) {
                    var self = this;
                    window.setTimeout(function() {
                        var liso = self._getDoc().getElementsByTagName('li');
                        for (var i = 0; i < liso.length; i++) {
                            if (liso[i].innerHTML.toLowerCase() == '<br>') {
                                liso[i].parentNode.parentNode.removeChild(liso[i].parentNode);
                            }
                        }
                    },30);
                }
                if (this.browser.ie && exec) {
                    var html = '';
                    if (this._getRange().html) {
                        html = '<li>' + this._getRange().html+ '</li>';
                    } else {
                        var t = this._getRange().text.split('\n');
                        if (t.length > 1) {
                            html = '';
                            for (var ie = 0; ie < t.length; ie++) {
                                html += '<li>' + t[ie] + '</li>';
                            }
                        } else {
                            var txt = this._getRange().text;
                            if (txt === '') {
                                html = '<li id="new_list_item">' + txt + '</li>';
                            } else {
                                html = '<li>' + txt + '</li>';
                            }
                        }
                    }
                    this._getRange().pasteHTML('<' + tag + '>' + html + '</' + tag + '>');
                    var new_item = this._getDoc().getElementById('new_list_item');
                    if (new_item) {
                        var range = this._getDoc().body.createTextRange();
                        range.moveToElementText(new_item);
                        range.collapse(false);
                        range.select();                       
                        new_item.id = '';
                    }
                    exec = false;
                }
            }
            return exec;
        },
        /**
        * @method cmd_insertorderedlist
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('insertorderedlist ') is used.
        */
        cmd_insertorderedlist: function(value) {
            return [this.cmd_list('ol')];
        },
        /**
        * @method cmd_insertunorderedlist 
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('insertunorderedlist') is used.
        */
        cmd_insertunorderedlist: function(value) {
            return [this.cmd_list('ul')];
        },
        /**
        * @method cmd_fontname
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('fontname') is used.
        */
        cmd_fontname: function(value) {
            var exec = true,
                selEl = this._getSelectedElement();

            this.currentFont = value;
            if (selEl && selEl.tagName && !this._hasSelection() && !this._isElement(selEl, 'body') && !this.get('insert')) {
                YAHOO.util.Dom.setStyle(selEl, 'font-family', value);
                exec = false;
            } else if (this.get('insert') && !this._hasSelection()) {
                var el = this._createInsertElement({ fontFamily: value });
                exec = false;
            }
            return [exec];
        },
        /**
        * @method cmd_fontsize
        * @param value Value passed from the execCommand method
        * @description This is an execCommand override method. It is called from execCommand when the execCommand('fontsize') is used.
        */
        cmd_fontsize: function(value) {
            var el = null, go = true;
            el = this._getSelectedElement();
            if (this.browser.webkit) {
                if (this.currentElement[0]) {
                    if (el == this.currentElement[0]) {
                        go = false;
                        YAHOO.util.Dom.setStyle(el, 'fontSize', value);
                        this._selectNode(el);
                        this.currentElement[0] = el;
                    }
                }
            }
            if (go) {
                if (!this._isElement(this._getSelectedElement(), 'body') && (!this._hasSelection())) {
                    el = this._getSelectedElement();
                    YAHOO.util.Dom.setStyle(el, 'fontSize', value);
                    if (this.get('insert') && this.browser.ie) {
                        var r = this._getRange();
                        r.collapse(false);
                        r.select();
                    } else {
                        this._selectNode(el);
                    }
                } else if (this.currentElement && (this.currentElement.length > 0) && (!this._hasSelection()) && (!this.get('insert'))) {
                    YAHOO.util.Dom.setStyle(this.currentElement, 'fontSize', value);
                } else {
                    if (this.get('insert') && !this._hasSelection()) {
                        el = this._createInsertElement({ fontSize: value });
                        this.currentElement[0] = el;
                        this._selectNode(this.currentElement[0]);
                    } else {
                        this._createCurrentElement('span', {'fontSize': value, fontFamily: el.style.fontFamily, color: el.style.color, backgroundColor: el.style.backgroundColor });
                        this._selectNode(this.currentElement[0]);
                    }
                }
            }
            return [false];
        },
    /* }}} */
        /**
        * @private
        * @method _swapEl
        * @param {HTMLElement} el The element to swap with
        * @param {String} tagName The tagname of the element that you wish to create
        * @param {Function} callback (optional) A function to run on the element after it is created, but before it is replaced. An element reference is passed to this function.
        * @description This function will create a new element in the DOM and populate it with the contents of another element. Then it will assume it's place.
        */
        _swapEl: function(el, tagName, callback) {
            var _el = this._getDoc().createElement(tagName);
            if (el) {
                _el.innerHTML = el.innerHTML;
            }
            if (typeof callback == 'function') {
                callback.call(this, _el);
            }
            if (el) {
                el.parentNode.replaceChild(_el, el);
            }
            return _el;
        },
        /**
        * @private
        * @method _createInsertElement
        * @description Creates a new "currentElement" then adds some text (and other things) to make it selectable and stylable. Then the user can continue typing.
        * @param {Object} css (optional) Object literal containing styles to apply to the new element.
        * @return {HTMLElement}
        */
        _createInsertElement: function(css) {
            this._createCurrentElement('span', css);
            var el = this.currentElement[0];
            if (this.browser.webkit) {
                //Little Safari Hackery here..
                el.innerHTML = '<span class="yui-non">&nbsp;</span>';
                el = el.firstChild;
                this._getSelection().setBaseAndExtent(el, 1, el, el.innerText.length);                    
            } else if (this.browser.ie || this.browser.opera) {
                el.innerHTML = '&nbsp;';
            }
            this.focus();
            this._selectNode(el, true);
            return el;
        },
        /**
        * @private
        * @method _createCurrentElement
        * @param {String} tagName (optional defaults to a) The tagname of the element that you wish to create
        * @param {Object} tagStyle (optional) Object literal containing styles to apply to the new element.
        * @description This is a work around for the various browser issues with execCommand. This method will run <code>execCommand('fontname', false, 'yui-tmp')</code> on the given selection.
        * It will then search the document for an element with the font-family set to <strong>yui-tmp</strong> and replace that with another span that has other information in it, then assign the new span to the 
        * <code>this.currentElement</code> array, so we now have element references to the elements that were just modified. At this point we can use standard DOM manipulation to change them as we see fit.
        */
        _createCurrentElement: function(tagName, tagStyle) {
            tagName = ((tagName) ? tagName : 'a');
            var tar = null,
                el = [],
                _doc = this._getDoc();
            
            if (this.currentFont) {
                if (!tagStyle) {
                    tagStyle = {};
                }
                tagStyle.fontFamily = this.currentFont;
                this.currentFont = null;
            }
            this.currentElement = [];

            var _elCreate = function(tagName, tagStyle) {
                var el = null;
                tagName = ((tagName) ? tagName : 'span');
                tagName = tagName.toLowerCase();
                switch (tagName) {
                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                    case 'h5':
                    case 'h6':
                        el = _doc.createElement(tagName);
                        break;
                    default:
                        el = _doc.createElement(tagName);
                        if (tagName === 'span') {
                            YAHOO.util.Dom.addClass(el, 'yui-tag-' + tagName);
                            YAHOO.util.Dom.addClass(el, 'yui-tag');
                            el.setAttribute('tag', tagName);
                        }

                        for (var k in tagStyle) {
                            if (YAHOO.lang.hasOwnProperty(tagStyle, k)) {
                                el.style[k] = tagStyle[k];
                            }
                        }
                        break;
                }
                return el;
            };

            if (!this._hasSelection()) {
                if (this._getDoc().queryCommandEnabled('insertimage')) {
                    this._getDoc().execCommand('insertimage', false, 'yui-tmp-img');
                    var imgs = this._getDoc().getElementsByTagName('img');
                    for (var j = 0; j < imgs.length; j++) {
                        if (imgs[j].getAttribute('src', 2) == 'yui-tmp-img') {
                            el = _elCreate(tagName, tagStyle);
                            imgs[j].parentNode.replaceChild(el, imgs[j]);
                            this.currentElement[this.currentElement.length] = el;
                        }
                    }
                } else {
                    if (this.currentEvent) {
                        tar = YAHOO.util.Event.getTarget(this.currentEvent);
                    } else {
                        //For Safari..
                        tar = this._getDoc().body;                        
                    }
                }
                if (tar) {
                    /*
                    * @knownissue Safari Cursor Position
                    * @browser Safari 2.x
                    * @description The issue here is that we have no way of knowing where the cursor position is
                    * inside of the iframe, so we have to place the newly inserted data in the best place that we can.
                    */
                    el = _elCreate(tagName, tagStyle);
                    if (this._isElement(tar, 'body') || this._isElement(tar, 'html')) {
                        if (this._isElement(tar, 'html')) {
                            tar = this._getDoc().body;
                        }
                        tar.appendChild(el);
                    } else if (tar.nextSibling) {
                        tar.parentNode.insertBefore(el, tar.nextSibling);
                    } else {
                        tar.parentNode.appendChild(el);
                    }
                    //this.currentElement = el;
                    this.currentElement[this.currentElement.length] = el;
                    this.currentEvent = null;
                    if (this.browser.webkit) {
                        //Force Safari to focus the new element
                        this._getSelection().setBaseAndExtent(el, 0, el, 0);
                        if (this.browser.webkit3) {
                            this._getSelection().collapseToStart();
                        } else {
                            this._getSelection().collapse(true);
                        }
                    }
                }
            } else {
                //Force CSS Styling for this action...
                this._setEditorStyle(true);
                this._getDoc().execCommand('fontname', false, 'yui-tmp');
                var _tmp = [], __tmp, __els = ['font', 'span', 'i', 'b', 'u'];

                if (!this._isElement(this._getSelectedElement(), 'body')) {
                    __els[__els.length] = this._getDoc().getElementsByTagName(this._getSelectedElement().tagName);
                    __els[__els.length] = this._getDoc().getElementsByTagName(this._getSelectedElement().parentNode.tagName);
                }
                for (var _els = 0; _els < __els.length; _els++) {
                    var _tmp1 = this._getDoc().getElementsByTagName(__els[_els]);
                    for (var e = 0; e < _tmp1.length; e++) {
                        _tmp[_tmp.length] = _tmp1[e];
                    }
                }

                
                for (var i = 0; i < _tmp.length; i++) {
                    if ((YAHOO.util.Dom.getStyle(_tmp[i], 'font-family') == 'yui-tmp') || (_tmp[i].face && (_tmp[i].face == 'yui-tmp'))) {
                        if (tagName !== 'span') {
                            el = _elCreate(tagName, tagStyle);
                        } else {
                            el = _elCreate(_tmp[i].tagName, tagStyle);
                        }
                        el.innerHTML = _tmp[i].innerHTML;
                        if (this._isElement(_tmp[i], 'ol') || (this._isElement(_tmp[i], 'ul'))) {
                            var fc = _tmp[i].getElementsByTagName('li')[0];
                            _tmp[i].style.fontFamily = 'inherit';
                            fc.style.fontFamily = 'inherit';
                            el.innerHTML = fc.innerHTML;
                            fc.innerHTML = '';
                            fc.appendChild(el);
                            this.currentElement[this.currentElement.length] = el;
                        } else if (this._isElement(_tmp[i], 'li')) {
                            _tmp[i].innerHTML = '';
                            _tmp[i].appendChild(el);
                            _tmp[i].style.fontFamily = 'inherit';
                            this.currentElement[this.currentElement.length] = el;
                        } else {
                            if (_tmp[i].parentNode) {
                                _tmp[i].parentNode.replaceChild(el, _tmp[i]);
                                this.currentElement[this.currentElement.length] = el;
                                this.currentEvent = null;
                                if (this.browser.webkit) {
                                    //Force Safari to focus the new element
                                    this._getSelection().setBaseAndExtent(el, 0, el, 0);
                                    if (this.browser.webkit3) {
                                        this._getSelection().collapseToStart();
                                    } else {
                                        this._getSelection().collapse(true);
                                    }
                                }
                                if (this.browser.ie && tagStyle && tagStyle.fontSize) {
                                    this._getSelection().empty();
                                }
                                if (this.browser.gecko) {
                                    this._getSelection().collapseToStart();
                                }
                            }
                        }
                    }
                }
                var len = this.currentElement.length;
                for (var o = 0; o < len; o++) {
                    if ((o + 1) != len) { //Skip the last one in the list
                        if (this.currentElement[o] && this.currentElement[o].nextSibling) {
                            if (this._isElement(this.currentElement[o], 'br')) {
                                this.currentElement[this.currentElement.length] = this.currentElement[o].nextSibling;
                            }
                        }
                    }
                }
            }
        },
        /**
        * @method saveHTML
        * @description Cleans the HTML with the cleanHTML method then places that string back into the textarea.
        * @return String
        */
        saveHTML: function() {
            var html = this.cleanHTML();
            if (this._textarea) {
                this.get('element').value = html;
            } else {
                this.get('element').innerHTML = html;
            }
            if (this.get('saveEl') !== this.get('element')) {
                var out = this.get('saveEl');
                if (Lang.isString(out)) {
                    out = Dom.get(out);
                }
                if (out) {
                    if (out.tagName.toLowerCase() === 'textarea') {
                        out.value = html;
                    } else {
                        out.innerHTML = html;
                    }
                }
            }
            return html;
        },
        /**
        * @method setEditorHTML
        * @param {String} incomingHTML The html content to load into the editor
        * @description Loads HTML into the editors body
        */
        setEditorHTML: function(incomingHTML) {
            var html = this._cleanIncomingHTML(incomingHTML);
            html = html.replace(/RIGHT_BRACKET/gi, '{');
            html = html.replace(/LEFT_BRACKET/gi, '}');
            this._getDoc().body.innerHTML = html;
            this.nodeChange();
        },
        /**
        * @method getEditorHTML
        * @description Gets the unprocessed/unfiltered HTML from the editor
        */
        getEditorHTML: function() {
            try {
                var b = this._getDoc().body;
                if (b === null) {
                    return null;
                }
                return this._getDoc().body.innerHTML;
            } catch (e) {
                return '';
            }
        },
        /**
        * @method show
        * @description This method needs to be called if the Editor was hidden (like in a TabView or Panel). It is used to reset the editor after being in a container that was set to display none.
        */
        show: function() {
            if (this.browser.gecko) {
                this._setDesignMode('on');
                this.focus();
            }
            if (this.browser.webkit) {
                var self = this;
                window.setTimeout(function() {
                    self._setInitialContent.call(self);
                }, 10);
            }
            //Adding this will close all other Editor window's when showing this one.
            if (this.currentWindow) {
                this.closeWindow();
            }
            //Put the iframe back in place
            this.get('iframe').setStyle('position', 'static');
            this.get('iframe').setStyle('left', '');
        },
        /**
        * @method hide
        * @description This method needs to be called if the Editor is to be hidden (like in a TabView or Panel). It should be called to clear timeouts and close open editor windows.
        */
        hide: function() {
            //Adding this will close all other Editor window's.
            if (this.currentWindow) {
                this.closeWindow();
            }
            if (this._fixNodesTimer) {
                clearTimeout(this._fixNodesTimer);
                this._fixNodesTimer = null;
            }
            if (this._nodeChangeTimer) {
                clearTimeout(this._nodeChangeTimer);
                this._nodeChangeTimer = null;
            }
            this._lastNodeChange = 0;
            //Move the iframe off of the screen, so that in containers with visiblity hidden, IE will not cover other elements.
            this.get('iframe').setStyle('position', 'absolute');
            this.get('iframe').setStyle('left', '-9999px');
        },
        /**
        * @method _cleanIncomingHTML
        * @param {String} html The unfiltered HTML
        * @description Process the HTML with a few regexes to clean it up and stabilize the input
        * @return {String} The filtered HTML
        */
        _cleanIncomingHTML: function(html) {
            html = html.replace(/{/gi, 'RIGHT_BRACKET');
            html = html.replace(/}/gi, 'LEFT_BRACKET');

            html = html.replace(/<strong([^>]*)>/gi, '<b$1>');
            html = html.replace(/<\/strong>/gi, '</b>');   

            //replace embed before em check
            html = html.replace(/<embed([^>]*)>/gi, '<YUI_EMBED$1>');
            html = html.replace(/<\/embed>/gi, '</YUI_EMBED>');

            html = html.replace(/<em([^>]*)>/gi, '<i$1>');
            html = html.replace(/<\/em>/gi, '</i>');
            html = html.replace(/_moz_dirty=""/gi, '');
            
            //Put embed tags back in..
            html = html.replace(/<YUI_EMBED([^>]*)>/gi, '<embed$1>');
            html = html.replace(/<\/YUI_EMBED>/gi, '</embed>');
            if (this.get('plainText')) {
                html = html.replace(/\n/g, '<br>').replace(/\r/g, '<br>');
                html = html.replace(/  /gi, '&nbsp;&nbsp;'); //Replace all double spaces
                html = html.replace(/\t/gi, '&nbsp;&nbsp;&nbsp;&nbsp;'); //Replace all tabs
            }
            //Removing Script Tags from the Editor
            html = html.replace(/<script([^>]*)>/gi, '<bad>');
            html = html.replace(/<\/script([^>]*)>/gi, '</bad>');
            html = html.replace(/&lt;script([^>]*)&gt;/gi, '<bad>');
            html = html.replace(/&lt;\/script([^>]*)&gt;/gi, '</bad>');
            //Replace the line feeds
            html = html.replace(/\r\n/g, '<YUI_LF>').replace(/\n/g, '<YUI_LF>').replace(/\r/g, '<YUI_LF>');
            
            //Remove Bad HTML elements (used to be script nodes)
            html = html.replace(new RegExp('<bad([^>]*)>(.*?)<\/bad>', 'gi'), '');
            //Replace the lines feeds
            html = html.replace(/<YUI_LF>/g, '\n');
            return html;
        },
        /**
        * @method cleanHTML
        * @param {String} html The unfiltered HTML
        * @description Process the HTML with a few regexes to clean it up and stabilize the output
        * @return {String} The filtered HTML
        */
        cleanHTML: function(html) {
            //Start Filtering Output
            //Begin RegExs..
            if (!html) { 
                html = this.getEditorHTML();
            }
            var markup = this.get('markup');
            //Make some backups...
            html = this.pre_filter_linebreaks(html, markup);

            //Filter MS Word
            html = this.filter_msword(html);

		    html = html.replace(/<img([^>]*)\/>/gi, '<YUI_IMG$1>');
		    html = html.replace(/<img([^>]*)>/gi, '<YUI_IMG$1>');

		    html = html.replace(/<input([^>]*)\/>/gi, '<YUI_INPUT$1>');
		    html = html.replace(/<input([^>]*)>/gi, '<YUI_INPUT$1>');

		    html = html.replace(/<ul([^>]*)>/gi, '<YUI_UL$1>');
		    html = html.replace(/<\/ul>/gi, '<\/YUI_UL>');
		    html = html.replace(/<blockquote([^>]*)>/gi, '<YUI_BQ$1>');
		    html = html.replace(/<\/blockquote>/gi, '<\/YUI_BQ>');

		    html = html.replace(/<embed([^>]*)>/gi, '<YUI_EMBED$1>');
		    html = html.replace(/<\/embed>/gi, '<\/YUI_EMBED>');

            //Convert b and i tags to strong and em tags
            if ((markup == 'semantic') || (markup == 'xhtml')) {
                html = html.replace(/<i(\s+[^>]*)?>/gi, '<em$1>');
                html = html.replace(/<\/i>/gi, '</em>');
                html = html.replace(/<b(\s+[^>]*)?>/gi, '<strong$1>');
                html = html.replace(/<\/b>/gi, '</strong>');
            }

            html = html.replace(/_moz_dirty=""/gi, '');

            //normalize strikethrough
            html = html.replace(/<strike/gi, '<span style="text-decoration: line-through;"');
            html = html.replace(/\/strike>/gi, '/span>');
            
            
            //Case Changing
            if (this.browser.ie) {
                html = html.replace(/text-decoration/gi, 'text-decoration');
                html = html.replace(/font-weight/gi, 'font-weight');
                html = html.replace(/_width="([^>]*)"/gi, '');
                html = html.replace(/_height="([^>]*)"/gi, '');
                //Cleanup Image URL's
                var url = this._baseHREF.replace(/\//gi, '\\/'),
                    re = new RegExp('src="' + url, 'gi');
                html = html.replace(re, 'src="');
            }
		    html = html.replace(/<font/gi, '<font');
		    html = html.replace(/<\/font>/gi, '</font>');
		    html = html.replace(/<span/gi, '<span');
		    html = html.replace(/<\/span>/gi, '</span>');
            if ((markup == 'semantic') || (markup == 'xhtml') || (markup == 'css')) {
                html = html.replace(new RegExp('<font([^>]*)face="([^>]*)">(.*?)<\/font>', 'gi'), '<span $1 style="font-family: $2;">$3</span>');
                html = html.replace(/<u/gi, '<span style="text-decoration: underline;"');
                if (this.browser.webkit) {
                    html = html.replace(new RegExp('<span class="Apple-style-span" style="font-weight: bold;">([^>]*)<\/span>', 'gi'), '<strong>$1</strong>');
                    html = html.replace(new RegExp('<span class="Apple-style-span" style="font-style: italic;">([^>]*)<\/span>', 'gi'), '<em>$1</em>');
                }
                html = html.replace(/\/u>/gi, '/span>');
                if (markup == 'css') {
                    html = html.replace(/<em([^>]*)>/gi, '<i$1>');
                    html = html.replace(/<\/em>/gi, '</i>');
                    html = html.replace(/<strong([^>]*)>/gi, '<b$1>');
                    html = html.replace(/<\/strong>/gi, '</b>');
                    html = html.replace(/<b/gi, '<span style="font-weight: bold;"');
                    html = html.replace(/\/b>/gi, '/span>');
                    html = html.replace(/<i/gi, '<span style="font-style: italic;"');
                    html = html.replace(/\/i>/gi, '/span>');
                }
                html = html.replace(/  /gi, ' '); //Replace all double spaces and replace with a single
            } else {
		        html = html.replace(/<u/gi, '<u');
		        html = html.replace(/\/u>/gi, '/u>');
            }
		    html = html.replace(/<ol([^>]*)>/gi, '<ol$1>');
		    html = html.replace(/\/ol>/gi, '/ol>');
		    html = html.replace(/<li/gi, '<li');
		    html = html.replace(/\/li>/gi, '/li>');
            html = this.filter_safari(html);

            html = this.filter_internals(html);

            html = this.filter_all_rgb(html);

            //Replace our backups with the real thing
            html = this.post_filter_linebreaks(html, markup);

            if (markup == 'xhtml') {
		        html = html.replace(/<YUI_IMG([^>]*)>/g, '<img $1 />');
		        html = html.replace(/<YUI_INPUT([^>]*)>/g, '<input $1 />');
            } else {
		        html = html.replace(/<YUI_IMG([^>]*)>/g, '<img $1>');
		        html = html.replace(/<YUI_INPUT([^>]*)>/g, '<input $1>');
            }
		    html = html.replace(/<YUI_UL([^>]*)>/g, '<ul$1>');
		    html = html.replace(/<\/YUI_UL>/g, '<\/ul>');

            html = this.filter_invalid_lists(html);

		    html = html.replace(/<YUI_BQ([^>]*)>/g, '<blockquote$1>');
		    html = html.replace(/<\/YUI_BQ>/g, '<\/blockquote>');

		    html = html.replace(/<YUI_EMBED([^>]*)>/g, '<embed$1>');
		    html = html.replace(/<\/YUI_EMBED>/g, '<\/embed>');
            
            //This should fix &amp;'s in URL's
            html = html.replace(/ &amp; /gi, ' YUI_AMP ');
            html = html.replace(/ &amp;/gi, ' YUI_AMP_F ');
            html = html.replace(/&amp; /gi, ' YUI_AMP_R ');
            html = html.replace(/&amp;/gi, '&');
            html = html.replace(/ YUI_AMP /gi, ' &amp; ');
            html = html.replace(/ YUI_AMP_F /gi, ' &amp;');
            html = html.replace(/ YUI_AMP_R /gi, '&amp; ');

            //Trim the output, removing whitespace from the beginning and end
            html = YAHOO.lang.trim(html);

            if (this.get('removeLineBreaks')) {
                html = html.replace(/\n/g, '').replace(/\r/g, '');
                html = html.replace(/  /gi, ' '); //Replace all double spaces and replace with a single
            }
            
            for (var v in this.invalidHTML) {
                if (YAHOO.lang.hasOwnProperty(this.invalidHTML, v)) {
                    if (Lang.isObject(v) && v.keepContents) {
                        html = html.replace(new RegExp('<' + v + '([^>]*)>(.*?)<\/' + v + '>', 'gi'), '$1');
                    } else {
                        html = html.replace(new RegExp('<' + v + '([^>]*)>(.*?)<\/' + v + '>', 'gi'), '');
                    }
                }
            }

            /* LATER -- Add DOM manipulation
            console.log(html);
            var frag = document.createDocumentFragment();
            frag.innerHTML = html;

            var ps = frag.getElementsByTagName('p'),
                len = ps.length;
            for (var i = 0; i < len; i++) {
                var ps2 = ps[i].getElementsByTagName('p');
                if (ps2.length) {
                    
                }
                
            }
            html = frag.innerHTML;
            console.log(html);
            */

            this.fireEvent('cleanHTML', { type: 'cleanHTML', target: this, html: html });

            return html;
        },
        /**
        * @method filter_msword
        * @param String html The HTML string to filter
        * @description Filters out msword html attributes and other junk. Activate with filterWord: true in config
        */
        filter_msword: function(html) {
            if (!this.get('filterWord')) {
                return html;
            }
            //Remove the ms o: tags
            html = html.replace(/<o:p>\s*<\/o:p>/g, '');
            html = html.replace(/<o:p>[\s\S]*?<\/o:p>/g, '&nbsp;');

            //Remove the ms w: tags
            html = html.replace( /<w:[^>]*>[\s\S]*?<\/w:[^>]*>/gi, '');

            //Remove mso-? styles.
            html = html.replace( /\s*mso-[^:]+:[^;"]+;?/gi, '');

            //Remove more bogus MS styles.
            html = html.replace( /\s*MARGIN: 0cm 0cm 0pt\s*;/gi, '');
            html = html.replace( /\s*MARGIN: 0cm 0cm 0pt\s*"/gi, "\"");
            html = html.replace( /\s*TEXT-INDENT: 0cm\s*;/gi, '');
            html = html.replace( /\s*TEXT-INDENT: 0cm\s*"/gi, "\"");
            html = html.replace( /\s*PAGE-BREAK-BEFORE: [^\s;]+;?"/gi, "\"");
            html = html.replace( /\s*FONT-VARIANT: [^\s;]+;?"/gi, "\"" );
            html = html.replace( /\s*tab-stops:[^;"]*;?/gi, '');
            html = html.replace( /\s*tab-stops:[^"]*/gi, '');

            //Remove XML declarations
            html = html.replace(/<\\?\?xml[^>]*>/gi, '');

            //Remove lang
            html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");

            //Remove language tags
            html = html.replace( /<(\w[^>]*) language=([^ |>]*)([^>]*)/gi, "<$1$3");

            //Remove onmouseover and onmouseout events (from MS Word comments effect)
            html = html.replace( /<(\w[^>]*) onmouseover="([^\"]*)"([^>]*)/gi, "<$1$3");
            html = html.replace( /<(\w[^>]*) onmouseout="([^\"]*)"([^>]*)/gi, "<$1$3");
            
            return html;
        },
        /**
        * @method filter_invalid_lists
        * @param String html The HTML string to filter
        * @description Filters invalid ol and ul list markup, converts this: <li></li><ol>..</ol> to this: <li></li><li><ol>..</ol></li>
        */
        filter_invalid_lists: function(html) {
            html = html.replace(/<\/li>\n/gi, '</li>');

            html = html.replace(/<\/li><ol>/gi, '</li><li><ol>');
            html = html.replace(/<\/ol>/gi, '</ol></li>');
            html = html.replace(/<\/ol><\/li>\n/gi, "</ol>");

            html = html.replace(/<\/li><ul>/gi, '</li><li><ul>');
            html = html.replace(/<\/ul>/gi, '</ul></li>');
            html = html.replace(/<\/ul><\/li>\n?/gi, "</ul>");

            html = html.replace(/<\/li>/gi, "</li>");
            html = html.replace(/<\/ol>/gi, "</ol>");
            html = html.replace(/<ol>/gi, "<ol>");
            html = html.replace(/<ul>/gi, "<ul>");
            return html;
        },
        /**
        * @method filter_safari
        * @param String html The HTML string to filter
        * @description Filters strings specific to Safari
        * @return String
        */
        filter_safari: function(html) {
            if (this.browser.webkit) {
                //<span class="Apple-tab-span" style="white-space:pre">	</span>
                html = html.replace(/<span class="Apple-tab-span" style="white-space:pre">([^>])<\/span>/gi, '&nbsp;&nbsp;&nbsp;&nbsp;');
                html = html.replace(/Apple-style-span/gi, '');
                html = html.replace(/style="line-height: normal;"/gi, '');
                html = html.replace(/yui-wk-div/gi, '');
                html = html.replace(/yui-wk-p/gi, '');


                //Remove bogus LI's
                html = html.replace(/<li><\/li>/gi, '');
                html = html.replace(/<li> <\/li>/gi, '');
                html = html.replace(/<li>  <\/li>/gi, '');
                //Remove bogus DIV's - updated from just removing the div's to replacing /div with a break
                if (this.get('ptags')) {
		            html = html.replace(/<div([^>]*)>/g, '<p$1>');
				    html = html.replace(/<\/div>/gi, '</p>');
                } else {
                    //html = html.replace(/<div>/gi, '<br>');
                    html = html.replace(/<div([^>]*)>([ tnr]*)<\/div>/gi, '<br>');
				    html = html.replace(/<\/div>/gi, '');
                }
            }
            return html;
        },
        /**
        * @method filter_internals
        * @param String html The HTML string to filter
        * @description Filters internal RTE strings and bogus attrs we don't want
        * @return String
        */
        filter_internals: function(html) {
		    html = html.replace(/\r/g, '');
            //Fix stuff we don't want
	        html = html.replace(/<\/?(body|head|html)[^>]*>/gi, '');
            //Fix last BR in LI
		    html = html.replace(/<YUI_BR><\/li>/gi, '</li>');

		    html = html.replace(/yui-tag-span/gi, '');
		    html = html.replace(/yui-tag/gi, '');
		    html = html.replace(/yui-non/gi, '');
		    html = html.replace(/yui-img/gi, '');
		    html = html.replace(/ tag="span"/gi, '');
		    html = html.replace(/ class=""/gi, '');
		    html = html.replace(/ style=""/gi, '');
		    html = html.replace(/ class=" "/gi, '');
		    html = html.replace(/ class="  "/gi, '');
		    html = html.replace(/ target=""/gi, '');
		    html = html.replace(/ title=""/gi, '');

            if (this.browser.ie) {
		        html = html.replace(/ class= /gi, '');
		        html = html.replace(/ class= >/gi, '');
            }
            
            return html;
        },
        /**
        * @method filter_all_rgb
        * @param String str The HTML string to filter
        * @description Converts all RGB color strings found in passed string to a hex color, example: style="color: rgb(0, 255, 0)" converts to style="color: #00ff00"
        * @return String
        */
        filter_all_rgb: function(str) {
            var exp = new RegExp("rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)", "gi");
            var arr = str.match(exp);
            if (Lang.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    var color = this.filter_rgb(arr[i]);
                    str = str.replace(arr[i].toString(), color);
                }
            }
            
            return str;
        },
        /**
        * @method filter_rgb
        * @param String css The CSS string containing rgb(#,#,#);
        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00
        * @return String
        */
        filter_rgb: function(css) {
            if (css.toLowerCase().indexOf('rgb') != -1) {
                var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi");
                var rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(',');
            
                if (rgb.length == 5) {
                    var r = parseInt(rgb[1], 10).toString(16);
                    var g = parseInt(rgb[2], 10).toString(16);
                    var b = parseInt(rgb[3], 10).toString(16);

                    r = r.length == 1 ? '0' + r : r;
                    g = g.length == 1 ? '0' + g : g;
                    b = b.length == 1 ? '0' + b : b;

                    css = "#" + r + g + b;
                }
            }
            return css;
        },
        /**
        * @method pre_filter_linebreaks
        * @param String html The HTML to filter
        * @param String markup The markup type to filter to
        * @description HTML Pre Filter
        * @return String
        */
        pre_filter_linebreaks: function(html, markup) {
            if (this.browser.webkit) {
		        html = html.replace(/<br class="khtml-block-placeholder">/gi, '<YUI_BR>');
		        html = html.replace(/<br class="webkit-block-placeholder">/gi, '<YUI_BR>');
            }
		    html = html.replace(/<br>/gi, '<YUI_BR>');
		    html = html.replace(/<br (.*?)>/gi, '<YUI_BR>');
		    html = html.replace(/<br\/>/gi, '<YUI_BR>');
		    html = html.replace(/<br \/>/gi, '<YUI_BR>');
		    html = html.replace(/<div><YUI_BR><\/div>/gi, '<YUI_BR>');
		    html = html.replace(/<p>(&nbsp;|&#160;)<\/p>/g, '<YUI_BR>');            
		    html = html.replace(/<p><br>&nbsp;<\/p>/gi, '<YUI_BR>');
		    html = html.replace(/<p>&nbsp;<\/p>/gi, '<YUI_BR>');
            //Fix last BR
	        html = html.replace(/<YUI_BR>$/, '');
            //Fix last BR in P
	        html = html.replace(/<YUI_BR><\/p>/g, '</p>');
            if (this.browser.ie) {
	            html = html.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, '\t');
            }
            return html;
        },
        /**
        * @method post_filter_linebreaks
        * @param String html The HTML to filter
        * @param String markup The markup type to filter to
        * @description HTML Pre Filter
        * @return String
        */
        post_filter_linebreaks: function(html, markup) {
            if (markup == 'xhtml') {
		        html = html.replace(/<YUI_BR>/g, '<br />');
            } else {
		        html = html.replace(/<YUI_BR>/g, '<br>');
            }
            return html;
        },
        /**
        * @method clearEditorDoc
        * @description Clear the doc of the Editor
        */
        clearEditorDoc: function() {
            this._getDoc().body.innerHTML = '&nbsp;';
        },
        /**
        * @method openWindow
        * @description Override Method for Advanced Editor
        */
        openWindow: function(win) {
        },
        /**
        * @method moveWindow
        * @description Override Method for Advanced Editor
        */
        moveWindow: function() {
        },
        /**
        * @private
        * @method _closeWindow
        * @description Override Method for Advanced Editor
        */
        _closeWindow: function() {
        },
        /**
        * @method closeWindow
        * @description Override Method for Advanced Editor
        */
        closeWindow: function() {
            //this.unsubscribeAll('afterExecCommand');
            this.toolbar.resetAllButtons();
            this.focus();        
        },
        /**
        * @method destroy
        * @description Destroys the editor, all of it's elements and objects.
        * @return {Boolean}
        */
        destroy: function() {
            if (this._nodeChangeDelayTimer) {
                clearTimeout(this._nodeChangeDelayTimer);
            }
            this.hide();
        
            if (this.resize) {
                this.resize.destroy();
            }
            if (this.dd) {
                this.dd.unreg();
            }
            if (this.get('panel')) {
                this.get('panel').destroy();
            }
            this.saveHTML();
            this.toolbar.destroy();
            this.setStyle('visibility', 'visible');
            this.setStyle('position', 'static');
            this.setStyle('top', '');
            this.setStyle('left', '');
            var textArea = this.get('element');
            this.get('element_cont').get('parentNode').replaceChild(textArea, this.get('element_cont').get('element'));
            this.get('element_cont').get('element').innerHTML = '';
            this.set('handleSubmit', false); //Remove the submit handler
            return true;
        },        
        /**
        * @method toString
        * @description Returns a string representing the editor.
        * @return {String}
        */
        toString: function() {
            var str = 'SimpleEditor';
            if (this.get && this.get('element_cont')) {
                str = 'SimpleEditor (#' + this.get('element_cont').get('id') + ')' + ((this.get('disabled') ? ' Disabled' : ''));
            }
            return str;
        }
    });

/**
* @event toolbarLoaded
* @description Event is fired during the render process directly after the Toolbar is loaded. Allowing you to attach events to the toolbar. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event cleanHTML
* @description Event is fired after the cleanHTML method is called.
* @type YAHOO.util.CustomEvent
*/
/**
* @event afterRender
* @description Event is fired after the render process finishes. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorContentLoaded
* @description Event is fired after the editor iframe's document fully loads and fires it's onload event. From here you can start injecting your own things into the document. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeNodeChange
* @description Event fires at the beginning of the nodeChange process. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event afterNodeChange
* @description Event fires at the end of the nodeChange process. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeExecCommand
* @description Event fires at the beginning of the execCommand process. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event afterExecCommand
* @description Event fires at the end of the execCommand process. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorMouseUp
* @param {Event} ev The DOM Event that occured
* @description Passed through HTML Event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorMouseDown
* @param {Event} ev The DOM Event that occured
* @description Passed through HTML Event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorDoubleClick
* @param {Event} ev The DOM Event that occured
* @description Passed through HTML Event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorClick
* @param {Event} ev The DOM Event that occured
* @description Passed through HTML Event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorKeyUp
* @param {Event} ev The DOM Event that occured
* @description Passed through HTML Event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorKeyPress
* @param {Event} ev The DOM Event that occured
* @description Passed through HTML Event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorKeyDown
* @param {Event} ev The DOM Event that occured
* @description Passed through HTML Event. See <a href="YAHOO.util.Element.html#addListener">Element.addListener</a> for more information on listening for this event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeEditorMouseUp
* @param {Event} ev The DOM Event that occured
* @description Fires before editor event, returning false will stop the internal processing.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeEditorMouseDown
* @param {Event} ev The DOM Event that occured
* @description Fires before editor event, returning false will stop the internal processing.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeEditorDoubleClick
* @param {Event} ev The DOM Event that occured
* @description Fires before editor event, returning false will stop the internal processing.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeEditorClick
* @param {Event} ev The DOM Event that occured
* @description Fires before editor event, returning false will stop the internal processing.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeEditorKeyUp
* @param {Event} ev The DOM Event that occured
* @description Fires before editor event, returning false will stop the internal processing.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeEditorKeyPress
* @param {Event} ev The DOM Event that occured
* @description Fires before editor event, returning false will stop the internal processing.
* @type YAHOO.util.CustomEvent
*/
/**
* @event beforeEditorKeyDown
* @param {Event} ev The DOM Event that occured
* @description Fires before editor event, returning false will stop the internal processing.
* @type YAHOO.util.CustomEvent
*/

/**
* @event editorWindowFocus
* @description Fires when the iframe is focused. Note, this is window focus event, not an Editor focus event.
* @type YAHOO.util.CustomEvent
*/
/**
* @event editorWindowBlur
* @description Fires when the iframe is blurred. Note, this is window blur event, not an Editor blur event.
* @type YAHOO.util.CustomEvent
*/


/**
 * @description Singleton object used to track the open window objects and panels across the various open editors
 * @class EditorInfo
 * @static
*/
YAHOO.widget.EditorInfo = {
    /**
    * @private
    * @property _instances
    * @description A reference to all editors on the page.
    * @type Object
    */
    _instances: {},
    /**
    * @private
    * @property blankImage
    * @description A reference to the blankImage url
    * @type String 
    */
    blankImage: '',
    /**
    * @private
    * @property window
    * @description A reference to the currently open window object in any editor on the page.
    * @type Object <a href="YAHOO.widget.EditorWindow.html">YAHOO.widget.EditorWindow</a>
    */
    window: {},
    /**
    * @private
    * @property panel
    * @description A reference to the currently open panel in any editor on the page.
    * @type Object <a href="YAHOO.widget.Overlay.html">YAHOO.widget.Overlay</a>
    */
    panel: null,
    /**
    * @method getEditorById
    * @description Returns a reference to the Editor object associated with the given textarea
    * @param {String/HTMLElement} id The id or reference of the textarea to return the Editor instance of
    * @return Object <a href="YAHOO.widget.Editor.html">YAHOO.widget.Editor</a>
    */
    getEditorById: function(id) {
        if (!YAHOO.lang.isString(id)) {
            //Not a string, assume a node Reference
            id = id.id;
        }
        if (this._instances[id]) {
            return this._instances[id];
        }
        return false;
    },
    /**
    * @method saveAll
    * @description Saves all Editor instances on the page. If a form reference is passed, only Editor's bound to this form will be saved.
    * @param {HTMLElement} form The form to check if this Editor instance belongs to
    */
    saveAll: function(form) {
        var i, e, items = YAHOO.widget.EditorInfo._instances;
        if (form) {
            for (i in items) {
                if (Lang.hasOwnProperty(items, i)) {
                    e = items[i];
                    if (e.get('element').form && (e.get('element').form == form)) {
                        e.saveHTML();
                    }
                }
            }
        } else {
            for (i in items) {
                if (Lang.hasOwnProperty(items, i)) {
                    items[i].saveHTML();
                }
            }
        }
    },
    /**
    * @method toString
    * @description Returns a string representing the EditorInfo.
    * @return {String}
    */
    toString: function() {
        var len = 0;
        for (var i in this._instances) {
            if (Lang.hasOwnProperty(this._instances, i)) {
                len++;
            }
        }
        return 'Editor Info (' + len + ' registered intance' + ((len > 1) ? 's' : '') + ')';
    }
};



    
})();
YAHOO.register("simpleeditor", YAHOO.widget.SimpleEditor, {version: "2.8.2r1", build: "7"});
