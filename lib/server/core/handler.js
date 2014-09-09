var _ = require('lodash');

var Base = require('./base').Base;
var mixins = require('./base').mixins;

// Handler
// -------
// Base class for middleware-plugins.
var Handler = Base.extend({

  getMiddlewareFunctions: function () {
    var middlewares = _.result(this, 'middlewares');
    return middlewares || [];
  },

  register: function (rabbit) {
    var self = this;
    var middlewares = this.getMiddlewareFunctions();
    var app = rabbit.getApp() || this.app;
    middlewares.forEach(function (middleware) {
      app.use(middleware.bind(self));
    });
  }

}, {

  register: function () {
    var self = this.getInstance();
    self.register.apply(self, arguments);
  }

});

Handler.mixinStatic(mixins.singleton);

module.exports = Handler;
