(function() {
    var util = YAHOO.util,lang = YAHOO.lang;
    var Event = util.Event, Dom = util.Dom, Connect = util.Connect,JSON = lang.JSON,widget = YAHOO.widget;

    WireIt.RubberBand = function(grouper) {
	WireIt.RubberBand.superclass.constructor.call(this, grouper.layer.el);
	
	this.grouper = grouper;
	var self = this;
	this.scrollThreshold = 150;
	this.scrollAmount = 20;
	this.directions = {};
	
	grouper.layer.el.addEventListener("mousemove", 
	    function(event) 
	    { 
		var elem = self.grouper.layer.el;
		var rect = elem.getBoundingClientRect();
		
		var xNoScroll = event.clientX-rect.left;
		var yNoScroll = event.clientY-rect.top;
		
		self.lastX = xNoScroll + elem.scrollLeft;
		self.lastY = yNoScroll + elem.scrollTop;
		
		self.directions = {};
		if (xNoScroll < self.scrollThreshold)
		{
		    //Near the left edge so scroll left
		    self.directions.left = true;
		}
		else if ((rect.right - event.clientX) < self.scrollThreshold)
		{
		    //Near the right edge
		    self.directions.right = true;
		}
		
		
		if (yNoScroll < self.scrollThreshold)
		{
		    //Near top
		    self.directions.up = true;
		}
		else if ((rect.bottom - event.clientY) < self.scrollThreshold)
		{
		    //Near bottom
		    self.directions.down = true;
		}
		
	    }, false);
    };


    YAHOO.lang.extend(WireIt.RubberBand, WireIt.CanvasElement, {
	layerMouseDown: function(event)
	{
	    var elem = this.grouper.layer.el;
	    var rect = elem.getBoundingClientRect();
	    
	    var xNoScroll = event.clientX-rect.left;
	    var yNoScroll = event.clientY-rect.top;
	    
	    if (xNoScroll < elem.clientWidth && yNoScroll < elem.clientHeight)
		this.start();
	},
	
	start: function()
	{
	    this.show();
	    
	    this.SetCanvasRegion(0, 0, this.grouper.layer.el.scrollWidth, this.grouper.layer.el.scrollHeight);
	    var ctxt = this.getContext();
	    ctxt.beginPath();
	    ctxt.moveTo(this.lastX, this.lastY);
	    this.startX = this.lastX;
	    this.startY = this.lastY;
	    this.timer = YAHOO.lang.later(100, this, function() 
		{ 
		    this.nextPoint(this.lastX, this.lastY);
		    this.scroll(this.directions);
		}, 0, true)
	},

	scroll: function(directions)
	{
	    var elem = this.grouper.layer.el;
	    
	    if (directions.left)
		elem.scrollLeft = Math.max(0, elem.scrollLeft-this.scrollAmount);
	    else if (directions.right)
		elem.scrollLeft = Math.min(elem.scrollWidth, elem.scrollLeft+this.scrollAmount);
		
	    if (directions.up)
		elem.scrollTop = Math.max(0, elem.scrollTop-this.scrollAmount);
	    else if (directions.down)
		elem.scrollTop = Math.min(elem.scrollHeight, elem.scrollTop+this.scrollAmount);
	},

	finish: function()
	{
	    if (lang.isObject(this.timer))
	    {
		this.timer.cancel();
		this.timer = null;
		
		var ctxt = this.getContext();
		this.nextPoint(this.startX, this.startY);
		
		YAHOO.lang.later(1000, this, this.hide, 0, false)
	    }
	},

	hide: function()
	{
	    if (!lang.isValue(this.element.style))
		this.element.style = {};
		    
	    this.element.style.display = "none";	    
	},
    
	show: function()
	{
	    if (!lang.isValue(this.element.style))
		this.element.style = {};
		    
	    this.element.style.display = "";	    
	},

	nextPoint: function(x, y)
	{
	    if (lang.isValue(x) && lang.isValue(y))
	    {
		var ctxt = this.getContext();
		
		// Draw the inner bezier curve
		ctxt.lineCap= "round";
		ctxt.strokeStyle="green";
		ctxt.lineWidth="3";

		ctxt.lineTo(x, y);
		ctxt.stroke();
	    }
	},

	pointIsInside: function(x, y)
	{
	    return (this.getContext().isPointInPath(x, y));
	}
    });
})();
