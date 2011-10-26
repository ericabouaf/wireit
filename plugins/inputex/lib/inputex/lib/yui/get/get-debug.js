/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.8.2r1
*/
/**
 * Provides a mechanism to fetch remote resources and
 * insert them into a document
 * @module get
 * @requires yahoo
 */

/**
 * Fetches and inserts one or more script or link nodes into the document 
 * @namespace YAHOO.util
 * @class YAHOO.util.Get
 */
YAHOO.util.Get = function() {

    /**
     * hash of queues to manage multiple requests
     * @property queues
     * @private
     */
    var queues={}, 
        
    /**
     * queue index used to generate transaction ids
     * @property qidx
     * @type int
     * @private
     */
        qidx=0, 
        
    /**
     * node index used to generate unique node ids
     * @property nidx
     * @type int
     * @private
     */
        nidx=0, 

        // ridx=0,

        // sandboxFrame=null,

    /**
     * interal property used to prevent multiple simultaneous purge 
     * processes
     * @property purging
     * @type boolean
     * @private
     */
        purging=false,

        ua=YAHOO.env.ua, 
        
        lang=YAHOO.lang;
    
    /** 
     * Generates an HTML element, this is not appended to a document
     * @method _node
     * @param type {string} the type of element
     * @param attr {string} the attributes
     * @param win {Window} optional window to create the element in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _node = function(type, attr, win) {
        var w = win || window, d=w.document, n=d.createElement(type);

        for (var i in attr) {
            if (attr[i] && YAHOO.lang.hasOwnProperty(attr, i)) {
                n.setAttribute(i, attr[i]);
            }
        }

        return n;
    };

    /**
     * Generates a link node
     * @method _linkNode
     * @param url {string} the url for the css file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _linkNode = function(url, win, attributes) {

        var o = {
            id:   "yui__dyn_" + (nidx++),
            type: "text/css",
            rel:  "stylesheet",
            href: url
        };

        if (attributes) {
            lang.augmentObject(o, attributes);
        }

        return _node("link", o, win);
    };

    /**
     * Generates a script node
     * @method _scriptNode
     * @param url {string} the url for the script file
     * @param win {Window} optional window to create the node in
     * @return {HTMLElement} the generated node
     * @private
     */
    var _scriptNode = function(url, win, attributes) {
        var o = {
            id:   "yui__dyn_" + (nidx++),
            type: "text/javascript",
            src:  url
        };

        if (attributes) {
            lang.augmentObject(o, attributes);
        }

        return _node("script", o, win);
    };

    /**
     * Returns the data payload for callback functions
     * @method _returnData
     * @private
     */
    var _returnData = function(q, msg) {
        return {
                tId: q.tId,
                win: q.win,
                data: q.data,
                nodes: q.nodes,
                msg: msg,
                purge: function() {
                    _purge(this.tId);
                }
            };
    };

    var _get = function(nId, tId) {
        var q = queues[tId],
            n = (lang.isString(nId)) ? q.win.document.getElementById(nId) : nId;
        if (!n) {
            _fail(tId, "target node not found: " + nId);
        }

        return n;
    };

    /*
     * The request failed, execute fail handler with whatever
     * was accomplished.  There isn't a failure case at the
     * moment unless you count aborted transactions
     * @method _fail
     * @param id {string} the id of the request
     * @private
     */
    var _fail = function(id, msg) {
        YAHOO.log("get failure: " + msg, "warn", "Get");
        var q = queues[id];
        // execute failure callback
        if (q.onFailure) {
            var sc=q.scope || q.win;
            q.onFailure.call(sc, _returnData(q, msg));
        }
    };

    /**
     * The request is complete, so executing the requester's callback
     * @method _finish
     * @param id {string} the id of the request
     * @private
     */
    var _finish = function(id) {
        YAHOO.log("Finishing transaction " + id);
        var q = queues[id];
        q.finished = true;

        if (q.aborted) {
            var msg = "transaction " + id + " was aborted";
            _fail(id, msg);
            return;
        }

        // execute success callback
        if (q.onSuccess) {
            var sc=q.scope || q.win;
            q.onSuccess.call(sc, _returnData(q));
        }
    };

    /**
     * Timeout detected
     * @method _timeout
     * @param id {string} the id of the request
     * @private
     */
    var _timeout = function(id) {
        YAHOO.log("Timeout " + id, "info", "get");
        var q = queues[id];
        if (q.onTimeout) {
            var sc=q.scope || q;
            q.onTimeout.call(sc, _returnData(q));
        }
    };

    /**
     * Loads the next item for a given request
     * @method _next
     * @param id {string} the id of the request
     * @param loaded {string} the url that was just loaded, if any
     * @private
     */
    var _next = function(id, loaded) {
        YAHOO.log("_next: " + id + ", loaded: " + loaded, "info", "Get");
        var q = queues[id];

        if (q.timer) {
            // Y.log('cancel timer');
            q.timer.cancel();
        }

        if (q.aborted) {
            var msg = "transaction " + id + " was aborted";
            _fail(id, msg);
            return;
        }

        if (loaded) {
            q.url.shift(); 
            if (q.varName) {
                q.varName.shift(); 
            }
        } else {
            // This is the first pass: make sure the url is an array
            q.url = (lang.isString(q.url)) ? [q.url] : q.url;
            if (q.varName) {
                q.varName = (lang.isString(q.varName)) ? [q.varName] : q.varName;
            }
        }

        var w=q.win, d=w.document, h=d.getElementsByTagName("head")[0], n;

        if (q.url.length === 0) {
            // Safari 2.x workaround - There is no way to know when 
            // a script is ready in versions of Safari prior to 3.x.
            // Adding an extra node reduces the problem, but doesn't
            // eliminate it completely because the browser executes
            // them asynchronously. 
            if (q.type === "script" && ua.webkit && ua.webkit < 420 && 
                    !q.finalpass && !q.varName) {
                // Add another script node.  This does not guarantee that the
                // scripts will execute in order, but it does appear to fix the
                // problem on fast connections more effectively than using an
                // arbitrary timeout.  It is possible that the browser does
                // block subsequent script execution in this case for a limited
                // time.
                var extra = _scriptNode(null, q.win, q.attributes);
                extra.innerHTML='YAHOO.util.Get._finalize("' + id + '");';
                q.nodes.push(extra); h.appendChild(extra);

            } else {
                _finish(id);
            }

            return;
        } 


        var url = q.url[0];

        // if the url is undefined, this is probably a trailing comma problem in IE
        if (!url) {
            q.url.shift(); 
            YAHOO.log('skipping empty url');
            return _next(id);
        }

        YAHOO.log("attempting to load " + url, "info", "Get");

        if (q.timeout) {
            // Y.log('create timer');
            q.timer = lang.later(q.timeout, q, _timeout, id);
        }

        if (q.type === "script") {
            n = _scriptNode(url, w, q.attributes);
        } else {
            n = _linkNode(url, w, q.attributes);
        }

        // track this node's load progress
        _track(q.type, n, id, url, w, q.url.length);

        // add the node to the queue so we can return it to the user supplied callback
        q.nodes.push(n);

        // add it to the head or insert it before 'insertBefore'
        if (q.insertBefore) {
            var s = _get(q.insertBefore, id);
            if (s) {
                s.parentNode.insertBefore(n, s);
            }
        } else {
            h.appendChild(n);
        }
        
        YAHOO.log("Appending node: " + url, "info", "Get");

        // FireFox does not support the onload event for link nodes, so there is
        // no way to make the css requests synchronous. This means that the css 
        // rules in multiple files could be applied out of order in this browser
        // if a later request returns before an earlier one.  Safari too.
        if ((ua.webkit || ua.gecko) && q.type === "css") {
            _next(id, url);
        }
    };

    /**
     * Removes processed queues and corresponding nodes
     * @method _autoPurge
     * @private
     */
    var _autoPurge = function() {

        if (purging) {
            return;
        }

        purging = true;
        for (var i in queues) {
            var q = queues[i];
            if (q.autopurge && q.finished) {
                _purge(q.tId);
                delete queues[i];
            }
        }

        purging = false;
    };

    /**
     * Removes the nodes for the specified queue
     * @method _purge
     * @private
     */
    var _purge = function(tId) {
        if (queues[tId]) {

            var q     = queues[tId],
                nodes = q.nodes, 
                l     = nodes.length, 
                d     = q.win.document, 
                h     = d.getElementsByTagName("head")[0],
                sib, i, node, attr;

            if (q.insertBefore) {
                sib = _get(q.insertBefore, tId);
                if (sib) {
                    h = sib.parentNode;
                }
            }

            for (i=0; i<l; i=i+1) {
                node = nodes[i];
                if (node.clearAttributes) {
                    node.clearAttributes();
                } else {
                    for (attr in node) {
                        delete node[attr];
                    }
                }

                h.removeChild(node);
            }

            q.nodes = [];
        }
    };

    /**
     * Saves the state for the request and begins loading
     * the requested urls
     * @method queue
     * @param type {string} the type of node to insert
     * @param url {string} the url to load
     * @param opts the hash of options for this request
     * @private
     */
    var _queue = function(type, url, opts) {

        var id = "q" + (qidx++);
        opts = opts || {};

        if (qidx % YAHOO.util.Get.PURGE_THRESH === 0) {
            _autoPurge();
        }

        queues[id] = lang.merge(opts, {
            tId: id,
            type: type,
            url: url,
            finished: false,
            aborted: false,
            nodes: []
        });

        var q = queues[id];
        q.win = q.win || window;
        q.scope = q.scope || q.win;
        q.autopurge = ("autopurge" in q) ? q.autopurge : 
                      (type === "script") ? true : false;

        if (opts.charset) {
            q.attributes = q.attributes || {};
            q.attributes.charset = opts.charset;
        }

        lang.later(0, q, _next, id);

        return {
            tId: id
        };
    };

    /**
     * Detects when a node has been loaded.  In the case of
     * script nodes, this does not guarantee that contained
     * script is ready to use.
     * @method _track
     * @param type {string} the type of node to track
     * @param n {HTMLElement} the node to track
     * @param id {string} the id of the request
     * @param url {string} the url that is being loaded
     * @param win {Window} the targeted window
     * @param qlength the number of remaining items in the queue,
     * including this one
     * @param trackfn {Function} function to execute when finished
     * the default is _next
     * @private
     */
    var _track = function(type, n, id, url, win, qlength, trackfn) {
        var f = trackfn || _next;

        // IE supports the readystatechange event for script and css nodes
        if (ua.ie) {
            n.onreadystatechange = function() {
                var rs = this.readyState;
                if ("loaded" === rs || "complete" === rs) {
                    YAHOO.log(id + " onload " + url, "info", "Get");
                    n.onreadystatechange = null;
                    f(id, url);
                }
            };

        // webkit prior to 3.x is problemmatic
        } else if (ua.webkit) {

            if (type === "script") {

                // Safari 3.x supports the load event for script nodes (DOM2)
                if (ua.webkit >= 420) {

                    n.addEventListener("load", function() {
                        YAHOO.log(id + " DOM2 onload " + url, "info", "Get");
                        f(id, url);
                    });

                // Nothing can be done with Safari < 3.x except to pause and hope
                // for the best, particularly after last script is inserted. The
                // scripts will always execute in the order they arrive, not
                // necessarily the order in which they were inserted.  To support
                // script nodes with complete reliability in these browsers, script
                // nodes either need to invoke a function in the window once they
                // are loaded or the implementer needs to provide a well-known
                // property that the utility can poll for.
                } else {
                    // Poll for the existence of the named variable, if it
                    // was supplied.
                    var q = queues[id];
                    if (q.varName) {
                        var freq=YAHOO.util.Get.POLL_FREQ;
                        YAHOO.log("Polling for " + q.varName[0]);
                        q.maxattempts = YAHOO.util.Get.TIMEOUT/freq;
                        q.attempts = 0;
                        q._cache = q.varName[0].split(".");
                        q.timer = lang.later(freq, q, function(o) {
                            var a=this._cache, l=a.length, w=this.win, i;
                            for (i=0; i<l; i=i+1) {
                                w = w[a[i]];
                                if (!w) {
                                    // if we have exausted our attempts, give up
                                    this.attempts++;
                                    if (this.attempts++ > this.maxattempts) {
                                        var msg = "Over retry limit, giving up";
                                        q.timer.cancel();
                                        _fail(id, msg);
                                    } else {
                                        YAHOO.log(a[i] + " failed, retrying");
                                    }
                                    return;
                                }
                            }
                            
                            YAHOO.log("Safari poll complete");

                            q.timer.cancel();
                            f(id, url);

                        }, null, true);
                    } else {
                        lang.later(YAHOO.util.Get.POLL_FREQ, null, f, [id, url]);
                    }
                }
            } 

        // FireFox and Opera support onload (but not DOM2 in FF) handlers for
        // script nodes.  Opera, but not FF, supports the onload event for link
        // nodes.
        } else { 
            n.onload = function() {
                YAHOO.log(id + " onload " + url, "info", "Get");
                f(id, url);
            };
        }
    };

    return {

        /**
         * The default poll freqency in ms, when needed
         * @property POLL_FREQ
         * @static
         * @type int
         * @default 10
         */
        POLL_FREQ: 10,

        /**
         * The number of request required before an automatic purge.
         * property PURGE_THRESH
         * @static
         * @type int
         * @default 20
         */
        PURGE_THRESH: 20,

        /**
         * The length time to poll for varName when loading a script in
         * Safari 2.x before the transaction fails.
         * property TIMEOUT
         * @static
         * @type int
         * @default 2000
         */
        TIMEOUT: 2000,
        
        /**
         * Called by the the helper for detecting script load in Safari
         * @method _finalize
         * @param id {string} the transaction id
         * @private
         */
        _finalize: function(id) {
            YAHOO.log(id + " finalized ", "info", "Get");
            lang.later(0, null, _finish, id);
        },

        /**
         * Abort a transaction
         * @method abort
         * @param {string|object} either the tId or the object returned from
         * script() or css()
         */
        abort: function(o) {
            var id = (lang.isString(o)) ? o : o.tId;
            var q = queues[id];
            if (q) {
                YAHOO.log("Aborting " + id, "info", "Get");
                q.aborted = true;
            }
        }, 

        /**
         * Fetches and inserts one or more script nodes into the head
         * of the current document or the document in a specified window.
         *
         * @method script
         * @static
         * @param url {string|string[]} the url or urls to the script(s)
         * @param opts {object} Options: 
         * <dl>
         * <dt>onSuccess</dt>
         * <dd>
         * callback to execute when the script(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>onFailure</dt>
         * <dd>
         * callback to execute when the script load operation fails
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted successfully</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove any nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>onTimeout</dt>
         * <dd>
         * callback to execute when a timeout occurs.
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>scope</dt>
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>autopurge</dt>
         * <dd>
         * setting to true will let the utilities cleanup routine purge 
         * the script once loaded
         * </dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callback when the script(s) are
         * loaded.
         * </dd>
         * <dt>varName</dt>
         * <dd>
         * variable that should be available when a script is finished
         * loading.  Used to help Safari 2.x and below with script load 
         * detection.  The type of this property should match what was
         * passed into the url parameter: if loading a single url, a
         * string can be supplied.  If loading multiple scripts, you
         * must supply an array that contains the variable name for
         * each script.
         * </dd>
         * <dt>insertBefore</dt>
         * <dd>node or node id that will become the new node's nextSibling</dd>
         * </dl>
         * <dt>charset</dt>
         * <dd>Node charset, deprecated, use 'attributes'</dd>
         * <dt>attributes</dt>
         * <dd>A hash of attributes to apply to dynamic nodes.</dd>
         * <dt>timeout</dt>
         * <dd>Number of milliseconds to wait before aborting and firing the timeout event</dd>
         * <pre>
         * // assumes yahoo, dom, and event are already on the page
         * &nbsp;&nbsp;YAHOO.util.Get.script(
         * &nbsp;&nbsp;["http://yui.yahooapis.com/2.7.0/build/dragdrop/dragdrop-min.js",
         * &nbsp;&nbsp;&nbsp;"http://yui.yahooapis.com/2.7.0/build/animation/animation-min.js"], &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;onSuccess: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;YAHOO.log(o.data); // foo
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new YAHOO.util.DDProxy("dd1"); // also new o.reference("dd1"); would work
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log("won't cause error because YAHOO is the scope");
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.log(o.nodes.length === 2) // true
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// o.purge(); // optionally remove the script nodes immediately
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;onFailure: function(o) &#123;
         * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;YAHOO.log("transaction failed");
         * &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
         * &nbsp;&nbsp;&nbsp;&nbsp;data: "foo",
         * &nbsp;&nbsp;&nbsp;&nbsp;timeout: 10000, // 10 second timeout
         * &nbsp;&nbsp;&nbsp;&nbsp;scope: YAHOO,
         * &nbsp;&nbsp;&nbsp;&nbsp;// win: otherframe // target another window/frame
         * &nbsp;&nbsp;&nbsp;&nbsp;autopurge: true // allow the utility to choose when to remove the nodes
         * &nbsp;&nbsp;&#125;);
         * </pre>
         * @return {tId: string} an object containing info about the transaction
         */
        script: function(url, opts) { return _queue("script", url, opts); },

        /**
         * Fetches and inserts one or more css link nodes into the 
         * head of the current document or the document in a specified
         * window.
         * @method css
         * @static
         * @param url {string} the url or urls to the css file(s)
         * @param opts Options: 
         * <dl>
         * <dt>onSuccess</dt>
         * <dd>
         * callback to execute when the css file(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>win</dl>
         * <dd>the window the link nodes(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>scope</dt>
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callbacks when the nodes(s) are
         * loaded.
         * </dd>
         * <dt>insertBefore</dt>
         * <dd>node or node id that will become the new node's nextSibling</dd>
         * <dt>charset</dt>
         * <dd>Node charset, deprecated, use 'attributes'</dd>
         * <dt>attributes</dt>
         * <dd>A hash of attributes to apply to dynamic nodes.</dd>
         * </dl>
         * <pre>
         *      YAHOO.util.Get.css("http://yui.yahooapis.com/2.7.0/build/menu/assets/skins/sam/menu.css");
         * </pre>
         * <pre>
         *      YAHOO.util.Get.css(["http://yui.yahooapis.com/2.7.0/build/menu/assets/skins/sam/menu.css",
         *                          "http://yui.yahooapis.com/2.7.0/build/logger/assets/skins/sam/logger.css"]);
         * </pre>
         * @return {tId: string} an object containing info about the transaction
         */
        css: function(url, opts) {
            return _queue("css", url, opts); 
        }
    };
}();

YAHOO.register("get", YAHOO.util.Get, {version: "2.8.2r1", build: "7"});
