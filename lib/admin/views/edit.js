module.exports = function (admin) {

  var db = admin.get('db')

  return function (req, res) {
    res.render('model/edit.html', {
      modelType: req.params.modelType
    })
  }
}
