var Promise = require('bluebird');
var _ = require('lodash');

var Base = require('../core/base').Base;
var mixins = require('../core/base').mixins;
var errors = require('../errors');

// API
// ---
// BREAD methods for all models. 
var API = Base.extend({

  ModelClass: null,

  constructor: function () {
    // ?
  },

  defaultOptions: function () {
    return {
      context: {
        permission: false
      },
      allowedAttrs: ['id']
    }
  },

  filterOptions: function (options) {
    options = options || {};
    var proxy = _.defaults(options, _.result(this, 'defaultOptions'));
    var attrs = _.pick(proxy, proxy.allowedAttrs);
    var opts = _.omit(proxy, proxy.allowedAttrs);
    delete opts.allowedAttrs;
    return {
      attrs: attrs,
      options: opts
    };
  },

  browse: function (options) {
    var req = this.filterOptions(options);
    // check permisions and stuff here

    return this.ModelClass.findAll(req.attrs).then(function (collection) {
      if (collection) {
        var data = collection.toJSON();
        return {
          data: data
        };
      }

      return Promise.reject(new errors.NotFoundError());
    });
  },

  read: function (options) {
    var req = this.filterOptions(options);
    // check permisions and stuff here

    var model = new this.ModelClass(req.attrs);
    return model.fetch().then(function (model) {
      if (model) {
        // Ensure we always return an array of data.
        return {
          data: [ model.toJSON() ]
        };
      }

      return Promise.reject(new errors.NotFoundError());
    });
  },

  edit: function (options) {
    var req = this.filterOptions(options);
    // check permisions and stuff here!!!

    var model = new this.ModelClass(req.attrs);
    return model.save().then(function (model) {
      if (model) {
        return {
          data: [ model.toJSON() ]
        };
      }

      return Promise.reject(new errors.NotFoundError());
    });
  },

  add: function (options) {
    var req = this.filterOptions(options);
    // check permisions and stuff here!!!

    model = new this.ModelClass(req.attrs);
    return model.save().then(function (model) {
      if (model) {
        return {
          data: [ model.toJSON() ]
        };
      }

      return Promise.reject(new errors.NotFoundError());
    });
  },

  destroy: function (options) {
    var req = this.filterOptions(options);

    var model = new this.ModelClass(req.attrs);
    return model.destroy().then(function () {

    })
  }

}, {

  // Expose wrap a method for HTTP responses
  http: function (method) {
    var api = this.getInstance();
    if (api[method]) {
      var apiMethod = api[method].bind(api);
      return function wrappedApiMethod (req, res) {
        var options = _.extend({}, req.files, req.query, req.params, {
          context: { /* to do */ }
        });
        var response;
        return apiMethod(options)
          .then(function onSuccess(result) {
            response = result;
            return addHeaders(apiMethod, res, res, result);
          }).then(function () {
            // Ensure a JSON response.
            res.json(response || {});
          }).catch(function onError (err) {
            // @todo add logging
            // errors.logError(err);
            var httpErrors = formatHttpErrors(err);
            res.status(httpErrors.statusCode).json({meta: httpErrors});
          });
      };
    } else {
      return function (req, res) {
        var httpErrors = formatHttpErrors(new Error('Not API method of that name exists: ' + method));
        res.status(httpErrors.statusCode).json({meta: httpErrors});
      };
    }
  }

});

// Allow for singletons
API.mixinStatic(mixins.singleton);

// API Helpers
// -----------
// @todo: None of this is production ready. Obvs.

// var headers = {
//   // Calculate the header string for the X-Cache-Invalidate: header.
//   // This will invalidate any catched versions of the listed URIs
//   // Based on [ghost](https://github.com/TryGhost/Ghost/blob/master/core/server/api/index.js)
//   cacheInvalidation: function (req, result) {
//     var parsedUrl = req._parsedUrl.pathname.pathname.replace(/^\/|\/$/g, '').split('/');
//     var method = req.method;
//     var endpoint = parsedUrl[0];
//     var id = parsedUrl[1];
//     var cacheInvalidate;
//     var jsonResult = result.toJSON? result.toJSON() : result;

//     if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
//       if (endpoint === )
//     }
//   }
// }

// Ensure we have the correct headers on this thing.
var addHeaders = function (apiMethod, req, res, result) {
  // @todo
  // base on: https://github.com/TryGhost/Ghost/blob/master/core/server/api/index.js
  // For now, just pass this along.
  return Promise.resolve();
}

// Parse errors into JSON-friendly format.
var formatHttpErrors = function (error) {
  var statusCode = 500;
  var errors = [];

  if (!_.isArray(error))
    error = [].concat(error);

  _.each(error, function (errorItem) {
    var errorContent = {};

    // to do: logic to set correct code.
    statusCode = errorItem.code || 500;

    errorContent.message = _.isString(errorItem)
      ? errorItem
      : (_.isObject(errorItem))
        ? errorItem.message
        : 'Unknown API error';

    errorContent.type = errorItem.type || 'Internal Server Error';
    errors.push(errorContent);
  });

  return {errors: errors, statusCode: statusCode};
};

module.exports = API;
