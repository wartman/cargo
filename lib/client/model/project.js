mod(function () {
  
  this.imports('Model', 'Collection').from('.base');
  this.imports('config').from('..config');

  var paths = this.config.paths;

  var Project = this.Project = this.Model.extend({

    url: function () {
      return paths.api + '/' + 'project/:id';
    }

  });

  var ProjectCollection = this.ProjectCollection = this.Collection.extend({

    model: Project

    url: function () {
      return paths.api + '/' + 'project';
    }

  });

});