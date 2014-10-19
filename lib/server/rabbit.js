var express = require('express');
var _ = require('lodash');
var chalk = require('chalk');
var Promise = require('bluebird');

var Base = require('./core/base').Base;
var mixins = require('./core/base').mixins;
var template = require('./template');
var errors = require('./errors');
var middleware = require('./middleware');
var routes = require('./routes');
var storage = require('./storage');
var dbSetup = require('./db/setup');
var packageInfo = require('../../package.json');
var Config = require('./config');

// Rabbit
// ------
// Runs the app
var Rabbit = Base.extend({

  VERSION: 'v' + packageInfo.version,

  options: function () {
    return {
      server: {
        port: '8080',
        host: 'localhost',
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

    // Setup application config.
    var defaults = _.result(this, 'options');
    this.config = Config.getInstance();
    this.config.set(_.defaults(options, defaults));
    if (!this.config.get('version')) this.config.set('version', this.VERSION);

    // Server setup.
    this.app = express();
    this.httpServer = null;
    this.connections = [];
    this.middleware = [];

    // Register middleware
    // todo: setup authorization middleware here.
    this.use(template);
    this.use(dbSetup);
    this.use(middleware);
    this.use(storage);
    this.use(routes);
    this.use(errors);
  },

  // Register middleware.
  //
  //    // syncronous:
  //    function (rabbit, next) {
  //      var app = rabbit.getApp();
  //      app.use(foo);
  //      next(); // load next middleware
  //    }
  //
  //    // async:
  //    function (rabbit, next) {
  //      somethingAsync(next);
  //    }
  //
  use: function (middleware) {
    var self = this;
    this.middleware.unshift(middleware);
  },

  // Iterate through middleware.
  registerMiddleware: function (done) {
    var self = this;
    var cur = this.middleware.pop();
    cur(this, function () {
      if (self.middleware.length) {
        self.registerMiddleware(done);
      } else {
        done();
      }
    })
  },

  // Get the config object
  getConfig: function () {
    return this.config;
  },

  // Get the current express application.
  getApp: function () {
    return this.app;
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
      chalk.yellow.bold('\nRabbit is running!'),
      chalk.grey('\n\nListening on:'),
      chalk.white.bold(this.config.get('server').host + ':' + this.config.get('server').port),
      chalk.grey('\nCtrl+C to shut down')
    );

    // ensure that Rabbit exits correctly on Ctrl+C
    process.removeAllListeners('SIGINT').on('SIGINT', function () {
      console.log(
        chalk.yellow.bold('\nRabbit has stopped running!')
      );
      process.exit(0);
    });
  },

  // More console alerts
  logShutdownMessages: function () {
    console.log(chalk.red('Rabbit is stopping...'));
  },

  // Run rabbit, run!
  run: function(externalApp) {
    // @todo: have different settings depending on if this
    // is production env.
    var self = this;
    var app = externalApp || self.app;
    self.app = app;

    console.log(chalk.yellow.bold('\nSetting up Rabbit...\n'));
    return self.registerMiddleware(function () {
      self.httpServer = app.listen(
        self.config.get('server').port,
        self.config.get('server').host
      );
      self.httpServer.on('listening', function () {
        self.logStartMessages();
        return Promise.resolve(self);
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

});

// Allow Rabbit to be used as a singleton.
Rabbit.mixinStatic(mixins.singleton);

module.exports = Rabbit;
