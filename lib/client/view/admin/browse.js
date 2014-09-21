module(function (_) {
  
  _.imports('View').from('..base');
  _.imports('Project', 'ProjectCollection').from('...model.project');
  _.imports('ProjectView').from('.project');

  // Handles browsing projects in the admin area.
  // Maybe rename to grid?
  _.BrowseView = _.View.extend({

    collection: _.ProjectCollection,

    initialize: function () {

    }

  })

});