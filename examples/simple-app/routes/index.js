var rabbit = require('../../../')

module.exports = function (app) { 
  app.get('/', function (req, res) {
    rabbit.db.model('Post', {'title': 'Hello World'})
      .fetch()
      .then(function (model) {
        if (!model) return res.send('not found')
        res.send(model.get('content'))
      })
  })
}