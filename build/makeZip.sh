#!/bin/sh
# This is the command line to create the wireit distribution zip file
cd ../..
zip -vr WireIt-0.5.0.zip WireIt-0.5.0 -x "*.git*" "*.DS_Store*" "*rollups.sh" "*makeZip.sh" "*/res/*.xcf" "*/res/presentations/*" "*yuidoc.sh" "*/sandbox/*" "*/doc-parser/*" "*/doc-template/*" "*/PersistingTooltip.js"

