/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The LogMsg class defines a single log message.
 *
 * @class LogMsg
 * @constructor
 * @param oConfigs {Object} Object literal of configuration params.
 */
YAHOO.widget.LogMsg = function(oConfigs) {
    // Parse configs
    /**
     * Log message.
     *
     * @property msg
     * @type String
     */
    this.msg =
    /**
     * Log timestamp.
     *
     * @property time
     * @type Date
     */
    this.time =

    /**
     * Log category.
     *
     * @property category
     * @type String
     */
    this.category =

    /**
     * Log source. The first word passed in as the source argument.
     *
     * @property source
     * @type String
     */
    this.source =

    /**
     * Log source detail. The remainder of the string passed in as the source argument, not
     * including the first word (if any).
     *
     * @property sourceDetail
     * @type String
     */
    this.sourceDetail = null;

    if (oConfigs && (oConfigs.constructor == Object)) {
        for(var param in oConfigs) {
            if (oConfigs.hasOwnProperty(param)) {
                this[param] = oConfigs[param];
            }
        }
    }
};
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The LogWriter class provides a mechanism to log messages through
 * YAHOO.widget.Logger from a named source.
 *
 * @class LogWriter
 * @constructor
 * @param sSource {String} Source of LogWriter instance.
 */
YAHOO.widget.LogWriter = function(sSource) {
    if(!sSource) {
        YAHOO.log("Could not instantiate LogWriter due to invalid source.",
            "error", "LogWriter");
        return;
    }
    this._source = sSource;
 };

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

 /**
 * Public accessor to the unique name of the LogWriter instance.
 *
 * @method toString
 * @return {String} Unique name of the LogWriter instance.
 */
YAHOO.widget.LogWriter.prototype.toString = function() {
    return "LogWriter " + this._sSource;
};

/**
 * Logs a message attached to the source of the LogWriter.
 *
 * @method log
 * @param sMsg {String} The log message.
 * @param sCategory {String} Category name.
 */
YAHOO.widget.LogWriter.prototype.log = function(sMsg, sCategory) {
    YAHOO.widget.Logger.log(sMsg, sCategory, this._source);
};

/**
 * Public accessor to get the source name.
 *
 * @method getSource
 * @return {String} The LogWriter source.
 */
YAHOO.widget.LogWriter.prototype.getSource = function() {
    return this._source;
};

/**
 * Public accessor to set the source name.
 *
 * @method setSource
 * @param sSource {String} Source of LogWriter instance.
 */
YAHOO.widget.LogWriter.prototype.setSource = function(sSource) {
    if(!sSource) {
        YAHOO.log("Could not set source due to invalid source.", "error", this.toString());
        return;
    }
    else {
        this._source = sSource;
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Source of the LogWriter instance.
 *
 * @property _source
 * @type String
 * @private
 */
YAHOO.widget.LogWriter.prototype._source = null;



 /**
 * The Logger widget provides a simple way to read or write log messages in
 * JavaScript code. Integration with the YUI Library's debug builds allow
 * implementers to access under-the-hood events, errors, and debugging messages.
 * Output may be read through a LogReader console and/or output to a browser
 * console.
 *
 * @module logger
 * @requires yahoo, event, dom
 * @optional dragdrop
 * @namespace YAHOO.widget
 * @title Logger Widget
 */

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

// Define once
if(!YAHOO.widget.Logger) {
    /**
     * The singleton Logger class provides core log management functionality. Saves
     * logs written through the global YAHOO.log function or written by a LogWriter
     * instance. Provides access to logs for reading by a LogReader instance or
     * native browser console such as the Firebug extension to Firefox or Safari's
     * JavaScript console through integration with the console.log() method.
     *
     * @class Logger
     * @static
     */
    YAHOO.widget.Logger = {
        // Initialize properties
        loggerEnabled: true,
        _browserConsoleEnabled: false,
        categories: ["info","warn","error","time","window"],
        sources: ["global"],
        _stack: [], // holds all log msgs
        maxStackEntries: 2500,
        _startTime: new Date().getTime(), // static start timestamp
        _lastTime: null, // timestamp of last logged message
        _windowErrorsHandled: false,
        _origOnWindowError: null
    };

    /////////////////////////////////////////////////////////////////////////////
    //
    // Public properties
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * True if Logger is enabled, false otherwise.
     *
     * @property loggerEnabled
     * @type Boolean
     * @static
     * @default true
     */

    /**
     * Array of categories.
     *
     * @property categories
     * @type String[]
     * @static
     * @default ["info","warn","error","time","window"]
     */

    /**
     * Array of sources.
     *
     * @property sources
     * @type String[]
     * @static
     * @default ["global"]
     */

    /**
     * Upper limit on size of internal stack.
     *
     * @property maxStackEntries
     * @type Number
     * @static
     * @default 2500
     */

    /////////////////////////////////////////////////////////////////////////////
    //
    // Private properties
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Internal property to track whether output to browser console is enabled.
     *
     * @property _browserConsoleEnabled
     * @type Boolean
     * @static
     * @default false
     * @private
     */

    /**
     * Array to hold all log messages.
     *
     * @property _stack
     * @type Array
     * @static
     * @private
     */
    /**
     * Static timestamp of Logger initialization.
     *
     * @property _startTime
     * @type Date
     * @static
     * @private
     */
    /**
     * Timestamp of last logged message.
     *
     * @property _lastTime
     * @type Date
     * @static
     * @private
     */
    /////////////////////////////////////////////////////////////////////////////
    //
    // Public methods
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Saves a log message to the stack and fires newLogEvent. If the log message is
     * assigned to an unknown category, creates a new category. If the log message is
     * from an unknown source, creates a new source.  If browser console is enabled,
     * outputs the log message to browser console.
     *
     * @method log
     * @param sMsg {String} The log message.
     * @param sCategory {String} Category of log message, or null.
     * @param sSource {String} Source of LogWriter, or null if global.
     */
    YAHOO.widget.Logger.log = function(sMsg, sCategory, sSource) {
        if(this.loggerEnabled) {
            if(!sCategory) {
                sCategory = "info"; // default category
            }
            else {
                sCategory = sCategory.toLocaleLowerCase();
                if(this._isNewCategory(sCategory)) {
                    this._createNewCategory(sCategory);
                }
            }
            var sClass = "global"; // default source
            var sDetail = null;
            if(sSource) {
                var spaceIndex = sSource.indexOf(" ");
                if(spaceIndex > 0) {
                    // Substring until first space
                    sClass = sSource.substring(0,spaceIndex);
                    // The rest of the source
                    sDetail = sSource.substring(spaceIndex,sSource.length);
                }
                else {
                    sClass = sSource;
                }
                if(this._isNewSource(sClass)) {
                    this._createNewSource(sClass);
                }
            }

            var timestamp = new Date();
            var logEntry = new YAHOO.widget.LogMsg({
                msg: sMsg,
                time: timestamp,
                category: sCategory,
                source: sClass,
                sourceDetail: sDetail
            });

            var stack = this._stack;
            var maxStackEntries = this.maxStackEntries;
            if(maxStackEntries && !isNaN(maxStackEntries) &&
                (stack.length >= maxStackEntries)) {
                stack.shift();
            }
            stack.push(logEntry);
            this.newLogEvent.fire(logEntry);

            if(this._browserConsoleEnabled) {
                this._printToBrowserConsole(logEntry);
            }
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Resets internal stack and startTime, enables Logger, and fires logResetEvent.
     *
     * @method reset
     */
    YAHOO.widget.Logger.reset = function() {
        this._stack = [];
        this._startTime = new Date().getTime();
        this.loggerEnabled = true;
        this.log("Logger reset");
        this.logResetEvent.fire();
    };

    /**
     * Public accessor to internal stack of log message objects.
     *
     * @method getStack
     * @return {Object[]} Array of log message objects.
     */
    YAHOO.widget.Logger.getStack = function() {
        return this._stack;
    };

    /**
     * Public accessor to internal start time.
     *
     * @method getStartTime
     * @return {Date} Internal date of when Logger singleton was initialized.
     */
    YAHOO.widget.Logger.getStartTime = function() {
        return this._startTime;
    };

    /**
     * Disables output to the browser's global console.log() function, which is used
     * by the Firebug extension to Firefox as well as Safari.
     *
     * @method disableBrowserConsole
     */
    YAHOO.widget.Logger.disableBrowserConsole = function() {
        YAHOO.log("Logger output to the function console.log() has been disabled.");
        this._browserConsoleEnabled = false;
    };

    /**
     * Enables output to the browser's global console.log() function, which is used
     * by the Firebug extension to Firefox as well as Safari.
     *
     * @method enableBrowserConsole
     */
    YAHOO.widget.Logger.enableBrowserConsole = function() {
        this._browserConsoleEnabled = true;
        YAHOO.log("Logger output to the function console.log() has been enabled.");
    };

    /**
     * Surpresses native JavaScript errors and outputs to console. By default,
     * Logger does not handle JavaScript window error events.
     * NB: Not all browsers support the window.onerror event.
     *
     * @method handleWindowErrors
     */
    YAHOO.widget.Logger.handleWindowErrors = function() {
        if(!YAHOO.widget.Logger._windowErrorsHandled) {
            // Save any previously defined handler to call
            if(window.error) {
                YAHOO.widget.Logger._origOnWindowError = window.onerror;
            }
            window.onerror = YAHOO.widget.Logger._onWindowError;
            YAHOO.widget.Logger._windowErrorsHandled = true;
            YAHOO.log("Logger handling of window.onerror has been enabled.");
        }
        else {
            YAHOO.log("Logger handling of window.onerror had already been enabled.");
        }
    };

    /**
     * Unsurpresses native JavaScript errors. By default,
     * Logger does not handle JavaScript window error events.
     * NB: Not all browsers support the window.onerror event.
     *
     * @method unhandleWindowErrors
     */
    YAHOO.widget.Logger.unhandleWindowErrors = function() {
        if(YAHOO.widget.Logger._windowErrorsHandled) {
            // Revert to any previously defined handler to call
            if(YAHOO.widget.Logger._origOnWindowError) {
                window.onerror = YAHOO.widget.Logger._origOnWindowError;
                YAHOO.widget.Logger._origOnWindowError = null;
            }
            else {
                window.onerror = null;
            }
            YAHOO.widget.Logger._windowErrorsHandled = false;
            YAHOO.log("Logger handling of window.onerror has been disabled.");
        }
        else {
            YAHOO.log("Logger handling of window.onerror had already been disabled.");
        }
    };
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // Public events
    //
    /////////////////////////////////////////////////////////////////////////////

     /**
     * Fired when a new category has been created.
     *
     * @event categoryCreateEvent
     * @param sCategory {String} Category name.
     */
    YAHOO.widget.Logger.categoryCreateEvent =
        new YAHOO.util.CustomEvent("categoryCreate", this, true);

     /**
     * Fired when a new source has been named.
     *
     * @event sourceCreateEvent
     * @param sSource {String} Source name.
     */
    YAHOO.widget.Logger.sourceCreateEvent =
        new YAHOO.util.CustomEvent("sourceCreate", this, true);

     /**
     * Fired when a new log message has been created.
     *
     * @event newLogEvent
     * @param sMsg {String} Log message.
     */
    YAHOO.widget.Logger.newLogEvent = new YAHOO.util.CustomEvent("newLog", this, true);

    /**
     * Fired when the Logger has been reset has been created.
     *
     * @event logResetEvent
     */
    YAHOO.widget.Logger.logResetEvent = new YAHOO.util.CustomEvent("logReset", this, true);

    /////////////////////////////////////////////////////////////////////////////
    //
    // Private methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new category of log messages and fires categoryCreateEvent.
     *
     * @method _createNewCategory
     * @param sCategory {String} Category name.
     * @private
     */
    YAHOO.widget.Logger._createNewCategory = function(sCategory) {
        this.categories.push(sCategory);
        this.categoryCreateEvent.fire(sCategory);
    };

    /**
     * Checks to see if a category has already been created.
     *
     * @method _isNewCategory
     * @param sCategory {String} Category name.
     * @return {Boolean} Returns true if category is unknown, else returns false.
     * @private
     */
    YAHOO.widget.Logger._isNewCategory = function(sCategory) {
        for(var i=0; i < this.categories.length; i++) {
            if(sCategory == this.categories[i]) {
                return false;
            }
        }
        return true;
    };

    /**
     * Creates a new source of log messages and fires sourceCreateEvent.
     *
     * @method _createNewSource
     * @param sSource {String} Source name.
     * @private
     */
    YAHOO.widget.Logger._createNewSource = function(sSource) {
        this.sources.push(sSource);
        this.sourceCreateEvent.fire(sSource);
    };

    /**
     * Checks to see if a source already exists.
     *
     * @method _isNewSource
     * @param sSource {String} Source name.
     * @return {Boolean} Returns true if source is unknown, else returns false.
     * @private
     */
    YAHOO.widget.Logger._isNewSource = function(sSource) {
        if(sSource) {
            for(var i=0; i < this.sources.length; i++) {
                if(sSource == this.sources[i]) {
                    return false;
                }
            }
            return true;
        }
    };

    /**
     * Outputs a log message to global console.log() function.
     *
     * @method _printToBrowserConsole
     * @param oEntry {Object} Log entry object.
     * @private
     */
    YAHOO.widget.Logger._printToBrowserConsole = function(oEntry) {
        if(window.console && console.log) {
            var category = oEntry.category;
            var label = oEntry.category.substring(0,4).toUpperCase();

            var time = oEntry.time;
            var localTime;
            if (time.toLocaleTimeString) {
                localTime  = time.toLocaleTimeString();
            }
            else {
                localTime = time.toString();
            }

            var msecs = time.getTime();
            var elapsedTime = (YAHOO.widget.Logger._lastTime) ?
                (msecs - YAHOO.widget.Logger._lastTime) : 0;
            YAHOO.widget.Logger._lastTime = msecs;

            var output =
                localTime + " (" +
                elapsedTime + "ms): " +
                oEntry.source + ": ";

            // for bug 1987607
            if (YAHOO.env.ua.webkit) {
                output += oEntry.msg;
            }

            console.log(output, oEntry.msg);
        }
    };

    /////////////////////////////////////////////////////////////////////////////
    //
    // Private event handlers
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Handles logging of messages due to window error events.
     *
     * @method _onWindowError
     * @param sMsg {String} The error message.
     * @param sUrl {String} URL of the error.
     * @param sLine {String} Line number of the error.
     * @private
     */
    YAHOO.widget.Logger._onWindowError = function(sMsg,sUrl,sLine) {
        // Logger is not in scope of this event handler
        try {
            YAHOO.widget.Logger.log(sMsg+' ('+sUrl+', line '+sLine+')', "window");
            if(YAHOO.widget.Logger._origOnWindowError) {
                YAHOO.widget.Logger._origOnWindowError();
            }
        }
        catch(e) {
            return false;
        }
    };

    /////////////////////////////////////////////////////////////////////////////
    //
    // First log
    //
    /////////////////////////////////////////////////////////////////////////////

    YAHOO.widget.Logger.log("Logger initialized");
}

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
(function () {
var Logger = YAHOO.widget.Logger,
    u      = YAHOO.util,
    Dom    = u.Dom,
    Event  = u.Event,
    d      = document;

function make(el,props) {
    el = d.createElement(el);
    if (props) {
        for (var p in props) {
            if (props.hasOwnProperty(p)) {
                el[p] = props[p];
            }
        }
    }
    return el;
}

/**
 * The LogReader class provides UI to read messages logged to YAHOO.widget.Logger.
 *
 * @class LogReader
 * @constructor
 * @param elContainer {HTMLElement} (optional) DOM element reference of an existing DIV.
 * @param elContainer {String} (optional) String ID of an existing DIV.
 * @param oConfigs {Object} (optional) Object literal of configuration params.
 */
function LogReader(elContainer, oConfigs) {
    this._sName = LogReader._index;
    LogReader._index++;
    
    this._init.apply(this,arguments);

    /**
     * Render the LogReader immediately upon instantiation.  If set to false,
     * you must call myLogReader.render() to generate the UI.
     * 
     * @property autoRender
     * @type {Boolean}
     * @default true
     */
    if (this.autoRender !== false) {
        this.render();
    }
}

/////////////////////////////////////////////////////////////////////////////
//
// Static member variables
//
/////////////////////////////////////////////////////////////////////////////
YAHOO.lang.augmentObject(LogReader, {
    /**
     * Internal class member to index multiple LogReader instances.
     *
     * @property _memberName
     * @static
     * @type Number
     * @default 0
     * @private
     */
    _index : 0,

    /**
     * Node template for the log entries
     * @property ENTRY_TEMPLATE
     * @static
     * @type {HTMLElement}
     * @default <code>pre</code> element with class yui-log-entry
     */
    ENTRY_TEMPLATE : (function () {
        return make('pre',{ className: 'yui-log-entry' });
    })(),

    /**
     * Template used for innerHTML of verbose entry output.
     * @property VERBOSE_TEMPLATE
     * @static
     * @default "&lt;p>&lt;span class='{category}'>{label}&lt;/span>{totalTime}ms (+{elapsedTime}) {localTime}:&lt;/p>&lt;p>{sourceAndDetail}&lt;/p>&lt;p>{message}&lt;/p>"
     */
    VERBOSE_TEMPLATE : "<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}:</p><p>{sourceAndDetail}</p><p>{message}</p>",

    /**
     * Template used for innerHTML of compact entry output.
     * @property BASIC_TEMPLATE
     * @static
     * @default "&lt;p>&lt;span class='{category}'>{label}&lt;/span>{totalTime}ms (+{elapsedTime}) {localTime}: {sourceAndDetail}: {message}&lt;/p>"
     */
    BASIC_TEMPLATE : "<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}: {sourceAndDetail}: {message}</p>"
});

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

LogReader.prototype = {
    /**
     * Whether or not LogReader is enabled to output log messages.
     *
     * @property logReaderEnabled
     * @type Boolean
     * @default true
     */
    logReaderEnabled : true,

    /**
     * Public member to access CSS width of the LogReader container.
     *
     * @property width
     * @type String
     */
    width : null,

    /**
     * Public member to access CSS height of the LogReader container.
     *
     * @property height
     * @type String
     */
    height : null,

    /**
     * Public member to access CSS top position of the LogReader container.
     *
     * @property top
     * @type String
     */
    top : null,

    /**
     * Public member to access CSS left position of the LogReader container.
     *
     * @property left
     * @type String
     */
    left : null,

    /**
     * Public member to access CSS right position of the LogReader container.
     *
     * @property right
     * @type String
     */
    right : null,

    /**
     * Public member to access CSS bottom position of the LogReader container.
     *
     * @property bottom
     * @type String
     */
    bottom : null,

    /**
     * Public member to access CSS font size of the LogReader container.
     *
     * @property fontSize
     * @type String
     */
    fontSize : null,

    /**
     * Whether or not the footer UI is enabled for the LogReader.
     *
     * @property footerEnabled
     * @type Boolean
     * @default true
     */
    footerEnabled : true,

    /**
     * Whether or not output is verbose (more readable). Setting to true will make
     * output more compact (less readable).
     *
     * @property verboseOutput
     * @type Boolean
     * @default true
     */
    verboseOutput : true,

    /**
     * Custom output format for log messages.  Defaults to null, which falls
     * back to verboseOutput param deciding between LogReader.VERBOSE_TEMPLATE
     * and LogReader.BASIC_TEMPLATE.  Use bracketed place holders to mark where
     * message info should go.  Available place holder names include:
     * <ul>
     *  <li>category</li>
     *  <li>label</li>
     *  <li>sourceAndDetail</li>
     *  <li>message</li>
     *  <li>localTime</li>
     *  <li>elapsedTime</li>
     *  <li>totalTime</li>
     * </ul>
     *
     * @property entryFormat
     * @type String
     * @default null
     */
    entryFormat : null,

    /**
     * Whether or not newest message is printed on top.
     *
     * @property newestOnTop
     * @type Boolean
     */
    newestOnTop : true,

    /**
     * Output timeout buffer in milliseconds.
     *
     * @property outputBuffer
     * @type Number
     * @default 100
     */
    outputBuffer : 100,

    /**
     * Maximum number of messages a LogReader console will display.
     *
     * @property thresholdMax
     * @type Number
     * @default 500
     */
    thresholdMax : 500,

    /**
     * When a LogReader console reaches its thresholdMax, it will clear out messages
     * and print out the latest thresholdMin number of messages.
     *
     * @property thresholdMin
     * @type Number
     * @default 100
     */
    thresholdMin : 100,

    /**
     * True when LogReader is in a collapsed state, false otherwise.
     *
     * @property isCollapsed
     * @type Boolean
     * @default false
     */
    isCollapsed : false,

    /**
     * True when LogReader is in a paused state, false otherwise.
     *
     * @property isPaused
     * @type Boolean
     * @default false
     */
    isPaused : false,

    /**
     * Enables draggable LogReader if DragDrop Utility is present.
     *
     * @property draggable
     * @type Boolean
     * @default true
     */
    draggable : true,

    /////////////////////////////////////////////////////////////////////////////
    //
    // Public methods
    //
    /////////////////////////////////////////////////////////////////////////////

     /**
     * Public accessor to the unique name of the LogReader instance.
     *
     * @method toString
     * @return {String} Unique name of the LogReader instance.
     */
    toString : function() {
        return "LogReader instance" + this._sName;
    },
    /**
     * Pauses output of log messages. While paused, log messages are not lost, but
     * get saved to a buffer and then output upon resume of LogReader.
     *
     * @method pause
     */
    pause : function() {
        this.isPaused = true;
        this._timeout = null;
        this.logReaderEnabled = false;
        if (this._btnPause) {
            this._btnPause.value = "Resume";
        }
    },

    /**
     * Resumes output of log messages, including outputting any log messages that
     * have been saved to buffer while paused.
     *
     * @method resume
     */
    resume : function() {
        this.isPaused = false;
        this.logReaderEnabled = true;
        this._printBuffer();
        if (this._btnPause) {
            this._btnPause.value = "Pause";
        }
    },

    /**
     * Adds the UI to the DOM, attaches event listeners, and bootstraps initial
     * UI state.
     *
     * @method render
     */
    render : function () {
        if (this.rendered) {
            return;
        }

        this._initContainerEl();
        
        this._initHeaderEl();
        this._initConsoleEl();
        this._initFooterEl();

        this._initCategories();
        this._initSources();

        this._initDragDrop();

        // Subscribe to Logger custom events
        Logger.newLogEvent.subscribe(this._onNewLog, this);
        Logger.logResetEvent.subscribe(this._onReset, this);

        Logger.categoryCreateEvent.subscribe(this._onCategoryCreate, this);
        Logger.sourceCreateEvent.subscribe(this._onSourceCreate, this);

        this.rendered = true;

        this._filterLogs();
    },

    /**
     * Removes the UI from the DOM entirely and detaches all event listeners.
     * Implementers should note that Logger will still accumulate messages.
     *
     * @method destroy
     */
    destroy : function () {
        Event.purgeElement(this._elContainer,true);
        this._elContainer.innerHTML = '';
        this._elContainer.parentNode.removeChild(this._elContainer);

        this.rendered = false;
    },

    /**
     * Hides UI of LogReader. Logging functionality is not disrupted.
     *
     * @method hide
     */
    hide : function() {
        this._elContainer.style.display = "none";
    },

    /**
     * Shows UI of LogReader. Logging functionality is not disrupted.
     *
     * @method show
     */
    show : function() {
        this._elContainer.style.display = "block";
    },

    /**
     * Collapses UI of LogReader. Logging functionality is not disrupted.
     *
     * @method collapse
     */
    collapse : function() {
        this._elConsole.style.display = "none";
        if(this._elFt) {
            this._elFt.style.display = "none";
        }
        this._btnCollapse.value = "Expand";
        this.isCollapsed = true;
    },

    /**
     * Expands UI of LogReader. Logging functionality is not disrupted.
     *
     * @method expand
     */
    expand : function() {
        this._elConsole.style.display = "block";
        if(this._elFt) {
            this._elFt.style.display = "block";
        }
        this._btnCollapse.value = "Collapse";
        this.isCollapsed = false;
    },

    /**
     * Returns related checkbox element for given filter (i.e., category or source).
     *
     * @method getCheckbox
     * @param {String} Category or source name.
     * @return {Array} Array of all filter checkboxes.
     */
    getCheckbox : function(filter) {
        return this._filterCheckboxes[filter];
    },

    /**
     * Returns array of enabled categories.
     *
     * @method getCategories
     * @return {String[]} Array of enabled categories.
     */
    getCategories : function() {
        return this._categoryFilters;
    },

    /**
     * Shows log messages associated with given category.
     *
     * @method showCategory
     * @param {String} Category name.
     */
    showCategory : function(sCategory) {
        var filtersArray = this._categoryFilters;
        // Don't do anything if category is already enabled
        // Use Array.indexOf if available...
        if(filtersArray.indexOf) {
             if(filtersArray.indexOf(sCategory) >  -1) {
                return;
            }
        }
        // ...or do it the old-fashioned way
        else {
            for(var i=0; i<filtersArray.length; i++) {
               if(filtersArray[i] === sCategory){
                    return;
                }
            }
        }

        this._categoryFilters.push(sCategory);
        this._filterLogs();
        var elCheckbox = this.getCheckbox(sCategory);
        if(elCheckbox) {
            elCheckbox.checked = true;
        }
    },

    /**
     * Hides log messages associated with given category.
     *
     * @method hideCategory
     * @param {String} Category name.
     */
    hideCategory : function(sCategory) {
        var filtersArray = this._categoryFilters;
        for(var i=0; i<filtersArray.length; i++) {
            if(sCategory == filtersArray[i]) {
                filtersArray.splice(i, 1);
                break;
            }
        }
        this._filterLogs();
        var elCheckbox = this.getCheckbox(sCategory);
        if(elCheckbox) {
            elCheckbox.checked = false;
        }
    },

    /**
     * Returns array of enabled sources.
     *
     * @method getSources
     * @return {Array} Array of enabled sources.
     */
    getSources : function() {
        return this._sourceFilters;
    },

    /**
     * Shows log messages associated with given source.
     *
     * @method showSource
     * @param {String} Source name.
     */
    showSource : function(sSource) {
        var filtersArray = this._sourceFilters;
        // Don't do anything if category is already enabled
        // Use Array.indexOf if available...
        if(filtersArray.indexOf) {
             if(filtersArray.indexOf(sSource) >  -1) {
                return;
            }
        }
        // ...or do it the old-fashioned way
        else {
            for(var i=0; i<filtersArray.length; i++) {
               if(sSource == filtersArray[i]){
                    return;
                }
            }
        }
        filtersArray.push(sSource);
        this._filterLogs();
        var elCheckbox = this.getCheckbox(sSource);
        if(elCheckbox) {
            elCheckbox.checked = true;
        }
    },

    /**
     * Hides log messages associated with given source.
     *
     * @method hideSource
     * @param {String} Source name.
     */
    hideSource : function(sSource) {
        var filtersArray = this._sourceFilters;
        for(var i=0; i<filtersArray.length; i++) {
            if(sSource == filtersArray[i]) {
                filtersArray.splice(i, 1);
                break;
            }
        }
        this._filterLogs();
        var elCheckbox = this.getCheckbox(sSource);
        if(elCheckbox) {
            elCheckbox.checked = false;
        }
    },

    /**
     * Does not delete any log messages, but clears all printed log messages from
     * the console. Log messages will be printed out again if user re-filters. The
     * static method YAHOO.widget.Logger.reset() should be called in order to
     * actually delete log messages.
     *
     * @method clearConsole
     */
    clearConsole : function() {
        // Clear the buffer of any pending messages
        this._timeout = null;
        this._buffer = [];
        this._consoleMsgCount = 0;

        var elConsole = this._elConsole;
        elConsole.innerHTML = '';
    },

    /**
     * Updates title to given string.
     *
     * @method setTitle
     * @param sTitle {String} New title.
     */
    setTitle : function(sTitle) {
        this._title.innerHTML = this.html2Text(sTitle);
    },

    /**
     * Gets timestamp of the last log.
     *
     * @method getLastTime
     * @return {Date} Timestamp of the last log.
     */
    getLastTime : function() {
        return this._lastTime;
    },

    formatMsg : function (entry) {
        var entryFormat = this.entryFormat || (this.verboseOutput ?
                          LogReader.VERBOSE_TEMPLATE : LogReader.BASIC_TEMPLATE),
            info        = {
                category : entry.category,

                // Label for color-coded display
                label : entry.category.substring(0,4).toUpperCase(),

                sourceAndDetail : entry.sourceDetail ?
                                  entry.source + " " + entry.sourceDetail :
                                  entry.source,

                // Escape HTML entities in the log message itself for output
                // to console
                message : this.html2Text(entry.msg || entry.message || '')
            };

        // Add time info
        if (entry.time && entry.time.getTime) {
            info.localTime = entry.time.toLocaleTimeString ?
                             entry.time.toLocaleTimeString() :
                             entry.time.toString();

            // Calculate the elapsed time to be from the last item that
            // passed through the filter, not the absolute previous item
            // in the stack
            info.elapsedTime = entry.time.getTime() - this.getLastTime();

            info.totalTime = entry.time.getTime() - Logger.getStartTime();
        }

        var msg = LogReader.ENTRY_TEMPLATE.cloneNode(true);
        if (this.verboseOutput) {
            msg.className += ' yui-log-verbose';
        }

        // Bug 2061169: Workaround for YAHOO.lang.substitute()
        msg.innerHTML = entryFormat.replace(/\{(\w+)\}/g,
            function (x, placeholder) {
                return (placeholder in info) ? info[placeholder] : '';
            });

        return msg;
    },

    /**
     * Converts input chars "<", ">", and "&" to HTML entities.
     *
     * @method html2Text
     * @param sHtml {String} String to convert.
     * @private
     */
    html2Text : function(sHtml) {
        if(sHtml) {
            sHtml += "";
            return sHtml.replace(/&/g, "&#38;").
                         replace(/</g, "&#60;").
                         replace(/>/g, "&#62;");
        }
        return "";
    },

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

    /**
     * Name of LogReader instance.
     *
     * @property _sName
     * @type String
     * @private
     */
    _sName : null,

    //TODO: remove
    /**
     * A class member shared by all LogReaders if a container needs to be
     * created during instantiation. Will be null if a container element never needs to
     * be created on the fly, such as when the implementer passes in their own element.
     *
     * @property _elDefaultContainer
     * @type HTMLElement
     * @private
     */
    //YAHOO.widget.LogReader._elDefaultContainer = null;

    /**
     * Buffer of log message objects for batch output.
     *
     * @property _buffer
     * @type Object[]
     * @private
     */
    _buffer : null,

    /**
     * Number of log messages output to console.
     *
     * @property _consoleMsgCount
     * @type Number
     * @default 0
     * @private
     */
    _consoleMsgCount : 0,

    /**
     * Date of last output log message.
     *
     * @property _lastTime
     * @type Date
     * @private
     */
    _lastTime : null,

    /**
     * Batched output timeout ID.
     *
     * @property _timeout
     * @type Number
     * @private
     */
    _timeout : null,

    /**
     * Hash of filters and their related checkbox elements.
     *
     * @property _filterCheckboxes
     * @type Object
     * @private
     */
    _filterCheckboxes : null,

    /**
     * Array of filters for log message categories.
     *
     * @property _categoryFilters
     * @type String[]
     * @private
     */
    _categoryFilters : null,

    /**
     * Array of filters for log message sources.
     *
     * @property _sourceFilters
     * @type String[]
     * @private
     */
    _sourceFilters : null,

    /**
     * LogReader container element.
     *
     * @property _elContainer
     * @type HTMLElement
     * @private
     */
    _elContainer : null,

    /**
     * LogReader header element.
     *
     * @property _elHd
     * @type HTMLElement
     * @private
     */
    _elHd : null,

    /**
     * LogReader collapse element.
     *
     * @property _elCollapse
     * @type HTMLElement
     * @private
     */
    _elCollapse : null,

    /**
     * LogReader collapse button element.
     *
     * @property _btnCollapse
     * @type HTMLElement
     * @private
     */
    _btnCollapse : null,

    /**
     * LogReader title header element.
     *
     * @property _title
     * @type HTMLElement
     * @private
     */
    _title : null,

    /**
     * LogReader console element.
     *
     * @property _elConsole
     * @type HTMLElement
     * @private
     */
    _elConsole : null,

    /**
     * LogReader footer element.
     *
     * @property _elFt
     * @type HTMLElement
     * @private
     */
    _elFt : null,

    /**
     * LogReader buttons container element.
     *
     * @property _elBtns
     * @type HTMLElement
     * @private
     */
    _elBtns : null,

    /**
     * Container element for LogReader category filter checkboxes.
     *
     * @property _elCategoryFilters
     * @type HTMLElement
     * @private
     */
    _elCategoryFilters : null,

    /**
     * Container element for LogReader source filter checkboxes.
     *
     * @property _elSourceFilters
     * @type HTMLElement
     * @private
     */
    _elSourceFilters : null,

    /**
     * LogReader pause button element.
     *
     * @property _btnPause
     * @type HTMLElement
     * @private
     */
    _btnPause : null,

    /**
     * Clear button element.
     *
     * @property _btnClear
     * @type HTMLElement
     * @private
     */
    _btnClear : null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // Private methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Initializes the instance's message buffer, start time, etc
     *
     * @method _init
     * @param container {String|HTMLElement} (optional) the render target
     * @param config {Object} (optional) instance configuration
     * @protected
     */
    _init : function (container, config) {
        // Internal vars
        this._buffer = []; // output buffer
        this._filterCheckboxes = {}; // pointers to checkboxes
        this._lastTime = Logger.getStartTime(); // timestamp of last log message to console

        // Parse config vars here
        if (config && (config.constructor == Object)) {
            for(var param in config) {
                if (config.hasOwnProperty(param)) {
                    this[param] = config[param];
                }
            }
        }

        this._elContainer = Dom.get(container);

        YAHOO.log("LogReader initialized", null, this.toString());
    },

    /**
     * Initializes the primary container element.
     *
     * @method _initContainerEl
     * @private
     */
    _initContainerEl : function() {

        // Default the container if unset or not a div
        if(!this._elContainer || !/div$/i.test(this._elContainer.tagName)) {
            this._elContainer = d.body.insertBefore(make("div"),d.body.firstChild);
            // Only position absolutely if an in-DOM element is not supplied
            Dom.addClass(this._elContainer,"yui-log-container");
        }

        Dom.addClass(this._elContainer,"yui-log");

        // If implementer has provided container values, trust and set those
        var style = this._elContainer.style,
            styleProps = ['width','right','top','fontSize'],
            prop,i;

        for (i = styleProps.length - 1; i >= 0; --i) {
            prop = styleProps[i];
            if (this[prop]){ 
                style[prop] = this[prop];
            }
        }

        if(this.left) {
            style.left  = this.left;
            style.right = "auto";
        }
        if(this.bottom) {
            style.bottom = this.bottom;
            style.top    = "auto";
        }

        // Opera needs a little prodding to reflow sometimes
        if (YAHOO.env.ua.opera) {
            d.body.style += '';
        }

    },

    /**
     * Initializes the header element.
     *
     * @method _initHeaderEl
     * @private
     */
    _initHeaderEl : function() {
        // Destroy header if present
        if(this._elHd) {
            // Unhook DOM events
            Event.purgeElement(this._elHd, true);

            // Remove DOM elements
            this._elHd.innerHTML = "";
        }
        
        // Create header
        // TODO: refactor this into an innerHTML
        this._elHd = make("div",{
            id: 'yui-log-hd' + this._sName,
            className: "yui-log-hd"
        });

        this._elCollapse = make("div",{ className: 'yui-log-btns' });

        this._btnCollapse = make("input",{
            type: 'button',
            className: 'yui-log-button',
            value: 'Collapse'
        });
        Event.on(this._btnCollapse,'click',this._onClickCollapseBtn,this);


        this._title = make("h4",{ innerHTML : "Logger Console" });

        this._elCollapse.appendChild(this._btnCollapse);
        this._elHd.appendChild(this._elCollapse);
        this._elHd.appendChild(this._title);
        this._elContainer.appendChild(this._elHd);
    },

    /**
     * Initializes the console element.
     *
     * @method _initConsoleEl
     * @private
     */
    _initConsoleEl : function() {
        // Destroy console
        if(this._elConsole) {
            // Unhook DOM events
            Event.purgeElement(this._elConsole, true);

            // Remove DOM elements
            this._elConsole.innerHTML = "";
        }

        // Ceate console
        this._elConsole = make("div", { className: "yui-log-bd" });

        // If implementer has provided console, trust and set those
        if(this.height) {
            this._elConsole.style.height = this.height;
        }

        this._elContainer.appendChild(this._elConsole);
    },

    /**
     * Initializes the footer element.
     *
     * @method _initFooterEl
     * @private
     */
    _initFooterEl : function() {
        // Don't create footer elements if footer is disabled
        if(this.footerEnabled) {
            // Destroy console
            if(this._elFt) {
                // Unhook DOM events
                Event.purgeElement(this._elFt, true);

                // Remove DOM elements
                this._elFt.innerHTML = "";
            }

            // TODO: use innerHTML
            this._elFt = make("div",{ className: "yui-log-ft" });
            this._elBtns = make("div", { className: "yui-log-btns" });
            this._btnPause = make("input", {
                type: "button",
                className: "yui-log-button",
                value: "Pause"
            });

            Event.on(this._btnPause,'click',this._onClickPauseBtn,this);

            this._btnClear = make("input", {
                type: "button",
                className: "yui-log-button",
                value: "Clear"
            });

            Event.on(this._btnClear,'click',this._onClickClearBtn,this);

            this._elCategoryFilters = make("div", { className: "yui-log-categoryfilters" });
            this._elSourceFilters = make("div", { className: "yui-log-sourcefilters" });

            this._elBtns.appendChild(this._btnPause);
            this._elBtns.appendChild(this._btnClear);
            this._elFt.appendChild(this._elBtns);
            this._elFt.appendChild(this._elCategoryFilters);
            this._elFt.appendChild(this._elSourceFilters);
            this._elContainer.appendChild(this._elFt);
        }
    },

    /**
     * Initializes Drag and Drop on the header element.
     *
     * @method _initDragDrop
     * @private
     */
    _initDragDrop : function() {
        // If Drag and Drop utility is available...
        // ...and draggable is true...
        // ...then make the header draggable
        if(u.DD && this.draggable && this._elHd) {
            var ylog_dd = new u.DD(this._elContainer);
            ylog_dd.setHandleElId(this._elHd.id);
            //TODO: use class name
            this._elHd.style.cursor = "move";
        }
    },

    /**
     * Initializes category filters.
     *
     * @method _initCategories
     * @private
     */
    _initCategories : function() {
        // Initialize category filters
        this._categoryFilters = [];
        var aInitialCategories = Logger.categories;

        for(var j=0; j < aInitialCategories.length; j++) {
            var sCategory = aInitialCategories[j];

            // Add category to the internal array of filters
            this._categoryFilters.push(sCategory);

            // Add checkbox element if UI is enabled
            if(this._elCategoryFilters) {
                this._createCategoryCheckbox(sCategory);
            }
        }
    },

    /**
     * Initializes source filters.
     *
     * @method _initSources
     * @private
     */
    _initSources : function() {
        // Initialize source filters
        this._sourceFilters = [];
        var aInitialSources = Logger.sources;

        for(var j=0; j < aInitialSources.length; j++) {
            var sSource = aInitialSources[j];

            // Add source to the internal array of filters
            this._sourceFilters.push(sSource);

            // Add checkbox element if UI is enabled
            if(this._elSourceFilters) {
                this._createSourceCheckbox(sSource);
            }
        }
    },

    /**
     * Creates the UI for a category filter in the LogReader footer element.
     *
     * @method _createCategoryCheckbox
     * @param sCategory {String} Category name.
     * @private
     */
    _createCategoryCheckbox : function(sCategory) {
        if(this._elFt) {
            var filter = make("span",{ className: "yui-log-filtergrp" }),
                check  = make("input", {
                    id: "yui-log-filter-" + sCategory + this._sName,
                    className: "yui-log-filter-" + sCategory,
                    type: "checkbox",
                    category: sCategory
                }),
                label  = make("label", {
                    htmlFor: check.id,
                    className: sCategory,
                    innerHTML: sCategory
                });
            

            // Subscribe to the click event
            Event.on(check,'click',this._onCheckCategory,this);

            this._filterCheckboxes[sCategory] = check;

            // Append el at the end so IE 5.5 can set "type" attribute
            // and THEN set checked property
            filter.appendChild(check);
            filter.appendChild(label);
            this._elCategoryFilters.appendChild(filter);
            check.checked = true;
        }
    },

    /**
     * Creates a checkbox in the LogReader footer element to filter by source.
     *
     * @method _createSourceCheckbox
     * @param sSource {String} Source name.
     * @private
     */
    _createSourceCheckbox : function(sSource) {
        if(this._elFt) {
            var filter = make("span",{ className: "yui-log-filtergrp" }),
                check  = make("input", {
                    id: "yui-log-filter-" + sSource + this._sName,
                    className: "yui-log-filter-" + sSource,
                    type: "checkbox",
                    source: sSource
                }),
                label  = make("label", {
                    htmlFor: check.id,
                    className: sSource,
                    innerHTML: sSource
                });
            

            // Subscribe to the click event
            Event.on(check,'click',this._onCheckSource,this);

            this._filterCheckboxes[sSource] = check;

            // Append el at the end so IE 5.5 can set "type" attribute
            // and THEN set checked property
            filter.appendChild(check);
            filter.appendChild(label);
            this._elSourceFilters.appendChild(filter);
            check.checked = true;
        }
    },

    /**
     * Reprints all log messages in the stack through filters.
     *
     * @method _filterLogs
     * @private
     */
    _filterLogs : function() {
        // Reprint stack with new filters
        if (this._elConsole !== null) {
            this.clearConsole();
            this._printToConsole(Logger.getStack());
        }
    },

    /**
     * Sends buffer of log messages to output and clears buffer.
     *
     * @method _printBuffer
     * @private
     */
    _printBuffer : function() {
        this._timeout = null;

        if(this._elConsole !== null) {
            var thresholdMax = this.thresholdMax;
            thresholdMax = (thresholdMax && !isNaN(thresholdMax)) ? thresholdMax : 500;
            if(this._consoleMsgCount < thresholdMax) {
                var entries = [];
                for (var i=0; i<this._buffer.length; i++) {
                    entries[i] = this._buffer[i];
                }
                this._buffer = [];
                this._printToConsole(entries);
            }
            else {
                this._filterLogs();
            }
            
            if(!this.newestOnTop) {
                this._elConsole.scrollTop = this._elConsole.scrollHeight;
            }
        }
    },

    /**
     * Cycles through an array of log messages, and outputs each one to the console
     * if its category has not been filtered out.
     *
     * @method _printToConsole
     * @param aEntries {Object[]} Array of LogMsg objects to output to console.
     * @private
     */
    _printToConsole : function(aEntries) {
        // Manage the number of messages displayed in the console
        var entriesLen         = aEntries.length,
            df                 = d.createDocumentFragment(),
            msgHTML            = [],
            thresholdMin       = this.thresholdMin,
            sourceFiltersLen   = this._sourceFilters.length,
            categoryFiltersLen = this._categoryFilters.length,
            entriesStartIndex,
            i, j, msg, before;

        if(isNaN(thresholdMin) || (thresholdMin > this.thresholdMax)) {
            thresholdMin = 0;
        }
        entriesStartIndex = (entriesLen > thresholdMin) ? (entriesLen - thresholdMin) : 0;
        
        // Iterate through all log entries 
        for(i=entriesStartIndex; i<entriesLen; i++) {
            // Print only the ones that filter through
            var okToPrint = false,
                okToFilterCats = false,
                entry = aEntries[i],
                source = entry.source,
                category = entry.category;

            for(j=0; j<sourceFiltersLen; j++) {
                if(source == this._sourceFilters[j]) {
                    okToFilterCats = true;
                    break;
                }
            }
            if(okToFilterCats) {
                for(j=0; j<categoryFiltersLen; j++) {
                    if(category == this._categoryFilters[j]) {
                        okToPrint = true;
                        break;
                    }
                }
            }
            if(okToPrint) {
                // Start from 0ms elapsed time
                if (this._consoleMsgCount === 0) {
                    this._lastTime = entry.time.getTime();
                }

                msg = this.formatMsg(entry);
                if (typeof msg === 'string') {
                    msgHTML[msgHTML.length] = msg;
                } else {
                    df.insertBefore(msg, this.newestOnTop ?
                        df.firstChild || null : null);
                }
                this._consoleMsgCount++;
                this._lastTime = entry.time.getTime();
            }
        }

        if (msgHTML.length) {
            msgHTML.splice(0,0,this._elConsole.innerHTML);
            this._elConsole.innerHTML = this.newestOnTop ?
                                            msgHTML.reverse().join('') :
                                            msgHTML.join('');
        } else if (df.firstChild) {
            this._elConsole.insertBefore(df, this.newestOnTop ?
                        this._elConsole.firstChild || null : null);
        }
    },

/////////////////////////////////////////////////////////////////////////////
//
// Private event handlers
//
/////////////////////////////////////////////////////////////////////////////

    /**
     * Handles Logger's categoryCreateEvent.
     *
     * @method _onCategoryCreate
     * @param sType {String} The event.
     * @param aArgs {Object[]} Data passed from event firer.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onCategoryCreate : function(sType, aArgs, oSelf) {
        var category = aArgs[0];
        
        // Add category to the internal array of filters
        oSelf._categoryFilters.push(category);

        if(oSelf._elFt) {
            oSelf._createCategoryCheckbox(category);
        }
    },

    /**
     * Handles Logger's sourceCreateEvent.
     *
     * @method _onSourceCreate
     * @param sType {String} The event.
     * @param aArgs {Object[]} Data passed from event firer.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onSourceCreate : function(sType, aArgs, oSelf) {
        var source = aArgs[0];
        
        // Add source to the internal array of filters
        oSelf._sourceFilters.push(source);

        if(oSelf._elFt) {
            oSelf._createSourceCheckbox(source);
        }
    },

    /**
     * Handles check events on the category filter checkboxes.
     *
     * @method _onCheckCategory
     * @param v {HTMLEvent} The click event.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onCheckCategory : function(v, oSelf) {
        var category = this.category;
        if(!this.checked) {
            oSelf.hideCategory(category);
        }
        else {
            oSelf.showCategory(category);
        }
    },

    /**
     * Handles check events on the category filter checkboxes.
     *
     * @method _onCheckSource
     * @param v {HTMLEvent} The click event.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onCheckSource : function(v, oSelf) {
        var source = this.source;
        if(!this.checked) {
            oSelf.hideSource(source);
        }
        else {
            oSelf.showSource(source);
        }
    },

    /**
     * Handles click events on the collapse button.
     *
     * @method _onClickCollapseBtn
     * @param v {HTMLEvent} The click event.
     * @param oSelf {Object} The LogReader instance
     * @private
     */
    _onClickCollapseBtn : function(v, oSelf) {
        if(!oSelf.isCollapsed) {
            oSelf.collapse();
        }
        else {
            oSelf.expand();
        }
    },

    /**
     * Handles click events on the pause button.
     *
     * @method _onClickPauseBtn
     * @param v {HTMLEvent} The click event.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onClickPauseBtn : function(v, oSelf) {
        if(!oSelf.isPaused) {
            oSelf.pause();
        }
        else {
            oSelf.resume();
        }
    },

    /**
     * Handles click events on the clear button.
     *
     * @method _onClickClearBtn
     * @param v {HTMLEvent} The click event.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onClickClearBtn : function(v, oSelf) {
        oSelf.clearConsole();
    },

    /**
     * Handles Logger's newLogEvent.
     *
     * @method _onNewLog
     * @param sType {String} The event.
     * @param aArgs {Object[]} Data passed from event firer.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onNewLog : function(sType, aArgs, oSelf) {
        var logEntry = aArgs[0];
        oSelf._buffer.push(logEntry);

        if (oSelf.logReaderEnabled === true && oSelf._timeout === null) {
            oSelf._timeout = setTimeout(function(){oSelf._printBuffer();}, oSelf.outputBuffer);
        }
    },

    /**
     * Handles Logger's resetEvent.
     *
     * @method _onReset
     * @param sType {String} The event.
     * @param aArgs {Object[]} Data passed from event firer.
     * @param oSelf {Object} The LogReader instance.
     * @private
     */
    _onReset : function(sType, aArgs, oSelf) {
        oSelf._filterLogs();
    }
};

YAHOO.widget.LogReader = LogReader;

})();
YAHOO.register("logger", YAHOO.widget.Logger, {version: "2.8.2r1", build: "7"});
