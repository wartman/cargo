var express = require('express');
var admin = require('../controllers/admin');

// Frontend Routes
// ---------------
var routes = function () {
  var router = express.Router();

  router.get('/', admin.index);

  router.route('/project')
    .get(admin.project.index);
  router.route('/project/new')
    .get(admin.project.new)
    .post(admin.project.new);
  router.route('/project/edit/:id')
    .get(admin.project.edit)
    .post(admin.project.edit);

  router.route('/category')
    .get(admin.category.index)
  router.route('/category/new')
    .get(admin.category.new)
    .post(admin.category.new)
  router.route('/category/edit/:id')
    .get(admin.category.edit)
    .post(admin.category.edit);

  return router;
};

module.exports = routes;