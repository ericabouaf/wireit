/**
 * @module inputex-tinymce
 */
YUI.add("inputex-tinymce", function (Y) {

    var lang = Y.Lang,
        inputEx = Y.inputEx;

    /**
     * Wrapper for the TinyMCE Editor
     * @class inputEx.TinyMCEField
     * @extends inputEx.Field
     * @constructor
     * @param {Object} options Added options:
     * <ul>
     *   <li>opts: the options to be added when calling the TinyMCE constructor</li>
     * </ul>
     */
    inputEx.TinyMCEField = function (options) {
        if (!window.tinymce) {
            alert("TinyMCE was not found on this page !");
        }
        inputEx.TinyMCEField.superclass.constructor.call(this, options);
    };
    Y.extend(inputEx.TinyMCEField, inputEx.Field, {

        defaultOpts: {
            mode: "textareas",
            language: "en",
            theme: "advanced",

            plugins: "paste", // past plugin for raw text pasting
            paste_auto_cleanup_on_paste: true,
            paste_remove_styles: true,
            paste_remove_styles_if_webkit: true,
            paste_strip_class_attributes: true,
            theme_advanced_buttons1: "formatselect,fontselect,fontsizeselect,|,bold,italic,underline,strikethrough,|,forecolor,backcolor",
            theme_advanced_buttons2: "justifyleft,justifycenter,justifyright,justifyfull,|,outdent,indent,blockquote,hr,|,bullist,numlist,|,link,unlink,image,|,removeformat,code,|,undo,redo",
            theme_advanced_buttons3: "",
            theme_advanced_toolbar_location: "top",
            theme_advanced_toolbar_align: "left",
            height: "200",
            verify_html: true,
            cleanup_on_startup: true,
            cleanup: true
        },

        /**
         * Set the default values of the options
         * @method setOptions
         * @param {Object} options Options object as passed to the constructor
         */
        setOptions: function (options) {
            inputEx.TinyMCEField.superclass.setOptions.call(this, options);

            this.options.opts = options.opts || this.defaultOpts;
        },

        /**
         * Render the field using the YUI Editor widget
         * @method renderComponent
         */
        renderComponent: function () {
            if (!inputEx.TinyMCEfieldsNumber) {
                inputEx.TinyMCEfieldsNumber = 0;
            }

            var id = "inputEx-TinyMCEField-" + inputEx.TinyMCEfieldsNumber;
            this.id = id;
            var attributes = {
                id: id,
                className: "mceAdvanced"
            };
            if (this.options.name) {
                attributes.name = this.options.name;
            }

            this.el = inputEx.cn('textarea', attributes);

            inputEx.TinyMCEfieldsNumber += 1;
            this.fieldContainer.appendChild(this.el);

            this.editor = new tinymce.Editor(this.id, this.options.opts);

            // this place the render phase of the component after
            Y.later(0,this,function(){
                this.editor.render();
            });
        },

        /**
         * Set the html content
         * @method setValue
         * @param {String} value The html string
         * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the 'updated' event or not (default is true, pass false to NOT send the event)
         */
        setValue: function (value, sendUpdatedEvt) {

            var editor = tinymce.get(this.id);

             if (editor && editor.initialized) {
                editor.setContent(value, {
                    format: 'raw'
                });
            } else {
                this.editor.onInit.add(function (ed) {
                    ed.setContent(value, {
                        format: 'raw'
                    });
                });
            }

            if (sendUpdatedEvt !== false) {
                // fire update event
                this.fireUpdatedEvt();
            }
        },

        /**
         * Get the html string
         * @method getValue
         * @return {String} the html string
         */
        getValue: function () {

            var editor = tinymce.get(this.id);

            if (editor && editor.initialized) {
                return editor.getContent();
            } else {
                return null;
            }
        },
        
        /**
         * @method getText
         */
        getText: function () {

            var editor = tinymce.get(this.id);

            if (editor && editor.initialized) {
                return editor.getContent({format : "raw"});
            } else {
                return null;
            }
        }


    });

    // Register this class as "tinymce" type
    inputEx.registerType("tinymce", inputEx.TinyMCEField, []);

}, '3.1.0', {
    requires: ["inputex-field"]
});