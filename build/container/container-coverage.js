if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/container/container.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/container/container.js",
    code: []
};
_yuitest_coverage["build/container/container.js"].code=["YUI.add('container', function (Y, NAME) {","","    'use strict';","","/**"," * @module container"," */","","/**"," * Container is an Overlay (XY positioning)"," * It is a WidgetChild (belongs to Layer)"," * It is also a WidgetParent (has many terminals)"," * @class Container"," * @extends ContainerBase"," */","    Y.Container = Y.Base.create(\"container\", Y.ContainerBase, [Y.WidgetIcons], {","        /**","         * Click handler for the close icon","         * @method _onCloseClick","         * @private","         */","        _onCloseClick: function () {","            this.destroy();","        }","","    }, {","","        ATTRS: {","            /**","             * Override the default value of WidgetIcons to add the close button","             * @attribute icons","             */","            icons: {","                value: [","                    {title: 'close', click: '_onCloseClick', className: 'ui-silk ui-silk-cancel'}","                ]","            }","        }","    });","","","","}, '@VERSION@', {\"requires\": [\"container-base\", \"widget-icons\"], \"skinnable\": true});"];
_yuitest_coverage["build/container/container.js"].lines = {"1":0,"3":0,"16":0,"23":0};
_yuitest_coverage["build/container/container.js"].functions = {"_onCloseClick:22":0,"(anonymous 1):1":0};
_yuitest_coverage["build/container/container.js"].coveredLines = 4;
_yuitest_coverage["build/container/container.js"].coveredFunctions = 2;
_yuitest_coverline("build/container/container.js", 1);
YUI.add('container', function (Y, NAME) {

    _yuitest_coverfunc("build/container/container.js", "(anonymous 1)", 1);
_yuitest_coverline("build/container/container.js", 3);
'use strict';

/**
 * @module container
 */

/**
 * Container is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class Container
 * @extends ContainerBase
 */
    _yuitest_coverline("build/container/container.js", 16);
Y.Container = Y.Base.create("container", Y.ContainerBase, [Y.WidgetIcons], {
        /**
         * Click handler for the close icon
         * @method _onCloseClick
         * @private
         */
        _onCloseClick: function () {
            _yuitest_coverfunc("build/container/container.js", "_onCloseClick", 22);
_yuitest_coverline("build/container/container.js", 23);
this.destroy();
        }

    }, {

        ATTRS: {
            /**
             * Override the default value of WidgetIcons to add the close button
             * @attribute icons
             */
            icons: {
                value: [
                    {title: 'close', click: '_onCloseClick', className: 'ui-silk ui-silk-cancel'}
                ]
            }
        }
    });



}, '@VERSION@', {"requires": ["container-base", "widget-icons"], "skinnable": true});
