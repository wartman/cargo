// Checks if we're in the admin backend.
module.exports = function (req, res, next) {
  req.isAdmin = req.url.lastIndexOf('/rabbit/', 0) === 0
  next()
}