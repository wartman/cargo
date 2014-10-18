module(function (_) {
  
  _.imports('Model', 'Collection').from('.base');
  _.imports('..config');

  var paths = _.config.get('paths');

  _.Project = _.Model.extend({

    urlRoot: function () {
      return paths.api + 'project/';
    }

  });

  _.ProjectCollection = _.Collection.extend({

    model: _.Project,

    url: function () {
      return paths.api + 'project';
    }

  });

});