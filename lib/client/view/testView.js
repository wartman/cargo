module(function (_) {
  
  _.imports('View').from('.base');
  _.imports('loadTemplate').from('..template.base');
  _.imports('Project', 'ProjectCollection').from('..model.project');

  _.TestView = _.View.extend({

    template: _.loadTemplate('./test/testTpl'),

    initialize: function () {
      var self = this;
      this.model = new _.Project({id: 1});
      this.model
        .fetch()
        .then(function () {
          self.render();
        });
    },

    test: function () {
      var collection = new _.ProjectCollection();
      var self = this;
      // console.log(collection);
      collection
        .fetch()
        .then(function () {
          self.template.then(function (tpl) {
            collection.forEach(function (model) {
              self.$el.append(tpl({model: model.attributes})); 
            });
          });
        });
    },

    render: function () {
      var self = this;
      this.template.then(function (tpl) {
        self.model.set('Foo', 'bar');
        self.$el.append(tpl({model: self.model.attributes}));
      });
    }

  });

});