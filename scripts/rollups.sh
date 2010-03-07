#!/bin/sh
# Build WireIt rollup files
# Compressed using the YUI compressor

YUIcompressorJar=~/Tools/yuicompressor-2.3.6/build/yuicompressor-2.3.6.jar

cd ../build

#	wireit-min.js:
rm -f wireit.js wireit-min.js
cat ../js/WireIt.js ../js/CanvasElement.js ../js/Wire.js ../js/Terminal.js ../js/util/Anim.js ../js/util/DD.js ../js/util/DDResize.js ../js/Container.js ../js/Layer.js ../js/LayerMap.js ../js/ImageContainer.js ../js/InOutContainer.js > wireit.js
java -jar $YUIcompressorJar  wireit.js -o wireit-min.js --charset utf8


# TODO: rollups for various modules picks... (only js, not css)