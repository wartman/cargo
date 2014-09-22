module(function (_) {
  
  _.imports('backbone').as('Backbone');
  _.imports('Base').from('..core.base');
  _.imports('Promise').from('..core.defer');
  _.imports('ResponseState').from('.responseState');

  var oldSync = _.Backbone.sync;
  _.Backbone.sync = function () {
    // Just make sure that the response is cast into
    // our promises/A+ complaint implementation.
    return new _.Promise(oldSync.apply(this, arguments).then)
      .catch(function(err) {
        // Handle errors consistently.
        _.Backbone.trigger('AJAX:error', err);
      });
  };

  // Model
  // -----
  // Make sure models are complaint with our JSON API (and
  // give them Base inheritance).
  _.Model = _.Base.extend({
    constructor: _.Backbone.Model
  });

  _.Model.mixin(_.Backbone.Model.prototype, {
    parse: function (response) {
      var data = response.data || response;
      if (data instanceof Array)
        return data[0];
      else
        return data;
    },
    sync: function () {
      return _.Backbone.sync.apply(this, arguments);
    }
  });

  // Collection
  // ----------
  // Make sure Collections are complaint with our JSON API (and
  // give them Base inheritance).
  _.Collection = _.Base.extend({
    constructor: _.Backbone.Collection
  });

  _.Collection.mixin(_.Backbone.Collection.prototype,{
    model: _.Model,
    parse: function (response) {
      return response.data;
    },
    sync: function () {
      return _.Backbone.sync.apply(this, arguments);
    }
  });

});