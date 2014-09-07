var CustomError = require('./base');

// NotFoundError
// -------------
// Should be thrown when an item is not found (or a page
// does not exist).
var NotFoundError = CustomError.extend({

  constructor: function (message) {
    this.message = message;
    this.stack = new Error().stack;
    this.code = 404;
    this.type = this.name;
  },

  name: 'NotFoundError'

});

module.exports = NotFoundError;
