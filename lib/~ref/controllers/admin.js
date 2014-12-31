var ProjectController = require('./admin/project')
var CategoryController = require('./admin/category')

var Admin = {

  index: function (req, res) {
    res.render('admin/main/index')
  },

  login: function (req, res) {
  	res.render('admin/main/login')
  },

  logout: function (req, res) {
  	req.logout()
  	res.redirect('/')
  },

  test: function (req, res) {
    res.render('admin/test/runner')
  },

  project: ProjectController,
  category: CategoryController
}

module.exports = Admin
