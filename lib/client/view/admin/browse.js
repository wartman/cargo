module(function (_) {
  
  _.imports('View', 'loadTemplate').from('..base');
  _.imports('Project', 'ProjectCollection').from('...model.project');
  _.imports('ProjectPreview').from('.project');

  // Handles browsing projects in the admin area.
  // Maybe rename to grid?
  _.BrowseView = _.View.extend({

    initialize: function () {
      this.collection = new _.ProjectCollection();
      this.items = {};
      this.render();
    },

    addItem: function (model) {
      var preview = this.items[model.get('id')] = new _.ProjectPreview({model: model});
      var self = this;
      preview.render().then(function (preview) {
        self.$el.append(preview.el);
      });
    },

    render: function () {
      var self = this;
      // Replace 'fetch' with some sort of BOOTSTRAP variable!
      this.collection
        .fetch()
        .then(function (){
          self.collection.forEach(function (model) {
            self.addItem(model);
          });
        });
    }

  });

});