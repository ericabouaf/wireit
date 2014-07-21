
Y.WiringListView = Y.Base.create('wiringListView', Y.View, [], {
   
   template: Y.Handlebars.compile(Y.one('#t-wiring-list').getContent()),
   
   /*initializer: function () {
   },*/
   
   render: function () {
      var content = this.template({wirings: this.get('modelList').toJSON() });
      this.get('container').setContent(content);
      return this;
   }
});
