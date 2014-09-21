var express = require('express');
var api = require ('../api');

// API Routes
// ----------
var routes = function () {
  var router = express.Router();

  router.route('/project')
    .get(api.Project.http('browse'))
    .post(api.Project.http('add'));
  router.route('/project/:id')
    .get(api.Project.http('read'))
    .put(api.Project.http('edit'))
    .delete(api.Project.http('destroy'));

  router.route('/category')
    .get(api.Category.http('browse'))
    .post(api.Category.http('add'));
  router.route('/category/:id')
    .get(api.Category.http('read'))
    .put(api.Category.http('edit'))
    .delete(api.Category.http('destroy'));

  return router;
};

module.exports = routes;
