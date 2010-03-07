# WireIt private Wish-list / TODO list

## Bugs

 * Editor: Don't save/load the JSON as a string, let the adapter handle it
					+ button to export/load to multiple formats	
				
 * Adapters: split "createWire" and "updateWire"
				
 * rest-json adapter
 * Rename json-rpc store store
 * Add the Wiring model to the core components <-> Layer will be able to load/save Wirings...
					
 * DDResize on Containers should redraw wires

 * fix the close button on containers (css positionning & image)

 * Fix the "grouping" module
 * Fix the "labels" module

## Performance 

 * remove references to inputParams

## Doc

 * Better demo language for editor
 * Warning message for the ajax/json-rpc adapters

## Examples

 * XML Wiring Editor
 * Layer Selection (different than rubber)
 * Movable Layer
 * catenary wire (draw a cosh in a canvas + Reason-like example)
 * BPMN-editor
 * XProc-editor

## Features

### editor module

 * Dynamically load a language

 * Editor: Undo/Redo feature on the WiringEditor (best on the BaseEditor)

 * Make the Wiring editor with multiple tabs (TabView)

 * Make the wiring editor able to dynamically load a language definition
 * integrate the wireit builder in the wiring editor
 * I18n

 * adapter using the YUI 2 Storage Utility http://developer.yahoo.com/yui/storage/

