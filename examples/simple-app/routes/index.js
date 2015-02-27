module.exports = function (app) {

  app.get('/', function (req, res) {
    req.documents.page('001').fetch().then(function (page) {
      res.render('index', page.toJSON()) 
    }).catch(function (err) {
      res.send(err.message)
    })
  })

  app.get('/page/:slug', function (req, res) {
    req.documents.page({slug: req.params.slug}).fetch().then(function (page) {
      res.render('index', page.toJSON())
    }).catch(function (err) {
      res.send(err.message)
    })
  })

}
