
// -- WiringList View ------------------------------------------------------------

Y.WiringListView = Y.Base.create('wiringListView', Y.View, [], {
   
   template: Y.Handlebars.compile(Y.one('#t-wiring-list').getContent()),
   
   initializer: function () {
      
      //console.log('WiringListView init');
      
      /*var list = this.get('modelList');
      
      // Re-render this view when a model is added to or removed from the model list.
      list.after(['add', 'remove', 'reset'], this._test, this);
      
      // We'll also re-render the view whenever the data of one of the models in the list changes.
      list.after('*:change', this._test, this);*/
   },
   
   /*_test: function () {
      console.log('_test');
   },*/
   
   render: function () {
      
      //console.log('WiringListView render');
      
      var content = this.template({wirings: this.get('modelList').toJSON() });
      this.get('container').setContent(content);
      return this;
   }
});