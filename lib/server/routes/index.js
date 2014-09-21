var frontend = require('./frontend');
var admin = require('./admin');
var api = require('./api');
var statics = require('./static');
var Handler = require('../core/handler');

// Routes
// ------
// All of Rabbit's routes.
var RouteHandler = Handler.extend({

  register: function (rabbit, next) {
    var app = rabbit.getApp() || this.app;
    var base = rabbit.config('baseUrl') || '/';
    var adminUrl = rabbit.config('adminUrl') || 'admin/'
    var apiUrl = rabbit.config('apiUrl') || 'api/' + rabbit.config('version') + '/';
    if (rabbit.config('env') == 'development')
      app.use(base, statics.development());
    else
      app.use(base, statics.production());
    app.use(base, frontend());
    app.use(base + adminUrl, admin());
    app.use(base + apiUrl, api());
    next();
  }

});

module.exports = RouteHandler;