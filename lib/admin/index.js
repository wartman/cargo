var _ = require('lodash')
var express = require('express')
var swig = require('swig')
var Set = require('../set')
var util = require('../util')
var adminRoutes = require('./routes')

// Admin
// -----
// The admin sub-app
var Admin = Set.extend({

  constructor: function (options) {
    this.super({
      'admin url': '/admin',
      'auth': {},
      'db': {}
    }, options)
    this.defineOption('app', {
      set: false,
      get: function () {
        return this.app
      }
    })
    this.defineOption('db', {
      set: function (value) {
        this.db = value
      },
      get: function () {
        return this.db
      }
    })
  },

  // Startup the app
  init: function () {
    this.app = express()

    // Use local templates
    this.app.engine('html', swig.renderFile)
    this.app.set('view engine', 'html')
    this.app.set('views', __dirname + '/routes/templates')

    adminRoutes(this)
    return this
  },

  // Wrapper for middleware
  use: function (middleware) {
    this.app.use(middleware(this))
    return this
  },

  // Mount on the provided app
  mount: function (app) {
    app.use(this.get('admin url'), this.get('app'))
    return this
  }

})

module.exports = Admin
