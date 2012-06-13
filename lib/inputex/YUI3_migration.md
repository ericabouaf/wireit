# YUI3 migration

@piercus started to rewrite InputEx fields for YUI3.

I wrote about 5 prototypes of inputEx using YUI3, all of them were too ambitious.

Not an ideal YUI3 version, but first milestone towards YUI3...


Guidelines to give inputEx 3 a fresh start :

* Remove as many YUI2 dependencies as possible
* Change the API as little as possible: 
  * eg. Dom element references are not Y.Node(s) yet. But you can use them in your subclasses !
* Use the YUI loader (now unique in src/loader.js)
* remove deprecated/unused/broken code

## TODO:

* Fix fields: autocomplete, multi*, object
* Add dtInPlace

## LATER :

* merge examples scripts with a unit-test engine ?
* move exemples into each module


## Changelog


* locals -> using native YUI intl module
* moved every field as a YUI module
* Adding: 
  * RatingStars from @piercus
  * Y.inputEx.Base
  * Y.inputEx.Panel, to replace Dialog

* removed inputEx.Datatable replaced by: Y.Plugin.DatatableInputex

* removed: 
  * YQL utilities (already in YUI3)
  * dependency-configurator, 
  * outdated demos: task manager, inputExHTML
  * ddlist (replaced by YUI's 'sortable' module)
  * remove widget.Dialog

## Developer guide


### Updated Event

  field.updatedEvt.subscribe(function(e,params){
    var val = params[0];
  })

now becomes

  field.on('updated', function(value, field){
    ...
  })

### old YAHOO references

* YAHOO.env.ua => Y.UA

* YAHOO.lang => Y.Lang

* Y.lang.extend => Y.extend

* YAHOO.augmentObject replaced by
 *  Y.mix // is used instead of YAHOO.augmentObject
 *  Y.augment  // is used when augment an Object which have a prototype

* DOM.addClass(el,className) => Y.one(el).addClass(className)

* YAHOO.util.Event.addListener(node, "click", function(){}) => Y.one(node).on("click", function(){})
