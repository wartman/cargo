var _ = require('lodash');

var Handler = require('../core/handler');
var NotFoundError = require('./notFoundError');
var NotAuthorizedError = require('./notAuthorizedError');

// Errors
// ------
// Basic error handling.
var ErrorHandler = Handler.extend({

  renderErrorPage: function (code, err, req, res, next) {
    // @todo: have actual template rendering. See how ghost does things:
    // https://github.com/TryGhost/Ghost/blob/master/core/server/errors/index.js

    // var self = this;
    // var template = paths.resolve(config.get('paths').adminViews, 'user-error.html');

    // Just some temp stuff.
    res.status(code).send(err);
  },

  error404: function (req, res, next) {
    var message = 'Page Not Found';
    // Do not cache errors.
    res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'});
    if (req.method === 'GET') {
      this.renderErrorPage(404, message, req, res, next);
    } else {
      res.status(404).send(message);
    }
  },

  // @todo: Actually display error info if this user has privileges.
  error500: function (req, res, next) {
    var message = 'Internal Server Error';
    // Do not cache errors.
    res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'});
    if (req.method === 'GET') {
      this.renderErrorPage(500, message, req, res, next);
    } else {
      res.status(500).send(message);
    }
  },

  getMiddlewareFunctions: function () {
    return [
      this.error404,
      this.error500
    ];
  }

});

module.exports = ErrorHandler;
module.exports.NotFoundError = NotFoundError;
module.exports.NotAuthorizedError = NotAuthorizedError;