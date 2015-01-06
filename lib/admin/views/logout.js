module.exports = function (admin) {
  return function (req, res) {
    if (req.isAuthenticated()) {
      req.logout()
      req.flash('info', 'Logged out')
    }
    res.redirect('./login')
  }
}