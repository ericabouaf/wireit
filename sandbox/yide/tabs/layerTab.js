YUI.add('yide-layertab', function(Y) {

   
   /**
    *  LayerTab
    */
   Y.LayerTab = function() {
      Y.LayerTab.superclass.constructor.apply(this, arguments);
      
      this.after('render', this.renderLayer, this, true);
   };
   
   Y.extend(Y.LayerTab, Y.Tab, {
      
      renderLayer: function() {
         
         console.log("rendering Layer !!");
         
         this.layer = new Y.Layer({
            
            // TODO: set size
            width: 800,
            height: 500,
            
            // first container : 
            children: [
               {
               children: [
                 { align: {points:["tl", "tl"]} },
                 { align: {points:["tl", "tc"]} },
                 { align: {points:["tl", "tr"]} },
                 { align: {points:["tl", "lc"]} },
                 { align: {points:["tl", "rc"]} },
                 { align: {points:["tl", "br"]} },
                 { align: {points:["tl", "bc"]} },
                 { align: {points:["tl", "bl"]} }
               ],
               type: 'Container',
               width: 200,
               height: 100,
               xy: [200,200],
               headerContent: '9 terminals',
               bodyContent: 'bodyContent',
               footerContent: 'footerContent',
               zIndex: 5,
               fillHeight: true
             },
          
             {
               type: "ImageContainer",
               children: [
                 { align: {points:["tl", "tl"]} },
                 { align: {points:["tl", "tc"]} },
                 { align: {points:["tl", "tr"]} },
                 { align: {points:["tl", "lc"]} },
                 { align: {points:["tl", "rc"]} },
                 { align: {points:["tl", "br"]} },
                 { align: {points:["tl", "bc"]} },
                 { align: {points:["tl", "bl"]} }
               ],
               xy: [500,30],
               zIndex: 5,
               fillHeight: true
             }
          
           ]
         });
         
         this.layer.render( this.get('panelNode') );
         
      }
      
   });
   
   Y.LayerTab.NAME = "tab";


}, '3.6.0', {requires: ['yide','layer','bezier-wire','image-container']});
