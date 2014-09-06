var express = require('express');
var api = require ('../api');

var http = api.http;

// API Routes
// ----------
var routes = function () {
  var router = express.Router();
  var project = new api.Project();

  router.route('/project')
    .get(http(project.browse, project))
    .post(http(project.add, project));
  router.route('/project/:id')
    .get(http(project.read, project))
    .post(http(project.edit, project))
    .delete(http(project.destroy, project));

  return router;
};

module.exports = routes;