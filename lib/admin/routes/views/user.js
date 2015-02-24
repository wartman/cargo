module.exports = function (admin) {
  var db = admin.get('db')
  var user = db.model('User')

  var views = {}

  views.edit = function (req, res) {
    db.model('User', {id: req.params.id})
      .fetch()
      .then(function (model) {
        // @todo create a res.notFound() helper?
        if (!model) return res.send('not found')
        res.render('user/edit.html', {
          user: model.toJSON()
        })
      })
  }

  views.update = function (req, res) {
    db.model('User', {
      'id': req.params.id,
      'username': req.body.username,
      'firstname': req.body.firstname,
      'lastname': req.body.lastname,
      'email': req.body.email
    }).save()
      .then(function (model) {
        req.flash('Model saved')
      })
      .then(function () {
        views.edit(req, res)
      })
  }

  views.create = function (req, res) {
    res.render('user/edit.html', {})
  }

  views.insert = function (req, res) {
    db.model('User', {
      // @todo
    })
  }

  return views
}
