YAHOO.env.classMap = {"WireIt.Container": "WireIt", "inputEx.WireIt.Layout.Spring": "layout-plugin", "WireIt.WiringEditor": "editor-plugin", "WireIt.Layer": "WireIt", "WireIt.Group": "grouping-plugin", "WireIt.Grouper": "grouping-plugin", "WireIt.Wire": "WireIt", "WireIt.util.Anim": "animations-plugin", "WireIt.TerminalProxy": "WireIt", "WireIt.WiringEditor.adapters.JsonRpc": "editor-plugin", "WireIt.CanvasElement": "WireIt", "WireIt.Scissors": "WireIt", "WireIt.BaseEditor": "editor-plugin", "WireIt.WiringEditor.adapters.Ajax": "editor-plugin", "WireIt.util.ComposedContainer": "composable-plugin", "WireIt.util.DDResize": "WireIt", "WireIt.util.TerminalOutput": "WireIt", "WireIt.util.DD": "WireIt", "inputEx.Field": "inputex-plugin", "WireIt.GroupUtils": "grouping-plugin", "WireIt.util.InOutContainer": "WireIt", "WireIt.RubberBand": "grouping-plugin", "WireIt.Terminal": "WireIt", "WireIt.util.ImageContainer": "WireIt", "WireIt.WiringEditor.adapters.Gears": "editor-plugin", "WireIt.util.ComposableWiringEditor": "composable-plugin", "inputEx.BaseField": "inputex-plugin", "WireIt.WireIt": "WireIt", "WireIt.ModuleProxy": "editor-plugin", "WireIt.FormContainer": "inputex-plugin", "WireIt.LayerMap": "WireIt", "WireIt.util.TerminalInput": "WireIt"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
