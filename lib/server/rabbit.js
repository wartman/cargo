var express = require('express');
var _ = require('lodash');
var swig = require('Swig');

var Base = require('./core/base');
var mixins = Base.mixins;
var middleware = require('./middleware');
var routes = require('./routes');

// Rabbit
// ------
// Runs the app
var Rabbit = module.exports = Base.extend({

  options: {
    port: '8080',
    baseDir: '',
    themesDir: 'public/themes',
    version: 'v0.0.1'
  },

  // Create a new instance of Rabbit.
  constructor: function (options) {
    this.options = _.defaults(options, this.options);

    // Server setup.
    this.server = express();

    // Add middleware
    // this.server.use(errors.ServerError);
    this.server.use(middleware.allowCrossDomain);
    // parse application/x-www-form-urlencoded
    this.server.use(middleware.bodyParser.urlencoded({extended: false}));
    // parse application/json
    this.server.use(middleware.bodyParser.json());
    
    // Set the template engine
    this.server.engine('html', swig.renderFile);
    this.server.set('view engine', 'html');
    this.server.set('views', this.options.baseDir + this.options.themesDir);

    // Use routes.
    this.server.use(routes.frontend());
    this.server.use('/admin/', routes.admin());
    this.server.use('/api/' + this.options.version + '/', routes.api());

  },

  // Run rabbit, run!
  run: function() {
    var self = this;
    this.server.listen(this.options.port, function () {
      console.log('Listening on ' + self.options.port);
    });
  }

})

// Allow Rabbit to be used as a singleton.
Rabbit.mixinStatic(mixins.singleton);