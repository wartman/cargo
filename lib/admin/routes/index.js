var express = require('express')
var util = require('../../util')

module.exports = function (rabbit) {
  var router = express.Router()
  var auth = rabbit.auth
  var authed = rabbit.auth.requireAuthentication()

  var views = util.createImporter(__dirname)('../views')

  router.route('/login')
    .get(views.login)
    .post(auth.authenticate(), views.login)

  router.route('/')
    .get(function (req, res) {
      res.send('adminy')
    })

  return router
}
