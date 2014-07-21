
// -- WiringModel ---------------------------------------------------------------------
Y.WiringModel = Y.Base.create('wiringModel', Y.Model, [], {
   sync: LocalStorageSync('wireit-app')
}, {
   ATTRS: {
      id: {value: null},
      name       : {value: ''},
      containers   : {value: []},
      description: {value: ''},
      wires   : {value: []}
   }
});


// -- WiringModelList ---------------------------------------------------------------------

Y.WiringModelList = Y.Base.create('wiringModelList', Y.ModelList, [], {
   sync: LocalStorageSync('wireit-app'),
    model    : Y.WiringModel
});
