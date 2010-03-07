// Methods to persist the tooltip if we are hovering over the tooltip element 
/*EVT.addListener(this.tooltip.element, "mouseover", function(e,obj) {
   if (this.hideProcId) {
        clearTimeout(this.hideProcId);
        this.hideProcId = null;
    }
}, this.tooltip, true);
EVT.addListener(this.tooltip.element, "mouseout", function(e,obj) {
   if (this.showProcId) {
       clearTimeout(this.showProcId);
       this.showProcId = null;
   }
   if (this.hideProcId) {
       clearTimeout(this.hideProcId);
       this.hideProcId = null;
   }
   var me = this;
   this.hideProcId = setTimeout(function () {
       me.hide();
   }, this.cfg.getProperty("hidedelay"));
}, this.tooltip, true);*/