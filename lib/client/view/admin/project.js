module(function (_) {
  
  _.imports('jquery').as('$');
  _.imports('each').from('underscore');
  _.imports('View', 'loadTemplate').from('..base');
  // _.imports({'Project': 'ProjectModel'}, 'ProjectCollection').from('...model.project');

  // The view layer for creating and managing projects.
  _.ProjectEdit = _.View.extend({

    template: _.loadTemplate('./project/form'),

    tagName: 'div',

    className: 'modal modal-edit modal-edit-project',

    attributes: function () {
      return {
        id: 'project-edit-' + this.model.get('id')
      }
    },

    events: {
      'submit .project-form': 'submit'
    },

    submit: function (e) {
      e.preventDefault();
      var data = {};
      var self = this;
      // A little ugly: look into making a jquery extension
      // for serializeObject:
      var pairs = this.$('.project-form').serializeArray();
      _.each(pairs, function (pair) {
        data[pair.name] = pair.value
      });
      this.model
        .set(data)
        .save()
        .then(function () {
          // do some kind of success thing here.
          console.log('Did it!');
        })
        .catch(function (err, thrownError) {
          // Handle errors here.
          console.log(thrownError);
          alert(thrownError);
        });
    },

    show: function () {
      console.log(this.el);
      _.$('#test-edit').html(this.el);
    },

    render: function () {
      var self = this;
      return this.template.then(function (tpl) {
        // NOTE: Rewrite the template to use the toJSON method:
        self.$el.html(tpl({project: self.model}));
        return self;
      })
    }

    // etc.

  });

  _.ProjectPreview = _.View.extend({

    template: _.loadTemplate('./project/preview'),

    tagName: 'article',

    className: 'grid-item',

    // other HTML attributes.
    attributes: function () {
      return {
        'id': 'project-' + this.model.get('id'),
        'data-id': this.model.get('id')
      }
    },

    events: {
      'click .edit-project': 'edit'
    },

    initialize: function () {
      var self = this;
      // Render every time our model changes state.
      this.listenTo(this.model, 'change', function () {
        self.render();
      });
      // Remove this view when the model is destroyed.
      this.listenTo(this.model, 'destroy', function () {
        // self.remove();
      })
    },

    edit: function (e) {
      var self = this;
      e.preventDefault();
      console.log('edit', this.model.get('id'));
      if (!this.editor)
        this.editor = new _.ProjectEdit({model: this.model});
      return this.editor.render().then(function () {
        self.editor.show();
      });
    },

    render: function () {
      var self = this;
      return this.template.then(function (tpl) {
        self.$el.html(tpl({item: self.model.toJSON()}));
        return self;
      });
    }

  });

});