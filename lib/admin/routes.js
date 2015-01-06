var _ = require('lodash')
var util = require('../util')

module.exports = function (admin) {
  var app = admin.get('app')
  var auth = admin.get('auth')
  var authed = auth.requireAuthentication()

  var views = util.createImporter(__dirname)('./views')
  _.each(views, function (factory, key) {
    views[key] = factory(admin)
  })

  app.route('/login')
    .get(views.login)
    .post(auth.authenticate(), views.login)

  app.get('/logout', views.logout)
  app.get('/', authed, views.index)

  app.route('/edit/:modelType')
    .get(authed, views.edit)
}
