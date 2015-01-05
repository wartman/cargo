var path = require('path')
var express = require('express')
var Promise = require('bluebird')
var events = require('events')
var swig = require('swig')
var Set = require('./set')
var Server = require('./server')
var Db = require('./db')
var Auth = require('./auth')
var Logger = require('./logger')
var middleware = require('./middleware')
var error = require('./error')
var util = require('./util')
var adminRoutes = require('./admin/routes')

var Rabbit = Set.extend({

  constructor: function () {
    this.super()

    // Custom options
    this.defineOption('app', {
      set: function (value) {
        this.app = value
      },
      get: function () {
        return this.app
      }
    })
    this.defineOption('logger', {
      set: function (value) {
        this.logger = value
      },
      get: function () {
        return this.logger
      }
    })
    this.defineOption('database', {
      // Return the correct env
      get: function (value) {
        if (value.production || value.development || value.testing) {
          if (process.env.NODE_ENV === 'production' && value.production)
            return value.production
          else if (process.node.NODE_ENV === 'testing' && value.testing)
            return value.testing
          else if (value.development)
            return value.development
        }
        return value
      }
    })

    // Default settings

    this.set('env', process.env.NODE_ENV || 'development')

    // Set the module root to be this module or the parent one
    this.set('module root', (function(_rootPath) {
      var parts = _rootPath.split(path.sep);
      parts.pop(); //get rid of /node_modules from the end of the path
      return parts.join(path.sep);
    })(module.parent ? module.parent.paths[0] : module.paths[0]))

    this.set('root url', '')
    this.set('admin url', '/admin')
    this.set('login url', '/admin/login')
    this.set('api url', '/api/v' + this.version)
    this.set('storage url', 'content/media')

    this.set('host', process.env.HOST || process.env.IP || 'localhost')
    this.set('port', process.env.PORT || 8080)

    this.set('custom engine', swig.renderFile)
    this.set('views', 'content/theme')

    // this.set('storage', require('./storage'))

    // Secret just for testing: provide your own
    this.set('cookie secret', 'rabbit')

    this.set('database', {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '/content/data/rabbit-dev.db')
      },
      debug: false
    })

    // Public modules and instances
    this.events = new events.EventEmitter()
    this.db = new Db()
    this.server = new Server()
    this.auth = new Auth()
    this.logger = Logger.getInstance()
    this.util = util
    // `imports` is a handy method that can be used to grab all
    // modules in a given folder (works recursively). See the
    // `util` module for more.
    this.imports = util.createImporter(this.get('module root'))
  },

  getApp: function () {
    return this.app
  },

  getDb: function () {
    return this.db
  },

  // Initialize method
  init: function (options) {
    options || (options = {})
    this.set(options)
    if (!this.app) this.app = express()

    return this
  },

  // Register a pre-event handler.
  pre: function (event, fn) {
    this.events.on(event + ':pre', fn)
    return this
  },

  // Register a post-event handler.
  post: function (event, fn) {
    this.events.on(event + ':post', fn)
    return this
  },

  on: function (event, fn) {
    this.events.on(event, fn)
    return this
  },

  // Create a new server.
  _startServer: function () {
    var app = this.app

    // Setup view engine
    // @todo make configurable?
    app.engine('html', this.get('custom engine'))
    app.set('view engine', 'html')
    app.set('views', this.get('views'))

    // Add default middleware
    // @todo: Implement a session store model we can use to persist this
    // stuff! Check the express-middleware site for some talk on how to do this
    // (at the very end of the page)
    app.use(middleware.session({
      secret: this.get('cookie secret'),
      resave: true,
      saveUninitialized: true
    }))
    app.use(middleware.bodyParser.urlencoded({extended:false}))
    app.use(middleware.bodyParser.json())
    app.use(middleware.allowCrossDomain)

    // Setup passport
    app.use(this.auth.passport.initialize())
    app.use(this.auth.passport.session())

    if('function' === typeof this.get('storage'))
      this.get('storage')(app)

    // Register routes
    if('function' === typeof this.get('routes'))
      this.get('routes')(app)

    // Register admin routes
    app.use(this.get('admin url'), adminRoutes(this))

    // Last-ditch error handlers
    app.use(error.middleware.error404)
    app.use(error.middleware.error500)

    return this.server
      .set(this.get(['port', 'host', 'app']))
      .connect()
  },

  // Setup auth middleware
  _initAuthentication: function () {
    return this.auth
      .set(this.get(['admin url', 'login url']))
      .set('db', this.db)
      .init()
  },

  // Start the app
  run: function (mountPath, app) {
    if ('function' === typeof mountPath) {
      app = mountPath
      mountPath = '/'
    }
    if (app) this.app = app
    mountPath || (mountPath = '/')
    app || (app = this.app)

    return this.db
      .set(this.get(['database', 'updates']))
      .connect()
      .bind(this)
      .then(this._initAuthentication)
      .then(this._startServer)
      .catch(function (err) {
        this.logger.logError(err, 'rabbit.run()')
      })
  }

})

var rabbit = new Rabbit()

// Export shortcuts to various modules
rabbit.Class = require('./class')
rabbit.Set = Set
rabbit.View = require('./view')

module.exports = rabbit
