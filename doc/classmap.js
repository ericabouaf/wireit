YAHOO.env.classMap = {"WireIt.Container": "WireIt", "WireIt": "WireIt", "WireIt.CanvasElement": "WireIt", "inputEx.BaseField": "WireIt", "WireIt.util.DD": "WireIt", "WireIt.Scissors": "WireIt", "WireIt.util.TerminalOutput": "WireIt", "WireIt.Layer": "WireIt", "WireIt.LayerMap": "WireIt", "WireIt.util.DDResize": "WireIt", "WireIt.Wire": "WireIt", "WireIt.util.Anim": "WireIt", "inputEx.Field": "WireIt", "WireIt.Terminal": "WireIt", "WireIt.util.TerminalInput": "WireIt", "WireIt.TerminalProxy": "WireIt", "WireIt.FormContainer": "WireIt"};

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
