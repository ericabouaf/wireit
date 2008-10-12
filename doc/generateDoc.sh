#!/bin/sh
echo "=== Generating doc ==="
cd ../../../Outils/jsdoc_toolkit-2.0.2
java -jar jsrun.jar app/run.js -c=../../Projets/WireIt/doc/wireit.conf ../../Projets/WireIt/js
