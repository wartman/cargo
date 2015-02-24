var rabbit = require('../../../')
var Page = require('../models/page')

module.exports = function (app) { 
  app.get('/', function (req, res) {
    var page = new Page('001')
    page.fetch().then(function () {
      res.render('index', page.toJSON()) 
    })
  })
}