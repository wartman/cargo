var _ = require('lodash');
var Promise = require('bluebird');

var errorHelpers = {

  throwError: function (err) {
    if (!err) {
      err = new Error('An error occurred');
    }
    if (_.isString(err)) {
      throw new Error(err);
    }
    throw err;
  },

  // Return an error wrapped in a rejected promise.
  rejectError: function (err) {
    return Promise.reject(err);
  }

};

module.exports = errorHelpers;
