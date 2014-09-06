var Promise = require('bluebird');
var _ = require('lodash');

var Base = require('../core/base');
var mixins = Base.mixins;

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
    return _.defaults(options, _.result(this, 'defaultOptions'));
  },

  browse: function (options) {
    options = this.filterOptions(options);
    var attrs = _.pick(options, options.allowedAttrs);
    options = _.omit(options, options.allowedAttrs);
    console.log(attrs);
    // check permisions and stuff here
    return this.ModelClass.findAll(attrs).then(function (collection) {
      if (collection) {
        var data = collection.toJSON();
        return {
          data: data
        };
      }

      //return Promise.reject(new errors.NotFoundError());
      return Promise.reject({meta: {error: {message: 'not found' }}});
    });
  },

  read: function (options) {
    options = this.filterOptions(options);
    var attrs = _.pick(options, options.allowedAttrs);
    options = _.omit(options, options.allowedAttrs);
    console.log(options, attrs);
    // check permisions and stuff here
    var model = new this.ModelClass(attrs);
    return model.fetch().then(function (model) {
      if (model) {
        // Ensure we always return an array of data.
        return {
          data: [ model.toJSON() ]
        };
      }

      //return Promise.reject(new errors.NotFoundError());
      return Promise.reject({meta: {error: {message: 'not found' }}});
    });
  },

  edit: function (options) {
    options = this.filterOptions(options);
    var attrs = _.pick(options, options.allowedAttrs);
    options = _.omit(options, options.allowedAttrs);
    // check permisions and stuff here!!!

    var model = new this.ModelClass(attrs);
    return model.save().then(function (model) {
      if (model) {
        return {
          data: [ model.toJSON() ]
        };
      }

      //return Promise.reject(new errors.NotFoundError());
      return Promise.reject({meta: {error: {message: 'not found' }}});
    });
  },

  add: function (options) {
    options = this.filterOptions(options);
    var attrs = _.pick(options, options.allowedAttrs);
    options = _.omit(options, options.allowedAttrs);
    // check permisions and stuff here!!!

    model = new this.ModelClass(attrs);
    return model.save().then(function (model) {
      if (model) {
        return {
          data: [ model.toJSON() ]
        };
      }

      //return Promise.reject(new errors.NotFoundError());
      return Promise.reject({meta: {error: {message: 'not found' }}});
    });
  },

  destroy: function (options) {
    options = this.filterOptions(options);
    var attrs = _.pick(options, options.allowedAttrs);
    options = _.omit(options, options.allowedAttrs);

    var model = new this.ModelClass(attrs);
    return model.destroy().then(function () {

    })
  }

})

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

// var formatHttpErrors = function (err) {
//   return {errors: err};
// }

// A decorator for HTTP requests (used in routes) that always returns sensable
// JSON responses.
var http = function (apiMethod, ctx) {
  if (ctx) apiMethod = apiMethod.bind(ctx);
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
        // var httpErrors = formatHttpErrors(err);
        // res.status(httpErrors.statusCode).json({errors: httpErrors.errors});
        res.json({error: err.message});
      });
  }
};

// Do exports
module.exports = API;
module.exports.http = http;