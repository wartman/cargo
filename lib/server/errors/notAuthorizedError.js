var CustomError = require('./base');

// NotAuthorizedError
// ------------------
// Thrown if a used tries to do something they do not
// have sufficent permissions for.
var NotAuthorizedError = CustomError.extend({

  constructor: function (message) {
    this.message = message;
    this.stack = new Error().stack;
    this.code = 403;
    this.type = this.name;
  },

  name: 'NotAuthorizedError'

});

module.exports = NotAuthorizedError;