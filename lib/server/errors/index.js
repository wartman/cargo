var _ = require('lodash')

var NotFoundError = require('./notFoundError')
var NotAuthorizedError = require('./notAuthorizedError')
var InternalServerError = require('./internalServerError')

// Errors
// ------

// Format errors for JSON output
function  formatHttpErrorsJSON(error) {
  var statusCode = 500
  var errors = []

  if (!_.isArray(error))
    error = [].concat(error)

  _.each(error, function (errorItem) {
    var errorContent = {}

    // to do: logic to set correct code.
    statusCode = errorItem.code || 500

    errorContent.message = _.isString(errorItem)
      ? errorItem
      : (_.isObject(errorItem))
        ? errorItem.message
        : 'Unknown API error'

    errorContent.type = errorItem.type || 'Internal Server Error'
    errors.push(errorContent)
  })

  return {errors: errors, statusCode: statusCode}
}

function renderErrorPage(code, err, req, res, next) {
  // @todo: have actual template rendering. See how ghost does things:
  // https://github.com/TryGhost/Ghost/blob/master/core/server/errors/index.js

  // var self = this
  // var template = paths.resolve(config.get('paths').adminViews, 'user-error.html')

  // Just some temp stuff.
  res.status(code).send(err)
}

function error404(req, res, next) {
  var message = 'Page Not Found'
  // Do not cache errors.
  res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'})
  if (req.method === 'GET') {
    renderErrorPage(404, message, req, res, next)
  } else {
    res.status(404).send(message)
  }
}

// @todo: Actually display error info if this user has privileges.
function error500(req, res, next) {
  var message = 'Internal Server Error'
  // Do not cache errors.
  res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'})
  if (req.method === 'GET') {
    renderErrorPage(500, message, req, res, next)
  } else {
    res.status(500).send(message)
  }
}

module.exports.error404 = error404
module.exports.error500 = error500
module.exports.formatHttpErrorsJSON = formatHttpErrorsJSON
module.exports.NotFoundError = NotFoundError
module.exports.NotAuthorizedError = NotAuthorizedError
module.exports.InternalServerError = InternalServerError
