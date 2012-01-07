#!/usr/bin/env node

var express = require('express'),
    YUI = require('yui3').YUI;

YUI({
		debug: true,
		combine: false,
		filter: 'raw'
	}).use('express', 'node', function(Y) {

    var app = express.createServer();

    app.configure(function(){
        app.use(express.methodOverride());
        app.use(express.bodyDecoder());
        app.use(app.router);
        app.use(express.staticProvider(__dirname + '/public'));
    });

    app.register('.html', YUI);


	app.get('/', function(req, res){
        YUI({
				debug: true,
				combine: false,
				filter: 'raw',
				groups: {
					'wireit': {
						base: '../build/',
						combine: false,
						modules: {
							 "wire-css": {
									"path": "wireit/assets/wireit-core.css",
									"type": "css"
							 },
						    "wireit": {
						        "path": "wireit/wireit.js",
						        "requires": ["overlay","widget-parent","widget-child","dd","resize","wire-css"]
						    }
						}
					}
				}
			}).use('node', function(Y) {
            Y.Env._loader.ignoreRegistered = true;
            Y.use('overlay', 'wireit', function(Y) {
                var div = Y.Node.create('<div id="demo"></div>');
                Y.one('title').set('innerHTML', 'YUI3 WireIt Wire Page');
                Y.one('body').addClass('yui3-skin-sam').appendChild(div);


				  // Add a wire
				  var w1 = new Y.Wire({
				    src: { getXY: function() { return [300,50]; } },
			    	 tgt: { getXY: function() {	return [700,250];	} },
				    plugins: [ 
				        {fn: Y.WireBezierPlugin, cfg:{bezierTangentNorm:300} }
				    ]
				  });
				
					w1.render('#demo');
					w1.drawWire();
										
					w1.Bezier._ccc.toBuffer(function(err, buf){
							var base64_encode = require('base64').encode;
							
							Y.Node.create('<div><img src="data:image/png;base64,'+
													base64_encode(buf)+'" /></div>')
											.appendTo('#demo');
							
		                res.render('tabview.html', {
		                    locals: {
		                        instance: Y,
		                        use: ['tabview'],
		                        content: '#content',
		                        after: function(Y) {
		                            //Y.Get.domScript('/tabview.js');
		                        }
		                    }
		                });
					  });

					
            });
        });
    });

    app.get('/combo', YUI.combo);

    YUI.partials = [
        {
            method: 'append',
            node: 'body',
            name: 'layout_append'
        },
        {
            method: 'prepend',
            node: 'body',
            name: 'layout_prepend'
        }
    ];

    Y.log('Server listening: http:/'+'/localhost:3001/', 'info', 'express');
    app.listen(3001);

});