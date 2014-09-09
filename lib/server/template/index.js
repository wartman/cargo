var _ = require('lodash');
var swig = require('swig');

var Handler = require('../core/handler');

// Template
// --------
var TemplateHandler = Handler.extend({

  register: function (rabbit, next) {
    var app = rabbit.getApp() || this.app;
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', rabbit.config('baseDir') + rabbit.config('themesDir'));
    next();
  }

});

module.exports = TemplateHandler;
