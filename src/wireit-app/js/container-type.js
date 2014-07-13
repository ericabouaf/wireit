


// -- ContainerType ---------------------------------------------------------------------
Y.ContainerType = Y.Base.create('containerModel', Y.Model, [], {
   // The `id` attribute for this Model will be an alias for `name`.
   idAttribute: 'name'
}, {
   ATTRS: {
      name       : {value: null},
      description: {value: null},
      config   : {value: null}
   }
});

// -- ContainerTypeList -----------------------------------------------------------------
Y.ContainerTypeList = Y.Base.create('containerTypeList', Y.ModelList, [], {
   model: Y.ContainerType
});