/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
YAHOO.namespace("widget");

(function () {
	
	var version = 0;
	var UA = YAHOO.env.ua;
	var sF = "ShockwaveFlash";

	 	if (UA.gecko || UA.webkit || UA.opera) {
			   if ((mF = navigator.mimeTypes['application/x-shockwave-flash'])) {
			      if ((eP = mF.enabledPlugin)) {
					 var vS = [];
			         vS = eP.description.replace(/\s[rd]/g, '.').replace(/[A-Za-z\s]+/g, '').split('.');
			        version = vS[0] + '.';
					switch((vS[2].toString()).length)
					{
						case 1:
						version += "00";
						break;
						case 2: 
						version += "0";
						break;
					}
			 		version +=  vS[2];
					version = parseFloat(version);
			      }
			   }
			}
			else if(UA.ie) {
			    try
			    {
			        var ax6 = new ActiveXObject(sF + "." + sF + ".6");
			        ax6.AllowScriptAccess = "always";
			    }
			    catch(e)
			    {
			        if(ax6 != null)
			        {
			            version = 6.0;
			        }
			    }
			    if (version == 0) {
			    try
			    {
			        var ax  = new ActiveXObject(sF + "." + sF);
			       	var vS = [];
			        vS = ax.GetVariable("$version").replace(/[A-Za-z\s]+/g, '').split(',');
			        version = vS[0] + '.';
					switch((vS[2].toString()).length)
					{
						case 1:
						version += "00";
						break;
						case 2: 
						version += "0";
						break;
					}
			 		version +=  vS[2];
					version = parseFloat(version);

			    } catch (e) {}
			    }
			}

			UA.flash = version;

	YAHOO.util.SWFDetect = {		
			getFlashVersion : function () {
				return version;
			},

			isFlashVersionAtLeast : function (ver) {
				return version >= ver;
			}	
		};	
	
	var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        SWFDetect = YAHOO.util.SWFDetect,
        Lang = YAHOO.lang,

		// private
		FLASH_CID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
		FLASH_TYPE = "application/x-shockwave-flash",
		FLASH_VER = "10.22",
		EXPRESS_INSTALL_URL = "http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?" + Math.random(),
		EVENT_HANDLER = "YAHOO.widget.SWF.eventHandler",
		possibleAttributes = {align:"", allowNetworking:"", allowScriptAccess:"", base:"", bgcolor:"", menu:"", name:"", quality:"", salign:"", scale:"", tabindex:"", wmode:""};
		
		/**
		 * The SWF utility is a tool for embedding Flash applications in HTMl pages.
		 * @module swf
		 * @title SWF Utility
		 * @requires yahoo, dom, event
		 * @namespace YAHOO.widget
		 */

		/**
		 * Creates the SWF instance and keeps the configuration data
		 *
		 * @class SWF
		 * @extends YAHOO.util.Element
		 * @constructor
		 * @param {String|HTMLElement} id The id of the element, or the element itself that the SWF will be inserted into.  
		 *        The width and height of the SWF will be set to the width and height of this container element.
		 * @param {String} swfURL The URL of the SWF to be embedded into the page.
		 * @param {Object} p_oAttributes (optional) Configuration parameters for the Flash application and values for Flashvars
		 *        to be passed to the SWF.
		 */
				
YAHOO.widget.SWF = function (p_oElement /*:String*/, swfURL /*:String*/, p_oAttributes /*:Object*/ ) {
	
	this._queue = this._queue || [];
	this._events = this._events || {};
	this._configs = this._configs || {};
	
	/**
     * The DOM id of this instance of the element. Automatically generated.
     * @property _id
     * @type String
     */
	this._id = Dom.generateId(null, "yuiswf");
	
	var _id = this._id;
    var oElement = Dom.get(p_oElement);
	var flashVersion = (p_oAttributes["version"] || FLASH_VER);
	var isFlashVersionRight = SWFDetect.isFlashVersionAtLeast(flashVersion);
	var canExpressInstall = (UA.flash >= 8.0);
	var shouldExpressInstall = canExpressInstall && !isFlashVersionRight && p_oAttributes["useExpressInstall"];
	var flashURL = (shouldExpressInstall)?EXPRESS_INSTALL_URL:swfURL;
	var objstring = '<object ';
	var w, h;
	var flashvarstring = "YUISwfId=" + _id + "&YUIBridgeCallback=" + EVENT_HANDLER + "&";
	
	YAHOO.widget.SWF._instances[_id] = this;

    if (oElement && (isFlashVersionRight || shouldExpressInstall) && flashURL) {
				objstring += 'id="' + _id + '" '; 
				if (UA.ie) {
					objstring += 'classid="' + FLASH_CID + '" '
				}
				else {
					objstring += 'type="' + FLASH_TYPE + '" data="' + flashURL + '" ';
				}
				
                w = "100%";
				h = "100%";
				
				objstring += 'width="' + w + '" height="' + h + '">';
				
				if (UA.ie) {
					objstring += '<param name="movie" value="' + flashURL + '"/>';
				}
				
				for (var attribute in p_oAttributes.fixedAttributes) {
					if (possibleAttributes.hasOwnProperty(attribute)) {
						objstring += '<param name="' + attribute + '" value="' + p_oAttributes.fixedAttributes[attribute] + '"/>';
					}
				}

				for (var flashvar in p_oAttributes.flashVars) {
					var fvar = p_oAttributes.flashVars[flashvar];
					if (Lang.isString(fvar)) {
						flashvarstring += "&" + flashvar + "=" + encodeURIComponent(fvar);
					}
				}
				
				if (flashvarstring) {
					objstring += '<param name="flashVars" value="' + flashvarstring + '"/>';
				}
				
				objstring += "</object>"; 

				oElement.innerHTML = objstring;
			}
			
			YAHOO.widget.SWF.superclass.constructor.call(this, Dom.get(_id));
			this._swf = Dom.get(_id);	
};

/**
 * The static collection of all instances of the SWFs on the page.
 * @property _instances
 * @private
 * @type Object
 */

YAHOO.widget.SWF._instances = YAHOO.widget.SWF._instances || {};

/**
 * Handles an event coming from within the SWF and delegate it
 * to a specific instance of SWF.
 * @method eventHandler
 * @param swfid {String} the id of the SWF dispatching the event
 * @param event {Object} the event being transmitted.
 * @private
 */
YAHOO.widget.SWF.eventHandler = function (swfid, event) {
	YAHOO.widget.SWF._instances[swfid]._eventHandler(event);
};

YAHOO.extend(YAHOO.widget.SWF, YAHOO.util.Element, {
	_eventHandler: function(event)
	{
		if (event.type == "swfReady") {
			this.createEvent("swfReady");
	     	this.fireEvent("swfReady", event);
        }
        else {
	        this.fireEvent(event.type, event);
        } 
	},	
	/**
	 * Calls a specific function exposed by the SWF's
	 * ExternalInterface.
	 * @method callSWF
	 * @param func {String} the name of the function to call
	 * @param args {Object} the set of arguments to pass to the function.
	 */
	callSWF: function (func, args)
	{
		if (this._swf[func]) {
		return(this._swf[func].apply(this._swf, args));
	    } else {
		return null;
	    }
	}
});

	
})();
YAHOO.register("swf", YAHOO.widget.SWF, {version: "2.8.2r1", build: "7"});
