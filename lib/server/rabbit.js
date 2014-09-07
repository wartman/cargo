var express = require('express');
var _ = require('lodash');
var swig = require('Swig');
var colors = require('colors');

var Base = require('./core/base').Base;
var mixins = require('./core/base').mixins;
var errors = require('./errors');
var middleware = require('./middleware');
var routes = require('./routes');

// Rabbit
// ------
// Runs the app
var Rabbit = module.exports = Base.extend({

  VERSION: 'v0.0.1',

  options: function () {
    return {
      port: '8080',
      baseDir: '',
      themesDir: 'public/themes'
    };
  },

  // Create a new instance of Rabbit.
  constructor: function (options) {
    this.options = _.defaults(options, _.result(this, 'options'));
    if (!this.options.version) this.options.version = this.VERSION;

    // Server setup.
    this.server = express();
    this.setupTemplateEngine();
    this.registerMiddleware();
  },

  setupTemplateEngine: function () {
    // Set the template engine
    // @todo: have a class to handle this?
    this.server.engine('html', swig.renderFile);
    this.server.set('view engine', 'html');
    this.server.set('views', this.options.baseDir + this.options.themesDir);
  },

  // Setup default middleware
  registerMiddleware: function () {
    // Favicon
    // requires serve-favicon
    // this.server.use(favicon('/both/favicon.ico'));

    // Static assets
    // @todo: this is just coppied from ghost for reference. Replace with your own stuff.
    // this.server.use(subdir + '/shared', express['static'](path.join(corePath, '/shared'), {maxAge: utils.ONE_HOUR_MS}));
    // this.server.use(subdir + '/content/images', storage.get_storage().serve());
    // this.server.use(subdir + '/ghost/scripts', express['static'](path.join(corePath, '/built/scripts'), {maxAge: utils.ONE_YEAR_MS}));
    // this.server.use(subdir + '/public', express['static'](path.join(corePath, '/built/public'), {maxAge: utils.ONE_YEAR_MS}));

    this.server.use('/lib/client', express['static']('lib/client'));
    this.server.use('/admin/lib/client', express['static']('lib/client'));

    // Add middleware
    this.server.use(middleware.allowCrossDomain);
    // parse application/x-www-form-urlencoded
    this.server.use(middleware.bodyParser.urlencoded({extended: false}));
    // parse application/json
    this.server.use(middleware.bodyParser.json());
    
    // todo: setup authorization middleware here.

    // Routing
    this.server.use(routes.frontend());
    this.server.use('/admin/', routes.admin());
    this.server.use('/api/' + this.options.version + '/', routes.api());

    // Error handling
    this.server.use(errors.error404);
    this.server.use(errors.error500);
  },

  // Run rabbit, run!
  run: function() {
    // @todo: have different settings depending on if this
    // is production env.
    var self = this;
    this.server.listen(this.options.port, function () {
      console.log(
        '\nRabbit is running!'.green,
        '\n\nListening on:'.grey,
        self.options.port,
        '\nCtrl+C to shut down'.grey
      );
    });

    // ensure that Rabbit exits correctly on Ctrl+C
    process.removeAllListeners('SIGINT').on('SIGINT', function () {
      console.log(
        '\nRabbit has stopped running!'.grey
      );
      process.exit(0);
    });
  }

})

// Allow Rabbit to be used as a singleton.
Rabbit.mixinStatic(mixins.singleton);