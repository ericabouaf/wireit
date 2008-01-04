#!/bin/sh
#
#  - Concatenate all js files into build/wireit.js
#  - minify it using YUI compressor to build/wireit-min.js
#
rm -f wireit.js wireit-min.js
cat ../js/WireIt.js ../js/Wire.js ../js/Terminal.js ../js/util/DD.js ../js/util/DDResize.js ../js/Container.js ../js/Layer.js ../js/util/Anim.js > wireit.js
java -jar ../../yuicompressor-2.2.5/build/yuicompressor-2.2.5.jar  wireit.js -o wireit-min.js --charset utf8
