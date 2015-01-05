var _ = require('lodash')
var Promise = require('bluebird')
var util = require('./util')
// var View = require('./view')

// Simple error helpers
var helpers = {

  throwError: function (err) {
    if (!err) {
      err = new Error('An error occurred')
    }
    if (_.isString(err)) {
      throw new Error(err)
    }
    throw err
  },

  // Return an error wrapped in a rejected promise.
  rejectError: function (err) {
    return Promise.reject(err)
  },

  // Format errors for JSON output
  formatErrorForJSON: function (error) {
    var statusCode = 500
    var errors = []
    error = (!_.isArray(error))
      ? [].concat(error) 
      : error
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
}

function _renderErrorPage(code, err, req, res, next) {
  // @todo: have actual template rendering. See how ghost does things:
  // https://github.com/TryGhost/Ghost/blob/master/core/server/errors/index.js

  // var template = paths.resolve(__dirname, './core/templates/user-error.html')
  // var view = new View(req, res)
  // view.res.status(code)
  // view.render(template, {error: err})

  // Just some temp stuff.
  res.status(code).send(err)
}

// Error Middleware
var middleware = {

  error404: function (req, res, next) {
    var message = 'Page Not Found'
    // Do not cache errors.
    res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'})
    if (req.method === 'GET') {
      _renderErrorPage(404, message, req, res, next)
    } else {
      res.status(404).send(message)
    }
  },

  // @todo: Actually display error info if this user has privileges.
  error500: function (req, res, next) {
    var message = 'Internal Server Error'
    // Do not cache errors.
    res.set({'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'})
    if (req.method === 'GET') {
      _renderErrorPage(500, message, req, res, next)
    } else {
      res.status(500).send(message)
    }
  }

}

// Custom errors
var imports = util.createImporter(__dirname)
var errors = imports('./errors')
_.each(errors, function (ErrorClass, name) {
  exports[util.capitalize(name.trim())] = ErrorClass
})

exports.helpers = helpers
exports.middleware = middleware
