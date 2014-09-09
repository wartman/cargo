var express = require('express');
var _ = require('lodash');
var colors = require('colors');
var Promise = require('bluebird');

var Base = require('./core/base').Base;
var mixins = require('./core/base').mixins;
var TemplateHandler = require('./template');
var ErrorHandler = require('./errors');
var MiddlewareHandler = require('./middleware');
var RouteHandler = require('./routes');
var packageInfo = require('../../package.json');
var config = require('../../config');

// Rabbit
// ------
// Runs the app
var Rabbit = module.exports = Base.extend({

  VERSION: 'v' + packageInfo.version,

  options: function () {
    return {
      server: {
        port: '8080',
        host: 'localhost',
      },
      paths: {
        // todo
      },
      baseDir: '',
      themesDir: 'public/themes'
    };
  },

  // Create a new instance of Rabbit.
  constructor: function (options) {
    if (!(this instanceof Rabbit)){
      return new Rabbit(options);
    }

    var defaultOptions = _.extend(config, _.result(this, 'options'));
    this.options = _.defaults(options, defaultOptions);
    if (!this.options.version) this.options.version = this.VERSION;

    // Server setup.
    this.app = express();
    this.httpServer = null;
    this.connections = [];
  },

  // Simple getter/setter for config options.
  config: function (key, value) {
    if (value) {
      this.options[key] = value;
    }
    return this.options[key] || false;
  },

  // Get the config object
  getConfig: function () {
    return this.options;
  },

  // Get the current express application.
  getApp: function () {
    return this.app;
  },

  // Setup default middleware
  registerMiddleware: function () {
    // Favicon
    // requires serve-favicon
    // this.app.use(favicon('/both/favicon.ico'));

    // Static assets
    // @todo: this is just coppied from ghost for reference. Replace with your own stuff.
    // this.app.use(subdir + '/shared', express['static'](path.join(corePath, '/shared'), {maxAge: utils.ONE_HOUR_MS}));
    // this.app.use(subdir + '/content/images', storage.get_storage().serve());
    // this.app.use(subdir + '/ghost/scripts', express['static'](path.join(corePath, '/built/scripts'), {maxAge: utils.ONE_YEAR_MS}));
    // this.app.use(subdir + '/public', express['static'](path.join(corePath, '/built/public'), {maxAge: utils.ONE_YEAR_MS}));

    this.app.use('/lib/client', express['static']('lib/client'));
    this.app.use('/admin/lib/client', express['static']('lib/client'));

    
    // todo: setup authorization middleware here.

    TemplateHandler.register(this);
    MiddlewareHandler.register(this);
    RouteHandler.register(this);
    ErrorHandler.register(this);
  },

  // Store a connection
  addConnection: function (socket) {
    this.connections.push(socket);
  },

  // Copied from Ghost:
  // Most browsers keep a persistent connection open to the server
  // which prevents the close callback of httpServer from returning
  // We need to destroy all connections manually
  closeConnections: function () {
    this.connections.forEach(function (socket) {
      socket.destroy();
    });
  },

  // Just some stuff to show in the console
  logStartMessages: function () {
    console.log(
      '\nRabbit is running!'.green,
      '\n\nListening on:'.grey,
      this.config('server').host + ':' + this.config('server').port,
      '\nCtrl+C to shut down'.grey
    );

    // ensure that Rabbit exits correctly on Ctrl+C
    process.removeAllListeners('SIGINT').on('SIGINT', function () {
      console.log(
        '\nRabbit has stopped running!'.grey
      );
      process.exit(0);
    });
  },

  // More console alerts
  logShutdownMessages: function () {
    console.log('Rabbit is stopping...'.red);
  },

  firstRun: function () {
    // should install the DB if none is found.
    // Look into a way to do this securely.
  },

  // Run rabbit, run!
  run: function(externalApp) {
    // @todo: have different settings depending on if this
    // is production env.
    var self = this;
    var app = externalApp || self.app;
    self.app = app;

    return new Promise(function (res, rej) {
      self.registerMiddleware();

      self.httpServer = app.listen(
        self.config('server').port,
        self.config('server').host
      );

      self.httpServer.on('listening', function () {
        self.logStartMessages();
        res(self);
      });

    });
  },

  // Stop running, rabbit!
  stop: function () {
    var self = this;
    return new Promise(function (res) {
      if (self.httpServer === null) {
        res(self);
      } else {
        self.httpServer.close(function () {
          self.httpServer = null;
          self.logStopMessages();
          res(self);
        });
        self.closeConnections();
      }
    });
  },

  // Restart the application
  restart: function () {
    return this.stop().then(this.start.bind(this));
  }

})

// Allow Rabbit to be used as a singleton.
Rabbit.mixinStatic(mixins.singleton);