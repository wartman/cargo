var path = require('path')
var express = require('express')
var Promise = require('bluebird')
var swig = require('swig')
var Base = require('./base')
var Server = require('./server')
var Logger = require('./logger')
var Record = require('./record')
var middleware = require('./middleware')
var error = require('./error')
var util = require('./util')

// Rabbit
// ------
// The primary api
var Rabbit = Base.extend({

  constructor: function () {
    this.super()

    // Default settings

    this.set('env', process.env.NODE_ENV || 'development')

    // Set the module root to be this module or the parent one
    this.set('module root', (function(_rootPath) {
      var parts = _rootPath.split(path.sep);
      parts.pop(); //get rid of /node_modules from the end of the path
      return parts.join(path.sep);
    })(module.parent ? module.parent.paths[0] : module.paths[0]))

    this.set('root url', '')
    this.set('api url', '/api/v' + this.version)
    this.set('storage url', 'public/media')

    this.set('host', process.env.HOST || process.env.IP || 'localhost')
    this.set('port', process.env.PORT || 8080)

    this.set('custom engine', swig.renderFile)
    this.set('views', 'routes/templates')

    // this.set('storage', require('./storage'))

    // Secret just for testing: provide your own
    this.set('cookie secret', 'rabbit')

    // Default folder for records
    this.set('record path', './data')

    // Public modules and instances
    this.server = new Server()
    this.logger = Logger.getInstance()
    this.util = util
    this.errors = error
    // `imports` is a handy method that can be used to grab all
    // modules in a given folder (works recursively). See the
    // `util` module for more.
    this.imports = util.createImporter(this.get('module root'))
  },

  // Return an option, appending the module-root to it first.
  getPath: function (key) {
    var relPath = this.get(key)
    if (!relPath) return
    return path.join(this.get('module root'), relPath) 
  },

  getApp: function () {
    return this.app
  },

  getRecord: function () {
    return this.record
  },

  // Initialize method. This is the primary way
  // to configure a rabbit app, and should always be
  // called.
  init: function (options) {
    options || (options = {})
    this.set(options)

    if (!this.app) this.app = express()
    this.logger.env = this.get('env')

    return this
  },

  // Register a pre-event handler.
  pre: function (event, fn) {
    this.on(event + ':pre', fn)
    return this
  },

  // Register a post-event handler.
  post: function (event, fn) {
    this.on(event + ':post', fn)
    return this
  },

  // Create a new server.
  mount: function (mountPath) {
    // @todo: use mountPath?
    var app = this.app

    // Setup view engine
    // @todo make configurable?
    app.engine('html', this.get('custom engine'))
    app.set('view engine', 'html')
    app.set('views', this.getPath('views'))

    // Add default middleware
    // @todo: Implement a session store model we can use to persist this
    // stuff! Check the express-middleware site for some talk on how to do this
    // (at the very end of the page)
    app.use(middleware.session({
      secret: this.get('cookie secret'),
      resave: true,
      saveUninitialized: true
    }))
    app.use(middleware.flash())
    app.use(middleware.bodyParser.urlencoded({extended:false}))
    app.use(middleware.bodyParser.json())
    app.use(middleware.allowCrossDomain)

    // @todo: static server.
    //        For now, just use basic middleware.

    if('function' === typeof this.get('storage'))
      this.get('storage')(app)

    // Register routes
    if('function' === typeof this.get('routes'))
      this.get('routes')(app)

    // Last-ditch error handlers
    app.use(error.middleware.error404)
    app.use(error.middleware.error500)

    return this.server.set({
        host: this.get('host'),
        port: this.get('port')
      }).connect(app)
  },

  // Start the app
  // Note: `mountPath` currently does nothing.
  run: function (mountPath, app) {
    if ('function' === typeof mountPath) {
      app = mountPath
      mountPath = '/'
    }
    if (app) this.app = app
    mountPath || (mountPath = '/')
    app || (app = this.app)

    // Setup the record loader before routes are added.
    // @todo: setup as middleware??
    Record.Loader.getInstance()
      .set('base path', this.getPath('record path'))

    return this.mount(mountPath)
      .bind(this)
      .catch(function (err) {
        this.logger.logError(err, 'rabbit.run()')
      })
  }

})

var rabbit = new Rabbit()

// Export shortcuts to various modules
rabbit.Class = require('./class')
rabbit.Record = Record

module.exports = rabbit
