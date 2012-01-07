

/**
 * Layer explosing animation
 * @method clearExplode
 */
Y.Layer.prototype.clearExplode = function(callback, bind) {

   var center = [ Math.floor(Y.DOM.viewportRegion().width/2),
		            Math.floor(Y.DOM.viewportRegion().height/2)];
   var R = 1.2*Math.sqrt( Math.pow(center[0],2)+Math.pow(center[1],2));

   for(var i = 0 ; i < this.containers.length ; i++) {
       var left = parseInt(dbWire.layer.containers[i].el.style.left.substr(0,dbWire.layer.containers[i].el.style.left.length-2),10);
	    var top = parseInt(dbWire.layer.containers[i].el.style.top.substr(0,dbWire.layer.containers[i].el.style.top.length-2),10);

	    var d = Math.sqrt( Math.pow(left-center[0],2)+Math.pow(top-center[1],2) );

	    var u = [ (left-center[0])/d, (top-center[1])/d];
	    Y.one(this.containers[i].el).setStyle("opacity", "0.8");

	    var myAnim = new Y.Anim({
	       node: this.containers[i].el,
	       to: {
           left: center[0]+R*u[0],
           top: center[1]+R*u[1],
           opacity: 0
          },
	       duration: 3
       });
       
       var terms = this.containers[i].terminals;
       myAnim.on('tween', function() {
          Y.Array.each(terms, function(t) {
    		  t.redrawAllWires();
    		});
       });
       
       if(i == this.containers.length-1) {
          myAnim.on('onComplete', function() { this.clear(); callback.call(bind);}, this, true); 
       }
	    myAnim.run();
   }

};