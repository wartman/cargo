mod(function (mod) {
  
  mod.imports('template').from('underscore');
  mod.imports('View').from('.base');
  mod.imports('Project', 'ProjectCollection').from('..model.project');

  var testTpl = mod.template([
    '<ul>',
      '<% for (var key in model.attributes) { %>',
        '<li>',
          '<strong><%= key %></strong> : <%= model.get(key) %>',
        '</li>',
      '<% } %>',
    '</ul>'
  ].join(''))

  mod.TestView = mod.View.extend({

    initialize: function () {
      var self = this;
      this.model = new mod.Project();
      // this.model.fetch().then(function (model) {
      //   console.log(model.attributes);
      //   self.render();
      // });
    },

    test: function () {
      var collection = new mod.ProjectCollection();
      var self = this;
      console.log(collection);
      collection
        .fetch()
        .then(function () {
          collection.forEach(function (model) {
            self.$el.append(testTpl({model: model}));
          });
        });
    },

    render: function () {
      this.$el.html(testTpl({model: this.model}));
    }

  });

});