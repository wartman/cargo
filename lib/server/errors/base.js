var Base = require('../core/base').Base;

// CustomError
// -----------
// An extendable error that allows for customized
// error handling. Like the name may suggest.
var CustomError = Base.extend({

  constructor: function (message) {
    this.message = message
  },

  name: 'CustomError'

});

CustomError.mixin(Error.prototype);

module.exports = CustomError;
