mod(function (mod) {
  
  mod.imports('underscore').as('_');
  mod.imports('View').from('..base');
  mod.imports('Project', 'ProjectCollection').from('...model.project');

  // The view layer for creating and managing projects.
  mod.ProjectView = mod.View.extend({

    model: mod.Project,

    initialize: function () {
      //this.sup();

    },

    // etc.

  });

});