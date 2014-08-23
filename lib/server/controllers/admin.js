var ProjectController = require('./admin/project');
var CategoryController = require('./admin/category');

var Admin = {

  index: function (req, res) {
    res.render('admin/main/index', {});
  },

  project: ProjectController,
  category: CategoryController
};

module.exports = Admin;