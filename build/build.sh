#!/bin/sh
#
#  - Concatenate all js files into build/wireit.js
#  - minify it using YUI compressor to build/wireit-min.js
#
rm -f wireit.js wireit-min.js
cat ../js/WireIt.js ../js/CanvasElement.js ../js/Wire.js ../js/Terminal.js ../js/util/DD.js ../js/util/DDResize.js ../js/Container.js ../js/Layer.js ../js/util/Anim.js > wireit.js
java -jar ~/Outils/yuicompressor-2.3.6/build/yuicompressor-2.3.6.jar  wireit.js -o wireit-min.js --charset utf8
