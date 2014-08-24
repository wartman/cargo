var Category = require('../../models').Category;

var CategoryController = {

  // @todo: remove all model creation stuff to an API
  // class. See the way ghost does things.

  index: function (req, res) {
    Category.findAll({}).then(function (collection) {
      res.render('admin/category/index', {
        categories: collection.models
      });
    });
  },

  new: function(req, res) {
    var category = new Category({});
    if (req.method === 'POST') {
      category.set({
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
      })
      .save()
      .then(function (model) {
        console.log(model);
        res.redirect('/admin/category/edit/' + model.get('id') );
      }, function (e) {
        console.log(e);
        res.send(e.message || 'badness');
        // do error stuff.
      });
    } else {
      res.render('admin/category/edit', {
        category: category
      });
    }
  },

  edit: function (req, res) {
    var category = new Category({id: req.params.id});
    category
      .fetch()
      .then(function (model) {
        if (req.method === 'POST') {
          return model
            .set({
              name: req.body.name,
              description: req.body.description
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
        res.render('admin/category/edit', {
          category: model,
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

module.exports = CategoryController;