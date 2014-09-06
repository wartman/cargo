var express = require('express');
var api = require ('../api');

// API Routes
// ----------
var routes = function () {
  var router = express.Router();

  console.log(api.Project);

  router.route('/project')
    .get(api.Project.http('browse'))
    .post(api.Project.http('add'));
  router.route('/project/:id')
    .get(api.Project.http('read'))
    .post(api.Project.http('edit'))
    .delete(api.Project.http('destroy'));

  return router;
};

module.exports = routes;