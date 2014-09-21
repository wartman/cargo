module(function (_) {
  
  _.imports('backbone').as('Backbone');
  _.imports('Base').from('..core.base');

  var Model = _.Model = _.Base.extend({
    constructor: _.Backbone.Model
  });

  Model.mixin(
    _.Backbone.Model.prototype,
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

  var Collection = _.Collection = _.Base.extend({
    constructor: _.Backbone.Collection
  });

  Collection.mixin(
    _.Backbone.Collection.prototype,
    {
    
      model: Model,

      parse: function (response) {
        return response.data;
      }

    }
  );

});