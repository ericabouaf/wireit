/**
 * Utility to run inputEx examples
 */

// Required for the ListField
inputEx.spacerUrl = "../images/space.gif";

YAHOO.util.Event.onDOMReady(function() {
	var examples = YAHOO.util.Dom.getElementsByClassName('JScript');
	for(var i = 0 ; i < examples.length ; i++) {
		var textarea = examples[i];
		try {
			eval(textarea.innerHTML);
		}
		catch(ex) {
			if(console) {
				console.log("Error while executing example "+(i+1), ex);
			}
		}
	}
   dp.SyntaxHighlighter.HighlightAll('code');
});
