mod(function (mod) {
  
  mod.imports('backbone').as('Backbone');
  mod.imports('Base').from('..core.base');

  var Model = mod.Model = mod.Base.extend({
    constructor: mod.Backbone.Model
  });

  Model.mixin(
    mod.Backbone.Model.prototype,
    {
      parse: function (data) {
        return data.data[0];
      }
    }
  );

  var Collection = mod.Collection = mod.Base.extend({
    construcor: mod.Backbone.Collection
  });

  Collection.mixin(
    mod.Backbone.Collection.prototype,
    {
    
      model: Model,

      parse: function (data) {
        return data.data;
      }

    }
  );

});