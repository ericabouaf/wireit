YUI.add('yide', function(Y) {
	
	Y.ide = {
		
		/** 
		 * Keep track of all loaded Y.ide extensions
		 */
		extensions: [], 

		/**
		 * Register a new Y.ide extension
		 */
		register: function(klass) {
			this.extensions.push(klass);
		},
		
		init: function(config) {
		   this.config = config;
			this.renderLayout();
         this.initExtensions();
		},
		
		/**
		 * Instantiate all extensions
		 */
		initExtensions: function() {
         var i, n = this.extensions.length,name;
			for(i=0;i<n;i++) {
			   name = this.extensions[i].NAME;
			   try {
				   Y.ide[name] = new this.extensions[i]();
			   } catch(ex) {
			      console.error("Error loading extension "+name);
			      console.log(ex);
			   }
			}
		},
		
		renderLayout: function() {
			
         var layout = new Y.Layout({orientation: 'vertical', sizeToWindow: true });

   	   this.topLayout = new Y.LayoutChild({id:'top', height:50/*, resize: true */});
   	   layout.add(this.topLayout);

         // This creates another layout and adds it as a child to the root layout,
         // resulting in a nested layout.  The fluid:true parameter means that the height
         // of this child will be determined by available space.
         this.mainLayout = new Y.Layout({fluid: true, orientation: 'horizontal' });
         layout.add(this.mainLayout);

         // This is another child layout, but with an initial fixed height and resizable.
         //this.bottomLayout = new Y.Layout({id:'bottom', height:100, orientation: 'horizontal', resize: true });
         //layout.add(this.bottomLayout);

      	// We now fill up the center child layout. Two of the children have initial
      	// fixed widths, and are collapsable and resizable.  The center child will be
      	// sized according to available space.
      	// We will also give the children standard module format sections and auto-generated headers,
      	// by using the *Std layout children
      	//this.leftLayout = new Y.LayoutChildCollapsableStd({id: 'left', width:150, resize: true, label:'Left'});
      	this.leftLayout = new Y.LayoutChild({id: 'left', width:150, /*resize: true,*/ label:''});
      	this.mainLayout.add(this.leftLayout);
      	
      	this.centerLayout = new Y.LayoutChild({id: 'center', fluid: true, label:'' });
      	this.mainLayout.add(this.centerLayout);
      	
      	layout.render();
      	
      	this.leftLayout.get('boundingBox').addClass("leftLayout");
		
			this.layout = layout;
		}
		
		
	};

}, '3.6.0', {requires: ['gallery-axo-layout', 'gallery-aui-skin-classic','resize']});
