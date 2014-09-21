module(function (_) {
  
  _.imports('underscore').as('_');
  _.imports('View').from('..base');
  _.imports('Project', 'ProjectCollection').from('...model.project');

  // The view layer for creating and managing projects.
  _.ProjectView = _.View.extend({

    model: _.Project,

    initialize: function () {
      //this.sup();

    },

    // etc.

  });

});