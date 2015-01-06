var passport = require('passport')
var passportLocal = require('passport-local')
var Promise = require('bluebird')
var error = require('./error')
var Set = require('./set')

// Authentication
// --------------
// Rabbit's auth middleware.
var Auth = Set.extend({

  constructor: function (options) {
    this.super({
      'admin url': '/admin',
      'login url': '/admin/login'
    }, options)

    this.defineOption('db', {
      set: function (value) {
        this.db = value
      },
      get: function () {
        return this.db
      }
    })

    this.passport = passport
  },

  init: function () {
    var db = this.db
    // Add a user to the sessions.
    this.passport.serializeUser(function (user, done) {
      done(null, user.id)
    })
    // Get a user from the sessions ID
    this.passport.deserializeUser(function (id, done) {
      db.model('User', {id: id}).fetch().then(function (user) {
        done(null, user)
      }).catch(done)
    })
    this._createStrategy()
    return Promise.resolve()
  },

  authenticate: function () {
    var self = this
    return this.passport.authenticate('local', {
      successRedirect: self.get('admin url', '/admin'),
      failureRedirect: self.get('login url', '/admin/login'),
      failureFlash: true
    })
  },

  requireAuthentication: function() {
    var self = this
    return function (req, res, next) {
      if (req.isAuthenticated()) return next()
      req.flash('error', 'You must be logged in to view this page')
      // Save the current page so we can send the user back here
      // once they authenticate
      req.session.loginRedirect = req.originalUrl
      res.redirect(self.get('login url'))
    }
  },

  requireAuthenticationJSON: function () {
    return function (req, res, next) {
      if (req.isAuthenticated()) return next()
      var httpErrors = error.formatHttpErrorsJSON(new error.UnauthorizedError('You must log in to use this resource'))
      res.status(httpErrors.statusCode).json(httpErrors)
    }
  },

  _createStrategy: function () {
    var db = this.db
    // Use the user-model as our local Authentication strategy
    var strategy = new passportLocal.Strategy(function (username, password, done) {
      db.model('User').authenticate(username, password).then(function (user) {
        done(null, user)
      }).catch(error.UnauthorizedError, function(err) {
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
  }

})

module.exports = Auth
