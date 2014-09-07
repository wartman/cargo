mod(function () {
  
  this.imports('underscore').as('_');
  this.imports('View').from('..base');
  this.imports('Project', 'ProjectCollection').from('...model.project');

  // The view layer for creating and managing projects.
  this.ProjectView = this.View.extend({

    model: this.Project,

    initialize: function () {
      //this.sup();

    },

    // etc.

  });

});