var _ = require('lodash');
var swig = require('swig');

// Template
// --------
module.exports = function (rabbit, next) {
  var app = rabbit.getApp() || this.app;
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', rabbit.config.get('baseDir') + rabbit.config.get('themesDir'));
  next();
};
