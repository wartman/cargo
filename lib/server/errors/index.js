var _ = require('lodash');
var NotFoundError = require('./notFoundError');
var NotAuthorizedError = require('./notAuthorizedError');

// Errors
// ------
// Basic error handling.
var errors = {};

errors.renderErrorPage = function (code, err, req, res, next) {
  // @todo: have actual template rendering. See how ghost does things:
  // https://github.com/TryGhost/Ghost/blob/master/core/server/errors/index.js

  // var self = this;
  // var template = paths.resolve(config.get('paths').adminViews, 'user-error.html');

  // Just some temp stuff.
  res.status(code).send(err);

}.bind(errors);

errors.error404 = function (req, res, next) {
  var message = 'Page Not Found';
  // Do not cache errors.
  res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'});
  if (req.method === 'GET') {
    this.renderErrorPage(404, message, req, res, next);
  } else {
    res.status(404).send(message);
  }
}.bind(errors);

// @todo: Actually display error info if this user has privliages.
errors.error500 = function (req, res, next) {
  var message = 'Internal Server Error';
  // Do not cache errors.
  res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'});
  if (req.method === 'GET') {
    this.renderErrorPage(500, message, req, res, next);
  } else {
    res.status(500).send(message);
  }
}.bind(errors);

// @todo Logging, custom page rendering, and so forth.

module.exports = errors;
module.exports.NotFoundError = NotFoundError;
module.exports.NotAuthorizedError = NotAuthorizedError;