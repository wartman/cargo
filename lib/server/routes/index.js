var frontend = require('./frontend');
var admin = require('./admin');
var api = require('./api');
var statics = require('./static');

// Register routes.
module.exports = function (rabbit, app) {
  var base = rabbit.get('root url') || '/';
  var adminUrl = rabbit.get('admin url') || 'admin/'
  var apiUrl = rabbit.get('api url') || 'api/' + rabbit.get('version') + '/';
  console.log(base, adminUrl, apiUrl)
  if (rabbit.get('env') == 'development')
    app.use(base, statics.development());
  else
    app.use(base, statics.production());
  app.use(base, frontend());
  app.use(base + adminUrl, admin());
  app.use(base + apiUrl, api());
};