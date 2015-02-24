module.exports = function (admin) {
  return function (req, res) {
    res.render('page/login.html', {
      user: {
        authed: req.isAuthenticated(),
        username: req.body.username,
        password: req.body.password
      }
    })
  }
}
