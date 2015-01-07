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

  return views
}
