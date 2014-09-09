var _ = require('lodash');
var Promise = require('bluebird');

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

  register: function (rabbit, next, error) {
    var self = this;
    var middlewares = this.getMiddlewareFunctions();
    var app = rabbit.getApp() || this.app;
    middlewares.forEach(function (middleware) {
      app.use(middleware.bind(self));
    });
    next();
  }

}, {

  register: function (rabbit) {
    var self = this.getInstance();
    return new Promise(function (res, rej) {
      self.register(rabbit, res, rej);
    });
  }

});

Handler.mixinStatic(mixins.singleton);

module.exports = Handler;
