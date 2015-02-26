var path = require('path')
var express = require('express')
var Promise = require('bluebird')
var swig = require('swig')
var debug = require('debug')('Rabbit')
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

  constructor: function (options) {
    if (!(this instanceof Rabbit)) return new Rabbit(options)

    this.super()

    debug('in environment: %s', process.env.NODE_ENV || 'development')

    this.set('env', process.env.NODE_ENV || 'development')

    // Set the module root to be this module or the parent one
    this.set('module root', (function(_rootPath) {
      var parts = _rootPath.split(path.sep)
      parts.pop() //get rid of /node_modules from the end of the path
      var modulePath = parts.join(path.sep)
      debug('default module root: %s', modulePath)
      return modulePath
    })(module.parent ? module.parent.paths[0] : module.paths[0]))

    this.set('root url', '')
    this.set('api url', '/api/v' + this.version)
    // this.set('storage url', 'public/media')

    this.set('host', process.env.HOST || process.env.IP || 'localhost')
    this.set('port', process.env.PORT || 8080)

    this.set('custom engine', swig.renderFile)
    this.set('views', 'routes/templates')

    // this.set('storage', require('./storage'))

    // Secret just for testing: provide your own
    this.set('cookie secret', 'rabbit')

    // Default paths
    this.set('record path', 'data')
    this.set('static path', 'public')

    // Public modules and instances
    this.server = new Server()
    this.logger = Logger.getInstance()

    // Set user options
    this.set(options || {})
    this.app = this.get('app') || express()
    this.record = new Record({'base path': this.getPath('record path')})
    this.logger.env = this.get('env')

    // `imports` is a handy method that can be used to grab all
    // modules in a given folder (works recursively). See the
    // `util` module for more.
    this.imports = util.createImporter(this.get('module root'))

    return this
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

  // Setup the app. If you're running Rabbit as middleware
  // use this method to mount it and don't use Rabbit#run.
  mount: function (mountPath, parentApp) {
    debug('mounting')

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
    app.use(middleware.serveStatic(this.get('static path')))

    // @todo
    // Storage will handle file uploads.
    // if('function' === typeof this.get('storage'))
    //   this.get('storage')(app)

    if('function' === typeof this.get('models'))
      this.get('models')(this.record)

    // Expose record collections and documents as middleware
    app.use(this.record.middleware())

    // Register routes
    if('function' === typeof this.get('routes'))
      this.get('routes')(app)

    // Last-ditch error handlers
    app.use(error.middleware.error404)
    app.use(error.middleware.error500)

    if (mountPath) {
      if (this._started) {
        this.logger.logError(
          'Cannot mount an app that has already started a server', 
          'rabbit#mount', 
          'Don\'t use rabbit#run if mounting on another app'
        )
        process.exit(1)
      }
      debug('mounting on path %s', mountPath)
      parentApp.use(mountPath, app)
    }

    return this
  },

  // Start the app
  run: function () {
    // Rabbit is not running mounted in another app.
    this._started = true

    debug('starting server')

    return this.mount().server.set({
      host: this.get('host'),
      port: this.get('port')
    }).connect(this.app)
      .bind(this)
      .catch(function (err) {
        this.logger.logError(err, 'rabbit#run')
      })
  }

})

// Default export
exports = module.exports = Rabbit

// Export shortcuts to various modules
exports.Class = require('./class')
exports.Record = Record
exports.util = util
exports.errors = error
