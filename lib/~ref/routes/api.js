var express = require('express')
var api = require ('../api')
var auth = require('../auth')

// API Routes
// ----------
var routes = function () {
  var router = express.Router()
  var authed = auth.requireAuthenticationJSON()

  router.route('/project')
    .get(api.Project.http('browse'))
    .post(authed, api.Project.http('add'))
  router.route('/project/:id')
    .get(api.Project.http('read'))
    .put(authed, api.Project.http('edit'))
    .delete(authed, api.Project.http('destroy'))

  router.route('/category')
    .get(api.Category.http('browse'))
    .post(authed, api.Category.http('add'))
  router.route('/category/:id')
    .get(api.Category.http('read'))
    .put(authed, api.Category.http('edit'))
    .delete(authed, api.Category.http('destroy'))

  router.route('/settings')
    .get(api.Setting.http('browse'))
    .post(authed, api.Setting.http('add'))
  router.route('/settings/:id')
    .get(api.Setting.http('read'))
    .put(authed, api.Setting.http('edit'))
    .delete(authed, api.Setting.http('destroy'))

  return router
}

module.exports = routes
