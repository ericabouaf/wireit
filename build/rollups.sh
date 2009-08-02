#!/bin/sh
# Build WireIt rollup files
# Compressed using the YUI compressor

#	wireit-min.js:
rm -f wireit.js wireit-min.js
cat ../js/WireIt.js ../js/CanvasElement.js ../js/Wire.js ../js/Terminal.js ../js/util/DD.js ../js/util/DDResize.js ../js/Container.js ../js/Layer.js ../js/util/inputex/FormContainer-beta.js ../js/LayerMap.js ../js/WiringEditor.js ../js/ImageContainer.js ../js/InOutContainer.js > wireit.js
java -jar ~/Tools/yuicompressor-2.3.6/build/yuicompressor-2.3.6.jar  wireit.js -o wireit-min.js --charset utf8


#	wiring-editor-min.js:
rm -f wiring-editor.js wiring-editor-min.js
cat ../lib/inputex/js/inputex.js ../lib/inputex/js/Field.js ../js/util/inputex/WirableField-beta.js ../lib/inputex/js/Group.js ../lib/inputex/js/Visus.js ../lib/inputex/js/fields/StringField.js ../lib/inputex/js/fields/Textarea.js ../lib/inputex/js/fields/SelectField.js ../lib/inputex/js/fields/EmailField.js ../lib/inputex/js/fields/UrlField.js ../lib/inputex/js/fields/ListField.js ../lib/inputex/js/fields/CheckBox.js ../lib/inputex/js/fields/InPlaceEdit.js ../lib/accordionview/accordionview-min.js ../js/WireIt.js ../js/CanvasElement.js ../js/Wire.js ../js/Terminal.js ../js/util/DD.js ../js/util/DDResize.js ../js/Container.js ../js/Layer.js ../js/util/inputex/FormContainer-beta.js ../js/LayerMap.js ../js/WiringEditor.js ../js/ImageContainer.js ../js/InOutContainer.js > wiring-editor.js
java -jar ~/Tools/yuicompressor-2.3.6/build/yuicompressor-2.3.6.jar  wiring-editor.js -o wiring-editor-min.js --charset utf8
