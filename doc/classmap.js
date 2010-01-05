YAHOO.env.classMap = {"WireIt.Container": "WireIt", "WireIt.util.Anim": "WireIt", "WireIt.WiringEditor": "WireIt", "WireIt.Layer": "WireIt", "WireIt.Wire": "WireIt", "WireIt.util.DD": "WireIt", "WireIt.TerminalProxy": "WireIt", "WireIt.WiringEditor.adapters.JsonRpc": "WireIt", "WireIt.CanvasElement": "WireIt", "WireIt.Scissors": "WireIt", "WireIt.BaseEditor": "WireIt", "WireIt.WiringEditor.adapters.Ajax": "WireIt", "inputEx.Field": "WireIt", "WireIt.util.DDResize": "WireIt", "WireIt.util.TerminalOutput": "WireIt", "WireIt.InOutContainer": "WireIt", "WireIt.ImageContainer": "WireIt", "WireIt.Terminal": "WireIt", "WireIt.WiringEditor.adapters.Gears": "WireIt", "inputEx.BaseField": "WireIt", "WireIt.WireIt": "WireIt", "WireIt.ModuleProxy": "WireIt", "WireIt.FormContainer": "WireIt", "WireIt.LayerMap": "WireIt", "WireIt.util.TerminalInput": "WireIt"};

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
