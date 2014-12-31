var passport = require('passport')
var passportLocal = require('passport-local')
var db = require('../db')
var errors = require('../errors')

// Authentication
// --------------
// Rabbit's auth middleware.
// Note: it may make sense to not use passport in the future, unless its more
// flexible then I'm giving it credit for :P

// Add a user to the sessions.
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

// Get a user from the sessions ID
passport.deserializeUser(function (id, done) {
  db.model('User', {id: id}).fetch().then(function (user) {
    done(null, user)
  }).catch(done)
})

// Use the user-model as our local Authentication strategy
var strategy = new passportLocal.Strategy(function (username, password, done) {
  db.model('User').authenticate(username, password).then(function (user) {
    done(null, user)
  }).catch(errors.NotAuthorizedError, function(err) {
    // This is a normal error, and all we need to do it warn the user
    // to try a new username/password combo.
    done(null, false, err.message)
  }).catch(function (err) {
    // If we end up here, however, something has gone south with
    // our server.
    done(err)
  })
})

// Register with passport
passport.use(strategy)

// A factory that creates the default authentication middleware we'll be using.
// When registering with rabbit, just pass the `_options` object to this function
// to configure it.
exports.authenticate = function (options) {
  options = options || {}
  return passport.authenticate('local', {
    successRedirect: options['admin path'] || '/admin',
    failureRedirect: (options['admin path']) ? options['admin path'] + '/login' : '/admin/login',
    failureFlash: true
  })
}

// Ensure the user is authenticated for this view. Like 'authenticate', this is a factory
// that returns middleware.
exports.requireAuthentication = function (options) {
  options = options || {}
  var loginPath = (options['admin path']) ? options['admin path'] + '/login' : '/admin/login'
  return function (req, res, next) {
    if (req.isAuthenticated()) return next()
    req.flash('You must be logged in to view this page')
    // Save the current page so we can send the user back here
    // once they authenticate
    req.session.loginRedirect = req.originalUrl
    res.redirect(loginPath)
  }
}

exports.requireAuthenticationJSON = function () {
  return function (req, res, next) {
    if (req.isAuthenticated()) return next()
    var httpErrors = errors.formatHttpErrorsJSON(new errors.NotAuthorizedError('You must log in to use this resource'))
    res.status(httpErrors.statusCode).json(httpErrors)
  }
}

// An alias for passport. You'll need to use this to use `initialize` and
// `session` during Rabbit's configuration.
exports.passport = passport
