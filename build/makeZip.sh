#!/bin/sh
# This is the command line to create the wireit distribution zip file
cd ../..
zip -vr WireIt-0.4.0.zip WireIt-0.4.0 -x "*.git*" "*.DS_Store*" "*build.sh" "*makeZip.sh" "*/res/*.xcf" "*/res/presentations/*" "*yuidoc.sh" "*/xproc/*" "*/ExhibitMaker/*" "*/jsWireTalk/*" "*/wireitbuilder/*" "*/ExhibitMaker/*" "*/jsWireTalk/*" "*/wireitbuilder/*" "*/doc-parser/*" "*/doc-template/*" "*/PersistingTooltip.js" "*/lib/yui-accordion/*"

