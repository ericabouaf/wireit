if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/image-container/image-container.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/image-container/image-container.js",
    code: []
};
_yuitest_coverage["build/image-container/image-container.js"].code=["YUI.add('image-container', function (Y, NAME) {","","/**"," * @module image-container"," */","","/**"," * ImageContainer is an Overlay (XY positioning)"," * It is a WidgetChild (belongs to Layer)"," * It is also a WidgetParent (has many terminals)"," * @class ImageContainer"," * @extends ContainerBase"," * @constructor"," */","Y.ImageContainer = Y.Base.create(\"image-container\", Y.ContainerBase, [], {","   ","   /**","    * @method renderUI","    */","   renderUI: function () {","      ","      // TODO: ","      var image = Y.Node.create('<img src=\"'+this.get('imageUrl')+'\" width=\"'+this.get('width')+'\"  height=\"'+this.get('height')+'\"/>');","      image.appendTo( this.get('contentBox') );","      this.image = image;","      ","      //console.log( Y.WidgetStdMod.BODY, this._getStdModContent(Y.WidgetStdMod.BODY) );","            ","        // make the overlay draggable","      this.drag = new Y.DD.Drag({","           node: this.get('boundingBox'), ","         handles : [ image ]","        });","   ","      this.drag.on('drag:drag', function () {","         this.redrawAllWires();","      }, this);","   ","   ","      // Make the overlay resizable","      var contentBox = this.get('contentBox');","      var resize = new Y.Resize({ ","         node: contentBox,","         handles: 'br'","      });","      /*resize.plug(Y.Plugin.ResizeConstrained, {","         preserveRatio: true","       });*/","      // On resize, fillHeight, & align terminals & wires","      resize.on('resize:resize', function (e) {","         // TODO: fillHeight","         this._fillHeight();","         ","         //console.log(e.details[0].info);","         var p = e.details[0].info;","         var w = p.right-p.left;","         var h = p.bottom-p.top;","         //console.log(w+\"x\"+h);","         ","         // WARNING !!!","         this.image.set('width',w);","         this.image.set('height',h);","         ","         this.each(function (term) {","            if(term.get('align')) {   ","               term.align( contentBox, [\"tl\",term.get('align').points[1]]);","            }","         }, this);","         ","         this.redrawAllWires();","      }, this);","      ","   }","   ","}, {","","   ATTRS: {","      /**","       * Url of the image you want to render (relative to the script's page)","       * @attribute imageUrl","       */","      imageUrl: {","         value: ''","      },","      ","      zIndex: {","         value: 5","      }","   }","   ","});","","","}, '@VERSION@', {\"requires\": [\"container-base\"]});"];
_yuitest_coverage["build/image-container/image-container.js"].lines = {"1":0,"15":0,"23":0,"24":0,"25":0,"30":0,"35":0,"36":0,"41":0,"42":0,"50":0,"52":0,"55":0,"56":0,"57":0,"61":0,"62":0,"64":0,"65":0,"66":0,"70":0};
_yuitest_coverage["build/image-container/image-container.js"].functions = {"(anonymous 2):35":0,"(anonymous 4):64":0,"(anonymous 3):50":0,"renderUI:20":0,"(anonymous 1):1":0};
_yuitest_coverage["build/image-container/image-container.js"].coveredLines = 21;
_yuitest_coverage["build/image-container/image-container.js"].coveredFunctions = 5;
_yuitest_coverline("build/image-container/image-container.js", 1);
YUI.add('image-container', function (Y, NAME) {

/**
 * @module image-container
 */

/**
 * ImageContainer is an Overlay (XY positioning)
 * It is a WidgetChild (belongs to Layer)
 * It is also a WidgetParent (has many terminals)
 * @class ImageContainer
 * @extends ContainerBase
 * @constructor
 */
_yuitest_coverfunc("build/image-container/image-container.js", "(anonymous 1)", 1);
_yuitest_coverline("build/image-container/image-container.js", 15);
Y.ImageContainer = Y.Base.create("image-container", Y.ContainerBase, [], {
   
   /**
    * @method renderUI
    */
   renderUI: function () {
      
      // TODO: 
      _yuitest_coverfunc("build/image-container/image-container.js", "renderUI", 20);
_yuitest_coverline("build/image-container/image-container.js", 23);
var image = Y.Node.create('<img src="'+this.get('imageUrl')+'" width="'+this.get('width')+'"  height="'+this.get('height')+'"/>');
      _yuitest_coverline("build/image-container/image-container.js", 24);
image.appendTo( this.get('contentBox') );
      _yuitest_coverline("build/image-container/image-container.js", 25);
this.image = image;
      
      //console.log( Y.WidgetStdMod.BODY, this._getStdModContent(Y.WidgetStdMod.BODY) );
            
        // make the overlay draggable
      _yuitest_coverline("build/image-container/image-container.js", 30);
this.drag = new Y.DD.Drag({
           node: this.get('boundingBox'), 
         handles : [ image ]
        });
   
      _yuitest_coverline("build/image-container/image-container.js", 35);
this.drag.on('drag:drag', function () {
         _yuitest_coverfunc("build/image-container/image-container.js", "(anonymous 2)", 35);
_yuitest_coverline("build/image-container/image-container.js", 36);
this.redrawAllWires();
      }, this);
   
   
      // Make the overlay resizable
      _yuitest_coverline("build/image-container/image-container.js", 41);
var contentBox = this.get('contentBox');
      _yuitest_coverline("build/image-container/image-container.js", 42);
var resize = new Y.Resize({ 
         node: contentBox,
         handles: 'br'
      });
      /*resize.plug(Y.Plugin.ResizeConstrained, {
         preserveRatio: true
       });*/
      // On resize, fillHeight, & align terminals & wires
      _yuitest_coverline("build/image-container/image-container.js", 50);
resize.on('resize:resize', function (e) {
         // TODO: fillHeight
         _yuitest_coverfunc("build/image-container/image-container.js", "(anonymous 3)", 50);
_yuitest_coverline("build/image-container/image-container.js", 52);
this._fillHeight();
         
         //console.log(e.details[0].info);
         _yuitest_coverline("build/image-container/image-container.js", 55);
var p = e.details[0].info;
         _yuitest_coverline("build/image-container/image-container.js", 56);
var w = p.right-p.left;
         _yuitest_coverline("build/image-container/image-container.js", 57);
var h = p.bottom-p.top;
         //console.log(w+"x"+h);
         
         // WARNING !!!
         _yuitest_coverline("build/image-container/image-container.js", 61);
this.image.set('width',w);
         _yuitest_coverline("build/image-container/image-container.js", 62);
this.image.set('height',h);
         
         _yuitest_coverline("build/image-container/image-container.js", 64);
this.each(function (term) {
            _yuitest_coverfunc("build/image-container/image-container.js", "(anonymous 4)", 64);
_yuitest_coverline("build/image-container/image-container.js", 65);
if(term.get('align')) {   
               _yuitest_coverline("build/image-container/image-container.js", 66);
term.align( contentBox, ["tl",term.get('align').points[1]]);
            }
         }, this);
         
         _yuitest_coverline("build/image-container/image-container.js", 70);
this.redrawAllWires();
      }, this);
      
   }
   
}, {

   ATTRS: {
      /**
       * Url of the image you want to render (relative to the script's page)
       * @attribute imageUrl
       */
      imageUrl: {
         value: ''
      },
      
      zIndex: {
         value: 5
      }
   }
   
});


}, '@VERSION@', {"requires": ["container-base"]});
