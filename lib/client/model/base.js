module(function (_) {
  
  _.imports('backbone');
  _.imports('Base').from('..core.base');
  _.imports('Promise').from('..core.defer');
  _.imports('ResponseState').from('.responseState');

  var oldSync = _.backbone.sync;
  _.backbone.sync = function () {
    // Just make sure that the response is cast into
    // our promises/A+ complaint implementation.
    return new _.Promise(oldSync.apply(this, arguments).then)
      .catch(function(err) {
        // Handle errors consistently.
        _.backbone.trigger('AJAX:error', err);
      });
  };

  // model 
  // -----
  // Make sure models are complaint with our JSON API (and
  // give them Base inheritance).
  _.Model = _.Base.extend({
    constructor: _.backbone.Model
  });

  _.Model.mixin(_.backbone.Model.prototype, {
    parse: function (response) {
      var data = response.data || response;
      if (data instanceof Array)
        return data[0];
      else
        return data;
    },
    sync: function () {
      return _.backbone.sync.apply(this, arguments);
    }
  });

  // Collection
  // ----------
  // Make sure Collections are complaint with our JSON API (and
  // give them Base inheritance).
  _.Collection = _.Base.extend({
    constructor: _.backbone.Collection
  });

  _.Collection.mixin(_.backbone.Collection.prototype, {
    model: _.Model,
    parse: function (response) {
      return response.data;
    },
    sync: function () {
      return _.backbone.sync.apply(this, arguments);
    }
  });

});