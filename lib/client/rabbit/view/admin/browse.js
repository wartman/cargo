mod(function () {
  
  this.imports('underscore').as('_');
  this.imports('View').from('..base');
  this.imports('Project', 'ProjectCollection').from('...model.project');
  this.imports('ProjectView').from('.project');

  // Handles browsing projects in the admin area.
  // Maybe rename to grid?
  this.BrowseView = this.View.extend({

    collection: this.ProjectCollection,

    initialize: function () {

    }

  })

});