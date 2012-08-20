YUI.add('yide-chartstab', function(Y) {

   
   /**
    *  ChartsTab
    */
   Y.ChartsTab = function() {
      Y.ChartsTab.superclass.constructor.apply(this, arguments);
      
      this.after('render', this.renderCharts, this, true);
   };
   
   Y.extend(Y.ChartsTab, Y.Tab, {
      
      renderCharts: function() {
         
         
         var myDataValues = [ 
                 {category:"5/1/2010", values:2000}, 
                 {category:"5/2/2010", values:50}, 
                 {category:"5/3/2010", values:400}, 
                 {category:"5/4/2010", values:200}, 
                 {category:"5/5/2010", values:5000}
             ];

         var mychart = new Y.Chart({
            dataProvider:myDataValues, 
            render: this.get('panelNode') ,
            width: 500,
            height: 300
         });
         
         
      }
      
   });
   
   Y.ChartsTab.NAME = "tab";


}, '3.6.0', {requires: ['yide','charts']});
