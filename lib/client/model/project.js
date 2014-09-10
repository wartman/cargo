mod(function (mod) {
  
  mod.imports('Model', 'Collection').from('.base');
  mod.imports('config').from('..config');

  var paths = mod.config.paths;

  mod.Project = mod.Model.extend({

    url: function () {
      return paths.api + '/' + 'project/:id';
    }

  });

  mod.ProjectCollection = mod.Collection.extend({

    model: mod.Project

    url: function () {
      return paths.api + '/' + 'project';
    }

  });

});