YUI.add('yide-accordionview', function(Y) {
		
    var accordionview = function(args) {
        accordionview.superclass.constructor.apply(this, arguments);
    }

    accordionview.NAME = "accordionview";

    Y.extend(accordionview, Y.Base, {
        initializer: function(args) {	
				
				function onTitleClicked(e, a) {
         		var i = a.findSection(e.target);
         		if (i >= 0) {
         			a.toggleSection(i);
         		}
         	}
				
				var titles = [],
				    sections = [];
      		
      		
				for(var key in Y.ide.config.groups) {
				   var group = Y.ide.config.groups[key];
				   
				   titles.push('<div class="my-title-vert"><a href="#"><img src="'+YUI_config.groups.wireit.base+'yide/assets/skins/sam/icons/'+group.icon+'" />'+group.label+'</a></div>');
				   
				   var section = '';
				   for(var i = 0 ; i < group.items.length ; i++) {
				      var item = group.items[i];
				      section += '<div class="accordion-item"><img src="'+YUI_config.groups.wireit.base+'yide/assets/skins/sam/icons/'+item.icon+'" /><span>'+item.label+'</span></div>';
				   }
				   sections.push(section);
				}
				
				var vjs = new Y.Accordion({
         	   allowMultipleOpen: true,
         	   allowAllClosed: true,
         		animateInsertRemove: false,
         		animateOpenClose: false,
         		animateRender: false,
         		titles: titles,
         		sections: sections
         	});
         	
         	function getItemByLabel(label) {
         	   for(var key in Y.ide.config.groups) {
   				   var group = Y.ide.config.groups[key];
   				   for(var i = 0 ; i < group.items.length ; i++) {
   				      var item = group.items[i];
   				      if(item.label == label) return item;
   				   }
   				}
         	   return null;
         	}
         	
         	var that = this;
         	this.namedTabs = {};
         	
         	function onItemClicked(e, a) {
         	   
               // find the tabClass associated to the group item
               var item = getItemByLabel(e.target._node.innerHTML);
               
               // tab already created
               if(that.namedTabs[item.label]) {
                  // lookup the index and show the existing tab
                  var tab = that.namedTabs[item.label];
                  Y.ide.tabView.tabview.selectChild( tab.get('index') );
                  return;
               }
               
               // Use the YUI loader to load additional modules
               var m = Y.Lang.isArray(item.requires) ? item.requires.slice(0) : [];
               m.push(function(Y) {
                  
                  var tab = new Y[item.type]({
                     label: '<img src="'+YUI_config.groups.wireit.base+'yide/assets/skins/sam/icons/'+item.icon+'" /><span>'+item.label+'</span>'
                  });

                  tab.before('destroyed', function() {
                     console.log("tab destroy");
                     that.namedTabs[item.label] = null;
                  });

                  Y.ide.tabView.tabview.add(tab);
                  
                  that.namedTabs[item.label] = tab;

   			      Y.ide.tabView.tabview.selectChild( Y.ide.tabView.tabview.size()-1 );
               });
         	   // dynamically load the required modules
               Y.use.apply(Y, m);
         	}
         	
         	vjs.after('render', function() {
         	   
         	   // Expand on title clicks
               vjs.get('boundingBox').all('.my-title-vert').on('click', onTitleClicked, null, vjs);
               
         	   // Expand on title clicks
               vjs.get('boundingBox').all('div.accordion-item').on('click', onItemClicked, null, vjs);
               
            });
				
				vjs.render( Y.ide.leftLayout.get('contentBox') );				
				
				vjs.openAllSections();
					
				this.vjs = vjs;
        }
    });

   Y.ide.register(accordionview);

}, '3.6.0', {requires: ['yide', 'gallery-accordion-horiz-vert']});
