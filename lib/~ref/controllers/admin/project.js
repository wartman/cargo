var db = require('../../db')

var ProjectController = {

  // @todo: remove all model creation stuff to an API
  // class. See the way ghost does things.

  index: function (req, res) {
    db.model('Project').findAll({}).then(function (collection) {
      res.render('admin/project/index', {
        projects: collection.models
      });
    });
  },

  new: function(req, res) {
    project = db.model('Project', {});
    db.model('Category').findAll().then(function (categories) {
      if (req.method === 'POST') {
        project.set({
          title: req.body.title,
          slug: req.body.slug,
          attachment: req.body.attachment,
          description: req.body.description,
          category_id: req.body.category_id
        })
        .save()
        .then(function (model) {
          res.redirect('../' + model.get('id') );
        }, function () {
          // do error stuff.
        });
      } else {
        res.render('admin/project/edit', {
          project: project,
          categories: categories.models 
        });
      }
    });
  },

  edit: function (req, res) {
    var project = db.model('Project', {id: req.params.id});
    var categories = [];
    db.model('Category').findAll()
      .then(function (collection) {
        categories = collection.models
      })
      .then(function () {
        return project.fetch().then(function (model) {
          return model;
        });
      })
      .then(function (model) {
        if (req.method === 'POST') {
          return model
            .set({
              title: req.body.title,
              slug: req.body.slug,
              attachment: req.body.attachment,
              description: req.body.description,
              category_id: req.body.category_id
            })
            .save()
            .then(function (model) {
              return model;
            });
        } else {
          return model;
        }
      })
      .then(function (model) {
        res.render('admin/project/edit', {
          project: model,
          categories: categories
        });
      });
  },

  remove: function (req, res) {
    // body...
  },

  browse: function (req, res) {
    // body...
  }

};

module.exports = ProjectController;