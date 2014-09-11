mod(function (mod) {
  
  mod.imports('Model', 'Collection').from('.base');
  mod.imports('config').from('..config');

  var paths = mod.config.paths;

  mod.Project = mod.Model.extend({

    urlRoot: function () {
      return paths.api + 'project/';
    }

  });

  mod.ProjectCollection = mod.Collection.extend({

    model: mod.Project,

    url: function () {
      return paths.api + 'project';
    }

  });

});