var _ = require('lodash')
var path = require('path')
var jajom = require('jajom')
var express = require('express')
var Promise = require('bluebird')
var swig = require('swig')
var chalk = require('chalk')

var auth = require('./auth')
var middleware = require('./middleware')
var errors = require('./errors')

var Rabbit = jajom.Object.extend({

  version: require('../../package.json').version,

  constructor: function (options) {
    if(!(this instanceof Rabbit)) return new Rabbit(options)

    this._options = {}

    this.app = this.app || options.app || express()
    if (options.app) delete options.app

    this.set('env', process.env.NODE_ENV || 'development')

    // Set the module root to be this module or the parent one
    this.set('module root', (function(_rootPath) {
      var parts = _rootPath.split(path.sep);
      parts.pop(); //get rid of /node_modules from the end of the path
      return parts.join(path.sep);
    })(module.parent ? module.parent.paths[0] : module.paths[0]))

    this.set('root url', '')
    this.set('admin url', 'admin')
    this.set('api url', 'api/v' + this.version)
    this.set('storage url', 'content/media')

    this.set('host', process.env.HOST || process.env.IP || 'localhost')
    this.set('port', process.env.PORT || 8080)

    this.set('custom engine', swig.renderFile)
    this.set('view engine', 'swig')
    this.set('views', 'content/theme')

    this.set('storage', require('./storage'))
    this.set('routes', require('./routes'))

    // Secret just for testing: provide your own
    this.set('cookie secret', 'rabbit')

    this.set('database', {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '/content/data/rabbit-dev.db')
      },
      debug: false
    })

    // Set user options
    this.set(options)
  },

  logger: require('./util/logger'),

  // The database engine
  db: require('./db'),

  get: function (key) {
    return this._options[key]
  },

  set: function (key, value) {
    if ('object' === typeof key) {
      _.each(key, function (value, key) {
        this.set(key, value)
      }.bind(this))
    }

    if (key === 'database') {
      var env = process.env.NODE_ENV || 'production'
      if (value[env]) {
        this._options[key] = value[env]
        return this
      }
    }

    this._options[key] = value
    return this
  },

  // Just some stuff to show in the console
  logStartMessages: function () {
    console.log(
      chalk.yellow.bold('\nRabbit is running!'),
      chalk.grey('\nCtrl+C to shut down')
    )

    // ensure that Rabbit exits correctly on Ctrl+C
    process.removeAllListeners('SIGINT').on('SIGINT', function () {
      console.log(
        chalk.yellow.bold('\nRabbit has stopped running!')
      )
      process.exit(0)
    })
  },

  // Create the server, setting up the express app
  createServer: function () { 
    this.app.engine('html', this.get('custom engine'))
    this.app.set('view engine', 'html')
    this.app.set('views', this.get('views'))

    // Add default middleware
    // @todo: Implement a session store model we can use to persist this
    // stuff! Check the express-middleware site for some talk on how to do this
    // (at the very end of the page)
    this.app.use(middleware.session({
      secret: this.get('cookie secret'),
      resave: true,
      saveUninitialized: true
    }))
    // @todo: don't use express-flash
    // I don't like how it adds things to locals for you :P
    this.app.use(middleware.flash())
    this.app.use(middleware.bodyParser.urlencoded({extended:false}))
    this.app.use(middleware.bodyParser.json())
    this.app.use(middleware.allowCrossDomain)
    this.app.use(middleware.isAdmin)

    // Setup passport
    this.app.use(auth.passport.initialize())
    this.app.use(auth.passport.session())

    if('function' === typeof this.get('storage'))
      this.get('storage')(this, this.app)

    // Register routes
    if('function' === typeof this.get('routes'))
      this.get('routes')(this, this.app)

    // Last-ditch error handlers
    this.app.use(errors.error404);
    this.app.use(errors.error500);

    this.httpServer = this.app.listen(
      this.get('port'),
      this.get('host')
    )
    this.httpServer.on('listening', this.logStartMessages.bind(this))
    
    return Promise.resolve()
  },

  run: function () {
    return this.db.connect(this.get('database'))
      .then(this.createServer())
      .then(function () {
        this.logger.logInfo('Server', 'listening on ' + this.get('host') + ':' + this.get('port'))
      }.bind(this)).catch(function (err) {
        console.error(err)
      })
  }

})


module.exports = Rabbit
