mod(function (mod) {
  
  mod.imports('backbone').as('Backbone');
  mod.imports('Base').from('..core.base');

  var Model = mod.Model = mod.Base.extend({
    constructor: mod.Backbone.Model
  });

  Model.mixin(
    mod.Backbone.Model.prototype,
    {
      parse: function (response) {
        var data = response.data || response;
        if (data instanceof Array)
          return data[0];
        else
          return data;
      }
    }
  );

  var Collection = mod.Collection = mod.Base.extend({
    constructor: mod.Backbone.Collection
  });

  Collection.mixin(
    mod.Backbone.Collection.prototype,
    {
    
      model: Model,

      parse: function (response) {
        return response.data;
      }

    }
  );

});