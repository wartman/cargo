mod(function (mod) {
  
  mod.imports('underscore').as('_');
  mod.imports('View').from('..base');
  mod.imports('Project', 'ProjectCollection').from('...model.project');
  mod.imports('ProjectView').from('.project');

  // Handles browsing projects in the admin area.
  // Maybe rename to grid?
  mod.BrowseView = mod.View.extend({

    collection: mod.ProjectCollection,

    initialize: function () {

    }

  })

});