var express = require('express')
var admin = require('../controllers/admin')
var auth = require('../auth')

// Admin Routes
// ------------
var routes = function () {
  var router = express.Router()
  var authed = auth.requireAuthentication()

  router.route('/login')
    .get(admin.login)
    .post(auth.authenticate(), admin.login)

  router.route('/logout')
    .all(admin.logout)

  router.get('/', authed, admin.index)

  router.get('/test', authed, admin.test)

  router.route('/project', authed)
    .get(admin.project.index)
  router.route('/project/new', authed)
    .get(admin.project.new)
    .post(admin.project.new)
  router.route('/project/edit/:id', authed)
    .get(admin.project.edit)
    .post(admin.project.edit)

  router.route('/category', authed)
    .get(admin.category.index)
  router.route('/category/new', authed)
    .get(admin.category.new)
    .post(admin.category.new)
  router.route('/category/edit/:id', authed)
    .get(admin.category.edit)
    .post(admin.category.edit)

  return router
}

module.exports = routes