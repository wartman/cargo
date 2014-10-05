var frontend = require('./frontend');
var admin = require('./admin');
var api = require('./api');
var statics = require('./static');

// Register routes.
module.exports = function (rabbit, next) {
  var app = rabbit.getApp();
  var base = rabbit.config.get('baseUrl') || '/';
  var adminUrl = rabbit.config.get('adminUrl') || 'admin/'
  var apiUrl = rabbit.config.get('apiUrl') || 'api/' + rabbit.config.get('version') + '/';
  if (rabbit.config.get('env') == 'development')
    app.use(base, statics.development());
  else
    app.use(base, statics.production());
  app.use(base, frontend());
  app.use(base + adminUrl, admin());
  app.use(base + apiUrl, api());
  next();
};