var _ = require('lodash')
var express = require('express')
var util = require('../../util')

// Admin Routes
// ------------
// Default routing for the admin app.
module.exports = function (admin) {
  var app = admin.get('app')
  var auth = admin.get('auth')

  var views = util.createImporter(__dirname)('./views')
  _.each(views, function (factory, key) {
    views[key] = factory(admin)
  })

  app.route('/login')
    .get(views.login)
    .post(auth.authenticate(), views.login)
  app.get('/logout', views.logout)

  // all routes applied to `authedRoutes` require 
  // the user to be logged in
  var authedRoutes = express.Router()
  authedRoutes.use(auth.requireAuthentication())

  authedRoutes.get('/', views.index)
  authedRoutes.route('/user/edit/:id')
    .get(views.user.edit)
    .post(views.user.update)

  app.use(authedRoutes)
}
