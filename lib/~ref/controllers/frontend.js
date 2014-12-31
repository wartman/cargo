var db = require('../db')

var Frontend = {

  // Index page
  index: function (req, res) {
    res.render('frontend/index', {foo: 'bar'})
  },

  testModel: function (req, res) {
    db.model('Project', {id: req.param.id || 1})
      .fetch()
      .then(function (model) {
        console.log(model)
        res.send(model.get('title'))
      }, function (err) {
        res.send(err)
      })
  },

  browse: function (req, res) {
    db.model('Project').findAll().then(function (collection) {
      res.render('frontend/browse', {
        collection: collection
      })
    })
  }

}

module.exports = Frontend