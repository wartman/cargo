var _ = require('lodash')
var path = require('path')
var express = require('express')
var Promise = require('bluebird')
var swig = require('swig')
var debug = require('debug')('Cargo')
var Base = require('./base')
var Server = require('./server')
var Logger = require('./logger')
var Manifest = require('./manifest')
var middleware = require('./middleware')
var error = require('./error')
var util = require('./util')

// Cargo
// ------
// The primary api
var Cargo = Base.extend({

  constructor: function (options) {
    if (!(this instanceof Cargo)) return new Cargo(options)

    this.super()

    debug('in environment: %s', process.env.NODE_ENV || 'development')

    this.set('env', process.env.NODE_ENV || 'development')

    // Set the module root to be this module or the parent one
    this.set('module root', process.env.CARGO_MODULE_ROOT)

    this.set('root url', '')
    this.set('api url', '/api/v' + this.version)
    // this.set('storage url', 'public/media')

    this.set('host', process.env.HOST || process.env.IP || 'localhost')
    this.set('port', process.env.PORT || 8080)

    this.set('custom engine', swig.renderFile)
    this.set('views', 'routes/templates')

    // this.set('storage', require('./storage'))

    // Secret just for testing: provide your own
    this.set('cookie secret', 'cargo')

    // Default paths
    this.set('manifest path', 'data')
    this.set('static path', 'public')

    // Public modules and instances
    this.server = new Server()
    this.logger = Logger.getInstance()

    // Set user options
    this.set(options || {})
    this.app = this.get('app') || express()
    this.manifest = new Manifest({'base path': this.getPath('manifest path')})
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

  // Get the current express app.
  getApp: function () {
    return this.app
  },

  // Get the current Cargo.Manifest instance.
  getManifest: function () {
    return this.manifest
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

  // Setup the express app, registering all middleware and routes.
  // This will NOT connect the app to the server.
  init: function (options) {
    if (this._initialized) {
      this.logger.logInfo(
        'Cargo',
        'Already initialized, but #init() called again.',
        'Note that Cargo#run and Cargo#mount will call Cargo#init for you, you don\'t need to do it manually.'
      )
      return this
    }
    this._initialized = true

    debug('initializing')

    var app = this.app

    if (options) this.set(options)

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
    app.use(middleware.serveStatic(this.getPath('static path')))

    // @todo
    // Storage will handle file uploads.
    // if('function' === typeof this.get('storage'))
    //   this.get('storage')(app)

    if (_.isFunction(this.get('models'))) {
      this.get('models')(this.manifest)
    } else if (_.isString(this.get('models'))) {
      this._autoloadModels(this.get('models'))
    }

    // Expose manifest collections and documents as middleware
    app.use(this.manifest.middleware())

    // Register routes
    if(_.isFunction(this.get('routes'))) {
      this.get('routes')(app)
    } else if (_.isString(this.get('routes'))) {
      this._autoloadRoutes(this.getPath('routes'))
    }

    // Last-ditch error handlers
    app.use(error.middleware.error404)
    app.use(error.middleware.error500)

    return this
  },

  // If you're running Cargo as middleware use this method
  // to mount it (and don't use Cargo#run).
  //
  //    var someApp = express()
  //    Cargo({ /* config here */ }).mount('/foo', someApp)
  //    someApp.listen('8080')
  //
  mount: function (mountPath, parentApp) {
    debug('mounting on path %s', mountPath)

    if (this._started) {
      this.logger.logError(
        'Cannot mount an app that has already started a server', 
        'cargo#mount', 
        'Don\'t use cargo#run if mounting on another app'
      )
      process.exit(1)
    }
    this._started = true
    parentApp.use(mountPath, this.init().app)

    return this
  },

  // Start the app
  //
  //   Cargo({ /* config here */ }).run()
  //
  run: function () {
    // Cargo is not running mounted in another app.
    if (this._started) {
      this.logger.logError(
        'Tried to restart an app that has already started', 
        'cargo#run'
      )
      process.exit(1)
    }
    this._started = true

    debug('starting server')

    return this.init().server.set({
      host: this.get('host'),
      port: this.get('port')
    }).connect(this.app)
      .bind(this)
      .catch(function (err) {
        this.logger.logError(err, 'cargo#run')
      })
  },

  // Internal method to load all models in the provided path.
  // Use this as an alternative to providing a function to the 'models'
  // option in Cargo's config.
  //
  //    Cargo({
  //      // Will autoload all .js files in 'app/models' in the 'module root',
  //      // then attempt to register them with the current Cargo.Manifest instance.
  //      // Note that an error will be thrown if any of the modules return something
  //      // that is not a Cargo.Manifest.Document or Cargo.Manifest.Collection
  //      // (see Cargo.Manifest#use).
  //      'models': 'app/models'
  //    })
  //
  _autoloadModels: function (path) {
    this.manifest.use(this.imports(path))
    return this
  },

  // Internal method register routes using the provided path. Should
  // resolve to a module that returns a function.
  _autoloadRoutes: function (routes) {
    var routes = require(routes)
    if (routes && _.isFunction(routes)) routes(this.app)
    return this
  }

})

// Default export
exports = module.exports = Cargo

// Export shortcuts to various modules
exports.Class = require('./class')
exports.Manifest = Manifest
exports.util = util
exports.errors = error
